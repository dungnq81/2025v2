// dropdown/fx-dropdown.js

import {$, $$, on, off, closest, trigger} from '../utils/dom.js';
import Events from '../utils/events.js';

const DATA_TOGGLE = 'data-fx-dropdown-toggle';
const DATA_DROPDOWN = 'data-fx-dropdown';

function closeAll(except = null) {
    $$('[' + DATA_DROPDOWN + ']').forEach(el => {
        if (el === except) return;
        el.classList.remove('is-open');
        const btn = document.querySelector(`[${DATA_TOGGLE}="#${el.id}"]`);
        if (btn) btn.classList.remove('hover');

        trigger(el, 'fx.dropdown.closed', {el});
        Events.emit('dropdown.close', {el});
    });
}

function focusInside(dropdown) {
    if (dropdown.dataset.autoFocus !== "true") return;
    const input = dropdown.querySelector('input, textarea, select, [contenteditable]');
    if (input) input.focus();
}

const FxDropdown = {
    initAll(root = document) {
        // attach toggles
        $$('[' + DATA_TOGGLE + ']', root).forEach(btn => {
            const sel = btn.getAttribute(DATA_TOGGLE);
            const target = sel ? (sel.startsWith('#') ? document.querySelector(sel) : document.querySelector(sel)) : closest(btn, '[' + DATA_DROPDOWN + ']');
            if (!target) return;
            const handler = (e) => {
                e.preventDefault();
                const visible = target.classList.contains('is-open');
                if (!visible) {
                    closeAll(target);

                    target.classList.add('is-open');
                    btn.classList.add('hover');

                    focusInside(target);

                    Events.emit('dropdown.open', {btn, el: target});
                    trigger(target, 'fx.dropdown.opened', {btn, el: target});
                } else {
                    target.classList.remove('is-open');
                    btn.classList.remove('hover');

                    Events.emit('dropdown.close', {btn, el: target});
                    trigger(target, 'fx.dropdown.closed', {btn, el: target});
                }
            };

            btn.__fx_toggle_handler = handler;
            on(btn, 'click', handler);
        });

        // click outside to close
        const docHandler = (e) => {
            const inside = e.target.closest('[' + DATA_DROPDOWN + '], [' + DATA_TOGGLE + ']');
            if (!inside) closeAll();
        };

        document.__fx_dropdown_doc_handler = docHandler;
        on(document, 'click', docHandler);
    },
    destroyAll(root = document) {
        $$('[' + DATA_TOGGLE + ']', root).forEach(btn => {
            if (btn.__fx_toggle_handler) off(btn, 'click', btn.__fx_toggle_handler);
        });
        if (document.__fx_dropdown_doc_handler) off(document, 'click', document.__fx_dropdown_doc_handler);
    }
};

export default FxDropdown;
