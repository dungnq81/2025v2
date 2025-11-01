import { q } from "./vendor.bdtwPW46.js";
import "./swiper.CZyLknOC.js";
import { i as initSocialShare } from "./social-share.Caek9XCa.js";
(() => {
  if (window.__globalInit) return;
  window.__globalInit = true;
  const currentDomain = window.location.hostname;
  const invalidHref = /^(#|mailto:|tel:|javascript:|data:|blob:)/i;
  const selector = 'a._blank, a.blank, a[target="_blank"]';
  const linkSet = /* @__PURE__ */ new Set();
  function checkExternal(el) {
    const href = el.getAttribute("href")?.trim();
    if (!href || invalidHref.test(href)) return;
    try {
      const url = new URL(href, window.location.href);
      if (url.hostname && url.hostname !== currentDomain) {
        linkSet.add(el);
      }
    } catch {
    }
  }
  function applyTargetRel(el) {
    if (el.target !== "_blank") el.target = "_blank";
    const relParts = (el.rel || "").split(/\s+/).filter(Boolean);
    ["noopener", "noreferrer", "nofollow"].forEach((r) => {
      if (!relParts.includes(r)) relParts.push(r);
    });
    el.rel = relParts.join(" ");
  }
  function processLinks() {
    for (const el of linkSet) applyTargetRel(el);
  }
  let observerTimeout;
  function handleMutations() {
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      document.querySelectorAll('ul.submenu[role="menubar"]').forEach((menu) => {
        menu.setAttribute("role", "menu");
      });
      document.querySelectorAll('[aria-hidden="true"] a, [aria-hidden="true"] button').forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
    }, 200);
  }
  const run2 = async () => {
    document.querySelectorAll(selector).forEach((el) => linkSet.add(el));
    document.querySelectorAll("a[href]").forEach(checkExternal);
    processLinks();
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll("#footer-columns .toggle-title").forEach((link) => {
      link.addEventListener("click", function(event) {
        event.preventDefault();
        this.classList.toggle("active");
      });
    });
    document.querySelectorAll(".entry-content table").forEach(function(tbl) {
      if (tbl.parentElement && tbl.parentElement.classList.contains("table-scroll")) return;
      const wrap = document.createElement("div");
      wrap.className = "table-scroll";
      tbl.parentNode.insertBefore(wrap, tbl);
      wrap.appendChild(tbl);
    });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", run2, { once: true }) : run2();
})();
const scriptLoader = (timeout = 3e3, scriptSelector = 'script[data-type="lazy"]') => {
  const userInteractionEvents = ["mouseover", "keydown", "touchstart", "touchmove", "wheel"];
  const loadScriptsTimer = setTimeout(loadScripts, timeout);
  function triggerScriptLoader() {
    loadScripts();
    clearTimeout(loadScriptsTimer);
    userInteractionEvents.forEach((event) => {
      window.removeEventListener(event, triggerScriptLoader, true);
    });
  }
  function loadScripts() {
    document.querySelectorAll(scriptSelector).forEach((elem) => {
      const dataSrc = elem.getAttribute("data-src");
      if (dataSrc) {
        elem.setAttribute("src", dataSrc);
        elem.removeAttribute("data-src");
        elem.removeAttribute("data-type");
      }
    });
  }
  userInteractionEvents.forEach((event) => {
    window.addEventListener(event, triggerScriptLoader, { once: true, passive: true });
  });
};
class BackToTop {
  constructor(selector = ".js-back-to-top", smoothScrollEnabled = true, defaultScrollSpeed = 400) {
    this.buttonSelector = selector;
    this.smoothScrollEnabled = smoothScrollEnabled;
    this.defaultScrollSpeed = defaultScrollSpeed;
    this._scrollTicking = false;
    this.init();
  }
  init() {
    if (!document.querySelector || !window.addEventListener) return;
    this.goTopBtn = document.querySelector(this.buttonSelector);
    if (!this.goTopBtn) return;
    this.scrollThreshold = parseInt(this.goTopBtn.dataset.scrollStart, 10) || 300;
    window.addEventListener("scroll", this.trackScroll.bind(this));
    this.goTopBtn.addEventListener("click", this.scrollToTop.bind(this), false);
  }
  trackScroll() {
    if (this._scrollTicking) return;
    this._scrollTicking = true;
    requestAnimationFrame(() => {
      const show = window.scrollY > this.scrollThreshold;
      this.goTopBtn.classList.toggle("back-to-top__show", show);
      this.goTopBtn.dataset.show = show ? "true" : "false";
      this._scrollTicking = false;
    });
  }
  scrollToTop(event) {
    event.preventDefault();
    if (this.smoothScrollEnabled) {
      const duration = parseInt(this.goTopBtn.dataset.scrollSpeed, 10) || this.defaultScrollSpeed;
      this.smoothScroll(duration);
    } else {
      window.scrollTo({ top: 0 });
    }
  }
  smoothScroll(duration) {
    const start = window.scrollY;
    const distance = -start;
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const pos = this.easeInOutQuad(elapsed, start, distance, duration);
      window.scrollTo(0, pos);
      if (elapsed < duration) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    return t < 1 ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
  }
}
const initializedMenus = /* @__PURE__ */ new WeakSet();
function initMenu(containerSelector = "#main-nav", menuSelector = ".main-nav") {
  const container = document.querySelector(containerSelector);
  const menu = document.querySelector(menuSelector);
  if (!container || !menu) return;
  if (initializedMenus.has(menu)) return;
  initializedMenus.add(menu);
  let more = menu.querySelector(".more");
  if (!more) {
    more = document.createElement("li");
    more.classList.add("more");
    more.innerHTML = '<a href="#"></a><ul class="submenu dropdown"></ul>';
    menu.appendChild(more);
  }
  const dropdown = more.querySelector(".dropdown");
  function adjustMenu() {
    dropdown.innerHTML = "";
    more.style.display = "none";
    const items = [...menu.children].filter((li) => li !== more);
    items.forEach((li) => li.style.display = "block");
    container.style.overflow = "hidden";
    if (menu.scrollWidth <= container.clientWidth) {
      container.style.overflow = "visible";
      reinitializeFoundationDropdown();
      return;
    }
    const hiddenItems = [];
    for (let i = items.length - 1; i >= 0; i--) {
      if (menu.scrollWidth > container.clientWidth) {
        hiddenItems.unshift(items[i]);
        items[i].style.display = "none";
      } else {
        break;
      }
    }
    if (hiddenItems.length > 0) {
      hiddenItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.style.display = "block";
        dropdown.appendChild(clone);
      });
      more.style.display = "block";
    }
    container.style.overflow = "visible";
    reinitializeFoundationDropdown();
  }
  function reinitializeFoundationDropdown() {
    if (typeof Foundation !== "undefined" && Foundation.DropdownMenu) {
      let mainNav = $(menuSelector);
      if (mainNav.length) {
        new Foundation.DropdownMenu(mainNav);
      }
    }
  }
  function ensureStableMenu() {
    adjustMenu();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => adjustMenu());
    }
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        clearTimeout(ro._t);
        ro._t = setTimeout(adjustMenu, 100);
      });
      ro.observe(container);
    }
  }
  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => adjustMenu(), 200);
  }
  ensureStableMenu();
  window.addEventListener("resize", onResize);
}
function stickyBar({ navbar = "#masthead", header = "#header", topBar = ".top-header" } = {}) {
  const navbarEl = document.querySelector(navbar);
  if (!navbarEl) return;
  const body = document.body;
  const headerEl = document.querySelector(header);
  const topBarEl = document.querySelector(topBar);
  if (body.classList.contains("lock-scroll")) {
    navbarEl.classList.remove("scrolling", "is-sticky");
    body.classList.remove("scrolling-down", "scrolling-up", "at-bottom");
    return;
  }
  let placeholder = headerEl?.querySelector(".masthead-placeholder");
  if (!placeholder) {
    placeholder = document.createElement("div");
    placeholder.className = "masthead-placeholder";
    navbarEl.parentNode.insertBefore(placeholder, navbarEl);
  }
  const markerElement = topBarEl || headerEl;
  let markerHeight = markerElement ? markerElement.offsetHeight : 0;
  let navbarHeight = navbarEl.offsetHeight;
  let lastScrollTop = 0;
  let ticking = false;
  let resizeTimeout;
  const getScrollTop = () => document.scrollingElement?.scrollTop ?? window.scrollY ?? window.pageYOffset ?? 0;
  function updateHeights() {
    const markerEl = topBarEl || headerEl;
    markerHeight = markerEl ? markerEl.offsetHeight : 0;
    navbarHeight = navbarEl.offsetHeight;
    const topBarHeight = topBarEl ? topBarEl.offsetHeight : 0;
    body.style.setProperty("--sticky-top", `${topBarHeight}px`);
    body.style.setProperty("--navbar-height", `${navbarHeight}px`);
  }
  updateHeights();
  const top = getScrollTop();
  if (top <= markerHeight) {
    navbarEl.classList.remove("is-sticky");
    body.classList.remove("scrolling-up", "scrolling-down");
  } else {
    navbarEl.classList.add("is-sticky");
  }
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateHeights();
    }, 150);
  });
  document.addEventListener("scroll", () => {
    const scrollTop = getScrollTop();
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll(scrollTop);
        ticking = false;
      });
      ticking = true;
    }
  });
  function handleScroll(scrollTop) {
    const atBottom = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 4;
    if (scrollTop > markerHeight) {
      navbarEl.classList.add("is-sticky");
      if (scrollTop > lastScrollTop) {
        body.classList.remove("scrolling-up");
        body.classList.add("scrolling-down");
      } else if (scrollTop < lastScrollTop) {
        body.classList.remove("scrolling-down");
        body.classList.add("scrolling-up");
      }
    } else if (scrollTop <= markerHeight) {
      navbarEl.classList.remove("is-sticky");
      body.classList.remove("scrolling-up", "scrolling-down");
    }
    if (atBottom) {
      body.classList.add("at-bottom");
    } else {
      body.classList.remove("at-bottom");
    }
    lastScrollTop = scrollTop;
  }
}
class CookieService {
  static _normalizeSameSiteForCookieStore(val = "Lax") {
    const v = String(val).toLowerCase();
    return v === "lax" || v === "strict" || v === "none" ? v : "lax";
  }
  static _normalizeSameSiteForHeader(val = "Lax") {
    const v = String(val).toLowerCase();
    if (v === "lax") return "Lax";
    if (v === "strict") return "Strict";
    if (v === "none") return "None";
    return "Lax";
  }
  static async get(name) {
    if (window.cookieStore) {
      const entry = await window.cookieStore.get(name);
      return entry?.value || "";
    }
    const pattern = new RegExp(`(^|;)\\s*${encodeURIComponent(name)}\\s*=\\s*([^;]+)`);
    const match = document.cookie.match(pattern);
    return match ? decodeURIComponent(match[2]) : "";
  }
  static async set(name, value, { days = 365, path = "/", secure = true, sameSite = "Lax" } = {}) {
    if (window.cookieStore) {
      const opts = {
        name,
        value,
        path,
        secure: !!secure,
        sameSite: CookieService._normalizeSameSiteForCookieStore(sameSite)
      };
      if (days) opts.expires = new Date(Date.now() + days * 864e5);
      return window.cookieStore.set(opts);
    }
    const ss = CookieService._normalizeSameSiteForHeader(sameSite);
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)};path=${path};SameSite=${ss}`;
    if (days) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      cookieStr += `;expires=${expires}`;
    }
    if (secure) cookieStr += ";Secure";
    document.cookie = cookieStr;
  }
  static async delete(name, { path = "/" } = {}) {
    if (window.cookieStore) {
      return window.cookieStore.delete(name, { path });
    }
    document.cookie = `${encodeURIComponent(name)}=;path=${path};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
const DEFAULTS = {
  bannerSelector: null,
  acceptSelector: ".js-cookie-consent-accept",
  closeSelector: ".js-cookie-consent-close",
  consentDays: 180,
  // 180 days
  dismissDays: 7,
  // 7 days
  consentCookie: "cookie_consent",
  dismissCookie: "cookie_consent_dismissed",
  sameSite: "Lax",
  secure: true,
  path: "/",
  removeOnHide: true
};
let _inited = false;
let _mo = null;
function _getBanner(opts) {
  if (opts.bannerSelector) {
    return document.querySelector(opts.bannerSelector);
  }
  const btn = document.querySelector(`${opts.acceptSelector}, ${opts.closeSelector}`);
  return btn ? btn.closest("section") : null;
}
function _hide(el) {
  if (!el) return;
  el.style.display = "none";
}
function _show(el) {
  if (!el) return;
  el.style.display = "flex";
  el.classList.remove("hidden");
}
function _hideAndRemove(el) {
  if (!el) return;
  el.style.transition = el.style.transition || "opacity .25s ease";
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  const onEnd = () => {
    el.removeEventListener("transitionend", onEnd);
    if (el.isConnected) el.remove();
  };
  el.addEventListener("transitionend", onEnd, { once: true });
  setTimeout(() => {
    if (el && el.isConnected) el.remove();
  }, 350);
}
async function _initNow(opts) {
  const banner = _getBanner(opts);
  const btnAccept = document.querySelector(opts.acceptSelector);
  const btnClose = document.querySelector(opts.closeSelector);
  if (!banner || !btnAccept || !btnClose) return false;
  const [consent, dismissed] = await Promise.all([
    CookieService.get(opts.consentCookie),
    CookieService.get(opts.dismissCookie)
  ]);
  if (consent === "accepted" || dismissed === "1") {
    if (opts.removeOnHide) _hideAndRemove(banner);
    else _hide(banner);
  } else {
    _show(banner);
  }
  btnAccept.addEventListener("click", async () => {
    await CookieService.set(opts.consentCookie, "accepted", {
      days: opts.consentDays,
      path: opts.path,
      sameSite: opts.sameSite,
      secure: opts.secure
    });
    await CookieService.delete(opts.dismissCookie, { path: opts.path });
    if (opts.removeOnHide) _hideAndRemove(banner);
    else _hide(banner);
  }, { once: true });
  btnClose.addEventListener("click", async () => {
    await CookieService.set(opts.dismissCookie, "1", {
      days: opts.dismissDays,
      path: opts.path,
      sameSite: opts.sameSite,
      secure: opts.secure
    });
    if (opts.removeOnHide) _hideAndRemove(banner);
    else _hide(banner);
  }, { once: true });
  return true;
}
async function setupCookieConsent(userOptions = {}) {
  if (_inited) return;
  const opts = { ...DEFAULTS, ...userOptions };
  const ok = await _initNow(opts);
  if (ok) {
    _inited = true;
    if (_mo) {
      _mo.disconnect();
      _mo = null;
    }
    return;
  }
  if (_mo) return;
  _mo = new MutationObserver(async () => {
    const done = await _initNow(opts);
    if (done) {
      _inited = true;
      if (_mo) {
        _mo.disconnect();
        _mo = null;
      }
    }
  });
  _mo.observe(document.body, { childList: true, subtree: true });
}
const run = async () => {
  scriptLoader();
  initMenu();
  stickyBar();
  new BackToTop();
  initSocialShare("[data-social-share]", {
    intents: ["facebook", "x", "print", "send-email", "copy-link", "web-share"]
  });
  await setupCookieConsent({
    consentDays: 180,
    dismissDays: 7
  });
  q.bind(".fcy-popup, .fcy-video, .banner-video a", {});
  let $_array = ['[id^="gallery-"] a', '[data-rel="lightbox"]'];
  $_array.forEach((el, index) => {
    q.bind(el, {
      groupAll: true
    });
  });
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", run, { once: true }) : run();
//# sourceMappingURL=index.Dzgq_He6.js.map
