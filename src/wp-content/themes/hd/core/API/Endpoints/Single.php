<?php
/**
 * Class Single
 *
 * Registers and handles all REST API endpoints for single resources in WordPress
 * (e.g., posts, pages, attachments).
 *
 * @author Gaudev
 */

namespace HD\API\Endpoints;

use HD\API\AbstractAPI;
use HD\Services\Modules\PostView;
use HD\Utilities\Helper;

\defined( 'ABSPATH' ) || die;

final class Single extends AbstractAPI {
	public function __construct() {
		$this->namespace = self::REST_NAMESPACE;
		$this->rest_base = 'single';
	}

	/** ---------------------------------------- */

	/**
	 * Register custom REST routes.
	 *
	 * @return void
	 */
	protected function registerRoutes(): void {
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/track_views",
			[
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'trackViewsCallback' ],
				'permission_callback' => '__return_true',
				'args'                => [
					'id' => [
						'required'          => true,
						'sanitize_callback' => 'absint',
						'validate_callback' => fn( $v ) => $v > 0,
					],
				],
			]
		);
	}

	/** ---------------------------------------- */

	/**
	 * Actual endpoint callback.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function trackViewsCallback( \WP_REST_Request $request ): \WP_Error|\WP_REST_Response {
		$nonce_check = $this->verifyNonce( $request );
		if ( $nonce_check instanceof \WP_REST_Response ) {
			return $nonce_check;
		}

		$id = absint( $request['id'] ?? 0 );
		if ( ! $id || ! get_post( $id ) ) {
			return $this->sendResponse( [
				'success' => false,
				'message' => 'Invalid post ID.',
			], 400 );
		}

		$ip           = Helper::ipAddress();
		$current_time = current_time( 'U', 0 );

		try {
			$service = Helper::FQNLoadedInstance( PostView::class ) ?? new PostView();
			$service->record_view( $id, $ip );
			$total_views = $service->get_total_views( $id );
		} catch ( \Throwable $e ) {
			return $this->sendResponse( [
				'success' => false,
				'message' => 'Failed to record view: ' . $e->getMessage(),
			], 500 );
		}

		return $this->sendResponse( [
			'success' => true,
			'post_id' => $id,
			'ip'      => $ip,
			'time'    => $current_time,
			'views'   => $total_views,
			'date'    => Helper::humanizeTime( $id ),
			'message' => 'View recorded successfully.',
		], 200 );
	}
}
