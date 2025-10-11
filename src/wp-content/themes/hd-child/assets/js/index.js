/* index.js */

const index = async () => {};

( document.readyState === 'loading' )
    ? document.addEventListener('DOMContentLoaded', index, { once: true })
    : index();
