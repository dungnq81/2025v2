// components/swiper.js

import { nanoid } from 'nanoid';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Grid } from 'swiper/modules';

const defaultModules = [ Navigation, Pagination, Autoplay, Grid ];

// Default Swiper options
const defaultOptions = {
    grabCursor: true,
    allowTouchMove: true,
    threshold: 5,
    wrapperClass: 'swiper-wrapper',
    slideClass: 'swiper-slide',
    slideActiveClass: 'swiper-slide-active',
};

// Generate unique class names
const generateClasses = () => {
    const id = nanoid(8);
    return {
        id,
        swiper: `swiper-${id}`,
        next: `swiper-next-${id}`,
        prev: `swiper-prev-${id}`,
        pagination: `swiper-pagination-${id}`,
        scrollbar: `swiper-scrollbar-${id}`,
    };
};

// Parse options safely
const parseOptions = (el) => {
    const json = el?.querySelector('.swiper-wrapper')?.dataset?.swiperOptions;
    if (!json) return {};
    try {
        return JSON.parse(json);
    } catch (e) {
        console.warn('Invalid Swiper JSON on element', el, e);
        return {};
    }
};

// controls
const getSwiperControls = (el) => {
    const wrapper = el.closest('.closest-swiper') || el.parentElement;
    const existing = wrapper?.querySelector('.swiper-controls');
    if (existing) return existing;

    const div = document.createElement('div');
    div.className = 'swiper-controls';
    el.after(div);
    return div;
};

// Utility to get breakpoints from options
const getBreakpoints = (options = {}) => {
    if (options.breakpoints) return options.breakpoints;

    const bp = {};
    const map = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 };
    Object.entries(map).forEach(([ key, val ]) => {
        if (options[key]) bp[val] = options[key];
    });
    return bp;
};

// Initialize Swiper instances
const initSwiper = (el) => {
    if (!el) return;
    if (el.__swiper_inited) return;
    el.__swiper_inited = true;

    const classes = generateClasses();
    el.classList.add(classes.swiper);

    const swiperOptions = {
        modules: defaultModules,
        ...defaultOptions,
    };

    const options = parseOptions(el);
    if (!options || Object.keys(options).length === 0) {
        console.warn('Skipped swiper:', el, '(no valid options)');
        return;
    }

    // Base settings
    Object.assign(swiperOptions, {
        spaceBetween: parseInt(options.spaceBetween) || 0,
        slidesPerView: options.slidesPerView === 'auto' ? 'auto' : parseInt(options.slidesPerView) || 1,
        speed: parseInt(options.speed) || 600,
        direction: options.direction || 'horizontal',
        loop: !!options.loop,
        autoHeight: !!options.autoHeight,
        freeMode: !!options.freeMode,
        cssMode: !!options.cssMode,
        breakpoints: getBreakpoints(options),
    });

    // effect (custom)
    if (options.effect) {
        swiperOptions.effect = options.effect;
        if (swiperOptions.effect === 'fade') {
            swiperOptions.fadeEffect = { crossFade: !0 };
        }
    }

    // observer (custom)
    if (options.observer) {
        swiperOptions.observer = true;
        swiperOptions.observeParents = true;
    }

    // centered (custom)
    if (options.centered) {
        swiperOptions.centeredSlides = true;
        swiperOptions.centeredSlidesBounds = true;
    }

    // Autoplay
    if (options.autoplay) {
        swiperOptions.autoplay = {
            delay: parseInt(options.delay) || 6000,
            disableOnInteraction: true,
            reverseDirection: !!options.reverse,
        };
    }

    // Marquee (custom)
    if (options.marquee) {
        swiperOptions.loop = true;
        swiperOptions.speed = options.speed || 6000;
        swiperOptions.autoplay = { delay: 1, disableOnInteraction: true };
    }

    // Rows (custom)
    if (options.rows) {
        swiperOptions.grid = {
            rows: parseInt(options.rows),
            fill: 'row',
        };
    }

    const controls = getSwiperControls(el);

    // Navigation (custom)
    if (options.navigation) {
        let btnPrev = controls?.querySelector('.swiper-button-prev');
        let btnNext = controls?.querySelector('.swiper-button-next');

        if (btnPrev && btnNext) {
            btnPrev.classList.add(classes.prev);
            btnNext.classList.add(classes.next);
        } else {
            const btnPrev = document.createElement('div');
            const btnNext = document.createElement('div');
            btnPrev.className = `swiper-button swiper-button-prev ${classes.prev}`;
            btnNext.className = `swiper-button swiper-button-next ${classes.next}`;
            btnPrev.innerHTML = `<svg><use href="#icon-arrow-left-outline"></use></svg>`;
            btnNext.innerHTML = `<svg><use href="#icon-arrow-right-outline"></use></svg>`;
            controls.append(btnPrev, btnNext);
        }

        swiperOptions.navigation = {
            nextEl: '.' + classes.next,
            prevEl: '.' + classes.prev,
        };
    }

    // Pagination (custom)
    if (options.pagination) {
        let pagination = controls?.querySelector('.swiper-pagination');
        if (pagination) {
            pagination.classList.add(classes.pagination);
        } else {
            const pagination = document.createElement('div');
            pagination.className = `swiper-pagination ${classes.pagination}`;
            controls.append(pagination);
        }

        const paginationType = options.pagination;
        swiperOptions.pagination = {
            el: '.' + classes.pagination,
            clickable: true,
            ...( paginationType === 'bullets' && { dynamicBullets: true, type: 'bullets' } ),
            ...( paginationType === 'fraction' && { type: 'fraction' } ),
            ...( paginationType === 'progressbar' && { type: 'progressbar' } ),
            ...( paginationType === 'custom' && { renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>` } ),
        };
    }

    // Scrollbar (custom)
    if (options.scrollbar) {
        let scrollbar = controls?.querySelector('.swiper-scrollbar');
        if (scrollbar) {
            scrollbar.classList.add(classes.scrollbar);
        } else {
            const scrollbar = document.createElement('div');
            scrollbar.className = `swiper-scrollbar ${classes.scrollbar}`;
            controls.append(scrollbar);
        }

        swiperOptions.scrollbar = {
            el: '.' + classes.scrollbar,
            hide: true,
            draggable: true,
        };
    }

    // Initialize
    const swiper = new Swiper(`.${classes.swiper}`, swiperOptions);

    // Autoplay (hover)
    if (swiperOptions.autoplay) {
        el.addEventListener('mouseenter', () => swiper.autoplay?.stop());
        el.addEventListener('mouseleave', () => swiper.autoplay?.start());
    }

    return swiper;
};

const initAllSwipers = () => {
    document.querySelectorAll('.w-swiper').forEach(initSwiper);
};

( document.readyState === 'loading' )
    ? document.addEventListener('DOMContentLoaded', initAllSwipers, { once: true })
    : initAllSwipers();

export { initAllSwipers, initSwiper };
