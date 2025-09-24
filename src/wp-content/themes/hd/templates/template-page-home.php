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
<section class="section section-feedback py-24">
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
                <span class="font-medium mb-4 block text-center lg:text-left">Testimonial</span>
                <h2 class="font-bold text-center lg:text-left">
                    23k+ Customers gave their <span class="text-(--text-color-1)">Feedback</span>
                </h2>
                <div class="swiper-controls u-flex-center lg:justify-start gap-10">
                    <button class="swiper-button swiper-button-prev c-swiper-button c-light-button !mt-8 !relative !w-11 !h-11">
                        <svg class="!h-6 !w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4l4 4"/></svg>
                    </button>
                    <button class="swiper-button swiper-button-next c-swiper-button c-light-button !mt-8 !relative !w-11 !h-11">
                        <svg class="!h-6 !w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4l-4-4"/></svg>
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
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
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
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
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
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
                                    <svg class="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" fill="currentColor"></path></svg>
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
<section class="section section-press py-20">
    <div class="u-container closest-swiper">
        <h2 class="font-bold text-center">Báo chí nói gì về <span class="hover:text-(--text-color-1) c-hover">HD</span> <span class="hover:text-(--text-color-2) c-hover">AGENCY</span></h2>
        <p class="max-w-2xl mb-9 p-fs-clamp-[16,18] text-center mx-auto pt-2">HD AGENCY tự hào về những điều đạt được trong thời gian qua</p>
        <div class="swiper-container px-16">
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
            <div class="w-full swiper w-swiper">
                <div class="swiper-wrapper" data-options='<?= $swiper_data ?>'>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="44" src="https://webhd.vn/wp-content/uploads/2025/02/logo-baolongan_3_11zon.png" class="attachment-thumbnail size-thumbnail object-contain w-full h-full" alt="" decoding="async">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="93" src="https://webhd.vn/wp-content/uploads/2025/02/logo-baodongnai_2_11zon.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="55" src="https://webhd.vn/wp-content/uploads/2025/02/logo-baothainguyen_1_11zon.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="82" src="https://webhd.vn/wp-content/uploads/2025/02/bao-quang-ngai_4_11zon-300x82.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-quang-ngai_4_11zon-300x82.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-quang-ngai_4_11zon.png 398w" sizes="(max-width: 300px) 100vw, 300px">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="108" src="https://webhd.vn/wp-content/uploads/2025/02/bao-thai-binh_5_11zon.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="68" src="https://webhd.vn/wp-content/uploads/2025/02/bao-phu-tho_6_11zon-300x68.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-phu-tho_6_11zon-300x68.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-phu-tho_6_11zon.png 750w" sizes="(max-width: 300px) 100vw, 300px">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="78" src="https://webhd.vn/wp-content/uploads/2025/02/bao-ha-giang_7_11zon-300x78.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-ha-giang_7_11zon-300x78.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-ha-giang_7_11zon.png 476w" sizes="(max-width: 300px) 100vw, 300px">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="67" src="https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon-300x67.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon-300x67.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon-768x171.png 768w, https://webhd.vn/wp-content/uploads/2025/02/bao-da-nang_8_11zon.png 900w" sizes="(max-width: 300px) 100vw, 300px">
                        </a>
                    </div>
                    <div class="swiper-slide">
                        <a class="u-flex-center c-hover c-hover h-full p-8 c-light-button rounded-md" rel="nofollow" href="#" title="">
                            <img loading="lazy" width="300" height="71" src="https://webhd.vn/wp-content/uploads/2025/02/bao-dong-khoi_9_11zon-300x71.png" class="attachment-thumbnail size-thumbnail object-contain" alt="" decoding="async" srcset="https://webhd.vn/wp-content/uploads/2025/02/bao-dong-khoi_9_11zon-300x71.png 300w, https://webhd.vn/wp-content/uploads/2025/02/bao-dong-khoi_9_11zon.png 369w" sizes="(max-width: 300px) 100vw, 300px">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<?php

// footer
get_footer( 'home' );
