<?php
declare( strict_types=1 );

namespace Addons\CustomCss;

\defined( 'ABSPATH' ) || exit;

final class CustomCss {
	// ------------------------------------------------------

	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'header_inline_custom_css' ], 99 );
	}

	// ------------------------------------------------------

	public function header_inline_custom_css(): void {
		$css = \Addons\Helper::getCustomPostContent( 'addon_css', false );
		if ( $css ) {
			$css = \Addons\Helper::CSSMinify( $css, true );
			\Addons\Asset::inlineStyle( 'index-css', $css );
		}
	}
}
