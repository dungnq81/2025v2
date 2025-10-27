<?php
/**
 * Theme Settings and Configuration
 *
 * This file registers global theme settings, menus, widgets, and customization options.
 * It also defines related hooks and initialization routines to configure
 * the theme’s core behavior and default features.
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// --------------------------------------------------
// Action Menu location
// --------------------------------------------------

add_action( 'after_setup_theme', 'register_nav_menu_callback', 11 );
function register_nav_menu_callback(): void {
	register_nav_menus(
		[
			'main-nav'   => __( 'Primary Menu', TEXT_DOMAIN ),
			'header-nav' => __( 'Header Menu', TEXT_DOMAIN ),
			'mobile-nav' => __( 'Mobile Menu', TEXT_DOMAIN ),
			'policy-nav' => __( 'Term Menu', TEXT_DOMAIN ),
		]
	);
}

// --------------------------------------------------
// Action widgets_init
// --------------------------------------------------

add_action( 'widgets_init', 'register_sidebar_callback' );
function register_sidebar_callback(): void {

	//----------------------------------------------------------
	// Homepage
	//----------------------------------------------------------

//	register_sidebar(
//		[
//			'container'     => false,
//			'id'            => 'home-sidebar',
//			'name'          => __( 'Homepage', TEXT_DOMAIN ),
//			'description'   => __( 'Widgets added here will appear in homepage.', TEXT_DOMAIN ),
//			'before_widget' => '<div class="%2$s">',
//			'after_widget'  => '</div>',
//			'before_title'  => '<span>',
//			'after_title'   => '</span>',
//		]
//	);

	//----------------------------------------------------------
	// Product Attributes
	//----------------------------------------------------------

//	if ( \HD_Helper::isWoocommerceActive() ) {
//		register_sidebar(
//			[
//				'container'     => false,
//				'id'            => 'product-attributes-sidebar',
//				'name'          => __( 'Product Attributes', TEXT_DOMAIN ),
//				'description'   => __( 'Widgets added here will appear in product archives sidebar.', TEXT_DOMAIN ),
//				'before_widget' => '<div class="%2$s">',
//				'after_widget'  => '</div>',
//				'before_title'  => '<span>',
//				'after_title'   => '</span>',
//			]
//		);
//	}

	//----------------------------------------------------------
	// Other...
	//----------------------------------------------------------

	// News sidebar
//	register_sidebar(
//		[
//			'container'     => false,
//			'id'            => 'news-sidebar',
//			'name'          => __( 'News Sidebar', TEXT_DOMAIN ),
//			'description'   => __( 'Widgets added here will appear in news sidebar.', TEXT_DOMAIN ),
//			'before_widget' => '<div class="%2$s">',
//			'after_widget'  => '</div>',
//			'before_title'  => '<span>',
//			'after_title'   => '</span>',
//		]
//	);

	// Page sidebar
//	register_sidebar(
//		[
//			'container'     => false,
//			'id'            => 'page-sidebar',
//			'name'          => __( 'Page Sidebar', TEXT_DOMAIN ),
//			'description'   => __( 'Widgets added here will appear in page sidebar.', TEXT_DOMAIN ),
//			'before_widget' => '<div class="%2$s">',
//			'after_widget'  => '</div>',
//			'before_title'  => '<span>',
//			'after_title'   => '</span>',
//		]
//	);

	// Archive sidebar
//	register_sidebar(
//		[
//			'container'     => false,
//			'id'            => 'archive-sidebar',
//			'name'          => __( 'Archive Sidebar', TEXT_DOMAIN ),
//			'description'   => __( 'Widgets added here will appear in archive sidebar.', TEXT_DOMAIN ),
//			'before_widget' => '<div class="%2$s">',
//			'after_widget'  => '</div>',
//			'before_title'  => '<span>',
//			'after_title'   => '</span>',
//		]
//	);
}

// --------------------------------------------------
// Filter `hd settings`
// --------------------------------------------------

add_filter( 'hd_settings_filter', 'hd_settings_filter_callback', 99, 1 );
function hd_settings_filter_callback( array $arr ): array {
	static $setting_filter_cache = [];

	// Return a cached value if static caching is enabled and the value is already cached
	if ( ! empty( $setting_filter_cache['hd_theme_setting'] ) ) {
		return $setting_filter_cache['hd_theme_setting'];
	}

	$arr_new = [
		//
		// Customize table column information, table display content, etc.
		//
		'admin_list_table'        => [
			// Add ID to the admin category page.
			'term_row_actions'                => [
				'category',
				'post_tag',
				'danh-muc-du-an',
			],

			// Add ID to the admin post-page.
			'post_row_actions'                => [
				'user',
				'post',
				'page',
			],

			// Terms thumbnail (term_thumb).
			'term_thumb_columns'              => [
				'category',
			],

			// Exclude thumb post_type columns.
			'post_type_exclude_thumb_columns' => [
				'page',
			],
		],

		//
		// Custom post-type and taxonomy.
		//
		'post_type_terms'         => [
			'post'  => 'category',
			'du-an' => 'danh-muc-du-an',
		],

		//
		// Custom post-type archive.
		//
		'page_archive_post_types' => [
			'thong-bao',
			'du-an',
		],

		//
		// Aspect Ratio.
		//
		'aspect_ratio'            => [
			'post_type_term'       => [
				'post',
				'thong-bao',
				'du-an',
			],
			'aspect_ratio_default' => [
				'1-1',
				'3-2',
				'4-3',
				'16-9',
			],
		],

		//
		// defer, delay script - default 5s.
		//
		'defer_script'            => [
			// defer.
			'admin-bar'       => 'defer',
			'swv'             => 'defer',
			'contact-form-7'  => 'defer',

			// delay.
			'kk-star-ratings' => 'delay',
			'comment-reply'   => 'delay',
			'wp-embed'        => 'delay',
		],

		//
		// defer style.
		//
		'defer_style'             => [
			'dashicons',
			'admin-bar',
			'contact-form-7',
			'kk-star-ratings',
		],

		//
		// Admin menu sidebar
		//
		'admin_menu'              => [
			// hide admin menu
			'admin_hide_menu'             => [
//				'edit.php',
			],

			// hide admin submenu
			'admin_hide_submenu'          => [
//				'options-general.php' => [
//					'options-discussion.php',
//					'options-privacy.php',
//				]
			],

			// ignore user
			'admin_hide_menu_ignore_user' => [ 1 ],
		],

		//
		// ACF menu
		//
		'acf_menu'                => [
			// ACF attributes in `menu` locations.
			'acf_menu_items_locations' => [
				'main-nav',
				'header-nav',
				'policy-nav',
			],

			// ACF attributes `mega-menu` locations.
			'acf_mega_menu_locations'  => [
				'main-nav',
			],
		],

		//
		// LazyLoad
		//
		'lazyload_exclude'        => [
			'no-lazy',
			'skip-lazy',
		],

		//
		// Custom Email list (mailto).
		//
		'custom_emails'           => [
//			'contact'     => __( 'Contacts', TEXT_DOMAIN ),
		],

		//
		// security
		//
		'security'                => [
			// Allowlist IPs Login Access
			'allowlist_ips_login_access'          => [],

			// Blocked IPs Access
			'blocked_ips_login_access'            => [],

			// IDs of users allowed changing custom-login, OTP settings v.v...
			'privileged_user_ids'                 => [ 1, 2 ],

			// List of admin IDs allowed to show 'hd-addons' plugins.
			'allowed_users_ids_show_plugins'      => [ 1, 2 ],

			// List of admin IDs allowed installing plugins.
			'allowed_users_ids_install_plugins'   => [ 1 ],

			// List of user IDs that are not allowed to be deleted.
			'disallowed_users_ids_delete_account' => [ 1 ],
		],

		//
		// Social Links.
		//
		'social_follows_links'    => [
			'facebook'  => [
				'name'        => __( 'Facebook', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'facebook' ),
				'placeholder' => 'https://www.facebook.com',
				'url'         => '',
			],
			'instagram' => [
				'name'        => __( 'Instagram', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'instagram' ),
				'placeholder' => 'https://www.instagram.com',
				'url'         => '',
			],
			'youtube'   => [
				'name'        => __( 'Youtube', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'youtube' ),
				'placeholder' => 'https://www.youtube.com',
				'url'         => '',
			],
			'x'         => [
				'name'        => __( 'X (Twitter)', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'x' ),
				'placeholder' => 'https://x.com',
				'url'         => '',
			],
			'tiktok'    => [
				'name'        => __( 'Tiktok', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'tiktok' ),
				'placeholder' => 'https://www.tiktok.com',
				'url'         => '',
			],
			'telegram'  => [
				'name'        => __( 'Telegram', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'telegram' ),
				'placeholder' => 'https://t.me',
				'url'         => '',
			],
			'linkedin'  => [
				'name'        => __( 'Linkedin', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'linkedin' ),
				'placeholder' => 'https://www.linkedin.com',
				'url'         => '',
			],
			'github'    => [
				'name'        => __( 'Github', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'github' ),
				'placeholder' => 'https://github.com',
				'url'         => '',
			],
			'zalo'      => [
				'name'        => __( 'Zalo', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'zalo' ),
				'placeholder' => 'https://zalo.me/0123456789',
				'url'         => '',
			],
//			'hotline'   => [
//				'name' => __( 'Hotline', TEXT_DOMAIN ),
//				'icon' => \HD_Helper::svg( 'phone' ),
//				'placeholder' => '0123456789',
//				'url'  => '',
//			],
			'email'     => [
				'name'        => __( 'Email', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'envelope' ),
				'placeholder' => 'mailto:example@gmail.com',
				'url'         => '',
			],
//			'shopee'    => [
//				'name' => __( 'Shopee', TEXT_DOMAIN ),
//				'icon' => \HD_Helper::svg( 'shopee' ),
//				'placeholder' => 'https://shopee.vn',
//				'url'  => '',
//			],
		],

		//
		// Contact Links.
		//
		'contact_links'           => [
			'messenger'    => [
				'name'        => __( 'Messenger', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'messenger' ),
				'value'       => '',
				'placeholder' => 'https://m.me/username',
				'target'      => '_blank',
				'class'       => 'messenger',
			],
			'zalo'         => [
				'name'        => __( 'Zalo', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'zalo' ),
				'value'       => '',
				'placeholder' => 'https://zalo.me/0123456789',
				'target'      => '_blank',
				'class'       => 'zalo',
			],
			'hotline'      => [
				'name'        => __( 'Hotline', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'phone' ),
				'value'       => '',
				'placeholder' => '0123456789',
				'class'       => 'hotline',
			],
			'facebook'     => [
				'name'        => __( 'Facebook', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'facebook' ),
				'value'       => '',
				'placeholder' => 'https://www.facebook.com/username',
				'target'      => '_blank',
				'class'       => 'facebook',
			],
			'tiktok'       => [
				'name'        => __( 'Tiktok', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'tiktok' ),
				'value'       => '',
				'placeholder' => 'https://www.tiktok.com/@username',
				'target'      => '_blank',
				'class'       => 'tiktok',
			],
			'contact_map'  => [
				'name'        => __( 'Bản đồ', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'location' ),
				'value'       => '',
				'placeholder' => 'https://www.google.com/maps/place/...',
				'target'      => '_blank',
				'class'       => 'contact-map',
			],
			'contact_link' => [
				'name'        => __( 'Liên hệ', TEXT_DOMAIN ),
				'icon'        => \HD_Helper::svg( 'contact' ),
				'value'       => '',
				'placeholder' => 'https://example.com/contact',
				'class'       => 'contact-link',
			],
		],
	];

	// --------------------------------------------------

	if ( \HD_Helper::isWoocommerceActive() ) {
		$arr_new['aspect_ratio']['post_type_term'][]                      = 'product';
		$arr_new['aspect_ratio']['post_type_term'][]                      = 'product_cat';
		$arr_new['admin_list_table']['term_row_actions'][]                = 'product_cat';
		$arr_new['admin_list_table']['post_type_exclude_thumb_columns'][] = 'product';
		$arr_new['post_type_terms']['product']                            = 'product_cat';
	}

	if ( \HD_Helper::isCf7Active() ) {
		$arr_new['admin_list_table']['post_type_exclude_thumb_columns'][] = 'wpcf7_contact_form';
	}

	// --------------------------------------------------

	// Merge the new array with the old array, prioritize the value of $arr
	$arr_new = array_merge( $arr, $arr_new );

	// Add to static cache
	$setting_filter_cache['hd_theme_setting'] = $arr_new;

	return $arr_new;
}
