<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$button_1 = ! empty( $args['button_1'] ) ? (array) $args['button_1'] : [];
$button_2 = ! empty( $args['button_2'] ) ? (array) $args['button_2'] : [];
$avatars  = ! empty( $args['avatars'] ) ? (array) $args['avatars'] : [];
$bg       = ! empty( $args['bg'] ) ? (int) $args['bg'] : 0;
$id       = $args['id'] ?? 0;
$id       = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-hero py-12 lg:py-24">
	<div class="u-container grid pt-6 lg:gap-12 xl:gap-0 lg:grid-cols-12">
		<div class="mr-auto place-self-center lg:col-span-7">
            <h2 class="max-w-3xl font-bold mb-6 p-fs-clamp-[38,58] leading-[1.3]">
                Discover new <span class="text-1">product</span> and best possibilities
            </h2>
            <p class="max-w-2xl mb-9 p-fs-clamp-[15,17]">
                Streamline your global payment systems from checkout to tax compliance with our all-in-one solution. Save time and reduce complexity.
            </p>

            <ul class="flex flex-row flex-wrap mb-8 gap-y-1 gap-x-6">
                <li class="flex items-center group">
                    <svg class="text-2 w-6 h-6" aria-hidden="true"><use href="#icon-check-outline"></use></svg>
                    <span class="ml-2 font-medium text-sm c-hover dark:group-hover:text-white">No credit card required</span>
                </li>
                <li class="flex items-center group">
                    <svg class="text-2 w-6 h-6" aria-hidden="true"><use href="#icon-check-outline"></use></svg>
                    <span class="ml-2 font-medium text-sm c-hover dark:group-hover:text-white">Free 14-day trial</span>
                </li>
                <li class="flex items-center group">
                    <svg class="text-2 w-6 h-6" aria-hidden="true"><use href="#icon-check-outline"></use></svg>
                    <span class="ml-2 font-medium text-sm c-hover dark:group-hover:text-white">Cancel anytime</span>
                </li>
            </ul>

            <?php if ( $button_1 || $button_2 ) :

                $content_1 = \HD_Helper::ACFLinkLabel( $button_1 );
                $content_1 .= '<svg class="w-5 h-5 ml-2 -mr-1" aria-hidden="true"><use href="#icon-arrow-right-outline"></use></svg>';
                $content_2 = '<svg class="w-5 h-5 mr-2 -ml-1" aria-hidden="true"><use href="#icon-globe-outline"></use></svg>';
                $content_2 .= \HD_Helper::ACFLinkLabel( $button_2 );

            ?>
			<div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
				<?= \HD_Helper::ACFLinkWrap(
					$content_1,
					$button_1,
					'inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-white bg-(--text-color-1) rounded-md hover:shadow-[0px_4px_29px_-9px_#FE5242]',
				) ?>

                <?= \HD_Helper::ACFLinkWrap(
	                $content_2,
	                $button_2,
	                'c-light-button inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-(-text-color) dark:text-white rounded-md hover:shadow-[0px_4px_29px_-9px_#1D1D1DB2]',
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
		                    'alt'   => 'Avatar ' . $i,
	                    ] );
                    endforeach;
                    ?>
				</div>
                <?php endif; ?>

				<div class="flex items-center leading-none">
                    <svg class="w-4 h-4 mr-2 text-amber-500 fill-current stroke-none" aria-hidden="true"><use href="#icon-star"></use></svg>
					<span class="font-bold">4.9</span>
					<span class="mx-1">/</span>
					<span>5.0 from 500+ reviews</span>
				</div>
			</div>
		</div>
        <?php if ( $bg ) : ?>
		<div class="mt-6 -mx-3 sm:mx-0 lg:mt-0 lg:col-span-5 flex relative">

			<?= \HD_Helper::attachmentImageHTML( $bg, 'medium', [
				'class' => 'w-full h-auto max-w-lg mx-auto',
				'alt'   => 'Hero ' . $bg,
			] ) ?>

			<span class="c-hero-dot-1"></span>
			<span class="c-hero-dot-2"></span>
		</div>
        <?php endif; ?>
	</div>
</section>
