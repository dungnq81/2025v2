<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$id = $args['id'] ?? 0;
$id = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-services-extra relative py-10 lg:py-20">
	<div class="u-container">
		<h2 class="font-bold">Các dịch vụ cốt lõi khác</h2>
        <p class="max-w-4xl mb-0 p-fs-clamp-[15,17] pt-4">
            Mở rộng cung cấp các dịch vụ chuyên sâu về Digital Marketing như: SEO web, Sáng tạo nội dung – hình ảnh, Facebook Ads, Google Ads, Hosting – Tên miền, đăng ký website với Bộ Công Thương…
        </p>
        <div class="flex flex-row flex-wrap lg:flex-nowrap gap-8 lg:gap-10 xl:gap-24">
            <div class="w-full lg:w-1/4 lg:max-w-xl">
                <ul class="tabs flex flex-row flex-nowrap lg:flex-col gap-4 mt-10 lg:mt-15 pb-3 lg:pb-0 snap-x lg:snap-none snap-mandatory overflow-x-auto lg:overflow-x-visible u-scrollbar-thin" data-tabs id="services-extra-tabs-<?=$id?>">
                    <li class="tabs-title snap-start is-active">
                        <a href="#seo" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13.11 7.664 1.78 2.672"/><path d="m14.162 12.788-3.324 1.424"/><path d="m20 4-6.06 1.515"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><circle cx="12" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="9" cy="15" r="2"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Dịch vụ SEO tổng thể</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#app" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Thiết kế App mobile</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#google" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-1.6-.8l-1.6-2.13a1 1 0 0 0-1.6 0L9.6 17.2A2 2 0 0 1 8 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Quảng cáo Google</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#facebook" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Quảng cáo Facebook</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#care" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Chăm sóc Website</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#fanpage" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V7"/><path d="m16 12 2 2 4-4"/><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Chăm sóc Fanpage</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#pagespeed" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.6 2.7a10 10 0 1 0 5.7 5.7"/><circle cx="12" cy="12" r="2"/><path d="M13.4 10.6 19 5"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Tối ưu Pagespeed</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#domain" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Domain</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#hosting-gia-re" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Hosting giá rẻ</h3>
                        </a>
                    </li>
                    <li class="tabs-title snap-start">
                        <a href="#email-doanh-nghiep" class="px-4 lg:px-6 py-2 h-full flex items-center gap-4 c-light-button rounded-md hover:text-[#000] dark:hover:text-white" aria-selected="true" title="">
                            <svg class="w-9 h-9 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.732"/><path d="m22 5.5-6.419 4.179a2 2 0 0 1-2.162 0L7 5.5"/><rect x="7" y="3" width="15" height="12" rx="2"/></svg>
                            <h3 class="font-medium text-base whitespace-nowrap lg:whitespace-normal">Email doanh nghiệp</h3>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="w-full lg:w-3/4">
                <div class="tabs-content mt-0 lg:mt-15" data-tabs-content="services-extra-tabs-<?=$id?>">
                    <div class="tabs-panel pt-4 is-active" id="seo">
                        <div class="max-w-3xl">
                            <p class="h3 text-balance font-bold mb-4 lg:mb-6 text-[#000] dark:text-white uppercase">Dịch vụ SEO tổng thể</p>
                            <p class="text-base font-bold mb-10 text-1">
                                Đội ngũ SEO chuyên nghiệp với hơn 10 năm kinh nghiệm
                            </p>
                            <p class="text-[15px] leading-[1.8]">
                                Nếu doanh nghiệp của bạn không xuất hiện ở những vị trí đầu tiên, bạn đã bỏ lỡ hàng trăm, thậm chí hàng ngàn khách hàng tiềm năng mỗi ngày. Dịch vụ SEO từ khóa Google của HD Agency sẽ giúp website của bạn lên top bền vững, thu hút đúng đối tượng khách hàng và gia tăng doanh thu. Với chiến lược tối ưu chuẩn SEO, nội dung chất lượng và hệ thống liên kết hiệu quả, chúng tôi cam kết biến website thành công cụ kinh doanh mạnh mẽ nhất cho doanh nghiệp.
                            </p>
                            <ul class="list-disc m-8 flex flex-col flex-nowrap gap-4 p-fs-clamp-[15,16]">
                                <li class="dark:text-white font-medium">SEO từ khóa lên top bền vững, không lo tụt hạng</li>
                                <li class="dark:text-white font-medium">Thu hút đúng đối tượng khách hàng tiềm năng</li>
                                <li class="dark:text-white font-medium">Gia tăng doanh thu và lợi nhuận cho doanh nghiệp</li>
                                <li class="dark:text-white font-medium">Chi phí hợp lý, tối ưu ngân sách marketing</li>
                                <li class="dark:text-white font-medium">Báo cáo minh bạch, theo dõi tiến độ dễ dàng</li>
                            </ul>
                            <ul class="flex flex-row flex-wrap gap-5 mt-12">
                                <li class="flex items-center gap-4 group border-(--text-color-2) border rounded-md p-4 hover:border-(--text-color-1) c-hover">
                                    <svg class="c-hover w-6 h-6 text-2 group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                                    <a class="uppercase font-bold text-[14px] hover:text-(--text-color-1) dark:hover:text-white" href="#" title="Website theo yêu cầu">GÓI SEO PERSONAL</a>
                                </li>
                                <li class="flex items-center gap-4 group border-(--text-color-2) border rounded-md p-4 hover:border-(--text-color-1) c-hover">
                                    <svg class="c-hover w-6 h-6 text-2 group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                                    <a class="uppercase font-bold text-[14px] hover:text-(--text-color-1) dark:hover:text-white" href="#" title="Website theo yêu cầu">GÓI SEO BUSINESS</a>
                                </li>
                                <li class="flex items-center gap-4 group border-(--text-color-2) border rounded-md p-4 hover:border-(--text-color-1) c-hover">
                                    <svg class="c-hover w-6 h-6 text-2 group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                                    <a class="uppercase font-bold text-[14px] hover:text-(--text-color-1) dark:hover:text-white" href="#" title="Website theo yêu cầu">GÓI SEO PRO</a>
                                </li>
                            </ul>
                        </div>
                        <div class="hidden sm:block thumb absolute aspect-1/1 rounded-[50%] c-light-button p-30 z-[-1] right-0 bottom-0 opacity-[0.9]">
                            <img class="block object-contain max-w-50" src="https://webhd.vn/wp-content/uploads/2023/11/Group-7284.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</div>
</section>
