<?php
/**
 * The template for displaying `About`
 * Template Name: About page
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

if ( post_password_required() ) {
	echo get_the_password_form();
	get_footer( 'about-us' );

	return;
}

// breadcrumbs
\HD_Helper::blockTemplate( 'parts/blocks/breadcrumbs', [ 'title' => get_the_title() ] );

$ACF        = \HD_Helper::getFields( get_the_ID() );
$image_list = ! empty( $ACF['image_list'] ) ? $ACF['image_list'] : [];

?>
<section class="section section-about-us singular">
	<div class="container">
        <h1 class="heading-title sr-only" <?= \HD_Helper::microdata( 'headline' ) ?>><?= get_the_title() ?></h1>
        <div class="entry-content"><?php the_content(); ?></div>
		<?php
        foreach ( $image_list as $i => $img ) :
            $re_img = $img['re_img'] ?? '';
            if ( $re_img ) {
                echo \HD_Helper::pictureHTML( 'img-' . $i, $re_img );
            }
        endforeach;
		?>
	</div>
</section>
<?php

// footer
get_footer( 'about-us' );
