<?php
/**
 * Theme Hooks
 *
 * This file defines the Hook class, which manages all custom theme hooks and
 * integrates them throughout the template structure — including header, footer,
 * body, and other key theme areas.
 * It centralizes hook registration and execution, allowing for flexible extension
 * and cleaner separation of template logic.
 *
 * @author Gaudev
 */

namespace HD\Core\Frontend;

use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class Hook {
    use Singleton;

    /* ---------- CONSTRUCT ----------------------------------------------- */

    private function init(): void {

        // -----------------------------------------------
        // wp_head
        // -----------------------------------------------
        add_action( 'wp_head', [ $this, 'wp_head_action' ], 1 );
        add_action( 'wp_head', [ $this, 'other_head_action' ], 98 );
        add_action( 'wp_head', [ $this, 'external_fonts_action' ], 99 );

        // -----------------------------------------------
        // hd_header_before_action
        // -----------------------------------------------
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
        add_action( 'wp_footer', [ $this, 'add_cookie_consent' ], 31 );
        add_action( 'wp_footer', [ $this, 'back_to_top' ], 32 );
        add_action( 'wp_footer', [ $this, 'template_svg' ], 33 );
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

        //...
    }

    /* ---------- PUBLIC -------------------------------------------------- */

    public function wp_head_action(): void {
        echo '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
        echo '<meta name="format-detection" content="telephone=no,email=no,address=no">';
    }

    // -----------------------------------------------

    public function other_head_action(): void {
        // Manifest
        if ( file_exists( ABSPATH . 'manifest.json' ) ) {
            printf( '<link rel="manifest" href="%s" />', esc_url( home_url( 'manifest.json' ) ) );
        }

        // Theme color
        $theme_color = \HD_Helper::getThemeMod( 'theme_color_setting' );
        if ( $theme_color ) {
            printf( '<meta name="theme-color" content="%s" />', \HD_Helper::escAttr( $theme_color ) );
        }

        // Preload JS
        \HD_Asset::preload( 'index.js' );
    }

    // -----------------------------------------------

    public function external_fonts_action(): void {
        ?>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <?php
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
        $notices  = \HD_Helper::getField( 'notices', 'option' );
        $post     = get_post( $notices );
        $acf_post = ! empty( $post->ID ) ? \HD_Helper::getFields( $post->ID ) : [];

        $_css = '';
        if ( ! empty( $acf_post['text_color'] ) ) {
            $_css .= 'color:' . $acf_post['text_color'] . ';';
        }
        if ( ! empty( $acf_post['bg_color'] ) ) {
            $_css .= 'background-color:' . $acf_post['bg_color'] . ';';
        }

        $acf_style = $_css ? ' style="' . \HD_Helper::CSSMinify( $_css, true ) . '"' : '';
        $acf_title = $acf_post['title'] ?? '';

        ?>
        <div class="top-header c-light-bg border-t-[0] hidden md:block">
            <div class="u-container u-flex-x justify-between items-center gap-y-1 py-[8px]">
                <?php if ( $post ) : ?>
                <div class="top-items text-[12px]">
                    <div class="flex gap-2 items-center">

                        <?= $acf_title ? '<span class="label rounded-sm px-2"' . $acf_style . '>' . $acf_title . '</span>' : '' ?>

                        <span class="content flex items-center gap-1">
                            <?= get_the_title( $post->ID ) ?> -
                            <a class="flex items-center gap-1" href="<?= get_permalink( $post->ID ) ?>" title="<?= esc_attr__( 'Xem chi tiết', TEXT_DOMAIN ) ?>">
                                <span class="dark:text-(--color-white) font-medium"><?= __( 'Xem chi tiết', TEXT_DOMAIN ) ?></span>
                            </a>
                        </span>
                    </div>
                </div>
                <?php endif; ?>

                <?= \HD_Helper::doShortcode( 'horizontal_menu', [
                        'depth'       => 1,
                        'location'    => 'header-nav',
                        'extra_class' => 'u-flex-x items-center gap-3 lg:gap-6 w-full justify-end md:w-max top-nav p-fs-clamp-[12,13]',
                        'link_class'  => 'js-popup flex items-center gap-1',
                ] ) ?>

            </div>
        </div>
        <?php
    }

    // -----------------------------------------------

    public function _masthead_header(): void {
        $hotline = \HD_Helper::getField( 'hotline', 'option' );

        ?>
        <div class="masthead-placeholder"></div>
        <div id="masthead" class="masthead py-3">
            <div class="u-container flex items-center gap-3">
                <div class="masthead-logo flex-1 lg:grow-0 lg:shrink-0 basis-auto"><?= \HD_Helper::siteTitleOrLogo() ?></div>
                <div class="nav-container pl-8 pr-3">
                    <nav class="nav" id="main-nav">
                        <?= \HD_Helper::doShortcode( 'horizontal_menu', [
                                'location'         => 'main-nav',
                                'extra_class'      => 'u-flex-x gap-6 min-h-[44px]',
                                'link_class'       => 'flex items-center h-full font-bold text-base hover:text-(--text-color-1) dark:hover:text-(--color-white)',
                                'link_depth_class' => 'text-[15px] hover:text-(--text-color-1) dark:hover:text-(--color-white)',
                        ] ) ?>
                    </nav>
                </div>
                <?php if ( $hotline ) : ?>
                <div class="hotline hidden md:block">
                    <?= \HD_Helper::ACFLinkOpen( $hotline, 'c-hotline whitespace-nowrap' ) ?>
                        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.978 4a2.55 2.55 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572c1.68 1.679 3.577 3.018 5.57 3.459c2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.69 2.69 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.69 2.69 0 0 0 0-3.803l-1.21-1.211A2.56 2.56 0 0 0 7.978 4"/></svg>
                        <span><?= \HD_Helper::ACFLinkLabel( $hotline ) ?></span>
                    <?= \HD_Helper::ACFLinkClose( $hotline ) ?>
                </div>
                <?php endif ?>

                <?= \HD_Helper::doShortcode( 'dropdown_search' ) ?>

                <button class="dark-mode" type="button" aria-label="Dark mode">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- // empty --></svg>
                </button>

                <?= \HD_Helper::doShortcode( 'off_canvas_button', [ 'hide_if_desktop' => 0 ] ) ?>
            </div>
        </div>
        <?php
    }

    // -----------------------------------------------

    public function _masthead_bottom_header(): void {}

    // -----------------------------------------------

    public function _masthead_custom(): void {}

    // -----------------------------------------------

    public function add_cookie_consent(): void {
        \HD_Helper::blockTemplate( 'parts/blocks/cookie-consent' );
    }

    // -----------------------------------------------

    public function back_to_top(): void {
        if ( apply_filters( 'hd_back_to_top_filter', true ) ) {
            echo apply_filters(
                    'hd_back_to_top_output_filter',
                    sprintf(
                            '<a title="%1$s" aria-label="%1$s" rel="nofollow" href="#" class="js-back-to-top c-back-to-top w-8 h-8 right-3 bottom-18" data-show="false" data-scroll-speed="%2$s" data-scroll-start="%3$s">%4$s</a>',
                            esc_attr__( 'Scroll back to top', TEXT_DOMAIN ),
                            absint( apply_filters( 'hd_back_to_top_scroll_speed_filter', 400 ) ),
                            absint( apply_filters( 'hd_back_to_top_scroll_start_filter', 300 ) ),
                            '<svg class="w-6 h-6 relative block" aria-hidden="true"><use href="#icon-angle-top-solid"></use></svg>'
                    )
            );
        }
    }

    // -----------------------------------------------

    public function template_svg(): void {
        \HD_Helper::blockTemplate( 'parts/blocks/svg' );
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
        $footer_cta    = \HD_Helper::getField( 'footer_cta', 'option' );
        $contact_form  = \HD_Helper::getField( 'contact_form', 'option' );
        $footer_menu_1 = \HD_Helper::getField( 'menu_1', 'option' );
        $footer_menu_2 = \HD_Helper::getField( 'menu_2', 'option' );

        $img_desktop = $footer_cta['img_desktop'] ?: false;
        $img_mobile  = $footer_cta['img_mobile'] ?: false;
        $link        = $footer_cta['link'] ?: false;

        ?>
        <div id="footer-columns" class="footer-columns">
            <?php if ( $img_desktop || $img_mobile ) : ?>
            <div class="footer-cta u-container flex justify-center pt-10 md:pt-15 lg:pt-20">
                <?= \HD_Helper::ACFLinkOpen( $link, 'block' ) ?>
                <?= \HD_Helper::pictureHTML( 'block max-w-full h-auto', $img_desktop, $img_mobile, 'widescreen' ) ?>
                <?= \HD_Helper::ACFLinkClose( $link ) ?>
            </div>
            <?php endif; ?>
            <div class="u-container py-10 md:py-15 lg:py-20">
                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div class="footer-info grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div class="seo-footer">
                            <?= \HD_Helper::siteLogo( 'alt', 'footer-logo' ) ?>
                            <ul class="footer-address">
                                <li class="flex items-baseline gap-2">
                                    <svg class="relative top-[6px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7 2a2 2 0 0 0-2 2v1a1 1 0 0 0 0 2v1a1 1 0 0 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm3 8a3 3 0 1 1 6 0a3 3 0 0 1-6 0m-1 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1" clip-rule="evenodd" /></svg>
                                    <span>38A Lê Văn Huân, Phường Tân Bình, TP. Hồ Chí Minh</span>
                                </li>
                                <li class="flex items-baseline gap-2">
                                    <svg class="relative top-[6px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.978 4a2.55 2.55 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572c1.68 1.679 3.577 3.018 5.57 3.459c2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.69 2.69 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.69 2.69 0 0 0 0-3.803l-1.21-1.211A2.56 2.56 0 0 0 7.978 4" /></svg>
                                    <a class="lining-nums" href="tel:0938002776">0938 002 776</a>
                                </li>
                                <li class="flex items-baseline gap-2">
                                    <svg class="relative top-[6px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M2.038 5.61A2 2 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6q0-.18-.03-.352l-.866.65l-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"/><path d="M20.677 4.117A2 2 0 0 0 20 4H4q-.338.002-.642.105l.758.607L12 10.742L19.9 4.7z"/></g></svg>
                                    <?= \HD_Helper::safeMailTo( 'info@webhd.vn', '', [ 'title' => 'Email' ] ) ?>
                                </li>
                            </ul>
                            <div class="social-links">
                                <?= \HD_Helper::doShortcode( 'social_menu', [ 'class' => 'social-menu flex flex-row gap-2 mt-8 md:gap-3' ] ) ?>
                            </div>
                        </div>
                        <div class="newsletter-footer">
                            <?= $contact_form['title'] ? '<p class="footer-title p-fs-clamp-[16,18] font-bold uppercase u-heading lg:mb-8 text-(--text-color)">' . esc_html( $contact_form['title'] ) . '</p>' : '' ?>
                            <div class="max-w-md">
                                <?= $contact_form['desc'] ? '<p class="text-(--text-color) text-sm/6 text-balance">' . esc_html( $contact_form['desc'] ) . '</p>' : '' ?>
                                <?= \HD_Helper::doShortcode( 'contact-form-7', [ 'id' => $contact_form['form'] ] ) ?>
                            </div>
                        </div>
                    </div>
                    <div class="footer-menu grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div class="text-left xl:pl-12">
                            <?= $footer_menu_1['title'] ? '<p class="footer-title p-fs-clamp-[16,18] font-bold uppercase u-heading lg:mb-8 text-(--text-color)">' . esc_html( $footer_menu_1['title'] ) . '</p>' : '' ?>
                            <?= $footer_menu_1['menu'] ? wp_nav_menu( [
                                    'container'  => false,
                                    'menu'       => $footer_menu_1['menu'],
                                    'menu_class' => 'menu text-[15px] space-y-3',
                                    'echo'       => false
                            ] ) : '' ?>
                        </div>
                        <div class="text-left">
                            <?= $footer_menu_2['title'] ? '<p class="footer-title p-fs-clamp-[16,18] font-bold uppercase u-heading lg:mb-8 text-(--text-color)">' . esc_html( $footer_menu_2['title'] ) . '</p>' : '' ?>
                            <?= $footer_menu_2['menu'] ? wp_nav_menu( [
                                    'container'  => false,
                                    'menu'       => $footer_menu_2['menu'],
                                    'menu_class' => 'menu text-[15px] space-y-3',
                                    'echo'       => false
                            ] ) : '' ?>
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
            <div class="u-container text-center p-fs-clamp-[12,13] md:flex md:flex-wrap md:justify-between md:items-center md:gap-3">
                <?php
                $footer_credit = \HD_Helper::getThemeMod( 'footer_credit_setting' );
                $footer_credit = ! empty( $footer_credit ) ? esc_html( $footer_credit ) : '&copy; ' . date( 'Y' ) . ' ' . get_bloginfo( 'name' ) . '. ' . esc_html__( 'All rights reserved.', TEXT_DOMAIN );

                echo \HD_Helper::doShortcode( 'horizontal_menu', [
                        'location'    => 'policy-nav',
                        'depth'       => 1,
                        'extra_class' => 'flex flex-wrap justify-center gap-x-3 md:gap-x-6',
                        'link_class'  => 'flex gap-1 flex-row-reverse p-hover dark:hover:text-(--color-white)',
                ] );

                ?>
                <p class="copyright lining-nums u-flex-center flex-wrap gap-2">
                    <?php echo apply_filters( 'hd_footer_credit_filter', $footer_credit ); ?>
                    <a href="//www.dmca.com/Protection/Status.aspx?ID=23298db8-074d-41f7-abe1-c8dfd6eff269" title="DMCA.com Protection Status" class="dmca dmca-badge" target="_blank"> <img src ="https://images.dmca.com/Badges/dmca-badge-w100-5x1-05.png?ID=23298db8-074d-41f7-abe1-c8dfd6eff269"  alt="DMCA.com Protection Status" /></a>
                </p>
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
            const track = async () => {
                let postID = <?= $ID ?>;
                const dateEl = document.querySelector('section.section-post .meta .date');
                const viewsEl = document.querySelector('section.section-post .meta .views');

                if ( !postID || !dateEl || !viewsEl ) {
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
                            body: JSON.stringify({ id: postID })
                        });
                        const json = await resp.json();
                        if (json.success) {
                            if (dateEl) dateEl.textContent = json.date;
                            if (viewsEl) viewsEl.textContent = json.views;
                        }
                    } catch (err) {}
                }
            }
            document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', track, { once: true }) : track();
        </script>
        <?php endif;

        $content = ob_get_clean();
        if ( $content ) {
            echo \HD_Helper::JSMinify( $content, true );
        }
    }

    // -----------------------------------------------

    /**
     * @return void
     */
    public function custom_css_action(): void {
        $css = new \HD_CSS();

        //...

        $css_output = $css->css_output();
        if ( $css_output ) {
            \HD_Asset::inlineStyle( \HD_Asset::handle( 'index.scss' ), $css_output );
        }
    }

    // -----------------------------------------------
}
