<?php

\defined( 'ABSPATH' ) || die;

?>
<div class="experiences single-experiences flex flex-wrap items-center justify-between mt-6 md:mt-8 lg:mt-10">
	<?php

	\HD_Helper::blockTemplate( 'parts/blocks/social-share' );
	echo ( defined( 'KK_STAR_RATINGS' ) && function_exists( 'kk_star_ratings' ) ) ? kk_star_ratings() : '';

	?>
</div>
