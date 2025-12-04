// index.js

import device from 'current-device';
import Foundation from './3rd/zf.js';

import './utils/global.js';
import scriptLoader from './utils/script-loader.js';
import BackToTop from './utils/back-to-top.js';
import {initMenu} from './utils/menu.js';
import {stickyBar} from './utils/sticky-bar.js';
import {setupCookieConsent} from './utils/cookie-consent.js';

import '../styles/tailwind/index.css';
import '../styles/3rd/_index.scss';

const run = async () => {
    //
    // init
    //
    scriptLoader();
    initMenu();
    stickyBar();

    new BackToTop();

    // Cookie Consent
    await setupCookieConsent({
        consentDays: 180,
        dismissDays: 7,
    });
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run, {once: true})
    : run();
