<?php

namespace HD\Events;

use HD\Utilities\Helper;

defined( 'ABSPATH' ) || die;

abstract class AbstractEvent {
    protected string $hook_name;
    protected string $interval = 'weekly';

    /** ---------------------------------------- */

    /**
     * @param string $hook_name
     * @param string $interval
     */
    public function __construct( string $hook_name = '', string $interval = 'weekly' ) {
        $this->hook_name = $hook_name;
        $this->interval  = $interval;

        if ( empty( $this->hook_name ) ) {
            return;
        }

        add_action( $this->hook_name, [ $this, 'handle' ] );
    }

    /** ---------------------------------------- */

    abstract public function handle();

    /** ---------------------------------------- */

    public function schedule(): void {
        if ( empty( $this->hook_name ) || empty( $this->interval ) ) {
            return;
        }

        if ( ! wp_next_scheduled( $this->hook_name ) ) {
            wp_schedule_event( time(), $this->interval, $this->hook_name );
            $this->log( "Cron job scheduled for '{$this->hook_name}' with interval '{$this->interval}'." );
        }
    }

    /** ---------------------------------------- */

    public function unschedule(): void {
        if ( empty( $this->hook_name ) ) {
            return;
        }

        $timestamp = wp_next_scheduled( $this->hook_name );
        if ( $timestamp ) {
            wp_unschedule_event( $timestamp, $this->hook_name );
        }
    }

    /** ---------------------------------------- */

    /**
     * @param $message
     *
     * @return void
     */
    public function log( $message ): void {
        Helper::errorLog( '[' . static::class . '] ' . $message );
    }
}
