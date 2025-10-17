<?php
/**
 * Class PostEndpoints
 *
 * Registers and handles all REST API endpoints for posts, pages, and attachments resources in WordPress
 * (e.g., post list, page list, attachments).
 *
 * @author Gaudev
 */

namespace HD\API\Endpoints;

use HD\API\AbstractAPI;

\defined( 'ABSPATH' ) || die;

class PostEndpoints extends AbstractAPI {
	/** ---------------------------------------- */

	public function registerRestRoutes(): void {
		// TODO: Implement registerRestRoutes() method.
	}
}
