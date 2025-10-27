<?php
/**
 * Theme Optimization, Cleanup
 *
 * This file defines the Optimizer class, which handles performance improvements,
 * frontend and backend optimizations, and general WordPress cleanup tasks.
 * It registers various hooks to disable unnecessary features, streamline output,
 * and enhance overall theme efficiency.
 *
 * @author Gaudev
 */

namespace HD\Core;

use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class Optimizer {
	use Singleton;

	/* ---------- CONFIG ------------------------------------------- */

	private array $lazy_styles = [];

	/* ---------- CONSTRUCT ---------------------------------------- */

	private function init(): void {
		$this->_cleanup();
		$this->_optimizer();
	}

	/* ---------- PRIVATE ------------------------------------------ */

	private function _optimizer(): void {
		// -------------------------------------------------------------
		// images sizes
		// -------------------------------------------------------------

		/**
		 * small-50 (50x0)
		 * small-100 (100x0)
		 * small-150 (150x0)
		 * small-300 (300x0)
		 *
		 * thumbnail (480x0)
		 * medium (768x0)
		 * large (1024x0)
		 *
		 * small-thumbnail (150x0)
		 * widescreen (1920x9999)
		 * post-thumbnail (1280x9999)
		 */
		if ( ! \HD_Helper::getOption( '_image_sizes_updated' ) ) {
			\HD_Helper::updateOption( '_image_sizes_updated', true );

			/** Default thumb */
			\HD_Helper::updateOption( 'thumbnail_size_w', 480 );
			\HD_Helper::updateOption( 'thumbnail_size_h', 0 );
			\HD_Helper::updateOption( 'thumbnail_crop', 0 );

			/** Medium thumb */
			\HD_Helper::updateOption( 'medium_size_w', 768 );
			\HD_Helper::updateOption( 'medium_size_h', 0 );

			/** Large thumb */
			\HD_Helper::updateOption( 'large_size_w', 1024 );
			\HD_Helper::updateOption( 'large_size_h', 0 );
		}

		/** Custom images sizes */
		add_image_size( 'small-50', 50, 0, false );
		add_image_size( 'small-100', 100, 0, false );
		add_image_size( 'small-150', 150, 0, false );
		add_image_size( 'small-300', 300, 0, false );
		add_image_size( 'small-thumbnail', 150, 0, false );
		add_image_size( 'widescreen', 1920, 9999, false );
		add_image_size( 'post-thumbnail', 1200, 9999, false );

		/** Disable unwanted images sizes */
		add_filter( 'intermediate_image_sizes_advanced', static function ( $sizes ) {
			unset( $sizes['medium_large'], $sizes['1536x1536'], $sizes['2048x2048'] );

			return $sizes;
		} );

		/** Disable scaled */
		add_filter( 'big_image_size_threshold', '__return_false' );

		/** Disable other sizes */
		add_action( 'init', static function () {
			remove_image_size( '1536x1536' ); // disable 2x medium-large size
			remove_image_size( '2048x2048' ); // disable 2x large size
		} );

		// -------------------------------------------------------------
		// permalink structure
		// -------------------------------------------------------------

		if ( ! \HD_Helper::getOption( '_permalink_structure_updated' ) ) {
			\HD_Helper::updateOption( '_permalink_structure_updated', true );

			global $wp_rewrite;

			$wp_rewrite->set_permalink_structure( '/%postname%/' );
			$wp_rewrite->flush_rules();
		}

		// -------------------------------------------------------------
		// Optimizer
		// -------------------------------------------------------------

		// Adding Shortcode in WordPress Using Custom HTML Widget
		add_filter( 'widget_text', 'do_shortcode' );
		add_filter( 'widget_text', 'shortcode_unautop' );

		// Style and script loader tags
		add_filter( 'script_loader_tag', [ $this, 'scriptLoaderTag' ], 12, 3 );
		add_filter( 'style_loader_tag', [ $this, 'styleLoaderTag' ], 12, 2 );
		add_action( 'wp_body_open', [ $this, 'printLazyStyles' ], 1 );

		// Remove inline styles
		add_filter( 'post_thumbnail_html', [ $this, 'remove_inline_img_styles' ] );
		add_filter( 'the_content', [ $this, 'remove_inline_img_styles' ] );

		// CSS Class
		add_filter( 'body_class', [ $this, 'body_class' ], 12 );
		add_filter( 'post_class', [ $this, 'post_class' ], 12 );
		add_filter( 'nav_menu_css_class', [ $this, 'nav_menu_css_class' ], 12, 4 );
		add_filter( 'nav_menu_link_attributes', [ $this, 'nav_menu_link_attributes' ], 12, 4 );

		// Front-end only, excluding the login page
		if ( ! is_admin() && ! \HD_Helper::isLogin() ) {
			add_action( 'wp_print_footer_scripts', [ $this, 'printFooterScripts' ], 999 );
		}

		// Custom hooks
		add_filter( 'wp_img_tag_add_auto_sizes', '__return_false' ); // https://html.spec.whatwg.org/multipage/rendering.html#img-contain-size
		add_filter( 'excerpt_more', [ $this, 'excerpt_more' ] );
		add_filter( 'sanitize_file_name', [ $this, 'sanitize_file_name' ] );
		add_filter( 'get_the_archive_title_prefix', '__return_empty_string' ); // Remove archive title prefix
		add_filter( 'query_vars', [ $this, 'query_vars' ], 99 );
		add_filter( 'posts_search', [ $this, 'searchByTitle' ], 500, 2 ); // Search by title
		add_action( 'wp_default_scripts', [ $this, 'wp_default_scripts' ] );
	}

	// ------------------------------------------------------

	/**
	 * Launching operation cleanup
	 *
	 * @return void
	 */
	private function _cleanup(): void {
		// wp_head
		remove_action( 'wp_head', 'rsd_link' );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'wp_shortlink_wp_head' );
		remove_action( 'wp_head', 'wp_generator' );
		remove_action( 'wp_head', 'feed_links', 2 );
		remove_action( 'wp_head', 'feed_links_extra', 3 );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );

		// All actions related to emojis
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

		// Staticize emoji
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

		// Remove the wp-json header from WordPress.
		remove_action( 'wp_head', 'rest_output_link_wp_head' );
		remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
		remove_action( 'template_redirect', 'rest_output_link_header', 11 );

		// Remove id li navigation
		add_filter( 'nav_menu_item_id', '__return_null', 10, 3 );
	}

	/* ---------- PUBLIC ------------------------------------------- */

	/**
	 * Remove inline style attribute from image tags in HTML content.
	 *
	 * @param $html
	 *
	 * @return array|string|string[]|null
	 */
	public function remove_inline_img_styles( $html ): array|string|null {
		return preg_replace(
			'/(<img[^>]+)(style=\"[^\"]+\")([^>]+)(>)/',
			'${1}${3}${4}',
			$html
		);
	}

	// ------------------------------------------------------

	public function excerpt_more(): string {
		return ' ' . '&hellip;';
	}

	// ------------------------------------------------------

	/**
	 * @param $filename
	 *
	 * @return string
	 */
	public function sanitize_file_name( $filename ): string {
		if ( ! is_string( $filename ) ) {
			$filename = (string) $filename;
		}

		return remove_accents( $filename );
	}

	// ------------------------------------------------------

	/**
	 * @param $vars
	 *
	 * @return mixed
	 */
	public function query_vars( $vars ): mixed {
		$vars[] = 'page';
		$vars[] = 'paged';

		return $vars;
	}

	// ------------------------------------------------------

	/**
	 * @param $scripts
	 *
	 * @return void
	 */
	public function wp_default_scripts( $scripts ): void {
		if ( ! is_object( $scripts ) || ! isset( $scripts->registered ) || ! is_array( $scripts->registered ) ) {
			return;
		}

		if ( isset( $scripts->registered['jquery'] ) && ! is_admin() ) {
			$script = $scripts->registered['jquery'];
			if ( is_array( $script->deps ) && ! empty( $script->deps ) ) {

				// remove jquery-migrate
				$script->deps = array_diff( $script->deps, [ 'jquery-migrate' ] );
			}
		}
	}

	// ------------------------------------------------------

	/**
	 * @param string $tag
	 * @param string $handle
	 * @param string $src
	 *
	 * @return string
	 */
	public function scriptLoaderTag( string $tag, string $handle, string $src ): string {
		if ( is_admin() || ! isset( wp_scripts()->registered[ $handle ] ) ) {
			return $tag;
		}

		$attributes = wp_scripts()->registered[ $handle ]->extra ?? [];

		// Add `type="module"` attributes if the script is marked as a module
		if ( ! empty( $attributes['module'] ) ) {
			$tag = preg_replace( '#(?=></script>)#', ' type="module"', $tag, 1 );
		}

		// Handle `async` and `defer` attributes
		foreach ( [ 'async', 'defer' ] as $attr ) {
			if ( ! empty( $attributes[ $attr ] ) && ! preg_match( "#\s$attr(=|>|\s)#", $tag ) ) {
				$tag = preg_replace( '#(?=></script>)#', " $attr", $tag, 1 );
			}
		}

		// Process combined attributes (e.g., `module defer`) from `extra`
		if ( ! empty( $attributes['extra'] ) ) {
			$extra_attrs = is_array( $attributes['extra'] ) ? $attributes['extra'] : explode( ' ', $attributes['extra'] );
			foreach ( $extra_attrs as $attr ) {
				if ( $attr === 'module' ) {
					if ( ! preg_match( '#\stype=(["\'])module\1#', $tag ) ) {
						$tag = preg_replace( '#(?=></script>)#', ' type="module"', $tag, 1 );
					}
				} elseif ( ! preg_match( "#\s$attr(=|>|\s)#", $tag ) ) {
					$tag = preg_replace( '#(?=></script>)#', " $attr", $tag, 1 );
				}
			}
		}

		// Add script handles to the array
		$str_parsed = \HD_Helper::filterSettingOptions( 'defer_script', [] );

		return \HD_Helper::lazyScriptTag( $str_parsed, $tag, $handle );
	}

	// ------------------------------------------------------

	/**
	 * Add style handles to the array below
	 *
	 * @param string $html
	 * @param string $handle
	 *
	 * @return string
	 */
	public function styleLoaderTag( string $html, string $handle ): string {
		if ( empty( $handle ) || is_admin() ) {
			return $html;
		}

		$styles    = \HD_Helper::filterSettingOptions( 'defer_style', [] );
		$lazy_html = \HD_Helper::lazyStyleTag( $styles, $html, $handle );

		if ( $lazy_html !== $html ) {
			$safe_handle         = htmlspecialchars( $handle, ENT_QUOTES, 'UTF-8' );
			$this->lazy_styles[] = str_replace(
				"onload=\"this.rel='stylesheet'\"",
				"data-handle='{$safe_handle}' onload=\"this.rel='stylesheet'\"",
				$lazy_html
			);

			return '';
		}

		return $html;
	}

	// ------------------------------------------------------

	public function printLazyStyles(): void {
		if ( empty( $this->lazy_styles ) ) {
			return;
		}

		foreach ( $this->lazy_styles as $link ) {
			echo $link;
		}
	}

	// ------------------------------------------------------

	/**
	 * Search only in post-title or excerpt
	 *
	 * @param $search
	 * @param $wp_query
	 *
	 * @return mixed|string
	 */
	public function searchByTitle( $search, $wp_query ): mixed {
		global $wpdb;

		if ( empty( $search ) ) {
			return $search;
		}

		if ( ! extension_loaded( 'mbstring' ) ) {
			return $search;
		}

		$q = $wp_query->query_vars;
		$n = ! empty( $q['exact'] ) ? '' : '%';

		$search = $search_and = '';

		foreach ( (array) $q['search_terms'] as $term ) {
			$term = mb_strtolower( esc_sql( $wpdb->esc_like( $term ) ) );

			$like       = "LIKE CONCAT('{$n}', CONVERT('{$term}', BINARY), '{$n}')";
			$search     .= "{$search_and}(LOWER($wpdb->posts.post_title) {$like} OR LOWER($wpdb->posts.post_excerpt) {$like})";
			$search_and = ' AND ';
		}

		if ( ! empty( $search ) ) {
			$search = " AND ({$search}) ";
			if ( ! is_user_logged_in() ) {
				$search .= " AND ($wpdb->posts.post_password = '') ";
			}
		}

		return $search;
	}

	// ------------------------------------------------------

	public function printFooterScripts(): void {
		echo '<script>document.documentElement.classList.remove(\'no-js\');</script>';
	}

	// ------------------------------------------------------

	/**
	 * @param array $classes
	 *
	 * @return array
	 */
	public function body_class( array $classes ): array {
		// Check whether we're in the customizer preview.
		if ( is_customize_preview() ) {
			$classes[] = 'customizer-preview';
		}

		foreach ( $classes as $class ) {
			if (
				str_contains( $class, 'wp-custom-logo' ) ||
				str_contains( $class, 'page-template-templates' ) ||
				str_contains( $class, 'page-id-' ) ||
				str_contains( $class, 'postid-' ) ||
				str_contains( $class, 'single-format-standard' ) ||
				str_contains( $class, 'no-customize-support' )
			) {
				$classes = array_diff( $classes, [ $class ] );
			}
		}

		if ( \HD_Helper::isWoocommerceActive() ) {
			$classes[] = 'woocommerce';
		}

		return $classes;
	}

	// ------------------------------------------------------

	/**
	 * @param array $classes
	 *
	 * @return array
	 */
	public function post_class( array $classes ): array {
		// remove_sticky_class
		if ( in_array( 'sticky', $classes, false ) ) {
			$classes   = array_diff( $classes, [ 'sticky' ] );
			$classes[] = 'wp-sticky';
		}

		// remove 'tag-', 'category-' classes
		foreach ( $classes as $class ) {
			if (
				str_contains( $class, 'tag-' ) ||
				str_contains( $class, 'category-' )
			) {
				$classes = array_diff( $classes, [ $class ] );
			}
		}

		return $classes;
	}

	// ------------------------------------------------------

	/**
	 * @param $classes
	 * @param $menu_item
	 * @param $args
	 * @param $depth
	 *
	 * @return array
	 */
	public function nav_menu_css_class( $classes, $menu_item, $args, $depth ): array {
		if ( ! is_array( $classes ) ) {
			$classes = [];
		}

		// Remove 'menu-item-type-', 'menu-item-object-' classes
		foreach ( $classes as $class ) {
			if (
				str_contains( $class, 'menu-item-type-' ) ||
				str_contains( $class, 'menu-item-object-' ) ||
				str_contains( $class, 'menu-item' ) ||
				str_contains( $class, 'menu-item-' )
			) {
				$classes = array_diff( $classes, [ $class ] );
			}
		}

		if ( 1 === $menu_item->current || $menu_item->current_item_ancestor || $menu_item->current_item_parent ) {
			$classes[] = 'active';
		}

		// li_class
		// li_depth_class

		if ( $depth === 0 ) {
			if ( ! empty( $args->li_class ) ) {
				$classes[] = $args->li_class;
			}

			return $classes;
		}

		if ( ! empty( $args->li_depth_class ) ) {
			$classes[] = $args->li_depth_class;
		}

		return $classes;
	}

	// ------------------------------------------------------

	/**
	 * @param $atts
	 * @param $menu_item
	 * @param $args
	 * @param $depth
	 *
	 * @return array
	 */
	public function nav_menu_link_attributes( $atts, $menu_item, $args, $depth ): array {
		// link_class
		// link_depth_class

		if ( $depth === 0 ) {
			if ( property_exists( $args, 'link_class' ) ) {
				$atts['class'] = esc_attr( $args->link_class );
			}
		} elseif ( property_exists( $args, 'link_depth_class' ) ) {
			$atts['class'] = esc_attr( $args->link_depth_class );
		}

		return $atts;
	}

	// ------------------------------------------------------
}
