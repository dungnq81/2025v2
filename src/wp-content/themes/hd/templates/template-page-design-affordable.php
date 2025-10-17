<?php
/**
 * The template for displaying `affordable website design`
 * Template Name: Thiết kế website giá rẻ
 * Template Post Type: page
 *
 * @author Gaudev
 */

\defined( 'ABSPATH' ) || die;

// header
get_header( 'design-affordable' );

if ( have_posts() ) {
	the_post();
}

?>

<!-- HERO -->


<!-- FAQ -->
<?php
$faqs = [
    [
        'question' => 'Thiết kế web giá rẻ chất lượng có được đảm bảo không?',
        'answer'   => '
            <p>Thiết kế website là quá trình tạo ra giao diện và trải nghiệm người dùng cho trang web, bao gồm việc lập kế hoạch, thiết kế đồ họa, và phát triển chức năng.</p>
            <p>Một website được thiết kế tốt sẽ giúp doanh nghiệp tăng uy tín, thu hút khách hàng và cải thiện hiệu quả kinh doanh trong thời đại số hóa.</p>
        ',
    ],
    [
        'question' => 'Thời gian hoàn thành thiết kế website tại HD Agency trong bao lâu?',
        'answer'   => '
            <p>Tuỳ theo yêu cầu và chức năng của website sẽ có thời gian hoàn thiện khác nhau. Trung bình thì website theo mẫu hoặc web yêu cầu thông thường thì hoàn thiện trong khoảng từ 7 – 14 ngày.</p>
        ',
    ],
    [
        'question' => 'HD Agency có hỗ trợ bảo trì website sau khi bàn giao không?',
        'answer'   => '
            <p>Có! HD Agency luôn hỗ trợ bảo trì, cập nhật, và tối ưu website để khách hàng yên tâm vận hành lâu dài.</p>
        ',
    ],
];

if ( ! empty( $faqs ) ) :
    $schema_faq = [
        '@context'    => 'https://schema.org',
        '@type'       => 'FAQPage',
        'mainEntity'  => array_map( static function( $faq ) {
            return [
                '@type'          => 'Question',
                'name'           => wp_strip_all_tags( $faq['question'] ),
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => wp_strip_all_tags( $faq['answer'] ),
                ],
            ];
        }, $faqs ),
    ];

    $schema_json = wp_json_encode( $schema_faq, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
?>
<section class="section section-faq py-20">
    <div class="u-container md:!max-w-4xl">
        <h2 class="font-bold text-center">Câu hỏi thường gặp</h2>
        <p class="mb-0 p-fs-clamp-[15,17] text-center mx-auto pt-4 text-balance">
            Trong quá trình hoạt động, <b><span class="text-1">HD</span> <span class="text-2">Agency</span></b> nhận thấy có một số thắc mắc phổ biến khi khách hàng sử dụng dịch vụ như:
        </p>
        <a class="text-center font-medium text-sm pt-6 relative left-[50%] translate-x-[-50%] inline-flex items-center gap-2 text-1" href="https://zalo.me/0938002776" target="_blank">
            <svg class="w-5 h-5" aria-hidden="true"><use href="#icon-question-circle-outline"></use></svg>
            Đặt câu hỏi của bạn
            <svg class="w-5 h-5" aria-hidden="true"><use href="#icon-arrow-right-outline"></use></svg>
        </a>
        <ul class="accordion accordion-faq mx-auto pt-10" data-accordion data-multi-expand="true" data-allow-all-closed="true">
            <?php foreach ( $faqs as $faq ) :
                $question = trim( $faq['question'] ?? '' );
                $answer   = trim( $faq['answer'] ?? '' );
                if ( ! $question || ! $answer ) {
                    continue;
                }
            ?>
            <li class="accordion-item py-4 px-6 my-3 rounded-md" data-accordion-item>
                <a href="#" class="accordion-title relative p-fs-clamp-[16,18] flex font-bold pr-8" aria-label="<?= esc_attr( $question ) ?>">
                    <?= esc_html( $question ) ?>
                    <svg class="w-6 h-6 minus absolute" aria-hidden="true"><use href="#icon-circle-minus-outline"></use></svg>
                    <svg class="w-6 h-6 plus absolute" aria-hidden="true"><use href="#icon-circle-plus-outline"></use></svg>
                </a>
                <div class="accordion-content text-base pt-5" data-tab-content>
                    <?= wp_kses_post( $answer ) ?>
                </div>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <script type="application/ld+json"><?= $schema_json ?></script>
</section>
<?php endif; ?>

<?php

// footer
get_footer( 'design-affordable' );
