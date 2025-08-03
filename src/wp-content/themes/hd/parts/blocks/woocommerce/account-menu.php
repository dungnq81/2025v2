<?php
// account-menu.php

\defined( 'ABSPATH' ) || die;

if ( ! \HD_Helper::isWoocommerceActive() ) {
	return;
}

$account_link = \function_exists( 'wc_get_page_permalink' ) ? esc_url( wc_get_page_permalink( 'myaccount' ) ) : '#';
if ( ! $account_link ) {
	return;
}

if ( ! is_user_logged_in() ) :

?>
<div class="account-item not-logged-in">
	<a rel="nofollow" class="account-btn-link" href="<?= $account_link ?>" data-open="#login-form-popup" data-fa="" title="<?= esc_attr__( 'Đăng nhập / Đăng ký', TEXT_DOMAIN ) ?>">
        <span>
            <strong class="title"><?php echo __( 'Đăng nhập', TEXT_DOMAIN ); ?></strong>
            <span class="txt"><?php echo __( 'để được MIỄN PHÍ vận chuyển', TEXT_DOMAIN ) ?></span>
        </span>
    </a>
</div>
<?php endif; ?>

<?php if ( is_user_logged_in() ) :
	$current_user = wp_get_current_user();
	$display_name = $current_user->display_name;
?>
<div class="account-item logged-in-as">
    <a data-toggle="account-dropdown" rel="nofollow" class="account-btn-link" href="<?= $account_link ?>" data-fa="" title="<?= esc_attr__( 'Tài khoản', TEXT_DOMAIN ) ?>">
        <span>
            <strong class="title"><?= esc_html( $display_name ) ?></strong>
        </span>
    </a>
    <div class="logged-in-dropdown dropdown-pane" id="account-dropdown" data-dropdown data-alignment="right" data-hover="true" data-hover-pane="true">
        <ul>
	        <?php foreach ( wc_get_account_menu_items() as $endpoint => $label ) : ?>
            <li class="<?php echo wc_get_account_menu_item_classes( $endpoint ); ?>">
                <a href="<?php echo esc_url( wc_get_account_endpoint_url( $endpoint ) ); ?>" title="<?php echo esc_attr( $label ); ?>">
                    <?php echo esc_html( $label ); ?>
                </a>
            </li>
	        <?php endforeach; ?>
        </ul>
    </div>
</div>
<?php endif; ?>
