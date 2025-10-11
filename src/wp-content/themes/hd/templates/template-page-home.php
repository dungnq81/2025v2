<?php
/**
 * The template for displaying `homepage`
 * Template Name: Trang chủ
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

// footer
get_footer( 'home' );
