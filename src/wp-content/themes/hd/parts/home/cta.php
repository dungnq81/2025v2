<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$id = $args['id'] ?? 0;
$id = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-cta bg-(image:--bg-right-gradient-1) py-20">
	<div class="u-container">
		<div class="flex items-center justify-between gap-6">
			<div class="w-full lg:w-1/2 max-w-2xl">
				<h2 class="font-bold text-(--text-color)">Sign up and get 25% account credit bonus on your first invoice</h2>
				<a class="inline-flex mt-6 lg:mt-8 items-center justify-center px-6 py-3 text-[14px] font-medium text-white bg-(--text-color-1) rounded-md hover:shadow-[0px_4px_29px_-9px_#FE5242]" href="#" title="Get started">
					Get started
					<svg class="w-5 h-5 ml-2 -mr-1" aria-hidden="true"><use href="#icon-arrow-right-outline"></use></svg>
				</a>
			</div>
			<div class="w-full lg:w-1/2 max-w-2xl text-center">
				<img class="inline-block" src="https://onidel.com/wp-content/themes/blocksy-child/images/cta-image.png" srcset="https://onidel.com/wp-content/themes/blocksy-child/images/cta-image@2x.png 2x" alt>
			</div>
		</div>
	</div>
</section>
