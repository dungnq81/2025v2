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

if ( post_password_required() ) {
	echo get_the_password_form();
	get_footer( 'home' );

	return;
}

$ACF = \HD_Helper::getFields( get_the_ID() );
$section_home = ! empty( $ACF['section_home'] ) ? (array) $ACF['section_home'] : [];
if ( ! empty( $section_home ) ) :

?>
<section class="section section-page section-home">
	<div class="content-snapping">
		<?php
		foreach ( $section_home as $section ) :
			$desktop_img = ! empty( $section['desktop_img'] ) ? (int) $section['desktop_img'] : 0;
			$mobile_img = ! empty( $section['mobile_img'] ) ? (int) $section['mobile_img'] : 0;
			$link = ! empty( $section['link'] ) ? (array) $section['link'] : [];
		?>
		<div class="snapping-item">
			<div class="item">
                <div class="cover">
	                <?= \HD_Helper::pictureHTML( 'snapping-img', $desktop_img, $mobile_img ) ?>
	                <?= \HD_Helper::ACFLink( $link, 'link-cover' ) ?>
                </div>
                <div class="overlay-content">
                    <div class="content"></div>
                </div>
            </div>
		</div>
		<?php endforeach; ?>
	</div>
</section>
<?php
endif;

// footer
get_footer( 'home' );
