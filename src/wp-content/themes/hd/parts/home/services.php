<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$id = $args['id'] ?? 0;
$id = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-services py-20">
	<div class="u-container">
		<h2 class="font-bold text-center">Dịch vụ của chúng tôi</h2>
		<p class="max-w-3xl mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-4">
			XÂY DỰNG WEBSITE <strong class="text-1">CHUYÊN NGHIỆP</strong> & ĐƯA RA CÁC GIẢI PHÁP CHUYÊN SÂU VỀ LĨNH VỰC <strong class="text-1">DIGITAL MARKETING</strong>
			<i class="block text-sm text-center mt-3">Thiết kế WEBSITE, SEO, Sáng tạo nội dung website & Fanpage, Google Ads, Facebook Ads …</i>
		</p>
		<ul class="tabs flex justify-center gap-4 mt-16 lg:px-24 lg:mb-8 lg:gap-8" data-tabs id="services-tabs-<?=$id?>">
			<li class="tabs-title is-active">
                <a class="p-6 h-full flex items-center gap-4 c-light-button c-hover rounded-md hover:text-white" href="#thiet-ke-website" aria-selected="true" title="Thiết kế website">
                    <svg class="w-10 h-10 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z"/><path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845"/></svg>
                    <h3 class="uppercase font-bold p-fs-clamp-[16,20]">Thiết kế website</h3>
                </a>
            </li>
			<li class="tabs-title">
                <a class="p-6 h-full flex items-center gap-4 c-light-button c-hover rounded-md hover:text-white" href="#marketing-online" title="Marketing Online">
                    <svg class="w-10 h-10 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                    <h3 class="uppercase font-bold p-fs-clamp-[16,20]">Marketing Online</h3>
                </a>
            </li>
			<li class="tabs-title">
                <a class="p-6 h-full flex items-center gap-4 c-light-button c-hover rounded-md hover:text-white" href="#nhan-dang-thuong-hieu" title="Nhận dạng thương hiệu">
                    <svg class="w-10 h-10 relative" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z"/><path d="M10 22v-8L2.25 9.15"/><path d="m10 14 11.77-6.87"/></svg>
                    <h3 class="uppercase font-bold p-fs-clamp-[16,20]">Nhận dạng thương hiệu</h3>
                </a>
            </li>
		</ul>
		<div class="tabs-content pt-24 pb-12 lg:px-24" data-tabs-content="services-tabs-<?=$id?>">
			<div class="tabs-panel is-active" id="thiet-ke-website">
                <div class="flex gap-20 items-center">
                    <div class="w-full lg:w-1/3 max-w-2xl text-center">
                        <img class="inline-block" src="https://onidel.com/wp-content/themes/blocksy-child/images/hero-image.png" alt="">
                    </div>
                    <div class="w-full lg:w-2/3 max-w-2xl">
                        <p class="h3 text-balance font-bold mb-6 text-white">Thiết kế website</p>
                        <p class="text-[15px]">
                            Là dịch vụ chiến lược tại HD AGENCY, chúng tôi có hơn 6+ năm kinh nghiệm trong việc lên kế hoạch thực hiện website cho các tất cả loại hình thiết kế website trên thị trường hiện nay.
                        </p>
                        <ul class="flex flex-col gap-5 mt-8">
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website theo yêu cầu">Website theo yêu cầu</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website doanh nghiệp">Website doanh nghiệp</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website bán hàng">Website bán hàng</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website bất động sản">Website bất động sản</a>
                            </li>
                        </ul>
                        <a class="text-sm pt-12 inline-flex items-center gap-2 text-1" href="#" title="Xem thêm">
                            Xem thêm
                            <svg class="w-5 h-5" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
                        </a>
                    </div>
                </div>
			</div>
			<div class="tabs-panel" id="marketing-online">
                <div class="flex gap-20 items-center">
                    <div class="w-full lg:w-1/3 max-w-2xl text-center">
                        <img class="inline-block" src="https://onidel.com/wp-content/themes/blocksy-child/images/hero-image.png" alt="">
                    </div>
                    <div class="w-full lg:w-2/3 max-w-2xl">
                        <p class="h3 text-balance font-bold mb-6 text-white">Marketing Online</p>
                        <p class="text-[15px]">
                            Với mong muốn mang lại hiệu quả cho khách hàng sử dụng dịch vụ tại HD AGENCY. Chúng tôi luôn tìm hiểu và lên kế hoạch marketing online cụ thể nhằm thúc đẩy doanh số, lan tỏa thương hiệu nhanh chóng đến cộng đồng người tiêu dùng online.
                        </p>
                        <ul class="flex flex-col gap-5 mt-8">
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website theo yêu cầu">Dịch vụ SEO tổng thể</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website doanh nghiệp">ADS GOOGLE - FACEBOOK</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website bán hàng">CHĂM SÓC WEBSITE - FANPAGE</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website bất động sản">SÁNG TẠO NỘI DUNG CHUẨN SEO</a>
                            </li>
                        </ul>
                        <a class="text-sm pt-12 inline-flex items-center gap-2 text-1" href="#" title="Xem thêm">
                            Xem thêm
                            <svg class="w-5 h-5" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
                        </a>
                    </div>
                </div>
			</div>
			<div class="tabs-panel" id="nhan-dang-thuong-hieu">
                <div class="flex gap-20 items-center">
                    <div class="w-full lg:w-1/3 max-w-2xl text-center">
                        <img class="inline-block" src="https://onidel.com/wp-content/themes/blocksy-child/images/hero-image.png" alt="">
                    </div>
                    <div class="w-full lg:w-2/3 max-w-2xl">
                        <p class="h3 text-balance font-bold mb-6 text-white">Nhận dạng thương hiệu</p>
                        <p class="text-[15px]">
                            Dù che đi logo vẫn nhận diện được thương hiệu bạn giữa hàng trăm đối thủ cạnh tranh trên thị trường là kim chỉ nam khi HD AGENCY phát triển bộ nhận diện thương hiệu cho bạn.
                        </p>
                        <ul class="flex flex-col gap-5 mt-8">
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website theo yêu cầu">THIẾT KẾ LOGO</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website doanh nghiệp">THIẾT KẾ NAME CARD</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website bán hàng">CATELOGUE</a>
                            </li>
                            <li class="flex items-baseline gap-4 group">
                                <svg class="top-[7px] c-hover relative w-6 h-6 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                                <a class="uppercase font-bold text-[14px] hover:text-white" href="#" title="Website bất động sản">PROFILE</a>
                            </li>
                        </ul>
                        <a class="text-sm pt-12 inline-flex items-center gap-2 text-1" href="#" title="Xem thêm">
                            Xem thêm
                            <svg class="w-5 h-5" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
                        </a>
                    </div>
                </div>
			</div>
		</div>
	</div>

    <svg class="absolute size-[0] overflow-hidden" xmlns="http://www.w3.org/2000/svg" hidden aria-hidden="true" focusable="false">
        <defs>
            <symbol id="icon-check-circle" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5L11 14l4-4m6 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0" />
            </symbol>
        </defs>
    </svg>
</section>
