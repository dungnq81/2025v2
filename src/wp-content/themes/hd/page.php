<?php
/**
 * The Template for displaying all pages.
 * http://codex.wordpress.org/Template_Hierarchy
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'page' );

if ( have_posts() ) {
	the_post();
}

$ACF = \HD_Helper::getFields( $post->ID );

// breadcrumb
$breadcrumb_bg = $ACF['breadcrumb-bg'] ?? 0;
echo \HD_Helper::breadCrumbBanner( $breadcrumb_bg, 'widescreen' );

?>
<section class="section singular section-page my-12">
    <div class="u-container lg:!max-w-6xl">
        <?php \HD_Helper::breadCrumbs() ?>
        <h1 class="h2 font-bold mb-3 mt-2" <?= \HD_Helper::microdata( 'headline' ) ?>><?php the_title(); ?></h1>
        <article class="entry-content" <?= \HD_Helper::microdata( 'article' ) ?>>
            <?php
            echo \HD_Helper::postExcerpt( $post, 'excerpt', 'div', false );

            the_content();

            echo '<div class="entry-extra mt-6 md:mt-8 lg:mt-10 mb-24">';

            \HD_Helper::blockTemplate( 'parts/post/suggestion-posts' );
            \HD_Helper::blockTemplate( 'parts/blocks/experiences' );

            echo '</div>';

            ?>
        </article>
    </div>
</section>
<?php

// footer
get_footer( 'page' );
