<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait File {
    // --------------------------------------------------

    /**
     * @return \WP_Filesystem_Base|null
     */
    private static function wpFileSystem(): ?\WP_Filesystem_Base {
        global $wp_filesystem;

        if ( ! function_exists( 'WP_Filesystem' ) ) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        if ( empty( $wp_filesystem ) ) {
            WP_Filesystem();
        }

        return $wp_filesystem instanceof \WP_Filesystem_Base ? $wp_filesystem : null;
    }

    // --------------------------------------------------

    /**
     * @param string $path
     *
     * @return string|null
     */
    public static function fileRead( string $path ): ?string {
        $fs = self::wpFileSystem();
        if ( ! $fs ) {
            return is_file( $path ) ? file_get_contents( $path ) : null;
        }

        if ( ! $fs->is_file( $path ) ) {
            return null;
        }

        return $fs->get_contents( $path );
    }

    // --------------------------------------------------

    /**
     * @param string $path
     * @param string $content
     * @param bool $lock
     *
     * @return bool
     */
    public static function fileWrite( string $path, string $content, bool $lock = false ): bool {
        $fs = self::wpFileSystem();
        if ( $fs ) {
            return (bool) $fs->put_contents( $path, $content, FS_CHMOD_FILE );
        }

        if ( $lock ) {
            $fp = fopen( $path, 'cb' );
            if ( ! $fp ) {
                return false;
            }
            flock( $fp, LOCK_EX );
            fwrite( $fp, $content );
            fflush( $fp );
            flock( $fp, LOCK_UN );
            fclose( $fp );

            return true;
        }

        return (bool) file_put_contents( $path, $content );
    }

    // --------------------------------------------------

    /**
     * @param string $directory
     *
     * @return bool
     */
    public static function createDirectory( string $directory ): bool {
        return wp_mkdir_p( $directory );
    }

    // --------------------------------------------------

    /**
     * @param string $url
     * @param string $destination
     * @param array|null $allowed
     *
     * @return string|null
     */
    public static function uploadFileFromUrl( string $url, string $destination, array $allowed = null ): ?string {
        $extension = strtolower( pathinfo( parse_url( $url, PHP_URL_PATH ), PATHINFO_EXTENSION ) );

        if ( $allowed !== null && ! in_array( $extension, $allowed, true ) ) {
            return null;
        }

        $content = wp_remote_retrieve_body( wp_safe_remote_get( $url ) );

        if ( ! $content ) {
            return null;
        }

        $dir = dirname( $destination );
        self::createDirectory( $dir );

        if ( ! self::fileWrite( $destination, $content, true ) ) {
            return null;
        }

        return $destination;
    }

    // --------------------------------------------------

    /**
     * @param string $path
     *
     * @return bool
     */
    public static function deleteFile( string $path ): bool {
        $fs = self::wpFileSystem();
        if ( $fs ) {
            return $fs->exists( $path ) && $fs->delete( $path, false, 'f' );
        }

        return file_exists( $path ) && unlink( $path );
    }

    // --------------------------------------------------

    /**
     * @return bool
     */
    public static function htAccess(): bool {
        global $is_apache;

        if ( $is_apache ) {
            return true;
        }

        // Check if the custom HTACCESS environment variable is set
        if ( isset( $_SERVER['HTACCESS'] ) && $_SERVER['HTACCESS'] === 'on' ) {
            return true;
        }

        return false;
    }

    // --------------------------------------------------

    /**
     * @param string $filename
     * @param bool $include_dot
     *
     * @return string
     */
    public static function fileExtension( string $filename, bool $include_dot = false ): string {
        if ( empty( $filename ) ) {
            return '';
        }

        $dot = $include_dot ? '.' : '';

        return $dot . strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );
    }

    // --------------------------------------------------

    /**
     * @param string $filename
     * @param bool $include_ext
     *
     * @return string
     */
    public static function fileName( string $filename, bool $include_ext = false ): string {
        if ( empty( $filename ) ) {
            return '';
        }

        return $include_ext
            ? pathinfo( $filename, PATHINFO_FILENAME ) . self::fileExtension( $filename, true )
            : pathinfo( $filename, PATHINFO_FILENAME );
    }

    // --------------------------------------------------

    /**
     * @param string $dirname
     *
     * @return bool
     */
    public static function isEmptyDir( string $dirname ): bool {
        if ( ! is_dir( $dirname ) || ! is_readable( $dirname ) ) {
            return false;
        }

        $files = scandir( $dirname, SCANDIR_SORT_NONE );
        if ( $files === false ) {
            self::errorLog( 'Failed to scan directory: ' . $dirname );

            return false;
        }

        foreach ( $files as $file ) {
            if ( ! in_array( $file, [ '.', '..', '.svn', '.git' ], false ) ) {
                return false;
            }
        }

        return true;
    }
}
