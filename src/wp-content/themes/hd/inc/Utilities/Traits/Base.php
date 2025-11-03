<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Base {
	// -------------------------------------------------------------

	/**
	 * @param string $msg
	 * @param string $class
	 *
	 * @return void
	 */
	private static function renderNotice( string $msg, string $class ): void {
		$text = esc_html__( $msg, TEXT_DOMAIN );

		printf(
			'<div class="%1$s"><p><strong>%2$s</strong></p><button type="button" class="notice-dismiss"><span class="screen-reader-text">%3$s</span></button></div>',
			esc_attr( $class ),
			$text,
			esc_html__( 'Dismiss this notice.', TEXT_DOMAIN )
		);
	}

	// -------------------------------------------------------------

	/**
	 * @param string $msg
	 * @param bool $autoHide
	 *
	 * @return void
	 */
	public static function messageSuccess( string $msg = 'Values saved', bool $autoHide = false ): void {
		$class = 'notice notice-success is-dismissible' . ( $autoHide ? ' dismissible-auto' : '' );
		self::renderNotice( $msg, $class );
	}

	// -------------------------------------------------------------

	public static function messageError( string $msg = 'Values error', bool $autoHide = false ): void {
		$class = 'notice notice-error is-dismissible' . ( $autoHide ? ' dismissible-auto' : '' );
		self::renderNotice( $msg, $class );
	}

	// -------------------------------------------------------------

	/**
	 * @param string|\WP_Error $message
	 * @param string|int $title
	 * @param string|array|int $args
	 *
	 * @return void
	 */
	public static function wpDie( string|\WP_Error $message = '', string|int $title = '', string|array|int $args = [] ): void {
		// Intentionally calling wp_die as a final error handler.
		wp_die( $message, $title, $args );
	}

	// -------------------------------------------------------------

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

		if ( ! wp_cache_get( $key, 'hd_error_log_cache' ) ) {
			wp_cache_set( $key, 1, 'hd_error_log_cache', MINUTE_IN_SECONDS );

			// Intentionally calling error_log for throttled logging.
			error_log( $message, $type, $dest, $headers );
		}
	}

	// -------------------------------------------------------------

	/**
	 * Check if the current page is using a specific page template.
	 *
	 * @param string|null $template
	 *
	 * @return bool
	 */
	public static function isPageTemplate( ?string $template = null ): bool {
		if ( $template === null || ! is_page() ) {
			return false;
		}

		$current = get_page_template_slug( get_the_ID() );

		return $current !== false && $current === trim( $template );
	}

	// -------------------------------------------------------------

	/**
	 * Check if the current page is a category page and belongs to a specific taxonomy.
	 *
	 * @param string|null $taxonomy
	 *
	 * @return bool
	 */
	public static function isTaxonomy( ?string $taxonomy = null ): bool {
		$obj = get_queried_object();

		if ( ! $obj || empty( $obj->taxonomy ) ) {
			return false;
		}

		return $taxonomy === null || $obj->taxonomy === $taxonomy;
	}

	// --------------------------------------------------

	/**
	 * @param mixed $content
	 *
	 * @return bool
	 */
	public static function isXml( mixed $content ): bool {
		if ( ! is_string( $content ) || $content === '' ) {
			return false;
		}

		return str_starts_with( trim( $content ), '<?xml ' );
	}

	// --------------------------------------------------

	/**
	 * @param string|null $url
	 *
	 * @return bool
	 */
	public static function isUrl( ?string $url ): bool {
		if ( ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
			return false;
		}

		$scheme = parse_url( $url, PHP_URL_SCHEME );
		if ( ! in_array( $scheme, [ 'http', 'https' ], true ) ) {
			return false;
		}

		$host = parse_url( $url, PHP_URL_HOST );

		return is_string( $host ) && filter_var( $host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME ) !== false;
	}

	// --------------------------------------------------

	/**
	 * @return bool
	 */
	public static function isMobile(): bool {
		// Fallback to WordPress function
		return wp_is_mobile();
	}

	// --------------------------------------------------

	/**
	 * @param string $version
	 *
	 * @return bool
	 */
	public static function isPhp( string $version = '8.2' ): bool {
		static $cache = [];

		return $cache[ $version ] ??= version_compare( PHP_VERSION, $version, '>=' );
	}

	// --------------------------------------------------

	/**
	 * @param mixed $input
	 *
	 * @return bool
	 */
	public static function isInteger( mixed $input ): bool {
		if ( is_int( $input ) ) {
			return true;
		}

		return is_string( $input ) && filter_var( $input, FILTER_VALIDATE_INT ) !== false;
	}

	// --------------------------------------------------

	/**
	 * @param mixed $value
	 *
	 * @return bool
	 */
	public static function isEmpty( mixed $value ): bool {
		if ( is_string( $value ) ) {
			return trim( $value ) === '';
		}

		// Check for numeric and boolean values, and use empty() for others
		return ! is_numeric( $value ) && ! is_bool( $value ) && empty( $value );
	}

	// -------------------------------------------------------------

	/**
	 * Determines whether the current request is a WP_CLI request.
	 *
	 * This function checks if the WP_CLI constant is defined and true,
	 * indicating that the code is being executed in the context of
	 * the WordPress Command Line Interface.
	 *
	 * @return bool True if the current request is a WP_CLI request, false otherwise.
	 */
	public static function isWpCli(): bool {
		return defined( 'WP_CLI' ) && \WP_CLI;
	}

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
	public static function isAdmin(): bool {
		return is_admin();
	}

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
	public static function isLogin(): bool {
		return isset( $GLOBALS['pagenow'] ) && in_array( $GLOBALS['pagenow'], [ 'wp-login.php', 'wp-register.php' ], true );
	}

	// -------------------------------------------------------------

	/**
	 * @return void
	 */
	private static function ensurePluginFunctions(): void {
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
	}

	// -------------------------------------------------------------

	/**
	 * Check if a plugin is installed by getting all plugins from the plugins dir
	 *
	 * @param string $plugin_file
	 *
	 * @return bool
	 */
	public static function checkPluginInstalled( string $plugin_file ): bool {
		$plugin_file = ltrim( $plugin_file, '/' );
		$path        = WP_PLUGIN_DIR . '/' . $plugin_file;

		if ( file_exists( $path ) ) {
			return true;
		}

		if ( defined( 'WPMU_PLUGIN_DIR' ) ) {
			$mu_path = WPMU_PLUGIN_DIR . '/' . basename( $plugin_file );

			return file_exists( $mu_path );
		}

		return false;
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
		self::ensurePluginFunctions();

		if (
			\function_exists( 'is_plugin_active_for_network' )
			&& \is_multisite()
			&& \is_plugin_active_for_network( $plugin_file )
		) {
			return true;
		}

		return \is_plugin_active( $plugin_file );
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

	/**
	 * @return bool
	 */
	public static function isAcfActive(): bool {
		if ( function_exists( 'acf' ) || class_exists( \ACF::class ) ) {
			return true;
		}

		return self::checkPluginActive( 'advanced-custom-fields-pro/acf.php' )
		       || self::checkPluginActive( 'advanced-custom-fields/acf.php' );
	}

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
	public static function isAcfProActive(): bool {
		if ( defined( 'ACF_PRO' ) || class_exists( \acf_pro::class ) ) {
			return true;
		}

		return self::checkPluginActive( 'advanced-custom-fields-pro/acf.php' );
	}

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
	public static function isPolylangActive(): bool {
		if ( defined( 'POLYLANG' ) || defined( 'POLYLANG_PRO' ) ) {
			return true;
		}

		return self::checkPluginActive( 'polylang/polylang.php' )
		       || self::checkPluginActive( 'polylang-pro/polylang.php' );
	}

	// -------------------------------------------------------------

	/**
	 * @return bool
	 */
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
}
