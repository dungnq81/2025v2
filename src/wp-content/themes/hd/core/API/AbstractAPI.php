<?php
/**
 * Abstract base class for all custom REST API controllers.
 *
 * Provides shared methods and constants for defining REST API namespaces,
 * generating endpoint URLs, and returning standardized REST responses.
 *
 * @author Gaudev
 */

namespace HD\API;

use HD\Utilities\Helper;

\defined( 'ABSPATH' ) || die;

abstract class AbstractAPI extends \WP_REST_Controller {
	public const string REST_NAMESPACE = 'hd/v1';
	public const bool BYPASS_NONCE = false;

	/** ---------------------------------------- */

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		$this->registerRoutes();
	}

	/** ---------------------------------------- */

	abstract protected function registerRoutes(): void;

	/** ---------------------------------------- */

	/**
	 * Generate full REST API URL for a given route.
	 *
	 * @param string $route
	 *
	 * @return string
	 */
	public function restApiUrl( string $route = '' ): string {
		return esc_url_raw( rest_url( self::REST_NAMESPACE . '/' . ltrim( $route, '/' ) ) );
	}

	/** ---------------------------------------- */

	/**
	 * @param $request
	 *
	 * @return \WP_REST_Response|null
	 */
	protected function verifyNonce( $request ): ?\WP_REST_Response {
		if ( self::BYPASS_NONCE ) {
			return null;
		}

		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return $this->sendResponse( [
				'success' => false,
				'message' => 'Invalid CSRF token.',
			], 403 );
		}

		return null;
	}

	/** ---------------------------------------- */

	/**
	 * Send standardized REST response.
	 *
	 * @param array $result
	 * @param int $status
	 * @param array $data
	 *
	 * @return \WP_REST_Response
	 */
	public function sendResponse( array $result = [], int $status = 200, array $data = [] ): \WP_REST_Response {
		$status_code = ( 1 === $status ) ? 200 : $status;
		$result      = array_merge( [
			'success'   => $status_code < 400,
			'status'    => $status_code,
			'errorCode' => 0,
		], $result );

		if ( ! empty( $data ) ) {
			$result['data'] = $data;
		}

		$response = rest_ensure_response( $result );
		$response->set_status( $status_code );

		return $response;
	}

	/** ---------------------------------------- */

	/**
	 * Simple rate limiter using transients.
	 *
	 * @param string $key_prefix
	 * @param int $limit
	 * @param int $window
	 *
	 * @return bool
	 */
	protected function rateLimit( string $key_prefix, int $limit = 30, int $window = 60 ): bool {
		$ip  = Helper::ipAddress();
		$key = "hd_api_rate_{$key_prefix}_" . md5( $ip );

		$count = (int) get_transient( $key );
		if ( $count >= $limit ) {
			return false;
		}

		set_transient( $key, $count + 1, $window );

		return true;
	}
}
