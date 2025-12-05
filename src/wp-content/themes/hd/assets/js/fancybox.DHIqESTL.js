const t$7 = (t2) => "string" == typeof t2;
const n$9 = (n2) => n2 && null !== n2 && n2 instanceof Element && "nodeType" in n2;
const e$9 = function(e2) {
  if (!(e2 && e2 instanceof Element && e2.offsetParent)) return false;
  let n2 = false, i2 = false;
  if (e2.scrollWidth > e2.clientWidth) {
    const i3 = window.getComputedStyle(e2).overflowX, t2 = -1 !== i3.indexOf("hidden"), o2 = -1 !== i3.indexOf("clip"), d2 = -1 !== i3.indexOf("visible");
    n2 = !t2 && !o2 && !d2;
  }
  if (e2.scrollHeight > e2.clientHeight) {
    const n3 = window.getComputedStyle(e2).overflowY, t2 = -1 !== n3.indexOf("hidden"), o2 = -1 !== n3.indexOf("clip"), d2 = -1 !== n3.indexOf("visible");
    i2 = !t2 && !o2 && !d2;
  }
  return n2 || i2;
}, n$8 = function(i2, t2 = void 0) {
  return !i2 || i2 === document.body || t2 && i2 === t2 ? null : e$9(i2) ? i2 : n$8(i2.parentElement, t2);
};
const e$8 = function(e2) {
  var t2 = new DOMParser().parseFromString(e2, "text/html").body;
  if (t2.childElementCount > 1) {
    for (var n2 = document.createElement("div"); t2.firstChild; ) n2.appendChild(t2.firstChild);
    return n2;
  }
  let r2 = t2.firstChild;
  return !r2 || r2 instanceof HTMLElement ? r2 : ((n2 = document.createElement("div")).appendChild(r2), n2);
};
const t$6 = function(t2 = 0, n2 = 0, a2 = 0) {
  return Math.max(Math.min(n2, a2), t2);
};
const t$5 = (t2) => "object" == typeof t2 && null !== t2 && t2.constructor === Object && "[object Object]" === Object.prototype.toString.call(t2);
function e$7(e2) {
  return t$5(e2) || Array.isArray(e2);
}
function n$7(t2, r2) {
  const o2 = Object.keys(t2), c2 = Object.keys(r2);
  return o2.length === c2.length && o2.every(((o3) => {
    const c3 = t2[o3], i2 = r2[o3];
    return "function" == typeof c3 ? `${c3}` == `${i2}` : e$7(c3) && e$7(i2) ? n$7(c3, i2) : c3 === i2;
  }));
}
const e$6 = function(n2) {
  for (const t2 of s$9) t2.getState() === i$7.Running && t2.tick(a$6 ? n2 - a$6 : 0);
  a$6 = n2, u$3 = window.requestAnimationFrame(e$6);
};
var i$7, o$7, r$5;
!(function(n2) {
  n2[n2.Initializing = 0] = "Initializing", n2[n2.Running = 1] = "Running", n2[n2.Paused = 2] = "Paused", n2[n2.Completed = 3] = "Completed", n2[n2.Destroyed = 4] = "Destroyed";
})(i$7 || (i$7 = {})), (function(n2) {
  n2[n2.Spring = 0] = "Spring", n2[n2.Ease = 1] = "Ease";
})(o$7 || (o$7 = {})), (function(n2) {
  n2[n2.Loop = 0] = "Loop", n2[n2.Reverse = 1] = "Reverse";
})(r$5 || (r$5 = {}));
const s$9 = /* @__PURE__ */ new Set();
let u$3 = null, a$6 = 0;
function c$3() {
  let a2 = i$7.Initializing, f2 = o$7.Ease, l2 = 0, g = 0, p2 = c$3.Easings.Linear, m2 = 500, d2 = 0, b2 = 0, S = 0, h2 = 0, y2 = 1 / 0, E2 = 0.01, R2 = 0.01, M2 = false, j2 = {}, w2 = null, v2 = {}, O2 = {}, C = {}, L = 0, I2 = 0, D2 = r$5.Loop, z2 = c$3.Easings.Linear;
  const N2 = /* @__PURE__ */ new Map();
  function V(n2, ...t2) {
    for (const e2 of N2.get(n2) || []) e2(...t2);
  }
  function q2(n2) {
    return g = 0, n2 ? w2 = setTimeout((() => {
      x2();
    }), n2) : x2(), F;
  }
  function x2() {
    a2 = i$7.Running, V("start", v2, O2);
  }
  function A2() {
    if (a2 = i$7.Completed, C = {}, V("end", v2), a2 === i$7.Completed) if (l2 < L) {
      if (l2++, D2 === r$5.Reverse) {
        const n2 = Object.assign({}, j2);
        j2 = Object.assign({}, O2), O2 = n2;
      }
      q2(I2);
    } else l2 = 0;
    return F;
  }
  const F = { getState: function() {
    return a2;
  }, easing: function(n2) {
    return p2 = n2, f2 = o$7.Ease, C = {}, F;
  }, duration: function(n2) {
    return m2 = n2, F;
  }, spring: function(n2 = {}) {
    f2 = o$7.Spring;
    const t2 = { velocity: 0, mass: 1, tension: 170, friction: 26, restDelta: 0.1, restSpeed: 0.1, maxSpeed: 1 / 0, clamp: true }, { velocity: e2, mass: i2, tension: r2, friction: s2, restDelta: u2, restSpeed: a3, maxSpeed: c2, clamp: l3 } = Object.assign(Object.assign({}, t2), n2);
    return d2 = e2, b2 = i2, S = r2, h2 = s2, R2 = u2, E2 = a3, y2 = c2, M2 = l3, C = {}, F;
  }, isRunning: function() {
    return a2 === i$7.Running;
  }, isSpring: function() {
    return f2 === o$7.Spring;
  }, from: function(n2) {
    return v2 = Object.assign({}, n2), F;
  }, to: function(n2) {
    return O2 = n2, F;
  }, repeat: function(n2, t2 = 0, e2 = r$5.Loop, i2) {
    return L = n2, I2 = t2, D2 = e2, z2 = i2 || p2, F;
  }, on: function(n2, t2) {
    var e2, i2;
    return e2 = n2, i2 = t2, N2.set(e2, [...N2.get(e2) || [], i2]), F;
  }, off: function(n2, t2) {
    var e2, i2;
    return e2 = n2, i2 = t2, N2.has(e2) && N2.set(e2, N2.get(e2).filter(((n3) => n3 !== i2))), F;
  }, start: function(n2) {
    return n$7(v2, O2) || (a2 = i$7.Initializing, j2 = Object.assign({}, v2), s$9.add(this), u$3 || (u$3 = window.requestAnimationFrame(e$6)), q2(n2)), F;
  }, pause: function() {
    return w2 && (clearTimeout(w2), w2 = null), a2 === i$7.Running && (a2 = i$7.Paused, V("pause", v2)), F;
  }, end: A2, tick: function(e2) {
    e2 > 50 && (e2 = 50), g += e2;
    let s2 = 0, u2 = false;
    if (a2 !== i$7.Running) return F;
    if (f2 === o$7.Ease) {
      s2 = t$6(0, g / m2, 1), u2 = 1 === s2;
      const t2 = D2 === r$5.Reverse ? z2 : p2;
      for (const n2 in v2) v2[n2] = j2[n2] + (O2[n2] - j2[n2]) * t2(s2);
    }
    if (f2 === o$7.Spring) {
      const t2 = 1e-3 * e2;
      let i2 = 0;
      for (const e3 in v2) {
        const o2 = O2[e3];
        let r2 = v2[e3];
        if ("number" != typeof o2 || isNaN(o2) || "number" != typeof r2 || isNaN(r2)) continue;
        if (Math.abs(o2 - r2) <= R2) {
          v2[e3] = o2, C[e3] = 0;
          continue;
        }
        C[e3] || ("object" == typeof d2 && "number" == typeof d2[e3] ? C[e3] = d2[e3] : C[e3] = "number" == typeof d2 ? d2 : 0);
        let s3 = C[e3];
        s3 = t$6(-1 * Math.abs(y2), s3, Math.abs(y2));
        const u3 = s3 * b2 * h2;
        s3 += ((r2 > o2 ? -1 : 1) * (Math.abs(o2 - r2) * S) - u3) / b2 * t2, r2 += s3 * t2;
        const a3 = v2[e3] > o2 ? r2 < o2 : r2 > o2;
        let c3 = Math.abs(s3) < E2 && Math.abs(o2 - r2) <= R2;
        M2 && a3 && (c3 = true), c3 ? (r2 = o2, s3 = 0) : i2++, v2[e3] = r2, C[e3] = s3;
      }
      u2 = !i2;
    }
    const c2 = Object.assign({}, O2);
    return V("step", v2, j2, O2, s2), u2 && a2 === i$7.Running && n$7(O2, c2) && (a2 = i$7.Completed, A2()), F;
  }, getStartValues: function() {
    return j2;
  }, getCurrentValues: function() {
    return v2;
  }, getCurrentVelocities: function() {
    return C;
  }, getEndValues: function() {
    return O2;
  }, destroy: function() {
    a2 = i$7.Destroyed, w2 && (clearTimeout(w2), w2 = null), j2 = v2 = O2 = {}, s$9.delete(this);
  } };
  return F;
}
c$3.destroy = () => {
  for (const n2 of s$9) n2.destroy();
  u$3 && (cancelAnimationFrame(u$3), u$3 = null);
}, c$3.Easings = { Linear: function(n2) {
  return n2;
}, EaseIn: function(n2) {
  return 0 === n2 ? 0 : Math.pow(2, 10 * n2 - 10);
}, EaseOut: function(n2) {
  return 1 === n2 ? 1 : 1 - Math.pow(2, -10 * n2);
}, EaseInOut: function(n2) {
  return 0 === n2 ? 0 : 1 === n2 ? 1 : n2 < 0.5 ? Math.pow(2, 20 * n2 - 10) / 2 : (2 - Math.pow(2, -20 * n2 + 10)) / 2;
} };
function e$5(e2) {
  return "undefined" != typeof TouchEvent && e2 instanceof TouchEvent;
}
function t$4(t2, n2) {
  const o2 = [], s2 = e$5(t2) ? t2[n2] : t2 instanceof MouseEvent && ("changedTouches" === n2 || "mouseup" !== t2.type) ? [t2] : [];
  for (const e2 of s2) o2.push({ x: e2.clientX, y: e2.clientY, ts: Date.now() });
  return o2;
}
function n$6(e2) {
  return t$4(e2, "touches");
}
function o$6(e2) {
  return t$4(e2, "targetTouches");
}
function s$8(e2) {
  return t$4(e2, "changedTouches");
}
function i$6(e2) {
  const t2 = e2[0], n2 = e2[1] || t2;
  return { x: (t2.x + n2.x) / 2, y: (t2.y + n2.y) / 2, ts: n2.ts };
}
function r$4(e2) {
  const t2 = e2[0], n2 = e2[1] || e2[0];
  return t2 && n2 ? -1 * Math.sqrt((n2.x - t2.x) * (n2.x - t2.x) + (n2.y - t2.y) * (n2.y - t2.y)) : 0;
}
const c$2 = (e2) => {
  e2.cancelable && e2.preventDefault();
}, a$5 = { passive: false }, u$2 = { panThreshold: 5, swipeThreshold: 3, ignore: ["textarea", "input", "select", "[contenteditable]", "[data-selectable]", "[data-draggable]"] };
let l$6 = false, d$1 = true;
const f$1 = (e2, t2) => {
  let f2, h2, v2, g = Object.assign(Object.assign({}, u$2), t2), p2 = [], m2 = [], E2 = [], w2 = false, y2 = false, T = false, b2 = false, M2 = 0, x2 = 0, L = 0, P = 0, D2 = 0, X = 0, Y = 0, j2 = 0, k2 = 0, R2 = [], z2 = 0, A2 = 0;
  const O2 = /* @__PURE__ */ new Map();
  function S(e3) {
    const t3 = r$4(m2), n2 = r$4(E2), o2 = t3 && n2 ? t3 / n2 : 0, s2 = Math.abs(Y) > Math.abs(j2) ? Y : j2, i2 = { srcEvent: f2, isPanRecognized: w2, isSwipeRecognized: y2, firstTouch: p2, previousTouch: E2, currentTouch: m2, deltaX: L, deltaY: P, offsetX: D2, offsetY: X, velocityX: Y, velocityY: j2, velocity: s2, angle: k2, axis: v2, scale: o2, center: h2 };
    for (const t4 of O2.get(e3) || []) t4(i2);
  }
  function q2(e3) {
    const t3 = e3.target, n2 = e3.composedPath()[0], o2 = g.ignore.join(","), s2 = (e4) => e4 && (e4.matches(o2) || e4.closest(o2));
    if (s2(t3) || s2(n2)) return false;
  }
  function C(e3) {
    const t3 = Date.now();
    if (R2 = R2.filter(((e4) => !e4.ts || e4.ts > t3 - 100)), e3 && R2.push(e3), Y = 0, j2 = 0, R2.length > 3) {
      const e4 = R2[0], t4 = R2[R2.length - 1];
      if (e4 && t4) {
        const n2 = t4.x - e4.x, o2 = t4.y - e4.y, s2 = e4.ts && t4.ts ? t4.ts - e4.ts : 0;
        s2 > 0 && (Y = Math.abs(n2) > 3 ? n2 / (s2 / 30) : 0, j2 = Math.abs(o2) > 3 ? o2 / (s2 / 30) : 0);
      }
    }
  }
  function I2(e3) {
    if (false === q2(e3)) return;
    if ("undefined" != typeof MouseEvent && e3 instanceof MouseEvent) {
      if (l$6) return;
    } else l$6 = true;
    if ("undefined" != typeof MouseEvent && e3 instanceof MouseEvent) {
      if (!e3.buttons || 0 !== e3.button) return;
      c$2(e3);
    }
    e3 instanceof MouseEvent && (window.addEventListener("mousemove", B2), window.addEventListener("mouseup", F)), window.addEventListener("blur", G), f2 = e3, m2 = o$6(e3), p2 = [...m2], E2 = [], x2 = m2.length, h2 = i$6(m2), 1 === x2 && (w2 = false, y2 = false, T = false), x2 && C(i$6(m2));
    const t3 = Date.now(), n2 = t3 - (M2 || t3);
    b2 = n2 > 0 && n2 <= 250 && 1 === x2, M2 = t3, clearTimeout(z2), S("start");
  }
  function B2(e3) {
    var t3;
    if (!p2.length) return;
    if (e3.defaultPrevented) return;
    if (false === q2(e3)) return;
    f2 = e3, E2 = [...m2], m2 = n$6(e3);
    const o2 = i$6(E2), s2 = i$6(n$6(e3));
    if (C(s2), x2 = m2.length, h2 = s2, E2.length === m2.length ? (L = s2.x - o2.x, P = s2.y - o2.y) : (L = 0, P = 0), p2.length) {
      const e4 = i$6(p2);
      D2 = s2.x - e4.x, X = s2.y - e4.y;
    }
    if (m2.length > 1) {
      const e4 = r$4(m2), t4 = r$4(E2);
      Math.abs(e4 - t4) >= 0.1 && (T = true, S("pinch"));
    }
    w2 || (w2 = Math.abs(D2) > g.panThreshold || Math.abs(X) > g.panThreshold, w2 && (d$1 = false, clearTimeout(A2), A2 = 0, k2 = Math.abs(180 * Math.atan2(X, D2) / Math.PI), v2 = k2 > 45 && k2 < 135 ? "y" : "x", p2 = [...m2], E2 = [...m2], D2 = 0, X = 0, L = 0, P = 0, null === (t3 = window.getSelection()) || void 0 === t3 || t3.removeAllRanges(), S("panstart"))), w2 && (L || P) && S("pan"), S("move");
  }
  function F(e3) {
    if (f2 = e3, !p2.length) return;
    const t3 = o$6(e3), n2 = s$8(e3);
    if (x2 = t3.length, h2 = i$6(n2), n2.length && C(i$6(n2)), E2 = [...m2], m2 = [...t3], p2 = [...t3], x2 > 0) S("end"), w2 = false, y2 = false, R2 = [];
    else {
      const e4 = g.swipeThreshold;
      (Math.abs(Y) > e4 || Math.abs(j2) > e4) && (y2 = true), w2 && S("panend"), y2 && S("swipe"), w2 || y2 || T || (S("tap"), b2 ? S("doubleTap") : z2 = setTimeout((function() {
        S("singleTap");
      }), 250)), S("end"), H2();
    }
  }
  function G() {
    clearTimeout(z2), H2(), w2 && S("panend"), S("end");
  }
  function H2() {
    l$6 = false, w2 = false, y2 = false, b2 = false, x2 = 0, R2 = [], m2 = [], E2 = [], p2 = [], L = 0, P = 0, D2 = 0, X = 0, Y = 0, j2 = 0, k2 = 0, v2 = void 0, window.removeEventListener("mousemove", B2), window.removeEventListener("mouseup", F), window.removeEventListener("blur", G), d$1 || A2 || (A2 = setTimeout((() => {
      d$1 = true, A2 = 0;
    }), 100));
  }
  function J(e3) {
    const t3 = e3.target;
    l$6 = false, t3 && !e3.defaultPrevented && (d$1 || (c$2(e3), e3.stopPropagation()));
  }
  const K = { init: function() {
    return e2 && (e2.addEventListener("click", J, a$5), e2.addEventListener("mousedown", I2, a$5), e2.addEventListener("touchstart", I2, a$5), e2.addEventListener("touchmove", B2, a$5), e2.addEventListener("touchend", F), e2.addEventListener("touchcancel", F)), K;
  }, on: function(e3, t3) {
    return (function(e4, t4) {
      O2.set(e4, [...O2.get(e4) || [], t4]);
    })(e3, t3), K;
  }, off: function(e3, t3) {
    return O2.has(e3) && O2.set(e3, O2.get(e3).filter(((e4) => e4 !== t3))), K;
  }, isPointerDown: () => x2 > 0, destroy: function() {
    clearTimeout(z2), clearTimeout(A2), A2 = 0, e2 && (e2.removeEventListener("click", J, a$5), e2.removeEventListener("mousedown", I2, a$5), e2.removeEventListener("touchstart", I2, a$5), e2.removeEventListener("touchmove", B2, a$5), e2.removeEventListener("touchend", F), e2.removeEventListener("touchcancel", F)), e2 = null, H2();
  } };
  return K;
};
f$1.isClickAllowed = () => d$1;
const e$4 = { IMAGE_ERROR: "This image couldn't be loaded. <br /> Please try again later.", MOVE_UP: "Move up", MOVE_DOWN: "Move down", MOVE_LEFT: "Move left", MOVE_RIGHT: "Move right", ZOOM_IN: "Zoom in", ZOOM_OUT: "Zoom out", TOGGLE_FULL: "Toggle zoom level", TOGGLE_1TO1: "Toggle zoom level", ITERATE_ZOOM: "Toggle zoom level", ROTATE_CCW: "Rotate counterclockwise", ROTATE_CW: "Rotate clockwise", FLIP_X: "Flip horizontally", FLIP_Y: "Flip vertically", RESET: "Reset", TOGGLE_FS: "Toggle fullscreen" };
const s$7 = (s2, t2 = "") => {
  s2 && s2.classList && t2.split(" ").forEach(((t3) => {
    t3 && s2.classList.add(t3);
  }));
};
const s$6 = (s2, t2 = "") => {
  s2 && s2.classList && t2.split(" ").forEach(((t3) => {
    t3 && s2.classList.remove(t3);
  }));
};
const s$5 = (s2, t2 = "", c2) => {
  s2 && s2.classList && t2.split(" ").forEach(((t3) => {
    t3 && s2.classList.toggle(t3, c2 || false);
  }));
};
const h$1 = (e2) => {
  e2.cancelable && e2.preventDefault();
}, m$1 = (e2, t2 = 1e4) => (e2 = parseFloat(e2 + "") || 0, Math.round((e2 + Number.EPSILON) * t2) / t2), p = (e2) => e2 instanceof HTMLImageElement;
var v$1, b$1;
!(function(e2) {
  e2.Reset = "reset", e2.Zoom = "zoom", e2.ZoomIn = "zoomIn", e2.ZoomOut = "zoomOut", e2.ZoomTo = "zoomTo", e2.ToggleCover = "toggleCover", e2.ToggleFull = "toggleFull", e2.ToggleMax = "toggleMax", e2.IterateZoom = "iterateZoom", e2.Pan = "pan", e2.Swipe = "swipe", e2.Move = "move", e2.MoveLeft = "moveLeft", e2.MoveRight = "moveRight", e2.MoveUp = "moveUp", e2.MoveDown = "moveDown", e2.RotateCCW = "rotateCCW", e2.RotateCW = "rotateCW", e2.FlipX = "flipX", e2.FlipY = "flipY", e2.ToggleFS = "toggleFS";
})(v$1 || (v$1 = {})), (function(e2) {
  e2.Cover = "cover", e2.Full = "full", e2.Max = "max";
})(b$1 || (b$1 = {}));
const y$1 = { x: 0, y: 0, scale: 1, angle: 0, flipX: 1, flipY: 1 }, x = { bounds: true, classes: { container: "f-panzoom", wrapper: "f-panzoom__wrapper", content: "f-panzoom__content", viewport: "f-panzoom__viewport" }, clickAction: v$1.ToggleFull, dblClickAction: false, gestures: {}, height: "auto", l10n: e$4, maxScale: 4, minScale: 1, mouseMoveFactor: 1, panMode: "drag", protected: false, singleClickAction: false, spinnerTpl: '<div class="f-spinner"></div>', wheelAction: v$1.Zoom, width: "auto" };
let w, M$1 = 0, k$1 = 0, j = 0;
const E$1 = (c2, b2 = {}, E2 = {}) => {
  let S, O2, A2, C, T, F, Z, L, P = 0, X = Object.assign(Object.assign({}, x), b2), Y = {}, R2 = Object.assign({}, y$1), z2 = Object.assign({}, y$1);
  const D2 = [];
  function I2(e2) {
    let t2 = X[e2];
    return t2 && "function" == typeof t2 ? t2(je) : t2;
  }
  function W() {
    return c2 && c2.parentElement && S && 3 === P;
  }
  const q2 = /* @__PURE__ */ new Map();
  function H2(e2, ...t2) {
    const n2 = [...q2.get(e2) || []];
    X.on && n2.push(X.on[e2]);
    for (const e3 of n2) e3 && e3 instanceof Function && e3(je, ...t2);
    "*" !== e2 && H2("*", e2, ...t2);
  }
  function $(e2) {
    if (!W()) return;
    const t2 = e2.target;
    if (n$8(t2)) return;
    const o2 = Date.now(), a2 = [-e2.deltaX || 0, -e2.deltaY || 0, -e2.detail || 0].reduce((function(e3, t3) {
      return Math.abs(t3) > Math.abs(e3) ? t3 : e3;
    })), s2 = t$6(-1, a2, 1);
    H2("wheel", e2, s2);
    const r2 = I2("wheelAction");
    if (!r2) return;
    if (e2.defaultPrevented) return;
    const l2 = z2.scale;
    let c3 = l2 * (s2 > 0 ? 1.5 : 0.5);
    if (r2 === v$1.Zoom) {
      const t3 = Math.abs(e2.deltaY) < 100 && Math.abs(e2.deltaX) < 100;
      if (o2 - k$1 < (t3 ? 200 : 45)) return void h$1(e2);
      k$1 = o2;
      const n2 = ne(), a3 = se();
      if (m$1(c3) < m$1(n2) && m$1(l2) <= m$1(n2) ? (j += Math.abs(s2), c3 = n2) : m$1(c3) > m$1(a3) && m$1(l2) >= m$1(a3) ? (j += Math.abs(s2), c3 = a3) : (j = 0, c3 = t$6(n2, c3, a3)), j > 7) return;
    }
    switch (h$1(e2), r2) {
      case v$1.Pan:
        ue(r2, { srcEvent: e2, deltaX: 2 * -e2.deltaX, deltaY: 2 * -e2.deltaY });
        break;
      case v$1.Zoom:
        ue(v$1.ZoomTo, { srcEvent: e2, scale: c3, center: { x: e2.clientX, y: e2.clientY } });
        break;
      default:
        ue(r2, { srcEvent: e2 });
    }
  }
  function _2(e2) {
    var n2, o2;
    const i2 = e2.composedPath()[0];
    if (!f$1.isClickAllowed()) return;
    if (!n$9(i2) || e2.defaultPrevented) return;
    if (!(null == c2 ? void 0 : c2.contains(i2))) return;
    if (i2.hasAttribute("disabled") || i2.hasAttribute("aria-disabled") || i2.hasAttribute("data-carousel-go-prev") || i2.hasAttribute("data-carousel-go-next")) return;
    const a2 = i2.closest("[data-panzoom-action]"), s2 = null === (n2 = null == a2 ? void 0 : a2.dataset) || void 0 === n2 ? void 0 : n2.panzoomAction, r2 = (null === (o2 = null == a2 ? void 0 : a2.dataset) || void 0 === o2 ? void 0 : o2.panzoomValue) || "";
    if (s2) {
      switch (h$1(e2), s2) {
        case v$1.ZoomTo:
        case v$1.ZoomIn:
        case v$1.ZoomOut:
          ue(s2, { scale: parseFloat(r2 || "") || void 0 });
          break;
        case v$1.MoveLeft:
        case v$1.MoveRight:
          ue(s2, { deltaX: parseFloat(r2 || "") || void 0 });
          break;
        case v$1.MoveUp:
        case v$1.MoveDown:
          ue(s2, { deltaY: parseFloat(r2 || "") || void 0 });
          break;
        case v$1.ToggleFS:
          Me();
          break;
        default:
          ue(s2);
      }
      return;
    }
    if (!(null == S ? void 0 : S.contains(i2))) return;
    const u2 = { srcEvent: e2 };
    if (ue(I2("clickAction"), u2), I2("dblClickAction")) {
      const e3 = Date.now(), t2 = e3 - (M$1 || e3);
      M$1 = e3, t2 > 0 && t2 <= 250 ? (w && (clearTimeout(w), w = void 0), ue(I2("dblClickAction"), u2)) : w = setTimeout((() => {
        ue(I2("singleClickAction"), u2);
      }), 250);
    }
  }
  function B2(e2) {
    if (L = e2, !W() || !Q()) return;
    if (R2.scale <= 1 || z2.scale <= 1) return;
    if (((null == S ? void 0 : S.dataset.animationName) || "").indexOf("zoom") > -1) return;
    const t2 = ee(z2.scale);
    if (!t2) return;
    const { x: n2, y: o2 } = t2;
    ue(v$1.Pan, { deltaX: n2 - z2.x, deltaY: o2 - z2.y });
  }
  function N2() {
    var e2;
    c2 && (s$6(c2, "is-loading"), null === (e2 = c2.querySelector(".f-spinner")) || void 0 === e2 || e2.remove());
  }
  function V() {
    if (!c2 || !O2) return;
    if (N2(), p(O2) && (!O2.complete || !O2.naturalWidth)) return P = 2, null == S || S.classList.add("has-error"), void H2("error");
    H2("loaded");
    const { width: e2, height: t2 } = J();
    p(O2) && (O2.setAttribute("width", e2 + ""), O2.setAttribute("height", t2 + "")), S && (s$6(S, "has-error"), p(O2) && (S.setAttribute("width", e2 + ""), S.setAttribute("height", t2 + ""), S.style.aspectRatio = `${e2 / t2 || ""}`)), F = c$3().on("start", ((e3, t3) => {
      void 0 !== t3.angle && (t3.angle = 90 * Math.round(t3.angle / 90)), void 0 !== t3.flipX && (t3.flipX = t3.flipX > 0 ? 1 : -1), void 0 !== t3.flipY && (t3.flipY = t3.flipY > 0 ? 1 : -1), z2 = Object.assign(Object.assign({}, y$1), t3), ce(), H2("animationStart");
    })).on("pause", ((e3) => {
      z2 = Object.assign(Object.assign({}, y$1), e3);
    })).on("step", ((e3) => {
      if (!W()) return void (null == F || F.end());
      if (R2 = Object.assign(Object.assign({}, y$1), e3), Q() || !I2("bounds") || ye() || z2.scale > R2.scale || z2.scale < oe()) return void de();
      const t3 = re(z2.scale);
      let n3 = false, o2 = false, a2 = false, s2 = false;
      R2.x < t3.x[0] && (n3 = true), R2.x > t3.x[1] && (o2 = true), R2.y < t3.y[0] && (s2 = true), R2.y > t3.y[1] && (a2 = true);
      let r2 = false, l2 = false, c3 = false, u2 = false;
      z2.x < t3.x[0] && (r2 = true), z2.x > t3.x[1] && (l2 = true), z2.y < t3.y[0] && (u2 = true), z2.y > t3.y[1] && (c3 = true);
      let d2 = false;
      (o2 && l2 || n3 && r2) && (z2.x = t$6(t3.x[0], z2.x, t3.x[1]), d2 = true), (a2 && c3 || s2 && u2) && (z2.y = t$6(t3.y[0], z2.y, t3.y[1]), d2 = true), d2 && F && F.spring({ tension: 94, friction: 17, maxSpeed: 555 * z2.scale, restDelta: 0.1, restSpeed: 0.1, velocity: F.getCurrentVelocities() }).from(R2).to(z2).start(), de();
    })).on("end", (() => {
      (null == T ? void 0 : T.isPointerDown()) || le(), (null == F ? void 0 : F.isRunning()) || (ce(), H2("animationEnd"));
    })), (function() {
      const e3 = I2("gestures");
      if (!e3) return;
      if (!C || !O2) return;
      let t3 = false;
      T = f$1(C, e3).on("start", ((e4) => {
        if (!I2("gestures")) return;
        if (!F) return;
        if (!W() || Q()) return;
        const n3 = e4.srcEvent;
        (R2.scale > 1 || e4.currentTouch.length > 1) && (null == n3 || n3.stopPropagation(), F.pause(), t3 = true), 1 === e4.currentTouch.length && H2("touchStart");
      })).on("move", ((e4) => {
        var n3;
        t3 && (1 !== z2.scale || e4.currentTouch.length > 1) && (h$1(e4.srcEvent), null === (n3 = e4.srcEvent) || void 0 === n3 || n3.stopPropagation());
      })).on("pan", ((e4) => {
        if (!t3) return;
        const n3 = e4.srcEvent;
        (1 !== z2.scale || e4.currentTouch.length > 1) && (h$1(n3), ue(v$1.Pan, e4));
      })).on("swipe", ((e4) => {
        t3 && z2.scale > 1 && ue(v$1.Swipe, e4);
      })).on("tap", ((e4) => {
        H2("click", e4);
      })).on("singleTap", ((e4) => {
        H2("singleClick", e4);
      })).on("doubleTap", ((e4) => {
        H2("dblClick", e4);
      })).on("pinch", ((e4) => {
        t3 && (e4.scale > oe() ? ue(v$1.ZoomIn, e4) : e4.scale < oe() ? ue(v$1.ZoomOut, e4) : ue(v$1.Pan, e4));
      })).on("end", ((e4) => {
        t3 && (e4.currentTouch.length ? (e4.srcEvent.stopPropagation(), h$1(e4.srcEvent), null == F || F.end()) : (t3 = false, ce(), le(), H2("touchEnd")));
      })).init();
    })(), C && (C.addEventListener("wheel", $, { passive: false }), D2.push((() => {
      null == C || C.removeEventListener("wheel", $, { passive: false });
    }))), null == c2 || c2.addEventListener("click", _2), null === document || void 0 === document || document.addEventListener("mousemove", B2), D2.push((() => {
      null == c2 || c2.removeEventListener("click", _2), null === document || void 0 === document || document.removeEventListener("mousemove", B2);
    }));
    const n2 = U();
    R2 = Object.assign({}, n2), z2 = Object.assign({}, n2), P = 3, de(), ce(), H2("ready"), requestAnimationFrame((() => {
      N2(), C && (C.style.visibility = "");
    }));
  }
  function U() {
    const e2 = Object.assign({}, I2("startPos") || {});
    let t2 = e2.scale, n2 = 1;
    n2 = "string" == typeof t2 ? te(t2) : "number" == typeof t2 ? t2 : oe();
    const o2 = Object.assign(Object.assign(Object.assign({}, y$1), e2), { scale: n2 }), i2 = Q() ? ee(n2) : void 0;
    if (i2) {
      const { x: e3, y: t3 } = i2;
      o2.x = e3, o2.y = t3;
    }
    return o2;
  }
  function G() {
    const e2 = { top: 0, left: 0, width: 0, height: 0 };
    if (S) {
      const t2 = S.getBoundingClientRect();
      z2.angle % 180 == 90 ? (e2.top = t2.top + 0.5 * t2.height - 0.5 * t2.width, e2.left = t2.left + 0.5 * t2.width - 0.5 * t2.height, e2.width = t2.height, e2.height = t2.width) : (e2.top = t2.top, e2.left = t2.left, e2.width = t2.width, e2.height = t2.height);
    }
    return e2;
  }
  function J() {
    let t2 = I2("width"), n2 = I2("height");
    if (O2 && "auto" === t2) {
      const e2 = O2.getAttribute("width");
      t2 = e2 ? parseFloat(e2 + "") : void 0 !== O2.dataset.width ? parseFloat(O2.dataset.width + "") : p(C) ? C.naturalWidth : p(O2) ? O2.naturalWidth : (null == S ? void 0 : S.getBoundingClientRect().width) || 0;
    } else t2 = t$7(t2) ? parseFloat(t2) : t2;
    if (O2 && "auto" === n2) {
      const e2 = O2.getAttribute("height");
      n2 = e2 ? parseFloat(e2 + "") : void 0 !== O2.dataset.height ? parseFloat(O2.dataset.height + "") : p(C) ? C.naturalHeight : p(O2) ? O2.naturalHeight : (null == S ? void 0 : S.getBoundingClientRect().height) || 0;
    } else n2 = t$7(n2) ? parseFloat(n2) : n2;
    return { width: t2, height: n2 };
  }
  function K() {
    const e2 = G();
    return { width: e2.width, height: e2.height };
  }
  function Q() {
    return "mousemove" === I2("panMode") && matchMedia("(hover: hover)").matches;
  }
  function ee(e2) {
    const t2 = L || I2("event"), n2 = null == S ? void 0 : S.getBoundingClientRect();
    if (!t2 || !n2 || e2 <= 1) return { x: 0, y: 0 };
    const o2 = (t2.clientX || 0) - n2.left, a2 = (t2.clientY || 0) - n2.top, { width: s2, height: r2 } = K(), l2 = re(e2);
    if (e2 > 1) {
      const t3 = I2("mouseMoveFactor");
      t3 > 1 && (e2 *= t3);
    }
    let c3 = s2 * e2, u2 = r2 * e2, d2 = 0.5 * (c3 - s2) - o2 / s2 * 100 / 100 * (c3 - s2), f2 = 0.5 * (u2 - r2) - a2 / r2 * 100 / 100 * (u2 - r2);
    return d2 = t$6(l2.x[0], d2, l2.x[1]), f2 = t$6(l2.y[0], f2, l2.y[1]), { x: d2, y: f2 };
  }
  function te(e2 = "base") {
    if (!c2) return 1;
    const t2 = c2.getBoundingClientRect(), n2 = G(), { width: o2, height: a2 } = J(), s2 = (e3) => {
      if ("number" == typeof e3) return e3;
      switch (e3) {
        case "min":
        case "base":
          return 1;
        case "cover":
          return Math.max(t2.height / n2.height, t2.width / n2.width) || 1;
        case "full":
        case "max": {
          const e4 = z2.angle % 180 == 90 ? a2 : o2;
          return e4 && n2.width ? e4 / n2.width : 1;
        }
      }
    }, r2 = I2("minScale"), l2 = I2("maxScale"), u2 = Math.min(s2("full"), s2(r2)), d2 = "number" == typeof l2 ? s2("full") * l2 : Math.min(s2("full"), s2(l2));
    switch (e2) {
      case "min":
        return u2;
      case "base":
        return t$6(u2, 1, d2);
      case "cover":
        return s2("cover");
      case "full":
        return Math.min(d2, s2("full"));
      case "max":
        return d2;
    }
  }
  function ne() {
    return te("min");
  }
  function oe() {
    return te("base");
  }
  function ie() {
    return te("cover");
  }
  function ae() {
    return te("full");
  }
  function se() {
    return te("max");
  }
  function re(e2) {
    const t2 = { x: [0, 0], y: [0, 0] }, n2 = null == c2 ? void 0 : c2.getBoundingClientRect();
    if (!n2) return t2;
    const o2 = G(), i2 = n2.width, a2 = n2.height;
    let s2 = o2.width, r2 = o2.height, l2 = e2 = void 0 === e2 ? z2.scale : e2, u2 = e2;
    if (Q() && e2 > 1) {
      const t3 = I2("mouseMoveFactor");
      t3 > 1 && (s2 * e2 > i2 + 0.01 && (l2 *= t3), r2 * e2 > a2 + 0.01 && (u2 *= t3));
    }
    return s2 *= l2, r2 *= u2, e2 > 1 && (s2 > i2 && (t2.x[0] = 0.5 * (i2 - s2), t2.x[1] = 0.5 * (s2 - i2)), t2.x[0] -= 0.5 * (o2.left - n2.left), t2.x[1] -= 0.5 * (o2.left - n2.left), t2.x[0] -= 0.5 * (o2.left + o2.width - n2.right), t2.x[1] -= 0.5 * (o2.left + o2.width - n2.right), r2 > a2 && (t2.y[0] = 0.5 * (a2 - r2), t2.y[1] = 0.5 * (r2 - a2)), t2.y[0] -= 0.5 * (o2.top - n2.top), t2.y[1] -= 0.5 * (o2.top - n2.top), t2.y[0] -= 0.5 * (o2.top + o2.height - n2.bottom), t2.y[1] -= 0.5 * (o2.top + o2.height - n2.bottom)), t2;
  }
  function le() {
    if (!W()) return;
    if (!I2("bounds")) return;
    if (!F) return;
    const e2 = ne(), t2 = se(), n2 = t$6(e2, z2.scale, t2);
    if (z2.scale < e2 - 0.01 || z2.scale > t2 + 0.01) return void ue(v$1.ZoomTo, { scale: n2 });
    if (F.isRunning()) return;
    if (ye()) return;
    const o2 = re(n2);
    z2.x < o2.x[0] || z2.x > o2.x[1] || z2.y < o2.y[0] || z2.y > o2.y[1] ? (z2.x = t$6(o2.x[0], z2.x, o2.x[1]), z2.y = t$6(o2.y[0], z2.y, o2.y[1]), F.spring({ tension: 170, friction: 17, restDelta: 1e-3, restSpeed: 1e-3, maxSpeed: 1 / 0, velocity: F.getCurrentVelocities() }), F.from(R2).to(z2).start()) : de();
  }
  function ce(e2) {
    var t2;
    if (!W()) return;
    const n2 = be(), o2 = ye(), i2 = xe(), a2 = we(), s2 = ge(), r2 = he();
    s$5(S, "is-fullsize", a2), s$5(S, "is-expanded", i2), s$5(S, "is-dragging", o2), s$5(S, "can-drag", n2), s$5(S, "will-zoom-in", s2), s$5(S, "will-zoom-out", r2);
    const l2 = pe(), u2 = ve(), d2 = me(), g = !W();
    for (const n3 of (null === (t2 = e2 || c2) || void 0 === t2 ? void 0 : t2.querySelectorAll("[data-panzoom-action]")) || []) {
      const e3 = n3.dataset.panzoomAction;
      let t3 = false;
      if (g) t3 = true;
      else switch (e3) {
        case v$1.ZoomIn:
          l2 || (t3 = true);
          break;
        case v$1.ZoomOut:
          d2 || (t3 = true);
          break;
        case v$1.ToggleFull: {
          u2 || d2 || (t3 = true);
          const e4 = n3.querySelector("g");
          e4 && (e4.style.display = a2 && !t3 ? "none" : "");
          break;
        }
        case v$1.IterateZoom: {
          l2 || d2 || (t3 = true);
          const e4 = n3.querySelector("g");
          e4 && (e4.style.display = l2 || t3 ? "" : "none");
          break;
        }
        case v$1.ToggleCover:
        case v$1.ToggleMax:
          l2 || d2 || (t3 = true);
      }
      t3 ? (n3.setAttribute("aria-disabled", ""), n3.setAttribute("tabindex", "-1")) : (n3.removeAttribute("aria-disabled"), n3.removeAttribute("tabindex"));
    }
  }
  function ue(e2, t2) {
    var n2;
    if (!(e2 && c2 && O2 && F && W())) return;
    if (e2 === v$1.Swipe && Math.abs(F.getCurrentVelocities().scale) > 0.01) return;
    const o2 = Object.assign({}, z2);
    let a2 = Object.assign({}, z2), l2 = re(Q() ? o2.scale : R2.scale);
    const u2 = F.getCurrentVelocities(), d2 = G(), f2 = ((null === (n2 = (t2 = t2 || {}).currentTouch) || void 0 === n2 ? void 0 : n2.length) || 0) > 1, h2 = t2.velocityX || 0, m2 = t2.velocityY || 0;
    let p2 = t2.center;
    t2.srcEvent && (p2 = i$6(s$8(t2.srcEvent)));
    let b3 = t2.deltaX || 0, x2 = t2.deltaY || 0;
    switch (e2) {
      case v$1.MoveRight:
        b3 = t2.deltaX || 100;
        break;
      case v$1.MoveLeft:
        b3 = t2.deltaX || -100;
        break;
      case v$1.MoveUp:
        x2 = t2.deltaY || -100;
        break;
      case v$1.MoveDown:
        x2 = t2.deltaY || 100;
    }
    let w2 = [];
    switch (e2) {
      case v$1.Reset:
        a2 = Object.assign({}, y$1), a2.scale = oe();
        break;
      case v$1.Pan:
      case v$1.Move:
      case v$1.MoveLeft:
      case v$1.MoveRight:
      case v$1.MoveUp:
      case v$1.MoveDown:
        if (ye()) {
          let e4 = 1, t3 = 1;
          a2.x <= l2.x[0] && h2 <= 0 && (e4 = Math.max(0.01, 1 - Math.abs(1 / d2.width * Math.abs(a2.x - l2.x[0]))), e4 *= 0.2), a2.x >= l2.x[1] && h2 >= 0 && (e4 = Math.max(0.01, 1 - Math.abs(1 / d2.width * Math.abs(a2.x - l2.x[1]))), e4 *= 0.2), a2.y <= l2.y[0] && m2 <= 0 && (t3 = Math.max(0.01, 1 - Math.abs(1 / d2.height * Math.abs(a2.y - l2.y[0]))), t3 *= 0.2), a2.y >= l2.y[1] && m2 >= 0 && (t3 = Math.max(0.01, 1 - Math.abs(1 / d2.height * Math.abs(a2.y - l2.y[1]))), t3 *= 0.2), a2.x += b3 * e4, a2.y += x2 * t3;
        } else a2.x = t$6(l2.x[0], a2.x + b3, l2.x[1]), a2.y = t$6(l2.y[0], a2.y + x2, l2.y[1]);
        break;
      case v$1.Swipe:
        const e3 = (e4 = 0) => Math.sign(e4) * Math.pow(Math.abs(e4), 1.5);
        a2.x += t$6(-1e3, e3(h2), 1e3), a2.y += t$6(-1e3, e3(m2), 1e3), m2 && !h2 && (a2.x = t$6(l2.x[0], a2.x, l2.x[1])), !m2 && h2 && (a2.y = t$6(l2.y[0], a2.y, l2.y[1])), u2.x = h2, u2.y = m2;
        break;
      case v$1.ZoomTo:
        a2.scale = t2.scale || 1;
        break;
      case v$1.ZoomIn:
        a2.scale = a2.scale * (t2.scale || 2), f2 || (a2.scale = Math.min(a2.scale, se()));
        break;
      case v$1.ZoomOut:
        a2.scale = a2.scale * (t2.scale || 0.5), f2 || (a2.scale = Math.max(a2.scale, ne()));
        break;
      case v$1.ToggleCover:
        w2 = [oe(), ie()];
        break;
      case v$1.ToggleFull:
        w2 = [oe(), ae()];
        break;
      case v$1.ToggleMax:
        w2 = [oe(), se()];
        break;
      case v$1.IterateZoom:
        w2 = [oe(), ae(), se()];
        break;
      case v$1.Zoom:
        const n3 = ae();
        a2.scale >= n3 - 0.05 ? a2.scale = oe() : a2.scale = Math.min(n3, a2.scale * (t2.scale || 2));
        break;
      case v$1.RotateCW:
        a2.angle += 90;
        break;
      case v$1.RotateCCW:
        a2.angle -= 90;
        break;
      case v$1.FlipX:
        a2.flipX *= -1;
        break;
      case v$1.FlipY:
        a2.flipY *= -1;
    }
    if (void 0 !== R2.angle && Math.abs(R2.angle) >= 360 && (a2.angle -= 360 * Math.floor(R2.angle / 360), R2.angle -= 360 * Math.floor(R2.angle / 360)), w2.length) {
      const e3 = w2.findIndex(((e4) => e4 > a2.scale + 1e-4));
      a2.scale = w2[e3] || w2[0];
    }
    if (f2 && (a2.scale = t$6(ne() * (f2 ? 0.8 : 1), a2.scale, se() * (f2 ? 1.6 : 1))), Q()) {
      const e3 = ee(a2.scale);
      if (e3) {
        const { x: t3, y: n3 } = e3;
        a2.x = t3, a2.y = n3;
      }
    } else if (Math.abs(a2.scale - o2.scale) > 1e-4) {
      let e3 = 0, t3 = 0;
      if (p2) e3 = p2.x, t3 = p2.y;
      else {
        const n4 = c2.getBoundingClientRect();
        e3 = n4.x + 0.5 * n4.width, t3 = n4.y + 0.5 * n4.height;
      }
      let n3 = e3 - d2.left, s2 = t3 - d2.top;
      n3 -= 0.5 * d2.width, s2 -= 0.5 * d2.height;
      const r2 = (n3 - o2.x) / o2.scale, u3 = (s2 - o2.y) / o2.scale;
      a2.x = n3 - r2 * a2.scale, a2.y = s2 - u3 * a2.scale, !f2 && I2("bounds") && (l2 = re(a2.scale), a2.x = t$6(l2.x[0], a2.x, l2.x[1]), a2.y = t$6(l2.y[0], a2.y, l2.y[1]));
    }
    if (e2 === v$1.Swipe) {
      let e3 = 94, t3 = 17, n3 = 500 * a2.scale, o3 = u2;
      F.spring({ tension: e3, friction: t3, maxSpeed: n3, restDelta: 0.1, restSpeed: 0.1, velocity: o3 });
    } else e2 === v$1.Pan || f2 ? F.spring({ tension: 900, friction: 17, restDelta: 0.01, restSpeed: 0.01, maxSpeed: 1 }) : F.spring({ tension: 170, friction: 17, restDelta: 1e-3, restSpeed: 1e-3, maxSpeed: 1 / 0, velocity: u2 });
    if (0 === t2.velocity || n$7(R2, a2)) R2 = Object.assign({}, a2), z2 = Object.assign({}, a2), F.end(), de(), ce();
    else {
      if (n$7(z2, a2)) return;
      F.from(R2).to(a2).start();
    }
    H2("action", e2);
  }
  function de() {
    if (!O2 || !S || !C) return;
    const { width: e2, height: t2 } = J();
    Object.assign(S.style, { maxWidth: `min(${e2}px, 100%)`, maxHeight: `min(${t2}px, 100%)` });
    const n2 = (function() {
      const { width: e3, height: t3 } = J(), { width: n3, height: o3 } = K();
      if (!c2) return { x: 0, y: 0, width: 0, height: 0, scale: 0, flipX: 0, flipY: 0, angle: 0, fitWidth: n3, fitHeight: o3, fullWidth: e3, fullHeight: t3 };
      let { x: i3, y: a3, scale: s3, angle: r3, flipX: l3, flipY: u3 } = R2, d3 = 1 / ae(), f3 = e3, g = t3, h2 = R2.scale * d3, m2 = z2.scale * d3;
      const p2 = Math.max(n3, o3), v2 = Math.min(n3, o3);
      e3 > t3 ? (f3 = p2, g = v2) : (f3 = v2, g = p2);
      h2 = e3 > t3 ? p2 * s3 / e3 || 1 : p2 * s3 / t3 || 1;
      let b3 = f3 ? e3 * m2 : 0, y2 = g ? t3 * m2 : 0, x2 = f3 && g ? e3 * h2 / b3 : 0;
      return i3 = i3 + 0.5 * f3 - 0.5 * b3, a3 = a3 + 0.5 * g - 0.5 * y2, { x: i3, y: a3, width: b3, height: y2, scale: x2, flipX: l3, flipY: u3, angle: r3, fitWidth: n3, fitHeight: o3, fullWidth: e3, fullHeight: t3 };
    })(), { x: o2, y: i2, width: a2, height: s2, scale: r2, angle: l2, flipX: u2, flipY: d2 } = n2;
    let f2 = `translate(${m$1(o2)}px, ${m$1(i2)}px)`;
    f2 += 1 !== u2 || 1 !== d2 ? ` scaleX(${m$1(r2 * u2)}) scaleY(${m$1(r2 * d2)})` : ` scale(${m$1(r2)})`, 0 !== l2 && (f2 += ` rotate(${l2}deg)`), C.style.width = `${m$1(a2)}px`, C.style.height = `${m$1(s2)}px`, C.style.transform = `${f2}`, H2("render");
  }
  function fe() {
    let e2 = z2.scale;
    const t2 = I2("clickAction");
    let n2 = oe();
    if (t2) {
      let o2 = [];
      switch (t2) {
        case v$1.ZoomIn:
          n2 = 2 * e2;
          break;
        case v$1.ZoomOut:
          n2 = 0.5 * e2;
          break;
        case v$1.ToggleCover:
          o2 = [oe(), ie()];
          break;
        case v$1.ToggleFull:
          o2 = [oe(), ae()];
          break;
        case v$1.ToggleMax:
          o2 = [oe(), se()];
          break;
        case v$1.IterateZoom:
          o2 = [oe(), ae(), se()];
          break;
        case v$1.Zoom:
          const t3 = ae();
          n2 = e2 >= t3 - 0.05 ? oe() : Math.min(t3, 2 * e2);
      }
      if (o2.length) {
        const t3 = o2.findIndex(((t4) => t4 > e2 + 1e-4));
        n2 = o2[t3] || oe();
      }
    }
    return n2 = t$6(ne(), n2, se()), n2;
  }
  function ge() {
    return !!(W() && fe() > z2.scale);
  }
  function he() {
    return !!(W() && fe() < z2.scale);
  }
  function me() {
    return !!(W() && z2.scale > ne());
  }
  function pe() {
    return !!(W() && z2.scale < se());
  }
  function ve() {
    return !!(W() && z2.scale < ae());
  }
  function be() {
    return !(!(W() && xe() && T) || Q());
  }
  function ye() {
    return !(!W() || !(null == T ? void 0 : T.isPointerDown()) || Q());
  }
  function xe() {
    return !!(W() && z2.scale > oe());
  }
  function we() {
    return !!(W() && z2.scale >= ae());
  }
  function Me() {
    const e2 = "in-fullscreen", t2 = "with-panzoom-in-fullscreen";
    null == c2 || c2.classList.toggle(e2);
    const n2 = null == c2 ? void 0 : c2.classList.contains(e2);
    n2 ? (document.documentElement.classList.add(t2), document.addEventListener("keydown", ke, true)) : (document.documentElement.classList.remove(t2), document.removeEventListener("keydown", ke, true)), de(), H2(n2 ? "enterFS" : "exitFS");
  }
  function ke(e2) {
    "Escape" !== e2.key || e2.defaultPrevented || Me();
  }
  const je = { canDrag: be, canZoomIn: pe, canZoomOut: me, canZoomToFull: ve, destroy: function() {
    H2("destroy");
    for (const e2 of Object.values(Y)) null == e2 || e2.destroy(je);
    for (const e2 of D2) e2();
    return S && (S.style.aspectRatio = "", S.style.maxWidth = "", S.style.maxHeight = ""), C && (C.style.width = "", C.style.height = "", C.style.transform = ""), S = void 0, O2 = void 0, C = void 0, R2 = Object.assign({}, y$1), z2 = Object.assign({}, y$1), null == F || F.destroy(), F = void 0, null == T || T.destroy(), T = void 0, P = 4, je;
  }, emit: H2, execute: ue, getBoundaries: re, getContainer: function() {
    return c2;
  }, getContent: function() {
    return O2;
  }, getFullDim: J, getGestures: function() {
    return T;
  }, getMousemovePos: ee, getOptions: function() {
    return X;
  }, getPlugins: function() {
    return Y;
  }, getScale: te, getStartPosition: U, getState: function() {
    return P;
  }, getTransform: function(e2) {
    return true === e2 ? z2 : R2;
  }, getTween: function() {
    return F;
  }, getViewport: function() {
    return C;
  }, getWrapper: function() {
    return S;
  }, init: function() {
    return P = 0, H2("init"), (function() {
      for (const [e2, t2] of Object.entries(Object.assign(Object.assign({}, E2), X.plugins || {}))) if (e2 && !Y[e2] && t2 instanceof Function) {
        const n2 = t2();
        n2.init(je), Y[e2] = n2;
      }
      H2("initPlugins");
    })(), (function() {
      const e2 = Object.assign(Object.assign({}, x.classes), I2("classes"));
      if (!c2) return;
      if (s$7(c2, e2.container), O2 = c2.querySelector("." + e2.content), !O2) return;
      O2.setAttribute("draggable", "false"), S = c2.querySelector("." + e2.wrapper), S || (S = document.createElement("div"), s$7(S, e2.wrapper), O2.insertAdjacentElement("beforebegin", S), S.insertAdjacentElement("afterbegin", O2));
      C = c2.querySelector("." + e2.viewport), C || (C = document.createElement("div"), s$7(C, e2.viewport), C.insertAdjacentElement("afterbegin", O2), S.insertAdjacentElement("beforeend", C));
      A2 = O2.cloneNode(true), A2.removeAttribute("id"), S.insertAdjacentElement("afterbegin", A2), O2 instanceof HTMLPictureElement && (O2 = O2.querySelector("img"));
      A2 instanceof HTMLPictureElement && (A2 = A2.querySelector("img"));
      C instanceof HTMLPictureElement && (C = C.querySelector("img"));
      if (C && (C.style.visibility = "hidden", I2("protected"))) {
        C.addEventListener("contextmenu", ((e4) => {
          h$1(e4);
        }));
        const e3 = document.createElement("div");
        s$7(e3, "f-panzoom__protected"), C.appendChild(e3);
      }
      H2("initLayout");
    })(), (function() {
      if (c2 && S && !Z) {
        let e2 = null;
        Z = new ResizeObserver((() => {
          W() && (e2 = e2 || requestAnimationFrame((() => {
            W() && (ce(), le(), H2("refresh")), e2 = null;
          })));
        })), Z.observe(S), D2.push((() => {
          null == Z || Z.disconnect(), Z = void 0, e2 && (cancelAnimationFrame(e2), e2 = null);
        }));
      }
    })(), (function() {
      if (!c2 || !O2) return;
      if (!p(O2) || !p(A2)) return void V();
      const e2 = () => {
        O2 && p(O2) && O2.decode().then((() => {
          V();
        })).catch((() => {
          V();
        }));
      };
      if (P = 1, c2.classList.add("is-loading"), H2("loading"), A2.src && A2.complete) return void e2();
      (function() {
        if (!c2) return;
        if (null == c2 ? void 0 : c2.querySelector(".f-spinner")) return;
        const e3 = I2("spinnerTpl"), t2 = e$8(e3);
        t2 && (t2.classList.add("f-spinner"), c2.classList.add("is-loading"), null == S || S.insertAdjacentElement("afterbegin", t2));
      })(), A2.addEventListener("load", e2, false), A2.addEventListener("error", e2, false), D2.push((() => {
        null == A2 || A2.removeEventListener("load", e2, false), null == A2 || A2.removeEventListener("error", e2, false);
      }));
    })(), je;
  }, isDragging: ye, isExpanded: xe, isFullsize: we, isMousemoveMode: Q, localize: function(e2, t2 = []) {
    const n2 = I2("l10n") || {};
    e2 = String(e2).replace(/\{\{(\w+)\}\}/g, ((e3, t3) => n2[t3] || e3));
    for (let n3 = 0; n3 < t2.length; n3++) e2 = e2.split(t2[n3][0]).join(t2[n3][1]);
    return e2 = e2.replace(/\{\{(.*?)\}\}/g, ((e3, t3) => t3));
  }, off: function(e2, t2) {
    for (const n2 of e2 instanceof Array ? e2 : [e2]) q2.has(n2) && q2.set(n2, q2.get(n2).filter(((e3) => e3 !== t2)));
    return je;
  }, on: function(e2, t2) {
    for (const n2 of e2 instanceof Array ? e2 : [e2]) q2.set(n2, [...q2.get(n2) || [], t2]);
    return je;
  }, toggleFS: Me, updateControls: ce, version: "6.1.6", willZoomIn: ge, willZoomOut: he };
  return je;
};
E$1.l10n = { en_EN: e$4 }, E$1.getDefaults = () => x;
const e$3 = (e2, o2) => {
  let t2 = [];
  return e2.childNodes.forEach(((e3) => {
    e3.nodeType !== Node.ELEMENT_NODE || o2 && !e3.matches(o2) || t2.push(e3);
  })), t2;
};
const r$3 = (t2, ...e2) => {
  const n2 = e2.length;
  for (let c2 = 0; c2 < n2; c2++) {
    const n3 = e2[c2] || {};
    Object.entries(n3).forEach((([e3, n4]) => {
      const c3 = Array.isArray(n4) ? [] : {};
      t2[e3] || Object.assign(t2, { [e3]: c3 }), t$5(n4) ? Object.assign(t2[e3], r$3(t2[e3], n4)) : Array.isArray(n4) ? Object.assign(t2, { [e3]: [...n4] }) : Object.assign(t2, { [e3]: n4 });
    }));
  }
  return t2;
};
const t$3 = function(t2 = 0, n2 = 0, r2 = 0, c2 = 0, m2 = 0, p2 = false) {
  const s2 = (t2 - n2) / (r2 - n2) * (m2 - c2) + c2;
  return p2 ? c2 < m2 ? t$6(c2, s2, m2) : t$6(m2, s2, c2) : s2;
};
const o$5 = Object.assign(Object.assign({}, e$4), { ERROR: "Something went wrong. <br /> Please try again later.", NEXT: "Next page", PREV: "Previous page", GOTO: "Go to page #%d", DOWNLOAD: "Download", TOGGLE_FULLSCREEN: "Toggle full-screen mode", TOGGLE_EXPAND: "Toggle full-size mode", TOGGLE_THUMBS: "Toggle thumbnails", TOGGLE_AUTOPLAY: "Toggle slideshow" });
const m = (t2) => {
  t2.cancelable && t2.preventDefault();
}, h = { adaptiveHeight: false, center: true, classes: { container: "f-carousel", isEnabled: "is-enabled", isLTR: "is-ltr", isRTL: "is-rtl", isHorizontal: "is-horizontal", isVertical: "is-vertical", hasAdaptiveHeight: "has-adaptive-height", viewport: "f-carousel__viewport", slide: "f-carousel__slide", isSelected: "is-selected" }, dragFree: false, enabled: true, errorTpl: '<div class="f-html">{{ERROR}}</div>', fill: false, infinite: true, initialPage: 0, l10n: o$5, rtl: false, slides: [], slidesPerPage: "auto", spinnerTpl: '<div class="f-spinner"></div>', transition: "fade", tween: { clamp: true, mass: 1, tension: 160, friction: 25, restDelta: 1, restSpeed: 1, velocity: 0 }, vertical: false };
let b, y = 0;
const E = (g, x2 = {}, M2 = {}) => {
  y++;
  let w2, S, j2, A2, L, P = 0, T = Object.assign({}, h), O2 = Object.assign({}, h), R2 = {}, H2 = null, V = null, C = 0, D2 = 0, $ = 0, q2 = false, I2 = false, F = false, z2 = "height", k2 = 0, N2 = true, B2 = 0, _2 = 0, G = 0, X = 0, Y = "*", W = [], J = [];
  const K = /* @__PURE__ */ new Set();
  let Q = [], U = [], Z = 0, tt = 0, et = 0;
  function nt(t2, ...e2) {
    let n2 = O2[t2];
    return n2 && n2 instanceof Function ? n2(It, ...e2) : n2;
  }
  function it(t2, e2 = []) {
    const n2 = nt("l10n") || {};
    t2 = String(t2).replace(/\{\{(\w+)\}\}/g, ((t3, e3) => n2[e3] || t3));
    for (let n3 = 0; n3 < e2.length; n3++) t2 = t2.split(e2[n3][0]).join(e2[n3][1]);
    return t2 = t2.replace(/\{\{(.*?)\}\}/g, ((t3, e3) => e3));
  }
  const ot = /* @__PURE__ */ new Map();
  function st(t2, ...e2) {
    const n2 = [...ot.get(t2) || []];
    O2.on && n2.push(O2.on[t2]);
    for (const t3 of n2) t3 && t3 instanceof Function && t3(It, ...e2);
    "*" !== t2 && st("*", t2, ...e2);
  }
  function rt() {
    var e2, n2;
    const i2 = r$3({}, h, T);
    r$3(i2, h, T);
    let r2 = "";
    const l2 = T.breakpoints || {};
    if (l2) for (const [t2, e3] of Object.entries(l2)) window.matchMedia(t2).matches && (r2 += t2, r$3(i2, e3));
    if (void 0 === L || r2 !== L) {
      if (L = r2, 0 !== P) {
        let t2 = null === (n2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0]) || void 0 === n2 ? void 0 : n2.index;
        void 0 === t2 && (t2 = O2.initialSlide), i2.initialSlide = t2, i2.slides = [];
        for (const t3 of W) t3.isVirtual && i2.slides.push(t3);
      }
      Dt(), O2 = i2, false !== nt("enabled") && (P = 0, st("init"), (function() {
        for (const [t2, e3] of Object.entries(Object.assign(Object.assign({}, M2), O2.plugins || {}))) if (t2 && !R2[t2] && e3 instanceof Function) {
          const n3 = e3();
          n3.init(It, E), R2[t2] = n3;
        }
        st("initPlugins");
      })(), (function() {
        if (!H2) return;
        const e3 = nt("classes") || {};
        s$7(H2, e3.container);
        const n3 = nt("style");
        if (n3 && t$5(n3)) for (const [t2, e4] of Object.entries(n3)) H2.style.setProperty(t2, e4);
        V = H2.querySelector(`.${e3.viewport}`), V || (V = document.createElement("div"), s$7(V, e3.viewport), V.append(...e$3(H2, `.${e3.slide}`)), H2.insertAdjacentElement("afterbegin", V)), H2.carousel = It, st("initLayout");
      })(), (function() {
        if (!V) return;
        const t2 = nt("classes") || {};
        W = [], [...e$3(V, `.${t2.slide}`)].forEach(((t3) => {
          if (t3.parentElement) {
            const e3 = yt(Object.assign({ el: t3, isVirtual: false }, t3.dataset || {}));
            st("createSlide", e3), W.push(e3);
          }
        })), wt();
        for (const t3 of W) st("addSlide", t3);
        bt(nt("slides"));
        for (const t3 of W) {
          const e3 = t3.el;
          (null == e3 ? void 0 : e3.parentElement) === V && (s$7(e3, O2.classes.slide), s$7(e3, t3.class), Rt(t3), st("attachSlideEl", t3));
        }
        st("initSlides");
      })(), St(), P = 1, s$7(H2, (nt("classes") || {}).isEnabled || ""), Ct(), ut(), S = c$3().on("start", (() => {
        w2 && w2.isPointerDown() || (dt(), Ct());
      })).on("step", ((t2) => {
        const e3 = k2;
        k2 = t2.pos, k2 !== e3 && (N2 = false, Ct());
      })).on("end", ((t2) => {
        (null == w2 ? void 0 : w2.isPointerDown()) || (k2 = t2.pos, S && !q2 && (k2 < G || k2 > X) ? S.spring({ clamp: true, mass: 1, tension: 200, friction: 25, velocity: 0, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: t$6(G, k2, X) }).start() : N2 || (N2 = true, st("settle")));
      })), at(), (function() {
        if (!H2 || !V) return;
        H2.addEventListener("click", Pt), document.addEventListener("mousemove", lt);
        const t2 = V.getBoundingClientRect();
        if (Z = t2.height, tt = t2.width, !j2) {
          let t3 = null;
          j2 = new ResizeObserver((() => {
            t3 || (t3 = requestAnimationFrame((() => {
              !(function() {
                if (1 !== P || !V) return;
                const t4 = U.length, e3 = V.getBoundingClientRect(), n3 = e3.height, i3 = e3.width;
                t4 > 1 && (F && Math.abs(n3 - Z) < 0.5 || !F && Math.abs(i3 - tt) < 0.5) || (St(), at(), Z = n3, tt = i3, F && !Z || !F && !tt || H2 && V && (t4 === U.length && (null == w2 ? void 0 : w2.isPointerDown()) || (nt("dragFree") && (q2 || k2 > G && k2 < X) ? (dt(), Ct()) : Ht(B2, { transition: false }))));
              })(), t3 = null;
            })));
          })), j2.observe(V);
        }
      })(), st("ready"));
    }
  }
  function lt(t2) {
    b = t2;
  }
  function at() {
    false === nt("gestures") ? w2 && (w2.destroy(), w2 = void 0) : w2 || (function() {
      const t2 = nt("gestures");
      !w2 && false !== t2 && V && (w2 = f$1(V, t2).on("start", ((t3) => {
        var e2, n2;
        if (!S) return;
        if (false === nt("gestures", t3)) return;
        const { srcEvent: o2 } = t3;
        F && e$5(o2) && !n$8(o2.target) && m(o2), S.pause(), S.getCurrentVelocities().pos = 0;
        const s2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0], r2 = null == s2 ? void 0 : s2.el;
        s2 && K.has(s2.index) && r2 && (k2 = s2.offset || 0, k2 += ((function(t4) {
          const e3 = window.getComputedStyle(t4), n3 = new DOMMatrixReadOnly(e3.transform);
          return { width: n3.m41 || 0, height: n3.m42 || 0 };
        })(r2)[z2] || 0) * (I2 && !F ? 1 : -1)), At(), q2 || (k2 < G || k2 > X) && S.spring({ clamp: true, mass: 1, tension: 500, friction: 25, velocity: (null === (n2 = S.getCurrentVelocities()) || void 0 === n2 ? void 0 : n2.pos) || 0, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: t$6(G, k2, X) }).start();
      })).on("move", ((t3) => {
        var e2, n2;
        if (false === nt("gestures", t3)) return;
        const { srcEvent: o2, axis: s2, deltaX: r2, deltaY: l2 } = t3;
        if (e$5(o2) && (null === (e2 = o2.touches) || void 0 === e2 ? void 0 : e2.length) > 1) return;
        const a2 = o2.target, c2 = n$8(a2), d2 = c2 ? c2.scrollHeight > c2.clientHeight ? "y" : "x" : void 0;
        if (c2 && c2 !== V && (!s2 || s2 === d2)) return;
        if (!s2) return m(o2), o2.stopPropagation(), void o2.stopImmediatePropagation();
        if ("y" === s2 && !F || "x" === s2 && F) return;
        if (m(o2), o2.stopPropagation(), !S) return;
        const u2 = I2 && !F ? 1 : -1, f2 = F ? l2 : r2;
        let v2 = (null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2, g2 = 1;
        q2 || (v2 <= G && f2 * u2 < 0 ? (g2 = Math.max(0.01, 1 - (Math.abs(1 / gt() * Math.abs(v2 - G)) || 0)), g2 *= 0.2) : v2 >= X && f2 * u2 > 0 && (g2 = Math.max(0.01, 1 - (Math.abs(1 / gt() * Math.abs(v2 - X)) || 0)), g2 *= 0.2)), v2 += f2 * g2 * u2, S.spring({ clamp: true, mass: 1, tension: 700, friction: 25, velocity: (null === (n2 = S.getCurrentVelocities()) || void 0 === n2 ? void 0 : n2.pos) || 0, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: v2 }).start();
      })).on("panstart", ((t3) => {
        false !== nt("gestures", t3) && (null == t3 ? void 0 : t3.axis) === (F ? "y" : "x") && s$7(V, "is-dragging");
      })).on("panend", ((t3) => {
        false !== nt("gestures", t3) && s$6(V, "is-dragging");
      })).on("end", ((t3) => {
        var e2, n2;
        if (false === nt("gestures", t3)) return;
        const { srcEvent: o2, axis: s2, velocityX: r2, velocityY: l2, currentTouch: c2 } = t3;
        if (c2.length > 0 || !S) return;
        const d2 = o2.target, u2 = n$8(d2), f2 = u2 ? u2.scrollHeight > u2.clientHeight ? "y" : "x" : void 0, v2 = u2 && (!s2 || s2 === f2);
        F && e$5(o2) && !t3.axis && Pt(o2);
        const g2 = U.length, m2 = nt("dragFree");
        if (!g2) return;
        const h2 = v2 ? 0 : nt("vertical") ? l2 : r2;
        let b2 = (null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2;
        const y2 = I2 && !F ? 1 : -1;
        if (v2 || (b2 += h2 * (m2 ? 5 : 1) * y2), !q2 && (h2 * y2 <= 0 && b2 < G || h2 * y2 >= 0 && b2 > X)) {
          let t4 = 0;
          return Math.abs(h2) > 0 && (t4 = 2 * Math.abs(h2), t4 = Math.min(0.3 * gt(), t4)), b2 = t$6(G + -1 * t4, b2, X + t4), void S.spring({ clamp: true, mass: 1, tension: 380, friction: 25, velocity: -1 * h2, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: b2 }).start();
        }
        if (m2 || (null === (e2 = R2.Autoscroll) || void 0 === e2 ? void 0 : e2.isEnabled())) return void (Math.abs(h2) > 10 ? S.spring({ clamp: true, mass: 1, tension: 150, friction: 25, velocity: -1 * h2, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: b2 }).start() : S.isRunning() || N2 || (N2 = true, st("settle")));
        if (!m2 && !(null === (n2 = R2.Autoscroll) || void 0 === n2 ? void 0 : n2.isEnabled()) && (!t3.offsetX && !t3.offsetY || "y" === s2 && !F || "x" === s2 && F)) return void Ht(B2, { transition: "tween" });
        let E2 = vt(b2);
        Math.abs(h2) > 10 && E2 === B2 && (E2 += h2 > 0 ? I2 && !F ? 1 : -1 : I2 && !F ? -1 : 1), Ht(E2, { transition: "tween", tween: { velocity: -1 * h2 } });
      })).init());
    })(), s$5(V, "is-draggable", !!w2 && U.length > 0);
  }
  function ct(t2 = "*") {
    var e2;
    const n2 = [];
    for (const i2 of W) ("*" === t2 || i2.class && i2.class.includes(t2) || i2.el && (null === (e2 = i2.el) || void 0 === e2 ? void 0 : e2.classList.contains(t2))) && n2.push(i2);
    A2 = void 0, Y = t2, J = [...n2];
  }
  function dt() {
    if (!S) return;
    const t2 = vt((null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2);
    t2 !== B2 && (A2 = B2, B2 = t2, Rt(), ut(), ft(), st("change", B2, A2));
  }
  function ut() {
    var t2, e2;
    if (!H2) return;
    for (const t3 of H2.querySelectorAll("[data-carousel-index]")) t3.innerHTML = B2 + "";
    for (const t3 of H2.querySelectorAll("[data-carousel-page]")) t3.innerHTML = B2 + 1 + "";
    for (const t3 of H2.querySelectorAll("[data-carousel-pages]")) t3.innerHTML = U.length + "";
    for (const e3 of H2.querySelectorAll("[data-carousel-go-to]")) {
      parseInt((null === (t2 = e3.dataset) || void 0 === t2 ? void 0 : t2.carouselGoTo) || "-1", 10) === B2 ? e3.setAttribute("aria-current", "true") : e3.removeAttribute("aria-current");
    }
    for (const t3 of H2.querySelectorAll("[data-carousel-go-prev]")) t3.toggleAttribute("aria-disabled", !$t()), $t() ? t3.removeAttribute("tabindex") : t3.setAttribute("tabindex", "-1");
    for (const t3 of H2.querySelectorAll("[data-carousel-go-next]")) t3.toggleAttribute("aria-disabled", !qt()), qt() ? t3.removeAttribute("tabindex") : t3.setAttribute("tabindex", "-1");
    let n2 = false;
    const i2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0];
    i2 && (i2.downloadSrc || "image" === i2.type && i2.src) && (n2 = true);
    for (const t3 of H2.querySelectorAll("[data-carousel-download]")) t3.toggleAttribute("aria-disabled", !n2);
  }
  function ft(t2) {
    var e2;
    t2 || (t2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0]);
    const n2 = null == t2 ? void 0 : t2.el;
    if (n2) for (const e3 of n2.querySelectorAll("[data-slide-index]")) e3.innerHTML = t2.index + 1 + "";
  }
  function vt(t2) {
    var e2, n2, i2;
    if (!U.length) return 0;
    const o2 = mt();
    let s2 = t2;
    q2 ? s2 -= Math.floor((t2 - (null === (e2 = U[0]) || void 0 === e2 ? void 0 : e2.pos)) / o2) * o2 || 0 : s2 = t$6(null === (n2 = U[0]) || void 0 === n2 ? void 0 : n2.pos, t2, null === (i2 = U[U.length - 1]) || void 0 === i2 ? void 0 : i2.pos);
    const r2 = /* @__PURE__ */ new Map();
    let l2 = 0;
    for (const t3 of U) {
      const e3 = Math.abs(t3.pos - s2), n3 = Math.abs(t3.pos - s2 - o2), i3 = Math.abs(t3.pos - s2 + o2), a2 = Math.min(e3, n3, i3);
      r2.set(l2, a2), l2++;
    }
    const c2 = r2.size > 0 ? [...r2.entries()].reduce(((t3, e3) => e3[1] < t3[1] ? e3 : t3)) : [B2, 0];
    return parseInt(c2[0]);
  }
  function pt() {
    return et;
  }
  function gt() {
    return C;
  }
  function mt(t2 = true) {
    return J.length ? J.reduce(((t3, e2) => t3 + e2.dim), 0) + (J.length - (q2 && t2 ? 0 : 1)) * et : 0;
  }
  function ht(t2) {
    const e2 = mt(), n2 = gt();
    if (!e2 || !V || !n2) return [];
    const i2 = [];
    t2 = void 0 === t2 ? k2 : t2, q2 && (t2 -= Math.floor(t2 / e2) * e2 || 0);
    let o2 = 0;
    for (let s2 of J) {
      const r2 = (e3 = 0) => {
        i2.indexOf(s2) > -1 || (s2.pos = o2 - t2 + e3 || 0, s2.offset + e3 > t2 - s2.dim - D2 + 0.51 && s2.offset + e3 < t2 + n2 + $ - 0.51 && i2.push(s2));
      };
      s2.offset = o2, q2 && (r2(e2), r2(-1 * e2)), r2(), o2 += s2.dim + et;
    }
    return i2;
  }
  function bt(t2, e2) {
    const n2 = [];
    for (const e3 of Array.isArray(t2) ? t2 : [t2]) {
      const t3 = yt(Object.assign(Object.assign({}, e3), { isVirtual: true }));
      t3.el || (t3.el = document.createElement("div")), st("createSlide", t3), n2.push(t3);
    }
    W.splice(void 0 === e2 ? W.length : e2, 0, ...n2), wt();
    for (const t3 of n2) st("addSlide", t3), Et(t3);
    return ct(Y), n2;
  }
  function yt(t2) {
    return (t$7(t2) || t2 instanceof HTMLElement) && (t2 = { html: t2 }), Object.assign({ index: -1, el: void 0, class: "", isVirtual: true, dim: 0, pos: 0, offset: 0, html: "", src: "" }, t2);
  }
  function Et(t2) {
    let e2 = t2.el;
    if (!t2 || !e2) return;
    const n2 = t2.html ? t2.html instanceof HTMLElement ? t2.html : e$8(t2.html) : void 0;
    n2 && (s$7(n2, "f-html"), t2.htmlEl = n2, s$7(e2, "has-html"), e2.append(n2), st("contentReady", t2));
  }
  function xt(t2) {
    if (!V || !t2) return;
    let e2 = t2.el;
    if (e2) {
      if (e2.setAttribute("index", t2.index + ""), e2.parentElement !== V) {
        let n2;
        s$7(e2, O2.classes.slide), s$7(e2, t2.class), Rt(t2);
        for (const e3 of W) if (e3.index > t2.index) {
          n2 = e3.el;
          break;
        }
        V.insertBefore(e2, n2 && V.contains(n2) ? n2 : null), st("attachSlideEl", t2);
      }
      return ft(t2), e2;
    }
  }
  function Mt(t2) {
    const e2 = null == t2 ? void 0 : t2.el;
    e2 && (e2.remove(), jt(e2), st("detachSlideEl", t2));
  }
  function wt() {
    for (let t2 = 0; t2 < W.length; t2++) {
      const e2 = W[t2], n2 = e2.el;
      n2 && (e2.index !== t2 && jt(n2), n2.setAttribute("index", `${t2}`)), e2.index = t2;
    }
  }
  function St() {
    var t2, n2, i2, o2, s2;
    if (!H2 || !V) return;
    I2 = nt("rtl"), F = nt("vertical"), z2 = F ? "height" : "width";
    const r2 = nt("classes");
    if (s$5(H2, r2.isLTR, !I2), s$5(H2, r2.isRTL, I2), s$5(H2, r2.isHorizontal, !F), s$5(H2, r2.isVertical, F), s$5(H2, r2.hasAdaptiveHeight, nt("adaptiveHeight")), C = 0, D2 = 0, $ = 0, et = 0, V) {
      V.childElementCount || (V.style.display = "grid");
      const t3 = V.getBoundingClientRect();
      C = V.getBoundingClientRect()[z2] || 0;
      const e2 = window.getComputedStyle(V);
      et = parseFloat(e2.getPropertyValue("--f-carousel-gap")) || 0;
      "visible" === e2.getPropertyValue("overflow-" + (F ? "y" : "x")) && (D2 = Math.abs(t3[F ? "top" : "left"]), $ = Math.abs(window[F ? "innerHeight" : "innerWidth"] - t3[F ? "bottom" : "right"])), V.style.display = "";
    }
    if (!C) return;
    const l2 = (function() {
      let t3 = 0;
      if (V) {
        let e2 = document.createElement("div");
        e2.style.display = "block", s$7(e2, O2.classes.slide), V.appendChild(e2), t3 = e2.getBoundingClientRect()[z2], e2.remove(), e2 = void 0;
      }
      return t3;
    })();
    for (const n3 of J) {
      const i3 = n3.el;
      let o3 = 0;
      if (!n3.isVirtual && i3 && n$9(i3)) {
        let e2 = false;
        i3.parentElement && i3.parentElement === V || (V.appendChild(i3), e2 = true), o3 = i3.getBoundingClientRect()[z2], e2 && (null === (t2 = i3.parentElement) || void 0 === t2 || t2.removeChild(i3));
      } else o3 = l2;
      n3.dim = o3;
    }
    if (q2 = false, nt("infinite")) {
      q2 = true;
      const t3 = mt();
      let e2 = C + D2 + $;
      for (let i3 = 0; i3 < J.length; i3++) {
        const o3 = (null === (n2 = J[i3]) || void 0 === n2 ? void 0 : n2.dim) + et;
        if (t3 - o3 < e2 && t3 - o3 - e2 < o3) {
          q2 = false;
          break;
        }
      }
    }
    !(function() {
      var t3;
      if (!H2) return;
      const e2 = gt(), n3 = mt(false);
      let i3 = nt("slidesPerPage");
      i3 = "auto" === i3 ? 1 / 0 : parseFloat(i3 + ""), U = [];
      let o3 = 0, s3 = 0;
      for (const n4 of J) (!U.length || o3 + n4.dim - e2 > 0.05 || s3 >= i3) && (U.push({ index: U.length, slides: [], dim: 0, offset: 0, pos: 0 }), o3 = 0, s3 = 0), null === (t3 = U[U.length - 1]) || void 0 === t3 || t3.slides.push(n4), o3 += n4.dim + et, s3++;
      const r3 = nt("center"), l3 = nt("fill");
      let c2 = 0;
      for (const t4 of U) {
        t4.dim = (t4.slides.length - 1) * et;
        for (const e3 of t4.slides) t4.dim += e3.dim;
        t4.offset = c2, t4.pos = c2, false !== r3 && (t4.pos -= 0.5 * (e2 - t4.dim)), l3 && !q2 && n3 > e2 && (t4.pos = t$6(0, t4.pos, n3 - e2)), c2 += t4.dim + et;
      }
      const d2 = [];
      let u2;
      for (const t4 of U) {
        const e3 = Object.assign({}, t4);
        u2 && Math.abs(e3.pos - u2.pos) < 0.1 ? (u2.dim += e3.dim, u2.slides = [...u2.slides, ...e3.slides]) : (u2 = e3, e3.index = d2.length, d2.push(e3));
      }
      U = d2, B2 = t$6(0, B2, U.length - 1);
    })(), G = (null === (i2 = U[0]) || void 0 === i2 ? void 0 : i2.pos) || 0, X = (null === (o2 = U[U.length - 1]) || void 0 === o2 ? void 0 : o2.pos) || 0, 0 === P ? (function() {
      var t3;
      A2 = void 0, B2 = nt("initialPage");
      const e2 = nt("initialSlide") || void 0;
      void 0 !== e2 && (B2 = It.getPageIndex(e2) || 0), B2 = t$6(0, B2, U.length - 1), k2 = (null === (t3 = U[B2]) || void 0 === t3 ? void 0 : t3.pos) || 0, _2 = k2;
    })() : _2 = (null === (s2 = U[B2 || 0]) || void 0 === s2 ? void 0 : s2.pos) || 0, st("refresh"), ut();
  }
  function jt(t2) {
    if (!t2 || !n$9(t2)) return;
    const n2 = parseInt(t2.getAttribute("index") || "-1");
    let i2 = "";
    for (const e2 of Array.from(t2.classList)) {
      const t3 = e2.match(/^f-(\w+)(Out|In)$/);
      t3 && t3[1] && (i2 = t3[1] + "");
    }
    if (!t2 || !i2) return;
    const o2 = [`f-${i2}Out`, `f-${i2}In`, "to-prev", "to-next", "from-prev", "from-next"];
    t2.removeEventListener("animationend", Lt), s$6(t2, o2.join(" ")), K.delete(n2);
  }
  function At() {
    if (!V) return;
    const t2 = K.size > 0;
    for (const t3 of J) jt(t3.el);
    K.clear(), t2 && Ct();
  }
  function Lt(t2) {
    var e2;
    "f-" === (null === (e2 = t2.animationName) || void 0 === e2 ? void 0 : e2.substring(0, 2)) && (jt(t2.target), K.size || (s$6(H2, "in-transition"), !N2 && Math.abs(It.getPosition(true) - _2) < 0.5 && (N2 = true, st("settle"))), Ct());
  }
  function Pt(t2) {
    var e2;
    if (t2.defaultPrevented) return;
    const n2 = t2.composedPath()[0];
    if (n2.closest("[data-carousel-go-prev]")) return m(t2), void It.prev();
    if (n2.closest("[data-carousel-go-next]")) return m(t2), void It.next();
    const i2 = n2.closest("[data-carousel-go-to]");
    if (i2) return m(t2), void It.goTo(parseFloat(i2.dataset.carouselGoTo || "") || 0);
    if (n2.closest("[data-carousel-download]")) {
      m(t2);
      const n3 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0];
      if (n3 && (n3.downloadSrc || "image" === n3.type && n3.src)) {
        const t3 = n3.downloadFilename, e3 = document.createElement("a"), i3 = n3.downloadSrc || n3.src || "";
        e3.href = i3, e3.target = "_blank", e3.download = t3 || i3, e3.click();
      }
    } else st("click", t2);
  }
  function Tt(t2) {
    var e2;
    const n2 = t2.el;
    n2 && (null === (e2 = n2.querySelector(".f-spinner")) || void 0 === e2 || e2.remove());
  }
  function Ot(t2) {
    var e2;
    const n2 = t2.el;
    n2 && (null === (e2 = n2.querySelector(".f-html.is-error")) || void 0 === e2 || e2.remove(), s$6(n2, "has-error"));
  }
  function Rt(t2) {
    var e2;
    t2 || (t2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0]);
    const i2 = null == t2 ? void 0 : t2.el;
    if (!i2) return;
    let o2 = nt("formatCaption", t2);
    void 0 === o2 && (o2 = t2.caption), o2 = o2 || "";
    const s2 = nt("captionEl");
    if (s2 && s2 instanceof HTMLElement) {
      if (t2.index !== B2) return;
      if (t$7(o2) && (s2.innerHTML = it(o2 + "")), o2 instanceof HTMLElement) {
        if (o2.parentElement === s2) return;
        s2.innerHTML = "", o2.parentElement && (o2 = o2.cloneNode(true)), s2.append(o2);
      }
      return;
    }
    if (!o2) return;
    let r2 = t2.captionEl || i2.querySelector(".f-caption");
    !r2 && o2 instanceof HTMLElement && o2.classList.contains("f-caption") && (r2 = o2), r2 || (r2 = document.createElement("div"), s$7(r2, "f-caption"), t$7(o2) ? r2.innerHTML = it(o2 + "") : o2 instanceof HTMLElement && (o2.parentElement && (o2 = o2.cloneNode(true)), r2.append(o2)));
    const l2 = `f-caption-${y}_${t2.index}`;
    r2.setAttribute("id", l2), r2.dataset.selectable = "true", s$7(i2, "has-caption"), i2.setAttribute("aria-labelledby", l2), t2.captionEl = r2, i2.insertAdjacentElement("beforeend", r2);
  }
  function Ht(e2, i2 = {}) {
    var o2, r2;
    let { transition: l2, tween: u2 } = Object.assign({ transition: O2.transition, tween: O2.tween }, i2 || {});
    if (!H2 || !S) return;
    const f2 = U.length;
    if (!f2) return;
    if ((function(t2, e3) {
      var i3, o3, s2;
      if (!(H2 && C && S && e3 && t$7(e3) && "tween" !== e3)) return false;
      for (const t3 of Q) if (C - t3.dim > 0.5) return false;
      if (D2 > 0.5 || $ > 0.5) return;
      const r3 = U.length;
      let l3 = t2 > B2 ? 1 : -1;
      t2 = q2 ? (t2 % r3 + r3) % r3 : t$6(0, t2, r3 - 1), I2 && (l3 *= -1);
      const u3 = null === (i3 = U[B2]) || void 0 === i3 ? void 0 : i3.slides[0], f3 = null == u3 ? void 0 : u3.index, v3 = null === (o3 = U[t2]) || void 0 === o3 ? void 0 : o3.slides[0], p3 = null == v3 ? void 0 : v3.index, g2 = null === (s2 = U[t2]) || void 0 === s2 ? void 0 : s2.pos;
      if (void 0 === p3 || void 0 === f3 || f3 === p3 || k2 === g2 || Math.abs(C - ((null == v3 ? void 0 : v3.dim) || 0)) > 1) return false;
      N2 = false, S.pause(), At(), s$7(H2, "in-transition"), k2 = _2 = g2;
      const m2 = xt(u3), h2 = xt(v3);
      return dt(), m2 && (K.add(f3), m2.style.transform = "", m2.addEventListener("animationend", Lt), s$6(m2, O2.classes.isSelected), m2.inert = false, s$7(m2, `f-${e3}Out to-${l3 > 0 ? "next" : "prev"}`)), h2 && (K.add(p3), h2.style.transform = "", h2.addEventListener("animationend", Lt), s$7(h2, O2.classes.isSelected), h2.inert = false, s$7(h2, `f-${e3}In from-${l3 > 0 ? "prev" : "next"}`)), Ct(), true;
    })(e2, l2)) return;
    e2 = q2 ? (e2 % f2 + f2) % f2 : t$6(0, e2, f2 - 1);
    const v2 = (null === (o2 = U[e2 || 0]) || void 0 === o2 ? void 0 : o2.pos) || 0;
    _2 = v2;
    const p2 = S.isRunning() ? S.getEndValues().pos : k2;
    if (Math.abs(_2 - p2) < 1) return k2 = _2, B2 !== e2 && (Rt(), A2 = B2, B2 = e2, ut(), ft(), st("change", B2, A2)), Ct(), void (N2 || (N2 = true, st("settle")));
    if (S.pause(), At(), q2) {
      const t2 = mt(), e3 = Math.floor((p2 - (null === (r2 = U[0]) || void 0 === r2 ? void 0 : r2.pos)) / t2) || 0, n2 = _2 + e3 * t2;
      _2 = [n2 + t2, n2, n2 - t2].reduce((function(t3, e4) {
        return Math.abs(e4 - p2) < Math.abs(t3 - p2) ? e4 : t3;
      }));
    }
    false !== l2 && t$5(u2) ? S.spring(r$3({}, O2.tween, u2)).from({ pos: k2 }).to({ pos: _2 }).start() : (k2 = _2, dt(), Ct(), N2 || (N2 = true, st("settle")));
  }
  function Vt(t2) {
    var e2;
    let n2 = k2;
    if (q2 && true !== t2) {
      const t3 = mt();
      n2 -= (Math.floor((k2 - (null === (e2 = U[0]) || void 0 === e2 ? void 0 : e2.pos) || 0) / t3) || 0) * t3;
    }
    return n2;
  }
  function Ct() {
    var t2;
    if (!H2 || !V) return;
    Q = ht();
    const e2 = /* @__PURE__ */ new Set(), n2 = [], i2 = U[B2], s2 = O2.setTransform;
    let l2;
    for (const o2 of J) {
      const s3 = K.has(o2.index), r2 = Q.indexOf(o2) > -1, a2 = (null === (t2 = null == i2 ? void 0 : i2.slides) || void 0 === t2 ? void 0 : t2.indexOf(o2)) > -1;
      if (o2.isVirtual && !s3 && !r2) continue;
      let c2 = xt(o2);
      if (c2 && (n2.push(o2), a2 && e2.add(c2), nt("adaptiveHeight") && a2)) {
        const t3 = (c2.firstElementChild || c2).getBoundingClientRect().height;
        l2 = null == l2 ? t3 : Math.max(l2, t3);
      }
    }
    V && l2 && (V.style.height = `${l2}px`), [...e$3(V, `.${O2.classes.slide}`)].forEach(((t3) => {
      s$5(t3, O2.classes.isSelected, e2.has(t3));
      const n3 = W[parseInt(t3.getAttribute("index") || "-1")];
      if (!n3) return t3.remove(), void jt(t3);
      const i3 = K.has(n3.index), o2 = Q.indexOf(n3) > -1;
      if (n3.isVirtual && !i3 && !o2) return void Mt(n3);
      if (t3.inert = !o2, false === s2) return;
      let l3 = n3.pos ? Math.round(1e4 * n3.pos) / 1e4 : 0, a2 = 0, c2 = 0, d2 = 0, f2 = 0;
      i3 || (a2 = F ? 0 : I2 ? -1 * l3 : l3, c2 = F ? l3 : 0, d2 = t$3(a2, 0, n3.dim, 0, 100), f2 = t$3(c2, 0, n3.dim, 0, 100)), s2 instanceof Function && !i3 ? s2(It, n3, { x: a2, y: c2, xPercent: d2, yPercent: f2 }) : t3.style.transform = a2 || c2 ? `translate3d(${d2}%, ${f2}%,0)` : "";
    })), st("render", n2);
  }
  function Dt() {
    null == H2 || H2.removeEventListener("click", Pt), document.removeEventListener("mousemove", lt), K.clear(), null == j2 || j2.disconnect(), j2 = void 0;
    for (const t2 of W) {
      let n2 = t2.el;
      n2 && n$9(n2) && (t2.state = void 0, Tt(t2), Ot(t2), t2.isVirtual ? (Mt(t2), t2.el = void 0) : (jt(n2), n2.style.transform = "", V && !V.contains(n2) && V.appendChild(n2)));
    }
    for (const t2 of Object.values(R2)) null == t2 || t2.destroy();
    R2 = {}, null == w2 || w2.destroy(), w2 = void 0, null == S || S.destroy(), S = void 0;
    for (const [t2, e2] of Object.entries(O2.classes || {})) "container" !== t2 && s$6(H2, e2);
    s$6(V, "is-draggable");
  }
  function $t() {
    return q2 || B2 > 0;
  }
  function qt() {
    return q2 || B2 < U.length - 1;
  }
  const It = { add: function(t2, e2) {
    var n2;
    let i2 = k2;
    const o2 = B2, s2 = mt(), r2 = (null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2, l2 = s2 && Math.floor((r2 - ((null === (n2 = U[0]) || void 0 === n2 ? void 0 : n2.pos) || 0)) / s2) || 0;
    return bt(t2, e2), ct(Y), St(), S && s2 && (o2 === B2 && (i2 -= l2 * s2), i2 === _2 ? k2 = _2 : S.spring({ clamp: true, mass: 1, tension: 300, friction: 25, restDelta: 1, restSpeed: 1 }).from({ pos: i2 }).to({ pos: _2 }).start()), Ct(), It;
  }, canGoPrev: $t, canGoNext: qt, destroy: function() {
    return st("destroy"), window.removeEventListener("resize", rt), Dt(), ot.clear(), H2 = null, U = [], W = [], O2 = Object.assign({}, h), R2 = {}, J = [], L = void 0, Y = "*", P = 2, It;
  }, emit: st, filter: function(t2 = "*") {
    return ct(t2), St(), k2 = t$6(G, k2, X), Ct(), st("filter", t2), It;
  }, getContainer: function() {
    return H2;
  }, getGapDim: pt, getGestures: function() {
    return w2;
  }, getLastMouseMove: function() {
    return b;
  }, getOption: function(t2) {
    return nt(t2);
  }, getOptions: function() {
    return O2;
  }, getPage: function() {
    return U[B2];
  }, getPageIndex: function(t2) {
    if (void 0 !== t2) {
      for (const e2 of U || []) for (const n2 of e2.slides) if (n2.index === t2) return e2.index;
      return -1;
    }
    return B2;
  }, getPageIndexFromPosition: vt, getPageProgress: function(t2, e2) {
    var n2;
    void 0 === t2 && (t2 = B2);
    const i2 = U[t2];
    if (!i2) return t2 > B2 ? -1 : 1;
    const o2 = mt(), s2 = pt();
    let r2 = i2.pos, l2 = Vt();
    if (q2 && true !== e2) {
      const t3 = Math.floor((l2 - (null === (n2 = U[0]) || void 0 === n2 ? void 0 : n2.pos)) / o2) || 0;
      l2 -= t3 * o2, r2 = [r2 + o2, r2, r2 - o2].reduce((function(t4, e3) {
        return Math.abs(e3 - l2) < Math.abs(t4 - l2) ? e3 : t4;
      }));
    }
    return (l2 - r2) / (i2.dim + s2) || 0;
  }, getPageVisibility: function(t2) {
    var e2;
    void 0 === t2 && (t2 = B2);
    const n2 = U[t2];
    if (!n2) return t2 > B2 ? -1 : 1;
    const i2 = Vt(), o2 = gt();
    let s2 = n2.pos;
    if (q2) {
      const t3 = mt(), n3 = s2 + (Math.floor((i2 - (null === (e2 = U[0]) || void 0 === e2 ? void 0 : e2.pos)) / t3) || 0) * t3;
      s2 = [n3 + t3, n3, n3 - t3].reduce((function(t4, e3) {
        return Math.abs(e3 - i2) < Math.abs(t4 - i2) ? e3 : t4;
      }));
    }
    return s2 > i2 && s2 + n2.dim < i2 + o2 ? 1 : s2 < i2 ? (s2 + n2.dim - i2) / n2.dim || 0 : s2 + n2.dim > i2 + o2 && (i2 + o2 - s2) / n2.dim || 0;
  }, getPages: function() {
    return U;
  }, getPlugins: function() {
    return R2;
  }, getPosition: Vt, getSlides: function() {
    return W;
  }, getState: function() {
    return P;
  }, getTotalSlideDim: mt, getTween: function() {
    return S;
  }, getViewport: function() {
    return V;
  }, getViewportDim: gt, getVisibleSlides: function(t2) {
    return void 0 === t2 ? Q : ht(t2);
  }, goTo: Ht, hasNavigated: function() {
    return void 0 !== A2;
  }, hideError: Ot, hideLoading: Tt, init: function() {
    if (!g || !n$9(g)) throw new Error("No Element found");
    return 0 !== P && (Dt(), P = 0), H2 = g, T = x2, window.removeEventListener("resize", rt), T.breakpoints && window.addEventListener("resize", rt), rt(), It;
  }, isInfinite: function() {
    return q2;
  }, isInTransition: function() {
    return K.size > 0;
  }, isRTL: function() {
    return I2;
  }, isSettled: function() {
    return N2;
  }, isVertical: function() {
    return F;
  }, localize: function(t2, e2 = []) {
    return it(t2, e2);
  }, next: function(t2 = {}) {
    return Ht(B2 + 1, t2), It;
  }, off: function(t2, e2) {
    for (const n2 of t2 instanceof Array ? t2 : [t2]) ot.has(n2) && ot.set(n2, ot.get(n2).filter(((t3) => t3 !== e2)));
    return It;
  }, on: function(t2, e2) {
    for (const n2 of t2 instanceof Array ? t2 : [t2]) ot.set(n2, [...ot.get(n2) || [], e2]);
    return It;
  }, prev: function(t2 = {}) {
    return Ht(B2 - 1, t2), It;
  }, reInit: function(e2 = {}, n2) {
    return Dt(), P = 0, L = void 0, Y = "*", x2 = e2, T = e2, t$5(n2) && (M2 = n2), rt(), It;
  }, remove: function(t2) {
    void 0 === t2 && (t2 = W.length - 1);
    const e2 = W[t2];
    return e2 && (st("removeSlide", e2), e2.el && (jt(e2.el), e2.el.remove(), e2.el = void 0), W.splice(t2, 1), ct(Y), St(), k2 = t$6(G, k2, X), Ct()), It;
  }, setPosition: function(t2) {
    k2 = t2, dt(), Ct();
  }, showError: function(t2, e2) {
    Tt(t2), Ot(t2);
    const n2 = t2.el;
    if (n2) {
      const i2 = document.createElement("div");
      s$7(i2, "f-html"), s$7(i2, "is-error"), i2.innerHTML = it(e2 || "<p>{{ERROR}}</p>"), t2.htmlEl = i2, s$7(n2, "has-html"), s$7(n2, "has-error"), n2.insertAdjacentElement("afterbegin", i2), st("contentReady", t2);
    }
    return It;
  }, showLoading: function(t2) {
    const e2 = t2.el, n2 = null == e2 ? void 0 : e2.querySelector(".f-spinner");
    if (!e2 || n2) return It;
    const i2 = nt("spinnerTpl"), o2 = e$8(i2);
    return o2 && (s$7(o2, "f-spinner"), e2.insertAdjacentElement("beforeend", o2)), It;
  }, version: "6.1.6" };
  return It;
};
E.l10n = { en_EN: o$5 }, E.getDefaults = () => h;
const t$2 = (t2 = true, e2 = "--f-scrollbar-compensate", s2 = "--f-body-margin", o2 = "hide-scrollbar") => {
  const n2 = document, r2 = n2.body, l2 = n2.documentElement;
  if (t2) {
    if (r2.classList.contains(o2)) return;
    let t3 = window.innerWidth - l2.getBoundingClientRect().width;
    t3 < 0 && (t3 = 0), l2.style.setProperty(e2, `${t3}px`);
    const n3 = parseFloat(window.getComputedStyle(r2).marginRight);
    n3 && r2.style.setProperty(s2, `${n3}px`), r2.classList.add(o2);
  } else r2.classList.remove(o2), r2.style.setProperty(s2, ""), n2.documentElement.style.setProperty(e2, "");
};
function e$2() {
  return !("undefined" == typeof window || !window.document || !window.document.createElement);
}
const n$5 = function(n2 = "", t2 = "", o2 = "") {
  return n2.split(t2).join(o2);
};
const a$4 = { tpl: (t2) => `<img class="f-panzoom__content" 
    ${t2.srcset ? 'data-lazy-srcset="{{srcset}}"' : ""} 
    ${t2.sizes ? 'data-lazy-sizes="{{sizes}}"' : ""} 
    data-lazy-src="{{src}}" alt="{{alt}}" />` }, s$4 = () => {
  let s2;
  function l2(e2, o2) {
    const n2 = null == s2 ? void 0 : s2.getOptions().Zoomable;
    let i2 = (t$5(n2) ? Object.assign(Object.assign({}, a$4), n2) : a$4)[e2];
    return i2 && "function" == typeof i2 && o2 ? i2(o2) : i2;
  }
  function c2() {
    s2 && false !== s2.getOptions().Zoomable && (s2.on("addSlide", f2), s2.on("removeSlide", u2), s2.on("attachSlideEl", g), s2.on("click", d2), s2.on("change", r2), s2.on("ready", r2));
  }
  function r2() {
    m2();
    const t2 = (null == s2 ? void 0 : s2.getVisibleSlides()) || [];
    if (t2.length > 1 || "slide" === (null == s2 ? void 0 : s2.getOption("transition"))) for (const e2 of t2) {
      const t3 = e2.panzoomRef;
      t3 && ((null == s2 ? void 0 : s2.getPage().slides) || []).indexOf(e2) < 0 && t3.execute(v$1.ZoomTo, Object.assign({}, t3.getStartPosition()));
    }
  }
  function d2(t2, e2) {
    const o2 = e2.target;
    o2 && !e2.defaultPrevented && o2.dataset.panzoomAction && p2(o2.dataset.panzoomAction);
  }
  function f2(t2, i2) {
    const a2 = i2.el;
    if (!s2 || !a2 || i2.panzoomRef) return;
    const c3 = i2.src || i2.lazySrc || "", r3 = i2.alt || i2.caption || `Image #${i2.index}`, d3 = i2.srcset || i2.lazySrcset || "", f3 = i2.sizes || i2.lazySizes || "";
    if (c3 && t$7(c3) && !i2.html && (!i2.type || "image" === i2.type)) {
      i2.type = "image", i2.thumbSrc = i2.thumbSrc || c3;
      let t3 = l2("tpl", i2);
      t3 = n$5(t3, "{{src}}", c3 + ""), t3 = n$5(t3, "{{srcset}}", d3 + ""), t3 = n$5(t3, "{{sizes}}", f3 + ""), a2.insertAdjacentHTML("afterbegin", t3);
    }
    const u3 = a2.querySelector(".f-panzoom__content");
    if (!u3) return;
    u3.setAttribute("alt", r3 + "");
    const g2 = i2.width && "auto" !== i2.width ? parseFloat(i2.width + "") : "auto", p3 = i2.height && "auto" !== i2.height ? parseFloat(i2.height + "") : "auto", z2 = E$1(a2, Object.assign({ width: g2, height: p3, classes: { container: "f-zoomable" }, event: () => null == s2 ? void 0 : s2.getLastMouseMove(), spinnerTpl: () => (null == s2 ? void 0 : s2.getOption("spinnerTpl")) || "" }, l2("Panzoom")));
    z2.on("*", ((t3, e2, ...o2) => {
      s2 && ("loading" === e2 && (i2.state = 0), "loaded" === e2 && (i2.state = 1), "error" === e2 && (i2.state = 2, null == s2 || s2.showError(i2, "{{IMAGE_ERROR}}")), s2.emit(`panzoom:${e2}`, i2, ...o2), "ready" === e2 && s2.emit("contentReady", i2), i2.index === (null == s2 ? void 0 : s2.getPageIndex()) && m2());
    })), i2.panzoomRef = z2;
  }
  function u2(t2, e2) {
    e2.panzoomRef && (e2.panzoomRef.destroy(), e2.panzoomRef = void 0);
  }
  function g(t2, e2) {
    const o2 = e2.panzoomRef;
    if (o2) switch (o2.getState()) {
      case 0:
        o2.init();
        break;
      case 3:
        o2.execute(v$1.ZoomTo, Object.assign(Object.assign({}, o2.getStartPosition()), { velocity: 0 }));
    }
  }
  function m2() {
    var t2, e2;
    const o2 = (null == s2 ? void 0 : s2.getContainer()) || void 0, n2 = null === (e2 = null === (t2 = null == s2 ? void 0 : s2.getPage()) || void 0 === t2 ? void 0 : t2.slides[0]) || void 0 === e2 ? void 0 : e2.panzoomRef;
    if (o2) if (n2) n2.updateControls(o2);
    else for (const t3 of o2.querySelectorAll("[data-panzoom-action]") || []) t3.setAttribute("aria-disabled", ""), t3.setAttribute("tabindex", "-1");
  }
  function p2(t2, ...e2) {
    var o2;
    null === (o2 = null == s2 ? void 0 : s2.getPage().slides[0].panzoomRef) || void 0 === o2 || o2.execute(t2, ...e2);
  }
  return { init: function(t2) {
    s2 = t2, s2.on("initPlugins", c2);
  }, destroy: function() {
    if (s2) {
      s2.off("initPlugins", c2), s2.off("addSlide", f2), s2.off("removeSlide", u2), s2.off("attachSlideEl", g), s2.off("click", d2), s2.off("change", r2), s2.off("ready", r2);
      for (const t2 of s2.getSlides()) u2(0, t2);
    }
    s2 = void 0;
  }, execute: p2 };
};
const e$1 = { syncOnChange: false, syncOnClick: true, syncOnHover: false }, i$5 = () => {
  let i2, t2;
  function o2() {
    const t3 = null == i2 ? void 0 : i2.getOptions().Sync;
    return t$5(t3) ? Object.assign(Object.assign({}, e$1), t3) : e$1;
  }
  function s2(n2) {
    var e2, s3, l3;
    i2 && n2 && (t2 = n2, i2.getOptions().classes = Object.assign(Object.assign({}, i2.getOptions().classes), { isSelected: "" }), i2.getOptions().initialSlide = (null === (s3 = null === (e2 = t2.getPage()) || void 0 === e2 ? void 0 : e2.slides[0]) || void 0 === s3 ? void 0 : s3.index) || 0, o2().syncOnChange && i2.on("change", c2), o2().syncOnClick && i2.on("click", g), o2().syncOnHover && (null === (l3 = i2.getViewport()) || void 0 === l3 || l3.addEventListener("mouseover", u2)), (function() {
      if (!i2 || !t2) return;
      i2.on("ready", d2), i2.on("refresh", a2), t2.on("change", r2), t2.on("filter", f2);
    })());
  }
  function l2() {
    const n2 = o2().target;
    i2 && n2 && s2(n2);
  }
  function d2() {
    v2();
  }
  function c2() {
    var n2;
    if (i2 && t2) {
      const e2 = (null === (n2 = i2.getPage()) || void 0 === n2 ? void 0 : n2.slides) || [], o3 = t2.getPageIndex(e2[0].index || 0);
      o3 > -1 && t2.goTo(o3, i2.hasNavigated() ? void 0 : { tween: false, transition: false }), v2();
    }
  }
  function r2() {
    var n2;
    if (i2 && t2) {
      const e2 = i2.getPageIndex((null === (n2 = t2.getPage()) || void 0 === n2 ? void 0 : n2.slides[0].index) || 0);
      e2 > -1 && i2.goTo(e2, t2.hasNavigated() ? void 0 : { tween: false, transition: false }), v2();
    }
  }
  function g(n2, e2) {
    var o3;
    if (!i2 || !t2) return;
    if (null === (o3 = i2.getTween()) || void 0 === o3 ? void 0 : o3.isRunning()) return;
    const s3 = null == i2 ? void 0 : i2.getOptions().classes.slide;
    if (!s3) return;
    const l3 = s3 ? e2.target.closest(`.${s3}`) : null;
    if (l3) {
      const n3 = parseInt(l3.getAttribute("index") || "") || 0, e3 = t2.getPageIndex(n3);
      t2.goTo(e3);
    }
  }
  function u2(n2) {
    i2 && g(0, n2);
  }
  function a2() {
    var n2;
    if (i2 && t2) {
      const e2 = i2.getPageIndex((null === (n2 = t2.getPage()) || void 0 === n2 ? void 0 : n2.slides[0].index) || 0);
      e2 > -1 && i2.goTo(e2, { tween: false, transition: false }), v2();
    }
  }
  function f2(n2, e2) {
    i2 && t2 && (i2.filter(e2), r2());
  }
  function v2() {
    var n2, e2, o3;
    if (!t2) return;
    const s3 = (null === (e2 = null === (n2 = t2.getPage()) || void 0 === n2 ? void 0 : n2.slides[0]) || void 0 === e2 ? void 0 : e2.index) || 0;
    for (const n3 of (null == i2 ? void 0 : i2.getSlides()) || []) null === (o3 = n3.el) || void 0 === o3 || o3.classList.toggle("is-selected", n3.index === s3);
  }
  return { init: function(n2) {
    i2 = n2, i2.on("initSlides", l2);
  }, destroy: function() {
    var n2;
    null == i2 || i2.off("ready", d2), null == i2 || i2.off("refresh", a2), null == i2 || i2.off("change", c2), null == i2 || i2.off("click", g), null === (n2 = null == i2 ? void 0 : i2.getViewport()) || void 0 === n2 || n2.removeEventListener("mouseover", u2), null == t2 || t2.off("change", r2), null == t2 || t2.off("filter", f2), t2 = void 0, null == i2 || i2.off("initSlides", l2), i2 = void 0;
  }, getTarget: function() {
    return t2;
  } };
};
const s$3 = { showLoading: true, preload: 1 }, n$4 = "is-lazyloading", o$4 = "is-lazyloaded", l$5 = "has-lazyerror", i$4 = () => {
  let i2;
  function d2() {
    const e2 = null == i2 ? void 0 : i2.getOptions().Lazyload;
    return t$5(e2) ? Object.assign(Object.assign({}, s$3), e2) : s$3;
  }
  function r2(t2) {
    var s2;
    const r3 = t2.el;
    if (!r3) return;
    const c3 = "[data-lazy-src],[data-lazy-srcset],[data-lazy-bg]", u2 = Array.from(r3.querySelectorAll(c3));
    r3.matches(c3) && u2.push(r3);
    for (const r4 of u2) {
      const c4 = r4.dataset.lazySrc, u3 = r4.dataset.lazySrcset, f2 = r4.dataset.lazySizes, m2 = r4.dataset.lazyBg, y2 = (r4 instanceof HTMLImageElement || r4 instanceof HTMLSourceElement) && (c4 || u3), z2 = r4 instanceof HTMLElement && m2;
      if (!y2 && !z2) continue;
      const g = c4 || u3 || m2;
      if (g) {
        if (y2 && g) {
          const m3 = null === (s2 = r4.parentElement) || void 0 === s2 ? void 0 : s2.classList.contains("f-panzoom__wrapper");
          d2().showLoading && (null == i2 || i2.showLoading(t2)), r4.addEventListener("load", (() => {
            null == i2 || i2.hideLoading(t2), s$6(r4, l$5), r4 instanceof HTMLImageElement ? r4.decode().then((() => {
              s$6(r4, n$4), s$7(r4, o$4);
            })) : (s$6(r4, n$4), s$7(r4, o$4)), m3 || null == i2 || i2.emit("lazyLoad:loaded", t2, r4, g);
          })), r4.addEventListener("error", (() => {
            null == i2 || i2.hideLoading(t2), s$6(r4, n$4), s$7(r4, l$5), m3 || null == i2 || i2.emit("lazyLoad:error", t2, r4, g);
          })), r4.classList.add("f-lazyload"), r4.classList.add(n$4), m3 || null == i2 || i2.emit("lazyLoad:load", t2, r4, g), c4 && (r4.src = c4), u3 && (r4.srcset = u3), f2 && (r4.sizes = f2);
        } else if (z2) {
          if (!document.body.contains(r4)) {
            document.createElement("img").src = m2;
          }
          r4.style.backgroundImage = `url('${m2}')`;
        }
        delete r4.dataset.lazySrc, delete r4.dataset.lazySrcset, delete r4.dataset.lazySizes, delete r4.dataset.lazyBg;
      }
    }
  }
  function c2() {
    if (!i2) return;
    const e2 = [...i2.getVisibleSlides()], t2 = d2().preload;
    if (t2 > 0) {
      const a2 = i2.getPosition(), s2 = i2.getViewportDim();
      e2.push(...i2.getVisibleSlides(a2 + s2 * t2), ...i2.getVisibleSlides(a2 - s2 * t2));
    }
    for (const t3 of e2) r2(t3);
  }
  return { init: function(e2) {
    i2 = e2, i2.on("render", c2);
  }, destroy: function() {
    null == i2 || i2.off("render", c2), i2 = void 0;
  } };
};
const r$2 = '<svg width="24" height="24" viewBox="0 0 24 24" tabindex="-1">', i$3 = "</svg>", s$2 = { prevTpl: r$2 + '<path d="M15 3l-9 9 9 9"></path>' + i$3, nextTpl: r$2 + '<path d="M9 3l9 9-9 9"></path>' + i$3 }, l$4 = () => {
  let r2, i2, l2;
  function a2() {
    const t2 = null == r2 ? void 0 : r2.getOptions().Arrows;
    return t$5(t2) ? Object.assign(Object.assign({}, s$2), t2) : s$2;
  }
  function u2(e2) {
    if (!r2) return;
    const o2 = `<button data-carousel-go-${e2} tabindex="0" class="f-button is-arrow is-${e2}" title="{{${e2.toUpperCase()}}}">` + a2()[`${e2}Tpl`] + "</button", i3 = e$8(r2.localize(o2)) || void 0;
    return i3 && s$7(i3, a2()[`${e2}Class`]), i3;
  }
  function c2() {
    var t2;
    null == i2 || i2.remove(), i2 = void 0, null == l2 || l2.remove(), l2 = void 0, null === (t2 = null == r2 ? void 0 : r2.getContainer()) || void 0 === t2 || t2.classList.remove("has-arrows");
  }
  function d2() {
    r2 && false !== r2.getOptions().Arrows && r2.getPages().length > 1 ? (!(function() {
      if (!r2) return;
      const t2 = r2.getViewport();
      t2 && (i2 || (i2 = u2("prev"), i2 && t2.insertAdjacentElement("beforebegin", i2)), l2 || (l2 = u2("next"), l2 && t2.insertAdjacentElement("afterend", l2)), s$5(r2.getContainer(), "has-arrows", !(!i2 && !l2)));
    })(), r2 && (null == i2 || i2.toggleAttribute("aria-disabled", !r2.canGoPrev()), null == l2 || l2.toggleAttribute("aria-disabled", !r2.canGoNext()))) : c2();
  }
  return { init: function(t2) {
    r2 = t2.on(["change", "refresh"], d2);
  }, destroy: function() {
    c2(), null == r2 || r2.off(["change", "refresh"], d2), r2 = void 0;
  } };
};
const t$1 = '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/>', M = '<g><line x1="11" y1="8" x2="11" y2="14"></line></g>' + t$1, o$3 = { moveLeft: ["moveLeft", "MOVE_LEFT", '<path d="M5 12h14M5 12l6 6M5 12l6-6"/>'], moveRight: ["moveRight", "MOVE_RIGHT", '<path d="M5 12h14M13 18l6-6M13 6l6 6"/>'], moveUp: ["moveUp", "MOVE_UP", '<path d="M12 5v14M18 11l-6-6M6 11l6-6"/>'], moveDown: ["moveDown", "MOVE_DOWN", '<path d="M12 5v14M18 13l-6 6M6 13l6 6"/>'], zoomOut: ["zoomOut", "ZOOM_OUT", t$1], zoomIn: ["zoomIn", "ZOOM_IN", M], toggleFull: ["toggleFull", "TOGGLE_FULL", M], iterateZoom: ["iterateZoom", "ITERATE_ZOOM", M], toggle1to1: ["toggleFull", "TOGGLE_FULL", '<path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/>'], rotateCCW: ["rotateCCW", "ROTATE_CCW", '<path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/>'], rotateCW: ["rotateCW", "ROTATE_CW", '<path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/>'], flipX: ["flipX", "FLIP_X", '<path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/>'], flipY: ["flipY", "FLIP_Y", '<path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/>'], reset: ["reset", "RESET", '<path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>'], toggleFS: ["toggleFS", "TOGGLE_FS", '<g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g>'] }, v = {};
for (const [t2, M2] of Object.entries(o$3)) v[t2] = { tpl: `<button data-panzoom-action="${M2[0]}" class="f-button" title="{{${M2[1]}}}"><svg>${M2[2]}</svg></button>` };
var l$3;
!(function(t2) {
  t2.Left = "left", t2.middle = "middle", t2.right = "right";
})(l$3 || (l$3 = {}));
const s$1 = Object.assign({ counter: { tpl: '<div class="f-counter"><span data-carousel-page></span>/<span data-carousel-pages></span></div>' }, download: { tpl: '<button data-carousel-download class="f-button" title="{{DOWNLOAD}}"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></button>' }, autoplay: { tpl: '<button data-autoplay-action="toggle" class="f-button" title="{{TOGGLE_AUTOPLAY}}"><svg><g><path d="M5 3.5 19 12 5 20.5Z"/></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>' }, thumbs: { tpl: '<button data-thumbs-action="toggle" class="f-button" title="{{TOGGLE_THUMBS}}"><svg><rect width="18" height="14" x="3" y="3" rx="2"/><path d="M4 21h1M9 21h1M14 21h1M19 21h1"/></svg></button>' } }, v), a$3 = { absolute: false, display: { left: [], middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY", "reset"], right: [] }, enabled: "auto", items: {} }, r$1 = () => {
  let l2, r2;
  function u2(e2) {
    const o2 = null == l2 ? void 0 : l2.getOptions().Toolbar;
    let n2 = (t$5(o2) ? Object.assign(Object.assign({}, a$3), o2) : a$3)[e2];
    return n2 && "function" == typeof n2 && l2 ? n2(l2) : n2;
  }
  function c2() {
    var a2, c3;
    if (!(null == l2 ? void 0 : l2.getOptions().Toolbar)) return;
    if (!l2 || r2) return;
    const d2 = l2.getContainer();
    if (!d2) return;
    let f2 = u2("enabled");
    if (!f2) return;
    const g = u2("absolute"), p2 = l2.getSlides().length > 1;
    let b2 = false, m2 = false;
    for (const t2 of l2.getSlides()) t2.panzoomRef && (b2 = true), (t2.downloadSrc || "image" === t2.type && t2.src) && (m2 = true);
    const v$12 = (null === (a2 = l2.getPlugins().Thumbs) || void 0 === a2 ? void 0 : a2.isEnabled()) || false, h2 = p2 && l2.getPlugins().Autoplay || false, E2 = l2.getPlugins().Fullscreen && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
    if ("auto" === f2 && (f2 = b2), !f2) return;
    r2 = d2.querySelector(".f-carousel__toolbar") || void 0, r2 || (r2 = document.createElement("div"), r2.classList.add("f-carousel__toolbar"));
    const y2 = u2("display"), j2 = r$3({}, s$1, u2("items"));
    for (const i2 of ["left", "middle", "right"]) {
      const s2 = y2[i2] || [], a3 = document.createElement("div");
      a3.classList.add("f-carousel__toolbar__column"), a3.classList.add(`is-${i2}`);
      for (const i3 of s2) {
        let s3;
        if (t$7(i3)) {
          if ("counter" === i3 && !p2) continue;
          if ("autoplay" === i3 && !h2) continue;
          if (v[i3] && !b2) continue;
          if ("fullscreen" === i3 && !E2) continue;
          if ("thumbs" === i3 && !v$12) continue;
          if ("download" === i3 && !m2) continue;
          s3 = j2[i3];
        }
        if (t$5(i3) && (s3 = i3), s3 && s3.tpl) {
          let t2 = l2.localize(s3.tpl);
          t2 = t2.split("<svg>").join('<svg tabindex="-1" width="24" height="24" viewBox="0 0 24 24">');
          const e2 = e$8(t2);
          e2 && ("function" == typeof s3.click && l2 && e2.addEventListener("click", ((t3) => {
            t3.preventDefault(), t3.stopPropagation(), "function" == typeof s3.click && l2 && s3.click(l2, t3);
          })), a3.append(e2));
        }
      }
      r2.append(a3);
    }
    if (r2.childElementCount) {
      if (g && r2.classList.add("is-absolute"), !r2.parentElement) {
        const t2 = u2("parentEl");
        t2 ? t2.insertAdjacentElement("afterbegin", r2) : null === (c3 = l2.getViewport()) || void 0 === c3 || c3.insertAdjacentElement("beforebegin", r2);
      }
      d2.contains(r2) && d2.classList.add("has-toolbar");
    }
  }
  return { init: function(t2) {
    l2 = t2, null == l2 || l2.on("initSlides", c2);
  }, destroy: function() {
    var t2;
    null == l2 || l2.off("initSlides", c2), null === (t2 = null == l2 ? void 0 : l2.getContainer()) || void 0 === t2 || t2.classList.remove("has-toolbar"), null == r2 || r2.remove(), r2 = void 0;
  }, add: function(t2, e2) {
    s$1[t2] = e2;
  }, isEnabled: function() {
    return !!r2;
  } };
};
const n$3 = { autoStart: true, pauseOnHover: true, showProgressbar: true, timeout: 2e3 }, o$2 = () => {
  let o2, i2, a2 = false, s2 = false, l2 = false, r2 = null;
  function u2(e2) {
    const i3 = null == o2 ? void 0 : o2.getOptions().Autoplay;
    let a3 = (t$5(i3) ? Object.assign(Object.assign({}, n$3), i3) : n$3)[e2];
    return a3 && "function" == typeof a3 && o2 ? a3(o2) : a3;
  }
  function f2() {
    clearTimeout(i2), i2 = void 0;
  }
  function g() {
    if (!o2 || !a2 || l2 || s2 || i2 || !o2.isSettled() || (function() {
      var t3;
      const e2 = (null === (t3 = null == o2 ? void 0 : o2.getPage()) || void 0 === t3 ? void 0 : t3.slides) || [];
      for (const t4 of e2) if (0 === t4.state) return true;
      return false;
    })()) return;
    !(function() {
      var t3, n2, i3, a3;
      if (!o2) return;
      if (v2(), !u2("showProgressbar")) return;
      let s3 = u2("progressbarParentEl");
      !s3 && (null === (t3 = o2.getPlugins().Toolbar) || void 0 === t3 ? void 0 : t3.isEnabled()) && (s3 = o2.getContainer());
      if (!s3 && true !== (null === (n2 = o2.getPlugins().Toolbar) || void 0 === n2 ? void 0 : n2.isEnabled())) {
        const t4 = (null === (i3 = o2.getPages()[0]) || void 0 === i3 ? void 0 : i3.slides) || [], e2 = (null === (a3 = o2.getPage()) || void 0 === a3 ? void 0 : a3.slides) || [];
        1 === t4.length && 1 === e2.length && (s3 = e2[0].el);
      }
      s3 || (s3 = o2.getViewport());
      if (!s3) return;
      r2 = document.createElement("div"), s$7(r2, "f-progressbar"), s3.prepend(r2);
      const l3 = u2("timeout") || 1e3;
      r2.style.animationDuration = `${l3}ms`;
    })();
    const t2 = u2("timeout");
    i2 = setTimeout((() => {
      o2 && a2 && !s2 && (o2.isInfinite() || o2.getPageIndex() !== o2.getPages().length - 1 ? o2.next() : o2.goTo(0));
    }), t2);
  }
  function c2() {
    var t2;
    if (!o2 || o2.getPages().length < 2 || false === o2.getOptions().Autoplay) return;
    if (a2) return;
    a2 = true, o2.emit("autoplay:start", u2("timeout")), s$7(o2.getContainer(), "has-autoplay"), null === (t2 = o2.getTween()) || void 0 === t2 || t2.on("start", b2);
    const n2 = null == o2 ? void 0 : o2.getContainer();
    n2 && u2("pauseOnHover") && matchMedia("(hover: hover)").matches && (n2.addEventListener("mouseenter", E2, false), n2.addEventListener("mouseleave", w2, false)), o2.on("change", P), o2.on("settle", y2), o2.on("contentReady", p2), o2.on("panzoom:touchStart", d2), o2.on("panzoom:wheel", d2), o2.isSettled() && g();
  }
  function d2() {
    var t2;
    if (f2(), v2(), o2) {
      if (a2) {
        o2.emit("autoplay:end"), null === (t2 = o2.getTween()) || void 0 === t2 || t2.off("start", b2);
        const e2 = o2.getContainer();
        e2 && (e2.classList.remove("has-autoplay"), e2.removeEventListener("mouseenter", E2, false), e2.removeEventListener("mouseleave", w2, false));
      }
      o2.off("change", P), o2.off("settle", y2), o2.off("contentReady", p2), o2.off("panzoom:touchStart", d2), o2.off("panzoom:wheel", d2);
    }
    a2 = false, s2 = false;
  }
  function v2() {
    r2 && (r2.remove(), r2 = null);
  }
  function m2() {
    o2 && o2.getPages().length > 1 && u2("autoStart") && c2();
  }
  function p2() {
    g();
  }
  function h2(t2, e2) {
    const n2 = e2.target;
    n2 && !e2.defaultPrevented && "toggle" === n2.dataset.autoplayAction && O2.toggle();
  }
  function P() {
    !o2 || !(null == o2 ? void 0 : o2.isInfinite()) && o2.getPageIndex() === o2.getPages().length - 1 ? d2() : (v2(), f2());
  }
  function y2() {
    g();
  }
  function b2() {
    f2(), v2();
  }
  function E2() {
    l2 = true, a2 && (v2(), f2());
  }
  function w2() {
    l2 = false, a2 && !s2 && (null == o2 ? void 0 : o2.isSettled()) && g();
  }
  const O2 = { init: function(t2) {
    o2 = t2, o2.on("ready", m2), o2.on("click", h2);
  }, destroy: function() {
    d2(), null == o2 || o2.off("ready", m2), null == o2 || o2.off("click", h2), o2 = void 0;
  }, isEnabled: () => a2, pause: function() {
    s2 = true, f2();
  }, resume: function() {
    s2 = false, a2 && !l2 && g();
  }, start() {
    c2();
  }, stop() {
    d2();
  }, toggle() {
    a2 ? d2() : c2();
  } };
  return O2;
};
const u$1 = { Carousel: { Lazyload: { showLoading: false } }, minCount: 2, showOnStart: true, thumbTpl: '<button aria-label="Slide to #{{page}}"><img draggable="false" alt="{{alt}}" data-lazy-src="{{src}}" /></button>', type: "modern" };
let a$2;
const c$1 = () => {
  let c2, d2, f2, m2, g, h2 = 0, v2 = 0, p2 = true;
  function b2(e2) {
    const n2 = null == c2 ? void 0 : c2.getOptions().Thumbs;
    let o2 = (t$5(n2) ? Object.assign(Object.assign({}, u$1), n2) : u$1)[e2];
    return o2 && "function" == typeof o2 && c2 ? o2(c2) : o2;
  }
  function y2() {
    if (!c2) return false;
    if (false === (null == c2 ? void 0 : c2.getOptions().Thumbs)) return false;
    let t2 = 0;
    for (const e2 of c2.getSlides()) e2.thumbSrc && t2++;
    return t2 >= b2("minCount");
  }
  function x2() {
    return "modern" === b2("type");
  }
  function S() {
    return "scrollable" === b2("type");
  }
  function C() {
    const t2 = [], e2 = (null == c2 ? void 0 : c2.getSlides()) || [];
    for (const n2 of e2) t2.push({ index: n2.index, class: n2.thumbClass, html: T(n2) });
    return t2;
  }
  function T(t2) {
    const e2 = t2.thumb ? t2.thumb instanceof HTMLImageElement ? t2.thumb.src : t2.thumb : t2.thumbSrc || void 0, o2 = void 0 === t2.thumbAlt ? `Thumbnail #${t2.index}` : t2.thumbAlt + "";
    let i2 = b2("thumbTpl");
    return i2 = n$5(i2, "{{alt}}", o2), i2 = n$5(i2, "{{src}}", e2 + ""), i2 = n$5(i2, "{{index}}", `${t2.index}`), i2 = n$5(i2, "{{page}}", `${t2.index || 1}`), i2;
  }
  function L(t2) {
    return `<div index="${t2.index || 0}" class="f-thumbs__slide ${t2.class || ""}">${t2.html || ""}</div>`;
  }
  function E2(t2 = false) {
    var e2;
    const n2 = null == c2 ? void 0 : c2.getContainer();
    if (!c2 || !n2 || f2) return;
    if (!y2()) return;
    const o2 = (null === (e2 = b2("Carousel")) || void 0 === e2 ? void 0 : e2.classes) || {};
    if (o2.container = o2.container || "f-thumbs", !f2) {
      const t3 = n2.nextElementSibling;
      (null == t3 ? void 0 : t3.classList.contains(o2.container)) && (f2 = t3);
    }
    if (!f2) {
      f2 = document.createElement("div");
      const t3 = b2("parentEl");
      t3 ? t3.insertAdjacentElement("beforeend", f2) : n2.insertAdjacentElement("afterend", f2);
    }
    s$7(f2, o2.container), s$7(f2, "f-thumbs"), s$7(f2, `is-${b2("type")}`), t2 && s$7(f2, "is-hidden");
  }
  function P() {
    if (!f2 || !S()) return;
    m2 = document.createElement("div"), s$7(m2, "f-thumbs__viewport");
    let t2 = "";
    for (const e2 of C()) {
      "string" == typeof (e2.html || "") && (t2 += L(e2));
    }
    m2.innerHTML = t2, f2.append(m2), f2.addEventListener("click", ((t3) => {
      t3.preventDefault();
      const e2 = t3.target.closest("[index]"), n2 = parseInt((null == e2 ? void 0 : e2.getAttribute("index")) || "-1");
      c2 && n2 > -1 && c2.goTo(n2);
    })), g = new IntersectionObserver(((t3) => {
      t3.forEach(((t4) => {
        t4.isIntersecting && t4.target instanceof HTMLImageElement && (t4.target.src = t4.target.getAttribute("data-lazy-src") + "", t4.target.removeAttribute("data-lazy-src"), null == g || g.unobserve(t4.target));
      }));
    }), { root: m2, rootMargin: "100px" }), f2.querySelectorAll("[data-lazy-src]").forEach(((t3) => {
      null == g || g.observe(t3);
    })), null == c2 || c2.emit("thumbs:ready");
  }
  function w2() {
    var t2;
    if (!a$2 || !c2 || !f2 || S() || d2) return;
    const n2 = C();
    if (!n2.length) return;
    const o2 = r$3({}, { Sync: { target: c2 }, Lazyload: { preload: 1 }, slides: n2, classes: { container: "f-thumbs", viewport: "f-thumbs__viewport", slide: "f-thumbs__slide" }, center: true, fill: !x2(), infinite: false, dragFree: true, rtl: c2.getOptions().rtl || false, slidesPerPage: (t3) => {
      let e2 = 0;
      return x2() && (!(function() {
        if (!x2()) return;
        if (!f2) return;
        const t4 = (t5) => f2 && parseFloat(getComputedStyle(f2).getPropertyValue("--f-thumb-" + t5)) || 0;
        h2 = t4("width"), v2 = t4("clip-width");
      })(), e2 = 4 * (h2 - v2)), t3 && t3.getTotalSlideDim() <= t3.getViewportDim() - e2 ? 1 / 0 : 1;
    } }, u$1.Carousel || {}, b2("Carousel") || {});
    d2 = a$2(f2, o2, { Sync: i$5, Lazyload: i$4 }), d2.on("ready", (() => {
      s$7(f2, "is-syncing"), null == c2 || c2.emit("thumbs:ready"), x2() && (null == c2 || c2.on("render", $));
    })), d2.on("destroy", (() => {
      null == c2 || c2.emit("thumbs:destroy");
    })), d2.init(), null === (t2 = d2.getGestures()) || void 0 === t2 || t2.on("start", (() => {
      p2 = false;
    })), d2.on("click", ((t3, e2) => {
      const n3 = e2.target;
      if (n3) {
        const t4 = n3.matches("button") ? n3 : n3.firstElementChild;
        t4 && t4.matches("button") && (e2.preventDefault(), t4.focus({ preventScroll: true }));
      }
    })), s$7(c2.getContainer(), "has-thumbs"), R2();
  }
  function j2() {
    y2() && b2("showOnStart") && (E2(), P());
  }
  function A2() {
    var t2;
    y2() && (w2(), null == c2 || c2.on("addSlide", z2), null == c2 || c2.on("removeSlide", _2), null == c2 || c2.on("click", I2), null == c2 || c2.on("refresh", q2), null === (t2 = null == c2 ? void 0 : c2.getGestures()) || void 0 === t2 || t2.on("start", M2), D2(true));
  }
  function M2() {
    var t2, e2;
    p2 = true;
    (null === (t2 = document.activeElement) || void 0 === t2 ? void 0 : t2.closest(".f-thumbs")) && (null === (e2 = document.activeElement) || void 0 === e2 || e2.blur());
  }
  function $() {
    var t2, e2;
    null == f2 || f2.classList.toggle("is-syncing", false === (null == c2 ? void 0 : c2.hasNavigated()) || (null === (t2 = null == c2 ? void 0 : c2.getTween()) || void 0 === t2 ? void 0 : t2.isRunning())), R2(), (null === (e2 = null == c2 ? void 0 : c2.getGestures()) || void 0 === e2 ? void 0 : e2.isPointerDown()) && (function() {
      if (!x2()) return;
      if (!c2 || !d2) return;
      if (!p2) return;
      const t3 = d2.getTween(), e3 = d2.getPages(), n2 = c2.getPageIndex() || 0, i2 = c2.getPageProgress() || 0;
      if (!(c2 && e3 && e3[n2] && t3)) return;
      const l2 = t3.isRunning() ? t3.getCurrentValues().pos : d2.getPosition();
      if (void 0 === l2) return;
      let r2 = e3[n2].pos + i2 * (h2 - v2);
      r2 = t$6(e3[0].pos, r2, e3[e3.length - 1].pos), t3.from({ pos: l2 }).to({ pos: r2 }).start();
    })();
  }
  function O2() {
    p2 = true, D2();
  }
  function z2(t2, e2) {
    const n2 = { html: T(e2) };
    if (d2) d2.add(n2, e2.index);
    else if (m2) {
      const t3 = e$8(L(n2));
      if (t3) {
        m2.append(t3);
        const e3 = t3.querySelector("img");
        e3 && (null == g || g.observe(e3));
      }
    }
  }
  function _2(t2, e2) {
    var n2;
    d2 ? d2.remove(e2.index) : m2 && (null === (n2 = m2.querySelector(`[index="${e2.index}"]`)) || void 0 === n2 || n2.remove());
  }
  function I2(t2, e2) {
    var n2;
    const o2 = e2.target;
    e2.defaultPrevented || "toggle" !== (null === (n2 = null == o2 ? void 0 : o2.dataset) || void 0 === n2 ? void 0 : n2.thumbsAction) || (f2 || (E2(true), P(), w2()), f2 && f2.classList.toggle("is-hidden"));
  }
  function q2() {
    D2();
  }
  function D2(t2 = false) {
    if (!c2 || !m2 || !S()) return;
    const e2 = c2.getPageIndex();
    m2.querySelectorAll(".is-selected").forEach(((t3) => {
      t3.classList.remove("is-selected");
    }));
    const n2 = m2.querySelector(`[index="${e2}"]`);
    if (n2) {
      n2.classList.add("is-selected");
      const e3 = m2.getBoundingClientRect(), o2 = n2.getBoundingClientRect(), i2 = n2.offsetTop - m2.offsetTop - 0.5 * e3.height + 0.5 * o2.height, l2 = n2.scrollLeft - m2.scrollLeft - 0.5 * e3.width + 0.5 * o2.width;
      m2.scrollTo({ top: i2, left: l2, behavior: t2 ? "instant" : "smooth" });
    }
  }
  function R2() {
    if (!x2()) return;
    if (!c2 || !d2) return;
    const t2 = (null == d2 ? void 0 : d2.getSlides()) || [];
    let e2 = -0.5 * h2;
    for (const n2 of t2) {
      const t3 = n2.el;
      if (!t3) continue;
      let o2 = c2.getPageProgress(n2.index) || 0;
      o2 = Math.max(-1, Math.min(1, o2)), o2 > -1 && o2 < 1 && (e2 += 0.5 * h2 * (1 - Math.abs(o2))), o2 = Math.round(1e4 * o2) / 1e4, e2 = Math.round(1e4 * e2) / 1e4, t3.style.setProperty("--progress", `${Math.abs(o2)}`), t3.style.setProperty("--shift", `${(null == c2 ? void 0 : c2.isRTL()) ? -1 * e2 : e2}px`), o2 > -1 && o2 < 1 && (e2 += 0.5 * h2 * (1 - Math.abs(o2)));
    }
  }
  return { init: function(t2, e2) {
    a$2 = e2, c2 = t2, c2.on("ready", A2), c2.on("initSlides", j2), c2.on("change", O2);
  }, destroy: function() {
    var t2, e2;
    S() && (null == c2 || c2.emit("thumbs:destroy")), null == c2 || c2.off("ready", A2), null == c2 || c2.off("initSlides", j2), null == c2 || c2.off("change", O2), null == c2 || c2.off("render", $), null == c2 || c2.off("addSlide", z2), null == c2 || c2.off("click", I2), null == c2 || c2.off("refresh", q2), null === (t2 = null == c2 ? void 0 : c2.getGestures()) || void 0 === t2 || t2.off("start", M2), null === (e2 = null == c2 ? void 0 : c2.getContainer()) || void 0 === e2 || e2.classList.remove("has-thumbs"), c2 = void 0, null == d2 || d2.destroy(), d2 = void 0, null == f2 || f2.remove(), f2 = void 0;
  }, getCarousel: function() {
    return d2;
  }, getContainer: function() {
    return f2;
  }, getType: function() {
    return b2("type");
  }, isEnabled: y2 };
};
const a$1 = { iframeAttr: { allow: "autoplay; fullscreen", scrolling: "auto" } }, i$2 = () => {
  let i2;
  function l2(t2, a2) {
    let i3 = a2.src;
    if (!t$7(i3)) return;
    let l3 = a2.type;
    if (!l3) {
      if (l3 || ("#" === i3.charAt(0) ? l3 = "inline" : i3.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.((a)?png|avif|gif|jp(g|eg)|pjp(eg)?|jfif|svg|webp|bmp|ico|tif(f)?)((\?|#).*)?$)/i) ? l3 = "image" : i3.match(/\.(pdf)((\?|#).*)?$/i) ? l3 = "pdf" : i3.match(/\.(html|php)((\?|#).*)?$/i) && (l3 = "iframe")), !l3) {
        const t3 = i3.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i);
        t3 && (i3 = `https://maps.google.${t3[1]}/?ll=${(t3[2] ? t3[2] + "&z=" + Math.floor(parseFloat(t3[3])) + (t3[4] ? t3[4].replace(/^\//, "&") : "") : t3[4] + "").replace(/\?/, "&")}&output=${t3[4] && t3[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`, l3 = "gmap");
      }
      if (!l3) {
        const t3 = i3.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i);
        t3 && (i3 = `https://maps.google.${t3[1]}/maps?q=${t3[2].replace("query=", "q=").replace("api=1", "")}&output=embed`, l3 = "gmap");
      }
      a2.src = i3, a2.type = l3;
    }
  }
  function o2(e2, l3) {
    "iframe" !== l3.type && "pdf" !== l3.type && "gmap" !== l3.type || (function(e3) {
      if (!i2 || !e3.el || !e3.src) return;
      const l4 = document.createElement("iframe");
      l4.classList.add("f-iframe");
      for (const [e4, o4] of Object.entries((function() {
        const e5 = null == i2 ? void 0 : i2.getOptions().Html;
        return t$5(e5) ? Object.assign(Object.assign({}, a$1), e5) : a$1;
      })().iframeAttr || {})) l4.setAttribute(e4, o4);
      l4.onerror = () => {
        i2 && 1 === i2.getState() && i2.showError(e3, "{{IFRAME_ERROR}}");
      }, l4.src = e3.src;
      const o3 = document.createElement("div");
      if (o3.classList.add("f-html"), o3.append(l4), e3.width) {
        let t2 = `${e3.width}`;
        t2.match(/^\d+$/) && (t2 += "px"), o3.style.maxWidth = `${t2}`;
      }
      if (e3.height) {
        let t2 = `${e3.height}`;
        t2.match(/^\d+$/) && (t2 += "px"), o3.style.maxHeight = `${t2}`;
      }
      if (e3.aspectRatio) {
        const t2 = e3.el.getBoundingClientRect();
        o3.style.aspectRatio = `${e3.aspectRatio}`, o3.style[t2.width > t2.height ? "width" : "height"] = "auto", o3.style[t2.width > t2.height ? "maxWidth" : "maxHeight"] = "none";
      }
      e3.contentEl = l4, e3.htmlEl = o3, e3.el.classList.add("has-html"), e3.el.classList.add("has-iframe"), e3.el.classList.add(`has-${e3.type}`), e3.el.prepend(o3), i2.emit("contentReady", e3);
    })(l3);
  }
  function n2(t2, e2) {
    var a2, l3;
    "iframe" !== e2.type && "pdf" !== e2.type && "gmap" !== e2.type || (null == i2 || i2.hideError(e2), null === (a2 = e2.contentEl) || void 0 === a2 || a2.remove(), e2.contentEl = void 0, null === (l3 = e2.htmlEl) || void 0 === l3 || l3.remove(), e2.htmlEl = void 0);
  }
  return { init: function(t2) {
    i2 = t2, i2.on("addSlide", l2), i2.on("attachSlideEl", o2), i2.on("detachSlideEl", n2);
  }, destroy: function() {
    null == i2 || i2.off("addSlide", l2), null == i2 || i2.off("attachSlideEl", o2), null == i2 || i2.off("detachSlideEl", n2), i2 = void 0;
  } };
};
const n$2 = (t2, e2 = {}) => {
  const o2 = new URL(t2), n2 = new URLSearchParams(o2.search), i2 = new URLSearchParams();
  for (const [t3, o3] of [...n2, ...Object.entries(e2)]) {
    let e3 = o3 + "";
    if ("t" === t3) {
      let t4 = e3.match(/((\d*)m)?(\d*)s?/);
      t4 && i2.set("start", 60 * parseInt(t4[2] || "0") + parseInt(t4[3] || "0") + "");
    } else i2.set(t3, e3);
  }
  let l2 = i2 + "", s2 = t2.match(/#t=((.*)?\d+s)/);
  return s2 && (l2 += `#t=${s2[1]}`), l2;
}, i$1 = { autoplay: false, html5videoTpl: `<video class="f-html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
    <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`, iframeAttr: { allow: "autoplay; fullscreen", scrolling: "auto", credentialless: "" }, vimeo: { byline: 1, color: "00adef", controls: 1, dnt: 1, muted: 0 }, youtube: { controls: 1, enablejsapi: 1, nocookie: 1, rel: 0, fs: 1 } }, l$2 = () => {
  let l2, s2 = false;
  function a2() {
    const e2 = null == l2 ? void 0 : l2.getOptions().Video;
    return t$5(e2) ? Object.assign(Object.assign({}, i$1), e2) : i$1;
  }
  function r2() {
    var t2;
    return null === (t2 = null == l2 ? void 0 : l2.getPage()) || void 0 === t2 ? void 0 : t2.slides[0];
  }
  const c2 = (t2) => {
    var e2;
    try {
      let o2 = JSON.parse(t2.data);
      if ("https://player.vimeo.com" === t2.origin) {
        if ("ready" === o2.event) for (let o3 of Array.from((null === (e2 = null == l2 ? void 0 : l2.getContainer()) || void 0 === e2 ? void 0 : e2.getElementsByClassName("f-iframe")) || [])) o3 instanceof HTMLIFrameElement && o3.contentWindow === t2.source && (o3.dataset.ready = "true");
      } else if (t2.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) && "onReady" === o2.event) {
        const t3 = document.getElementById(o2.id);
        t3 && (t3.dataset.ready = "true");
      }
    } catch (t3) {
    }
  };
  function d2(t2, o2) {
    const i2 = o2.src;
    if (!t$7(i2)) return;
    let l3 = o2.type;
    if (!l3 || "html5video" === l3) {
      const t3 = i2.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i);
      t3 && (l3 = "html5video", o2.html5videoFormat = o2.html5videoFormat || "video/" + ("ogv" === t3[1] ? "ogg" : t3[1]));
    }
    if (!l3 || "youtube" === l3) {
      const t3 = i2.match(/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i);
      if (t3) {
        const e2 = Object.assign(Object.assign({}, a2().youtube), o2.youtube || {}), s3 = `www.youtube${e2.nocookie ? "-nocookie" : ""}.com`, r3 = n$2(i2, e2), c3 = encodeURIComponent(t3[2]);
        o2.videoId = c3, o2.src = `https://${s3}/embed/${c3}?${r3}`, o2.thumb = o2.thumb || `https://i.ytimg.com/vi/${c3}/mqdefault.jpg`, l3 = "youtube";
      }
    }
    if (!l3 || "vimeo" === l3) {
      const t3 = i2.match(/^.+vimeo.com\/(?:\/)?(video\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/);
      if (t3) {
        const e2 = Object.assign(Object.assign({}, a2().vimeo), o2.vimeo || {}), s3 = n$2(i2, e2), r3 = encodeURIComponent(t3[2]), c3 = t3[5] || "";
        o2.videoId = r3, o2.src = `https://player.vimeo.com/video/${r3}?${c3 ? `h=${c3}${s3 ? "&" : ""}` : ""}${s3}`, l3 = "vimeo";
      }
    }
    o2.type = l3;
  }
  function u2(t2, n2) {
    "html5video" === n2.type && (function(t3) {
      if (!l2 || !t3.el || !t3.src) return;
      const { el: n3, src: i2 } = t3;
      if (!n3 || !i2) return;
      const s3 = t3.html5videoTpl || a2().html5videoTpl, r3 = t3.html5videoFormat || a2().html5videoFormat;
      if (!s3) return;
      const c3 = t3.poster || (t3.thumb && t$7(t3.thumb) ? t3.thumb : ""), d3 = e$8(s3.replace(/\{\{src\}\}/gi, i2 + "").replace(/\{\{format\}\}/gi, r3 || "").replace(/\{\{poster\}\}/gi, c3 + ""));
      if (!d3) return;
      const u3 = document.createElement("div");
      u3.classList.add("f-html"), u3.append(d3), t3.contentEl = d3, t3.htmlEl = u3, n3.classList.add(`has-${t3.type}`), n3.prepend(u3), h2(t3), l2.emit("contentReady", t3);
    })(n2), "youtube" !== n2.type && "vimeo" !== n2.type || (function(t3) {
      if (!l2 || !t3.el || !t3.src) return;
      const e2 = document.createElement("iframe");
      e2.classList.add("f-iframe"), e2.setAttribute("id", `f-iframe_${t3.videoId}`);
      for (const [t4, o3] of Object.entries(a2().iframeAttr || {})) e2.setAttribute(t4, o3);
      e2.onload = () => {
        var o3;
        l2 && 1 === l2.getState() && "youtube" === t3.type && (null === (o3 = e2.contentWindow) || void 0 === o3 || o3.postMessage(JSON.stringify({ event: "listening", id: e2.getAttribute("id") }), "*"));
      }, e2.onerror = () => {
        l2 && 1 === l2.getState() && (null == l2 || l2.showError(t3, "{{IFRAME_ERROR}}"));
      }, e2.src = t3.src;
      const o2 = document.createElement("div");
      o2.classList.add("f-html"), o2.append(e2), t3.contentEl = e2, t3.htmlEl = o2, t3.el.classList.add("has-html"), t3.el.classList.add("has-iframe"), t3.el.classList.add(`has-${t3.type}`), t3.el.prepend(o2), h2(t3), l2.emit("contentReady", t3);
    })(n2);
  }
  function m2(t2, e2) {
    var o2, n2;
    "html5video" !== e2.type && "youtube" !== e2.type && "vimeo" !== e2.type || (null === (o2 = e2.contentEl) || void 0 === o2 || o2.remove(), e2.contentEl = void 0, null === (n2 = e2.htmlEl) || void 0 === n2 || n2.remove(), e2.htmlEl = void 0), e2.poller && clearTimeout(e2.poller);
  }
  function f2() {
    s2 = false;
  }
  function p2() {
    if (s2) return;
    s2 = true;
    const t2 = r2();
    (t2 && void 0 !== t2.autoplay ? t2.autoplay : a2().autoplay) && ((function() {
      var t3;
      const e2 = r2(), o2 = null == e2 ? void 0 : e2.el;
      if (o2 && "html5video" === (null == e2 ? void 0 : e2.type)) try {
        const t4 = o2.querySelector("video");
        if (t4) {
          const e3 = t4.play();
          void 0 !== e3 && e3.then((() => {
          })).catch(((e4) => {
            t4.muted = true, t4.play();
          }));
        }
      } catch (t4) {
      }
      const n2 = null == e2 ? void 0 : e2.htmlEl;
      n2 instanceof HTMLIFrameElement && (null === (t3 = n2.contentWindow) || void 0 === t3 || t3.postMessage('{"event":"command","func":"stopVideo","args":""}', "*"));
    })(), (function() {
      const t3 = r2(), e2 = null == t3 ? void 0 : t3.type;
      if (!(null == t3 ? void 0 : t3.el) || "youtube" !== e2 && "vimeo" !== e2) return;
      const o2 = () => {
        if (t3.contentEl && t3.contentEl instanceof HTMLIFrameElement && t3.contentEl.contentWindow) {
          let e3;
          if ("true" === t3.contentEl.dataset.ready) return e3 = "youtube" === t3.type ? { event: "command", func: "playVideo" } : { method: "play", value: "true" }, e3 && t3.contentEl.contentWindow.postMessage(JSON.stringify(e3), "*"), void (t3.poller = void 0);
          "youtube" === t3.type && (e3 = { event: "listening", id: t3.contentEl.getAttribute("id") }, t3.contentEl.contentWindow.postMessage(JSON.stringify(e3), "*"));
        }
        t3.poller = setTimeout(o2, 250);
      };
      o2();
    })());
  }
  function h2(t2) {
    const e2 = null == t2 ? void 0 : t2.htmlEl;
    if (t2 && e2 && ("html5video" === t2.type || "youtube" === t2.type || "vimeo" === t2.type)) {
      if (e2.style.aspectRatio = "", e2.style.width = "", e2.style.height = "", e2.style.maxWidth = "", e2.style.maxHeight = "", t2.width) {
        let o2 = `${t2.width}`;
        o2.match(/^\d+$/) && (o2 += "px"), e2.style.maxWidth = `${o2}`;
      }
      if (t2.height) {
        let o2 = `${t2.height}`;
        o2.match(/^\d+$/) && (o2 += "px"), e2.style.maxHeight = `${o2}`;
      }
      if (t2.aspectRatio) {
        const o2 = t2.aspectRatio.split("/"), n2 = parseFloat(o2[0].trim()), i2 = o2[1] ? parseFloat(o2[1].trim()) : 0, l3 = n2 && i2 ? n2 / i2 : n2;
        e2.offsetHeight;
        const s3 = e2.getBoundingClientRect(), a3 = l3 < (s3.width || 1) / (s3.height || 1);
        e2.style.aspectRatio = `${t2.aspectRatio}`, e2.style.width = a3 ? "auto" : "", e2.style.height = a3 ? "" : "auto";
      }
    }
  }
  function v2() {
    h2(r2());
  }
  return { init: function(t2) {
    l2 = t2, l2.on("addSlide", d2), l2.on("attachSlideEl", u2), l2.on("detachSlideEl", m2), l2.on("ready", p2), l2.on("change", f2), l2.on("settle", p2), l2.on("refresh", v2), window.addEventListener("message", c2);
  }, destroy: function() {
    null == l2 || l2.off("addSlide", d2), null == l2 || l2.off("attachSlideEl", u2), null == l2 || l2.off("detachSlideEl", m2), null == l2 || l2.off("ready", p2), null == l2 || l2.off("change", f2), null == l2 || l2.off("settle", p2), null == l2 || l2.off("refresh", v2), window.removeEventListener("message", c2), l2 = void 0;
  } };
};
const n$1 = { autoStart: false, btnTpl: '<button data-fullscreen-action="toggle" class="f-button" title="{{TOGGLE_FULLSCREEN}}"><svg><g><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>' }, t = "in-fullscreen-mode", l$1 = () => {
  let l2;
  function u2(t2) {
    const u3 = null == l2 ? void 0 : l2.getOptions().Fullscreen;
    let o3 = (t$5(u3) ? Object.assign(Object.assign({}, n$1), u3) : n$1)[t2];
    return o3 && "function" == typeof o3 && l2 ? o3(l2) : o3;
  }
  function o2() {
    var e2;
    null === (e2 = null == l2 ? void 0 : l2.getPlugins().Toolbar) || void 0 === e2 || e2.add("fullscreen", { tpl: u2("btnTpl") });
  }
  function c2() {
    if (u2("autoStart")) {
      const e2 = s2();
      e2 && a2(e2);
    }
  }
  function i2(e2, n2) {
    const t2 = n2.target;
    t2 && !n2.defaultPrevented && "toggle" === t2.dataset.fullscreenAction && d2();
  }
  function s2() {
    return u2("el") || (null == l2 ? void 0 : l2.getContainer()) || void 0;
  }
  function r2() {
    const e2 = document;
    return e2.fullscreenEnabled ? !!e2.fullscreenElement : !!e2.webkitFullscreenEnabled && !!e2.webkitFullscreenElement;
  }
  function a2(e2) {
    const n2 = document;
    let l3;
    return e2 || (e2 = n2.documentElement), n2.fullscreenEnabled ? l3 = e2.requestFullscreen() : n2.webkitFullscreenEnabled && (l3 = e2.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)), l3 && l3.then((() => {
      e2.classList.add(t);
    })), l3;
  }
  function f2() {
    const e2 = document;
    let n2;
    return e2.fullscreenEnabled ? n2 = e2.fullscreenElement && e2.exitFullscreen() : e2.webkitFullscreenEnabled && (n2 = e2.webkitFullscreenElement && e2.webkitExitFullscreen()), n2 && n2.then((() => {
      var e3;
      null === (e3 = s2()) || void 0 === e3 || e3.classList.remove(t);
    })), n2;
  }
  function d2() {
    if (r2()) f2();
    else {
      const e2 = s2();
      e2 && a2(e2);
    }
  }
  return { init: function(e2) {
    l2 = e2, l2.on("initPlugins", o2), l2.on("ready", c2), l2.on("click", i2);
  }, destroy: function() {
    null == l2 || l2.off("initPlugins", o2), null == l2 || l2.off("ready", c2), null == l2 || l2.off("click", i2);
  }, exit: f2, inFullscreen: r2, request: a2, toggle: d2 };
};
let e, n, o$1 = false, r = false, i = false, l = false;
const s = () => {
  const t2 = new URL(document.URL).hash, e2 = t2.slice(1).split("-"), n2 = e2[e2.length - 1], o2 = n2 && /^\+?\d+$/.test(n2) && parseInt(e2.pop() || "1", 10) || 1;
  return { urlHash: t2, urlSlug: e2.join("-"), urlIndex: o2 };
}, a = () => {
  const t2 = null == e ? void 0 : e.getInstance();
  return !(!t2 || 1 != t2.getState());
}, u = () => {
  if (!e) return;
  if (a()) return;
  const { urlSlug: t2, urlIndex: n2 } = s();
  if (!t2) return;
  let o2 = document.querySelector(`[data-slug="${t2}"]`);
  o2 && e.fromTriggerEl(o2), a() || (o2 = document.querySelectorAll(`[data-fancybox="${t2}"]`)[n2 - 1], o2 && e.fromTriggerEl(o2, { startIndex: n2 - 1 })), a() && o2 && !o2.closest("[inert]") && o2.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
}, c = () => {
  if (!e) return;
  if (i) return;
  const t2 = null == e ? void 0 : e.getInstance(), n2 = null == t2 ? void 0 : t2.getCarousel();
  if (false === (null == t2 ? void 0 : t2.getOptions().Hash)) return;
  const { urlSlug: o2, urlIndex: a2 } = s();
  if (t2 && n2) {
    const e2 = n2.getSlides();
    for (const t3 of e2 || []) if (o2 === t3.slug || o2 === t3.fancybox && t3.index === a2 - 1) return r = false, void n2.goTo(t3.index);
    l = true, t2.close(), l = false;
  }
  u();
}, d = () => {
  e && (n = setTimeout((() => {
    o$1 = true, u(), o$1 = false;
  }), 300), window.addEventListener("hashchange", c, false));
}, f = () => {
  let t2, e2 = "auto", a2 = "";
  function u2() {
    var n2, i2, l2;
    if (!t2 || !t2.isTopMost()) return;
    if (false === t2.getOptions().Hash) return;
    if (o$1) {
      const e3 = t2.getOptions().sync;
      e3 && e3.goTo((null === (n2 = null == t2 ? void 0 : t2.getCarousel()) || void 0 === n2 ? void 0 : n2.getPageIndex()) || 0, { transition: false, tween: false });
    }
    const u3 = t2.getCarousel();
    if (!u3) return;
    const { urlHash: d3, urlSlug: f2 } = s(), g = t2.getSlide();
    if (!g) return;
    let h2 = g.slug || g.fancybox || "", w2 = parseInt(g.index + "", 10) + 1;
    if (!h2) return;
    let p2 = g.slug ? `#${g.slug}` : `#${h2}-${w2}`;
    ((null === (l2 = null === (i2 = t2.getCarousel()) || void 0 === i2 ? void 0 : i2.getPages()) || void 0 === l2 ? void 0 : l2.length) || 0) < 2 && (p2 = `#${h2}`), d3 !== p2 && (a2 = d3), history.scrollRestoration && (e2 = history.scrollRestoration, history.scrollRestoration = "manual"), u3.on("change", c2);
    const y2 = h2 !== f2;
    try {
      window.history[y2 ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + p2), y2 && (r = true);
    } catch (t3) {
    }
  }
  function c2() {
    if (!t2 || !t2.isTopMost()) return;
    if (false === t2.getOptions().Hash) return;
    const e3 = t2.getSlide();
    if (!e3) return;
    let n2 = e3.slug || e3.fancybox || "", o2 = e3.index + 1, r2 = e3.slug ? `#${e3.slug}` : `#${n2}-${o2}`;
    i = true;
    try {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search + r2);
    } catch (t3) {
    }
    i = false;
  }
  function d2() {
    if (l) return;
    if (!t2 || !t2.isTopMost()) return;
    if (false === t2.getOptions().Hash) return;
    const e3 = t2.getSlide();
    if (!e3) return;
    if (e3.fancybox || "") {
      i = true;
      try {
        r && !(function() {
          if (window.parent === window) return false;
          try {
            var t3 = window.frameElement;
          } catch (e4) {
            t3 = null;
          }
          return null === t3 ? "data:" === location.protocol : t3.hasAttribute("sandbox");
        })() ? window.history.back() : window.history.replaceState({}, document.title, window.location.pathname + window.location.search + a2);
      } catch (t3) {
      }
      i = false;
    }
  }
  return { init: function(e3) {
    clearTimeout(n), t2 = e3, t2.on("ready", u2), t2.on("close", d2);
  }, destroy: function() {
    null == t2 || t2.off("ready", u2), null == t2 || t2.off("close", d2);
    const n2 = null == t2 ? void 0 : t2.getCarousel();
    n2 && n2.off("change", c2), t2 = void 0, history.scrollRestoration && e2 && (history.scrollRestoration = e2);
  } };
};
f.startFromUrl = u, f.setup = function(n2) {
  e || (e = n2, e$2() && (/complete|interactive|loaded/.test(document.readyState) ? d() : document.addEventListener("DOMContentLoaded", d)));
};
const o = Object.assign(Object.assign({}, o$5), { CLOSE: "Close", NEXT: "Next", PREV: "Previous", MODAL: "You can close this modal content with the ESC key", ELEMENT_NOT_FOUND: "HTML Element Not Found", IFRAME_ERROR: "Error Loading Page" });
const A = '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg tabindex="-1" width="24" height="24" viewBox="0 0 24 24"><path d="M19.286 4.714 4.714 19.286M4.714 4.714l14.572 14.572" /></svg></button>';
r$1().add("close", { tpl: A });
const k = (e2) => {
  e2.cancelable && e2.preventDefault();
};
const O = (e2 = null, t2 = "", n2) => {
  if (!e2 || !e2.parentElement || !t2) return void (n2 && n2());
  R(e2);
  const o2 = (i2) => {
    i2.target === e2 && e2.dataset.animationName && (e2.removeEventListener("animationend", o2), delete e2.dataset.animationName, n2 && n2(), e2.classList.remove(t2));
  };
  e2.dataset.animationName = t2, e2.addEventListener("animationend", o2), s$7(e2, t2);
}, R = (e2) => {
  e2 && e2.dispatchEvent(new CustomEvent("animationend", { bubbles: false, cancelable: true, currentTarget: e2 }));
};
var _;
!(function(e2) {
  e2[e2.Init = 0] = "Init", e2[e2.Ready = 1] = "Ready", e2[e2.Closing = 2] = "Closing", e2[e2.Destroyed = 3] = "Destroyed";
})(_ || (_ = {}));
const I = { ajax: null, backdropClick: "close", Carousel: {}, closeButton: "auto", closeExisting: false, delegateEl: void 0, dragToClose: true, fadeEffect: true, groupAll: false, groupAttr: "data-fancybox", hideClass: "f-fadeOut", hideScrollbar: true, id: void 0, idle: false, keyboard: { Escape: "close", Delete: "close", Backspace: "close", PageUp: "next", PageDown: "prev", ArrowUp: "prev", ArrowDown: "next", ArrowRight: "next", ArrowLeft: "prev" }, l10n: o, mainClass: "", mainStyle: {}, mainTpl: '<dialog class="fancybox__dialog">\n    <div class="fancybox__container" tabindex="0" aria-label="{{MODAL}}">\n      <div class="fancybox__backdrop"></div>\n      <div class="fancybox__carousel"></div>\n    </div>\n  </dialog>', modal: true, on: {}, parentEl: void 0, placeFocusBack: true, showClass: "f-zoomInUp", startIndex: 0, sync: void 0, theme: "dark", triggerEl: void 0, triggerEvent: void 0, zoomEffect: true }, z = /* @__PURE__ */ new Map();
let H = 0;
const D = "with-fancybox", B = () => {
  let r2, T, M2, B2, q2, F, V, W = _.Init, $ = Object.assign({}, I), K = -1, U = {}, X = [], G = false, Y = true, Z = 0;
  function J(e2, ...t2) {
    let n2 = $[e2];
    return n2 && "function" == typeof n2 ? n2(Oe, ...t2) : n2;
  }
  function Q(e2, t2 = []) {
    const n2 = J("l10n") || {};
    e2 = String(e2).replace(/\{\{(\w+)\}\}/g, ((e3, t3) => n2[t3] || e3));
    for (let n3 = 0; n3 < t2.length; n3++) e2 = e2.split(t2[n3][0]).join(t2[n3][1]);
    return e2 = e2.replace(/\{\{(.*?)\}\}/g, ((e3, t3) => t3));
  }
  const ee = /* @__PURE__ */ new Map();
  function te(e2, ...t2) {
    const n2 = [...ee.get(e2) || []];
    for (const [t3, o2] of Object.entries($.on || {})) (t3 === e2 || t3.split(" ").indexOf(e2) > -1) && n2.push(o2);
    for (const e3 of n2) e3 && "function" == typeof e3 && e3(Oe, ...t2);
    "*" !== e2 && te("*", e2, ...t2);
  }
  function ne() {
    s$6(T, "is-revealing");
    try {
      if (document.activeElement === r2) {
        ((null == T ? void 0 : T.querySelector("[autofocus]")) || T).focus();
      }
    } catch (e2) {
    }
  }
  function oe(e2, n2) {
    var o2;
    ve(n2), de(), null === (o2 = n2.el) || void 0 === o2 || o2.addEventListener("click", se), "inline" !== n2.type && "clone" !== n2.type || (function(e3) {
      if (!B2 || !e3 || !e3.el) return;
      let n3 = null;
      if (t$7(e3.src)) {
        const t2 = e3.src.split("#", 2).pop();
        n3 = t2 ? document.getElementById(t2) : null;
      }
      if (n3) {
        if (s$7(n3, "f-html"), "clone" === e3.type || n3.closest(".fancybox__carousel")) {
          n3 = n3.cloneNode(true);
          const t2 = n3.dataset.animationName;
          t2 && (n3.classList.remove(t2), delete n3.dataset.animationName);
          let o3 = n3.getAttribute("id");
          o3 = o3 ? `${o3}--clone` : `clone-${K}-${e3.index}`, n3.setAttribute("id", o3);
        } else if (n3.parentNode) {
          const t2 = document.createElement("div");
          t2.inert = true, n3.parentNode.insertBefore(t2, n3), e3.placeholderEl = t2;
        }
        e3.htmlEl = n3, s$7(e3.el, "has-html"), e3.el.prepend(n3), n3.classList.remove("hidden"), "none" === n3.style.display && (n3.style.display = ""), "none" === getComputedStyle(n3).getPropertyValue("display") && (n3.style.display = n3.dataset.display || "flex"), null == B2 || B2.emit("contentReady", e3);
      } else null == B2 || B2.showError(e3, "{{ELEMENT_NOT_FOUND}}");
    })(n2), "ajax" === n2.type && (function(e3) {
      const t2 = e3.el;
      if (!t2) return;
      if (e3.htmlEl || e3.xhr) return;
      null == B2 || B2.showLoading(e3), e3.state = 0;
      const n3 = new XMLHttpRequest();
      n3.onreadystatechange = function() {
        if (n3.readyState === XMLHttpRequest.DONE && W === _.Ready) if (null == B2 || B2.hideLoading(e3), e3.state = 1, 200 === n3.status) {
          let o4 = n3.responseText + "", i2 = null, s2 = null;
          if (e3.filter) {
            const t3 = document.createElement("div");
            t3.innerHTML = o4, s2 = t3.querySelector(e3.filter + "");
          }
          s2 && s2 instanceof HTMLElement ? i2 = s2 : (i2 = document.createElement("div"), i2.innerHTML = o4), i2.classList.add("f-html"), e3.htmlEl = i2, t2.classList.add("has-html"), t2.classList.add("has-ajax"), t2.prepend(i2), null == B2 || B2.emit("contentReady", e3);
        } else null == B2 || B2.showError(e3);
      };
      const o3 = J("ajax") || null;
      n3.open(o3 ? "POST" : "GET", e3.src + ""), n3.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), n3.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n3.send(o3), e3.xhr = n3;
    })(n2);
  }
  function ie(e2, t2) {
    var n2;
    ye(t2), null === (n2 = t2.el) || void 0 === n2 || n2.removeEventListener("click", se), "inline" !== t2.type && "clone" !== t2.type || (function(e3) {
      const t3 = e3.htmlEl, n3 = e3.placeholderEl;
      t3 && ("none" !== getComputedStyle(t3).getPropertyValue("display") && (t3.style.display = "none"), t3.offsetHeight);
      n3 && (t3 && n3.parentNode && n3.parentNode.insertBefore(t3, n3), n3.remove());
      e3.htmlEl = void 0, e3.placeholderEl = void 0;
    })(t2), t2.xhr && (t2.xhr.abort(), t2.xhr = void 0);
  }
  function se(e2) {
    if (!be()) return;
    if (W !== _.Ready) return k(e2), void e2.stopPropagation();
    if (e2.defaultPrevented) return;
    if (!f$1.isClickAllowed()) return;
    const t2 = e2.composedPath()[0];
    t2.closest(".fancybox__carousel") && t2.classList.contains("fancybox__slide") && fe(e2);
  }
  function le() {
    Y = false, T && B2 && T.classList.remove("is-revealing"), de();
    const e2 = J("sync");
    if (B2 && e2) {
      const t2 = e2.getPageIndex(B2.getPageIndex()) || 0;
      e2.goTo(t2, { transition: false, tween: false });
    }
  }
  function re() {
    var e2;
    !(function() {
      const e3 = null == B2 ? void 0 : B2.getViewport();
      if (!J("dragToClose") || !B2 || !e3) return;
      if (q2 = f$1(e3).init(), !q2) return;
      let t3 = false, n2 = 0, o2 = 0, s2 = {}, l2 = 1;
      function r3() {
        var e4, t4;
        null == F || F.spring({ clamp: true, mass: 1, tension: 0 === o2 ? 140 : 960, friction: 17, restDelta: 0.1, restSpeed: 0.1, maxSpeed: 1 / 0 }).from({ y: n2 }).to({ y: o2 }).start();
        const i2 = (null === (e4 = null == B2 ? void 0 : B2.getViewport()) || void 0 === e4 ? void 0 : e4.getBoundingClientRect().height) || 0, s3 = null === (t4 = Ee()) || void 0 === t4 ? void 0 : t4.panzoomRef;
        if (i2 && s3) if (0 === o2) s3.execute(v$1.Reset);
        else {
          const e5 = t$3(Math.abs(n2), 0, 0.33 * i2, l2, 0.77 * l2, false);
          s3.execute(v$1.ZoomTo, { scale: e5 });
        }
      }
      const c2 = (e4) => {
        var t4;
        const n3 = e4.srcEvent, o3 = n3.target;
        return B2 && !(e$5(n3) && (null === (t4 = n3.touches) || void 0 === t4 ? void 0 : t4.length) > 1) && o3 && !n$8(o3);
      };
      F = c$3().on("step", ((t4) => {
        if (T && e3 && W === _.Ready) {
          const o3 = e3.getBoundingClientRect().height;
          n2 = Math.min(o3, Math.max(-1 * o3, t4.y));
          const i2 = t$3(Math.abs(n2), 0, 0.5 * o3, 1, 0, true);
          T.style.setProperty("--f-drag-opacity", i2 + ""), T.style.setProperty("--f-drag-offset", n2 + "px");
        }
      })), q2.on("start", (function() {
        t3 || (null == F || F.pause(), o2 = n2);
      })).on("panstart", ((e4) => {
        var n3, o3;
        if (!t3 && c2(e4) && "y" === e4.axis) {
          k(e4.srcEvent), t3 = true, Te(), null === (n3 = null == B2 ? void 0 : B2.getViewport()) || void 0 === n3 || n3.classList.add("is-dragging");
          const i2 = null === (o3 = Ee()) || void 0 === o3 ? void 0 : o3.panzoomRef;
          if (i2) {
            l2 = i2.getTransform().scale || 1;
            const e5 = i2.getOptions();
            s2 = Object.assign({}, e5), e5.bounds = false, e5.gestures = false;
          }
        } else t3 = false;
      })).on("pan", (function(e4) {
        t3 && c2(e4) && (k(e4.srcEvent), e4.srcEvent.stopPropagation(), "y" === e4.axis && (o2 += e4.deltaY, r3()));
      })).on("end", ((e4) => {
        var i2, l3, a2;
        if (null === (i2 = null == B2 ? void 0 : B2.getViewport()) || void 0 === i2 || i2.classList.remove("is-dragging"), t3) {
          const t4 = null === (l3 = Ee()) || void 0 === l3 ? void 0 : l3.panzoomRef;
          if (t4) {
            null === (a2 = t4.getTween()) || void 0 === a2 || a2.end();
            const e5 = t4.getOptions();
            e5.bounds = s2.bounds || false, e5.gestures = s2.gestures || false;
          }
          c2(e4) && "y" === e4.axis && (Math.abs(e4.velocityY) > 5 || Math.abs(n2) > 50) && Me(e4.srcEvent, "f-throwOut" + (e4.velocityY > 0 ? "Down" : "Up"));
        }
        t3 = false, W === _.Ready && 0 !== n2 && (o2 = 0, r3());
      }));
    })(), document.body.addEventListener("click", pe), document.body.addEventListener("keydown", ge, { passive: false, capture: true }), de(), je();
    const t2 = J("sync");
    B2 && t2 && (null === (e2 = t2.getTween()) || void 0 === e2 || e2.start()), he(Ee());
  }
  function ae() {
    (null == B2 ? void 0 : B2.canGoNext()) ? je() : Ce();
  }
  function ce(e2, t2) {
    ve(t2), he(t2);
  }
  function ue() {
    var e2;
    const t2 = null == B2 ? void 0 : B2.getPlugins().Thumbs;
    s$5(T, "has-thumbs", (null == t2 ? void 0 : t2.isEnabled()) || false), s$5(T, "has-vertical-thumbs", !!t2 && ("scrollable" === t2.getType() || true === (null === (e2 = t2.getCarousel()) || void 0 === e2 ? void 0 : e2.isVertical())));
  }
  function de() {
    if (T) {
      const e2 = (null == B2 ? void 0 : B2.getPages()) || [], t2 = (null == B2 ? void 0 : B2.getPageIndex()) || 0;
      for (const e3 of T.querySelectorAll("[data-fancybox-index]")) e3.innerHTML = t2 + "";
      for (const e3 of T.querySelectorAll("[data-fancybox-page]")) e3.innerHTML = t2 + 1 + "";
      for (const t3 of T.querySelectorAll("[data-fancybox-pages]")) t3.innerHTML = e2.length + "";
    }
  }
  function fe(e2) {
    if (!!e2.composedPath()[0].closest("[data-fancybox-close]")) return void Me(e2);
    if (te("backdropClick", e2), e2.defaultPrevented) return;
    J("backdropClick") && Me(e2);
  }
  function me() {
    Pe();
  }
  function ge(e2) {
    if (!be()) return;
    if (W !== _.Ready) return;
    const t2 = e2.key, o2 = J("keyboard");
    if (!o2) return;
    if (e2.ctrlKey || e2.altKey || e2.shiftKey) return;
    const i2 = e2.composedPath()[0];
    if (!n$9(i2)) return;
    if ("Escape" !== t2 && ((e3) => {
      const t3 = ["input", "textarea", "select", "option", "video", "iframe", "[contenteditable]", "[data-selectable]", "[data-draggable]"].join(",");
      return e3.matches(t3) || e3.closest(t3);
    })(i2)) return;
    if (te("keydown", e2), e2.defaultPrevented) return;
    const s2 = o2[t2];
    if (s2) switch (s2) {
      case "close":
        Me(e2);
        break;
      case "next":
        k(e2), null == B2 || B2.next();
        break;
      case "prev":
        k(e2), null == B2 || B2.prev();
    }
  }
  function pe(e2) {
    if (!be()) return;
    if (W !== _.Ready) return;
    if (Pe(), e2.defaultPrevented) return;
    const t2 = e2.composedPath()[0], n2 = !!t2.closest("[data-fancybox-close]"), o2 = t2.classList.contains("fancybox__backdrop");
    (n2 || o2) && fe(e2);
  }
  function ve(e2) {
    var t2;
    const { el: n2, htmlEl: i2, panzoomRef: s2, closeButtonEl: l2 } = e2, r3 = s2 ? s2.getWrapper() : i2;
    if (!n2 || !n2.parentElement || !r3) return;
    let a2 = J("closeButton");
    if ("auto" === a2 && (a2 = true !== (null === (t2 = null == B2 ? void 0 : B2.getPlugins().Toolbar) || void 0 === t2 ? void 0 : t2.isEnabled())), a2) {
      if (!l2) {
        const t3 = e$8(Q(A));
        t3 && (s$7(t3, "is-close-button"), e2.closeButtonEl = r3.insertAdjacentElement("afterbegin", t3), s$7(n2, "has-close-btn"));
      }
    } else ye(e2);
  }
  function ye(e2) {
    e2.closeButtonEl && (e2.closeButtonEl.remove(), e2.closeButtonEl = void 0), s$6(e2.el, "has-close-btn");
  }
  function he(e2) {
    if (!(Y && B2 && 1 === B2.getState() && e2 && e2.index === B2.getOptions().initialPage && e2.el && e2.el.parentElement)) return;
    if (void 0 !== e2.state && 1 !== e2.state) return;
    Y = false;
    const t2 = e2.panzoomRef, n2 = null == t2 ? void 0 : t2.getTween(), o2 = J("zoomEffect") && n2 ? we(e2) : void 0;
    if (t2 && n2 && o2) {
      const { x: e3, y: i3, scale: s2 } = t2.getStartPosition();
      return void n2.spring({ tension: 215, friction: 25, restDelta: 1e-3, restSpeed: 1e-3, maxSpeed: 1 / 0 }).from(o2).to({ x: e3, y: i3, scale: s2 }).start();
    }
    const i2 = (null == t2 ? void 0 : t2.getContent()) || e2.htmlEl;
    i2 && O(i2, J("showClass", e2));
  }
  function be() {
    var e2;
    return (null === (e2 = N.getInstance()) || void 0 === e2 ? void 0 : e2.getId()) === K;
  }
  function Ee() {
    var e2;
    return null === (e2 = null == B2 ? void 0 : B2.getPage()) || void 0 === e2 ? void 0 : e2.slides[0];
  }
  function xe() {
    const e2 = Ee();
    return e2 ? e2.triggerEl || J("triggerEl") : void 0;
  }
  function we(e2) {
    var t2, n2;
    const o2 = e2.thumbEl;
    if (!o2 || !((e3) => {
      const t3 = e3.getBoundingClientRect(), n3 = e3.closest("[style]"), o3 = null == n3 ? void 0 : n3.parentElement;
      if (n3 && n3.style.transform && o3) {
        const e4 = o3.getBoundingClientRect();
        if (t3.left < e4.left || t3.left > e4.left + e4.width - t3.width) return false;
        if (t3.top < e4.top || t3.top > e4.top + e4.height - t3.height) return false;
      }
      const i3 = Math.max(document.documentElement.clientHeight, window.innerHeight), s3 = Math.max(document.documentElement.clientWidth, window.innerWidth);
      return !(t3.bottom < 0 || t3.top - i3 >= 0 || t3.right < 0 || t3.left - s3 >= 0);
    })(o2)) return;
    const i2 = null === (n2 = null === (t2 = e2.panzoomRef) || void 0 === t2 ? void 0 : t2.getWrapper()) || void 0 === n2 ? void 0 : n2.getBoundingClientRect(), s2 = null == i2 ? void 0 : i2.width, l2 = null == i2 ? void 0 : i2.height;
    if (!s2 || !l2) return;
    const r3 = o2.getBoundingClientRect();
    let a2 = r3.width, c2 = r3.height, u2 = r3.left, d2 = r3.top;
    if (!r3 || !a2 || !c2) return;
    if (o2 instanceof HTMLImageElement) {
      const e3 = window.getComputedStyle(o2).getPropertyValue("object-fit");
      if ("contain" === e3 || "scale-down" === e3) {
        const { width: t3, height: n3 } = ((e4, t4, n4, o3, i3 = "contain") => {
          if ("contain" === i3 || e4 > n4 || t4 > o3) {
            const i4 = n4 / e4, s3 = o3 / t4, l3 = Math.min(i4, s3);
            e4 *= l3, t4 *= l3;
          }
          return { width: e4, height: t4 };
        })(o2.naturalWidth, o2.naturalHeight, a2, c2, e3);
        u2 += 0.5 * (a2 - t3), d2 += 0.5 * (c2 - n3), a2 = t3, c2 = n3;
      }
    }
    if (Math.abs(s2 / l2 - a2 / c2) > 0.1) return;
    return { x: u2 + 0.5 * a2 - (i2.left + 0.5 * s2), y: d2 + 0.5 * c2 - (i2.top + 0.5 * l2), scale: a2 / s2 };
  }
  function Le() {
    V && clearTimeout(V), V = void 0, document.removeEventListener("mousemove", me);
  }
  function je() {
    if (G) return;
    if (V) return;
    const e2 = J("idle");
    e2 && (V = setTimeout(Se, e2));
  }
  function Se() {
    T && (Le(), s$7(T, "is-idle"), document.addEventListener("mousemove", me), G = true);
  }
  function Pe() {
    G && (Ce(), je());
  }
  function Ce() {
    Le(), null == T || T.classList.remove("is-idle"), G = false;
  }
  function Te() {
    const e2 = xe();
    var t2;
    !e2 || (t2 = e2.getBoundingClientRect()).bottom > 0 && t2.right > 0 && t2.left < (window.innerWidth || document.documentElement.clientWidth) && t2.top < (window.innerHeight || document.documentElement.clientHeight) || e2.closest("[inert]") || e2.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
  }
  function Me(e2, t2) {
    var n2, o2, i2, s2, r3;
    if (W === _.Closing || W === _.Destroyed) return;
    const a2 = new Event("shouldClose", { bubbles: true, cancelable: true });
    if (te("shouldClose", a2, e2), a2.defaultPrevented) return;
    if (Le(), e2) {
      if (e2.defaultPrevented) return;
      k(e2), e2.stopPropagation(), e2.stopImmediatePropagation();
    }
    if (W = _.Closing, null == F || F.pause(), null == q2 || q2.destroy(), B2) {
      null === (n2 = B2.getGestures()) || void 0 === n2 || n2.destroy(), null === (o2 = B2.getTween()) || void 0 === o2 || o2.pause();
      for (const e3 of B2.getSlides()) {
        const t3 = e3.panzoomRef;
        t3 && (r$3(t3.getOptions(), { clickAction: false, dblClickAction: false, wheelAction: false, bounds: false, minScale: 0, maxScale: 1 / 0 }), null === (i2 = t3.getGestures()) || void 0 === i2 || i2.destroy(), null === (s2 = t3.getTween()) || void 0 === s2 || s2.pause());
      }
    }
    const c2 = null == B2 ? void 0 : B2.getPlugins();
    null === (r3 = null == c2 ? void 0 : c2.Autoplay) || void 0 === r3 || r3.stop();
    const u2 = null == c2 ? void 0 : c2.Fullscreen;
    u2 && u2.inFullscreen() ? Promise.resolve(u2.exit()).then((() => {
      setTimeout((() => {
        Ae(e2, t2);
      }), 150);
    })) : Ae(e2, t2);
  }
  function Ae(e2, t2) {
    var n2, o2;
    if (W !== _.Closing) return;
    te("close", e2), Y = false, document.body.removeEventListener("click", pe), document.body.removeEventListener("keydown", ge, { passive: false, capture: true }), J("placeFocusBack") && Te();
    const i2 = document.activeElement;
    i2 && (null == r2 ? void 0 : r2.contains(i2)) && i2.blur(), J("fadeEffect") && (null == T || T.classList.remove("is-ready"), null == T || T.classList.add("is-hiding")), null == T || T.classList.add("is-closing");
    const s2 = Ee(), l2 = null == s2 ? void 0 : s2.el, a2 = null == s2 ? void 0 : s2.panzoomRef, c2 = null === (n2 = null == s2 ? void 0 : s2.panzoomRef) || void 0 === n2 ? void 0 : n2.getTween(), u2 = t2 || J("hideClass");
    let d2 = false, m2 = false;
    if (B2 && s2 && l2 && a2 && c2) {
      let e3;
      if (J("zoomEffect") && 1 === s2.state && (e3 = we(s2)), e3) {
        d2 = true;
        const t3 = () => {
          e3 = we(s2), e3 ? c2.to(Object.assign(Object.assign({}, y$1), e3)) : ke();
        };
        a2.on("refresh", (() => {
          t3();
        })), c2.easing(c$3.Easings.EaseOut).duration(350).from(Object.assign({}, a2.getTransform())).to(Object.assign(Object.assign({}, y$1), e3)).start(), (null == l2 ? void 0 : l2.getAnimations()) && (l2.style.animationPlayState = "paused", requestAnimationFrame((() => {
          t3();
        })));
      }
    }
    const g = (null == s2 ? void 0 : s2.htmlEl) || (null === (o2 = null == s2 ? void 0 : s2.panzoomRef) || void 0 === o2 ? void 0 : o2.getWrapper());
    g && R(g), !d2 && u2 && g && (m2 = true, O(g, u2, (() => {
      ke();
    }))), d2 || m2 ? setTimeout((() => {
      ke();
    }), 350) : ke();
  }
  function ke() {
    var e2, t2, n2, o2, i2;
    if (W === _.Destroyed) return;
    W = _.Destroyed;
    const l2 = xe();
    te("destroy"), null === (t2 = null === (e2 = J("sync")) || void 0 === e2 ? void 0 : e2.getPlugins().Autoplay) || void 0 === t2 || t2.resume(), null === (o2 = null === (n2 = J("sync")) || void 0 === n2 ? void 0 : n2.getPlugins().Autoscroll) || void 0 === o2 || o2.resume(), r2 instanceof HTMLDialogElement && r2.close(), null === (i2 = null == B2 ? void 0 : B2.getContainer()) || void 0 === i2 || i2.classList.remove("is-idle"), null == B2 || B2.destroy();
    for (const e3 of Object.values(U)) null == e3 || e3.destroy();
    if (U = {}, null == r2 || r2.remove(), r2 = void 0, T = void 0, B2 = void 0, z.delete(K), !z.size && (t$2(false), document.documentElement.classList.remove(D), J("placeFocusBack") && l2 && !l2.closest("[inert]"))) try {
      null == l2 || l2.focus({ preventScroll: true });
    } catch (e3) {
    }
  }
  const Oe = { close: Me, destroy: ke, getCarousel: function() {
    return B2;
  }, getContainer: function() {
    return T;
  }, getId: function() {
    return K;
  }, getOptions: function() {
    return $;
  }, getPlugins: function() {
    return U;
  }, getSlide: function() {
    return Ee();
  }, getState: function() {
    return W;
  }, init: function(t2 = [], n2 = {}) {
    W !== _.Init && (Oe.destroy(), W = _.Init), $ = r$3({}, I, n2), K = J("id") || "fancybox-" + ++H;
    const a2 = z.get(K);
    if (a2 && a2.destroy(), z.set(K, Oe), te("init"), (function() {
      for (const [e2, t3] of Object.entries(Object.assign(Object.assign({}, N.Plugins), $.plugins || {}))) if (e2 && !U[e2] && t3 instanceof Function) {
        const n3 = t3();
        n3.init(Oe), U[e2] = n3;
      }
      te("initPlugins");
    })(), (function(e2 = []) {
      te("initSlides", e2), X = [...e2];
    })(t2), (function() {
      const t3 = J("parentEl") || document.body;
      if (!(t3 && t3 instanceof HTMLElement)) return;
      const n3 = Q(J("mainTpl") || "");
      if (r2 = e$8(n3) || void 0, !r2) return;
      if (T = r2.querySelector(".fancybox__container"), !(T && T instanceof HTMLElement)) return;
      const l2 = J("mainClass");
      l2 && s$7(T, l2);
      const a3 = J("mainStyle");
      if (a3 && t$5(a3)) for (const [e2, t4] of Object.entries(a3)) T.style.setProperty(e2, t4);
      const u2 = J("theme"), d2 = "auto" === u2 ? window.matchMedia("(prefers-color-scheme:light)").matches : "light" === u2;
      T.setAttribute("theme", d2 ? "light" : "dark"), r2.setAttribute("id", `${K}`), r2.addEventListener("keydown", ((e2) => {
        "Escape" === e2.key && k(e2);
      })), r2.addEventListener("wheel", ((e2) => {
        const t4 = e2.target;
        let n4 = J("wheel", e2);
        t4.closest(".f-thumbs") && (n4 = "slide");
        const o2 = "slide" === n4, s2 = [-e2.deltaX || 0, -e2.deltaY || 0, -e2.detail || 0].reduce((function(e3, t5) {
          return Math.abs(t5) > Math.abs(e3) ? t5 : e3;
        })), l3 = Math.max(-1, Math.min(1, s2)), r3 = Date.now();
        Z && r3 - Z < 300 ? o2 && k(e2) : (Z = r3, te("wheel", e2, l3), e2.defaultPrevented || ("close" === n4 ? Me(e2) : "slide" === n4 && B2 && !n$8(t4) && (k(e2), B2[l3 > 0 ? "prev" : "next"]())));
      }), { capture: true, passive: false }), r2.addEventListener("cancel", ((e2) => {
        Me(e2);
      })), t3.append(r2), 1 === z.size && (J("hideScrollbar") && t$2(true), document.documentElement.classList.add(D));
      r2 instanceof HTMLDialogElement && (J("modal") ? r2.showModal() : r2.show());
      te("initLayout");
    })(), (function() {
      if (M2 = (null == r2 ? void 0 : r2.querySelector(".fancybox__carousel")) || void 0, !M2) return;
      M2.fancybox = Oe;
      const e2 = r$3({}, { Autoplay: { autoStart: false, pauseOnHover: false, progressbarParentEl: (e3) => {
        const t3 = e3.getContainer();
        return (null == t3 ? void 0 : t3.querySelector(".f-carousel__toolbar [data-autoplay-action]")) || t3;
      } }, Fullscreen: { el: T }, Toolbar: { absolute: true, items: { counter: { tpl: '<div class="f-counter"><span data-fancybox-page></span>/<span data-fancybox-pages></span></div>' } }, display: { left: ["counter"], right: ["toggleFull", "autoplay", "fullscreen", "thumbs", "close"] } }, Video: { autoplay: true }, Thumbs: { minCount: 2, Carousel: { classes: { container: "fancybox__thumbs" } } }, classes: { container: "fancybox__carousel", viewport: "fancybox__viewport", slide: "fancybox__slide" }, spinnerTpl: '<div class="f-spinner" data-fancybox-close></div>', dragFree: false, slidesPerPage: 1, plugins: { Sync: i$5, Arrows: l$4, Lazyload: i$4, Zoomable: s$4, Html: i$2, Video: l$2, Autoplay: o$2, Fullscreen: l$1, Thumbs: c$1, Toolbar: r$1 } }, J("Carousel") || {}, { slides: X, enabled: true, initialPage: J("startIndex") || 0, l10n: J("l10n") });
      B2 = E(M2, e2), te("initCarousel", B2), B2.on("*", ((e3, t3, ...n3) => {
        te(`Carousel.${t3}`, e3, ...n3);
      })), B2.on("attachSlideEl", oe), B2.on("detachSlideEl", ie), B2.on("contentReady", ce), B2.on("ready", re), B2.on("change", le), B2.on("settle", ae), B2.on("thumbs:ready", ue), B2.on("thumbs:destroy", ue), B2.init();
    })(), r2 && T) {
      if (J("closeExisting")) for (const [e2, t3] of z.entries()) e2 !== K && t3.close();
      J("fadeEffect") ? (setTimeout((() => {
        ne();
      }), 500), s$7(T, "is-revealing")) : ne(), T.classList.add("is-ready"), W = _.Ready, te("ready");
    }
  }, isCurrentSlide: function(e2) {
    const t2 = Ee();
    return !(!e2 || !t2) && t2.index === e2.index;
  }, isTopMost: function() {
    return be();
  }, off: function(e2, t2) {
    return ee.has(e2) && ee.set(e2, ee.get(e2).filter(((e3) => e3 !== t2))), Oe;
  }, on: function(e2, t2) {
    return ee.set(e2, [...ee.get(e2) || [], t2]), Oe;
  }, toggleIdle(e2) {
    (G || true === e2) && Se(), G && false !== e2 || Ce();
  } };
  return Oe;
};
function q(e2, t2 = {}) {
  var n2, o2, i2;
  if (!(e2 && e2 instanceof Element)) return;
  let s2, r2, a2, c2, u2 = {};
  for (const [t3, n3] of N.openers) if (t3.contains(e2)) for (const [o3, i3] of n3) {
    let n4;
    if (o3) {
      for (const i4 of t3.querySelectorAll(o3)) if (i4.contains(e2)) {
        n4 = i4;
        break;
      }
      if (!n4) continue;
    }
    for (const [o4, d3] of i3) {
      let i4 = null;
      try {
        i4 = e2.closest(o4);
      } catch (e3) {
      }
      i4 && (r2 = t3, a2 = n4, s2 = i4, c2 = o4, r$3(u2, d3 || {}));
    }
  }
  if (!r2 || !c2 || !s2) return;
  const d2 = r$3({}, I, t2, u2, { triggerEl: s2 });
  let f2 = [].slice.call((a2 || r2).querySelectorAll(c2));
  const m2 = s2.closest(".f-carousel"), g = null == m2 ? void 0 : m2.carousel;
  if (g && (!a2 || !m2.contains(a2))) {
    const e3 = [];
    for (const t3 of null == g ? void 0 : g.getSlides()) {
      const n3 = t3.el;
      n3 && (n3.matches(c2) ? e3.push(n3) : e3.push(...[].slice.call(n3.querySelectorAll(c2))));
    }
    e3.length && (f2 = [...e3], null === (n2 = g.getPlugins().Autoplay) || void 0 === n2 || n2.pause(), null === (o2 = g.getPlugins().Autoscroll) || void 0 === o2 || o2.pause(), d2.sync = g);
  }
  if (false === d2.groupAll) {
    const e3 = d2.groupAttr, t3 = e3 && s2 ? s2.getAttribute(`${e3}`) : "";
    f2 = e3 && t3 ? f2.filter(((n3) => n3.getAttribute(`${e3}`) === t3)) : [s2];
  }
  if (!f2.length) return;
  null === (i2 = d2.triggerEvent) || void 0 === i2 || i2.preventDefault();
  const p2 = N.getInstance();
  if (p2) {
    const e3 = p2.getOptions().triggerEl;
    if (e3 && f2.indexOf(e3) > -1) return;
  }
  return Object.assign({}, d2.Carousel || {}).rtl && (f2 = f2.reverse()), s2 && void 0 === t2.startIndex && (d2.startIndex = f2.indexOf(s2)), N.fromNodes(f2, d2);
}
const N = { Plugins: { Hash: f }, version: "6.1.6", openers: /* @__PURE__ */ new Map(), bind: function(e2, n2, o2, i2) {
  if (!e$2()) return;
  let s2 = document.body, l2 = null, a2 = "[data-fancybox]", c2 = {};
  e2 instanceof Element && (s2 = e2), t$7(e2) && t$7(n2) ? (l2 = e2, a2 = n2) : t$7(n2) && t$7(o2) ? (l2 = n2, a2 = o2) : t$7(n2) ? a2 = n2 : t$7(e2) && (a2 = e2), "object" == typeof n2 && (c2 = n2 || {}), "object" == typeof o2 && (c2 = o2 || {}), "object" == typeof i2 && (c2 = i2 || {}), (function(e3, t2, n3, o3 = {}) {
    if (!(e3 && e3 instanceof Element && n3)) return;
    const i3 = N.openers.get(e3) || /* @__PURE__ */ new Map(), s3 = i3.get(t2) || /* @__PURE__ */ new Map();
    if (s3.set(n3, o3), i3.set(t2, s3), N.openers.set(e3, i3), 1 === i3.size && e3.addEventListener("click", N.fromEvent), 1 === N.openers.size) for (const e4 of Object.values(N.Plugins)) {
      const t3 = e4.setup;
      "function" == typeof t3 && t3(N);
    }
  })(s2, l2, a2, c2);
}, close: function(e2 = true, ...t2) {
  if (e2) for (const e3 of z.values()) e3.close(...t2);
  else {
    const e3 = N.getInstance();
    e3 && e3.close(...t2);
  }
}, destroy: function() {
  let e2;
  for (; e2 = N.getInstance(); ) e2.destroy();
  for (const e3 of N.openers.keys()) e3.removeEventListener("click", N.fromEvent);
  N.openers.clear();
}, fromEvent: function(e2) {
  if (e2.defaultPrevented) return;
  if (e2.button && 0 !== e2.button) return;
  if (e2.ctrlKey || e2.metaKey || e2.shiftKey) return;
  let t2 = e2.composedPath()[0];
  const n2 = { triggerEvent: e2 };
  if (t2.closest(".fancybox__container.is-hiding")) return k(e2), void e2.stopPropagation();
  const o2 = t2.closest("[data-fancybox-delegate]") || void 0;
  if (o2) {
    const e3 = o2.dataset.fancyboxDelegate || "", i2 = document.querySelectorAll(`[data-fancybox="${e3}"]`), s2 = parseInt(o2.dataset.fancyboxIndex || "", 10) || 0;
    t2 = i2[s2] || i2[0], r$3(n2, { delegateEl: o2, startIndex: s2 });
  }
  return q(t2, n2);
}, fromNodes: function(e2, t2) {
  t2 = r$3({}, I, t2 || {});
  const n2 = [], o2 = (e3) => e3 instanceof HTMLImageElement ? e3 : e3 instanceof HTMLElement ? e3.querySelector("img:not([aria-hidden])") : void 0;
  for (const i2 of e2) {
    const s2 = i2.dataset || {}, l2 = t2.delegateEl && e2.indexOf(i2) === t2.startIndex ? t2.delegateEl : void 0, r2 = o2(l2) || o2(i2) || void 0, a2 = s2.src || i2.getAttribute("href") || i2.getAttribute("currentSrc") || i2.getAttribute("src") || void 0, c2 = s2.thumb || s2.thumbSrc || (null == r2 ? void 0 : r2.getAttribute("currentSrc")) || (null == r2 ? void 0 : r2.getAttribute("src")) || (null == r2 ? void 0 : r2.dataset.lazySrc) || void 0, u2 = { src: a2, alt: s2.alt || (null == r2 ? void 0 : r2.getAttribute("alt")) || void 0, thumbSrc: c2, thumbEl: r2, triggerEl: i2, delegateEl: l2 };
    for (const e3 in s2) {
      let t3 = s2[e3] + "";
      t3 = "false" !== t3 && ("true" === t3 || t3), u2[e3] = t3;
    }
    n2.push(u2);
  }
  return N.show(n2, t2);
}, fromSelector: function(e2, n2, o2, i2) {
  if (!e$2()) return;
  let s2 = document.body, l2 = null, a2 = "[data-fancybox]", c2 = {};
  e2 instanceof Element && (s2 = e2), t$7(e2) && t$7(n2) ? (l2 = e2, a2 = n2) : t$7(n2) && t$7(o2) ? (l2 = n2, a2 = o2) : t$7(n2) ? a2 = n2 : t$7(e2) && (a2 = e2), "object" == typeof n2 && (c2 = n2 || {}), "object" == typeof o2 && (c2 = o2 || {}), "object" == typeof i2 && (c2 = i2 || {});
  for (const [e3, t2] of N.openers) for (const [n3, o3] of t2) for (const [t3, i3] of o3) if (e3 === s2 && n3 === l2) {
    const e4 = s2.querySelector((n3 ? `${n3} ` : "") + a2);
    if (e4 && e4.matches(t3)) return N.fromTriggerEl(e4, c2);
  }
}, fromTriggerEl: q, getCarousel: function() {
  var e2;
  return (null === (e2 = N.getInstance()) || void 0 === e2 ? void 0 : e2.getCarousel()) || void 0;
}, getDefaults: function() {
  return I;
}, getInstance: function(e2) {
  if (e2) {
    const t2 = z.get(e2);
    return t2 && t2.getState() !== _.Destroyed ? t2 : void 0;
  }
  return Array.from(z.values()).reverse().find(((e3) => {
    if (e3.getState() !== _.Destroyed) return e3;
  })) || void 0;
}, getSlide: function() {
  var e2;
  return (null === (e2 = N.getInstance()) || void 0 === e2 ? void 0 : e2.getSlide()) || void 0;
}, show: function(e2 = [], t2 = {}) {
  return B().init(e2, t2);
}, unbind: function(e2, n2, o2) {
  if (!e$2()) return;
  let i2 = document.body, s2 = null, l2 = "[data-fancybox]";
  e2 instanceof Element && (i2 = e2), t$7(e2) && t$7(n2) ? (s2 = e2, l2 = n2) : t$7(n2) && t$7(o2) ? (s2 = n2, l2 = o2) : t$7(n2) ? l2 = n2 : t$7(e2) && (l2 = e2), (function(e3, t2, n3) {
    if (!(e3 && e3 instanceof Element && n3)) return;
    const o3 = N.openers.get(e3) || /* @__PURE__ */ new Map(), i3 = o3.get(t2) || /* @__PURE__ */ new Map();
    i3 && n3 && i3.delete(n3), i3.size && n3 || o3.delete(t2), o3.size || (N.openers.delete(e3), e3.removeEventListener("click", N.fromEvent));
  })(i2, s2, l2);
} };
const initFancybox = () => {
  N.bind(".fcy-popup, .fcy-video, .banner-video a", {});
  const selectors = ['[id^="gallery-"] a', '[data-rel="lightbox"]'];
  selectors.forEach((el) => {
    N.bind(el, {
      groupAll: true,
      Carousel: {
        transition: "slide",
        friction: 0.92
      }
    });
  });
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", initFancybox, { once: true }) : initFancybox();
//# sourceMappingURL=fancybox.DHIqESTL.js.map
