import device from 'current-device';
import {nanoid} from 'nanoid';

import './utils/back-to-top.js';
import './utils/global.js';
import './utils/script-loader.js';

import {stickyBar} from './utils/sticky-bar.js';
import {initSocialShare} from './utils/social-share.js';
//import CookieService from './utils/cookie.js';

// Styles
import '../styles/3rd/_index.scss';
import '../styles/tailwind/index.css'

/** Fancybox */
//import {Fancybox} from '@fancyapps/ui';
//import '@fancyapps/ui/dist/fancybox/fancybox.css';

/** AOS */
//import AOS from 'aos';
//import 'aos/dist/aos.css';
//AOS.init();

/** DOMContentLoaded */
document.addEventListener('DOMContentLoaded', async () => {
    //
    // init
    //
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

    //Fancybox.bind('.fcy-popup, .fcy-video, .banner-video a', {});

    // let $_array = ['[id^="gallery-"] a', '[data-rel="lightbox"]'];
    // $_array.forEach((el, index) => {
    //     Fancybox.bind(el, {
    //         groupAll: true,
    //     });
    // });

    //const token = await CookieService.get('auth_token');
    // console.log('Cookie token:', token);
});
