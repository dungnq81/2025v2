// components/template/extra.js

const run = async () => {};

( document.readyState === 'loading' )
    ? document.addEventListener('DOMContentLoaded', run, { once: true })
    : run();
