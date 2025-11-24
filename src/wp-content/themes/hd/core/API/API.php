<?php
/**
 * Main API controller for the theme/plugin.
 *
 * Handles REST API access restrictions, endpoint registration, and default route sanitization.
 *
 * @author Gaudev
 */

namespace HD\API;

use HD\Utilities\Helper;
use HD\Utilities\Traits\Singleton;

final class API extends AbstractAPI {
    use Singleton;

    /* ---------- PRIVATE ------------------------------------------ */

    private array $endpointClasses = [];
    private readonly array $blockedPostTypes;
    private readonly array $allowedNamespaces;

    private function init(): void {
        /**
         * Define RESTAPI_URL constant for easy access to the base REST API URL.
         */
        define( 'RESTAPI_URL', untrailingslashit( $this->restApiUrl() ) . '/' );

        /**
         * Blocked post types for REST API access.
         */
        $this->blockedPostTypes = [
            'post',
            'page',
            'attachment',
        ];

        /**
         * Allowlisted REST API namespaces for unauthenticated
         */
        $this->allowedNamespaces = [
            self::REST_NAMESPACE,
            'contact-form-7/v1',  // Contact Form 7
        ];

        /**
         * Register hooks.
         */
        add_action( 'init', [ $this, 'initRestClasses' ] );
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
        add_action( 'rest_api_init', [ $this, 'disableDefaultPostTypes' ], 20 );
        add_filter( 'rest_authentication_errors', [ $this, 'restrictRestApi' ], 99 );
        add_filter( 'rest_endpoints', [ $this, 'filterRestEndpoints' ] );
        add_filter( 'rest_index', [ $this, 'hideRestIndex' ] );
    }

    /** ---------------------------------------- */

    protected function registerRoutes(): void {
        foreach ( $this->endpointClasses as $api ) {
            if ( method_exists( $api, 'register_routes' ) ) {
                $api->register_routes();
            }
        }
    }

    /* ---------- PUBLIC ------------------------------------- */

    /**
     * Automatically initialize classes in the API/Endpoints directory.
     *
     * @return void
     */
    public function initRestClasses(): void {
        $dir = __DIR__ . DIRECTORY_SEPARATOR . 'Endpoints';
        if ( ! is_dir( $dir ) ) {
            return;
        }

        foreach ( glob( $dir . DIRECTORY_SEPARATOR . '*.php', GLOB_NOSORT ) as $file ) {
            $class_name = '\\HD\\API\\Endpoints\\' . basename( $file, '.php' );
            if ( class_exists( $class_name ) && is_subclass_of( $class_name, \WP_REST_Controller::class ) ) {
                $this->endpointClasses[] = new $class_name();
            }
        }
    }

    /** ---------------------------------------- */

    /**
     * Disable REST access for default post types (post/page/media).
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

    /** ---------------------------------------- */

    /**
     * @param array $args
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function forceEmptyRestQuery( array $args, \WP_REST_Request $request ): array {
        $args['post__in'] = [ 0 ];

        return $args;
    }

    /** ---------------------------------------- */

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

    /** ---------------------------------------- */

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

        foreach ( $this->allowedNamespaces as $ns ) {
            if ( str_contains( $request_uri, "/wp-json/{$ns}" ) ) {
                return $result;
            }
        }

        // Block wp-json root and default wp/v2 endpoints for unauthenticated users
        if ( ! is_user_logged_in() || ! current_user_can( 'edit_posts' ) ) {
            if ( preg_match( '#^/wp-json(/wp/v2)?/?#', $request_uri ) ) {
                Helper::errorLog( "[REST Blocked] $request_uri" );

                return new \WP_Error(
                    'rest_forbidden',
                    __( 'REST API access denied for unauthenticated users.', TEXT_DOMAIN ),
                    [ 'status' => 403 ]
                );
            }
        }

        return $result;
    }

    /** ---------------------------------------- */

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

    /** ---------------------------------------- */

    /**
     * Hide REST index response entirely for guests.
     *
     * @param \WP_REST_Response $response
     *
     * @return \WP_REST_Response
     */
    public function hideRestIndex( \WP_REST_Response $response ): \WP_REST_Response {
        if ( ! is_user_logged_in() || ! current_user_can( 'edit_posts' ) ) {
            $response->set_data( [
                'success' => false,
                'message' => __( 'REST API is disabled for unauthenticated users.', TEXT_DOMAIN ),
            ] );
        }

        return $response;
    }

    /** ---------------------------------------- */
}
