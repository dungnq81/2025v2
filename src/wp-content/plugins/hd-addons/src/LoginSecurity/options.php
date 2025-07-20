<?php
// options.php

\defined( 'ABSPATH' ) || exit;

$login_security_options = \Addons\Helper::getOption( 'login_security__options' );
$custom_login_uri       = $login_security_options['custom_login_uri'] ?? '';
$login_otp_verification = $login_security_options['login_otp_verification'] ?? '';
$login_ips_access       = $login_security_options['login_ips_access'] ?? [];
$disable_ips_access     = $login_security_options['disable_ips_access'] ?? [];
$limit_login_attempts   = $login_security_options['limit_login_attempts'] ?? 0;
$illegal_users          = $login_security_options['illegal_users'] ?? '';

$_options_default    = \Addons\Helper::filterSettingOptions( 'security', false );
$privileged_user_ids = $_options_default['privileged_user_ids'] ?? [];
$user_id             = get_current_user_id();

$privileged = false;
if ( in_array( $user_id, $privileged_user_ids, true  ) ) {
	$privileged = true;
}

?>
<div class="container flex flex-x gap sm-up-1 lg-up-2">
    <input type="hidden" name="login-security-hidden" value="1">

    <?php if ( $privileged ) : ?>
    <div class="cell section section-text">
        <label class="heading" for="custom_login_uri"><?php _e( 'Custom Login URL', ADDONS_TEXTDOMAIN ); ?></label>
        <div class="option">
            <div class="controls control-prefix" style="height: unset;">
                <div class="prefix">
                    <span class="input-txt" title="<?= esc_attr( site_url( '/' ) ) ?>"><?= site_url( '/' ) ?></span>
                </div>
				<?php $custom_login_uri = $custom_login_uri ?: 'wp-login.php'; ?>
                <input value="<?php echo esc_attr( $custom_login_uri ); ?>" class="input" type="text" id="custom_login_uri" name="custom_login_uri" placeholder="<?= esc_attr( $custom_login_uri ) ?>">
            </div>
        </div>
        <div class="desc">Attackers frequently target <b>/wp-admin</b> or <b>/wp-login.php</b> as the default login URL for WordPress. Changing it can help prevent these attacks and provide a more memorable login URL.</div>
    </div>
    <?php endif; ?>

	<?php if ( $privileged ) : ?>
    <div class="cell section section-checkbox">
        <label class="heading" for="login_otp_verification"><?php _e( 'Email OTP Login Verification', ADDONS_TEXTDOMAIN ); ?></label>
        <div class="option">
            <div class="controls">
                <input type="checkbox" class="checkbox" name="login_otp_verification" id="login_otp_verification" <?php checked( $login_otp_verification, 1 ); ?> value="1">
            </div>
            <div class="explain"><?php _e( 'Check to activate', ADDONS_TEXTDOMAIN ); ?></div>
        </div>
        <div class="desc">Adds an OTP email verification step after successful login for admin users.</div>
    </div>
    <?php endif; ?>

	<?php if ( $privileged ) : ?>
    <div class="cell section section-select">
        <label class="heading" for="login_ips_access"><?php _e( 'Allowlist IPs Login Access', ADDONS_TEXTDOMAIN ); ?></label>
        <div class="option">
            <div class="controls">
                <div class="select_wrapper">
                    <select multiple placeholder="Enter IP addresses" class="select select2-ips !w[100%]" name="login_ips_access" id="login_ips_access">
						<?php
						if ( $login_ips_access ) {
							foreach ( (array) $login_ips_access as $ip ) {
                            ?>
                            <option selected value="<?= esc_attr( $ip ) ?>"><?= $ip ?></option>
							<?php }
						} ?>
                    </select>
                </div>
            </div>
        </div>
        <div class="desc">
            <p>By default, your WordPress login page is accessible from any IP address. You can use this feature to restrict login access to specific IPs or ranges of IPs to prevent brute-force attacks or malicious login attempts.</p>
            <b>Ex:</b> 192.168.0.1, 192.168.0.1-100, 192.168.0.1/4
        </div>
    </div>
	<?php endif; ?>

	<?php if ( $privileged ) : ?>
    <div class="cell section section-select">
        <label class="heading" for="disable_ips_access"><?php _e( 'Blocked IPs Access', ADDONS_TEXTDOMAIN ); ?></label>
        <div class="option">
            <div class="controls">
                <div class="select_wrapper">
                    <select multiple placeholder="Enter IP addresses" class="select select2-ips !w[100%]" name="disable_ips_access" id="disable_ips_access">
						<?php
						if ( $disable_ips_access ) {
							foreach ( (array) $disable_ips_access as $ip ) {
                        ?>
                        <option selected value="<?= esc_attr( $ip ) ?>"><?= $ip ?></option>
                        <?php }
						} ?>
                    </select>
                </div>
            </div>
        </div>
        <div class="desc">
            <p>List of IP addresses or ranges of IPs blocked from accessing the login page.</p>
            <b>Ex:</b> 192.168.0.1, 192.168.0.1-100, 192.168.0.1/4
        </div>
    </div>
    <?php endif; ?>

    <div class="cell section section-checkbox">
        <label class="heading" for="illegal_users"><?php _e( 'Disable Common Usernames', ADDONS_TEXTDOMAIN ); ?></label>
        <div class="option">
            <div class="controls">
                <input type="checkbox" class="checkbox" name="illegal_users" id="illegal_users" <?php checked( $illegal_users, 1 ); ?> value="1">
            </div>
            <div class="explain"><?php _e( 'Check to activate', ADDONS_TEXTDOMAIN ); ?></div>
        </div>
        <div class="desc">Using common usernames like <b>'admin'</b> is a security threat that often results in unauthorized access. By enabling this option we will disable the creation of common usernames and if you already have one or more users with a weak username, we'll ask you to provide new one(s).</div>
    </div>

    <div class="cell section section-select">
        <label class="heading" for="limit_login_attempts"><?php _e( 'Limit Login Attempts', ADDONS_TEXTDOMAIN ); ?></label>
        <div class="option">
            <div class="controls">
                <div class="select_wrapper">
                    <select class="select" name="limit_login_attempts" id="limit_login_attempts">
				        <?php foreach ( \Addons\LoginSecurity\LoginAttempts::$login_attempts_data as $key => $value ) { ?>
                        <option value="<?= $key ?>"<?= selected( $limit_login_attempts, $key, false ) ?>><?= $value ?></option>
				        <?php } ?>
                    </select>
                </div>
            </div>
        </div>
        <div class="desc">Limit the number of times a given user can attempt to log in to your wp-admin with incorrect credentials. Once the login attempt limit is reached, the IP from which the attempts have originated will be blocked first for 1 hour. If the attempts continue after the first hour, the limit will then be triggered for 24 hours and then for 7 days.</div>
    </div>
</div>
