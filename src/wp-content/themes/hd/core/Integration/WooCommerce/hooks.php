<?php

use HD\Utilities\Helper;

\defined( 'ABSPATH' ) || die;

//-----------------------------------------------------------------
// Custom functions
//-----------------------------------------------------------------

//-----------------------------------------------------------------
// Custom hooks
//-----------------------------------------------------------------

/**
 * @see wc_product_taxonomy_archive_footer - 10
 */
add_action( 'woocommerce_shop_loop_footer', 'wc_product_taxonomy_archive_footer' );

function wc_product_taxonomy_archive_footer(): void {
	wc_get_template( 'loop/footer.php' );
}

//-----------------------------------------------------------------

//-----------------------------------------------------------------

/**
 * @see wc_add_buy_now_button - 10
 */
add_action( 'woocommerce_after_add_to_cart_button', 'wc_add_buy_now_button' );

function wc_add_buy_now_button(): void {
	global $product;

	if ( $product->is_type( 'simple' ) || $product->is_type( 'variable' ) ) {
		?>
        <button type="submit" name="buy_now" class="button buy-now-button"><?php echo __( 'Mua ngay', TEXT_DOMAIN ); ?></button>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                let form = document.querySelector('form.cart');
                let input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'buy_now_product_id';
                input.value = '<?= esc_attr( $product->get_id() ) ?>';
                form.appendChild(input);
            });
        </script>
		<?php
	}
}

//-----------------------------------------------------------------

/**
 * @see wc_add_wishlist_button - 99
 */
add_action( 'woocommerce_after_add_to_cart_button', 'wc_add_wishlist_button', 99 );

function wc_add_wishlist_button(): void {
	echo Helper::doShortcode( 'yith_wcwl_add_to_wishlist' );
}

//-----------------------------------------------------------------

/**
 * @see wc_handle_buy_now_redirect - 10
 */
add_action( 'template_redirect', 'wc_handle_buy_now_redirect' );

/**
 * @throws Exception
 */
function wc_handle_buy_now_redirect(): void {
	if ( isset( $_POST['buy_now'] ) ) {
        if ( isset( $_POST['variation_id'] ) && empty( $_POST['variation_id'] ) ) {
	        wp_safe_redirect( Helper::current() );
	        exit;
        }

		$product_id = ! empty( $_POST['variation_id'] ) ? (int) $_POST['variation_id'] : (int) $_POST['buy_now_product_id'];

		WC()->cart->empty_cart();
		WC()->cart->add_to_cart( $product_id );
		wp_safe_redirect( wc_get_checkout_url() );
		exit;
	}
}

//-----------------------------------------------------------------

/**
 * @see wc_acf_custom_meta - 39
 */
add_action( 'woocommerce_single_product_summary', 'wc_acf_custom_meta', 39 );

function wc_acf_custom_meta(): void {
	if ( ! isset( $GLOBALS['post'] ) ) {
		return;
	}

	global $post;

	$ACF         = Helper::getFields( $post->ID );
	$ingredients = $ACF['ingredients'] ?? '';
	$how_to_use  = $ACF['how-to-use'] ?? '';

	if ( empty( $ingredients ) && empty( $how_to_use ) ) {
		return;
	}
	?>
    <ul class="accordion" data-accordion data-allow-all-closed="true">
		<?php if ( ! empty( $ingredients ) ) : ?>
        <li class="accordion-item" data-accordion-item>
            <a href="#" class="accordion-title"><?php echo __( 'Thành phần', TEXT_DOMAIN ); ?></a>
            <div class="accordion-content" data-tab-content>
                <?= $ingredients ?>
            </div>
        </li>
		<?php endif; ?>
		<?php if ( ! empty( $how_to_use ) ) : ?>
        <li class="accordion-item" data-accordion-item>
            <a href="#" class="accordion-title"><?php echo __( 'Hướng dẫn sử dụng', TEXT_DOMAIN ); ?></a>
            <div class="accordion-content" data-tab-content>
                <?= $how_to_use ?>
            </div>
        </li>
		<?php endif; ?>
    </ul>
	<?php
}

//-----------------------------------------------------------------

/**
 * @see wc_product_brand_label - 9
 */
add_action( 'woocommerce_shop_loop_item_title', 'wc_product_brand_label', 9 );

function wc_product_brand_label(): void {
	global $product;

	$brands = wp_get_post_terms( $product->get_id(), 'product_brand' );
	if ( ! empty( $brands ) && ! is_wp_error( $brands ) ) {
		$brand = $brands[0];
		echo '<span class="product-brand-label">' . $brand->name . '</span>';
	}
}

//-----------------------------------------------------------------

/**
 * @see wc_product_product_badge - 10
 */
add_action( 'woocommerce_before_shop_loop_item_title', 'wc_product_product_badge' );

function wc_product_product_badge(): void {
    global $product;

	$product_badge = Helper::getField( 'product_badge', $product->get_id() );
    if ( $product_badge ) {
        echo '<div class="product-badge">';
        foreach ( $product_badge as $badge ) {
            $badge_bgcolor = Helper::getField( 'badge_bgcolor', $badge );
            $badge_color = Helper::getField( 'badge_color', $badge );

	        $css = ! empty( $badge_bgcolor ) ? 'background-color:' . $badge_bgcolor . ';' : '';
	        $css .= ! empty( $badge_color ) ? 'color:' . $badge_color . ';' : '';
            $css = ! empty( $css ) ? ' style="' . $css . '"' : '';

            echo '<span' . $css . '>' . get_the_title( $badge ) . '</span>';
        }
        echo '</div>';
    }
}

//-----------------------------------------------------------------

/**
 * @see wc_product_sale_extra - 99
 */
add_action( 'woocommerce_before_single_product', 'wc_product_sale_extra', 99 );

function wc_product_sale_extra(): void {
	global $product;

	$product_sale_extra    = Helper::getField( 'product_sale_extra', $product->get_id() );
	$product_extra_bgcolor = $product_sale_extra['product_extra_bgcolor'] ?? '';
	$product_extra_color   = $product_sale_extra['product_extra_color'] ?? '';
	$product_extra_content = $product_sale_extra['product_extra_content'] ?? '';

    if ( ! Helper::stripSpace( $product_extra_content ) ) {
        return;
    }

	$css = ! empty( $product_extra_bgcolor ) ? 'background-color:' . $product_extra_bgcolor . ';' : '';
	$css .= ! empty( $product_extra_color ) ? 'color:' . $product_extra_color . ';' : '';
    echo ! empty( $product_extra_bgcolor ) ? '<style>.product-sale-extra>.container>.entry{' . $css . '}</style>' : '';
    ?>
    <div class="product-sale-extra">
        <div class="container">
            <div class="entry">
	            <?= $product_extra_content ?>
            </div>
        </div>
    </div>
    <?php
}

//-----------------------------------------------------------------

/**
 * @see wc_product_mini_cart_total - 10
 */
add_action( 'woocommerce_widget_shopping_cart_total', 'wc_product_mini_cart_total' );

function wc_product_mini_cart_total(): void {
	echo '<span><span>' . esc_html__( 'Tổng sản phẩm:', TEXT_DOMAIN ) . '</span> ' . number_format_i18n( WC()->cart->get_cart_contents_count() ) . '</span>';
	echo '<span><span>' . esc_html__( 'Tạm tính:', TEXT_DOMAIN ) . '</span> ' . WC()->cart->get_cart_subtotal() . '</span>';
}

//-----------------------------------------------------------------

/**
 * @see wc_account_menu_items - 10
 */
add_filter( 'woocommerce_account_menu_items', 'wc_account_menu_items', 10, 2 );

/**
 * @param $items
 * @param $endpoints
 *
 * @return mixed
 */
function wc_account_menu_items( $items, $endpoints ): mixed {
	unset( $items['downloads'] );

    return $items;
}

//-----------------------------------------------------------------

/**
 * @see wc_add_phone_gender_field_to_edit_account - 10
 */
add_action( 'woocommerce_edit_account_form_fields', 'wc_add_phone_gender_field_to_edit_account' );

/**
 * @return void
 */
function wc_add_phone_gender_field_to_edit_account(): void {
	$current_user = wp_get_current_user();
	$phone        = get_user_meta( $current_user?->ID, 'account_tel', true );
	$gender       = get_user_meta( $current_user?->ID, 'account_gender', true );

    ?>
    <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
        <label for="account_tel"><?php esc_html_e( 'Số điện thoại', TEXT_DOMAIN ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
        <input required type="tel" class="woocommerce-Input woocommerce-Input--tel input-text" name="account_tel" id="account_tel" autocomplete="tel" value="<?php echo esc_attr( $phone ); ?>" aria-required="true" />
    </p>
    <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
        <label for="account_gender"><?php _e( 'Giới tính', TEXT_DOMAIN ); ?></label>
        <select name="account_gender" id="account_gender" class="account_gender_select" autocomplete="gender">
            <option value=""><?php esc_html_e( 'Chọn giới tính', TEXT_DOMAIN ); ?></option>
            <option value="male" <?php selected( $gender, 'male' ); ?>><?php esc_html_e( 'Nam', TEXT_DOMAIN ); ?></option>
            <option value="female" <?php selected( $gender, 'female' ); ?>><?php esc_html_e( 'Nữ', TEXT_DOMAIN ); ?></option>
        </select>
    </p>
    <?php
}

//-----------------------------------------------------------------

/**
 * @see wc_save_account_details - 10
 */
add_action( 'woocommerce_save_account_details', 'wc_save_account_details' );

/**
 * @param $user_id
 *
 * @return void
 */
function wc_save_account_details( $user_id ): void {
	if ( isset( $_POST['account_tel'] ) ) {
		update_user_meta( $user_id, 'account_tel', sanitize_text_field( $_POST['account_tel'] ) );
	}

	if ( isset( $_POST['account_gender'] ) ) {
		update_user_meta( $user_id, 'account_gender', sanitize_text_field( $_POST['account_gender'] ) );
	}
}

//-----------------------------------------------------------------

