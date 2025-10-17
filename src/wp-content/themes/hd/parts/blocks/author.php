<?php

\defined( 'ABSPATH' ) || die;

$author_id = get_the_author_meta( 'ID' );
if ( empty( $author_id ) ) {
    return;
}

$ACF    = \HD_Helper::getFields( 'user_' . $author_id );
$name   = ! empty( $ACF['author_alt_name'] ) ? $ACF['author_alt_name'] : get_the_author_meta( 'display_name', $author_id );
$job    = ! empty( $ACF['author_alt_job'] ) ? $ACF['author_alt_job'] : '';
$slogan = ! empty( $ACF['author_alt_slogan'] ) ? $ACF['author_alt_slogan'] : '';
$avatar = ! empty( $ACF['author_alt_profile_picture'] ) ? $ACF['author_alt_profile_picture'] : 0;
$desc   = ! empty( $ACF['author_alt_biographical_info'] ) ? $ACF['author_alt_biographical_info'] : get_the_author_meta( 'description', $author_id );
$social = ! empty( $ACF['author_alt_social_info'] ) ? $ACF['author_alt_social_info'] : [];

$avatar_url   = ! empty( $avatar ) ? wp_get_attachment_image_url( $avatar, 'medium' ) : get_avatar_url( $author_id );
$social_links = [];
if ( $social ) {
    foreach ( $social as $item ) {
        if ( ! empty( $item['social_url']['url'] ) ) {
            $social_links[] = esc_url( $item['social_url']['url'] );
        }
    }
}

$schema = [
    '@context'         => 'https://schema.org',
    '@type'            => 'Person',
    'name'             => $name,
    'description'      => wp_strip_all_tags( $desc ),
    'image'            => $avatar_url,
    'url'              => get_author_posts_url( $author_id ),
    'mainEntityOfPage' => [
        '@type' => 'WebPage',
        '@id'   => get_permalink(),
    ],
];

if ( $job ) {
    $schema['jobTitle'] = $job;
}

if ( ! empty( $social_links ) ) {
    $schema['sameAs'] = $social_links;
}

$schema_json = wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

?>
<section class="section section-author mt-10 pt-10">
    <div class="flex flex-row gap-6 lg:gap-8 author-meta">
        <div class="w-1/5 author-avatar">
            <span class="aspect-square rounded-xl u-flex-center c-light-button overflow-hidden">
                <?= ! empty( $avatar )
                        ? \HD_Helper::attachmentImageHTML( $avatar, 'medium', [ 'class' => 'object-contain object-center block max-w-full max-h-full !rounded-none' ] )
                        : get_avatar( $author_id )
                ?>
            </span>
        </div>
        <div class="w-4/5 author-info flex flex-col flex-nowrap justify-around">
            <div class="flex flex-col flex-nowrap">
                <?= $name ? '<p class="name h4 font-bold mb-0">' . $name . '</p>' : '' ?>
                <?= $job ? '<p class="job h6 mb-0">' . $job . '</p>' : '' ?>
                <?= $slogan ? '<cite class="slogan mt-4 block text-[15px]">' . $slogan . '</cite>' : '' ?>
                <a class="author-link inline-block text-1 font-medium mt-2 mb-0" href="<?= get_author_posts_url( $author_id ) ?>" aria-label="<?= esc_attr__( 'Danh sách bài viết', TEXT_DOMAIN ) ?>">
                    <?= __( 'Danh sách bài viết', TEXT_DOMAIN ) ?>
                </a>
            </div>
            <?php if ( $social ) : ?>
            <ul class="author-social !list-none !m-0 flex flex-row flex-wrap gap-4 lg:gap-6 !mt-4">
                <?php foreach ( $social as $item ) :
                    $social_name = $item['social_name'] ?? '';
                    $social_url  = $item['social_url'] ?? [];
                ?>
                <li>
                    <?= \HD_Helper::ACFLinkOpen( $social_url, 'flex items-center opacity-[0.7] hover:opacity-[0.9]' ) ?>
                    <?= \HD_Helper::svg( $social_name ) ?>
                    <span class="sr-only"><?= \HD_Helper::mbUcFirst( $social_name ) ?></span>
                    <?= \HD_Helper::ACFLinkClose( $social_url ) ?>
                </li>
                <?php endforeach; ?>
            </ul>
            <?php endif; ?>
        </div>
    </div>
    <div class="author-desc mt-6"><?= $desc ?></div>
    <script type="application/ld+json"><?= $schema_json ?></script>
</section>
