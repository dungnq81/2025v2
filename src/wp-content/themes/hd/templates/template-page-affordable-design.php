<?php
/**
 * The template for displaying `affordable website design`
 * Template Name: Thiết kế website giá rẻ
 * Template Post Type: page
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'affordable-design' );

if ( have_posts() ) {
	the_post();
}

?>

<!-- PRICES -->
<section class="section section-prices py-20">
    <div class="u-container">
        <h2 class="font-bold text-center">Bảng giá <span class="text-1">thiết kế website</span> giá rẻ – trọn gói</h2>
        <p class="mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-6 max-w-5xl">
            Bảng giá <b>thiết kế website giá rẻ</b> tại <b><span class="hover:text-1">HD</span> <span class="hover:text-2">Agency</span></b> luôn niêm yết bảng giá, công khai và minh bạch trong từng gói dịch vụ.
            Có hợp đồng rõ ràng, bảo hành và hỗ trợ vận hành.
        </p>
        <div class="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div class="relative rounded-3xl bg-white p-6 ring-1 ring-gray-300 shadow-2xl hover:ring-(--text-color-1) c-hover">
                <p class="font-semibold text-1 uppercase">Starter</p>
                <div class="mt-3 flex items-baseline gap-2">
                    <span class="h3 font-extrabold">4.900.000</span>
                    <span class="text-base">VNĐ</span>
                </div>
                <p class="mt-1 text-[15px] text-gray-500">Khởi đầu kinh doanh trực tuyến</p>
                <ul class="mt-5 space-y-2 text-sm">
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Thiết kế theo mẫu có sẵn (Mẫu chuyên nghiệp)</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Tặng tên miền .com</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span><span class="font-medium">Tặng hosting 2Gb</span>, băng thông không giới hạn</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Hỗ trợ thiết kế logo</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Cập nhật 10 – 20 nội dung</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bảo mật SSL: <span class="font-medium">Miễn phí</span></span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Tích hợp chat trực tuyến</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Chuẩn SEO, chuẩn Mobile</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Bảo hành trọn đời</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bàn giao source code</span>
                    </li>
                </ul>
                <a href="#" class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-(--text-color-1) px-4 py-2.5 font-semibold text-white">Chọn gói này</a>
            </div>
            <div class="relative rounded-3xl bg-white p-6 ring-2 ring-(--text-color-1) shadow-2xl md:-translate-y-4 hover:md:-translate-y-5 c-hover">
                <span class="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-(--text-color-1) px-4 py-2 text-xs font-semibold text-white shadow-lg">Phổ biến</span>
                <p class="font-semibold text-1 uppercase">PLUS</p>
                <div class="mt-3 flex items-baseline gap-2">
                    <span class="h3 font-extrabold">8.900.000</span>
                    <span class="text-base">VNĐ</span>
                </div>
                <p class="mt-1 text-[15px] text-gray-500">Mở rộng tăng trưởng</p>
                <ul class="mt-5 space-y-2 text-[15px]">
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Thiết kế theo yêu cầu của khách hàng</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Tặng tên miền .com hoặc .vn</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span><span class="font-medium">Tặng hosting 4Gb</span>, băng thông không giới hạn</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Hỗ trợ thiết kế logo</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Cập nhật 20 – 30 nội dung</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bảo mật SSL: <span class="font-medium">Miễn phí</span></span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Tích hợp chat trực tuyến</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Chuẩn SEO, chuẩn Mobile</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bảo hành trọn đời</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bàn giao source code</span>
                    </li>
                </ul>
                <a href="#" class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-(--text-color-1) px-4 py-2.5 font-semibold text-white">Chọn gói này</a>
            </div>
            <div class="relative rounded-3xl bg-white p-6 ring-1 ring-gray-300 shadow-2xl hover:ring-(--text-color-1) c-hover">
                <p class="font-semibold text-1 uppercase">Pro</p>
                <div class="mt-3 flex items-baseline gap-2">
                    <span class="h3 font-extrabold">13.900.000</span>
                    <span class="text-base">VNĐ</span>
                </div>
                <p class="mt-1 text-[15px] text-gray-500">Khẳng định giá trị thương hiệu</p>
                <ul class="mt-5 space-y-2 text-sm">
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Thiết kế layout Figma theo yêu cầu</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Tặng tên miền .com hoặc .vn</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span><span class="font-medium">Tặng hosting 6Gb</span>, băng thông không giới hạn</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Tặng email doanh nghiệp 5Gb sử dụng 5 user</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Hỗ trợ thiết kế 3 mẫu logo chuyên nghiệp</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Cập nhật 30 – 50 nội dung</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bảo mật SSL: <span class="font-medium">Miễn phí</span></span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Tích hợp chat trực tuyến</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Chuẩn SEO, chuẩn Mobile</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Bảo hành trọn đời</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bàn giao source code</span>
                    </li>
                </ul>
                <a href="#" class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-(--text-color-1) px-4 py-2.5 font-semibold text-white">Chọn gói này</a>
            </div>
            <div class="relative rounded-3xl bg-white p-6 ring-1 ring-gray-300 hover:ring-(--text-color-1) shadow-2xl c-hover">
                <p class="font-semibold text-1 uppercase">BUSINESS</p>
                <div class="mt-3 flex items-baseline gap-2">
                    <span class="h3 font-extrabold">23.900.000</span>
                    <span class="text-base">VNĐ</span>
                </div>
                <p class="mt-1 text-[15px] text-gray-500">Độc quyền thương hiệu</p>
                <ul class="mt-5 space-y-2 text-sm">
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Thiết kế layout Figma theo yêu cầu</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Tặng tên miền .com hoặc .vn</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span><span class="font-medium">Tặng hosting 10Gb</span>, băng thông không giới hạn</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Tặng email doanh nghiệp 30Gb sử dụng 20 user</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Hỗ trợ thiết kế 5 mẫu logo chuyên nghiệp</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Cập nhật 50 – 100 nội dung</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bảo mật SSL: <span class="font-medium">Miễn phí</span></span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Tích hợp chat trực tuyến</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Chuẩn SEO, chuẩn Mobile</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span class="font-medium">Bảo hành trọn đời</span>
                    </li>
                    <li class="flex gap-2 items-baseline group">
                        <svg class="c-hover relative top-1 size-5 shrink-0 mt-1 text-2 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        <span>Bàn giao source code</span>
                    </li>
                </ul>
                <a href="#" class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-(--text-color-1) px-4 py-2.5 font-semibold text-white">Chọn gói này</a>
            </div>
        </div>
    </div>
</section>

<!-- STEPS-->
<section class="section section-steps py-20">
    <div class="u-container">
        <h2 class="font-bold text-center">Quy trình <span class="text-1">thiết kế website</span> giá rẻ</h2>
        <p class="mb-0 text-center mx-auto pt-2 max-w-5xl text-gray-500">Minh bạch từng bước – bạn luôn nắm được tiến độ.</p>
        <p class="mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-4 max-w-5xl">Để hiện thực hóa mọi ý tưởng kinh doanh trực tuyến của khách hàng bằng dịch vụ <b>thiết kế website giá rẻ</b>, chất lượng cao, <b><span class="hover:text-1">HD</span> <span class="hover:text-2">Agency</span></b> luôn tối ưu quy trình cung cấp dịch vụ bài bản, chuyên nghiệp nhất theo từng bước sau:</p>
        <ol class="mt-20 space-y-15">
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="order-2 md:order-1">
                    <span class="inline-flex items-center gap-2 rounded-full bg-cream-50 ring-1 ring-brand-100 px-3 py-1 text-xs font-semibold">Bước 1</span>
                    <h3 class="mt-3 text-xl font-semibold">Khảo sát &amp; xác định mục tiêu</h3>
                    <p class="mt-2 text-gray-600 text-sm">Trao đổi tệp khách hàng, sản phẩm, mục tiêu chuyển đổi; chốt cấu trúc trang.</p>
                </div>
                <div class="order-1 md:order-2 text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="/images/steps/1.webp" alt="Khảo sát">
                </div>
            </li>
        </ol>
    </div>
</section>

<!-- FAQ -->
<?php
$faqs = [
    [
        'question' => 'Thiết kế web giá rẻ chất lượng có được đảm bảo không?',
        'answer'   => '
            <p>Thiết kế website là quá trình tạo ra giao diện và trải nghiệm người dùng cho trang web, bao gồm việc lập kế hoạch, thiết kế đồ họa, và phát triển chức năng.</p>
            <p>Một website được thiết kế tốt sẽ giúp doanh nghiệp tăng uy tín, thu hút khách hàng và cải thiện hiệu quả kinh doanh trong thời đại số hóa.</p>
        ',
    ],
    [
        'question' => 'Thời gian hoàn thành thiết kế website tại HD Agency trong bao lâu?',
        'answer'   => '
            <p>Tuỳ theo yêu cầu và chức năng của website sẽ có thời gian hoàn thiện khác nhau. Trung bình thì website theo mẫu hoặc web yêu cầu thông thường thì hoàn thiện trong khoảng từ 7 – 14 ngày.</p>
        ',
    ],
    [
        'question' => 'HD Agency có hỗ trợ bảo trì website sau khi bàn giao không?',
        'answer'   => '
            <p>Có! HD Agency luôn hỗ trợ bảo trì, cập nhật, và tối ưu website để khách hàng yên tâm vận hành lâu dài.</p>
        ',
    ],
];

if ( ! empty( $faqs ) ) :
?>
<section class="section section-faq py-20">
    <div class="u-container md:!max-w-4xl">
        <h2 class="font-bold text-center">Câu hỏi thường gặp</h2>
        <p class="mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-6">
            Trong quá trình hoạt động, <b><span class="hover:text-1">HD</span> <span class="hover:text-2">Agency</span></b> nhận thấy có một số thắc mắc phổ biến khi khách hàng sử dụng dịch vụ như:
        </p>
        <a class="text-center font-medium text-sm pt-6 relative left-[50%] translate-x-[-50%] inline-flex items-center gap-2 text-1" href="https://zalo.me/0938002776" target="_blank">
            <svg class="w-5 h-5" aria-hidden="true"><use href="#icon-question-circle-outline"></use></svg>
            Đặt câu hỏi của bạn
            <svg class="w-5 h-5" aria-hidden="true"><use href="#icon-arrow-right-outline"></use></svg>
        </a>
        <ul class="accordion accordion-faq mx-auto pt-10" data-accordion data-multi-expand="true" data-allow-all-closed="true">
            <?php foreach ( $faqs as $faq ) :
                $question = trim( $faq['question'] ?? '' );
                $answer   = trim( $faq['answer'] ?? '' );
                if ( ! $question || ! $answer ) {
                    continue;
                }
            ?>
            <li class="accordion-item py-4 px-6 my-3 rounded-md" data-accordion-item>
                <a href="#" class="accordion-title relative p-fs-clamp-[16,18] flex font-bold pr-8" aria-label="<?= esc_attr( $question ) ?>">
                    <?= esc_html( $question ) ?>
                    <svg class="w-6 h-6 minus absolute" aria-hidden="true"><use href="#icon-circle-minus-outline"></use></svg>
                    <svg class="w-6 h-6 plus absolute" aria-hidden="true"><use href="#icon-circle-plus-outline"></use></svg>
                </a>
                <div class="accordion-content text-base pt-5" data-tab-content>
                    <?= wp_kses_post( $answer ) ?>
                </div>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>

    <?= \HD_Helper::faqSchema( $faqs ) ?>

</section>
<?php endif; ?>

<?php

// footer
get_footer( 'affordable-design' );
