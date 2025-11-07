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
use HD\Utilities\Helper;

\defined( 'ABSPATH' ) || die;

class Base extends AbstractAPI {
	public function __construct() {
		$this->namespace = self::REST_NAMESPACE;
		$this->rest_base = 'base';
	}

	/** ---------------------------------------- */

	protected function registerRoutes(): void {
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/lighthouse",
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
		if ( ! $this->rateLimit( 'global_lighthouse', 30, 60 ) ) {
			return new \WP_Error(
				'too_many_requests',
				__( 'Too many requests from your IP.', TEXT_DOMAIN ),
				[ 'status' => 429 ]
			);
		}

		return true;
	}

	/**
	 * @param $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function lightHouseCallback( $request ): \WP_Error|\WP_REST_Response {
		$nonce_check = $this->verifyNonce( $request );
		if ( $nonce_check instanceof \WP_REST_Response ) {
			return $nonce_check;
		}

		$result = [
			'success'  => true,
			'detected' => Helper::lightHouse(),
		];

		return $this->sendResponse( $result, 200 );
	}
}
