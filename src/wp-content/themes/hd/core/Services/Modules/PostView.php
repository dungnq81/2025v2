<?php
/**
 * Post Views Service.
 *
 * @author Gaudev
 */

namespace HD\Services\Modules;

use HD\Services\AbstractService;
use HD\Utilities\DB;
use HD\Utilities\Helper;
use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class PostView extends AbstractService {
    use Singleton;

    // -----------------------------------------

    protected const int VIEW_COOLDOWN = 240; // 4 minutes
    protected string $table = 'post_views';

    // -----------------------------------------

    /**
     * @param int $post_id
     * @param string $ip
     *
     * @return void
     */
    public function record_view( int $post_id, string $ip ): void {
        // Ensure the table exists before recording views
        $this->ensure_tables_exist();

        $now       = time();
        $packed_ip = inet_pton( $ip );

        // Fetch existing record for this post and IP (if any)
        $record = DB::get_one( $this->table, 'post_id = %d AND ip = %s', [ $post_id, $packed_ip ] );

        // First visit from this IP
        if ( ! $record ) {
            DB::insert_one_row(
                $this->table,
                [
                    'post_id'    => $post_id,
                    'ip'         => $packed_ip,
                    'last_view'  => $now,
                    'view_count' => 1,
                ]
            );

            return;
        }

        if ( isset( $record['id'], $record['last_view'] ) ) {

            // Same IP, within cooldown period
            if ( ( $now - (int) $record['last_view'] ) < self::VIEW_COOLDOWN ) {
                DB::update_one_row(
                    $this->table,
                    $record['id'],
                    [ 'last_view' => $now ]
                );

                return;
            }

            // Cooldown expired, increment view count
            DB::update_one_row(
                $this->table,
                $record['id'],
                [
                    'view_count' => (int) $record['view_count'] + 1,
                    'last_view'  => $now,
                ]
            );
        }
    }

    // -----------------------------------------

    /**
     * @param int $post_id
     *
     * @return int
     */
    public function get_total_views( int $post_id ): int {
        return Helper::totalPostViews( $this->table, $post_id );
    }

    // -----------------------------------------

    private function ensure_tables_exist(): void {
        DB::create_table(
            $this->table,
            'id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			post_id BIGINT UNSIGNED NOT NULL,
			ip VARBINARY(45) NOT NULL,
			last_view INT UNSIGNED NOT NULL,
			view_count INT UNSIGNED DEFAULT 1,
			UNIQUE KEY unique_view (post_id, ip),
			KEY post_id_idx (post_id)'
        );
    }

    // -----------------------------------------
}
