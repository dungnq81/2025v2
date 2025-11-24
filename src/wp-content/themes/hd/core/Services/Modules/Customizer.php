<?php
/**
 * Customizer and Admin Integration
 *
 * This file defines the Customizer class, responsible for extending the WordPress Customizer,
 * modifying queries, and integrating with various admin hooks.
 * It registers actions such as customize_register, pre_get_posts, display_post_states,
 * and other hooks that control both frontend and backend behavior.
 *
 * @author Gaudev
 */

namespace HD\Services\Modules;

use HD\Services\AbstractService;
use HD\Utilities\Helper;
use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class Customizer extends AbstractService {
    use Singleton;

    /**
     * @var array <string>
     */
    private array $page_archive_post_types = [];

    /** ---------------------------------------- */

    protected function init(): void {
        add_action( 'wp_before_admin_bar_render', [ $this, 'before_admin_bar_render' ] ); // admin-bar render
        add_action( 'customize_register', [ $this, 'customizeRegister' ], 30 ); // Theme Customizer settings and controls.

        // post-types archive.
        $page_archive_post_types = Helper::filterSettingOptions( 'page_archive_post_types', [] );
        if ( ! empty( $page_archive_post_types ) && is_array( $page_archive_post_types ) ) {
            $this->page_archive_post_types = $page_archive_post_types;

            add_action( 'init', [ $this, 'add_page_archive_rewrite' ] );
            add_action( 'pre_get_posts', [ $this, 'handle_page_as_archive' ] );
            add_filter( 'display_post_states', [ $this, 'add_archive_page_state' ] );
        }
    }

    /** ---------------------------------------- */

    /**
     * @param $query
     *
     * @return void
     */
    public function handle_page_as_archive( $query ): void {
        if ( is_admin() || ! $query->is_main_query() ) {
            return;
        }

        foreach ( $this->page_archive_post_types as $type ) {
            $obj = get_post_type_object( $type );
            if ( ! $obj || ! empty( $obj->has_archive ) ) {
                continue;
            }

            $page = get_page_by_path( $type );
            if ( ! $page ) {
                continue;
            }

            if ( is_page( $page->ID ) ) {
                $query->set( 'post_type', $type );
                $query->set( 'posts_per_page', Helper::getOption( 'posts_per_page' ) );
                $query->set( 'paged', max( 1, get_query_var( 'paged' ) ) );
                $query->set( 'post_status', 'publish' );
                $query->is_page              = false;
                $query->is_archive           = true;
                $query->is_post_type_archive = true;
                $query->is_home              = false;
                $query->is_singular          = false;
                $query->set( 'pagename', '' );

                break;
            }
        }
    }

    /** ---------------------------------------- */

    /**
     * @return void
     */
    public function add_page_archive_rewrite(): void {
        foreach ( $this->page_archive_post_types as $type ) {
            $page = get_page_by_path( $type );
            if ( ! $page ) {
                continue;
            }

            add_rewrite_rule(
                '^' . $type . '/page/([0-9]+)/?',
                'index.php?pagename=' . $type . '&paged=$matches[1]',
                'top'
            );
        }
    }

    /** ---------------------------------------- */

    /**
     * @param $post_states
     *
     * @return mixed
     */
    public function add_archive_page_state( $post_states ): mixed {
        if ( ! isset( $GLOBALS['post'] ) || get_post_type( $GLOBALS['post'] ) !== 'page' ) {
            return $post_states;
        }

        foreach ( $this->page_archive_post_types as $type ) {
            $obj = get_post_type_object( $type );
            if ( ! $obj || ! empty( $obj->has_archive ) ) {
                continue;
            }

            $page = get_page_by_path( $type );
            if ( $page && $page->ID === $GLOBALS['post']->ID ) {
                $label                                  = sprintf( 'Archive Page (%s)', $obj->labels->singular_name ?? ucfirst( $type ) );
                $post_states[ 'page_archive_' . $type ] = esc_html( $label );
            }
        }

        return $post_states;
    }

    /** ---------------------------------------- */

    public function before_admin_bar_render(): void {
        if ( is_admin_bar_showing() ) {
            global $wp_admin_bar;

            $wp_admin_bar->remove_menu( 'wp-logo' );
            $wp_admin_bar->remove_menu( 'updates' );

            // Clear cache button
            $current_url = add_query_arg( 'clear_cache', 1, $_SERVER['REQUEST_URI'] );
            $wp_admin_bar->add_menu( [
                'id'    => 'clear_cache_button',
                'title' => '<div class="custom-admin-button"><span class="custom-icon">⚡</span><span class="custom-text">' . __( 'Clear cache', TEXT_DOMAIN ) . '</span></div>',
                'href'  => $current_url,
            ] );
        }
    }

    /** ---------------------------------------- */

    /**
     * Register customizer options.
     *
     * @param \WP_Customize_Manager $wp_customize
     *
     * @return void
     */
    public function customizeRegister( \WP_Customize_Manager $wp_customize ): void {
        // hide 'Additional CSS' tab
        $wp_customize->remove_section( 'custom_css' );

        // logo + title
        $this->_logoAndTitle( $wp_customize );

        // ------------------

        $wp_customize->add_panel(
            'addon_menu_panel',
            [
                'priority'       => 140,
                'theme_supports' => '',
                'title'          => __( 'Addons', TEXT_DOMAIN ),
                'description'    => __( 'Controls the add-on menu', TEXT_DOMAIN ),
            ]
        );

        // -------------------------------------------------------------
        // Login page
        // -------------------------------------------------------------

        $wp_customize->add_section(
            'login_page_section',
            [
                'title'    => __( 'Trang đăng nhập', TEXT_DOMAIN ),
                'panel'    => 'addon_menu_panel',
                'priority' => 999,
            ]
        );

        $wp_customize->add_setting( 'login_page_bgcolor_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_hex_color',
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Color_Control(
                $wp_customize,
                'login_page_bgcolor_control',
                [
                    'label'    => __( 'Màu nền', TEXT_DOMAIN ),
                    'section'  => 'login_page_section',
                    'settings' => 'login_page_bgcolor_setting',
                    'priority' => 8,
                ]
            )
        );

        $wp_customize->add_setting( 'login_page_bgimage_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => [ Helper::class, 'sanitizeImage' ],
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Image_Control(
                $wp_customize,
                'login_page_bgimage_control',
                [
                    'label'    => __( 'Ảnh nền', TEXT_DOMAIN ),
                    'section'  => 'login_page_section',
                    'settings' => 'login_page_bgimage_setting',
                    'priority' => 9,
                ]
            )
        );

        $wp_customize->add_setting( 'login_page_logo_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => [ Helper::class, 'sanitizeImage' ],
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Image_Control(
                $wp_customize,
                'login_page_logo_control',
                [
                    'label'    => __( 'Logo', TEXT_DOMAIN ),
                    'section'  => 'login_page_section',
                    'settings' => 'login_page_logo_setting',
                    'priority' => 10,
                ]
            )
        );

        $wp_customize->add_setting( 'login_page_headertext_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'login_page_headertext_control',
            [
                'label'       => __( 'Văn bản tiêu đề', TEXT_DOMAIN ),
                'section'     => 'login_page_section',
                'settings'    => 'login_page_headertext_setting',
                'type'        => 'text',
                'priority'    => 11,
                'description' => __( 'Thay đổi văn bản thay thế (alt)', TEXT_DOMAIN ),
            ]
        );

        $wp_customize->add_setting( 'login_page_headerurl_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'login_page_headerurl_control',
            [
                'label'       => __( 'URL của tiêu đề', TEXT_DOMAIN ),
                'section'     => 'login_page_section',
                'settings'    => 'login_page_headerurl_setting',
                'type'        => 'url',
                'priority'    => 12,
                'description' => __( 'Thay đổi đường dẫn của logo', TEXT_DOMAIN ),
            ]
        );

        // -------------------------------------------------------------
        // OffCanvas Menu
        // -------------------------------------------------------------

        $wp_customize->add_section(
            'offcanvas_menu_section',
            [
                'title'    => __( 'OffCanvas', TEXT_DOMAIN ),
                'panel'    => 'addon_menu_panel',
                'priority' => 1000,
            ]
        );

        // Add offcanvas control
        $wp_customize->add_setting( 'offcanvas_menu_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'offcanvas_menu_control',
            [
                'label'    => __( 'offCanvas position', TEXT_DOMAIN ),
                'type'     => 'radio',
                'section'  => 'offcanvas_menu_section',
                'settings' => 'offcanvas_menu_setting',
                'choices'  => [
                    'left'    => __( 'Left', TEXT_DOMAIN ),
                    'right'   => __( 'Right', TEXT_DOMAIN ),
                    'top'     => __( 'Top', TEXT_DOMAIN ),
                    'bottom'  => __( 'Bottom', TEXT_DOMAIN ),
                    'default' => __( 'Default (Left)', TEXT_DOMAIN ),
                ],
            ]
        );

        // -------------------------------------------------------------
        // Breadcrumbs
        // -------------------------------------------------------------

        $wp_customize->add_section(
            'breadcrumb_section',
            [
                'title'    => __( 'Breadcrumb', TEXT_DOMAIN ),
                'panel'    => 'addon_menu_panel',
                'priority' => 1007,
            ]
        );

        // Add control
        $wp_customize->add_setting( 'breadcrumb_bg_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => [ Helper::class, 'sanitizeImage' ],
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Image_Control(
                $wp_customize,
                'breadcrumb_bg_control',
                [
                    'label'    => __( 'Background image', TEXT_DOMAIN ),
                    'section'  => 'breadcrumb_section',
                    'settings' => 'breadcrumb_bg_setting',
                    'priority' => 9,
                ]
            )
        );

        // Add control
        $wp_customize->add_setting( 'breadcrumb_bgcolor_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_hex_color',
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Color_Control(
                $wp_customize,
                'breadcrumb_bgcolor_control',
                [
                    'label'    => __( 'Background color', TEXT_DOMAIN ),
                    'section'  => 'breadcrumb_section',
                    'settings' => 'breadcrumb_bgcolor_setting',
                    'priority' => 9,
                ]
            )
        );

        // Add control
        $wp_customize->add_setting( 'breadcrumb_color_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_hex_color',
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Color_Control(
                $wp_customize,
                'breadcrumb_color_control',
                [
                    'label'    => __( 'Text color', TEXT_DOMAIN ),
                    'section'  => 'breadcrumb_section',
                    'settings' => 'breadcrumb_color_setting',
                    'priority' => 9,
                ]
            )
        );

        // Min height control
        $wp_customize->add_setting( 'breadcrumb_min_height_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'breadcrumb_min_height_control',
            [
                'label'       => __( 'Breadcrumb min-height', TEXT_DOMAIN ),
                'section'     => 'breadcrumb_section',
                'settings'    => 'breadcrumb_min_height_setting',
                'type'        => 'number',
                'description' => __( 'Min-height of breadcrumb section', TEXT_DOMAIN ),
            ]
        );

        // Max height control
        $wp_customize->add_setting( 'breadcrumb_max_height_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'breadcrumb_max_height_control',
            [
                'label'       => __( 'Breadcrumb max-height', TEXT_DOMAIN ),
                'section'     => 'breadcrumb_section',
                'settings'    => 'breadcrumb_max_height_setting',
                'type'        => 'number',
                'description' => __( 'Max-height of breadcrumb section', TEXT_DOMAIN ),
            ]
        );

        // -------------------------------------------------------------
        // Footer
        // -------------------------------------------------------------

        $wp_customize->add_section(
            'footer_section',
            [
                'title'    => __( 'Footer', TEXT_DOMAIN ),
                'panel'    => 'addon_menu_panel',
                'priority' => 1010,
            ]
        );

        $wp_customize->add_setting( 'footer_credit_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'footer_credit_control',
            [
                'label'    => __( 'Footer copyright', TEXT_DOMAIN ),
                'section'  => 'footer_section',
                'settings' => 'footer_credit_setting',
                'type'     => 'text',
                'priority' => 10,
            ]
        );

        // -------------------------------------------------------------
        // Others
        // -------------------------------------------------------------

        $wp_customize->add_section(
            'other_section',
            [
                'title'    => __( 'Other', TEXT_DOMAIN ),
                'panel'    => 'addon_menu_panel',
                'priority' => 1011,
            ]
        );

        // Meta theme-color
        $wp_customize->add_setting( 'theme_color_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_hex_color',
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Color_Control(
                $wp_customize,
                'theme_color_control',
                [
                    'label'    => __( 'Theme Color', TEXT_DOMAIN ),
                    'section'  => 'other_section',
                    'settings' => 'theme_color_setting',
                ]
            )
        );

        // Hide a menu
        $wp_customize->add_setting( 'remove_menu_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_textarea_field',
        ] );

        $wp_customize->add_control(
            'remove_menu_control',
            [
                'type'        => 'textarea',
                'section'     => 'other_section',
                'settings'    => 'remove_menu_setting',
                'label'       => __( 'Remove Menu', TEXT_DOMAIN ),
                'description' => __( 'The menu list will be hidden', TEXT_DOMAIN ),
            ]
        );
    }

    /* ---------- PRIVATE ------------------------------------------ */

    /**
     * @param \WP_Customize_Manager $wp_customize
     *
     * @return void
     */
    private function _logoAndTitle( \WP_Customize_Manager $wp_customize ): void {

        // -------------------------------------------------------------
        // Alternative Logo
        // -------------------------------------------------------------

        $wp_customize->add_setting( 'alt_logo', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => [ Helper::class, 'sanitizeImage' ],
        ] );

        $wp_customize->add_control(
            new \WP_Customize_Image_Control(
                $wp_customize,
                'alt_logo',
                [
                    'label'    => __( 'Alternative Logo', TEXT_DOMAIN ),
                    'section'  => 'title_tagline',
                    'settings' => 'alt_logo',
                    'priority' => 8,
                ]
            )
        );

        // -------------------------------------------------------------
        // Logo title
        // -------------------------------------------------------------

        $wp_customize->add_setting( 'logo_title_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'logo_title_control',
            [
                'label'    => __( 'Logo title', TEXT_DOMAIN ),
                'section'  => 'title_tagline',
                'settings' => 'logo_title_setting',
                'type'     => 'text',
                'priority' => 9,
            ]
        );

        // -------------------------------------------------------------
        // H1 on the homepage
        // -------------------------------------------------------------

        $wp_customize->add_setting( 'home_heading_setting', [
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_text_field',
        ] );

        $wp_customize->add_control(
            'home_heading_control',
            [
                'label'    => __( 'H1 on the homepage', TEXT_DOMAIN ),
                'section'  => 'title_tagline',
                'settings' => 'home_heading_setting',
                'type'     => 'text',
                'priority' => 9,
            ]
        );
    }
}
