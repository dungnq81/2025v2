// index.js

import device from 'current-device';
import { nanoid } from 'nanoid';
import Foundation from './3rd/zf.js';

import './utils/back-to-top.js';
import './utils/global.js';
import './utils/script-loader.js';
import { initMenu } from './utils/menu.js';
import { stickyBar } from './utils/sticky-bar.js';
import { setupCookieConsent } from './utils/cookie-consent.js';

import './components/swiper.js';
import { initSocialShare } from './components/social-share.js';

import '../styles/tailwind/index.css';
import '../styles/3rd/_index.scss';

import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const run = async () => {
    //
    // init
    //
    stickyBar();
    initMenu('#main-nav', '.main-nav');
    initSocialShare('[data-social-share]', {
        intents: [ 'facebook', 'x', 'print', 'send-email', 'copy-link', 'web-share' ]
    });

    //
    // Fancybox
    //
    Fancybox.bind('.fcy-popup, .fcy-video, .banner-video a', {});
    let $_array = [ '[id^="gallery-"] a', '[data-rel="lightbox"]' ];
    $_array.forEach((el, index) => {
        Fancybox.bind(el, {
            groupAll: true,
        });
    });

    //
    // Cookie Consent
    //
    await setupCookieConsent({
        consentDays: 180,
        dismissDays: 7,
    });
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run, { once: true })
    : run();
