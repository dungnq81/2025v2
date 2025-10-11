<?php

\defined( 'ABSPATH' ) || die;

$id        = $args['id'] ?? 0;
$title     = $args['title'] ?? get_the_title( $id );
$title_tag = $args['title_tag'] ?? 'p';
$ratio     = $args['ratio'] ?? \HD_Helper::aspectRatioClass( get_post_type( $id ) );

$class     = 'block w-full object-cover ' . $ratio;
$thumbnail = \HD_Helper::postImageHTML( $id, 'medium', [
        'alt'   => \HD_Helper::escAttr( $title ),
        'class' => $class,
] );

$title = ! empty( $title ) ? $title : __( '(no title)', TEXT_DOMAIN );
if ( ! $thumbnail ) {
    $thumbnail = \HD_Helper::placeholderSrc( $class );
}

$trai_nghiem = \HD_Helper::getField( 'trai-nghiem', $id );

?>
<div class="item flex flex-col items-start gap-4">
	<div class="p-thumb c-cover rounded-md">
        <span class="block w-full">
            <?= $thumbnail ?>
        </span>
		<div class="p-link u-flex-center flex-wrap w-full gap-4 lg:gap-6">
            <?= \HD_Helper::getPrimaryTerm(
                    $id,
                    'danh-muc-du-an',
                    'flex items-center flex-row-reverse gap-3 uppercase',
                    '<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/></svg>',
                    null,
                    null
            ) ?>

            <?= \HD_Helper::ACFLink(
                    $trai_nghiem,
                    'flex items-center flex-row-reverse gap-3 uppercase',
                    null,
                    '<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87c1.07 1.413 2.075 1.228 3.192 2.644c1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58c1.402.693 2.918.351 2.918 2.334c0 .276 0 2.008 1.972 2.008c2.026.031 2.026-1.678 2.026-2.008c0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"/></svg>'
            ) ?>
		</div>
	</div>
	<a class="text-(--text-color) hover:text-[#000] dark:hover:text-white" href="<?= get_permalink( $id ) ?>" title="<?= \HD_Helper::escAttr( $title ) ?>">
		<?= '<' . $title_tag . ' class="text-balance font-bold p-fs-clamp-[18,22]">' . $title . '</' . $title_tag . '>' ?>
	</a>
    <?= \HD_Helper::loopExcerpt( $id, 'text-[15px] mb-4 line-clamp-2' ) ?>
</div>
