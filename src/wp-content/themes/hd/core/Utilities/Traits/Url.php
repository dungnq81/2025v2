<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Url {
	// --------------------------------------------------

	/**
	 * @param string $uri
	 * @param bool $permanent
	 *
	 * @return void
	 */
	public static function redirect( string $uri = '', bool $permanent = true ): void {
		$uri = esc_url_raw( $uri );
		if ( ! $uri ) {
			return;
		}

		$status = $permanent ? 301 : 302;

		if ( ! headers_sent() && ! wp_doing_ajax() && ! wp_is_json_request() ) {
			wp_safe_redirect( $uri, $status );
			exit;
		}

		// Fallback for already sent headers
		if ( ! wp_doing_ajax() && ! wp_is_json_request() ) {
			echo '<script>window.location.href="' . esc_js( $uri ) . '";</script>';
			echo '<noscript><meta http-equiv="refresh" content="0;url=' . esc_attr( $uri ) . '" /></noscript>';
		}
	}

	// --------------------------------------------------

	/**
	 * @param string $ip
	 * @param string $subnet
	 * @param int $maskLength
	 *
	 * @return bool
	 */
	private static function ipCIDRCheck( string $ip, string $subnet, int $maskLength ): bool {
		if ( $maskLength < 0 || $maskLength > 32 ) {
			return false;
		}

		$ipLong     = ip2long( $ip );
		$subnetLong = ip2long( $subnet );

		if ( $ipLong === false || $subnetLong === false ) {
			return false;
		}

		$mask = - 1 << ( 32 - $maskLength );

		return ( $ipLong & $mask ) === ( $subnetLong & $mask );
	}

	// --------------------------------------------------

	/**
	 * @param string $ip1
	 * @param string $ip2
	 *
	 * @return int
	 */
	private static function compareIPs( string $ip1, string $ip2 ): int {
		$ip1Long = ip2long( $ip1 );
		$ip2Long = ip2long( $ip2 );

		if ( $ip1Long === false || $ip2Long === false ) {
			return 0;
		}

		return $ip1Long <=> $ip2Long;
	}

	// --------------------------------------------------

	/**
	 * @param string $range
	 *
	 * @return bool
	 */
	public static function isValidIPRange( string $range ): bool {
		$range = trim( $range );

		// Single IP
		if ( filter_var( $range, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
			return true;
		}

		// CIDR (Ex 192.168.1.0/24)
		if ( str_contains( $range, '/' ) ) {
			[ $subnet, $mask ] = explode( '/', $range, 2 );
			if ( filter_var( $subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
				$mask = (int) $mask;

				return $mask >= 0 && $mask <= 32;
			}

			return false;
		}

		// Range: 192.168.1.1-192.168.1.100 or 192.168.1.1-100
		if ( str_contains( $range, '-' ) ) {
			[ $start, $end ] = explode( '-', $range, 2 );
			$start = trim( $start );
			$end   = trim( $end );

			// Ex: 192.168.1.1-100
			if ( is_numeric( $end ) ) {
				$parts = explode( '.', $start );
				if ( count( $parts ) === 4 ) {
					$end = "{$parts[0]}.{$parts[1]}.{$parts[2]}.$end";
				}
			}

			if ( filter_var( $start, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) && filter_var( $end, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
				return self::compareIPs( $start, $end ) < 0;
			}

			return false;
		}

		return false;
	}

	// --------------------------------------------------

	/**
	 * @param $ip
	 * @param $range
	 *
	 * @return bool
	 */
	public static function ipInRange( $ip, $range ): bool {
		if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
			return false;
		}

		$ipPattern    = '/^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/';
		$rangePattern = '/^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})-(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/';
		$cidrPattern  = '/^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\/(\d|[1-2]\d|3[0-2])$/';

		// Single IP
		if ( preg_match( $ipPattern, $range ) ) {
			return (string) $ip === (string) $range;
		}

		// IP Range
		if ( preg_match( $rangePattern, $range, $matches ) ) {
			$startIP = "{$matches[1]}.{$matches[2]}.{$matches[3]}.{$matches[4]}";
			$endIP   = "{$matches[1]}.{$matches[2]}.{$matches[3]}.{$matches[5]}";

			return self::compareIPs( $startIP, $endIP ) <= 0 &&
			       self::compareIPs( $startIP, $ip ) <= 0 &&
			       self::compareIPs( $ip, $endIP ) <= 0;
		}

		// CIDR
		if ( preg_match( $cidrPattern, $range ) ) {
			[ $subnet, $maskLength ] = explode( '/', $range );
			$maskLength = (int) $maskLength;

			if ( $maskLength < 0 || $maskLength > 32 ) {
				return false;
			}

			return self::ipCIDRCheck( $ip, $subnet, $maskLength );
		}

		return false;
	}

	// --------------------------------------------------

	/**
	 * @return string
	 */
	public static function ipAddress(): string {
		// Check for CloudFlare's connecting IP
		if ( isset( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
			return $_SERVER['HTTP_CF_CONNECTING_IP'];
		}

		// Check for forwarded IP (proxy) and get the first valid IP
		if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			foreach ( explode( ',', $_SERVER['HTTP_X_FORWARDED_FOR'] ) as $ip ) {
				$ip = trim( $ip );
				if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
					return $ip;
				}
			}
		}

		// Check for client IP
		if ( isset( $_SERVER['HTTP_CLIENT_IP'] ) && filter_var( $_SERVER['HTTP_CLIENT_IP'], FILTER_VALIDATE_IP ) ) {
			return $_SERVER['HTTP_CLIENT_IP'];
		}

		// Fallback to a remote address
		if ( isset( $_SERVER['REMOTE_ADDR'] ) && filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP ) ) {
			return $_SERVER['REMOTE_ADDR'];
		}

		// Fallback to 0.0.0.0 IP
		return '0.0.0.0';
	}

	// --------------------------------------------------

	/**
	 * @param string $path
	 * @param $scheme
	 *
	 * @return string
	 */
	public static function home( string $path = '', $scheme = null ): string {
		return apply_filters( 'hd_home_url_filter', esc_url( home_url( $path, $scheme ) ), $path );
	}

	// --------------------------------------------------

	/**
	 * @param string $path
	 * @param $scheme
	 *
	 * @return string
	 */
	public static function siteURL( string $path = '', $scheme = null ): string {
		return apply_filters( 'hd_site_url_filter', esc_url( site_url( $path, $scheme ) ), $path );
	}

	// --------------------------------------------------

	/**
	 * @param bool $nopaging
	 * @param bool $get_vars
	 *
	 * @return string
	 */
	public static function current( bool $nopaging = true, bool $get_vars = true ): string {
		global $wp;

		$current_url = self::home( $wp->request );

		// get the position where '/page. ' text start.
		$pos = strpos( $current_url, '/page' );

		// remove string from the specific position
		if ( $nopaging && $pos ) {
			$current_url = trailingslashit( substr( $current_url, 0, $pos ) );
		}

		if ( $get_vars ) {
			$queryString = http_build_query( $_GET );

			if ( $queryString && mb_strpos( $current_url, '?' ) ) {
				$current_url .= '&' . $queryString;
			} elseif ( $queryString ) {
				$current_url .= '?' . $queryString;
			}
		}

		return $current_url;
	}

	// --------------------------------------------------

	/**
	 * Normalize the given path. On Windows servers backslash will be replaced
	 * with slash. Removes unnecessary double slashes and double dots. Removes
	 * last slash if it exists.
	 *
	 * Examples:
	 * path::normalize("C:\\any\\path\\") returns "C:/any/path"
	 * path::normalize("/your/path/..//home/") returns "/your/home"
	 *
	 * @param string $path
	 *
	 * @return string
	 */
	public static function normalizePath( string $path ): string {
		$path  = str_replace( '\\', '/', $path );
		$parts = explode( '/', $path );
		$stack = [];

		foreach ( $parts as $part ) {
			if ( $part === '' || $part === '.' ) {
				continue;
			}
			if ( $part === '..' ) {
				if ( ! empty( $stack ) ) {
					array_pop( $stack );
				}
			} else {
				$stack[] = $part;
			}
		}

		$normalized = implode( '/', $stack );

		if ( preg_match( '/^[A-Za-z]:/', $path ) ) {
			return $normalized;
		}

		if ( str_starts_with( $path, '/' ) ) {
			return '/' . $normalized;
		}

		return $normalized;
	}

	// --------------------------------------------------

	/**
	 * @param string $url
	 *
	 * @return array
	 */
	public static function urlQueries( string $url ): array {
		$queries = [];
		parse_str( wp_parse_url( $url, PHP_URL_QUERY ), $queries );

		return $queries;
	}

	// --------------------------------------------------

	/**
	 * @param string $url
	 * @param $param
	 * @param null $fallback
	 *
	 * @return mixed|null
	 */
	public static function urlQuery( string $url, $param, $fallback = null ): mixed {
		$queries = self::urlQueries( $url );

		return $queries[ $param ] ?? $fallback;
	}
}
