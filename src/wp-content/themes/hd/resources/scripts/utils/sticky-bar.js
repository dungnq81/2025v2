// utils/sticky-bar.js

export function stickyBar ({
                               navbar = '#masthead',
                               header = '#header',
                               topBar = '.top-header'
                           } = {}) {
    const navbarEl = document.querySelector(navbar);
    if (!navbarEl) return;

    const body = document.body;
    const headerEl = document.querySelector(header);
    const topBarEl = document.querySelector(topBar);

    // Handle lock-scroll state
    if (body.classList.contains('lock-scroll')) {
        navbarEl.classList.remove('scrolling', 'is-sticky');
        body.classList.remove('scrolling-down', 'scrolling-up', 'at-bottom');

        return;
    }

    // Create placeholder element to maintain layout when navbar becomes fixed
    const placeholder = document.createElement('div');
    placeholder.className = 'masthead-placeholder';
    placeholder.style.display = 'none';
    navbarEl.parentNode.insertBefore(placeholder, navbarEl);

    // Calculate marker height: topBar if exists, otherwise header
    const markerElement = topBarEl || headerEl;
    let markerHeight = markerElement ? markerElement.offsetHeight : 0;
    let navbarHeight = navbarEl.offsetHeight;
    let lastScrollTop = 0;
    let ticking = false;
    let resizeTimeout;

    const getScrollTop = () => document.scrollingElement?.scrollTop ?? window.scrollY ?? window.pageYOffset ?? 0;

    // Update heights on resize
    function updateHeights () {
        const markerEl = topBarEl || headerEl;
        markerHeight = markerEl ? markerEl.offsetHeight : 0;
        navbarHeight = navbarEl.offsetHeight;
        placeholder.style.height = `${navbarHeight}px`;
    }

    updateHeights();

    // Initial check
    const top = getScrollTop();
    if (top < 1) {
        navbarEl.classList.remove('is-sticky');
        placeholder.style.display = 'none';
    } else if (top > markerHeight) {
        body.classList.add('scrolled-marker');
    }

    // Handle resize
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateHeights();
        }, 150);
    });

    document.addEventListener('scroll', () => {
        const scrollTop = getScrollTop();

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(scrollTop);
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll (scrollTop) {
        const atBottom = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 5;

        // Show/hide navbar based on scroll position relative to marker
        if (scrollTop > markerHeight) {
            navbarEl.classList.add('is-sticky');
            placeholder.style.display = 'block';
        } else if (scrollTop < 1) {
            navbarEl.classList.remove('is-sticky');
            placeholder.style.display = 'none';
            body.classList.remove('scrolling-up', 'scrolling-down');
        }

        // Scroll direction handling
        if (scrollTop > lastScrollTop && scrollTop > markerHeight) {
            // Scrolling down
            body.classList.add('scrolling-down');
            body.classList.remove('scrolling-up');
        } else if (scrollTop < lastScrollTop && scrollTop > markerHeight) {
            // Scrolling up
            body.classList.remove('scrolling-down');
            body.classList.add('scrolling-up');
        }

        // Bottom detection
        if (atBottom) {
            body.classList.add('at-bottom');
        } else {
            body.classList.remove('at-bottom');
        }

        lastScrollTop = scrollTop;
    }
}
