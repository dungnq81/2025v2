<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$rtl_list_1 = ! empty( $args['rtl_list_1'] ) ? $args['rtl_list_1'] : [];
$ltr_list_2 = ! empty( $args['ltr_list_2'] ) ? $args['ltr_list_2'] : [];
$id         = $args['id'] ?? 0;
$id         = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

if ( empty( $rtl_list_1 ) && empty( $ltr_list_2 ) ) {
    return;
}

?>
<section id="section-<?= $id ?>" class="section section-partners partners py-10 lg:py-20">
	<div class="u-container">
        <?php if ( $rtl_list_1 ) : ?>
        <div class="swiper-container">
            <?php
            $data = [
	            'marquee'              => true,
	            'rtl'                  => true,
	            'slidesPerView'        => 'auto',
	            'spaceBetween'         => 12,
	            'speed'                => 6000,
	            'disableOnInteraction' => false,
	            'freeMode'             => true,
	            'sm'                   => [
		            'spaceBetween' => 24,
	            ]
            ];

            $swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
            if ( ! $swiper_data ) {
                $swiper_data = '';
            }
            ?>
            <div class="swiper swiper-rtl w-swiper">
                <div class="swiper-marquee swiper-wrapper" data-swiper-options='<?= $swiper_data ?>'>
                    <?php foreach ( $rtl_list_1 as $item ) :
                        $link = $item['link'] ?? '';
                        $img  = $item['img'] ?? '';
                    ?>
                    <div class="swiper-slide !w-auto !h-auto">
                        <?= \HD_Helper::ACFLinkOpen( $link, 'flex u-flex-center h-full py-4 px-6 c-light-button rounded-md' ) ?>
                        <?= \HD_Helper::attachmentImageHTML( $img, 'thumbnail', [ 'class' => 'block h-[67px] w-auto' ] ) ?>
                        <?= \HD_Helper::ACFLinkClose( $link ) ?>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <?php if ( $ltr_list_2 ) : ?>
        <div class="swiper-container mt-6">
            <?php
            $data = [
	            'marquee'              => true,
	            'slidesPerView'        => 'auto',
	            'spaceBetween'         => 12,
	            'speed'                => 6000,
	            'disableOnInteraction' => false,
	            'freeMode'             => true,
	            'sm'                   => [
		            'spaceBetween' => 24,
	            ]
            ];

            $swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
            if ( ! $swiper_data ) {
	            $swiper_data = '';
            }
            ?>
            <div class="swiper swiper-ltr w-swiper">
                <div class="swiper-marquee swiper-wrapper" data-swiper-options='<?= $swiper_data ?>'>
                    <?php foreach ( $ltr_list_2 as $item ) :
                        $link = $item['link'] ?? '';
                        $img  = $item['img'] ?? '';
                    ?>
                    <div class="swiper-slide !w-auto !h-auto">
                        <?= \HD_Helper::ACFLinkOpen( $link, 'flex u-flex-center h-full py-4 px-6 c-light-button rounded-md' ) ?>
                        <?= \HD_Helper::attachmentImageHTML( $img, 'thumbnail', [ 'class' => 'block h-[67px] w-auto' ] ) ?>
                        <?= \HD_Helper::ACFLinkClose( $link ) ?>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>
	</div>
</section>
