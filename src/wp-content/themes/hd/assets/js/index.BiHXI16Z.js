import "./vendor.C-TuldtG.js";
import "./swiper.BnK0Ez3W.js";
import { i as initSocialShare } from "./social-share.BBYW29j4.js";
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
      const run = this.easeInOutQuad(timeElapsed, startLocation, distance, duration);
      window.scrollTo(0, run);
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
document.addEventListener("DOMContentLoaded", async () => {
  stickyBar("#masthead");
  initSocialShare("[data-social-share]", {
    intents: [
      "facebook",
      "x",
      "print",
      "send-email",
      "copy-link",
      "web-share"
    ]
  });
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
});
//# sourceMappingURL=index.BiHXI16Z.js.map
