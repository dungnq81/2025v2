import { nanoid } from 'nanoid';
import Swiper from 'swiper/bundle';

function isEmpty (value) {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

// Initialize Swiper instances
const initializeSwiper = (el, swiper_class, options) => {
    if (!( el instanceof Element ) || !options) {
        console.error('Error: The provided element is not a DOM element.');
        return;
    }

    const swiper = new Swiper(swiper_class, options);

    el.addEventListener('mouseover', () => {
        swiper.autoplay.stop();
    });

    el.addEventListener('mouseout', () => {
        if (options.autoplay) {
            swiper.autoplay.start();
        }
    });

    return swiper;
};

// Generate unique class names
const generateClasses = () => {
    const rand = nanoid(10);
    return {
        rand: rand,
        swiperClass: 'swiper-' + rand,
        nextClass: 'next-' + rand,
        prevClass: 'prev-' + rand,
        paginationClass: 'pagination-' + rand,
        scrollbarClass: 'scrollbar-' + rand,
    };
};

// Default Swiper options
const getDefaultOptions = () => ( {
    grabCursor: !0,
    allowTouchMove: !0,
    threshold: 5,
    hashNavigation: !1,
    mousewheel: !1,
    wrapperClass: 'swiper-wrapper',
    slideClass: 'swiper-slide',
    slideActiveClass: 'swiper-slide-active',
} );

// Utility to generate random integers
const random = (min, max) => Math.floor(Math.random() * ( max - min + 1 )) + min;

//
// swipers single
//
const initializeSwipers = () => {
    const swiperElements = document.querySelectorAll('.w-swiper');

    swiperElements.forEach((el, index) => {
        const classes = generateClasses();
        el.classList.add(classes.swiperClass);

        let controls = el.closest('.closest-swiper')?.querySelector('.swiper-controls');
        if (!controls) {
            controls = document.createElement('div');
            controls.classList.add('swiper-controls');
            el.after(controls);
        }

        const swiperWrapper = el?.querySelector('.swiper-wrapper');
        if (!swiperWrapper.dataset.options) {
            return;
        }

        let options = JSON.parse(swiperWrapper.dataset.options);
        let swiperOptions = { ...getDefaultOptions() };

        if (options.spaceBetween) {
            swiperOptions.spaceBetween = parseInt(options.spaceBetween);
        }

        if (options.slidesPerView === 'auto') {
            swiperOptions.slidesPerView = 'auto';
        } else if (options.slidesPerView) {
            swiperOptions.slidesPerView = parseInt(options.slidesPerView);
        }

        if (options.autoview) {
            swiperOptions.slidesPerView = 'auto';
            if (options.gap) {
                swiperOptions.spaceBetween = 12;
                swiperOptions.breakpoints = {
                    640: { spaceBetween: 24 },
                };
            }
        } else {
            swiperOptions.breakpoints = {
                0: options.mobile || {},
                640: options.tablet || {},
                768: options.tablet_l || {},
                1024: options.desktop || {},
            };
        }

        if (options.observer) {
            swiperOptions.observer = !0;
            swiperOptions.observeParents = !0;
        }

        if (options.effect) {
            swiperOptions.effect = String(options.effect);
            if (swiperOptions.effect === 'fade') {
                swiperOptions.fadeEffect = { crossFade: !0 };
            }
        }

        if (options.autoheight) swiperOptions.autoHeight = !0;
        if (options.loop) swiperOptions.loop = !0;
        if (options.parallax) swiperOptions.parallax = !0;
        if (options.direction) swiperOptions.direction = String(options.direction);
        if (options.freemode) swiperOptions.freeMode = !0;
        if (options.cssmode) swiperOptions.cssMode = !0;

        if (options.centered) {
            swiperOptions.centeredSlides = !0;
            swiperOptions.centeredSlidesBounds = !0;
        }

        swiperOptions.speed = options.speed ? parseInt(options.speed) : random(300, 900);

        if (options.autoplay) {
            swiperOptions.autoplay = {
                disableOnInteraction: !1,
                delay: options.delay ? parseInt(options.delay) : random(4000, 6000),
            };
            if (options.reverse) swiperOptions.reverseDirection = !0;
        }

        // Navigation
        if (options.navigation) {
            let btnPrev = controls?.querySelector('.swiper-button-prev');
            let btnNext = controls?.querySelector('.swiper-button-next');

            if (btnPrev && btnNext) {
                btnPrev.classList.add(classes.prevClass);
                btnNext.classList.add(classes.nextClass);
            } else {
                btnPrev = document.createElement('div');
                btnNext = document.createElement('div');
                btnPrev.classList.add('swiper-button', 'swiper-button-prev', classes.prevClass);
                btnNext.classList.add('swiper-button', 'swiper-button-next', classes.nextClass);
                controls.append(btnPrev, btnNext);

                const iconLeft = `<svg aria-hidden="true"><use href="#icon-arrow-left"></use></svg>`;
                const iconRight = `<svg aria-hidden="true"><use href="#icon-arrow-right"></use></svg>`;

                btnPrev.innerHTML = iconLeft;
                btnNext.innerHTML = iconRight;
            }

            swiperOptions.navigation = {
                nextEl: '.' + classes.nextClass,
                prevEl: '.' + classes.prevClass,
            };
        }

        // Pagination
        if (options.pagination) {
            let pagination = controls?.querySelector('.swiper-pagination');
            if (pagination) {
                pagination.classList.add(classes.paginationClass);
            } else {
                pagination = document.createElement('div');
                pagination.classList.add('swiper-pagination', classes.paginationClass);
                controls.appendChild(pagination);
            }

            const paginationType = options.pagination;
            swiperOptions.pagination = {
                el: '.' + classes.paginationClass,
                clickable: !0,
                ...( paginationType === 'bullets' && { dynamicBullets: !0, type: 'bullets' } ),
                ...( paginationType === 'fraction' && { type: 'fraction' } ),
                ...( paginationType === 'progressbar' && { type: 'progressbar' } ),
                ...( paginationType === 'custom' && {
                    renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`,
                } ),
            };
        }

        // Scrollbar
        if (options.scrollbar) {
            let scrollbar = controls?.querySelector('.swiper-scrollbar');
            if (scrollbar) {
                scrollbar.classList.add(classes.scrollbarClass);
            } else {
                scrollbar = document.createElement('div');
                scrollbar.classList.add('swiper-scrollbar', classes.scrollbarClass);
                controls.appendChild(scrollbar);
            }

            swiperOptions.scrollbar = {
                el: '.' + classes.scrollbarClass,
                hide: !0,
                draggable: !0,
            };
        }

        // Marquee
        if (options.marquee) {
            swiperOptions.centeredSlides = !1;
            swiperOptions.autoplay = {
                delay: 1,
                disableOnInteraction: !0,
            };
            swiperOptions.loop = !0;
            swiperOptions.speed = 6000;
            swiperOptions.allowTouchMove = !0;
        }

        // rows
        if (options.rows) {
            swiperOptions.direction = 'horizontal';
            swiperOptions.loop = !1;
            swiperOptions.grid = {
                rows: parseInt(options.rows),
                fill: 'row',
            };
        }

        initializeSwiper(el, '.' + classes.swiperClass, swiperOptions);
    });
};

document.addEventListener('DOMContentLoaded', initializeSwipers);
