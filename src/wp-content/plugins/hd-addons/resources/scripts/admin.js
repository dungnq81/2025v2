jQuery(function ($) {
    $(document).on('click', '.notice-dismiss', function (e) {
        $(this).closest('.notice.is-dismissible')?.fadeOutAndRemove(500);
    });

    //---------------------------------------------

    $.fn.fadeOutAndRemove = function (speed) {
        return this.fadeOut(speed, function () {
            $(this).remove();
        });
    };
});
