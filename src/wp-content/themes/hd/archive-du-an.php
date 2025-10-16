<?php
/**
 * The template for displaying archive dự án.
 * http://codex.wordpress.org/Template_Hierarchy
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'archive-du-an' );

$object = get_queried_object();
$ACF    = \HD_Helper::getFields( $object );

// breadcrumb
$breadcrumb_bg = $ACF['breadcrumb-bg'] ?? 0;
echo \HD_Helper::breadCrumbBanner( $breadcrumb_bg, 'widescreen' );

?>
<section class="section section-du-an archive m-12">
	<div class="u-container">
        <?php \HD_Helper::breadCrumbs() ?>
        <h1 class="h3 font-bold mb-9 mt-2" <?= \HD_Helper::microdata( 'headline' ) ?>>
            <?= ! empty( $ACF['alternative_title'] ) ? $ACF['alternative_title'] : get_the_archive_title() ?>
        </h1>
        <?php if ( have_posts() ) : ?>
        <div class="p-projects-list grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-2">
            <?php
            // Start the Loop.
            $i = 0;

            while ( have_posts() ) : the_post();
                \HD_Helper::blockTemplate( 'parts/du-an/loop', [
                        'title_tag'   => 'h2',
                        'id'          => get_the_ID(),
                        'first_class' => 'first-item lg:col-span-2',
                        'pos'         => $i,
                ] );

                $i++;
                // End the loop.
            endwhile;
            wp_reset_postdata();
            ?>
        </div>
        <?php
            // Previous/next page navigation.
            \HD_Helper::paginateLinks();
        else :
            \HD_Helper::blockTemplate( 'parts/blocks/no-results', [], true );
        endif; ?>
	</div>
</section>
<?php

// footer
get_footer( 'archive-du-an' );
