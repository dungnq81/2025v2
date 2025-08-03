<?php
/**
 * The loop.php file in WordPress handles displaying post's summaries in lists,
 * such as archives or blog pages v.v...
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

global $post;

$title     = $args['title'] ?? get_the_title( $post->ID );
$title_tag = $args['title_tag'] ?? 'p';
$ratio     = $args['ratio'] ?? \HD_Helper::aspectRatioClass( get_post_type( $post->ID ) );

$thumbnail = \HD_Helper::postImageHTML( $post->ID, 'medium', [ 'alt' => \HD_Helper::escAttr( $title ) ] );
if ( ! $thumbnail ) {
    $thumbnail = \HD_Helper::placeholderSrc();
}

$title = ! empty( $title ) ? $title : __( '(no title)', TEXT_DOMAIN );

// ACF fields
$location = \HD_Helper::getField( 'location', $post->ID );

?>
<div class="item" data-aos="fade">
    <div class="cover">
        <span class="scale res <?= $ratio ?>">
            <?= $thumbnail ?>
            <a class="link-cover" href="<?= get_permalink( $post->ID ) ?>" aria-label="<?= \HD_Helper::escAttr( $title ) ?>"></a>
        </span>
    </div>
    <div class="content">
        <?= '<' . $title_tag . ' class="title"><a href="' . get_permalink( $post->ID ) . '" title="' . \HD_Helper::escAttr( $title ) . '">' . $title . '</a></' . $title_tag . '>' ?>
	    <?= $location ? '<p class="location">' . $location . '</p>' : '' ?>
        <?= \HD_Helper::loopExcerpt( $post ) ?>
    </div>
</div>
