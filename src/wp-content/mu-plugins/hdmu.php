<?php
/**
 * Plugin Name: HDMU
 * Description: mu-plugins for HD theme
 * Version: 1.10.0
 * Requires PHP: 8.2
 * Author: Gaudev
 * License: MIT
 */

define( 'MU_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR );
define( 'MU_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) . '/' );
define( 'MU_BASENAME', plugin_basename( __FILE__ ) );

if ( is_blog_installed() && file_exists( __DIR__ . '/hdmu/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/hdmu/vendor/autoload.php';

	function plugins_loaded(): void {
		require_once MU_PATH . 'hdmu' . DIRECTORY_SEPARATOR . 'HDMU.php';
		( new \HDMU() );
	}

	\plugins_loaded();
}
