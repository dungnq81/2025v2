// sticky-bar.js

export function stickyBar(selector = '#masthead') {
    const navbar = document.querySelector(selector);
    if (!navbar) return;

    const body = document.body;
    const distance = navbar.offsetTop;
    const navbarHeight = navbar.offsetHeight;
    let lastScrollTop = 0;
    let ticking = false;

    const getScrollTop = () =>
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Initial state
    const top = getScrollTop();
    if (top < 1) {
        navbar.classList.remove("sticky");
        body.classList.remove("b-sticky");
    } else {
        navbar.classList.add("sticky");
        body.classList.add("b-sticky");
    }

    document.addEventListener("scroll", () => {
        const scrollTop = getScrollTop();

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(scrollTop);
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll(scrollTop) {
        const atBottom = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 5;

        if (scrollTop > distance) {
            navbar.classList.add("sticky");
            body.classList.add("b-sticky");
        } else if (scrollTop < 1) {
            navbar.classList.remove("sticky", "scroll");
            body.classList.remove("b-sticky", "b-scroll");
        }

        if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
            navbar.classList.add("sticky");
            body.classList.add("b-sticky", "b-scroll");
        } else if (scrollTop < lastScrollTop && scrollTop > navbarHeight) {
            navbar.classList.remove("scroll");
            body.classList.remove("b-scroll");
        }

        if (body.classList.contains("lock-scroll")) {
            navbar.classList.remove("scroll", "bottom");
            body.classList.remove("b-scroll", "b-bottom");
        }

        if (atBottom) {
            navbar.classList.add("bottom");
            body.classList.add("b-bottom");
        } else {
            navbar.classList.remove("bottom");
            body.classList.remove("b-bottom");
        }

        lastScrollTop = scrollTop;
    }
}
