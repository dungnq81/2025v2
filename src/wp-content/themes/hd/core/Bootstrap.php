<?php
/**
 * Acts as the main bootloader for the theme.
 * Initializes services and manages dependencies.
 *
 * @author Gaudev
 */

namespace HD;

use HD\Utilities\Helper;
use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || exit;

final class Bootstrap {
    use Singleton;

    /* ---------- CONSTRUCT ---------------------------------------- */

    private function init(): void {
        // Load procedural includes
        $includes = [
            'helpers.php',
            'hooks.php',
            'setup.php',
            'template-tags.php',
        ];
        foreach ( $includes as $file ) {
            if ( ! \file_exists( THEME_PATH . 'inc' . DIRECTORY_SEPARATOR . $file ) ) {
                continue;
            }

            require_once THEME_PATH . 'inc' . DIRECTORY_SEPARATOR . $file;
        }

        // Initialize theme.
        ( Theme::get_instance() );

        // Clear cache
        add_action( 'init', [ $this, 'clearCache' ] );
    }

    /* ---------- PUBLIC ------------------------------------------- */

    /**
     * Clear Cache
     *
     * @return void
     */
    public function clearCache(): void {
        if ( isset( $_GET['clear_cache'] ) ) {
            Helper::clearAllCache();
            set_transient( '_clear_cache_message', __( 'Cache has been successfully cleared.', TEXT_DOMAIN ), 30 );

            echo <<<'HTML'
                <script>
                    const currentUrl = window.location.href;
                    if (currentUrl.includes('clear_cache=1')) {
                        let newUrl = currentUrl.replace(/([?&])clear_cache=1/, '$1').replace(/&$/, '').replace(/\?$/, '');
                        currentUrl.includes('wp-admin')
                            ? window.location.replace(newUrl)
                            : window.history.replaceState({}, document.title, newUrl);
                    }
                </script>
            HTML;
        }
    }
}
