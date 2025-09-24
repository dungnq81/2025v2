import { n as nanoid, a as Swiper } from "./vendor.Cvx4Zm7f.js";
const initializeSwiper = (el, swiper_class, options) => {
  if (!(el instanceof Element) || !options) {
    console.error("Error: The provided element is not a DOM element.");
    return;
  }
  const swiper = new Swiper(swiper_class, options);
  el.addEventListener("mouseover", () => {
    swiper.autoplay.stop();
  });
  el.addEventListener("mouseout", () => {
    if (options.autoplay) {
      swiper.autoplay.start();
    }
  });
  return swiper;
};
const generateClasses = () => {
  const rand = nanoid(10);
  return {
    rand,
    swiperClass: "swiper-" + rand,
    nextClass: "next-" + rand,
    prevClass: "prev-" + rand,
    paginationClass: "pagination-" + rand,
    scrollbarClass: "scrollbar-" + rand
  };
};
const getDefaultOptions = () => ({
  grabCursor: true,
  allowTouchMove: true,
  threshold: 5,
  hashNavigation: false,
  mousewheel: false,
  wrapperClass: "swiper-wrapper",
  slideClass: "swiper-slide",
  slideActiveClass: "swiper-slide-active"
});
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const initializeSwipers = () => {
  const swiperElements = document.querySelectorAll(".w-swiper");
  swiperElements.forEach((el, index) => {
    const classes = generateClasses();
    el.classList.add(classes.swiperClass);
    let controls = el.closest(".closest-swiper")?.querySelector(".swiper-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.classList.add("swiper-controls");
      el.after(controls);
    }
    const swiperWrapper = el?.querySelector(".swiper-wrapper");
    if (!swiperWrapper.dataset.options) {
      return;
    }
    let options = JSON.parse(swiperWrapper.dataset.options);
    let swiperOptions = { ...getDefaultOptions() };
    if (options.autoview) {
      swiperOptions.slidesPerView = "auto";
      if (options.gap) {
        swiperOptions.spaceBetween = 12;
        swiperOptions.breakpoints = {
          768: { spaceBetween: 24 }
        };
      } else if (options._gap) {
        swiperOptions.spaceBetween = parseInt(options._gap);
      }
    } else {
      if (options.spaceBetween) {
        swiperOptions.spaceBetween = parseInt(options.spaceBetween);
      }
      swiperOptions.breakpoints = {
        0: options.mobile || {},
        768: options.tablet || {},
        1024: options.desktop || {}
      };
    }
    if (options.observer) {
      swiperOptions.observer = true;
      swiperOptions.observeParents = true;
    }
    if (options.effect) {
      swiperOptions.effect = String(options.effect);
      if (swiperOptions.effect === "fade") {
        swiperOptions.fadeEffect = { crossFade: true };
      }
    }
    if (options.autoheight) swiperOptions.autoHeight = true;
    if (options.loop) swiperOptions.loop = true;
    if (options.parallax) swiperOptions.parallax = true;
    if (options.direction) swiperOptions.direction = String(options.direction);
    if (options.freemode) swiperOptions.freeMode = true;
    if (options.cssmode) swiperOptions.cssMode = true;
    if (options.centered) {
      swiperOptions.centeredSlides = true;
      swiperOptions.centeredSlidesBounds = true;
    }
    swiperOptions.speed = options.speed ? parseInt(options.speed) : random(300, 900);
    if (options.autoplay) {
      swiperOptions.autoplay = {
        disableOnInteraction: false,
        delay: options.delay ? parseInt(options.delay) : random(4e3, 6e3)
      };
      if (options.reverse) swiperOptions.reverseDirection = true;
    }
    if (options.navigation) {
      let btnPrev = controls?.querySelector(".swiper-button-prev");
      let btnNext = controls?.querySelector(".swiper-button-next");
      if (btnPrev && btnNext) {
        btnPrev.classList.add(classes.prevClass);
        btnNext.classList.add(classes.nextClass);
      } else {
        btnPrev = document.createElement("div");
        btnNext = document.createElement("div");
        btnPrev.classList.add("swiper-button", "swiper-button-prev", classes.prevClass);
        btnNext.classList.add("swiper-button", "swiper-button-next", classes.nextClass);
        controls.append(btnPrev, btnNext);
        const iconLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4l4 4"></path></svg>`;
        const iconRight = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4l-4-4"></path></svg>`;
        btnPrev.innerHTML = iconLeft;
        btnNext.innerHTML = iconRight;
      }
      swiperOptions.navigation = {
        nextEl: "." + classes.nextClass,
        prevEl: "." + classes.prevClass
      };
    }
    if (options.pagination) {
      let pagination = controls?.querySelector(".swiper-pagination");
      if (pagination) {
        pagination.classList.add(classes.paginationClass);
      } else {
        pagination = document.createElement("div");
        pagination.classList.add("swiper-pagination", classes.paginationClass);
        controls.appendChild(pagination);
      }
      const paginationType = options.pagination;
      swiperOptions.pagination = {
        el: "." + classes.paginationClass,
        clickable: true,
        ...paginationType === "bullets" && { dynamicBullets: true, type: "bullets" },
        ...paginationType === "fraction" && { type: "fraction" },
        ...paginationType === "progressbar" && { type: "progressbar" },
        ...paginationType === "custom" && {
          renderBullet: (index2, className) => `<span class="${className}">${index2 + 1}</span>`
        }
      };
    }
    if (options.scrollbar) {
      let scrollbar = controls?.querySelector(".swiper-scrollbar");
      if (scrollbar) {
        scrollbar.classList.add(classes.scrollbarClass);
      } else {
        scrollbar = document.createElement("div");
        scrollbar.classList.add("swiper-scrollbar", classes.scrollbarClass);
        controls.appendChild(scrollbar);
      }
      swiperOptions.scrollbar = {
        el: "." + classes.scrollbarClass,
        hide: true,
        draggable: true
      };
    }
    if (options.marquee) {
      swiperOptions.centeredSlides = false;
      swiperOptions.autoplay = {
        delay: 1,
        disableOnInteraction: true
      };
      swiperOptions.loop = true;
      swiperOptions.speed = 6e3;
      swiperOptions.allowTouchMove = true;
    }
    if (options.rows) {
      swiperOptions.direction = "horizontal";
      swiperOptions.loop = false;
      swiperOptions.grid = {
        rows: parseInt(options.rows),
        fill: "row"
      };
    }
    initializeSwiper(el, "." + classes.swiperClass, swiperOptions);
  });
};
document.addEventListener("DOMContentLoaded", initializeSwipers);
//# sourceMappingURL=swiper.q8BuS-oM.js.map
