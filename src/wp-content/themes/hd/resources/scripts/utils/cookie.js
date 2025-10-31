// utils/cookie.js

export default class CookieService {
    static _normalizeSameSiteForCookieStore(val = 'Lax') {
        const v = String(val).toLowerCase();
        return v === 'lax' || v === 'strict' || v === 'none' ? v : 'lax';
    }

    static _normalizeSameSiteForHeader(val = 'Lax') {
        const v = String(val).toLowerCase();
        if (v === 'lax') return 'Lax';
        if (v === 'strict') return 'Strict';
        if (v === 'none') return 'None';
        return 'Lax';
    }

    static async get(name) {
        if (window.cookieStore) {
            const entry = await window.cookieStore.get(name);
            return entry?.value || '';
        }

        const pattern = new RegExp(`(^|;)\\s*${encodeURIComponent(name)}\\s*=\\s*([^;]+)`);
        const match = document.cookie.match(pattern);
        return match ? decodeURIComponent(match[2]) : '';
    }

    static async set(
        name,
        value,
        {days = 365, path = '/', secure = true, sameSite = 'Lax'} = {}
    ) {
        if (window.cookieStore) {
            const opts = {
                name,
                value,
                path,
                secure: !!secure,
                sameSite: CookieService._normalizeSameSiteForCookieStore(sameSite),
            };
            if (days) opts.expires = new Date(Date.now() + days * 864e5);
            return window.cookieStore.set(opts);
        }

        // Fallback
        const ss = CookieService._normalizeSameSiteForHeader(sameSite);
        let cookieStr =
            `${encodeURIComponent(name)}=${encodeURIComponent(value)}` +
            `;path=${path}` +
            `;SameSite=${ss}`;
        if (days) {
            const expires = new Date(Date.now() + days * 864e5).toUTCString();
            cookieStr += `;expires=${expires}`;
        }
        if (secure) cookieStr += ';Secure';
        document.cookie = cookieStr;
    }

    static async delete(name, {path = '/'} = {}) {
        if (window.cookieStore) {

            return window.cookieStore.delete(name, {path});
        }

        // Fallback
        document.cookie =
            `${encodeURIComponent(name)}=;path=${path};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}
