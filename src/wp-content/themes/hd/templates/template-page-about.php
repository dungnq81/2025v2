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
                            <img class="pointer-events-none h-full w-full block object-cover object-center" width="889" height="1070" src="/images/teams/huy.png" alt="Trần Quang Huy" loading="lazy">
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
                            <img class="pointer-events-none h-full w-full block object-cover object-center" width="985" height="1070" src="/images/teams/trung.png" alt="Nguyễn Thanh Trung" loading="lazy">
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


