<?php
/**
 * HDMU Class
 *
 * @author Gaudev
 */
final class HDMU {
	public function __construct() {
		( new \HDMU\DisallowIndexing() );
		( new \HDMU\PluginDisabler\PluginDisabler() );
	}
}
