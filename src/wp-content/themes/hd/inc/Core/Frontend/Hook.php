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
        if ( file_exists( ABSPATH . 'manifest.json' ) ) {
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

    public function _masthead_top_header(): void {
        ?>
        <div class="top-header">
            <div class="u-container flex justify-between items-center py-2 md:py-3 text-sm">

            </div>
        </div>
        <?php
    }

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
                            '<a title="%1$s" aria-label="%1$s" rel="nofollow" href="#" class="js-back-to-top c-back-to-top w-7 h-7 right-3 bottom-18" data-show="false" data-scroll-speed="%2$s" data-scroll-start="%3$s">%4$s</a>',
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
        $footer_content = \HD_Helper::getField( 'footer_content', 'option' );
        $lg             = \HD_Helper::currentLanguage();

        $footer_menu_1    = $footer_content[ 'footer_menu_1_' . $lg ] ?? [];
        $footer_menu_2    = $footer_content[ 'footer_menu_2_' . $lg ] ?? [];

        ?>
        <div id="footer-columns" class="footer-columns">
            <div class="footer-cta u-container flex justify-center pt-10 md:pt-15 lg:pt-20">
                <a class="block" href="#" target="_blank" rel="nofollow">
                    <img src="<?= ASSETS_URL . 'img/cta-banner.png' ?>" alt="CTA Banner" class="block max-w-full h-auto" />
                </a>
            </div>
            <div class="u-container py-10 md:py-15 lg:py-20">
                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div class="footer-info grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div class="seo-footer">
                            <?= \HD_Helper::siteLogo( 'alt', 'footer-logo' ) ?>

                            <ul class="footer-address">
                                <li class="flex items-baseline gap-1">
                                    <svg class="relative top-[6px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7 2a2 2 0 0 0-2 2v1a1 1 0 0 0 0 2v1a1 1 0 0 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm3 8a3 3 0 1 1 6 0a3 3 0 0 1-6 0m-1 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1" clip-rule="evenodd" /></svg>
                                    <span>38A Lê Văn Huân, Phường Tân Bình, TP. Hồ Chí Minh</span>
                                </li>
                                <li class="flex items-baseline gap-1">
                                    <svg class="relative top-[6px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.978 4a2.55 2.55 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572c1.68 1.679 3.577 3.018 5.57 3.459c2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.69 2.69 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.69 2.69 0 0 0 0-3.803l-1.21-1.211A2.56 2.56 0 0 0 7.978 4" /></svg>
                                    <a class="c-hover lining-nums" href="tel:0938002776">0938 002 776</a>
                                </li>
                                <li class="flex items-baseline gap-1">
                                    <svg class="relative top-[6px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M2.038 5.61A2 2 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6q0-.18-.03-.352l-.866.65l-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"/><path d="M20.677 4.117A2 2 0 0 0 20 4H4q-.338.002-.642.105l.758.607L12 10.742L19.9 4.7z"/></g></svg>
                                    <?= \HD_Helper::safeMailTo( 'info@webhd.vn', '', [ 'class' => 'c-hover', 'title' => 'Email' ] ) ?>
                                </li>
                            </ul>
                            <div class="social-links">
                                <?= \HD_Helper::doShortcode( 'social_menu', [
                                        'class' => 'social-menu flex gap-4 mt-6 md:gap-6',
                                ] ) ?>
                            </div>
                        </div>
                        <div class="newsletter-footer">
                            <p class="footer-title font-bold uppercase u-heading lg:mb-8">Liên hệ</p>
                            <div class="max-w-md">
                                <p class="text-(--text-color) text-sm/6">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum id, iure consectetur et error hic!</p>
                                <?= \HD_Helper::doShortcode( 'contact-form-7', [
                                        'id'    => "09313bd",
                                        'title' => "Gọi lại tôi"
                                ] ) ?>
                            </div>
                        </div>
                    </div>
                    <div class="footer-menu grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div class="text-left lg:pl-12">
                            <p class="footer-title font-bold uppercase u-heading lg:mb-8">Về chúng tôi</p>
                            <ul class="menu text-[15px] space-y-3">
                                <li><a class="c-hover" href="#">Giới thiệu</a></li>
                                <li><a class="c-hover" href="#">Blog</a></li>
                                <li><a class="c-hover" href="#">Affiliate</a></li>
                                <li><a class="c-hover" href="#">Liên hệ</a></li>
                            </ul>
                        </div>
                        <div class="text-left">
                            <p class="footer-title font-bold uppercase u-heading lg:mb-8">Dịch vụ</p>
                            <ul class="menu text-[15px] space-y-3">
                                <li><a class="c-hover" href="#">Thiết kế Website</a></li>
                                <li><a class="c-hover" href="#">SEO từ khóa Google</a></li>
                                <li><a class="c-hover" href="#">Google Ads</a></li>
                                <li><a class="c-hover" href="#">Facebook Ads</a></li>
                                <li><a class="c-hover" href="#">Hosting</a></li>
                                <li><a class="c-hover" href="#">Domain</a></li>
                                <li><a class="c-hover" href="#">Email doanh nghiệp</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    // -----------------------------------------------

    public function _construct_footer_credit(): void {
        ?>
        <div id="footer-credit" class="c-light-bg py-4 mb-8">
            <div class="u-container text-center p-fs-clamp-[12,14] md:flex md:flex-wrap md:justify-between md:items-center md:gap-3">
                <?php

                $footer_credit = \HD_Helper::getThemeMod( 'footer_credit_setting' );
                $footer_credit = ! empty( $footer_credit ) ? esc_html( $footer_credit ) : '&copy; ' . date( 'Y' ) . ' ' . get_bloginfo( 'name' ) . '. ' . esc_html__( 'All rights reserved.', TEXT_DOMAIN );

                echo \HD_Helper::doShortcode( 'horizontal_menu', [
                        'location'    => 'policy-nav',
                        'depth'       => 1,
                        'extra_class' => 'flex flex-wrap justify-center gap-3 md:gap-6',
                        'link_class'  => 'flex gap-1 flex-row-reverse p-hover hover:text-(--white-color)',
                ] );

                ?>
                <p class="copyright lining-nums"><?php echo apply_filters( 'hd_footer_credit_filter', $footer_credit ); ?></p>
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
