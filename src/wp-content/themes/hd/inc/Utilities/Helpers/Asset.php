<?php
/**
 * Theme Asset Manager
 *
 * This file defines the Asset class, a utility class responsible for managing
 * all CSS and JavaScript assets in the theme. It provides methods for collecting,
 * registering, and enqueueing styles and scripts efficiently.
 *
 * The class helps maintain a clean and optimized loading strategy for frontend
 * and backend assets.
 *
 * @author Gaudev
 */

namespace HD\Utilities\Helpers;

\defined( 'ABSPATH' ) || die;

final class Asset {
	// ----------------------------------------

	/**
	 * Return theme version helper passthrough.
	 *
	 * @return string|bool|null
	 */
	public static function version(): bool|string|null {
		return Helper::version();
	}

	// ----------------------------------------

	/**
	 * Resolve src from manifest
	 *
	 * @param string|null $entry
	 * @param bool $relative_link
	 *
	 * @return string
	 */
	public static function src( ?string $entry = null, bool $relative_link = false ): string {
		if ( empty( $entry ) ) {
			return '';
		}

		$resolve = Helper::manifestResolve( $entry );
		$src     = $resolve['src'] ?? '';
		if ( ! $src ) {
			return '';
		}

		return $relative_link ? str_replace( THEME_URL, '', $src ) : $src;
	}

	// ----------------------------------------

	/**
	 * Resolve handle for manifest entry
	 *
	 * @param string|null $entry
	 * @param string $handle_prefix
	 *
	 * @return string
	 */
	public static function handle( ?string $entry = null, string $handle_prefix = '' ): string {
		if ( empty( $entry ) ) {
			return '';
		}

		$resolve = Helper::manifestResolve( $entry, $handle_prefix );

		return $resolve['handle'] ?? '';
	}

	// ----------------------------------------

	/**
	 * Preload JS imports (modulepreload).
	 *
	 * @param string|null $entry
	 * @param string $handle_prefix
	 *
	 * @return void
	 */
	public static function preload( ?string $entry = null, string $handle_prefix = '' ): void {
		if ( empty( $entry ) ) {
			return;
		}

		$imports = [ 'vendor.js' ];
		$tmp     = Helper::manifestResolve( $entry, $handle_prefix );
		if ( ! empty( $tmp['imports'] ) ) {
			$imports = array_merge( $imports, (array) $tmp['imports'] );
		}

		$imports = array_unique( $imports );
		$links   = '';

		foreach ( $imports as $import ) {
			$resolve = Helper::manifestResolve( $import );
			if ( ! empty( $resolve['src'] ) ) {
				$href  = esc_url( $resolve['src'] );
				$links .= '<link rel="modulepreload" href="' . $href . '" as="script" type="module" crossorigin>';
			}
		}

		echo wp_kses( $links, [
			'link' => [
				'rel'         => [],
				'href'        => [],
				'as'          => [],
				'type'        => [],
				'crossorigin' => [],
			]
		] );
	}

	// ----------------------------------------

	/**
	 * Preload CSS file (non-critical CSS)
	 *
	 * @param string|null $entry
	 *
	 * @return void
	 */
	public static function preloadCSS( ?string $entry = null ): void {
		if ( empty( $entry ) ) {
			return;
		}

		$resolve = Helper::manifestResolve( $entry );
		if ( empty( $resolve['src'] ) ) {
			return;
		}

		$href = esc_url( $resolve['src'] );
		$tag  = sprintf(
			'<link rel="preload" href="%s" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">',
			$href
		);

		echo wp_kses( $tag, [
			'link' => [
				'rel'    => [],
				'href'   => [],
				'as'     => [],
				'onload' => []
			]
		] );
	}

	// ----------------------------------------

	/**
	 * Enqueue CSS by manifest entry
	 *
	 * @param string|null $entry
	 * @param array $deps
	 * @param string|bool|null $ver
	 * @param string $media
	 *
	 * @return void
	 */
	public static function enqueueCSS( ?string $entry = null, array $deps = [], string|bool|null $ver = null, string $media = 'all' ): void {
		if ( empty( $entry ) ) {
			return;
		}

		$resolve = Helper::manifestResolve( $entry );
		if ( empty( $resolve ) ) {
			return;
		}

		$resolve['deps']  = $deps;
		$resolve['ver']   = $ver;
		$resolve['media'] = $media;

		self::enqueueStyle( $resolve );
	}

	// ----------------------------------------

	/**
	 * Enqueue JS by manifest entry
	 *
	 * @param string|null $entry
	 * @param array $deps
	 * @param string|bool|null $ver
	 * @param bool $in_footer
	 * @param array $extra
	 *
	 * @return void
	 */
	public static function enqueueJS( ?string $entry = null, array $deps = [], string|bool|null $ver = null, bool $in_footer = true, array $extra = [] ): void {
		if ( empty( $entry ) ) {
			return;
		}

		$resolve = Helper::manifestResolve( $entry );
		if ( empty( $resolve ) ) {
			return;
		}

		$resolve['deps']      = $deps;
		$resolve['ver']       = $ver;
		$resolve['in_footer'] = $in_footer;
		$resolve['extra']     = $extra;

		self::enqueueScript( $resolve );
	}

	// ----------------------------------------

	/**
	 * Enqueue style helper (supports array or scalar args)
	 *
	 * @param string|array $handle
	 * @param string|bool|null $src
	 * @param array $deps
	 * @param string|bool|null $ver
	 * @param string $media
	 *
	 * @return void
	 */
	public static function enqueueStyle( string|array $handle, string|bool|null $src = null, array $deps = [], string|bool|null $ver = null, string $media = 'all' ): void {
		if ( is_array( $handle ) ) {
			$args = wp_parse_args( $handle, [
				'handle' => '',
				'src'    => null,
				'deps'   => [],
				'ver'    => null,
				'media'  => 'all',
			] );
		} else {
			$args = [
				'handle' => $handle,
				'src'    => $src,
				'deps'   => $deps,
				'ver'    => $ver,
				'media'  => $media,
			];
		}

		if ( empty( $args['handle'] ) || empty( $args['src'] ) ) {
			return;
		}

		if ( ! wp_style_is( $args['handle'], 'registered' ) ) {
			wp_register_style( $args['handle'], $args['src'], $args['deps'], $args['ver'], $args['media'] );
		}

		wp_enqueue_style( $args['handle'] );
	}

	// ----------------------------------------

	/**
	 * Enqueue script helper (supports script attributes via 'extra' or 'attrs')
	 *
	 * @param string|array $handle
	 * @param string|bool|null $src
	 * @param array $deps
	 * @param string|bool|null $ver
	 * @param bool $in_footer
	 * @param array $extra - Ex. [ 'module', 'defer' ]
	 *
	 * @return void
	 */
	public static function enqueueScript( string|array $handle, string|bool|null $src = null, array $deps = [], string|bool|null $ver = null, bool $in_footer = true, array $extra = [] ): void {
		if ( is_array( $handle ) ) {
			$args = wp_parse_args( $handle, [
				'handle'    => '',
				'src'       => null,
				'url'       => null,
				'deps'      => [],
				'ver'       => null,
				'in_footer' => true,
				'extra'     => [],
				'attr'      => [],
			] );

			if ( empty( $args['src'] ) && ! empty( $args['url'] ) ) {
				$args['src'] = $args['url'];
			}

			if ( ! empty( $args['attr'] ) && empty( $args['extra'] ) ) {
				$args['extra'] = $args['attr'];
			}
		} else {
			$args = [
				'handle'    => $handle,
				'src'       => $src,
				'deps'      => $deps,
				'ver'       => $ver,
				'in_footer' => $in_footer,
				'extra'     => $extra,
			];
		}

		// Validate
		if ( empty( $args['handle'] ) || empty( $args['src'] ) ) {
			return;
		}

		// Register if not registered
		if ( ! wp_script_is( $args['handle'], 'registered' ) ) {
			wp_register_script( $args['handle'], $args['src'], $args['deps'], $args['ver'], (bool) $args['in_footer'] );
		}

		// Enqueue
		wp_enqueue_script( $args['handle'] );

		if ( ! empty( $args['extra'] ) ) {
			wp_script_add_data( $args['handle'], 'extra', $args['extra'] );
		}
	}

	// ----------------------------------------

	/**
	 * Localize JS data safely. If modern approach preferred, it will add inline script JSON.
	 *
	 * @param string $handle
	 * @param string $object_name
	 * @param array|bool|null $l10n
	 * @param bool $as_inline_json If true, use wp_add_inline_script(json) instead of wp_localize_script
	 *
	 * @return void
	 */
	public static function localize( string $handle, string $object_name, array|bool|null $l10n, bool $as_inline_json = true ): void {
		if ( empty( $object_name ) || empty( $l10n ) ) {
			return;
		}

		if ( ! ( wp_script_is( $handle, 'registered' ) || wp_script_is( $handle ) ) ) {
			return;
		}

		if ( $as_inline_json ) {
			$json = wp_json_encode( $l10n );
			if ( $json === false ) {
				return;
			}
			$script = sprintf( 'window.%s = %s;', $object_name, $json );
			wp_add_inline_script( $handle, $script, 'before' );
		} else {
			wp_localize_script( $handle, $object_name, $l10n );
		}
	}

	// ----------------------------------------

	/**
	 * Add inline CSS safely. Fallback register a dummy style.
	 *
	 * @param string $handle
	 * @param string|bool|null $css
	 *
	 * @return void
	 */
	public static function inlineStyle( string $handle, string|null|bool $css ): void {
		if ( empty( $css ) ) {
			return;
		}

		if ( wp_style_is( $handle, 'registered' ) || wp_style_is( $handle ) ) {
			wp_add_inline_style( $handle, $css );
		} else {
			$fallback = 'inline-style-' . md5( $handle );
			wp_register_style( $fallback, false );
			wp_enqueue_style( $fallback );
			wp_add_inline_style( $fallback, $css );
		}
	}

	// ----------------------------------------

	/**
	 * Add inline JS safely. Fallback register a dummy script.
	 *
	 * @param string $handle
	 * @param string|bool|null $code
	 * @param string $position
	 *
	 * @return void
	 */
	public static function inlineScript( string $handle, string|null|bool $code, string $position = 'after' ): void {
		if ( empty( $code ) ) {
			return;
		}

		if ( wp_script_is( $handle, 'registered' ) || wp_script_is( $handle ) ) {
			wp_add_inline_script( $handle, $code, $position );
		} else {
			$fallback = 'inline-script-' . md5( $handle );
			wp_register_script( $fallback, false );
			wp_enqueue_script( $fallback );
			wp_add_inline_script( $fallback, $code, $position );
		}
	}

	// ----------------------------------------
}
