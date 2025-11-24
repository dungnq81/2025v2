<?php
/**
 * Theme Helper Utilities
 *
 * This file defines the Helper class, a static utility class that provides
 * commonly used helper methods for various theme functionalities.
 * It centralizes reusable logic such as data formatting, template helpers,
 * and other generic utility operations.
 *
 * @author Gaudev
 */

namespace HD\Utilities;

use HD\Utilities\Traits\Wp;
use MatthiasMullie\Minify;
use Random\RandomException;

\defined( 'ABSPATH' ) || die;

final class Helper {
    use Wp;

    // -------------------------------------------------------------

    /**
     * @param string $table
     * @param int $post_id
     *
     * @return int
     */
    public static function totalPostViews( string $table, int $post_id ): int {
        $table_name = DB::backticked_table( $table );

        return (int) DB::db()->get_var(
            DB::db()->prepare( "SELECT SUM(view_count) FROM {$table_name} WHERE `post_id` = %d", $post_id )
        );
    }

    // -------------------------------------------------------------

    /**
     * @param string $version
     * @param string $recaptcha_response
     *
     * @return false|mixed
     */
    public static function reCaptchaVerify( string $version, string $recaptcha_response ): mixed {
        $recaptcha_options = self::getOption( 'recaptcha__options' );
        if ( ! $recaptcha_options ) {
            return false;
        }

        // reCaptcha v2
        if ( 'v2' === $version ) {
            $secretKey = $recaptcha_options['recaptcha_v2_secret_key'] ?? '';
            $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

            // Prepare the data for verification
            $response = wp_remote_post( $verifyUrl, [
                'body' => [
                    'secret'   => $secretKey,
                    'response' => $recaptcha_response,
                ],
            ] );

            if ( is_wp_error( $response ) ) {
                self::errorLog( '[recaptcha] HTTP error: ' . $response->get_error_message() );

                return false;
            }

            $body = wp_remote_retrieve_body( $response );
            if ( empty( $body ) ) {
                return false;
            }

            try {
                return json_decode( $body, false, 512, JSON_THROW_ON_ERROR );
            } catch ( \JsonException $e ) {
                self::errorLog( '[recaptcha] JSON decode error: ' . $e->getMessage() );

                return false;
            }
        }

        // reCaptcha v3
        if ( 'v3' === $version ) {
            $secretKey = $recaptcha_options['recaptcha_v3_secret_key'] ?? '';
            $score     = $recaptcha_options['recaptcha_v3_score'] ?? 0.5;

            // ?

            return false;
        }

        return false;
    }

    // -------------------------------------------------------------

    /**
     * @param $file
     *
     * @return mixed
     */
    public static function sanitizeImage( $file ): mixed {
        $mimes = [
            'jpg|jpeg|jpe' => 'image/jpeg',
            'gif'          => 'image/gif',
            'png'          => 'image/png',
            'bmp'          => 'image/bmp',
            'webp'         => 'image/webp',
            'avif'         => 'image/avif',
            'tif|tiff'     => 'image/tiff',
            'ico'          => 'image/x-icon',
            'svg'          => 'image/svg+xml',
        ];

        // check a file type from the file name
        $file_ext = wp_check_filetype( $file, $mimes );

        // if a file has a valid mime type, return it, otherwise return default
        return $file_ext['ext'] ? $file : '';
    }

    // -------------------------------------------------------------

    /**
     * @param $phone
     *
     * @return bool
     */
    public static function isValidPhone( $phone ): bool {
        if ( ! is_string( $phone ) || trim( $phone ) === '' ) {
            return false;
        }

        $pattern = '/^\(?\+?(0|84)\)?[\s.\-]?(3[2-9]|5[689]|7[06-9]|(?:8[0-689]|87)|9[0-4|6-9])(\d{7}|\d[\s.\-]?\d{3}[\s.\-]?\d{3})$/';

        return preg_match( $pattern, $phone ) === 1;
    }

    // -------------------------------------------------------------

    /**
     * @return array
     */
    public static function ksesSVG(): array {
        return [
            'svg'            => [
                'xmlns'               => true,
                'viewbox'             => true,
                'width'               => true,
                'height'              => true,
                'fill'                => true,
                'stroke'              => true,
                'stroke-width'        => true,
                'stroke-linecap'      => true,
                'stroke-linejoin'     => true,
                'stroke-miterlimit'   => true,
                'stroke-dasharray'    => true,
                'stroke-dashoffset'   => true,
                'fill-rule'           => true,
                'clip-rule'           => true,
                'preserveaspectratio' => true,
                'aria-hidden'         => true,
                'role'                => true,
                'focusable'           => true,
                'id'                  => true,
                'class'               => true,
                'style'               => true,
            ],
            'g'              => [
                'fill'         => true,
                'stroke'       => true,
                'stroke-width' => true,
                'clip-path'    => true,
                'transform'    => true,
                'id'           => true,
                'class'        => true,
                'style'        => true,
            ],
            'path'           => [
                'd'               => true,
                'fill'            => true,
                'stroke'          => true,
                'stroke-width'    => true,
                'stroke-linecap'  => true,
                'stroke-linejoin' => true,
                'fill-rule'       => true,
                'clip-rule'       => true,
                'vector-effect'   => true,
                'transform'       => true,
                'opacity'         => true,
                'id'              => true,
                'class'           => true,
                'style'           => true,
            ],
            'circle'         => [
                'cx'           => true,
                'cy'           => true,
                'r'            => true,
                'fill'         => true,
                'stroke'       => true,
                'stroke-width' => true,
                'opacity'      => true,
                'id'           => true,
                'class'        => true,
            ],
            'ellipse'        => [
                'cx'           => true,
                'cy'           => true,
                'rx'           => true,
                'ry'           => true,
                'fill'         => true,
                'stroke'       => true,
                'stroke-width' => true,
                'opacity'      => true,
                'id'           => true,
                'class'        => true,
            ],
            'rect'           => [
                'x'            => true,
                'y'            => true,
                'width'        => true,
                'height'       => true,
                'rx'           => true,
                'ry'           => true,
                'fill'         => true,
                'stroke'       => true,
                'stroke-width' => true,
                'opacity'      => true,
                'id'           => true,
                'class'        => true,
            ],
            'line'           => [
                'x1'           => true,
                'y1'           => true,
                'x2'           => true,
                'y2'           => true,
                'stroke'       => true,
                'stroke-width' => true,
                'opacity'      => true,
                'id'           => true,
                'class'        => true,
            ],
            'polyline'       => [
                'points'       => true,
                'fill'         => true,
                'stroke'       => true,
                'stroke-width' => true,
                'opacity'      => true,
                'id'           => true,
                'class'        => true,
            ],
            'polygon'        => [
                'points'       => true,
                'fill'         => true,
                'stroke'       => true,
                'stroke-width' => true,
                'opacity'      => true,
                'id'           => true,
                'class'        => true,
            ],
            'defs'           => [],
            'symbol'         => [
                'id'                  => true,
                'viewbox'             => true,
                'preserveaspectratio' => true,
            ],
            'use'            => [
                'href'       => true,
                'xlink:href' => true,
                'x'          => true,
                'y'          => true,
                'width'      => true,
                'height'     => true,
                'id'         => true,
                'class'      => true,
            ],
            'clippath'       => [ 'id' => true ],
            'mask'           => [
                'id'               => true,
                'x'                => true,
                'y'                => true,
                'width'            => true,
                'height'           => true,
                'maskunits'        => true,
                'maskcontentunits' => true,
            ],
            'lineargradient' => [
                'id'                => true,
                'x1'                => true,
                'y1'                => true,
                'x2'                => true,
                'y2'                => true,
                'gradientunits'     => true,
                'gradienttransform' => true,
            ],
            'radialgradient' => [
                'id'                => true,
                'cx'                => true,
                'cy'                => true,
                'r'                 => true,
                'fx'                => true,
                'fy'                => true,
                'gradientunits'     => true,
                'gradienttransform' => true,
            ],
            'stop'           => [ 'offset' => true, 'stop-color' => true, 'stop-opacity' => true ],
            'title'          => [],
            'desc'           => [],
        ];
    }

    // -------------------------------------------------------------

    /**
     * @param int $length
     *
     * @return string
     * @throws RandomException
     */
    public static function makeUsername( int $length = 8 ): string {
        if ( $length < 1 ) {
            return '';
        }

        $letters            = 'abcdefghijklmnopqrstuvwxyz';
        $letters_and_digits = 'abcdefghijklmnopqrstuvwxyz0123456789';

        $username = $letters[ random_int( 0, strlen( $letters ) - 1 ) ];

        for ( $i = 1; $i < $length; $i ++ ) {
            $username .= $letters_and_digits[ random_int( 0, strlen( $letters_and_digits ) - 1 ) ];
        }

        return $username;
    }


    // -------------------------------------------------------------

    /**
     * Generate a unique slug with desired length.
     *
     * @param int $length Total desired slug length
     * @param string $prefix
     *
     * @return string
     * @throws RandomException
     */
    public static function makeUnique( int $length = 32, string $prefix = '' ): string {
        $time        = microtime( true );
        $timeEncoded = base_convert( (string) floor( $time * 1e6 ), 10, 36 );

        $pidEncoded  = base_convert( (string) getmypid(), 10, 36 );
        $uniqEncoded = base_convert( str_replace( '.', '', uniqid( '', true ) ), 10, 36 );

        $base = $timeEncoded . $pidEncoded . $uniqEncoded;

        $bytes  = random_bytes( (int) ceil( $length * 0.75 ) );
        $random = substr( base_convert( bin2hex( $bytes ), 16, 36 ), 0, $length );

        return $prefix . substr( $base . $random, 0, $length );
    }

    // -------------------------------------------------------------

    /**
     * @param string $content
     *
     * @return string
     */
    public static function extractJS( string $content ): string {
        $script_pattern = '/<script\b[^>]*>(.*?)<\/script>/is';
        preg_match_all( $script_pattern, $content, $matches, PREG_SET_ORDER );

        $valid_scripts = [];

        // Patterns for detecting potentially malicious code
        $malicious_patterns = [
            '/eval\(/i',
            '/document\.write\(/i',
            //'/<script.*?src=[\'"]?data:/i',
            '/base64,/i',
        ];

        foreach ( $matches as $match ) {
            $scriptTag     = $match[0]; // Full <script> tag
            $scriptContent = trim( $match[1] ?? '' ); // Script content inside <script>...</script>
            $hasSrc        = preg_match( '/\bsrc=["\'][^"\']+["\']/i', $scriptTag );

            $isMalicious = false;
            if ( ! $hasSrc && $scriptContent !== '' ) {
                foreach ( $malicious_patterns as $pattern ) {
                    if ( preg_match( $pattern, $scriptContent ) ) {
                        $isMalicious = true;
                        break;
                    }
                }
            }

            // Retain scripts that have valid src or are clean inline scripts
            if ( ! $isMalicious || $hasSrc ) {
                $valid_scripts[] = $scriptTag;
            }
        }

        // Re-construct content with valid <script> tags
        return preg_replace_callback( $script_pattern, static function () use ( &$valid_scripts ) {
            return array_shift( $valid_scripts ) ?? '';
        }, $content );
    }

    // -------------------------------------------------------------

    /**
     * @param string $css
     *
     * @return string
     */
    public static function extractCss( string $css ): string {
        if ( empty( $css ) ) {
            return '';
        }

        // Convert encoding to UTF-8 if needed
        if ( mb_detect_encoding( $css, 'UTF-8', true ) !== 'UTF-8' ) {
            $css = mb_convert_encoding( $css, 'UTF-8', 'auto' );
        }

        // Log if dangerous content is detected
        if ( preg_match( '/<script\b[^>]*>/i', $css ) ) {
            self::errorLog( 'Warning: `<script>` inside CSS' );
        }

        //$css = (string) $css;
        $css = preg_replace( [
            '/<script\b[^>]*>.*?(?:<\/script>|$)/is',
            '/<style\b[^>]*>(.*?)<\/style>/is',
            '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u',
            '/\bexpression\s*\([^)]*\)/i',
            '/url\s*\(\s*[\'"]?\s*javascript:[^)]*\)/i',
            '/[^\S\r\n\t]+/',
        ], [ '', '$1', '', '', '', ' ' ], $css );

        return trim( $css );
    }

    // -------------------------------------------------------------

    /**
     * @param string|null $js
     * @param bool $respectDebug
     *
     * @return string|null
     */
    public static function JSMinify( ?string $js, bool $respectDebug = true ): ?string {
        if ( $js === null || $js === '' ) {
            return null;
        }
        if ( $respectDebug && self::development() ) {
            return $js;
        }

        return class_exists( Minify\JS::class ) ? ( new Minify\JS() )->add( $js )->minify() : $js;
    }

    // -------------------------------------------------------------

    /**
     * @param string|null $css
     * @param bool $respectDebug
     *
     * @return string|null
     */
    public static function CSSMinify( ?string $css, bool $respectDebug = true ): ?string {
        if ( $css === null || $css === '' ) {
            return null;
        }
        if ( $respectDebug && self::development() ) {
            return $css;
        }

        return class_exists( Minify\CSS::class ) ? ( new Minify\CSS() )->add( $css )->minify() : $css;
    }

    // -------------------------------------------------------------

    /**
     * @param $name
     * @param mixed $default
     *
     * @return array|mixed
     */
    public static function filterSettingOptions( $name, mixed $default = [] ): mixed {
        $filters = apply_filters( 'hd_settings_filter', [] );

        if ( isset( $filters[ $name ] ) ) {
            return $filters[ $name ] ?: $default;
        }

        return [];
    }

    // -------------------------------------------------------------

    /**
     * @return mixed|string
     */
    public static function currentLanguage(): mixed {
        // Polylang
        if ( function_exists( "pll_current_language" ) ) {
            return \pll_current_language( "slug" );
        }

        // Weglot
        if ( function_exists( "weglot_get_current_language" ) ) {
            return \weglot_get_current_language();
        }

        // WMPL
        $currentLanguage = apply_filters( 'wpml_current_language', null );

        // Try to fall back on the current language
        if ( ! $currentLanguage ) {
            return strtolower( substr( get_bloginfo( 'language' ), 0, 2 ) );
        }

        return $currentLanguage;
    }

    // --------------------------------------------------

    /**
     * @return bool
     */
    public static function lightHouse(): bool {
        $ua       = strtolower( $_SERVER['HTTP_USER_AGENT'] ?? '' );
        $patterns = [
            'lighthouse',
            'headlesschrome',
            'chrome-lighthouse',
            'pagespeed',
        ];

        foreach ( $patterns as $pattern ) {
            if ( stripos( $ua, $pattern ) !== false ) {
                return true;
            }
        }

        return false;
    }

    // --------------------------------------------------

    /**
     * @return void
     */
    public static function clearAllCache(): void {
        $options_table = DB::db()->options;

        // Transients
        DB::db()->query( DB::db()->prepare( "DELETE FROM {$options_table} WHERE option_name LIKE %s", '_transient_%' ) );
        DB::db()->query( DB::db()->prepare( "DELETE FROM {$options_table} WHERE option_name LIKE %s", '_transient_timeout_%' ) );

        // Object cache (e.g., Redis or Memcached)
        if ( function_exists( 'wp_cache_flush' ) ) {
            wp_cache_flush();
        }

        // WP-Rocket cache
        if ( self::checkPluginActive( 'wp-rocket/wp-rocket.php' ) ) {
            $actions = [
                'save_post',            // Save a post
                'deleted_post',         // Delete a post
                'trashed_post',         // Empty Trashed post
                'edit_post',            // Edit a post - includes leaving comments
                'delete_attachment',    // Delete an attachment - includes re-uploading
                'switch_theme',         // Change theme
            ];

            // Add the action for each event
            foreach ( $actions as $event ) {
                add_action( $event, static function () {
                    \function_exists( 'rocket_clean_domain' ) && \rocket_clean_domain();
                } );
            }
        }

        // FlyingPress cache
        if ( self::checkPluginActive( 'flying-press/flying-press.php' ) ) {
            class_exists( \FlyingPress\Purge::class ) && \FlyingPress\Purge::purge_everything();
        }

        // LiteSpeed cache
        if ( self::checkPluginActive( 'litespeed-cache/litespeed-cache.php' ) ) {
            class_exists( \LiteSpeed\Purge::class ) && \LiteSpeed\Purge::purge_all();
        }
    }

    // --------------------------------------------------

    /**
     * @param $value
     * @param $min
     * @param $max
     *
     * @return bool
     */
    public static function inRange( $value, $min, $max ): bool {
        $inRange = filter_var( $value, FILTER_VALIDATE_INT, [
            'options' => [
                'min_range' => (int) $min,
                'max_range' => (int) $max,
            ],
        ] );

        return false !== $inRange;
    }

    // -------------------------------------------------------------

    /**
     * @param array $array_a
     * @param array $array_b
     *
     * @return bool
     */
    public static function checkValuesNotInRanges( array $array_a, array $array_b ): bool {
        foreach ( $array_a as $range ) {

            // Ensure range is valid
            if ( count( $range ) !== 2 || ! is_numeric( $range[0] ) || ! is_numeric( $range[1] ) ) {
                continue;
            }

            $start = min( $range );
            $end   = max( $range );

            foreach ( $array_b as $value ) {
                if ( $value >= $start && $value < $end ) {
                    return false;
                }
            }

            // Additional check for whether array_b contains the entire range of array_a
            if ( min( $array_b ) <= $start && max( $array_b ) >= $end ) {
                return false;
            }
        }

        return true;
    }

    // --------------------------------------------------

    /**
     * @param string $img
     *
     * @return string
     */
    public static function pixelImg( string $img = '' ): string {
        if ( file_exists( $img ) ) {
            return $img;
        }

        return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }

    // --------------------------------------------------

    /**
     * @param string $class
     * @param bool $img_wrap
     * @param bool $thumb
     *
     * @return string
     */
    public static function placeholderSrc( string $class = '', bool $img_wrap = true, bool $thumb = true ): string {
        $src = THEME_URL . 'assets/img/placeholder.png';
        if ( $thumb ) {
            $src = THEME_URL . 'assets/img/placeholder-320x320.png';
        }

        if ( $img_wrap ) {
            $class = ! empty( $class ) ? ' ' . $class : '';
            $src   = '<img loading="lazy" src="' . $src . '" alt="place-holder" class="wp-placeholder' . $class . '">';
        }

        return $src;
    }

    // --------------------------------------------------

    /**
     * @param $url
     * @param int $resolution_key
     *
     * @return string
     */
    public static function youtubeImage( $url, int $resolution_key = 0 ): string {
        if ( ! $url ) {
            return '';
        }

        $resolution = [
            'sddefault',
            'hqdefault',
            'mqdefault',
            'default',
            'maxresdefault',
        ];

        $url_img      = self::pixelImg();
        $query_string = wp_parse_url( $url, PHP_URL_QUERY );

        if ( $query_string ) {
            parse_str( $query_string, $vars );
            if ( isset( $vars['v'] ) ) {
                $id      = $vars['v'];
                $res_key = $resolution[ $resolution_key ] ?? $resolution[0];
                $url_img = 'https://img.youtube.com/vi/' . $id . '/' . $res_key . '.jpg';
            }
        }

        return $url_img;
    }

    // --------------------------------------------------

    /**
     * @param $url
     * @param int $autoplay
     * @param bool $lazyload
     * @param bool $control
     *
     * @return string|null
     */
    public static function youtubeIframe( $url, int $autoplay = 0, bool $lazyload = true, bool $control = true ): ?string {
        if ( ! $url ) {
            return null;
        }

        $videoId = null;

        // Parse URL and extract query string
        $query_string = wp_parse_url( $url, PHP_URL_QUERY );
        if ( $query_string ) {
            parse_str( $query_string, $vars );
            if ( isset( $vars['v'] ) ) {
                $videoId = esc_attr( $vars['v'] );
            }
        }

        // Fallback: extract from youtu.be/VIDEO_ID or embed/VIDEO_ID
        if ( ! $videoId ) {
            $path = wp_parse_url( $url, PHP_URL_PATH );
            if ( $path ) {
                $segments = explode( '/', trim( $path, '/' ) );
                if ( isset( $segments[0] ) ) {
                    $videoId = esc_attr( end( $segments ) );
                }
            }
        }

        if ( ! $videoId ) {
            return null;
        }

        $home            = esc_url( trailingslashit( network_home_url() ) );
        $iframeSize      = ' width="800" height="450"';
        $allowAttributes = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
        $src             = "https://www.youtube.com/embed/{$videoId}?wmode=transparent&origin={$home}";

        if ( $autoplay ) {
            $allowAttributes .= '; autoplay';
            $src             .= '&autoplay=1';
        }

        if ( ! $control ) {
            $src .= '&modestbranding=1&controls=0&rel=0&version=3&loop=1&enablejsapi=1&iv_load_policy=3&playlist=' . $videoId;
        }

        $src               .= '&html5=1';
        $lazyLoadAttribute = $lazyload ? ' loading="lazy"' : '';

        return sprintf(
            '<iframe id="ytb_iframe_%1$s" title="YouTube Video Player"%2$s allow="%3$s"%4$s src="%5$s" style="border:0"></iframe>',
            $videoId,
            $iframeSize,
            $allowAttributes,
            $lazyLoadAttribute,
            esc_url( $src )
        );
    }

    // --------------------------------------------------

    /**
     * @param string $email
     * @param string $title
     * @param array|string $attributes
     *
     * @return string|null
     */
    public static function safeMailTo( string $email, string $title = '', array|string $attributes = '' ): ?string {
        if ( ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
            return null;
        }

        $title        = $title ?: $email;
        $encodedEmail = '';

        // Convert email characters to HTML entities to obfuscate
        for ( $i = 0, $len = strlen( $email ); $i < $len; $i ++ ) {
            $encodedEmail .= '&#' . ord( $email[ $i ] ) . ';';
        }

        $encodedTitle = '';
        for ( $i = 0, $len = strlen( $title ); $i < $len; $i ++ ) {
            $encodedTitle .= '&#' . ord( $title[ $i ] ) . ';';
        }

        // Handle attributes
        $attrString = '';
        if ( is_array( $attributes ) ) {
            foreach ( $attributes as $key => $val ) {
                $attrString .= ' ' . htmlspecialchars( $key, ENT_QUOTES | ENT_HTML5 ) . '="' . htmlspecialchars( $val, ENT_QUOTES | ENT_HTML5 ) . '"';
            }
        } elseif ( is_string( $attributes ) ) {
            $attrString = ' ' . $attributes;
        }

        // Return obfuscated email using HTML entities only
        return '<a href="mailto:' . $encodedEmail . '"' . $attrString . '>' . $encodedTitle . '</a>';
    }

    // --------------------------------------------------

    /**
     * @param array|null $faqs
     * @param string|null $q
     * @param string|null $a
     *
     * @return string|null
     */
    public static function faqSchema( ?array $faqs = [], ?string $q = 'question', ?string $a = 'answer' ): ?string {
        if ( empty( $faqs ) ) {
            return null;
        }

        $q = $q ?: 'question';
        $a = $a ?: 'answer';

        $schema_faq = [
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array_map( static function ( $faq ) use ( $q, $a ) {
                return [
                    '@type'          => 'Question',
                    'name'           => wp_strip_all_tags( $faq[ $q ] ),
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text'  => wp_strip_all_tags( $faq[ $a ] ),
                    ],
                ];
            }, $faqs ),
        ];

        return '<script type="application/ld+json">' . wp_json_encode( $schema_faq, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>';
    }

    // --------------------------------------------------
}
