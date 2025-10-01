<?php
/**
 * Displays navigation mobile
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

$txt_logo = \HD_Helper::getOption( 'blogname' );
$img_logo = \HD_Helper::getThemeMod( 'custom_logo' );

if ( ! $img_logo ) :
	$html = sprintf(
		'<a href="%1$s" class="mobile-logo-link" rel="home" aria-label="%2$s">%3$s</a>',
		\HD_Helper::home(),
		\HD_Helper::escAttr( $txt_logo ),
		$txt_logo
	);
else :
	$image = \HD_Helper::iconImageHTML( $img_logo, 'medium' );
	$html  = sprintf(
		'<a href="%1$s" class="mobile-logo-link" rel="home">%2$s</a>',
		\HD_Helper::home(),
		$image
	);
endif;

$position = \HD_Helper::getThemeMod( 'offcanvas_menu_setting' );
if ( ! in_array( $position, [ 'left', 'right', 'top', 'bottom' ], true ) ) {
	$position = 'left';
}

?>
<div class="off-canvas z-12 backface-hidden fixed bg-[#f1f1f1] dark:bg-[#1d1d1d] position-<?= $position ?>" id="offCanvasMenu" data-off-canvas data-content-scroll="false">
	<div class="menu-heading-outer">
		<button class="menu-lines absolute top-4 right-4 block opacity-0 p-0 w-6 h-6" aria-label="Close" type="button" data-close>
			<span class="line line-1 block w-6 h-[2px] rounded-none"></span>
			<span class="line line-2 block w-6 h-[2px] rounded-none mt-[-2px]"></span>
		</button>
		<div class="title-bar-title relative my-5 mx-4 w-[170px] max-w-[70%]"><?php echo $html; ?></div>
	</div>
	<div class="menu-outer">
		<?php
		echo \HD_Helper::doShortcode( 'inline_search', [ 'class' => 'p-4' ] );
		echo \HD_Helper::doShortcode( 'vertical_menu', [ 'extra_class' => 'relative h-full overflow-hidden p-4 gap-4 flex flex-col flex-nowrap', ] );
		?>
	</div>
</div>
