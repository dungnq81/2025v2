// 3rd/fx.js
import FxSmoothScroll from './fx/smoothscroll/fx-smoothscroll.js';
import FxTabs from './fx/tabs/fx-tabs.js';
import FxOffCanvas from './fx/offcanvas/fx-offcanvas.js';
import FxDropdown from './fx/dropdown/fx-dropdown.js';
import FxAccordion from './fx/accordion/fx-accordion.js';
import Events from './fx/utils/events.js';

const modules = {
    smoothScroll: FxSmoothScroll,
    tabs: FxTabs,
    offCanvas: FxOffCanvas,
    dropdown: FxDropdown,
    accordion: FxAccordion,
};

const invoke = (m, fn, root) => m?.[fn]?.(root);
const buildMap = fn => Object.fromEntries(
    Object.entries(modules).map(([k, m]) => [
        k, (root = document) => invoke(m, fn, root)
    ])
);

const FX = {
    async init({root = document} = {}) {
        Object.values(modules).forEach(m => invoke(m, 'initAll', root));
    },
    destroy: buildMap('destroyAll'),
    reinit: Object.fromEntries(
        Object.entries(modules).map(([k, m]) => [
            k,
            (root = document) => {
                invoke(m, 'destroyAll', root);
                invoke(m, 'initAll', root);
            }
        ])
    ),
    on: Events.on,
    off: Events.off,
    emit: Events.emit,
};

export default FX;
