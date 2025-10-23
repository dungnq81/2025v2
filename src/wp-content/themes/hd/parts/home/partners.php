<?php

\defined( 'ABSPATH' ) || die;

$acf_fc_layout = $args['acf_fc_layout'] ?? '';
if ( ! $acf_fc_layout ) {
	return;
}

$id       = $args['id'] ?? 0;
$id       = substr( md5( $acf_fc_layout . '-' . $id ), 0, 10 );

?>
<section id="section-<?= $id ?>" class="section section-partners py-10 lg:py-20">
	<div class="u-container">

	</div>
</section>
