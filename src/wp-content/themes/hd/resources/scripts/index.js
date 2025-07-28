import $ from 'jquery';
import device from 'current-device';
import Foundation from './3rd/_zf.js';
import {nanoid} from 'nanoid';

import './utils/global.js';
import './utils/back-to-top.js';
import './utils/script-loader.js';
import {initMenu} from './utils/menu.js';
import {stickyBar} from './utils/sticky-bar.js';

import {initSocialShare} from './components/social-share.js';

/** 3rd */
import '../styles/3rd/_index.scss';

/** Fancybox */
import {Fancybox} from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

/** AOS */
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    //
    // init
    //
    initMenu('#main-nav', '.main-nav');
    stickyBar('#masthead');
    initSocialShare('[data-social-share]', {
        intents: [
            'facebook',
            'x',
            'print',
            'send-email',
            'copy-link',
            'web-share'
        ]
    });

    Fancybox.bind('.fcy-popup, .fcy-video, .banner-video a', {});

    let $_array = ['[id^="gallery-"] a', '[data-rel="lightbox"]'];
    $_array.forEach((el, index) => {
        Fancybox.bind(el, {
            groupAll: true,
        });
    });
});
