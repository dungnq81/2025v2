import { a as Navigation, P as Pagination, A as Autoplay, G as Grid, b as Swiper, n as nanoid } from "./vendor.C6-Jm0Ee.js";
const defaultModules = [Navigation, Pagination, Autoplay, Grid];
const defaultOptions = {
  grabCursor: true,
  allowTouchMove: true,
  threshold: 5,
  wrapperClass: "swiper-wrapper",
  slideClass: "swiper-slide",
  slideActiveClass: "swiper-slide-active"
};
const generateClasses = () => {
  const id = nanoid(8);
  return {
    id,
    swiper: `swiper-${id}`,
    next: `swiper-next-${id}`,
    prev: `swiper-prev-${id}`,
    pagination: `swiper-pagination-${id}`,
    scrollbar: `swiper-scrollbar-${id}`
  };
};
const parseOptions = (el) => {
  const json = el?.querySelector(".swiper-wrapper")?.dataset?.swiperOptions;
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch (e) {
    console.warn("Invalid Swiper JSON on element", el, e);
    return {};
  }
};
const getSwiperControls = (el) => {
  const wrapper = el.closest(".closest-swiper") || el.parentElement;
  const existing = wrapper?.querySelector(".swiper-controls");
  if (existing) return existing;
  const div = document.createElement("div");
  div.className = "swiper-controls";
  el.after(div);
  return div;
};
const getBreakpoints = (options = {}) => {
  if (options.breakpoints) return options.breakpoints;
  const bp = {};
  const map = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 };
  Object.entries(map).forEach(([key, val]) => {
    if (options[key]) bp[val] = options[key];
  });
  return bp;
};
const initSwiper = (el) => {
  if (!el) return;
  if (el.__swiper_inited) return;
  el.__swiper_inited = true;
  const classes = generateClasses();
  el.classList.add(classes.swiper);
  const swiperOptions = {
    modules: defaultModules,
    ...defaultOptions
  };
  const options = parseOptions(el);
  if (!options || Object.keys(options).length === 0) {
    console.warn("Skipped swiper:", el, "(no valid options)");
    return;
  }
  Object.assign(swiperOptions, {
    spaceBetween: parseInt(options.spaceBetween) || 0,
    slidesPerView: options.slidesPerView === "auto" ? "auto" : parseInt(options.slidesPerView) || 1,
    loop: !!options.loop,
    speed: parseInt(options.speed) || 600,
    direction: options.direction || "horizontal",
    observer: !!options.observer,
    observeParents: !!options.observer,
    breakpoints: getBreakpoints(options)
  });
  if (options.autoHeight) swiperOptions.autoHeight = true;
  if (options.freeMode) swiperOptions.freeMode = true;
  if (options.cssMode) swiperOptions.cssMode = true;
  if (options.effect) swiperOptions.effect = options.effect;
  if (options.centered) {
    swiperOptions.centeredSlides = true;
    swiperOptions.centeredSlidesBounds = true;
  }
  if (options.autoplay) {
    swiperOptions.autoplay = {
      delay: parseInt(options.delay) || 4e3,
      disableOnInteraction: false,
      reverseDirection: !!options.reverse
    };
  }
  if (options.marquee) {
    swiperOptions.loop = true;
    swiperOptions.speed = options.speed || 6e3;
    swiperOptions.autoplay = { delay: 1, disableOnInteraction: true };
  }
  if (options.rows) {
    swiperOptions.grid = {
      rows: parseInt(options.rows),
      fill: "row"
    };
  }
  const controls = getSwiperControls(el);
  if (options.navigation) {
    let btnPrev = controls?.querySelector(".swiper-button-prev");
    let btnNext = controls?.querySelector(".swiper-button-next");
    if (btnPrev && btnNext) {
      btnPrev.classList.add(classes.prev);
      btnNext.classList.add(classes.next);
    } else {
      const btnPrev2 = document.createElement("div");
      const btnNext2 = document.createElement("div");
      btnPrev2.className = `swiper-button swiper-button-prev ${classes.prev}`;
      btnNext2.className = `swiper-button swiper-button-next ${classes.next}`;
      btnPrev2.innerHTML = `<svg><use href="#icon-arrow-left-outline"></use></svg>`;
      btnNext2.innerHTML = `<svg><use href="#icon-arrow-right-outline"></use></svg>`;
      controls.append(btnPrev2, btnNext2);
    }
    swiperOptions.navigation = {
      nextEl: "." + classes.next,
      prevEl: "." + classes.prev
    };
  }
  if (options.pagination) {
    let pagination = controls?.querySelector(".swiper-pagination");
    if (pagination) {
      pagination.classList.add(classes.pagination);
    } else {
      const pagination2 = document.createElement("div");
      pagination2.className = `swiper-pagination ${classes.pagination}`;
      controls.append(pagination2);
    }
    const paginationType = options.pagination;
    swiperOptions.pagination = {
      el: "." + classes.pagination,
      clickable: true,
      ...paginationType === "bullets" && { dynamicBullets: true, type: "bullets" },
      ...paginationType === "fraction" && { type: "fraction" },
      ...paginationType === "progressbar" && { type: "progressbar" },
      ...paginationType === "custom" && { renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>` }
    };
  }
  if (options.scrollbar) {
    let scrollbar = controls?.querySelector(".swiper-scrollbar");
    if (scrollbar) {
      scrollbar.classList.add(classes.scrollbar);
    } else {
      const scrollbar2 = document.createElement("div");
      scrollbar2.className = `swiper-scrollbar ${classes.scrollbar}`;
      controls.append(scrollbar2);
    }
    swiperOptions.scrollbar = {
      el: "." + classes.scrollbar,
      hide: true,
      draggable: true
    };
  }
  const swiper = new Swiper(`.${classes.swiper}`, swiperOptions);
  if (swiper.params.autoplay) {
    el.addEventListener("mouseenter", () => swiper.autoplay?.stop());
    el.addEventListener("mouseleave", () => swiper.autoplay?.start());
  }
  return swiper;
};
const initAllSwipers = () => {
  document.querySelectorAll(".w-swiper").forEach(initSwiper);
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", initAllSwipers, { once: true }) : initAllSwipers();
//# sourceMappingURL=swiper.D3gQGSz1.js.map
