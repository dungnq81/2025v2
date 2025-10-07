<?php
/**
 * The Template for displaying all single posts.
 * http://codex.wordpress.org/Template_Hierarchy
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'single' );

if ( have_posts() ) {
	the_post();
}

$ACF = \HD_Helper::getFields( $post->ID );

// breadcrumb
$breadcrumb_bg = $ACF['breadcrumb-bg'] ?? 0;
echo \HD_Helper::breadCrumbBanner( $breadcrumb_bg, 'widescreen' );

?>
<section class="section singular section-post m-20">
	<div class="u-container xl:!max-w-7xl">
		<?php \HD_Helper::breadCrumbs() ?>
		<h1 class="h2 font-bold mb-3 mt-2" <?= \HD_Helper::microdata( 'headline' ) ?>><?php the_title(); ?></h1>
        <div class="meta flex items-center gap-6 text-sm mb-9">
            <?php echo \HD_Helper::getPrimaryTerm( $post ); ?>
            <div class="flex items-center gap-2" <?= \HD_Helper::microdata( 'date-published' ) ?>>
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3M3.223 14A9 9 0 1 0 12 3a9 9 0 0 0-8.294 5.5M7 9H3V5"/></svg>
                <span class="date"><?= \HD_Helper::humanizeTime( $post->ID ) ?></span>
            </div>
            <?php
            $views = get_post_meta( $post->ID, '_post_views', true );
            $views = $views ? (int) $views : 1;
            ?>
            <div class="flex items-center gap-2">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6s4.03-6 9-6s9 4.8 9 6Z"/><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"/></g></svg>
                <span class="views"><?= number_format_i18n( $views ) ?></span>
            </div>
        </div>
        <article class="entry-content" <?= \HD_Helper::microdata( 'article' ) ?>>
            <?php
            echo \HD_Helper::postExcerpt( $post, 'excerpt', 'div', false );

            the_content();
            \HD_Helper::blockTemplate( 'parts/post/suggestion-posts', [], false );

            ?>
        </article>
        <?php
        \HD_Helper::hashTags();
        \HD_Helper::blockTemplate( 'parts/blocks/author', [], false );

        // If comments are open, or we have at least one comment, load up the comment template.
        comments_template();
        ?>
	</div>
</section>
<?php

\HD_Helper::blockTemplate( 'parts/post/related-posts', [
        'title'     => __( 'Bài viết liên quan', TEXT_DOMAIN ),
        'title_tag' => 'h2',
        'id'        => $post->ID,
        'max'       => 12,
        'rows'      => 1,
        'taxonomy'  => 'category',
], false );

// footer
get_footer( 'single' );
