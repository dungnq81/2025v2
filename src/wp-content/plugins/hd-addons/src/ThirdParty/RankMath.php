<?php

namespace Addons\ThirdParty;

\defined( 'ABSPATH' ) || exit;

/**
 * RankMath SEO
 *
 * @author Gaudev
 */
final class RankMath {
	// --------------------------------------------------

	public function __construct() {
		add_filter( 'rank_math/frontend/breadcrumb/args', [ $this, 'breadcrumb_args' ] );
		add_filter( 'rank_math/frontend/show_keywords', '__return_true' );

		// Remove admin-bar
		add_action( 'wp_before_admin_bar_render', static function () {
			if ( is_admin_bar_showing() ) {
				global $wp_admin_bar;
				$wp_admin_bar->remove_menu( 'rank-math' );
			}
		} );

		/**
		 * Filter to add plugins to the RMS TOC.
		 */

		add_filter( 'rank_math/researches/toc_plugins', static function ( $toc_plugins ) {
			$preferred = [
				'fixed-toc/fixed-toc.php'                           => 'Fixed TOC',
				'tocer/tocer.php'                                   => 'Tocer',
				'easy-table-of-contents/easy-table-of-contents.php' => 'Easy Table of Contents',
				'table-of-contents-plus/toc.php'                    => 'Table of Contents Plus',
			];

			foreach ( $preferred as $file => $label ) {
				if ( \Addons\Helper::checkPluginActive( $file ) ) {
					return [ $file => $label ];
				}
			}

			return $toc_plugins;
		}, PHP_INT_MAX );
	}

	// --------------------------------------------------

	/**
	 * @param $args
	 *
	 * @return array
	 */
	public function breadcrumb_args( $args ): array {
		return [
			'delimiter'   => '',
			'wrap_before' => '<ul id="breadcrumbs" class="breadcrumbs" aria-label="Breadcrumbs">',
			'wrap_after'  => '</ul>',
			'before'      => '<li><span property="itemListElement" typeof="ListItem">',
			'after'       => '</span></li>',
		];
	}
}
