<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$title    = ! empty( $args['title'] ) ? $args['title'] : '';
$desc     = ! empty( $args['desc'] ) ? $args['desc'] : '';
$button_1 = ! empty( $args['button_1'] ) ? (array) $args['button_1'] : [];
$button_2 = ! empty( $args['button_2'] ) ? (array) $args['button_2'] : [];
$avatars  = ! empty( $args['avatars'] ) ? (array) $args['avatars'] : [];
$bg       = ! empty( $args['bg'] ) ? (int) $args['bg'] : 0;
$id       = $args['id'] ?? 0;
$id       = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-hero py-24">
	<div class="u-container grid pt-6 lg:gap-12 xl:gap-0 lg:grid-cols-12">
		<div class="mr-auto place-self-center lg:col-span-7">
            <?= $title ? '<h2 class="max-w-3xl font-bold mb-6 p-fs-clamp-[32,56] leading-[1.2]">' . $title . '</h2>' : '' ?>
            <?= $desc ? '<p class="max-w-2xl mb-9 p-fs-clamp-[15,17]">' . $desc . '</p>' : '' ?>

            <?php if ( $button_1 || $button_2 ) :

                $content_1 = \HD_Helper::ACFLinkLabel( $button_1 );
                $content_1 .= '<svg class="w-5 h-5 ml-2 -mr-1" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>';
                $content_2 = '<svg class="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></svg>';
                $content_2 .= \HD_Helper::ACFLinkLabel( $button_2 );

            ?>
			<div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <?= \HD_Helper::ACFLinkWrap(
                        $content_1,
                        $button_1,
                        'inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-white bg-(--text-color-1) rounded-md c-hover hover:shadow-[0px_4px_29px_-9px_#FE5242]',
                ) ?>

                <?= \HD_Helper::ACFLinkWrap(
                        $content_2,
                        $button_2,
                        'c-light-button inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-white rounded-md c-hover hover:shadow-[0px_4px_29px_-9px_#1D1D1DB2]',
                ) ?>

			</div>
            <?php endif; ?>

			<div class="flex flex-wrap items-center mt-8 gap-3">
                <?php if ( $avatars ) : ?>
				<div class="flex -space-x-2">
                    <?php
                    foreach ( $avatars as $i => $avatar ) :
                        echo \HD_Helper::iconImageHTML( $avatar, 'thumbnail', [
                                'class' => 'w-10 h-10 rounded-full border border-(--text-color-1)',
                                'alt' => 'Avatar ' . $i,
                        ] );
                    endforeach;
                    ?>
				</div>
                <?php endif; ?>

				<div class="flex items-center">
					<svg class="w-4 h-4 mr-1 text-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
					<span class="font-bold">4.9</span>
					<span class="mx-1">/</span>
					<span>5.0 from 500+ reviews</span>
				</div>
			</div>
		</div>
        <?php if ( $bg ) : ?>
		<div class="lg:mt-0 lg:col-span-5 flex relative">

            <?= \HD_Helper::attachmentImageHTML( $bg, 'medium', [
                    'class' => 'w-full h-auto max-w-lg mx-auto',
                    'alt' => 'Hero ' . $bg,
            ] ) ?>

			<span class="c-hero-dot-1"></span>
			<span class="c-hero-dot-2"></span>
		</div>
        <?php endif; ?>
	</div>
</section>
