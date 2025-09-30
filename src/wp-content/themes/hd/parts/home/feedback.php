<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$id = $args['id'] ?? 0;
$id = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-feedback py-24">
	<div class="u-container">
		<div class="closest-swiper u-flex-center gap-y-8 lg:gap-y-0 flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
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
			<div class="w-full lg:w-2/5">
				<span class="font-medium mb-4 block text-center lg:text-left">Đánh giá</span>
				<h2 class="font-bold text-center lg:text-left text-balance">
					Khách hàng đánh giá về <span class="text-1">DỊCH VỤ</span> của chúng tôi
				</h2>
                <p class="max-w-3xl mb-0 text-[15px] mx-auto pt-3">
                    4.5 out of 5 based on <strong>Trustpilot</strong> reviews
                </p>
				<div class="swiper-controls u-flex-center lg:justify-start gap-6">
					<button class="swiper-button swiper-button-prev c-swiper-button c-light-button !left-0 !mt-8 !relative !w-11 !h-11">
						<svg class="!h-6 !w-6" aria-hidden="true"><use href="#icon-arrow-left"></use></svg>
					</button>
					<button class="swiper-button swiper-button-next c-swiper-button c-light-button !right-0 !mt-8 !relative !w-11 !h-11">
						<svg class="!h-6 !w-6" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
					</button>
				</div>
			</div>
			<div class="w-full lg:w-3/5">
				<div class="swiper w-swiper">
					<div class="swiper-wrapper" data-options='<?= $swiper_data ?>'>
						<div class="swiper-slide">
							<div class="bg-[#ffffff1a] border border-solid border-[#ffffff26] c-hover hover:border-(--text-color-1) rounded-md max-sm:max-w-sm max-sm:mx-auto p-6">
								<div class="flex items-center gap-5 mb-5 sm:mb-9">
									<img class="rounded-full object-cover w-16 h-16" src="https://randomuser.me/api/portraits/men/33.jpg" alt="avatar">
									<div class="grid gap-1">
										<h5 class="text-white font-bold">Jane D</h5>
										<span class="text-sm leading-6 text-(--text-color)">CEO </span>
									</div>
								</div>
                                <div class="flex items-center mb-5 sm:mb-9 gap-2 text-amber-500">
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                </div>
								<p class="text-(--text-color) leading-6 min-h-24">
									The user interface of this pagedone is so intuitive, I was able to start using it without any guidance.
								</p>
							</div>
						</div>
						<div class="swiper-slide">
							<div class="bg-[#ffffff1a] border border-solid border-[#ffffff26] c-hover hover:border-(--text-color-1) rounded-md max-sm:max-w-sm max-sm:mx-auto p-6">
								<div class="flex items-center gap-5 mb-5 sm:mb-9">
									<img class="rounded-full object-cover w-16 h-16" src="https://randomuser.me/api/portraits/men/33.jpg" alt="avatar">
									<div class="grid gap-1">
										<h5 class="text-white font-bold">Jane D</h5>
										<span class="text-sm leading-6 text-(--text-color)">CEO </span>
									</div>
								</div>
								<div class="flex items-center mb-5 sm:mb-9 gap-2 text-amber-500">
									<svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
									<svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
									<svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
									<svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
									<svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
								</div>
								<p class="text-(--text-color) leading-6 min-h-24">
									The user interface of this pagedone is so intuitive, I was able to start using it without any guidance.
								</p>
							</div>
						</div>
						<div class="swiper-slide">
							<div class="bg-[#ffffff1a] border border-solid border-[#ffffff26] c-hover hover:border-(--text-color-1) rounded-md max-sm:max-w-sm max-sm:mx-auto p-6">
								<div class="flex items-center gap-5 mb-5 sm:mb-9">
									<img class="rounded-full object-cover w-16 h-16" src="https://randomuser.me/api/portraits/men/33.jpg" alt="avatar">
									<div class="grid gap-1">
										<h5 class="text-white font-bold">Jane D</h5>
										<span class="text-sm leading-6 text-(--text-color)">CEO </span>
									</div>
								</div>
                                <div class="flex items-center mb-5 sm:mb-9 gap-2 text-amber-500">
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                    <svg class="w-5 h-5 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
                                </div>
								<p class="text-(--text-color) leading-6 min-h-24">
									The user interface of this pagedone is so intuitive, I was able to start using it without any guidance.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
