<?php
/**
 * The loop.php file in WordPress handles displaying post's summaries in lists,
 * such as archives or blog pages v.v...
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

$id          = $args['id'] ?? 0;
$title       = $args['title'] ?? get_the_title( $id );
$title       = ! empty( $title ) ? $title : __( '(no title)', TEXT_DOMAIN );
$title_tag   = $args['title_tag'] ?? 'p';
$ratio       = $args['ratio'] ?? \HD_Helper::aspectRatioClass( get_post_type( $id ) );
$first_class = ! empty( $args['first_class'] ) ? ' ' . $args['first_class'] : '';
$pos         = $args['pos'] ?? 0;

$class       = 'w-full object-cover ' . $ratio;
$thumbnail   = \HD_Helper::postImageHTML( $id, $pos === 0 ? 'large' : 'medium', [ 'alt'   => \HD_Helper::escAttr( $title ), 'class' => $class ] );
if ( ! $thumbnail ) {
    $thumbnail = \HD_Helper::placeholderSrc( $class );
}

?>
<div class="item flex flex-col gap-4<?= $pos === 0 ? $first_class : '' ?>">
    <div class="c-cover rounded-md">
        <a class="block w-full c-scale-effect" href="<?= get_permalink( $id ) ?>" aria-label="<?= \HD_Helper::escAttr( $title ) ?>">
            <?= $thumbnail ?>
        </a>
    </div>
    <div class="c-content flex flex-col gap-3">
        <div class="c-terms flex flex-wrap items-center gap-2">
            <?= \HD_Helper::getPrimaryTerm(
                    $id,
                    'category',
                    'inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium c-light-button c-swiper-button',
                    null,
                    null,
                    null
            ) ?>
            <span class="!hidden"><?= \HD_Helper::humanizeTime( $id ) ?></span>
        </div>

        <?= '<a class="block" href="' . get_permalink( $id ) . '" title="' . \HD_Helper::escAttr( $title ) . '"><' . $title_tag . ' class="text-balance font-bold p-fs-clamp-[18,22]">' . $title . '</' . $title_tag . '></a>' ?>
        <?= \HD_Helper::loopExcerpt( $id, 'text-[15px] mb-0 line-clamp-2' ) ?>

        <a href="<?= get_permalink( $id ) ?>" class="view-more flex items-center text-[14px] mt-2 hover:text-1" title="<?= esc_attr__( 'Xem chi tiết', TEXT_DOMAIN ) ?>">
            <?= __( 'Chi tiết', TEXT_DOMAIN ) ?>
            <svg class="w-5 h-5 ml-2" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
        </a>
    </div>
</div>
