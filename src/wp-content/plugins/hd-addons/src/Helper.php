<?php

namespace Addons;

use Random\RandomException;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;
use MatthiasMullie\Minify;

\defined( 'ABSPATH' ) || exit;

/**
 * All utility helpers used across the plugin.
 *
 * @author Gaudev
 */
final class Helper {
	// --------------------------------------------------

	/**
	 * @return bool
	 */
	public static function development(): bool {
		return wp_get_environment_type() === 'development' || ( defined( 'WP_DEBUG' ) && \WP_DEBUG === true );
	}

	// --------------------------------------------------

	/**
	 * @return bool|string|null
	 */
	public static function version(): bool|string|null {
		$timestamp = time();

		return ( wp_get_environment_type() === 'development' ||
		         ( defined( 'WP_DEBUG' ) && \WP_DEBUG === true ) ||
		         ( defined( 'FORCE_VERSION' ) && \FORCE_VERSION === true )
		) ? (string) $timestamp : false;
	}

	// --------------------------------------------------

	/**
	 * Throttled error logging with a 1‑minute throttle per unique message.
	 *
	 * @param string $message
	 * @param int $type
	 * @param string|null $dest
	 * @param string|null $headers
	 *
	 * @return void
	 */
	public static function errorLog( string $message, int $type = 0, ?string $dest = null, ?string $headers = null ): void {
		$key = 'hd_err_' . md5( $message );

		if ( ! wp_cache_get( $key, 'hd_error_log_cache' ) && self::development() ) {
			wp_cache_set( $key, 1, 'hd_error_log_cache', MINUTE_IN_SECONDS );

			// Intentionally calling error_log for throttled logging.
			error_log( $message, $type, $dest, $headers );
		}
	}

	// --------------------------------------------------

	/**
	 * @param string|\WP_Error $message
	 * @param string|int $title
	 * @param string|array|int $args
	 *
	 * @return void
	 */
	public static function wpDie( string|\WP_Error $message = '', string|int $title = '', string|array|int $args = [] ) {
		// Intentionally calling wp_die as a final error handler.
		wp_die( $message, $title, $args );
	}

	// -------------------------------------------------------------

	/**
	 * @param mixed $action
	 * @param string $name
	 * @param bool $referer
	 * @param bool $display
	 *
	 * @return string|null
	 */
	public static function CSRFToken( string|int $action = - 1, string $name = '_csrf_token', bool $referer = false, bool $display = false ): ?string {
		$name        = esc_attr( $name );
		$token       = wp_create_nonce( $action );
		$nonce_field = '<input type="hidden" id="' . self::random( 10 ) . '" name="' . $name . '" value="' . esc_attr( $token ) . '" />';

		if ( $referer ) {
			$nonce_field .= wp_referer_field( false );
		}

		if ( $display ) {
			echo $nonce_field;

			return null;
		}

		return $nonce_field;
	}

	// --------------------------------------------------

	/**
	 * @param int $length
	 *
	 * @return string
	 */
	public static function random( int $length = 8 ): string {
		$text = base64_encode( wp_generate_password( $length, false ) );

		return substr( str_replace( [ '/', '+', '=' ], '', $text ), 0, $length );
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

	// --------------------------------------------------

	/**
	 * @param string $tag
	 * @param array $atts
	 * @param string|null $content
	 *
	 * @return mixed
	 */
	public static function doShortcode( string $tag, array $atts = [], ?string $content = null ): mixed {
		global $shortcode_tags;

		// Check if the shortcode exists
		if ( ! isset( $shortcode_tags[ $tag ] ) ) {
			return false;
		}

		// Call the shortcode function and return its output
		try {
			return \call_user_func( $shortcode_tags[ $tag ], $atts, $content, $tag );
		} catch ( \Throwable $e ) {
			self::errorLog( '[Shortcode error] ' . $e->getMessage() );

			return false;
		}
	}

	// --------------------------------------------------

	/**
	 * @param mixed $delimiters
	 * @param string|null $string
	 * @param bool $remove_empty
	 *
	 * @return null[]|string[]
	 */
	public static function explodeMulti( mixed $delimiters, ?string $string, bool $remove_empty = true ): array {
		$string = (string) $string;
		if ( is_string( $delimiters ) ) {
			return explode( $delimiters, $string );
		}

		if ( is_array( $delimiters ) ) {
			$ready  = str_replace( $delimiters, $delimiters[0], $string );
			$launch = explode( $delimiters[0], $ready );

			return $remove_empty ? array_values( array_filter( $launch ) ) : array_values( $launch );
		}

		return [ $string ];
	}

	// --------------------------------------------------

	/**
	 * @param string|null $string
	 * @param bool $remove_js
	 * @param bool $flatten
	 * @param $allowed_tags
	 *
	 * @return string
	 */
	public static function stripAllTags( ?string $string, bool $remove_js = true, bool $flatten = true, $allowed_tags = null ): string {
		if ( ! is_scalar( $string ) ) {
			return '';
		}

		if ( $remove_js ) {
			$string = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', ' ', $string );
		}

		$string = strip_tags( $string, $allowed_tags );

		if ( $flatten ) {
			$string = preg_replace( '/[\r\n\t ]+/', ' ', $string );
		}

		return trim( $string );
	}

	// --------------------------------------------------

	/**
	 * @param string $uri
	 * @param int $status
	 *
	 * @return bool|void
	 */
	public static function redirect( string $uri = '', int $status = 301 ) {
		$uri = esc_url_raw( $uri );
		if ( ! $uri ) {
			return false;
		}

		if ( ! headers_sent() ) {
			wp_safe_redirect( $uri, $status );
			exit;
		}

		echo '<script>window.location.href="' . $uri . '";</script>';
		echo '<noscript><meta http-equiv="refresh" content="0;url=' . $uri . '" /></noscript>';

		return true;
	}

	// --------------------------------------------------

	/**
	 * Get the current url.
	 *
	 * @return string The current url.
	 */
	public static function getCurrentUrl(): string {
		if ( ! function_exists( 'home_url' ) ) {
			return '';
		}

		return home_url( add_query_arg( null, null ) );
	}

	// --------------------------------------------------

	/**
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

	// --------------------------------------------------

	/**
	 * @param string $size
	 *
	 * @return int
	 */
	public static function convertToMB( string $size ): int {
		// Define the multipliers for each unit
		$multipliers = [
			'M' => 1,              // Megabyte
			'G' => 1024,           // Gigabyte
			'T' => 1024 * 1024,     // Terabyte
		];

		// Extract the numeric part and the unit from the input string
		$size = strtoupper( trim( $size ) );
		if ( preg_match( '/^(\d+(?:\.\d+)?)(M|MB|G|GB|T|TB)?$/', $size, $m ) ) {
			$value = (float) $m[1];
			$unit  = rtrim( $m[2] ?? 'M', 'B' );

			return (int) round( $value * ( $multipliers[ $unit ] ?? 1 ) );
		}

		// Return 0 if the input is not valid
		return 0;
	}

	// --------------------------------------------------

	/**
	 * @param string|null $url
	 *
	 * @return bool
	 */
	public static function isUrl( ?string $url ): bool {
		// Basic URL validation using filter_var
		if ( ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
			return false;
		}

		// Ensure the URL has a valid scheme (http or https)
		$scheme = parse_url( $url, PHP_URL_SCHEME );
		if ( ! in_array( $scheme, [ 'http', 'https' ], true ) ) {
			return false;
		}

		$host = parse_url( $url, PHP_URL_HOST );

		return (bool) filter_var( $host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME );
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
	 * @param $content
	 *
	 * @return false|int
	 */
	public static function isXml( $content ): false|int {
		// Get the first 200 chars of the file to make the preg_match check faster.
		$xml_part = substr( $content, 0, 20 );

		return preg_match( '/<\?xml version="/', $xml_part );
	}

	// --------------------------------------------------

	/**
	 * @param $html
	 *
	 * @return false|int
	 */
	public static function isAmpEnabled( $html ): false|int {
		// Get the first 200 chars of the file to make the preg_match check faster.
		$is_amp = substr( $html, 0, 200 );

		// Checks if the document contains the amp tag.
		return preg_match( '/<html[^>]+(amp|⚡)[^>]*>/u', $is_amp );
	}

	// --------------------------------------------------

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

		// Reconstruct content with valid <script> tags
		return preg_replace_callback( $script_pattern, static function () use ( &$valid_scripts ) {
			return array_shift( $valid_scripts ) ?? '';
		}, $content );
	}

	// --------------------------------------------------

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

	// --------------------------------------------------

	/**
	 * @param string $file
	 *
	 * @return array
	 */
	public static function loadYaml( string $file ): array {
		static $pool = [];
		if ( isset( $pool[ $file ] ) ) {
			return $pool[ $file ];
		}

		if ( ! class_exists( Yaml::class ) ) {
			self::errorLog( 'Symfony YAML missing' );

			return $pool[ $file ] = [];
		}

		try {
			return $pool[ $file ] = Yaml::parseFile( $file );
		} catch ( ParseException $e ) {
			self::errorLog( 'YAML parse error: ' . $e->getMessage() );

			return $pool[ $file ] = [];
		}
	}

	// --------------------------------------------------

    /**
     * @param string $option
     * @param bool $network
     *
     * @return bool
     */
    public static function removeOption( string $option, bool $network = false ): bool {
        $option = strtolower( trim( $option ) );
        if ( empty( $option ) ) {
            return false;
        }

        $site_id   = $network ? 0 : get_current_blog_id();
        $cache_key = "hd_option_{$site_id}_{$option}";

        $removed = $network
            ? delete_site_option( $option )
            : delete_option( $option );

        if ( $removed ) {
            wp_cache_delete( $cache_key, 'hd_option_cache' );
        }

        return $removed;
    }

	// --------------------------------------------------

    /**
     * @param string $option
     * @param mixed $new_value
     * @param bool $network
     * @param int $cache_in_hours
     * @param bool|null $autoload
     *
     * @return bool
     */
    public static function updateOption( string $option, mixed $new_value, bool $network = false, int $cache_in_hours = 12, ?bool $autoload = null ): bool {
        $option = strtolower( trim( $option ) );
        if ( empty( $option ) ) {
            return false;
        }

        $site_id   = $network ? 0 : get_current_blog_id();
        $cache_key = "hd_option_{$site_id}_{$option}";
        $updated   = $network
            ? update_site_option( $option, $new_value )
            : update_option( $option, $new_value, $autoload );

        if ( $updated ) {
            wp_cache_set( $cache_key, $new_value, 'hd_option_cache', $cache_in_hours * HOUR_IN_SECONDS );
        }

        return $updated;
    }

	// --------------------------------------------------

    /**
     * @param string $option
     * @param mixed $default
     * @param bool $network
     * @param int $cache_in_hours
     *
     * @return mixed
     */
    public static function getOption( string $option, mixed $default = false, bool $network = false, int $cache_in_hours = 12 ): mixed {
        $option = strtolower( trim( $option ) );
        if ( empty( $option ) ) {
            return $default;
        }

        $site_id   = $network ? 0 : get_current_blog_id();
        $cache_key = "hd_option_{$site_id}_{$option}";
        $cached    = wp_cache_get( $cache_key, 'hd_option_cache' );
        if ( $cached !== false ) {
            return $cached;
        }

        $value = $network
            ? get_site_option( $option, $default )
            : get_option( $option, $default );

        wp_cache_set( $cache_key, $value, 'hd_option_cache', $cache_in_hours * HOUR_IN_SECONDS );

        // Retrieve the option value
        return $value;
    }

	// --------------------------------------------------

	/**
	 * @param string $mod_name
	 * @param mixed $value
	 * @param int $cache_in_hours
	 *
	 * @return bool
	 */
	public static function setThemeMod( string $mod_name, mixed $value, int $cache_in_hours = 12 ): bool {
		if ( empty( $mod_name ) ) {
			return false;
		}

		$mod_name_lower = strtolower( $mod_name );
		$cache_key      = "hd_theme_mod_{$mod_name_lower}";

		set_theme_mod( $mod_name, $value );
		wp_cache_set( $cache_key, $value, 'hd_theme_mod_cache', $cache_in_hours * HOUR_IN_SECONDS );

		return true;
	}

	// --------------------------------------------------

	/**
	 * @param string|null $mod_name
	 * @param mixed $default
	 * @param int $cache_in_hours
	 *
	 * @return mixed
	 */
	public static function getThemeMod( ?string $mod_name, mixed $default = false, int $cache_in_hours = 12 ): mixed {
		if ( empty( $mod_name ) ) {
			return $default;
		}

		$mod_name_lower = strtolower( $mod_name );
		$cache_key      = "hd_theme_mod_{$mod_name_lower}";
		$cached_value   = wp_cache_get( $cache_key, 'hd_theme_mod_cache' );
		if ( ! empty( $cached_value ) ) {
			return $cached_value;
		}

		$_mod      = get_theme_mod( $mod_name, $default );
		$mod_value = is_ssl() ? str_replace( 'http://', 'https://', $_mod ) : $_mod;

		wp_cache_set( $cache_key, $mod_value, 'hd_theme_mod_cache', $cache_in_hours * HOUR_IN_SECONDS );

		return $mod_value;
	}

	// -------------------------------------------------------------

	/**
	 * @param string $post_type
	 * @param bool $output_object
	 * @param int $cache_in_hours
	 *
	 * @return array|false|mixed|null
	 */
	public static function getCustomPostOption( string $post_type, bool $output_object = false, int $cache_in_hours = 12 ): mixed {
		if ( empty( $post_type ) ) {
			return null;
		}

		$cache_key   = "hd_custom_post_{$post_type}";
		$cached_data = wp_cache_get( $cache_key, 'hd_custom_post_cache' );
		if ( ! empty( $cached_data ) ) {
			return $cached_data;
		}

		$post    = null;
		$post_id = self::getThemeMod( $post_type . '_option_id' );

		if ( (int) $post_id > 0 ) {
			$post = get_post( $post_id );
		}

		// `-1` indicates no post exists; no query necessary.
		if ( ! $post && $post_id !== - 1 ) {
			$custom_query_vars = [
				'post_type'              => $post_type,
				'post_status'            => get_post_stati(),
				'posts_per_page'         => 1,
				'no_found_rows'          => true,
				'cache_results'          => true,
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
				'lazy_load_term_meta'    => false,
			];

			$post = ( new \WP_Query( $custom_query_vars ) )->post ?? null;
			self::setThemeMod( $post_type . '_option_id', $post->ID ?? - 1 );
		}

		if ( $post ) {
			$cached_data = [
				'ID'           => $post->ID,
				'post_title'   => $post->post_title,
				'post_content' => $post->post_content,
				'post_excerpt' => $post->post_excerpt,
			];

			if ( $output_object ) {
				$cached_data = (object) $cached_data;
			}

			wp_cache_set( $cache_key, $cached_data, 'hd_custom_post_cache', $cache_in_hours * HOUR_IN_SECONDS );
		}

		return $cached_data ?? null;
	}

	// -------------------------------------------------------------

	/**
	 * @param string $mixed
	 * @param string $post_type
	 * @param string $code_type
	 * @param bool $encode
	 * @param int $cache_in_hours
	 *
	 * @return array|false|int|\WP_Error
	 */
	public static function updateCustomPostOption( string $mixed, string $post_type, string $code_type, bool $encode = false, int $cache_in_hours = 12 ): \WP_Error|false|int|array {
		if ( empty( $post_type ) || empty( $code_type ) ) {
			return false;
		}

		if ( in_array( $code_type, [ 'css', 'text/css' ] ) ) {
			$mixed = self::extractCss( $mixed );
		}

		if ( in_array( $code_type, [ 'mixed', 'javascript', 'text/javascript', 'text/html' ] ) ) {
			$mixed = self::extractJS( $mixed );
		}

		if ( $encode ) {
			$mixed = base64_encode( $mixed );
		}

		$post_data = [
			'post_type'    => $post_type,
			'post_status'  => 'publish',
			'post_content' => $mixed,
		];

		// Update `post` if it already exists, otherwise create a new one.
		$post = self::getCustomPostOption( $post_type );
		if ( $post && isset( $post['ID'] ) ) {
			$post_data['ID'] = $post['ID'];
			$r               = wp_update_post( wp_slash( $post_data ), true );
		} else {
			$post_data['post_title'] = $post_type . '_post_title';
			$post_data['post_name']  = wp_generate_uuid4();
			$r                       = wp_insert_post( wp_slash( $post_data ), true );

			if ( ! is_wp_error( $r ) ) {
				self::setThemeMod( $post_type . '_option_id', $r );
			}
		}

		if ( is_wp_error( $r ) ) {
			return $r;
		}

		$updated_post = get_post( $r );
		$cache_key    = "hd_custom_post_{$post_type}";
		$cached_data  = [
			'ID'           => $updated_post->ID ?? 0,
			'post_title'   => $updated_post->post_title ?? '',
			'post_content' => $updated_post->post_content ?? '',
			'post_excerpt' => $updated_post->post_excerpt ?? '',
		];

		wp_cache_set( $cache_key, $cached_data, 'hd_custom_post_cache', $cache_in_hours * HOUR_IN_SECONDS );

		return $cached_data;
	}

	// -------------------------------------------------------------

	/**
	 * @param string|null $post_type
	 * @param bool $encode
	 *
	 * @return array|string
	 */
	public static function getCustomPostContent( ?string $post_type, bool $encode = false ): array|string {
		if ( empty( $post_type ) ) {
			return '';
		}

		$post = self::getCustomPostOption( $post_type );
		if ( $post && isset( $post['post_content'] ) ) {
			return $encode ? wp_unslash( base64_decode( $post['post_content'] ) ) : wp_unslash( $post['post_content'] );
		}

		return '';
	}

	// --------------------------------------------------

	/**
	 * @param mixed $string
	 *
	 * @return string|null
	 */
	public static function escAttr( mixed $string ): ?string {
		return esc_attr( self::stripAllTags( $string ) );
	}

	// -------------------------------------------------------------

	/**
	 * @param string $msg
	 * @param bool $autoHide
	 *
	 * @return void
	 */
	public static function messageSuccess( string $msg = 'Values saved', bool $autoHide = false ): void {
		$text  = esc_html__( $msg, ADDONS_TEXTDOMAIN );
		$class = 'notice notice-success is-dismissible' . ( $autoHide ? ' dismissible-auto' : '' );

		printf(
			'<div class="%1$s"><p><strong>%2$s</strong></p><button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></div>',
			self::escAttr( $class ),
			$text
		);
	}

	// -------------------------------------------------------------

	/**
	 * @param string $msg
	 * @param bool $autoHide
	 *
	 * @return void
	 */
	public static function messageError( string $msg = 'Values error', bool $autoHide = false ): void {
		$text  = esc_html__( $msg, ADDONS_TEXTDOMAIN );
		$class = 'notice notice-error is-dismissible' . ( $autoHide ? ' dismissible-auto' : '' );

		printf(
			'<div class="%1$s"><p><strong>%2$s</strong></p><button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></div>',
			self::escAttr( $class ),
			$text
		);
	}

	// --------------------------------------------------

	/**
	 * @return void
	 */
	public static function clearAllCache(): void {
		global $wpdb;

		// Clear all WordPress transients
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_%'" );
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_%'" );
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_site_transient_%'" );
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_site_transient_timeout_%'" );

		// Clear object cache (e.g., Redis or Memcached)
		if ( function_exists( 'wp_cache_flush' ) ) {
			wp_cache_flush();
		}

        // WP-ROCKET
        if ( \function_exists( 'rocket_clean_domain' ) && self::checkPluginActive( 'wp-rocket/wp-rocket.php' ) ) {
            \rocket_clean_domain();
        }

        // FlyingPress
        if ( \class_exists( \FlyingPress\Purge::class ) && self::checkPluginActive( 'flying-press/flying-press.php' ) ) {
             \FlyingPress\Purge::purge_everything();
        }

        // LiteSpeed Cache
        if ( class_exists( \LiteSpeed\Purge::class ) && self::checkPluginActive( 'litespeed-cache/litespeed-cache.php' ) ) {
             \LiteSpeed\Purge::purge_all();
        }

        // W3 Total Cache
        if ( \function_exists( 'w3tc_flush_all' ) && self::checkPluginActive( 'w3-total-cache/w3-total-cache.php' ) ) {
             \w3tc_flush_all();
        }

        // WP Super Cache
        if ( \function_exists( 'wp_cache_clear_cache' ) && self::checkPluginActive( 'wp-super-cache/wp-cache.php' ) ) {
             \wp_cache_clear_cache();
        }

        // Swift Performance
        if ( self::checkPluginActive( 'swift-performance/performance.php' ) ) {
            do_action( 'swift_performance_clear_cache' );
        }

        // NitroPack
        if ( \class_exists( \NitroPack\SDK\NitroPack::class ) && self::checkPluginActive( 'nitropack/main.php' ) ) {
            try {
                $nitro = \NitroPack\SDK\NitroPack::getInstance();
                $nitro->purgeCache();
            } catch ( \Exception $e ) {
            }
        }

        // Hummingbird
        if ( self::checkPluginActive( 'hummingbird-performance/wp-hummingbird.php' ) ) {
            do_action( 'wphb_clear_cache' );
        }
	}

	// --------------------------------------------------

	/**
	 * @param $slug
	 * @param bool $removeSymbols
	 *
	 * @return string
	 */
	public static function capitalizedSlug( $slug, bool $removeSymbols = true ): string {
		$words = preg_split( '/[_-]/', (string) $slug );
		$words = array_map( 'ucfirst', $words );
		if ( $removeSymbols ) {
			return implode( '', $words );
		}

		return str_contains( $slug, '_' ) ? implode( '_', $words ) : implode( '-', $words );
	}

	// --------------------------------------------------

	public static function serverIpAddress(): string {
		// Check for SERVER_ADDR first
		if ( ! empty( $_SERVER['SERVER_ADDR'] ) ) {
			return $_SERVER['SERVER_ADDR'];
		}

		$hostname = gethostname();
		$ipv4     = gethostbyname( $hostname );

		// Validate and return the IPv4 address
		if ( filter_var( $ipv4, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
			return $ipv4;
		}

		// Get the IPv6 address using dns_get_record
		$dnsRecords = dns_get_record( $hostname, DNS_AAAA );
		if ( ! empty( $dnsRecords ) ) {
			foreach ( $dnsRecords as $record ) {
				if ( isset( $record['ipv6'] ) && filter_var( $record['ipv6'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV6 ) ) {
					return $record['ipv6'];
				}
			}
		}

		// Return a default IP address if none found
		return '127.0.0.1';
	}

	// --------------------------------------------------

	public static function ipAddress(): string {
		// Check for CloudFlare's connecting IP
		if ( isset( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
			return $_SERVER['HTTP_CF_CONNECTING_IP'];
		}

		// Check for forwarded IP (proxy) and get the first valid IP
		if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			foreach ( explode( ',', $_SERVER['HTTP_X_FORWARDED_FOR'] ) as $ip ) {
				$ip = trim( $ip );
				if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
					return $ip;
				}
			}
		}

		// Check for client IP
		if ( isset( $_SERVER['HTTP_CLIENT_IP'] ) && filter_var( $_SERVER['HTTP_CLIENT_IP'], FILTER_VALIDATE_IP ) ) {
			return $_SERVER['HTTP_CLIENT_IP'];
		}

		// Fallback to a remote address
		if ( isset( $_SERVER['REMOTE_ADDR'] ) && filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP ) ) {
			return $_SERVER['REMOTE_ADDR'];
		}

		// Fallback to localhost IP
		return '127.0.0.1';
	}

	/**
	 * Check if a plugin is installed by getting all plugins from the plugins dir
	 *
	 * @param string $plugin_file
	 *
	 * @return bool
	 */
	public static function checkPluginInstalled( string $plugin_file ): bool {
		// Ex: 'woocommerce/woocommerce.php'
		$path = WP_PLUGIN_DIR . '/' . ltrim( $plugin_file, '/' );
		if ( file_exists( $path ) ) {
			return true;
		}

		// check mu-plugins
		if ( defined( 'WPMU_PLUGIN_DIR' ) ) {
			$mu_candidate = WPMU_PLUGIN_DIR . '/' . basename( $plugin_file );
			if ( file_exists( $mu_candidate ) ) {
				return true;
			}
		}

		return false;
	}

	// -------------------------------------------------------------

	private static function _ensurePlugin(): void {
		if ( ! \function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
	}

	// -------------------------------------------------------------

	/**
	 * Check if the plugin is activated
	 *
	 * @param string $plugin_file
	 *
	 * @return bool
	 */
	public static function checkPluginActive( string $plugin_file ): bool {
		if ( is_multisite() && is_plugin_active_for_network( $plugin_file ) ) {
			return true;
		}

        self::_ensurePlugin();

		return is_plugin_active( $plugin_file );
	}

	// -------------------------------------------------------------

    /**
     * @param string $plugin_file
     *
     * @return bool
     */
    public static function checkNetworkActive( string $plugin_file ): bool {
        if ( ! is_multisite() ) {
            return false;
        }

        return is_plugin_active_for_network( $plugin_file );
    }

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
	public static function isClassicEditorActive(): bool {
		if ( \class_exists( \Classic_Editor::class ) ) {
			return true;
		}

		return self::checkPluginActive( 'classic-editor/classic-editor.php' );
	}

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
	public static function isWoocommerceActive(): bool {
        if ( function_exists( 'WC' ) || class_exists( \WooCommerce::class ) ) {
            return true;
        }

		return self::checkPluginActive( 'woocommerce/woocommerce.php' );
	}

	// -------------------------------------------------------------

    public static function isAcfActive(): bool {
        if ( function_exists( 'acf' ) || class_exists( \ACF::class ) ) {
            return true;
        }

        return self::checkPluginActive( 'advanced-custom-fields-pro/acf.php' )
               || self::checkPluginActive( 'advanced-custom-fields/acf.php' );
    }

	// -------------------------------------------------------------

    public static function isAcfProActive(): bool {
        if ( defined( 'ACF_PRO' ) || class_exists( \acf_pro::class ) ) {
            return true;
        }

        return self::checkPluginActive( 'advanced-custom-fields-pro/acf.php' );
    }

	// -------------------------------------------------------------

    public static function isPolylangActive(): bool {
        if ( defined( 'POLYLANG' ) || defined( 'POLYLANG_PRO' ) ) {
            return true;
        }

        return self::checkPluginActive( 'polylang/polylang.php' )
               || self::checkPluginActive( 'polylang-pro/polylang.php' );
    }

	// -------------------------------------------------------------

    public static function isRankMathActive(): bool {
        if ( class_exists( \RankMath::class ) ) {
            return true;
        }

        return self::checkPluginActive( 'seo-by-rank-math/rank-math.php' );
    }

	// -------------------------------------------------------------

    public static function isCf7Active(): bool {
        if ( defined( 'WPCF7_PLUGIN_BASENAME' ) || class_exists( \WPCF7::class ) ) {
            return true;
        }

        return self::checkPluginActive( 'contact-form-7/wp-contact-form-7.php' );
    }

	// -------------------------------------------------------------

	/**
	 * @param $name
	 * @param mixed $default
	 *
	 * @return array|mixed
	 */
	public static function filterSettingOptions( $name, mixed $default = [] ): mixed {
		$filters = apply_filters( 'hd_settings_filter', self::themeSettingDefault() );

		if ( isset( $filters[ $name ] ) ) {
			return $filters[ $name ] ?: $default;
		}

		return $default;
	}

	// -------------------------------------------------------------

	/**
	 * @return array
	 */
	public static function themeSettingDefault(): array {
		return apply_filters( 'hd_settings_defaults', [
			//
			// Aspect Ratio.
			//
			'aspect_ratio'     => [
				'post_type_term'       => [
					'post',
				],
				'aspect_ratio_default' => [
					'1-1',
					'2-1',
					'3-2',
					'4-3',
					'16-9',
					'21-9',
				],
			],

			//
			// Admin menu sidebar
			//
			'admin_menu'       => [
				// ignore user
				'admin_hide_menu_ignore_user' => [ 1 ],
			],

			//
			// lazyLoad
			//
			'lazyload_exclude' => [
				'no-lazy',
				'skip-lazy',
				'custom-logo',
			],

			//
			// security
			//
			'security'         => [
				// Allowlist IPs Login Access
				'allowlist_ips_login_access'          => [],

				// Blocked IPs Access
				'blocked_ips_login_access'            => [],

				// IDs of users allowed changing custom-login, OTP settings v.v...
				'privileged_user_ids'                 => [ 1 ],

				// List of admin IDs allowed to show 'hd-addons' plugins.
				'allowed_users_ids_show_plugins'      => [ 1 ],

				// List of admin IDs allowed installing plugins.
				'allowed_users_ids_install_plugins'   => [ 1 ],

				// List of user IDs that are not allowed to be deleted.
				'disallowed_users_ids_delete_account' => [ 1 ],
			],

			//
			// Add more default settings here as needed.
			//

		] );
	}

	// -------------------------------------------------------------

	/**
	 * @return mixed
	 */
	public static function manifest(): mixed {
        static $cache = [];

        $manifest_base = rtrim( ADDONS_PATH, '/\\' ) . '/assets/';
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
            self::errorLog( '[manifest] JSON decode error at ' . $manifest_path . ': ' . $data->get_error_message() );

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
        set_transient( $transient_key, [ 'mtime' => $file_mtime, 'data' => $filtered ], DAY_IN_SECONDS );

        return $cache[ $key ] = $filtered;
	}

	// -------------------------------------------------------------

	/**
	 * Resolve a single entry from Vite manifest.
	 *
	 * @param string|null $entry \Ex: 'addon.js', 'login.css', 'vendor.js', 'vendor.css'.
	 * @param string $handle_prefix
	 *
	 * @return array
	 */
	public static function manifestResolve( ?string $entry = null, string $handle_prefix = 'addon-' ): array {
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
                        'src'    => ADDONS_URL . 'assets/' . $file,
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
                        'src'    => ADDONS_URL . 'assets/' . $file,
                        'file'   => $v['src'] ?? '',
                    ];
                }
            }

            // fallback
            foreach ( $manifest as $k => $v ) {
                if ( ! empty( $v['css'][0] ) && preg_match( '/^_?vendor\..+\.js$/', $k ) ) {
                    return $resolveCache[ $key ] = [
                        'handle' => $makeHandle( 'vendor', 'css' ),
                        'src'    => ADDONS_URL . 'assets/' . $v['css'][0],
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
            return $resolveCache[ $key ] = [];
        }

        // --- JS entry ---
        if ( $isJs ) {
            $handle = $makeHandle( $baseSlug, 'js' );

            if ( ! empty( $found['file'] ) ) {
                return $resolveCache[ $key ] = [
                    'handle'  => $handle,
                    'src'     => ADDONS_URL . 'assets/' . $found['file'],
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
                    'src'    => ADDONS_URL . 'assets/' . $found['css'][0],
                    'file'   => $found['src'] ?? '',
                ];
            }

            if ( ! empty( $found['file'] ) ) {
                return $resolveCache[ $key ] = [
                    'handle' => $handle,
                    'src'    => ADDONS_URL . 'assets/' . $found['file'],
                    'file'   => $found['src'] ?? '',
                ];
            }
        }

        return $resolveCache[ $key ] = [];
	}

	// -------------------------------------------------------------

    /**
     * @param string $path
     *
     * @return string
     */
    public static function normalizePath( string $path ): string {
        $path  = str_replace( '\\', '/', $path );
        $parts = explode( '/', $path );
        $stack = [];

        foreach ( $parts as $part ) {
            if ( $part === '' || $part === '.' ) {
                continue;
            }
            if ( $part === '..' ) {
                if ( ! empty( $stack ) ) {
                    array_pop( $stack );
                }
            } else {
                $stack[] = $part;
            }
        }

        $normalized = implode( '/', $stack );

        if ( preg_match( '/^[A-Za-z]:/', $path ) ) {
            return $normalized;
        }

        if ( str_starts_with( $path, '/' ) ) {
            return '/' . $normalized;
        }

        return $normalized;
    }

	// -------------------------------------------------------------
}
