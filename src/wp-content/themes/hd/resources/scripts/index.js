import $ from 'jquery';
import device from 'current-device';
import { nanoid } from 'nanoid';
import Foundation from './3rd/zf.js';

import './utils/back-to-top.js';
import './utils/global.js';
import './utils/script-loader.js';
import { stickyBar } from './utils/sticky-bar.js';
//import CookieService from './utils/cookie.js';

import './components/swiper.js';
import { initSocialShare } from './components/social-share.js';

// Styles
import '../styles/tailwind/index.css';
import '../styles/3rd/_index.scss';

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

    //
    // Fancybox
    //
    //Fancybox.bind('.fcy-popup, .fcy-video, .banner-video a', {});

    // let $_array = ['[id^="gallery-"] a', '[data-rel="lightbox"]'];
    // $_array.forEach((el, index) => {
    //     Fancybox.bind(el, {
    //         groupAll: true,
    //     });
    // });

    //
    // Cookie
    //
    //const token = await CookieService.get('auth_token');
    // console.log('Cookie token:', token);

    //
    // toggle menu footer
    //
    document.querySelectorAll("#footer-columns .toggle-title").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            this.classList.toggle("active");
        });
    });

    //
    // table scroll
    //
    document.querySelectorAll('.entry-content table').forEach(function (tbl) {
        if (tbl.parentElement && tbl.parentElement.classList.contains('table-scroll')) return;

        const wrap = document.createElement('div');
        wrap.className = 'table-scroll';
        tbl.parentNode.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
    });
});
