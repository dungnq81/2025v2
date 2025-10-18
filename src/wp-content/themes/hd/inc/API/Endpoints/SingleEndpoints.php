<?php
/**
 * Class SingleEndpoints
 *
 * Registers and handles all REST API endpoints for single resources in WordPress
 * (e.g., posts, pages, attachments).
 *
 * @author Gaudev
 */

namespace HD\API\Endpoints;

use HD\API\AbstractAPI;

\defined( 'ABSPATH' ) || die;

class SingleEndpoints extends AbstractAPI {
	/** ---------------------------------------- */

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public function registerRestRoutes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/single/track_views',
			[
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'trackViewsCallback' ],
				'permission_callback' => [ $this, 'canTrackViews' ],
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
	 * @return bool|\WP_Error
	 */
	public function canTrackViews(): bool|\WP_Error {
		if ( ! $this->rateLimit( 'single_track_view', 10, 60 ) ) {
			return new \WP_Error( 'too_many_requests', 'Too many requests from your IP.', [ 'status' => 429 ] );
		}

		return true;
	}

	/**
	 * @param $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function trackViewsCallback( $request ): \WP_Error|\WP_REST_Response {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! self::BYPASS_NONCE && ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) ) {
			return self::sendResponse( [
				'success' => false,
				'message' => 'Invalid CSRF token.',
			], 403 );
		}

		$id = absint( $request['id'] ?? 0 );
		if ( ! $id || ! get_post( $id ) ) {
			return self::sendResponse( [
				'success' => false,
				'message' => 'Invalid post ID.',
			], 400 );
		}

		$views        = (int) get_post_meta( $id, '_post_views', true );
		$last_view    = (int) get_post_meta( $id, '_last_view_time', true );
		$current_time = current_time( 'U', 0 );

		if ( ( $current_time - $last_view ) > 300 ) { // 300 s
			$views ++;
			update_post_meta( $id, '_post_views', $views );
			update_post_meta( $id, '_last_view_time', $current_time );
		}

		return self::sendResponse( [
			'success' => true,
			'time'    => $current_time,
			'views'   => $views,
			'date'    => \HD_Helper::humanizeTime( $id ),
		], 200 );
	}
}
