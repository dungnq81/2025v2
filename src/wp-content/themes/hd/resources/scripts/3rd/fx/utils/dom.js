// utils/dom.js

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
export const on = (el, ev, handler, opts) => {
    if (!el) return;
    if (NodeList.prototype.isPrototypeOf(el) || Array.isArray(el)) {
        el.forEach(i => i.addEventListener(ev, handler, opts));
        return;
    }
    el.addEventListener(ev, handler, opts);
};
export const off = (el, ev, handler, opts) => {
    if (!el) return;
    if (NodeList.prototype.isPrototypeOf(el) || Array.isArray(el)) {
        el.forEach(i => i.removeEventListener(ev, handler, opts));
        return;
    }
    el.removeEventListener(ev, handler, opts);
};
export const closest = (el, selector) => el ? el.closest(selector) : null;
export const append = (parent, child) => parent.appendChild(child);
export const hasClass = (el, cls) => el.classList.contains(cls);
export const addClass = (el, cls) => el.classList.add(...cls.split(' ').filter(Boolean));
export const removeClass = (el, cls) => el.classList.remove(...cls.split(' ').filter(Boolean));
export const toggleClass = (el, cls) => el.classList.toggle(cls);
export const isVisible = (el) => !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
export const create = (tag, attrs = {}) => {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else e.setAttribute(k, v);
    });
    return e;
};
export const trigger = (el, name, detail = {}) => {
    if (!el) return;
    const ev = new CustomEvent(name, {detail});
    el.dispatchEvent(ev);
};
