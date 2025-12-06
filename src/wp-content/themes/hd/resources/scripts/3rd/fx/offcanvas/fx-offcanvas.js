// offcanvas/fx-offcanvas.js

import { $, $$, on, off, closest, addClass, removeClass, hasClass, toggleClass, trigger } from '../utils/dom.js';
import Events from '../utils/events.js';

// data attributes
const DATA_OC = 'data-fx-offcanvas';
const DATA_OPEN = 'data-fx-offcanvas-open';
const DATA_CLOSE = 'data-fx-offcanvas-close';

const OVERLAY_CLASS = 'fx-offcanvas-overlay';

// create overlay
function createOverlay() {
  let o = document.querySelector('.'+OVERLAY_CLASS);
  if (!o) {
    o = document.createElement('div');
    o.className = OVERLAY_CLASS + ' fixed inset-0 bg-black bg-opacity-50 hidden';
    document.body.appendChild(o);
  }
  return o;
}

const FxOffCanvas = {
  initAll(root = document) {
    const overlay = createOverlay();

    // open buttons
    $$('['+DATA_OPEN+']', root).forEach(btn => {
      const sel = btn.getAttribute(DATA_OPEN);
      const target = sel ? document.querySelector(sel) : null;
      if (!target) return;
      const handler = (e) => {
        e.preventDefault();
        // show overlay
        overlay.classList.remove('hidden');
        // remove translate class (assumes Tailwind transform classes)
        target.classList.remove('-translate-x-full','translate-x-full');
        target.classList.add('translate-x-0');
        // prevent body scroll
        document.documentElement.classList.add('fx-offcanvas-open');
        Events.emit('offcanvas.open', { btn, el: target, overlay });
        trigger(target, 'fx.offcanvas.opened', { btn, el: target, overlay });
      };
      btn.__fx_oc_open = handler;
      on(btn, 'click', handler);
    });

    // close buttons inside offcanvas
    $$('['+DATA_CLOSE+']', root).forEach(btn => {
      const sel = btn.getAttribute(DATA_CLOSE);
      const target = sel ? document.querySelector(sel) : closest(btn, '['+DATA_OC+']');
      if (!target) return;
      const handler = (e) => {
        e.preventDefault();
        target.classList.add('-translate-x-full');
        target.classList.remove('translate-x-0');
        const overlayEl = document.querySelector('.'+OVERLAY_CLASS);
        if (overlayEl) overlayEl.classList.add('hidden');
        document.documentElement.classList.remove('fx-offcanvas-open');
        Events.emit('offcanvas.close', { btn, el: target });
        trigger(target, 'fx.offcanvas.closed', { btn, el: target });
      };
      btn.__fx_oc_close = handler;
      on(btn, 'click', handler);
    });

    // click overlay to close
    const overlayHandler = (e) => {
      const overlayEl = e.target;
      $$('['+DATA_OC+']').forEach(oc => {
        oc.classList.add('-translate-x-full');
        oc.classList.remove('translate-x-0');
      });
      overlayEl.classList.add('hidden');
      document.documentElement.classList.remove('fx-offcanvas-open');
      Events.emit('offcanvas.close', { overlay: overlayEl });
    };
    overlay.__fx_handler = overlayHandler;
    on(overlay, 'click', overlayHandler);
  },
  destroyAll(root = document) {
    $$('['+DATA_OPEN+']', root).forEach(btn => {
      if (btn.__fx_oc_open) off(btn, 'click', btn.__fx_oc_open);
    });
    $$('['+DATA_CLOSE+']', root).forEach(btn => {
      if (btn.__fx_oc_close) off(btn, 'click', btn.__fx_oc_close);
    });
    const overlay = document.querySelector('.'+OVERLAY_CLASS);
    if (overlay && overlay.__fx_handler) off(overlay, 'click', overlay.__fx_handler);
  }
};

export default FxOffCanvas;
