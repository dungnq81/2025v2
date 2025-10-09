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

<?php

// footer
get_footer( 'about-us' );


