// utils/global.js (IIFE)

(() => {
    const run = async () => {
        //
        // target _blank links
        //
        const currentDomain = window.location.hostname;
        const linkSet = new Set([
            ...document.querySelectorAll('a._blank, a.blank, a[target="_blank"]')
        ]);

        for (const el of document.querySelectorAll('a[href]')) {
            const href = el.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

            try {
                const url = new URL(href, window.location.href);
                if (url.hostname !== currentDomain) linkSet.add(el);
            } catch {
            }
        }

        for (const el of linkSet) {
            if (el.target !== '_blank') el.target = '_blank';
            const relParts = (el.rel || '').split(/\s+/).filter(Boolean);
            ['noopener', 'noreferrer', 'nofollow'].forEach(r => {
                if (!relParts.includes(r)) relParts.push(r);
            });
            el.rel = relParts.join(' ');
        }

        //
        // Error handling for images
        //
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function () {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45MSAxMDAgMTEwIDExNy45MSAxMTAgMTQwQzExMCAxNjIuMDkgMTI3LjkxIDE4MCAxNTAgMTgwQzE3Mi4wOSAxODAgMTkwIDE2Mi4wOSAxOTAgMTQwQzE5MCAxMTcuOTEgMTcyLjA5IDEwMCAxNTAgMTAwWiIgZmlsbD0iI0Q5RERFMSIvPgo8L3N2Zz4K';
                this.alt = 'Not found';
            });
        });

        //
        // MutationObserver
        //
        const observer = new MutationObserver(() => {
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
