<?php

\defined( 'ABSPATH' ) || die;

$hints = \HD_Helper::getField( 'search_hints', 'option' );
if ( empty( $hints ) ) {
	return;
}

?>
<div class="frm-hint">
	<p class="hint-title font-medium mt-6 mb-4"><?= __( 'Dịch vụ nổi bật', TEXT_DOMAIN ) ?></p>
	<ul class="hint-list flex flex-col gap-4 ml-3">
        <?php foreach ( $hints as $hint ):
            $title = get_the_title( $hint );
            $url   = get_page_link( $hint );
        ?>
        <li>
            <a class="flex items-center gap-3 text-[14px] group" href="<?= $url ?>" title="<?= esc_attr( $title ) ?>">
                <svg class="w-4 h-4 group-hover:text-1" aria-hidden="true"><use href="#icon-check-circle-solid"></use></svg>
                <?= $title ?>
            </a>
        </li>
        <?php endforeach; ?>
	</ul>
</div>
