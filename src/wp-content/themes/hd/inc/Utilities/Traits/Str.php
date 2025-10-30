<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Str {
	// --------------------------------------------------

	/**
	 * Remove empty <p> tags from content.
	 *
	 * @param string $content
	 *
	 * @return string
	 */
	public static function removeEmptyP( string $content ): string {
		return preg_replace( '/<p(?:\s+[^>]*)?>\s*(?:&nbsp;|\xC2\xA0|\s)*<\/p>/i', '', $content ) ?? $content;
	}


	// --------------------------------------------------

	/**
	 * Convert newlines to <p> tags in HTML content.
	 *
	 * @param string $text
	 *
	 * @return string
	 */
	public static function nl2P( string $text ): string {
		$text = trim( $text );
		if ( $text === '' ) {
			return '';
		}

		$parts = preg_split( '/\r?\n+/', $text, - 1, PREG_SPLIT_NO_EMPTY );
		if ( ! $parts ) {
			return '';
		}

		return '<p>' . implode( '</p><p>', array_map( 'trim', $parts ) ) . '</p>';
	}


	// --------------------------------------------------

	/**
	 * Convert <br> tags in HTML content to <p> tags.
	 *
	 * @param string $html
	 *
	 * @return string
	 */
	public static function br2P( string $html ): string {
		$html = trim( $html );
		if ( $html === '' ) {
			return '';
		}

		$parts = preg_split( '/<br\s*\/?>/i', $html, - 1, PREG_SPLIT_NO_EMPTY );
		if ( ! $parts ) {
			return '';
		}

		return '<p>' . implode( '</p><p>', array_map( 'trim', $parts ) ) . '</p>';
	}

	// --------------------------------------------------

	/**
	 * @param string $string
	 *
	 * @return string
	 */
	public static function camelCase( string $string ): string {
		$string = trim( $string );
		if ( $string === '' ) {
			return '';
		}

		$string = str_replace( [ '-', '_' ], ' ', $string );
		$string = mb_convert_case( $string, MB_CASE_TITLE, 'UTF-8' );
		$string = str_replace( ' ', '', $string );

		return lcfirst( $string );
	}

	// --------------------------------------------------

	/**
	 * @param string $string
	 *
	 * @return string
	 */
	public static function snakeCase( string $string ): string {
		$string = trim( $string );
		if ( $string === '' ) {
			return '';
		}

		$string = str_replace( '-', '_', $string );
		$string = preg_replace( '/(?<!^)([A-Z])/u', '_$1', $string );

		return mb_strtolower( $string, 'UTF-8' );
	}


	// --------------------------------------------------

	/**
	 * @param string $string
	 *
	 * @return string
	 */
	public static function dashCase( string $string ): string {
		return str_replace( '_', '-', self::snakeCase( $string ) );
	}

	// --------------------------------------------------

	/**
	 * @param string|array $needles
	 * @param string $haystack
	 *
	 * @return bool
	 */
	public static function startsWith( string $haystack, string|array $needles ): bool {
		foreach ( (array) $needles as $needle ) {
			if ( $needle !== '' && str_starts_with( $haystack, $needle ) ) {
				return true;
			}
		}

		return false;
	}

	// --------------------------------------------------

	/**
	 * @param string|array $needles
	 * @param string $haystack
	 *
	 * @return bool
	 */
	public static function endsWith( string $haystack, string|array $needles ): bool {
		foreach ( (array) $needles as $needle ) {
			if ( $needle !== '' && str_ends_with( $haystack, $needle ) ) {
				return true;
			}
		}

		return false;
	}

	// --------------------------------------------------

	/**
	 * @param string $prefix
	 * @param string $string
	 *
	 * @return string
	 */
	public static function removePrefix( string $string, string $prefix ): string {
		if ( $prefix === '' ) {
			return $string;
		}

		return self::startsWith( $string, $prefix )
			? mb_substr( $string, mb_strlen( $prefix, 'UTF-8' ), null, 'UTF-8' )
			: $string;
	}

	// --------------------------------------------------

	/**
	 * @param string $string
	 * @param string $prefix
	 * @param string|null $trim
	 *
	 * @return string
	 */
	public static function prefix( string $string, string $prefix, ?string $trim = null ): string {
		$string = trim( $string );
		if ( $string === '' ) {
			return '';
		}

		$trim    = $trim ?? $prefix;
		$cleaned = self::removePrefix( $string, $trim );

		return $prefix . $cleaned;
	}

	// --------------------------------------------------

	/**
	 * @param string $string
	 * @param string $suffix
	 *
	 * @return string
	 */
	public static function suffix( string $string, string $suffix ): string {
		$string = trim( $string );

		if ( $suffix === '' || $string === '' ) {
			return $string;
		}

		return self::endsWith( $string, $suffix )
			? $string
			: $string . $suffix;
	}

	// --------------------------------------------------

	/**
	 * @param string $search
	 * @param string $replace
	 * @param string $subject
	 *
	 * @return string
	 */
	public static function replaceFirst( string $search, string $replace, string $subject ): string {
		if ( $search === '' || $subject === '' ) {
			return $subject;
		}

		$pos = mb_strpos( $subject, $search, 0, 'UTF-8' );
		if ( $pos === false ) {
			return $subject;
		}

		return mb_substr( $subject, 0, $pos, 'UTF-8' )
		       . $replace
		       . mb_substr( $subject, $pos + mb_strlen( $search, 'UTF-8' ), null, 'UTF-8' );
	}

	// --------------------------------------------------

	/**
	 * @param string $search
	 * @param string $replace
	 * @param string $subject
	 *
	 * @return string
	 */
	public static function replaceLast( string $search, string $replace, string $subject ): string {
		if ( $search === '' || $subject === '' ) {
			return $subject;
		}

		$pos = mb_strrpos( $subject, $search, 0, 'UTF-8' );
		if ( $pos === false ) {
			return $subject;
		}

		return mb_substr( $subject, 0, $pos, 'UTF-8' )
		       . $replace
		       . mb_substr( $subject, $pos + mb_strlen( $search, 'UTF-8' ), null, 'UTF-8' );
	}

	// --------------------------------------------------

	/**
	 * @param string $str
	 *
	 * @return string
	 */
	public static function keyWords( string $str ): string {
		$str = preg_replace( '/[\v\s]+/u', ' ', $str );

		return preg_replace( '/\s+/', ', ', trim( $str ) );
	}

	// --------------------------------------------------

	/**
	 * @param string $str
	 *
	 * @return string
	 */
	public static function sanitizeKeywords( string $str ): string {
		$str = strip_tags( $str );
		$str = preg_replace( '/[\s\v]+/u', ' ', $str );
		$str = preg_replace( '/\s*,\s*/u', ',', $str );
		$str = preg_replace( '/\s+/u', ',', trim( $str ) );

		$keywords = array_filter( array_unique( array_map( static function ( $word ) {
			$word = mb_strtolower( trim( $word ), 'UTF-8' );

			return preg_replace(
				'/[^a-z0-9áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ\s\-]/u',
				'',
				$word
			);
		}, explode( ',', $str ) ) ) );

		return implode( ', ', $keywords );
	}

	// --------------------------------------------------

	/**
	 * @param string $value
	 * @param int $length
	 * @param string $end
	 *
	 * @return string
	 */
	public static function truncate( string $value, int $length, string $end = '' ): string {
		if ( $length <= 0 ) {
			return '';
		}

		$value = trim( $value );
		if ( mb_strlen( $value, 'UTF-8' ) <= $length ) {
			return $value;
		}

		$adjusted  = max( 0, $length - mb_strlen( $end, 'UTF-8' ) );
		$truncated = mb_substr( $value, 0, $adjusted, 'UTF-8' );

		return rtrim( $truncated ) . $end;
	}

	// --------------------------------------------------

	/**
	 * @param string|null $string
	 * @param string|array|null $allowed_tags
	 *
	 * @param bool $remove_js
	 * @param bool $flatten
	 *
	 * @return string
	 */
	public static function stripAllTags( ?string $string, string|array|null $allowed_tags = null, bool $remove_js = true, bool $flatten = true ): string {
		if ( $string === null || $string === '' ) {
			return '';
		}

		if ( is_array( $allowed_tags ) ) {
			$allowed_tags = implode( '', array_map( static fn( $tag ) => "<{$tag}>", $allowed_tags ) );
		}

		if ( $remove_js ) {
			$string = preg_replace( '/<(script|style)[^>]*>.*?<\/\1>/is', ' ', $string ) ?? '';
		}

		$string = strip_tags( $string, $allowed_tags );

		if ( $flatten ) {
			$string = preg_replace( '/\s+/u', ' ', $string ) ?? '';
		}

		return trim( $string );
	}

	// --------------------------------------------------

	/**
	 * @param string|null $string
	 * @param bool $strip_tags
	 * @param string $replace
	 *
	 * @return string
	 */
	public static function stripSpace( ?string $string, bool $strip_tags = true, string $replace = '' ): string {
		if ( $string === null || trim( $string ) === '' ) {
			return '';
		}

		if ( $strip_tags ) {
			$string = strip_tags( $string );
		}

		return trim( preg_replace( '/[\p{Z}\s]+/u', $replace, $string ) ?? '' );
	}

	// --------------------------------------------------

	/**
	 * @param string|null $string
	 *
	 * @return string
	 */
	public static function escAttr( ?string $string ): string {
		if ( $string === null ) {
			return '';
		}

		return esc_attr( self::stripAllTags( $string ) );
	}

	// --------------------------------------------------

	/**
	 * @param string $text
	 *
	 * @return string
	 */
	public static function normalize( string $text ): string {
		$allowedHtml         = wp_kses_allowed_html();
		$allowedHtml['mark'] = [];

		$text = wp_kses( $text, $allowedHtml );
		$text = convert_smilies( $text );
		$text = str_replace( ']]>', ']]&gt;', $text );

		return preg_replace( '/\n{2,}/', "\n", trim( $text ) );
	}
}
