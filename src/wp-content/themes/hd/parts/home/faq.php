<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$id = $args['id'] ?? 0;
$id = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-faq py-20">
	<div class="u-container">
		<h2 class="font-bold text-center">Câu hỏi thường gặp</h2>
		<p class="max-w-3xl mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-4">
			Chúng tôi hỗ trợ bạn 24/7. Hãy liên lạc với chúng tôi theo số <a class="font-medium" href="tel:0938002776" title="0938 002 776">0938 002 776</a>
		</p>
		<a class="text-center text-sm pt-6 relative left-[50%] translate-x-[-50%] inline-flex items-center gap-2 text-1" href="https://zalo.me/0938002776" target="_blank">
			<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.44 2.44 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></svg>
			Ask your own question
			<svg class="w-5 h-5" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
		</a>
		<ul class="accordion accordion-faq max-w-3xl mx-auto pt-10" data-accordion data-multi-expand="true" data-allow-all-closed="true">
			<li class="accordion-item py-3 px-6 my-3 rounded-md" data-accordion-item>
				<a href="#" class="accordion-title relative p-fs-clamp-[16,18] flex c-hover font-bold pr-8" aria-label="">
					Thiết Kế Website Là Gì?
					<svg class="w-6 h-6 minus absolute" aria-hidden="true"><use href="#icon-minus"></use></svg>
					<svg class="w-6 h-6 plus absolute" aria-hidden="true"><use href="#icon-plus"></use></svg>
				</a>
				<div class="accordion-content text-[15px] pt-5" data-tab-content>
					<p>Thiết kế website là quá trình tạo ra giao diện và trải nghiệm người dùng cho trang web, bao gồm việc lập kế hoạch, thiết kế đồ họa, và phát triển chức năng. Quá trình này đòi hỏi sự kết hợp giữa yếu tố thẩm mỹ và tính năng kỹ thuật để tạo ra một website vừa đẹp mắt, vừa dễ sử dụng.</p>
					<p>Một website được thiết kế tốt sẽ giúp doanh nghiệp tăng uy tín, thu hút khách hàng và cải thiện hiệu quả kinh doanh trong thời đại số hóa.</p>
				</div>
			</li>
			<li class="accordion-item py-3 px-6 my-3 rounded-md" data-accordion-item>
				<a href="#" class="accordion-title relative p-fs-clamp-[16,18] flex c-hover font-bold pr-8" aria-label="">
					Thời gian hoàn thành thiết kế website tại HD Agency trong bao lâu?
					<svg class="w-6 h-6 minus absolute" aria-hidden="true"><use href="#icon-minus"></use></svg>
					<svg class="w-6 h-6 plus absolute" aria-hidden="true"><use href="#icon-plus"></use></svg>
				</a>
				<div class="accordion-content text-[15px] pt-5" data-tab-content>
					<p>Tuỳ theo yêu cầu và chức năng của website sẽ có thời gian hoàn thiện khác nhau. Trung bình thì website theo mẫu hoặc web yêu cầu thông thường thì hoàn thiện trong khoảng từ 7 – 14 ngày để hoàn thiện website.</p>
				</div>
			</li>
			<li class="accordion-item py-3 px-6 my-3 rounded-md" data-accordion-item>
				<a href="#" class="accordion-title relative p-fs-clamp-[16,18] flex c-hover font-bold pr-8" aria-label="">
					Thời gian hoàn thành thiết kế website tại HD Agency trong bao lâu?
					<svg class="w-6 h-6 minus absolute" aria-hidden="true"><use href="#icon-minus"></use></svg>
					<svg class="w-6 h-6 plus absolute" aria-hidden="true"><use href="#icon-plus"></use></svg>
				</a>
				<div class="accordion-content text-[15px] pt-5" data-tab-content>
					<p>Tuỳ theo yêu cầu và chức năng của website sẽ có thời gian hoàn thiện khác nhau. Trung bình thì website theo mẫu hoặc web yêu cầu thông thường thì hoàn thiện trong khoảng từ 7 – 14 ngày để hoàn thiện website.</p>
				</div>
			</li>
			<li class="accordion-item py-3 px-6 my-3 rounded-md" data-accordion-item>
				<a href="#" class="accordion-title relative p-fs-clamp-[16,18] flex c-hover font-bold pr-8" aria-label="">
					Thời gian hoàn thành thiết kế website tại HD Agency trong bao lâu?
					<svg class="w-6 h-6 minus absolute" aria-hidden="true"><use href="#icon-minus"></use></svg>
					<svg class="w-6 h-6 plus absolute" aria-hidden="true"><use href="#icon-plus"></use></svg>
				</a>
				<div class="accordion-content text-[15px] pt-5" data-tab-content>
					<p>Tuỳ theo yêu cầu và chức năng của website sẽ có thời gian hoàn thiện khác nhau. Trung bình thì website theo mẫu hoặc web yêu cầu thông thường thì hoàn thiện trong khoảng từ 7 – 14 ngày để hoàn thiện website.</p>
				</div>
			</li>
		</ul>

		<svg class="absolute size-[0] overflow-hidden" xmlns="http://www.w3.org/2000/svg" hidden aria-hidden="true" focusable="false">
			<defs>
				<symbol id="icon-minus" viewBox="0 0 24 24">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/>
				</symbol>
				<symbol id="icon-plus" viewBox="0 0 24 24">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/>
				</symbol>
			</defs>
		</svg>
	</div>
</section>
