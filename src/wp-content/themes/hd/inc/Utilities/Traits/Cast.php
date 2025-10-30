<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Cast {
	use Base;
	use Arr;

	// --------------------------------------------------

	/**
	 * @param mixed $delimiters
	 * @param string|null $string
	 * @param bool $remove_empty
	 *
	 * @return array|string[]
	 */
	public static function explodeMulti( mixed $delimiters, ?string $string, bool $remove_empty = true ): array {
		$string = (string) $string;

		if ( $string === '' ) {
			return [];
		}

		if ( is_string( $delimiters ) ) {
			$result = explode( $delimiters, $string );
		} elseif ( is_array( $delimiters ) && count( $delimiters ) > 0 ) {
			$ready  = str_replace( $delimiters, $delimiters[0], $string );
			$result = explode( $delimiters[0], $ready );
		} else {
			return [ $string ];
		}

		return $remove_empty
			? array_values( array_filter( $result, 'strlen' ) )
			: array_values( $result );
	}

	// --------------------------------------------------

	/**
	 * @param mixed $value
	 *
	 * @return int
	 */
	public static function toInt( mixed $value ): int {
		return (int) round( self::toFloat( $value ) );
	}

	// --------------------------------------------------

	/**
	 * @param mixed $value
	 *
	 * @return float
	 */
	public static function toFloat( mixed $value ): float {
		if ( is_float( $value ) || is_int( $value ) ) {
			return (float) $value;
		}

		if ( is_string( $value ) ) {
			$value = trim( $value );
			$value = str_replace( [ ' ', ',' ], [ '', '.' ], $value );
			if ( is_numeric( $value ) ) {
				return (float) $value;
			}
		}

		// If the conversion fails, return 0.0 or handle the error accordingly
		return 0.0;
	}

	// --------------------------------------------------

	/**
	 * @param mixed $value
	 * @param bool $explode
	 *
	 * @return array|bool[]
	 */
	public static function toArray( mixed $value, bool $explode = true ): array {
		if ( $value === null ) {
			return [];
		}

		if ( is_bool( $value ) ) {
			return [ $value ];
		}

		if ( is_array( $value ) ) {
			return $value;
		}

		if ( is_scalar( $value ) && $explode ) {
			return self::convertFromString( (string) $value );
		}

		if ( is_object( $value ) ) {
			if ( method_exists( $value, 'toArray' ) ) {
				return $value->toArray();
			}

			return get_object_vars( $value );
		}

		return [];
	}

	// --------------------------------------------------

	public static function toString( mixed $value, bool $strict = true ): string {
		if ( is_string( $value ) || is_numeric( $value ) || is_bool( $value ) ) {
			return (string) $value;
		}

		if ( is_object( $value ) && method_exists( $value, '__toString' ) ) {
			return (string) $value;
		}

		if ( self::isEmpty( $value ) ) {
			return '';
		}

		if ( self::isIndexedAndFlat( $value ) ) {
			return implode( ', ', (array) $value );
		}

		return $strict ? '' : maybe_serialize( $value );
	}

	// --------------------------------------------------

	/**
	 * @param mixed $value
	 *
	 * @return bool
	 */
	public static function toBool( mixed $value ): bool {
		return (bool) filter_var( $value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
	}

	// --------------------------------------------------

	/**
	 * @param mixed $value
	 *
	 * @return mixed|object
	 */
	public static function toObject( mixed $value ): mixed {
		if ( ! is_object( $value ) ) {
			return (object) self::toArray( $value );
		}

		return $value;
	}
}
