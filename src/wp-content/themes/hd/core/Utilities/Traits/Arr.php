<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Arr {
    // --------------------------------------------------

    /**
     * Convert a separated string into a trimmed, filtered array.
     *
     * @param string|null $string
     * @param string $separator
     *
     * @return array
     */
    public static function separatedToArray( ?string $string, string $separator = ',' ): array {
        if ( $string === null || trim( $string ) === '' ) {
            return [];
        }

        $parts = explode( $separator, $string );
        $parts = array_map( 'trim', $parts );

        // Remove empty strings
        return array_values( array_filter( $parts, static function ( $v ) {
            return $v !== '';
        } ) );
    }

    // --------------------------------------------------

    /**
     * Compare two arrays disregarding order of values (works for flat arrays).
     *
     * @param array $arr1
     * @param array $arr2
     *
     * @return bool
     */
    public static function compare( array $arr1, array $arr2 ): bool {
        if ( count( $arr1 ) !== count( $arr2 ) ) {
            return false;
        }

        // Work on copies so original arrays are not mutated.
        $a = $arr1;
        $b = $arr2;

        sort( $a );
        sort( $b );

        return $a === $b;
    }

    // --------------------------------------------------

    /**
     * Convert a scalar (comma-separated string by default) or array into a filtered re-indexed array.
     *
     * @param mixed $value
     * @param callable|null $callback
     * @param string $separator
     *
     * @return array
     */
    public static function convertFromString( mixed $value, callable|null $callback = null, string $separator = ',' ): array {
        // Scalar (string/int/float/bool)
        if ( is_scalar( $value ) ) {
            $value = (string) $value;
            if ( trim( $value ) === '' ) {
                return [];
            }

            $value = array_map( 'trim', explode( $separator, $value ) );
        }

        // Ensure array
        $arr = (array) $value;

        // If callback provided and callable, use it; otherwise remove null/empty string by default
        if ( $callback !== null && is_callable( $callback ) ) {
            $arr = array_filter( $arr, $callback );
        } else {
            $arr = array_filter( $arr, static function ( $v ) {
                // remove empty strings but allow "0"
                return ! ( $v === '' || $v === null );
            } );
        }

        return self::reIndex( $arr );
    }

    // --------------------------------------------------

    /**
     * Reindex array values if the array is an indexed list (no associative keys) and flat.
     * Otherwise, return as-is.
     *
     * @param mixed $array
     *
     * @return array
     */
    public static function reIndex( mixed $array ): array {
        if ( ! is_array( $array ) ) {
            return (array) $array;
        }

        // If flat (no nested arrays) and is list-like -> reindex
        return self::isIndexedAndFlat( $array ) ? array_values( $array ) : $array;
    }

    // --------------------------------------------------

    /**
     * Check whether array is a flat, indexed list (no nested arrays, numeric keys that form a list).
     *
     * @param mixed $array
     *
     * @return bool
     */
    public static function isIndexedAndFlat( mixed $array ): bool {
        if ( ! is_array( $array ) ) {
            return false;
        }

        // If any element is an array, it's not flat
        foreach ( $array as $v ) {
            if ( is_array( $v ) ) {
                return false;
            }
        }

        // Prefer WP helper if available (backwards-compat)
        if ( function_exists( 'wp_is_numeric_array' ) ) {
            return wp_is_numeric_array( $array );
        }

        // PHP 8.1+: array_is_list tells if keys are 0..n-1
        if ( function_exists( 'array_is_list' ) ) {
            return array_is_list( $array );
        }

        // Fallback: check keys are consecutive ints starting from 0
        $keys     = array_keys( $array );
        $expected = range( 0, count( $keys ) - 1 );

        return $keys === $expected;
    }

    // --------------------------------------------------

    /**
     * Insert $insert_array before a given key (or append if key null/not found)
     *
     * @param string|null $key
     * @param array $array
     * @param array $insert_array
     *
     * @return array
     */
    public static function insertAfter( ?string $key, array $array, array $insert_array ): array {
        return self::insert( $array, $insert_array, $key, 'after' );
    }

    // --------------------------------------------------

    /**
     * Insert $insert_array after a given key (or append if key null/not found)
     *
     * @param string|null $key
     * @param array $array
     * @param array $insert_array
     *
     * @return array
     */
    public static function insertBefore( ?string $key, array $array, array $insert_array ): array {
        return self::insert( $array, $insert_array, $key, 'before' );
    }

    // --------------------------------------------------

    /**
     * Insert an array before/after a specific key. If key is null or not found, append.
     *
     * Note: preserves keys from $insert_array.
     *
     * @param array $array
     * @param array $insert_array
     * @param string|null $key
     * @param string $position 'before'|'after'
     *
     * @return array
     */
    public static function insert( array $array, array $insert_array, ?string $key, string $position = 'before' ): array {
        // If no key specified -> merge at end (preserve numeric index behavior)
        if ( $key === null ) {
            // preserve keys from insert_array; if numeric, they will be reindex by array_merge
            return array_merge( $array, $insert_array );
        }

        $keys = array_keys( $array );
        $pos  = array_search( $key, $keys, true );

        // Key not found -> append
        if ( $pos === false ) {
            return array_merge( $array, $insert_array );
        }

        if ( $position === 'after' ) {
            $pos ++;
        }

        $left  = array_slice( $array, 0, $pos, true );
        $right = array_slice( $array, $pos, null, true );

        return $left + $insert_array + $right;
    }

    // --------------------------------------------------

    /**
     * Prepend a value to an array. If $key provided, the new key/value will override existing key.
     *
     * @param array $array
     * @param mixed $value
     * @param int|string|null $key
     *
     * @return array
     */
    public static function prepend( array $array, mixed $value, int|string|null $key = null ): array {
        if ( $key !== null ) {
            // array_merge will let the left operand override keys in the right operand
            return array_merge( [ $key => $value ], $array );
        }

        // For numeric arrays, use array_unshift but preserve keys behavior by reindexing
        array_unshift( $array, $value );

        // Reindex to keep consistency for indexed lists
        return array_values( $array );
    }
}
