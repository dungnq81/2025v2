<?php

namespace HD\Core\Frontend;

use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

/**
 * Hook Class
 *
 * @author Gaudev
 */
final class Hook {
    use Singleton;

    /* ---------- CONSTRUCT ----------------------------------------------- */

    private function init(): void {

        // -----------------------------------------------
        // wp_head
        // -----------------------------------------------
        add_action( 'wp_head', [ $this, 'wp_head_action' ], 1 );
        add_action( 'wp_head', [ $this, 'other_head_action' ], 9 );
        add_action( 'wp_head', [ $this, 'external_fonts_action' ], 99 );

        // -----------------------------------------------
        // hd_header_before_action
        // -----------------------------------------------
        add_action( 'hd_header_before_action', [ $this, 'skip_to_content_link_action' ], 2 );
        add_action( 'hd_header_before_action', [ $this, 'off_canvas_menu_action' ], 11 );

        // -----------------------------------------------
        // hd_header_action
        // -----------------------------------------------
        add_action( 'hd_header_action', [ $this, 'construct_header_action' ], 10 );

        add_action( 'masthead', [ $this, '_masthead_top_header' ], 12 );
        add_action( 'masthead', [ $this, '_masthead_header' ], 13 );
        add_action( 'masthead', [ $this, '_masthead_bottom_header' ], 14 );
        add_action( 'masthead', [ $this, '_masthead_custom' ], 98 );

        // -----------------------------------------------
        // hd_header_after_action
        // -----------------------------------------------

        // -----------------------------------------------
        // hd_site_content_before_action
        // -----------------------------------------------

        // -----------------------------------------------
        // wp_footer
        // -----------------------------------------------
        add_action( 'wp_footer', [ $this, 'wp_footer_action' ], 32 );
        add_action( 'wp_footer', [ $this, 'wp_footer_custom_js_action' ], 99 );

        // -----------------------------------------------
        // hd_footer_after_action
        // -----------------------------------------------

        // -----------------------------------------------
        // hd_footer_action
        // -----------------------------------------------
        add_action( 'hd_footer_action', [ $this, 'construct_footer_action' ], 10 );

        add_action( 'construct_footer', [ $this, '_construct_footer_columns' ], 10 );
        add_action( 'construct_footer', [ $this, '_construct_footer_credit' ], 11 );
        add_action( 'construct_footer', [ $this, '_construct_footer_custom' ], 98 );

        // -----------------------------------------------
        // hd_footer_before_action
        // -----------------------------------------------

        // -----------------------------------------------
        // hd_site_content_after_action
        // -----------------------------------------------

        // -----------------------------------------------
        // wp_enqueue_scripts
        // -----------------------------------------------
        add_action( 'wp_enqueue_scripts', [ $this, 'custom_css_action' ], 99 );

        // --------------------------------------------------
        // enqueue_assets_extra
        // --------------------------------------------------
        add_action( 'enqueue_assets_extra', static function () {} );

        // --------------------------------------------------
        // `template-page-home.php` file
        // --------------------------------------------------
        add_action( 'enqueue_assets_template_page_home', static function () {
            $version = \HD_Helper::version();

            \HD_Asset::enqueueCSS( 'partials/home.scss', [ \HD_Asset::handle( 'index.scss' ) ], $version );
            \HD_Asset::enqueueJS( 'components/home.js', [ \HD_Asset::handle( 'index.js' ) ], $version, true, [ 'module', 'defer' ] );
        } );
    }

    /* ---------- PUBLIC -------------------------------------------------- */

    public function wp_head_action(): void {
        echo '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
        echo '<meta name="format-detection" content="telephone=no,email=no,address=no">';

//        if ( is_singular() && pings_open() ) {
//            printf( '<link rel="pingback" href="%s" />', esc_url( get_bloginfo( 'pingback_url' ) ) );
//        }
    }

    // -----------------------------------------------

    public function other_head_action(): void {
        // manifest.json
        if ( is_file( ABSPATH . 'manifest.json' ) ) {
            printf( '<link rel="manifest" href="%s" />', esc_url( home_url( 'manifest.json' ) ) );
        }

        // Theme color
        $theme_color = \HD_Helper::getThemeMod( 'theme_color_setting' );
        if ( $theme_color ) {
            printf( '<meta name="theme-color" content="%s" />', \HD_Helper::escAttr( $theme_color ) );
        }
    }

    // -----------------------------------------------

    public function external_fonts_action(): void {
        echo <<<HTML
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        HTML;
    }

    // -----------------------------------------------

    public function skip_to_content_link_action(): void {
        printf(
                '<a class="screen-reader-text skip-link" href="#site-content" title="%1$s">%2$s</a>',
                esc_attr__( 'Skip to content', TEXT_DOMAIN ),
                esc_html__( 'Skip to content', TEXT_DOMAIN )
        );
    }

    // -----------------------------------------------

    public function off_canvas_menu_action(): void {
        \HD_Helper::blockTemplate( 'parts/blocks/off-canvas', [], true );
    }

    // -----------------------------------------------

    public function construct_header_action(): void {
        /**
         * @see self::_masthead_top_header - 12
         * @see self::_masthead_header - 13
         * @see self::_masthead_bottom_header - 14
         * @see self::_masthead_custom - 98
         */
        do_action( 'masthead' );
    }

    // -----------------------------------------------

    public function _masthead_top_header(): void {}

    // -----------------------------------------------

    public function _masthead_header(): void {
        ?>
        <div id="masthead" class="masthead">
            <div class="container gap fluid flex flex-x">
                <?php echo \HD_Helper::siteTitleOrLogo(); ?>
                <div class="masthead-content">
                    <?php \HD_Helper::blockTemplate( 'parts/blocks/language-menu', [], true ); ?>
                    <?= \HD_Helper::doShortcode( 'off_canvas_button', [ 'hide_if_desktop' => 0 ] ) ?>
                </div>
            </div>
        </div>
        <?php
    }

    // -----------------------------------------------

    public function _masthead_bottom_header(): void {}

    // -----------------------------------------------

    public function _masthead_custom(): void {}

    // -----------------------------------------------

    public function wp_footer_action(): void {
        if ( apply_filters( 'hd_back_to_top_filter', true ) ) {
            echo apply_filters(
                    'hd_back_to_top_output_filter',
                    sprintf(
                            '<a title="%1$s" aria-label="%1$s" rel="nofollow" href="#" class="js-back-to-top c-flex-center right-3 bottom-18 fixed z-[999] w-7 h-7 border rounded opacity-0 transition-opacity duration-300 data-[show=true]:opacity-100" data-show="false" data-scroll-speed="%2$s" data-scroll-start="%3$s">%4$s</a>',
                            esc_attr__( 'Scroll back to top', TEXT_DOMAIN ),
                            absint( apply_filters( 'hd_back_to_top_scroll_speed_filter', 400 ) ),
                            absint( apply_filters( 'hd_back_to_top_scroll_start_filter', 300 ) ),
                            '<svg class="w-6 h-6 relative block -rotate-90" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0z" fill="currentColor"></path></g></svg>'
                    )
            );
        }
    }

    // -----------------------------------------------

    public function construct_footer_action(): void {
        /**
         * @see self::_construct_footer_columns - 10
         * @see self::_construct_footer_credit - 11
         * @see self::_construct_footer_custom - 98
         */
        do_action( 'construct_footer' );
    }

    // -----------------------------------------------

    public function _construct_footer_columns(): void {
        $footer_cta     = \HD_Helper::getField( 'footer_cta', 'option' );
        $footer_content = \HD_Helper::getField( 'footer_content', 'option' );
        $lg             = \HD_Helper::currentLanguage();

        $footer_cta_title = $footer_cta[ 'gr_title_' . $lg ] ?? '';
        $footer_menu_1    = $footer_content[ 'footer_menu_1_' . $lg ] ?? [];
        $footer_menu_2    = $footer_content[ 'footer_menu_2_' . $lg ] ?? [];

        ?>
        <div id="footer-columns" class="footer-columns">
            <?php if ( $footer_cta_title ) : ?>
            <div class="footer-cta">
                <div class="container fluid">
                    <div class="cta"><?= $footer_cta_title ?></div>
                </div>
            </div>
            <?php endif; ?>
            <div class="footer-content">
                <div class="container fluid flex flex-y">

                    <?= \HD_Helper::siteLogo( 'alt', 'footer-logo' ) ?>

                    <?php
                    foreach ( [ $footer_menu_1, $footer_menu_2 ] as $key => $menu ) :
                        if ( ! empty( $menu ) ) :
                        ?>
                        <div class="menu-<?= $key ?>">
                            <div class="footer-menu"><?= wp_nav_menu( [ 'menu' => $menu, 'echo' => false ] ) ?></div>
                        </div>
                        <?php endif; endforeach; ?>

                    <div class="social-links">
                        <span class="txt !hidden"><?= __( 'Social links', TEXT_DOMAIN ) ?></span>
                        <?= \HD_Helper::doShortcode( 'social_menu' ) ?>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    // -----------------------------------------------

    public function _construct_footer_credit(): void {
        ?>
        <div id="footer-credit" class="footer-credit">
            <div class="container flex flex-x gap">
                <?php

                $footer_credit = \HD_Helper::getThemeMod( 'footer_credit_setting' );
                $footer_credit = ! empty( $footer_credit ) ? esc_html( $footer_credit ) : '&copy; ' . date( 'Y' ) . ' ' . get_bloginfo( 'name' ) . '. ' . esc_html__( 'All rights reserved.', TEXT_DOMAIN );

                ?>
                <div class="cell left">
                    <?php echo \HD_Helper::doShortcode( 'horizontal_menu', [ 'location' => 'policy-nav', 'depth'    => 1 ] ); ?>
                </div>
                <div class="cell right">
                    <p class="copyright"><?php echo apply_filters( 'hd_footer_credit_filter', $footer_credit ); ?></p>
                </div>
            </div>
        </div>
        <?php
    }

    // -----------------------------------------------

    public function _construct_footer_custom(): void {}

    // -----------------------------------------------

    public function wp_footer_custom_js_action(): void {
        ob_start();

        //-------------------------------------------------
        // Single page
        //-------------------------------------------------

        if ( is_single() && $ID = get_the_ID() ) :
        ?>
        <script>
            document.addEventListener('DOMContentLoaded', async () => {
                let postID = <?= $ID ?>;
                const dateEl = document.querySelector('section.singular .meta>.date');
                const viewsEl = document.querySelector('section.singular .meta>.views');

                if (!postID || !dateEl || !viewsEl) {
                    return;
                }

                if (typeof window.hdConfig !== 'undefined') {
                    const endpointURL = window.hdConfig.restApiUrl + 'single/track_views';
                    try {
                        const resp = await fetch(endpointURL, {
                            method: 'POST',
                            credentials: 'same-origin',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-WP-Nonce': window.hdConfig.restToken,
                            },
                            body: JSON.stringify({id: postID})
                        });
                        const json = await resp.json();
                        if (json.success) {
                            if (dateEl) dateEl.textContent = json.date;
                            if (viewsEl) viewsEl.textContent = json.views;
                        }
                    } catch (err) {}
                }
            });
        </script>
        <?php endif;

        //-------------------------------------------------
        // Homepage
        //-------------------------------------------------

        //...

        $content = ob_get_clean();
        if ( $content ) {
            echo \HD_Helper::JSMinify( $content, true );
        }
    }

    // -----------------------------------------------

    /**
     * @return void
     * @throws \JsonException
     */
    public function custom_css_action(): void {
        $css = new \HD_CSS();

        //-------------------------------------------------
        // Breadcrumb
        //-------------------------------------------------

        $object = get_queried_object();

        $breadcrumb_max     = \HD_Helper::getThemeMod( 'breadcrumb_max_height_setting', 0 );
        $breadcrumb_min     = \HD_Helper::getThemeMod( 'breadcrumb_min_height_setting', 0 );
        $breadcrumb_bgcolor = \HD_Helper::getThemeMod( 'breadcrumb_bgcolor_setting' );

        if ( $breadcrumb_max > 0 || $breadcrumb_min > 0 || $breadcrumb_bgcolor ) {
            $css->set_selector( '.section.section-breadcrumb' );
        }

        $breadcrumb_min && $css->add_property( 'min-height', $breadcrumb_min . 'px !important' );
        $breadcrumb_max && $css->add_property( 'max-height', $breadcrumb_max . 'px !important' );
        $breadcrumb_bgcolor && $css->add_property( 'background-color', $breadcrumb_bgcolor . ' !important' );

        $breadcrumb_title_color = \HD_Helper::getField( 'breadcrumb_title_color', $object ) ?: \HD_Helper::getThemeMod( 'breadcrumb_color_setting' );
        if ( $breadcrumb_title_color ) {
            $css->set_selector( '.section.section-breadcrumb .breadcrumb-title' )
                ->add_property( 'color', $breadcrumb_title_color . ' !important' );
        }

        // -----------------------------------------------

        $css_output = $css->css_output();
        if ( $css_output ) {
            \HD_Asset::inlineStyle( \HD_Asset::handle( 'index.scss' ), $css_output );
        }
    }

    // -----------------------------------------------
}
