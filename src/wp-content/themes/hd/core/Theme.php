<?php
/**
 * Theme File
 *
 * This file initializes the theme’s core functionality.
 * It defines the main Theme class responsible for setting up theme supports,
 * registering hooks (e.g. after_setup_theme, wp_enqueue_scripts, template_include),
 * and managing global theme behavior.
 *
 * @author Gaudev
 */

namespace HD;

use HD\Admin\Admin;
use HD\Admin\MetaBox;
use HD\API\API;
use HD\Events\Event;
use HD\Integration\ACF\ACF;
use HD\Integration\WooCommerce\WooCommerce;
use HD\Services\Service;
use HD\Utilities\Asset;
use HD\Utilities\Helper;
use HD\Utilities\Shortcode\Shortcode;
use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || exit;

final class Theme {
    use Singleton;

    /* ---------- CONSTRUCT ---------------------------------------- */

    private function init(): void {
        // wp-config.php -> muplugins_loaded -> plugins_loaded -> setup_theme -> after_setup_theme -> init (rest_api_init, widgets_init, v.v...)
        // FE: init -> wp_loaded -> wp -> template_redirect -> template_include -> v.v...
        // BE: init -> wp_loaded -> admin_menu -> admin_init -> v.v...

        add_action( 'after_setup_theme', [ $this, 'setupTheme' ] );
        add_action( 'after_setup_theme', [ $this, 'setup' ], 11 );

        add_action( 'widgets_init', [ $this, 'unregisterWidgets' ], 11 );
        add_action( 'widgets_init', [ $this, 'registerWidgets' ], 11 );

        add_action( 'wp_enqueue_scripts', [ $this, 'enqueueAssets' ] );
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
        if ( is_admin() ) {
            ( Admin::get_instance() );
            ( MetaBox::get_instance() );
        }

        ( API::get_instance() );
        ( Shortcode::get_instance() );
        ( Service::get_instance() );
        ( Event::get_instance() );

        Helper::isAcfActive() && ACF::get_instance();
        Helper::isWoocommerceActive() && WooCommerce::get_instance();
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
        remove_action( 'wp_head', [ $wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style', ] );

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
        $widgets_dir = __DIR__ . DIRECTORY_SEPARATOR . 'Utilities' . DIRECTORY_SEPARATOR . 'Widgets';
        $FQN         = '\\HD\\Utilities\\Widgets\\';

        Helper::createDirectory( $widgets_dir );
        Helper::FQNLoad( $widgets_dir, false, true, $FQN, true );
    }

    // --------------------------------------------------

    /**
     * Enqueue scripts and styles
     *
     * @return void
     */
    public function enqueueAssets(): void {
        $version           = Helper::version();
        $recaptcha_options = Helper::getOption( 'recaptcha__options' );
        $l10n              = [
            'ajaxUrl'    => admin_url( 'admin-ajax.php', 'relative' ),
            'baseUrl'    => Helper::siteURL( '/' ),
            'themeUrl'   => THEME_URL,
            'restApiUrl' => RESTAPI_URL,
            'csrfToken'  => wp_create_nonce( 'wp_csrf_token' ),
            'restToken'  => wp_create_nonce( 'wp_rest' ),
            'lg'         => Helper::currentLanguage(),
            'lang'       => [ 'view_more' => __( 'Xem thêm', TEXT_DOMAIN ) ],
        ];

        ! empty( $recaptcha_options['recaptcha_v2_site_key'] ) && $l10n['reCaptcha_v2'] = $recaptcha_options['recaptcha_v2_site_key'];
        ! empty( $recaptcha_options['recaptcha_v3_site_key'] ) && $l10n['reCaptcha_v3'] = $recaptcha_options['recaptcha_v3_site_key'];

        if ( Helper::isWoocommerceActive() ) {
            $l10n['wcAjaxUrl']             = Helper::home( '/?wc-ajax=%%endpoint%%' );
            $l10n['lang']['added_to_cart'] = __( 'Đã thêm vào giỏ hàng', TEXT_DOMAIN );
        }

        /** Inline Js */
        Asset::localize( 'jquery-core', 'hdConfig', $l10n );
        Asset::inlineScript( 'jquery-core', 'Object.assign(window,{ $:jQuery,jQuery });' );

        /** CSS */
        Asset::enqueueCSS( 'vendor.css', [], $version );
        Asset::enqueueCSS( 'index.scss', [ Asset::handle( 'vendor.css' ) ], $version );
        Asset::enqueueCSS( 'extra.scss', [ Asset::handle( 'index.scss' ) ], $version );

        /** JS */
        Asset::enqueueJS( 'preflight.js', [], $version, false );
        Asset::enqueueJS( 'index.js', [ 'jquery-core' ], $version, true, [ 'module', 'defer' ] );
        Asset::enqueueJS( 'extra.js', [ Asset::handle( 'index.js' ) ], $version, true, [ 'module', 'defer' ] );

        /** COMPONENTS */
        Asset::enqueueJS( 'components/swiper.js', [ Asset::handle( 'index.js' ) ], $version, true, [ 'module', 'defer' ] );
        Asset::enqueueJS( 'components/fancybox.js', [ Asset::handle( 'index.js' ) ], $version, true, [ 'module', 'defer' ] );
        Asset::enqueueJS( 'components/social-share.js', [ Asset::handle( 'index.js' ) ], $version, true, [ 'module', 'defer' ] );

        /** Comments */
        if ( is_singular() && comments_open() && Helper::getOption( 'thread_comments' ) ) {
            wp_enqueue_script( 'comment-reply' );
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
        // dump( $template );

        $info      = pathinfo( $template );
        $filename  = $info['filename'];
        $extension = strtolower( $info['extension'] ?? '' );

        if ( $extension !== 'php' || ! str_starts_with( $filename, 'template-' ) ) {
            return $template;
        }

        // Remove 'template-'
        $template_slug = substr( $filename, strlen( 'template-' ) );
        $hook_name     = 'enqueue_assets_template_' . sanitize_key( str_replace( '-', '_', $template_slug ) );

        if ( ! in_array( $hook_name, $enqueued_hooks, true ) ) {

            // dynamic hook - enqueue style/script
            add_action( 'wp_enqueue_scripts', static function () use ( $template_slug, $hook_name ) {
                $version = Helper::version();

                $scss = "components/templates/{$template_slug}.scss";
                $js   = "components/templates/{$template_slug}.js";
                Asset::enqueueCSS( $scss, [ Asset::handle( 'index.scss' ) ], $version );
                Asset::enqueueJS( $js, [ Asset::handle( 'index.js' ) ], $version, true, [ 'module', 'defer' ] );

                // dynamic hook
                do_action( 'enqueue_assets_template_extra' );
                do_action( $hook_name );
            }, 31 );

            $enqueued_hooks[] = $hook_name;
        }

        return $template;
    }

    // --------------------------------------------------
}
