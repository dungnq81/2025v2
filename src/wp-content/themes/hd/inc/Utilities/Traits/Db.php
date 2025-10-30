<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Db {
	private static array $schema_cache = [];

	// --------------------------------------------------

	/**
	 * @param string $identifier
	 *
	 * @return string
	 */
	private static function sanitize_identifier( string $identifier ): string {
		// EA suggestion: use \W for shorthand of [^A-Za-z0-9_]
		return (string) preg_replace( '/\W/', '', $identifier );
	}

	// --------------------------------------------------

	/**
	 * @param string $table
	 *
	 * @return string
	 */
	private static function table_name_full( string $table ): string {
		global $wpdb;
		$table = self::sanitize_identifier( $table );

		return "{$wpdb->prefix}{$table}";
	}

	// --------------------------------------------------

	/**
	 * @param string $table
	 *
	 * @return string
	 */
	private static function backticked_table( string $table ): string {
		return '`' . self::table_name_full( $table ) . '`';
	}

	// --------------------------------------------------

	/**
	 * @param string $column
	 *
	 * @return string
	 */
	private static function backticked_column( string $column ): string {
		$column = self::sanitize_identifier( $column );

		return "`{$column}`";
	}

	// --------------------------------------------------

	/**
	 * Return array of column names for a table or WP_Error on failure.
	 *
	 * @param string $table_name Short table name (without prefix)
	 *
	 * @return array|\WP_Error
	 */
	public static function get_table_columns( string $table_name ): \WP_Error|array {
		global $wpdb;

		$cache_key = self::table_name_full( $table_name );
		if ( isset( self::$schema_cache[ $cache_key ] ) ) {
			return self::$schema_cache[ $cache_key ];
		}

		$table = self::backticked_table( $table_name );

		// Use SHOW COLUMNS for better portability
		$rows = $wpdb->get_results( "SHOW COLUMNS FROM {$table}", ARRAY_A );
		if ( $rows === null ) {
			return new \WP_Error( 'db_describe_failed', $wpdb->last_error ?: 'Failed to describe table.' );
		}

		$cols = array_map( static function ( $r ) {
			return $r['Field'] ?? '';
		}, $rows );

		self::$schema_cache[ $cache_key ] = $cols;

		return $cols;
	}

	// --------------------------------------------------

	/**
	 * Begin a transaction. Returns WP_Error on failure or true.
	 *
	 * @return bool|\WP_Error
	 */
	public static function begin_transaction(): \WP_Error|bool {
		global $wpdb;

		$res = $wpdb->query( 'START TRANSACTION' );
		if ( $res === false ) {
			return new \WP_Error( 'transaction_start_failed', $wpdb->last_error ?: 'Failed to start transaction' );
		}

		return true;
	}

	// --------------------------------------------------

	/**
	 * @return bool|\WP_Error
	 */
	public static function commit_transaction(): bool|\WP_Error {
		global $wpdb;

		$res = $wpdb->query( 'COMMIT' );
		if ( $res === false ) {
			return new \WP_Error( 'transaction_commit_failed', $wpdb->last_error ?: 'Failed to commit transaction' );
		}

		return true;
	}

	// --------------------------------------------------

	/**
	 * @return bool|\WP_Error
	 */
	public static function rollback_transaction(): bool|\WP_Error {
		global $wpdb;

		$res = $wpdb->query( 'ROLLBACK' );
		if ( $res === false ) {
			return new \WP_Error( 'transaction_rollback_failed', $wpdb->last_error ?: 'Failed to rollback transaction' );
		}

		return true;
	}

	// --------------------------------------------------

	/**
	 * Helper to run a callback inside a transaction. If callback returns WP_Error or throws,
	 * rollback and return WP_Error. Otherwise, commit and return callback result.
	 *
	 * Usage:
	 *  Db::transaction( function() use ($rows) { ... return true; } );
	 *
	 * @param callable $callback
	 *
	 * @return mixed|\WP_Error
	 */
	public static function transaction( callable $callback ): mixed {
		$begin = self::begin_transaction();
		if ( is_wp_error( $begin ) ) {
			return $begin;
		}

		try {
			$result = $callback();

			if ( is_wp_error( $result ) ) {
				self::rollback_transaction();

				return $result;
			}

			$commit = self::commit_transaction();
			if ( is_wp_error( $commit ) ) {
				return $commit;
			}

			return $result;
		} catch ( \Throwable $e ) {
			// Attempt rollback and return error with exception info
			self::rollback_transaction();

			return new \WP_Error( 'transaction_exception', $e->getMessage(), [ 'exception' => $e ] );
		}
	}

	// --------------------------------------------------

	/**
	 * Insert a single row into a table.
	 *
	 * @param string $table_name short table name (no prefix)
	 * @param array $data associative column => value
	 * @param array|null $format optional formats for $wpdb->insert
	 *
	 * @return int|\WP_Error Insert ID on success or WP_Error on failure
	 */
	public static function insert_one_row( string $table_name, array $data, ?array $format = null ): \WP_Error|int {
		global $wpdb;

		if ( empty( $data ) ) {
			return new \WP_Error( 'no_data', 'No data provided.' );
		}

		$cols = self::get_table_columns( $table_name );
		if ( is_wp_error( $cols ) ) {
			return $cols;
		}

		// Filter incoming data to only valid columns
		$valid = array_intersect_key( $data, array_flip( $cols ) );
		if ( empty( $valid ) ) {
			return new \WP_Error( 'no_valid_columns', 'No valid columns provided for insertion.' );
		}

		$table  = self::table_name_full( $table_name );
		$result = $wpdb->insert( $table, $valid, $format ?? array_fill( 0, count( $valid ), '%s' ) );

		if ( $result === false ) {
			return new \WP_Error( 'insert_failed', $wpdb->last_error, [ 'query' => $wpdb->last_query ] );
		}

		return (int) $wpdb->insert_id;
	}

	// --------------------------------------------------

	/**
	 * Bulk insert rows.
	 *
	 * @param string $table
	 * @param array $rows array of associative arrays (all rows should share same keys)
	 * @param int $batch_size
	 *
	 * @return int|\WP_Error Number of inserted rows on success or WP_Error on failure
	 */
	public static function bulk_insert_rows( string $table, array $rows, int $batch_size = 500 ): \WP_Error|int {
		global $wpdb;

		if ( empty( $rows ) ) {
			return 0;
		}

		// Include only valid columns
		$valid_columns = self::get_table_columns( $table );
		if ( is_wp_error( $valid_columns ) ) {
			return $valid_columns;
		}

		// Normalize the first row for column ordering
		$columns = array_keys( (array) array_intersect_key( reset( $rows ), $valid_columns ) );
		if ( empty( $columns ) ) {
			return new \WP_Error( 'no_valid_columns', 'No valid columns detected for bulk insert.' );
		}

		$table          = self::backticked_table( $table );
		$column_list    = implode( ', ', array_map( [ __CLASS__, 'backticked_column' ], $columns ) );
		$total_inserted = 0;
		$batches        = array_chunk( $rows, $batch_size );

		self::begin_transaction();

		try {
			foreach ( $batches as $batch ) {

				$placeholders = [];
				$values       = [];

				foreach ( $batch as $row ) {
					$row_clean = [];

					foreach ( $columns as $col ) {
						$row_clean[] = $row[ $col ] ?? null;
					}

					$row_ph = [];

					foreach ( $row_clean as $v ) {
						if ( $v === null ) {
							$row_ph[] = 'NULL';
						} else {
							$row_ph[] = '%s';
							$values[] = (string) $v;
						}
					}

					$placeholders[] = '(' . implode( ', ', $row_ph ) . ')';
				}

				if ( empty( $placeholders ) ) {
					continue;
				}

				$sql      = "INSERT INTO {$table} ({$column_list}) VALUES " . implode( ', ', $placeholders );
				$prepared = ! empty( $values ) ? $wpdb->prepare( $sql, $values ) : $sql;
				$result   = $wpdb->query( $prepared );

				if ( $result === false ) {
					throw new \RuntimeException( $wpdb->last_error ?: 'Database insert failed.' );
				}

				$total_inserted += $result;
			}

			self::commit_transaction();

			return $total_inserted;
		} catch ( \Throwable $e ) {
			self::rollback_transaction();

			return new \WP_Error( 'bulk_insert_failed', $e->getMessage() );
		}
	}

	// --------------------------------------------------

	/**
	 * Update one row by primary key (default 'id')
	 *
	 * @param string $table_name
	 * @param int|string $id
	 * @param array $data
	 * @param string $primary_key
	 * @param array|null $format
	 *
	 * @return int|\WP_Error Number of rows updated or WP_Error
	 */
	public static function update_one_row( string $table_name, int|string $id, array $data, string $primary_key = 'id', ?array $format = null ): \WP_Error|int {
		global $wpdb;

		if ( empty( $data ) ) {
			return new \WP_Error( 'no_data', 'No data provided for update.' );
		}

		$cols = self::get_table_columns( $table_name );
		if ( is_wp_error( $cols ) ) {
			return $cols;
		}

		$valid = array_intersect_key( $data, array_flip( $cols ) );
		if ( empty( $valid ) ) {
			return new \WP_Error( 'no_valid_columns', 'No valid columns provided for update.' );
		}

		$table = self::table_name_full( $table_name );

		$result = $wpdb->update(
			$table,
			$valid,
			[ $primary_key => $id ],
			$format ?? array_fill( 0, count( $valid ), '%s' ),
			[ '%s' ] // primary key format (string safe); callers can pass int by casting
		);

		if ( $result === false ) {
			return new \WP_Error( 'update_failed', $wpdb->last_error, [ 'query' => $wpdb->last_query ] );
		}

		return (int) $result;
	}

	// --------------------------------------------------

	/**
	 * Delete one row by primary key (default 'id')
	 *
	 * @param string $table_name
	 * @param int|string $id
	 * @param string $primary_key
	 *
	 * @return int|\WP_Error Number of rows deleted or WP_Error
	 */
	public static function delete_one_row( string $table_name, int|string $id, string $primary_key = 'id' ): \WP_Error|int {
		global $wpdb;

		$table  = self::table_name_full( $table_name );
		$result = $wpdb->delete( $table, [ $primary_key => $id ], [ '%s' ] );

		if ( $result === false ) {
			return new \WP_Error( 'delete_failed', $wpdb->last_error, [ 'query' => $wpdb->last_query ] );
		}

		return (int) $result;
	}

	// --------------------------------------------------

	/**
	 * Get multiple rows with optional filter array, paging and ordering.
	 *
	 * @param string $table_name
	 * @param array $where associative col => value (ANDed)
	 * @param int $page 1-based page
	 * @param int $per_page
	 * @param string $order_by
	 * @param string $order
	 *
	 * @return array|\WP_Error
	 */
	public static function get_rows( string $table_name, array $where = [], int $page = 1, int $per_page = 20, string $order_by = 'id', string $order = 'ASC' ): \WP_Error|array {
		global $wpdb;

		$cols = self::get_table_columns( $table_name );
		if ( is_wp_error( $cols ) ) {
			return $cols;
		}

		// Validate order_by against actual columns
		$order_by = self::sanitize_identifier( $order_by );
		if ( ! in_array( $order_by, $cols, true ) ) {
			$order_by = 'id';
		}

		$order = strtoupper( $order );
		$order = in_array( $order, [ 'ASC', 'DESC' ], true ) ? $order : 'ASC';

		$table = self::backticked_table( $table_name );

		// Build WHERE
		$where_clauses = [];
		$values        = [];
		foreach ( $where as $col => $val ) {
			$col = self::sanitize_identifier( (string) $col );
			if ( in_array( $col, $cols, true ) ) {
				$where_clauses[] = self::backticked_column( $col ) . ' = %s';
				$values[]        = (string) $val;
			}
		}
		$where_sql = '';
		if ( ! empty( $where_clauses ) ) {
			$where_sql = ' WHERE ' . implode( ' AND ', $where_clauses );
		}

		$offset       = max( 0, ( $page - 1 ) * $per_page );
		$limit_clause = ' LIMIT %d, %d';
		$values[]     = $offset;
		$values[]     = $per_page;

		$sql      = "SELECT * FROM {$table}{$where_sql} ORDER BY " . self::backticked_column( $order_by ) . " {$order}" . $limit_clause;
		$prepared = $wpdb->prepare( $sql, $values );

		if ( $prepared === null ) {
			return new \WP_Error( 'prepare_failed', 'Failed to prepare select query.' );
		}

		$rows = $wpdb->get_results( $prepared, ARRAY_A );
		if ( $rows === null ) {
			return new \WP_Error( 'select_failed', $wpdb->last_error, [ 'query' => $wpdb->last_query ] );
		}

		return $rows;
	}

	// --------------------------------------------------

	/**
	 * @param string|null $table_name
	 *
	 * @return void
	 */
	public static function clear_schema_cache( ?string $table_name = null ): void {
		if ( $table_name === null ) {
			self::$schema_cache = [];

			return;
		}

		$key = self::table_name_full( $table_name );
		unset( self::$schema_cache[ $key ] );
	}

	// --------------------------------------------------
}
