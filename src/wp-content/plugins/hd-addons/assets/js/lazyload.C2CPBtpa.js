import { g } from "./_vendor._hash_Byi15AIw.js";
(function() {
  new g({
    class_applied: "lz-applied",
    class_loading: "lz-loading",
    class_loaded: "lz-loaded",
    class_error: "lz-error",
    class_entered: "lz-entered",
    class_exited: "lz-exited",
    callback_loaded: (el) => {
      el.removeAttribute("data-src");
      el.removeAttribute("data-srcset");
    },
    unobserve_entered: true,
    elements_selector: ".lazy",
    use_native: true
  });
})();
//# sourceMappingURL=lazyload.C2CPBtpa.js.map
