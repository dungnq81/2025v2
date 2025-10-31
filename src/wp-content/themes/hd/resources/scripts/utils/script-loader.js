// utils/script-loader.js

const scriptLoader = (timeout = 3000, scriptSelector = 'script[data-type="lazy"]') => {
    const userInteractionEvents = ['mouseover', 'keydown', 'touchstart', 'touchmove', 'wheel'];
    const loadScriptsTimer = setTimeout(loadScripts, timeout);

    // Triggered once by user interaction
    function triggerScriptLoader() {
        loadScripts();
        clearTimeout(loadScriptsTimer);
        userInteractionEvents.forEach((event) => {
            window.removeEventListener(event, triggerScriptLoader, true);
        });
    }

    // Load all scripts
    function loadScripts() {
        document.querySelectorAll(scriptSelector).forEach((elem) => {
            const dataSrc = elem.getAttribute('data-src');
            if (dataSrc) {
                elem.setAttribute('src', dataSrc);
                elem.removeAttribute('data-src');
                elem.removeAttribute('data-type');
            }
        });
    }

    // Attach listeners
    userInteractionEvents.forEach((event) => {
        window.addEventListener(event, triggerScriptLoader, {once: true, passive: true});
    });
};

export default scriptLoader;
