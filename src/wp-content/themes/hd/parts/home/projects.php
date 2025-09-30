<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
    return;
}

$loop       = $args['loop'] ?? false;
$pagination = $args['pagination'] ?? false;
$navigation = $args['navigation'] ?? false;
$id         = $args['id'] ?? 0;
$id         = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-projects c-light-bg py-20">
    <div class="u-container">
        <h2 class="font-bold">Dự án tiêu biểu</h2>
        <p class="max-w-3xl mb-0 p-fs-clamp-[16,18] pt-4 text-2 font-bold">
            Hơn 1000+ dự án đã được chúng tôi triển khai thành công, mang lại giá trị thiết thực cho khách hàng.
        </p>
        <div class="p-projects-list mt-9">
            <div class="swiper-container">
                <?php
                $data = [
                        'slidesPerView' => 1,
                        'spaceBetween'  => 12,
                        'autoplay'      => true,
                        'rows'          => 1,
                        'tablet'        => [
                                'slidesPerView' => 2,
                                'spaceBetween'  => 24,
                                'grid'          => [
                                        'rows' => 2,
                                        'fill' => 'row',
                                ],
                        ],
                        'desktop'       => [
                                'slidesPerView' => 2,
                                'spaceBetween'  => 24,
                                'grid'          => [
                                        'rows' => 2,
                                        'fill' => 'row',
                                ],
                        ],
                ];

                if ( $navigation ) {
                    $data['navigation'] = true;
                }
                if ( $pagination ) {
                    $data['pagination'] = 'bullets';
                }

                $swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
                if ( ! $swiper_data ) {
                    $swiper_data = '';
                }
                ?>
                <div class="swiper w-swiper">
                    <div class="swiper-wrapper" data-options='<?= $swiper_data ?>'>
                        <div class="swiper-slide">
                            <div class="item flex flex-col items-start gap-4">
                                <div class="p-thumb c-cover rounded-md">
                                    <span class="block w-full">
                                        <img class="w-full object-cover as-16-9 block" src="https://webhd.vn/wp-content/uploads/2025/04/DU-AN-TMA-FARMS.jpg" alt="">
                                    </span>
                                    <div class="p-link u-flex-center flex-wrap w-full gap-4 lg:gap-6">
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title>
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/></svg>
                                            Nông nghiệp công nghệ cao
                                        </a>
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title="Trải nghiệm ngay">
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></svg>
                                            Trải nghiệm
                                        </a>
                                    </div>
                                </div>
                                <a class="text-(--text-color) hover:text-white" href="#" title="">
                                    <h3 class="text-balance font-bold p-fs-clamp-[18,22]">Dự án TMA FARMS</h3>
                                </a>
                                <p class="text-[15px] mb-4 line-clamp-2">Website do HD Agency thiết kế cho TMA Farms đã nhận được nhiều phản hồi tích cực từ khách hàng, nhờ vào giao diện chuyên nghiệp, dễ sử dụng và trải nghiệm mua sắm trực tuyến thuận tiện.</p>
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="item flex flex-col items-start gap-4">
                                <div class="p-thumb c-cover rounded-md">
                                    <span class="block w-full">
                                        <img class="w-full object-cover as-16-9 block" src="https://webhd.vn/wp-content/uploads/2025/04/DU-AN-BAO-TIN-HOME.jpg" alt="">
                                    </span>
                                    <div class="p-link u-flex-center flex-wrap w-full gap-4 lg:gap-6">
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title>
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/></svg>
                                            Bất động sản
                                        </a>
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title="Trải nghiệm ngay">
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></svg>
                                            Trải nghiệm
                                        </a>
                                    </div>
                                </div>
                                <a class="text-(--text-color) hover:text-white" href="#" title="">
                                    <h3 class="text-balance font-bold p-fs-clamp-[18,22]">Dự án BẢO TÍN HOME</h3>
                                </a>
                                <p class="text-[15px] mb-4 line-clamp-2">Website không chỉ nâng tầm hình ảnh thương hiệu mà còn góp phần gia tăng hiệu quả kinh doanh cho Bảo Tín Home trên nền tảng số.</p>
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="item flex flex-col items-start gap-4">
                                <div class="p-thumb c-cover rounded-md">
                                    <span class="block w-full">
                                        <img class="w-full object-cover as-16-9 block" src="https://webhd.vn/wp-content/uploads/2025/04/Du-an-Trung-Thanh-Print-HD-AGENCY-1200x986.jpg" alt="">
                                    </span>
                                    <div class="p-link u-flex-center flex-wrap w-full gap-4 lg:gap-6">
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title>
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/></svg>
                                            In ấn & Quà tặng
                                        </a>
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title="Trải nghiệm ngay">
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></svg>
                                            Trải nghiệm
                                        </a>
                                    </div>
                                </div>
                                <a class="text-(--text-color) hover:text-white" href="#" title="">
                                    <h3 class="text-balance font-bold p-fs-clamp-[18,22]">Dự án TRUNG THÀNH PRINT</h3>
                                </a>
                                <p class="text-[15px] mb-4 line-clamp-2">Website giúp Trung Thành Print nâng cao hình ảnh chuyên nghiệp, cải thiện trải nghiệm khách hàng và tối ưu hiệu quả tư vấn – báo giá online.</p>
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="item flex flex-col items-start gap-4">
                                <div class="p-thumb c-cover rounded-md">
                                    <span class="block w-full">
                                        <img class="w-full object-cover as-16-9 block" src="https://webhd.vn/wp-content/uploads/2025/03/tesla_result.jpg" alt="">
                                    </span>
                                    <div class="p-link u-flex-center flex-wrap w-full gap-4 lg:gap-6">
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title>
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/></svg>
                                            Giáo dục
                                        </a>
                                        <a class="c-hover flex items-center gap-3 uppercase" href="#" title="Trải nghiệm ngay">
                                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></svg>
                                            Trải nghiệm
                                        </a>
                                    </div>
                                </div>
                                <a class="text-(--text-color) hover:text-white" href="#" title="">
                                    <h3 class="text-balance font-bold p-fs-clamp-[18,22]">Dự án TESLA EDUCATION GROUP</h3>
                                </a>
                                <p class="text-[15px] line-clamp-2 mb-4">HD AGENCY hợp tác với Tesla Education Group thiết kế website mới, nâng cao tương tác với phụ huynh và học sinh. Website hiện đại, thân thiện, cung cấp thông tin đầy đủ về chương trình học và sự kiện. Sự hợp tác này góp phần xây dựng hình ảnh chuyên nghiệp cho Tesla trong lĩnh vực giáo dục.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
