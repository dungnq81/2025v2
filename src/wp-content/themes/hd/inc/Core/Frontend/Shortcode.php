<?php
/**
 * Theme Shortcodes
 *
 * This file defines the Shortcode class, responsible for registering and managing
 * all custom shortcodes used in the theme.
 * It organizes shortcode logic into a single class and hooks them into WordPress
 * during initialization for cleaner and modular code.
 *
 * @author Gaudev
 */

namespace HD\Core\Frontend;

use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class Shortcode {
	use Singleton;

	/* ---------- CONSTRUCT ---------------------------------------- */

	private function init(): void {
		$shortcodes = [
			'safe_mail'         => [ $this, 'safeMail' ],
			'site_logo'         => [ $this, 'siteLogo' ],
			'menu_logo'         => [ $this, 'menuLogo' ],
			'inline_search'     => [ $this, 'inlineSearch' ],
			'dropdown_search'   => [ $this, 'dropdownSearch' ],
			'off_canvas_button' => [ $this, 'offCanvasButton' ],
			'horizontal_menu'   => [ $this, 'horizontalMenu' ],
			'vertical_menu'     => [ $this, 'verticalMenu' ],
			'posts'             => [ $this, 'posts' ],
		];

		foreach ( $shortcodes as $shortcode => $function ) {
			add_shortcode( $shortcode, $function );
		}
	}

	/* ---------- PUBLIC ------------------------------------------- */

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function safeMail( array $atts = [] ): string {
		$atts = shortcode_atts(
			[
				'title' => '',
				'email' => '',
				'class' => '',
			],
			$atts,
			'safe_mail'
		);

		$attributes['title'] = $atts['title'] ? \HD_Helper::escAttr( $atts['title'] ) : \HD_Helper::escAttr( $atts['email'] );

		if ( $atts['class'] ) {
			$attributes['class'] = \HD_Helper::escAttr( $atts['class'] );
		}

		return \HD_Helper::safeMailTo( $atts['email'], $atts['title'], $attributes );
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function siteLogo( array $atts = [] ): string {
		$atts = shortcode_atts(
			[
				'theme' => 'default',
				'class' => '',
			],
			$atts,
			'site_logo'
		);

		return \HD_Helper::siteLogo( $atts['theme'], $atts['class'] );
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function menuLogo( array $atts = [] ): string {
		$atts = shortcode_atts(
			[
				'heading' => false,
				'title'   => false,
				'class'   => 'logo',
			],
			$atts,
			'menu_logo'
		);

		return \HD_Helper::siteTitleOrLogo( false, $atts['heading'], $atts['title'], $atts['class'] );
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function inlineSearch( array $atts = [] ): string {
		static $inline_search_counter = 0;
		$id = 'search-' . substr( md5( __METHOD__ . ++ $inline_search_counter ), 0, 10 );

		$atts = shortcode_atts(
			[
				'title'       => '',
				'placeholder' => '',
				'class'       => '',
				'id'          => \HD_Helper::escAttr( $id ),
			],
			$atts,
			'inline_search'
		);

		$title             = $atts['title'] ?: '';
		$title_for         = __( 'Tìm kiếm', TEXT_DOMAIN );
		$placeholder_title = $atts['placeholder'] ?: __( 'Tìm kiếm...', TEXT_DOMAIN );
		$id                = $atts['id'] ? \HD_Helper::escAttr( $atts['id'] ) : \HD_Helper::escAttr( $id );
		$class             = $atts['class'] ? ' ' . \HD_Helper::escAttr( $atts['class'] ) : '';

		ob_start();

		?>
        <form action="<?= \HD_Helper::home() ?>" class="frm-search" method="get" accept-charset="UTF-8">
            <label for="<?= $id ?>" class="sr-only"><?= $title_for ?></label>
            <input id="<?= $id ?>" required pattern="^(.*\S+.*)$" type="search" autocomplete="off" name="s" value="<?= get_search_query() ?>" placeholder="<?= $placeholder_title; ?>">
            <button type="submit" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z"/></svg>
				<?= $title ? '<span>' . $title . '</span>' : '' ?>
            </button>
			<?php echo \HD_Helper::isWoocommerceActive() ? '<input type="hidden" name="post_type" value="product">' : ''; ?>
        </form>
		<?php

		return '<div class="inline-search' . $class . '">' . ob_get_clean() . '</div>';
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function dropdownSearch( array $atts = [] ): string {
		static $dropdown_search_counter = 0;
		$id = 'search-' . substr( md5( __METHOD__ . ++ $dropdown_search_counter ), 0, 10 );

		$atts = shortcode_atts(
			[
				'title' => '',
				'class' => '',
				'id'    => \HD_Helper::escAttr( $id ),
			],
			$atts,
			'dropdown_search'
		);

		$title             = $atts['title'] ?: __( 'Tìm kiếm', TEXT_DOMAIN );
		$title_for         = __( 'Tìm kiếm cho', TEXT_DOMAIN );
		$placeholder_title = \HD_Helper::escAttr( __( 'Tìm kiếm...', TEXT_DOMAIN ) );
		$class             = $atts['class'] ? ' ' . \HD_Helper::escAttr( $atts['class'] ) : '';
		$id                = $atts['id'] ? \HD_Helper::escAttr( $atts['id'] ) : \HD_Helper::escAttr( $id );

		ob_start();

		?>
        <a class="dropdown-trigger" title="<?= \HD_Helper::escAttr( $title ) ?>" href="javascript:;" data-toggle="dropdown-<?= $id ?>">
            <svg class="w-6 h-6 svg-search" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z"/></svg>
            <svg class="w-6 h-6 svg-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L17.94 6M18 18L6.06 6"/></svg>
            <span><?= $title ?></span>
        </a>
        <div role="search" class="dropdown-pane" id="dropdown-<?= $id ?>" data-dropdown data-auto-focus="true">
            <form action="<?= \HD_Helper::home() ?>" class="frm-search" method="get" accept-charset="UTF-8">
                <div class="frm-container">
                    <label for="<?= $id ?>" class="sr-only"><?= $title_for ?></label>
                    <input id="<?= $id ?>" required pattern="^(.*\S+.*)$" type="search" name="s" value="<?= get_search_query() ?>" placeholder="<?= $placeholder_title ?>">
                    <button class="btn-s" type="submit" aria-label="Search">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z"/></svg>
                        <span><?= $title ?></span>
                    </button>
                </div>
				<?php

				\HD_Helper::blockTemplate( 'parts/blocks/search-hint', [], true );
				echo \HD_Helper::isWoocommerceActive() ? '<input type="hidden" name="post_type" value="product">' : '';

				?>
            </form>
        </div>
		<?php

		return '<div class="dropdown-search' . $class . '">' . ob_get_clean() . '</div>';
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function offCanvasButton( array $atts = [] ): string {
		$atts = shortcode_atts(
			[
				'title'           => '',
				'hide_if_desktop' => 1,
				'class'           => '',
			],
			$atts,
			'offcanvas_button'
		);

		$title = $atts['title'] ?: __( 'Menu', TEXT_DOMAIN );
		$class = ! empty( $atts['hide_if_desktop'] ) ? ' !lg:hidden' : '';
		$class .= $atts['class'] ? ' ' . \HD_Helper::escAttr( $atts['class'] ) . $class : '';

		ob_start();

		?>
        <button class="menu-lines flex items-center gap-3 hover:text-[#000] dark:hover:text-(--color-white)" type="button" data-open="offCanvasMenu" aria-label="button">
            <span class="line w-[26px] h-[18px] flex flex-col flex-nowrap justify-between">
				<span class="line-1 relative w-full"></span>
				<span class="line-2 relative w-full"></span>
				<span class="line-3 relative w-full"></span>
			</span>
            <span class="menu-txt text-[15px] font-light order-1 hidden md:block"><?= $title ?></span>
        </button>
		<?php
		return '<div class="off-canvas-content' . $class . '" data-off-canvas-content>' . ob_get_clean() . '</div>';
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return bool|string
	 */
	public function horizontalMenu( array $atts = [] ): bool|string {
		static $horizontal_menu_counter = 0;
		$id = 'menu-' . substr( md5( __METHOD__ . ++ $horizontal_menu_counter ), 0, 10 );

		$atts = shortcode_atts(
			[
				'location'         => 'main-nav',
				'class'            => 'dropdown menu horizontal-menu',
				'extra_class'      => '',
				'id'               => \HD_Helper::escAttr( $id ),
				'depth'            => 4,
				'li_class'         => '',
				'li_depth_class'   => '',
				'link_class'       => '',
				'link_depth_class' => '',
			],
			$atts,
			'horizontal_menu'
		);

		$location         = $atts['location'] ? \HD_Helper::escAttr( $atts['location'] ) : 'main-nav';
		$class            = $atts['class'] ? \HD_Helper::escAttr( $atts['class'] ) . ' ' . $location : $location;
		$extra_class      = $atts['extra_class'] ? \HD_Helper::escAttr( $atts['extra_class'] ) : '';
		$depth            = $atts['depth'] ? absint( $atts['depth'] ) : 1;
		$id               = $atts['id'] ?: \HD_Helper::escAttr( $id );
		$li_class         = ! empty( $atts['li_class'] ) ? \HD_Helper::escAttr( $atts['li_class'] ) : '';
		$li_depth_class   = ! empty( $atts['li_depth_class'] ) ? \HD_Helper::escAttr( $atts['li_depth_class'] ) : '';
		$link_class       = ! empty( $atts['link_class'] ) ? \HD_Helper::escAttr( $atts['link_class'] ) : '';
		$link_depth_class = ! empty( $atts['link_depth_class'] ) ? \HD_Helper::escAttr( $atts['link_depth_class'] ) : '';

		return \HD_Helper::horizontalNav( [
			'menu_id'          => $id,
			'menu_class'       => ! empty( $extra_class ) ? $class . ' ' . $extra_class : $class,
			'theme_location'   => $location,
			'depth'            => $depth,
			'li_class'         => $li_class,
			'li_depth_class'   => $li_depth_class,
			'link_class'       => $link_class,
			'link_depth_class' => $link_depth_class,
			'echo'             => false,
		] );
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return bool|string
	 */
	public function verticalMenu( array $atts = [] ): bool|string {
		static $vertical_menu_counter = 0;
		$id = 'menu-' . substr( md5( __METHOD__ . ++ $vertical_menu_counter ), 0, 10 );

		$atts = shortcode_atts(
			[
				'location'         => 'mobile-nav',
				'class'            => 'menu vertical vertical-menu mobile-menu',
				'extra_class'      => '',
				'id'               => \HD_Helper::escAttr( $id ),
				'depth'            => 4,
				'li_class'         => '',
				'li_depth_class'   => '',
				'link_class'       => '',
				'link_depth_class' => '',
			],
			$atts,
			'vertical_menu'
		);

		$location         = $atts['location'] ? \HD_Helper::escAttr( $atts['location'] ) : 'mobile-nav';
		$class            = $atts['class'] ? \HD_Helper::escAttr( $atts['class'] ) . ' ' . $location : $location;
		$extra_class      = $atts['extra_class'] ? \HD_Helper::escAttr( $atts['extra_class'] ) : '';
		$depth            = $atts['depth'] ? absint( $atts['depth'] ) : 1;
		$id               = $atts['id'] ?: \HD_Helper::escAttr( $id );
		$li_class         = ! empty( $atts['li_class'] ) ? \HD_Helper::escAttr( $atts['li_class'] ) : '';
		$li_depth_class   = ! empty( $atts['li_depth_class'] ) ? \HD_Helper::escAttr( $atts['li_depth_class'] ) : '';
		$link_class       = ! empty( $atts['link_class'] ) ? \HD_Helper::escAttr( $atts['link_class'] ) : '';
		$link_depth_class = ! empty( $atts['link_depth_class'] ) ? \HD_Helper::escAttr( $atts['link_depth_class'] ) : '';

		return \HD_Helper::verticalNav( [
			'menu_id'          => $id,
			'menu_class'       => ! empty( $extra_class ) ? $class . ' ' . $extra_class : $class,
			'theme_location'   => $location,
			'depth'            => $depth,
			'li_class'         => $li_class,
			'li_depth_class'   => $li_depth_class,
			'link_class'       => $link_class,
			'link_depth_class' => $link_depth_class,
			'echo'             => false,
		] );
	}

	// ------------------------------------------------------

	/**
	 * @param array $atts
	 *
	 * @return false|string|null
	 */
	public function posts( array $atts = [] ): false|string|null {
		$default_atts = [
			'post_type'        => 'post',
			'taxonomy'         => 'category',
			'term_ids'         => [],
			'exclude_ids'      => [],
			'include_children' => false,
			'limit'            => 12,
			'orderby'          => 'date',
			'order'            => 'DESC',
			'wrapper_tag'      => '',
			'wrapper_class'    => '',
			'show'             => [
				'title_tag'      => 'p',
				'thumbnail'      => true,
				'thumbnail_size' => 'medium',
				'scale'          => false,
				'time'           => true,
				'term'           => true,
				'desc'           => true,
				'view_more'      => true,
			],
		];

		$atts = shortcode_atts(
			$default_atts,
			$atts,
			'posts'
		);

		$term_ids         = $atts['term_ids'] ?: [];
		$exclude_ids      = $atts['exclude_ids'] ?: [];
		$limit            = $atts['limit'] ? absint( $atts['limit'] ) : \HD_Helper::getOption( 'posts_per_page' );
		$include_children = \HD_Helper::toBool( $atts['include_children'] );

		$r = \HD_Helper::queryByTerms(
			$term_ids,
			$atts['post_type'],
			$atts['taxonomy'],
			$limit,
			true,
			$include_children,
			$exclude_ids,
			$atts['orderby'],
			$atts['order'],
		);

		if ( ! $r ) {
			return null;
		}

		$wrapper_open  = $atts['wrapper'] ? '<' . $atts['wrapper'] . ' class="' . $atts['wrapper_class'] . '">' : '';
		$wrapper_close = $atts['wrapper'] ? '</' . $atts['wrapper'] . '>' : '';

		ob_start();
		$i = 0;

		// Load slides loop.
		while ( $r->have_posts() && $i < $limit ) :
			$r->the_post();

			echo $wrapper_open;
			get_template_part( 'template-parts/post/loop', null, $atts['show'] );
			echo $wrapper_close;

			++ $i;
		endwhile;
		wp_reset_postdata();

		return ob_get_clean();
	}

	// ------------------------------------------------------
}
