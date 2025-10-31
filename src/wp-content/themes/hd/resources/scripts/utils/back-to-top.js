// utils/back-to-top.js

class BackToTop {
    constructor(selector = '.js-back-to-top', smoothScrollEnabled = true, defaultScrollSpeed = 400) {
        this.buttonSelector = selector;
        this.smoothScrollEnabled = smoothScrollEnabled;
        this.defaultScrollSpeed = defaultScrollSpeed;
        this._scrollTicking = false;
        this.init();
    }

    init() {
        if (!document.querySelector || !window.addEventListener) return;

        this.goTopBtn = document.querySelector(this.buttonSelector);
        if (!this.goTopBtn) return;

        this.scrollThreshold = parseInt(this.goTopBtn.dataset.scrollStart, 10) || 300;
        window.addEventListener('scroll', this.trackScroll.bind(this));
        this.goTopBtn.addEventListener('click', this.scrollToTop.bind(this), false);
    }

    trackScroll() {
        if (this._scrollTicking) return;
        this._scrollTicking = true;
        requestAnimationFrame(() => {
            const show = window.scrollY > this.scrollThreshold;
            this.goTopBtn.classList.toggle('back-to-top__show', show);
            this.goTopBtn.dataset.show = show ? 'true' : 'false';
            this._scrollTicking = false;
        });
    }

    scrollToTop(event) {
        event.preventDefault();
        if (this.smoothScrollEnabled) {
            const duration = parseInt(this.goTopBtn.dataset.scrollSpeed, 10) || this.defaultScrollSpeed;
            this.smoothScroll(duration);
        } else {
            window.scrollTo({top: 0});
        }
    }

    smoothScroll(duration) {
        const start = window.scrollY;
        const distance = -start;
        let startTime = null;
        const animate = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const pos = this.easeInOutQuad(elapsed, start, distance, duration);
            window.scrollTo(0, pos);
            if (elapsed < duration) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        return t < 1 ? (c / 2) * t * t + b : (-c / 2) * (--t * (t - 2) - 1) + b;
    }
}

export default BackToTop;
