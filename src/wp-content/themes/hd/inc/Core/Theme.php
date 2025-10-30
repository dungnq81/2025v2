<?php
/**
 * Theme Bootstrap File
 *
 * This file initializes the theme’s core functionality.
 * It defines the main Theme class responsible for setting up theme supports,
 * registering hooks (e.g. after_setup_theme, wp_enqueue_scripts, template_include),
 * and managing global theme behavior.
 *
 * @author Gaudev
 */

namespace HD\Core;

use HD\Core\Admin\Admin;
use HD\Core\Frontend\Hook;
use HD\Core\Frontend\Shortcode;
use HD\Integration\ACF\ACF;
use HD\Integration\WooCommerce\WooCommerce;
use HD\Utilities\Traits\Singleton;
use HD_Asset;
use HD_Helper;

defined( 'ABSPATH' ) || die;

final class Theme {
	use Singleton;

	/* ---------- CONSTRUCT ---------------------------------------- */

	private function init(): void {
		// wp-config.php -> muplugins_loaded -> plugins_loaded -> setup_theme -> after_setup_theme -> init (rest_api_init, widgets_init, v.v...)
		// FE: init -> wp_loaded -> wp -> template_redirect -> template_include -> v.v...
		// BE: init -> wp_loaded -> admin_menu -> admin_init -> v.v...

		/** Setup */
		add_action( 'after_setup_theme', [ $this, 'setupTheme' ] );
		add_action( 'after_setup_theme', [ $this, 'setup' ], 11 );

		/** Init */
		add_action( 'init', [ $this, 'clearCache' ] );
		add_action( 'widgets_init', [ $this, 'unregisterWidgets' ], 11 );
		add_action( 'widgets_init', [ $this, 'registerWidgets' ], 11 );

		/** Enqueue */
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueAssets' ] );

		/** Dynamic Template */
		add_filter( 'template_include', [ $this, 'dynamicTemplateInclude' ], 20 );
	}

	/* ---------- PUBLIC ------------------------------------------- */

	/**
	 * Sets up theme defaults and register support for various WordPress features.
	 *
	 * @return void
	 */
	public function setupTheme(): void {
		load_theme_textdomain( TEXT_DOMAIN, get_template_directory() . '/languages' );

		/** Add theme support for various features. */
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'script' ] );

		add_theme_support( 'align-wide' );
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'editor-styles' );

		/** Enable excerpt to page, page-attributes to post */
		add_post_type_support( 'page', [ 'excerpt' ] );
		add_post_type_support( 'post', [ 'page-attributes' ] );

		/** Set default values for the upload media box */
		update_option( 'image_default_align', 'center' );
		update_option( 'image_default_size', 'large' );

		/** Add support for the core custom logo. */
		add_theme_support( 'custom-logo', [
			'height'               => 240,
			'width'                => 240,
			'flex-height'          => true,
			'flex-width'           => true,
			'header-text'          => '',
			'unlink-homepage-logo' => true,
		] );
	}

	// --------------------------------------------------

	public function setup(): void {
		( Customizer::get_instance() );
		( Optimizer::get_instance() );
		( Ajax::get_instance() );

		if ( HD_Helper::isAdmin() ) {
			( Admin::get_instance() );
		} else {
			( Hook::get_instance() );
			( Shortcode::get_instance() );
		}

		HD_Helper::isAcfActive() && ACF::get_instance();
		HD_Helper::isWoocommerceActive() && WooCommerce::get_instance();
	}

	// --------------------------------------------------

	/**
	 * Enqueue scripts and styles
	 *
	 * @return void
	 */
	public function enqueueAssets(): void {
		$version           = HD_Helper::version();
		$recaptcha_options = HD_Helper::getOption( 'recaptcha__options' );
		$l10n              = [
			'ajaxUrl'   => admin_url( 'admin-ajax.php', 'relative' ),
			'baseUrl'   => HD_Helper::siteURL( '/' ),
			'themeUrl'  => THEME_URL,
			'csrfToken' => wp_create_nonce( 'wp_csrf_token' ),
			'restToken' => wp_create_nonce( 'wp_rest' ),
			'lg'        => HD_Helper::currentLanguage(),
			'lang'      => [ 'view_more' => __( 'Xem thêm', TEXT_DOMAIN ) ]
		];

		if ( defined( 'RESTAPI_URL' ) ) {
			$l10n['restApiUrl'] = RESTAPI_URL;
		}

		if ( HD_Helper::isWoocommerceActive() ) {
			$l10n['wcAjaxUrl']             = HD_Helper::home( '/?wc-ajax=%%endpoint%%' );
			$l10n['lang']['added_to_cart'] = __( 'Đã thêm vào giỏ hàng', TEXT_DOMAIN );
		}

		if ( ! empty( $recaptcha_options['recaptcha_v2_site_key'] ) ) {
			$l10n['reCaptcha_v2'] = $recaptcha_options['recaptcha_v2_site_key'];
		}

		if ( ! empty( $recaptcha_options['recaptcha_v3_site_key'] ) ) {
			$l10n['reCaptcha_v3'] = $recaptcha_options['recaptcha_v3_site_key'];
		}

		/** Inline Js */
		HD_Asset::localize( 'jquery-core', 'hdConfig', $l10n );
		HD_Asset::inlineScript( 'jquery-core', 'Object.assign(window,{ $:jQuery,jQuery });' );

		/** CSS */
		HD_Asset::enqueueCSS( 'vendor.css', [], $version );
		HD_Asset::enqueueCSS( 'index.scss', [ HD_Asset::handle( 'vendor.css' ) ], $version );

		/** JS */
		HD_Asset::enqueueJS( 'components/preflight.js', [], $version, false );
		HD_Asset::enqueueJS( 'index.js', [ 'jquery-core' ], $version, true, [ 'module', 'defer' ] );

		/** Comments */
		if ( is_singular() && comments_open() && HD_Helper::getOption( 'thread_comments' ) ) {
			wp_enqueue_script( 'comment-reply' );
		} else {
			wp_dequeue_script( 'comment-reply' );
		}
	}

	// --------------------------------------------------

	/**
	 * @param $template
	 *
	 * @return mixed
	 */
	public function dynamicTemplateInclude( $template ): mixed {
		if ( is_admin() || wp_doing_ajax() || wp_is_json_request() ) {
			return $template;
		}

		static $enqueued_hooks = [];

		// template debug
//		if ( ( defined( 'SHOW_TEMPLATE_FILE' ) && \SHOW_TEMPLATE_FILE === true ) && HD_Helper::development() ) {
//			dump( $template );
//		}

		$info      = pathinfo( $template );
		$filename  = $info['filename'];
		$extension = strtolower( $info['extension'] ?? '' );

		if ( $extension !== 'php' || ! str_starts_with( $filename, 'template-' ) ) {
			return $template;
		}

		// Remove 'template-'
		$_template_slug = substr( $filename, strlen( 'template-' ) );
		$hook_name      = 'enqueue_assets_template_' . sanitize_key( str_replace( '-', '_', $_template_slug ) );

		if ( ! in_array( $hook_name, $enqueued_hooks, true ) ) {

			// dynamic hook - enqueue style/script
			add_action( 'wp_enqueue_scripts', static function () use ( $_template_slug, $hook_name ) {
				$version = HD_Helper::version();
				$names   = [ 'extra', $_template_slug ];

				foreach ( $names as $name ) {
					$scss = "partials/template/{$name}.scss";
					$js   = "components/template/{$name}.js";

					HD_Asset::enqueueCSS( $scss, [ HD_Asset::handle( 'index.scss' ) ], $version );
					HD_Asset::enqueueJS( $js, [ HD_Asset::handle( 'index.js' ) ], $version, true, [ 'module', 'defer' ] );
				}

				// dynamic hook
				do_action( 'enqueue_assets_template_extra' );
				do_action( $hook_name );
			}, 31 );

			$enqueued_hooks[] = $hook_name;
		}

		return $template;
	}

	// --------------------------------------------------

	/**
	 * Unregister widgets
	 *
	 * @return void
	 */
	public function unregisterWidgets(): void {
		global $wp_widget_factory;

		// Remove the styling added to the header for recent comments
		remove_action( 'wp_head', [
			$wp_widget_factory->widgets['WP_Widget_Recent_Comments'],
			'recent_comments_style'
		] );

		// Unregister all default WordPress widgets
		foreach ( $wp_widget_factory->widgets as $class => $widget ) {
			unregister_widget( $class );
		}

		// Re-register only specific widgets we want to keep
		// register_widget( 'WP_Widget_Text' );
		// register_widget( 'WP_Widget_Custom_HTML' );
	}

	// --------------------------------------------------

	/**
	 * Registers widgets
	 *
	 * @return void
	 */
	public function registerWidgets(): void {
		$widgets_dir = INC_PATH . 'Utilities/Widgets';
		$FQN         = '\\HD\\Utilities\\Widgets\\';

		HD_Helper::createDirectory( $widgets_dir );
		HD_Helper::FQNLoad( $widgets_dir, false, true, $FQN, true );
	}

	// --------------------------------------------------

	/**
	 * Clear Cache
	 *
	 * @return void
	 */
	public function clearCache(): void {
		if ( isset( $_GET['clear_cache'] ) ) {
			\HD_Helper::clearAllCache();
			set_transient( '_clear_cache_message', __( 'Cache has been successfully cleared.', TEXT_DOMAIN ), 30 );

			echo <<<HTML
                <script>
                    const currentUrl = window.location.href;
                    if (currentUrl.includes('clear_cache=1')) {
                        let newUrl = currentUrl.replace(/([?&])clear_cache=1/, '$1').replace(/&$/, '').replace(/\?$/, '');
                        currentUrl.includes('wp-admin')
                            ? window.location.replace(newUrl)
                            : window.history.replaceState({}, document.title, newUrl);
                    }
                </script>
            HTML;
		}
	}

	// --------------------------------------------------
}
