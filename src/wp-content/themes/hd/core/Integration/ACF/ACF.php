<?php
/**
 * Advanced Custom Fields (ACF) integration handler.
 *
 * This class manages all theme-level integrations with the ACF plugin.
 * It hides the ACF admin UI in production, extends allowed HTML sanitization
 * for ACF fields, customizes WYSIWYG and TinyMCE toolbars, and enriches
 * navigation menu items with ACF-based properties such as icons, labels,
 * and mega menu support.
 *
 * @author Gaudev
 */

namespace HD\Integration\ACF;

use HD\Utilities\Helper;
use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class ACF {
    use Singleton;

    /* ---------- CONSTRUCT ---------------------------------------- */

    private function init(): void {
        // Hide the ACF Admin UI
        if ( ! Helper::development() ) {
            add_filter( 'acf/settings/show_admin', '__return_false' );
        }

        add_filter( 'wp_kses_allowed_html', [ $this, 'ksesAllowedHtml' ], 11, 2 );
        add_filter( 'acf/fields/wysiwyg/toolbars', [ $this, 'wysiwygToolbars' ], 98, 1 );

        add_filter( 'teeny_mce_buttons', [ $this, 'teenyMceButtons' ], 99, 2 );
        add_filter( 'wp_nav_menu_objects', [ $this, 'navMenuObjects' ], 998, 2 );
        add_filter( 'nav_menu_item_title', [ $this, 'navMenuItemTitle' ], 999, 4 );
        add_filter( 'nav_menu_link_attributes', [ $this, 'navMenuLinkAttributes' ], 999, 4 );

        // auto required fields
        $fields_dir = __DIR__ . DIRECTORY_SEPARATOR . 'fields';
        Helper::createDirectory( $fields_dir );
        Helper::FQNLoad( $fields_dir, true );
    }

    /* ---------- PUBLIC ------------------------------------------- */

    /**
     * @param $tags
     * @param $context
     *
     * @return mixed
     */
    public function ksesAllowedHtml( $tags, $context ): mixed {
        if ( $context === 'acf' ) {
            $allow = Helper::ksesSVG();
            foreach ( $allow as $tag => $attrs ) {
                $tags[ $tag ] = isset( $tags[ $tag ] ) ? array_merge( $tags[ $tag ], $attrs ) : $attrs;
            }
        }

        return $tags;
    }

    // -------------------------------------------------------------

    /**
     * @param $toolbars
     *
     * @return mixed
     */
    public function wysiwygToolbars( $toolbars ): mixed {
        // Add a new toolbar called "Minimal" - this toolbar has only 1 row of buttons
        //		$toolbars['Minimal']    = [];
        //		$toolbars['Minimal'][1] = [
        //			'formatselect',
        //			'bold',
        //			'underline',
        //			'bullist',
        //			'numlist',
        //			'link',
        //			'unlink',
        //			'forecolor',
        //			//'blockquote',
        //			'table',
        //			'codesample',
        //			'subscript',
        //			'superscript',
        //			'ml_tinymce_language_select_button', // wpglobus
        //			'fullscreen',
        //		];

        // remove the 'Basic' toolbar completely (if you want)
        //unset( $toolbars['Full'] );
        //unset( $toolbars['Basic'] );

        return $toolbars;
    }

    // -------------------------------------------------------------

    /**
     * @param $teeny_mce_buttons
     * @param $editor_id
     *
     * @return string[]
     */
    public function teenyMceButtons( $teeny_mce_buttons, $editor_id ): array {
        return [
            'formatselect',
            'bold',
            'underline',
            'bullist',
            'numlist',
            'link',
            'unlink',
            'forecolor',
            'blockquote',
            'table',
            'codesample',
            'subscript',
            'superscript',
            'fullscreen',
        ];
    }

    // -------------------------------------------------------------

    /**
     * @param $items
     * @param $args
     *
     * @return mixed
     */
    public function navMenuObjects( $items, $args ): mixed {
        foreach ( $items as $item ) {
            $ACF = Helper::getFields( $item, true );
            if ( ! $ACF ) {
                continue;
            }

            $item->menu_mega             = $ACF->menu_mega ?? false;
            $item->menu_link_class       = $ACF->menu_link_class ?? '';
            $item->menu_span             = $ACF->menu_span ?? '';
            $item->menu_span_css         = $ACF->menu_span_css ?? '';
            $item->menu_svg              = $ACF->menu_svg ?? '';
            $item->menu_image            = $ACF->menu_image ?? 0;
            $item->menu_label_text       = $ACF->menu_label_text ?? '';
            $item->menu_label_color      = $ACF->menu_label_color ?? '';
            $item->menu_label_background = $ACF->menu_label_background ?? '';

            // Mega menu
            if ( $item->menu_mega ) {
                $item->classes[] = 'menu-mega';
            }

            // Svg
            if ( $item->menu_svg ) {
                $item->classes[] = 'menu-svg';
            }

            // Thumb
            if ( $item->menu_image ) {
                $item->classes[] = 'menu-thumb';
            }

            // Label
            if ( $item->menu_label_text ) {
                $item->classes[] = 'menu-label';
            }
        }

        return $items;
    }

    // -------------------------------------------------------------

    /**
     * @param $title
     * @param $item
     * @param $args
     * @param $depth
     *
     * @return mixed|string
     */
    public function navMenuItemTitle( $title, $item, $args, $depth ): mixed {
        // Label <sup>
        if ( ! empty( $item->menu_label_text ) ) {
            $_css = '';

            if ( ! empty( $item->menu_label_color ) ) {
                $_css .= 'color:' . $item->menu_label_color . ';';
            }
            if ( ! empty( $item->menu_label_background ) ) {
                $_css .= 'background-color:' . $item->menu_label_background . ';';
            }

            $_style = $_css ? ' style="' . Helper::CSSMinify( $_css, true ) . '"' : '';
            $title  .= '<sup' . $_style . '>' . esc_html( $item->menu_label_text ) . '</sup>';
        }

        // span + span css
        if ( ! empty( $item->menu_span ) ) {
            $span_open = ! empty( $item->menu_span_css ) ? '<span class="' . esc_attr( $item->menu_span_css ) . '">' : '<span>';
            $title     = $span_open . $title . '</span>';
        }

        // SVG inline
        if ( ! empty( $item->menu_svg ) ) {
            $title = $item->menu_svg . $title;
        }

        // IMG
        if ( ! empty( $item->menu_image ) ) {
            $img   = Helper::attachmentImageHTML( $item->menu_image, 'thumbnail', [
                'loading' => 'lazy',
                'alt'     => wp_strip_all_tags( $item->title ?? '' ),
            ], true );
            $title = $img . $title;
        }

        return $title;
    }

    // -------------------------------------------------------------

    /**
     * @param $atts
     * @param $menu_item
     * @param $args
     * @param $depth
     *
     * @return array
     */
    public function navMenuLinkAttributes( $atts, $menu_item, $args, $depth ): array {
        // menu_link_class
        if ( ! empty( $menu_item->menu_link_class ) ) {
            if ( ! empty( $atts['class'] ) ) {
                $atts['class'] .= ' ' . esc_attr( $menu_item->menu_link_class );
            } else {
                $atts['class'] = esc_attr( $menu_item->menu_link_class );
            }
        }

        return $atts;
    }

    // -------------------------------------------------------------
}
