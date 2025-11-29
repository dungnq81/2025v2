<?php

\defined( 'ABSPATH' ) || die;

$title = ! empty( $args['title'] ) ? $args['title'] : '';
$desc  = ! empty( $args['title'] ) ? $args['desc'] : '';

?>
<div class="section-partners partners py-10 lg:py-20">
	<div class="u-container">
        <?=  $title ? '<h2 class="text-2 h3 uppercase font-bold text-center">' . $title . '</h2>' : '' ?>
        <?=  $desc ? '<div class="max-w-3xl mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-4 pb-8 lg:pb-12">' . $desc . '</div>' : '' ?>

        <?php
        $items_1 = [
	        [
		        'img'    => WP_HOME . '/images/partners/1/cropped-logo-inminhkhang-1.webp',
		        'width'  => '1000',
		        'height' => '448',
                'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/cropped-logo-inthanhtien.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-allian.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-CND.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-dona-gift.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-etech.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-gafo-milk.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-green-nutri.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-hacsan.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-hmg.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-khai-phuc.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-kovamara.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-me-since.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-Rart.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-saigon-milk.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/1/logo-tu-van-ACC.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
        ];

        $items_2 = [
	        [
		        'img'    => WP_HOME . '/images/partners/2/logo-bb-racing.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
	        [
		        'img'    => WP_HOME . '/images/partners/2/logo-bidridco.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-breaktalk.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-dochi-office.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-dona-tourist-1.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-du-lich-hoan-my-1.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-em-biet-doc-1.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-gocons.png',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-hucons.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-metalix.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-new.webp',
		        'width'  => '150',
		        'height' => '118',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-nu-cuoi-duyen.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-thanh-tam.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/LOGO-TRIBECO.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-v-holding.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logo-viet-my.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logobitex-768x448-6028.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logocafe-control-768x448-3725.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logodaidongtien-768x448-71611.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
            [
		        'img'    => WP_HOME . '/images/partners/2/logomitsubishi.webp',
		        'width'  => '1000',
		        'height' => '448',
		        'alt'    => '',
		        'link'   => ''
	        ],
        ];

        if ( $items_1 ) :
        ?>
        <div class="swiper-container">
			<div class="swiper swiper-rtl w-swiper">
				<div class="swiper-marquee swiper-wrapper" data-swiper-options='{"marquee":true,"rtl":true,"slidesPerView":"auto","spaceBetween":12,"speed":6000,"disableOnInteraction":false,"freeMode":true,"sm":{"spaceBetween":24}}'>
					<?php foreach ( $items_1 as $item ) :
						$url    = $item['url'] ?? '';
						$img    = $item['img'] ?? '';
						$width  = $item['width'] ?? null;
						$height = $item['height'] ?? null;
						$alt    = $item['alt'] ?? '';
                    ?>
                    <div class="swiper-slide !w-auto !h-auto">
                        <?= \HD_Helper::ACFLinkOpen( $url, 'flex u-flex-center h-full py-4 px-6 c-light-button rounded-md' ) ?>
                        <?= \HD_Helper::imageTag( $img, $width, $height, 'block h-[67px] w-auto', $alt ) ?>
                        <?= \HD_Helper::ACFLinkClose( $img ) ?>
                    </div>
                    <?php endforeach; ?>
				</div>
			</div>
		</div>
        <?php endif; ?>

        <?php if ( $items_2 ) : ?>
		<div class="swiper-container mt-6">
			<div class="swiper swiper-ltr w-swiper">
				<div class="swiper-marquee swiper-wrapper" data-swiper-options='{"marquee":true,"slidesPerView":"auto","spaceBetween":12,"speed":6000,"disableOnInteraction":false,"freeMode":true,"sm":{"spaceBetween":24}}'>
					<?php foreach ( $items_2 as $item ) :
						$url    = $item['url'] ?? '';
						$img    = $item['img'] ?? '';
						$width  = $item['width'] ?? null;
						$height = $item['height'] ?? null;
						$alt    = $item['alt'] ?? '';
                    ?>
                    <div class="swiper-slide !w-auto !h-auto">
                        <?= \HD_Helper::ACFLinkOpen( $url, 'flex u-flex-center h-full py-4 px-6 c-light-button rounded-md' ) ?>
                        <?= \HD_Helper::imageTag( $img, $width, $height, 'block h-[67px] w-auto', $alt ) ?>
                        <?= \HD_Helper::ACFLinkClose( $img ) ?>
                    </div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
        <?php endif; ?>
	</div>
</div>
