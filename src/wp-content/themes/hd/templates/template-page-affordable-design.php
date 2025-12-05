<?php
/**
 * The template for displaying `affordable website design`
 * Template Name: Thiết kế website giá rẻ
 * Template Post Type: page
 *
 * @author Gaudev
 */

use HD\Utilities\Helper;

\defined( 'ABSPATH' ) || die;

// header
get_header( 'affordable-design' );

if ( have_posts() ) {
	the_post();
}

?>

<!-- HERO -->
<section class="section section-hero py-12 lg:py-24">
    <div class="u-container flex flex-col gap-10 items-stretch">
        <div class="max-w-5xl mx-auto text-center">
            <p class="inline-flex items-center gap-2 rounded-full bg-cream-50 ring-1 ring-(--text-color-1)/40 bg-(--text-color-1)/8 px-6 py-3 text-xs md:text-base text-(--text-color-1)">
                Thiết kế Website <strong class="font-semibold">"giá rẻ"</strong> – bùng nổ doanh thu
            </p>
            <h1 class="mt-4 font-extrabold">
                Tăng trưởng với <span class="c-text-gradient-2">Website chuẩn chuyển đổi</span>
            </h1>
            <div class="mt-6 p-fs-clamp-[15,17]">
                <p>Tập trung vào mục tiêu <strong>chuyển đổi</strong>, nội dung bán hàng và trải nghiệm người dùng. Gói triển khai nhanh – chi phí hợp lý – bảo hành rõ ràng.</p>
                <p><b>HD Agency</b> ra đời với sứ mệnh mang đến giải pháp <b><i>thiết kế website giá rẻ, chuyên nghiệp</i></b>, giúp mọi khách hàng dễ dàng sở hữu website chất lượng cao mà không cần lo lắng về chi phí.</p>
            </div>

            <?php echo Helper::isKKActive() ? '<div class="mt-6 flex flex-row justify-center">' . kk_star_ratings() . '</div>' : ''; ?>

            <div class="mt-15 u-flex-center flex-col sm:flex-row gap-3 lg:gap-6 text-sm text-gray-600">
                <div class="u-flex-center gap-3">
                    <span class="u-inline-flex-center size-8 rounded-full bg-(--text-color-2)/8 text-2 ring-1 ring-(--text-color-2)/32">
                        <svg class="size-4" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                    </span>
                    <p>Tăng trưởng rõ rệt sau 60–90 ngày nhờ tối ưu nội dung &amp; CTA.</p>
                </div>
                <div class="u-flex-center gap-3">
                    <span class="u-inline-flex-center size-8 rounded-full bg-(--text-color-2)/8 text-2 ring-1 ring-(--text-color-2)/32">
                        <svg class="size-4" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                    </span>
                    <p>Thiết kế responsive, tốc độ nhanh, dễ quản trị.</p>
                </div>
            </div>
            <div class="mt-10 flex flex-col sm:flex-row gap-3 lg:gap-6 justify-center">
                <a title="Nhận tư vấn miễn phí" href="#" class="u-inline-flex-center rounded-md px-6 py-4 font-semibold bg-(--text-color-1) text-white">
                    Nhận tư vấn miễn phí
                </a>
                <a data-fx-scroll data-fx-offset="40" title="Xem bảng giá" href="#section-prices" class="u-inline-flex-center rounded-md px-6 py-4 text-1 ring-1 border-(--text-color-1) font-semibold">
                    Xem bảng giá
                </a>
            </div>
        </div>
        <div class="relative mx-auto w-full max-w-7xl mt-10">
            <div class="rounded-[40px]">
                <img class="h-full w-full object-cover block" height="1409" width="2389" src="<?= WP_HOME ?>/images/affordable/hero-1.webp" alt="Thiết kế web giá rẻ">
            </div>
            <div class="absolute -top-6 -right-6 rounded-md bg-white/95 px-4 py-3 ring-1 ring-gray-200 shadow-lg backdrop-blur">
                <p class="text-xs text-gray-500 mb-2">Minh hoạ</p>
                <p class="font-semibold text-sm">Giao diện đa ngành</p>
            </div>
        </div>
    </div>
</section>

<!-- CORE VALUES -->
<section class="section section-core-values c-text-1-bg py-10 lg:py-20">
    <div class="u-container">
        <h2 class="font-bold h4 text-center"><i class="text-1">Tăng doanh thu 200%</i> với lợi ích từ việc <i class="c-text-gradient-2">thiết kế Website giá rẻ</i></h2>
        <div class="mt-10 flex flex-wrap justify-center gap-6">
            <div class="w-full md:w-[calc((100%-3rem)/3)] rounded-2xl border border-gray-200 dark:border-gray-700 c-hover hover:border-(--text-color-1)/32 bg-(--bg-color) p-6 shadow-xl">
                <div class="u-inline-flex-center size-20 rounded-xl bg-(--text-color-1)/8 ring-1 ring-(--text-color-1)/32">
                    <img class="size-12" width="93" height="94" src="<?= WP_HOME ?>/images/icons/tiet-kiem.webp" alt="Tiết kiệm ngân sách">
                </div>
                <h3 class="h6 mt-6 font-bold">Tiết kiệm ngân sách quảng cáo</h3>
                <div class="mt-2 text-[15px] text-gray-600 dark:text-gray-400">
                    <p>Xây dựng một trang website chính là cách giúp chủ doanh nghiệp quảng bá thương hiệu nhanh chóng, hiệu quả. Tuy nhiên, chi phí thiết kế là một trong những yếu tố mà mọi khách hàng đều quan tâm. Vì đó, dịch vụ <b>thiết kế website giá rẻ</b> ngày càng phổ biến và được sử dụng rộng rãi.</p>
                </div>
            </div>
            <div class="w-full md:w-[calc((100%-3rem)/3)] rounded-2xl border border-gray-200 dark:border-gray-700 c-hover hover:border-(--text-color-1)/32 bg-(--bg-color) p-6 shadow-xl">
                <div class="u-inline-flex-center size-20 rounded-xl bg-(--text-color-1)/8 ring-1 ring-(--text-color-1)/32">
                    <img class="size-12" width="83" height="82" src="<?= WP_HOME ?>/images/icons/hieu-suat.webp" alt="Tăng cường hiệu suất kinh doanh">
                </div>
                <h3 class="h6 mt-6 font-bold">Tăng cường hiệu suất kinh doanh</h3>
                <div class="mt-2 text-[15px] text-gray-600 dark:text-gray-400">
                    <p>Một trang web chuyên nghiệp và tối ưu hóa sẽ giúp nâng cao hiệu suất kinh doanh của doanh nghiệp. Khách hàng sẽ dễ dàng tìm thấy thông tin sản phẩm và dịch vụ, từ đó tăng khả năng tương tác và giao dịch. Điều này có thể dẫn đến tăng doanh số bán hàng và mở rộng cơ hội kinh doanh.</p>
                </div>
            </div>
            <div class="w-full md:w-[calc((100%-3rem)/3)] rounded-2xl border border-gray-200 dark:border-gray-700 c-hover hover:border-(--text-color-1)/32 bg-(--bg-color) p-6 shadow-xl">
                <div class="u-inline-flex-center size-20 rounded-xl bg-(--text-color-1)/8 ring-1 ring-(--text-color-1)/32">
                    <img class="size-12" width="80" height="69" src="<?= WP_HOME ?>/images/icons/nhanh-chong.webp" alt="Nhanh chóng">
                </div>
                <h3 class="h6 mt-6 font-bold">Nhanh chóng sở hữu website</h3>
                <div class="mt-2 text-[15px] text-gray-600 dark:text-gray-400">
                    <p>Với dịch vụ này, quy trình thiết kế web theo yêu cầu giá rẻ thường được tối giản để tiết kiệm thời gian và chi phí. Nhờ vậy, doanh nghiệp có thể nhanh chóng sở hữu website cho riêng mình mà không cần chờ đợi quá lâu.</p>
                </div>
            </div>
            <div class="w-full md:w-[calc((100%-3rem)/3)] rounded-2xl border border-gray-200 dark:border-gray-700 c-hover hover:border-(--text-color-1)/32 bg-(--bg-color) p-6 shadow-xl">
                <div class="u-inline-flex-center size-20 rounded-xl bg-(--text-color-1)/8 ring-1 ring-(--text-color-1)/32">
                    <img class="size-12" width="93" height="90" src="<?= WP_HOME ?>/images/icons/nhu-cau.webp" alt="Nhu cầu cơ bản">
                </div>
                <h3 class="h6 mt-6 font-bold">Phù hợp với nhu cầu cơ bản</h3>
                <div class="mt-2 text-[15px] text-gray-600 dark:text-gray-400">
                    <p>Nếu doanh nghiệp không có nhu cầu cài đặt các tính năng cao cấp, đòi hỏi chi phí lớn, làm website giá rẻ có thể đáp ứng các yêu cầu cơ bản của doanh nghiệp như giới thiệu thông tin, sản phẩm, dịch vụ, liên hệ với khách hàng.</p>
                </div>
            </div>
            <div class="w-full md:w-[calc((100%-3rem)/3)] rounded-2xl border border-gray-200 dark:border-gray-700 c-hover hover:border-(--text-color-1)/32 bg-(--bg-color) p-6 shadow-xl">
                <div class="u-inline-flex-center size-20 rounded-xl bg-(--text-color-1)/8 ring-1 ring-(--text-color-1)/32">
                    <img class="size-12" width="81" height="78" src="<?= WP_HOME ?>/images/icons/de-dang.webp" alt="Dễ dàng quản lý">
                </div>
                <h3 class="h6 mt-6 font-bold">Dễ dàng quản lý website</h3>
                <div class="mt-2 text-[15px] text-gray-600 dark:text-gray-400">
                    <p>Hầu hết các website giá rẻ đều được thiết kế với giao diện dễ sử dụng, giúp doanh nghiệp có thể tự cập nhật nội dung khi cần thiết. Ngoài ra, họ cũng có thể quản lý website một cách dễ dàng mà không cần nhiều kiến thức kỹ thuật chuyên môn.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- DOCS -->
<section class="section section-docs py-10 lg:py-20">
    <div class="u-container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-x-20 items-center max-w-7xl mx-auto">
            <div>
                <h2 class="font-bold">Bộ tài liệu triển khai đầy đủ <span class="c-text-gradient-2">từ giao diện đến nội dung</span></h2>
                <p class="mb-0 p-fs-clamp-[15,17] mt-6 text-gray-600 dark:text-gray-400">
                    Nhận ngay bộ guideline <span class="text-1 font-medium">nội dung/CTA</span>, <span class="text-1 font-medium">checklist SEO onpage</span>, <span class="text-1 font-medium">hướng dẫn quản trị</span> và tài khoản theo dõi chỉ số để bạn vận hành mượt mà.
                </p>
                <ul class="mt-10 space-y-3 md:space-y-4 md:pl-2 text-[15px]">
                    <li class="flex gap-3 items-center group">
                        <span class="u-inline-flex-center size-5 rounded-full bg-(--text-color-2)/8 text-2">
                            <svg class="size-4" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        </span>
                        <span class="font-medium group-hover:text-2">Wireframe theo phễu chuyển đổi</span>
                    </li>
                    <li class="flex gap-3 items-center group">
                        <span class="u-inline-flex-center size-5 rounded-full bg-(--text-color-2)/8 text-2">
                            <svg class="size-4" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        </span>
                        <span class="font-medium group-hover:text-2">Template nội dung/landing</span>
                    </li>
                    <li class="flex gap-3 items-center group">
                        <span class="u-inline-flex-center size-5 rounded-full bg-(--text-color-2)/8 text-2">
                            <svg class="size-4" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        </span>
                        <span class="font-medium group-hover:text-2">Checklist SEO &amp; tốc độ</span>
                    </li>
                    <li class="flex gap-3 items-center group">
                         <span class="u-inline-flex-center size-5 rounded-full bg-(--text-color-2)/8 text-2">
                            <svg class="size-4" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                        </span>
                        <span class="font-medium group-hover:text-2">Hướng dẫn quản trị &amp; đo lường</span>
                    </li>
                </ul>
            </div>
            <div class="relative">
                <div class="grid grid-cols-2 gap-4">
                    <div class="rounded-xl overflow-hidden ring-1 ring-gray-200 shadow-xl">
                        <img src="<?= WP_HOME ?>/images/affordable/photo-1556157382-97eda2d62296.avif" alt="Workshop nội dung" class="w-full h-full object-cover">
                    </div>
                    <div class="rounded-xl overflow-hidden ring-1 ring-gray-200 shadow-xl translate-y-6">
                        <img src="<?= WP_HOME ?>/images/affordable/photo-1519389950473-47ba0277781c.avif" alt="Thiết kế layout" class="w-full h-full object-cover">
                    </div>
                    <div class="rounded-xl overflow-hidden ring-1 ring-gray-200 shadow-xl -translate-y-8">
                        <img src="<?= WP_HOME ?>/images/affordable/photo-1521737604893-d14cc237f11d.avif" alt="Tối ưu SEO" class="w-full h-full object-cover">
                    </div>
                    <div class="rounded-xl overflow-hidden ring-1 ring-gray-200 shadow-xl">
                        <img src="<?= WP_HOME ?>/images/affordable/photo-1522202176988-66273c2fd55f.avif" alt="Đào tạo &amp; bàn giao" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- PRICES -->
<section id="section-prices" class="section section-prices c-light-bg py-10 lg:py-20">
    <div class="u-container">
        <h2 class="font-bold text-center">Bảng giá <span class="c-text-gradient-2">thiết kế website</span> giá rẻ – trọn gói</h2>
        <p class="mb-0 p-fs-clamp-[15,17] text-center mx-auto mt-6 max-w-5xl">
            Bảng giá <b>thiết kế website giá rẻ</b> tại <b><span class="hover:text-1">HD</span> <span class="hover:text-2">Agency</span></b> luôn niêm yết bảng giá, công khai và minh bạch trong từng gói dịch vụ.
            Có hợp đồng rõ ràng, bảo hành và hỗ trợ vận hành.
        </p>
        <div class="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div class="relative rounded-3xl bg-(--bg-color) p-6 ring-1 ring-gray-300 shadow-2xl hover:ring-(--text-color-1) c-hover">
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
            <div class="relative rounded-3xl bg-(--bg-color) p-6 ring-2 ring-(--text-color-1) shadow-2xl md:-translate-y-4 hover:md:-translate-y-5 c-hover">
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
            <div class="relative rounded-3xl bg-(--bg-color) p-6 ring-1 ring-gray-300 shadow-2xl hover:ring-(--text-color-1) c-hover">
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
            <div class="relative rounded-3xl bg-(--bg-color) p-6 ring-1 ring-gray-300 hover:ring-(--text-color-1) shadow-2xl c-hover">
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
<section class="section section-steps py-10 lg:py-20">
    <div class="u-container">
        <h2 class="font-bold text-center">Quy trình <span class="c-text-gradient-2">thiết kế website</span> giá rẻ</h2>
        <p class="mb-0 text-center mx-auto pt-2 max-w-5xl text-gray-500">Minh bạch từng bước – bạn luôn nắm được tiến độ.</p>
        <p class="mb-0 p-fs-clamp-[15,17] text-center mx-auto mt-4 max-w-5xl">Để hiện thực hóa mọi ý tưởng kinh doanh trực tuyến của khách hàng bằng dịch vụ <b>thiết kế website giá rẻ</b>, chất lượng cao, <b><span class="hover:text-1">HD</span> <span class="hover:text-2">Agency</span></b> luôn tối ưu quy trình cung cấp dịch vụ bài bản, chuyên nghiệp nhất theo từng bước sau:</p>
        <ol class="mt-20 space-y-20 max-w-7xl mx-auto">
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="order-2 md:order-1">
                    <span class="inline-flex items-center border border-(--text-color-1) text-1 rounded-full px-6 py-3 text-base font-semibold uppercase">Bước 1.</span>
                    <p class="mt-6 mb-1 h6 text-gray-500 font-normal">Khảo sát &amp; xác định mục tiêu</p>
                    <h3 class="text-1 font-bold h4">Tiếp nhận yêu cầu thiết kế từ khách hàng</h3>
                    <div class="mt-4 text-base leading-[1.7]">
                        <p>Lắng nghe nhu cầu từ khách hàng là bước đầu tiên giúp đội ngũ <b>HD</b> thấu hiểu mong muốn của khách hàng.</p>
                        <p>Tại bước này, chúng tôi có thể xác định được ngành nghề kinh doanh, đối tượng khách hàng mục tiêu và những yêu cầu của khách hàng về website như giao diện, tính năng, nội dung….</p>
                    </div>
                </div>
                <div class="order-1 md:order-2 text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="<?= WP_HOME ?>/images/steps/1.webp" alt="Khảo sát">
                </div>
            </li>
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="<?= WP_HOME ?>/images/steps/2.webp" alt="Wireframe">
                </div>
                <div>
                    <span class="inline-flex items-center border border-(--text-color-1) text-1 rounded-full px-6 py-3 text-base font-semibold uppercase">Bước 2.</span>
                    <p class="mt-6 mb-1 h6 text-gray-500 font-normal">Wireframe &amp; khung nội dung</p>
                    <h3 class="text-1 font-bold h4">Tư vấn và lên ý tưởng khởi tạo website</h3>
                    <div class="mt-4 text-base leading-[1.7]">
                        <p>Tiến hành phân tích và đánh giá các thế mạnh, hạn chế của doanh nghiệp khách hàng so với đối thủ cạnh trạnh trên thị trường, hiểu được xu hướng thiết kế của ngành và phác thảo website sơ bộ.</p>
                        <p>Tại bước này, khách hàng có thể hiểu website được hiển thị theo sơ đồ như thế nào, chứa các trang, chủ đề và nội dung chi tiết gì?</p>
                    </div>
                </div>
            </li>
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="order-2 md:order-1">
                    <span class="inline-flex items-center border border-(--text-color-1) text-1 rounded-full px-6 py-3 text-base font-semibold uppercase">Bước 3.</span>
                    <p class="mt-6 mb-1 h6 text-gray-500 font-normal">Thiết kế UI</p>
                    <h3 class="text-1 font-bold h4">Thiết kế giao diện website</h3>
                    <div class="mt-4 text-base leading-[1.7]">
                        <p>Sau khi thống nhất kế hoạch thiết kế website trọn gói giá rẻ, HD Agency sẽ cung cấp kho giao diện thiết kế có sẵn để khách hàng tham khảo và lựa chọn được giao diện web ưng ý nhất.</p>
                        <p>Ngoài ra, chúng tôi cũng sẵn lòng thiết kế website theo yêu cầu khi khách hàng mong muốn sở hữu giao diện web riêng biệt, độc nhất. Dù khách hàng lựa chọn phương án thiết kế nào, HD Agency đều khẳng định thiết kế tỉ mỉ, trau chuốt từng chi tiết, đảm bảo thể hiện bản sắc thương hiệu và thu hút đối tượng khách hàng mục tiêu của doanh nghiệp.</p>
                    </div>
                </div>
                <div class="order-1 md:order-2 text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="<?= WP_HOME ?>/images/steps/3.webp" alt="Thiết kế UI">
                </div>
            </li>
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="<?= WP_HOME ?>/images/steps/4.webp" alt="Kiểm thử & tối ưu">
                </div>
                <div>
                    <span class="inline-flex items-center border border-(--text-color-1) text-1 rounded-full px-6 py-3 text-base font-semibold uppercase">Bước 4.</span>
                    <p class="mt-6 mb-1 h6 text-gray-500 font-normal">Lập trình, tích hợp, kiểm thử & tối ưu</p>
                    <h3 class="text-1 font-bold h4">Gửi bản thiết kế demo, chỉnh sửa và hoàn thiện</h3>
                    <div class="mt-4 text-base leading-[1.7]">
                        <p>HD sẽ tiến hành gửi bản demo thiết kế website cho khách hàng, tiếp nhận những góp ý và yêu cầu chỉnh sửa cụ thể.</p>
                        <p>Chạy thử toàn bộ tính năng của trang web nhằm xác nhận chúng hoạt động ổn định và không xảy ra lỗi nào. Để khách hàng hoàn toàn tin tưởng sử dụng dịch vụ, chúng tôi cam kết hỗ trợ chỉnh sửa miễn phí cho đến khi khách hàng hoàn toàn hài lòng về bố cục, giao diện và tính năng của website.</p>
                    </div>
                </div>
            </li>
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="order-2 md:order-1">
                    <span class="inline-flex items-center border border-(--text-color-1) text-1 rounded-full px-6 py-3 text-base font-semibold uppercase">Bước 5.</span>
                    <p class="mt-6 mb-1 h6 text-gray-500 font-normal">Cập nhật nội dung</p>
                    <h3 class="text-1 font-bold h4">Hỗ trợ khách hàng cập nhật hoàn thiện website</h3>
                    <div class="mt-4 text-base leading-[1.7]">
                        <p>HD Agency còn miễn phí cập nhật bổ sung các nội dung nhằm giúp khách hàng cung cấp thông tin cơ bản ban đầu như nội dung giới thiệu, hình ảnh, video về doanh nghiệp.</p>
                    </div>
                </div>
                <div class="order-1 md:order-2 text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="<?= WP_HOME ?>/images/steps/5.webp" alt="Cập nhật nội dung">
                </div>
            </li>
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="<?= WP_HOME ?>/images/steps/2.webp" alt="Bàn giao & hướng dẫn sử dụng">
                </div>
                <div>
                    <span class="inline-flex items-center border border-(--text-color-1) text-1 rounded-full px-6 py-3 text-base font-semibold uppercase">Bước 6.</span>
                    <p class="mt-6 mb-1 h6 text-gray-500 font-normal">Bàn giao & hướng dẫn sử dụng</p>
                    <h3 class="text-1 font-bold h4">Hướng dẫn sử dụng và bàn giao cho khách hàng</h3>
                    <div class="mt-4 text-base leading-[1.7]">
                        <p><b>HD Agency</b> sẽ có buổi trao đổi trực tiếp để bàn giao website và hướng dẫn khách hàng sử dụng trang web.</p>
                        <p>Hướng dẫn khách hàng sử dụng hệ thống quản trị nội dung như cách đăng bài viết, đăng hình ảnh, cách cập nhật và chỉnh sửa nội dun.g</p>
                        <p>Đặc biệt, để giúp khách hàng vận hành website dễ dàng hơn, HD Agency cũng cung cấp dịch vụ bảo trị website định kỳ, khắc phục các sự cố kỹ thuật và luôn cập nhật phiên bản website mới nhất.</p>
                    </div>
                </div>
            </li>
            <li class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 items-center">
                <div class="order-2 md:order-1">
                    <span class="inline-flex items-center border border-(--text-color-1) text-1 rounded-full px-6 py-3 text-base font-semibold uppercase">Bước 7.</span>
                    <p class="mt-6 mb-1 h6 text-gray-500 font-normal">Bảo hành & đồng hành</p>
                    <h3 class="text-1 font-bold h4">Tư vấn xây dựng kế hoạch phát triển website hiệu quả</h3>
                    <div class="mt-4 text-base leading-[1.7]">
                        <p>Sửa lỗi kỹ thuật, cập nhật nhỏ miễn phí trong thời hạn bảo hành.</p>
                        <p>Cuối cùng, để giúp khách hàng phát triển website hiệu quả, chúng tôi sẽ tư vấn cho khách hàng các chiến lược marketing online hiệu quả như thiết kế Branding nhận diện thương hiệu, quảng bá bằng phương pháp chạy ads, SEO.</p>
                    </div>
                </div>
                <div class="order-1 md:order-2 text-center">
                    <img class="w-full max-w-[450px] inline-block rounded-[40px] ring-0 ring-gray-600 shadow-2xl" src="<?= WP_HOME ?>/images/steps/3.webp" alt="Bảo hành & đồng hành">
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
<section class="section section-faq py-10 lg:py-20">
    <div class="u-container md:!max-w-4xl">
        <h2 class="font-bold text-center">
            <span class="c-text-gradient-2">Câu hỏi thường gặp</span>
        </h2>
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
