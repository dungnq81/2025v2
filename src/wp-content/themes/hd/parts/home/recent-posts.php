<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
    return;
}

$title_tag        = ! empty( $args['title_tag'] ) ? $args['title_tag'] : 'h3';
$title            = ! empty( $args['title'] ) ? $args['title'] : '';
$limit            = ! empty( $args['limit'] ) ? (int) $args['limit'] : 0;
$categories       = ! empty( $args['categories'] ) ? (array) $args['categories'] : [];
$view_more_button = ! empty( $args['view_more_button'] ) ? $args['view_more_button'] : [];
$post_query       = \HD_Helper::queryByTerms( $categories, 'post', 'category', $limit, false );
$loop             = $args['loop'] ?? false;
$pagination       = $args['pagination'] ?? false;
$navigation       = $args['navigation'] ?? false;
$id               = $args['id'] ?? 0;
$id               = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-recent-posts py-20">
    <div class="u-container closest-swiper">
        <?= $title ? '<h2 class="font-bold">' . $title . '</h2>' : '' ?>
        <?php if ( $post_query ) : ?>
        <div class="p-news-list mt-9">
            <div class="swiper-container">
                <?php
                $data = [
                        'autoview' => true,
                        'gap'      => true,
                        'autoplay' => true,
                ];

                if ( $loop ) { $data['loop'] = true; }
                if ( $navigation ) { $data['navigation'] = true; }
                if ( $pagination ) { $data['pagination'] = 'bullets'; }

                $swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
                if ( ! $swiper_data ) {
                    $swiper_data = '';
                }
                ?>
                <div class="swiper w-swiper">
                    <div class="swiper-wrapper" data-options='<?= $swiper_data ?>'>
                        <?php
                        foreach ( $post_query as $post ) :
                            echo '<div class="swiper-slide">';
                            \HD_Helper::blockTemplate( 'parts/post/loop', [ 'title_tag' => $title_tag, 'id' => $post ] );
                            echo '</div>';
                        endforeach;
                        ?>
                    </div>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <?= \HD_Helper::ACFLink(
                $view_more_button,
                'relative left-[50%] translate-x-[-50%] mt-10 c-light-button c-swiper-button inline-flex items-center justify-center px-6 py-3.5 text-[15px] rounded-md c-hover',
        ) ?>
    </div>
</section>
