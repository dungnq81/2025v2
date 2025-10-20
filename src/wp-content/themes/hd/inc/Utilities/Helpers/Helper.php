<?php
/**
 * Theme Helper Utilities
 *
 * This file defines the Helper class, a static utility class that provides
 * commonly used helper methods for various theme functionalities.
 * It centralizes reusable logic such as data formatting, template helpers,
 * and other generic utility operations.
 *
 * @author Gaudev
 */

namespace HD\Utilities\Helpers;

use HD\Utilities\Traits\Wp;
use MatthiasMullie\Minify;
use Random\RandomException;

\defined( 'ABSPATH' ) || die;

final class Helper {
	use Wp;

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
	public static function development(): bool {
		return wp_get_environment_type() === 'development' || ( defined( 'WP_DEBUG' ) && \WP_DEBUG === true );
	}

	// -------------------------------------------------------------

	/**
	 * @return string|bool|null
	 */
	public static function version(): bool|string|null {
		$timestamp = time();

		return ( wp_get_environment_type() === 'development' ||
		         ( defined( 'WP_DEBUG' ) && \WP_DEBUG === true ) ||
		         ( defined( 'FORCE_VERSION' ) && \FORCE_VERSION === true )
		) ? (string) $timestamp : false;
	}

	// -------------------------------------------------------------

	/**
	 * @param string $version
	 * @param string $recaptcha_response
	 *
	 * @return false|mixed
	 */
	public static function reCaptchaVerify( string $version, string $recaptcha_response ): mixed {
		$recaptcha_options = self::getOption( 'recaptcha__options' );
		if ( ! $recaptcha_options ) {
			return false;
		}

		// reCaptcha v2
		if ( 'v2' === $version ) {
			$secretKey = $recaptcha_options['recaptcha_v2_secret_key'] ?? '';
			$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

			// Prepare the data for verification
			$response = wp_remote_post( $verifyUrl, [
				'body' => [
					'secret'   => $secretKey,
					'response' => $recaptcha_response,
				],
			] );

			if ( is_wp_error( $response ) ) {
				error_log( '[recaptcha] HTTP error: ' . $response->get_error_message() );

				return false;
			}

			$body = wp_remote_retrieve_body( $response );
			if ( empty( $body ) ) {
				return false;
			}

			try {
				return json_decode( $body, false, 512, JSON_THROW_ON_ERROR );
			} catch ( \JsonException $e ) {
				error_log( '[recaptcha] JSON decode error: ' . $e->getMessage() );

				return false;
			}
		}

		// reCaptcha v3
		if ( 'v3' === $version ) {
			$secretKey = $recaptcha_options['recaptcha_v3_secret_key'] ?? '';
			$score     = $recaptcha_options['recaptcha_v3_score'] ?? 0.5;

			// ?

			return false;
		}

		return false;
	}

	// -------------------------------------------------------------

	/**
	 * Conditionally adds an HTML attribute based on array membership.
	 *
	 * @param array $checked_arr
	 * @param $current
	 * @param bool $display
	 * @param string $type
	 *
	 * @return string|null
	 */
	public static function inArrayChecked( array $checked_arr, $current, bool $display = true, string $type = 'checked' ): ?string {
		$type   = preg_match( '/^[a-zA-Z0-9\-]+$/', $type ) ? $type : 'checked';
		$result = in_array( $current, $checked_arr, false ) ? " $type='$type'" : '';

		// Echo or return the result
		if ( $display ) {
			echo $result;

			return null;
		}

		return $result;
	}

	// -------------------------------------------------------------

	/**
	 * @param string $name
	 * @param $value
	 * @param int $minute
	 * @param bool $httponly
	 *
	 * @return bool
	 */
	public static function addCookie( string $name, $value, int $minute = 720, bool $httponly = true ): bool {
		if ( is_scalar( $value ) ) {
			setcookie( $name, $value, time() + $minute * MINUTE_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), $httponly );

			return true;
		}

		return false;
	}

	// -------------------------------------------------------------

	/**
	 * @param string $name
	 * @param bool $httponly
	 *
	 * @return void
	 */
	public static function removeCookie( string $name, bool $httponly = true ): void {
		setcookie( $name, '', time() - 3600, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), $httponly );
	}

	// -------------------------------------------------------------

	/**
	 * @param $file
	 *
	 * @return mixed
	 */
	public static function sanitizeImage( $file ): mixed {
		$mimes = [
			'jpg|jpeg|jpe' => 'image/jpeg',
			'gif'          => 'image/gif',
			'png'          => 'image/png',
			'bmp'          => 'image/bmp',
			'webp'         => 'image/webp',
			'tif|tiff'     => 'image/tiff',
			'ico'          => 'image/x-icon',
			'svg'          => 'image/svg+xml',
		];

		// check a file type from the file name
		$file_ext = wp_check_filetype( $file, $mimes );

		// if a file has a valid mime type, return it, otherwise return default
		return $file_ext['ext'] ? $file : '';
	}

	// -------------------------------------------------------------

	/**
	 * @param $phone
	 *
	 * @return bool
	 */
	public static function isValidPhone( $phone ): bool {
		if ( ! is_string( $phone ) || trim( $phone ) === '' ) {
			return false;
		}

		$pattern = '/^\(?\+?(0|84)\)?[\s.\-]?(3[2-9]|5[689]|7[06-9]|(?:8[0-689]|87)|9[0-4|6-9])(\d{7}|\d[\s.\-]?\d{3}[\s.\-]?\d{3})$/';

		return preg_match( $pattern, $phone ) === 1;
	}

	// -------------------------------------------------------------

	/**
	 * @return array
	 */
	public static function ksesSVG(): array {
		return [
			'svg'            => [
				'xmlns'               => true,
				'viewbox'             => true,
				'width'               => true,
				'height'              => true,
				'fill'                => true,
				'stroke'              => true,
				'stroke-width'        => true,
				'stroke-linecap'      => true,
				'stroke-linejoin'     => true,
				'stroke-miterlimit'   => true,
				'stroke-dasharray'    => true,
				'stroke-dashoffset'   => true,
				'fill-rule'           => true,
				'clip-rule'           => true,
				'preserveaspectratio' => true,
				'aria-hidden'         => true,
				'role'                => true,
				'focusable'           => true,
				'id'                  => true,
				'class'               => true,
				'style'               => true,
			],
			'g'              => [
				'fill'         => true,
				'stroke'       => true,
				'stroke-width' => true,
				'clip-path'    => true,
				'transform'    => true,
				'id'           => true,
				'class'        => true,
				'style'        => true,
			],
			'path'           => [
				'd'               => true,
				'fill'            => true,
				'stroke'          => true,
				'stroke-width'    => true,
				'stroke-linecap'  => true,
				'stroke-linejoin' => true,
				'fill-rule'       => true,
				'clip-rule'       => true,
				'vector-effect'   => true,
				'transform'       => true,
				'opacity'         => true,
				'id'              => true,
				'class'           => true,
				'style'           => true,
			],
			'circle'         => [
				'cx'           => true,
				'cy'           => true,
				'r'            => true,
				'fill'         => true,
				'stroke'       => true,
				'stroke-width' => true,
				'opacity'      => true,
				'id'           => true,
				'class'        => true,
			],
			'ellipse'        => [
				'cx'           => true,
				'cy'           => true,
				'rx'           => true,
				'ry'           => true,
				'fill'         => true,
				'stroke'       => true,
				'stroke-width' => true,
				'opacity'      => true,
				'id'           => true,
				'class'        => true,
			],
			'rect'           => [
				'x'            => true,
				'y'            => true,
				'width'        => true,
				'height'       => true,
				'rx'           => true,
				'ry'           => true,
				'fill'         => true,
				'stroke'       => true,
				'stroke-width' => true,
				'opacity'      => true,
				'id'           => true,
				'class'        => true,
			],
			'line'           => [
				'x1'           => true,
				'y1'           => true,
				'x2'           => true,
				'y2'           => true,
				'stroke'       => true,
				'stroke-width' => true,
				'opacity'      => true,
				'id'           => true,
				'class'        => true,
			],
			'polyline'       => [
				'points'       => true,
				'fill'         => true,
				'stroke'       => true,
				'stroke-width' => true,
				'opacity'      => true,
				'id'           => true,
				'class'        => true,
			],
			'polygon'        => [
				'points'       => true,
				'fill'         => true,
				'stroke'       => true,
				'stroke-width' => true,
				'opacity'      => true,
				'id'           => true,
				'class'        => true,
			],
			'defs'           => [],
			'symbol'         => [
				'id'                  => true,
				'viewbox'             => true,
				'preserveaspectratio' => true,
			],
			'use'            => [
				'href'       => true,
				'xlink:href' => true,
				'x'          => true,
				'y'          => true,
				'width'      => true,
				'height'     => true,
				'id'         => true,
				'class'      => true,
			],
			'clippath'       => [ 'id' => true ],
			'mask'           => [
				'id'               => true,
				'x'                => true,
				'y'                => true,
				'width'            => true,
				'height'           => true,
				'maskunits'        => true,
				'maskcontentunits' => true,
			],
			'lineargradient' => [
				'id'                => true,
				'x1'                => true,
				'y1'                => true,
				'x2'                => true,
				'y2'                => true,
				'gradientunits'     => true,
				'gradienttransform' => true,
			],
			'radialgradient' => [
				'id'                => true,
				'cx'                => true,
				'cy'                => true,
				'r'                 => true,
				'fx'                => true,
				'fy'                => true,
				'gradientunits'     => true,
				'gradienttransform' => true,
			],
			'stop'           => [ 'offset' => true, 'stop-color' => true, 'stop-opacity' => true ],
			'title'          => [],
			'desc'           => [],
		];
	}

	// -------------------------------------------------------------

	/**
	 * @param int $length
	 *
	 * @return string
	 * @throws RandomException
	 */
	public static function makeUsername( int $length = 8 ): string {
		if ( $length < 1 ) {
			return '';
		}

		$letters            = 'abcdefghijklmnopqrstuvwxyz';
		$letters_and_digits = 'abcdefghijklmnopqrstuvwxyz0123456789';

		$username = $letters[ random_int( 0, strlen( $letters ) - 1 ) ];

		for ( $i = 1; $i < $length; $i ++ ) {
			$username .= $letters_and_digits[ random_int( 0, strlen( $letters_and_digits ) - 1 ) ];
		}

		return $username;
	}


	// -------------------------------------------------------------

	/**
	 * Generate a unique slug with desired length.
	 *
	 * @param int $length Total desired slug length
	 * @param string $prefix
	 *
	 * @return string
	 * @throws RandomException
	 */
	public static function makeUnique( int $length = 32, string $prefix = '' ): string {
		// microtime
		$time        = microtime( true );
		$timeEncoded = base_convert( (string) ( $time * 1000000 ), 10, 36 );

		// Process ID
		$pidEncoded = base_convert( (string) getmypid(), 10, 36 );

		// uniqid
		$uniq        = uniqid( '', true );
		$uniqEncoded = base_convert( str_replace( '.', '', $uniq ), 10, 36 );

		// Random supplement
		$base   = $timeEncoded . $pidEncoded . $uniqEncoded;
		$need   = max( 0, $length - strlen( $base ) );
		$random = '';
		if ( $need > 0 ) {
			$bytes  = random_bytes( (int) ceil( $need * 0.75 ) );
			$random = substr( base_convert( bin2hex( $bytes ), 16, 36 ), 0, $need );
		}

		return $prefix . substr( $base . $random, 0, $length );
	}

	// -------------------------------------------------------------

	/**
	 * @param string $content
	 *
	 * @return string
	 */
	public static function extractJS( string $content ): string {
		$script_pattern = '/<script\b[^>]*>(.*?)<\/script>/is';
		preg_match_all( $script_pattern, $content, $matches, PREG_SET_ORDER );

		$valid_scripts = [];

		// Patterns for detecting potentially malicious code
		$malicious_patterns = [
			'/eval\(/i',
			'/document\.write\(/i',
			//'/<script.*?src=[\'"]?data:/i',
			'/base64,/i',
		];

		foreach ( $matches as $match ) {
			$scriptTag     = $match[0]; // Full <script> tag
			$scriptContent = trim( $match[1] ?? '' ); // Script content inside <script>...</script>
			$hasSrc        = preg_match( '/\bsrc=["\'][^"\']+["\']/i', $scriptTag );

			$isMalicious = false;
			if ( ! $hasSrc && $scriptContent !== '' ) {
				foreach ( $malicious_patterns as $pattern ) {
					if ( preg_match( $pattern, $scriptContent ) ) {
						$isMalicious = true;
						break;
					}
				}
			}

			// Retain scripts that have valid src or are clean inline scripts
			if ( ! $isMalicious || $hasSrc ) {
				$valid_scripts[] = $scriptTag;
			}
		}

		// Re-construct content with valid <script> tags
		return preg_replace_callback( $script_pattern, static function () use ( &$valid_scripts ) {
			return array_shift( $valid_scripts ) ?? '';
		}, $content );
	}

	// -------------------------------------------------------------

	/**
	 * @param string $css
	 *
	 * @return string
	 */
	public static function extractCss( string $css ): string {
		if ( empty( $css ) ) {
			return '';
		}

		// Convert encoding to UTF-8 if needed
		if ( mb_detect_encoding( $css, 'UTF-8', true ) !== 'UTF-8' ) {
			$css = mb_convert_encoding( $css, 'UTF-8', 'auto' );
		}

		// Log if dangerous content is detected
		if ( preg_match( '/<script\b[^>]*>/i', $css ) ) {
			self::errorLog( 'Warning: `<script>` inside CSS' );
		}

		//$css = (string) $css;
		$css = preg_replace( [
			'/<script\b[^>]*>.*?(?:<\/script>|$)/is',
			'/<style\b[^>]*>(.*?)<\/style>/is',
			'/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u',
			'/\bexpression\s*\([^)]*\)/i',
			'/url\s*\(\s*[\'"]?\s*javascript:[^)]*\)/i',
			'/[^\S\r\n\t]+/',
		], [ '', '$1', '', '', '', ' ' ], $css );

		return trim( $css );
	}

	// -------------------------------------------------------------

	/**
	 * @param string|null $js
	 * @param bool $respectDebug
	 *
	 * @return string|null
	 */
	public static function JSMinify( ?string $js, bool $respectDebug = true ): ?string {
		if ( $js === null || $js === '' ) {
			return null;
		}
		if ( $respectDebug && self::development() ) {
			return $js;
		}

		return class_exists( Minify\JS::class ) ? ( new Minify\JS() )->add( $js )->minify() : $js;
	}

	// -------------------------------------------------------------

	/**
	 * @param string|null $css
	 * @param bool $respectDebug
	 *
	 * @return string|null
	 */
	public static function CSSMinify( ?string $css, bool $respectDebug = true ): ?string {
		if ( $css === null || $css === '' ) {
			return null;
		}
		if ( $respectDebug && self::development() ) {
			return $css;
		}

		return class_exists( Minify\CSS::class ) ? ( new Minify\CSS() )->add( $css )->minify() : $css;
	}

	// -------------------------------------------------------------

	/**
	 * @param $name
	 * @param mixed $default
	 *
	 * @return array|mixed
	 */
	public static function filterSettingOptions( $name, mixed $default = [] ): mixed {
		$filters = apply_filters( 'hd_settings_filter', [] );

		if ( isset( $filters[ $name ] ) ) {
			return $filters[ $name ] ?: $default;
		}

		return [];
	}

	// -------------------------------------------------------------

	/**
	 * @return mixed|string
	 */
	public static function currentLanguage(): mixed {
		// Polylang
		if ( function_exists( "pll_current_language" ) ) {
			return \pll_current_language( "slug" );
		}

		// Weglot
		if ( function_exists( "weglot_get_current_language" ) ) {
			return \weglot_get_current_language();
		}

		// WMPL
		$currentLanguage = apply_filters( 'wpml_current_language', null );

		// Try to fall back on the current language
		if ( ! $currentLanguage ) {
			return strtolower( substr( get_bloginfo( 'language' ), 0, 2 ) );
		}

		return $currentLanguage;
	}

	// --------------------------------------------------

	/**
	 * @return bool
	 */
	public static function lightHouse(): bool {
		$ua       = strtolower( $_SERVER['HTTP_USER_AGENT'] ?? '' );
		$patterns = [
			'lighthouse',
			'headlesschrome',
			'chrome-lighthouse',
			'pagespeed',
		];

		foreach ( $patterns as $pattern ) {
			if ( stripos( $ua, $pattern ) !== false ) {
				return true;
			}
		}

		return false;
	}

	// --------------------------------------------------

	/**
	 * @return void
	 */
	public static function clearAllCache(): void {
		global $wpdb;

		// Transients
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", '_transient_%' ) );
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", '_transient_timeout_%' ) );

		// Object cache (e.g., Redis or Memcached)
		if ( function_exists( 'wp_cache_flush' ) ) {
			wp_cache_flush();
		}

		// WP-Rocket cache
		if ( self::checkPluginActive( 'wp-rocket/wp-rocket.php' ) ) {
			$actions = [
				'save_post',            // Save a post
				'deleted_post',         // Delete a post
				'trashed_post',         // Empty Trashed post
				'edit_post',            // Edit a post - includes leaving comments
				'delete_attachment',    // Delete an attachment - includes re-uploading
				'switch_theme',         // Change theme
			];

			// Add the action for each event
			foreach ( $actions as $event ) {
				add_action( $event, static function () {
					\function_exists( 'rocket_clean_domain' ) && \rocket_clean_domain();
				} );
			}
		}

		// FlyingPress cache
		if ( self::checkPluginActive( 'flying-press/flying-press.php' ) ) {
			class_exists( \FlyingPress\Purge::class ) && \FlyingPress\Purge::purge_everything();
		}

		// LiteSpeed cache
		if ( self::checkPluginActive( 'litespeed-cache/litespeed-cache.php' ) ) {
			class_exists( \LiteSpeed\Purge::class ) && \LiteSpeed\Purge::purge_all();
		}
	}

	// --------------------------------------------------

	/**
	 * @param $value
	 * @param $min
	 * @param $max
	 *
	 * @return bool
	 */
	public static function inRange( $value, $min, $max ): bool {
		$inRange = filter_var( $value, FILTER_VALIDATE_INT, [
			'options' => [
				'min_range' => (int) $min,
				'max_range' => (int) $max,
			],
		] );

		return false !== $inRange;
	}

	// -------------------------------------------------------------

	/**
	 * @param array $array_a
	 * @param array $array_b
	 *
	 * @return bool
	 */
	public static function checkValuesNotInRanges( array $array_a, array $array_b ): bool {
		foreach ( $array_a as $range ) {

			// Ensure range is valid
			if ( count( $range ) !== 2 || ! is_numeric( $range[0] ) || ! is_numeric( $range[1] ) ) {
				continue;
			}

			$start = min( $range );
			$end   = max( $range );

			foreach ( $array_b as $value ) {
				if ( $value >= $start && $value < $end ) {
					return false;
				}
			}

			// Additional check for whether array_b contains the entire range of array_a
			if ( min( $array_b ) <= $start && max( $array_b ) >= $end ) {
				return false;
			}
		}

		return true;
	}

	// --------------------------------------------------

	/**
	 * A fallback when no navigation is selected by default.
	 *
	 * @param bool $container
	 *
	 * @return void
	 */
	public static function menuFallback( bool $container = false ): void {
		echo '<div class="menu-fallback">';
		if ( $container ) {
			echo '<div class="container">';
		}

		/* translators: %1$s: link to menus, %2$s: link to customize. */
		printf(
			__( 'Please assign a menu to the primary menu location under %1$s or %2$s the design.', TEXT_DOMAIN ),
			/* translators: %s: menu url */
			sprintf(
				__( '<a class="_blank" href="%s">Menus</a>', TEXT_DOMAIN ),
				get_admin_url( get_current_blog_id(), 'nav-menus.php' )
			),
			/* translators: %s: customize url */
			sprintf(
				__( '<a class="_blank" href="%s">Customize</a>', TEXT_DOMAIN ),
				get_admin_url( get_current_blog_id(), 'customize.php' )
			)
		);

		if ( $container ) {
			echo '</div>';
		}

		echo '</div>';
	}

	// --------------------------------------------------

	/**
	 * @param string $img
	 *
	 * @return string
	 */
	public static function pixelImg( string $img = '' ): string {
		if ( file_exists( $img ) ) {
			return $img;
		}

		return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	}

	// --------------------------------------------------

	/**
	 * @param string $class
	 * @param bool $img_wrap
	 * @param bool $thumb
	 *
	 * @return string
	 */
	public static function placeholderSrc( string $class = '', bool $img_wrap = true, bool $thumb = true ): string {
		$src = ASSETS_URL . 'img/placeholder.png';
		if ( $thumb ) {
			$src = ASSETS_URL . 'img/placeholder-320x320.png';
		}

		if ( $img_wrap ) {
			$class = ! empty( $class ) ? ' ' . $class : '';
			$src   = '<img loading="lazy" src="' . $src . '" alt="place-holder" class="wp-placeholder' . $class . '">';
		}

		return $src;
	}

	// --------------------------------------------------

	/**
	 * @param string $str
	 * @param string $attr
	 * @param string $content_extra
	 * @param bool $unique
	 *
	 * @return string
	 */
	public static function appendToAttribute( string $str, string $attr, string $content_extra, bool $unique = false ): string {
		// Check if the attribute has single or double quotes.
		if ( ( $start = stripos( $str, $attr . '="' ) ) !== false ) {
			$quote = '"';
		} elseif ( ( $start = stripos( $str, $attr . "='" ) ) !== false ) {
			$quote = "'";
		} else {
			// Not found
			return $str;
		}

		// Add a quote (for filtering purposes).
		$attr          .= '=' . $quote;
		$content_extra = trim( $content_extra );

		if ( $unique ) {
			$start += strlen( $attr );
			$end   = strpos( $str, $quote, $start );

			// Get the current content.
			$content = explode( ' ', substr( $str, $start, $end - $start ) );

			// Append extra content uniquely.
			foreach ( explode( ' ', $content_extra ) as $class ) {
				if ( ! empty( $class ) && ! in_array( $class, $content, false ) ) {
					$content[] = $class;
				}
			}

			// Remove duplicates and empty values.
			$content        = array_unique( array_filter( $content ) );
			$content        = implode( ' ', $content );
			$before_content = substr( $str, 0, $start );
			$after_content  = substr( $str, $end );
			$str            = $before_content . $content . $after_content;
		} else {
			$str = preg_replace(
				'/' . preg_quote( $attr, '/' ) . '/',
				$attr . $content_extra . ' ',
				$str,
				1
			);
		}

		return $str;
	}

	// --------------------------------------------------

	/**
	 * @param $url
	 * @param int $resolution_key
	 *
	 * @return string
	 */
	public static function youtubeImage( $url, int $resolution_key = 0 ): string {
		if ( ! $url ) {
			return '';
		}

		$resolution = [
			'sddefault',
			'hqdefault',
			'mqdefault',
			'default',
			'maxresdefault',
		];

		$url_img      = self::pixelImg();
		$query_string = wp_parse_url( $url, PHP_URL_QUERY );

		if ( $query_string ) {
			parse_str( $query_string, $vars );
			if ( isset( $vars['v'] ) ) {
				$id      = $vars['v'];
				$res_key = $resolution[ $resolution_key ] ?? $resolution[0];
				$url_img = 'https://img.youtube.com/vi/' . $id . '/' . $res_key . '.jpg';
			}
		}

		return $url_img;
	}

	// --------------------------------------------------

	/**
	 * @param $url
	 * @param int $autoplay
	 * @param bool $lazyload
	 * @param bool $control
	 *
	 * @return string|null
	 */
	public static function youtubeIframe( $url, int $autoplay = 0, bool $lazyload = true, bool $control = true ): ?string {
		if ( ! $url ) {
			return null;
		}

		$videoId = null;

		// Parse URL and extract query string
		$query_string = wp_parse_url( $url, PHP_URL_QUERY );
		if ( $query_string ) {
			parse_str( $query_string, $vars );
			if ( isset( $vars['v'] ) ) {
				$videoId = esc_attr( $vars['v'] );
			}
		}

		// Fallback: extract from youtu.be/VIDEO_ID or embed/VIDEO_ID
		if ( ! $videoId ) {
			$path = wp_parse_url( $url, PHP_URL_PATH );
			if ( $path ) {
				$segments = explode( '/', trim( $path, '/' ) );
				if ( isset( $segments[0] ) ) {
					$videoId = esc_attr( end( $segments ) );
				}
			}
		}

		if ( ! $videoId ) {
			return null;
		}

		$home            = esc_url( trailingslashit( network_home_url() ) );
		$iframeSize      = ' width="800" height="450"';
		$allowAttributes = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
		$src             = "https://www.youtube.com/embed/{$videoId}?wmode=transparent&origin={$home}";

		if ( $autoplay ) {
			$allowAttributes .= '; autoplay';
			$src             .= '&autoplay=1';
		}

		if ( ! $control ) {
			$src .= '&modestbranding=1&controls=0&rel=0&version=3&loop=1&enablejsapi=1&iv_load_policy=3&playlist=' . $videoId;
		}

		$src               .= '&html5=1';
		$lazyLoadAttribute = $lazyload ? ' loading="lazy"' : '';

		return sprintf(
			'<iframe id="ytb_iframe_%1$s" title="YouTube Video Player"%2$s allow="%3$s"%4$s src="%5$s" style="border:0"></iframe>',
			$videoId,
			$iframeSize,
			$allowAttributes,
			$lazyLoadAttribute,
			esc_url( $src )
		);
	}

	// --------------------------------------------------

	/**
	 * @param string $email
	 * @param string $title
	 * @param array|string $attributes
	 *
	 * @return string|null
	 */
	public static function safeMailTo( string $email, string $title = '', array|string $attributes = '' ): ?string {
		if ( ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
			return null;
		}

		$title        = $title ?: $email;
		$encodedEmail = '';

		// Convert email characters to HTML entities to obfuscate
		for ( $i = 0, $len = strlen( $email ); $i < $len; $i ++ ) {
			$encodedEmail .= '&#' . ord( $email[ $i ] ) . ';';
		}

		$encodedTitle = '';
		for ( $i = 0, $len = strlen( $title ); $i < $len; $i ++ ) {
			$encodedTitle .= '&#' . ord( $title[ $i ] ) . ';';
		}

		// Handle attributes
		$attrString = '';
		if ( is_array( $attributes ) ) {
			foreach ( $attributes as $key => $val ) {
				$attrString .= ' ' . htmlspecialchars( $key, ENT_QUOTES | ENT_HTML5 ) . '="' . htmlspecialchars( $val, ENT_QUOTES | ENT_HTML5 ) . '"';
			}
		} elseif ( is_string( $attributes ) ) {
			$attrString = ' ' . $attributes;
		}

		// Return obfuscated email using HTML entities only
		return '<a href="mailto:' . $encodedEmail . '"' . $attrString . '>' . $encodedTitle . '</a>';
	}

	// --------------------------------------------------

	/**
	 * @return mixed
	 */
	public static function manifest(): mixed {
		static $cache = [];

		$manifest_base = rtrim( THEME_PATH, '/\\' ) . '/assets/';
		$manifest_path = $manifest_base . '.vite/manifest.json';
		$key           = 'manifest:' . md5( $manifest_path );

		if ( isset( $cache[ $key ] ) ) {
			return $cache[ $key ];
		}

		if ( ! is_readable( $manifest_path ) || ! is_file( $manifest_path ) ) {
			return $cache[ $key ] = [];
		}

		// transient + filemtime
		$transient_key = 'theme_manifest_filtered_' . md5( $manifest_path );
		$file_mtime    = filemtime( $manifest_path ) ?: 0;
		$cached        = get_transient( $transient_key );

		if ( is_array( $cached ) && ( $cached['mtime'] ?? 0 ) === $file_mtime ) {
			return $cache[ $key ] = $cached['data'] ?? [];
		}

		// parse JSON
		$data = wp_json_file_decode( $manifest_path, [ 'associative' => true, 'depth' => 512 ] );
		if ( is_wp_error( $data ) ) {
			error_log( '[manifest] JSON decode error at ' . $manifest_path . ': ' . $data->get_error_message() );

			return $cache[ $key ] = [];
		}

		if ( ! is_array( $data ) ) {
			return $cache[ $key ] = [];
		}

		// manifest filter
		$filtered = [];
		foreach ( $data as $entryKey => $entry ) {
			if ( ! is_array( $entry ) ) {
				continue;
			}

			$isVendor = preg_match( '/^_?vendor\..+\.(js|css)$/', (string) $entryKey ) === 1;
			$isEntry  = ! empty( $entry['isEntry'] );

			if ( ! $isVendor && ! $isEntry ) {
				continue;
			}

			$keepFields            = [ 'file', 'name', 'src', 'css', 'isEntry', 'imports' ];
			$filtered[ $entryKey ] = array_intersect_key( $entry, array_flip( $keepFields ) );
		}

		// transient cache (1 day)
		set_transient( $transient_key, [
			'mtime' => $file_mtime,
			'data'  => $filtered,
		], DAY_IN_SECONDS );

		return $cache[ $key ] = $filtered;
	}

	// --------------------------------------------------

	/**
	 *  Resolve a given asset entry from the Vite manifest.
	 *
	 * @param string|null $entry \Ex: 'components/template/home.js', 'index.scss', 'vendor.js', 'vendor.css'.
	 * @param string $handle_prefix
	 *
	 * @return array
	 */
	public static function manifestResolve( ?string $entry = null, string $handle_prefix = '' ): array {
		static $resolveCache = [];

		if ( ! is_string( $entry ) || ! trim( $entry ) ) {
			return [];
		}

		$key = md5( $entry . $handle_prefix );
		if ( isset( $resolveCache[ $key ] ) ) {
			return $resolveCache[ $key ];
		}

		$manifest = self::manifest();
		if ( ! $manifest ) {
			return $resolveCache[ $key ] = [];
		}

		// --- Helper closures ---
		$makeSlugFromPath = static function ( string $pathNoExt ): string {
			$pathNoExt = str_replace( '\\', '/', $pathNoExt );
			$pathNoExt = preg_replace( '#/+#', '/', $pathNoExt );
			$pathNoExt = trim( $pathNoExt, '/' );
			$slug      = strtolower( preg_replace( '/[^a-z0-9]+/i', '-', $pathNoExt ) );
			$slug      = trim( $slug, '-' );

			return $slug ?: 'entry';
		};

		$makeHandle = static function ( $b, $kind ) use ( $handle_prefix ) {
			return $handle_prefix . $b . '-' . $kind;
		};

		// --- Normalize input ---
		$entry = trim( $entry );
		$entry = self::normalizePath( $entry );

		// --- Vendor JS ---
		if ( preg_match( '/^_?vendor(\..+)?\.js$/', $entry ) ) {
			foreach ( $manifest as $k => $v ) {
				if ( is_array( $v ) && preg_match( '/^_?vendor\..+\.js$/', $k ) ) {
					$file = $v['file'] ?? '';
					if ( ! $file ) {
						return $resolveCache[ $key ] = [];
					}

					return $resolveCache[ $key ] = [
						'handle' => $makeHandle( 'vendor', 'js' ),
						'src'    => THEME_URL . 'assets/' . $file,
						'file'   => $v['src'] ?? '',
					];
				}
			}

			return $resolveCache[ $key ] = [];
		}

		// --- Vendor CSS ---
		if ( preg_match( '/^_?vendor(\..+)?\.css$/', $entry ) ) {
			foreach ( $manifest as $k => $v ) {
				if ( is_array( $v ) && preg_match( '/^_?vendor\..+\.css$/', $k ) ) {
					$file = $v['file'] ?? '';
					if ( ! $file ) {
						return $resolveCache[ $key ] = [];
					}

					return $resolveCache[ $key ] = [
						'handle' => $makeHandle( 'vendor', 'css' ),
						'src'    => THEME_URL . 'assets/' . $file,
						'file'   => $v['src'] ?? '',
					];
				}
			}

			// fallback
			foreach ( $manifest as $k => $v ) {
				if ( ! empty( $v['css'][0] ) && preg_match( '/^_?vendor\..+\.js$/', $k ) ) {
					return $resolveCache[ $key ] = [
						'handle' => $makeHandle( 'vendor', 'css' ),
						'src'    => THEME_URL . 'assets/' . $v['css'][0],
					];
				}
			}

			return $resolveCache[ $key ] = [];
		}

		// --- Regular Entries ---
		$ext       = strtolower( pathinfo( $entry, PATHINFO_EXTENSION ) );
		$pathNoExt = preg_replace( '/\.' . preg_quote( $ext, '/' ) . '$/i', '', $entry );
		$baseSlug  = $makeSlugFromPath( $pathNoExt );
		$isCss     = in_array( $ext, [ 'css', 'scss' ], true );
		$isJs      = ( $ext === 'js' );

		$srcTailCandidates = [];
		if ( $isCss ) {
			$srcTailCandidates[] = $pathNoExt . '.scss';
			$srcTailCandidates[] = $pathNoExt . '.css';
		} elseif ( $isJs ) {
			$srcTailCandidates[] = $pathNoExt . '.js';
		} else {
			return $resolveCache[ $key ] = [];
		}

		$found = null;
		foreach ( $manifest as $k => $item ) {
			if ( ! is_array( $item )
			     || empty( $item['isEntry'] )
			     || empty( $item['src'] )
			     || ! is_string( $item['src'] )
			     || preg_match( '/^_?vendor\..+\.(js|css)$/', $k )
			) {
				continue;
			}

			foreach ( $srcTailCandidates as $tail ) {
				if ( str_ends_with( $item['src'], $tail ) ) {
					$found = $item;
					break 2;
				}
			}
		}

		if ( ! $found ) {
			if ( \HD_Helper::development() ) {
				\HD_Helper::errorLog( '[manifestResolve] Entry not found: ' . $entry );
			}

			return $resolveCache[ $key ] = [];
		}

		// --- JS entry ---
		if ( $isJs ) {
			$handle = $makeHandle( $baseSlug, 'js' );

			if ( ! empty( $found['file'] ) ) {
				return $resolveCache[ $key ] = [
					'handle'  => $handle,
					'src'     => THEME_URL . 'assets/' . $found['file'],
					'file'    => $found['src'] ?? '',
					'imports' => $found['imports'] ?? [],
				];
			}
		}

		// --- CSS entry ---
		if ( $isCss ) {
			$handle = $makeHandle( $baseSlug, 'css' );

			if ( ! empty( $found['css'][0] ) ) {
				return $resolveCache[ $key ] = [
					'handle' => $handle,
					'src'    => THEME_URL . 'assets/' . $found['css'][0],
					'file'   => $found['src'] ?? '',
				];
			}

			if ( ! empty( $found['file'] ) ) {
				return $resolveCache[ $key ] = [
					'handle' => $handle,
					'src'    => THEME_URL . 'assets/' . $found['file'],
					'file'   => $found['src'] ?? '',
				];
			}
		}

		return $resolveCache[ $key ] = [];
	}

	// --------------------------------------------------

	/**
	 * @param array|null $faqs
	 * @param string|null $q
	 * @param string|null $a
	 *
	 * @return string|null
	 */
	public static function faqSchema( ?array $faqs = [], ?string $q = 'question', ?string $a = 'answer' ): ?string {
		if ( empty( $faqs ) ) {
			return null;
		}

		$q = $q ?: 'question';
		$a = $a ?: 'answer';

		$schema_faq = [
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => array_map( static function ( $faq ) use ( $q, $a ) {
				return [
					'@type'          => 'Question',
					'name'           => wp_strip_all_tags( $faq[ $q ] ),
					'acceptedAnswer' => [
						'@type' => 'Answer',
						'text'  => wp_strip_all_tags( $faq[ $a ] ),
					],
				];
			}, $faqs ),
		];

		return '<script type="application/ld+json">' . wp_json_encode( $schema_faq, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>';
	}

	// --------------------------------------------------
}
