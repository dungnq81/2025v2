<?php

namespace Addons\File;

use Addons\Helper;

\defined( 'ABSPATH' ) || exit;

final class File {

    // ------------------------------------------------------

    public function __construct() {
        add_action( 'init', [ $this, 'custom_init' ], 99 );

        ( new SVG() );
    }

    // ------------------------------------------------------

    public function custom_init(): void {
        add_filter( 'upload_size_limit', [ $this, 'custom_upload_size_limit' ] );
    }

    // ------------------------------------------------------

    /**
     * @param $size
     *
     * @return float|int
     */
    public function custom_upload_size_limit( $size ): float|int {
        $is_network        = Helper::checkNetworkActive( ADDONS_PLUGIN_BASENAME );
        $file_options      = Helper::getOption( 'file__options', [], $is_network );
        $upload_size_limit = $file_options['upload_size_limit'] ?? 0;

        if ( (int) $upload_size_limit > 0 ) {
            $upload_max_filesize = (int) filter_var( $upload_size_limit, FILTER_SANITIZE_NUMBER_INT );

            return $upload_max_filesize * 1024 * 1024;
        }

        return $size;
    }
}
