<?php
/**
 * Main API controller for the theme/plugin.
 *
 * Handles REST API access restrictions, endpoint registration, and default route sanitization.
 *
 * @author Gaudev
 */

namespace HD\API;

use HD\Utilities\Traits\Singleton;

final class API extends AbstractAPI {
	use Singleton;

	private array $endpointClasses = [];

	private array $blockedPostTypes = [
		'post',
		'page',
		'attachment'
	];

	/**
	 * Allowlisted REST API namespaces for unauthenticated access.
	 * (Plugins or custom endpoints that must work for guests)
	 *
	 * Example: contact-form-7/v1, hd/v1, etc.
	 */
	private array $allowedNamespaces = [
		self::REST_NAMESPACE,
		'contact-form-7/v1',  // Contact Form 7
	];

	/** ---------------------------------------- */

	/**
	 * @return void
	 */
	private function init(): void {
		add_action( 'init', [ $this, 'initRestClasses' ] );
		add_action( 'rest_api_init', [ $this, 'registerRestRoutes' ] );
		add_action( 'rest_api_init', [ $this, 'disableDefaultPostTypes' ], 20 );

		add_filter( 'rest_authentication_errors', [ $this, 'restrictRestApi' ], 99 );
		add_filter( 'rest_endpoints', [ $this, 'filterRestEndpoints' ] );
		add_filter( 'rest_index', [ $this, 'hideRestIndex' ] );
	}

	/** ---------------------------------------- */

	/**
	 * Automatically initialize classes in the API/Endpoints directory.
	 *
	 * @return void
	 */
	public function initRestClasses(): void {
		foreach ( glob( __DIR__ . '/Endpoints/*.php', GLOB_NOSORT ) as $file ) {
			$class_name = '\\HD\\API\\Endpoints\\' . basename( $file, '.php' );
			if ( class_exists( $class_name ) ) {
				$this->endpointClasses[] = new $class_name();
			}
		}
	}

	/**
	 * @return void
	 */
	public function registerRestRoutes(): void {
		foreach ( $this->endpointClasses as $api ) {
			if ( method_exists( $api, 'registerRestRoutes' ) ) {
				$api->registerRestRoutes();
			}
		}
	}

	/**
	 * Disable REST Access for Default Post Types
	 *
	 * @return void
	 */
	public function disableDefaultPostTypes(): void {
		foreach ( $this->blockedPostTypes as $type ) {
			if ( post_type_exists( $type ) ) {
				add_filter( "rest_{$type}_query", [ $this, 'forceEmptyRestQuery' ], 10, 2 );
				add_filter( "rest_prepare_{$type}", [ $this, 'blockRestDetail' ], 10, 3 );
			}
		}
	}

	/**
	 * @param $args
	 * @param $request
	 *
	 * @return mixed
	 */
	public function forceEmptyRestQuery( $args, $request ): mixed {
		$args['post__in'] = [ 0 ];

		return $args;
	}

	/**
	 * @param mixed $response
	 * @param $post
	 * @param $request
	 *
	 * @return mixed
	 */
	public function blockRestDetail( mixed $response, $post, $request ): mixed {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'REST access denied.', TEXT_DOMAIN ),
				[ 'status' => 403 ]
			);
		}

		return $response;
	}

	/**
	 * Restrict REST API access for guests
	 *
	 * @param mixed $result
	 *
	 * @return mixed
	 */
	public function restrictRestApi( mixed $result ): mixed {
		if ( ! empty( $result ) ) {
			return $result;
		}

		$request_uri = $_SERVER['REQUEST_URI'] ?? '';
		if ( empty( $request_uri ) ) {
			return $result;
		}

		foreach ( $this->allowedNamespaces as $namespace ) {
			if ( str_contains( $request_uri, "/wp-json/{$namespace}" ) ) {
				return $result;
			}
		}

		$user_logged = \is_user_logged_in();

		// Block wp-json root and default wp/v2 endpoints for unauthenticated users
		if ( ! $user_logged || ! current_user_can( 'edit_posts' ) ) {
			if ( preg_match( '#^/wp-json(/wp/v2)?/?#', $request_uri ) ) {
				if ( \HD_Helper::development() ) {
					\HD_Helper::errorLog( "[REST Blocked] $request_uri" );
				}

				return new \WP_Error(
					'rest_forbidden',
					__( 'REST API access denied for unauthenticated users.', TEXT_DOMAIN ),
					[ 'status' => 403 ]
				);
			}
		}

		return $result;
	}

	/**
	 * Hide unwanted routes
	 *
	 * @param array $endpoints
	 *
	 * @return array
	 */
	public function filterRestEndpoints( array $endpoints ): array {
		// Hide the discovery and default wp/v2 endpoints
		unset( $endpoints['/'], $endpoints['/wp/v2'] );

		// Remove post/page/attachment endpoints
		foreach ( $this->blockedPostTypes as $type ) {
			if ( $obj = get_post_type_object( $type ) ) {
				$base = $obj->rest_base ?: $obj->name;
				unset(
					$endpoints["/wp/v2/{$base}"],
					$endpoints["/wp/v2/{$base}/(?P<id>[\\d]+)"]
				);
			}
		}

		return $endpoints;
	}

	/**
	 * Hide REST index response entirely for guests.
	 *
	 * @param $response
	 *
	 * @return mixed
	 */
	public function hideRestIndex( $response ): mixed {
		if ( ! \is_user_logged_in() ) {
			$response->data = [
				'success' => false,
				'message' => __( 'REST API is disabled for unauthenticated users.', TEXT_DOMAIN ),
			];
		}

		return $response;
	}
}
