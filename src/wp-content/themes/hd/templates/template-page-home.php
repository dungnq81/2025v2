<?php
/**
 * The template for displaying `homepage`
 * Template Name: Home page
 * Template Post Type: page
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'home' );

if ( have_posts() ) {
	the_post();
}

$ACF                   = \HD_Helper::getFields( get_the_ID() );
$home_flexible_content = ! empty( $ACF['home_flexible_content'] ) ? (array) $ACF['home_flexible_content'] : false;
if ( $home_flexible_content ) {
    foreach ( $home_flexible_content as $i => $section ) {
        $section['id'] = $i;
        $acf_fc_layout = ! empty( $section['acf_fc_layout'] ) ? $section['acf_fc_layout'] : '';

        if ( $acf_fc_layout ) {
            \HD_Helper::blockTemplate( 'parts/home/' . str_replace( '_', '-', $acf_fc_layout ), $section );
        }
    }
}

?>
<section class="section section-hero py-24">
    <div class="u-container grid pt-6 lg:gap-12 xl:gap-0 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-3xl font-bold mb-6 p-fs-clamp-[32,56] leading-[1.2]">
                Discover new <span class="text-(--text-color-1)">product</span> and best possibilities
            </h1>
            <p class="max-w-2xl mb-9 p-fs-clamp-[16,18]">
                Streamline your global payment systems from checkout to tax compliance with our all-in-one solution. Save time and reduce complexity.
            </p>
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a href="#" class="inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-white bg-(--text-color-1) rounded-md c-hover hover:shadow-[0px_4px_29px_-9px_#FE5242]">
                    Get started
                    <svg class="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4l-4-4"/></svg>
                </a>
                <a href="#" class="c-light-button inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-white rounded-md c-hover hover:shadow-[0px_4px_29px_-9px_#1D1D1DB2]">
                    <svg class="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></svg>
                    Watch Demo
                </a>
            </div>
            <div class="flex flex-wrap items-center mt-8 gap-3">
                <div class="flex -space-x-2">
                    <img class="w-10 h-10 rounded-full border border-(--text-color-1)" src="https://randomuser.me/api/portraits/women/12.jpg" alt="User">
                    <img class="w-10 h-10 rounded-full border border-(--text-color-1)" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User">
                    <img class="w-10 h-10 rounded-full border border-(--text-color-1)" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User">
                </div>
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1 text-(--text-color-1)" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span class="font-bold">4.9</span>
                    <span class="mx-1">/</span>
                    <span>5.0 from 500+ reviews</span>
                </div>
            </div>
        </div>
        <div class="lg:mt-0 lg:col-span-5 flex relative">
            <img src="https://themedevhub-images.netlify.app/components/images/hero-monitor-computer.png" alt="mockup" class="w-full h-auto max-w-lg mx-auto">
            <div class="absolute bottom-14 left-8 w-32 h-32 bg-white rounded-full mix-blend-soft-light filter blur-xl opacity-30"></div>
            <div class="absolute top-20 right-8 w-32 h-32 bg-white rounded-full mix-blend-soft-light filter blur-xl opacity-30"></div>
        </div>
    </div>
</section>

<section class="section section-recent-posts c-light-bg py-20">
    <div class="u-container">
        <h2 class="font-bold">Recent blog posts</h2>
        <div class="p-news-list mt-9 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            <div class="item flex flex-col items-start gap-4">
                <div class="c-cover rounded-md">
                    <a class="block w-full c-scale-effect" href="#">
                        <img src="https://themedevhub-images.netlify.app/components/images/about-1.jpg" alt="placeholder" class="w-full aspect-3/2 object-cover">
                    </a>
                </div>
                <div class="meta flex flex-wrap items-center gap-2">
                    <a href="#" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium c-light-button hover:text-white">Business</a>
                    <a href="#" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium c-light-button hover:text-white">Business</a>
                </div>
                <a href="#" class="text-(--text-color) hover:text-white">
                    <h3 class="text-balance font-bold p-fs-clamp-[18,22]">Strategies for Effective Business Growth in 2025</h3>
                </a>
                <p class="text-[15px] mb-0">Learn proven strategies to grow your business and stay competitive in the ever-evolving market landscape.</p>
                <a href="#" class="flex items-center text-[14px] mt-2 hover:text-white">
                    Chi tiết
                    <svg class="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4l-4-4"/></svg>
                </a>
            </div>
            <div class="item flex flex-col items-start gap-4">
                <div class="c-cover rounded-md">
                    <a class="block w-full c-scale-effect" href="#">
                        <img src="https://themedevhub-images.netlify.app/components/images/about-1.jpg" alt="placeholder" class="w-full aspect-3/2 object-cover">
                    </a>
                </div>
                <div class="meta">
                    <a href="#" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium c-light-button hover:text-white">Business</a>
                </div>
                <a href="#" class="text-(--text-color) hover:text-white">
                    <h3 class="text-balance font-bold p-fs-clamp-[18,22]">Top Wellness Trends to Improve Your Health in 2025</h3>
                </a>
                <p class="text-[15px] mb-0">Explore the top wellness trends that can help you achieve a healthier and more balanced lifestyle.</p>
                <a href="#" class="flex items-center text-[14px] mt-2 hover:text-white">
                    Chi tiết
                    <svg class="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4l-4-4"/></svg>
                </a>
            </div>
            <div class="item flex flex-col items-start gap-4">
                <div class="c-cover rounded-md">
                    <a class="block w-full c-scale-effect" href="#">
                        <img src="https://themedevhub-images.netlify.app/components/images/about-1.jpg" alt="placeholder" class="w-full aspect-3/2 object-cover">
                    </a>
                </div>
                <div class="meta">
                    <a href="#" class="inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium c-light-button hover:text-white">Business</a>
                </div>
                <a href="#" class="text-(--text-color) hover:text-white">
                    <h3 class="text-balance font-bold p-fs-clamp-[18,22]">Boosting Productivity with Smart Tools and Techniques</h3>
                </a>
                <p class="text-[15px] mb-0">Find out how to enhance your productivity using the latest tools and techniques for better time management.</p>
                <a href="#" class="flex items-center text-[14px] mt-2 hover:text-white">
                    Chi tiết
                    <svg class="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4l-4-4"/></svg>
                </a>
            </div>
        </div>
        <a href="#" class="relative left-[50%] translate-x-[-50%] mt-10 c-light-button inline-flex items-center justify-center px-6 py-3.5 text-[15px] rounded-md c-hover hover:text-white hover:shadow-[0px_4px_29px_-9px_#1D1D1DB2]">Xem thêm</a>
    </div>
</section>
<?php

// footer
get_footer( 'home' );
