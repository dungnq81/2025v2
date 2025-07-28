document.addEventListener('DOMContentLoaded', () => {
    //
    // in-viewport animations
    //
    let _options = {
        root: null,
        //rootMargin: "100px",
        rootMargin: "-40% 0px -60% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    let _callback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("focused");
            } else {
                entry.target.classList.remove("focused");
            }
        });
    };

    // Create the intersection observer
    let observer_focus = new IntersectionObserver(_callback, _options);

    let _targets = document.querySelectorAll(".content-snapping .snapping-item");
    _targets.forEach((el, index) => {
        observer_focus.observe(el);
    });
});
