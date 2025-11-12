<?php
/**
 * Register Cron.
 *
 * @author Gaudev
 */

namespace HD\Events;

defined( 'ABSPATH' ) || die;

final class Cron {
	public static function register( $schedules ) {
		$schedules['weekly']  = [
			'interval' => 7 * DAY_IN_SECONDS,
			'display'  => __( 'Once Weekly', TEXT_DOMAIN ),
		];
		$schedules['monthly'] = [
			'interval' => 30 * DAY_IN_SECONDS,
			'display'  => __( 'Once Monthly', TEXT_DOMAIN ),
		];

		return $schedules;
	}
}
