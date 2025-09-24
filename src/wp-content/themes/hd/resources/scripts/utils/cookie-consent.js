// utils/cookie-consent.js

import CookieService from './cookie.js';

const DEFAULTS = {
    bannerSelector: null,
    acceptSelector: '.js-cookie-consent-accept',
    closeSelector: '.js-cookie-consent-close',
    consentDays: 180,   // 180 days
    dismissDays: 7,     // 7 days
    consentCookie: 'cookie_consent',
    dismissCookie: 'cookie_consent_dismissed',
    sameSite: 'Lax',
    secure: true,
    path: '/',
};

let _inited = false;
let _mo = null;

function _getBanner (opts) {
    if (opts.bannerSelector) {
        return document.querySelector(opts.bannerSelector);
    }
    const btn = document.querySelector(`${opts.acceptSelector}, ${opts.closeSelector}`);
    return btn ? btn.closest('section') : null;
}

function _hide (el) {
    if (!el) return;
    el.style.display = 'none';
}

function _show (el) {
    if (!el) return;
    el.style.display = 'flex';
}

async function _initNow (opts) {
    const banner = _getBanner(opts);
    const btnAccept = document.querySelector(opts.acceptSelector);
    const btnClose = document.querySelector(opts.closeSelector);
    if (!banner || !btnAccept || !btnClose) return false;

    const consent = await CookieService.get(opts.consentCookie);
    const dismissed = await CookieService.get(opts.dismissCookie);
    if (consent === 'accepted' || dismissed === '1') _hide(banner);
    else _show(banner);

    // Accept all
    btnAccept.addEventListener('click', async () => {
        await CookieService.set(opts.consentCookie, 'accepted', {
            days: opts.consentDays, path: opts.path, sameSite: opts.sameSite, secure: opts.secure,
        });
        await CookieService.delete(opts.dismissCookie, { path: opts.path });
        _hide(banner);
    }, { once: true });

    // Close
    btnClose.addEventListener('click', async () => {
        await CookieService.set(opts.dismissCookie, '1', {
            days: opts.dismissDays, path: opts.path, sameSite: opts.sameSite, secure: opts.secure,
        });
        _hide(banner);
    }, { once: true });

    return true;
}

export async function setupCookieConsent (userOptions = {}) {
    if (_inited) return;

    const opts = { ...DEFAULTS, ...userOptions };
    const ok = await _initNow(opts);
    
    if (ok) {
        _inited = true;
        if (_mo) {
            _mo.disconnect();
            _mo = null;
        }
        return;
    }

    // MutationObserver
    if (_mo) return;
    _mo = new MutationObserver(async () => {
        const done = await _initNow(opts);
        if (done) {
            _inited = true;
            if (_mo) {
                _mo.disconnect();
                _mo = null;
            }
        }
    });
    _mo.observe(document.body, { childList: true, subtree: true });
}
