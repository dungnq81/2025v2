// utils/sticky-bar.js

export function stickyBar ({ navbar = '#masthead', header = '#header', topBar = '.top-header' } = {}) {
    const navbarEl = document.querySelector(navbar);
    if (!navbarEl) return;

    const body = document.body;
    const headerEl = document.querySelector(header);
    const topBarEl = document.querySelector(topBar);

    // Create placeholder element to maintain layout when navbar becomes fixed
    const placeholder = document.createElement('div');
    placeholder.className = 'masthead-placeholder';
    placeholder.style.display = 'none';
    navbarEl.parentNode.insertBefore(placeholder, navbarEl);

    let navbarHeight = navbarEl.offsetHeight;
    let markerHeight = 0;
    let lastScrollTop = 0;
    let ticking = false;
    let resizeTimeout;

    const getScrollTop = () => document.scrollingElement?.scrollTop ?? window.scrollY ?? window.pageYOffset ?? 0;

    // Update heights of navbar and marker element
    function updateHeights () {
        // Priority: topBar first, fallback to header
        const markerElement = topBarEl || headerEl;
        markerHeight = markerElement ? markerElement.offsetHeight : 0;
        navbarHeight = navbarEl.offsetHeight;
        placeholder.style.height = `${navbarHeight}px`;
    }

    // Initial setup
    updateHeights();

    // Check initial scroll position
    const initialScroll = getScrollTop();
    if (initialScroll > markerHeight) {
        body.classList.add('scrolled-past-marker');
    }

    // Handle window resize with debounce
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateHeights();

            // Re-check current state after resize
            const currentScroll = getScrollTop();
            if (currentScroll <= markerHeight) {
                // At top of page, reset everything
                navbarEl.classList.remove('show');
                placeholder.style.display = 'none';
                body.classList.remove('navbar-visible');
            } else if (body.classList.contains('navbar-visible')) {
                // Navbar is visible, update placeholder height
                placeholder.style.height = `${navbarHeight}px`;
            }
        }, 150); // Debounce 150ms
    });

    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll () {
        const scrollTop = getScrollTop();
        const atBottom = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 5;

        // Track scroll direction and bottom state
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            body.classList.add('scrolling-down');
            body.classList.remove('scrolling-up');
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up
            body.classList.add('scrolling-up');
            body.classList.remove('scrolling-down');
        }

        // Check if at bottom of page
        if (atBottom) {
            body.classList.add('at-bottom');
        } else {
            body.classList.remove('at-bottom');
        }

        // Check if scrolled past marker checkpoint
        if (scrollTop > markerHeight) {
            body.classList.add('scrolled-past-marker');
        } else {
            body.classList.remove('scrolled-past-marker');
        }

        // Show navbar when scrolling up and past marker
        if (scrollTop < lastScrollTop && scrollTop > markerHeight) {
            // Scrolling up & past marker -> show navbar
            navbarEl.classList.add('show');
            placeholder.style.display = 'block';
            body.classList.add('navbar-visible');
        } else if (scrollTop > lastScrollTop && scrollTop > markerHeight + navbarHeight) {
            // Scrolling down & far enough -> hide navbar
            navbarEl.classList.remove('show');
            placeholder.style.display = 'none';
            body.classList.remove('navbar-visible');
        }

        // Remove show class when back to top
        if (scrollTop <= markerHeight) {
            navbarEl.classList.remove('show');
            placeholder.style.display = 'none';
            body.classList.remove('navbar-visible');
        }

        // Handle lock-scroll state (e.g., when modal is open)
        if (body.classList.contains('lock-scroll')) {
            navbarEl.classList.remove('show');
            placeholder.style.display = 'none';
            body.classList.remove('navbar-visible', 'scrolling-up', 'scrolling-down');
        }

        lastScrollTop = scrollTop;
    }
}
