// fx-accordion.js

import {$$, on, off} from '../utils/dom.js';
import Events from '../utils/events.js';

const SELECTOR = '[data-fx-accordion]';
const ITEM = '[data-fx-accordion-item]';
const CONTENT = '[data-fx-accordion-content]';
const ACTIVE_CLASS = 'is-active';

const FxAccordion = {
    initAll(root = document) {
        $$(SELECTOR, root).forEach(wrapper => {
            const allowAllClosed = wrapper.dataset.allowAllClosed === 'true';
            const multiExpand = wrapper.dataset.multiExpand === 'true';

            wrapper.querySelectorAll(ITEM).forEach(item => {
                const btn = item.querySelector('a.accordion-title');
                const panel = item.querySelector(CONTENT);
                if (!btn || !panel) return;

                const handler = (e) => {
                    e.preventDefault();

                    const isOpen = item.classList.contains(ACTIVE_CLASS);

                    // --- CASE 1: CLOSE ---
                    if (isOpen) {
                        if (!allowAllClosed) {
                            const openedCount = wrapper.querySelectorAll(`.${ACTIVE_CLASS}`).length;
                            if (openedCount <= 1) return;
                        }

                        item.classList.remove(ACTIVE_CLASS);
                        Events.emit('accordion.close', {item, panel});

                        return;
                    }

                    // --- CASE 2: OPEN ---
                    if (!multiExpand) {
                        wrapper.querySelectorAll(ITEM).forEach(other => {
                            if (other !== item) {
                                other.classList.remove(ACTIVE_CLASS);
                            }
                        });
                    }

                    item.classList.add(ACTIVE_CLASS);
                    Events.emit('accordion.open', {item, panel});
                };

                btn.__fx_acc_handler = handler;
                on(btn, 'click', handler);
            });
        });
    },

    destroyAll(root = document) {
        $$(SELECTOR, root).forEach(wrapper => {
            wrapper.querySelectorAll(ITEM).forEach(item => {
                const btn = item.querySelector('a.accordion-title');
                if (btn && btn.__fx_acc_handler) off(btn, 'click', btn.__fx_acc_handler);
            });
        });
    }
};

export default FxAccordion;
