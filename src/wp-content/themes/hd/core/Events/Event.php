<?php
/**
 * Event Manager.
 *
 * @author Gaudev
 */

namespace HD\Events;

use HD\Utilities\Traits\Singleton;

defined( 'ABSPATH' ) || die;

final class Event {
    use Singleton;

    private array $handlers = [];

    // -----------------------------------------

    protected function init(): void {
        add_filter( 'cron_schedules', [ Cron::class, 'register' ] );

        $this->load_handlers();
        $this->register_crons();
    }

    // -----------------------------------------

    private function load_handlers(): void {
        $path = __DIR__ . DIRECTORY_SEPARATOR . 'Handlers';
        if ( ! is_dir( $path ) ) {
            return;
        }

        foreach ( glob( $path . DIRECTORY_SEPARATOR . '*.php', GLOB_NOSORT ) as $file ) {
            $class_name = '\\HD\\Events\\Handlers\\' . basename( $file, '.php' );
            if ( class_exists( $class_name ) ) {
                $this->handlers[] = new $class_name();
            }
        }
    }

    // -----------------------------------------

    private function register_crons(): void {
        foreach ( $this->handlers as $handler ) {
            if ( method_exists( $handler, 'schedule' ) ) {
                $handler->schedule();
            }
        }
    }

    // -----------------------------------------
}
