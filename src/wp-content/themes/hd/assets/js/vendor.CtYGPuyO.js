const $locale = (l10n2) => new Proxy(l10n2, {
  /**
   * Trap for getter
   *
   * Returns translation string if set or translation marker.
   *
   * @param {object} self
   * @param {string} marker
   * @returns {string}
   */
  get(self, marker) {
    return self.lang && self[self.lang][marker] || marker;
  }
});
const l10n = $locale({});
const REJECTED_TAGS = "html|head|body|meta|link|style|script";
const DENIED_PROPS = "attributes|classList|innerHTML|outerHTML|nodeName|nodeType";
class part {
  /**
   * Element render
   */
  render() {
    delete this.element;
    delete this.render;
  }
  /**
   * Binds the compo to an element
   *
   * @see Node.appendChild
   *
   * @param {Element} node A valid Element node
   * @param {function} [cb] Callback function
   * @returns {boolean}
   */
  bind(node, cb) {
    const el = this[this.ns];
    typeof cb == "function" && cb.call(this, el);
    return !!node.appendChild(el);
  }
  /**
   * Unbinds the compo from an element
   *
   * @see Node.removeChild
   *
   * @param {Element} node A valid Element node
   * @param {function} [cb] Callback function
   * @returns {boolean}
   */
  unbind(node, cb) {
    const el = this[this.ns];
    typeof cb == "function" && cb.call(this, el);
    return !!node.removeChild(el);
  }
  /**
   * Replaces a placeholder element with compo and binds the compo
   *
   * @see ChildNode.replaceWith
   *
   * @param {Element} node A valid Element node used as placeholder
   * @param {function} [cb] Callback function
   * @returns {boolean}
   */
  place(node, cb) {
    const el = this[this.ns];
    typeof cb == "function" && cb.call(this, el);
    return !!node.replaceWith(el);
  }
  /**
   * Appends a compo to this compo
   *
   * @see Node.appendChild
   *
   * @param {part} compo A compo
   * @returns {boolean}
   */
  append(compo) {
    const ns = this.ns, el = this[ns];
    return !!el.appendChild(compo[ns]);
  }
  /**
   * Prepends a compo to this compo
   *
   * @see Node.insertBefore
   *
   * @param {part} compo A compo
   * @returns {boolean}
   */
  prepend(compo) {
    const ns = this.ns, el = this[ns];
    return !!el.insertBefore(compo[ns], el.firstElementChild || null);
  }
  /**
   * Removes a compo from this composition
   *
   * @see Node.removeChild
   *
   * @param {part} compo A compo
   * @returns {boolean}
   */
  remove(compo) {
    const ns = this.ns, el = this[ns];
    return !!el.removeChild(compo[ns]);
  }
  /**
   * Fills the compo inner with an element node
   *
   * Note: Any inner element contained will be removed.
   *
   * @see Node.appendChild
   *
   * @constant {RegExp} REJECTED_TAGS Regular expression for rejected tag
   * @param {Element} node A valid Element node
   * @returns {boolean}
   */
  fill(node) {
    if (!node instanceof Element || RegExp(REJECTED_TAGS, "i").test(node.tagName) || RegExp(`(<(${REJECTED_TAGS})*>)`, "i").test(node.innerHTML)) {
      throw new Error(l10n.EMTAG);
    }
    this.empty();
    return !!this[this.ns].appendChild(node);
  }
  /**
   * Emptys this compo
   *
   * Note: Any inner element will be removed.
   */
  empty() {
    while (this.first) {
      this.remove(this.first);
    }
  }
  /**
   * Getter for children property, the children compo of this compo
   *
   * @type {array}
   */
  get children() {
    return Array.prototype.map.call(this[this.ns].children, (node) => {
      return node._1;
    });
  }
  /**
   * Getter for first property, the first compo in this compo
   *
   * @type {part}
   */
  get first() {
    const el = this[this.ns];
    return el.firstElementChild ? el.firstElementChild._1 : null;
  }
  /**
   * Getter for last property, the last compo in this compo
   *
   * @type {part}
   */
  get last() {
    const el = this[this.ns];
    return el.lastElementChild ? el.lastElementChild._1 : null;
  }
}
class Compo extends part {
  /**
   * Constructor method
   *
   * @constructs
   * @constant {RegExp} REJECTED_TAGS Regular expression for rejected tag
   * @constant {RegExp} DENIED_PROPS Regular expression for denied properties
   * @param {string} ns Compo namespace
   * @param {string} [tag='div'] The Element node name or compo name
   * @param {string[]} [name] The compo name, used for CSS className
   * @param {object} [props] Properties for compo
   * @param {?object} [options] An optional ElementCreationOptions object
   * @param {?object} [elementNS] Options for namespace Element node
   * @param {string} [elementNS.namespaceURI] A valid namespace URI
   * @param {string} [elementNS.qualifiedName] A valid qualified name
   */
  constructor(ns, tag, name, props, options, elementNS) {
    super();
    const ns0 = this.ns = `_${ns}`;
    const tagName = tag ? tag.toString() : "div";
    if (RegExp(REJECTED_TAGS, "i").test(tagName)) {
      throw new Error(l10n.ETAGN);
    }
    const el = this[ns0] = this.element(ns, tagName, name, props, options, elementNS);
    this.__Compo = 1;
    this[ns0]._1 = this;
    if (props && typeof props == "object") {
      for (const prop in props) {
        const p2 = prop.toString();
        if (RegExp(DENIED_PROPS).test(p2)) {
          throw new Error(l10n.EPROP);
        }
        if (p2.indexOf("on") === 0 && props[p2] && typeof props[p2] == "function") {
          el[p2] = props[p2].bind(this);
        } else if (typeof props[p2] != "object") {
          el[p2] = props[p2];
        } else if (p2 == "children") {
          if (typeof props[p2] == "object" && props[p2].length) {
            for (const child of props.children) {
              const { tag: tag2, name: name2, props: props2 } = child;
              this.append(new Compo(ns, tag2, name2, props2));
            }
          }
        }
      }
    }
    if (name) {
      const nodeClass = el.className;
      el.className = "";
      if (typeof name == "string") {
        el.className = `${ns}-${name}`;
      } else if (typeof name == "object") {
        el.className = Object.values(name).map((a2) => `${ns}-${a2}`).join(" ");
      }
      if (nodeClass) {
        el.className += ` ${nodeClass}`;
      }
    }
    this.render();
  }
  /**
   * Object wrapper
   *
   * @see Document.createElement
   * @see Document.createElementNS
   *
   * @param {string} ns Compo namespace
   * @param {string} tag The Element node name or compo name
   * @param {string} [name] Name for compo, used for CSS className
   * @param {object} [props] Properties for compo
   * @param {?object} [options] An optional ElementCreationOptions object
   * @param {?object} [elementNS] Options for namespaced Element node
   * @param {string} [elementNS.namespaceURI] A valid namespace URI
   * @param {string} [elementNS.qualifiedName] A valid qualified name
   */
  element(ns, tag, name, props, options, elementNS) {
    if (elementNS) return document.createElementNS(elementNS, tag, options);
    else return document.createElement(tag, options);
  }
  /**
   * Checks for an attribute of this compo
   *
   * @see Element.hasAttribute
   *
   * @param {string} attr An attribute
   * @returns {boolean}
   */
  hasAttr(attr) {
    return this[this.ns].hasAttribute(attr);
  }
  /**
   * Gets an attribute from this compo
   *
   * @see Element.getAttribute
   *
   * @param {string} attr An attribute
   * @returns {string}
   */
  getAttr(attr) {
    return this[this.ns].getAttribute(attr);
  }
  /**
   * Sets an attribute in this compo
   *
   * @see Element.setAttribute
   *
   * @param {string} attr An attribute
   * @param {string} value The value
   */
  setAttr(attr, value) {
    this[this.ns].setAttribute(attr, value);
  }
  /**
   * Removes an attribute from this compo
   *
   * @see Element.removeAttribute
   *
   * @param {string} attr An attribute
   */
  delAttr(attr) {
    this[this.ns].removeAttribute(attr);
  }
  /**
   * Gets a current style property
   *
   * @see Window.getComputedStyle
   *
   * @param {string} prop A style property
   * @returns {mixed}
   */
  getStyle(prop) {
    return getComputedStyle(this[this.ns])[prop];
  }
  /**
   * Shows this compo
   */
  show() {
    this[this.ns].hidden = false;
  }
  /**
   * Hides this compo
   */
  hide() {
    this[this.ns].hidden = true;
  }
  /**
   * Util to set attribute disabled to true
   */
  enable() {
    this[this.ns].disabled = false;
  }
  /**
   * Util to set attribute disabled to false
   */
  disable() {
    this[this.ns].disabled = true;
  }
  /**
   * Getter for node property, the Element node in this compo
   *
   * Note: Direct access to the node is discouraged.
   *
   * @type {Element}
   */
  get node() {
    console.warn(l10n.DOM);
    return this[this.ns];
  }
  /**
   * Getter for parent property, the parent compo of this compo
   *
   * @type {Compo}
   */
  get parent() {
    const el = this[this.ns];
    return el.parentElement && el.parentElement._1 ? el.parentElement._1 : null;
  }
  /**
   * Getter for previous property, the previous sibling of this compo
   *
   * @type {Compo}
   */
  get previous() {
    const el = this[this.ns];
    return el.previousElementSibling ? el.previousElementSibling._1 : null;
  }
  /**
   * Getter for next property, the next sibling of this compo
   *
   * @type {Compo}
   */
  get next() {
    const el = this[this.ns];
    return el.nextElementSibling ? el.nextElementSibling._1 : null;
  }
  /**
   * Getter for classList property, the classList of the Element node in this compo
   *
   * @see DOMTokenList
   *
   * @type {DOMTokenList}
   */
  get classList() {
    return this[this.ns].classList;
  }
  /**
   * Checks passed object is an ensemble Compo instance
   *
   * @static
   * @returns {boolean}
   */
  static isCompo(obj) {
    return obj instanceof Compo;
  }
}
class Data {
  /**
   * Constructor method
   *
   * @constructs
   * @param {string} ns Data namespace
   * @param {object} [obj] A starter Object
   */
  constructor(ns, obj) {
    if (obj && typeof obj == "object") {
      Object.assign(this, {}, obj);
    }
    const ns0 = this.ns = `_${ns}`;
    this.__Data = 0;
    this[ns0] = { ns };
  }
  /**
   * The compo method is a utility to render elements
   * 
   * When you create a compo with this method, it will create a Compo or an Object placeholder.
   * With defer render you can render it in place.
   *
   * @param {string} tag Element node tag or compo name
   * @param {string} [name] The compo name, used for CSS className
   * @param {object} [props] Properties for Element node or compo
   * @param {boolean} [defer] Defer componet render
   * @param {mixed} [load] Callback function, on load compo
   * @param {mixed} [unload] Callback function, on unload compo
   * @returns {mixed} compo A compo element or an Object placeholder 
   */
  compo(tag, name, props, defer = false, load = false, unload = false) {
    const ns = this[this.ns].ns;
    let compo;
    if (defer) {
      compo = { ns, tag, name, props, load, unload };
    } else {
      compo = new Compo(ns, tag, name, props);
    }
    if (load && typeof load == "function") {
      compo.load = props.onload = load;
    }
    if (unload && typeof unload == "function") {
      compo.unload = props.onunload = unload;
    }
    return compo;
  }
  /**
   * Renders a compo, passed by reference
   *
   * @async
   * @param {mixed} slot Reference of the element to render
   */
  async render(slot) {
    const el = this[this.ns];
    const self = this;
    if (el[slot] && el[slot]._) {
      el[slot].load();
    } else {
      el[slot] = { _: self[slot], load: self[slot].load, unload: self[slot].unload };
      self[slot] = new Compo(self[slot].ns, self[slot].tag, self[slot].name, self[slot].props);
      el[slot].load();
    }
  }
  /**
   * Unloads a compo, passed by reference
   *
   * @async
   * @param {mixed} slot Reference of the element to render
   */
  async unload(slot) {
    const el = this[this.ns];
    if (el[slot] && el[slot]._) {
      el[slot].unload();
    }
  }
  /**
   * Reflows a compo, passed by reference
   *
   * @async
   * @param {mixed} slot Reference of the element to render
   * @param {boolean} [force] Force reflow
   */
  async reflow(slot, force) {
    const el = this[this.ns];
    if (force) {
      el[slot] = this.compo(el[slot]._.ns, el[slot]._.name, el[slot]._.props);
    } else if (el[slot] && el[slot]._) {
      el[slot].load();
    }
  }
  /**
   * Checks passed object is an ensemble Data instance
   *
   * @static
   * @returns {boolean}
   */
  static isData(obj) {
    return obj instanceof Data;
  }
}
let Event$1 = class Event2 {
  /**
   * Constructor method
   *
   * @see Element.addEventListener
   * @see Element.removeEventListener
   *
   * @constructs
   * @param {string} ns Event namespace
   * @param {string} name Event type name
   * @param {Element} [node] A valid Element node or compo
   */
  constructor(ns, name, node) {
    const ns0 = this.ns = `_${ns}`;
    node = (Compo.isCompo(node) ? node[ns] : node) || document;
    this.__Event = 0;
    this[ns0] = { name, node };
  }
  /**
   * Adds an event for this compo
   *
   * @see Element.addEventListener
   *
   * @param {function} func The function handler
   * @param {mixed} [options] An options Object or useCapture boolean
   */
  add(func, options = false) {
    const { node, name } = this[this.ns];
    node.addEventListener(name, func, options);
  }
  /**
   * Removes an event from this compo
   *
   * @see Element.removeEventListener
   *
   * @param {function} func The function handler
   */
  remove(func) {
    const { node, name } = this[this.ns];
    node.removeEventListener(name, func);
  }
  /**
   * Prevents the default event action for Event
   *
   * @see Event.preventDefault
   *
   * @static
   * @param {Event} event An Event
   */
  static prevent(event) {
    event.preventDefault();
  }
  /**
   * Performs focus on event target
   *
   * @see HTMLElement.focus
   *
   * @static
   * @param {Event} event An Event
   * @param {object} [options] Options for focus
   */
  static focus(event, options) {
    const { currentTarget } = event;
    currentTarget.focus && currentTarget.focus(options);
  }
  /**
   * Performs blur on event target
   *
   * @see HTMLElement.blur
   *
   * @static
   * @param {Event} event An Event
   * @param {number} [delay=100] Delay time in milliseconds
   */
  static blur(event, delay = 100) {
    const { currentTarget } = event;
    setTimeout(() => currentTarget.blur && currentTarget.blur(), delay);
  }
  /**
   * Checks passed object is an ensemble Event instance
   *
   * @static
   * @returns {boolean}
   */
  static isEvent(obj) {
    return obj instanceof Event2;
  }
};
class base {
  /**
   * Constructor method
   *
   * @constructs
   * @param {Element} [element] An optional valid Element node
   * @param {object} [options] Options object
   */
  constructor() {
    const args = arguments;
    let element, options;
    if (args.length > 1) {
      element = args[0];
      options = args[1];
    } else if (args[0] && typeof args[0] == "object" && args[0].nodeType) {
      element = args[0];
    } else {
      options = args[0];
    }
    if (options && typeof options != "object") {
      throw new TypeError(l10n.EOPTS);
    }
    if (element && typeof element != "object") {
      throw new TypeError(l10n.EELEM);
    }
    this.binds();
    this.options = this.opts(this.defaults(), options);
    Object.freeze(this.options);
    this.element = element;
  }
  /**
   * Creates an options Object from a defaults object
   * 
   * Note: Supports only first level depth.
   *
   * @param {object} defaults The default options Object
   * @param {object} [options] An options Object to extend defaults
   * @returns {object}
   */
  opts(defaults2, options = {}) {
    const opts = {};
    for (const key in defaults2) {
      if (defaults2[key] != null && typeof defaults2[key] == "object") {
        opts[key] = Object.assign(defaults2[key], options[key]);
      } else {
        opts[key] = typeof options[key] != "undefined" ? options[key] : defaults2[key];
      }
    }
    return opts;
  }
  /**
   * Shorthand method for ensemble Compo class
   *
   * When passed the first argument, makes a new Compo instance 
   * otherwise returns a reference to the Compo class.
   *
   * @param {string} [tag='div'] The Element node name or compo name, empty for Compo class reference
   * @param {string[]} [name] The compo name, used for CSS className
   * @param {object} [props] Properties for compo
   * @returns {mixed} Instance of Compo or Compo class reference
   */
  compo(tag, name, props) {
    const ns = this.options.ns;
    return tag != void 0 ? new Compo(ns, tag, name, props) : Compo;
  }
  /**
   * Shorthand method for ensemble Data class
   *
   * When passed the first argument, makes a new Data instance 
   * otherwise returns a reference to the Data class.
   *
   * @param {object} [obj] A starter Object, empty for Data class reference
   * @returns {mixed} Instance of Data or Data class reference
   */
  data(obj) {
    const ns = this.options.ns;
    return obj != void 0 ? new Data(ns, obj) : Data;
  }
  /**
   * Shorthand method for ensemble Event class
   *
   * When the passed first argument is a string makes a new Event instance 
   * otherwise it returns a reference to the Event class.
   *
   * @param {string} [name] A valid Event name
   * @param {Element} [node] An Element node
   * @returns {mixed} Instance of Event or Event class reference
   */
  event(name, node) {
    const ns = this.options.ns;
    return name != void 0 ? new Event$1(ns, name, node) : Event$1;
  }
  /**
   * Shorthand for querySelectorAll and querySelector [DOM]
   *
   * @see Document.querySelectorAll
   * @see Document.querySelector
   *
   * @param {string} query Text query
   * @param {Element} [node] An Element node where to find
   * @param {boolean} [all] Find multiple elements
   * @return {mixed} Element or ElementCollection
   */
  selector(query, node, all = false) {
    node = node || document;
    return all ? node.querySelectorAll(query) : node.querySelector(query);
  }
  /**
   * Shorthand for Element.cloneNode [DOM]
   *
   * @see Node.cloneNode
   *
   * @param {Element} node An Element node to clone
   * @param {boolean} [deep] Clone inner nodes
   * @returns {boolean}
   */
  cloneNode(node, deep = false) {
    return node.cloneNode(deep);
  }
  /**
   * Shorthand for Element.hasAttribute [DOM]
   *
   * @see Element.hasAttribute
   *
   * @param {Element} node An Element node
   * @param {string} attr An attribute
   * @returns {boolean}
   */
  hasAttr(node, attr) {
    return node.hasAttribute(attr);
  }
  /**
   * Shorthand for Element.getAttribute [DOM]
   *
   * @see Element.getAttribute
   *
   * @param {Element} node An Element node
   * @param {string} attr An attribute
   * @returns {string}
   */
  getAttr(node, attr) {
    return node.getAttribute(attr);
  }
  /**
   * Util to create an icon
   *
   * @param {string} type Icons type: font, svg, symbol, shape
   * @param {string} name Icon name, CSS class name
   * @param {string} prefix Icon prefix, CSS class name
   * @param {string} [path] Icon SVG path or SVG image src
   * @param {string} [hash] Icon SVG symbol href or SVG image src hash
   * @param {string} [viewBox] Icon SVG viewBox size
   */
  icon(type, name, prefix, path, hash, viewBox) {
    const ns = this.options.ns;
    const className = prefix ? `${prefix}-${name}` : name;
    const icon = this.compo("span", "icon", { className });
    if (type != "font") {
      if (type == "symbol" || type == "shape") {
        const svgNsUri = "http://www.w3.org/2000/svg";
        const svg = new Compo(ns, "svg", false, false, null, svgNsUri);
        const tag = type == "symbol" ? "use" : "path";
        const node = new Compo(ns, tag, false, false, null, svgNsUri);
        if (viewBox) {
          const m2 = viewBox.match(/\d+ \d+ (\d+) (\d+)/);
          if (m2) {
            Object.entries({
              width: m2[1],
              height: m2[2],
              viewBox: m2[0]
            }).forEach((a2) => svg.setAttr(a2[0], a2[1]));
          }
        }
        if (tag == "use") {
          node.setAttr("href", `#${hash}`);
        } else {
          node.setAttr("d", path);
        }
        svg.append(node);
        icon.append(svg);
      } else if (type == "svg" && this.origin()) {
        const img = this.compo(ns, "img", false, {
          "src": `${path}#${hash}`
        });
        icon.append(img);
      }
    }
    return icon;
  }
  /**
   * URL origin comparator
   *
   * @see URL
   * @see Window.origin
   * @see Window.location
   *
   * @param {URL} b URL
   * @param {URL} a URL
   * @returns {boolean} Check is same origin
   */
  origin(b2, a2) {
    a2 = URL.canParse(a2) ? a2 : window.origin != "null" ? window.origin : window.location.origin;
    b2 = URL.canParse(b2) ? new URL(b2).origin : a2;
    return a2 && b2 && a2 === b2;
  }
  /**
   * Gets the time from a style property of an element
   *
   * @see Window.getComputedStyle
   *
   * @param {mixed} node An Element node or a compo
   * @param {string} prop A style property
   * @returns {number} time Delay time in milliseconds
   */
  cst(node, prop) {
    let time = Compo.isCompo(node) ? node.getStyle(prop) : getComputedStyle(node)[prop];
    if (time) {
      time = time.indexOf("s") ? parseFloat(time) * 1e3 : parseInt(time);
    }
    return time || 0;
  }
  /**
   * Provides a delay with callback function
   *
   * @see Window.setTimeout
   *
   * @param {function} func A callback function
   * @param {mixed} [node] An Element node or a compo
   * @param {number} [time] Default delay time in milliseconds
   */
  delay(func, node, time) {
    const delay = node ? this.cst(node, "transitionDuration") : 0;
    setTimeout(func, delay || time);
  }
  /**
   * Creates a proxy function to the instance
   *
   * @param {function} method A method from the current instance
   * @returns {function}
   */
  wrap(method) {
    const self = this;
    if (this[method] && typeof method != "function") {
      throw new TypeError(l10n.EMETH);
    }
    return function() {
      method.call(self, ...arguments, this);
    };
  }
}
const SocialShareActionEnum = Object.freeze({
  share: 0,
  send: 1,
  email: 2,
  copy: 3,
  webapi: 4
});
class SocialShare extends base {
  /**
   * Shorthand for sharing action enum
   *
   * @static
   * @returns {SocialShareActionEnum}
   */
  static actionEnum() {
    return SocialShareActionEnum;
  }
  /**
   * Default scaffold sharing intents
   *
   * @constant {object} SocialShareActionEnum Sharing action enum
   * @returns {object}
   */
  aks() {
    const i2 = SocialShareActionEnum;
    return {
      "facebook": i2.share,
      "x": i2.share,
      "linkedin": i2.share,
      "threads": i2.share,
      "bluesky": i2.share,
      "reddit": i2.share,
      "mastodon": i2.share,
      "quora": i2.share,
      "whatsapp": i2.send,
      "messenger": i2.send,
      "telegram": i2.send,
      "skype": i2.send,
      "viber": i2.send,
      "line": i2.send,
      "snapchat": i2.send,
      "send-email": i2.email,
      "copy-link": i2.copy,
      "web-share": i2.webapi
    };
  }
  /**
   * Default properties
   *
   * @returns {object}
   */
  defaults() {
    this.ska = this.aks();
    return {
      ns: "share",
      root: "body",
      className: "social-share",
      layout: "h",
      icons: {
        type: "font",
        prefix: "icon"
      },
      effects: true,
      link: "",
      title: "",
      description: "",
      intents: null,
      scaffold: this.ska,
      uriform: {
        "facebook": "https://www.facebook.com/dialog/share?display=popup&href=%url%&app_id=%app_id%",
        "x": "https://twitter.com/intent/tweet?text=%title%&url=%url%",
        "linkedin": "https://www.linkedin.com/sharing/share-offsite?mini=true&url=%url%&title=%title%&ro=false&summary=%summary%",
        "threads": "https://threads.net/intent/post?text=%url%",
        "bluesky": "https://bsky.app/intent/compose?text=%url%",
        "reddit": "https://www.reddit.com/submit?url=%url%&title=%title%",
        "mastodon": "https://mastodon.social/share?text=%text%",
        "quora": "https://www.quora.com/share?url=%url%&title=%title%",
        "whatsapp": "https://api.whatsapp.com/send?text=%text%",
        "messenger": "fb-messenger://share/?link=%url%&app_id=%app_id%",
        "telegram": "https://telegram.me/share/url?url=%url%&text=%text%",
        "skype": "https://web.skype.com/share?url=%url%&text=%title%",
        "viber": "viber://forward?text=%text%",
        "line": "https://line.me/R/msg/text/?%text%",
        "snapchat": "https://www.snapchat.com/share?link=%url%",
        "send-email": "mailto:?subject=%subject%&body=%text%"
      },
      selectorLink: {
        element: 'link[rel="canonical"]',
        attribute: "href"
      },
      selectorTitle: null,
      selectorDescription: {
        element: 'meta[name="description"]',
        attribute: "content"
      },
      label: {
        className: "sr-only"
      },
      ariaLabel: true,
      copiedEffectDelay: 1e3,
      locale: {
        label: "Share",
        share: "Share on %s",
        send: "Send to %s",
        subject: "An interesting thing",
        text: "Hi! Here something may interesting you: %s",
        email: "Send via email",
        copy: "Copy link",
        copied: "Copied link!",
        "whatsapp": "WhatsApp",
        "linkedin": "LinkedIn",
        "web-share": "Share"
      },
      onIntent: () => {
      },
      onInit: () => {
      }
    };
  }
  /**
   * Methods binding
   */
  binds() {
    this.intent = this.wrap(this.intent);
  }
  /**
   * Constructor
   *
   * @constructs
   */
  constructor() {
    super(...arguments);
    this.encoder = encodeURIComponent;
    this.init();
  }
  /**
   * Initializes the component
   *
   * @emits #options.onInit
   */
  init() {
    if (this.built)
      return;
    const opts = this.options;
    this.root = this.selector(opts.root);
    let intents = [];
    if (!opts.intents && this.ska === opts.scaffold) {
      const a2 = Object.keys(this.ska);
      for (const i2 of [0, 1, 8, 9, 10, 2, 15, 16, 17]) {
        intents.push(a2[i2]);
      }
    } else if (opts.intents instanceof Array) {
      intents = opts.intents;
    } else if (opts.intents) {
      intents = Object.keys(opts.scaffold);
    }
    this.intents = intents;
    this.layout();
    if (this.element) {
      this.$.place(this.element, (function(node) {
        this.element = node;
      }).bind(this));
    }
    this.drawer();
    opts.onInit.call(this, this);
  }
  /**
   * Lead layout
   */
  layout() {
    const opts = this.options;
    const locale = opts.locale;
    const compo = this.$ = this.compo(false, false, {
      className: typeof opts.className == "object" ? Object.values(opts.className).join(" ") : opts.className
    });
    if (opts.ariaLabel) {
      const ariaLabel = opts.ariaLabel;
      compo.setAttr("aria-label", typeof ariaLabel == "string" ? ariaLabel : locale.label);
    }
    if (opts.label) {
      const labelParams = opts.label;
      const label = this.compo("span", "label", {
        className: labelParams.className,
        innerText: labelParams.text ?? locale.label
      });
      compo.append(label);
    }
    if (opts.layout == "v") {
      compo.classList.add(`${opts.ns}-vertical`);
    }
    const actions = this.actions = this.compo("ul", "actions");
    compo.append(actions);
    this.built = true;
  }
  /**
   * Places all the actions in a drawer
   *
   * @see Navigator.share
   */
  drawer() {
    const act = SocialShareActionEnum;
    const opts = this.options;
    const locale = opts.locale;
    for (const intent of this.intents) {
      if (!intent in opts.scaffold)
        continue;
      const name = intent in locale ? locale[intent].toString() : intent.replace(/\w/, (cap) => cap.toUpperCase());
      let title;
      switch (opts.scaffold[intent]) {
        case act.share:
          title = locale.share.toString().replace("%s", name);
          break;
        case act.send:
          title = locale.send.toString().replace("%s", name);
          break;
        case act.email:
          title = locale.email.toString();
          break;
        case act.copy:
          title = locale.copy.toString();
          break;
        case act.webapi:
          if (!navigator.share)
            continue;
          title = locale["web-share"].toString();
          break;
      }
      this.action(intent, title);
    }
  }
  /**
   * Creates the action with a share button
   *
   * @param {string} intent Intent name
   * @param {string} title Title for action
   */
  action(intent, title) {
    const opts = this.options;
    const action = this.compo("li", "action", {
      className: `${opts.ns}-action-${intent}`
    });
    const button = this.compo("button", ["button", "intent"], {
      className: `${opts.ns}-intent-${intent}`,
      title,
      onclick: this.intent
    });
    action.setAttr("data-share-intent", intent);
    action.append(button);
    {
      const { type, prefix, src, viewBox } = opts.icons;
      const icon = this.icon(type, intent, prefix, src, intent, viewBox);
      button.append(icon);
    }
    this.actions.append(action);
  }
  /**
   * Selects a sharing intent
   *
   * This method is called from each action.
   *
   * @see Window.location
   *
   * @emits #options.onIntent
   *
   * @param {Event} evt An Event
   * @param {Element} target The element is invoking
   */
  intent(evt, target) {
    this.event().prevent(evt);
    if (!evt.isTrusted) return;
    const act = SocialShareActionEnum;
    const opts = this.options;
    const locale = opts.locale;
    if (!this.compo().isCompo(target))
      return;
    const action = target.parent;
    if (!(action && action.hasAttr("data-share-intent")))
      return;
    const intent = action.getAttr("data-share-intent");
    if (this.intents.indexOf(intent) == -1)
      return;
    let url, title, summary, text;
    const { selectorLink, selectorTitle, selectorDescription } = opts;
    if (opts.link) {
      url = new URL(opts.link).toString();
    } else if (selectorLink && selectorLink.element && this.selector(selectorLink.element)) {
      url = this.getAttr(this.selector(selectorLink.element), selectorLink.attribute);
    } else {
      url = window.location.href;
    }
    if (opts.title) {
      title = opts.title;
    } else if (selectorTitle && selectorTitle.element && this.selector(selectorTitle.element)) {
      title = this.getAttr(this.selector(selectorTitle.element), selectorTitle.attribute);
    } else {
      title = document.title;
    }
    if (opts.description) {
      summary = opts.description;
    } else if (selectorDescription && selectorDescription.element && this.selector(selectorDescription.element)) {
      summary = this.getAttr(this.selector(selectorDescription.element), selectorDescription.attribute);
    } else {
      summary = title;
    }
    text = "\n\n%title%\n%url%\n\n";
    const data = { url, title, text, summary };
    opts.onIntent.call(this, this, evt, intent, data);
    data.text = locale.text.toString().replace("%s", data.text);
    if (intent in opts.scaffold) {
      switch (opts.scaffold[intent]) {
        case act.email:
          this.sendEmail(evt, data);
          break;
        case act.copy:
          this.copyLink(evt, data);
          break;
        case act.webapi:
          this.webShare(evt, data);
          break;
        default:
          this.share(evt, data, intent);
      }
    }
    this.event().blur(evt);
  }
  /**
   * Text substitutions and URL encodes
   *
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   * @return {string} URL encoded text string
   */
  text(data) {
    return this.encoder(
      data.text.replace("%url%", data.url).replace("%title%", data.title).replace("%summary%", data.summary)
    );
  }
  /**
   * Share intent for social sharing action
   *
   * @see Window.open
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   * @param {string} intent Intent name
   */
  share(evt, data, intent) {
    const { options: opts, encoder } = this;
    if (!intent in opts.uriform) return;
    let url = opts.uriform[intent].replace("%url%", encoder(data.url)).replace("%title%", encoder(data.title)).replace("%summary%", encoder(data.summary));
    const features = "toolbar=0,status=0,width=640,height=480";
    if (/%text%/.test(opts.uriform[intent])) {
      url = url.replace("%text%", this.text(data));
    }
    if (intent == "facebook" || intent == "messenger") {
      const app_id = opts[`${intent}_app_id`] ?? "";
      url = url.replace("%app_id%", encoder(app_id));
    }
    window.open(url, null, features);
  }
  /**
   * Send email intent
   *
   * Tries to open the default e-mail client.
   *
   * @see Window.open
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   */
  sendEmail(evt, data) {
    const opts = this.options;
    const locale = opts.locale;
    const url = opts.uriform["send-email"].replace("%subject%", this.encoder(locale.subject)).replace("%text%", this.text(data));
    window.open(url, "_self");
  }
  /**
   * Copy link intent
   *
   * Tries to copy the link to the clipboard.
   *
   * @see Navigator.clipboard
   * @see Document.execCommand
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   */
  copyLink(evt, data) {
    if (!this.element) return;
    const opts = this.options;
    const locale = opts.locale;
    try {
      navigator.clipboard.writeText(data.url);
    } catch (err) {
      if (err instanceof TypeError) {
        const doc = document;
        const node = doc.createElement("textarea");
        node.style = "position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden";
        node.value = data.url;
        doc.append(node);
        node.focus();
        node.select();
        doc.execCommand("copy");
        node.remove();
      } else {
        console.error("copyLink", err.message);
      }
    }
    if (opts.effects) {
      const { root } = this;
      const bg = this.compo(false, "effects-copied-link--bg", { hidden: true });
      const msg = this.compo("span", "copied-link-msg", { innerText: locale.copied });
      root.classList.add("share-effects-copied-link");
      bg.bind(root);
      msg.bind(root);
      bg.show();
      this.delay(() => {
        msg.unbind(root);
        bg.unbind(root);
        root.classList.remove("share-effects-copied-link");
      }, bg, parseInt(opts.copiedEffectDelay) || 0);
    }
  }
  /**
   * Share from device caller
   *
   * Calls the native WebShare API
   *
   * @see Navigator.share
   *
   * @async
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   */
  async webShare(evt, data) {
    try {
      await navigator.share({ title: data.title, url: data.url });
    } catch (err) {
      console.error("webShare", err.message);
    }
  }
}
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
function isObject$1(obj) {
  return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend$1(target = {}, src = {}) {
  const noExtend = ["__proto__", "constructor", "prototype"];
  Object.keys(src).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
    if (typeof target[key] === "undefined") target[key] = src[key];
    else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
      extend$1(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function getDocument() {
  const doc = typeof document !== "undefined" ? document : {};
  extend$1(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function CustomEvent2() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === "undefined") {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === "undefined") {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = typeof window !== "undefined" ? window : {};
  extend$1(win, ssrWindow);
  return win;
}
function classesToTokens(classes2 = "") {
  return classes2.trim().split(" ").filter((c2) => !!c2.trim());
}
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e2) {
    }
    try {
      delete object[key];
    } catch (e2) {
    }
  });
}
function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window2 = getWindow();
  let style;
  if (window2.getComputedStyle) {
    style = window2.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis = "x") {
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform.split(", ").map((a2) => a2.replace(",", ".")).join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m41;
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
    else curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m42;
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
    else curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject(o2) {
  return typeof o2 === "object" && o2 !== null && o2.constructor && Object.prototype.toString.call(o2).slice(8, -1) === "Object";
}
function isNode(node) {
  if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend(...args) {
  const to = Object(args[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i2 = 1; i2 < args.length; i2 += 1) {
    const nextSource = args[i2];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window2 = getWindow();
  const startPosition = -swiper.translate;
  let startTime2 = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current, target) => {
    return dir === "next" && current >= target || dir === "prev" && current <= target;
  };
  const animate2 = () => {
    time = (/* @__PURE__ */ new Date()).getTime();
    if (startTime2 === null) {
      startTime2 = time;
    }
    const progress = Math.max(Math.min((time - startTime2) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window2.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window2.requestAnimationFrame(animate2);
  };
  animate2();
}
function elementChildren(element, selector = "") {
  const window2 = getWindow();
  const children = [...element.children];
  if (window2.HTMLSlotElement && element instanceof HTMLSlotElement) {
    children.push(...element.assignedElements());
  }
  if (!selector) {
    return children;
  }
  return children.filter((el) => el.matches(selector));
}
function elementIsChildOfSlot(el, slot) {
  const elementsQueue = [slot];
  while (elementsQueue.length > 0) {
    const elementToCheck = elementsQueue.shift();
    if (el === elementToCheck) {
      return true;
    }
    elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
  }
}
function elementIsChildOf(el, parent) {
  const window2 = getWindow();
  let isChild = parent.contains(el);
  if (!isChild && window2.HTMLSlotElement && parent instanceof HTMLSlotElement) {
    const children = [...parent.assignedElements()];
    isChild = children.includes(el);
    if (!isChild) {
      isChild = elementIsChildOfSlot(el, parent);
    }
  }
  return isChild;
}
function showWarning(text) {
  try {
    console.warn(text);
    return;
  } catch (err) {
  }
}
function createElement(tag, classes2 = []) {
  const el = document.createElement(tag);
  el.classList.add(...Array.isArray(classes2) ? classes2 : classesToTokens(classes2));
  return el;
}
function elementPrevAll(el, selector) {
  const prevEls = [];
  while (el.previousElementSibling) {
    const prev = el.previousElementSibling;
    if (selector) {
      if (prev.matches(selector)) prevEls.push(prev);
    } else prevEls.push(prev);
    el = prev;
  }
  return prevEls;
}
function elementNextAll(el, selector) {
  const nextEls = [];
  while (el.nextElementSibling) {
    const next = el.nextElementSibling;
    if (selector) {
      if (next.matches(selector)) nextEls.push(next);
    } else nextEls.push(next);
    el = next;
  }
  return nextEls;
}
function elementStyle(el, prop) {
  const window2 = getWindow();
  return window2.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
  let child = el;
  let i2;
  if (child) {
    i2 = 0;
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i2 += 1;
    }
    return i2;
  }
  return void 0;
}
function elementParents(el, selector) {
  const parents = [];
  let parent = el.parentElement;
  while (parent) {
    if (selector) {
      if (parent.matches(selector)) parents.push(parent);
    } else {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}
function elementTransitionEnd(el, callback) {
  function fireCallBack(e2) {
    if (e2.target !== el) return;
    callback.call(el, e2);
    el.removeEventListener("transitionend", fireCallBack);
  }
  if (callback) {
    el.addEventListener("transitionend", fireCallBack);
  }
}
function elementOuterSize(el, size, includeMargins) {
  const window2 = getWindow();
  {
    return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
  }
}
function makeElementsArray(el) {
  return (Array.isArray(el) ? el : [el]).filter((e2) => !!e2);
}
function setInnerHTML(el, html = "") {
  if (typeof trustedTypes !== "undefined") {
    el.innerHTML = trustedTypes.createPolicy("html", {
      createHTML: (s2) => s2
    }).createHTML(html);
  } else {
    el.innerHTML = html;
  }
}
let support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll: document2.documentElement && document2.documentElement.style && "scrollBehavior" in document2.documentElement.style,
    touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
let deviceCached;
function calcDevice({
  userAgent: userAgent2
} = {}) {
  const support2 = getSupport();
  const window2 = getWindow();
  const platform = window2.navigator.platform;
  const ua = userAgent2 || window2.navigator.userAgent;
  const device2 = {
    ios: false,
    android: false
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad)(?!\1).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === "Win32";
  let macos = platform === "MacIntel";
  const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device2.os = "android";
    device2.android = true;
  }
  if (ipad || iphone || ipod) {
    device2.os = "ios";
    device2.ios = true;
  }
  return device2;
}
function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
let browser;
function calcBrowser() {
  const window2 = getWindow();
  const device2 = getDevice();
  let needPerspectiveFix = false;
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
  }
  if (isSafari()) {
    const ua = String(window2.navigator.userAgent);
    if (ua.includes("Version/")) {
      const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
      needPerspectiveFix = major < 16 || major === 16 && minor < 2;
    }
  }
  const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent);
  const isSafariBrowser = isSafari();
  const need3dFix = isSafariBrowser || isWebView && device2.ios;
  return {
    isSafari: needPerspectiveFix || isSafariBrowser,
    needPerspectiveFix,
    need3dFix,
    isWebView
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}
function Resize({
  swiper,
  on,
  emit
}) {
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit("orientationchange");
  };
  on("init", () => {
    if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer({
  swiper,
  extendParams,
  on,
  emit
}) {
  const observers = [];
  const window2 = getWindow();
  const attach = (target, options = {}) => {
    const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (swiper.__preventObserver__) return;
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === "undefined" ? true : options.attributes,
      childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
      characterData: typeof options.characterData === "undefined" ? true : options.characterData
    });
    observers.push(observer);
  };
  const init2 = () => {
    if (!swiper.params.observer) return;
    if (swiper.params.observeParents) {
      const containerParents = elementParents(swiper.hostEl);
      for (let i2 = 0; i2 < containerParents.length; i2 += 1) {
        attach(containerParents[i2]);
      }
    }
    attach(swiper.hostEl, {
      childList: swiper.params.observeSlideChildren
    });
    attach(swiper.wrapperEl, {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on("init", init2);
  on("destroy", destroy);
}
var eventsEmitter = {
  on(events2, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== "function") return self;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event) => {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },
  once(events2, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== "function") return self;
    function onceHandler(...args) {
      self.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      handler.apply(self, args);
    }
    onceHandler.__emitterProxy = handler;
    return self.on(events2, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== "function") return self;
    const method = priority ? "unshift" : "push";
    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }
    return self;
  },
  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);
    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }
    return self;
  },
  off(events2, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    events2.split(" ").forEach((event) => {
      if (typeof handler === "undefined") {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },
  emit(...args) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    let events2;
    let data;
    let context;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events2 = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event) => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context, [event, ...data]);
        });
      }
      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler) => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }
};
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const el = swiper.el;
  if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = el.clientWidth;
  }
  if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = el.clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }
  width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
  height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}
function updateSlides() {
  const swiper = this;
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    wrapperEl,
    slidesEl,
    rtlTranslate: rtl2,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  const swiperSize = swiper.size - offsetBefore - offsetAfter;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  swiper.virtualSize = -spaceBetween - offsetBefore - offsetAfter;
  slides.forEach((slideEl) => {
    if (rtl2) {
      slideEl.style.marginLeft = "";
    } else {
      slideEl.style.marginRight = "";
    }
    slideEl.style.marginBottom = "";
    slideEl.style.marginTop = "";
  });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slides);
  } else if (swiper.grid) {
    swiper.grid.unsetSlides();
  }
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
    return typeof params.breakpoints[key].slidesPerView !== "undefined";
  }).length > 0;
  for (let i2 = 0; i2 < slidesLength; i2 += 1) {
    slideSize = 0;
    const slide2 = slides[i2];
    if (slide2) {
      if (gridEnabled) {
        swiper.grid.updateSlide(i2, slide2, slides);
      }
      if (elementStyle(slide2, "display") === "none") continue;
    }
    if (isVirtual && params.slidesPerView === "auto") {
      if (params.virtual.slidesPerViewAutoSlideSize) {
        slideSize = params.virtual.slidesPerViewAutoSlideSize;
      }
      if (slideSize && slide2) {
        if (params.roundLengths) slideSize = Math.floor(slideSize);
        slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
      }
    } else if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slide2.style[swiper.getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2);
      const currentTransform = slide2.style.transform;
      const currentWebKitTransform = slide2.style.webkitTransform;
      if (currentTransform) {
        slide2.style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? elementOuterSize(slide2, "width") : elementOuterSize(slide2, "height");
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide2;
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2.style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);
      if (slide2) {
        slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slide2) {
      slide2.swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i2 !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i2 === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl2 && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
    wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (params.setWrapperSize) {
    wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i2 = 0; i2 < snapGrid.length; i2 += 1) {
      let slidesGridItem = snapGrid[i2];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i2] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (isVirtual && params.loop) {
    const size = slidesSizesGrid[0] + spaceBetween;
    if (params.slidesPerGroup > 1) {
      const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
      const groupSize = size * params.slidesPerGroup;
      for (let i2 = 0; i2 < groups; i2 += 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
      }
    }
    for (let i2 = 0; i2 < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i2 += 1) {
      if (params.slidesPerGroup === 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + size);
      }
      slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
      swiper.virtualSize += size;
    }
  }
  if (snapGrid.length === 0) snapGrid = [0];
  if (spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl2 ? "marginLeft" : swiper.getDirectionLabel("marginRight");
    slides.filter((_2, slideIndex) => {
      if (!params.cssMode || params.loop) return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).forEach((slideEl) => {
      slideEl.style[key] = `${spaceBetween}px`;
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
    snapGrid = snapGrid.map((snap) => {
      if (snap <= 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const offsetSize = (offsetBefore || 0) + (offsetAfter || 0);
    if (allSlidesSize + offsetSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
    setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map((v2) => v2 + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map((v2) => v2 + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  swiper.emit("slidesUpdated");
  if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.el.classList.remove(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i2;
  if (typeof speed === "number") {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = (index) => {
    if (isVirtual) {
      return swiper.slides[swiper.getSlideIndexByData(index)];
    }
    return swiper.slides[index];
  };
  if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || []).forEach((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i2 = 0; i2 < Math.ceil(swiper.params.slidesPerView); i2 += 1) {
        const index = swiper.activeIndex + i2;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }
  for (i2 = 0; i2 < activeSlides.length; i2 += 1) {
    if (typeof activeSlides[i2] !== "undefined") {
      const height = activeSlides[i2].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
}
function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    slides[i2].swiperSlideOffset = (swiper.isHorizontal() ? slides[i2].offsetLeft : slides[i2].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
  }
}
const toggleSlideClasses$1 = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesProgress(translate2 = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl2,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl2) offsetCenter = translate2;
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  let spaceBetween = params.spaceBetween;
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    const slide2 = slides[i2];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i2];
    const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i2];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide2);
      swiper.visibleSlidesIndexes.push(i2);
    }
    toggleSlideClasses$1(slide2, isVisible, params.slideVisibleClass);
    toggleSlideClasses$1(slide2, isFullyVisible, params.slideFullyVisibleClass);
    slide2.progress = rtl2 ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl2 ? -originalSlideProgress : originalSlideProgress;
  }
}
function updateProgress(translate2) {
  const swiper = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd,
    progressLoop
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper.minTranslate()) / translatesDiff;
    const isBeginningRounded = Math.abs(translate2 - swiper.minTranslate()) < 1;
    const isEndRounded = Math.abs(translate2 - swiper.maxTranslate()) < 1;
    isBeginning = isBeginningRounded || progress <= 0;
    isEnd = isEndRounded || progress >= 1;
    if (isBeginningRounded) progress = 0;
    if (isEndRounded) progress = 1;
  }
  if (params.loop) {
    const firstSlideIndex = swiper.getSlideIndexByData(0);
    const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
    const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
    const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
    const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
    const translateAbs = Math.abs(translate2);
    if (translateAbs >= firstSlideTranslate) {
      progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
    } else {
      progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
    }
    if (progressLoop > 1) progressLoop -= 1;
  }
  Object.assign(swiper, {
    progress,
    progressLoop,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper.emit("reachEnd toEdge");
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit("fromEdge");
  }
  swiper.emit("progress", progress);
}
const toggleSlideClasses = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    slidesEl,
    activeIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const getFilteredSlide = (selector) => {
    return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
  };
  let activeSlide;
  let prevSlide;
  let nextSlide;
  if (isVirtual) {
    if (params.loop) {
      let slideIndex = activeIndex - swiper.virtual.slidesBefore;
      if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
      if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
    } else {
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
    }
  } else {
    if (gridEnabled) {
      activeSlide = slides.find((slideEl) => slideEl.column === activeIndex);
      nextSlide = slides.find((slideEl) => slideEl.column === activeIndex + 1);
      prevSlide = slides.find((slideEl) => slideEl.column === activeIndex - 1);
    } else {
      activeSlide = slides[activeIndex];
    }
  }
  if (activeSlide) {
    if (!gridEnabled) {
      nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !nextSlide) {
        nextSlide = slides[0];
      }
      prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !prevSlide === 0) {
        prevSlide = slides[slides.length - 1];
      }
    }
  }
  slides.forEach((slideEl) => {
    toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
    toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
    toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
  });
  swiper.emitSlidesClasses();
}
const processLazyPreloader = (swiper, imageEl) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  const slideEl = imageEl.closest(slideSelector());
  if (slideEl) {
    let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
    if (!lazyEl && swiper.isElement) {
      if (slideEl.shadowRoot) {
        lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      } else {
        requestAnimationFrame(() => {
          if (slideEl.shadowRoot) {
            lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            if (lazyEl) lazyEl.remove();
          }
        });
      }
    }
    if (lazyEl) lazyEl.remove();
  }
};
const unlazy = (swiper, index) => {
  if (!swiper.slides[index]) return;
  const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
  if (imageEl) imageEl.removeAttribute("loading");
};
const preload = (swiper) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  let amount = swiper.params.lazyPreloadPrevNext;
  const len = swiper.slides.length;
  if (!len || !amount || amount < 0) return;
  amount = Math.min(amount, len);
  const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
  const activeIndex = swiper.activeIndex;
  if (swiper.params.grid && swiper.params.grid.rows > 1) {
    const activeColumn = activeIndex;
    const preloadColumns = [activeColumn - amount];
    preloadColumns.push(...Array.from({
      length: amount
    }).map((_2, i2) => {
      return activeColumn + slidesPerView + i2;
    }));
    swiper.slides.forEach((slideEl, i2) => {
      if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i2);
    });
    return;
  }
  const slideIndexLastInView = activeIndex + slidesPerView - 1;
  if (swiper.params.rewind || swiper.params.loop) {
    for (let i2 = activeIndex - amount; i2 <= slideIndexLastInView + amount; i2 += 1) {
      const realIndex = (i2 % len + len) % len;
      if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
    }
  } else {
    for (let i2 = Math.max(activeIndex - amount, 0); i2 <= Math.min(slideIndexLastInView + amount, len - 1); i2 += 1) {
      if (i2 !== activeIndex && (i2 > slideIndexLastInView || i2 < activeIndex)) {
        unlazy(swiper, i2);
      }
    }
  }
};
function getActiveIndexByTranslate(swiper) {
  const {
    slidesGrid,
    params
  } = swiper;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  let activeIndex;
  for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
    if (typeof slidesGrid[i2 + 1] !== "undefined") {
      if (translate2 >= slidesGrid[i2] && translate2 < slidesGrid[i2 + 1] - (slidesGrid[i2 + 1] - slidesGrid[i2]) / 2) {
        activeIndex = i2;
      } else if (translate2 >= slidesGrid[i2] && translate2 < slidesGrid[i2 + 1]) {
        activeIndex = i2 + 1;
      }
    } else if (translate2 >= slidesGrid[i2]) {
      activeIndex = i2;
    }
  }
  if (params.normalizeSlideIndex) {
    if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
  }
  return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  const getVirtualRealIndex = (aIndex) => {
    let realIndex2 = aIndex - swiper.virtual.slidesBefore;
    if (realIndex2 < 0) {
      realIndex2 = swiper.virtual.slides.length + realIndex2;
    }
    if (realIndex2 >= swiper.virtual.slides.length) {
      realIndex2 -= swiper.virtual.slides.length;
    }
    return realIndex2;
  };
  if (typeof activeIndex === "undefined") {
    activeIndex = getActiveIndexByTranslate(swiper);
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex && !swiper.params.loop) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit("snapIndexChange");
    }
    return;
  }
  if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
    swiper.realIndex = getVirtualRealIndex(activeIndex);
    return;
  }
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  let realIndex;
  if (swiper.virtual && params.virtual.enabled && params.loop) {
    realIndex = getVirtualRealIndex(activeIndex);
  } else if (gridEnabled) {
    const firstSlideInColumn = swiper.slides.find((slideEl) => slideEl.column === activeIndex);
    let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
    if (Number.isNaN(activeSlideIndex)) {
      activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
    }
    realIndex = Math.floor(activeSlideIndex / params.grid.rows);
  } else if (swiper.slides[activeIndex]) {
    const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
    if (slideIndex) {
      realIndex = parseInt(slideIndex, 10);
    } else {
      realIndex = activeIndex;
    }
  } else {
    realIndex = activeIndex;
  }
  Object.assign(swiper, {
    previousSnapIndex,
    snapIndex,
    previousRealIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  if (swiper.initialized) {
    preload(swiper);
  }
  swiper.emit("activeIndexChange");
  swiper.emit("snapIndexChange");
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    if (previousRealIndex !== realIndex) {
      swiper.emit("realIndexChange");
    }
    swiper.emit("slideChange");
  }
}
function updateClickedSlide(el, path) {
  const swiper = this;
  const params = swiper.params;
  let slide2 = el.closest(`.${params.slideClass}, swiper-slide`);
  if (!slide2 && swiper.isElement && path && path.length > 1 && path.includes(el)) {
    [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
      if (!slide2 && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
        slide2 = pathEl;
      }
    });
  }
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i2 = 0; i2 < swiper.slides.length; i2 += 1) {
      if (swiper.slides[i2] === slide2) {
        slideFound = true;
        slideIndex = i2;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper.clickedSlide = slide2;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(slide2.getAttribute("data-swiper-slide-index"), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = void 0;
    swiper.clickedIndex = void 0;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}
var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl2,
    translate: translate2,
    wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl2 ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate(wrapperEl, axis);
  currentTranslate += swiper.cssOverflowAdjustment();
  if (rtl2) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl2,
    params,
    wrapperEl,
    progress
  } = swiper;
  let x2 = 0;
  let y2 = 0;
  const z2 = 0;
  if (swiper.isHorizontal()) {
    x2 = rtl2 ? -translate2 : translate2;
  } else {
    y2 = translate2;
  }
  if (params.roundLengths) {
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x2 : y2;
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x2 : -y2;
  } else if (!params.virtualTranslate) {
    if (swiper.isHorizontal()) {
      x2 -= swiper.cssOverflowAdjustment();
    } else {
      y2 -= swiper.cssOverflowAdjustment();
    }
    wrapperEl.style.transform = `translate3d(${x2}px, ${y2}px, ${z2}px)`;
  }
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate2);
  }
  swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate2 = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper.minTranslate();
  const maxTranslate2 = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2) newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2) newTranslate = maxTranslate2;
  else newTranslate = translate2;
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth"
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionEnd");
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionStart");
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e2) {
          if (!swiper || swiper.destroyed) return;
          if (e2.target !== this) return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          swiper.animating = false;
          if (runCallbacks) {
            swiper.emit("transitionEnd");
          }
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}
var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
    swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
  }
  swiper.emit("setTransition", duration, byController);
}
function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = "next";
    else if (activeIndex < previousIndex) dir = "prev";
    else dir = "reset";
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && dir === "reset") {
    swiper.emit(`slideResetTransition${step}`);
  } else if (runCallbacks && activeIndex !== previousIndex) {
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === "next") {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "Start"
  });
}
function transitionEnd(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "End"
  });
}
var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo(index = 0, speed, runCallbacks = true, internal, initial) {
  if (typeof index === "string") {
    index = parseInt(index, 10);
  }
  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl2,
    wrapperEl,
    enabled
  } = swiper;
  if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate2 = -snapGrid[snapIndex];
  if (params.normalizeSlideIndex) {
    for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i2] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i2 + 1] * 100);
      if (typeof slidesGrid[i2 + 1] !== "undefined") {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i2;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i2 + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i2;
      }
    }
  }
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && (rtl2 ? translate2 > swiper.translate && translate2 > swiper.minTranslate() : translate2 < swiper.translate && translate2 < swiper.minTranslate())) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) {
        return false;
      }
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit("beforeSlideChangeStart");
  }
  swiper.updateProgress(translate2);
  let direction;
  if (slideIndex > activeIndex) direction = "next";
  else if (slideIndex < activeIndex) direction = "prev";
  else direction = "reset";
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  const isInitialVirtual = isVirtual && initial;
  if (!isInitialVirtual && (rtl2 && -translate2 === swiper.translate || !rtl2 && translate2 === swiper.translate)) {
    swiper.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t2 = rtl2 ? translate2 : -translate2;
    if (speed === 0) {
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = "none";
        swiper._immediateVirtual = true;
      }
      if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
        swiper._cssModeVirtualInitialSet = true;
        requestAnimationFrame(() => {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
        });
      } else {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
      }
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = "";
          swiper._immediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t2,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t2,
        behavior: "smooth"
      });
    }
    return true;
  }
  const browser2 = getBrowser();
  const isSafari = browser2.isSafari;
  if (isVirtual && !initial && isSafari && swiper.isElement) {
    swiper.virtual.update(false, false, slideIndex);
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate2);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit("beforeTransitionStart", speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e2) {
        if (!swiper || swiper.destroyed) return;
        if (e2.target !== this) return;
        swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}
function slideToLoop(index = 0, speed, runCallbacks = true, internal) {
  if (typeof index === "string") {
    const indexAsNumber = parseInt(index, 10);
    index = indexAsNumber;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
  let newIndex = index;
  if (swiper.params.loop) {
    if (swiper.virtual && swiper.params.virtual.enabled) {
      newIndex = newIndex + swiper.virtual.slidesBefore;
    } else {
      let targetSlideIndex;
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        targetSlideIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
      } else {
        targetSlideIndex = swiper.getSlideIndexByData(newIndex);
      }
      const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
      const {
        centeredSlides,
        slidesOffsetBefore,
        slidesOffsetAfter
      } = swiper.params;
      const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
      let slidesPerView = swiper.params.slidesPerView;
      if (slidesPerView === "auto") {
        slidesPerView = swiper.slidesPerViewDynamic();
      } else {
        slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
        if (bothDirections && slidesPerView % 2 === 0) {
          slidesPerView = slidesPerView + 1;
        }
      }
      let needLoopFix = cols - targetSlideIndex < slidesPerView;
      if (bothDirections) {
        needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
      }
      if (internal && bothDirections && swiper.params.slidesPerView !== "auto" && !gridEnabled) {
        needLoopFix = false;
      }
      if (needLoopFix) {
        const direction = bothDirections ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
        swiper.loopFix({
          direction,
          slideTo: true,
          activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
          slideRealIndex: direction === "next" ? swiper.realIndex : void 0
        });
      }
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        newIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
      } else {
        newIndex = swiper.getSlideIndexByData(newIndex);
      }
    }
  }
  requestAnimationFrame(() => {
    swiper.slideTo(newIndex, speed, runCallbacks, internal);
  });
  return swiper;
}
function slideNext(speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    enabled,
    params,
    animating
  } = swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: "next"
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
    if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
      });
      return true;
    }
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled,
    animating
  } = swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: "prev"
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
  const isFreeMode = params.freeMode && params.freeMode.enabled;
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
    requestAnimationFrame(() => {
      swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    });
    return true;
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed, runCallbacks = true, internal) {
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate2 >= swiper.snapGrid[snapIndex]) {
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }
  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper = this;
  if (swiper.destroyed) return;
  const {
    params,
    slidesEl
  } = swiper;
  const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.getSlideIndexWhenGrid(swiper.clickedIndex);
  let realIndex;
  const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
  const isGrid = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
    if (params.centeredSlides) {
      swiper.slideToLoop(realIndex);
    } else if (slideToIndex > (isGrid ? (swiper.slides.length - slidesPerView) / 2 - (swiper.params.grid.rows - 1) : swiper.slides.length - slidesPerView)) {
      swiper.loopFix();
      slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate(slideRealIndex, initial) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  const initSlides = () => {
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    slides.forEach((el, index) => {
      el.setAttribute("data-swiper-slide-index", index);
    });
  };
  const clearBlankSlides = () => {
    const slides = elementChildren(slidesEl, `.${params.slideBlankClass}`);
    slides.forEach((el) => {
      el.remove();
    });
    if (slides.length > 0) {
      swiper.recalcSlides();
      swiper.updateSlides();
    }
  };
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  if (params.loopAddBlankSlides && (params.slidesPerGroup > 1 || gridEnabled)) {
    clearBlankSlides();
  }
  const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
  const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
  const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
  const addBlankSlides = (amountOfSlides) => {
    for (let i2 = 0; i2 < amountOfSlides; i2 += 1) {
      const slideEl = swiper.isElement ? createElement("swiper-slide", [params.slideBlankClass]) : createElement("div", [params.slideClass, params.slideBlankClass]);
      swiper.slidesEl.append(slideEl);
    }
  };
  if (shouldFillGroup) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
    }
    initSlides();
  } else if (shouldFillGrid) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
    }
    initSlides();
  } else {
    initSlides();
  }
  const bothDirections = params.centeredSlides || !!params.slidesOffsetBefore || !!params.slidesOffsetAfter;
  swiper.loopFix({
    slideRealIndex,
    direction: bothDirections ? void 0 : "next",
    initial
  });
}
function loopFix({
  slideRealIndex,
  slideTo: slideTo2 = true,
  direction,
  setTranslate: setTranslate2,
  activeSlideIndex,
  initial,
  byController,
  byMousewheel
} = {}) {
  const swiper = this;
  if (!swiper.params.loop) return;
  swiper.emit("beforeLoopFix");
  const {
    slides,
    allowSlidePrev,
    allowSlideNext,
    slidesEl,
    params
  } = swiper;
  const {
    centeredSlides,
    slidesOffsetBefore,
    slidesOffsetAfter,
    initialSlide
  } = params;
  const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  if (swiper.virtual && params.virtual.enabled) {
    if (slideTo2) {
      if (!bothDirections && swiper.snapIndex === 0) {
        swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
      } else if (bothDirections && swiper.snapIndex < params.slidesPerView) {
        swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
      } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
        swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit("loopFix");
    return;
  }
  let slidesPerView = params.slidesPerView;
  if (slidesPerView === "auto") {
    slidesPerView = swiper.slidesPerViewDynamic();
  } else {
    slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
    if (bothDirections && slidesPerView % 2 === 0) {
      slidesPerView = slidesPerView + 1;
    }
  }
  const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
  let loopedSlides = bothDirections ? Math.max(slidesPerGroup, Math.ceil(slidesPerView / 2)) : slidesPerGroup;
  if (loopedSlides % slidesPerGroup !== 0) {
    loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
  }
  loopedSlides += params.loopAdditionalSlides;
  swiper.loopedSlides = loopedSlides;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
    showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
  } else if (gridEnabled && params.grid.fill === "row") {
    showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
  }
  const prependSlidesIndexes = [];
  const appendSlidesIndexes = [];
  const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
  const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !bothDirections;
  let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
  if (typeof activeSlideIndex === "undefined") {
    activeSlideIndex = swiper.getSlideIndex(slides.find((el) => el.classList.contains(params.slideActiveClass)));
  } else {
    activeIndex = activeSlideIndex;
  }
  const isNext = direction === "next" || !direction;
  const isPrev = direction === "prev" || !direction;
  let slidesPrepended = 0;
  let slidesAppended = 0;
  const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
  const activeColIndexWithShift = activeColIndex + (bothDirections && typeof setTranslate2 === "undefined" ? -slidesPerView / 2 + 0.5 : 0);
  if (activeColIndexWithShift < loopedSlides) {
    slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
    for (let i2 = 0; i2 < loopedSlides - activeColIndexWithShift; i2 += 1) {
      const index = i2 - Math.floor(i2 / cols) * cols;
      if (gridEnabled) {
        const colIndexToPrepend = cols - index - 1;
        for (let i3 = slides.length - 1; i3 >= 0; i3 -= 1) {
          if (slides[i3].column === colIndexToPrepend) prependSlidesIndexes.push(i3);
        }
      } else {
        prependSlidesIndexes.push(cols - index - 1);
      }
    }
  } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
    slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
    if (isInitialOverflow) {
      slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
    }
    for (let i2 = 0; i2 < slidesAppended; i2 += 1) {
      const index = i2 - Math.floor(i2 / cols) * cols;
      if (gridEnabled) {
        slides.forEach((slide2, slideIndex) => {
          if (slide2.column === index) appendSlidesIndexes.push(slideIndex);
        });
      } else {
        appendSlidesIndexes.push(index);
      }
    }
  }
  swiper.__preventObserver__ = true;
  requestAnimationFrame(() => {
    swiper.__preventObserver__ = false;
  });
  if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
    if (appendSlidesIndexes.includes(activeSlideIndex)) {
      appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
    }
    if (prependSlidesIndexes.includes(activeSlideIndex)) {
      prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
    }
  }
  if (isPrev) {
    prependSlidesIndexes.forEach((index) => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.prepend(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  if (isNext) {
    appendSlidesIndexes.forEach((index) => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.append(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  swiper.recalcSlides();
  if (params.slidesPerView === "auto") {
    swiper.updateSlides();
  } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
    swiper.slides.forEach((slide2, slideIndex) => {
      swiper.grid.updateSlide(slideIndex, slide2, swiper.slides);
    });
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (slideTo2) {
    if (prependSlidesIndexes.length > 0 && isPrev) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
          if (setTranslate2) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        if (setTranslate2) {
          const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
          swiper.touchEventsData.currentTranslate = swiper.translate;
        }
      }
    } else if (appendSlidesIndexes.length > 0 && isNext) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
          if (setTranslate2) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
        swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
      }
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.controller && swiper.controller.control && !byController) {
    const loopParams = {
      slideRealIndex,
      direction,
      setTranslate: setTranslate2,
      activeSlideIndex,
      byController: true
    };
    if (Array.isArray(swiper.controller.control)) {
      swiper.controller.control.forEach((c2) => {
        if (!c2.destroyed && c2.params.loop) c2.loopFix({
          ...loopParams,
          slideTo: c2.params.slidesPerView === params.slidesPerView ? slideTo2 : false
        });
      });
    } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
      swiper.controller.control.loopFix({
        ...loopParams,
        slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo2 : false
      });
    }
  }
  swiper.emit("loopFix");
}
function loopDestroy() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
  swiper.recalcSlides();
  const newSlidesOrder = [];
  swiper.slides.forEach((slideEl) => {
    const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
    newSlidesOrder[index] = slideEl;
  });
  swiper.slides.forEach((slideEl) => {
    slideEl.removeAttribute("data-swiper-slide-index");
  });
  newSlidesOrder.forEach((slideEl) => {
    slidesEl.append(slideEl);
  });
  swiper.recalcSlides();
  swiper.slideTo(swiper.realIndex, 0);
}
var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor(moving) {
  const swiper = this;
  if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
function unsetGrabCursor() {
  const swiper = this;
  if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement(selector, base2 = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base2);
}
function preventEdgeSwipe(swiper, event, startX) {
  const window2 = getWindow();
  const {
    params
  } = swiper;
  const edgeSwipeDetection = params.edgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === "prevent") {
      event.preventDefault();
      return true;
    }
    return false;
  }
  return true;
}
function onTouchStart$1(event) {
  const swiper = this;
  const document2 = getDocument();
  let e2 = event;
  if (e2.originalEvent) e2 = e2.originalEvent;
  const data = swiper.touchEventsData;
  if (e2.type === "pointerdown") {
    if (data.pointerId !== null && data.pointerId !== e2.pointerId) {
      return;
    }
    data.pointerId = e2.pointerId;
  } else if (e2.type === "touchstart" && e2.targetTouches.length === 1) {
    data.touchId = e2.targetTouches[0].identifier;
  }
  if (e2.type === "touchstart") {
    preventEdgeSwipe(swiper, e2, e2.targetTouches[0].pageX);
    return;
  }
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e2.pointerType === "mouse") return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let targetEl = e2.target;
  if (params.touchEventsTarget === "wrapper") {
    if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
  }
  if ("which" in e2 && e2.which === 3) return;
  if ("button" in e2 && e2.button > 0) return;
  if (data.isTouched && data.isMoved) return;
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
  const eventPath = e2.composedPath ? e2.composedPath() : e2.path;
  if (swipingClassHasValue && e2.target && e2.target.shadowRoot && eventPath) {
    targetEl = eventPath[0];
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e2.target && e2.target.shadowRoot);
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!targetEl.closest(params.swipeHandler)) return;
  }
  touches.currentX = e2.pageX;
  touches.currentY = e2.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  if (!preventEdgeSwipe(swiper, e2, startX)) {
    return;
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = void 0;
  if (params.threshold > 0) data.allowThresholdMove = false;
  let preventDefault = true;
  if (targetEl.matches(data.focusableElements)) {
    preventDefault = false;
    if (targetEl.nodeName === "SELECT") {
      data.isTouched = false;
    }
  }
  if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl && (e2.pointerType === "mouse" || e2.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) {
    document2.activeElement.blur();
  }
  const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
  if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
    e2.preventDefault();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit("touchStart", e2);
}
function onTouchMove$1(event) {
  const document2 = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl2,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event.pointerType === "mouse") return;
  let e2 = event;
  if (e2.originalEvent) e2 = e2.originalEvent;
  if (e2.type === "pointermove") {
    if (data.touchId !== null) return;
    const id = e2.pointerId;
    if (id !== data.pointerId) return;
  }
  let targetTouch;
  if (e2.type === "touchmove") {
    targetTouch = [...e2.changedTouches].find((t2) => t2.identifier === data.touchId);
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  } else {
    targetTouch = e2;
  }
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit("touchMoveOpposite", e2);
    }
    return;
  }
  const pageX = targetTouch.pageX;
  const pageY = targetTouch.pageY;
  if (e2.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!e2.target.matches(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (rtl2 && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) {
      return;
    } else if (!rtl2 && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) {
      return;
    }
  }
  if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== e2.target && e2.pointerType !== "mouse") {
    document2.activeElement.blur();
  }
  if (document2.activeElement) {
    if (e2.target === document2.activeElement && e2.target.matches(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit("touchMove", e2);
  }
  touches.previousX = touches.currentX;
  touches.previousY = touches.currentY;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
  if (typeof data.isScrolling === "undefined") {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit("touchMoveOpposite", e2);
  }
  if (typeof data.startMoving === "undefined") {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling || e2.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e2.cancelable) {
    e2.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e2.stopPropagation();
  }
  let diff = swiper.isHorizontal() ? diffX : diffY;
  let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
  if (params.oneWayMovement) {
    diff = Math.abs(diff) * (rtl2 ? 1 : -1);
    touchesDiff = Math.abs(touchesDiff) * (rtl2 ? 1 : -1);
  }
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl2) {
    diff = -diff;
    touchesDiff = -touchesDiff;
  }
  const prevTouchesDirection = swiper.touchesDirection;
  swiper.swipeDirection = diff > 0 ? "prev" : "next";
  swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
  const isLoop = swiper.params.loop && !params.cssMode;
  const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
  if (!data.isMoved) {
    if (isLoop && allowLoopFix) {
      swiper.loopFix({
        direction: swiper.swipeDirection
      });
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      const evt = new window.CustomEvent("transitionend", {
        bubbles: true,
        cancelable: true,
        detail: {
          bySwiperTouchMove: true
        }
      });
      swiper.wrapperEl.dispatchEvent(evt);
    }
    data.allowMomentumBounce = false;
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit("sliderFirstMove", e2);
  }
  (/* @__PURE__ */ new Date()).getTime();
  if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
    Object.assign(touches, {
      startX: pageX,
      startY: pageY,
      currentX: pageX,
      currentY: pageY,
      startTranslate: data.currentTranslate
    });
    data.loopSwapReset = true;
    data.startTranslate = data.currentTranslate;
    return;
  }
  swiper.emit("sliderMove", e2);
  data.isMoved = true;
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0) {
    if (isLoop && allowLoopFix && true && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
      swiper.loopFix({
        direction: "prev",
        setTranslate: true,
        activeSlideIndex: 0
      });
    }
    if (data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      }
    }
  } else if (diff < 0) {
    if (isLoop && allowLoopFix && true && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
      swiper.loopFix({
        direction: "next",
        setTranslate: true,
        activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
      });
    }
    if (data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }
    }
  }
  if (disableParentSwiper) {
    e2.preventedByNestedSwiper = true;
  }
  if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode) return;
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  swiper.updateProgress(data.currentTranslate);
  swiper.setTranslate(data.currentTranslate);
}
function onTouchEnd$1(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  let e2 = event;
  if (e2.originalEvent) e2 = e2.originalEvent;
  let targetTouch;
  const isTouchEvent = e2.type === "touchend" || e2.type === "touchcancel";
  if (!isTouchEvent) {
    if (data.touchId !== null) return;
    if (e2.pointerId !== data.pointerId) return;
    targetTouch = e2;
  } else {
    targetTouch = [...e2.changedTouches].find((t2) => t2.identifier === data.touchId);
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  }
  if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(e2.type)) {
    const proceed = ["pointercancel", "contextmenu"].includes(e2.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
    if (!proceed) {
      return;
    }
  }
  data.pointerId = null;
  data.touchId = null;
  const {
    params,
    touches,
    rtlTranslate: rtl2,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e2.pointerType === "mouse") return;
  if (data.allowTouchCallbacks) {
    swiper.emit("touchEnd", e2);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;
  if (swiper.allowClick) {
    const pathTree = e2.path || e2.composedPath && e2.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e2.target, pathTree);
    swiper.emit("tap click", e2);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit("doubleTap doubleClick", e2);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl2 ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }
  const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i2 = 0; i2 < slidesGrid.length; i2 += i2 < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment2 = i2 < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i2 + increment2] !== "undefined") {
      if (swipeToLast || currentPos >= slidesGrid[i2] && currentPos < slidesGrid[i2 + increment2]) {
        stopIndex = i2;
        groupSize = slidesGrid[i2 + increment2] - slidesGrid[i2];
      }
    } else if (swipeToLast || currentPos >= slidesGrid[i2]) {
      stopIndex = i2;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
      else swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e2.target === swiper.navigation.nextEl || e2.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === "next") {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === "prev") {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e2.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return;
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  const isVirtualLoop = isVirtual && params.loop;
  if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    if (swiper.params.loop && !isVirtual) {
      swiper.slideToLoop(swiper.realIndex, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    clearTimeout(swiper.autoplay.resizeTimeout);
    swiper.autoplay.resizeTimeout = setTimeout(() => {
      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.resume();
      }
    }, 500);
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
function onClick(e2) {
  const swiper = this;
  if (!swiper.enabled) return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e2.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e2.stopPropagation();
      e2.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit("setTranslate", swiper.translate, false);
}
function onLoad$1(e2) {
  const swiper = this;
  processLazyPreloader(swiper, e2.target);
  if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) {
    return;
  }
  swiper.update();
}
function onDocumentTouchStart() {
  const swiper = this;
  if (swiper.documentTouchHandlerProceeded) return;
  swiper.documentTouchHandlerProceeded = true;
  if (swiper.params.touchReleaseOnEdges) {
    swiper.el.style.touchAction = "auto";
  }
}
const events = (swiper, method) => {
  const document2 = getDocument();
  const {
    params,
    el,
    wrapperEl,
    device: device2
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  if (!el || typeof el === "string") return;
  document2[domMethod]("touchstart", swiper.onDocumentTouchStart, {
    passive: false,
    capture
  });
  el[domMethod]("touchstart", swiper.onTouchStart, {
    passive: false
  });
  el[domMethod]("pointerdown", swiper.onTouchStart, {
    passive: false
  });
  document2[domMethod]("touchmove", swiper.onTouchMove, {
    passive: false,
    capture
  });
  document2[domMethod]("pointermove", swiper.onTouchMove, {
    passive: false,
    capture
  });
  document2[domMethod]("touchend", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerup", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointercancel", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("touchcancel", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerout", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerleave", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("contextmenu", swiper.onTouchEnd, {
    passive: true
  });
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device2.ios || device2.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
  } else {
    swiper[swiperMethod]("observerUpdate", onResize, true);
  }
  el[domMethod]("load", swiper.onLoad, {
    capture: true
  });
};
function attachEvents() {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.onTouchStart = onTouchStart$1.bind(swiper);
  swiper.onTouchMove = onTouchMove$1.bind(swiper);
  swiper.onTouchEnd = onTouchEnd$1.bind(swiper);
  swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad$1.bind(swiper);
  events(swiper, "on");
}
function detachEvents() {
  const swiper = this;
  events(swiper, "off");
}
var events$1 = {
  attachEvents,
  detachEvents
};
const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    realIndex,
    initialized,
    params,
    el
  } = swiper;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0) return;
  const document2 = getDocument();
  const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
  const breakpointContainer = ["window", "container"].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document2.querySelector(params.breakpointsBase);
  const breakpoint = swiper.getBreakpoint(breakpoints2, breakpointsBase, breakpointContainer);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasGrabCursor = swiper.params.grabCursor;
  const isGrabCursor = breakpointParams.grabCursor;
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    el.classList.add(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
      el.classList.add(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  if (wasGrabCursor && !isGrabCursor) {
    swiper.unsetGrabCursor();
  } else if (!wasGrabCursor && isGrabCursor) {
    swiper.setGrabCursor();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    if (typeof breakpointParams[prop] === "undefined") return;
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  const wasLoop = params.loop;
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  const hasLoop = swiper.params.loop;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit("_beforeBreakpoint", breakpointParams);
  if (initialized) {
    if (needsReLoop) {
      swiper.loopDestroy();
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (!wasLoop && hasLoop) {
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (wasLoop && !hasLoop) {
      swiper.loopDestroy();
    }
  }
  swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base2 = "window", containerEl) {
  if (!breakpoints2 || base2 === "container" && !containerEl) return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight = base2 === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a2, b2) => parseInt(a2.value, 10) - parseInt(b2.value, 10));
  for (let i2 = 0; i2 < points.length; i2 += 1) {
    const {
      point,
      value
    } = points[i2];
    if (base2 === "window") {
      if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
var breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl: rtl2,
    el,
    device: device2
  } = swiper;
  const suffixes = prepareClasses(["initialized", params.direction, {
    "free-mode": swiper.params.freeMode && params.freeMode.enabled
  }, {
    "autoheight": params.autoHeight
  }, {
    "rtl": rtl2
  }, {
    "grid": params.grid && params.grid.rows > 1
  }, {
    "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
  }, {
    "android": device2.android
  }, {
    "ios": device2.ios
  }, {
    "css-mode": params.cssMode
  }, {
    "centered": params.cssMode && params.centeredSlides
  }, {
    "watch-progress": params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  el.classList.add(...classNames);
  swiper.emitContainerClasses();
}
function removeClasses() {
  const swiper = this;
  const {
    el,
    classNames
  } = swiper;
  if (!el || typeof el === "string") return;
  el.classList.remove(...classNames);
  swiper.emitContainerClasses();
}
var classes = {
  addClasses,
  removeClasses
};
function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? "lock" : "unlock");
  }
}
var checkOverflow$1 = {
  checkOverflow
};
var defaults = {
  init: true,
  direction: "horizontal",
  oneWayMovement: false,
  swiperElementNodeName: "SWIPER-CONTAINER",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  eventsPrefix: "swiper",
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 5,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // loop
  loop: false,
  loopAddBlankSlides: true,
  loopAdditionalSlides: 0,
  loopPreventsSliding: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-blank",
  slideActiveClass: "swiper-slide-active",
  slideVisibleClass: "swiper-slide-visible",
  slideFullyVisibleClass: "swiper-slide-fully-visible",
  slideNextClass: "swiper-slide-next",
  slidePrevClass: "swiper-slide-prev",
  wrapperClass: "swiper-wrapper",
  lazyPreloaderClass: "swiper-lazy-preloader",
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
      params[moduleParamName].auto = true;
    }
    if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
      params[moduleParamName].auto = true;
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend(allModulesParams, obj);
      return;
    }
    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    extend(allModulesParams, obj);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes
};
const extendedDefaults = {};
class Swiper {
  constructor(...args) {
    let el;
    let params;
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params) params = {};
    params = extend({}, params);
    if (el && !params.el) params.el = el;
    const document2 = getDocument();
    if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
      const swipers = [];
      document2.querySelectorAll(params.el).forEach((containerEl) => {
        const newParams = extend({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    }
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach((mod) => {
      mod({
        params,
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });
    const swiperParams = extend({}, defaults, allModulesParams);
    swiper.params = extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend({}, swiper.params);
    swiper.passedParams = extend({}, params);
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach((eventName) => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === "horizontal";
      },
      isVertical() {
        return swiper.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      cssOverflowAdjustment() {
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        startMoving: void 0,
        pointerId: null,
        touchId: null
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit("_swiper");
    if (swiper.params.init) {
      swiper.init();
    }
    return swiper;
  }
  getDirectionLabel(property) {
    if (this.isHorizontal()) {
      return property;
    }
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom"
    }[property];
  }
  getSlideIndex(slideEl) {
    const {
      slidesEl,
      params
    } = this;
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    const firstSlideIndex = elementIndex(slides[0]);
    return elementIndex(slideEl) - firstSlideIndex;
  }
  getSlideIndexByData(index) {
    return this.getSlideIndex(this.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index));
  }
  getSlideIndexWhenGrid(index) {
    if (this.grid && this.params.grid && this.params.grid.rows > 1) {
      if (this.params.grid.fill === "column") {
        index = Math.floor(index / this.params.grid.rows);
      } else if (this.params.grid.fill === "row") {
        index = index % Math.ceil(this.slides.length / this.params.grid.rows);
      }
    }
    return index;
  }
  recalcSlides() {
    const swiper = this;
    const {
      slidesEl,
      params
    } = swiper;
    swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
  }
  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit("enable");
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(" ").filter((className) => {
      return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return "";
    return slideEl.className.split(" ").filter((className) => {
      return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(" ");
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.forEach((slideEl) => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit("_slideClass", slideEl, classNames);
    });
    swiper.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view = "current", exact = false) {
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (typeof params.slidesPerView === "number") return params.slidesPerView;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
      let breakLoop;
      for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += Math.ceil(slides[i2].swiperSlideSize);
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
      for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += slides[i2].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
          const slideInView = exact ? slidesGrid[i2] + slidesSizesGrid[i2] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i2] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i2] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      }
    });
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      setTranslate2();
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
        const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
        translated = swiper.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit("update");
  }
  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
      return swiper;
    }
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
    swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.forEach((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper.emit("changeDirection");
    if (needUpdate) swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
    swiper.rtl = direction === "rtl";
    swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
    if (swiper.rtl) {
      swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "rtl";
    } else {
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "ltr";
    }
    swiper.update();
  }
  mount(element) {
    const swiper = this;
    if (swiper.mounted) return true;
    let el = element || swiper.params.el;
    if (typeof el === "string") {
      el = document.querySelector(el);
    }
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
      swiper.isElement = true;
    }
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = el.shadowRoot.querySelector(getWrapperSelector());
        return res;
      }
      return elementChildren(el, getWrapperSelector())[0];
    };
    let wrapperEl = getWrapper();
    if (!wrapperEl && swiper.params.createElements) {
      wrapperEl = createElement("div", swiper.params.wrapperClass);
      el.append(wrapperEl);
      elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
        wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      el,
      wrapperEl,
      slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
      hostEl: swiper.isElement ? el.parentNode.host : el,
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
      rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
      wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit("beforeInit");
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.addClasses();
    swiper.updateSize();
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }
    if (swiper.params.loop) {
      swiper.loopCreate(void 0, true);
    }
    swiper.attachEvents();
    const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
    if (swiper.isElement) {
      lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
    }
    lazyElements.forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      } else {
        imageEl.addEventListener("load", (e2) => {
          processLazyPreloader(swiper, e2.target);
        });
      }
    });
    preload(swiper);
    swiper.initialized = true;
    preload(swiper);
    swiper.emit("init");
    swiper.emit("afterInit");
    return swiper;
  }
  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      el,
      wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === "undefined" || swiper.destroyed) {
      return null;
    }
    swiper.emit("beforeDestroy");
    swiper.initialized = false;
    swiper.detachEvents();
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (cleanStyles) {
      swiper.removeClasses();
      if (el && typeof el !== "string") {
        el.removeAttribute("style");
      }
      if (wrapperEl) {
        wrapperEl.removeAttribute("style");
      }
      if (slides && slides.length) {
        slides.forEach((slideEl) => {
          slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
          slideEl.removeAttribute("style");
          slideEl.removeAttribute("data-swiper-slide-index");
        });
      }
    }
    swiper.emit("destroy");
    Object.keys(swiper.eventsListeners).forEach((eventName) => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      if (swiper.el && typeof swiper.el !== "string") {
        swiper.el.swiper = null;
      }
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === "function" && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m2) => Swiper.installModule(m2));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
        if (!element) {
          element = createElement("div", checkProps[key]);
          element.className = checkProps[key];
          swiper.el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}
const arrowSvg = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>`;
function Navigation({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      addIcons: true,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled"
    }
  });
  swiper.navigation = {
    nextEl: null,
    prevEl: null,
    arrowSvg
  };
  function getEl(el) {
    let res;
    if (el && typeof el === "string" && swiper.isElement) {
      res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
      if (res) return res;
    }
    if (el) {
      if (typeof el === "string") res = [...document.querySelectorAll(el)];
      if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
        res = swiper.el.querySelector(el);
      } else if (res && res.length === 1) {
        res = res[0];
      }
    }
    if (el && !res) return el;
    return res;
  }
  function toggleEl(el, disabled) {
    const params = swiper.params.navigation;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (subEl) {
        subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
        if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
        }
      }
    });
  }
  function update2() {
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (swiper.params.loop) {
      toggleEl(prevEl, false);
      toggleEl(nextEl, false);
      return;
    }
    toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e2) {
    e2.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
    emit("navigationPrev");
  }
  function onNextClick(e2) {
    e2.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit("navigationNext");
  }
  function init2() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev"
    });
    if (!(params.nextEl || params.prevEl)) return;
    let nextEl = getEl(params.nextEl);
    let prevEl = getEl(params.prevEl);
    Object.assign(swiper.navigation, {
      nextEl,
      prevEl
    });
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const initButton = (el, dir) => {
      if (el) {
        if (params.addIcons && el.matches(".swiper-button-next,.swiper-button-prev") && !el.querySelector("svg")) {
          const tempEl = document.createElement("div");
          setInnerHTML(tempEl, arrowSvg);
          el.appendChild(tempEl.querySelector("svg"));
          tempEl.remove();
        }
        el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
      }
      if (!swiper.enabled && el) {
        el.classList.add(...params.lockClass.split(" "));
      }
    };
    nextEl.forEach((el) => initButton(el, "next"));
    prevEl.forEach((el) => initButton(el, "prev"));
  }
  function destroy() {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const destroyButton = (el, dir) => {
      el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
      el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
    };
    nextEl.forEach((el) => destroyButton(el, "next"));
    prevEl.forEach((el) => destroyButton(el, "prev"));
  }
  on("init", () => {
    if (swiper.params.navigation.enabled === false) {
      disable();
    } else {
      init2();
      update2();
    }
  });
  on("toEdge fromEdge lock unlock", () => {
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (swiper.enabled) {
      update2();
      return;
    }
    [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.add(swiper.params.navigation.lockClass));
  });
  on("click", (_s, e2) => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const targetEl = e2.target;
    let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
    if (swiper.isElement && !targetIsButton) {
      const path = e2.path || e2.composedPath && e2.composedPath();
      if (path) {
        targetIsButton = path.find((pathEl) => nextEl.includes(pathEl) || prevEl.includes(pathEl));
      }
    }
    if (swiper.params.navigation.hideOnClick && !targetIsButton) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;
      if (nextEl.length) {
        isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      } else if (prevEl.length) {
        isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper.params.navigation.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
    init2();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update: update2,
    init: init2,
    destroy
  });
}
function classesToSelector(classes2 = "") {
  return `.${classes2.trim().replace(/([\.:!+\/()[\]])/g, "\\$1").replace(/ /g, ".")}`;
}
function Pagination({
  swiper,
  extendParams,
  on,
  emit
}) {
  const pfx = "swiper-pagination";
  extendParams({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: "bullets",
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: (number) => number,
      formatFractionTotal: (number) => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
  }
  function setSideBullets(bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    if (!bulletEl) return;
    bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
    if (bulletEl) {
      bulletEl.classList.add(`${bulletActiveClass}-${position}`);
      bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
      }
    }
  }
  function getMoveDirection(prevIndex, nextIndex, length) {
    prevIndex = prevIndex % length;
    nextIndex = nextIndex % length;
    if (nextIndex === prevIndex + 1) {
      return "next";
    } else if (nextIndex === prevIndex - 1) {
      return "previous";
    }
    return;
  }
  function onBulletClick(e2) {
    const bulletEl = e2.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
    if (!bulletEl) {
      return;
    }
    e2.preventDefault();
    const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
    if (swiper.params.loop) {
      if (swiper.realIndex === index) return;
      const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
      if (moveDirection === "next") {
        swiper.slideNext();
      } else if (moveDirection === "previous") {
        swiper.slidePrev();
      } else {
        swiper.slideToLoop(index);
      }
    } else {
      swiper.slideTo(index);
    }
  }
  function update2() {
    const rtl2 = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let current;
    let previousIndex;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
    if (swiper.params.loop) {
      previousIndex = swiper.previousRealIndex || 0;
      current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
    } else if (typeof swiper.snapIndex !== "undefined") {
      current = swiper.snapIndex;
      previousIndex = swiper.previousSnapIndex;
    } else {
      previousIndex = swiper.previousIndex || 0;
      current = swiper.activeIndex || 0;
    }
    if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height");
        el.forEach((subEl) => {
          subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
        });
        if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
          dynamicBulletIndex += current - (previousIndex || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.forEach((bulletEl) => {
        const classesToRemove = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix) => `${params.bulletActiveClass}${suffix}`)].map((s2) => typeof s2 === "string" && s2.includes(" ") ? s2.split(" ") : s2).flat();
        bulletEl.classList.remove(...classesToRemove);
      });
      if (el.length > 1) {
        bullets.forEach((bullet) => {
          const bulletIndex = elementIndex(bullet);
          if (bulletIndex === current) {
            bullet.classList.add(...params.bulletActiveClass.split(" "));
          } else if (swiper.isElement) {
            bullet.setAttribute("part", "bullet");
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
            }
            if (bulletIndex === firstIndex) {
              setSideBullets(bullet, "prev");
            }
            if (bulletIndex === lastIndex) {
              setSideBullets(bullet, "next");
            }
          }
        });
      } else {
        const bullet = bullets[current];
        if (bullet) {
          bullet.classList.add(...params.bulletActiveClass.split(" "));
        }
        if (swiper.isElement) {
          bullets.forEach((bulletEl, bulletIndex) => {
            bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
          });
        }
        if (params.dynamicBullets) {
          const firstDisplayedBullet = bullets[firstIndex];
          const lastDisplayedBullet = bullets[lastIndex];
          for (let i2 = firstIndex; i2 <= lastIndex; i2 += 1) {
            if (bullets[i2]) {
              bullets[i2].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
            }
          }
          setSideBullets(firstDisplayedBullet, "prev");
          setSideBullets(lastDisplayedBullet, "next");
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl2 ? "right" : "left";
        bullets.forEach((bullet) => {
          bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
        });
      }
    }
    el.forEach((subEl, subElIndex) => {
      if (params.type === "fraction") {
        subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
          fractionEl.textContent = params.formatFractionCurrent(current + 1);
        });
        subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
          totalEl.textContent = params.formatFractionTotal(total);
        });
      }
      if (params.type === "progressbar") {
        let progressbarDirection;
        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
        } else {
          progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
        }
        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;
        if (progressbarDirection === "horizontal") {
          scaleX = scale;
        } else {
          scaleY = scale;
        }
        subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
          progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
          progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
        });
      }
      if (params.type === "custom" && params.renderCustom) {
        setInnerHTML(subEl, params.renderCustom(swiper, current + 1, total));
        if (subElIndex === 0) emit("paginationRender", subEl);
      } else {
        if (subElIndex === 0) emit("paginationRender", subEl);
        emit("paginationUpdate", subEl);
      }
      if (swiper.params.watchOverflow && swiper.enabled) {
        subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
      }
    });
  }
  function render() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let paginationHTML = "";
    if (params.type === "bullets") {
      let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }
      for (let i2 = 0; i2 < numberOfBullets; i2 += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i2, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
    }
    if (params.type === "fraction") {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
      }
    }
    if (params.type === "progressbar") {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
    }
    swiper.pagination.bullets = [];
    el.forEach((subEl) => {
      if (params.type !== "custom") {
        setInnerHTML(subEl, paginationHTML || "");
      }
      if (params.type === "bullets") {
        swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
      }
    });
    if (params.type !== "custom") {
      emit("paginationRender", el[0]);
    }
  }
  function init2() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: "swiper-pagination"
    });
    const params = swiper.params.pagination;
    if (!params.el) return;
    let el;
    if (typeof params.el === "string" && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === "string") {
      el = [...document.querySelectorAll(params.el)];
    }
    if (!el) {
      el = params.el;
    }
    if (!el || el.length === 0) return;
    if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
      el = [...swiper.el.querySelectorAll(params.el)];
      if (el.length > 1) {
        el = el.find((subEl) => {
          if (elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
          return true;
        });
      }
    }
    if (Array.isArray(el) && el.length === 1) el = el[0];
    Object.assign(swiper.pagination, {
      el
    });
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (params.type === "bullets" && params.clickable) {
        subEl.classList.add(...(params.clickableClass || "").split(" "));
      }
      subEl.classList.add(params.modifierClass + params.type);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      if (params.type === "bullets" && params.dynamicBullets) {
        subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;
        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }
      if (params.type === "progressbar" && params.progressbarOpposite) {
        subEl.classList.add(params.progressbarOppositeClass);
      }
      if (params.clickable) {
        subEl.addEventListener("click", onBulletClick);
      }
      if (!swiper.enabled) {
        subEl.classList.add(params.lockClass);
      }
    });
  }
  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => {
        subEl.classList.remove(params.hiddenClass);
        subEl.classList.remove(params.modifierClass + params.type);
        subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (params.clickable) {
          subEl.classList.remove(...(params.clickableClass || "").split(" "));
          subEl.removeEventListener("click", onBulletClick);
        }
      });
    }
    if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
  }
  on("changeDirection", () => {
    if (!swiper.pagination || !swiper.pagination.el) return;
    const params = swiper.params.pagination;
    let {
      el
    } = swiper.pagination;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    });
  });
  on("init", () => {
    if (swiper.params.pagination.enabled === false) {
      disable();
    } else {
      init2();
      render();
      update2();
    }
  });
  on("activeIndexChange", () => {
    if (typeof swiper.snapIndex === "undefined") {
      update2();
    }
  });
  on("snapIndexChange", () => {
    update2();
  });
  on("snapGridLengthChange", () => {
    render();
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass));
    }
  });
  on("lock unlock", () => {
    update2();
  });
  on("click", (_s, e2) => {
    const targetEl = e2.target;
    const el = makeElementsArray(swiper.pagination.el);
    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
      const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
      if (isHidden === true) {
        emit("paginationShow");
      } else {
        emit("paginationHide");
      }
      el.forEach((subEl) => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
    }
    init2();
    render();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update: update2,
    init: init2,
    destroy
  });
}
function Autoplay({
  swiper,
  extendParams,
  on,
  emit,
  params
}) {
  swiper.autoplay = {
    running: false,
    paused: false,
    timeLeft: 0
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3e3,
      waitForTransition: true,
      disableOnInteraction: false,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });
  let timeout;
  let raf;
  let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayTimeLeft;
  let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
  let wasPaused;
  let isTouched;
  let pausedByTouch;
  let touchStartTimeout;
  let slideChanged;
  let pausedByInteraction;
  let pausedByPointerEnter;
  function onTransitionEnd(e2) {
    if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
    if (e2.target !== swiper.wrapperEl) return;
    swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
    if (pausedByPointerEnter || e2.detail && e2.detail.bySwiperTouchMove) {
      return;
    }
    resume();
  }
  const calcTimeLeft = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.autoplay.paused) {
      wasPaused = true;
    } else if (wasPaused) {
      autoplayDelayCurrent = autoplayTimeLeft;
      wasPaused = false;
    }
    const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
    swiper.autoplay.timeLeft = timeLeft;
    emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
    raf = requestAnimationFrame(() => {
      calcTimeLeft();
    });
  };
  const getSlideDelay = () => {
    let activeSlideEl;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      activeSlideEl = swiper.slides.find((slideEl) => slideEl.classList.contains("swiper-slide-active"));
    } else {
      activeSlideEl = swiper.slides[swiper.activeIndex];
    }
    if (!activeSlideEl) return void 0;
    const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
    return currentSlideDelay;
  };
  const run = (delayForce) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    cancelAnimationFrame(raf);
    calcTimeLeft();
    let delay = typeof delayForce === "undefined" ? swiper.params.autoplay.delay : delayForce;
    autoplayDelayTotal = swiper.params.autoplay.delay;
    autoplayDelayCurrent = swiper.params.autoplay.delay;
    const currentSlideDelay = getSlideDelay();
    if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
      delay = currentSlideDelay;
      autoplayDelayTotal = currentSlideDelay;
      autoplayDelayCurrent = currentSlideDelay;
    }
    autoplayTimeLeft = delay;
    const speed = swiper.params.speed;
    const proceed = () => {
      if (!swiper || swiper.destroyed) return;
      if (swiper.params.autoplay.reverseDirection) {
        if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
          swiper.slidePrev(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(swiper.slides.length - 1, speed, true, true);
          emit("autoplay");
        }
      } else {
        if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
          swiper.slideNext(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(0, speed, true, true);
          emit("autoplay");
        }
      }
      if (swiper.params.cssMode) {
        autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
        requestAnimationFrame(() => {
          run();
        });
      }
    };
    if (delay > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        proceed();
      }, delay);
    } else {
      requestAnimationFrame(() => {
        proceed();
      });
    }
    return delay;
  };
  const start = () => {
    autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
    swiper.autoplay.running = true;
    run();
    emit("autoplayStart");
  };
  const stop = () => {
    swiper.autoplay.running = false;
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    emit("autoplayStop");
  };
  const pause = (internal, reset) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    clearTimeout(timeout);
    if (!internal) {
      pausedByInteraction = true;
    }
    const proceed = () => {
      emit("autoplayPause");
      if (swiper.params.autoplay.waitForTransition) {
        swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
      } else {
        resume();
      }
    };
    swiper.autoplay.paused = true;
    if (reset) {
      if (slideChanged) {
        autoplayTimeLeft = swiper.params.autoplay.delay;
      }
      slideChanged = false;
      proceed();
      return;
    }
    const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
    autoplayTimeLeft = delay - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
    if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
    proceed();
  };
  const resume = () => {
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
    autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
    if (pausedByInteraction) {
      pausedByInteraction = false;
      run(autoplayTimeLeft);
    } else {
      run();
    }
    swiper.autoplay.paused = false;
    emit("autoplayResume");
  };
  const onVisibilityChange = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    const document2 = getDocument();
    if (document2.visibilityState === "hidden") {
      pausedByInteraction = true;
      pause(true);
    }
    if (document2.visibilityState === "visible") {
      resume();
    }
  };
  const onPointerEnter = (e2) => {
    if (e2.pointerType !== "mouse") return;
    pausedByInteraction = true;
    pausedByPointerEnter = true;
    if (swiper.animating || swiper.autoplay.paused) return;
    pause(true);
  };
  const onPointerLeave = (e2) => {
    if (e2.pointerType !== "mouse") return;
    pausedByPointerEnter = false;
    if (swiper.autoplay.paused) {
      resume();
    }
  };
  const attachMouseEvents = () => {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.el.addEventListener("pointerenter", onPointerEnter);
      swiper.el.addEventListener("pointerleave", onPointerLeave);
    }
  };
  const detachMouseEvents = () => {
    if (swiper.el && typeof swiper.el !== "string") {
      swiper.el.removeEventListener("pointerenter", onPointerEnter);
      swiper.el.removeEventListener("pointerleave", onPointerLeave);
    }
  };
  const attachDocumentEvents = () => {
    const document2 = getDocument();
    document2.addEventListener("visibilitychange", onVisibilityChange);
  };
  const detachDocumentEvents = () => {
    const document2 = getDocument();
    document2.removeEventListener("visibilitychange", onVisibilityChange);
  };
  on("init", () => {
    if (swiper.params.autoplay.enabled) {
      attachMouseEvents();
      attachDocumentEvents();
      start();
    }
  });
  on("destroy", () => {
    detachMouseEvents();
    detachDocumentEvents();
    if (swiper.autoplay.running) {
      stop();
    }
  });
  on("_freeModeStaticRelease", () => {
    if (pausedByTouch || pausedByInteraction) {
      resume();
    }
  });
  on("_freeModeNoMomentumRelease", () => {
    if (!swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on("beforeTransitionStart", (_s, speed, internal) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (internal || !swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on("sliderFirstMove", () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
      return;
    }
    isTouched = true;
    pausedByTouch = false;
    pausedByInteraction = false;
    touchStartTimeout = setTimeout(() => {
      pausedByInteraction = true;
      pausedByTouch = true;
      pause(true);
    }, 200);
  });
  on("touchEnd", () => {
    if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
    clearTimeout(touchStartTimeout);
    clearTimeout(timeout);
    if (swiper.params.autoplay.disableOnInteraction) {
      pausedByTouch = false;
      isTouched = false;
      return;
    }
    if (pausedByTouch && swiper.params.cssMode) resume();
    pausedByTouch = false;
    isTouched = false;
  });
  on("slideChange", () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    slideChanged = true;
  });
  Object.assign(swiper.autoplay, {
    start,
    stop,
    pause,
    resume
  });
}
function Thumb({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: "swiper-slide-thumb-active",
      thumbsContainerClass: "swiper-thumbs"
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      swiper.slideToLoop(slideToIndex);
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function init2() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      if (thumbsParams.swiper.destroyed) {
        initialized = false;
        return false;
      }
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper.update();
    } else if (isObject(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on("tap", onThumbClick);
    return true;
  }
  function update2(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i2}"]`).forEach((slideEl) => {
          slideEl.classList.add(thumbActiveClass);
        });
      }
    } else {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        if (thumbsSwiper.slides[swiper.realIndex + i2]) {
          thumbsSwiper.slides[swiper.realIndex + i2].classList.add(thumbActiveClass);
        }
      }
    }
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      const currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        const newThumbsSlide = thumbsSwiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`);
        newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
        direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
      }
      if (useOffset) {
        newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
      }
    }
  }
  on("beforeInit", () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper) return;
    if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
      const document2 = getDocument();
      const getThumbsElementAndInit = () => {
        const thumbsElement = typeof thumbs.swiper === "string" ? document2.querySelector(thumbs.swiper) : thumbs.swiper;
        if (thumbsElement && thumbsElement.swiper) {
          thumbs.swiper = thumbsElement.swiper;
          init2();
          update2(true);
        } else if (thumbsElement) {
          const eventName = `${swiper.params.eventsPrefix}init`;
          const onThumbsSwiper = (e2) => {
            thumbs.swiper = e2.detail[0];
            thumbsElement.removeEventListener(eventName, onThumbsSwiper);
            init2();
            update2(true);
            thumbs.swiper.update();
            swiper.update();
          };
          thumbsElement.addEventListener(eventName, onThumbsSwiper);
        }
        return thumbsElement;
      };
      const watchForThumbsToAppear = () => {
        if (swiper.destroyed) return;
        const thumbsElement = getThumbsElementAndInit();
        if (!thumbsElement) {
          requestAnimationFrame(watchForThumbsToAppear);
        }
      };
      requestAnimationFrame(watchForThumbsToAppear);
    } else {
      init2();
      update2(true);
    }
  });
  on("slideChange update resize observerUpdate", () => {
    update2();
  });
  on("setTransition", (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on("beforeDestroy", () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init: init2,
    update: update2
  });
}
function freeMode({
  swiper,
  extendParams,
  emit,
  once
}) {
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });
  function onTouchStart2() {
    if (swiper.params.cssMode) return;
    const translate2 = swiper.getTranslate();
    swiper.setTranslate(translate2);
    swiper.setTransition(0);
    swiper.touchEventsData.velocities.length = 0;
    swiper.freeMode.onTouchEnd({
      currentPos: swiper.rtl ? swiper.translate : -swiper.translate
    });
  }
  function onTouchMove2() {
    if (swiper.params.cssMode) return;
    const {
      touchEventsData: data,
      touches
    } = swiper;
    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? "startX" : "startY"],
        time: data.touchStartTime
      });
    }
    data.velocities.push({
      position: touches[swiper.isHorizontal() ? "currentX" : "currentY"],
      time: now()
    });
  }
  function onTouchEnd2({
    currentPos
  }) {
    if (swiper.params.cssMode) return;
    const {
      params,
      wrapperEl,
      rtlTranslate: rtl2,
      snapGrid,
      touchEventsData: data
    } = swiper;
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }
      return;
    }
    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;
        if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
          swiper.velocity = 0;
        }
        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }
      swiper.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1e3 * params.freeMode.momentumRatio;
      const momentumDistance = swiper.velocity * momentumDuration;
      let newPosition = swiper.translate + momentumDistance;
      if (rtl2) newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;
      if (newPosition < swiper.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }
          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }
          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;
        for (let j2 = 0; j2 < snapGrid.length; j2 += 1) {
          if (snapGrid[j2] > -newPosition) {
            nextSlide = j2;
            break;
          }
        }
        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === "next") {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }
        newPosition = -newPosition;
      }
      if (needsLoopFix) {
        once("transitionEnd", () => {
          swiper.loopFix();
        });
      }
      if (swiper.velocity !== 0) {
        if (rtl2) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }
        if (params.freeMode.sticky) {
          const moveDistance = Math.abs((rtl2 ? -newPosition : newPosition) - swiper.translate);
          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      }
      if (params.freeMode.momentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        elementTransitionEnd(wrapperEl, () => {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          emit("momentumBounce");
          swiper.setTransition(params.speed);
          setTimeout(() => {
            swiper.setTranslate(afterBouncePosition);
            elementTransitionEnd(wrapperEl, () => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        emit("_freeModeNoMomentumRelease");
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        if (!swiper.animating) {
          swiper.animating = true;
          elementTransitionEnd(wrapperEl, () => {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit("_freeModeNoMomentumRelease");
    }
    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      emit("_freeModeStaticRelease");
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  }
  Object.assign(swiper, {
    freeMode: {
      onTouchStart: onTouchStart2,
      onTouchMove: onTouchMove2,
      onTouchEnd: onTouchEnd2
    }
  });
}
function Grid({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    grid: {
      rows: 1,
      fill: "column"
    }
  });
  let slidesNumberEvenToRows;
  let slidesPerRow;
  let numFullColumns;
  let wasMultiRow;
  const getSpaceBetween = () => {
    let spaceBetween = swiper.params.spaceBetween;
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    return spaceBetween;
  };
  const initSlides = (slides) => {
    const {
      slidesPerView
    } = swiper.params;
    const {
      rows,
      fill
    } = swiper.params.grid;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
    numFullColumns = Math.floor(slidesLength / rows);
    if (Math.floor(slidesLength / rows) === slidesLength / rows) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
    }
    if (slidesPerView !== "auto" && fill === "row") {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
    }
    slidesPerRow = slidesNumberEvenToRows / rows;
  };
  const unsetSlides = () => {
    if (swiper.slides) {
      swiper.slides.forEach((slide2) => {
        if (slide2.swiperSlideGridSet) {
          slide2.style.height = "";
          slide2.style[swiper.getDirectionLabel("margin-top")] = "";
        }
      });
    }
  };
  const updateSlide = (i2, slide2, slides) => {
    const {
      slidesPerGroup
    } = swiper.params;
    const spaceBetween = getSpaceBetween();
    const {
      rows,
      fill
    } = swiper.params.grid;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
    let newSlideOrderIndex;
    let column;
    let row;
    if (fill === "row" && slidesPerGroup > 1) {
      const groupIndex = Math.floor(i2 / (slidesPerGroup * rows));
      const slideIndexInGroup = i2 - rows * slidesPerGroup * groupIndex;
      const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
      row = Math.floor(slideIndexInGroup / columnsInGroup);
      column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
      newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
      slide2.style.order = newSlideOrderIndex;
    } else if (fill === "column") {
      column = Math.floor(i2 / rows);
      row = i2 - column * rows;
      if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
        row += 1;
        if (row >= rows) {
          row = 0;
          column += 1;
        }
      }
    } else {
      row = Math.floor(i2 / slidesPerRow);
      column = i2 - row * slidesPerRow;
    }
    slide2.row = row;
    slide2.column = column;
    slide2.style.height = `calc((100% - ${(rows - 1) * spaceBetween}px) / ${rows})`;
    slide2.style[swiper.getDirectionLabel("margin-top")] = row !== 0 ? spaceBetween && `${spaceBetween}px` : "";
    slide2.swiperSlideGridSet = true;
  };
  const updateWrapperSize = (slideSize, snapGrid) => {
    const {
      centeredSlides,
      roundLengths
    } = swiper.params;
    const spaceBetween = getSpaceBetween();
    const {
      rows
    } = swiper.params.grid;
    swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
    swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (centeredSlides) {
      const newSlidesGrid = [];
      for (let i2 = 0; i2 < snapGrid.length; i2 += 1) {
        let slidesGridItem = snapGrid[i2];
        if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i2] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }
      snapGrid.splice(0, snapGrid.length);
      snapGrid.push(...newSlidesGrid);
    }
  };
  const onInit = () => {
    wasMultiRow = swiper.params.grid && swiper.params.grid.rows > 1;
  };
  const onUpdate = () => {
    const {
      params,
      el
    } = swiper;
    const isMultiRow = params.grid && params.grid.rows > 1;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      numFullColumns = 1;
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (params.grid.fill === "column") {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    wasMultiRow = isMultiRow;
  };
  on("init", onInit);
  on("update", onUpdate);
  swiper.grid = {
    initSlides,
    unsetSlides,
    updateSlide,
    updateWrapperSize
  };
}
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var previousDevice = window.device;
var device = {};
var changeOrientationList = [];
window.device = device;
var documentElement = window.document.documentElement;
var userAgent = window.navigator.userAgent.toLowerCase();
var television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];
device.macos = function() {
  return find("mac");
};
device.ios = function() {
  return device.iphone() || device.ipod() || device.ipad();
};
device.iphone = function() {
  return !device.windows() && find("iphone");
};
device.ipod = function() {
  return find("ipod");
};
device.ipad = function() {
  var iPadOS13Up = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return find("ipad") || iPadOS13Up;
};
device.android = function() {
  return !device.windows() && find("android");
};
device.androidPhone = function() {
  return device.android() && find("mobile");
};
device.androidTablet = function() {
  return device.android() && !find("mobile");
};
device.blackberry = function() {
  return find("blackberry") || find("bb10");
};
device.blackberryPhone = function() {
  return device.blackberry() && !find("tablet");
};
device.blackberryTablet = function() {
  return device.blackberry() && find("tablet");
};
device.windows = function() {
  return find("windows");
};
device.windowsPhone = function() {
  return device.windows() && find("phone");
};
device.windowsTablet = function() {
  return device.windows() && find("touch") && !device.windowsPhone();
};
device.fxos = function() {
  return (find("(mobile") || find("(tablet")) && find(" rv:");
};
device.fxosPhone = function() {
  return device.fxos() && find("mobile");
};
device.fxosTablet = function() {
  return device.fxos() && find("tablet");
};
device.meego = function() {
  return find("meego");
};
device.cordova = function() {
  return window.cordova && location.protocol === "file:";
};
device.nodeWebkit = function() {
  return _typeof(window.process) === "object";
};
device.mobile = function() {
  return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
};
device.tablet = function() {
  return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
};
device.desktop = function() {
  return !device.tablet() && !device.mobile();
};
device.television = function() {
  var i2 = 0;
  while (i2 < television.length) {
    if (find(television[i2])) {
      return true;
    }
    i2++;
  }
  return false;
};
device.portrait = function() {
  if (screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
    return includes(screen.orientation.type, "portrait");
  }
  if (device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation")) {
    return Math.abs(window.orientation) !== 90;
  }
  return window.innerHeight / window.innerWidth > 1;
};
device.landscape = function() {
  if (screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
    return includes(screen.orientation.type, "landscape");
  }
  if (device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation")) {
    return Math.abs(window.orientation) === 90;
  }
  return window.innerHeight / window.innerWidth < 1;
};
device.noConflict = function() {
  window.device = previousDevice;
  return this;
};
function includes(haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}
function find(needle) {
  return includes(userAgent, needle);
}
function hasClass(className) {
  return documentElement.className.match(new RegExp(className, "i"));
}
function addClass(className) {
  var currentClassNames = null;
  if (!hasClass(className)) {
    currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, "");
    documentElement.className = currentClassNames + " " + className;
  }
}
function removeClass(className) {
  if (hasClass(className)) {
    documentElement.className = documentElement.className.replace(" " + className, "");
  }
}
if (device.ios()) {
  if (device.ipad()) {
    addClass("ios ipad tablet");
  } else if (device.iphone()) {
    addClass("ios iphone mobile");
  } else if (device.ipod()) {
    addClass("ios ipod mobile");
  }
} else if (device.macos()) {
  addClass("macos desktop");
} else if (device.android()) {
  if (device.androidTablet()) {
    addClass("android tablet");
  } else {
    addClass("android mobile");
  }
} else if (device.blackberry()) {
  if (device.blackberryTablet()) {
    addClass("blackberry tablet");
  } else {
    addClass("blackberry mobile");
  }
} else if (device.windows()) {
  if (device.windowsTablet()) {
    addClass("windows tablet");
  } else if (device.windowsPhone()) {
    addClass("windows mobile");
  } else {
    addClass("windows desktop");
  }
} else if (device.fxos()) {
  if (device.fxosTablet()) {
    addClass("fxos tablet");
  } else {
    addClass("fxos mobile");
  }
} else if (device.meego()) {
  addClass("meego mobile");
} else if (device.nodeWebkit()) {
  addClass("node-webkit");
} else if (device.television()) {
  addClass("television");
} else if (device.desktop()) {
  addClass("desktop");
}
if (device.cordova()) {
  addClass("cordova");
}
function handleOrientation() {
  if (device.landscape()) {
    removeClass("portrait");
    addClass("landscape");
    walkOnChangeOrientationList("landscape");
  } else {
    removeClass("landscape");
    addClass("portrait");
    walkOnChangeOrientationList("portrait");
  }
  setOrientationCache();
}
function walkOnChangeOrientationList(newOrientation) {
  for (var index = 0; index < changeOrientationList.length; index++) {
    changeOrientationList[index](newOrientation);
  }
}
device.onChangeOrientation = function(cb) {
  if (typeof cb == "function") {
    changeOrientationList.push(cb);
  }
};
var orientationEvent = "resize";
if (Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
  orientationEvent = "orientationchange";
}
if (window.addEventListener) {
  window.addEventListener(orientationEvent, handleOrientation, false);
} else if (window.attachEvent) {
  window.attachEvent(orientationEvent, handleOrientation);
} else {
  window[orientationEvent] = handleOrientation;
}
handleOrientation();
function findMatch(arr) {
  for (var i2 = 0; i2 < arr.length; i2++) {
    if (device[arr[i2]]()) {
      return arr[i2];
    }
  }
  return "unknown";
}
device.type = findMatch(["mobile", "tablet", "desktop"]);
device.os = findMatch(["ios", "iphone", "ipad", "ipod", "android", "blackberry", "macos", "windows", "fxos", "meego", "television"]);
function setOrientationCache() {
  device.orientation = findMatch(["portrait", "landscape"]);
}
setOrientationCache();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jquery$1 = { exports: {} };
var jquery = jquery$1.exports;
var hasRequiredJquery;
function requireJquery() {
  if (hasRequiredJquery) return jquery$1.exports;
  hasRequiredJquery = 1;
  (function(module) {
    (function(global, factory) {
      {
        module.exports = global.document ? factory(global, true) : function(w2) {
          if (!w2.document) {
            throw new Error("jQuery requires a window with a document");
          }
          return factory(w2);
        };
      }
    })(typeof window !== "undefined" ? window : jquery, function(window2, noGlobal) {
      var arr = [];
      var getProto = Object.getPrototypeOf;
      var slice = arr.slice;
      var flat = arr.flat ? function(array) {
        return arr.flat.call(array);
      } : function(array) {
        return arr.concat.apply([], array);
      };
      var push = arr.push;
      var indexOf = arr.indexOf;
      var class2type = {};
      var toString = class2type.toString;
      var hasOwn = class2type.hasOwnProperty;
      var fnToString = hasOwn.toString;
      var ObjectFunctionString = fnToString.call(Object);
      var support2 = {};
      var isFunction = function isFunction2(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
      };
      var isWindow = function isWindow2(obj) {
        return obj != null && obj === obj.window;
      };
      var document2 = window2.document;
      var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
      };
      function DOMEval(code, node, doc) {
        doc = doc || document2;
        var i2, val, script = doc.createElement("script");
        script.text = code;
        if (node) {
          for (i2 in preservedScriptAttributes) {
            val = node[i2] || node.getAttribute && node.getAttribute(i2);
            if (val) {
              script.setAttribute(i2, val);
            }
          }
        }
        doc.head.appendChild(script).parentNode.removeChild(script);
      }
      function toType(obj) {
        if (obj == null) {
          return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
      }
      var version = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
      };
      jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
          if (num == null) {
            return slice.call(this);
          }
          return num < 0 ? this[num + this.length] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
          var ret = jQuery.merge(this.constructor(), elems);
          ret.prevObject = this;
          return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function(callback) {
          return jQuery.each(this, callback);
        },
        map: function(callback) {
          return this.pushStack(jQuery.map(this, function(elem, i2) {
            return callback.call(elem, i2, elem);
          }));
        },
        slice: function() {
          return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i2) {
            return (i2 + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i2) {
            return i2 % 2;
          }));
        },
        eq: function(i2) {
          var len = this.length, j2 = +i2 + (i2 < 0 ? len : 0);
          return this.pushStack(j2 >= 0 && j2 < len ? [this[j2]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push,
        sort: arr.sort,
        splice: arr.splice
      };
      jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i2 = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[i2] || {};
          i2++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
          target = {};
        }
        if (i2 === length) {
          target = this;
          i2--;
        }
        for (; i2 < length; i2++) {
          if ((options = arguments[i2]) != null) {
            for (name in options) {
              copy = options[name];
              if (name === "__proto__" || target === copy) {
                continue;
              }
              if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                src = target[name];
                if (copyIsArray && !Array.isArray(src)) {
                  clone = [];
                } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                  clone = {};
                } else {
                  clone = src;
                }
                copyIsArray = false;
                target[name] = jQuery.extend(deep, clone, copy);
              } else if (copy !== void 0) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      };
      jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function(msg) {
          throw new Error(msg);
        },
        noop: function() {
        },
        isPlainObject: function(obj) {
          var proto, Ctor;
          if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
          }
          proto = getProto(obj);
          if (!proto) {
            return true;
          }
          Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
          return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        isEmptyObject: function(obj) {
          var name;
          for (name in obj) {
            return false;
          }
          return true;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(code, options, doc) {
          DOMEval(code, { nonce: options && options.nonce }, doc);
        },
        each: function(obj, callback) {
          var length, i2 = 0;
          if (isArrayLike(obj)) {
            length = obj.length;
            for (; i2 < length; i2++) {
              if (callback.call(obj[i2], i2, obj[i2]) === false) {
                break;
              }
            }
          } else {
            for (i2 in obj) {
              if (callback.call(obj[i2], i2, obj[i2]) === false) {
                break;
              }
            }
          }
          return obj;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(elem) {
          var node, ret = "", i2 = 0, nodeType = elem.nodeType;
          if (!nodeType) {
            while (node = elem[i2++]) {
              ret += jQuery.text(node);
            }
          }
          if (nodeType === 1 || nodeType === 11) {
            return elem.textContent;
          }
          if (nodeType === 9) {
            return elem.documentElement.textContent;
          }
          if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
          }
          return ret;
        },
        // results is for internal usage only
        makeArray: function(arr2, results) {
          var ret = results || [];
          if (arr2 != null) {
            if (isArrayLike(Object(arr2))) {
              jQuery.merge(
                ret,
                typeof arr2 === "string" ? [arr2] : arr2
              );
            } else {
              push.call(ret, arr2);
            }
          }
          return ret;
        },
        inArray: function(elem, arr2, i2) {
          return arr2 == null ? -1 : indexOf.call(arr2, elem, i2);
        },
        isXMLDoc: function(elem) {
          var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
          return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(first, second) {
          var len = +second.length, j2 = 0, i2 = first.length;
          for (; j2 < len; j2++) {
            first[i2++] = second[j2];
          }
          first.length = i2;
          return first;
        },
        grep: function(elems, callback, invert) {
          var callbackInverse, matches = [], i2 = 0, length = elems.length, callbackExpect = !invert;
          for (; i2 < length; i2++) {
            callbackInverse = !callback(elems[i2], i2);
            if (callbackInverse !== callbackExpect) {
              matches.push(elems[i2]);
            }
          }
          return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
          var length, value, i2 = 0, ret = [];
          if (isArrayLike(elems)) {
            length = elems.length;
            for (; i2 < length; i2++) {
              value = callback(elems[i2], i2, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          } else {
            for (i2 in elems) {
              value = callback(elems[i2], i2, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          }
          return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support2
      });
      if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
      }
      jQuery.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(_i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        }
      );
      function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length, type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
          return false;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
      }
      function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
      }
      var pop = arr.pop;
      var sort = arr.sort;
      var splice = arr.splice;
      var whitespace = "[\\x20\\t\\r\\n\\f]";
      var rtrimCSS = new RegExp(
        "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
        "g"
      );
      jQuery.contains = function(a2, b2) {
        var bup = b2 && b2.parentNode;
        return a2 === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (a2.contains ? a2.contains(bup) : a2.compareDocumentPosition && a2.compareDocumentPosition(bup) & 16));
      };
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function fcssescape(ch, asCodePoint) {
        if (asCodePoint) {
          if (ch === "\0") {
            return "�";
          }
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        return "\\" + ch;
      }
      jQuery.escapeSelector = function(sel) {
        return (sel + "").replace(rcssescape, fcssescape);
      };
      var preferredDoc = document2, pushNative = push;
      (function() {
        var i2, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement3, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a2, b2) {
          if (a2 === b2) {
            hasDuplicate = true;
          }
          return 0;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
          ID: new RegExp("^#(" + identifier + ")"),
          CLASS: new RegExp("^\\.(" + identifier + ")"),
          TAG: new RegExp("^(" + identifier + "|[*])"),
          ATTR: new RegExp("^" + attributes),
          PSEUDO: new RegExp("^" + pseudos),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + booleans + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
          var high = "0x" + escape.slice(1) - 65536;
          if (nonHex) {
            return nonHex;
          }
          return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        }, unloadHandler = function() {
          setDocument();
        }, inDisabledFieldset = addCombinator(
          function(elem) {
            return elem.disabled === true && nodeName(elem, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function safeActiveElement() {
          try {
            return document3.activeElement;
          } catch (err) {
          }
        }
        try {
          push2.apply(
            arr = slice.call(preferredDoc.childNodes),
            preferredDoc.childNodes
          );
          arr[preferredDoc.childNodes.length].nodeType;
        } catch (e2) {
          push2 = {
            apply: function(target, els) {
              pushNative.apply(target, slice.call(els));
            },
            call: function(target) {
              pushNative.apply(target, slice.call(arguments, 1));
            }
          };
        }
        function find2(selector, context, results, seed) {
          var m2, i3, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
          results = results || [];
          if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
            return results;
          }
          if (!seed) {
            setDocument(context);
            context = context || document3;
            if (documentIsHTML) {
              if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                if (m2 = match[1]) {
                  if (nodeType === 9) {
                    if (elem = context.getElementById(m2)) {
                      if (elem.id === m2) {
                        push2.call(results, elem);
                        return results;
                      }
                    } else {
                      return results;
                    }
                  } else {
                    if (newContext && (elem = newContext.getElementById(m2)) && find2.contains(context, elem) && elem.id === m2) {
                      push2.call(results, elem);
                      return results;
                    }
                  }
                } else if (match[2]) {
                  push2.apply(results, context.getElementsByTagName(selector));
                  return results;
                } else if ((m2 = match[3]) && context.getElementsByClassName) {
                  push2.apply(results, context.getElementsByClassName(m2));
                  return results;
                }
              }
              if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                newSelector = selector;
                newContext = context;
                if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                  newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                  if (newContext != context || !support2.scope) {
                    if (nid = context.getAttribute("id")) {
                      nid = jQuery.escapeSelector(nid);
                    } else {
                      context.setAttribute("id", nid = expando);
                    }
                  }
                  groups = tokenize(selector);
                  i3 = groups.length;
                  while (i3--) {
                    groups[i3] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i3]);
                  }
                  newSelector = groups.join(",");
                }
                try {
                  push2.apply(
                    results,
                    newContext.querySelectorAll(newSelector)
                  );
                  return results;
                } catch (qsaError) {
                  nonnativeSelectorCache(selector, true);
                } finally {
                  if (nid === expando) {
                    context.removeAttribute("id");
                  }
                }
              }
            }
          }
          return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
        }
        function createCache() {
          var keys = [];
          function cache(key, value) {
            if (keys.push(key + " ") > Expr.cacheLength) {
              delete cache[keys.shift()];
            }
            return cache[key + " "] = value;
          }
          return cache;
        }
        function markFunction(fn) {
          fn[expando] = true;
          return fn;
        }
        function assert(fn) {
          var el = document3.createElement("fieldset");
          try {
            return !!fn(el);
          } catch (e2) {
            return false;
          } finally {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
            el = null;
          }
        }
        function createInputPseudo(type) {
          return function(elem) {
            return nodeName(elem, "input") && elem.type === type;
          };
        }
        function createButtonPseudo(type) {
          return function(elem) {
            return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
          };
        }
        function createDisabledPseudo(disabled) {
          return function(elem) {
            if ("form" in elem) {
              if (elem.parentNode && elem.disabled === false) {
                if ("label" in elem) {
                  if ("label" in elem.parentNode) {
                    return elem.parentNode.disabled === disabled;
                  } else {
                    return elem.disabled === disabled;
                  }
                }
                return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
              }
              return elem.disabled === disabled;
            } else if ("label" in elem) {
              return elem.disabled === disabled;
            }
            return false;
          };
        }
        function createPositionalPseudo(fn) {
          return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches2) {
              var j2, matchIndexes = fn([], seed.length, argument), i3 = matchIndexes.length;
              while (i3--) {
                if (seed[j2 = matchIndexes[i3]]) {
                  seed[j2] = !(matches2[j2] = seed[j2]);
                }
              }
            });
          });
        }
        function testContext(context) {
          return context && typeof context.getElementsByTagName !== "undefined" && context;
        }
        function setDocument(node) {
          var subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
          if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
            return document3;
          }
          document3 = doc;
          documentElement3 = document3.documentElement;
          documentIsHTML = !jQuery.isXMLDoc(document3);
          matches = documentElement3.matches || documentElement3.webkitMatchesSelector || documentElement3.msMatchesSelector;
          if (documentElement3.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
            subWindow.addEventListener("unload", unloadHandler);
          }
          support2.getById = assert(function(el) {
            documentElement3.appendChild(el).id = jQuery.expando;
            return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
          });
          support2.disconnectedMatch = assert(function(el) {
            return matches.call(el, "*");
          });
          support2.scope = assert(function() {
            return document3.querySelectorAll(":scope");
          });
          support2.cssHas = assert(function() {
            try {
              document3.querySelector(":has(*,:jqfake)");
              return false;
            } catch (e2) {
              return true;
            }
          });
          if (support2.getById) {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                return elem.getAttribute("id") === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var elem = context.getElementById(id);
                return elem ? [elem] : [];
              }
            };
          } else {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return node2 && node2.value === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var node2, i3, elems, elem = context.getElementById(id);
                if (elem) {
                  node2 = elem.getAttributeNode("id");
                  if (node2 && node2.value === id) {
                    return [elem];
                  }
                  elems = context.getElementsByName(id);
                  i3 = 0;
                  while (elem = elems[i3++]) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                  }
                }
                return [];
              }
            };
          }
          Expr.find.TAG = function(tag, context) {
            if (typeof context.getElementsByTagName !== "undefined") {
              return context.getElementsByTagName(tag);
            } else {
              return context.querySelectorAll(tag);
            }
          };
          Expr.find.CLASS = function(className, context) {
            if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
              return context.getElementsByClassName(className);
            }
          };
          rbuggyQSA = [];
          assert(function(el) {
            var input;
            documentElement3.appendChild(el).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
            if (!el.querySelectorAll("[selected]").length) {
              rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
            }
            if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
              rbuggyQSA.push("~=");
            }
            if (!el.querySelectorAll("a#" + expando + "+*").length) {
              rbuggyQSA.push(".#.+[+~]");
            }
            if (!el.querySelectorAll(":checked").length) {
              rbuggyQSA.push(":checked");
            }
            input = document3.createElement("input");
            input.setAttribute("type", "hidden");
            el.appendChild(input).setAttribute("name", "D");
            documentElement3.appendChild(el).disabled = true;
            if (el.querySelectorAll(":disabled").length !== 2) {
              rbuggyQSA.push(":enabled", ":disabled");
            }
            input = document3.createElement("input");
            input.setAttribute("name", "");
            el.appendChild(input);
            if (!el.querySelectorAll("[name='']").length) {
              rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
            }
          });
          if (!support2.cssHas) {
            rbuggyQSA.push(":has");
          }
          rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
          sortOrder = function(a2, b2) {
            if (a2 === b2) {
              hasDuplicate = true;
              return 0;
            }
            var compare = !a2.compareDocumentPosition - !b2.compareDocumentPosition;
            if (compare) {
              return compare;
            }
            compare = (a2.ownerDocument || a2) == (b2.ownerDocument || b2) ? a2.compareDocumentPosition(b2) : (
              // Otherwise we know they are disconnected
              1
            );
            if (compare & 1 || !support2.sortDetached && b2.compareDocumentPosition(a2) === compare) {
              if (a2 === document3 || a2.ownerDocument == preferredDoc && find2.contains(preferredDoc, a2)) {
                return -1;
              }
              if (b2 === document3 || b2.ownerDocument == preferredDoc && find2.contains(preferredDoc, b2)) {
                return 1;
              }
              return sortInput ? indexOf.call(sortInput, a2) - indexOf.call(sortInput, b2) : 0;
            }
            return compare & 4 ? -1 : 1;
          };
          return document3;
        }
        find2.matches = function(expr, elements) {
          return find2(expr, null, null, elements);
        };
        find2.matchesSelector = function(elem, expr) {
          setDocument(elem);
          if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
            try {
              var ret = matches.call(elem, expr);
              if (ret || support2.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              elem.document && elem.document.nodeType !== 11) {
                return ret;
              }
            } catch (e2) {
              nonnativeSelectorCache(expr, true);
            }
          }
          return find2(expr, document3, null, [elem]).length > 0;
        };
        find2.contains = function(context, elem) {
          if ((context.ownerDocument || context) != document3) {
            setDocument(context);
          }
          return jQuery.contains(context, elem);
        };
        find2.attr = function(elem, name) {
          if ((elem.ownerDocument || elem) != document3) {
            setDocument(elem);
          }
          var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
          if (val !== void 0) {
            return val;
          }
          return elem.getAttribute(name);
        };
        find2.error = function(msg) {
          throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        jQuery.uniqueSort = function(results) {
          var elem, duplicates = [], j2 = 0, i3 = 0;
          hasDuplicate = !support2.sortStable;
          sortInput = !support2.sortStable && slice.call(results, 0);
          sort.call(results, sortOrder);
          if (hasDuplicate) {
            while (elem = results[i3++]) {
              if (elem === results[i3]) {
                j2 = duplicates.push(i3);
              }
            }
            while (j2--) {
              splice.call(results, duplicates[j2], 1);
            }
          }
          sortInput = null;
          return results;
        };
        jQuery.fn.uniqueSort = function() {
          return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
        };
        Expr = jQuery.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: markFunction,
          match: matchExpr,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(match) {
              match[1] = match[1].replace(runescape, funescape);
              match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
              if (match[2] === "~=") {
                match[3] = " " + match[3] + " ";
              }
              return match.slice(0, 4);
            },
            CHILD: function(match) {
              match[1] = match[1].toLowerCase();
              if (match[1].slice(0, 3) === "nth") {
                if (!match[3]) {
                  find2.error(match[0]);
                }
                match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                match[5] = +(match[7] + match[8] || match[3] === "odd");
              } else if (match[3]) {
                find2.error(match[0]);
              }
              return match;
            },
            PSEUDO: function(match) {
              var excess, unquoted = !match[6] && match[2];
              if (matchExpr.CHILD.test(match[0])) {
                return null;
              }
              if (match[3]) {
                match[2] = match[4] || match[5] || "";
              } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
              (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
              (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                match[0] = match[0].slice(0, excess);
                match[2] = unquoted.slice(0, excess);
              }
              return match.slice(0, 3);
            }
          },
          filter: {
            TAG: function(nodeNameSelector) {
              var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
              return nodeNameSelector === "*" ? function() {
                return true;
              } : function(elem) {
                return nodeName(elem, expectedNodeName);
              };
            },
            CLASS: function(className) {
              var pattern = classCache[className + " "];
              return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                return pattern.test(
                  typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(name, operator, check) {
              return function(elem) {
                var result = find2.attr(elem, name);
                if (result == null) {
                  return operator === "!=";
                }
                if (!operator) {
                  return true;
                }
                result += "";
                if (operator === "=") {
                  return result === check;
                }
                if (operator === "!=") {
                  return result !== check;
                }
                if (operator === "^=") {
                  return check && result.indexOf(check) === 0;
                }
                if (operator === "*=") {
                  return check && result.indexOf(check) > -1;
                }
                if (operator === "$=") {
                  return check && result.slice(-check.length) === check;
                }
                if (operator === "~=") {
                  return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                }
                if (operator === "|=") {
                  return result === check || result.slice(0, check.length + 1) === check + "-";
                }
                return false;
              };
            },
            CHILD: function(type, what, _argument, first, last) {
              var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
              return first === 1 && last === 0 ? (
                // Shortcut for :nth-*(n)
                function(elem) {
                  return !!elem.parentNode;
                }
              ) : function(elem, _context, xml) {
                var cache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                if (parent) {
                  if (simple) {
                    while (dir2) {
                      node = elem;
                      while (node = node[dir2]) {
                        if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                          return false;
                        }
                      }
                      start = dir2 = type === "only" && !start && "nextSibling";
                    }
                    return true;
                  }
                  start = [forward ? parent.firstChild : parent.lastChild];
                  if (forward && useCache) {
                    outerCache = parent[expando] || (parent[expando] = {});
                    cache = outerCache[type] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff = nodeIndex && cache[2];
                    node = nodeIndex && parent.childNodes[nodeIndex];
                    while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                    (diff = nodeIndex = 0) || start.pop()) {
                      if (node.nodeType === 1 && ++diff && node === elem) {
                        outerCache[type] = [dirruns, nodeIndex, diff];
                        break;
                      }
                    }
                  } else {
                    if (useCache) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      cache = outerCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex;
                    }
                    if (diff === false) {
                      while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                        if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                          if (useCache) {
                            outerCache = node[expando] || (node[expando] = {});
                            outerCache[type] = [dirruns, diff];
                          }
                          if (node === elem) {
                            break;
                          }
                        }
                      }
                    }
                  }
                  diff -= last;
                  return diff === first || diff % first === 0 && diff / first >= 0;
                }
              };
            },
            PSEUDO: function(pseudo, argument) {
              var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find2.error("unsupported pseudo: " + pseudo);
              if (fn[expando]) {
                return fn(argument);
              }
              if (fn.length > 1) {
                args = [pseudo, pseudo, "", argument];
                return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                  var idx, matched = fn(seed, argument), i3 = matched.length;
                  while (i3--) {
                    idx = indexOf.call(seed, matched[i3]);
                    seed[idx] = !(matches2[idx] = matched[i3]);
                  }
                }) : function(elem) {
                  return fn(elem, 0, args);
                };
              }
              return fn;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: markFunction(function(selector) {
              var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
              return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                var elem, unmatched = matcher(seed, null, xml, []), i3 = seed.length;
                while (i3--) {
                  if (elem = unmatched[i3]) {
                    seed[i3] = !(matches2[i3] = elem);
                  }
                }
              }) : function(elem, _context, xml) {
                input[0] = elem;
                matcher(input, null, xml, results);
                input[0] = null;
                return !results.pop();
              };
            }),
            has: markFunction(function(selector) {
              return function(elem) {
                return find2(selector, elem).length > 0;
              };
            }),
            contains: markFunction(function(text) {
              text = text.replace(runescape, funescape);
              return function(elem) {
                return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: markFunction(function(lang) {
              if (!ridentifier.test(lang || "")) {
                find2.error("unsupported lang: " + lang);
              }
              lang = lang.replace(runescape, funescape).toLowerCase();
              return function(elem) {
                var elemLang;
                do {
                  if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                    elemLang = elemLang.toLowerCase();
                    return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                  }
                } while ((elem = elem.parentNode) && elem.nodeType === 1);
                return false;
              };
            }),
            // Miscellaneous
            target: function(elem) {
              var hash = window2.location && window2.location.hash;
              return hash && hash.slice(1) === elem.id;
            },
            root: function(elem) {
              return elem === documentElement3;
            },
            focus: function(elem) {
              return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
            },
            // Boolean properties
            enabled: createDisabledPseudo(false),
            disabled: createDisabledPseudo(true),
            checked: function(elem) {
              return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
            },
            selected: function(elem) {
              if (elem.parentNode) {
                elem.parentNode.selectedIndex;
              }
              return elem.selected === true;
            },
            // Contents
            empty: function(elem) {
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                if (elem.nodeType < 6) {
                  return false;
                }
              }
              return true;
            },
            parent: function(elem) {
              return !Expr.pseudos.empty(elem);
            },
            // Element/input types
            header: function(elem) {
              return rheader.test(elem.nodeName);
            },
            input: function(elem) {
              return rinputs.test(elem.nodeName);
            },
            button: function(elem) {
              return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
            },
            text: function(elem) {
              var attr;
              return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
            },
            // Position-in-collection
            first: createPositionalPseudo(function() {
              return [0];
            }),
            last: createPositionalPseudo(function(_matchIndexes, length) {
              return [length - 1];
            }),
            eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
              return [argument < 0 ? argument + length : argument];
            }),
            even: createPositionalPseudo(function(matchIndexes, length) {
              var i3 = 0;
              for (; i3 < length; i3 += 2) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            }),
            odd: createPositionalPseudo(function(matchIndexes, length) {
              var i3 = 1;
              for (; i3 < length; i3 += 2) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            }),
            lt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i3;
              if (argument < 0) {
                i3 = argument + length;
              } else if (argument > length) {
                i3 = length;
              } else {
                i3 = argument;
              }
              for (; --i3 >= 0; ) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            }),
            gt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i3 = argument < 0 ? argument + length : argument;
              for (; ++i3 < length; ) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            })
          }
        };
        Expr.pseudos.nth = Expr.pseudos.eq;
        for (i2 in { radio: true, checkbox: true, file: true, password: true, image: true }) {
          Expr.pseudos[i2] = createInputPseudo(i2);
        }
        for (i2 in { submit: true, reset: true }) {
          Expr.pseudos[i2] = createButtonPseudo(i2);
        }
        function setFilters() {
        }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        function tokenize(selector, parseOnly) {
          var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
          if (cached) {
            return parseOnly ? 0 : cached.slice(0);
          }
          soFar = selector;
          groups = [];
          preFilters = Expr.preFilter;
          while (soFar) {
            if (!matched || (match = rcomma.exec(soFar))) {
              if (match) {
                soFar = soFar.slice(match[0].length) || soFar;
              }
              groups.push(tokens = []);
            }
            matched = false;
            if (match = rleadingCombinator.exec(soFar)) {
              matched = match.shift();
              tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace(rtrimCSS, " ")
              });
              soFar = soFar.slice(matched.length);
            }
            for (type in Expr.filter) {
              if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  type,
                  matches: match
                });
                soFar = soFar.slice(matched.length);
              }
            }
            if (!matched) {
              break;
            }
          }
          if (parseOnly) {
            return soFar.length;
          }
          return soFar ? find2.error(selector) : (
            // Cache the tokens
            tokenCache(selector, groups).slice(0)
          );
        }
        function toSelector(tokens) {
          var i3 = 0, len = tokens.length, selector = "";
          for (; i3 < len; i3++) {
            selector += tokens[i3].value;
          }
          return selector;
        }
        function addCombinator(matcher, combinator, base2) {
          var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base2 && key === "parentNode", doneName = done++;
          return combinator.first ? (
            // Check against closest ancestor/preceding element
            function(elem, context, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context, xml);
                }
              }
              return false;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(elem, context, xml) {
              var oldCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if (skip && nodeName(elem, skip)) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      outerCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            }
          );
        }
        function elementMatcher(matchers) {
          return matchers.length > 1 ? function(elem, context, xml) {
            var i3 = matchers.length;
            while (i3--) {
              if (!matchers[i3](elem, context, xml)) {
                return false;
              }
            }
            return true;
          } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
          var i3 = 0, len = contexts.length;
          for (; i3 < len; i3++) {
            find2(selector, contexts[i3], results);
          }
          return results;
        }
        function condense(unmatched, map, filter, context, xml) {
          var elem, newUnmatched = [], i3 = 0, len = unmatched.length, mapped = map != null;
          for (; i3 < len; i3++) {
            if (elem = unmatched[i3]) {
              if (!filter || filter(elem, context, xml)) {
                newUnmatched.push(elem);
                if (mapped) {
                  map.push(i3);
                }
              }
            }
          }
          return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
          if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
          }
          if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
          }
          return markFunction(function(seed, results, context, xml) {
            var temp, i3, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
              selector || "*",
              context.nodeType ? [context] : context,
              []
            ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
            if (matcher) {
              matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                results
              );
              matcher(matcherIn, matcherOut, context, xml);
            } else {
              matcherOut = matcherIn;
            }
            if (postFilter) {
              temp = condense(matcherOut, postMap);
              postFilter(temp, [], context, xml);
              i3 = temp.length;
              while (i3--) {
                if (elem = temp[i3]) {
                  matcherOut[postMap[i3]] = !(matcherIn[postMap[i3]] = elem);
                }
              }
            }
            if (seed) {
              if (postFinder || preFilter) {
                if (postFinder) {
                  temp = [];
                  i3 = matcherOut.length;
                  while (i3--) {
                    if (elem = matcherOut[i3]) {
                      temp.push(matcherIn[i3] = elem);
                    }
                  }
                  postFinder(null, matcherOut = [], temp, xml);
                }
                i3 = matcherOut.length;
                while (i3--) {
                  if ((elem = matcherOut[i3]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i3]) > -1) {
                    seed[temp] = !(results[temp] = elem);
                  }
                }
              }
            } else {
              matcherOut = condense(
                matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
              );
              if (postFinder) {
                postFinder(null, results, matcherOut, xml);
              } else {
                push2.apply(results, matcherOut);
              }
            }
          });
        }
        function matcherFromTokens(tokens) {
          var checkContext, matcher, j2, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i3 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
            return indexOf.call(checkContext, elem) > -1;
          }, implicitRelative, true), matchers = [function(elem, context, xml) {
            var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          }];
          for (; i3 < len; i3++) {
            if (matcher = Expr.relative[tokens[i3].type]) {
              matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
              matcher = Expr.filter[tokens[i3].type].apply(null, tokens[i3].matches);
              if (matcher[expando]) {
                j2 = ++i3;
                for (; j2 < len; j2++) {
                  if (Expr.relative[tokens[j2].type]) {
                    break;
                  }
                }
                return setMatcher(
                  i3 > 1 && elementMatcher(matchers),
                  i3 > 1 && toSelector(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    tokens.slice(0, i3 - 1).concat({ value: tokens[i3 - 2].type === " " ? "*" : "" })
                  ).replace(rtrimCSS, "$1"),
                  matcher,
                  i3 < j2 && matcherFromTokens(tokens.slice(i3, j2)),
                  j2 < len && matcherFromTokens(tokens = tokens.slice(j2)),
                  j2 < len && toSelector(tokens)
                );
              }
              matchers.push(matcher);
            }
          }
          return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
          var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
            var elem, j2, matcher, matchedCount = 0, i3 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
            if (outermost) {
              outermostContext = context == document3 || context || outermost;
            }
            for (; i3 !== len && (elem = elems[i3]) != null; i3++) {
              if (byElement && elem) {
                j2 = 0;
                if (!context && elem.ownerDocument != document3) {
                  setDocument(elem);
                  xml = !documentIsHTML;
                }
                while (matcher = elementMatchers[j2++]) {
                  if (matcher(elem, context || document3, xml)) {
                    push2.call(results, elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if (elem = !matcher && elem) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i3;
            if (bySet && i3 !== matchedCount) {
              j2 = 0;
              while (matcher = setMatchers[j2++]) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i3--) {
                    if (!(unmatched[i3] || setMatched[i3])) {
                      setMatched[i3] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push2.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                jQuery.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
          return bySet ? markFunction(superMatcher) : superMatcher;
        }
        function compile(selector, match) {
          var i3, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
          if (!cached) {
            if (!match) {
              match = tokenize(selector);
            }
            i3 = match.length;
            while (i3--) {
              cached = matcherFromTokens(match[i3]);
              if (cached[expando]) {
                setMatchers.push(cached);
              } else {
                elementMatchers.push(cached);
              }
            }
            cached = compilerCache(
              selector,
              matcherFromGroupMatchers(elementMatchers, setMatchers)
            );
            cached.selector = selector;
          }
          return cached;
        }
        function select(selector, context, results, seed) {
          var i3, tokens, token, type, find3, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
          results = results || [];
          if (match.length === 1) {
            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
              context = (Expr.find.ID(
                token.matches[0].replace(runescape, funescape),
                context
              ) || [])[0];
              if (!context) {
                return results;
              } else if (compiled) {
                context = context.parentNode;
              }
              selector = selector.slice(tokens.shift().value.length);
            }
            i3 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
            while (i3--) {
              token = tokens[i3];
              if (Expr.relative[type = token.type]) {
                break;
              }
              if (find3 = Expr.find[type]) {
                if (seed = find3(
                  token.matches[0].replace(runescape, funescape),
                  rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                )) {
                  tokens.splice(i3, 1);
                  selector = seed.length && toSelector(tokens);
                  if (!selector) {
                    push2.apply(results, seed);
                    return results;
                  }
                  break;
                }
              }
            }
          }
          (compiled || compile(selector, match))(
            seed,
            context,
            !documentIsHTML,
            results,
            !context || rsibling.test(selector) && testContext(context.parentNode) || context
          );
          return results;
        }
        support2.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        setDocument();
        support2.sortDetached = assert(function(el) {
          return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
        });
        jQuery.find = find2;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = jQuery.uniqueSort;
        find2.compile = compile;
        find2.select = select;
        find2.setDocument = setDocument;
        find2.tokenize = tokenize;
        find2.escape = jQuery.escapeSelector;
        find2.getText = jQuery.text;
        find2.isXML = jQuery.isXMLDoc;
        find2.selectors = jQuery.expr;
        find2.support = jQuery.support;
        find2.uniqueSort = jQuery.uniqueSort;
      })();
      var dir = function(elem, dir2, until) {
        var matched = [], truncate = until !== void 0;
        while ((elem = elem[dir2]) && elem.nodeType !== 9) {
          if (elem.nodeType === 1) {
            if (truncate && jQuery(elem).is(until)) {
              break;
            }
            matched.push(elem);
          }
        }
        return matched;
      };
      var siblings = function(n2, elem) {
        var matched = [];
        for (; n2; n2 = n2.nextSibling) {
          if (n2.nodeType === 1 && n2 !== elem) {
            matched.push(n2);
          }
        }
        return matched;
      };
      var rneedsContext = jQuery.expr.match.needsContext;
      var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function winnow(elements, qualifier, not) {
        if (isFunction(qualifier)) {
          return jQuery.grep(elements, function(elem, i2) {
            return !!qualifier.call(elem, i2, elem) !== not;
          });
        }
        if (qualifier.nodeType) {
          return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
          });
        }
        if (typeof qualifier !== "string") {
          return jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
          });
        }
        return jQuery.filter(qualifier, elements, not);
      }
      jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        if (not) {
          expr = ":not(" + expr + ")";
        }
        if (elems.length === 1 && elem.nodeType === 1) {
          return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
        }
        return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
          return elem2.nodeType === 1;
        }));
      };
      jQuery.fn.extend({
        find: function(selector) {
          var i2, ret, len = this.length, self = this;
          if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function() {
              for (i2 = 0; i2 < len; i2++) {
                if (jQuery.contains(self[i2], this)) {
                  return true;
                }
              }
            }));
          }
          ret = this.pushStack([]);
          for (i2 = 0; i2 < len; i2++) {
            jQuery.find(selector, self[i2], ret);
          }
          return len > 1 ? jQuery.uniqueSort(ret) : ret;
        },
        filter: function(selector) {
          return this.pushStack(winnow(this, selector || [], false));
        },
        not: function(selector) {
          return this.pushStack(winnow(this, selector || [], true));
        },
        is: function(selector) {
          return !!winnow(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
            false
          ).length;
        }
      });
      var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init2 = jQuery.fn.init = function(selector, context, root) {
        var match, elem;
        if (!selector) {
          return this;
        }
        root = root || rootjQuery;
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match = [null, selector, null];
          } else {
            match = rquickExpr.exec(selector);
          }
          if (match && (match[1] || !context)) {
            if (match[1]) {
              context = context instanceof jQuery ? context[0] : context;
              jQuery.merge(this, jQuery.parseHTML(
                match[1],
                context && context.nodeType ? context.ownerDocument || context : document2,
                true
              ));
              if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                for (match in context) {
                  if (isFunction(this[match])) {
                    this[match](context[match]);
                  } else {
                    this.attr(match, context[match]);
                  }
                }
              }
              return this;
            } else {
              elem = document2.getElementById(match[2]);
              if (elem) {
                this[0] = elem;
                this.length = 1;
              }
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || root).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
          return this;
        } else if (isFunction(selector)) {
          return root.ready !== void 0 ? root.ready(selector) : (
            // Execute immediately if ready is not present
            selector(jQuery)
          );
        }
        return jQuery.makeArray(selector, this);
      };
      init2.prototype = jQuery.fn;
      rootjQuery = jQuery(document2);
      var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
      jQuery.fn.extend({
        has: function(target) {
          var targets = jQuery(target, this), l2 = targets.length;
          return this.filter(function() {
            var i2 = 0;
            for (; i2 < l2; i2++) {
              if (jQuery.contains(this, targets[i2])) {
                return true;
              }
            }
          });
        },
        closest: function(selectors, context) {
          var cur, i2 = 0, l2 = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
          if (!rneedsContext.test(selectors)) {
            for (; i2 < l2; i2++) {
              for (cur = this[i2]; cur && cur !== context; cur = cur.parentNode) {
                if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                ))) {
                  matched.push(cur);
                  break;
                }
              }
            }
          }
          return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },
        // Determine the position of an element within the set
        index: function(elem) {
          if (!elem) {
            return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
          }
          if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
          }
          return indexOf.call(
            this,
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
          );
        },
        add: function(selector, context) {
          return this.pushStack(
            jQuery.uniqueSort(
              jQuery.merge(this.get(), jQuery(selector, context))
            )
          );
        },
        addBack: function(selector) {
          return this.add(
            selector == null ? this.prevObject : this.prevObject.filter(selector)
          );
        }
      });
      function sibling(cur, dir2) {
        while ((cur = cur[dir2]) && cur.nodeType !== 1) {
        }
        return cur;
      }
      jQuery.each({
        parent: function(elem) {
          var parent = elem.parentNode;
          return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
          return dir(elem, "parentNode");
        },
        parentsUntil: function(elem, _i, until) {
          return dir(elem, "parentNode", until);
        },
        next: function(elem) {
          return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
          return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
          return dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
          return dir(elem, "previousSibling");
        },
        nextUntil: function(elem, _i, until) {
          return dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, _i, until) {
          return dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
          return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
          return siblings(elem.firstChild);
        },
        contents: function(elem) {
          if (elem.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          getProto(elem.contentDocument)) {
            return elem.contentDocument;
          }
          if (nodeName(elem, "template")) {
            elem = elem.content || elem;
          }
          return jQuery.merge([], elem.childNodes);
        }
      }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
          var matched = jQuery.map(this, fn, until);
          if (name.slice(-5) !== "Until") {
            selector = until;
          }
          if (selector && typeof selector === "string") {
            matched = jQuery.filter(selector, matched);
          }
          if (this.length > 1) {
            if (!guaranteedUnique[name]) {
              jQuery.uniqueSort(matched);
            }
            if (rparentsprev.test(name)) {
              matched.reverse();
            }
          }
          return this.pushStack(matched);
        };
      });
      var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
      function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnothtmlwhite) || [], function(_2, flag) {
          object[flag] = true;
        });
        return object;
      }
      jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
          locked = locked || options.once;
          fired = firing = true;
          for (; queue.length; firingIndex = -1) {
            memory = queue.shift();
            while (++firingIndex < list.length) {
              if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                firingIndex = list.length;
                memory = false;
              }
            }
          }
          if (!options.memory) {
            memory = false;
          }
          firing = false;
          if (locked) {
            if (memory) {
              list = [];
            } else {
              list = "";
            }
          }
        }, self = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            if (list) {
              if (memory && !firing) {
                firingIndex = list.length - 1;
                queue.push(memory);
              }
              (function add(args) {
                jQuery.each(args, function(_2, arg) {
                  if (isFunction(arg)) {
                    if (!options.unique || !self.has(arg)) {
                      list.push(arg);
                    }
                  } else if (arg && arg.length && toType(arg) !== "string") {
                    add(arg);
                  }
                });
              })(arguments);
              if (memory && !firing) {
                fire();
              }
            }
            return this;
          },
          // Remove a callback from the list
          remove: function() {
            jQuery.each(arguments, function(_2, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            });
            return this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(fn) {
            return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            if (list) {
              list = [];
            }
            return this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            locked = queue = [];
            list = memory = "";
            return this;
          },
          disabled: function() {
            return !list;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            locked = queue = [];
            if (!memory && !firing) {
              list = memory = "";
            }
            return this;
          },
          locked: function() {
            return !!locked;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(context, args) {
            if (!locked) {
              args = args || [];
              args = [context, args.slice ? args.slice() : args];
              queue.push(args);
              if (!firing) {
                fire();
              }
            }
            return this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            self.fireWith(this, arguments);
            return this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!fired;
          }
        };
        return self;
      };
      function Identity(v2) {
        return v2;
      }
      function Thrower(ex) {
        throw ex;
      }
      function adoptValue(value, resolve, reject, noValue) {
        var method;
        try {
          if (value && isFunction(method = value.promise)) {
            method.call(value).done(resolve).fail(reject);
          } else if (value && isFunction(method = value.then)) {
            method.call(value, resolve, reject);
          } else {
            resolve.apply(void 0, [value].slice(noValue));
          }
        } catch (value2) {
          reject.apply(void 0, [value2]);
        }
      }
      jQuery.extend({
        Deferred: function(func) {
          var tuples = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              jQuery.Callbacks("memory"),
              jQuery.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], state = "pending", promise = {
            state: function() {
              return state;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            "catch": function(fn) {
              return promise.then(null, fn);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(_i, tuple) {
                  var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && isFunction(returned.promise)) {
                      returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                    } else {
                      newDefer[tuple[0] + "With"](
                        this,
                        fn ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            then: function(onFulfilled, onRejected, onProgress) {
              var maxDepth = 0;
              function resolve(depth, deferred2, handler, special) {
                return function() {
                  var that = this, args = arguments, mightThrow = function() {
                    var returned, then;
                    if (depth < maxDepth) {
                      return;
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred2.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then = returned && // Support: Promises/A+ section 2.3.4
                    // https://promisesaplus.com/#point-64
                    // Only check objects and functions for thenability
                    (typeof returned === "object" || typeof returned === "function") && returned.then;
                    if (isFunction(then)) {
                      if (special) {
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special)
                        );
                      } else {
                        maxDepth++;
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special),
                          resolve(
                            maxDepth,
                            deferred2,
                            Identity,
                            deferred2.notifyWith
                          )
                        );
                      }
                    } else {
                      if (handler !== Identity) {
                        that = void 0;
                        args = [returned];
                      }
                      (special || deferred2.resolveWith)(that, args);
                    }
                  }, process = special ? mightThrow : function() {
                    try {
                      mightThrow();
                    } catch (e2) {
                      if (jQuery.Deferred.exceptionHook) {
                        jQuery.Deferred.exceptionHook(
                          e2,
                          process.error
                        );
                      }
                      if (depth + 1 >= maxDepth) {
                        if (handler !== Thrower) {
                          that = void 0;
                          args = [e2];
                        }
                        deferred2.rejectWith(that, args);
                      }
                    }
                  };
                  if (depth) {
                    process();
                  } else {
                    if (jQuery.Deferred.getErrorHook) {
                      process.error = jQuery.Deferred.getErrorHook();
                    } else if (jQuery.Deferred.getStackHook) {
                      process.error = jQuery.Deferred.getStackHook();
                    }
                    window2.setTimeout(process);
                  }
                };
              }
              return jQuery.Deferred(function(newDefer) {
                tuples[0][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onProgress) ? onProgress : Identity,
                    newDefer.notifyWith
                  )
                );
                tuples[1][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onFulfilled) ? onFulfilled : Identity
                  )
                );
                tuples[2][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onRejected) ? onRejected : Thrower
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          }, deferred = {};
          jQuery.each(tuples, function(i2, tuple) {
            var list = tuple[2], stateString = tuple[5];
            promise[tuple[1]] = list.add;
            if (stateString) {
              list.add(
                function() {
                  state = stateString;
                },
                // rejected_callbacks.disable
                // fulfilled_callbacks.disable
                tuples[3 - i2][2].disable,
                // rejected_handlers.disable
                // fulfilled_handlers.disable
                tuples[3 - i2][3].disable,
                // progress_callbacks.lock
                tuples[0][2].lock,
                // progress_handlers.lock
                tuples[0][3].lock
              );
            }
            list.add(tuple[3].fire);
            deferred[tuple[0]] = function() {
              deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
              return this;
            };
            deferred[tuple[0] + "With"] = list.fireWith;
          });
          promise.promise(deferred);
          if (func) {
            func.call(deferred, deferred);
          }
          return deferred;
        },
        // Deferred helper
        when: function(singleValue) {
          var remaining = arguments.length, i2 = remaining, resolveContexts = Array(i2), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i3) {
            return function(value) {
              resolveContexts[i3] = this;
              resolveValues[i3] = arguments.length > 1 ? slice.call(arguments) : value;
              if (!--remaining) {
                primary.resolveWith(resolveContexts, resolveValues);
              }
            };
          };
          if (remaining <= 1) {
            adoptValue(
              singleValue,
              primary.done(updateFunc(i2)).resolve,
              primary.reject,
              !remaining
            );
            if (primary.state() === "pending" || isFunction(resolveValues[i2] && resolveValues[i2].then)) {
              return primary.then();
            }
          }
          while (i2--) {
            adoptValue(resolveValues[i2], updateFunc(i2), primary.reject);
          }
          return primary.promise();
        }
      });
      var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      jQuery.Deferred.exceptionHook = function(error, asyncError) {
        if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
          window2.console.warn(
            "jQuery.Deferred exception: " + error.message,
            error.stack,
            asyncError
          );
        }
      };
      jQuery.readyException = function(error) {
        window2.setTimeout(function() {
          throw error;
        });
      };
      var readyList = jQuery.Deferred();
      jQuery.fn.ready = function(fn) {
        readyList.then(fn).catch(function(error) {
          jQuery.readyException(error);
        });
        return this;
      };
      jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(wait) {
          if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
          }
          jQuery.isReady = true;
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }
          readyList.resolveWith(document2, [jQuery]);
        }
      });
      jQuery.ready.then = readyList.then;
      function completed() {
        document2.removeEventListener("DOMContentLoaded", completed);
        window2.removeEventListener("load", completed);
        jQuery.ready();
      }
      if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
        window2.setTimeout(jQuery.ready);
      } else {
        document2.addEventListener("DOMContentLoaded", completed);
        window2.addEventListener("load", completed);
      }
      var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i2 = 0, len = elems.length, bulk = key == null;
        if (toType(key) === "object") {
          chainable = true;
          for (i2 in key) {
            access(elems, fn, i2, key[i2], true, emptyGet, raw);
          }
        } else if (value !== void 0) {
          chainable = true;
          if (!isFunction(value)) {
            raw = true;
          }
          if (bulk) {
            if (raw) {
              fn.call(elems, value);
              fn = null;
            } else {
              bulk = fn;
              fn = function(elem, _key, value2) {
                return bulk.call(jQuery(elem), value2);
              };
            }
          }
          if (fn) {
            for (; i2 < len; i2++) {
              fn(
                elems[i2],
                key,
                raw ? value : value.call(elems[i2], i2, fn(elems[i2], key))
              );
            }
          }
        }
        if (chainable) {
          return elems;
        }
        if (bulk) {
          return fn.call(elems);
        }
        return len ? fn(elems[0], key) : emptyGet;
      };
      var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
      function fcamelCase(_all, letter) {
        return letter.toUpperCase();
      }
      function camelCase(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
      }
      var acceptData = function(owner) {
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
      };
      function Data2() {
        this.expando = jQuery.expando + Data2.uid++;
      }
      Data2.uid = 1;
      Data2.prototype = {
        cache: function(owner) {
          var value = owner[this.expando];
          if (!value) {
            value = {};
            if (acceptData(owner)) {
              if (owner.nodeType) {
                owner[this.expando] = value;
              } else {
                Object.defineProperty(owner, this.expando, {
                  value,
                  configurable: true
                });
              }
            }
          }
          return value;
        },
        set: function(owner, data, value) {
          var prop, cache = this.cache(owner);
          if (typeof data === "string") {
            cache[camelCase(data)] = value;
          } else {
            for (prop in data) {
              cache[camelCase(prop)] = data[prop];
            }
          }
          return cache;
        },
        get: function(owner, key) {
          return key === void 0 ? this.cache(owner) : (
            // Always use camelCase key (gh-2257)
            owner[this.expando] && owner[this.expando][camelCase(key)]
          );
        },
        access: function(owner, key, value) {
          if (key === void 0 || key && typeof key === "string" && value === void 0) {
            return this.get(owner, key);
          }
          this.set(owner, key, value);
          return value !== void 0 ? value : key;
        },
        remove: function(owner, key) {
          var i2, cache = owner[this.expando];
          if (cache === void 0) {
            return;
          }
          if (key !== void 0) {
            if (Array.isArray(key)) {
              key = key.map(camelCase);
            } else {
              key = camelCase(key);
              key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
            }
            i2 = key.length;
            while (i2--) {
              delete cache[key[i2]];
            }
          }
          if (key === void 0 || jQuery.isEmptyObject(cache)) {
            if (owner.nodeType) {
              owner[this.expando] = void 0;
            } else {
              delete owner[this.expando];
            }
          }
        },
        hasData: function(owner) {
          var cache = owner[this.expando];
          return cache !== void 0 && !jQuery.isEmptyObject(cache);
        }
      };
      var dataPriv = new Data2();
      var dataUser = new Data2();
      var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
      function getData(data) {
        if (data === "true") {
          return true;
        }
        if (data === "false") {
          return false;
        }
        if (data === "null") {
          return null;
        }
        if (data === +data + "") {
          return +data;
        }
        if (rbrace.test(data)) {
          return JSON.parse(data);
        }
        return data;
      }
      function dataAttr(elem, key, data) {
        var name;
        if (data === void 0 && elem.nodeType === 1) {
          name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
          data = elem.getAttribute(name);
          if (typeof data === "string") {
            try {
              data = getData(data);
            } catch (e2) {
            }
            dataUser.set(elem, key, data);
          } else {
            data = void 0;
          }
        }
        return data;
      }
      jQuery.extend({
        hasData: function(elem) {
          return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },
        data: function(elem, name, data) {
          return dataUser.access(elem, name, data);
        },
        removeData: function(elem, name) {
          dataUser.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(elem, name, data) {
          return dataPriv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
          dataPriv.remove(elem, name);
        }
      });
      jQuery.fn.extend({
        data: function(key, value) {
          var i2, name, data, elem = this[0], attrs = elem && elem.attributes;
          if (key === void 0) {
            if (this.length) {
              data = dataUser.get(elem);
              if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                i2 = attrs.length;
                while (i2--) {
                  if (attrs[i2]) {
                    name = attrs[i2].name;
                    if (name.indexOf("data-") === 0) {
                      name = camelCase(name.slice(5));
                      dataAttr(elem, name, data[name]);
                    }
                  }
                }
                dataPriv.set(elem, "hasDataAttrs", true);
              }
            }
            return data;
          }
          if (typeof key === "object") {
            return this.each(function() {
              dataUser.set(this, key);
            });
          }
          return access(this, function(value2) {
            var data2;
            if (elem && value2 === void 0) {
              data2 = dataUser.get(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              data2 = dataAttr(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              return;
            }
            this.each(function() {
              dataUser.set(this, key, value2);
            });
          }, null, value, arguments.length > 1, null, true);
        },
        removeData: function(key) {
          return this.each(function() {
            dataUser.remove(this, key);
          });
        }
      });
      jQuery.extend({
        queue: function(elem, type, data) {
          var queue;
          if (elem) {
            type = (type || "fx") + "queue";
            queue = dataPriv.get(elem, type);
            if (data) {
              if (!queue || Array.isArray(data)) {
                queue = dataPriv.access(elem, type, jQuery.makeArray(data));
              } else {
                queue.push(data);
              }
            }
            return queue || [];
          }
        },
        dequeue: function(elem, type) {
          type = type || "fx";
          var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
            jQuery.dequeue(elem, type);
          };
          if (fn === "inprogress") {
            fn = queue.shift();
            startLength--;
          }
          if (fn) {
            if (type === "fx") {
              queue.unshift("inprogress");
            }
            delete hooks.stop;
            fn.call(elem, next, hooks);
          }
          if (!startLength && hooks) {
            hooks.empty.fire();
          }
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(elem, type) {
          var key = type + "queueHooks";
          return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
            empty: jQuery.Callbacks("once memory").add(function() {
              dataPriv.remove(elem, [type + "queue", key]);
            })
          });
        }
      });
      jQuery.fn.extend({
        queue: function(type, data) {
          var setter = 2;
          if (typeof type !== "string") {
            data = type;
            type = "fx";
            setter--;
          }
          if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
          }
          return data === void 0 ? this : this.each(function() {
            var queue = jQuery.queue(this, type, data);
            jQuery._queueHooks(this, type);
            if (type === "fx" && queue[0] !== "inprogress") {
              jQuery.dequeue(this, type);
            }
          });
        },
        dequeue: function(type) {
          return this.each(function() {
            jQuery.dequeue(this, type);
          });
        },
        clearQueue: function(type) {
          return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(type, obj) {
          var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i2 = this.length, resolve = function() {
            if (!--count) {
              defer.resolveWith(elements, [elements]);
            }
          };
          if (typeof type !== "string") {
            obj = type;
            type = void 0;
          }
          type = type || "fx";
          while (i2--) {
            tmp = dataPriv.get(elements[i2], type + "queueHooks");
            if (tmp && tmp.empty) {
              count++;
              tmp.empty.add(resolve);
            }
          }
          resolve();
          return defer.promise(obj);
        }
      });
      var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
      var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
      var cssExpand = ["Top", "Right", "Bottom", "Left"];
      var documentElement2 = document2.documentElement;
      var isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem);
      }, composed = { composed: true };
      if (documentElement2.getRootNode) {
        isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
        };
      }
      var isHiddenWithinTree = function(elem, el) {
        elem = el || elem;
        return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        isAttached(elem) && jQuery.css(elem, "display") === "none";
      };
      function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
          return tween.cur();
        } : function() {
          return jQuery.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
        if (initialInUnit && initialInUnit[3] !== unit) {
          initial = initial / 2;
          unit = unit || initialInUnit[3];
          initialInUnit = +initial || 1;
          while (maxIterations--) {
            jQuery.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
              maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
          }
          initialInUnit = initialInUnit * 2;
          jQuery.style(elem, prop, initialInUnit + unit);
          valueParts = valueParts || [];
        }
        if (valueParts) {
          initialInUnit = +initialInUnit || +initial || 0;
          adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
          if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
          }
        }
        return adjusted;
      }
      var defaultDisplayMap = {};
      function getDefaultDisplay(elem) {
        var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
        if (display) {
          return display;
        }
        temp = doc.body.appendChild(doc.createElement(nodeName2));
        display = jQuery.css(temp, "display");
        temp.parentNode.removeChild(temp);
        if (display === "none") {
          display = "block";
        }
        defaultDisplayMap[nodeName2] = display;
        return display;
      }
      function showHide(elements, show) {
        var display, elem, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }
          display = elem.style.display;
          if (show) {
            if (display === "none") {
              values[index] = dataPriv.get(elem, "display") || null;
              if (!values[index]) {
                elem.style.display = "";
              }
            }
            if (elem.style.display === "" && isHiddenWithinTree(elem)) {
              values[index] = getDefaultDisplay(elem);
            }
          } else {
            if (display !== "none") {
              values[index] = "none";
              dataPriv.set(elem, "display", display);
            }
          }
        }
        for (index = 0; index < length; index++) {
          if (values[index] != null) {
            elements[index].style.display = values[index];
          }
        }
        return elements;
      }
      jQuery.fn.extend({
        show: function() {
          return showHide(this, true);
        },
        hide: function() {
          return showHide(this);
        },
        toggle: function(state) {
          if (typeof state === "boolean") {
            return state ? this.show() : this.hide();
          }
          return this.each(function() {
            if (isHiddenWithinTree(this)) {
              jQuery(this).show();
            } else {
              jQuery(this).hide();
            }
          });
        }
      });
      var rcheckableType = /^(?:checkbox|radio)$/i;
      var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
      var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");
        div.appendChild(input);
        support2.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support2.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        div.innerHTML = "<option></option>";
        support2.option = !!div.lastChild;
      })();
      var wrapMap = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;
      if (!support2.option) {
        wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
      }
      function getAll(context, tag) {
        var ret;
        if (typeof context.getElementsByTagName !== "undefined") {
          ret = context.getElementsByTagName(tag || "*");
        } else if (typeof context.querySelectorAll !== "undefined") {
          ret = context.querySelectorAll(tag || "*");
        } else {
          ret = [];
        }
        if (tag === void 0 || tag && nodeName(context, tag)) {
          return jQuery.merge([context], ret);
        }
        return ret;
      }
      function setGlobalEval(elems, refElements) {
        var i2 = 0, l2 = elems.length;
        for (; i2 < l2; i2++) {
          dataPriv.set(
            elems[i2],
            "globalEval",
            !refElements || dataPriv.get(refElements[i2], "globalEval")
          );
        }
      }
      var rhtml = /<|&#?\w+;/;
      function buildFragment(elems, context, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, attached, j2, fragment = context.createDocumentFragment(), nodes = [], i2 = 0, l2 = elems.length;
        for (; i2 < l2; i2++) {
          elem = elems[i2];
          if (elem || elem === 0) {
            if (toType(elem) === "object") {
              jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
            } else if (!rhtml.test(elem)) {
              nodes.push(context.createTextNode(elem));
            } else {
              tmp = tmp || fragment.appendChild(context.createElement("div"));
              tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
              j2 = wrap[0];
              while (j2--) {
                tmp = tmp.lastChild;
              }
              jQuery.merge(nodes, tmp.childNodes);
              tmp = fragment.firstChild;
              tmp.textContent = "";
            }
          }
        }
        fragment.textContent = "";
        i2 = 0;
        while (elem = nodes[i2++]) {
          if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
              ignored.push(elem);
            }
            continue;
          }
          attached = isAttached(elem);
          tmp = getAll(fragment.appendChild(elem), "script");
          if (attached) {
            setGlobalEval(tmp);
          }
          if (scripts) {
            j2 = 0;
            while (elem = tmp[j2++]) {
              if (rscriptType.test(elem.type || "")) {
                scripts.push(elem);
              }
            }
          }
        }
        return fragment;
      }
      var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
      function returnTrue() {
        return true;
      }
      function returnFalse() {
        return false;
      }
      function on(elem, types, selector, data, fn, one) {
        var origFn, type;
        if (typeof types === "object") {
          if (typeof selector !== "string") {
            data = data || selector;
            selector = void 0;
          }
          for (type in types) {
            on(elem, type, selector, data, types[type], one);
          }
          return elem;
        }
        if (data == null && fn == null) {
          fn = selector;
          data = selector = void 0;
        } else if (fn == null) {
          if (typeof selector === "string") {
            fn = data;
            data = void 0;
          } else {
            fn = data;
            data = selector;
            selector = void 0;
          }
        }
        if (fn === false) {
          fn = returnFalse;
        } else if (!fn) {
          return elem;
        }
        if (one === 1) {
          origFn = fn;
          fn = function(event) {
            jQuery().off(event);
            return origFn.apply(this, arguments);
          };
          fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function() {
          jQuery.event.add(this, types, fn, data, selector);
        });
      }
      jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
          var handleObjIn, eventHandle, tmp, events2, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
          if (!acceptData(elem)) {
            return;
          }
          if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
          }
          if (selector) {
            jQuery.find.matchesSelector(documentElement2, selector);
          }
          if (!handler.guid) {
            handler.guid = jQuery.guid++;
          }
          if (!(events2 = elemData.events)) {
            events2 = elemData.events = /* @__PURE__ */ Object.create(null);
          }
          if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function(e2) {
              return typeof jQuery !== "undefined" && jQuery.event.triggered !== e2.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            };
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t2 = types.length;
          while (t2--) {
            tmp = rtypenamespace.exec(types[t2]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type,
              origType,
              data,
              handler,
              guid: handler.guid,
              selector,
              needsContext: selector && jQuery.expr.match.needsContext.test(selector),
              namespace: namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events2[type])) {
              handlers = events2[type] = [];
              handlers.delegateCount = 0;
              if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle);
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            jQuery.event.global[type] = true;
          }
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
          var j2, origCount, tmp, events2, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
          if (!elemData || !(events2 = elemData.events)) {
            return;
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t2 = types.length;
          while (t2--) {
            tmp = rtypenamespace.exec(types[t2]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              for (type in events2) {
                jQuery.event.remove(elem, type + types[t2], handler, selector, true);
              }
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events2[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j2 = handlers.length;
            while (j2--) {
              handleObj = handlers[j2];
              if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                handlers.splice(j2, 1);
                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }
            if (origCount && !handlers.length) {
              if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                jQuery.removeEvent(elem, type, elemData.handle);
              }
              delete events2[type];
            }
          }
          if (jQuery.isEmptyObject(events2)) {
            dataPriv.remove(elem, "handle events");
          }
        },
        dispatch: function(nativeEvent) {
          var i2, j2, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
          args[0] = event;
          for (i2 = 1; i2 < arguments.length; i2++) {
            args[i2] = arguments[i2];
          }
          event.delegateTarget = this;
          if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
          }
          handlerQueue = jQuery.event.handlers.call(this, event, handlers);
          i2 = 0;
          while ((matched = handlerQueue[i2++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;
            j2 = 0;
            while ((handleObj = matched.handlers[j2++]) && !event.isImmediatePropagationStopped()) {
              if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                event.handleObj = handleObj;
                event.data = handleObj.data;
                ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                if (ret !== void 0) {
                  if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            }
          }
          if (special.postDispatch) {
            special.postDispatch.call(this, event);
          }
          return event.result;
        },
        handlers: function(event, handlers) {
          var i2, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
          if (delegateCount && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          cur.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(event.type === "click" && event.button >= 1)) {
            for (; cur !== this; cur = cur.parentNode || this) {
              if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                matchedHandlers = [];
                matchedSelectors = {};
                for (i2 = 0; i2 < delegateCount; i2++) {
                  handleObj = handlers[i2];
                  sel = handleObj.selector + " ";
                  if (matchedSelectors[sel] === void 0) {
                    matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                  }
                  if (matchedSelectors[sel]) {
                    matchedHandlers.push(handleObj);
                  }
                }
                if (matchedHandlers.length) {
                  handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                }
              }
            }
          }
          cur = this;
          if (delegateCount < handlers.length) {
            handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
          }
          return handlerQueue;
        },
        addProp: function(name, hook) {
          Object.defineProperty(jQuery.Event.prototype, name, {
            enumerable: true,
            configurable: true,
            get: isFunction(hook) ? function() {
              if (this.originalEvent) {
                return hook(this.originalEvent);
              }
            } : function() {
              if (this.originalEvent) {
                return this.originalEvent[name];
              }
            },
            set: function(value) {
              Object.defineProperty(this, name, {
                enumerable: true,
                configurable: true,
                writable: true,
                value
              });
            }
          });
        },
        fix: function(originalEvent) {
          return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(data) {
              var el = this || data;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click", true);
              }
              return false;
            },
            trigger: function(data) {
              var el = this || data;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click");
              }
              return true;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(event) {
              var target = event.target;
              return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
            }
          },
          beforeunload: {
            postDispatch: function(event) {
              if (event.result !== void 0 && event.originalEvent) {
                event.originalEvent.returnValue = event.result;
              }
            }
          }
        }
      };
      function leverageNative(el, type, isSetup) {
        if (!isSetup) {
          if (dataPriv.get(el, type) === void 0) {
            jQuery.event.add(el, type, returnTrue);
          }
          return;
        }
        dataPriv.set(el, type, false);
        jQuery.event.add(el, type, {
          namespace: false,
          handler: function(event) {
            var result, saved = dataPriv.get(this, type);
            if (event.isTrigger & 1 && this[type]) {
              if (!saved) {
                saved = slice.call(arguments);
                dataPriv.set(this, type, saved);
                this[type]();
                result = dataPriv.get(this, type);
                dataPriv.set(this, type, false);
                if (saved !== result) {
                  event.stopImmediatePropagation();
                  event.preventDefault();
                  return result;
                }
              } else if ((jQuery.event.special[type] || {}).delegateType) {
                event.stopPropagation();
              }
            } else if (saved) {
              dataPriv.set(this, type, jQuery.event.trigger(
                saved[0],
                saved.slice(1),
                this
              ));
              event.stopPropagation();
              event.isImmediatePropagationStopped = returnTrue;
            }
          }
        });
      }
      jQuery.removeEvent = function(elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle);
        }
      };
      jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
          return new jQuery.Event(src, props);
        }
        if (src && src.type) {
          this.originalEvent = src;
          this.type = src.type;
          this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
          src.returnValue === false ? returnTrue : returnFalse;
          this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
          this.currentTarget = src.currentTarget;
          this.relatedTarget = src.relatedTarget;
        } else {
          this.type = src;
        }
        if (props) {
          jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || Date.now();
        this[jQuery.expando] = true;
      };
      jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function() {
          var e2 = this.originalEvent;
          this.isDefaultPrevented = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.preventDefault();
          }
        },
        stopPropagation: function() {
          var e2 = this.originalEvent;
          this.isPropagationStopped = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.stopPropagation();
          }
        },
        stopImmediatePropagation: function() {
          var e2 = this.originalEvent;
          this.isImmediatePropagationStopped = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.stopImmediatePropagation();
          }
          this.stopPropagation();
        }
      };
      jQuery.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        which: true
      }, jQuery.event.addProp);
      jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
        function focusMappedHandler(nativeEvent) {
          if (document2.documentMode) {
            var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
            event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
            event.isSimulated = true;
            handle(nativeEvent);
            if (event.target === event.currentTarget) {
              handle(event);
            }
          } else {
            jQuery.event.simulate(
              delegateType,
              nativeEvent.target,
              jQuery.event.fix(nativeEvent)
            );
          }
        }
        jQuery.event.special[type] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var attaches;
            leverageNative(this, type, true);
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType);
              if (!attaches) {
                this.addEventListener(delegateType, focusMappedHandler);
              }
              dataPriv.set(this, delegateType, (attaches || 0) + 1);
            } else {
              return false;
            }
          },
          trigger: function() {
            leverageNative(this, type);
            return true;
          },
          teardown: function() {
            var attaches;
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType) - 1;
              if (!attaches) {
                this.removeEventListener(delegateType, focusMappedHandler);
                dataPriv.remove(this, delegateType);
              } else {
                dataPriv.set(this, delegateType, attaches);
              }
            } else {
              return false;
            }
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(event) {
            return dataPriv.get(event.target, type);
          },
          delegateType
        };
        jQuery.event.special[delegateType] = {
          setup: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
            if (!attaches) {
              if (document2.documentMode) {
                this.addEventListener(delegateType, focusMappedHandler);
              } else {
                doc.addEventListener(type, focusMappedHandler, true);
              }
            }
            dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
          },
          teardown: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
            if (!attaches) {
              if (document2.documentMode) {
                this.removeEventListener(delegateType, focusMappedHandler);
              } else {
                doc.removeEventListener(type, focusMappedHandler, true);
              }
              dataPriv.remove(dataHolder, delegateType);
            } else {
              dataPriv.set(dataHolder, delegateType, attaches);
            }
          }
        };
      });
      jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(orig, fix) {
        jQuery.event.special[orig] = {
          delegateType: fix,
          bindType: fix,
          handle: function(event) {
            var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
            if (!related || related !== target && !jQuery.contains(target, related)) {
              event.type = handleObj.origType;
              ret = handleObj.handler.apply(this, arguments);
              event.type = fix;
            }
            return ret;
          }
        };
      });
      jQuery.fn.extend({
        on: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn);
        },
        one: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
          var handleObj, type;
          if (types && types.preventDefault && types.handleObj) {
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
              handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
              handleObj.selector,
              handleObj.handler
            );
            return this;
          }
          if (typeof types === "object") {
            for (type in types) {
              this.off(type, selector, types[type]);
            }
            return this;
          }
          if (selector === false || typeof selector === "function") {
            fn = selector;
            selector = void 0;
          }
          if (fn === false) {
            fn = returnFalse;
          }
          return this.each(function() {
            jQuery.event.remove(this, types, fn, selector);
          });
        }
      });
      var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function manipulationTarget(elem, content) {
        if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
          return jQuery(elem).children("tbody")[0] || elem;
        }
        return elem;
      }
      function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
      }
      function restoreScript(elem) {
        if ((elem.type || "").slice(0, 5) === "true/") {
          elem.type = elem.type.slice(5);
        } else {
          elem.removeAttribute("type");
        }
        return elem;
      }
      function cloneCopyEvent(src, dest) {
        var i2, l2, type, pdataOld, udataOld, udataCur, events2;
        if (dest.nodeType !== 1) {
          return;
        }
        if (dataPriv.hasData(src)) {
          pdataOld = dataPriv.get(src);
          events2 = pdataOld.events;
          if (events2) {
            dataPriv.remove(dest, "handle events");
            for (type in events2) {
              for (i2 = 0, l2 = events2[type].length; i2 < l2; i2++) {
                jQuery.event.add(dest, type, events2[type][i2]);
              }
            }
          }
        }
        if (dataUser.hasData(src)) {
          udataOld = dataUser.access(src);
          udataCur = jQuery.extend({}, udataOld);
          dataUser.set(dest, udataCur);
        }
      }
      function fixInput(src, dest) {
        var nodeName2 = dest.nodeName.toLowerCase();
        if (nodeName2 === "input" && rcheckableType.test(src.type)) {
          dest.checked = src.checked;
        } else if (nodeName2 === "input" || nodeName2 === "textarea") {
          dest.defaultValue = src.defaultValue;
        }
      }
      function domManip(collection, args, callback, ignored) {
        args = flat(args);
        var fragment, first, scripts, hasScripts, node, doc, i2 = 0, l2 = collection.length, iNoClone = l2 - 1, value = args[0], valueIsFunction = isFunction(value);
        if (valueIsFunction || l2 > 1 && typeof value === "string" && !support2.checkClone && rchecked.test(value)) {
          return collection.each(function(index) {
            var self = collection.eq(index);
            if (valueIsFunction) {
              args[0] = value.call(this, index, self.html());
            }
            domManip(self, args, callback, ignored);
          });
        }
        if (l2) {
          fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
          first = fragment.firstChild;
          if (fragment.childNodes.length === 1) {
            fragment = first;
          }
          if (first || ignored) {
            scripts = jQuery.map(getAll(fragment, "script"), disableScript);
            hasScripts = scripts.length;
            for (; i2 < l2; i2++) {
              node = fragment;
              if (i2 !== iNoClone) {
                node = jQuery.clone(node, true, true);
                if (hasScripts) {
                  jQuery.merge(scripts, getAll(node, "script"));
                }
              }
              callback.call(collection[i2], node, i2);
            }
            if (hasScripts) {
              doc = scripts[scripts.length - 1].ownerDocument;
              jQuery.map(scripts, restoreScript);
              for (i2 = 0; i2 < hasScripts; i2++) {
                node = scripts[i2];
                if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                  if (node.src && (node.type || "").toLowerCase() !== "module") {
                    if (jQuery._evalUrl && !node.noModule) {
                      jQuery._evalUrl(node.src, {
                        nonce: node.nonce || node.getAttribute("nonce")
                      }, doc);
                    }
                  } else {
                    DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                  }
                }
              }
            }
          }
        }
        return collection;
      }
      function remove(elem, selector, keepData) {
        var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i2 = 0;
        for (; (node = nodes[i2]) != null; i2++) {
          if (!keepData && node.nodeType === 1) {
            jQuery.cleanData(getAll(node));
          }
          if (node.parentNode) {
            if (keepData && isAttached(node)) {
              setGlobalEval(getAll(node, "script"));
            }
            node.parentNode.removeChild(node);
          }
        }
        return elem;
      }
      jQuery.extend({
        htmlPrefilter: function(html) {
          return html;
        },
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
          var i2, l2, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
          if (!support2.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            destElements = getAll(clone);
            srcElements = getAll(elem);
            for (i2 = 0, l2 = srcElements.length; i2 < l2; i2++) {
              fixInput(srcElements[i2], destElements[i2]);
            }
          }
          if (dataAndEvents) {
            if (deepDataAndEvents) {
              srcElements = srcElements || getAll(elem);
              destElements = destElements || getAll(clone);
              for (i2 = 0, l2 = srcElements.length; i2 < l2; i2++) {
                cloneCopyEvent(srcElements[i2], destElements[i2]);
              }
            } else {
              cloneCopyEvent(elem, clone);
            }
          }
          destElements = getAll(clone, "script");
          if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
          }
          return clone;
        },
        cleanData: function(elems) {
          var data, elem, type, special = jQuery.event.special, i2 = 0;
          for (; (elem = elems[i2]) !== void 0; i2++) {
            if (acceptData(elem)) {
              if (data = elem[dataPriv.expando]) {
                if (data.events) {
                  for (type in data.events) {
                    if (special[type]) {
                      jQuery.event.remove(elem, type);
                    } else {
                      jQuery.removeEvent(elem, type, data.handle);
                    }
                  }
                }
                elem[dataPriv.expando] = void 0;
              }
              if (elem[dataUser.expando]) {
                elem[dataUser.expando] = void 0;
              }
            }
          }
        }
      });
      jQuery.fn.extend({
        detach: function(selector) {
          return remove(this, selector, true);
        },
        remove: function(selector) {
          return remove(this, selector);
        },
        text: function(value) {
          return access(this, function(value2) {
            return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = value2;
              }
            });
          }, null, value, arguments.length);
        },
        append: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.appendChild(elem);
            }
          });
        },
        prepend: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.insertBefore(elem, target.firstChild);
            }
          });
        },
        before: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this);
            }
          });
        },
        after: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this.nextSibling);
            }
          });
        },
        empty: function() {
          var elem, i2 = 0;
          for (; (elem = this[i2]) != null; i2++) {
            if (elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem, false));
              elem.textContent = "";
            }
          }
          return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
          dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
          deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
          return this.map(function() {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
          });
        },
        html: function(value) {
          return access(this, function(value2) {
            var elem = this[0] || {}, i2 = 0, l2 = this.length;
            if (value2 === void 0 && elem.nodeType === 1) {
              return elem.innerHTML;
            }
            if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
              value2 = jQuery.htmlPrefilter(value2);
              try {
                for (; i2 < l2; i2++) {
                  elem = this[i2] || {};
                  if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                    elem.innerHTML = value2;
                  }
                }
                elem = 0;
              } catch (e2) {
              }
            }
            if (elem) {
              this.empty().append(value2);
            }
          }, null, value, arguments.length);
        },
        replaceWith: function() {
          var ignored = [];
          return domManip(this, arguments, function(elem) {
            var parent = this.parentNode;
            if (jQuery.inArray(this, ignored) < 0) {
              jQuery.cleanData(getAll(this));
              if (parent) {
                parent.replaceChild(elem, this);
              }
            }
          }, ignored);
        }
      });
      jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(name, original) {
        jQuery.fn[name] = function(selector) {
          var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i2 = 0;
          for (; i2 <= last; i2++) {
            elems = i2 === last ? this : this.clone(true);
            jQuery(insert[i2])[original](elems);
            push.apply(ret, elems.get());
          }
          return this.pushStack(ret);
        };
      });
      var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
      var rcustomProp = /^--/;
      var getStyles = function(elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
          view = window2;
        }
        return view.getComputedStyle(elem);
      };
      var swap = function(elem, options, callback) {
        var ret, name, old = {};
        for (name in options) {
          old[name] = elem.style[name];
          elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for (name in options) {
          elem.style[name] = old[name];
        }
        return ret;
      };
      var rboxStyle = new RegExp(cssExpand.join("|"), "i");
      (function() {
        function computeStyleTests() {
          if (!div) {
            return;
          }
          container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
          div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
          documentElement2.appendChild(container).appendChild(div);
          var divStyle = window2.getComputedStyle(div);
          pixelPositionVal = divStyle.top !== "1%";
          reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
          div.style.right = "60%";
          pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
          boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
          div.style.position = "absolute";
          scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
          documentElement2.removeChild(container);
          div = null;
        }
        function roundPixelMeasures(measure) {
          return Math.round(parseFloat(measure));
        }
        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
        if (!div.style) {
          return;
        }
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support2.clearCloneStyle = div.style.backgroundClip === "content-box";
        jQuery.extend(support2, {
          boxSizingReliable: function() {
            computeStyleTests();
            return boxSizingReliableVal;
          },
          pixelBoxStyles: function() {
            computeStyleTests();
            return pixelBoxStylesVal;
          },
          pixelPosition: function() {
            computeStyleTests();
            return pixelPositionVal;
          },
          reliableMarginLeft: function() {
            computeStyleTests();
            return reliableMarginLeftVal;
          },
          scrollboxSize: function() {
            computeStyleTests();
            return scrollboxSizeVal;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var table, tr, trChild, trStyle;
            if (reliableTrDimensionsVal == null) {
              table = document2.createElement("table");
              tr = document2.createElement("tr");
              trChild = document2.createElement("div");
              table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
              tr.style.cssText = "box-sizing:content-box;border:1px solid";
              tr.style.height = "1px";
              trChild.style.height = "9px";
              trChild.style.display = "block";
              documentElement2.appendChild(table).appendChild(tr).appendChild(trChild);
              trStyle = window2.getComputedStyle(tr);
              reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
              documentElement2.removeChild(table);
            }
            return reliableTrDimensionsVal;
          }
        });
      })();
      function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
        computed = computed || getStyles(elem);
        if (computed) {
          ret = computed.getPropertyValue(name) || computed[name];
          if (isCustomProp && ret) {
            ret = ret.replace(rtrimCSS, "$1") || void 0;
          }
          if (ret === "" && !isAttached(elem)) {
            ret = jQuery.style(elem, name);
          }
          if (!support2.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
          }
        }
        return ret !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          ret + ""
        ) : ret;
      }
      function addGetHookIf(conditionFn, hookFn) {
        return {
          get: function() {
            if (conditionFn()) {
              delete this.get;
              return;
            }
            return (this.get = hookFn).apply(this, arguments);
          }
        };
      }
      var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
      function vendorPropName(name) {
        var capName = name[0].toUpperCase() + name.slice(1), i2 = cssPrefixes.length;
        while (i2--) {
          name = cssPrefixes[i2] + capName;
          if (name in emptyStyle) {
            return name;
          }
        }
      }
      function finalPropName(name) {
        var final = jQuery.cssProps[name] || vendorProps[name];
        if (final) {
          return final;
        }
        if (name in emptyStyle) {
          return name;
        }
        return vendorProps[name] = vendorPropName(name) || name;
      }
      var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function setPositiveNumber(_elem, value, subtract) {
        var matches = rcssNum.exec(value);
        return matches ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
        ) : value;
      }
      function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
        var i2 = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
        if (box === (isBorderBox ? "border" : "content")) {
          return 0;
        }
        for (; i2 < 4; i2 += 2) {
          if (box === "margin") {
            marginDelta += jQuery.css(elem, box + cssExpand[i2], true, styles);
          }
          if (!isBorderBox) {
            delta += jQuery.css(elem, "padding" + cssExpand[i2], true, styles);
            if (box !== "padding") {
              delta += jQuery.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
            } else {
              extra += jQuery.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
            }
          } else {
            if (box === "content") {
              delta -= jQuery.css(elem, "padding" + cssExpand[i2], true, styles);
            }
            if (box !== "margin") {
              delta -= jQuery.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
            }
          }
        }
        if (!isBorderBox && computedVal >= 0) {
          delta += Math.max(0, Math.ceil(
            elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
            // Use an explicit zero to avoid NaN (gh-3964)
          )) || 0;
        }
        return delta + marginDelta;
      }
      function getWidthOrHeight(elem, dimension, extra) {
        var styles = getStyles(elem), boxSizingNeeded = !support2.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
        if (rnumnonpx.test(val)) {
          if (!extra) {
            return val;
          }
          val = "auto";
        }
        if ((!support2.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !support2.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        val === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
        elem.getClientRects().length) {
          isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
          valueIsBorderBox = offsetProp in elem;
          if (valueIsBorderBox) {
            val = elem[offsetProp];
          }
        }
        val = parseFloat(val) || 0;
        return val + boxModelAdjustment(
          elem,
          dimension,
          extra || (isBorderBox ? "border" : "content"),
          valueIsBorderBox,
          styles,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          val
        ) + "px";
      }
      jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(elem, computed) {
              if (computed) {
                var ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageSlice: true,
          columnCount: true,
          flexGrow: true,
          flexShrink: true,
          fontWeight: true,
          gridArea: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnStart: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowStart: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          scale: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeMiterlimit: true,
          strokeOpacity: true
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
          if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
          }
          var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (value !== void 0) {
            type = typeof value;
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
              value = adjustCSS(elem, name, ret);
              type = "number";
            }
            if (value == null || value !== value) {
              return;
            }
            if (type === "number" && !isCustomProp) {
              value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
            }
            if (!support2.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style[name] = "inherit";
            }
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
              if (isCustomProp) {
                style.setProperty(name, value);
              } else {
                style[name] = value;
              }
            }
          } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
              return ret;
            }
            return style[name];
          }
        },
        css: function(elem, name, extra, styles) {
          var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
          }
          if (val === void 0) {
            val = curCSS(elem, name, styles);
          }
          if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
          }
          if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
          }
          return val;
        }
      });
      jQuery.each(["height", "width"], function(_i, dimension) {
        jQuery.cssHooks[dimension] = {
          get: function(elem, computed, extra) {
            if (computed) {
              return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                return getWidthOrHeight(elem, dimension, extra);
              }) : getWidthOrHeight(elem, dimension, extra);
            }
          },
          set: function(elem, value, extra) {
            var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support2.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
              elem,
              dimension,
              extra,
              isBorderBox,
              styles
            ) : 0;
            if (isBorderBox && scrollboxSizeBuggy) {
              subtract -= Math.ceil(
                elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
              );
            }
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
              elem.style[dimension] = value;
              value = jQuery.css(elem, dimension);
            }
            return setPositiveNumber(elem, value, subtract);
          }
        };
      });
      jQuery.cssHooks.marginLeft = addGetHookIf(
        support2.reliableMarginLeft,
        function(elem, computed) {
          if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
              return elem.getBoundingClientRect().left;
            })) + "px";
          }
        }
      );
      jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
          expand: function(value) {
            var i2 = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
            for (; i2 < 4; i2++) {
              expanded[prefix + cssExpand[i2] + suffix] = parts[i2] || parts[i2 - 2] || parts[0];
            }
            return expanded;
          }
        };
        if (prefix !== "margin") {
          jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
      });
      jQuery.fn.extend({
        css: function(name, value) {
          return access(this, function(elem, name2, value2) {
            var styles, len, map = {}, i2 = 0;
            if (Array.isArray(name2)) {
              styles = getStyles(elem);
              len = name2.length;
              for (; i2 < len; i2++) {
                map[name2[i2]] = jQuery.css(elem, name2[i2], false, styles);
              }
              return map;
            }
            return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
          }, name, value, arguments.length > 1);
        }
      });
      function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
      }
      jQuery.Tween = Tween;
      Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
          this.elem = elem;
          this.prop = prop;
          this.easing = easing || jQuery.easing._default;
          this.options = options;
          this.start = this.now = this.cur();
          this.end = end;
          this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
          var hooks = Tween.propHooks[this.prop];
          return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
          var eased, hooks = Tween.propHooks[this.prop];
          if (this.options.duration) {
            this.pos = eased = jQuery.easing[this.easing](
              percent,
              this.options.duration * percent,
              0,
              1,
              this.options.duration
            );
          } else {
            this.pos = eased = percent;
          }
          this.now = (this.end - this.start) * eased + this.start;
          if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
          }
          if (hooks && hooks.set) {
            hooks.set(this);
          } else {
            Tween.propHooks._default.set(this);
          }
          return this;
        }
      };
      Tween.prototype.init.prototype = Tween.prototype;
      Tween.propHooks = {
        _default: {
          get: function(tween) {
            var result;
            if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
              return tween.elem[tween.prop];
            }
            result = jQuery.css(tween.elem, tween.prop, "");
            return !result || result === "auto" ? 0 : result;
          },
          set: function(tween) {
            if (jQuery.fx.step[tween.prop]) {
              jQuery.fx.step[tween.prop](tween);
            } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
              jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
            } else {
              tween.elem[tween.prop] = tween.now;
            }
          }
        }
      };
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
          if (tween.elem.nodeType && tween.elem.parentNode) {
            tween.elem[tween.prop] = tween.now;
          }
        }
      };
      jQuery.easing = {
        linear: function(p2) {
          return p2;
        },
        swing: function(p2) {
          return 0.5 - Math.cos(p2 * Math.PI) / 2;
        },
        _default: "swing"
      };
      jQuery.fx = Tween.prototype.init;
      jQuery.fx.step = {};
      var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
      function schedule() {
        if (inProgress) {
          if (document2.hidden === false && window2.requestAnimationFrame) {
            window2.requestAnimationFrame(schedule);
          } else {
            window2.setTimeout(schedule, jQuery.fx.interval);
          }
          jQuery.fx.tick();
        }
      }
      function createFxNow() {
        window2.setTimeout(function() {
          fxNow = void 0;
        });
        return fxNow = Date.now();
      }
      function genFx(type, includeWidth) {
        var which, i2 = 0, attrs = { height: type };
        includeWidth = includeWidth ? 1 : 0;
        for (; i2 < 4; i2 += 2 - includeWidth) {
          which = cssExpand[i2];
          attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
          attrs.opacity = attrs.width = type;
        }
        return attrs;
      }
      function createTween(value, prop, animation) {
        var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
        for (; index < length; index++) {
          if (tween = collection[index].call(animation, prop, value)) {
            return tween;
          }
        }
      }
      function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
        if (!opts.queue) {
          hooks = jQuery._queueHooks(elem, "fx");
          if (hooks.unqueued == null) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
              if (!hooks.unqueued) {
                oldfire();
              }
            };
          }
          hooks.unqueued++;
          anim.always(function() {
            anim.always(function() {
              hooks.unqueued--;
              if (!jQuery.queue(elem, "fx").length) {
                hooks.empty.fire();
              }
            });
          });
        }
        for (prop in props) {
          value = props[prop];
          if (rfxtypes.test(value)) {
            delete props[prop];
            toggle = toggle || value === "toggle";
            if (value === (hidden ? "hide" : "show")) {
              if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                hidden = true;
              } else {
                continue;
              }
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
          }
        }
        propTween = !jQuery.isEmptyObject(props);
        if (!propTween && jQuery.isEmptyObject(orig)) {
          return;
        }
        if (isBox && elem.nodeType === 1) {
          opts.overflow = [style.overflow, style.overflowX, style.overflowY];
          restoreDisplay = dataShow && dataShow.display;
          if (restoreDisplay == null) {
            restoreDisplay = dataPriv.get(elem, "display");
          }
          display = jQuery.css(elem, "display");
          if (display === "none") {
            if (restoreDisplay) {
              display = restoreDisplay;
            } else {
              showHide([elem], true);
              restoreDisplay = elem.style.display || restoreDisplay;
              display = jQuery.css(elem, "display");
              showHide([elem]);
            }
          }
          if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
            if (jQuery.css(elem, "float") === "none") {
              if (!propTween) {
                anim.done(function() {
                  style.display = restoreDisplay;
                });
                if (restoreDisplay == null) {
                  display = style.display;
                  restoreDisplay = display === "none" ? "" : display;
                }
              }
              style.display = "inline-block";
            }
          }
        }
        if (opts.overflow) {
          style.overflow = "hidden";
          anim.always(function() {
            style.overflow = opts.overflow[0];
            style.overflowX = opts.overflow[1];
            style.overflowY = opts.overflow[2];
          });
        }
        propTween = false;
        for (prop in orig) {
          if (!propTween) {
            if (dataShow) {
              if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
              }
            } else {
              dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
            }
            if (toggle) {
              dataShow.hidden = !hidden;
            }
            if (hidden) {
              showHide([elem], true);
            }
            anim.done(function() {
              if (!hidden) {
                showHide([elem]);
              }
              dataPriv.remove(elem, "fxshow");
              for (prop in orig) {
                jQuery.style(elem, prop, orig[prop]);
              }
            });
          }
          propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
          if (!(prop in dataShow)) {
            dataShow[prop] = propTween.start;
            if (hidden) {
              propTween.end = propTween.start;
              propTween.start = 0;
            }
          }
        }
      }
      function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
          name = camelCase(index);
          easing = specialEasing[name];
          value = props[index];
          if (Array.isArray(value)) {
            easing = value[1];
            value = props[index] = value[0];
          }
          if (index !== name) {
            props[name] = value;
            delete props[index];
          }
          hooks = jQuery.cssHooks[name];
          if (hooks && "expand" in hooks) {
            value = hooks.expand(value);
            delete props[name];
            for (index in value) {
              if (!(index in props)) {
                props[index] = value[index];
                specialEasing[index] = easing;
              }
            }
          } else {
            specialEasing[name] = easing;
          }
        }
      }
      function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }), tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
          for (; index2 < length2; index2++) {
            animation.tweens[index2].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length2) {
            return remaining;
          }
          if (!length2) {
            deferred.notifyWith(elem, [animation, 1, 0]);
          }
          deferred.resolveWith(elem, [animation]);
          return false;
        }, animation = deferred.promise({
          elem,
          props: jQuery.extend({}, properties),
          opts: jQuery.extend(true, {
            specialEasing: {},
            easing: jQuery.easing._default
          }, options),
          originalProperties: properties,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(
              elem,
              animation.opts,
              prop,
              end,
              animation.opts.specialEasing[prop] || animation.opts.easing
            );
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(1);
            }
            if (gotoEnd) {
              deferred.notifyWith(elem, [animation, 1, 0]);
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
          result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
          if (result) {
            if (isFunction(result.stop)) {
              jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
            }
            return result;
          }
        }
        jQuery.map(props, createTween, animation);
        if (isFunction(animation.opts.start)) {
          animation.opts.start.call(elem, animation);
        }
        animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
        jQuery.fx.timer(
          jQuery.extend(tick, {
            elem,
            anim: animation,
            queue: animation.opts.queue
          })
        );
        return animation;
      }
      jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
          "*": [function(prop, value) {
            var tween = this.createTween(prop, value);
            adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
            return tween;
          }]
        },
        tweener: function(props, callback) {
          if (isFunction(props)) {
            callback = props;
            props = ["*"];
          } else {
            props = props.match(rnothtmlwhite);
          }
          var prop, index = 0, length = props.length;
          for (; index < length; index++) {
            prop = props[index];
            Animation.tweeners[prop] = Animation.tweeners[prop] || [];
            Animation.tweeners[prop].unshift(callback);
          }
        },
        prefilters: [defaultPrefilter],
        prefilter: function(callback, prepend) {
          if (prepend) {
            Animation.prefilters.unshift(callback);
          } else {
            Animation.prefilters.push(callback);
          }
        }
      });
      jQuery.speed = function(speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
          complete: fn || !fn && easing || isFunction(speed) && speed,
          duration: speed,
          easing: fn && easing || easing && !isFunction(easing) && easing
        };
        if (jQuery.fx.off) {
          opt.duration = 0;
        } else {
          if (typeof opt.duration !== "number") {
            if (opt.duration in jQuery.fx.speeds) {
              opt.duration = jQuery.fx.speeds[opt.duration];
            } else {
              opt.duration = jQuery.fx.speeds._default;
            }
          }
        }
        if (opt.queue == null || opt.queue === true) {
          opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
          if (isFunction(opt.old)) {
            opt.old.call(this);
          }
          if (opt.queue) {
            jQuery.dequeue(this, opt.queue);
          }
        };
        return opt;
      };
      jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
          return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
          var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || dataPriv.get(this, "finish")) {
              anim.stop(true);
            }
          };
          doAnimation.finish = doAnimation;
          return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
          var stopQueue = function(hooks) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop(gotoEnd);
          };
          if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = void 0;
          }
          if (clearQueue) {
            this.queue(type || "fx", []);
          }
          return this.each(function() {
            var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
            if (index) {
              if (data[index] && data[index].stop) {
                stopQueue(data[index]);
              }
            } else {
              for (index in data) {
                if (data[index] && data[index].stop && rrun.test(index)) {
                  stopQueue(data[index]);
                }
              }
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                timers[index].anim.stop(gotoEnd);
                dequeue = false;
                timers.splice(index, 1);
              }
            }
            if (dequeue || !gotoEnd) {
              jQuery.dequeue(this, type);
            }
          });
        },
        finish: function(type) {
          if (type !== false) {
            type = type || "fx";
          }
          return this.each(function() {
            var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
            data.finish = true;
            jQuery.queue(this, type, []);
            if (hooks && hooks.stop) {
              hooks.stop.call(this, true);
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && timers[index].queue === type) {
                timers[index].anim.stop(true);
                timers.splice(index, 1);
              }
            }
            for (index = 0; index < length; index++) {
              if (queue[index] && queue[index].finish) {
                queue[index].finish.call(this);
              }
            }
            delete data.finish;
          });
        }
      });
      jQuery.each(["toggle", "show", "hide"], function(_i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
          return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
      });
      jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
          return this.animate(props, speed, easing, callback);
        };
      });
      jQuery.timers = [];
      jQuery.fx.tick = function() {
        var timer, i2 = 0, timers = jQuery.timers;
        fxNow = Date.now();
        for (; i2 < timers.length; i2++) {
          timer = timers[i2];
          if (!timer() && timers[i2] === timer) {
            timers.splice(i2--, 1);
          }
        }
        if (!timers.length) {
          jQuery.fx.stop();
        }
        fxNow = void 0;
      };
      jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer);
        jQuery.fx.start();
      };
      jQuery.fx.interval = 13;
      jQuery.fx.start = function() {
        if (inProgress) {
          return;
        }
        inProgress = true;
        schedule();
      };
      jQuery.fx.stop = function() {
        inProgress = null;
      };
      jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      };
      jQuery.fn.delay = function(time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function(next, hooks) {
          var timeout = window2.setTimeout(next, time);
          hooks.stop = function() {
            window2.clearTimeout(timeout);
          };
        });
      };
      (function() {
        var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
        input.type = "checkbox";
        support2.checkOn = input.value !== "";
        support2.optSelected = opt.selected;
        input = document2.createElement("input");
        input.value = "t";
        input.type = "radio";
        support2.radioValue = input.value === "t";
      })();
      var boolHook, attrHandle = jQuery.expr.attrHandle;
      jQuery.fn.extend({
        attr: function(name, value) {
          return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
          return this.each(function() {
            jQuery.removeAttr(this, name);
          });
        }
      });
      jQuery.extend({
        attr: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
          }
          if (value !== void 0) {
            if (value === null) {
              jQuery.removeAttr(elem, name);
              return;
            }
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            elem.setAttribute(name, value + "");
            return value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          ret = jQuery.find.attr(elem, name);
          return ret == null ? void 0 : ret;
        },
        attrHooks: {
          type: {
            set: function(elem, value) {
              if (!support2.radioValue && value === "radio" && nodeName(elem, "input")) {
                var val = elem.value;
                elem.setAttribute("type", value);
                if (val) {
                  elem.value = val;
                }
                return value;
              }
            }
          }
        },
        removeAttr: function(elem, value) {
          var name, i2 = 0, attrNames = value && value.match(rnothtmlwhite);
          if (attrNames && elem.nodeType === 1) {
            while (name = attrNames[i2++]) {
              elem.removeAttribute(name);
            }
          }
        }
      });
      boolHook = {
        set: function(elem, value, name) {
          if (value === false) {
            jQuery.removeAttr(elem, name);
          } else {
            elem.setAttribute(name, name);
          }
          return name;
        }
      };
      jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name2, isXML) {
          var ret, handle, lowercaseName = name2.toLowerCase();
          if (!isXML) {
            handle = attrHandle[lowercaseName];
            attrHandle[lowercaseName] = ret;
            ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
            attrHandle[lowercaseName] = handle;
          }
          return ret;
        };
      });
      var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
      jQuery.fn.extend({
        prop: function(name, value) {
          return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
          return this.each(function() {
            delete this[jQuery.propFix[name] || name];
          });
        }
      });
      jQuery.extend({
        prop: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
          }
          if (value !== void 0) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            return elem[name] = value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          return elem[name];
        },
        propHooks: {
          tabIndex: {
            get: function(elem) {
              var tabindex = jQuery.find.attr(elem, "tabindex");
              if (tabindex) {
                return parseInt(tabindex, 10);
              }
              if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                return 0;
              }
              return -1;
            }
          }
        },
        propFix: {
          "for": "htmlFor",
          "class": "className"
        }
      });
      if (!support2.optSelected) {
        jQuery.propHooks.selected = {
          get: function(elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
            return null;
          },
          set: function(elem) {
            var parent = elem.parentNode;
            if (parent) {
              parent.selectedIndex;
              if (parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
            }
          }
        };
      }
      jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
      });
      function stripAndCollapse(value) {
        var tokens = value.match(rnothtmlwhite) || [];
        return tokens.join(" ");
      }
      function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
      }
      function classesToArray(value) {
        if (Array.isArray(value)) {
          return value;
        }
        if (typeof value === "string") {
          return value.match(rnothtmlwhite) || [];
        }
        return [];
      }
      jQuery.fn.extend({
        addClass: function(value) {
          var classNames, cur, curValue, className, i2, finalValue;
          if (isFunction(value)) {
            return this.each(function(j2) {
              jQuery(this).addClass(value.call(this, j2, getClass(this)));
            });
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i2 = 0; i2 < classNames.length; i2++) {
                  className = classNames[i2];
                  if (cur.indexOf(" " + className + " ") < 0) {
                    cur += className + " ";
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        removeClass: function(value) {
          var classNames, cur, curValue, className, i2, finalValue;
          if (isFunction(value)) {
            return this.each(function(j2) {
              jQuery(this).removeClass(value.call(this, j2, getClass(this)));
            });
          }
          if (!arguments.length) {
            return this.attr("class", "");
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i2 = 0; i2 < classNames.length; i2++) {
                  className = classNames[i2];
                  while (cur.indexOf(" " + className + " ") > -1) {
                    cur = cur.replace(" " + className + " ", " ");
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        toggleClass: function(value, stateVal) {
          var classNames, className, i2, self, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
          if (isFunction(value)) {
            return this.each(function(i3) {
              jQuery(this).toggleClass(
                value.call(this, i3, getClass(this), stateVal),
                stateVal
              );
            });
          }
          if (typeof stateVal === "boolean" && isValidValue) {
            return stateVal ? this.addClass(value) : this.removeClass(value);
          }
          classNames = classesToArray(value);
          return this.each(function() {
            if (isValidValue) {
              self = jQuery(this);
              for (i2 = 0; i2 < classNames.length; i2++) {
                className = classNames[i2];
                if (self.hasClass(className)) {
                  self.removeClass(className);
                } else {
                  self.addClass(className);
                }
              }
            } else if (value === void 0 || type === "boolean") {
              className = getClass(this);
              if (className) {
                dataPriv.set(this, "__className__", className);
              }
              if (this.setAttribute) {
                this.setAttribute(
                  "class",
                  className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                );
              }
            }
          });
        },
        hasClass: function(selector) {
          var className, elem, i2 = 0;
          className = " " + selector + " ";
          while (elem = this[i2++]) {
            if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
              return true;
            }
          }
          return false;
        }
      });
      var rreturn = /\r/g;
      jQuery.fn.extend({
        val: function(value) {
          var hooks, ret, valueIsFunction, elem = this[0];
          if (!arguments.length) {
            if (elem) {
              hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
              if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                return ret;
              }
              ret = elem.value;
              if (typeof ret === "string") {
                return ret.replace(rreturn, "");
              }
              return ret == null ? "" : ret;
            }
            return;
          }
          valueIsFunction = isFunction(value);
          return this.each(function(i2) {
            var val;
            if (this.nodeType !== 1) {
              return;
            }
            if (valueIsFunction) {
              val = value.call(this, i2, jQuery(this).val());
            } else {
              val = value;
            }
            if (val == null) {
              val = "";
            } else if (typeof val === "number") {
              val += "";
            } else if (Array.isArray(val)) {
              val = jQuery.map(val, function(value2) {
                return value2 == null ? "" : value2 + "";
              });
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
              this.value = val;
            }
          });
        }
      });
      jQuery.extend({
        valHooks: {
          option: {
            get: function(elem) {
              var val = jQuery.find.attr(elem, "value");
              return val != null ? val : (
                // Support: IE <=10 - 11 only
                // option.text throws exceptions (trac-14686, trac-14858)
                // Strip and collapse whitespace
                // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                stripAndCollapse(jQuery.text(elem))
              );
            }
          },
          select: {
            get: function(elem) {
              var value, option, i2, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
              if (index < 0) {
                i2 = max;
              } else {
                i2 = one ? index : 0;
              }
              for (; i2 < max; i2++) {
                option = options[i2];
                if ((option.selected || i2 === index) && // Don't return options that are disabled or in a disabled optgroup
                !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                  value = jQuery(option).val();
                  if (one) {
                    return value;
                  }
                  values.push(value);
                }
              }
              return values;
            },
            set: function(elem, value) {
              var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i2 = options.length;
              while (i2--) {
                option = options[i2];
                if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                  optionSet = true;
                }
              }
              if (!optionSet) {
                elem.selectedIndex = -1;
              }
              return values;
            }
          }
        }
      });
      jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = {
          set: function(elem, value) {
            if (Array.isArray(value)) {
              return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
            }
          }
        };
        if (!support2.checkOn) {
          jQuery.valHooks[this].get = function(elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
          };
        }
      });
      var location2 = window2.location;
      var nonce = { guid: Date.now() };
      var rquery = /\?/;
      jQuery.parseXML = function(data) {
        var xml, parserErrorElem;
        if (!data || typeof data !== "string") {
          return null;
        }
        try {
          xml = new window2.DOMParser().parseFromString(data, "text/xml");
        } catch (e2) {
        }
        parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
        if (!xml || parserErrorElem) {
          jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
            return el.textContent;
          }).join("\n") : data));
        }
        return xml;
      };
      var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e2) {
        e2.stopPropagation();
      };
      jQuery.extend(jQuery.event, {
        trigger: function(event, data, elem, onlyHandlers) {
          var i2, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
          cur = lastElement = tmp = elem = elem || document2;
          if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
          }
          if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
          }
          if (type.indexOf(".") > -1) {
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
          }
          ontype = type.indexOf(":") < 0 && "on" + type;
          event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
          event.isTrigger = onlyHandlers ? 2 : 3;
          event.namespace = namespaces.join(".");
          event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
          event.result = void 0;
          if (!event.target) {
            event.target = elem;
          }
          data = data == null ? [event] : jQuery.makeArray(data, [event]);
          special = jQuery.event.special[type] || {};
          if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
            return;
          }
          if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }
            if (tmp === (elem.ownerDocument || document2)) {
              eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
            }
          }
          i2 = 0;
          while ((cur = eventPath[i2++]) && !event.isPropagationStopped()) {
            lastElement = cur;
            event.type = i2 > 1 ? bubbleType : special.bindType || type;
            handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
            if (handle) {
              handle.apply(cur, data);
            }
            handle = ontype && cur[ontype];
            if (handle && handle.apply && acceptData(cur)) {
              event.result = handle.apply(cur, data);
              if (event.result === false) {
                event.preventDefault();
              }
            }
          }
          event.type = type;
          if (!onlyHandlers && !event.isDefaultPrevented()) {
            if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
              if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                tmp = elem[ontype];
                if (tmp) {
                  elem[ontype] = null;
                }
                jQuery.event.triggered = type;
                if (event.isPropagationStopped()) {
                  lastElement.addEventListener(type, stopPropagationCallback);
                }
                elem[type]();
                if (event.isPropagationStopped()) {
                  lastElement.removeEventListener(type, stopPropagationCallback);
                }
                jQuery.event.triggered = void 0;
                if (tmp) {
                  elem[ontype] = tmp;
                }
              }
            }
          }
          return event.result;
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(type, elem, event) {
          var e2 = jQuery.extend(
            new jQuery.Event(),
            event,
            {
              type,
              isSimulated: true
            }
          );
          jQuery.event.trigger(e2, null, elem);
        }
      });
      jQuery.fn.extend({
        trigger: function(type, data) {
          return this.each(function() {
            jQuery.event.trigger(type, data, this);
          });
        },
        triggerHandler: function(type, data) {
          var elem = this[0];
          if (elem) {
            return jQuery.event.trigger(type, data, elem, true);
          }
        }
      });
      var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
      function buildParams(prefix, obj, traditional, add) {
        var name;
        if (Array.isArray(obj)) {
          jQuery.each(obj, function(i2, v2) {
            if (traditional || rbracket.test(prefix)) {
              add(prefix, v2);
            } else {
              buildParams(
                prefix + "[" + (typeof v2 === "object" && v2 != null ? i2 : "") + "]",
                v2,
                traditional,
                add
              );
            }
          });
        } else if (!traditional && toType(obj) === "object") {
          for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
          }
        } else {
          add(prefix, obj);
        }
      }
      jQuery.param = function(a2, traditional) {
        var prefix, s2 = [], add = function(key, valueOrFunction) {
          var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
          s2[s2.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };
        if (a2 == null) {
          return "";
        }
        if (Array.isArray(a2) || a2.jquery && !jQuery.isPlainObject(a2)) {
          jQuery.each(a2, function() {
            add(this.name, this.value);
          });
        } else {
          for (prefix in a2) {
            buildParams(prefix, a2[prefix], traditional, add);
          }
        }
        return s2.join("&");
      };
      jQuery.fn.extend({
        serialize: function() {
          return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
          }).filter(function() {
            var type = this.type;
            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
          }).map(function(_i, elem) {
            var val = jQuery(this).val();
            if (val == null) {
              return null;
            }
            if (Array.isArray(val)) {
              return jQuery.map(val, function(val2) {
                return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
              });
            }
            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
          }).get();
        }
      });
      var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
      originAnchor.href = location2.href;
      function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
          if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
          }
          var dataType, i2 = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
          if (isFunction(func)) {
            while (dataType = dataTypes[i2++]) {
              if (dataType[0] === "+") {
                dataType = dataType.slice(1) || "*";
                (structure[dataType] = structure[dataType] || []).unshift(func);
              } else {
                (structure[dataType] = structure[dataType] || []).push(func);
              }
            }
          }
        };
      }
      function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
          var selected;
          inspected[dataType] = true;
          jQuery.each(structure[dataType] || [], function(_2, prefilterOrFactory) {
            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
            if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
              options.dataTypes.unshift(dataTypeOrTransport);
              inspect(dataTypeOrTransport);
              return false;
            } else if (seekingTransport) {
              return !(selected = dataTypeOrTransport);
            }
          });
          return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
      }
      function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
          if (src[key] !== void 0) {
            (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
          }
        }
        if (deep) {
          jQuery.extend(true, target, deep);
        }
        return target;
      }
      function ajaxHandleResponses(s2, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s2.contents, dataTypes = s2.dataTypes;
        while (dataTypes[0] === "*") {
          dataTypes.shift();
          if (ct === void 0) {
            ct = s2.mimeType || jqXHR.getResponseHeader("Content-Type");
          }
        }
        if (ct) {
          for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
              dataTypes.unshift(type);
              break;
            }
          }
        }
        if (dataTypes[0] in responses) {
          finalDataType = dataTypes[0];
        } else {
          for (type in responses) {
            if (!dataTypes[0] || s2.converters[type + " " + dataTypes[0]]) {
              finalDataType = type;
              break;
            }
            if (!firstDataType) {
              firstDataType = type;
            }
          }
          finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
          if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
          }
          return responses[finalDataType];
        }
      }
      function ajaxConvert(s2, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s2.dataTypes.slice();
        if (dataTypes[1]) {
          for (conv in s2.converters) {
            converters[conv.toLowerCase()] = s2.converters[conv];
          }
        }
        current = dataTypes.shift();
        while (current) {
          if (s2.responseFields[current]) {
            jqXHR[s2.responseFields[current]] = response;
          }
          if (!prev && isSuccess && s2.dataFilter) {
            response = s2.dataFilter(response, s2.dataType);
          }
          prev = current;
          current = dataTypes.shift();
          if (current) {
            if (current === "*") {
              current = prev;
            } else if (prev !== "*" && prev !== current) {
              conv = converters[prev + " " + current] || converters["* " + current];
              if (!conv) {
                for (conv2 in converters) {
                  tmp = conv2.split(" ");
                  if (tmp[1] === current) {
                    conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                    if (conv) {
                      if (conv === true) {
                        conv = converters[conv2];
                      } else if (converters[conv2] !== true) {
                        current = tmp[0];
                        dataTypes.unshift(tmp[1]);
                      }
                      break;
                    }
                  }
                }
              }
              if (conv !== true) {
                if (conv && s2.throws) {
                  response = conv(response);
                } else {
                  try {
                    response = conv(response);
                  } catch (e2) {
                    return {
                      state: "parsererror",
                      error: conv ? e2 : "No conversion from " + prev + " to " + current
                    };
                  }
                }
              }
            }
          }
        }
        return { state: "success", data: response };
      }
      jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: location2.href,
          type: "GET",
          isLocal: rlocalProtocol.test(location2.protocol),
          global: true,
          processData: true,
          async: true,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": true,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": jQuery.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: true,
            context: true
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
          return settings ? (
            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
          ) : (
            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target)
          );
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
          if (typeof url === "object") {
            options = url;
            url = void 0;
          }
          options = options || {};
          var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i2, uncached, s2 = jQuery.ajaxSetup({}, options), callbackContext = s2.context || s2, globalEventContext = s2.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s2.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(key) {
              var match;
              if (completed2) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while (match = rheaders.exec(responseHeadersString)) {
                    responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                  }
                }
                match = responseHeaders[key.toLowerCase() + " "];
              }
              return match == null ? null : match.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return completed2 ? responseHeadersString : null;
            },
            // Caches the header
            setRequestHeader: function(name, value) {
              if (completed2 == null) {
                name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            // Overrides response content-type header
            overrideMimeType: function(type) {
              if (completed2 == null) {
                s2.mimeType = type;
              }
              return this;
            },
            // Status-dependent callbacks
            statusCode: function(map) {
              var code;
              if (map) {
                if (completed2) {
                  jqXHR.always(map[jqXHR.status]);
                } else {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                }
              }
              return this;
            },
            // Cancel the request
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
          deferred.promise(jqXHR);
          s2.url = ((url || s2.url || location2.href) + "").replace(rprotocol, location2.protocol + "//");
          s2.type = options.method || options.type || s2.method || s2.type;
          s2.dataTypes = (s2.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
          if (s2.crossDomain == null) {
            urlAnchor = document2.createElement("a");
            try {
              urlAnchor.href = s2.url;
              urlAnchor.href = urlAnchor.href;
              s2.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
            } catch (e2) {
              s2.crossDomain = true;
            }
          }
          if (s2.data && s2.processData && typeof s2.data !== "string") {
            s2.data = jQuery.param(s2.data, s2.traditional);
          }
          inspectPrefiltersOrTransports(prefilters, s2, options, jqXHR);
          if (completed2) {
            return jqXHR;
          }
          fireGlobals = jQuery.event && s2.global;
          if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
          }
          s2.type = s2.type.toUpperCase();
          s2.hasContent = !rnoContent.test(s2.type);
          cacheURL = s2.url.replace(rhash, "");
          if (!s2.hasContent) {
            uncached = s2.url.slice(cacheURL.length);
            if (s2.data && (s2.processData || typeof s2.data === "string")) {
              cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s2.data;
              delete s2.data;
            }
            if (s2.cache === false) {
              cacheURL = cacheURL.replace(rantiCache, "$1");
              uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
            }
            s2.url = cacheURL + uncached;
          } else if (s2.data && s2.processData && (s2.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
            s2.data = s2.data.replace(r20, "+");
          }
          if (s2.ifModified) {
            if (jQuery.lastModified[cacheURL]) {
              jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
            }
            if (jQuery.etag[cacheURL]) {
              jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
            }
          }
          if (s2.data && s2.hasContent && s2.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s2.contentType);
          }
          jqXHR.setRequestHeader(
            "Accept",
            s2.dataTypes[0] && s2.accepts[s2.dataTypes[0]] ? s2.accepts[s2.dataTypes[0]] + (s2.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s2.accepts["*"]
          );
          for (i2 in s2.headers) {
            jqXHR.setRequestHeader(i2, s2.headers[i2]);
          }
          if (s2.beforeSend && (s2.beforeSend.call(callbackContext, jqXHR, s2) === false || completed2)) {
            return jqXHR.abort();
          }
          strAbort = "abort";
          completeDeferred.add(s2.complete);
          jqXHR.done(s2.success);
          jqXHR.fail(s2.error);
          transport = inspectPrefiltersOrTransports(transports, s2, options, jqXHR);
          if (!transport) {
            done(-1, "No Transport");
          } else {
            jqXHR.readyState = 1;
            if (fireGlobals) {
              globalEventContext.trigger("ajaxSend", [jqXHR, s2]);
            }
            if (completed2) {
              return jqXHR;
            }
            if (s2.async && s2.timeout > 0) {
              timeoutTimer = window2.setTimeout(function() {
                jqXHR.abort("timeout");
              }, s2.timeout);
            }
            try {
              completed2 = false;
              transport.send(requestHeaders, done);
            } catch (e2) {
              if (completed2) {
                throw e2;
              }
              done(-1, e2);
            }
          }
          function done(status, nativeStatusText, responses, headers) {
            var isSuccess, success, error, response, modified, statusText = nativeStatusText;
            if (completed2) {
              return;
            }
            completed2 = true;
            if (timeoutTimer) {
              window2.clearTimeout(timeoutTimer);
            }
            transport = void 0;
            responseHeadersString = headers || "";
            jqXHR.readyState = status > 0 ? 4 : 0;
            isSuccess = status >= 200 && status < 300 || status === 304;
            if (responses) {
              response = ajaxHandleResponses(s2, jqXHR, responses);
            }
            if (!isSuccess && jQuery.inArray("script", s2.dataTypes) > -1 && jQuery.inArray("json", s2.dataTypes) < 0) {
              s2.converters["text script"] = function() {
              };
            }
            response = ajaxConvert(s2, response, jqXHR, isSuccess);
            if (isSuccess) {
              if (s2.ifModified) {
                modified = jqXHR.getResponseHeader("Last-Modified");
                if (modified) {
                  jQuery.lastModified[cacheURL] = modified;
                }
                modified = jqXHR.getResponseHeader("etag");
                if (modified) {
                  jQuery.etag[cacheURL] = modified;
                }
              }
              if (status === 204 || s2.type === "HEAD") {
                statusText = "nocontent";
              } else if (status === 304) {
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            } else {
              error = statusText;
              if (status || !statusText) {
                statusText = "error";
                if (status < 0) {
                  status = 0;
                }
              }
            }
            jqXHR.status = status;
            jqXHR.statusText = (nativeStatusText || statusText) + "";
            if (isSuccess) {
              deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
              deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }
            jqXHR.statusCode(statusCode);
            statusCode = void 0;
            if (fireGlobals) {
              globalEventContext.trigger(
                isSuccess ? "ajaxSuccess" : "ajaxError",
                [jqXHR, s2, isSuccess ? success : error]
              );
            }
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
            if (fireGlobals) {
              globalEventContext.trigger("ajaxComplete", [jqXHR, s2]);
              if (!--jQuery.active) {
                jQuery.event.trigger("ajaxStop");
              }
            }
          }
          return jqXHR;
        },
        getJSON: function(url, data, callback) {
          return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
          return jQuery.get(url, void 0, callback, "script");
        }
      });
      jQuery.each(["get", "post"], function(_i, method) {
        jQuery[method] = function(url, data, callback, type) {
          if (isFunction(data)) {
            type = type || callback;
            callback = data;
            data = void 0;
          }
          return jQuery.ajax(jQuery.extend({
            url,
            type: method,
            dataType: type,
            data,
            success: callback
          }, jQuery.isPlainObject(url) && url));
        };
      });
      jQuery.ajaxPrefilter(function(s2) {
        var i2;
        for (i2 in s2.headers) {
          if (i2.toLowerCase() === "content-type") {
            s2.contentType = s2.headers[i2] || "";
          }
        }
      });
      jQuery._evalUrl = function(url, options, doc) {
        return jQuery.ajax({
          url,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: true,
          async: false,
          global: false,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(response) {
            jQuery.globalEval(response, options, doc);
          }
        });
      };
      jQuery.fn.extend({
        wrapAll: function(html) {
          var wrap;
          if (this[0]) {
            if (isFunction(html)) {
              html = html.call(this[0]);
            }
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
            if (this[0].parentNode) {
              wrap.insertBefore(this[0]);
            }
            wrap.map(function() {
              var elem = this;
              while (elem.firstElementChild) {
                elem = elem.firstElementChild;
              }
              return elem;
            }).append(this);
          }
          return this;
        },
        wrapInner: function(html) {
          if (isFunction(html)) {
            return this.each(function(i2) {
              jQuery(this).wrapInner(html.call(this, i2));
            });
          }
          return this.each(function() {
            var self = jQuery(this), contents = self.contents();
            if (contents.length) {
              contents.wrapAll(html);
            } else {
              self.append(html);
            }
          });
        },
        wrap: function(html) {
          var htmlIsFunction = isFunction(html);
          return this.each(function(i2) {
            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i2) : html);
          });
        },
        unwrap: function(selector) {
          this.parent(selector).not("body").each(function() {
            jQuery(this).replaceWith(this.childNodes);
          });
          return this;
        }
      });
      jQuery.expr.pseudos.hidden = function(elem) {
        return !jQuery.expr.pseudos.visible(elem);
      };
      jQuery.expr.pseudos.visible = function(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      };
      jQuery.ajaxSettings.xhr = function() {
        try {
          return new window2.XMLHttpRequest();
        } catch (e2) {
        }
      };
      var xhrSuccessStatus = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, xhrSupported = jQuery.ajaxSettings.xhr();
      support2.cors = !!xhrSupported && "withCredentials" in xhrSupported;
      support2.ajax = xhrSupported = !!xhrSupported;
      jQuery.ajaxTransport(function(options) {
        var callback, errorCallback;
        if (support2.cors || xhrSupported && !options.crossDomain) {
          return {
            send: function(headers, complete) {
              var i2, xhr = options.xhr();
              xhr.open(
                options.type,
                options.url,
                options.async,
                options.username,
                options.password
              );
              if (options.xhrFields) {
                for (i2 in options.xhrFields) {
                  xhr[i2] = options.xhrFields[i2];
                }
              }
              if (options.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }
              if (!options.crossDomain && !headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
              for (i2 in headers) {
                xhr.setRequestHeader(i2, headers[i2]);
              }
              callback = function(type) {
                return function() {
                  if (callback) {
                    callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                    if (type === "abort") {
                      xhr.abort();
                    } else if (type === "error") {
                      if (typeof xhr.status !== "number") {
                        complete(0, "error");
                      } else {
                        complete(
                          // File: protocol always yields status 0; see trac-8605, trac-14207
                          xhr.status,
                          xhr.statusText
                        );
                      }
                    } else {
                      complete(
                        xhrSuccessStatus[xhr.status] || xhr.status,
                        xhr.statusText,
                        // Support: IE <=9 only
                        // IE9 has no XHR2 but throws on binary (trac-11426)
                        // For XHR2 non-text, let the caller handle it (gh-2498)
                        (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                        xhr.getAllResponseHeaders()
                      );
                    }
                  }
                };
              };
              xhr.onload = callback();
              errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
              if (xhr.onabort !== void 0) {
                xhr.onabort = errorCallback;
              } else {
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    window2.setTimeout(function() {
                      if (callback) {
                        errorCallback();
                      }
                    });
                  }
                };
              }
              callback = callback("abort");
              try {
                xhr.send(options.hasContent && options.data || null);
              } catch (e2) {
                if (callback) {
                  throw e2;
                }
              }
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      jQuery.ajaxPrefilter(function(s2) {
        if (s2.crossDomain) {
          s2.contents.script = false;
        }
      });
      jQuery.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(text) {
            jQuery.globalEval(text);
            return text;
          }
        }
      });
      jQuery.ajaxPrefilter("script", function(s2) {
        if (s2.cache === void 0) {
          s2.cache = false;
        }
        if (s2.crossDomain) {
          s2.type = "GET";
        }
      });
      jQuery.ajaxTransport("script", function(s2) {
        if (s2.crossDomain || s2.scriptAttrs) {
          var script, callback;
          return {
            send: function(_2, complete) {
              script = jQuery("<script>").attr(s2.scriptAttrs || {}).prop({ charset: s2.scriptCharset, src: s2.url }).on("load error", callback = function(evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              });
              document2.head.appendChild(script[0]);
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
      jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
          this[callback] = true;
          return callback;
        }
      });
      jQuery.ajaxPrefilter("json jsonp", function(s2, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s2.jsonp !== false && (rjsonp.test(s2.url) ? "url" : typeof s2.data === "string" && (s2.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s2.data) && "data");
        if (jsonProp || s2.dataTypes[0] === "jsonp") {
          callbackName = s2.jsonpCallback = isFunction(s2.jsonpCallback) ? s2.jsonpCallback() : s2.jsonpCallback;
          if (jsonProp) {
            s2[jsonProp] = s2[jsonProp].replace(rjsonp, "$1" + callbackName);
          } else if (s2.jsonp !== false) {
            s2.url += (rquery.test(s2.url) ? "&" : "?") + s2.jsonp + "=" + callbackName;
          }
          s2.converters["script json"] = function() {
            if (!responseContainer) {
              jQuery.error(callbackName + " was not called");
            }
            return responseContainer[0];
          };
          s2.dataTypes[0] = "json";
          overwritten = window2[callbackName];
          window2[callbackName] = function() {
            responseContainer = arguments;
          };
          jqXHR.always(function() {
            if (overwritten === void 0) {
              jQuery(window2).removeProp(callbackName);
            } else {
              window2[callbackName] = overwritten;
            }
            if (s2[callbackName]) {
              s2.jsonpCallback = originalSettings.jsonpCallback;
              oldCallbacks.push(callbackName);
            }
            if (responseContainer && isFunction(overwritten)) {
              overwritten(responseContainer[0]);
            }
            responseContainer = overwritten = void 0;
          });
          return "script";
        }
      });
      support2.createHTMLDocument = (function() {
        var body = document2.implementation.createHTMLDocument("").body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
      })();
      jQuery.parseHTML = function(data, context, keepScripts) {
        if (typeof data !== "string") {
          return [];
        }
        if (typeof context === "boolean") {
          keepScripts = context;
          context = false;
        }
        var base2, parsed, scripts;
        if (!context) {
          if (support2.createHTMLDocument) {
            context = document2.implementation.createHTMLDocument("");
            base2 = context.createElement("base");
            base2.href = document2.location.href;
            context.head.appendChild(base2);
          } else {
            context = document2;
          }
        }
        parsed = rsingleTag.exec(data);
        scripts = !keepScripts && [];
        if (parsed) {
          return [context.createElement(parsed[1])];
        }
        parsed = buildFragment([data], context, scripts);
        if (scripts && scripts.length) {
          jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
      };
      jQuery.fn.load = function(url, params, callback) {
        var selector, type, response, self = this, off = url.indexOf(" ");
        if (off > -1) {
          selector = stripAndCollapse(url.slice(off));
          url = url.slice(0, off);
        }
        if (isFunction(params)) {
          callback = params;
          params = void 0;
        } else if (params && typeof params === "object") {
          type = "POST";
        }
        if (self.length > 0) {
          jQuery.ajax({
            url,
            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
          }).done(function(responseText) {
            response = arguments;
            self.html(selector ? (
              // If a selector was specified, locate the right elements in a dummy div
              // Exclude scripts to avoid IE 'Permission Denied' errors
              jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
            ) : (
              // Otherwise use the full result
              responseText
            ));
          }).always(callback && function(jqXHR, status) {
            self.each(function() {
              callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
            });
          });
        }
        return this;
      };
      jQuery.expr.pseudos.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        }).length;
      };
      jQuery.offset = {
        setOffset: function(elem, options, i2) {
          var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
          if (position === "static") {
            elem.style.position = "relative";
          }
          curOffset = curElem.offset();
          curCSSTop = jQuery.css(elem, "top");
          curCSSLeft = jQuery.css(elem, "left");
          calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
          if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
          } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
          }
          if (isFunction(options)) {
            options = options.call(elem, i2, jQuery.extend({}, curOffset));
          }
          if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
          }
          if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
          }
          if ("using" in options) {
            options.using.call(elem, props);
          } else {
            curElem.css(props);
          }
        }
      };
      jQuery.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(options) {
          if (arguments.length) {
            return options === void 0 ? this : this.each(function(i2) {
              jQuery.offset.setOffset(this, options, i2);
            });
          }
          var rect, win, elem = this[0];
          if (!elem) {
            return;
          }
          if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
          }
          rect = elem.getBoundingClientRect();
          win = elem.ownerDocument.defaultView;
          return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
          };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (!this[0]) {
            return;
          }
          var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
          if (jQuery.css(elem, "position") === "fixed") {
            offset = elem.getBoundingClientRect();
          } else {
            offset = this.offset();
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
              parentOffset = jQuery(offsetParent).offset();
              parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
              parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
            }
          }
          return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
          };
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            var offsetParent = this.offsetParent;
            while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || documentElement2;
          });
        }
      });
      jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
          return access(this, function(elem, method2, val2) {
            var win;
            if (isWindow(elem)) {
              win = elem;
            } else if (elem.nodeType === 9) {
              win = elem.defaultView;
            }
            if (val2 === void 0) {
              return win ? win[prop] : elem[method2];
            }
            if (win) {
              win.scrollTo(
                !top ? val2 : win.pageXOffset,
                top ? val2 : win.pageYOffset
              );
            } else {
              elem[method2] = val2;
            }
          }, method, val, arguments.length);
        };
      });
      jQuery.each(["top", "left"], function(_i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(
          support2.pixelPosition,
          function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
          }
        );
      });
      jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
        jQuery.each({
          padding: "inner" + name,
          content: type,
          "": "outer" + name
        }, function(defaultExtra, funcName) {
          jQuery.fn[funcName] = function(margin, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
            return access(this, function(elem, type2, value2) {
              var doc;
              if (isWindow(elem)) {
                return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
              }
              if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                  elem.body["scroll" + name],
                  doc["scroll" + name],
                  elem.body["offset" + name],
                  doc["offset" + name],
                  doc["client" + name]
                );
              }
              return value2 === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                jQuery.css(elem, type2, extra)
              ) : (
                // Set width or height on the element
                jQuery.style(elem, type2, value2, extra)
              );
            }, type, chainable ? margin : void 0, chainable);
          };
        });
      });
      jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(_i, type) {
        jQuery.fn[type] = function(fn) {
          return this.on(type, fn);
        };
      });
      jQuery.fn.extend({
        bind: function(types, data, fn) {
          return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
          return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
          return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
          return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        hover: function(fnOver, fnOut) {
          return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
        }
      });
      jQuery.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(_i, name) {
          jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
          };
        }
      );
      var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      jQuery.proxy = function(fn, context) {
        var tmp, args, proxy;
        if (typeof context === "string") {
          tmp = fn[context];
          context = fn;
          fn = tmp;
        }
        if (!isFunction(fn)) {
          return void 0;
        }
        args = slice.call(arguments, 2);
        proxy = function() {
          return fn.apply(context || this, args.concat(slice.call(arguments)));
        };
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;
        return proxy;
      };
      jQuery.holdReady = function(hold) {
        if (hold) {
          jQuery.readyWait++;
        } else {
          jQuery.ready(true);
        }
      };
      jQuery.isArray = Array.isArray;
      jQuery.parseJSON = JSON.parse;
      jQuery.nodeName = nodeName;
      jQuery.isFunction = isFunction;
      jQuery.isWindow = isWindow;
      jQuery.camelCase = camelCase;
      jQuery.type = toType;
      jQuery.now = Date.now;
      jQuery.isNumeric = function(obj) {
        var type = jQuery.type(obj);
        return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj));
      };
      jQuery.trim = function(text) {
        return text == null ? "" : (text + "").replace(rtrim, "$1");
      };
      var _jQuery = window2.jQuery, _$ = window2.$;
      jQuery.noConflict = function(deep) {
        if (window2.$ === jQuery) {
          window2.$ = _$;
        }
        if (deep && window2.jQuery === jQuery) {
          window2.jQuery = _jQuery;
        }
        return jQuery;
      };
      if (typeof noGlobal === "undefined") {
        window2.jQuery = window2.$ = jQuery;
      }
      return jQuery;
    });
  })(jquery$1);
  return jquery$1.exports;
}
var jqueryExports = requireJquery();
const $ = /* @__PURE__ */ getDefaultExportFromCjs(jqueryExports);
function rtl() {
  return $("html").attr("dir") === "rtl";
}
function GetYoDigits(length = 6, namespace) {
  let str = "";
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const charsLength = chars.length;
  for (let i2 = 0; i2 < length; i2++) {
    str += chars[Math.floor(Math.random() * charsLength)];
  }
  return namespace ? `${str}-${namespace}` : str;
}
function RegExpEscape(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function transitionend($elem) {
  var transitions = {
    "transition": "transitionend",
    "WebkitTransition": "webkitTransitionEnd",
    "MozTransition": "transitionend",
    "OTransition": "otransitionend"
  };
  var elem = document.createElement("div"), end;
  for (let transition2 in transitions) {
    if (typeof elem.style[transition2] !== "undefined") {
      end = transitions[transition2];
    }
  }
  if (end) {
    return end;
  } else {
    setTimeout(function() {
      $elem.triggerHandler("transitionend", [$elem]);
    }, 1);
    return "transitionend";
  }
}
function onLoad($elem, handler) {
  const didLoad = document.readyState === "complete";
  const eventType = (didLoad ? "_didLoad" : "load") + ".zf.util.onLoad";
  const cb = () => $elem.triggerHandler(eventType);
  if ($elem) {
    if (handler) $elem.one(eventType, handler);
    if (didLoad)
      setTimeout(cb);
    else
      $(window).one("load", cb);
  }
  return eventType;
}
function ignoreMousedisappear(handler, { ignoreLeaveWindow = false, ignoreReappear = false } = {}) {
  return function leaveEventHandler(eLeave, ...rest) {
    const callback = handler.bind(this, eLeave, ...rest);
    if (eLeave.relatedTarget !== null) {
      return callback();
    }
    setTimeout(function leaveEventDebouncer() {
      if (!ignoreLeaveWindow && document.hasFocus && !document.hasFocus()) {
        return callback();
      }
      if (!ignoreReappear) {
        $(document).one("mouseenter", function reenterEventHandler(eReenter) {
          if (!$(eLeave.currentTarget).has(eReenter.target).length) {
            eLeave.relatedTarget = eReenter.target;
            callback();
          }
        });
      }
    }, 0);
  };
}
window.matchMedia || (window.matchMedia = (function() {
  var styleMedia = window.styleMedia || window.media;
  if (!styleMedia) {
    var style = document.createElement("style"), script = document.getElementsByTagName("script")[0], info = null;
    style.type = "text/css";
    style.id = "matchmediajs-test";
    if (!script) {
      document.head.appendChild(style);
    } else {
      script.parentNode.insertBefore(style, script);
    }
    info = "getComputedStyle" in window && window.getComputedStyle(style, null) || style.currentStyle;
    styleMedia = {
      matchMedium: function(media) {
        var text = "@media " + media + "{ #matchmediajs-test { width: 1px; } }";
        if (style.styleSheet) {
          style.styleSheet.cssText = text;
        } else {
          style.textContent = text;
        }
        return info.width === "1px";
      }
    };
  }
  return function(media) {
    return {
      matches: styleMedia.matchMedium(media || "all"),
      media: media || "all"
    };
  };
})());
var MediaQuery = {
  queries: [],
  current: "",
  /**
   * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
   * @function
   * @private
   */
  _init() {
    if (this.isInitialized === true) {
      return this;
    } else {
      this.isInitialized = true;
    }
    var self = this;
    var $meta = $("meta.foundation-mq");
    if (!$meta.length) {
      $('<meta class="foundation-mq" name="foundation-mq" content>').appendTo(document.head);
    }
    var extractedStyles = $(".foundation-mq").css("font-family");
    var namedQueries;
    namedQueries = parseStyleToObject(extractedStyles);
    self.queries = [];
    for (var key in namedQueries) {
      if (namedQueries.hasOwnProperty(key)) {
        self.queries.push({
          name: key,
          value: `only screen and (min-width: ${namedQueries[key]})`
        });
      }
    }
    this.current = this._getCurrentSize();
    this._watcher();
  },
  /**
   * Reinitializes the media query helper.
   * Useful if your CSS breakpoint configuration has just been loaded or has changed since the initialization.
   * @function
   * @private
   */
  _reInit() {
    this.isInitialized = false;
    this._init();
  },
  /**
   * Checks if the screen is at least as wide as a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
   */
  atLeast(size) {
    var query = this.get(size);
    if (query) {
      return window.matchMedia(query).matches;
    }
    return false;
  },
  /**
   * Checks if the screen is within the given breakpoint.
   * If smaller than the breakpoint of larger than its upper limit it returns false.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` otherwise.
   */
  only(size) {
    return size === this._getCurrentSize();
  },
  /**
   * Checks if the screen is within a breakpoint or smaller.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it's larger.
   */
  upTo(size) {
    const nextSize = this.next(size);
    if (nextSize) {
      return !this.atLeast(nextSize);
    }
    return true;
  },
  /**
   * Checks if the screen matches to a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check, either 'small only' or 'small'. Omitting 'only' falls back to using atLeast() method.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it does not.
   */
  is(size) {
    const parts = size.trim().split(" ").filter((p2) => !!p2.length);
    const [bpSize, bpModifier = ""] = parts;
    if (bpModifier === "only") {
      return this.only(bpSize);
    }
    if (!bpModifier || bpModifier === "up") {
      return this.atLeast(bpSize);
    }
    if (bpModifier === "down") {
      return this.upTo(bpSize);
    }
    throw new Error(`
      Invalid breakpoint passed to MediaQuery.is().
      Expected a breakpoint name formatted like "<size> <modifier>", got "${size}".
    `);
  },
  /**
   * Gets the media query of a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to get.
   * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
   */
  get(size) {
    for (var i2 in this.queries) {
      if (this.queries.hasOwnProperty(i2)) {
        var query = this.queries[i2];
        if (size === query.name) return query.value;
      }
    }
    return null;
  },
  /**
   * Get the breakpoint following the given breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint.
   * @returns {String|null} - The name of the following breakpoint, or `null` if the passed breakpoint was the last one.
   */
  next(size) {
    const queryIndex = this.queries.findIndex((q2) => this._getQueryName(q2) === size);
    if (queryIndex === -1) {
      throw new Error(`
        Unknown breakpoint "${size}" passed to MediaQuery.next().
        Ensure it is present in your Sass "$breakpoints" setting.
      `);
    }
    const nextQuery = this.queries[queryIndex + 1];
    return nextQuery ? nextQuery.name : null;
  },
  /**
   * Returns the name of the breakpoint related to the given value.
   * @function
   * @private
   * @param {String|Object} value - Breakpoint name or query object.
   * @returns {String} Name of the breakpoint.
   */
  _getQueryName(value) {
    if (typeof value === "string")
      return value;
    if (typeof value === "object")
      return value.name;
    throw new TypeError(`
      Invalid value passed to MediaQuery._getQueryName().
      Expected a breakpoint name (String) or a breakpoint query (Object), got "${value}" (${typeof value})
    `);
  },
  /**
   * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
   * @function
   * @private
   * @returns {String} Name of the current breakpoint.
   */
  _getCurrentSize() {
    var matched;
    for (var i2 = 0; i2 < this.queries.length; i2++) {
      var query = this.queries[i2];
      if (window.matchMedia(query.value).matches) {
        matched = query;
      }
    }
    return matched && this._getQueryName(matched);
  },
  /**
   * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
   * @function
   * @private
   */
  _watcher() {
    $(window).on("resize.zf.trigger", () => {
      var newSize = this._getCurrentSize(), currentSize = this.current;
      if (newSize !== currentSize) {
        this.current = newSize;
        $(window).trigger("changed.zf.mediaquery", [newSize, currentSize]);
      }
    });
  }
};
function parseStyleToObject(str) {
  var styleObject = {};
  if (typeof str !== "string") {
    return styleObject;
  }
  str = str.trim().slice(1, -1);
  if (!str) {
    return styleObject;
  }
  styleObject = str.split("&").reduce(function(ret, param) {
    var parts = param.replace(/\+/g, " ").split("=");
    var key = parts[0];
    var val = parts[1];
    key = decodeURIComponent(key);
    val = typeof val === "undefined" ? null : decodeURIComponent(val);
    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
    return ret;
  }, {});
  return styleObject;
}
var FOUNDATION_VERSION = "6.9.0";
var Foundation = {
  version: FOUNDATION_VERSION,
  /**
   * Stores initialized plugins.
   */
  _plugins: {},
  /**
   * Stores generated unique ids for plugin instances
   */
  _uuids: [],
  /**
   * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
   * @param {Object} plugin - The constructor of the plugin.
   */
  plugin: function(plugin, name) {
    var className = name || functionName(plugin);
    var attrName = hyphenate$1(className);
    this._plugins[attrName] = this[className] = plugin;
  },
  /**
   * @function
   * Populates the _uuids array with pointers to each individual plugin instance.
   * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
   * Also fires the initialization event for each plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @param {String} name - the name of the plugin, passed as a camelCased string.
   * @fires Plugin#init
   */
  registerPlugin: function(plugin, name) {
    var pluginName = name ? hyphenate$1(name) : functionName(plugin.constructor).toLowerCase();
    plugin.uuid = GetYoDigits(6, pluginName);
    if (!plugin.$element.attr(`data-${pluginName}`)) {
      plugin.$element.attr(`data-${pluginName}`, plugin.uuid);
    }
    if (!plugin.$element.data("zfPlugin")) {
      plugin.$element.data("zfPlugin", plugin);
    }
    plugin.$element.trigger(`init.zf.${pluginName}`);
    this._uuids.push(plugin.uuid);
    return;
  },
  /**
   * @function
   * Removes the plugins uuid from the _uuids array.
   * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
   * Also fires the destroyed event for the plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @fires Plugin#destroyed
   */
  unregisterPlugin: function(plugin) {
    var pluginName = hyphenate$1(functionName(plugin.$element.data("zfPlugin").constructor));
    this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
    plugin.$element.removeAttr(`data-${pluginName}`).removeData("zfPlugin").trigger(`destroyed.zf.${pluginName}`);
    for (var prop in plugin) {
      if (typeof plugin[prop] === "function") {
        plugin[prop] = null;
      }
    }
    return;
  },
  /**
   * @function
   * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
   * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
   * @default If no argument is passed, reflow all currently active plugins.
   */
  reInit: function(plugins2) {
    var isJQ = plugins2 instanceof $;
    try {
      if (isJQ) {
        plugins2.each(function() {
          $(this).data("zfPlugin")._init();
        });
      } else {
        var type = typeof plugins2, _this = this, fns = {
          "object": function(plgs) {
            plgs.forEach(function(p2) {
              p2 = hyphenate$1(p2);
              $("[data-" + p2 + "]").foundation("_init");
            });
          },
          "string": function() {
            plugins2 = hyphenate$1(plugins2);
            $("[data-" + plugins2 + "]").foundation("_init");
          },
          "undefined": function() {
            this.object(Object.keys(_this._plugins));
          }
        };
        fns[type](plugins2);
      }
    } catch (err) {
      console.error(err);
    } finally {
      return plugins2;
    }
  },
  /**
   * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
   * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
   * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
   */
  reflow: function(elem, plugins2) {
    if (typeof plugins2 === "undefined") {
      plugins2 = Object.keys(this._plugins);
    } else if (typeof plugins2 === "string") {
      plugins2 = [plugins2];
    }
    var _this = this;
    $.each(plugins2, function(i2, name) {
      var plugin = _this._plugins[name];
      var $elem = $(elem).find("[data-" + name + "]").addBack("[data-" + name + "]").filter(function() {
        return typeof $(this).data("zfPlugin") === "undefined";
      });
      $elem.each(function() {
        var $el = $(this), opts = { reflow: true };
        if ($el.attr("data-options")) {
          $el.attr("data-options").split(";").forEach(function(option) {
            var opt = option.split(":").map(function(el) {
              return el.trim();
            });
            if (opt[0]) opts[opt[0]] = parseValue(opt[1]);
          });
        }
        try {
          $el.data("zfPlugin", new plugin($(this), opts));
        } catch (er) {
          console.error(er);
        } finally {
          return;
        }
      });
    });
  },
  getFnName: functionName,
  addToJquery: function() {
    var foundation = function(method) {
      var type = typeof method, $noJS = $(".no-js");
      if ($noJS.length) {
        $noJS.removeClass("no-js");
      }
      if (type === "undefined") {
        MediaQuery._init();
        Foundation.reflow(this);
      } else if (type === "string") {
        var args = Array.prototype.slice.call(arguments, 1);
        var plugClass = this.data("zfPlugin");
        if (typeof plugClass !== "undefined" && typeof plugClass[method] !== "undefined") {
          if (this.length === 1) {
            plugClass[method].apply(plugClass, args);
          } else {
            this.each(function(i2, el) {
              plugClass[method].apply($(el).data("zfPlugin"), args);
            });
          }
        } else {
          throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : "this element") + ".");
        }
      } else {
        throw new TypeError(`We're sorry, ${type} is not a valid parameter. You must use a string representing the method you wish to invoke.`);
      }
      return this;
    };
    $.fn.foundation = foundation;
    return $;
  }
};
Foundation.util = {
  /**
   * Function for applying a debounce effect to a function call.
   * @function
   * @param {Function} func - Function to be called at end of timeout.
   * @param {Number} delay - Time in ms to delay the call of `func`.
   * @returns function
   */
  throttle: function(func, delay) {
    var timer = null;
    return function() {
      var context = this, args = arguments;
      if (timer === null) {
        timer = setTimeout(function() {
          func.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  }
};
window.Foundation = Foundation;
(function() {
  if (!Date.now || !window.Date.now)
    window.Date.now = Date.now = function() {
      return (/* @__PURE__ */ new Date()).getTime();
    };
  var vendors = ["webkit", "moz"];
  for (var i2 = 0; i2 < vendors.length && !window.requestAnimationFrame; ++i2) {
    var vp = vendors[i2];
    window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vp + "CancelAnimationFrame"] || window[vp + "CancelRequestAnimationFrame"];
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      var now2 = Date.now();
      var nextTime = Math.max(lastTime + 16, now2);
      return setTimeout(
        function() {
          callback(lastTime = nextTime);
        },
        nextTime - now2
      );
    };
    window.cancelAnimationFrame = clearTimeout;
  }
  if (!window.performance || !window.performance.now) {
    window.performance = {
      start: Date.now(),
      now: function() {
        return Date.now() - this.start;
      }
    };
  }
})();
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
    }, fBound = function() {
      return fToBind.apply(
        this instanceof fNOP ? this : oThis,
        aArgs.concat(Array.prototype.slice.call(arguments))
      );
    };
    if (this.prototype) {
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();
    return fBound;
  };
}
function functionName(fn) {
  if (typeof Function.prototype.name === "undefined") {
    var funcNameRegex = /function\s([^(]{1,})\(/;
    var results = funcNameRegex.exec(fn.toString());
    return results && results.length > 1 ? results[1].trim() : "";
  } else if (typeof fn.prototype === "undefined") {
    return fn.constructor.name;
  } else {
    return fn.prototype.constructor.name;
  }
}
function parseValue(str) {
  if ("true" === str) return true;
  else if ("false" === str) return false;
  else if (!isNaN(str * 1)) return parseFloat(str);
  return str;
}
function hyphenate$1(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
const keyCodes = {
  9: "TAB",
  13: "ENTER",
  27: "ESCAPE",
  32: "SPACE",
  35: "END",
  36: "HOME",
  37: "ARROW_LEFT",
  38: "ARROW_UP",
  39: "ARROW_RIGHT",
  40: "ARROW_DOWN"
};
var commands = {};
function findFocusable($element) {
  if (!$element) {
    return false;
  }
  return $element.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter(function() {
    if (!$(this).is(":visible") || $(this).attr("tabindex") < 0) {
      return false;
    }
    return true;
  }).sort(function(a2, b2) {
    if ($(a2).attr("tabindex") === $(b2).attr("tabindex")) {
      return 0;
    }
    let aTabIndex = parseInt($(a2).attr("tabindex"), 10), bTabIndex = parseInt($(b2).attr("tabindex"), 10);
    if (typeof $(a2).attr("tabindex") === "undefined" && bTabIndex > 0) {
      return 1;
    }
    if (typeof $(b2).attr("tabindex") === "undefined" && aTabIndex > 0) {
      return -1;
    }
    if (aTabIndex === 0 && bTabIndex > 0) {
      return 1;
    }
    if (bTabIndex === 0 && aTabIndex > 0) {
      return -1;
    }
    if (aTabIndex < bTabIndex) {
      return -1;
    }
    if (aTabIndex > bTabIndex) {
      return 1;
    }
  });
}
function parseKey(event) {
  var key = keyCodes[event.which || event.keyCode] || String.fromCharCode(event.which).toUpperCase();
  key = key.replace(/\W+/, "");
  if (event.shiftKey) key = `SHIFT_${key}`;
  if (event.ctrlKey) key = `CTRL_${key}`;
  if (event.altKey) key = `ALT_${key}`;
  key = key.replace(/_$/, "");
  return key;
}
var Keyboard = {
  keys: getKeyCodes(keyCodes),
  /**
   * Parses the (keyboard) event and returns a String that represents its key
   * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
   * @param {Event} event - the event generated by the event handler
   * @return String key - String that represents the key pressed
   */
  parseKey,
  /**
   * Handles the given (keyboard) event
   * @param {Event} event - the event generated by the event handler
   * @param {String} component - Foundation component's name, e.g. Slider or Reveal
   * @param {Objects} functions - collection of functions that are to be executed
   */
  handleKey(event, component, functions) {
    var commandList = commands[component], keyCode = this.parseKey(event), cmds, command, fn;
    if (!commandList) return console.warn("Component not defined!");
    if (event.zfIsKeyHandled === true) return;
    if (typeof commandList.ltr === "undefined") {
      cmds = commandList;
    } else {
      if (rtl()) cmds = $.extend({}, commandList.ltr, commandList.rtl);
      else cmds = $.extend({}, commandList.rtl, commandList.ltr);
    }
    command = cmds[keyCode];
    fn = functions[command];
    if (fn && typeof fn === "function") {
      var returnValue = fn.apply();
      event.zfIsKeyHandled = true;
      if (functions.handled || typeof functions.handled === "function") {
        functions.handled(returnValue);
      }
    } else {
      if (functions.unhandled || typeof functions.unhandled === "function") {
        functions.unhandled();
      }
    }
  },
  /**
   * Finds all focusable elements within the given `$element`
   * @param {jQuery} $element - jQuery object to search within
   * @return {jQuery} $focusable - all focusable elements within `$element`
   */
  findFocusable,
  /**
   * Returns the component name name
   * @param {Object} component - Foundation component, e.g. Slider or Reveal
   * @return String componentName
   */
  register(componentName, cmds) {
    commands[componentName] = cmds;
  },
  // TODO9438: These references to Keyboard need to not require global. Will 'this' work in this context?
  //
  /**
   * Traps the focus in the given element.
   * @param  {jQuery} $element  jQuery object to trap the foucs into.
   */
  trapFocus($element) {
    var $focusable = findFocusable($element), $firstFocusable = $focusable.eq(0), $lastFocusable = $focusable.eq(-1);
    $element.on("keydown.zf.trapfocus", function(event) {
      if (event.target === $lastFocusable[0] && parseKey(event) === "TAB") {
        event.preventDefault();
        $firstFocusable.focus();
      } else if (event.target === $firstFocusable[0] && parseKey(event) === "SHIFT_TAB") {
        event.preventDefault();
        $lastFocusable.focus();
      }
    });
  },
  /**
   * Releases the trapped focus from the given element.
   * @param  {jQuery} $element  jQuery object to release the focus for.
   */
  releaseFocus($element) {
    $element.off("keydown.zf.trapfocus");
  }
};
function getKeyCodes(kcs) {
  var k2 = {};
  for (var kc in kcs) {
    if (kcs.hasOwnProperty(kc)) k2[kcs[kc]] = kcs[kc];
  }
  return k2;
}
var Box = {
  ImNotTouchingYou,
  OverlapArea,
  GetDimensions,
  GetExplicitOffsets
};
function ImNotTouchingYou(element, parent, lrOnly, tbOnly, ignoreBottom) {
  return OverlapArea(element, parent, lrOnly, tbOnly, ignoreBottom) === 0;
}
function OverlapArea(element, parent, lrOnly, tbOnly, ignoreBottom) {
  var eleDims = GetDimensions(element), topOver, bottomOver, leftOver, rightOver;
  if (parent) {
    var parDims = GetDimensions(parent);
    bottomOver = parDims.height + parDims.offset.top - (eleDims.offset.top + eleDims.height);
    topOver = eleDims.offset.top - parDims.offset.top;
    leftOver = eleDims.offset.left - parDims.offset.left;
    rightOver = parDims.width + parDims.offset.left - (eleDims.offset.left + eleDims.width);
  } else {
    bottomOver = eleDims.windowDims.height + eleDims.windowDims.offset.top - (eleDims.offset.top + eleDims.height);
    topOver = eleDims.offset.top - eleDims.windowDims.offset.top;
    leftOver = eleDims.offset.left - eleDims.windowDims.offset.left;
    rightOver = eleDims.windowDims.width - (eleDims.offset.left + eleDims.width);
  }
  bottomOver = ignoreBottom ? 0 : Math.min(bottomOver, 0);
  topOver = Math.min(topOver, 0);
  leftOver = Math.min(leftOver, 0);
  rightOver = Math.min(rightOver, 0);
  if (lrOnly) {
    return leftOver + rightOver;
  }
  if (tbOnly) {
    return topOver + bottomOver;
  }
  return Math.sqrt(topOver * topOver + bottomOver * bottomOver + leftOver * leftOver + rightOver * rightOver);
}
function GetDimensions(elem) {
  elem = elem.length ? elem[0] : elem;
  if (elem === window || elem === document) {
    throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
  }
  var rect = elem.getBoundingClientRect(), parRect = elem.parentNode.getBoundingClientRect(), winRect = document.body.getBoundingClientRect(), winY = window.pageYOffset, winX = window.pageXOffset;
  return {
    width: rect.width,
    height: rect.height,
    offset: {
      top: rect.top + winY,
      left: rect.left + winX
    },
    parentDims: {
      width: parRect.width,
      height: parRect.height,
      offset: {
        top: parRect.top + winY,
        left: parRect.left + winX
      }
    },
    windowDims: {
      width: winRect.width,
      height: winRect.height,
      offset: {
        top: winY,
        left: winX
      }
    }
  };
}
function GetExplicitOffsets(element, anchor, position, alignment, vOffset, hOffset, isOverflow) {
  var $eleDims = GetDimensions(element), $anchorDims = anchor ? GetDimensions(anchor) : null;
  var topVal, leftVal;
  if ($anchorDims !== null) {
    switch (position) {
      case "top":
        topVal = $anchorDims.offset.top - ($eleDims.height + vOffset);
        break;
      case "bottom":
        topVal = $anchorDims.offset.top + $anchorDims.height + vOffset;
        break;
      case "left":
        leftVal = $anchorDims.offset.left - ($eleDims.width + hOffset);
        break;
      case "right":
        leftVal = $anchorDims.offset.left + $anchorDims.width + hOffset;
        break;
    }
    switch (position) {
      case "top":
      case "bottom":
        switch (alignment) {
          case "left":
            leftVal = $anchorDims.offset.left + hOffset;
            break;
          case "right":
            leftVal = $anchorDims.offset.left - $eleDims.width + $anchorDims.width - hOffset;
            break;
          case "center":
            leftVal = isOverflow ? hOffset : $anchorDims.offset.left + $anchorDims.width / 2 - $eleDims.width / 2 + hOffset;
            break;
        }
        break;
      case "right":
      case "left":
        switch (alignment) {
          case "bottom":
            topVal = $anchorDims.offset.top - vOffset + $anchorDims.height - $eleDims.height;
            break;
          case "top":
            topVal = $anchorDims.offset.top + vOffset;
            break;
          case "center":
            topVal = $anchorDims.offset.top + vOffset + $anchorDims.height / 2 - $eleDims.height / 2;
            break;
        }
        break;
    }
  }
  return { top: topVal, left: leftVal };
}
const Nest = {
  Feather(menu, type = "zf") {
    menu.attr("role", "menubar");
    menu.find("a").attr({ "role": "menuitem" });
    var items = menu.find("li").attr({ "role": "none" }), subMenuClass = `is-${type}-submenu`, subItemClass = `${subMenuClass}-item`, hasSubClass = `is-${type}-submenu-parent`, applyAria = type !== "accordion";
    items.each(function() {
      var $item = $(this), $sub = $item.children("ul");
      if ($sub.length) {
        $item.addClass(hasSubClass);
        if (applyAria) {
          const firstItem = $item.children("a:first");
          firstItem.attr({
            "aria-haspopup": true,
            "aria-label": firstItem.attr("aria-label") || firstItem.text()
          });
          if (type === "drilldown") {
            $item.attr({ "aria-expanded": false });
          }
        }
        $sub.addClass(`submenu ${subMenuClass}`).attr({
          "data-submenu": "",
          "role": "menubar"
        });
        if (type === "drilldown") {
          $sub.attr({ "aria-hidden": true });
        }
      }
      if ($item.parent("[data-submenu]").length) {
        $item.addClass(`is-submenu-item ${subItemClass}`);
      }
    });
    return;
  },
  Burn(menu, type) {
    var subMenuClass = `is-${type}-submenu`, subItemClass = `${subMenuClass}-item`, hasSubClass = `is-${type}-submenu-parent`;
    menu.find(">li, > li > ul, .menu, .menu > li, [data-submenu] > li").removeClass(`${subMenuClass} ${subItemClass} ${hasSubClass} is-submenu-item submenu is-active`).removeAttr("data-submenu").css("display", "");
  }
};
var Touch = {};
var startPosX, startTime, elapsedTime, startEvent, isMoving = false, didMoved = false;
function onTouchEnd(e2) {
  this.removeEventListener("touchmove", onTouchMove);
  this.removeEventListener("touchend", onTouchEnd);
  if (!didMoved) {
    var tapEvent = $.Event("tap", startEvent || e2);
    $(this).trigger(tapEvent);
  }
  startEvent = null;
  isMoving = false;
  didMoved = false;
}
function onTouchMove(e2) {
  if (true === $.spotSwipe.preventDefault) {
    e2.preventDefault();
  }
  if (isMoving) {
    var x2 = e2.touches[0].pageX;
    var dx = startPosX - x2;
    var dir;
    didMoved = true;
    elapsedTime = (/* @__PURE__ */ new Date()).getTime() - startTime;
    if (Math.abs(dx) >= $.spotSwipe.moveThreshold && elapsedTime <= $.spotSwipe.timeThreshold) {
      dir = dx > 0 ? "left" : "right";
    }
    if (dir) {
      e2.preventDefault();
      onTouchEnd.apply(this, arguments);
      $(this).trigger($.Event("swipe", Object.assign({}, e2)), dir).trigger($.Event(`swipe${dir}`, Object.assign({}, e2)));
    }
  }
}
function onTouchStart(e2) {
  if (e2.touches.length === 1) {
    startPosX = e2.touches[0].pageX;
    startEvent = e2;
    isMoving = true;
    didMoved = false;
    startTime = (/* @__PURE__ */ new Date()).getTime();
    this.addEventListener("touchmove", onTouchMove, { passive: true === $.spotSwipe.preventDefault });
    this.addEventListener("touchend", onTouchEnd, false);
  }
}
function init() {
  this.addEventListener && this.addEventListener("touchstart", onTouchStart, { passive: true });
}
class SpotSwipe {
  constructor() {
    this.version = "1.0.0";
    this.enabled = "ontouchstart" in document.documentElement;
    this.preventDefault = false;
    this.moveThreshold = 75;
    this.timeThreshold = 200;
    this._init();
  }
  _init() {
    $.event.special.swipe = { setup: init };
    $.event.special.tap = { setup: init };
    $.each(["left", "up", "down", "right"], function() {
      $.event.special[`swipe${this}`] = { setup: function() {
        $(this).on("swipe", $.noop);
      } };
    });
  }
}
Touch.setupSpotSwipe = function() {
  $.spotSwipe = new SpotSwipe($);
};
Touch.setupTouchHandler = function() {
  $.fn.addTouch = function() {
    this.each(function(i2, el) {
      $(el).bind("touchstart touchmove touchend touchcancel", function(event) {
        handleTouch(event);
      });
    });
    var handleTouch = function(event) {
      var touches = event.changedTouches, first = touches[0], eventTypes = {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
      }, type = eventTypes[event.type], simulatedEvent;
      if ("MouseEvent" in window && typeof window.MouseEvent === "function") {
        simulatedEvent = new window.MouseEvent(type, {
          "bubbles": true,
          "cancelable": true,
          "screenX": first.screenX,
          "screenY": first.screenY,
          "clientX": first.clientX,
          "clientY": first.clientY
        });
      } else {
        simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
      }
      first.target.dispatchEvent(simulatedEvent);
    };
  };
};
Touch.init = function() {
  if (typeof $.spotSwipe === "undefined") {
    Touch.setupSpotSwipe($);
    Touch.setupTouchHandler($);
  }
};
const initClasses = ["mui-enter", "mui-leave"];
const activeClasses = ["mui-enter-active", "mui-leave-active"];
const Motion = {
  animateIn: function(element, animation, cb) {
    animate(true, element, animation, cb);
  },
  animateOut: function(element, animation, cb) {
    animate(false, element, animation, cb);
  }
};
function Move(duration, elem, fn) {
  var anim, prog, start = null;
  if (duration === 0) {
    fn.apply(elem);
    elem.trigger("finished.zf.animate", [elem]).triggerHandler("finished.zf.animate", [elem]);
    return;
  }
  function move(ts) {
    if (!start) start = ts;
    prog = ts - start;
    fn.apply(elem);
    if (prog < duration) {
      anim = window.requestAnimationFrame(move, elem);
    } else {
      window.cancelAnimationFrame(anim);
      elem.trigger("finished.zf.animate", [elem]).triggerHandler("finished.zf.animate", [elem]);
    }
  }
  anim = window.requestAnimationFrame(move);
}
function animate(isIn, element, animation, cb) {
  element = $(element).eq(0);
  if (!element.length) return;
  var initClass = isIn ? initClasses[0] : initClasses[1];
  var activeClass = isIn ? activeClasses[0] : activeClasses[1];
  reset();
  element.addClass(animation).css("transition", "none");
  requestAnimationFrame(() => {
    element.addClass(initClass);
    if (isIn) element.show();
  });
  requestAnimationFrame(() => {
    element[0].offsetWidth;
    element.css("transition", "").addClass(activeClass);
  });
  element.one(transitionend(element), finish);
  function finish() {
    if (!isIn) element.hide();
    reset();
    if (cb) cb.apply(element);
  }
  function reset() {
    element[0].style.transitionDuration = 0;
    element.removeClass(`${initClass} ${activeClass} ${animation}`);
  }
}
const MutationObserver = (function() {
  var prefixes = ["WebKit", "Moz", "O", "Ms", ""];
  for (var i2 = 0; i2 < prefixes.length; i2++) {
    if (`${prefixes[i2]}MutationObserver` in window) {
      return window[`${prefixes[i2]}MutationObserver`];
    }
  }
  return false;
})();
const triggers = (el, type) => {
  el.data(type).split(" ").forEach((id) => {
    $(`#${id}`)[type === "close" ? "trigger" : "triggerHandler"](`${type}.zf.trigger`, [el]);
  });
};
var Triggers = {
  Listeners: {
    Basic: {},
    Global: {}
  },
  Initializers: {}
};
Triggers.Listeners.Basic = {
  openListener: function() {
    triggers($(this), "open");
  },
  closeListener: function() {
    let id = $(this).data("close");
    if (id) {
      triggers($(this), "close");
    } else {
      $(this).trigger("close.zf.trigger");
    }
  },
  toggleListener: function() {
    let id = $(this).data("toggle");
    if (id) {
      triggers($(this), "toggle");
    } else {
      $(this).trigger("toggle.zf.trigger");
    }
  },
  closeableListener: function(e2) {
    let animation = $(this).data("closable");
    e2.stopPropagation();
    if (animation !== "") {
      Motion.animateOut($(this), animation, function() {
        $(this).trigger("closed.zf");
      });
    } else {
      $(this).fadeOut().trigger("closed.zf");
    }
  },
  toggleFocusListener: function() {
    let id = $(this).data("toggle-focus");
    $(`#${id}`).triggerHandler("toggle.zf.trigger", [$(this)]);
  }
};
Triggers.Initializers.addOpenListener = ($elem) => {
  $elem.off("click.zf.trigger", Triggers.Listeners.Basic.openListener);
  $elem.on("click.zf.trigger", "[data-open]", Triggers.Listeners.Basic.openListener);
};
Triggers.Initializers.addCloseListener = ($elem) => {
  $elem.off("click.zf.trigger", Triggers.Listeners.Basic.closeListener);
  $elem.on("click.zf.trigger", "[data-close]", Triggers.Listeners.Basic.closeListener);
};
Triggers.Initializers.addToggleListener = ($elem) => {
  $elem.off("click.zf.trigger", Triggers.Listeners.Basic.toggleListener);
  $elem.on("click.zf.trigger", "[data-toggle]", Triggers.Listeners.Basic.toggleListener);
};
Triggers.Initializers.addCloseableListener = ($elem) => {
  $elem.off("close.zf.trigger", Triggers.Listeners.Basic.closeableListener);
  $elem.on("close.zf.trigger", "[data-closeable], [data-closable]", Triggers.Listeners.Basic.closeableListener);
};
Triggers.Initializers.addToggleFocusListener = ($elem) => {
  $elem.off("focus.zf.trigger blur.zf.trigger", Triggers.Listeners.Basic.toggleFocusListener);
  $elem.on("focus.zf.trigger blur.zf.trigger", "[data-toggle-focus]", Triggers.Listeners.Basic.toggleFocusListener);
};
Triggers.Listeners.Global = {
  resizeListener: function($nodes) {
    if (!MutationObserver) {
      $nodes.each(function() {
        $(this).triggerHandler("resizeme.zf.trigger");
      });
    }
    $nodes.attr("data-events", "resize");
  },
  scrollListener: function($nodes) {
    if (!MutationObserver) {
      $nodes.each(function() {
        $(this).triggerHandler("scrollme.zf.trigger");
      });
    }
    $nodes.attr("data-events", "scroll");
  },
  closeMeListener: function(e2, pluginId) {
    let plugin = e2.namespace.split(".")[0];
    let plugins2 = $(`[data-${plugin}]`).not(`[data-yeti-box="${pluginId}"]`);
    plugins2.each(function() {
      let _this = $(this);
      _this.triggerHandler("close.zf.trigger", [_this]);
    });
  }
};
Triggers.Initializers.addClosemeListener = function(pluginName) {
  var yetiBoxes = $("[data-yeti-box]"), plugNames = ["dropdown", "tooltip", "reveal"];
  if (pluginName) {
    if (typeof pluginName === "string") {
      plugNames.push(pluginName);
    } else if (typeof pluginName === "object" && typeof pluginName[0] === "string") {
      plugNames = plugNames.concat(pluginName);
    } else {
      console.error("Plugin names must be strings");
    }
  }
  if (yetiBoxes.length) {
    let listeners = plugNames.map((name) => {
      return `closeme.zf.${name}`;
    }).join(" ");
    $(window).off(listeners).on(listeners, Triggers.Listeners.Global.closeMeListener);
  }
};
function debounceGlobalListener(debounce, trigger, listener) {
  let timer, args = Array.prototype.slice.call(arguments, 3);
  $(window).on(trigger, function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      listener.apply(null, args);
    }, debounce || 10);
  });
}
Triggers.Initializers.addResizeListener = function(debounce) {
  let $nodes = $("[data-resize]");
  if ($nodes.length) {
    debounceGlobalListener(debounce, "resize.zf.trigger", Triggers.Listeners.Global.resizeListener, $nodes);
  }
};
Triggers.Initializers.addScrollListener = function(debounce) {
  let $nodes = $("[data-scroll]");
  if ($nodes.length) {
    debounceGlobalListener(debounce, "scroll.zf.trigger", Triggers.Listeners.Global.scrollListener, $nodes);
  }
};
Triggers.Initializers.addMutationEventsListener = function($elem) {
  if (!MutationObserver) {
    return false;
  }
  let $nodes = $elem.find("[data-resize], [data-scroll], [data-mutate]");
  var listeningElementsMutation = function(mutationRecordsList) {
    var $target = $(mutationRecordsList[0].target);
    switch (mutationRecordsList[0].type) {
      case "attributes":
        if ($target.attr("data-events") === "scroll" && mutationRecordsList[0].attributeName === "data-events") {
          $target.triggerHandler("scrollme.zf.trigger", [$target, window.pageYOffset]);
        }
        if ($target.attr("data-events") === "resize" && mutationRecordsList[0].attributeName === "data-events") {
          $target.triggerHandler("resizeme.zf.trigger", [$target]);
        }
        if (mutationRecordsList[0].attributeName === "style") {
          $target.closest("[data-mutate]").attr("data-events", "mutate");
          $target.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger", [$target.closest("[data-mutate]")]);
        }
        break;
      case "childList":
        $target.closest("[data-mutate]").attr("data-events", "mutate");
        $target.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger", [$target.closest("[data-mutate]")]);
        break;
      default:
        return false;
    }
  };
  if ($nodes.length) {
    for (var i2 = 0; i2 <= $nodes.length - 1; i2++) {
      var elementObserver = new MutationObserver(listeningElementsMutation);
      elementObserver.observe($nodes[i2], { attributes: true, childList: true, characterData: false, subtree: true, attributeFilter: ["data-events", "style"] });
    }
  }
};
Triggers.Initializers.addSimpleListeners = function() {
  let $document = $(document);
  Triggers.Initializers.addOpenListener($document);
  Triggers.Initializers.addCloseListener($document);
  Triggers.Initializers.addToggleListener($document);
  Triggers.Initializers.addCloseableListener($document);
  Triggers.Initializers.addToggleFocusListener($document);
};
Triggers.Initializers.addGlobalListeners = function() {
  let $document = $(document);
  Triggers.Initializers.addMutationEventsListener($document);
  Triggers.Initializers.addResizeListener(250);
  Triggers.Initializers.addScrollListener();
  Triggers.Initializers.addClosemeListener();
};
Triggers.init = function(__, Foundation2) {
  onLoad($(window), function() {
    if ($.triggersInitialized !== true) {
      Triggers.Initializers.addSimpleListeners();
      Triggers.Initializers.addGlobalListeners();
      $.triggersInitialized = true;
    }
  });
  if (Foundation2) {
    Foundation2.Triggers = Triggers;
    Foundation2.IHearYou = Triggers.Initializers.addGlobalListeners;
  }
};
function onImagesLoaded(images, callback) {
  var unloaded = images.length;
  if (unloaded === 0) {
    callback();
  }
  images.each(function() {
    if (this.complete && typeof this.naturalWidth !== "undefined") {
      singleImageLoaded();
    } else {
      var image = new Image();
      var events2 = "load.zf.images error.zf.images";
      $(image).one(events2, function me() {
        $(this).off(events2, me);
        singleImageLoaded();
      });
      image.src = $(this).attr("src");
    }
  });
  function singleImageLoaded() {
    unloaded--;
    if (unloaded === 0) {
      callback();
    }
  }
}
function Timer(elem, options, cb) {
  var _this = this, duration = options.duration, nameSpace = Object.keys(elem.data())[0] || "timer", remain = -1, start, timer;
  this.isPaused = false;
  this.restart = function() {
    remain = -1;
    clearTimeout(timer);
    this.start();
  };
  this.start = function() {
    this.isPaused = false;
    clearTimeout(timer);
    remain = remain <= 0 ? duration : remain;
    elem.data("paused", false);
    start = Date.now();
    timer = setTimeout(function() {
      if (options.infinite) {
        _this.restart();
      }
      if (cb && typeof cb === "function") {
        cb();
      }
    }, remain);
    elem.trigger(`timerstart.zf.${nameSpace}`);
  };
  this.pause = function() {
    this.isPaused = true;
    clearTimeout(timer);
    elem.data("paused", true);
    var end = Date.now();
    remain = remain - (end - start);
    elem.trigger(`timerpaused.zf.${nameSpace}`);
  };
}
class Plugin {
  constructor(element, options) {
    this._setup(element, options);
    var pluginName = getPluginName(this);
    this.uuid = GetYoDigits(6, pluginName);
    if (!this.$element.attr(`data-${pluginName}`)) {
      this.$element.attr(`data-${pluginName}`, this.uuid);
    }
    if (!this.$element.data("zfPlugin")) {
      this.$element.data("zfPlugin", this);
    }
    this.$element.trigger(`init.zf.${pluginName}`);
  }
  destroy() {
    this._destroy();
    var pluginName = getPluginName(this);
    this.$element.removeAttr(`data-${pluginName}`).removeData("zfPlugin").trigger(`destroyed.zf.${pluginName}`);
    for (var prop in this) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = null;
      }
    }
  }
}
function hyphenate(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function getPluginName(obj) {
  return hyphenate(obj.className);
}
const POSITIONS = ["left", "right", "top", "bottom"];
const VERTICAL_ALIGNMENTS = ["top", "bottom", "center"];
const HORIZONTAL_ALIGNMENTS = ["left", "right", "center"];
const ALIGNMENTS = {
  "left": VERTICAL_ALIGNMENTS,
  "right": VERTICAL_ALIGNMENTS,
  "top": HORIZONTAL_ALIGNMENTS,
  "bottom": HORIZONTAL_ALIGNMENTS
};
function nextItem(item, array) {
  var currentIdx = array.indexOf(item);
  if (currentIdx === array.length - 1) {
    return array[0];
  } else {
    return array[currentIdx + 1];
  }
}
class Positionable extends Plugin {
  /**
   * Abstract class encapsulating the tether-like explicit positioning logic
   * including repositioning based on overlap.
   * Expects classes to define defaults for vOffset, hOffset, position,
   * alignment, allowOverlap, and allowBottomOverlap. They can do this by
   * extending the defaults, or (for now recommended due to the way docs are
   * generated) by explicitly declaring them.
   *
   **/
  _init() {
    this.triedPositions = {};
    this.position = this.options.position === "auto" ? this._getDefaultPosition() : this.options.position;
    this.alignment = this.options.alignment === "auto" ? this._getDefaultAlignment() : this.options.alignment;
    this.originalPosition = this.position;
    this.originalAlignment = this.alignment;
  }
  _getDefaultPosition() {
    return "bottom";
  }
  _getDefaultAlignment() {
    switch (this.position) {
      case "bottom":
      case "top":
        return rtl() ? "right" : "left";
      case "left":
      case "right":
        return "bottom";
    }
  }
  /**
   * Adjusts the positionable possible positions by iterating through alignments
   * and positions.
   * @function
   * @private
   */
  _reposition() {
    if (this._alignmentsExhausted(this.position)) {
      this.position = nextItem(this.position, POSITIONS);
      this.alignment = ALIGNMENTS[this.position][0];
    } else {
      this._realign();
    }
  }
  /**
   * Adjusts the dropdown pane possible positions by iterating through alignments
   * on the current position.
   * @function
   * @private
   */
  _realign() {
    this._addTriedPosition(this.position, this.alignment);
    this.alignment = nextItem(this.alignment, ALIGNMENTS[this.position]);
  }
  _addTriedPosition(position, alignment) {
    this.triedPositions[position] = this.triedPositions[position] || [];
    this.triedPositions[position].push(alignment);
  }
  _positionsExhausted() {
    var isExhausted = true;
    for (var i2 = 0; i2 < POSITIONS.length; i2++) {
      isExhausted = isExhausted && this._alignmentsExhausted(POSITIONS[i2]);
    }
    return isExhausted;
  }
  _alignmentsExhausted(position) {
    return this.triedPositions[position] && this.triedPositions[position].length === ALIGNMENTS[position].length;
  }
  // When we're trying to center, we don't want to apply offset that's going to
  // take us just off center, so wrap around to return 0 for the appropriate
  // offset in those alignments.  TODO: Figure out if we want to make this
  // configurable behavior... it feels more intuitive, especially for tooltips, but
  // it's possible someone might actually want to start from center and then nudge
  // slightly off.
  _getVOffset() {
    return this.options.vOffset;
  }
  _getHOffset() {
    return this.options.hOffset;
  }
  _setPosition($anchor, $element, $parent) {
    if ($anchor.attr("aria-expanded") === "false") {
      return false;
    }
    if (!this.options.allowOverlap) {
      this.position = this.originalPosition;
      this.alignment = this.originalAlignment;
    }
    $element.offset(Box.GetExplicitOffsets($element, $anchor, this.position, this.alignment, this._getVOffset(), this._getHOffset()));
    if (!this.options.allowOverlap) {
      var minOverlap = 1e8;
      var minCoordinates = { position: this.position, alignment: this.alignment };
      while (!this._positionsExhausted()) {
        let overlap = Box.OverlapArea($element, $parent, false, false, this.options.allowBottomOverlap);
        if (overlap === 0) {
          return;
        }
        if (overlap < minOverlap) {
          minOverlap = overlap;
          minCoordinates = { position: this.position, alignment: this.alignment };
        }
        this._reposition();
        $element.offset(Box.GetExplicitOffsets($element, $anchor, this.position, this.alignment, this._getVOffset(), this._getHOffset()));
      }
      this.position = minCoordinates.position;
      this.alignment = minCoordinates.alignment;
      $element.offset(Box.GetExplicitOffsets($element, $anchor, this.position, this.alignment, this._getVOffset(), this._getHOffset()));
    }
  }
}
Positionable.defaults = {
  /**
   * Position of positionable relative to anchor. Can be left, right, bottom, top, or auto.
   * @option
   * @type {string}
   * @default 'auto'
   */
  position: "auto",
  /**
   * Alignment of positionable relative to anchor. Can be left, right, bottom, top, center, or auto.
   * @option
   * @type {string}
   * @default 'auto'
   */
  alignment: "auto",
  /**
   * Allow overlap of container/window. If false, dropdown positionable first
   * try to position as defined by data-position and data-alignment, but
   * reposition if it would cause an overflow.
   * @option
   * @type {boolean}
   * @default false
   */
  allowOverlap: false,
  /**
   * Allow overlap of only the bottom of the container. This is the most common
   * behavior for dropdowns, allowing the dropdown to extend the bottom of the
   * screen but not otherwise influence or break out of the container.
   * @option
   * @type {boolean}
   * @default true
   */
  allowBottomOverlap: true,
  /**
   * Number of pixels the positionable should be separated vertically from anchor
   * @option
   * @type {number}
   * @default 0
   */
  vOffset: 0,
  /**
   * Number of pixels the positionable should be separated horizontally from anchor
   * @option
   * @type {number}
   * @default 0
   */
  hOffset: 0
};
class Dropdown extends Positionable {
  /**
   * Creates a new instance of a dropdown.
   * @class
   * @name Dropdown
   * @param {jQuery} element - jQuery object to make into a dropdown.
   *        Object should be of the dropdown panel, rather than its anchor.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, Dropdown.defaults, this.$element.data(), options);
    this.className = "Dropdown";
    Touch.init($);
    Triggers.init($);
    this._init();
    Keyboard.register("Dropdown", {
      "ENTER": "toggle",
      "SPACE": "toggle",
      "ESCAPE": "close"
    });
  }
  /**
   * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
   * @function
   * @private
   */
  _init() {
    var $id = this.$element.attr("id");
    this.$anchors = $(`[data-toggle="${$id}"]`).length ? $(`[data-toggle="${$id}"]`) : $(`[data-open="${$id}"]`);
    this.$anchors.attr({
      "aria-controls": $id,
      "data-is-focus": false,
      "data-yeti-box": $id,
      "aria-haspopup": true,
      "aria-expanded": false
    });
    this._setCurrentAnchor(this.$anchors.first());
    if (this.options.parentClass) {
      this.$parent = this.$element.parents("." + this.options.parentClass);
    } else {
      this.$parent = null;
    }
    if (typeof this.$element.attr("aria-labelledby") === "undefined") {
      if (typeof this.$currentAnchor.attr("id") === "undefined") {
        this.$currentAnchor.attr("id", GetYoDigits(6, "dd-anchor"));
      }
      this.$element.attr("aria-labelledby", this.$currentAnchor.attr("id"));
    }
    this.$element.attr({
      "aria-hidden": "true",
      "data-yeti-box": $id,
      "data-resize": $id
    });
    super._init();
    this._events();
  }
  _getDefaultPosition() {
    var position = this.$element[0].className.match(/(top|left|right|bottom)/g);
    if (position) {
      return position[0];
    } else {
      return "bottom";
    }
  }
  _getDefaultAlignment() {
    var horizontalPosition = /float-(\S+)/.exec(this.$currentAnchor.attr("class"));
    if (horizontalPosition) {
      return horizontalPosition[1];
    }
    return super._getDefaultAlignment();
  }
  /**
   * Sets the position and orientation of the dropdown pane, checks for collisions if allow-overlap is not true.
   * Recursively calls itself if a collision is detected, with a new position class.
   * @function
   * @private
   */
  _setPosition() {
    this.$element.removeClass(`has-position-${this.position} has-alignment-${this.alignment}`);
    super._setPosition(this.$currentAnchor, this.$element, this.$parent);
    this.$element.addClass(`has-position-${this.position} has-alignment-${this.alignment}`);
  }
  /**
   * Make it a current anchor.
   * Current anchor as the reference for the position of Dropdown panes.
   * @param {HTML} el - DOM element of the anchor.
   * @function
   * @private
   */
  _setCurrentAnchor(el) {
    this.$currentAnchor = $(el);
  }
  /**
   * Adds event listeners to the element utilizing the triggers utility library.
   * @function
   * @private
   */
  _events() {
    var _this = this, hasTouch = "ontouchstart" in window || typeof window.ontouchstart !== "undefined";
    this.$element.on({
      "open.zf.trigger": this.open.bind(this),
      "close.zf.trigger": this.close.bind(this),
      "toggle.zf.trigger": this.toggle.bind(this),
      "resizeme.zf.trigger": this._setPosition.bind(this)
    });
    this.$anchors.off("click.zf.trigger").on("click.zf.trigger", function(e2) {
      _this._setCurrentAnchor(this);
      if (
        // if forceFollow false, always prevent default action
        _this.options.forceFollow === false || // if forceFollow true and hover option true, only prevent default action on 1st click
        // on 2nd click (dropown opened) the default action (e.g. follow a href) gets executed
        hasTouch && _this.options.hover && _this.$element.hasClass("is-open") === false
      ) {
        e2.preventDefault();
      }
    });
    if (this.options.hover) {
      this.$anchors.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown", function() {
        _this._setCurrentAnchor(this);
        var bodyData = $("body").data();
        if (typeof bodyData.whatinput === "undefined" || bodyData.whatinput === "mouse") {
          clearTimeout(_this.timeout);
          _this.timeout = setTimeout(function() {
            _this.open();
            _this.$anchors.data("hover", true);
          }, _this.options.hoverDelay);
        }
      }).on("mouseleave.zf.dropdown", ignoreMousedisappear(function() {
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function() {
          _this.close();
          _this.$anchors.data("hover", false);
        }, _this.options.hoverDelay);
      }));
      if (this.options.hoverPane) {
        this.$element.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown", function() {
          clearTimeout(_this.timeout);
        }).on("mouseleave.zf.dropdown", ignoreMousedisappear(function() {
          clearTimeout(_this.timeout);
          _this.timeout = setTimeout(function() {
            _this.close();
            _this.$anchors.data("hover", false);
          }, _this.options.hoverDelay);
        }));
      }
    }
    this.$anchors.add(this.$element).on("keydown.zf.dropdown", function(e2) {
      var $target = $(this);
      Keyboard.handleKey(e2, "Dropdown", {
        open: function() {
          if ($target.is(_this.$anchors) && !$target.is("input, textarea")) {
            _this.open();
            _this.$element.attr("tabindex", -1).focus();
            e2.preventDefault();
          }
        },
        close: function() {
          _this.close();
          _this.$anchors.focus();
        }
      });
    });
  }
  /**
   * Adds an event handler to the body to close any dropdowns on a click.
   * @function
   * @private
   */
  _addBodyHandler() {
    var $body = $(document.body).not(this.$element), _this = this;
    $body.off("click.zf.dropdown tap.zf.dropdown").on("click.zf.dropdown tap.zf.dropdown", function(e2) {
      if (_this.$anchors.is(e2.target) || _this.$anchors.find(e2.target).length) {
        return;
      }
      if (_this.$element.is(e2.target) || _this.$element.find(e2.target).length) {
        return;
      }
      _this.close();
      $body.off("click.zf.dropdown tap.zf.dropdown");
    });
  }
  /**
   * Opens the dropdown pane, and fires a bubbling event to close other dropdowns.
   * @function
   * @fires Dropdown#closeme
   * @fires Dropdown#show
   */
  open() {
    this.$element.trigger("closeme.zf.dropdown", this.$element.attr("id"));
    this.$anchors.addClass("hover").attr({ "aria-expanded": true });
    this.$element.addClass("is-opening");
    this._setPosition();
    this.$element.removeClass("is-opening").addClass("is-open").attr({ "aria-hidden": false });
    if (this.options.autoFocus) {
      var $focusable = Keyboard.findFocusable(this.$element);
      if ($focusable.length) {
        $focusable.eq(0).focus();
      }
    }
    if (this.options.closeOnClick) {
      this._addBodyHandler();
    }
    if (this.options.trapFocus) {
      Keyboard.trapFocus(this.$element);
    }
    this.$element.trigger("show.zf.dropdown", [this.$element]);
  }
  /**
   * Closes the open dropdown pane.
   * @function
   * @fires Dropdown#hide
   */
  close() {
    if (!this.$element.hasClass("is-open")) {
      return false;
    }
    this.$element.removeClass("is-open").attr({ "aria-hidden": true });
    this.$anchors.removeClass("hover").attr("aria-expanded", false);
    this.$element.trigger("hide.zf.dropdown", [this.$element]);
    if (this.options.trapFocus) {
      Keyboard.releaseFocus(this.$element);
    }
  }
  /**
   * Toggles the dropdown pane's visibility.
   * @function
   */
  toggle() {
    if (this.$element.hasClass("is-open")) {
      if (this.$anchors.data("hover")) return;
      this.close();
    } else {
      this.open();
    }
  }
  /**
   * Destroys the dropdown.
   * @function
   */
  _destroy() {
    this.$element.off(".zf.trigger").hide();
    this.$anchors.off(".zf.dropdown");
    $(document.body).off("click.zf.dropdown tap.zf.dropdown");
  }
}
Dropdown.defaults = {
  /**
   * Class that designates bounding container of Dropdown (default: window)
   * @option
   * @type {?string}
   * @default null
   */
  parentClass: null,
  /**
   * Amount of time to delay opening a submenu on hover event.
   * @option
   * @type {number}
   * @default 250
   */
  hoverDelay: 250,
  /**
   * Allow submenus to open on hover events
   * @option
   * @type {boolean}
   * @default false
   */
  hover: false,
  /**
   * Don't close dropdown when hovering over dropdown pane
   * @option
   * @type {boolean}
   * @default false
   */
  hoverPane: false,
  /**
   * Number of pixels between the dropdown pane and the triggering element on open.
   * @option
   * @type {number}
   * @default 0
   */
  vOffset: 0,
  /**
   * Number of pixels between the dropdown pane and the triggering element on open.
   * @option
   * @type {number}
   * @default 0
   */
  hOffset: 0,
  /**
   * Position of dropdown. Can be left, right, bottom, top, or auto.
   * @option
   * @type {string}
   * @default 'auto'
   */
  position: "auto",
  /**
   * Alignment of dropdown relative to anchor. Can be left, right, bottom, top, center, or auto.
   * @option
   * @type {string}
   * @default 'auto'
   */
  alignment: "auto",
  /**
   * Allow overlap of container/window. If false, dropdown will first try to position as defined by data-position and data-alignment, but reposition if it would cause an overflow.
   * @option
   * @type {boolean}
   * @default false
   */
  allowOverlap: false,
  /**
   * Allow overlap of only the bottom of the container. This is the most common
   * behavior for dropdowns, allowing the dropdown to extend the bottom of the
   * screen but not otherwise influence or break out of the container.
   * @option
   * @type {boolean}
   * @default true
   */
  allowBottomOverlap: true,
  /**
   * Allow the plugin to trap focus to the dropdown pane if opened with keyboard commands.
   * @option
   * @type {boolean}
   * @default false
   */
  trapFocus: false,
  /**
   * Allow the plugin to set focus to the first focusable element within the pane, regardless of method of opening.
   * @option
   * @type {boolean}
   * @default false
   */
  autoFocus: false,
  /**
   * Allows a click on the body to close the dropdown.
   * @option
   * @type {boolean}
   * @default false
   */
  closeOnClick: false,
  /**
   * If true the default action of the toggle (e.g. follow a link with href) gets executed on click. If hover option is also true the default action gets prevented on first click for mobile / touch devices and executed on second click.
   * @option
   * @type {boolean}
   * @default true
   */
  forceFollow: true
};
class DropdownMenu extends Plugin {
  /**
   * Creates a new instance of DropdownMenu.
   * @class
   * @name DropdownMenu
   * @fires DropdownMenu#init
   * @param {jQuery} element - jQuery object to make into a dropdown menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, DropdownMenu.defaults, this.$element.data(), options);
    this.className = "DropdownMenu";
    Touch.init($);
    this._init();
    Keyboard.register("DropdownMenu", {
      "ENTER": "open",
      "SPACE": "open",
      "ARROW_RIGHT": "next",
      "ARROW_UP": "up",
      "ARROW_DOWN": "down",
      "ARROW_LEFT": "previous",
      "ESCAPE": "close"
    });
  }
  /**
   * Initializes the plugin, and calls _prepareMenu
   * @private
   * @function
   */
  _init() {
    Nest.Feather(this.$element, "dropdown");
    var subs = this.$element.find("li.is-dropdown-submenu-parent");
    this.$element.children(".is-dropdown-submenu-parent").children(".is-dropdown-submenu").addClass("first-sub");
    this.$menuItems = this.$element.find('li[role="none"]');
    this.$tabs = this.$element.children('li[role="none"]');
    this.$tabs.find("ul.is-dropdown-submenu").addClass(this.options.verticalClass);
    if (this.options.alignment === "auto") {
      if (this.$element.hasClass(this.options.rightClass) || rtl() || this.$element.parents(".top-bar-right").is("*")) {
        this.options.alignment = "right";
        subs.addClass("opens-left");
      } else {
        this.options.alignment = "left";
        subs.addClass("opens-right");
      }
    } else {
      if (this.options.alignment === "right") {
        subs.addClass("opens-left");
      } else {
        subs.addClass("opens-right");
      }
    }
    this.changed = false;
    this._events();
  }
  _isVertical() {
    return this.$tabs.css("display") === "block" || this.$element.css("flex-direction") === "column";
  }
  _isRtl() {
    return this.$element.hasClass("align-right") || rtl() && !this.$element.hasClass("align-left");
  }
  /**
   * Adds event listeners to elements within the menu
   * @private
   * @function
   */
  _events() {
    var _this = this, hasTouch = "ontouchstart" in window || typeof window.ontouchstart !== "undefined", parClass = "is-dropdown-submenu-parent";
    var handleClickFn = function(e2) {
      var $elem = $(e2.target).parentsUntil("ul", `.${parClass}`), hasSub = $elem.hasClass(parClass), hasClicked = $elem.attr("data-is-click") === "true", $sub = $elem.children(".is-dropdown-submenu");
      if (hasSub) {
        if (hasClicked) {
          if (!_this.options.closeOnClick || !_this.options.clickOpen && !hasTouch || _this.options.forceFollow && hasTouch) {
            return;
          }
          e2.stopImmediatePropagation();
          e2.preventDefault();
          _this._hide($elem);
        } else {
          e2.stopImmediatePropagation();
          e2.preventDefault();
          _this._show($sub);
          $elem.add($elem.parentsUntil(_this.$element, `.${parClass}`)).attr("data-is-click", true);
        }
      }
    };
    if (this.options.clickOpen || hasTouch) {
      this.$menuItems.on("click.zf.dropdownMenu touchstart.zf.dropdownMenu", handleClickFn);
    }
    if (_this.options.closeOnClickInside) {
      this.$menuItems.on("click.zf.dropdownMenu", function() {
        var $elem = $(this), hasSub = $elem.hasClass(parClass);
        if (!hasSub) {
          _this._hide();
        }
      });
    }
    if (hasTouch && this.options.disableHoverOnTouch) this.options.disableHover = true;
    if (!this.options.disableHover) {
      this.$menuItems.on("mouseenter.zf.dropdownMenu", function() {
        var $elem = $(this), hasSub = $elem.hasClass(parClass);
        if (hasSub) {
          clearTimeout($elem.data("_delay"));
          $elem.data("_delay", setTimeout(function() {
            _this._show($elem.children(".is-dropdown-submenu"));
          }, _this.options.hoverDelay));
        }
      }).on("mouseleave.zf.dropdownMenu", ignoreMousedisappear(function() {
        var $elem = $(this), hasSub = $elem.hasClass(parClass);
        if (hasSub && _this.options.autoclose) {
          if ($elem.attr("data-is-click") === "true" && _this.options.clickOpen) {
            return false;
          }
          clearTimeout($elem.data("_delay"));
          $elem.data("_delay", setTimeout(function() {
            _this._hide($elem);
          }, _this.options.closingTime));
        }
      }));
    }
    this.$menuItems.on("keydown.zf.dropdownMenu", function(e2) {
      var $element = $(e2.target).parentsUntil("ul", '[role="none"]'), isTab = _this.$tabs.index($element) > -1, $elements = isTab ? _this.$tabs : $element.siblings("li").add($element), $prevElement, $nextElement;
      $elements.each(function(i2) {
        if ($(this).is($element)) {
          $prevElement = $elements.eq(i2 - 1);
          $nextElement = $elements.eq(i2 + 1);
          return;
        }
      });
      var nextSibling = function() {
        $nextElement.children("a:first").focus();
        e2.preventDefault();
      }, prevSibling = function() {
        $prevElement.children("a:first").focus();
        e2.preventDefault();
      }, openSub = function() {
        var $sub = $element.children("ul.is-dropdown-submenu");
        if ($sub.length) {
          _this._show($sub);
          $element.find("li > a:first").focus();
          e2.preventDefault();
        } else {
          return;
        }
      }, closeSub = function() {
        var close = $element.parent("ul").parent("li");
        close.children("a:first").focus();
        _this._hide(close);
        e2.preventDefault();
      };
      var functions = {
        open: openSub,
        close: function() {
          _this._hide(_this.$element);
          _this.$menuItems.eq(0).children("a").focus();
          e2.preventDefault();
        }
      };
      if (isTab) {
        if (_this._isVertical()) {
          if (_this._isRtl()) {
            $.extend(functions, {
              down: nextSibling,
              up: prevSibling,
              next: closeSub,
              previous: openSub
            });
          } else {
            $.extend(functions, {
              down: nextSibling,
              up: prevSibling,
              next: openSub,
              previous: closeSub
            });
          }
        } else {
          if (_this._isRtl()) {
            $.extend(functions, {
              next: prevSibling,
              previous: nextSibling,
              down: openSub,
              up: closeSub
            });
          } else {
            $.extend(functions, {
              next: nextSibling,
              previous: prevSibling,
              down: openSub,
              up: closeSub
            });
          }
        }
      } else {
        if (_this._isRtl()) {
          $.extend(functions, {
            next: closeSub,
            previous: openSub,
            down: nextSibling,
            up: prevSibling
          });
        } else {
          $.extend(functions, {
            next: openSub,
            previous: closeSub,
            down: nextSibling,
            up: prevSibling
          });
        }
      }
      Keyboard.handleKey(e2, "DropdownMenu", functions);
    });
  }
  /**
   * Adds an event handler to the body to close any dropdowns on a click.
   * @function
   * @private
   */
  _addBodyHandler() {
    const $body = $(document.body);
    this._removeBodyHandler();
    $body.on("click.zf.dropdownMenu tap.zf.dropdownMenu", (e2) => {
      var isItself = !!$(e2.target).closest(this.$element).length;
      if (isItself) return;
      this._hide();
      this._removeBodyHandler();
    });
  }
  /**
   * Remove the body event handler. See `_addBodyHandler`.
   * @function
   * @private
   */
  _removeBodyHandler() {
    $(document.body).off("click.zf.dropdownMenu tap.zf.dropdownMenu");
  }
  /**
   * Opens a dropdown pane, and checks for collisions first.
   * @param {jQuery} $sub - ul element that is a submenu to show
   * @function
   * @private
   * @fires DropdownMenu#show
   */
  _show($sub) {
    var idx = this.$tabs.index(this.$tabs.filter(function(i2, el) {
      return $(el).find($sub).length > 0;
    }));
    var $sibs = $sub.parent("li.is-dropdown-submenu-parent").siblings("li.is-dropdown-submenu-parent");
    this._hide($sibs, idx);
    $sub.css("visibility", "hidden").addClass("js-dropdown-active").parent("li.is-dropdown-submenu-parent").addClass("is-active");
    var clear = Box.ImNotTouchingYou($sub, null, true);
    if (!clear) {
      var oldClass = this.options.alignment === "left" ? "-right" : "-left", $parentLi = $sub.parent(".is-dropdown-submenu-parent");
      $parentLi.removeClass(`opens${oldClass}`).addClass(`opens-${this.options.alignment}`);
      clear = Box.ImNotTouchingYou($sub, null, true);
      if (!clear) {
        $parentLi.removeClass(`opens-${this.options.alignment}`).addClass("opens-inner");
      }
      this.changed = true;
    }
    $sub.css("visibility", "");
    if (this.options.closeOnClick) {
      this._addBodyHandler();
    }
    this.$element.trigger("show.zf.dropdownMenu", [$sub]);
  }
  /**
   * Hides a single, currently open dropdown pane, if passed a parameter, otherwise, hides everything.
   * @function
   * @param {jQuery} $elem - element with a submenu to hide
   * @param {Number} idx - index of the $tabs collection to hide
   * @fires DropdownMenu#hide
   * @private
   */
  _hide($elem, idx) {
    var $toClose;
    if ($elem && $elem.length) {
      $toClose = $elem;
    } else if (typeof idx !== "undefined") {
      $toClose = this.$tabs.not(function(i2) {
        return i2 === idx;
      });
    } else {
      $toClose = this.$element;
    }
    var somethingToClose = $toClose.hasClass("is-active") || $toClose.find(".is-active").length > 0;
    if (somethingToClose) {
      var $activeItem = $toClose.find("li.is-active");
      $activeItem.add($toClose).attr({
        "data-is-click": false
      }).removeClass("is-active");
      $toClose.find("ul.js-dropdown-active").removeClass("js-dropdown-active");
      if (this.changed || $toClose.find("opens-inner").length) {
        var oldClass = this.options.alignment === "left" ? "right" : "left";
        $toClose.find("li.is-dropdown-submenu-parent").add($toClose).removeClass(`opens-inner opens-${this.options.alignment}`).addClass(`opens-${oldClass}`);
        this.changed = false;
      }
      clearTimeout($activeItem.data("_delay"));
      this._removeBodyHandler();
      this.$element.trigger("hide.zf.dropdownMenu", [$toClose]);
    }
  }
  /**
   * Destroys the plugin.
   * @function
   */
  _destroy() {
    this.$menuItems.off(".zf.dropdownMenu").removeAttr("data-is-click").removeClass("is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner");
    $(document.body).off(".zf.dropdownMenu");
    Nest.Burn(this.$element, "dropdown");
  }
}
DropdownMenu.defaults = {
  /**
   * Disallows hover events from opening submenus
   * @option
   * @type {boolean}
   * @default false
   */
  disableHover: false,
  /**
   * Disallows hover on touch devices
   * @option
   * @type {boolean}
   * @default true
   */
  disableHoverOnTouch: true,
  /**
   * Allow a submenu to automatically close on a mouseleave event, if not clicked open.
   * @option
   * @type {boolean}
   * @default true
   */
  autoclose: true,
  /**
   * Amount of time to delay opening a submenu on hover event.
   * @option
   * @type {number}
   * @default 50
   */
  hoverDelay: 50,
  /**
   * Allow a submenu to open/remain open on parent click event. Allows cursor to move away from menu.
   * @option
   * @type {boolean}
   * @default false
   */
  clickOpen: false,
  /**
   * Amount of time to delay closing a submenu on a mouseleave event.
   * @option
   * @type {number}
   * @default 500
   */
  closingTime: 500,
  /**
   * Position of the menu relative to what direction the submenus should open. Handled by JS. Can be `'auto'`, `'left'` or `'right'`.
   * @option
   * @type {string}
   * @default 'auto'
   */
  alignment: "auto",
  /**
   * Allow clicks on the body to close any open submenus.
   * @option
   * @type {boolean}
   * @default true
   */
  closeOnClick: true,
  /**
   * Allow clicks on leaf anchor links to close any open submenus.
   * @option
   * @type {boolean}
   * @default true
   */
  closeOnClickInside: true,
  /**
   * Class applied to vertical oriented menus, Foundation default is `vertical`. Update this if using your own class.
   * @option
   * @type {string}
   * @default 'vertical'
   */
  verticalClass: "vertical",
  /**
   * Class applied to right-side oriented menus, Foundation default is `align-right`. Update this if using your own class.
   * @option
   * @type {string}
   * @default 'align-right'
   */
  rightClass: "align-right",
  /**
   * Boolean to force overide the clicking of links to perform default action, on second touch event for mobile.
   * @option
   * @type {boolean}
   * @default true
   */
  forceFollow: true
};
class Accordion extends Plugin {
  /**
   * Creates a new instance of an accordion.
   * @class
   * @name Accordion
   * @fires Accordion#init
   * @param {jQuery} element - jQuery object to make into an accordion.
   * @param {Object} options - a plain object with settings to override the default options.
   */
  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, Accordion.defaults, this.$element.data(), options);
    this.className = "Accordion";
    this._init();
    Keyboard.register("Accordion", {
      "ENTER": "toggle",
      "SPACE": "toggle",
      "ARROW_DOWN": "next",
      "ARROW_UP": "previous",
      "HOME": "first",
      "END": "last"
    });
  }
  /**
   * Initializes the accordion by animating the preset active pane(s).
   * @private
   */
  _init() {
    this._isInitializing = true;
    this.$tabs = this.$element.children("[data-accordion-item]");
    this.$tabs.each(function(idx, el) {
      var $el = $(el), $content = $el.children("[data-tab-content]"), id = $content[0].id || GetYoDigits(6, "accordion"), linkId = el.id ? `${el.id}-label` : `${id}-label`;
      $el.find("a:first").attr({
        "aria-controls": id,
        "id": linkId,
        "aria-expanded": false
      });
      $content.attr({ "role": "region", "aria-labelledby": linkId, "aria-hidden": true, "id": id });
    });
    var $initActive = this.$element.find(".is-active").children("[data-tab-content]");
    if ($initActive.length) {
      this._initialAnchor = $initActive.prev("a").attr("href");
      this._openSingleTab($initActive);
    }
    this._checkDeepLink = () => {
      var anchor = window.location.hash;
      if (!anchor.length) {
        if (this._isInitializing) return;
        if (this._initialAnchor) anchor = this._initialAnchor;
      }
      var $anchor = anchor && $(anchor);
      var $link = anchor && this.$element.find(`[href$="${anchor}"]`);
      var isOwnAnchor = !!($anchor.length && $link.length);
      if (isOwnAnchor) {
        if ($anchor && $link && $link.length) {
          if (!$link.parent("[data-accordion-item]").hasClass("is-active")) {
            this._openSingleTab($anchor);
          }
        } else {
          this._closeAllTabs();
        }
        if (this.options.deepLinkSmudge) {
          onLoad($(window), () => {
            var offset = this.$element.offset();
            $("html, body").animate({ scrollTop: offset.top - this.options.deepLinkSmudgeOffset }, this.options.deepLinkSmudgeDelay);
          });
        }
        this.$element.trigger("deeplink.zf.accordion", [$link, $anchor]);
      }
    };
    if (this.options.deepLink) {
      this._checkDeepLink();
    }
    this._events();
    this._isInitializing = false;
  }
  /**
   * Adds event handlers for items within the accordion.
   * @private
   */
  _events() {
    var _this = this;
    this.$tabs.each(function() {
      var $elem = $(this);
      var $tabContent = $elem.children("[data-tab-content]");
      if ($tabContent.length) {
        $elem.children("a").off("click.zf.accordion keydown.zf.accordion").on("click.zf.accordion", function(e2) {
          e2.preventDefault();
          _this.toggle($tabContent);
        }).on("keydown.zf.accordion", function(e2) {
          Keyboard.handleKey(e2, "Accordion", {
            toggle: function() {
              _this.toggle($tabContent);
            },
            next: function() {
              var $a = $elem.next().find("a").focus();
              if (!_this.options.multiExpand) {
                $a.trigger("click.zf.accordion");
              }
            },
            previous: function() {
              var $a = $elem.prev().find("a").focus();
              if (!_this.options.multiExpand) {
                $a.trigger("click.zf.accordion");
              }
            },
            first: function() {
              var $a = _this.$tabs.first().find(".accordion-title").focus();
              if (!_this.options.multiExpand) {
                $a.trigger("click.zf.accordion");
              }
            },
            last: function() {
              var $a = _this.$tabs.last().find(".accordion-title").focus();
              if (!_this.options.multiExpand) {
                $a.trigger("click.zf.accordion");
              }
            },
            handled: function() {
              e2.preventDefault();
            }
          });
        });
      }
    });
    if (this.options.deepLink) {
      $(window).on("hashchange", this._checkDeepLink);
    }
  }
  /**
   * Toggles the selected content pane's open/close state.
   * @param {jQuery} $target - jQuery object of the pane to toggle (`.accordion-content`).
   * @function
   */
  toggle($target) {
    if ($target.closest("[data-accordion]").is("[disabled]")) {
      console.info("Cannot toggle an accordion that is disabled.");
      return;
    }
    if ($target.parent().hasClass("is-active")) {
      this.up($target);
    } else {
      this.down($target);
    }
    if (this.options.deepLink) {
      var anchor = $target.prev("a").attr("href");
      if (this.options.updateHistory) {
        history.pushState({}, "", anchor);
      } else {
        history.replaceState({}, "", anchor);
      }
    }
  }
  /**
   * Opens the accordion tab defined by `$target`.
   * @param {jQuery} $target - Accordion pane to open (`.accordion-content`).
   * @fires Accordion#down
   * @function
   */
  down($target) {
    if ($target.closest("[data-accordion]").is("[disabled]")) {
      console.info("Cannot call down on an accordion that is disabled.");
      return;
    }
    if (this.options.multiExpand)
      this._openTab($target);
    else
      this._openSingleTab($target);
  }
  /**
   * Closes the tab defined by `$target`.
   * It may be ignored if the Accordion options don't allow it.
   *
   * @param {jQuery} $target - Accordion tab to close (`.accordion-content`).
   * @fires Accordion#up
   * @function
   */
  up($target) {
    if (this.$element.is("[disabled]")) {
      console.info("Cannot call up on an accordion that is disabled.");
      return;
    }
    const $targetItem = $target.parent();
    if (!$targetItem.hasClass("is-active")) return;
    const $othersItems = $targetItem.siblings();
    if (!this.options.allowAllClosed && !$othersItems.hasClass("is-active")) return;
    this._closeTab($target);
  }
  /**
   * Make the tab defined by `$target` the only opened tab, closing all others tabs.
   * @param {jQuery} $target - Accordion tab to open (`.accordion-content`).
   * @function
   * @private
   */
  _openSingleTab($target) {
    const $activeContents = this.$element.children(".is-active").children("[data-tab-content]");
    if ($activeContents.length) {
      this._closeTab($activeContents.not($target));
    }
    this._openTab($target);
  }
  /**
   * Opens the tab defined by `$target`.
   * @param {jQuery} $target - Accordion tab to open (`.accordion-content`).
   * @fires Accordion#down
   * @function
   * @private
   */
  _openTab($target) {
    const $targetItem = $target.parent();
    const targetContentId = $target.attr("aria-labelledby");
    $target.attr("aria-hidden", false);
    $targetItem.addClass("is-active");
    $(`#${targetContentId}`).attr({
      "aria-expanded": true
    });
    $target.finish().slideDown(this.options.slideSpeed, () => {
      this.$element.trigger("down.zf.accordion", [$target]);
    });
  }
  /**
   * Closes the tab defined by `$target`.
   * @param {jQuery} $target - Accordion tab to close (`.accordion-content`).
   * @fires Accordion#up
   * @function
   * @private
   */
  _closeTab($target) {
    const $targetItem = $target.parent();
    const targetContentId = $target.attr("aria-labelledby");
    $target.attr("aria-hidden", true);
    $targetItem.removeClass("is-active");
    $(`#${targetContentId}`).attr({
      "aria-expanded": false
    });
    $target.finish().slideUp(this.options.slideSpeed, () => {
      this.$element.trigger("up.zf.accordion", [$target]);
    });
  }
  /**
   * Closes all active tabs
   * @fires Accordion#up
   * @function
   * @private
   */
  _closeAllTabs() {
    var $activeTabs = this.$element.children(".is-active").children("[data-tab-content]");
    if ($activeTabs.length) {
      this._closeTab($activeTabs);
    }
  }
  /**
   * Destroys an instance of an accordion.
   * @fires Accordion#destroyed
   * @function
   */
  _destroy() {
    this.$element.find("[data-tab-content]").stop(true).slideUp(0).css("display", "");
    this.$element.find("a").off(".zf.accordion");
    if (this.options.deepLink) {
      $(window).off("hashchange", this._checkDeepLink);
    }
  }
}
Accordion.defaults = {
  /**
   * Amount of time to animate the opening of an accordion pane.
   * @option
   * @type {number}
   * @default 250
   */
  slideSpeed: 250,
  /**
   * Allow the accordion to have multiple open panes.
   * @option
   * @type {boolean}
   * @default false
   */
  multiExpand: false,
  /**
   * Allow the accordion to close all panes.
   * @option
   * @type {boolean}
   * @default false
   */
  allowAllClosed: false,
  /**
   * Link the location hash to the open pane.
   * Set the location hash when the opened pane changes, and open and scroll to the corresponding pane when the location changes.
   * @option
   * @type {boolean}
   * @default false
   */
  deepLink: false,
  /**
   * If `deepLink` is enabled, adjust the deep link scroll to make sure the top of the accordion panel is visible
   * @option
   * @type {boolean}
   * @default false
   */
  deepLinkSmudge: false,
  /**
   * If `deepLinkSmudge` is enabled, animation time (ms) for the deep link adjustment
   * @option
   * @type {number}
   * @default 300
   */
  deepLinkSmudgeDelay: 300,
  /**
   * If `deepLinkSmudge` is enabled, the offset for scrollToTtop to prevent overlap by a sticky element at the top of the page
   * @option
   * @type {number}
   * @default 0
   */
  deepLinkSmudgeOffset: 0,
  /**
   * If `deepLink` is enabled, update the browser history with the open accordion
   * @option
   * @type {boolean}
   * @default false
   */
  updateHistory: false
};
class AccordionMenu extends Plugin {
  /**
   * Creates a new instance of an accordion menu.
   * @class
   * @name AccordionMenu
   * @fires AccordionMenu#init
   * @param {jQuery} element - jQuery object to make into an accordion menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, AccordionMenu.defaults, this.$element.data(), options);
    this.className = "AccordionMenu";
    this._init();
    Keyboard.register("AccordionMenu", {
      "ENTER": "toggle",
      "SPACE": "toggle",
      "ARROW_RIGHT": "open",
      "ARROW_UP": "up",
      "ARROW_DOWN": "down",
      "ARROW_LEFT": "close",
      "ESCAPE": "closeAll"
    });
  }
  /**
   * Initializes the accordion menu by hiding all nested menus.
   * @private
   */
  _init() {
    Nest.Feather(this.$element, "accordion");
    var _this = this;
    this.$element.find("[data-submenu]").not(".is-active").slideUp(0);
    this.$element.attr({
      "aria-multiselectable": this.options.multiOpen
    });
    this.$menuLinks = this.$element.find(".is-accordion-submenu-parent");
    this.$menuLinks.each(function() {
      var linkId = this.id || GetYoDigits(6, "acc-menu-link"), $elem = $(this), $sub = $elem.children("[data-submenu]"), subId = $sub[0].id || GetYoDigits(6, "acc-menu"), isActive = $sub.hasClass("is-active");
      if (_this.options.parentLink) {
        let $anchor = $elem.children("a");
        $anchor.clone().prependTo($sub).wrap('<li data-is-parent-link class="is-submenu-parent-item is-submenu-item is-accordion-submenu-item"></li>');
      }
      if (_this.options.submenuToggle) {
        $elem.addClass("has-submenu-toggle");
        $elem.children("a").after('<button id="' + linkId + '" class="submenu-toggle" aria-controls="' + subId + '" aria-expanded="' + isActive + '" title="' + _this.options.submenuToggleText + '"><span class="submenu-toggle-text">' + _this.options.submenuToggleText + "</span></button>");
      } else {
        $elem.attr({
          "aria-controls": subId,
          "aria-expanded": isActive,
          "id": linkId
        });
      }
      $sub.attr({
        "aria-labelledby": linkId,
        "aria-hidden": !isActive,
        "role": "group",
        "id": subId
      });
    });
    var initPanes = this.$element.find(".is-active");
    if (initPanes.length) {
      initPanes.each(function() {
        _this.down($(this));
      });
    }
    this._events();
  }
  /**
   * Adds event handlers for items within the menu.
   * @private
   */
  _events() {
    var _this = this;
    this.$element.find("li").each(function() {
      var $submenu = $(this).children("[data-submenu]");
      if ($submenu.length) {
        if (_this.options.submenuToggle) {
          $(this).children(".submenu-toggle").off("click.zf.accordionMenu").on("click.zf.accordionMenu", function() {
            _this.toggle($submenu);
          });
        } else {
          $(this).children("a").off("click.zf.accordionMenu").on("click.zf.accordionMenu", function(e2) {
            e2.preventDefault();
            _this.toggle($submenu);
          });
        }
      }
    }).on("keydown.zf.accordionMenu", function(e2) {
      var $element = $(this), $elements = $element.parent("ul").children("li"), $prevElement, $nextElement, $target = $element.children("[data-submenu]");
      $elements.each(function(i2) {
        if ($(this).is($element)) {
          $prevElement = $elements.eq(Math.max(0, i2 - 1)).find("a").first();
          $nextElement = $elements.eq(Math.min(i2 + 1, $elements.length - 1)).find("a").first();
          if ($(this).children("[data-submenu]:visible").length) {
            $nextElement = $element.find("li:first-child").find("a").first();
          }
          if ($(this).is(":first-child")) {
            $prevElement = $element.parents("li").first().find("a").first();
          } else if ($prevElement.parents("li").first().children("[data-submenu]:visible").length) {
            $prevElement = $prevElement.parents("li").find("li:last-child").find("a").first();
          }
          if ($(this).is(":last-child")) {
            $nextElement = $element.parents("li").first().next("li").find("a").first();
          }
          return;
        }
      });
      Keyboard.handleKey(e2, "AccordionMenu", {
        open: function() {
          if ($target.is(":hidden")) {
            _this.down($target);
            $target.find("li").first().find("a").first().focus();
          }
        },
        close: function() {
          if ($target.length && !$target.is(":hidden")) {
            _this.up($target);
          } else if ($element.parent("[data-submenu]").length) {
            _this.up($element.parent("[data-submenu]"));
            $element.parents("li").first().find("a").first().focus();
          }
        },
        up: function() {
          $prevElement.focus();
          return true;
        },
        down: function() {
          $nextElement.focus();
          return true;
        },
        toggle: function() {
          if (_this.options.submenuToggle) {
            return false;
          }
          if ($element.children("[data-submenu]").length) {
            _this.toggle($element.children("[data-submenu]"));
            return true;
          }
        },
        closeAll: function() {
          _this.hideAll();
        },
        handled: function(preventDefault) {
          if (preventDefault) {
            e2.preventDefault();
          }
        }
      });
    });
  }
  /**
   * Closes all panes of the menu.
   * @function
   */
  hideAll() {
    this.up(this.$element.find("[data-submenu]"));
  }
  /**
   * Opens all panes of the menu.
   * @function
   */
  showAll() {
    this.down(this.$element.find("[data-submenu]"));
  }
  /**
   * Toggles the open/close state of a submenu.
   * @function
   * @param {jQuery} $target - the submenu to toggle
   */
  toggle($target) {
    if (!$target.is(":animated")) {
      if (!$target.is(":hidden")) {
        this.up($target);
      } else {
        this.down($target);
      }
    }
  }
  /**
   * Opens the sub-menu defined by `$target`.
   * @param {jQuery} $target - Sub-menu to open.
   * @fires AccordionMenu#down
   */
  down($target) {
    if (!this.options.multiOpen) {
      const $targetBranch = $target.parentsUntil(this.$element).add($target).add($target.find(".is-active"));
      const $othersActiveSubmenus = this.$element.find(".is-active").not($targetBranch);
      this.up($othersActiveSubmenus);
    }
    $target.addClass("is-active").attr({ "aria-hidden": false });
    if (this.options.submenuToggle) {
      $target.prev(".submenu-toggle").attr({ "aria-expanded": true });
    } else {
      $target.parent(".is-accordion-submenu-parent").attr({ "aria-expanded": true });
    }
    $target.slideDown(this.options.slideSpeed, () => {
      this.$element.trigger("down.zf.accordionMenu", [$target]);
    });
  }
  /**
   * Closes the sub-menu defined by `$target`. All sub-menus inside the target will be closed as well.
   * @param {jQuery} $target - Sub-menu to close.
   * @fires AccordionMenu#up
   */
  up($target) {
    const $submenus = $target.find("[data-submenu]");
    const $allmenus = $target.add($submenus);
    $submenus.slideUp(0);
    $allmenus.removeClass("is-active").attr("aria-hidden", true);
    if (this.options.submenuToggle) {
      $allmenus.prev(".submenu-toggle").attr("aria-expanded", false);
    } else {
      $allmenus.parent(".is-accordion-submenu-parent").attr("aria-expanded", false);
    }
    $target.slideUp(this.options.slideSpeed, () => {
      this.$element.trigger("up.zf.accordionMenu", [$target]);
    });
  }
  /**
   * Destroys an instance of accordion menu.
   * @fires AccordionMenu#destroyed
   */
  _destroy() {
    this.$element.find("[data-submenu]").slideDown(0).css("display", "");
    this.$element.find("a").off("click.zf.accordionMenu");
    this.$element.find("[data-is-parent-link]").detach();
    if (this.options.submenuToggle) {
      this.$element.find(".has-submenu-toggle").removeClass("has-submenu-toggle");
      this.$element.find(".submenu-toggle").remove();
    }
    Nest.Burn(this.$element, "accordion");
  }
}
AccordionMenu.defaults = {
  /**
   * Adds the parent link to the submenu.
   * @option
   * @type {boolean}
   * @default false
   */
  parentLink: false,
  /**
   * Amount of time to animate the opening of a submenu in ms.
   * @option
   * @type {number}
   * @default 250
   */
  slideSpeed: 250,
  /**
   * Adds a separate submenu toggle button. This allows the parent item to have a link.
   * @option
   * @example true
   */
  submenuToggle: false,
  /**
   * The text used for the submenu toggle if enabled. This is used for screen readers only.
   * @option
   * @example true
   */
  submenuToggleText: "Toggle menu",
  /**
   * Allow the menu to have multiple open panes.
   * @option
   * @type {boolean}
   * @default true
   */
  multiOpen: true
};
class OffCanvas extends Plugin {
  /**
   * Creates a new instance of an off-canvas wrapper.
   * @class
   * @name OffCanvas
   * @fires OffCanvas#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.className = "OffCanvas";
    this.$element = element;
    this.options = $.extend({}, OffCanvas.defaults, this.$element.data(), options);
    this.contentClasses = { base: [], reveal: [] };
    this.$lastTrigger = $();
    this.$triggers = $();
    this.position = "left";
    this.$content = $();
    this.nested = !!this.options.nested;
    this.$sticky = $();
    this.isInCanvas = false;
    $(["push", "overlap"]).each((index, val) => {
      this.contentClasses.base.push("has-transition-" + val);
    });
    $(["left", "right", "top", "bottom"]).each((index, val) => {
      this.contentClasses.base.push("has-position-" + val);
      this.contentClasses.reveal.push("has-reveal-" + val);
    });
    Triggers.init($);
    MediaQuery._init();
    this._init();
    this._events();
    Keyboard.register("OffCanvas", {
      "ESCAPE": "close"
    });
  }
  /**
   * Initializes the off-canvas wrapper by adding the exit overlay (if needed).
   * @function
   * @private
   */
  _init() {
    var id = this.$element.attr("id");
    this.$element.attr("aria-hidden", "true");
    if (this.options.contentId) {
      this.$content = $("#" + this.options.contentId);
    } else if (this.$element.siblings("[data-off-canvas-content]").length) {
      this.$content = this.$element.siblings("[data-off-canvas-content]").first();
    } else {
      this.$content = this.$element.closest("[data-off-canvas-content]").first();
    }
    if (!this.options.contentId) {
      this.nested = this.$element.siblings("[data-off-canvas-content]").length === 0;
    } else if (this.options.contentId && this.options.nested === null) {
      console.warn("Remember to use the nested option if using the content ID option!");
    }
    if (this.nested === true) {
      this.options.transition = "overlap";
      this.$element.removeClass("is-transition-push");
    }
    this.$element.addClass(`is-transition-${this.options.transition} is-closed`);
    this.$triggers = $(document).find('[data-open="' + id + '"], [data-close="' + id + '"], [data-toggle="' + id + '"]').attr("aria-expanded", "false").attr("aria-controls", id);
    this.position = this.$element.is(".position-left, .position-top, .position-right, .position-bottom") ? this.$element.attr("class").match(/position\-(left|top|right|bottom)/)[1] : this.position;
    if (this.options.contentOverlay === true) {
      var overlay = document.createElement("div");
      var overlayPosition = $(this.$element).css("position") === "fixed" ? "is-overlay-fixed" : "is-overlay-absolute";
      overlay.setAttribute("class", "js-off-canvas-overlay " + overlayPosition);
      this.$overlay = $(overlay);
      if (overlayPosition === "is-overlay-fixed") {
        $(this.$overlay).insertAfter(this.$element);
      } else {
        this.$content.append(this.$overlay);
      }
    }
    var revealOnRegExp = new RegExp(RegExpEscape(this.options.revealClass) + "([^\\s]+)", "g");
    var revealOnClass = revealOnRegExp.exec(this.$element[0].className);
    if (revealOnClass) {
      this.options.isRevealed = true;
      this.options.revealOn = this.options.revealOn || revealOnClass[1];
    }
    if (this.options.isRevealed === true && this.options.revealOn) {
      this.$element.first().addClass(`${this.options.revealClass}${this.options.revealOn}`);
      this._setMQChecker();
    }
    if (this.options.transitionTime) {
      this.$element.css("transition-duration", this.options.transitionTime);
    }
    this.$sticky = this.$content.find("[data-off-canvas-sticky]");
    if (this.$sticky.length > 0 && this.options.transition === "push") {
      this.options.contentScroll = false;
    }
    let inCanvasFor = this.$element.attr("class").match(/\bin-canvas-for-(\w+)/);
    if (inCanvasFor && inCanvasFor.length === 2) {
      this.options.inCanvasOn = inCanvasFor[1];
    } else if (this.options.inCanvasOn) {
      this.$element.addClass(`in-canvas-for-${this.options.inCanvasOn}`);
    }
    if (this.options.inCanvasOn) {
      this._checkInCanvas();
    }
    this._removeContentClasses();
  }
  /**
   * Adds event handlers to the off-canvas wrapper and the exit overlay.
   * @function
   * @private
   */
  _events() {
    this.$element.off(".zf.trigger .zf.offCanvas").on({
      "open.zf.trigger": this.open.bind(this),
      "close.zf.trigger": this.close.bind(this),
      "toggle.zf.trigger": this.toggle.bind(this),
      "keydown.zf.offCanvas": this._handleKeyboard.bind(this)
    });
    if (this.options.closeOnClick === true) {
      var $target = this.options.contentOverlay ? this.$overlay : this.$content;
      $target.on({ "click.zf.offCanvas": this.close.bind(this) });
    }
    if (this.options.inCanvasOn) {
      $(window).on("changed.zf.mediaquery", () => {
        this._checkInCanvas();
      });
    }
  }
  /**
   * Applies event listener for elements that will reveal at certain breakpoints.
   * @private
   */
  _setMQChecker() {
    var _this = this;
    this.onLoadListener = onLoad($(window), function() {
      if (MediaQuery.atLeast(_this.options.revealOn)) {
        _this.reveal(true);
      }
    });
    $(window).on("changed.zf.mediaquery", function() {
      if (MediaQuery.atLeast(_this.options.revealOn)) {
        _this.reveal(true);
      } else {
        _this.reveal(false);
      }
    });
  }
  /**
   * Checks if InCanvas on current breakpoint and adjust off-canvas accordingly
   * @private
   */
  _checkInCanvas() {
    this.isInCanvas = MediaQuery.atLeast(this.options.inCanvasOn);
    if (this.isInCanvas === true) {
      this.close();
    }
  }
  /**
   * Removes the CSS transition/position classes of the off-canvas content container.
   * Removing the classes is important when another off-canvas gets opened that uses the same content container.
   * @param {Boolean} hasReveal - true if related off-canvas element is revealed.
   * @private
   */
  _removeContentClasses(hasReveal) {
    if (typeof hasReveal !== "boolean") {
      this.$content.removeClass(this.contentClasses.base.join(" "));
    } else if (hasReveal === false) {
      this.$content.removeClass(`has-reveal-${this.position}`);
    }
  }
  /**
   * Adds the CSS transition/position classes of the off-canvas content container, based on the opening off-canvas element.
   * Beforehand any transition/position class gets removed.
   * @param {Boolean} hasReveal - true if related off-canvas element is revealed.
   * @private
   */
  _addContentClasses(hasReveal) {
    this._removeContentClasses(hasReveal);
    if (typeof hasReveal !== "boolean") {
      this.$content.addClass(`has-transition-${this.options.transition} has-position-${this.position}`);
    } else if (hasReveal === true) {
      this.$content.addClass(`has-reveal-${this.position}`);
    }
  }
  /**
   * Preserves the fixed behavior of sticky elements on opening an off-canvas with push transition.
   * Since the off-canvas container has got a transform scope in such a case, it is done by calculating position absolute values.
   * @private
   */
  _fixStickyElements() {
    this.$sticky.each((_2, el) => {
      const $el = $(el);
      if ($el.css("position") === "fixed") {
        let topVal = parseInt($el.css("top"), 10);
        $el.data("offCanvasSticky", { top: topVal });
        let absoluteTopVal = $(document).scrollTop() + topVal;
        $el.css({ top: `${absoluteTopVal}px`, width: "100%", transition: "none" });
      }
    });
  }
  /**
   * Restores the original fixed styling of sticky elements after having closed an off-canvas that got pseudo fixed beforehand.
   * This reverts the changes of _fixStickyElements()
   * @private
   */
  _unfixStickyElements() {
    this.$sticky.each((_2, el) => {
      const $el = $(el);
      let stickyData = $el.data("offCanvasSticky");
      if (typeof stickyData === "object") {
        $el.css({ top: `${stickyData.top}px`, width: "", transition: "" });
        $el.data("offCanvasSticky", "");
      }
    });
  }
  /**
   * Handles the revealing/hiding the off-canvas at breakpoints, not the same as open.
   * @param {Boolean} isRevealed - true if element should be revealed.
   * @function
   */
  reveal(isRevealed) {
    if (isRevealed) {
      this.close();
      this.isRevealed = true;
      this.$element.attr("aria-hidden", "false");
      this.$element.off("open.zf.trigger toggle.zf.trigger");
      this.$element.removeClass("is-closed");
    } else {
      this.isRevealed = false;
      this.$element.attr("aria-hidden", "true");
      this.$element.off("open.zf.trigger toggle.zf.trigger").on({
        "open.zf.trigger": this.open.bind(this),
        "toggle.zf.trigger": this.toggle.bind(this)
      });
      this.$element.addClass("is-closed");
    }
    this._addContentClasses(isRevealed);
  }
  /**
   * Stops scrolling of the body when OffCanvas is open on mobile Safari and other troublesome browsers.
   * @function
   * @private
   */
  _stopScrolling() {
    return false;
  }
  /**
   * Save current finger y-position
   * @param event
   * @private
   */
  _recordScrollable(event) {
    const elem = this;
    elem.lastY = event.touches[0].pageY;
  }
  /**
   * Prevent further scrolling when it hits the edges
   * @param event
   * @private
   */
  _preventDefaultAtEdges(event) {
    const elem = this;
    const _this = event.data;
    const delta = elem.lastY - event.touches[0].pageY;
    elem.lastY = event.touches[0].pageY;
    if (!_this._canScroll(delta, elem)) {
      event.preventDefault();
    }
  }
  /**
   * Handle continuous scrolling of scrollbox
   * Don't bubble up to _preventDefaultAtEdges
   * @param event
   * @private
   */
  _scrollboxTouchMoved(event) {
    const elem = this;
    const _this = event.data;
    const parent = elem.closest("[data-off-canvas], [data-off-canvas-scrollbox-outer]");
    const delta = elem.lastY - event.touches[0].pageY;
    parent.lastY = elem.lastY = event.touches[0].pageY;
    event.stopPropagation();
    if (!_this._canScroll(delta, elem)) {
      if (!_this._canScroll(delta, parent)) {
        event.preventDefault();
      } else {
        parent.scrollTop += delta;
      }
    }
  }
  /**
   * Detect possibility of scrolling
   * @param delta
   * @param elem
   * @returns boolean
   * @private
   */
  _canScroll(delta, elem) {
    const up = delta < 0;
    const down = delta > 0;
    const allowUp = elem.scrollTop > 0;
    const allowDown = elem.scrollTop < elem.scrollHeight - elem.clientHeight;
    return up && allowUp || down && allowDown;
  }
  /**
   * Opens the off-canvas menu.
   * @function
   * @param {Object} event - Event object passed from listener.
   * @param {jQuery} trigger - element that triggered the off-canvas to open.
   * @fires OffCanvas#opened
   * @todo also trigger 'open' event?
   */
  open(event, trigger) {
    if (this.$element.hasClass("is-open") || this.isRevealed || this.isInCanvas) {
      return;
    }
    var _this = this;
    if (trigger) {
      this.$lastTrigger = trigger;
    }
    if (this.options.forceTo === "top") {
      window.scrollTo(0, 0);
    } else if (this.options.forceTo === "bottom") {
      window.scrollTo(0, document.body.scrollHeight);
    }
    if (this.options.transitionTime && this.options.transition !== "overlap") {
      this.$element.siblings("[data-off-canvas-content]").css("transition-duration", this.options.transitionTime);
    } else {
      this.$element.siblings("[data-off-canvas-content]").css("transition-duration", "");
    }
    this.$element.addClass("is-open").removeClass("is-closed");
    this.$triggers.attr("aria-expanded", "true");
    this.$element.attr("aria-hidden", "false");
    this.$content.addClass("is-open-" + this.position);
    if (this.options.contentScroll === false) {
      $("body").addClass("is-off-canvas-open").on("touchmove", this._stopScrolling);
      this.$element.on("touchstart", this._recordScrollable);
      this.$element.on("touchmove", this, this._preventDefaultAtEdges);
      this.$element.on("touchstart", "[data-off-canvas-scrollbox]", this._recordScrollable);
      this.$element.on("touchmove", "[data-off-canvas-scrollbox]", this, this._scrollboxTouchMoved);
    }
    if (this.options.contentOverlay === true) {
      this.$overlay.addClass("is-visible");
    }
    if (this.options.closeOnClick === true && this.options.contentOverlay === true) {
      this.$overlay.addClass("is-closable");
    }
    if (this.options.autoFocus === true) {
      this.$element.one(transitionend(this.$element), function() {
        if (!_this.$element.hasClass("is-open")) {
          return;
        }
        var canvasFocus = _this.$element.find("[data-autofocus]");
        if (canvasFocus.length) {
          canvasFocus.eq(0).focus();
        } else {
          _this.$element.find("a, button").eq(0).focus();
        }
      });
    }
    if (this.options.trapFocus === true) {
      this.$content.attr("tabindex", "-1");
      Keyboard.trapFocus(this.$element);
    }
    if (this.options.transition === "push") {
      this._fixStickyElements();
    }
    this._addContentClasses();
    this.$element.trigger("opened.zf.offCanvas");
    this.$element.one(transitionend(this.$element), () => {
      this.$element.trigger("openedEnd.zf.offCanvas");
    });
  }
  /**
   * Closes the off-canvas menu.
   * @function
   * @param {Function} cb - optional cb to fire after closure.
   * @fires OffCanvas#close
   * @fires OffCanvas#closed
   */
  close() {
    if (!this.$element.hasClass("is-open") || this.isRevealed) {
      return;
    }
    this.$element.trigger("close.zf.offCanvas");
    this.$element.removeClass("is-open");
    this.$element.attr("aria-hidden", "true");
    this.$content.removeClass("is-open-left is-open-top is-open-right is-open-bottom");
    if (this.options.contentOverlay === true) {
      this.$overlay.removeClass("is-visible");
    }
    if (this.options.closeOnClick === true && this.options.contentOverlay === true) {
      this.$overlay.removeClass("is-closable");
    }
    this.$triggers.attr("aria-expanded", "false");
    this.$element.one(transitionend(this.$element), () => {
      this.$element.addClass("is-closed");
      this._removeContentClasses();
      if (this.options.transition === "push") {
        this._unfixStickyElements();
      }
      if (this.options.contentScroll === false) {
        $("body").removeClass("is-off-canvas-open").off("touchmove", this._stopScrolling);
        this.$element.off("touchstart", this._recordScrollable);
        this.$element.off("touchmove", this._preventDefaultAtEdges);
        this.$element.off("touchstart", "[data-off-canvas-scrollbox]", this._recordScrollable);
        this.$element.off("touchmove", "[data-off-canvas-scrollbox]", this._scrollboxTouchMoved);
      }
      if (this.options.trapFocus === true) {
        this.$content.removeAttr("tabindex");
        Keyboard.releaseFocus(this.$element);
      }
      this.$element.trigger("closed.zf.offCanvas");
    });
  }
  /**
   * Toggles the off-canvas menu open or closed.
   * @function
   * @param {Object} event - Event object passed from listener.
   * @param {jQuery} trigger - element that triggered the off-canvas to open.
   */
  toggle(event, trigger) {
    if (this.$element.hasClass("is-open")) {
      this.close(event, trigger);
    } else {
      this.open(event, trigger);
    }
  }
  /**
   * Handles keyboard input when detected. When the escape key is pressed, the off-canvas menu closes, and focus is restored to the element that opened the menu.
   * @function
   * @private
   */
  _handleKeyboard(e2) {
    Keyboard.handleKey(e2, "OffCanvas", {
      close: () => {
        this.close();
        this.$lastTrigger.focus();
        return true;
      },
      handled: () => {
        e2.preventDefault();
      }
    });
  }
  /**
   * Destroys the OffCanvas plugin.
   * @function
   */
  _destroy() {
    this.close();
    this.$element.off(".zf.trigger .zf.offCanvas");
    this.$overlay.off(".zf.offCanvas");
    if (this.onLoadListener) $(window).off(this.onLoadListener);
  }
}
OffCanvas.defaults = {
  /**
   * Allow the user to click outside of the menu to close it.
   * @option
   * @type {boolean}
   * @default true
   */
  closeOnClick: true,
  /**
   * Adds an overlay on top of `[data-off-canvas-content]`.
   * @option
   * @type {boolean}
   * @default true
   */
  contentOverlay: true,
  /**
   * Target an off-canvas content container by ID that may be placed anywhere. If null the closest content container will be taken.
   * @option
   * @type {?string}
   * @default null
   */
  contentId: null,
  /**
   * Define the off-canvas element is nested in an off-canvas content. This is required when using the contentId option for a nested element.
   * @option
   * @type {boolean}
   * @default null
   */
  nested: null,
  /**
   * Enable/disable scrolling of the main content when an off canvas panel is open.
   * @option
   * @type {boolean}
   * @default true
   */
  contentScroll: true,
  /**
   * Amount of time the open and close transition requires, including the appropriate milliseconds (`ms`) or seconds (`s`) unit (e.g. `500ms`, `.75s`) If none selected, pulls from body style.
   * @option
   * @type {string}
   * @default null
   */
  transitionTime: null,
  /**
   * Type of transition for the OffCanvas menu. Options are 'push', 'detached' or 'slide'.
   * @option
   * @type {string}
   * @default push
   */
  transition: "push",
  /**
   * Force the page to scroll to top or bottom on open.
   * @option
   * @type {?string}
   * @default null
   */
  forceTo: null,
  /**
   * Allow the OffCanvas to remain open for certain breakpoints.
   * @option
   * @type {boolean}
   * @default false
   */
  isRevealed: false,
  /**
   * Breakpoint at which to reveal. JS will use a RegExp to target standard classes, if changing classnames, pass your class with the `revealClass` option.
   * @option
   * @type {?string}
   * @default null
   */
  revealOn: null,
  /**
   * Breakpoint at which the off-canvas gets moved into canvas content and acts as regular page element.
   * @option
   * @type {?string}
   * @default null
   */
  inCanvasOn: null,
  /**
   * Force focus to the offcanvas on open. If true, will focus the opening trigger on close.
   * @option
   * @type {boolean}
   * @default true
   */
  autoFocus: true,
  /**
   * Class used to force an OffCanvas to remain open. Foundation defaults for this are `reveal-for-large` & `reveal-for-medium`.
   * @option
   * @type {string}
   * @default reveal-for-
   * @todo improve the regex testing for this.
   */
  revealClass: "reveal-for-",
  /**
   * Triggers optional focus trapping when opening an OffCanvas. Sets tabindex of [data-off-canvas-content] to -1 for accessibility purposes.
   * @option
   * @type {boolean}
   * @default false
   */
  trapFocus: false
};
class SmoothScroll extends Plugin {
  /**
   * Creates a new instance of SmoothScroll.
   * @class
   * @name SmoothScroll
   * @fires SmoothScroll#init
   * @param {Object} element - jQuery object to add the trigger to.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, SmoothScroll.defaults, this.$element.data(), options);
    this.className = "SmoothScroll";
    this._init();
  }
  /**
   * Initialize the SmoothScroll plugin
   * @private
   */
  _init() {
    const id = this.$element[0].id || GetYoDigits(6, "smooth-scroll");
    this.$element.attr({ id });
    this._events();
  }
  /**
   * Initializes events for SmoothScroll.
   * @private
   */
  _events() {
    this._linkClickListener = this._handleLinkClick.bind(this);
    this.$element.on("click.zf.smoothScroll", this._linkClickListener);
    this.$element.on("click.zf.smoothScroll", 'a[href^="#"]', this._linkClickListener);
  }
  /**
   * Handle the given event to smoothly scroll to the anchor pointed by the event target.
   * @param {*} e - event
   * @function
   * @private
   */
  _handleLinkClick(e2) {
    if (!$(e2.currentTarget).is('a[href^="#"]')) return;
    const arrival = e2.currentTarget.getAttribute("href");
    this._inTransition = true;
    SmoothScroll.scrollToLoc(arrival, this.options, () => {
      this._inTransition = false;
    });
    e2.preventDefault();
  }
  /**
   * Function to scroll to a given location on the page.
   * @param {String} loc - A properly formatted jQuery id selector. Example: '#foo'
   * @param {Object} options - The options to use.
   * @param {Function} callback - The callback function.
   * @static
   * @function
   */
  static scrollToLoc(loc, options = SmoothScroll.defaults, callback) {
    const $loc = $(loc);
    if (!$loc.length) return false;
    var scrollPos = Math.round($loc.offset().top - options.threshold / 2 - options.offset);
    $("html, body").stop(true).animate(
      { scrollTop: scrollPos },
      options.animationDuration,
      options.animationEasing,
      () => {
        if (typeof callback === "function") {
          callback();
        }
      }
    );
  }
  /**
   * Destroys the SmoothScroll instance.
   * @function
   */
  _destroy() {
    this.$element.off("click.zf.smoothScroll", this._linkClickListener);
    this.$element.off("click.zf.smoothScroll", 'a[href^="#"]', this._linkClickListener);
  }
}
SmoothScroll.defaults = {
  /**
   * Amount of time, in ms, the animated scrolling should take between locations.
   * @option
   * @type {number}
   * @default 500
   */
  animationDuration: 500,
  /**
   * Animation style to use when scrolling between locations. Can be `'swing'` or `'linear'`.
   * @option
   * @type {string}
   * @default 'linear'
   * @see {@link https://api.jquery.com/animate|Jquery animate}
   */
  animationEasing: "linear",
  /**
   * Number of pixels to use as a marker for location changes.
   * @option
   * @type {number}
   * @default 50
   */
  threshold: 50,
  /**
   * Number of pixels to offset the scroll of the page on item click if using a sticky nav bar.
   * @option
   * @type {number}
   * @default 0
   */
  offset: 0
};
class Tabs extends Plugin {
  /**
   * Creates a new instance of tabs.
   * @class
   * @name Tabs
   * @fires Tabs#init
   * @param {jQuery} element - jQuery object to make into tabs.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, Tabs.defaults, this.$element.data(), options);
    this.className = "Tabs";
    this._init();
    Keyboard.register("Tabs", {
      "ENTER": "open",
      "SPACE": "open",
      "ARROW_RIGHT": "next",
      "ARROW_UP": "previous",
      "ARROW_DOWN": "next",
      "ARROW_LEFT": "previous"
      // 'TAB': 'next',
      // 'SHIFT_TAB': 'previous'
    });
  }
  /**
   * Initializes the tabs by showing and focusing (if autoFocus=true) the preset active tab.
   * @private
   */
  _init() {
    var _this = this;
    this._isInitializing = true;
    this.$element.attr({ "role": "tablist" });
    this.$tabTitles = this.$element.find(`.${this.options.linkClass}`);
    this.$tabContent = $(`[data-tabs-content="${this.$element[0].id}"]`);
    this.$tabTitles.each(function() {
      var $elem = $(this), $link = $elem.find("a"), isActive = $elem.hasClass(`${_this.options.linkActiveClass}`), hash = $link.attr("data-tabs-target") || $link[0].hash.slice(1), linkId = $link[0].id ? $link[0].id : `${hash}-label`, $tabContent = $(`#${hash}`);
      $elem.attr({ "role": "presentation" });
      $link.attr({
        "role": "tab",
        "aria-controls": hash,
        "aria-selected": isActive,
        "id": linkId,
        "tabindex": isActive ? "0" : "-1"
      });
      $tabContent.attr({
        "role": "tabpanel",
        "aria-labelledby": linkId
      });
      if (isActive) {
        _this._initialAnchor = `#${hash}`;
      }
      if (!isActive) {
        $tabContent.attr("aria-hidden", "true");
      }
      if (isActive && _this.options.autoFocus) {
        _this.onLoadListener = onLoad($(window), function() {
          $("html, body").animate({ scrollTop: $elem.offset().top }, _this.options.deepLinkSmudgeDelay, () => {
            $link.focus();
          });
        });
      }
    });
    if (this.options.matchHeight) {
      var $images = this.$tabContent.find("img");
      if ($images.length) {
        onImagesLoaded($images, this._setHeight.bind(this));
      } else {
        this._setHeight();
      }
    }
    this._checkDeepLink = () => {
      var anchor = window.location.hash;
      if (!anchor.length) {
        if (this._isInitializing) return;
        if (this._initialAnchor) anchor = this._initialAnchor;
      }
      var anchorNoHash = anchor.indexOf("#") >= 0 ? anchor.slice(1) : anchor;
      var $anchor = anchorNoHash && $(`#${anchorNoHash}`);
      var $link = anchor && this.$element.find(`[href$="${anchor}"],[data-tabs-target="${anchorNoHash}"]`).first();
      var isOwnAnchor = !!($anchor.length && $link.length);
      if (isOwnAnchor) {
        if ($anchor && $anchor.length && $link && $link.length) {
          this.selectTab($anchor, true);
        } else {
          this._collapse();
        }
        if (this.options.deepLinkSmudge) {
          var offset = this.$element.offset();
          $("html, body").animate({ scrollTop: offset.top - this.options.deepLinkSmudgeOffset }, this.options.deepLinkSmudgeDelay);
        }
        this.$element.trigger("deeplink.zf.tabs", [$link, $anchor]);
      }
    };
    if (this.options.deepLink) {
      this._checkDeepLink();
    }
    this._events();
    this._isInitializing = false;
  }
  /**
   * Adds event handlers for items within the tabs.
   * @private
   */
  _events() {
    this._addKeyHandler();
    this._addClickHandler();
    this._setHeightMqHandler = null;
    if (this.options.matchHeight) {
      this._setHeightMqHandler = this._setHeight.bind(this);
      $(window).on("changed.zf.mediaquery", this._setHeightMqHandler);
    }
    if (this.options.deepLink) {
      $(window).on("hashchange", this._checkDeepLink);
    }
  }
  /**
   * Adds click handlers for items within the tabs.
   * @private
   */
  _addClickHandler() {
    var _this = this;
    this.$element.off("click.zf.tabs").on("click.zf.tabs", `.${this.options.linkClass}`, function(e2) {
      e2.preventDefault();
      _this._handleTabChange($(this));
    });
  }
  /**
   * Adds keyboard event handlers for items within the tabs.
   * @private
   */
  _addKeyHandler() {
    var _this = this;
    this.$tabTitles.off("keydown.zf.tabs").on("keydown.zf.tabs", function(e2) {
      if (e2.which === 9) return;
      var $element = $(this), $elements = $element.parent("ul").children("li"), $prevElement, $nextElement;
      $elements.each(function(i2) {
        if ($(this).is($element)) {
          if (_this.options.wrapOnKeys) {
            $prevElement = i2 === 0 ? $elements.last() : $elements.eq(i2 - 1);
            $nextElement = i2 === $elements.length - 1 ? $elements.first() : $elements.eq(i2 + 1);
          } else {
            $prevElement = $elements.eq(Math.max(0, i2 - 1));
            $nextElement = $elements.eq(Math.min(i2 + 1, $elements.length - 1));
          }
          return;
        }
      });
      Keyboard.handleKey(e2, "Tabs", {
        open: function() {
          $element.find('[role="tab"]').focus();
          _this._handleTabChange($element);
        },
        previous: function() {
          $prevElement.find('[role="tab"]').focus();
          _this._handleTabChange($prevElement);
        },
        next: function() {
          $nextElement.find('[role="tab"]').focus();
          _this._handleTabChange($nextElement);
        },
        handled: function() {
          e2.preventDefault();
        }
      });
    });
  }
  /**
   * Opens the tab `$targetContent` defined by `$target`. Collapses active tab.
   * @param {jQuery} $target - Tab to open.
   * @param {boolean} historyHandled - browser has already handled a history update
   * @fires Tabs#change
   * @function
   */
  _handleTabChange($target, historyHandled) {
    if ($target.hasClass(`${this.options.linkActiveClass}`)) {
      if (this.options.activeCollapse) {
        this._collapse();
      }
      return;
    }
    var $oldTab = this.$element.find(`.${this.options.linkClass}.${this.options.linkActiveClass}`), $tabLink = $target.find('[role="tab"]'), target = $tabLink.attr("data-tabs-target"), anchor = target && target.length ? `#${target}` : $tabLink[0].hash, $targetContent = this.$tabContent.find(anchor);
    this._collapseTab($oldTab);
    this._openTab($target);
    if (this.options.deepLink && !historyHandled) {
      if (this.options.updateHistory) {
        history.pushState({}, "", location.pathname + location.search + anchor);
      } else {
        history.replaceState({}, "", location.pathname + location.search + anchor);
      }
    }
    this.$element.trigger("change.zf.tabs", [$target, $targetContent]);
    $targetContent.find("[data-mutate]").trigger("mutateme.zf.trigger");
  }
  /**
   * Opens the tab `$targetContent` defined by `$target`.
   * @param {jQuery} $target - Tab to open.
   * @function
   */
  _openTab($target) {
    var $tabLink = $target.find('[role="tab"]'), hash = $tabLink.attr("data-tabs-target") || $tabLink[0].hash.slice(1), $targetContent = this.$tabContent.find(`#${hash}`);
    $target.addClass(`${this.options.linkActiveClass}`);
    $tabLink.attr({
      "aria-selected": "true",
      "tabindex": "0"
    });
    $targetContent.addClass(`${this.options.panelActiveClass}`).removeAttr("aria-hidden");
  }
  /**
   * Collapses `$targetContent` defined by `$target`.
   * @param {jQuery} $target - Tab to collapse.
   * @function
   */
  _collapseTab($target) {
    var $targetAnchor = $target.removeClass(`${this.options.linkActiveClass}`).find('[role="tab"]').attr({
      "aria-selected": "false",
      "tabindex": -1
    });
    $(`#${$targetAnchor.attr("aria-controls")}`).removeClass(`${this.options.panelActiveClass}`).attr({ "aria-hidden": "true" });
  }
  /**
   * Collapses the active Tab.
   * @fires Tabs#collapse
   * @function
   */
  _collapse() {
    var $activeTab = this.$element.find(`.${this.options.linkClass}.${this.options.linkActiveClass}`);
    if ($activeTab.length) {
      this._collapseTab($activeTab);
      this.$element.trigger("collapse.zf.tabs", [$activeTab]);
    }
  }
  /**
   * Public method for selecting a content pane to display.
   * @param {jQuery | String} elem - jQuery object or string of the id of the pane to display.
   * @param {boolean} historyHandled - browser has already handled a history update
   * @function
   */
  selectTab(elem, historyHandled) {
    var idStr, hashIdStr;
    if (typeof elem === "object") {
      idStr = elem[0].id;
    } else {
      idStr = elem;
    }
    if (idStr.indexOf("#") < 0) {
      hashIdStr = `#${idStr}`;
    } else {
      hashIdStr = idStr;
      idStr = idStr.slice(1);
    }
    var $target = this.$tabTitles.has(`[href$="${hashIdStr}"],[data-tabs-target="${idStr}"]`).first();
    this._handleTabChange($target, historyHandled);
  }
  /**
   * Sets the height of each panel to the height of the tallest panel.
   * If enabled in options, gets called on media query change.
   * If loading content via external source, can be called directly or with _reflow.
   * If enabled with `data-match-height="true"`, tabs sets to equal height
   * @function
   * @private
   */
  _setHeight() {
    var max = 0, _this = this;
    if (!this.$tabContent) {
      return;
    }
    this.$tabContent.find(`.${this.options.panelClass}`).css("min-height", "").each(function() {
      var panel = $(this), isActive = panel.hasClass(`${_this.options.panelActiveClass}`);
      if (!isActive) {
        panel.css({ "visibility": "hidden", "display": "block" });
      }
      var temp = this.getBoundingClientRect().height;
      if (!isActive) {
        panel.css({
          "visibility": "",
          "display": ""
        });
      }
      max = temp > max ? temp : max;
    }).css("min-height", `${max}px`);
  }
  /**
   * Destroys an instance of tabs.
   * @fires Tabs#destroyed
   */
  _destroy() {
    this.$element.find(`.${this.options.linkClass}`).off(".zf.tabs").hide().end().find(`.${this.options.panelClass}`).hide();
    if (this.options.matchHeight) {
      if (this._setHeightMqHandler != null) {
        $(window).off("changed.zf.mediaquery", this._setHeightMqHandler);
      }
    }
    if (this.options.deepLink) {
      $(window).off("hashchange", this._checkDeepLink);
    }
    if (this.onLoadListener) {
      $(window).off(this.onLoadListener);
    }
  }
}
Tabs.defaults = {
  /**
   * Link the location hash to the active pane.
   * Set the location hash when the active pane changes, and open the corresponding pane when the location changes.
   * @option
   * @type {boolean}
   * @default false
   */
  deepLink: false,
  /**
   * If `deepLink` is enabled, adjust the deep link scroll to make sure the top of the tab panel is visible
   * @option
   * @type {boolean}
   * @default false
   */
  deepLinkSmudge: false,
  /**
   * If `deepLinkSmudge` is enabled, animation time (ms) for the deep link adjustment
   * @option
   * @type {number}
   * @default 300
   */
  deepLinkSmudgeDelay: 300,
  /**
   * If `deepLinkSmudge` is enabled, animation offset from the top for the deep link adjustment
   * @option
   * @type {number}
   * @default 0
   */
  deepLinkSmudgeOffset: 0,
  /**
   * If `deepLink` is enabled, update the browser history with the open tab
   * @option
   * @type {boolean}
   * @default false
   */
  updateHistory: false,
  /**
   * Allows the window to scroll to content of active pane on load.
   * Not recommended if more than one tab panel per page.
   * @option
   * @type {boolean}
   * @default false
   */
  autoFocus: false,
  /**
   * Allows keyboard input to 'wrap' around the tab links.
   * @option
   * @type {boolean}
   * @default true
   */
  wrapOnKeys: true,
  /**
   * Allows the tab content panes to match heights if set to true.
   * @option
   * @type {boolean}
   * @default false
   */
  matchHeight: false,
  /**
   * Allows active tabs to collapse when clicked.
   * @option
   * @type {boolean}
   * @default false
   */
  activeCollapse: false,
  /**
   * Class applied to `li`'s in tab link list.
   * @option
   * @type {string}
   * @default 'tabs-title'
   */
  linkClass: "tabs-title",
  /**
   * Class applied to the active `li` in tab link list.
   * @option
   * @type {string}
   * @default 'is-active'
   */
  linkActiveClass: "is-active",
  /**
   * Class applied to the content containers.
   * @option
   * @type {string}
   * @default 'tabs-panel'
   */
  panelClass: "tabs-panel",
  /**
   * Class applied to the active content container.
   * @option
   * @type {string}
   * @default 'is-active'
   */
  panelActiveClass: "is-active"
};
Object.assign(Foundation, {
  rtl,
  GetYoDigits,
  RegExpEscape,
  transitionend,
  onLoad,
  ignoreMousedisappear,
  Keyboard,
  Box,
  Nest,
  onImagesLoaded,
  MediaQuery,
  Motion,
  Move,
  Touch,
  Triggers,
  Timer
});
Touch.init($);
Triggers.init($, Foundation);
MediaQuery._init();
const plugins = [
  { plugin: Dropdown, name: "Dropdown" },
  { plugin: DropdownMenu, name: "DropdownMenu" },
  { plugin: Accordion, name: "Accordion" },
  { plugin: AccordionMenu, name: "AccordionMenu" },
  //{ plugin: ResponsiveMenu, name: 'ResponsiveMenu' },
  //{ plugin: ResponsiveToggle, name: 'ResponsiveToggle' },
  { plugin: OffCanvas, name: "OffCanvas" },
  //{ plugin: Reveal, name: 'Reveal' },
  //{ plugin: Tooltip, name: 'Tooltip' },
  { plugin: SmoothScroll, name: "SmoothScroll" },
  //{ plugin: Magellan, name: 'Magellan' },
  //{ plugin: Sticky, name: 'Sticky' },
  //{ plugin: Toggler, name: 'Toggler' },
  //{ plugin: Equalizer, name: 'Equalizer' },
  //{ plugin: Interchange, name: 'Interchange' },
  //{ plugin: Abide, name: 'Abide' },
  { plugin: Tabs, name: "Tabs" }
];
plugins.forEach(({ plugin, name }) => {
  Foundation.plugin(plugin, name);
});
Foundation.addToJquery($);
$(() => $(document).foundation());
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
  function $2(e2) {
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
    })(), C && (C.addEventListener("wheel", $2, { passive: false }), D2.push((() => {
      null == C || C.removeEventListener("wheel", $2, { passive: false });
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
  let w2, S, j2, A2, L, P = 0, T = Object.assign({}, h), O2 = Object.assign({}, h), R2 = {}, H2 = null, V = null, C = 0, D2 = 0, $2 = 0, q2 = false, I2 = false, F = false, z2 = "height", k2 = 0, N2 = true, B2 = 0, _2 = 0, G = 0, X = 0, Y = "*", W = [], J = [];
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
        i2.indexOf(s2) > -1 || (s2.pos = o2 - t2 + e3 || 0, s2.offset + e3 > t2 - s2.dim - D2 + 0.51 && s2.offset + e3 < t2 + n2 + $2 - 0.51 && i2.push(s2));
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
    if (s$5(H2, r2.isLTR, !I2), s$5(H2, r2.isRTL, I2), s$5(H2, r2.isHorizontal, !F), s$5(H2, r2.isVertical, F), s$5(H2, r2.hasAdaptiveHeight, nt("adaptiveHeight")), C = 0, D2 = 0, $2 = 0, et = 0, V) {
      V.childElementCount || (V.style.display = "grid");
      const t3 = V.getBoundingClientRect();
      C = V.getBoundingClientRect()[z2] || 0;
      const e2 = window.getComputedStyle(V);
      et = parseFloat(e2.getPropertyValue("--f-carousel-gap")) || 0;
      "visible" === e2.getPropertyValue("overflow-" + (F ? "y" : "x")) && (D2 = Math.abs(t3[F ? "top" : "left"]), $2 = Math.abs(window[F ? "innerHeight" : "innerWidth"] - t3[F ? "bottom" : "right"])), V.style.display = "";
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
      let e2 = C + D2 + $2;
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
      if (D2 > 0.5 || $2 > 0.5) return;
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
      s$7(f2, "is-syncing"), null == c2 || c2.emit("thumbs:ready"), x2() && (null == c2 || c2.on("render", $2));
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
  function $2() {
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
    S() && (null == c2 || c2.emit("thumbs:destroy")), null == c2 || c2.off("ready", A2), null == c2 || c2.off("initSlides", j2), null == c2 || c2.off("change", O2), null == c2 || c2.off("render", $2), null == c2 || c2.off("addSlide", z2), null == c2 || c2.off("click", I2), null == c2 || c2.off("refresh", q2), null === (t2 = null == c2 ? void 0 : c2.getGestures()) || void 0 === t2 || t2.off("start", M2), null === (e2 = null == c2 ? void 0 : c2.getContainer()) || void 0 === e2 || e2.classList.remove("has-thumbs"), c2 = void 0, null == d2 || d2.destroy(), d2 = void 0, null == f2 || f2.remove(), f2 = void 0;
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
  let r2, T, M2, B2, q2, F, V, W = _.Init, $2 = Object.assign({}, I), K = -1, U = {}, X = [], G = false, Y = true, Z = 0;
  function J(e2, ...t2) {
    let n2 = $2[e2];
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
    for (const [t3, o2] of Object.entries($2.on || {})) (t3 === e2 || t3.split(" ").indexOf(e2) > -1) && n2.push(o2);
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
    return $2;
  }, getPlugins: function() {
    return U;
  }, getSlide: function() {
    return Ee();
  }, getState: function() {
    return W;
  }, init: function(t2 = [], n2 = {}) {
    W !== _.Init && (Oe.destroy(), W = _.Init), $2 = r$3({}, I, n2), K = J("id") || "fancybox-" + ++H;
    const a2 = z.get(K);
    if (a2 && a2.destroy(), z.set(K, Oe), te("init"), (function() {
      for (const [e2, t3] of Object.entries(Object.assign(Object.assign({}, N.Plugins), $2.plugins || {}))) if (e2 && !U[e2] && t3 instanceof Function) {
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
export {
  Autoplay as A,
  Grid as G,
  N,
  Pagination as P,
  SocialShare as S,
  Thumb as T,
  Navigation as a,
  Swiper as b,
  freeMode as f,
  nanoid as n
};
//# sourceMappingURL=vendor.CtYGPuyO.js.map
