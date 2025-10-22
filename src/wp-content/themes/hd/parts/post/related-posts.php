<?php

\defined( 'ABSPATH' ) || die;

$title     = $args['title'] ?? '';
$title_tag = $args['title_tag'] ?? 'p';
$post_id   = $args['id'] ?? 0;
$taxonomy  = $args['taxonomy'] ?? 'category';
$max       = $args['max'] ?? 6;
$rows      = $args['rows'] ?? 1;
$query     = \HD_Helper::queryByRelated( $post_id, $taxonomy, $max, false );

if ( ! $query ) {
    return;
}

?>
<section class="section section-related section-related-post archive">
    <div class="u-container closest-swiper">
        <?php echo $title ? '<' . $title_tag . ' class="h3 font-bold">' . $title . '</' . $title_tag . '>' : ''; ?>
        <div class="p-news-list mt-9">
            <div class="swiper-container">
                <?php
                $data = [
                        'slidesPerView' => 1,
                        'spaceBetween'  => 12,
                        'autoplay'      => true,
                        'rows'          => $rows,
                        'sm'            => [
                                'slidesPerView' => 2,
                                'spaceBetween'  => 24,
                        ],
                        'lg'            => [
                                'slidesPerView' => 3,
                                'spaceBetween'  => 24,
                        ],
                        'pagination'    => 'bullets'
                ];

                $swiper_data = wp_json_encode( $data, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE );
                if ( ! $swiper_data ) {
                    $swiper_data = '';
                }
                ?>
                <div class="swiper w-swiper">
                    <div class="swiper-wrapper" data-swiper-options='<?= $swiper_data ?>'>
                        <?php
                        foreach ( $query as $post ) :
                            echo '<div class="swiper-slide">';
                            \HD_Helper::blockTemplate( 'parts/post/loop', [ 'title_tag' => $title_tag, 'id' => $post ] );
                            echo '</div>';
                        endforeach;
                        wp_reset_postdata();
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
