<?php

namespace HD\Services;

use HD\Utilities\Helper;
use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class Service {
	use Singleton;

	/** ---------------------------------------- */

	private function init(): void {
		$this->register_all();
	}

	/** ---------------------------------------- */

	private function register_all(): void {
		$modules_dir = __DIR__ . DIRECTORY_SEPARATOR . 'Modules';
		$FQN         = '\\HD\\Services\\Modules\\';

		Helper::createDirectory( $modules_dir );
		Helper::FQNLoad( $modules_dir, false, true, $FQN );
	}

	/** ---------------------------------------- */
}
