<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$id = $args['id'] ?? 0;
$id = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-press py-20">
	<div class="u-container closest-swiper">
		<h2 class="font-bold text-center">Báo chí nói gì về <span class="hover:text-1 c-hover">HD</span> <span class="hover:text-2 c-hover">AGENCY</span></h2>
		<p class="max-w-3xl mb-9 p-fs-clamp-[15,17] text-center mx-auto pt-4">HD AGENCY tự hào về những điều đạt được trong thời gian qua</p>
		<div class="swiper-container px-16">
			<?php
			$data = [
				'loop'       => true,
				'autoview'   => true,
				'gap'        => true,
				'navigation' => true,
				'autoplay'   => true,
			];

			$swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
			if ( ! $swiper_data ) {
				$swiper_data = '';
			}

			?>
			<div class="w-full swiper w-swiper">
				<div class="swiper-wrapper" data-options='<?= $swiper_data ?>'>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="44" src="https://webhd.vn/wp-content/uploads/2025/02/logo-baolongan_3_11zon.png" class="attachment-thumbnail size-thumbnail object-contain w-full h-full" alt="" decoding="async">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="93" src="https://webhd.vn/wp-content/uploads/2025/02/logo-baodongnai_2_11zon.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="55" src="https://webhd.vn/wp-content/uploads/2025/02/logo-baothainguyen_1_11zon.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="82" src="https://webhd.vn/wp-content/uploads/2025/02/bao-quang-ngai_4_11zon-300x82.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-quang-ngai_4_11zon-300x82.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-quang-ngai_4_11zon.png 398w" sizes="(max-width: 300px) 100vw, 300px">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="108" src="https://webhd.vn/wp-content/uploads/2025/02/bao-thai-binh_5_11zon.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="68" src="https://webhd.vn/wp-content/uploads/2025/02/bao-phu-tho_6_11zon-300x68.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-phu-tho_6_11zon-300x68.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-phu-tho_6_11zon.png 750w" sizes="(max-width: 300px) 100vw, 300px">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="78" src="https://webhd.vn/wp-content/uploads/2025/02/bao-ha-giang_7_11zon-300x78.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-ha-giang_7_11zon-300x78.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-ha-giang_7_11zon.png 476w" sizes="(max-width: 300px) 100vw, 300px">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="67" src="https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon-300x67.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon-300x67.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon-768x171.png 768w, https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon.png 900w" sizes="(max-width: 300px) 100vw, 300px">
						</a>
					</div>
					<div class="swiper-slide">
						<a class="u-flex-center c-hover c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
							<img loading="lazy" width="300" height="71" src="https://webhd.vn/wp-content/uploads/2025/02/bao-dong-khoi_9_11zon-300x71.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-dong-khoi_9_11zon-300x71.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-dong-khoi_9_11zon.png 369w" sizes="(max-width: 300px) 100vw, 300px">
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
