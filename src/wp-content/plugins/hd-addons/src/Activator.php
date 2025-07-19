<?php
declare( strict_types=1 );

namespace Addons;

\defined( 'ABSPATH' ) || exit;

final class Activator {
	public static function activation(): void {}
	public static function deactivation(): void {}
	public static function uninstall(): void {}
}
