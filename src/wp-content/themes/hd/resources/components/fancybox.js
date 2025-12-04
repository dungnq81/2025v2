// components/fancybox.js

import {Fancybox} from '@fancyapps/ui';
import './fancybox.scss';

const initFancybox = () => {
    Fancybox.bind('.fcy-popup, .fcy-video, .banner-video a', {});

    const selectors = ['[id^="gallery-"] a', '[data-rel="lightbox"]'];
    selectors.forEach((el) => {
        Fancybox.bind(el, {
            groupAll: true,
            Carousel: {
                transition: "slide",
                friction: 0.92,
            },
        });
    });
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initFancybox, {once: true})
    : initFancybox();
