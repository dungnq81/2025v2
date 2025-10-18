<?php
/**
 * Class GlobalEndpoints
 *
 * Registers and handles all REST API endpoints for global utilities,
 * such as lighthouse checks, site configuration, and notification hooks, v.v...
 *
 * @author Gaudev
 */

namespace HD\API\Endpoints;

use HD\API\AbstractAPI;

\defined( 'ABSPATH' ) || die;

class GlobalEndpoints extends AbstractAPI {
	/** ---------------------------------------- */

	public function registerRestRoutes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/global/lighthouse',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'lightHouseCallback' ],
				'permission_callback' => [ $this, 'canAccess' ],
			]
		);
	}

	/** ---------------------------------------- */

	/**
	 * @return bool|\WP_Error
	 */
	public function canAccess(): bool|\WP_Error {
		if ( ! $this->rateLimit( 'global_lighthouse', 5, 60 ) ) {
			return new \WP_Error( 'too_many_requests', 'Too many requests. Please wait a minute.', [ 'status' => 429 ] );
		}

		return true;
	}

	/**
	 * @param $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function lightHouseCallback( $request ): \WP_Error|\WP_REST_Response {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! self::BYPASS_NONCE && ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) ) {
			return self::sendResponse( [
				'success' => false,
				'message' => 'Invalid CSRF token.',
			], 403 );
		}

		$result = [
			'success'  => true,
			'detected' => \HD_Helper::lightHouse(),
		];

		return self::sendResponse( $result, 200 );
	}
}
