<?php
/**
 * The template for displaying `about us`
 * Template Name: Trang giới thiệu
 * Template Post Type: page
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'about' );

if ( have_posts() ) {
	the_post();
}

$ACF = \HD_Helper::getFields( $post->ID );

?>
<section class="section singular section-about-us my-20">
    <?php \HD_Helper::breadCrumbs() ?>

    <!-- Hero -->
    <section class="section-hero py-10 lg:py-20">
        <div class="u-container">
            <div class="flex flex-col gap-10 lg:gap-20 lg:flex-row items-center justify-between">
                <div class="lg:w-2/5">
                    <div>
                        <p class="text-1 font-semibold mb-2 p-fs-clamp-[16,20]">Về chúng tôi</p>
                        <h1 class="p-fs-clamp-[38,58] leading-[1.3] font-bold text-2 mb-4">HD AGENCY</h1>
                        <p class="mb-9 p-fs-clamp-[15,17] leading-relaxed lg:leading-[1.8]">
                            Chính thức hoạt động từ tháng 03/2019 với 5 thành viên đầy nhiệt huyết
                            của tuổi trẻ, có hơn 6+ kinh nghiệm trong lĩnh vực Thiết kế Website và
                            Digital Marketing. <span class="font-semibold">HD AGENCY</span>
                            đã bắt đầu hành trình chinh phục “niềm tin” của khách hàng với quyết tâm cao,
                            tâm huyết với nghề và tinh thần dấn thân hết mình.
                        </p>
                    </div>
                    <div class="flex items-center flex-row space-x-8 font-medium">
                        <a href="#" class="flex flex-row items-center gap-4">
                                <span class="flex items-center justify-center bg-(--text-color-1) text-white w-11 h-11 rounded-full hover:shadow-[0px_4px_29px_-9px_#FE5242]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7l7 7-7 7"/></svg>
                                </span>
                            <span class="hover:text-1 font-semibold">KHÁM PHÁ</span>
                        </a>
                        <a href="#" class="hover:text-1 font-semibold">XEM PROFILE</a>
                    </div>
                </div>
                <div class="lg:w-3/5 mt-10 lg:mt-0 flex justify-center">
                    <img width="839" height="459" src="/images/about-us/hero.png" alt="HD Agency Team" class="rounded-3xl shadow-lg max-w-full h-auto"/>
                </div>
            </div>
        </div>
    </section>

    <!-- Statistics -->
    <section class="section-statistics py-10 lg:py-20">
        <div class="u-container">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div class="bg-gradient-to-r from-white dark:from-(--text-dark-color) to-(--text-color-100) rounded-2xl py-6">
                    <h3 class="p-fs-clamp-[40,60] font-extrabold text-white drop-shadow-md drop-shadow-(color:--text-color-1) mb-2">950+</h3>
                    <p class="text-base font-medium text-1">Dự án hoàn thành</p>
                </div>
                <div class="bg-gradient-to-r from-(--text-color-10) to-(--text-color-1) text-white rounded-2xl py-6">
                    <h3 class="p-fs-clamp-[40,60] font-extrabold mb-2">600+</h3>
                    <p class="text-base font-medium">Khách hàng</p>
                </div>
                <div class="bg-gradient-to-l from-(--text-color-10) to-(--text-color-1) text-white rounded-2xl py-6">
                    <h3 class="p-fs-clamp-[40,60] font-extrabold mb-2">08+</h3>
                    <p class="text-base font-medium">Năm kinh nghiệm</p>
                </div>
                <div class="bg-gradient-to-l from-white dark:from-(--text-dark-color) to-(--text-color-100) rounded-2xl py-6">
                    <h3 class="p-fs-clamp-[40,60] font-extrabold text-white drop-shadow-md drop-shadow-(color:--text-color-1) mb-2">15+</h3>
                    <p class="text-base font-medium text-1">Thành viên nhiệt huyết</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Director -->
    <section class="section-director py-10 lg:py-20">
        <div class="u-container">
            <div class="flex flex-col gap-10 lg:gap-20 md:flex-row items-center justify-between">
                <div class="lg:w-5/11">
                    <div class="flex u-flex-center">
                        <img src="/images/about-us/sep_hieu.png" alt="Đỗ Huy Hiếu" class="w-full max-w-lg object-cover rounded-xl" />
                    </div>
                </div>
                <div class="lg:w-6/11">
                    <h2 class="text-2 h3 font-bold uppercase mb-10">GIÁM ĐỐC HD AGENCY</h2>
                    <div class="relative border border-l-[0] border-gray-200 rounded-lg p-6 pl-1 leading-[1.8]">
                        <p class="uppercase text-base font-semibold absolute inline-block pr-3 -top-4 bg-(--bg-color)">Thông điệp</p>
                        <p>
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                            alteration in some form, by injected humour, or randomised words which don’t look even slightly
                            believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t.
                        </p>
                        <p class="mt-3">
                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                            Sections 1.10.32 and 1.10.33 from “de Finibus Bonorum et Malorum” by Cicero are also reproduced
                            in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                        </p>
                    </div>
                    <div class="mt-6">
                        <p class="font-bold h5 mb-0">ĐỖ HUY HIẾU</p>
                        <p class="uppercase tracking-wide">Tổng giám đốc</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- History -->
    <div class="section-history py-10 lg:py-20">
        <div class="u-container">
            <h2 class="text-2 h3 uppercase font-bold text-center">Lịch sử hình thành</h2>
            <p class="max-w-4xl mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-4 pb-8 lg:pb-12">
                CÔNG TY TNHH PHÁT TRIỂN CÔNG NGHỆ HD là thiết kế website hàng đầu Việt Nam, được thành lập tháng 4 năm 2019 với mục tiêu mở rộng thị trường trong hoạt động tư vấn xây dựng.
            </p>
            <div class="swiper-container mt-8">
                <div class="swiper w-swiper">
                    <?php
                    $data = [
	                    'navigation'    => true,
	                    'spaceBetween'  => 12,
	                    'slidesPerView' => 'auto',
	                    'sm'            => [
		                    'spaceBetween' => 24,
	                    ]
                    ];
                    $swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
                    if ( ! $swiper_data ) {
	                    $swiper_data = '';
                    }
                    ?>
                    <div class="swiper-wrapper" data-swiper-options='<?= $swiper_data ?>'>
                        <div class="swiper-slide history-item">
                            <div class="item h-full flex flex-col px-6">
                                <div class="content text-center max-w-lg">
                                    <p class="p-fs-clamp-[40,60] font-bold text-1 mb-0">2019</p>
                                    <p class="p-fs-clamp-[15,17] font-bold mb-3 uppercase">THÀNH LẬP CÔNG TY</p>
                                    <p class="mt-3">HD Agency Việt Nam được thành lập vào nửa cuối năm 2019, là doanh nghiệp 100%.</p>
                                </div>
                                <div class="thumbnail max-w-lg">
                                    <img class="block w-full h-full object-contain rounded-md px-3" src="/images/about-us/timeline-1.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="swiper-slide history-item">
                            <div class="item h-full flex flex-col px-6">
                                <div class="content text-center max-w-lg">
                                    <p class="p-fs-clamp-[40,60] font-bold text-1 mb-0">2020</p>
                                    <p class="p-fs-clamp-[15,17] font-bold mb-3 uppercase">Duy trì sự ổn định</p>
                                    <p class="mt-3">Với đội ngũ nhân sự nhiệt huyết và đầy trách nhiệm, chúng tôi đã đưa công ty vào ổn định.</p>
                                </div>
                                <div class="thumbnail max-w-lg">
                                    <img class="block w-full h-full object-contain rounded-md px-3" src="/images/about-us/timeline-2.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="swiper-slide history-item">
                            <div class="item h-full flex flex-col px-6">
                                <div class="content text-center max-w-lg">
                                    <p class="p-fs-clamp-[40,60] font-bold text-1 mb-0">2021</p>
                                    <p class="p-fs-clamp-[15,17] font-bold mb-3 uppercase">Mở rộng phát triển</p>
                                    <p class="mt-3">Sau thời gian đầu tiên tập trung vào việc duy trì sự ổn định nội bộ, cải tiến quy trình.</p>
                                </div>
                                <div class="thumbnail max-w-lg">
                                    <img class="block w-full h-full object-contain rounded-md px-3" src="/images/about-us/timeline-3.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="swiper-slide history-item">
                            <div class="item h-full flex flex-col px-6">
                                <div class="content text-center max-w-lg">
                                    <p class="p-fs-clamp-[40,60] font-bold text-1 mb-0">2024</p>
                                    <p class="p-fs-clamp-[15,17] font-bold mb-3 uppercase">Mở rộng phát triển</p>
                                    <p class="mt-3">Sau thời gian đầu tiên tập trung vào việc duy trì sự ổn định nội bộ, cải tiến quy trình.</p>
                                </div>
                                <div class="thumbnail max-w-lg">
                                    <img class="block w-full h-full object-contain rounded-md px-3" src="/images/about-us/timeline-3.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Teams -->
    <div class="section-teams py-10 lg:py-20">
        <div class="u-container">
            <div class="ceo one flex flex-col items-center justify-center flex-nowrap lg:flex-wrap gap-6 lg:gap-0 relative py-6 md:py-10">
                <h2 class="h3 text-2 uppercase font-bold mb-0 text-center text-balance sm:absolute max-w-[200px] sm:right-[calc(50%_+_200px)]">Ban điều hành</h2>
                <div class="avatar w-92 aspect-877/1083 relative">
                <span class="cover block overflow-hidden h-full w-full rounded-full">
                    <img class="pointer-events-none h-full w-full block object-cover object-center" width="877" height="1083" src="/images/teams/hieu.png" alt="Đỗ Huy Hiếu" loading="lazy">
                </span>
                </div>
                <div class="name text-center lg:text-left sm:absolute sm:left-[calc(50%_+_200px)]">
                    <h3 class="mb-2 font-bold p-fs-clamp-[20,28] uppercase">Đỗ Huy Hiếu</h3>
                    <cite>Tổng giám đốc</cite>
                </div>
            </div>
            <div class="ceo two flex items-start justify-center flex-nowrap relative gap-10 md:gap-12 lg:gap-48">
                <div class="box left flex flex-col gap-6 relative items-center flex-none w-1/2 md:w-auto py-6 md:py-10">
                    <div class="avatar w-92 aspect-877/1083 relative">
                    <span class="cover block overflow-hidden h-full w-full rounded-full">
                        <img class="pointer-events-none h-full w-full block object-cover object-center" width="889" height="1070"
                             src="/images/teams/huy.png" alt="Trần Quang Huy" loading="lazy">
                    </span>
                    </div>
                    <div class="name text-center">
                        <h3 class="mb-2 font-bold p-fs-clamp-[20,24] uppercase">Trần Quang Huy</h3>
                        <cite>Giám đốc điều hành</cite>
                    </div>
                </div>
                <div class="box right flex flex-col gap-6 relative items-center flex-none w-1/2 md:w-auto py-6 md:py-10">
                    <div class="avatar w-92 aspect-877/1083 relative">
                    <span class="cover block overflow-hidden h-full w-full rounded-full">
                        <img class="pointer-events-none h-full w-full block object-cover object-center" width="985" height="1070"
                             src="/images/teams/trung.png" alt="Nguyễn Thanh Trung" loading="lazy">
                    </span>
                    </div>
                    <div class="name text-center">
                        <h3 class="mb-2 font-bold p-fs-clamp-[20,24] uppercase">Nguyễn Thanh Trung</h3>
                        <cite>Giám đốc điều hành</cite>
                    </div>
                </div>
            </div>
            <div class="manager swiper-container pt-10 lg:pt-20">
                <h2 class="h3 text-center font-medium text-2 mb-6 lg:mb-8">Nhân viên công ty</h2>
                <?php
                $data = [
                    'autoplay'      => true,
                    'loop'          => true,
                    'spaceBetween'  => 12,
                    'slidesPerView' => 2,
                    'navigation'    => true,
                    'pagination'    => 'bullets',
                    'sm'            => [
                        'spaceBetween'  => 24,
                        'slidesPerView' => 4,
                    ],
                    'lg'            => [
                        'spaceBetween'  => 24,
                        'slidesPerView' => 5,
                    ]
                ];

                $swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
                if ( ! $swiper_data ) {
                    $swiper_data = '';
                }

                $items = [
                    [
                        'avatar' => '/images/teams/quan.png',
                        'name'   => 'Nguyễn Hạnh Nguyên',
                        'title'  => 'Nhân viên',
                    ],
                    [
                        'avatar' => '/images/teams/hoan.png',
                        'name'   => 'Nguyễn Hạnh Nguyên',
                        'title'  => 'Nhân viên',
                    ],
                    [
                        'avatar' => '/images/teams/hung.png',
                        'name'   => 'Nguyễn Hạnh Nguyên',
                        'title'  => 'Nhân viên',
                    ],
                    [
                        'avatar' => '/images/teams/huyen.png',
                        'name'   => 'Nguyễn Hạnh Nguyên',
                        'title'  => 'Nhân viên',
                    ],
                    [
                        'avatar' => '/images/teams/quynh.png',
                        'name'   => 'Nguyễn Hạnh Nguyên',
                        'title'  => 'Nhân viên',
                    ],
                    [
                        'avatar' => '/images/teams/hoan.png',
                        'name'   => 'Nguyễn Hạnh Nguyên',
                        'title'  => 'Nhân viên',
                    ],
                ];
                ?>
                <div class="swiper w-swiper">
                    <div class="swiper-wrapper" data-swiper-options='<?= $swiper_data ?>'>
                        <?php foreach ( $items as $item ) : ?>
                            <div class="swiper-slide">
                                <div class="box relative text-center items-center gap-6 flex flex-col">
                                    <div class="avatar w-full relative">
                                <span class="cover block overflow-hidden w-full">
                                    <img class="pointer-events-none aspect-191/326 h-full w-full block object-cover object-top" src="<?= $item['avatar'] ?>" alt="<?= esc_attr( $item['name'] ) ?>" loading="lazy">
                                </span>
                                    </div>
                                    <div class="name text-center">
                                        <h3 class="mb-2 font-bold p-fs-clamp-[16,18] uppercase"><?= $item['name'] ?></h3>
                                        <cite><?= $item['title'] ?></cite>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Partners -->
    <?php \HD_Helper::blockTemplate( 'parts/static/partners', [
        'title' => 'Khách hàng & đối tác',
        'desc'  => '<b>HD Agency</b> lấy uy tín làm nền móng cho những công trình, luôn giữ vững cam kết, đem lại lợi ích cao nhất cho khách hàng, đối tác. <b>HD Agency</b> nỗ lực xây dựng mối quan hệ bền vững với các đối tác và khách hàng.',
    ] ); ?>

</section>
<?php

// footer
get_footer( 'about' );


