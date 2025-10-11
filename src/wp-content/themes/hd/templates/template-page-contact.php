<?php
/**
 * The template for displaying `contact`
 * Template Name: Trang liên hệ
 * Template Post Type: page
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'contact' );

if ( have_posts() ) {
	the_post();
}

$ACF = \HD_Helper::getFields( $post->ID );

?>
<section class="section singular section-contact my-20">
    <div class="u-container lg:!max-w-7xl">
        <?php \HD_Helper::breadCrumbs() ?>
        <div class="heading flex flex-row flex-wrap justify-between gap-x-3">
            <h1 class="h2 font-bold mb-3 mt-2" <?= \HD_Helper::microdata( 'headline' ) ?>>
                <?= ! empty( $ACF['alternative_title'] ) ? $ACF['alternative_title'] : get_the_title() ?>
            </h1>
            <blockquote class="text-balance text-[15px] font-medium italic">
                <svg class="text-1 mb-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2z" clip-rule="evenodd"/></svg>
                dịch vụ thiết kế website chuyên nghiệp - chuẩn seo – uy tín - giá rẻ.
            </blockquote>
        </div>
        <div class="grid gap-7 lg:grid-cols-3 my-9">
            <div class="iframe-wrap size-full min-h-[480px] max-h-[620px] rounded-md overflow-hidden lg:col-span-2">
                <iframe class="w-full h-full" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1959.5487575184031!2d106.640928!3d10.803843!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752932080a61a7%3A0x693459dc992a9125!2zVGhp4bq_dCBL4bq_IFdlYnNpdGUgQ2h1ecOqbiBOZ2hp4buHcCAtIEhEIEFHRU5DWQ!5e0!3m2!1svi!2sus!4v1759978624395!5m2!1svi!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div class="flex flex-col gap-7 md:flex-row lg:flex-col">
                <div class="bg-muted flex flex-col justify-between gap-6 rounded-xl p-7 md:w-1/2 lg:w-auto">
                    <svg class="mr-auto h-16 w-16" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.2" d="M13.0154 5.25194C12.5522 5.25 12.0639 5.25 11.549 5.25H11.4511C9.25333 5.24999 7.53926 5.24999 6.20359 5.40121C4.84779 5.55471 3.76798 5.87381 2.90814 6.59789C2.02969 7.33764 1.62465 8.29409 1.43329 9.49267C1.24996 10.641 1.24998 12.1045 1.25 13.9345V14.0655C1.24998 15.8954 1.24996 17.359 1.43329 18.5073C1.62465 19.7059 2.02969 20.6624 2.90814 21.4021C3.76798 22.1262 4.84779 22.4453 6.20359 22.5988C7.53925 22.75 9.25331 22.75 11.451 22.75H11.5489C13.7466 22.75 15.4608 22.75 16.7964 22.5988C18.1522 22.4453 19.232 22.1262 20.0919 21.4021C20.9703 20.6624 21.3754 19.7059 21.5667 18.5073C21.75 17.359 21.75 15.8955 21.75 14.0655V13.9345C21.75 12.1045 21.75 10.641 21.5667 9.49267C21.4774 8.93347 21.3416 8.42697 21.133 7.9706C21.0893 7.98927 21.0518 8.00584 21.0203 8.02034C20.9463 8.18097 20.8183 8.49803 20.6336 8.99705L20.3757 9.69407C20.0853 10.4789 19.3369 11 18.5 11C17.6631 11 16.9147 10.4789 16.6243 9.69407L16.3664 8.99705C16.1817 8.49803 16.0537 8.18097 15.9797 8.02034C15.819 7.94635 15.502 7.81828 15.003 7.63363L14.3059 7.3757C13.5211 7.08527 13 6.33688 13 5.5C13 5.4163 13.0052 5.33349 13.0154 5.25194Z" fill="currentColor"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2034 1.73972C19.0945 1.4454 18.8138 1.25 18.5 1.25C18.1862 1.25 17.9055 1.4454 17.7966 1.73972L17.5387 2.43675C17.1767 3.4151 17.0612 3.68091 16.8711 3.87106C16.6809 4.06121 16.4151 4.17667 15.4367 4.53869L14.7397 4.79661C14.4454 4.90552 14.25 5.18617 14.25 5.5C14.25 5.81383 14.4454 6.09448 14.7397 6.20339L15.4367 6.46131C16.4151 6.82333 16.6809 6.93879 16.8711 7.12894C17.0612 7.31909 17.1767 7.5849 17.5387 8.56325L17.7966 9.26028C17.9055 9.5546 18.1862 9.75 18.5 9.75C18.8138 9.75 19.0945 9.5546 19.2034 9.26028L19.4613 8.56325C19.8233 7.5849 19.9388 7.31909 20.1289 7.12894C20.3191 6.93879 20.5849 6.82333 21.5633 6.46131L22.2603 6.20339C22.5546 6.09448 22.75 5.81383 22.75 5.5C22.75 5.18617 22.5546 4.90552 22.2603 4.79661L21.5633 4.53869C20.5849 4.17667 20.3191 4.06121 20.1289 3.87106C19.9388 3.68091 19.8233 3.4151 19.4613 2.43675L19.2034 1.73972ZM11.25 10C11.25 9.58579 11.5858 9.25 12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V10ZM9 11.25C8.58579 11.25 8.25 11.5858 8.25 12V16C8.25 16.4142 8.58579 16.75 9 16.75C9.41421 16.75 9.75 16.4142 9.75 16V12C9.75 11.5858 9.41421 11.25 9 11.25ZM5.25 13C5.25 12.5858 5.58579 12.25 6 12.25C6.41421 12.25 6.75 12.5858 6.75 13V15C6.75 15.4142 6.41421 15.75 6 15.75C5.58579 15.75 5.25 15.4142 5.25 15V13ZM15 11.25C15.4142 11.25 15.75 11.5858 15.75 12V16C15.75 16.4142 15.4142 16.75 15 16.75C14.5858 16.75 14.25 16.4142 14.25 16V12C14.25 11.5858 14.5858 11.25 15 11.25ZM18.75 13C18.75 12.5858 18.4142 12.25 18 12.25C17.5858 12.25 17.25 12.5858 17.25 13V15C17.25 15.4142 17.5858 15.75 18 15.75C18.4142 15.75 18.75 15.4142 18.75 15V13Z" fill="currentColor"/>
                    </svg>
                    <div>
                        <p class="mb-2 text-lg font-bold">Dịch vụ thiết kế website chuyên nghiệp</p>
                        <p class="">Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.</p>
                    </div>
                    <a href="#" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none border shadow-xs h-9 px-4 py-2 mr-auto">
                        Discover more
                    </a>
                </div>
                <img src="https://themedevhub-images.netlify.app/components/images/about-4.jpg" alt="placeholder" class="grow basis-0 rounded-md object-cover md:w-1/2 lg:min-h-0 lg:w-auto">
            </div>
        </div>
        <div class="py-9">
            <h2 class="text-center font-bold h4 pb-5">CÔNG TY TNHH PHÁT TRIỂN CÔNG NGHỆ HD</h2>
            <div class="mt-8 flex flex-wrap justify-center gap-y-3 gap-x-8">
                <div class="flex items-center gap-3">
                    <span class="title font-bold text-1 hover:text-2"><?= __( 'Email:', TEXT_DOMAIN ) ?></span>
                    <span class="p-fs-clamp-[16,18]"><?= \HD_Helper::safeMailTo( 'info@webhd.vn', '', [ 'title' => 'Info' ] ) ?> / <?= \HD_Helper::safeMailTo( 'hieudo.webhd@gmail.com', '', [ 'title' => 'HieuDo' ] ) ?></span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="title font-bold text-1 hover:text-2"><?= __( 'Điện thoại:', TEXT_DOMAIN ) ?></span>
                    <span class="p-fs-clamp-[16,18]"><a href="tel:0938002776" title="0938002776">0938002776</a> / <a href="tel:0899602789" title="0899602789">0899602789</a></span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="title font-bold text-1 hover:text-2"><?= __( 'Văn phòng:', TEXT_DOMAIN ) ?></span>
                    <span class="p-fs-clamp-[16,18]">38A, Lê Văn Huân, Phường Tân Bình, TP. Hồ Chí Minh</span>
                </div>
            </div>
            <div class="mt-8 flex flex-wrap justify-center gap-8">
                <div class="flex items-center gap-3">
                    <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path opacity="0.2" d="M11.9999 2.75C10.1413 2.75 8.3556 2.93356 6.69662 3.27174L6.56934 3.29766C4.67471 3.68329 3.41231 3.94024 2.32445 5.33892C1.24828 6.72258 1.24888 8.3272 1.24981 10.8124V13.1876C1.24888 15.6728 1.24828 17.2774 2.32445 18.6611C3.41231 20.0598 4.67471 20.3167 6.56934 20.7023L6.69662 20.7283C8.3556 21.0664 10.1413 21.25 11.9999 21.25C13.8585 21.25 15.6441 21.0664 17.3031 20.7283L17.4304 20.7023C19.325 20.3167 20.5874 20.0598 21.6753 18.6611C22.7515 17.2774 22.7509 15.6728 22.7499 13.1876V10.8124C22.7509 8.3272 22.7515 6.72258 21.6753 5.33892C20.5874 3.94024 19.325 3.68329 17.4304 3.29766L17.3031 3.27174C15.6441 2.93356 13.8585 2.75 11.9999 2.75Z" fill="currentColor"></path>
                        <path d="M13.213 9.25173C12.4429 8.82163 11.813 8.46986 11.2945 8.25224C10.4515 7.89845 9.55759 7.86983 8.82288 8.47181C8.36304 8.84858 8.20049 9.38806 8.12917 9.93172C7.95674 11.2462 7.95682 12.7544 8.12917 14.0683C8.20049 14.6119 8.36304 15.1514 8.82288 15.5282C9.55759 16.1302 10.4515 16.1015 11.2945 15.7478C11.8131 15.5301 12.4429 15.1784 13.213 14.7483C13.8149 14.4122 14.4334 14.0897 14.9949 13.686C15.4145 13.3843 15.8126 13.0104 15.9444 12.4651C16.0184 12.159 16.0184 11.841 15.9444 11.5349C15.8126 10.9896 15.4145 10.6157 14.9949 10.314C14.4334 9.91029 13.8149 9.58784 13.213 9.25173Z" fill="currentColor"></path>
                    </svg>
                    <span class="font-bold">Youtube</span>
                </div>
                <div class="flex items-center gap-3">
                    <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path opacity="0.2" d="M12.0572 1.75H11.9428C9.75214 1.74999 8.03143 1.74998 6.68802 1.93059C5.31137 2.11568 4.21911 2.50271 3.36091 3.36091C2.50272 4.21911 2.11568 5.31137 1.93059 6.68802C1.74998 8.03144 1.74999 9.75212 1.75 11.9428V12.0572C1.74999 14.2479 1.74998 15.9686 1.93059 17.312C2.11568 18.6886 2.50272 19.7809 3.36091 20.6391C4.21911 21.4973 5.31137 21.8843 6.68802 22.0694C8.03144 22.25 9.7521 22.25 11.9428 22.25H12.0572C14.2479 22.25 15.9686 22.25 17.312 22.0694C18.6886 21.8843 19.7809 21.4973 20.6391 20.6391C21.4973 19.7809 21.8843 18.6886 22.0694 17.312C22.25 15.9686 22.25 14.2479 22.25 12.0572V11.9428C22.25 9.75214 22.25 8.03144 22.0694 6.68802C21.8843 5.31137 21.4973 4.21911 20.6391 3.36091C19.7809 2.50271 18.6886 2.11568 17.312 1.93059C15.9686 1.74998 14.2479 1.74999 12.0572 1.75Z" fill="currentColor"></path>
                        <path d="M17 6.75001L15.9217 6.75C15.0461 6.74993 14.2675 6.74986 13.6389 6.83438C12.9557 6.92624 12.2658 7.13806 11.7019 7.70191C11.138 8.26577 10.9262 8.95567 10.8344 9.63891C10.7499 10.2675 10.7499 11.0461 10.75 11.9217L10.75 12.75H10C9.30964 12.75 8.75 13.3097 8.75 14C8.75 14.6904 9.30964 15.25 10 15.25H10.75V22.2488C11.1312 22.25 11.5286 22.25 11.9428 22.25H12.0572C12.4714 22.25 12.8688 22.25 13.25 22.2488V15.25H15C15.6904 15.25 16.25 14.6904 16.25 14C16.25 13.3097 15.6904 12.75 15 12.75H13.25V12C13.25 11.0219 13.2527 10.414 13.3121 9.97202C13.3657 9.57311 13.4449 9.49432 13.4685 9.47088L13.4697 9.46968L13.4709 9.46847C13.4943 9.44492 13.5731 9.36572 13.972 9.31209C14.414 9.25266 15.0219 9.25001 16 9.25001H17C17.6904 9.25001 18.25 8.69036 18.25 8.00001C18.25 7.30965 17.6904 6.75001 17 6.75001Z" fill="currentColor"></path>
                    </svg>
                    <span class="font-bold">Facebook</span>
                </div>
                <div class="flex items-center gap-3">
                    <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path opacity="0.2" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z" fill="currentColor"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C13.8638 16 15.4299 14.7252 15.874 13H12C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11H17C17.5523 11 18 11.4477 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C13.6566 6 15.1579 6.67267 16.2426 7.75736C16.6332 8.14788 16.6332 8.78105 16.2426 9.17157C15.8521 9.5621 15.219 9.5621 14.8284 9.17157C14.1035 8.44662 13.1048 8 12 8Z" fill="currentColor"></path>
                    </svg>
                    <span class="font-bold">Google</span>
                </div>
                <div class="flex items-center gap-3">
                    <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path opacity="0.2" d="M12.0572 1.75C14.2479 1.74999 15.9686 1.74998 17.312 1.93059C18.6886 2.11568 19.7809 2.50272 20.6391 3.36091C21.4973 4.21911 21.8843 5.31137 22.0694 6.68802C22.25 8.03144 22.25 9.7521 22.25 11.9428V11.9428V12.0572V12.0572C22.25 14.2479 22.25 15.9686 22.0694 17.312C21.8843 18.6886 21.4973 19.7809 20.6391 20.6391C19.7809 21.4973 18.6886 21.8843 17.312 22.0694C15.9686 22.25 14.2479 22.25 12.0572 22.25H12.0572H11.9428H11.9428C9.7521 22.25 8.03144 22.25 6.68802 22.0694C5.31137 21.8843 4.21911 21.4973 3.36091 20.6391C2.50272 19.7809 2.11568 18.6886 1.93059 17.312C1.74998 15.9686 1.74999 14.2479 1.75 12.0572V11.9428C1.74999 9.75212 1.74998 8.03144 1.93059 6.68802C2.11568 5.31137 2.50272 4.21911 3.36091 3.36091C4.21911 2.50272 5.31137 2.11568 6.68802 1.93059C8.03144 1.74998 9.75212 1.74999 11.9428 1.75H12.0572Z" fill="currentColor"></path>
                        <path d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z" fill="currentColor"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5078 6.5C18.5078 7.05228 18.0621 7.5 17.5123 7.5L17.5033 7.5C16.9535 7.5 16.5078 7.05228 16.5078 6.5C16.5078 5.94771 16.9535 5.5 17.5033 5.5L17.5123 5.5C18.0621 5.5 18.5078 5.94772 18.5078 6.5Z" fill="currentColor"></path>
                    </svg>
                    <span class="font-bold">Instagram</span>
                </div>
            </div>
        </div>

        <?= \HD_Helper::doShortcode( 'contact-form-7', [ 'id' => '3b68feb', 'title' => 'Form liên hệ' ] ) ?>

    </div>
</section>
<?php

// footer
get_footer( 'contact' );
