<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait DateTime {
	// -------------------------------------------------------------

	/**
	 * @param int|string $time_string
	 *
	 * @return bool
	 * @throws \Exception
	 */
	public static function isFutureTime( int|string $time_string ): bool {
		$ts = self::convertDatetimeFormat( $time_string, 'U' );
		if ( $ts === false ) {
			return false;
		}

		$current = current_time( 'U', 0 );

		return (int) $ts > $current;
	}

	// -------------------------------------------------------------

	/**
	 * Humanizes the time difference between two timestamps.
	 *
	 * @param mixed $post Optional. The post-ID to get the time from. Default is null.
	 * @param false|int|string $from Optional. The starting timestamp. Default is null.
	 * @param false|int|string $to Optional. The ending timestamp. Default is current time.
	 *
	 * @return string The human-readable time difference.
	 */
	public static function humanizeTime( mixed $post = null, false|int|string $from = false, false|int|string $to = false ): string {
		if ( empty( $to ) ) {
			$to = current_time( 'U', 0 );
		}

		if ( empty( $from ) && $post ) {
			$from = get_the_time( 'U', $post );
		}

		// If $from is still empty, return an empty string or handle accordingly
		if ( empty( $from ) ) {
			return '';
		}

		//return human_time_diff( $from, $to );
		return sprintf( __( '%s trước', TEXT_DOMAIN ), human_time_diff( $from, $to ) );
	}

	// --------------------------------------------------

	/**
	 * Calculates the ISO 8601 duration between two date-time strings.
	 *
	 * @param string $date_time_1
	 * @param string $date_time_2
	 *
	 * @return string
	 * @throws \Exception
	 */
	public static function isoDuration( string $date_time_1, string $date_time_2 ): string {
		$dt1 = new \DateTimeImmutable( $date_time_1 );
		$dt2 = new \DateTimeImmutable( $date_time_2 );

		$interval = $dt1->diff( $dt2 );

		// total zero duration
		if ( $interval->days === 0
		     && $interval->h === 0
		     && $interval->i === 0
		     && $interval->s === 0
		     && $interval->y === 0
		     && $interval->m === 0
		     && $interval->d === 0
		) {
			return 'PT0S';
		}

		$parts = 'P';

		if ( $interval->y > 0 ) {
			$parts .= $interval->y . 'Y';
		}
		if ( $interval->m > 0 ) {
			$parts .= $interval->m . 'M';
		}
		if ( $interval->d > 0 ) {
			$parts .= $interval->d . 'D';
		}

		$timeParts = '';
		if ( $interval->h > 0 ) {
			$timeParts .= $interval->h . 'H';
		}
		if ( $interval->i > 0 ) {
			$timeParts .= $interval->i . 'M';
		}
		if ( $interval->s > 0 ) {
			$timeParts .= $interval->s . 'S';
		}

		if ( $timeParts !== '' ) {
			$parts .= 'T' . $timeParts;
		}

		return $parts;
	}

	// -------------------------------------------------------------

	/**
	 * @param int|string $date_string
	 * @param string $format
	 *
	 * @return false|int|string
	 * @throws \Exception
	 */
	public static function convertToUTC( int|string $date_string, string $format = 'Y-m-d H:i:s' ): false|int|string {
		$siteTz = wp_timezone();

		if ( self::isNumericString( $date_string ) ) {
			$dt = ( new \DateTimeImmutable( '@' . (int) $date_string ) )->setTimezone( new \DateTimeZone( 'UTC' ) );
		} else {
			// create using site timezone
			$dt = date_create_immutable( (string) $date_string, $siteTz );
			if ( $dt === false ) {
				return false;
			}
			$dt = $dt->setTimezone( new \DateTimeZone( 'UTC' ) );
		}

		if ( $format === 'timestamp' || $format === 'U' ) {
			return $dt->getTimestamp();
		}

		if ( $format === 'mysql' ) {
			$format = 'Y-m-d H:i:s';
		}

		return $dt->format( $format );
	}

	// -------------------------------------------------------------

	/**
	 * @param int|string $date_string
	 * @param string $format
	 *
	 * @return false|int|string
	 * @throws \Exception
	 */
	public static function convertFromUTC( int|string $date_string, string $format = 'Y-m-d H:i:s' ): false|int|string {
		$siteTz = wp_timezone();

		if ( self::isNumericString( $date_string ) ) {
			// timestamp (UTC)
			$dt = ( new \DateTimeImmutable( '@' . (int) $date_string ) )->setTimezone( $siteTz );
		} else {
			// parse string as UTC then convert to site tz
			$utc = new \DateTimeZone( 'UTC' );
			$dt  = date_create_immutable( (string) $date_string, $utc );
			if ( $dt === false ) {
				return false;
			}
			$dt = $dt->setTimezone( $siteTz );
		}

		if ( $format === 'timestamp' || $format === 'U' ) {
			return $dt->getTimestamp();
		}

		if ( $format === 'mysql' ) {
			$format = 'Y-m-d H:i:s';
		}

		return $dt->format( $format );
	}

	// -------------------------------------------------------------

	/**
	 * @param int|string $date_string
	 * @param string $format
	 *
	 * @return false|int|string
	 * @throws \Exception
	 */
	public static function convertDatetimeFormat( int|string $date_string, string $format = 'Y-m-d H:i:s' ): false|int|string {
		$siteTz = wp_timezone();

		if ( self::isNumericString( $date_string ) ) {
			$dt = ( new \DateTimeImmutable( '@' . (int) $date_string ) )->setTimezone( $siteTz );
		} else {
			$dt = date_create_immutable( (string) $date_string, $siteTz );
			if ( $dt === false ) {
				return false;
			}
		}

		if ( $format === 'timestamp' || $format === 'U' ) {
			return $dt->getTimestamp();
		}

		if ( $format === 'mysql' ) {
			$format = 'Y-m-d H:i:s';
		}

		return $dt->format( $format );
	}

	// -------------------------------------------------------------

	/**
	 * @param string $date_string
	 *
	 * @return array|string[]
	 * @throws \Exception
	 */
	public static function timeDifference( string $date_string ): array {
		$siteTz = wp_timezone();
		$target = \DateTime::createFromFormat( 'Y-m-d\TH:i:s', $date_string, $siteTz );
		if ( $target === false ) {
			try {
				$target = new \DateTimeImmutable( $date_string, $siteTz );
			} catch ( \Exception $e ) {
				return [
					'days'    => '00',
					'hours'   => '00',
					'minutes' => '00',
					'seconds' => '00',
				];
			}
		}

		$now      = new \DateTimeImmutable( 'now', $siteTz );
		$interval = $now->diff( $target );

		return [
			'days'    => str_pad( (string) $interval->format( '%a' ), 2, '0', STR_PAD_LEFT ),
			'hours'   => str_pad( (string) $interval->format( '%h' ), 2, '0', STR_PAD_LEFT ),
			'minutes' => str_pad( (string) $interval->format( '%i' ), 2, '0', STR_PAD_LEFT ),
			'seconds' => str_pad( (string) $interval->format( '%s' ), 2, '0', STR_PAD_LEFT ),
		];
	}

	// --------------------------------------------------

	/**
	 * @param mixed $val
	 *
	 * @return bool
	 */
	private static function isNumericString( mixed $val ): bool {
		if ( is_int( $val ) ) {
			return true;
		}
		if ( is_string( $val ) ) {
			$trim = trim( $val );

			return $trim !== '' && ctype_digit( $trim );
		}

		return false;
	}
}
