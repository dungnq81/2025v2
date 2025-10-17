<?php

\defined( 'ABSPATH' ) || die;

$current_user = wp_get_current_user();
if ( empty( $current_user->ID ) ) {
    return;
}

$ACF    = \HD_Helper::getFields( 'user_' . $current_user->ID );
$name   = ! empty( $ACF['author_alt_name'] ) ? $ACF['author_alt_name'] : $current_user->display_name;
$job    = ! empty( $ACF['author_alt_job'] ) ? $ACF['author_alt_job'] : '';
$slogan = ! empty( $ACF['author_alt_slogan'] ) ? $ACF['author_alt_slogan'] : '';
$avatar = ! empty( $ACF['author_alt_profile_picture'] ) ? $ACF['author_alt_profile_picture'] : 0;
$desc   = ! empty( $ACF['author_alt_biographical_info'] ) ? $ACF['author_alt_biographical_info'] : '';
$social = ! empty( $ACF['author_alt_social_info'] ) ? $ACF['author_alt_social_info'] : [];

?>
<section class="section section-author mt-20">
    <div class="flex flex-row gap-6 lg:gap-8 author-meta">
        <div class="w-1/4 avatar">
            <span class="aspect-square rounded-xl u-flex-center c-light-button overflow-hidden">
                <?= \HD_Helper::attachmentImageHTML( $avatar, 'medium', [ 'class' => 'object-contain object-center block w-full h-full !rounded-none' ] ) ?>
            </span>
        </div>
        <div class="w-3/4 info">
            <?= $name ? '<p class="name">' . $name . '</p>' : '' ?>
            <?= $job ? '<p class="job">' . $job . '</p>' : '' ?>
            <?= $slogan ? '<cite class="slogan">' . $slogan . '</cite>' : '' ?>
            <?php if ( $social ) : ?>
            <ul class="author-social">
                <?php foreach ( $social as $item ) :
                    $social_name = $item['social_name'] ?? '';
                    $social_url  = $item['social_url'] ?? [];
                ?>
                <li>
                    <?= \HD_Helper::ACFLinkOpen( $social_url, 'flex items-center' ) ?>
                    <?= \HD_Helper::svg( $social_name ) ?>
                    <span class="sr-only"><?= \HD_Helper::mbUcFirst( $social_name ) ?></span>
                    <?= \HD_Helper::ACFLinkClose( $social_url ) ?>
                </li>
                <?php endforeach; ?>
            </ul>
            <?php endif; ?>
        </div>
    </div>
    <a class="author-link inline-block" href="<?= get_author_posts_url( $current_user->ID ) ?>" aria-label="<?= esc_attr__( 'Danh sách bài viết', TEXT_DOMAIN ) ?>">
        <?= __( 'Danh sách bài viết', TEXT_DOMAIN ) ?>
    </a>
    <div class="author-desc"><?= $desc ?></div>
</section>
