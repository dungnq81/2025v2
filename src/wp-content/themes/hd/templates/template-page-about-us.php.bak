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
get_header( 'about-us' );

if ( have_posts() ) {
	the_post();
}

$ACF = \HD_Helper::getFields( $post->ID );

?>
<section class="section singular section-about-us my-20">
	<div class="u-container">
		<?php \HD_Helper::breadCrumbs() ?>
        <div class="mx-auto flex max-w-3xl flex-col gap-8 pb-20 text-center">
            <h1 class="h2 font-bold md:text-5xl" <?= \HD_Helper::microdata( 'headline' ) ?>>
                <?= ! empty( $ACF['alternative_title'] ) ? $ACF['alternative_title'] : get_the_title() ?>
            </h1>
            <p class="p-fs-clamp-[16,20]">Meet our team, discover our values, and learn how we balance work, life, and everything in between.</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pb-20">
            <img class="h-80 w-full object-cover rounded-xl" loading="lazy" src="https://themedevhub-images.netlify.app/components/images/about-5.webp" alt="placeholder">
            <img class="h-80 w-full object-cover rounded-xl" loading="lazy" src="https://themedevhub-images.netlify.app/components/images/about-2.webp" alt="placeholder">
            <img class="h-80 w-full object-cover rounded-xl" loading="lazy" src="https://themedevhub-images.netlify.app/components/images/about-6.webp" alt="placeholder">
            <img class="h-80 w-full object-cover rounded-xl" loading="lazy" src="https://themedevhub-images.netlify.app/components/images/about-7.webp" alt="placeholder">
            <img class="h-80 w-full object-cover rounded-xl" loading="lazy" src="https://themedevhub-images.netlify.app/components/images/about-3.webp" alt="placeholder">
            <img class="h-80 w-full object-cover rounded-xl" loading="lazy" src="https://themedevhub-images.netlify.app/components/images/about-4.jpg" alt="placeholder">
        </div>
        <div class="flex flex-col gap-6 md:gap-20 py-20">
            <div class="max-w-2xl">
                <h2 class="mb-2.5 text-2xl font-bold md:text-4xl text-balance">We make creating software ridiculously easy</h2>
                <p>We aim to help empower 1,000,000 teams to create their own software. Here is how we plan on doing it.</p>
            </div>
            <div class="grid gap-10 md:grid-cols-3">
                <div class="flex flex-col c-light-button c-hover hover:border-(--text-color-1) rounded-2xl p-8 group">
                    <div class="mb-5 flex items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#2c2c2c] size-24">
                        <svg class="size-12 c-hover group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 7h-3a2 2 0 0 1-2-2V2"></path><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"></path><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"></path></svg>
                    </div>
                    <h3 class="mt-2 mb-4 p-fs-clamp-[20,24] text-balance font-bold">Sáng tạo</h3>
                    <p>We believe there’s no room for big egos and there’s always time to help each other. We strive to give and receive feedback, ideas, perspectives</p>
                </div>
                <div class="flex flex-col c-light-button c-hover hover:border-(--text-color-1) rounded-2xl p-8 group">
                    <div class="mb-5 flex items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#2c2c2c] size-24">
                        <svg class="size-12 c-hover group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="m12 16 4-4-4-4"></path></svg>
                    </div>
                    <h3 class="mt-2 mb-4 p-fs-clamp-[20,24] text-balance font-bold">Sức trẻ</h3>
                    <p>Boldly, bravely and with clear aims. We seek out the big opportunities and double down on the most important things to work on.</p>
                </div>
                <div class="flex flex-col c-light-button c-hover hover:border-(--text-color-1) rounded-2xl p-8 group">
                    <div class="mb-5 flex items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#2c2c2c] size-24">
                        <svg class="size-12 c-hover group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                    <h3 class="mt-2 mb-4 p-fs-clamp-[20,24] text-balance font-bold">Thân thiện</h3>
                    <p>We believe that everyone should be empowered to do whatever they think is in the company's best interests.</p>
                </div>
                <div class="flex flex-col c-light-button c-hover hover:border-(--text-color-1) rounded-2xl p-8 group">
                    <div class="mb-5 flex items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#2c2c2c] size-24">
                        <svg class="size-12 c-hover group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 7h-3a2 2 0 0 1-2-2V2"></path><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"></path><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"></path></svg>
                    </div>
                    <h3 class="mt-2 mb-4 p-fs-clamp-[20,24] text-balance font-bold">Sự chuyên nghiệp</h3>
                    <p>We believe there’s no room for big egos and there’s always time to help each other. We strive to give and receive feedback, ideas, perspectives</p>
                </div>
                <div class="flex flex-col c-light-button c-hover hover:border-(--text-color-1) rounded-2xl p-8 group">
                    <div class="mb-5 flex items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#2c2c2c] size-24">
                        <svg class="size-12 c-hover group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="m12 16 4-4-4-4"></path></svg>
                    </div>
                    <h3 class="mt-2 mb-4 p-fs-clamp-[20,24] text-balance font-bold">Kỷ luật</h3>
                    <p>Boldly, bravely and with clear aims. We seek out the big opportunities and double down on the most important things to work on.</p>
                </div>
                <div class="flex flex-col c-light-button c-hover hover:border-(--text-color-1) rounded-2xl p-8 group">
                    <div class="mb-5 flex items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#2c2c2c] size-24">
                        <svg class="size-12 c-hover group-hover:text-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                    <h3 class="mt-2 mb-4 p-fs-clamp-[20,24] text-balance font-bold">Đam mê</h3>
                    <p>We believe that everyone should be empowered to do whatever they think is in the company's best interests.</p>
                </div>
            </div>
        </div>
        <div class="grid gap-10 md:grid-cols-2 py-20">
            <div>
                <p class="mb-5 text-sm font-medium">JOIN OUR TEAM</p>
                <h2 class="mb-2.5 text-2xl font-bold md:text-4xl text-balance">We're changing how software is made</h2>
                <a href="#" class="mt-8 inline-block cursor-pointer px-8 py-4 rounded-xl text-1 font-medium text-md border-2 border-(--text-color-1) hover:bg-(--text-color-1) hover:text-white" title="">Tham gia ngay</a>
            </div>
            <div>
                <img class="mb-6 max-h-36 w-full rounded-md object-cover" src="https://themedevhub-images.netlify.app/components/images/about-2.webp" alt="placeholder">
                <p>And we're looking for the right people to help us do it. If you're passionate about making change in the world, this might be the place for you</p>
            </div>
        </div>
	</div>
</section>
<?php

// footer
get_footer( 'about-us' );


