// utils/menu.js

const initializedMenus = new WeakSet();

export function initMenu(containerSelector = '#main-nav', menuSelector = '.main-nav') {
    const container = document.querySelector(containerSelector);
    const menu = document.querySelector(menuSelector);

    if (!container || !menu) return;
    if (initializedMenus.has(menu)) return;
    initializedMenus.add(menu);

    let more = menu.querySelector('.more');
    if (!more) {
        more = document.createElement('li');
        more.classList.add('more');
        more.innerHTML = '<a href="#"></a><ul class="submenu dropdown"></ul>';
        menu.appendChild(more);
    }

    const dropdown = more.querySelector('.dropdown');

    function adjustMenu() {
        dropdown.innerHTML = '';
        more.style.display = 'none';

        const items = [...menu.children].filter(li => li !== more);
        items.forEach(li => (li.style.display = 'block'));

        container.style.overflow = 'hidden';

        if (menu.scrollWidth <= container.clientWidth) {
            container.style.overflow = 'visible';
            reinitializeFoundationDropdown();
            return;
        }

        const hiddenItems = [];
        for (let i = items.length - 1; i >= 0; i--) {
            if (menu.scrollWidth > container.clientWidth) {
                hiddenItems.unshift(items[i]);
                items[i].style.display = 'none';
            } else {
                break;
            }
        }

        if (hiddenItems.length > 0) {
            hiddenItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.style.display = 'block';
                dropdown.appendChild(clone);
            });
            more.style.display = 'block';
        }

        container.style.overflow = 'visible';
        reinitializeFoundationDropdown();
    }

    function reinitializeFoundationDropdown() {
        if (typeof Foundation !== 'undefined' && Foundation.DropdownMenu) {
            let mainNav = $(menuSelector);
            if (mainNav.length) {
                new Foundation.DropdownMenu(mainNav);
            }
        }
    }

    function ensureStableMenu() {
        adjustMenu();

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => adjustMenu());
        }

        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => {
                clearTimeout(ro._t);
                ro._t = setTimeout(adjustMenu, 100);
            });
            ro.observe(container);
        }
    }

    // Debounced resize handler
    let resizeTimeout;

    function onResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => adjustMenu(), 200);
    }

    ensureStableMenu();

    window.addEventListener('resize', onResize);
}
