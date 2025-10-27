<?php
/**
 * Creates minified CSS via PHP.
 *
 * @author  Carlos Rios
 *
 * Modified by Tom Usborne for GeneratePress
 * Modified by Gaudev
 */

namespace HD\Utilities\Helpers;

final class CSS {

	/* ---------- CONFIG ------------------------------------------- */

	private ?string $_selector = '';
	private ?string $_css = '';
	private ?string $_output = '';
	private ?string $_media_query = null;
	private ?string $_media_query_output = '';

	/* ---------- PUBLIC ------------------------------------------- */

	/**
	 * Sets a selector to the object and changes the current selector to a new one
	 *
	 * @param string $selector - the css identifier of the html that you wish to target.
	 *
	 * @return self
	 */
	public function set_selector( string $selector = '' ): self {
		// Render the css in the output string everytime the selector changes.
		if ( '' !== $this->_selector ) {
			$this->add_selector_rules_to_output();
		}

		$this->_selector = $selector;

		return $this;
	}

	// -----------------------------------------

	/**
	 * Adds a css property with value to the css output
	 *
	 * @param string $property The css property.
	 * @param mixed $value The value to be placed with the property.
	 * @param mixed $og_default Check to see if the value matches the default.
	 * @param mixed $unit The unit for the value (px).
	 *
	 * @return self
	 */
	public function add_property( string $property, mixed $value, mixed $og_default = false, mixed $unit = false ): self {
		// Setting font-size to 0 is rarely ever a good thing.
		if ( 'font-size' === $property && 0 === $value ) {
			return $this;
		}

		// Add our unit to our value if it exists.
		if ( ! empty( $unit ) && is_numeric( $value ) ) {
			$value .= $unit;
			if ( ! empty( $og_default ) ) {
				$og_default .= $unit;
			}
		}

		// If we don't have a value or our value is the same as our og default, bail.
		if ( ( empty( $value ) && ! is_numeric( $value ) ) || $og_default === $value ) {
			return $this;
		}

		$this->_css .= $property . ':' . $value . ';';

		return $this;
	}

	// -----------------------------------------

	/**
	 * Sets a media query in the class
	 *
	 * @param string $value The media query.
	 *
	 * @return self
	 */
	public function start_media_query( string $value ): self {
		// Add the current rules to the output.
		$this->add_selector_rules_to_output();

		// Add any previous media queries to the output.
		if ( ! empty( $this->_media_query ) ) {
			$this->add_media_query_rules_to_output();
		}

		// Set the new media query.
		$this->_media_query = $value;

		return $this;
	}

	// -----------------------------------------

	/**
	 * Stops using a media query.
	 *
	 * @return self
	 */
	public function stop_media_query(): self {
		return $this->start_media_query( null );
	}

	/* ---------- PRIVATE ------------------------------------------ */

	/**
	 * Adds the current media query's rules to the class' output variable
	 *
	 * @return void
	 */
	private function add_media_query_rules_to_output(): void {
		if ( ! empty( $this->_media_query_output ) ) {
			$this->_output .= sprintf( '@media %1$s{%2$s}', $this->_media_query, $this->_media_query_output );

			// Reset the media query output string.
			$this->_media_query_output = '';
		}
	}

	// -----------------------------------------

	/**
	 * Adds the current selector rules to the output variable
	 *
	 * @return void
	 */
	private function add_selector_rules_to_output(): void {
		if ( ! empty( $this->_css ) ) {
			$selector_output = sprintf( '%1$s{%2$s}', $this->_selector, $this->_css );

			// Add our CSS to the output.
			if ( ! empty( $this->_media_query ) ) {
				$this->_media_query_output .= $selector_output;
			} else {
				$this->_output .= $selector_output;
			}

			// Reset the css.
			$this->_css = '';
		}

	}

	/**
	 * Returns the minified css in the $_output variable
	 *
	 * @return string|null
	 */
	public function css_output(): ?string {
		// Add current selector's rules to output.
		$this->add_selector_rules_to_output();

		// Output minified css.
		return $this->_output;
	}
}
