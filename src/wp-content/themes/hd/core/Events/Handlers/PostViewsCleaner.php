<?php

namespace HD\Events\Handlers;

use HD\Events\AbstractEvent;
use HD\Utilities\DB;

defined( 'ABSPATH' ) || die;

final class PostViewsCleaner extends AbstractEvent {
    protected static string $default_hook_name = '_clean_post_views_handler';
    protected string $interval = 'weekly';
    protected string $table = 'post_views';

    // -----------------------------------------

    /**
     * @param $hook_name
     */
    public function __construct( $hook_name = null ) {
        parent::__construct(
            $hook_name ?? self::$default_hook_name,
            $this->interval
        );
    }

    // -----------------------------------------

    public function handle(): void {
        if ( DB::table_exists( $this->table ) ) {
            return;
        }

        $sql = "DELETE pv FROM " . DB::backticked_table( $this->table ) . " AS pv
        	LEFT JOIN " . DB::db()->posts . " AS p ON pv.post_id = p.ID
        	WHERE p.ID IS NULL";

        $deleted = DB::db()->query( $sql );
        if ( $deleted ) {
            $this->log( "Deleted $deleted rows from $this->table" );
        }
    }
}
