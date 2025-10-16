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
	</div>
</section>
<?php

// footer
get_footer( 'about-us' );


