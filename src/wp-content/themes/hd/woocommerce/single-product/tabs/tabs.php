<?php
/**
 * Single Product tabs
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/tabs/tabs.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $product;

$ACF           = \HD_Helper::getFields( $product->get_id() );
$highlights    = $ACF['highlights'] ?? '';
$product_badge = $ACF['product_badge'] ?? [];

/**
 * Filter tabs and allow third parties to add their own.
 *
 * Each tab is an array containing title, callback and priority.
 *
 * @see woocommerce_default_product_tabs()
 */
$product_tabs = apply_filters( 'woocommerce_product_tabs', array() );

if ( ! empty( $product_tabs ) || $highlights ) :

?>
<div class="woocommerce-custom-descriptions wc-descriptions">

    <?php if ( $highlights ) : ?>
    <div class="wc-product-row wc-product-highlight">
        <p class="h2"><?= __( 'Đặc điểm', TEXT_DOMAIN ) ?></p>
        <div class="wc-product-content wc-product-highlight-content">
            <div class="content"><?= $highlights ?></div>
        </div>
    </div>
    <?php endif; ?>

    <?php foreach ( $product_tabs as $key => $product_tab ) : ?>
    <div class="wc-product-row wc-product-<?= $key ?>">
        <p class="h2"><?php echo wp_kses_post( $product_tab['title'] ); ?></p>
        <div class="wc-product-content wc-product-<?= $key ?>-content">
            <?php if ( 'description' === $key && $product_badge ) : ?>
            <div class="header product-badge">
                <?php
                foreach ( $product_badge as $badge ) :
	                $badge_bgcolor = \HD_Helper::getField( 'badge_bgcolor', $badge );
	                $badge_color = \HD_Helper::getField( 'badge_color', $badge );
	                $css = ! empty( $badge_bgcolor ) ? 'background-color:' . $badge_bgcolor . ';' : '';
	                $css .= ! empty( $badge_color ) ? 'color:' . $badge_color . ';' : '';
	                $css = ! empty( $css ) ? ' style="' . $css . '"' : '';
	                echo '<span' . $css . '>' . get_the_title( $badge ) . '</span>';
                endforeach;
                ?>
            </div>
            <?php endif; ?>

            <div class="content">
	        <?php if ( isset( $product_tab['callback'] ) ) :
                call_user_func( $product_tab['callback'], $key, $product_tab );
                endif; ?>
            </div>
        </div>
    </div>
    <?php endforeach; ?>

	<?php do_action( 'woocommerce_product_after_tabs' ); ?>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const product_description = document.querySelector('.wc-product-description-content');
        const desc = document.querySelector('.wc-product-description-content .content');
        if (!desc || !product_description) return;

        const fullHeight = desc.scrollHeight;

        if (fullHeight > 90) {
            desc.classList.add('collapsed');
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'description-toggle';
            toggleBtn.innerText = 'Xem thêm';

            product_description.appendChild(toggleBtn);
            toggleBtn.addEventListener('click', function () {
                const isCollapsed = desc.classList.contains('collapsed');
                if (isCollapsed) {
                    desc.classList.remove('collapsed');
                    toggleBtn.innerText = 'Rút gọn';
                } else {
                    desc.classList.add('collapsed');
                    toggleBtn.innerText = 'Xem thêm';
                }
            });
        }
    });
</script>
<?php endif; ?>
