<?php

namespace HD\Utilities\Traits;

\defined( 'ABSPATH' ) || die;

trait Encryption {
	// --------------------------------------------------

	/**
	 * @return string
	 */
	private static function getKey(): string {
		$key = defined( 'SECRET_KEY' ) ? \SECRET_KEY : AUTH_KEY;

		return hash( 'sha256', $key, true );
	}

	// --------------------------------------------------

	/**
	 * @return string
	 */
	private static function getMethod(): string {
		return 'AES-256-CBC';
	}

	// --------------------------------------------------

	/**
	 * Encrypt data with IV + HMAC
	 *
	 * @param string|null $data
	 *
	 * @return string|null
	 * @throws \Random\RandomException
	 */
	public static function encode( ?string $data ): ?string {
		if ( $data === null ) {
			return null;
		}

		$method   = self::getMethod();
		$key      = self::getKey();
		$ivLength = openssl_cipher_iv_length( $method );
		$iv       = random_bytes( $ivLength );

		$cipher = openssl_encrypt( $data, $method, $key, OPENSSL_RAW_DATA, $iv );
		if ( $cipher === false ) {
			throw new \RuntimeException( "Encryption failed" );
		}

		// HMAC to verify integrity
		$hmac = hash_hmac( 'sha256', $iv . $cipher, $key, true );

		return base64_encode( $iv . $cipher . $hmac );
	}

	// --------------------------------------------------

	/**
	 * Decrypt with HMAC validation
	 *
	 * @param string|null $encoded
	 *
	 * @return string|null
	 */
	public static function decode( ?string $encoded ): ?string {
		if ( $encoded === null ) {
			return null;
		}

		$method = self::getMethod();
		$key    = self::getKey();

		$data = base64_decode( $encoded, true );
		if ( $data === false ) {
			throw new \RuntimeException( "Invalid base64 input" );
		}

		$ivLength = openssl_cipher_iv_length( $method );
		$iv       = substr( $data, 0, $ivLength );
		$cipher   = substr( $data, $ivLength, - 32 );
		$hmac     = substr( $data, - 32 );

		$calcHmac = hash_hmac( 'sha256', $iv . $cipher, $key, true );

		// Constant-time compare
		if ( ! hash_equals( $hmac, $calcHmac ) ) {
			throw new \RuntimeException( "Invalid HMAC, tampered data" );
		}

		$plain = openssl_decrypt( $cipher, $method, $key, OPENSSL_RAW_DATA, $iv );
		if ( $plain === false ) {
			throw new \RuntimeException( "Decryption failed" );
		}

		return $plain;
	}
}
