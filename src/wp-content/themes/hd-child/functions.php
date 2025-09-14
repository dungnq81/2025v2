<?php
/**
 * Theme functions and definitions
 *
 * @author Gaudev
 */

add_action( 'wp_enqueue_scripts', '_wp_enqueue_scripts', 999 );

/**
 * @return void
 * @throws JsonException
 */
function _wp_enqueue_scripts(): void {
	if ( ! class_exists( \HD_Asset::class ) || ! class_exists( \HD_Helper::class ) ) {
		return;
	}

	$version = \HD_Helper::version();

	\HD_Asset::enqueueStyle( '_style', get_stylesheet_directory_uri() . '/assets/css/index.css', [ \HD_Asset::handle( 'index.scss' ) ], $version );
	\HD_Asset::enqueueScript( '_script', get_stylesheet_directory_uri() . '/assets/js/index.js', [ \HD_Asset::handle( 'index.js' ) ], $version, true, [ 'defer' ] );
}
