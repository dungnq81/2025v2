<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
    return;
}

$title_tag        = ! empty( $args['title_tag'] ) ? $args['title_tag'] : 'h2';
$title            = ! empty( $args['title'] ) ? $args['title'] : '';
$limit            = ! empty( $args['limit'] ) ? (int) $args['limit'] : 0;
$categories       = ! empty( $args['categories'] ) ? (array) $args['categories'] : [];
$view_more_button = ! empty( $args['view_more_button'] ) ? $args['view_more_button'] : [];
$post_query       = \HD_Helper::queryByTerms( $categories, 'post', 'category', $limit, false );
$id               = $args['id'] ?? 0;
$id               = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-recent-posts c-light-bg py-20">
    <div class="u-container">
        <?= $title ? '<' . $title_tag . ' class="font-bold">' . $title . '</' . $title_tag . '>' : '' ?>
        <?php if ( $post_query ) : ?>
        <div class="p-news-list mt-9 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            <?php
            foreach ( $post_query as $id ) :
                \HD_Helper::blockTemplate( 'parts/post/loop', [
                        'title_tag' => $title_tag,
                        'id' => $id
                ] );
            endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>
