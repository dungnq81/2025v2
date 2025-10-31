// utils/global.js (IIFE)

(() => {
    const currentDomain = window.location.hostname;
    const invalidHref = /^(#|mailto:|tel:|javascript:|data:|blob:)/i;
    const selector = 'a._blank, a.blank, a[target="_blank"]';
    const linkSet = new Set();

    /**
     * Check external link
     *
     * @param el
     */
    function checkExternal(el) {
        const href = el.getAttribute('href')?.trim();
        if (!href || invalidHref.test(href)) return;

        try {
            const url = new URL(href, window.location.href);
            if (url.hostname && url.hostname !== currentDomain) {
                linkSet.add(el);
            }
        } catch {
        }
    }

    /**
     * Apply target and rel to link
     *
     * @param el
     */
    function applyTargetRel(el) {
        if (el.target !== '_blank') el.target = '_blank';
        const relParts = (el.rel || '').split(/\s+/).filter(Boolean);
        ['noopener', 'noreferrer', 'nofollow'].forEach(r => {
            if (!relParts.includes(r)) relParts.push(r);
        });
        el.rel = relParts.join(' ');
    }

    /**
     * Process links
     */
    function processLinks() {
        for (const el of linkSet) applyTargetRel(el);
    }

    /**
     * Run
     *
     * @returns {Promise<void>}
     */
    const run = async () => {
        //
        // target _blank links
        //
        document.querySelectorAll(selector).forEach(el => linkSet.add(el));
        document.querySelectorAll('a[href]').forEach(checkExternal);

        processLinks();

        //
        // MutationObserver
        //
        const observer = new MutationObserver(mutations => {
            document.querySelectorAll('ul.submenu[role="menubar"]').forEach(menu => {
                menu.setAttribute('role', 'menu');
            });
            document.querySelectorAll('[aria-hidden="true"] a, [aria-hidden="true"] button').forEach(el => {
                el.setAttribute('tabindex', '-1');
            });
        });

        observer.observe(document.body, {childList: true, subtree: true});

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
    };

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', run, {once: true})
        : run();
})();
