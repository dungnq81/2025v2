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

\defined( 'ABSPATH' ) || die;

abstract class AbstractAPI {
	public const BYPASS_NONCE = false;
	public const REST_NAMESPACE = 'hd/v1';

	/** ---------------------------------------- */

	abstract public function registerRestRoutes();

	/** ---------------------------------------- */

	/**
	 * @param string $route
	 *
	 * @return string
	 */
	public function restApiUrl( string $route = '' ): string {
		return esc_url_raw( rest_url( self::REST_NAMESPACE . '/' . ltrim( $route, '/' ) ) );
	}

	/**
	 * @param array $result
	 * @param int $status
	 * @param array $data
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function sendResponse( array $result = [], int $status = 1, array $data = [] ): \WP_REST_Response|\WP_Error {
		$status_code = ( 1 === $status ) ? 200 : $status;

		$result = array_merge( [
			'success'   => $status_code < 400,
			'status'    => $status_code,
			'errorCode' => 0,
		], $result );

		if ( ! empty( $data ) ) {
			$result['data'] = $data;
		}

		$response = rest_ensure_response( $result );
		$response->set_status( $status_code );

		if ( ! headers_sent() ) {
			$response->header( 'Content-Type', 'application/json; charset=' . \HD_Helper::getOption( 'blog_charset' ) );
		}

		return $response;
	}

	/**
	 * @param string $key_prefix
	 * @param int $limit
	 * @param int $window
	 *
	 * @return bool
	 */
	protected function rateLimit( string $key_prefix, int $limit = 6, int $window = 60 ): bool {
		$ip  = \HD_Helper::ipAddress();
		$key = "hd_api_rate_{$key_prefix}_" . md5( $ip );

		$count = (int) get_transient( $key );
		if ( $count >= $limit ) {
			return false;
		}

		set_transient( $key, $count + 1, $window );

		return true;
	}
}
