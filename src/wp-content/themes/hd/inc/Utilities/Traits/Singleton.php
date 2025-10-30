<?php
/**
 * Singleton base class for having singleton implementation
 * This allows you to have only one instance of the necessary object
 * You can get the instance with $class = My_Class::get_instance();
 *
 * /!\ The get_instance method has to be implemented in the child class!
 */

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Singleton {

	/** @var static|null */
	protected static $instance = null;

	/**
	 * @return static
	 */
	final public static function get_instance(): static {
		if ( ! isset( static::$instance ) ) {
			static::$instance = new static();
		}

		return static::$instance;
	}

	private function __construct() {
		$this->init();
	}

	protected function init(): void {}

	final public function __clone(): void {}

	final public function __wakeup(): void {
		throw new \RuntimeException( 'Cannot unserialize singleton.' );
	}
}
