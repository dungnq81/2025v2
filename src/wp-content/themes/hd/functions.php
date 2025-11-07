<?php
/**
 * Theme functions and definitions.
 *
 * Initializes the HD Theme core, loads dependencies,
 * defines constants, and ensures compatibility with PHP 8.3 or newer.
 *
 * @author Gaudev
 */

const THEME_VERSION = '1.11.0';
const TEXT_DOMAIN   = 'hd2026';
const AUTHOR        = 'Gaudev';

define( 'THEME_PATH', untrailingslashit( get_template_directory() ) . DIRECTORY_SEPARATOR ); // **\wp-content\themes\**\
define( 'THEME_URL', untrailingslashit( get_template_directory_uri() ) . '/' );  // http(s)://**/wp-content/themes/**/

/**
 * @param $error_message
 *
 * @return void
 */
function _static_error( $error_message ): void {
	add_action( 'admin_notices', static function () use ( $error_message ) {
		echo '<div class="notice notice-error"><p>' . esc_html( $error_message ) . '</p></div>';
	} );

	if ( ! is_admin() ) {
		get_template_part( 'parts/blocks/php-error', null, [ 'error_message' => $error_message ] );
		die();
	}
}

// PHP version guard (8.3 or newer)
if ( PHP_VERSION_ID < 80300 ) {
	_static_error( 'HD Theme: requires PHP 8.3 or newer. Please upgrade your PHP version.' );

	return;
}

// Autoload classes (PSR-4 via composer)
$autoload = __DIR__ . '/vendor/autoload.php';
if ( ! file_exists( $autoload ) ) {
	_static_error( 'HD Theme: missing vendor autoload file. Please run `composer install`.' );

	return;
}

require_once $autoload; // composer dump-autoload -o --classmap-authoritative

class_alias( \HD\Utilities\Helper::class, 'HD_Helper' );
class_alias( \HD\Utilities\Asset::class, 'HD_Asset' );

// Bootstrap the theme core
( \HD\Bootstrap::get_instance() );
