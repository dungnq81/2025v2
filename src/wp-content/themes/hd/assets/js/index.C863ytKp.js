import "./vendor.DyarFzp3.js";
import "./swiper.KqnkzZpb.js";
import { i as initSocialShare } from "./social-share.BnDjeBoD.js";
class BackToTop {
  constructor(selector = ".js-back-to-top", smoothScrollEnabled = true, defaultScrollSpeed = 400) {
    this.buttonSelector = selector;
    this.smoothScrollEnabled = smoothScrollEnabled;
    this.defaultScrollSpeed = defaultScrollSpeed;
    this.init();
  }
  init() {
    if (!("querySelector" in document && "addEventListener" in window)) {
      return;
    }
    this.goTopBtn = document.querySelector(this.buttonSelector);
    if (!this.goTopBtn) {
      return;
    }
    this.scrollThreshold = parseInt(this.goTopBtn.getAttribute("data-scroll-start"), 10) || 300;
    window.addEventListener("scroll", this.trackScroll.bind(this));
    this.goTopBtn.addEventListener("click", this.scrollToTop.bind(this), false);
  }
  trackScroll() {
    const scrolled = window.scrollY;
    if (scrolled > this.scrollThreshold) {
      this.goTopBtn.classList.add("back-to-top__show");
      this.goTopBtn.setAttribute("data-show", "true");
    } else {
      this.goTopBtn.classList.remove("back-to-top__show");
      this.goTopBtn.setAttribute("data-show", "false");
    }
  }
  scrollToTop(event) {
    event.preventDefault();
    if (this.smoothScrollEnabled) {
      const duration = parseInt(this.goTopBtn.getAttribute("data-scroll-speed"), 10) || this.defaultScrollSpeed;
      this.smoothScroll(duration);
    } else {
      window.scrollTo(0, 0);
    }
  }
  smoothScroll(duration) {
    const startLocation = window.scrollY;
    const distance = -startLocation;
    let startTime = null;
    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run2 = this.easeInOutQuad(timeElapsed, startLocation, distance, duration);
      window.scrollTo(0, run2);
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    requestAnimationFrame(animateScroll);
  }
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}
setTimeout(() => {
  new BackToTop();
}, 100);
(function() {
  const run2 = () => {
    document.querySelectorAll('a._blank, a.blank, a[target="_blank"]').forEach((el) => {
      if (!el.hasAttribute("target") || el.getAttribute("target") !== "_blank") {
        el.setAttribute("target", "_blank");
      }
      const relValue = el?.getAttribute("rel");
      if (!relValue || !relValue.includes("noopener") || !relValue.includes("nofollow")) {
        const newRelValue = (relValue ? relValue + " " : "") + "noopener noreferrer nofollow";
        el.setAttribute("rel", newRelValue);
      }
    });
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("error", function() {
        this.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45MSAxMDAgMTEwIDExNy45MSAxMTAgMTQwQzExMCAxNjIuMDkgMTI3LjkxIDE4MCAxNTAgMTgwQzE3Mi4wOSAxODAgMTkwIDE2Mi4wOSAxOTAgMTQwQzE5MCAxMTcuOTEgMTcyLjA5IDEwMCAxNTAgMTAwWiIgZmlsbD0iI0Q5RERFMSIvPgo8L3N2Zz4K";
        this.alt = "Not found";
      });
    });
    const observer = new MutationObserver(() => {
      document.querySelectorAll('ul.submenu[role="menubar"]').forEach((menu) => {
        menu.setAttribute("role", "menu");
      });
      document.querySelectorAll('[aria-hidden="true"] a, [aria-hidden="true"] button').forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
    });
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
  userInteractionEvents.forEach((event) => {
    window.addEventListener(event, triggerScriptLoader, { once: true, passive: true });
  });
  function triggerScriptLoader() {
    loadScripts();
    clearTimeout(loadScriptsTimer);
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
};
scriptLoader();
function stickyBar(selector = "#masthead") {
  const navbar = document.querySelector(selector);
  if (!navbar) return;
  const body = document.body;
  const distance = navbar.offsetTop;
  const navbarHeight = navbar.offsetHeight;
  let lastScrollTop = 0;
  let ticking = false;
  const getScrollTop = () => document.scrollingElement?.scrollTop ?? window.scrollY ?? window.pageYOffset ?? 0;
  const top = getScrollTop();
  if (top < 1) {
    navbar.classList.remove("sticky");
    body.classList.remove("b-sticky");
  } else {
    navbar.classList.add("sticky");
    body.classList.add("b-sticky");
  }
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
    const atBottom = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 5;
    if (scrollTop > distance) {
      navbar.classList.add("sticky");
      body.classList.add("b-sticky");
    } else if (scrollTop < 1) {
      navbar.classList.remove("sticky", "scroll");
      body.classList.remove("b-sticky", "b-scroll");
    }
    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
      navbar.classList.add("sticky");
      body.classList.add("b-sticky", "b-scroll");
    } else if (scrollTop < lastScrollTop && scrollTop > navbarHeight) {
      navbar.classList.remove("scroll");
      body.classList.remove("b-scroll");
    }
    if (body.classList.contains("lock-scroll")) {
      navbar.classList.remove("scroll", "bottom");
      body.classList.remove("b-scroll", "b-bottom");
    }
    if (atBottom) {
      navbar.classList.add("bottom");
      body.classList.add("b-bottom");
    } else {
      navbar.classList.remove("bottom");
      body.classList.remove("b-bottom");
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
  path: "/"
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
}
async function _initNow(opts) {
  const banner = _getBanner(opts);
  const btnAccept = document.querySelector(opts.acceptSelector);
  const btnClose = document.querySelector(opts.closeSelector);
  if (!banner || !btnAccept || !btnClose) return false;
  const consent = await CookieService.get(opts.consentCookie);
  const dismissed = await CookieService.get(opts.dismissCookie);
  if (consent === "accepted" || dismissed === "1") _hide(banner);
  else _show(banner);
  btnAccept.addEventListener("click", async () => {
    await CookieService.set(opts.consentCookie, "accepted", {
      days: opts.consentDays,
      path: opts.path,
      sameSite: opts.sameSite,
      secure: opts.secure
    });
    await CookieService.delete(opts.dismissCookie, { path: opts.path });
    _hide(banner);
  }, { once: true });
  btnClose.addEventListener("click", async () => {
    await CookieService.set(opts.dismissCookie, "1", {
      days: opts.dismissDays,
      path: opts.path,
      sameSite: opts.sameSite,
      secure: opts.secure
    });
    _hide(banner);
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
async function run() {
  stickyBar("#masthead");
  initSocialShare("[data-social-share]", {
    intents: ["facebook", "x", "print", "send-email", "copy-link", "web-share"]
  });
  await setupCookieConsent({
    consentDays: 180,
    dismissDays: 7
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", run, { once: true }) : run();
//# sourceMappingURL=index.C863ytKp.js.map
