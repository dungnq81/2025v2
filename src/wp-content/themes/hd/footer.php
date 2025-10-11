<?php
/**
 * The template for displaying the footer.
 * Contains the body & HTML closing tags.
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

/**
 * HOOK: hd_site_content_after_action
 */
do_action( 'hd_site_content_after_action' );

?>
</div><!-- #site-content -->
<?php

/**
 * HOOK: hd_footer_before_action
 */
do_action( 'hd_footer_before_action' );

?>
<footer id="footer" class="<?= apply_filters( 'hd_footer_class_filter', 'site-footer' ) ?>" <?= \HD_Helper::microdata( 'footer' ) ?>>
	<?php

	/**
     * HOOK: hd_footer_action
     *
	 * @see Hook::construct_footer_action() - 10
	 */
	do_action( 'hd_footer_action' );

	?>
</footer><!-- #footer -->
<?php

/**
 * HOOK: hd_footer_after_action
 */
do_action( 'hd_footer_after_action' );

/**
 * HOOK: wp_footer
 *
 * @see ContactLink::add_this_contact_link() - 30
 * @see Hook::add_cookie_consent() - 31
 * @see Hook::back_to_top() - 32
 * @see Hook::template_svg() - 33
 * @see Hook::wp_footer_custom_js_action() - 99
 */
wp_footer();

?>
</body>
</html>
