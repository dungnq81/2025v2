// utils/viewport-fix.js (IIFE)

(() => {
    if (window.__viewportInit) return;
    window.__viewportInit = true;

    function setViewportProperty() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    window.addEventListener('resize', setViewportProperty);
    setViewportProperty();
})();
