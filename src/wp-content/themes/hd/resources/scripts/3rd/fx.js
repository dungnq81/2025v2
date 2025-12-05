// 3rd/fx.js

import FxSmoothScroll from './fx/smoothscroll/fx-smoothscroll.js';
import FxTabs from './fx/tabs/fx-tabs.js';
import Events from './fx/utils/events.js';

const FX = {
    init(opts = {}) {
        const root = opts.root || document;

        FxSmoothScroll.initAll(root);
        FxTabs.initAll(root);
    },
    destroy() {
        FxSmoothScroll.destroyAll();
        FxTabs.destroyAll();
    },
    on: Events.on,
    off: Events.off,
    emit: Events.emit
};

export default FX;
