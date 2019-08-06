(function () {
  if (!('path' in Event.prototype)) {
    Object.defineProperty(Event.prototype, 'path', {
      get: function get() {
        var result = [];
        var target = this.target;

        while (target) {
          result.push(target);
          target = target.parentElement;
        }

        if (result.indexOf(document) === -1 && result.indexOf(window) === -1) {
          result.push(document);
        }

        if (result.indexOf(window) === -1) {
          result.push(window);
        }

        return result;
      }
    });
  }

  Number.isNaN = Number.isNaN || function (val) {
    return typeof val === 'number' && isNaN(val);
  };
})();
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

vue_utils = function () {
  var utils;
  var cached;

  function _broadcast(componentName, eventName, params) {
    this.$children.forEach(function (child) {
      var name = child.$options.name;

      if (name === componentName) {
        child.$emit.apply(child, [eventName].concat(params));
      } else {
        // todo 如果 params 是空数组，接收到的会是 undefined
        _broadcast.apply(child, [componentName, eventName].concat([params]));
      }
    });
  }

  function morph(morphTimer, element, options, animationTime, callback) {
    var ComputedElementStyle = window.getComputedStyle(element, null);
    var AttrElementStyle = element.style;
    var Properties = {
      width: parseInt(ComputedElementStyle.getPropertyValue("width")),
      height: parseInt(ComputedElementStyle.getPropertyValue("height")),
      padding: {
        top: parseInt(ComputedElementStyle.getPropertyValue("padding-top")),
        right: parseInt(ComputedElementStyle.getPropertyValue("padding-right")),
        bot: parseInt(ComputedElementStyle.getPropertyValue("padding-bottom")),
        left: parseInt(ComputedElementStyle.getPropertyValue("padding-left"))
      },
      margin: {
        top: parseInt(ComputedElementStyle.getPropertyValue("margin-top")),
        right: parseInt(ComputedElementStyle.getPropertyValue("margin-right")),
        bot: parseInt(ComputedElementStyle.getPropertyValue("margin-bottom")),
        left: parseInt(ComputedElementStyle.getPropertyValue("margin-left"))
      }
    };
    var DiffValues = {
      width: options['width'] != null ? options['width'] - Properties['width'] : 0,
      height: options['height'] != null ? options['height'] - Properties['height'] : 0,
      padding: {
        top: options['padding'] && options['padding']['top'] != null ? options['padding']['top'] - Properties['padding']['top'] : 0,
        right: options['padding'] && options['padding']['right'] != null ? options['padding']['right'] - Properties['padding']['right'] : 0,
        bot: options['padding'] && options['padding']['bot'] != null ? options['padding']['bot'] - Properties['padding']['bot'] : 0,
        left: options['padding'] && options['padding']['left'] != null ? options['padding']['left'] - Properties['padding']['left'] : 0
      },
      margin: {
        top: options['margin'] && options['margin']['top'] != null ? options['margin']['top'] - Properties['margin']['top'] : 0,
        right: options['margin'] && options['margin']['right'] != null ? options['margin']['right'] - Properties['margin']['right'] : 0,
        bot: options['margin'] && options['margin']['bot'] != null ? options['margin']['bot'] - Properties['margin']['bot'] : 0,
        left: options['margin'] && options['margin']['left'] != null ? options['margin']['left'] - Properties['margin']['left'] : 0
      }
    };
    var beginTime = new Date().getTime();
    var sinceBeginTime;
    var progressFactor;
    animationTime = animationTime != null ? animationTime : 250;
    AttrElementStyle.overflow = "hidden";
    clearInterval(morphTimer);
    morphTimer = setInterval(function () {
      sinceBeginTime = new Date().getTime() - beginTime;

      if (sinceBeginTime < animationTime) {
        progressFactor = sinceBeginTime / animationTime;
        AttrElementStyle.width = Properties['width'] + DiffValues['width'] * progressFactor + "px";
        AttrElementStyle.height = Properties['height'] + DiffValues['height'] * progressFactor + "px";
        AttrElementStyle.padding = Properties['padding']['top'] + DiffValues['padding']['top'] * progressFactor + "px " + (Properties['padding']['right'] + DiffValues['padding']['right'] * progressFactor) + "px " + (Properties['padding']['bot'] + DiffValues['padding']['bot'] * progressFactor) + "px " + (Properties['padding']['left'] + DiffValues['padding']['left'] * progressFactor) + "px";
        AttrElementStyle.margin = Properties['margin']['top'] + DiffValues['margin']['top'] * progressFactor + "px " + (Properties['margin']['right'] + DiffValues['margin']['right'] * progressFactor) + "px " + (Properties['margin']['bot'] + DiffValues['margin']['bot'] * progressFactor) + "px " + (Properties['margin']['left'] + DiffValues['margin']['left'] * progressFactor) + "px";
      } else {
        AttrElementStyle.width = options['width'] + "px";
        AttrElementStyle.height = options['height'] + "px";
        AttrElementStyle.padding = Properties['padding']['top'] + DiffValues['padding']['top'] + "px " + (Properties['padding']['right'] + DiffValues['padding']['right']) + "px " + (Properties['padding']['bot'] + DiffValues['padding']['bot']) + "px " + (Properties['padding']['left'] + DiffValues['padding']['left']) + "px";
        AttrElementStyle.margin = Properties['margin']['top'] + DiffValues['margin']['top'] + "px " + (Properties['margin']['right'] + DiffValues['margin']['right']) + "px " + (Properties['margin']['bot'] + DiffValues['margin']['bot']) + "px " + (Properties['margin']['left'] + DiffValues['margin']['left']) + "px";
        clearInterval(morphTimer);
        if (callback != null) callback(Properties);
      }
    }, 15);
  }

  var filterFn = function filterFn() {
    return true;
  };

  utils = {
    getTag: function getTag(target) {
      return Object.prototype.toString.call(target);
    },
    baseMerge: function baseMerge(target, filterFn) {
      if (!target) target = {};

      for (var _len = arguments.length, sources = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        sources[_key - 2] = arguments[_key];
      }

      sources.filter(function (v) {
        return v && _typeof(v) === 'object';
      }).forEach(function (source) {
        Object.keys(source).forEach(function (key) {
          var targetTag = utils.getTag(target[key]);
          var sourceTag = utils.getTag(source[key]);

          if (sourceTag === '[object Array]' || sourceTag === '[object Object]') {
            if (targetTag !== sourceTag) target[key] = sourceTag === '[object Array]' ? [] : {};
            utils.baseMerge(target[key], filterFn, source[key]);
          } else if (filterFn(target, source, key)) {
            target[key] = source[key];
          }
        });
      });
      return target;
    },
    merge: function merge(target) {
      var _utils;

      for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        sources[_key2 - 1] = arguments[_key2];
      }

      return (_utils = utils).baseMerge.apply(_utils, [target, filterFn].concat(sources));
    },
    dispatch: function dispatch(context, componentName, eventName, params) {
      var parent = context.$parent || context.$root;
      var name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast: function broadcast(context, componentName, eventName, params) {
      _broadcast.call(context, componentName, eventName, params);
    },
    findComponentUpward: function findComponentUpward(context, componentName, componentNames) {
      if (typeof componentName === 'string') {
        componentNames = [componentName];
      } else {
        componentNames = componentName;
      }

      var parent = context.$parent;
      var name = parent.$options.name;

      while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
      }

      return parent;
    },
    findComponentsUpward: function findComponentsUpward(context, componentName, componentNames) {
      var components = [];

      if (typeof componentName === 'string') {
        componentNames = [componentName];
      } else {
        componentNames = componentName;
      }

      var parent = context.$parent;
      var name = parent.$options.name;

      while (parent) {
        if (componentNames.indexOf(parent.$options.name) > -1) {
          components.push(parent);
        }

        parent = parent.$parent;
      }

      return components;
    },
    findComponentsDownward: function findComponentsDownward(context, componentName, components) {
      var components = components || [];
      var childrens = context.$children;

      if (childrens.length) {
        childrens.forEach(function (child) {
          var name = child.$options.name;
          var childs = child.$children;
          if (name === componentName) components.push(child);

          if (childs.length) {
            var findChilds = utils.findComponentsDownward(child, componentName, components);
            if (findChilds) components.concat(findChilds);
          }
        });
      }

      return components;
    },
    oneOf: function oneOf(value, validList) {
      for (var i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
          return true;
        }
      }

      return false;
    },
    camelCase: function camelCase(str) {
      var SPECIAL_CHARS_REGEXP = /-(\w)/g;
      return str.replace(SPECIAL_CHARS_REGEXP, function ($0, $1) {
        return $1.toUpperCase();
      });
    },
    getStyle: function getStyle(element, styleName) {
      if (!element || !styleName) return null;
      styleName = utils.camelCase(styleName);

      if (styleName === 'float') {
        styleName = 'cssFloat';
      }

      try {
        var computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
      } catch (e) {
        return element.style[styleName];
      }
    },
    setStyle: function setStyle(elementList, styleName, style) {
      if (!elementList.length || !styleName) return null;
      styleName = utils.camelCase(styleName);

      if (styleName === 'float') {
        styleName = 'cssFloat';
      }

      for (var i = 0; i < elementList.length; i++) {
        elementList[i].style[styleName] = style;
      }
    },
    isValueNumber: function isValueNumber(value) {
      return /^[1-9][0-9]*$/.test(value + '');
    },
    // 求值并记忆默认的滚动条的宽度
    scrollbarWidth: function scrollbarWidth(baseDom) {
      var _baseDom = baseDom || document.body;

      var outer = document.createElement('div');
      outer.className = 'jz-scrollbar-wrap';
      outer.style.visibility = 'hidden';
      outer.style.width = '100px';
      outer.style.position = 'absolute';
      outer.style.top = '-9999px';

      _baseDom.appendChild(outer);

      var widthNoScroll = outer.offsetWidth;
      outer.style.overflow = 'scroll';
      var inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);
      var widthWithScroll = inner.offsetWidth;
      outer.parentNode.removeChild(outer);
      var scrollBarWidth = widthNoScroll - widthWithScroll;
      return scrollBarWidth;
    },
    off: function off(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    },
    on: function on(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    },
    throttle: function throttle(fn, wait) {
      var startTime = 0;
      wait = wait || 200;
      return function () {
        var endTime = +new Date();

        if (endTime - startTime > wait) {
          fn.apply(this, arguments);
          startTime = endTime;
        }
      };
    },
    debounce: function debounce(fn, delay) {
      var timer = null;
      delay = delay || 40;
      return function () {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    },
    initDefaultProps: function initDefaultProps(props, defaultData) {
      var key, type, prop;

      for (key in defaultData) {
        if (_typeof(props[key]) == 'object') {
          props[key] = props[key];
        } else if (typeof props[key] == 'function') {
          props[key] = {
            type: props[key]
          };
        } else if (!props[key]) {
          props[key] = {};
        }

        props[key]['default'] = defaultData[key];
      }

      return props;
    },
    typeOf: function typeOf(obj) {
      var toString = Object.prototype.toString;
      var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
      };
      return map[toString.call(obj)];
    },
    deepCopy: function deepCopy(data) {
      var t = utils.typeOf(data);
      var o;

      if (t === 'array') {
        o = [];
      } else if (t === 'object') {
        o = {};
      } else {
        return data;
      }

      if (t === 'array') {
        for (var i = 0; i < data.length; i++) {
          o.push(utils.deepCopy(data[i]));
        }
      } else if (t === 'object') {
        for (var i in data) {
          o[i] = utils.deepCopy(data[i]);
        }
      }

      return o;
    },
    stringToIntArray: function stringToIntArray(arr) {
      return arr.map(function (item) {
        return +item;
      });
    },
    trim: function trim(string) {
      return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
    },
    addClass: function addClass(el, cls) {
      if (!el) return;
      var curClass = el.className;
      var classes = (cls || '').split(' ');

      for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
          el.classList.add(clsName);
        } else {
          if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
          }
        }
      }

      if (!el.classList) {
        el.className = curClass;
      }
    },
    removeClass: function removeClass(el, cls) {
      if (!el || !cls) return;
      var classes = cls.split(' ');
      var curClass = ' ' + el.className + ' ';

      for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
          el.classList.remove(clsName);
        } else {
          if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
          }
        }
      }

      if (!el.classList) {
        el.className = utils.trim(curClass);
      }
    },
    isNull: function isNull(obj) {
      return typeof obj == 'undefined' || obj == null;
    },
    Img: {
      MODE_SCALE_FILL: 1,
      // 根据区域能够填满的最大值等比例缩放。图片100x50，区域50x50，结果50x25。
      MODE_SCALE_WIDTH: 2,
      // 根据区域宽度等比例缩放，结果高度将不受区域高度限制，即可能撑大高度。图片100x50，区域50x10，结果50x25。
      MODE_SCALE_HEIGHT: 3,
      // 根据区域高度等比例缩放，结果宽度将不受区域宽度限制，即可能撑大宽度。图片100x50，区域50x50，结果100x50。
      MODE_SCALE_DEFLATE_WIDTH: 4,
      // 根据区域宽度等比例缩小，不放大，结果高度将不受区域高度限制。图片100x50，区域50x10，结果50x25；图片100x50，区域200x100，结果100x50。
      MODE_SCALE_DEFLATE_HEIGHT: 5,
      // 根据区域高度等比例缩小，不放大，结果宽度将不受区域高度限制。图片100x50，区域50x50，结果100x50；图片100x50，区域200x100，结果100x50。
      MODE_SCALE_DEFLATE_FILL: 6,
      // 根据区域能够填满的最大值等比例缩小，不放大。图片100x50，区域50x50，结果50x25。
      MODE_SCALE_DEFLATE_MAX: 7 // 根据区域等比例缩小，不放大，结果的宽度和高度不能同时超过区域限制。图片200x100，区域100x100，结果200x100；图片100x200，区域100x100，结果100x200。

    },
    calcSize: function calcSize(width, height, maxWidth, maxHeight, mode) {
      var size = {
        width: width,
        height: height
      };

      if (mode == utils.Img.MODE_SCALE_FILL) {
        var rateWidth = width / maxWidth;
        var rateHeight = height / maxHeight;

        if (rateWidth > rateHeight) {
          size.width = maxWidth;
          size.height = height / rateWidth;
        } else {
          size.width = width / rateHeight;
          size.height = maxHeight;
        }
      } else if (mode == utils.Img.MODE_SCALE_WIDTH) {
        var rateWidth = width / maxWidth;
        size.width = maxWidth;
        size.height = height / rateWidth;
      } else if (mode == utils.Img.MODE_SCALE_HEIGHT) {
        var rateHeight = height / maxHeight;
        size.width = width / rateHeight;
        size.height = maxHeight;
      } else if (mode == utils.Img.MODE_SCALE_DEFLATE_WIDTH) {
        var rateWidth = width / maxWidth;

        if (rateWidth > 1) {
          size.width = maxWidth;
          size.height = height / rateWidth;
        }
      } else if (mode == utils.Img.MODE_SCALE_DEFLATE_HEIGHT) {
        var rateHeight = height / maxHeight;

        if (rateHeight > 1) {
          size.width = width / rateHeight;
          size.height = maxHeight;
        }
      } else if (mode == utils.Img.MODE_SCALE_DEFLATE_FILL) {
        var rateWidth = width / maxWidth;
        var rateHeight = height / maxHeight;

        if (rateWidth > rateHeight) {
          if (rateWidth > 1) {
            size.width = maxWidth;
            size.height = height / rateWidth;
          }
        } else {
          if (rateHeight > 1) {
            size.width = width / rateHeight;
            size.height = maxHeight;
          }
        }
      } else if (mode == utils.Img.MODE_SCALE_DEFLATE_MAX) {
        if (width > maxWidth && height > maxHeight) {
          var rateWidth = width / maxWidth;
          var rateHeight = height / maxHeight;

          if (rateWidth < rateHeight) {
            size.width = maxWidth;
            size.height = height / rateWidth;
          } else {
            size.width = width / rateHeight;
            size.height = maxHeight;
          }
        }
      }

      size.width = Math.floor(size.width);
      size.height = Math.floor(size.height);

      if (size.width == 0) {
        size.width = 1;
      }

      if (size.height == 0) {
        size.height = 1;
      }

      return size;
    },

    /* 使用此函数时，不要在img标签中先设置大小，会使得调整img大小时失败；先隐藏图片，避免出现图片从原始图片变为目标图片的过程
     *	copy建站Fai下的方法
     * 	<img src="xx.jpg" style="display:none;" onload="Fai.Img.optimize(this, {width:100, height:50, mode:Fai.Img.MODE_SCALE_FILL});"/>
     */
    optimize: function optimize(img, option) {
      // ie下对于display:none的img不会加载
      // 这里要用临时图片，是因为当动态改变图片src时，由于图片的大小已经被设置，因此再次获取会失败
      var imgTmp = new Image(); // 这里还不能先置空，否则将会引起对''文件的一次访问
      //	imgTmp.src = '';

      imgTmp.src = img.src;
      var imgWidth = imgTmp.width;
      var imgHeight = imgTmp.height;

      if (utils.isNull(imgWidth) || imgWidth == 0 || utils.isNull(imgHeight) || imgHeight == 0) {
        // chrome似乎对临时图片的加载会有延迟，立即取大小会失败
        imgWidth = img.width;
        imgHeight = img.height;
      }

      var size = utils.calcSize(imgWidth, imgHeight, option.width, option.height, option.mode);
      img.width = size.width;
      img.height = size.height;

      if (option.display == 1) {
        img.style.display = 'inline';
      } else if (option.display == 2) {
        img.style.display = 'none';
      } else if (option.display == 3) {
        img.style.display = 'inline-block';
      } else {
        img.style.display = 'block';
      }

      return {
        width: img.width,
        height: img.height
      };
    },
    slideUp: function slideUp(element, animationTime, callback) {
      var upMorphTimer;
      var options = {
        height: 0,
        padding: {
          top: 0,
          bot: 0
        },
        margin: {
          top: 0,
          bot: 0
        }
      };
      morph(upMorphTimer, element, options, animationTime, function (Properties) {
        var AttrElementStyle = element.style;
        AttrElementStyle.width = "";
        AttrElementStyle.height = "";
        AttrElementStyle.padding = "";
        AttrElementStyle.margin = "";
        element.style.display = 'none';
        if (callback) callback();
      });
    },
    slideDown: function slideDown(element, animationTime, callback) {
      var downMorphTimer;
      var AttrElementStyle = element.style;
      var ComputedElementStyle = window.getComputedStyle(element, null);
      AttrElementStyle.display = "block";
      var options = {
        width: parseInt(ComputedElementStyle.getPropertyValue("width")),
        height: parseInt(ComputedElementStyle.getPropertyValue("height")),
        padding: {
          top: parseInt(ComputedElementStyle.getPropertyValue("padding-top")),
          bot: parseInt(ComputedElementStyle.getPropertyValue("padding-bottom"))
        },
        margin: {
          top: parseInt(ComputedElementStyle.getPropertyValue("margin-top")),
          bot: parseInt(ComputedElementStyle.getPropertyValue("margin-bottom"))
        }
      };
      AttrElementStyle.height = "0";
      AttrElementStyle.paddingTop = "0";
      AttrElementStyle.paddingBottom = "0";
      AttrElementStyle.marginTop = "0";
      AttrElementStyle.marginBottom = "0";
      morph(downMorphTimer, element, options, animationTime, function () {
        AttrElementStyle.width = "";
        AttrElementStyle.height = "";
        AttrElementStyle.padding = "";
        AttrElementStyle.margin = "";
        element.style.display = 'block';
        if (callback) callback();
      });
    },
    isUndef: function isUndef(v) {
      return v === undefined || v === null;
    },
    isDef: function isDef(v) {
      return v !== undefined && v !== null;
    }
  };
  return utils;
}();
// Vue全局指令
(function (global, factory) {
  if (typeof global.Vue !== 'undefined') {
    global.Vue.directive('clickoutside', factory());
  }
})(this, function () {
  return {
    bind: function bind(el, binding) {
      function documentHandler(e) {
        if (el.contains(e.target)) {
          return false;
        }

        if (binding.expression) {
          binding.value(e);
        }
      }

      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
    },
    unbind: function unbind(el) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    }
  };
});
/**
 * 监听元素的尺寸变化并触发回调 
 * 	e.g.
 * 		<div id="app" v-resize="resizeHandler"></div>
 * 		当app的宽度或高度发生变化时，触发回调resizeHandler
 */


(function (global, factory) {
  if (typeof global.Vue !== 'undefined') {
    global.Vue.directive('resize', factory(global));
  }
})(this, function (global) {
  return {
    inserted: function inserted(el, binding) {
      if (typeof global.ResizeDetector !== 'undefined') {
        global.ResizeDetector.addListener(el, binding.value);
      }
    },
    unbind: function unbind(el) {
      if (typeof global.ResizeDetector !== 'undefined') {
        global.ResizeDetector.removeListener(el);
      }
    }
  };
}); // 空指令，真正指令在undo.js里面，这里只是为了避免报错


(function (global, factory) {
  if (typeof global.Vue !== 'undefined') {
    global.Vue.directive('undo', factory());
  }
})(this, function () {
  return {};
});
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */
(function sortableModule(factory) {
  "use strict";

  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = factory();
  } else {
    /* jshint sub:true */
    window["Sortable"] = factory();
  }
})(function sortableFactory() {
  "use strict";

  if (typeof window === "undefined" || !window.document) {
    return function sortableError() {
      throw new Error("Sortable.js requires a window with a document");
    };
  }

  var dragEl,
      parentEl,
      ghostEl,
      cloneEl,
      rootEl,
      nextEl,
      lastDownEl,
      scrollEl,
      scrollParentEl,
      scrollCustomFn,
      lastEl,
      lastCSS,
      lastParentCSS,
      oldIndex,
      newIndex,
      activeGroup,
      putSortable,
      autoScroll = {},
      tapEvt,
      touchEvt,
      moved,
      forRepaintDummy,

  /** @const */
  R_SPACE = /\s+/g,
      R_FLOAT = /left|right|inline/,
      expando = 'Sortable' + new Date().getTime(),
      win = window,
      document = win.document,
      parseInt = win.parseInt,
      setTimeout = win.setTimeout,
      $ = win.jQuery || win.Zepto,
      Polymer = win.Polymer,
      captureMode = false,
      passiveMode = false,
      supportDraggable = 'draggable' in document.createElement('div'),
      supportCssPointerEvents = function (el) {
    // false when IE11
    if (!!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie)/i)) {
      return false;
    }

    el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    return el.style.pointerEvents === 'auto';
  }(),
      _silent = false,
      abs = Math.abs,
      min = Math.min,
      savedInputChecked = [],
      touchDragOverListeners = [],
      alwaysFalse = function alwaysFalse() {
    return false;
  },
      _autoScroll = _throttle(function (
  /**Event*/
  evt,
  /**Object*/
  options,
  /**HTMLElement*/
  rootEl) {
    // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    if (rootEl && options.scroll) {
      var _this = rootEl[expando],
          el,
          rect,
          sens = options.scrollSensitivity,
          speed = options.scrollSpeed,
          x = evt.clientX,
          y = evt.clientY,
          winWidth = window.innerWidth,
          winHeight = window.innerHeight,
          vx,
          vy,
          scrollOffsetX,
          scrollOffsetY; // Delect scrollEl

      if (scrollParentEl !== rootEl) {
        scrollEl = options.scroll;
        scrollParentEl = rootEl;
        scrollCustomFn = options.scrollFn;

        if (scrollEl === true) {
          scrollEl = rootEl;

          do {
            if (scrollEl.offsetWidth < scrollEl.scrollWidth || scrollEl.offsetHeight < scrollEl.scrollHeight) {
              break;
            }
            /* jshint boss:true */

          } while (scrollEl = scrollEl.parentNode);
        }
      }

      if (scrollEl) {
        el = scrollEl;
        rect = scrollEl.getBoundingClientRect();
        vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
        vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
      }

      if (!(vx || vy)) {
        vx = (winWidth - x <= sens) - (x <= sens);
        vy = (winHeight - y <= sens) - (y <= sens);
        /* jshint expr:true */

        (vx || vy) && (el = win);
      }

      if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
        autoScroll.el = el;
        autoScroll.vx = vx;
        autoScroll.vy = vy;
        clearInterval(autoScroll.pid);

        if (el) {
          autoScroll.pid = setInterval(function () {
            scrollOffsetY = vy ? vy * speed : 0;
            scrollOffsetX = vx ? vx * speed : 0;

            if ('function' === typeof scrollCustomFn) {
              if (scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt, touchEvt, el) !== 'continue') {
                return;
              }
            }

            if (el === win) {
              win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
            } else {
              el.scrollTop += scrollOffsetY;
              el.scrollLeft += scrollOffsetX;
            }
          }, 24);
        }
      }
    }
  }, 30),
      _prepareGroup = function _prepareGroup(options) {
    function toFn(value, pull) {
      if (value == null || value === true) {
        value = group.name;

        if (value == null) {
          return alwaysFalse;
        }
      }

      if (typeof value === 'function') {
        return value;
      } else {
        return function (to, from) {
          var fromGroup = from.options.group.name;
          return pull ? value : value && (value.join ? value.indexOf(fromGroup) > -1 : fromGroup == value);
        };
      }
    }

    var group = {};
    var originalGroup = options.group;

    if (!originalGroup || _typeof2(originalGroup) != 'object') {
      originalGroup = {
        name: originalGroup
      };
    }

    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;
    options.group = group;
  }; // Detect support a passive mode


  try {
    window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
      get: function get() {
        // `false`, because everything starts to work incorrectly and instead of d'n'd,
        // begins the page has scrolled.
        passiveMode = false;
        captureMode = {
          capture: false,
          passive: passiveMode
        };
      }
    }));
  } catch (err) {}
  /**
   * @class  Sortable
   * @param  {HTMLElement}  el
   * @param  {Object}       [options]
   */


  function Sortable(el, options) {
    if (!(el && el.nodeType && el.nodeType === 1)) {
      throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
    }

    this.el = el; // root element

    this.options = options = _extend({}, options); // Export instance

    el[expando] = this; // Default options

    var defaults = {
      group: null,
      sort: true,
      disabled: false,
      store: null,
      handle: null,
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      ignore: 'a, img',
      filter: null,
      preventOnFilter: true,
      animation: 0,
      setData: function setData(dataTransfer, dragEl) {
        dataTransfer.setData('Text', dragEl.textContent);
      },
      dropBubble: false,
      dragoverBubble: false,
      dataIdAttr: 'data-id',
      delay: 0,
      touchStartThreshold: parseInt(window.devicePixelRatio, 10) || 1,
      forceFallback: false,
      fallbackClass: 'sortable-fallback',
      fallbackOnBody: false,
      fallbackTolerance: 0,
      fallbackOffset: {
        x: 0,
        y: 0
      },
      supportPointer: Sortable.supportPointer !== false
    }; // Set default options

    for (var name in defaults) {
      !(name in options) && (options[name] = defaults[name]);
    }

    _prepareGroup(options); // Bind all private methods


    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    } // Setup drag mode


    this.nativeDraggable = options.forceFallback ? false : supportDraggable; // Bind events

    _on(el, 'mousedown', this._onTapStart);

    _on(el, 'touchstart', this._onTapStart);

    options.supportPointer && _on(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      _on(el, 'dragover', this);

      _on(el, 'dragenter', this);
    }

    touchDragOverListeners.push(this._onDragOver); // Restore sorting

    options.store && this.sort(options.store.get(this));
  }

  Sortable.prototype =
  /** @lends Sortable.prototype */
  {
    constructor: Sortable,
    _onTapStart: function _onTapStart(
    /** Event|TouchEvent */
    evt) {
      var _this = this,
          el = this.el,
          options = this.options,
          preventOnFilter = options.preventOnFilter,
          type = evt.type,
          touch = evt.touches && evt.touches[0],
          target = (touch || evt).target,
          originalTarget = evt.target.shadowRoot && evt.path && evt.path[0] || target,
          filter = options.filter,
          startIndex;

      _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


      if (dragEl) {
        return;
      }

      if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
        return; // only left button or enabled
      } // cancel dnd if original target is content editable


      if (originalTarget.isContentEditable) {
        return;
      }

      target = _closest(target, options.draggable, el);

      if (!target) {
        return;
      }

      if (lastDownEl === target) {
        // Ignoring duplicate `down`
        return;
      } // Get the index of the dragged element within its parent


      startIndex = _index(target, options.draggable); // Check filter

      if (typeof filter === 'function') {
        if (filter.call(this, evt, target, this)) {
          _dispatchEvent(_this, originalTarget, 'filter', target, el, el, startIndex);

          preventOnFilter && evt.preventDefault();
          return; // cancel dnd
        }
      } else if (filter) {
        filter = filter.split(',').some(function (criteria) {
          criteria = _closest(originalTarget, criteria.trim(), el);

          if (criteria) {
            _dispatchEvent(_this, criteria, 'filter', target, el, el, startIndex);

            return true;
          }
        });

        if (filter) {
          preventOnFilter && evt.preventDefault();
          return; // cancel dnd
        }
      }

      if (options.handle && !_closest(originalTarget, options.handle, el)) {
        return;
      } // Prepare `dragstart`


      this._prepareDragStart(evt, touch, target, startIndex);
    },
    _prepareDragStart: function _prepareDragStart(
    /** Event */
    evt,
    /** Touch */
    touch,
    /** HTMLElement */
    target,
    /** Number */
    startIndex) {
      var _this = this,
          el = _this.el,
          options = _this.options,
          ownerDocument = el.ownerDocument,
          dragStartFn;

      if (target && !dragEl && target.parentNode === el) {
        tapEvt = evt;
        rootEl = el;
        dragEl = target;
        parentEl = dragEl.parentNode;
        nextEl = dragEl.nextSibling;
        lastDownEl = target;
        activeGroup = options.group;
        oldIndex = startIndex;
        this._lastX = (touch || evt).clientX;
        this._lastY = (touch || evt).clientY;
        dragEl.style['will-change'] = 'all';

        dragStartFn = function dragStartFn() {
          // Delayed drag has been triggered
          // we can re-enable the events: touchmove/mousemove
          _this._disableDelayedDrag(); // Make the element draggable


          dragEl.draggable = _this.nativeDraggable; // Chosen item

          _toggleClass(dragEl, options.chosenClass, true); // Bind the events: dragstart/dragend


          _this._triggerDragStart(evt, touch); // Drag start event


          _dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, rootEl, oldIndex);
        }; // Disable "draggable"


        options.ignore.split(',').forEach(function (criteria) {
          _find(dragEl, criteria.trim(), _disableDraggable);
        });

        _on(ownerDocument, 'mouseup', _this._onDrop);

        _on(ownerDocument, 'touchend', _this._onDrop);

        _on(ownerDocument, 'touchcancel', _this._onDrop);

        _on(ownerDocument, 'selectstart', _this);

        options.supportPointer && _on(ownerDocument, 'pointercancel', _this._onDrop);

        if (options.delay) {
          // If the user moves the pointer or let go the click or touch
          // before the delay has been reached:
          // disable the delayed drag
          _on(ownerDocument, 'mouseup', _this._disableDelayedDrag);

          _on(ownerDocument, 'touchend', _this._disableDelayedDrag);

          _on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);

          _on(ownerDocument, 'mousemove', _this._disableDelayedDrag);

          _on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);

          options.supportPointer && _on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
          _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
        } else {
          dragStartFn();
        }
      }
    },
    _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
    /** TouchEvent|PointerEvent **/
    e) {
      if (min(abs(e.clientX - this._lastX), abs(e.clientY - this._lastY)) >= this.options.touchStartThreshold) {
        this._disableDelayedDrag();
      }
    },
    _disableDelayedDrag: function _disableDelayedDrag() {
      var ownerDocument = this.el.ownerDocument;
      clearTimeout(this._dragStartTimer);

      _off(ownerDocument, 'mouseup', this._disableDelayedDrag);

      _off(ownerDocument, 'touchend', this._disableDelayedDrag);

      _off(ownerDocument, 'touchcancel', this._disableDelayedDrag);

      _off(ownerDocument, 'mousemove', this._disableDelayedDrag);

      _off(ownerDocument, 'touchmove', this._disableDelayedDrag);

      _off(ownerDocument, 'pointermove', this._disableDelayedDrag);
    },
    _triggerDragStart: function _triggerDragStart(
    /** Event */
    evt,
    /** Touch */
    touch) {
      touch = touch || (evt.pointerType == 'touch' ? evt : null);

      if (touch) {
        // Touch device support
        tapEvt = {
          target: dragEl,
          clientX: touch.clientX,
          clientY: touch.clientY
        };

        this._onDragStart(tapEvt, 'touch');
      } else if (!this.nativeDraggable) {
        this._onDragStart(tapEvt, true);
      } else {
        _on(dragEl, 'dragend', this);

        _on(rootEl, 'dragstart', this._onDragStart);
      }

      try {
        if (document.selection) {
          // Timeout neccessary for IE9
          _nextTick(function () {
            document.selection.empty();
          });
        } else {
          window.getSelection().removeAllRanges();
        }
      } catch (err) {}
    },
    _dragStarted: function _dragStarted() {
      if (rootEl && dragEl) {
        var options = this.options; // Apply effect

        _toggleClass(dragEl, options.ghostClass, true);

        _toggleClass(dragEl, options.dragClass, false);

        Sortable.active = this; // Drag start event

        _dispatchEvent(this, rootEl, 'start', dragEl, rootEl, rootEl, oldIndex);
      } else {
        this._nulling();
      }
    },
    _emulateDragOver: function _emulateDragOver() {
      if (touchEvt) {
        if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
          return;
        }

        this._lastX = touchEvt.clientX;
        this._lastY = touchEvt.clientY;

        if (!supportCssPointerEvents) {
          _css(ghostEl, 'display', 'none');
        }

        var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        var parent = target;
        var i = touchDragOverListeners.length;

        while (target && target.shadowRoot) {
          target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
          parent = target;
        }

        if (parent) {
          do {
            if (parent[expando]) {
              while (i--) {
                touchDragOverListeners[i]({
                  clientX: touchEvt.clientX,
                  clientY: touchEvt.clientY,
                  target: target,
                  rootEl: parent
                });
              }

              break;
            }

            target = parent; // store last element
          }
          /* jshint boss:true */
          while (parent = parent.parentNode);
        }

        if (!supportCssPointerEvents) {
          _css(ghostEl, 'display', '');
        }
      }
    },
    _onTouchMove: function _onTouchMove(
    /**TouchEvent*/
    evt) {
      if (tapEvt) {
        var options = this.options,
            fallbackTolerance = options.fallbackTolerance,
            fallbackOffset = options.fallbackOffset,
            touch = evt.touches ? evt.touches[0] : evt,
            dx = touch.clientX - tapEvt.clientX + fallbackOffset.x,
            dy = touch.clientY - tapEvt.clientY + fallbackOffset.y,
            translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)'; // only set the status to dragging, when we are actually dragging

        if (!Sortable.active) {
          if (fallbackTolerance && min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance) {
            return;
          }

          this._dragStarted();
        } // as well as creating the ghost element on the document body


        this._appendGhost();

        moved = true;
        touchEvt = touch;

        _css(ghostEl, 'webkitTransform', translate3d);

        _css(ghostEl, 'mozTransform', translate3d);

        _css(ghostEl, 'msTransform', translate3d);

        _css(ghostEl, 'transform', translate3d);

        evt.preventDefault();
      }
    },
    _appendGhost: function _appendGhost() {
      if (!ghostEl) {
        var rect = dragEl.getBoundingClientRect(),
            css = _css(dragEl),
            options = this.options,
            ghostRect;

        ghostEl = dragEl.cloneNode(true);

        _toggleClass(ghostEl, options.ghostClass, false);

        _toggleClass(ghostEl, options.fallbackClass, true);

        _toggleClass(ghostEl, options.dragClass, true);

        _css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));

        _css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));

        _css(ghostEl, 'width', rect.width);

        _css(ghostEl, 'height', rect.height);

        _css(ghostEl, 'opacity', '0.8');

        _css(ghostEl, 'position', 'fixed');

        _css(ghostEl, 'zIndex', '100000');

        _css(ghostEl, 'pointerEvents', 'none');

        options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl); // Fixing dimensions.

        ghostRect = ghostEl.getBoundingClientRect();

        _css(ghostEl, 'width', rect.width * 2 - ghostRect.width);

        _css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
      }
    },
    _onDragStart: function _onDragStart(
    /**Event*/
    evt,
    /**boolean*/
    useFallback) {
      var _this = this;

      var dataTransfer = evt.dataTransfer;
      var options = _this.options;

      _this._offUpEvents();

      if (activeGroup.checkPull(_this, _this, dragEl, evt)) {
        cloneEl = _clone(dragEl);
        cloneEl.draggable = false;
        cloneEl.style['will-change'] = '';

        _css(cloneEl, 'display', 'none');

        _toggleClass(cloneEl, _this.options.chosenClass, false); // #1143: IFrame support workaround


        _this._cloneId = _nextTick(function () {
          rootEl.insertBefore(cloneEl, dragEl);

          _dispatchEvent(_this, rootEl, 'clone', dragEl);
        });
      }

      _toggleClass(dragEl, options.dragClass, true);

      if (useFallback) {
        if (useFallback === 'touch') {
          // Bind touch events
          _on(document, 'touchmove', _this._onTouchMove);

          _on(document, 'touchend', _this._onDrop);

          _on(document, 'touchcancel', _this._onDrop);

          if (options.supportPointer) {
            _on(document, 'pointermove', _this._onTouchMove);

            _on(document, 'pointerup', _this._onDrop);
          }
        } else {
          // Old brwoser
          _on(document, 'mousemove', _this._onTouchMove);

          _on(document, 'mouseup', _this._onDrop);
        }

        _this._loopId = setInterval(_this._emulateDragOver, 50);
      } else {
        if (dataTransfer) {
          dataTransfer.effectAllowed = 'move';
          options.setData && options.setData.call(_this, dataTransfer, dragEl);
        }

        _on(document, 'drop', _this); // #1143: Бывает элемент с IFrame внутри блокирует `drop`,
        // поэтому если вызвался `mouseover`, значит надо отменять весь d'n'd.
        // Breaking Chrome 62+
        // _on(document, 'mouseover', _this);


        _this._dragStartId = _nextTick(_this._dragStarted);
      }
    },
    _onDragOver: function _onDragOver(
    /**Event*/
    evt) {
      var el = this.el,
          target,
          dragRect,
          targetRect,
          revert,
          options = this.options,
          group = options.group,
          activeSortable = Sortable.active,
          isOwner = activeGroup === group,
          isMovingBetweenSortable = false,
          canSort = options.sort;

      if (evt.preventDefault !== void 0) {
        evt.preventDefault();
        !options.dragoverBubble && evt.stopPropagation();
      }

      if (dragEl.animated) {
        return;
      }

      moved = true;

      if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
      : putSortable === this || (activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt)) && (evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
      ) {
          // Smart auto-scrolling
          _autoScroll(evt, options, this.el);

          if (_silent) {
            return;
          }

          target = _closest(evt.target, options.draggable, el);
          dragRect = dragEl.getBoundingClientRect();

          if (putSortable !== this) {
            putSortable = this;
            isMovingBetweenSortable = true;
          }

          if (revert) {
            _cloneHide(activeSortable, true);

            parentEl = rootEl; // actualization

            if (cloneEl || nextEl) {
              rootEl.insertBefore(dragEl, cloneEl || nextEl);
            } else if (!canSort) {
              rootEl.appendChild(dragEl);
            }

            return;
          }

          if (el.children.length === 0 || el.children[0] === ghostEl || el === evt.target && _ghostIsLast(el, evt)) {
            //assign target only if condition is true
            if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
              target = el.lastElementChild;
            }

            if (target) {
              if (target.animated) {
                return;
              }

              targetRect = target.getBoundingClientRect();
            }

            _cloneHide(activeSortable, isOwner);

            if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
              if (!dragEl.contains(el)) {
                el.appendChild(dragEl);
                parentEl = el; // actualization
              }

              this._animate(dragRect, dragEl);

              target && this._animate(targetRect, target);
            }
          } else if (target && !target.animated && target !== dragEl && target.parentNode[expando] !== void 0) {
            if (lastEl !== target) {
              lastEl = target;
              lastCSS = _css(target);
              lastParentCSS = _css(target.parentNode);
            }

            targetRect = target.getBoundingClientRect();
            var width = targetRect.right - targetRect.left,
                height = targetRect.bottom - targetRect.top,
                floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display) || lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0,
                isWide = target.offsetWidth > dragEl.offsetWidth,
                isLong = target.offsetHeight > dragEl.offsetHeight,
                halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
                nextSibling = target.nextElementSibling,
                after = false;

            if (floating) {
              var elTop = dragEl.offsetTop,
                  tgTop = target.offsetTop;

              if (elTop === tgTop) {
                after = target.previousElementSibling === dragEl && !isWide || halfway && isWide;
              } else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
                after = (evt.clientY - targetRect.top) / height > 0.5;
              } else {
                after = tgTop > elTop;
              }
            } else if (!isMovingBetweenSortable) {
              after = nextSibling !== dragEl && !isLong || halfway && isLong;
            }

            var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

            if (moveVector !== false) {
              if (moveVector === 1 || moveVector === -1) {
                after = moveVector === 1;
              }

              _silent = true;
              setTimeout(_unsilent, 30);

              _cloneHide(activeSortable, isOwner);

              if (!dragEl.contains(el)) {
                if (after && !nextSibling) {
                  el.appendChild(dragEl);
                } else {
                  target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
                }
              }

              parentEl = dragEl.parentNode; // actualization

              this._animate(dragRect, dragEl);

              this._animate(targetRect, target);
            }
          }
        }
    },
    _animate: function _animate(prevRect, target) {
      var ms = this.options.animation;

      if (ms) {
        var currentRect = target.getBoundingClientRect();

        if (prevRect.nodeType === 1) {
          prevRect = prevRect.getBoundingClientRect();
        }

        _css(target, 'transition', 'none');

        _css(target, 'transform', 'translate3d(' + (prevRect.left - currentRect.left) + 'px,' + (prevRect.top - currentRect.top) + 'px,0)');

        forRepaintDummy = target.offsetWidth; // repaint

        _css(target, 'transition', 'all ' + ms + 'ms');

        _css(target, 'transform', 'translate3d(0,0,0)');

        clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          _css(target, 'transition', '');

          _css(target, 'transform', '');

          target.animated = false;
        }, ms);
      }
    },
    _offUpEvents: function _offUpEvents() {
      var ownerDocument = this.el.ownerDocument;

      _off(document, 'touchmove', this._onTouchMove);

      _off(document, 'pointermove', this._onTouchMove);

      _off(ownerDocument, 'mouseup', this._onDrop);

      _off(ownerDocument, 'touchend', this._onDrop);

      _off(ownerDocument, 'pointerup', this._onDrop);

      _off(ownerDocument, 'touchcancel', this._onDrop);

      _off(ownerDocument, 'pointercancel', this._onDrop);

      _off(ownerDocument, 'selectstart', this);
    },
    _onDrop: function _onDrop(
    /**Event*/
    evt) {
      var el = this.el,
          options = this.options;
      clearInterval(this._loopId);
      clearInterval(autoScroll.pid);
      clearTimeout(this._dragStartTimer);

      _cancelNextTick(this._cloneId);

      _cancelNextTick(this._dragStartId); // Unbind events


      _off(document, 'mouseover', this);

      _off(document, 'mousemove', this._onTouchMove);

      if (this.nativeDraggable) {
        _off(document, 'drop', this);

        _off(el, 'dragstart', this._onDragStart);
      }

      this._offUpEvents();

      if (evt) {
        if (moved) {
          evt.preventDefault();
          !options.dropBubble && evt.stopPropagation();
        }

        ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

        if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
          // Remove clone
          cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
        }

        if (dragEl) {
          if (this.nativeDraggable) {
            _off(dragEl, 'dragend', this);
          }

          _disableDraggable(dragEl);

          dragEl.style['will-change'] = ''; // Remove class's

          _toggleClass(dragEl, this.options.ghostClass, false);

          _toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event


          _dispatchEvent(this, rootEl, 'unchoose', dragEl, parentEl, rootEl, oldIndex, null, evt);

          if (rootEl !== parentEl) {
            newIndex = _index(dragEl, options.draggable);

            if (newIndex >= 0) {
              // Add event
              _dispatchEvent(null, parentEl, 'add', dragEl, parentEl, rootEl, oldIndex, newIndex, evt); // Remove event


              _dispatchEvent(this, rootEl, 'remove', dragEl, parentEl, rootEl, oldIndex, newIndex, evt); // drag from one list and drop into another


              _dispatchEvent(null, parentEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

              _dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
            }
          } else {
            if (dragEl.nextSibling !== nextEl) {
              // Get the index of the dragged element within its parent
              newIndex = _index(dragEl, options.draggable);

              if (newIndex >= 0) {
                // drag & drop within the same list
                _dispatchEvent(this, rootEl, 'update', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

                _dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
              }
            }
          }

          if (Sortable.active) {
            /* jshint eqnull:true */
            if (newIndex == null || newIndex === -1) {
              newIndex = oldIndex;
            }

            _dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex, evt); // Save sorting


            this.save();
          }
        }
      }

      this._nulling();
    },
    _nulling: function _nulling() {
      rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = scrollEl = scrollParentEl = tapEvt = touchEvt = moved = newIndex = lastEl = lastCSS = putSortable = activeGroup = Sortable.active = null;
      savedInputChecked.forEach(function (el) {
        el.checked = true;
      });
      savedInputChecked.length = 0;
    },
    handleEvent: function handleEvent(
    /**Event*/
    evt) {
      switch (evt.type) {
        case 'drop':
        case 'dragend':
          this._onDrop(evt);

          break;

        case 'dragover':
        case 'dragenter':
          if (dragEl) {
            this._onDragOver(evt);

            _globalDragOver(evt);
          }

          break;

        case 'mouseover':
          this._onDrop(evt);

          break;

        case 'selectstart':
          evt.preventDefault();
          break;
      }
    },

    /**
     * Serializes the item into an array of string.
     * @returns {String[]}
     */
    toArray: function toArray() {
      var order = [],
          el,
          children = this.el.children,
          i = 0,
          n = children.length,
          options = this.options;

      for (; i < n; i++) {
        el = children[i];

        if (_closest(el, options.draggable, this.el)) {
          order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
        }
      }

      return order;
    },

    /**
     * Sorts the elements according to the array.
     * @param  {String[]}  order  order of the items
     */
    sort: function sort(order) {
      var items = {},
          rootEl = this.el;
      this.toArray().forEach(function (id, i) {
        var el = rootEl.children[i];

        if (_closest(el, this.options.draggable, rootEl)) {
          items[id] = el;
        }
      }, this);
      order.forEach(function (id) {
        if (items[id]) {
          rootEl.removeChild(items[id]);
          rootEl.appendChild(items[id]);
        }
      });
    },

    /**
     * Save the current sorting
     */
    save: function save() {
      var store = this.options.store;
      store && store.set(this);
    },

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * @param   {HTMLElement}  el
     * @param   {String}       [selector]  default: `options.draggable`
     * @returns {HTMLElement|null}
     */
    closest: function closest(el, selector) {
      return _closest(el, selector || this.options.draggable, this.el);
    },

    /**
     * Set/get option
     * @param   {string} name
     * @param   {*}      [value]
     * @returns {*}
     */
    option: function option(name, value) {
      var options = this.options;

      if (value === void 0) {
        return options[name];
      } else {
        options[name] = value;

        if (name === 'group') {
          _prepareGroup(options);
        }
      }
    },

    /**
     * Destroy
     */
    destroy: function destroy() {
      var el = this.el;
      el[expando] = null;

      _off(el, 'mousedown', this._onTapStart);

      _off(el, 'touchstart', this._onTapStart);

      _off(el, 'pointerdown', this._onTapStart);

      if (this.nativeDraggable) {
        _off(el, 'dragover', this);

        _off(el, 'dragenter', this);
      } // Remove draggable attributes


      Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
        el.removeAttribute('draggable');
      });
      touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

      this._onDrop();

      this.el = el = null;
    }
  };

  function _cloneHide(sortable, state) {
    if (sortable.lastPullMode !== 'clone') {
      state = true;
    }

    if (cloneEl && cloneEl.state !== state) {
      _css(cloneEl, 'display', state ? 'none' : '');

      if (!state) {
        if (cloneEl.state) {
          if (sortable.options.group.revertClone) {
            rootEl.insertBefore(cloneEl, nextEl);

            sortable._animate(dragEl, cloneEl);
          } else {
            rootEl.insertBefore(cloneEl, dragEl);
          }
        }
      }

      cloneEl.state = state;
    }
  }

  function _closest(
  /**HTMLElement*/
  el,
  /**String*/
  selector,
  /**HTMLElement*/
  ctx) {
    if (el) {
      ctx = ctx || document;

      do {
        if (selector === '>*' && el.parentNode === ctx || _matches(el, selector)) {
          return el;
        }
        /* jshint boss:true */

      } while (el = _getParentOrHost(el));
    }

    return null;
  }

  function _getParentOrHost(el) {
    var parent = el.host;
    return parent && parent.nodeType ? parent : el.parentNode;
  }

  function _globalDragOver(
  /**Event*/
  evt) {
    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = 'move';
    }

    evt.preventDefault();
  }

  function _on(el, event, fn) {
    el.addEventListener(event, fn, captureMode);
  }

  function _off(el, event, fn) {
    el.removeEventListener(event, fn, captureMode);
  }

  function _toggleClass(el, name, state) {
    if (el) {
      if (el.classList) {
        el.classList[state ? 'add' : 'remove'](name);
      } else {
        var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
        el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
      }
    }
  }

  function _css(el, prop, val) {
    var style = el && el.style;

    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style)) {
          prop = '-webkit-' + prop;
        }

        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }

  function _find(ctx, tagName, iterator) {
    if (ctx) {
      var list = ctx.getElementsByTagName(tagName),
          i = 0,
          n = list.length;

      if (iterator) {
        for (; i < n; i++) {
          iterator(list[i], i);
        }
      }

      return list;
    }

    return [];
  }

  function _dispatchEvent(sortable, rootEl, name, targetEl, toEl, fromEl, startIndex, newIndex, originalEvt) {
    sortable = sortable || rootEl[expando];
    var evt = document.createEvent('Event'),
        options = sortable.options,
        onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
    evt.initEvent(name, true, true);
    evt.to = toEl || rootEl;
    evt.from = fromEl || rootEl;
    evt.item = targetEl || rootEl;
    evt.clone = cloneEl;
    evt.oldIndex = startIndex;
    evt.newIndex = newIndex;
    evt.originalEvent = originalEvt;
    rootEl.dispatchEvent(evt);

    if (options[onName]) {
      options[onName].call(sortable, evt);
    }
  }

  function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
    var evt,
        sortable = fromEl[expando],
        onMoveFn = sortable.options.onMove,
        retVal;
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
    evt.to = toEl;
    evt.from = fromEl;
    evt.dragged = dragEl;
    evt.draggedRect = dragRect;
    evt.related = targetEl || toEl;
    evt.relatedRect = targetRect || toEl.getBoundingClientRect();
    evt.willInsertAfter = willInsertAfter;
    evt.originalEvent = originalEvt;
    fromEl.dispatchEvent(evt);

    if (onMoveFn) {
      retVal = onMoveFn.call(sortable, evt, originalEvt);
    }

    return retVal;
  }

  function _disableDraggable(el) {
    el.draggable = false;
  }

  function _unsilent() {
    _silent = false;
  }
  /** @returns {HTMLElement|false} */


  function _ghostIsLast(el, evt) {
    var lastEl = el.lastElementChild,
        rect = lastEl.getBoundingClientRect(); // 5 — min delta
    // abs — нельзя добавлять, а то глюки при наведении сверху

    return evt.clientY - (rect.top + rect.height) > 5 || evt.clientX - (rect.left + rect.width) > 5;
  }
  /**
   * Generate id
   * @param   {HTMLElement} el
   * @returns {String}
   * @private
   */


  function _generateId(el) {
    var str = el.tagName + el.className + el.src + el.href + el.textContent,
        i = str.length,
        sum = 0;

    while (i--) {
      sum += str.charCodeAt(i);
    }

    return sum.toString(36);
  }
  /**
   * Returns the index of an element within its parent for a selected set of
   * elements
   * @param  {HTMLElement} el
   * @param  {selector} selector
   * @return {number}
   */


  function _index(el, selector) {
    var index = 0;

    if (!el || !el.parentNode) {
      return -1;
    }

    while (el && (el = el.previousElementSibling)) {
      if (el.nodeName.toUpperCase() !== 'TEMPLATE' && (selector === '>*' || _matches(el, selector))) {
        index++;
      }
    }

    return index;
  }

  function _matches(
  /**HTMLElement*/
  el,
  /**String*/
  selector) {
    if (el) {
      try {
        if (el.matches) {
          return el.matches(selector);
        } else if (el.msMatchesSelector) {
          return el.msMatchesSelector(selector);
        }
      } catch (_) {
        return false;
      }
    }

    return false;
  }

  function _throttle(callback, ms) {
    var args, _this;

    return function () {
      if (args === void 0) {
        args = arguments;
        _this = this;
        setTimeout(function () {
          if (args.length === 1) {
            callback.call(_this, args[0]);
          } else {
            callback.apply(_this, args);
          }

          args = void 0;
        }, ms);
      }
    };
  }

  function _extend(dst, src) {
    if (dst && src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dst[key] = src[key];
        }
      }
    }

    return dst;
  }

  function _clone(el) {
    if (Polymer && Polymer.dom) {
      return Polymer.dom(el).cloneNode(true);
    } else if ($) {
      return $(el).clone(true)[0];
    } else {
      return el.cloneNode(true);
    }
  }

  function _saveInputCheckedState(root) {
    savedInputChecked.length = 0;
    var inputs = root.getElementsByTagName('input');
    var idx = inputs.length;

    while (idx--) {
      var el = inputs[idx];
      el.checked && savedInputChecked.push(el);
    }
  }

  function _nextTick(fn) {
    return setTimeout(fn, 0);
  }

  function _cancelNextTick(id) {
    return clearTimeout(id);
  } // Fixed #973:


  _on(document, 'touchmove', function (evt) {
    if (Sortable.active) {
      evt.preventDefault();
    }
  }); // Export utils


  Sortable.utils = {
    on: _on,
    off: _off,
    css: _css,
    find: _find,
    is: function is(el, selector) {
      return !!_closest(el, selector, el);
    },
    extend: _extend,
    throttle: _throttle,
    closest: _closest,
    toggleClass: _toggleClass,
    clone: _clone,
    index: _index,
    nextTick: _nextTick,
    cancelNextTick: _cancelNextTick
  };
  /**
   * Create sortable instance
   * @param {HTMLElement}  el
   * @param {Object}      [options]
   */

  Sortable.create = function (el, options) {
    return new Sortable(el, options);
  }; // Export


  Sortable.version = '1.7.0';
  return Sortable;
}); // https://github.com/SortableJS/Vue.Draggable


;

(function () {
  "use strict";

  var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return _typeof2(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
  };

  var _extends = Object.assign;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return [].slice.call(arr);
    }
  }

  function buildDraggable(Sortable) {
    function removeNode(node) {
      node.parentElement.removeChild(node);
    }

    function insertNodeAt(fatherNode, node, position) {
      var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
      fatherNode.insertBefore(node, refNode);
    }

    function computeVmIndex(vnodes, element) {
      return vnodes.map(function (elt) {
        return elt.elm;
      }).indexOf(element);
    }

    function _computeIndexes(slots, children, isTransition) {
      if (!slots) {
        return [];
      }

      var elmFromNodes = slots.map(function (elt) {
        return elt.elm;
      });
      var rawIndexes = [].concat(_toConsumableArray(children)).map(function (elt) {
        return elmFromNodes.indexOf(elt);
      });
      return isTransition ? rawIndexes.filter(function (ind) {
        return ind !== -1;
      }) : rawIndexes;
    }

    function emit(evtName, evtData) {
      var _this = this;

      this.$nextTick(function () {
        return _this.$emit(evtName.toLowerCase(), evtData);
      });
    }

    function delegateAndEmit(evtName) {
      var _this2 = this;

      return function (evtData) {
        if (_this2.realList !== null) {
          _this2['onDrag' + evtName](evtData);
        }

        emit.call(_this2, evtName, evtData);
      };
    }

    var eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End'];
    var eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone'];
    var readonlyProperties = ['Move'].concat(eventsListened, eventsToEmit).map(function (evt) {
      return 'on' + evt;
    });
    var draggingElement = null;
    var props = vue_utils.initDefaultProps({
      options: Object,
      list: {
        type: Array,
        required: false
      },
      value: {
        type: Array,
        required: false
      },
      noTransitionOnDrag: {
        type: Boolean
      },
      clone: {
        type: Function
      },
      element: {
        type: String
      },
      move: {
        type: Function
      }
    }, {
      list: null,
      value: null,
      noTransitionOnDrag: false,
      clone: function _default(original) {
        return original;
      },
      element: 'div',
      move: null
    });
    var draggableComponent = {
      name: 'draggable',
      props: props,
      data: function data() {
        return {
          transitionMode: false,
          componentMode: false
        };
      },
      render: function render(h) {
        var slots = this.$slots['default'];

        if (slots && slots.length === 1) {
          var child = slots[0];

          if (child.componentOptions && child.componentOptions.tag === "transition-group") {
            this.transitionMode = true;
          }
        }

        var children = slots;
        var footer = this.$slots.footer;

        if (footer) {
          children = slots ? [].concat(_toConsumableArray(slots), _toConsumableArray(footer)) : [].concat(_toConsumableArray(footer));
        }

        return h(this.element, null, children);
      },
      mounted: function mounted() {
        var _this3 = this;

        this.componentMode = this.element.toLowerCase() !== this.$el.nodeName.toLowerCase();

        if (this.componentMode && this.transitionMode) {
          throw new Error('Transition-group inside component is not supported. Please alter element value or remove transition-group. Current element value: ' + this.element);
        }

        var optionsAdded = {};
        eventsListened.forEach(function (elt) {
          optionsAdded['on' + elt] = delegateAndEmit.call(_this3, elt);
        });
        eventsToEmit.forEach(function (elt) {
          optionsAdded['on' + elt] = emit.bind(_this3, elt);
        });

        var options = _extends({}, this.options, optionsAdded, {
          onMove: function onMove(evt, originalEvent) {
            return _this3.onDragMove(evt, originalEvent);
          }
        });

        !('draggable' in options) && (options.draggable = '>*');
        this._sortable = new Sortable(this.rootContainer, options);
        this.computeIndexes();
      },
      beforeDestroy: function beforeDestroy() {
        this._sortable.destroy();
      },
      computed: {
        rootContainer: function rootContainer() {
          return this.transitionMode ? this.$el.children[0] : this.$el;
        },
        isCloning: function isCloning() {
          return !!this.options && !!this.options.group && this.options.group.pull === 'clone';
        },
        realList: function realList() {
          return !!this.list ? this.list : this.value;
        }
      },
      watch: {
        options: {
          handler: function handler(newOptionValue) {
            for (var property in newOptionValue) {
              if (readonlyProperties.indexOf(property) == -1) {
                this._sortable.option(property, newOptionValue[property]);
              }
            }
          },
          deep: true
        },
        realList: function realList() {
          this.computeIndexes();
        }
      },
      methods: {
        getChildrenNodes: function getChildrenNodes() {
          if (this.componentMode) {
            return this.$children[0].$slots['default'];
          }

          var rawNodes = this.$slots['default'];
          return this.transitionMode ? rawNodes[0].child.$slots['default'] : rawNodes;
        },
        computeIndexes: function computeIndexes() {
          var _this4 = this;

          this.$nextTick(function () {
            _this4.visibleIndexes = _computeIndexes(_this4.getChildrenNodes(), _this4.rootContainer.children, _this4.transitionMode);
          });
        },
        getUnderlyingVm: function getUnderlyingVm(htmlElt) {
          var index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);

          if (index === -1) {
            //Edge case during move callback: related element might be
            //an element different from collection
            return null;
          }

          var element = this.realList[index];
          return {
            index: index,
            element: element
          };
        },
        getUnderlyingPotencialDraggableComponent: function getUnderlyingPotencialDraggableComponent(_ref) {
          var __vue__ = _ref.__vue__;

          if (!__vue__ || !__vue__.$options || __vue__.$options._componentTag !== "transition-group") {
            return __vue__;
          }

          return __vue__.$parent;
        },
        emitChanges: function emitChanges(evt) {
          var _this5 = this;

          this.$nextTick(function () {
            _this5.$emit('change', evt);
          });
        },
        alterList: function alterList(onList) {
          if (!!this.list) {
            onList(this.list);
          } else {
            var newList = [].concat(_toConsumableArray(this.value));
            onList(newList);
            this.$emit('input', newList);
          }
        },
        spliceList: function spliceList() {
          var _arguments = arguments;

          var spliceList = function spliceList(list) {
            return list.splice.apply(list, _arguments);
          };

          this.alterList(spliceList);
        },
        updatePosition: function updatePosition(oldIndex, newIndex) {
          var updatePosition = function updatePosition(list) {
            return list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
          };

          this.alterList(updatePosition);
        },
        getRelatedContextFromMoveEvent: function getRelatedContextFromMoveEvent(_ref2) {
          var to = _ref2.to,
              related = _ref2.related;
          var component = this.getUnderlyingPotencialDraggableComponent(to);

          if (!component) {
            return {
              component: component
            };
          }

          var list = component.realList;
          var context = {
            list: list,
            component: component
          };

          if (to !== related && list && component.getUnderlyingVm) {
            var destination = component.getUnderlyingVm(related);

            if (destination) {
              return _extends(destination, context);
            }
          }

          return context;
        },
        getVmIndex: function getVmIndex(domIndex) {
          var indexes = this.visibleIndexes;
          var numberIndexes = indexes.length;
          return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
        },
        getComponent: function getComponent() {
          return this.$slots['default'][0].componentInstance;
        },
        resetTransitionData: function resetTransitionData(index) {
          if (!this.noTransitionOnDrag || !this.transitionMode) {
            return;
          }

          var nodes = this.getChildrenNodes();
          nodes[index].data = null;
          var transitionContainer = this.getComponent();
          transitionContainer.children = [];
          transitionContainer.kept = undefined;
        },
        onDragStart: function onDragStart(evt) {
          this.context = this.getUnderlyingVm(evt.item);
          evt.item._underlying_vm_ = this.clone(this.context.element);
          draggingElement = evt.item;
        },
        onDragAdd: function onDragAdd(evt) {
          var element = evt.item._underlying_vm_;

          if (element === undefined) {
            return;
          }

          removeNode(evt.item);
          var newIndex = this.getVmIndex(evt.newIndex);
          this.spliceList(newIndex, 0, element);
          this.computeIndexes();
          var added = {
            element: element,
            newIndex: newIndex
          };
          this.emitChanges({
            added: added
          });
        },
        onDragRemove: function onDragRemove(evt) {
          insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);

          if (this.isCloning) {
            removeNode(evt.clone);
            return;
          }

          var oldIndex = this.context.index;
          this.spliceList(oldIndex, 1);
          var removed = {
            element: this.context.element,
            oldIndex: oldIndex
          };
          this.resetTransitionData(oldIndex);
          this.emitChanges({
            removed: removed
          });
        },
        onDragUpdate: function onDragUpdate(evt) {
          removeNode(evt.item);
          insertNodeAt(evt.from, evt.item, evt.oldIndex);
          var oldIndex = this.context.index;
          var newIndex = this.getVmIndex(evt.newIndex);
          this.updatePosition(oldIndex, newIndex);
          var moved = {
            element: this.context.element,
            oldIndex: oldIndex,
            newIndex: newIndex
          };
          this.emitChanges({
            moved: moved
          });
        },
        computeFutureIndex: function computeFutureIndex(relatedContext, evt) {
          if (!relatedContext.element) {
            return 0;
          }

          var domChildren = [].concat(_toConsumableArray(evt.to.children)).filter(function (el) {
            return el.style['display'] !== 'none';
          });
          var currentDOMIndex = domChildren.indexOf(evt.related);
          var currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
          var draggedInList = domChildren.indexOf(draggingElement) != -1;
          return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
        },
        onDragMove: function onDragMove(evt, originalEvent) {
          var onMove = this.move;

          if (!onMove || !this.realList) {
            return true;
          }

          var relatedContext = this.getRelatedContextFromMoveEvent(evt);
          var draggedContext = this.context;
          var futureIndex = this.computeFutureIndex(relatedContext, evt);

          _extends(draggedContext, {
            futureIndex: futureIndex
          });

          _extends(evt, {
            relatedContext: relatedContext,
            draggedContext: draggedContext
          });

          return onMove(evt, originalEvent);
        },
        onDragEnd: function onDragEnd(evt) {
          this.computeIndexes();
          draggingElement = null;
        }
      }
    };
    return draggableComponent;
  }

  if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == "object") {
    var Sortable = require("sortablejs");

    module.exports = buildDraggable(Sortable);
  } else if (typeof define == "function" && define.amd) {
    define(['sortablejs'], function (Sortable) {
      return buildDraggable(Sortable);
    });
  } else if (window && window.Vue && window.Sortable) {
    var draggable = buildDraggable(window.Sortable);
    Vue.component('draggable', draggable);
  } else {
    if (typeof window.Vue == "undefined") {// throw 'Vue.js not found!';
    }

    if (typeof window.Sortable == "undefined") {// throw 'Sortable.js not found!';
    }
  }
})();
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * Vue-Lazyload.js v1.2.5
 * (c) 2018 Awe <hilongjw@gmail.com>
 * https://github.com/hilongjw/vue-lazyload
 * Released under the MIT License.
 */
!function (b, a) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() : "function" == typeof define && define.amd ? define(a) : b.VueLazyload = a();
}(this, function () {
  function aD(a) {
    return a.constructor && "function" == typeof a.constructor.isBuffer && a.constructor.isBuffer(a);
  }

  function ao(c) {
    c = c || {};
    var b = arguments.length,
        a = 0;

    if (1 === b) {
      return c;
    }

    for (; ++a < b;) {
      var d = arguments[a];
      aB(c) && (c = d), aq(d) && au(c, d);
    }

    return c;
  }

  function au(c, f) {
    av(c, f);

    for (var d in f) {
      if ("__proto__" !== d && az(f, d)) {
        var b = f[d];
        aq(b) ? ("undefined" === Z(c[d]) && "function" === Z(b) && (c[d] = b), c[d] = ao(c[d] || {}, b)) : c[d] = b;
      }
    }

    return c;
  }

  function aq(a) {
    return "object" === Z(a) || "function" === Z(a);
  }

  function az(b, a) {
    return Object.prototype.hasOwnProperty.call(b, a);
  }

  function at(b, a) {
    if (b.length) {
      var c = b.indexOf(a);
      return c > -1 ? b.splice(c, 1) : void 0;
    }
  }

  function aH(d, b) {
    for (var f = !1, c = 0, a = d.length; c < a; c++) {
      if (b(d[c])) {
        f = !0;
        break;
      }
    }

    return f;
  }

  function ap(p, z) {
    if ("IMG" === p.tagName && p.getAttribute("data-srcset")) {
      var g = p.getAttribute("data-srcset"),
          b = [],
          k = p.parentNode,
          f = k.offsetWidth * z,
          x = void 0,
          A = void 0,
          y = void 0;
      g = g.trim().split(","), g.map(function (a) {
        a = a.trim(), x = a.lastIndexOf(" "), -1 === x ? (A = a, y = 999998) : (A = a.substr(0, x), y = parseInt(a.substr(x + 1, a.length - x - 2), 10)), b.push([y, A]);
      }), b.sort(function (c, a) {
        if (c[0] < a[0]) {
          return -1;
        }

        if (c[0] > a[0]) {
          return 1;
        }

        if (c[0] === a[0]) {
          if (-1 !== a[1].indexOf(".webp", a[1].length - 5)) {
            return 1;
          }

          if (-1 !== c[1].indexOf(".webp", c[1].length - 5)) {
            return -1;
          }
        }

        return 0;
      });

      for (var j = "", v = void 0, w = b.length, m = 0; m < w; m++) {
        if (v = b[m], v[0] >= f) {
          j = v[1];
          break;
        }
      }

      return j;
    }
  }

  function an(d, b) {
    for (var f = void 0, c = 0, a = d.length; c < a; c++) {
      if (b(d[c])) {
        f = d[c];
        break;
      }
    }

    return f;
  }

  function aw() {
    if (!ag) {
      return !1;
    }

    var b = !0,
        a = document;

    try {
      var c = a.createElement("object");
      c.type = "image/webp", c.style.visibility = "hidden", c.innerHTML = "!", a.body.appendChild(c), b = !c.offsetWidth, a.body.removeChild(c);
    } catch (a) {
      b = !1;
    }

    return b;
  }

  function aE(c, a) {
    var d = null,
        b = 0;
    return function () {
      if (!d) {
        var f = Date.now() - b,
            h = this,
            e = arguments,
            g = function g() {
          b = Date.now(), d = !1, c.apply(h, e);
        };

        f >= a ? g() : d = setTimeout(g, a);
      }
    };
  }

  function aF(a) {
    return null !== a && "object" === (void 0 === a ? "undefined" : ar(a));
  }

  function aA(b) {
    if (!(b instanceof Object)) {
      return [];
    }

    if (Object.keys) {
      return Object.keys(b);
    }

    var a = [];

    for (var c in b) {
      b.hasOwnProperty(c) && a.push(c);
    }

    return a;
  }

  function aC(c) {
    for (var a = c.length, d = [], b = 0; b < a; b++) {
      d.push(c[b]);
    }

    return d;
  }

  function am() {}

  var ar = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (a) {
    return _typeof(a);
  } : function (a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : _typeof(a);
  },
      aG = function aG(b, a) {
    if (!(b instanceof a)) {
      throw new TypeError("Cannot call a class as a function");
    }
  },
      aj = function () {
    function a(d, b) {
      for (var f = 0; f < b.length; f++) {
        var c = b[f];
        c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(d, c.key, c);
      }
    }

    return function (b, d, c) {
      return d && a(b.prototype, d), c && a(b, c), b;
    };
  }(),
      aB = function aB(a) {
    return null == a || "function" != typeof a && "object" !== (void 0 === a ? "undefined" : ar(a));
  },
      av = function av(h, m) {
    if (null === h || void 0 === h) {
      throw new TypeError("expected first argument to be an object.");
    }

    if (void 0 === m || "undefined" == typeof Symbol) {
      return h;
    }

    if ("function" != typeof Object.getOwnPropertySymbols) {
      return h;
    }

    for (var d = Object.prototype.propertyIsEnumerable, b = Object(h), g = arguments.length, c = 0; ++c < g;) {
      for (var j = Object(arguments[c]), p = Object.getOwnPropertySymbols(j), k = 0; k < p.length; k++) {
        var f = p[k];
        d.call(j, f) && (b[f] = j[f]);
      }
    }

    return b;
  },
      al = Object.prototype.toString,
      Z = function Z(a) {
    var b = void 0 === a ? "undefined" : ar(a);
    return "undefined" === b ? "undefined" : null === a ? "null" : !0 === a || !1 === a || a instanceof Boolean ? "boolean" : "string" === b || a instanceof String ? "string" : "number" === b || a instanceof Number ? "number" : "function" === b || a instanceof Function ? void 0 !== a.constructor.name && "Generator" === a.constructor.name.slice(0, 9) ? "generatorfunction" : "function" : void 0 !== Array.isArray && Array.isArray(a) ? "array" : a instanceof RegExp ? "regexp" : a instanceof Date ? "date" : (b = al.call(a), "[object RegExp]" === b ? "regexp" : "[object Date]" === b ? "date" : "[object Arguments]" === b ? "arguments" : "[object Error]" === b ? "error" : "[object Promise]" === b ? "promise" : aD(a) ? "buffer" : "[object Set]" === b ? "set" : "[object WeakSet]" === b ? "weakset" : "[object Map]" === b ? "map" : "[object WeakMap]" === b ? "weakmap" : "[object Symbol]" === b ? "symbol" : "[object Map Iterator]" === b ? "mapiterator" : "[object Set Iterator]" === b ? "setiterator" : "[object String Iterator]" === b ? "stringiterator" : "[object Array Iterator]" === b ? "arrayiterator" : "[object Int8Array]" === b ? "int8array" : "[object Uint8Array]" === b ? "uint8array" : "[object Uint8ClampedArray]" === b ? "uint8clampedarray" : "[object Int16Array]" === b ? "int16array" : "[object Uint16Array]" === b ? "uint16array" : "[object Int32Array]" === b ? "int32array" : "[object Uint32Array]" === b ? "uint32array" : "[object Float32Array]" === b ? "float32array" : "[object Float64Array]" === b ? "float64array" : "object");
  },
      aI = ao,
      ag = "undefined" != typeof window,
      ax = ag && "IntersectionObserver" in window,
      ac = {
    event: "event",
    observer: "observer"
  },
      ay = function () {
    function a(c, b) {
      b = b || {
        bubbles: !1,
        cancelable: !1,
        detail: void 0
      };
      var d = document.createEvent("CustomEvent");
      return d.initCustomEvent(c, b.bubbles, b.cancelable, b.detail), d;
    }

    if (ag) {
      return "function" == typeof window.CustomEvent ? window.CustomEvent : (a.prototype = window.Event.prototype, a);
    }
  }(),
      ai = function ai() {
    var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
    return ag ? window.devicePixelRatio || a : a;
  },
      G = function () {
    if (ag) {
      var b = !1;

      try {
        var a = Object.defineProperty({}, "passive", {
          get: function get() {
            b = !0;
          }
        });
        window.addEventListener("test", null, a);
      } catch (b) {}

      return b;
    }
  }(),
      U = {
    on: function on(c, a, d) {
      var b = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
      G ? c.addEventListener(a, d, {
        capture: b,
        passive: !0
      }) : c.addEventListener(a, d, b);
    },
    off: function off(c, a, d) {
      var b = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
      c.removeEventListener(a, d, b);
    }
  },
      aa = function aa(c, a, d) {
    var b = new Image();
    b.src = c.src, b.onload = function () {
      a({
        naturalHeight: b.naturalHeight,
        naturalWidth: b.naturalWidth,
        src: b.src
      });
    }, b.onerror = function (f) {
      d(f);
    };
  },
      ak = function ak(b, a) {
    return "undefined" != typeof getComputedStyle ? getComputedStyle(b, null).getPropertyValue(a) : b.style[a];
  },
      J = function J(a) {
    return ak(a, "overflow") + ak(a, "overflow-y") + ak(a, "overflow-x");
  },
      ah = function ah(b) {
    if (ag) {
      if (!(b instanceof HTMLElement)) {
        return window;
      }

      for (var a = b; a && a !== document.body && a !== document.documentElement && a.parentNode;) {
        if (/(scroll|auto)/.test(J(a))) {
          return a;
        }

        a = a.parentNode;
      }

      return window;
    }
  },
      ab = {},
      P = function () {
    function a(j) {
      var d = j.el,
          b = j.src,
          f = j.error,
          c = j.loading,
          g = j.bindType,
          k = j.$parent,
          h = j.options,
          e = j.elRenderer;
      aG(this, a), this.el = d, this.src = b, this.error = f, this.loading = c, this.bindType = g, this.attempt = 0, this.naturalHeight = 0, this.naturalWidth = 0, this.options = h, this.rect = null, this.$parent = k, this.elRenderer = e, this.performanceData = {
        init: Date.now(),
        loadStart: 0,
        loadEnd: 0
      }, this.filter(), this.initState(), this.render("loading", !1);
    }

    return aj(a, [{
      key: "initState",
      value: function value() {
        "dataset" in this.el ? this.el.dataset.src = this.src : this.el.setAttribute("data-src", this.src), this.state = {
          error: !1,
          loaded: !1,
          rendered: !1
        };
      }
    }, {
      key: "record",
      value: function value(b) {
        this.performanceData[b] = Date.now();
      }
    }, {
      key: "update",
      value: function value(f) {
        var c = f.src,
            g = f.loading,
            d = f.error,
            b = this.src;
        this.src = c, this.loading = g, this.error = d, this.filter(), b !== this.src && (this.attempt = 0, this.initState());
      }
    }, {
      key: "getRect",
      value: function value() {
        this.rect = this.el.getBoundingClientRect();
      }
    }, {
      key: "checkInView",
      value: function value() {
        return this.getRect(), this.rect.top < window.innerHeight * this.options.preLoad && this.rect.bottom > this.options.preLoadTop && this.rect.left < window.innerWidth * this.options.preLoad && this.rect.right > 0;
      }
    }, {
      key: "filter",
      value: function value() {
        var b = this;
        aA(this.options.filter).map(function (c) {
          b.options.filter[c](b, b.options);
        });
      }
    }, {
      key: "renderLoading",
      value: function value(c) {
        var b = this;
        aa({
          src: this.loading
        }, function (d) {
          b.render("loading", !1), c();
        }, function () {
          c(), b.options.silent || console.warn("VueLazyload log: load failed with loading image(" + b.loading + ")");
        });
      }
    }, {
      key: "load",
      value: function value() {
        var c = this,
            b = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : am;
        return this.attempt > this.options.attempt - 1 && this.state.error ? (this.options.silent || console.log("VueLazyload log: " + this.src + " tried too more than " + this.options.attempt + " times"), void b()) : this.state.loaded || ab[this.src] ? (this.state.loaded = !0, b(), this.render("loaded", !0)) : void this.renderLoading(function () {
          c.attempt++, c.record("loadStart"), aa({
            src: c.src
          }, function (d) {
            c.naturalHeight = d.naturalHeight, c.naturalWidth = d.naturalWidth, c.state.loaded = !0, c.state.error = !1, c.record("loadEnd"), c.render("loaded", !1), ab[c.src] = 1, b();
          }, function (d) {
            !c.options.silent && console.error(d), c.state.error = !0, c.state.loaded = !1, c.render("error", !1);
          });
        });
      }
    }, {
      key: "render",
      value: function value(c, b) {
        this.elRenderer(this, c, b);
      }
    }, {
      key: "performance",
      value: function value() {
        var c = "loading",
            b = 0;
        return this.state.loaded && (c = "loaded", b = (this.performanceData.loadEnd - this.performanceData.loadStart) / 1000), this.state.error && (c = "error"), {
          src: this.src,
          state: c,
          time: b
        };
      }
    }, {
      key: "destroy",
      value: function value() {
        this.el = null, this.src = null, this.error = null, this.loading = null, this.bindType = null, this.attempt = 0;
      }
    }]), a;
  }(),
      ae = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      K = ["scroll", "wheel", "mousewheel", "resize", "animationend", "transitionend", "touchmove"],
      q = {
    rootMargin: "0px",
    threshold: 0
  },
      ad = function ad(a) {
    return function () {
      function b(B) {
        var l = B.preLoad,
            d = B.error,
            w = B.throttleWait,
            k = B.preLoadTop,
            E = B.dispatchEvent,
            L = B.loading,
            I = B.attempt,
            C = B.silent,
            x = void 0 === C || C,
            A = B.scale,
            H = B.listenEvents,
            j = (B.hasbind, B.filter),
            D = B.adapter,
            z = B.observer,
            t = B.observerOptions;
        aG(this, b), this.version = "1.2.5", this.mode = ac.event, this.ListenerQueue = [], this.TargetIndex = 0, this.TargetQueue = [], this.options = {
          silent: x,
          dispatchEvent: !!E,
          throttleWait: w || 200,
          preLoad: l || 1.3,
          preLoadTop: k || 0,
          error: d || ae,
          loading: L || ae,
          attempt: I || 3,
          scale: A || ai(A),
          ListenEvents: H || K,
          hasbind: !1,
          supportWebp: aw(),
          filter: j || {},
          adapter: D || {},
          observer: !!z,
          observerOptions: t || q
        }, this._initEvent(), this.lazyLoadHandler = aE(this._lazyLoadHandler.bind(this), this.options.throttleWait), this.setMode(this.options.observer ? ac.observer : ac.event);
      }

      return aj(b, [{
        key: "config",
        value: function value() {
          var c = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          aI(this.options, c);
        }
      }, {
        key: "performance",
        value: function value() {
          var c = [];
          return this.ListenerQueue.map(function (d) {
            c.push(d.performance());
          }), c;
        }
      }, {
        key: "addLazyBox",
        value: function value(c) {
          this.ListenerQueue.push(c), ag && (this._addListenerTarget(window), this._observer && this._observer.observe(c.el), c.$el && c.$el.parentNode && this._addListenerTarget(c.$el.parentNode));
        }
      }, {
        key: "add",
        value: function value(g, m, h) {
          var f = this;

          if (aH(this.ListenerQueue, function (d) {
            return d.el === g;
          })) {
            return this.update(g, m), a.nextTick(this.lazyLoadHandler);
          }

          var k = this._valueFormatter(m.value),
              e = k.src,
              c = k.loading,
              j = k.error;

          a.nextTick(function () {
            e = ap(g, f.options.scale) || e, f._observer && f._observer.observe(g);
            var i = Object.keys(m.modifiers)[0],
                d = void 0;
            i && (d = h.context.$refs[i], d = d ? d.$el || d : document.getElementById(i)), d || (d = ah(g));
            var l = new P({
              bindType: m.arg,
              $parent: d,
              el: g,
              loading: c,
              error: j,
              src: e,
              elRenderer: f._elRenderer.bind(f),
              options: f.options
            });
            f.ListenerQueue.push(l), ag && (f._addListenerTarget(window), f._addListenerTarget(d)), f.lazyLoadHandler(), a.nextTick(function () {
              return f.lazyLoadHandler();
            });
          });
        }
      }, {
        key: "update",
        value: function value(g, m) {
          var h = this,
              f = this._valueFormatter(m.value),
              k = f.src,
              e = f.loading,
              c = f.error;

          k = ap(g, this.options.scale) || k;
          var j = an(this.ListenerQueue, function (d) {
            return d.el === g;
          });
          j && j.update({
            src: k,
            loading: e,
            error: c
          }), this._observer && (this._observer.unobserve(g), this._observer.observe(g)), this.lazyLoadHandler(), a.nextTick(function () {
            return h.lazyLoadHandler();
          });
        }
      }, {
        key: "remove",
        value: function value(d) {
          if (d) {
            this._observer && this._observer.unobserve(d);
            var c = an(this.ListenerQueue, function (e) {
              return e.el === d;
            });
            c && (this._removeListenerTarget(c.$parent), this._removeListenerTarget(window), at(this.ListenerQueue, c) && c.destroy());
          }
        }
      }, {
        key: "removeComponent",
        value: function value(c) {
          c && (at(this.ListenerQueue, c), this._observer && this._observer.unobserve(c.el), c.$parent && c.$el.parentNode && this._removeListenerTarget(c.$el.parentNode), this._removeListenerTarget(window));
        }
      }, {
        key: "setMode",
        value: function value(d) {
          var c = this;
          ax || d !== ac.observer || (d = ac.event), this.mode = d, d === ac.event ? (this._observer && (this.ListenerQueue.forEach(function (f) {
            c._observer.unobserve(f.el);
          }), this._observer = null), this.TargetQueue.forEach(function (f) {
            c._initListen(f.el, !0);
          })) : (this.TargetQueue.forEach(function (f) {
            c._initListen(f.el, !1);
          }), this._initIntersectionObserver());
        }
      }, {
        key: "_addListenerTarget",
        value: function value(d) {
          if (d) {
            var c = an(this.TargetQueue, function (e) {
              return e.el === d;
            });
            return c ? c.childrenCount++ : (c = {
              el: d,
              id: ++this.TargetIndex,
              childrenCount: 1,
              listened: !0
            }, this.mode === ac.event && this._initListen(c.el, !0), this.TargetQueue.push(c)), this.TargetIndex;
          }
        }
      }, {
        key: "_removeListenerTarget",
        value: function value(d) {
          var c = this;
          this.TargetQueue.forEach(function (f, e) {
            f.el === d && (--f.childrenCount || (c._initListen(f.el, !1), c.TargetQueue.splice(e, 1), f = null));
          });
        }
      }, {
        key: "_initListen",
        value: function value(d, c) {
          var f = this;
          this.options.ListenEvents.forEach(function (e) {
            return U[c ? "on" : "off"](d, e, f.lazyLoadHandler);
          });
        }
      }, {
        key: "_initEvent",
        value: function value() {
          var c = this;
          this.Event = {
            listeners: {
              loading: [],
              loaded: [],
              error: []
            }
          }, this.$on = function (d, e) {
            c.Event.listeners[d].push(e);
          }, this.$once = function (e, g) {
            function f() {
              d.$off(e, f), g.apply(d, arguments);
            }

            var d = c;
            c.$on(e, f);
          }, this.$off = function (d, e) {
            if (!e) {
              return void (c.Event.listeners[d] = []);
            }

            at(c.Event.listeners[d], e);
          }, this.$emit = function (d, f, e) {
            c.Event.listeners[d].forEach(function (g) {
              return g(f, e);
            });
          };
        }
      }, {
        key: "_lazyLoadHandler",
        value: function value() {
          var d = this,
              c = !1;
          this.ListenerQueue.forEach(function (f, e) {
            if (!f.state.error && f.state.loaded) {
              return void d.ListenerQueue.splice(e, 1);
            }

            (c = f.checkInView()) && f.load();
          });
        }
      }, {
        key: "_initIntersectionObserver",
        value: function value() {
          var c = this;
          ax && (this._observer = new IntersectionObserver(this._observerHandler.bind(this), this.options.observerOptions), this.ListenerQueue.length && this.ListenerQueue.forEach(function (d) {
            c._observer.observe(d.el);
          }));
        }
      }, {
        key: "_observerHandler",
        value: function value(d, c) {
          var f = this;
          d.forEach(function (g) {
            g.isIntersecting && f.ListenerQueue.forEach(function (e) {
              if (e.el === g.target) {
                if (e.state.loaded) {
                  return f._observer.unobserve(e.el);
                }

                e.load();
              }
            });
          });
        }
      }, {
        key: "_elRenderer",
        value: function value(h, f, k) {
          if (h.el) {
            var g = h.el,
                d = h.bindType,
                j = void 0;

            switch (f) {
              case "loading":
                j = h.loading;
                break;

              case "error":
                j = h.error;
                break;

              default:
                j = h.src;
            }

            if (d ? g.style[d] = 'url("' + j + '")' : g.getAttribute("src") !== j && g.setAttribute("src", j), g.setAttribute("lazy", f), this.$emit(f, h, k), this.options.adapter[f] && this.options.adapter[f](h, this.options), this.options.dispatchEvent) {
              var c = new ay(f, {
                detail: h
              });
              g.dispatchEvent(c);
            }
          }
        }
      }, {
        key: "_valueFormatter",
        value: function value(f) {
          var c = f,
              g = this.options.loading,
              d = this.options.error;
          return aF(f) && (f.src || this.options.silent || console.error("Vue Lazyload warning: miss src with " + f), c = f.src, g = f.loading || this.options.loading, d = f.error || this.options.error), {
            src: c,
            loading: g,
            error: d
          };
        }
      }]), b;
    }();
  },
      af = function af(a) {
    return {
      props: {
        tag: {
          type: String,
          "default": "div"
        }
      },
      render: function render(b) {
        return !1 === this.show ? b(this.tag) : b(this.tag, null, this.$slots["default"]);
      },
      data: function data() {
        return {
          el: null,
          state: {
            loaded: !1
          },
          rect: {},
          show: !1
        };
      },
      mounted: function mounted() {
        this.el = this.$el, a.addLazyBox(this), a.lazyLoadHandler();
      },
      beforeDestroy: function beforeDestroy() {
        a.removeComponent(this);
      },
      methods: {
        getRect: function getRect() {
          this.rect = this.$el.getBoundingClientRect();
        },
        checkInView: function checkInView() {
          return this.getRect(), ag && this.rect.top < window.innerHeight * a.options.preLoad && this.rect.bottom > 0 && this.rect.left < window.innerWidth * a.options.preLoad && this.rect.right > 0;
        },
        load: function load() {
          this.show = !0, this.state.loaded = !0, this.$emit("show", this);
        }
      }
    };
  },
      F = function () {
    function a(b) {
      var c = b.lazy;
      aG(this, a), this.lazy = c, c.lazyContainerMananger = this, this._queue = [];
    }

    return aj(a, [{
      key: "bind",
      value: function value(d, b, f) {
        var c = new X({
          el: d,
          binding: b,
          vnode: f,
          lazy: this.lazy
        });

        this._queue.push(c);
      }
    }, {
      key: "update",
      value: function value(d, b, f) {
        var c = an(this._queue, function (e) {
          return e.el === d;
        });
        c && c.update({
          el: d,
          binding: b,
          vnode: f
        });
      }
    }, {
      key: "unbind",
      value: function value(d, b, f) {
        var c = an(this._queue, function (e) {
          return e.el === d;
        });
        c && (c.clear(), at(this._queue, c));
      }
    }]), a;
  }(),
      Y = {
    selector: "img"
  },
      X = function () {
    function a(c) {
      var f = c.el,
          d = c.binding,
          b = c.vnode,
          e = c.lazy;
      aG(this, a), this.el = null, this.vnode = b, this.binding = d, this.options = {}, this.lazy = e, this._queue = [], this.update({
        el: f,
        binding: d
      });
    }

    return aj(a, [{
      key: "update",
      value: function value(d) {
        var b = this,
            f = d.el,
            c = d.binding;
        this.el = f, this.options = aI({}, Y, c.value), this.getImgs().forEach(function (g) {
          b.lazy.add(g, aI({}, b.binding, {
            value: {
              src: "dataset" in g ? g.dataset.src : g.getAttribute("data-src"),
              error: "dataset" in g ? g.dataset.error : g.getAttribute("data-error"),
              loading: "dataset" in g ? g.dataset.loading : g.getAttribute("data-loading")
            }
          }), b.vnode);
        });
      }
    }, {
      key: "getImgs",
      value: function value() {
        return aC(this.el.querySelectorAll(this.options.selector));
      }
    }, {
      key: "clear",
      value: function value() {
        var b = this;
        this.getImgs().forEach(function (c) {
          return b.lazy.remove(c);
        }), this.vnode = null, this.binding = null, this.lazy = null;
      }
    }]), a;
  }();

  return {
    install: function install(d) {
      var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          g = ad(d),
          c = new g(b),
          a = new F({
        lazy: c
      }),
          f = "2" === d.version.split(".")[0];
      d.prototype.$Lazyload = c, b.lazyComponent && d.component("lazy-component", af(c)), f ? (d.directive("lazy", {
        bind: c.add.bind(c),
        update: c.update.bind(c),
        componentUpdated: c.lazyLoadHandler.bind(c),
        unbind: c.remove.bind(c)
      }), d.directive("lazy-container", {
        bind: a.bind.bind(a),
        update: a.update.bind(a),
        unbind: a.unbind.bind(a)
      })) : (d.directive("lazy", {
        bind: c.lazyLoadHandler.bind(c),
        update: function update(i, h) {
          aI(this.vm.$refs, this.vm.$els), c.add(this.el, {
            modifiers: this.modifiers || {},
            arg: this.arg,
            value: i,
            oldValue: h
          }, {
            context: this.vm
          });
        },
        unbind: function unbind() {
          c.remove(this.el);
        }
      }), d.directive("lazy-container", {
        update: function update(i, h) {
          a.update(this.el, {
            modifiers: this.modifiers || {},
            arg: this.arg,
            value: i,
            oldValue: h
          }, {
            context: this.vm
          });
        },
        unbind: function unbind() {
          a.unbind(this.el);
        }
      }));
    }
  };
});
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 3,
  lazyComponent: true
});
/*图片懒加载用法： 

给模板加上指令：v-lazy="imgObj"

imgObj: {
	src: 'http://xx.com/logo.png', // 懒加载图片地址
	error: 'http://xx.com/error.png', // 懒加载出错图片地址
	loading: 'http://xx.com/loading-spin.svg' // 懒加载loading 图地址
}
*/
/**
 * Alter 警告
 * 用于页面中展示重要的提示信息。
 */
;

(function (global, factory) {
  if (typeof global.Vue !== 'undefined') {
    global.Vue.component('alert-component', function (resolve) {
      return resolve(factory());
    });
  }
})(this, function () {
  return {
    template: '<div class="jz_alert">' + '<i class="jz_alert_hey"></i>' + '<span class="jz_alert_content">' + '<slot></slot>' + '</span>' + '</div>'
  };
});
/*
 *  背景组件定制 @ken 20171017
 *	
 *	原理：父组件传入数据，初始化模块，监听模板行为，把行为和数据向上分发，父组件接收后执行相应的回调
 *
 *	作用：
 *		1、重用了DOM结构
 *		2、规范了背景设置项逻辑
 *
 *	调用方法：
 *		1、根据需要写回调方法
 *		2、绑定了v-model的值，要在回调方法里改变他所绑定的值，例如改变了bgdata.color绑定在v-model，在父组件的回调方法中，要改变bgdata.color这个key对应的value（主要是考虑大保存，要修改对象的数据）
 * 
 *	
 *	数据结构：
*		bgData: {
*			bgData: this.moduleBg,							// 背景数据
*			type: this.moduleBg.y,							// 背景（0：默认 、1：自定义、2：隐藏）
*			enable: true,									// 是否禁用（默认、隐藏、自定义、单选框）	
*			imgPath: this.moduleBg.p,						// 图片路径（动态数据）
*			imgId: this.moduleBg.f,							// 图片的flidId				
*			imgIdCompatible: false 							// 欢迎页的图片背景没有记录imgid,只记录了imgPath，所以这里要做兼容
*			picScale: this.moduleBgPicScale,				// 图片缩放分类（根据图片repeat分类），没有ps数据的可用调用Site.getModuleBgPicScale（moduleBg.r）转换
*			picPos: this.moduleBg.r,						// 图片缩放方式
*			showEffect: false,								// 是否显示图片效果设置项（参考：网站背景）
*			effectType: this.moduleBg.e,					// 图片效果类型（0：默认，1：锁定背景图片）
*			bgRepeatLists: this.bgRepeatLists,				// 图片缩放选项
*			uploadData: this.fileUpload_settings,			// 上传图片按钮setting
*			color: this.moduleBg.c,							// 背景颜色
*			opacity: this.moduleBg.o 						// 背景透明度
*			checkIsFontIcon: checkIsFontIcon				// 判断字体图标的方法
*			viewPath: viewPath								// 项目自定义预览路径
*		}
*	
*	参考：样式-基础-网站背景 
*		 <background-component v-show='bgOpts.type == 2' :data='bgOpts'
*		 	@img-change='bgImgChange'
*		 	@bg-scale-change='bgScaleChange'
*		 	@bg-repeat-change='bgRepeatChange'
*		 	@bg-color-change='bgColorChange'
*		 >
*		 </background-component>
*		
*/
;

(function () {
  var prefixCls = 'jz-background'; // 九方格

  Vue.component('jz-bg-squaregrid', {
    template: '<div class="square-lattice-wrap">' + '<ul class="square-lattice-list">' + '<li :class="{cur: curIndex == index}" v-for="(val, index) in map" @click="squareClick(val, curIndex)" :style="list_style"></li>' + '</ul>' + '</div>',
    props: {
      value: Number,
      map: Array
    },
    computed: {
      list_style: function list_style() {
        return {
          width: 100 / Math.floor(Math.sqrt(this.mun)) + 1 + '%',
          paddingTop: 100 / Math.floor(Math.sqrt(this.mun)) - 1 + '%'
        };
      },
      mun: function mun() {
        return this.map.length;
      },
      curIndex: function curIndex() {
        var index = this.map.indexOf(this.value);
        return index > -1 ? index : 0;
      }
    },
    methods: {
      squareClick: function squareClick(val, oldIndex) {
        this.$emit("input", val);
        this.$emit("on-change", val); // this.$emit("on-undo", val, this.map[oldIndex]);
      }
    },
    watch: {}
  }); // 背景组件

  Vue.component("background-component", {
    name: "Background",
    template: "<div :class='classes.wrapper'>" + "<div>" + "<slot name='title'></slot>" + "<slot name='bgRadioGroup'></slot>" + "</div>" + "<div class='jz-bgContent' >" + "<div class='jz-bgRow jz-bgAutoRow'>" + "<jz-file-upload ref='fileUpload' :data='fileUpload' @on-change='imgChange'></jz-file-upload>" + "</div>" + "<div class='jz-bgRow' v-if='data.imgId'>" + "<label class='jz-bgTitle jz-bgTitle-middle'>图片缩放：</label>" + "<select-graphic-component ref='picScale' size='large' :list='data.bgRepeatLists' @on-change='bgScaleChange' v-model.number='data.picScale'></select-graphic-component>" + "</div>" + "<div class='jz-bgGridWrapper jz-bgRow' v-if='data.imgId' v-show='data.picScale == 1'>" + "<label class='jz-bgTitle jz-bgTitle-middle'>图片位置：</label>" + "<jz-bg-squaregrid ref='bgSquareGrid' v-model='data.repeat' @on-change='bgRepeatChange' :map='[13, 8, 14, 6, 0, 7, 15, 9, 16]'></jz-bg-squaregrid>" + "</div>" + "<div class='jz-bgRow' v-if='data.imgId' v-show='data.picScale == 0'>" + "<label class='jz-bgTitle jz-bgTitle-middle' >平铺效果：</label>" + "<select-graphic-component ref='bgTiling' size='small' :list='tilingLists' @on-change='bgRepeatChange' v-model.number='data.repeat'></select-graphic-component>" + "</div>" + "<div class='jz-bgRow jz-bgColorPicker' v-show='showColorPicker'>" + "<span class='jz-bgTitle jz-bgTitle-middle'>背景色：</span>" + "<colorpicker-component ref='bgColor' :options='data.colorPicker' v-model='data.color' @on-change='bgColorchange' @on-change-stop='bgColorChangeStop'></colorpicker-component>" + "</div>" + "<div class='jz-bgRow' v-if='showeffect'>" + "<span class='jz-bgTitle jz-bgTitle-middle' >效果：</span>" + "<span class='jz-bgEffect'>" + "<radio-group-component ref='bgEffect' v-model='data.effectType' @on-change='effectTypeChange'>" + "<radio-component :label='0'>默认</radio-component>" + "<radio-component :label='1'>锁定背景图片</radio-component>" + "</radio-group-component>" + "</span>" + "</div>" + "<div class='jz-bgRow' v-if='data.opacity >= 0'>" + "<span class='jz-bgTitle jz-bgTitle-middle' >透明度：</span>" + "<input-component ref='opacity' :maxlength='3' v-model='data.opacity' number unit='%' @on-change='bgOpacityChange' @on-blur='bgOpacityBlur'></input-component>" + "</div>" + "</div>" + "</div>",
    props: ["data", "showeffect"],
    data: function data() {
      return {
        classes: {
          wrapper: prefixCls + "-wrapper"
        },
        tilingLists: [{
          value: 3,
          label: '默认',
          type: 'default',
          hidden: false
        }, {
          value: 5,
          label: '缩放平铺',
          type: 'zoom-tile',
          hidden: false
        }, {
          value: 11,
          label: '上',
          type: 'top',
          hidden: false
        }, {
          value: 1,
          label: '中-横向',
          type: 'in-horizontal',
          hidden: false
        }, {
          value: 12,
          label: '下',
          type: 'bottom',
          hidden: false
        }, {
          value: 21,
          label: '左',
          type: 'left',
          hidden: false
        }, {
          value: 2,
          label: '中-纵向',
          type: 'in-vertical',
          hidden: false
        }, {
          value: 22,
          label: '右',
          type: 'right',
          hidden: false
        }],
        //"color", "picScale", "repeat", "effectType", "imgPath", "imgId", "opacity"
        cache: {
          color: this.data.color,
          picScale: this.data.picScale,
          repeat: this.data.repeat,
          effectType: this.data.effectType,
          imgPath: this.data.imgPath,
          imgId: this.data.imgId,
          opacity: this.data.opacity
        }
      };
    },
    computed: {
      showColorPicker: function showColorPicker() {
        return !this.data.imgId || this.data.picScale == 1 || this.data.picScale == 0 && this.data.repeat != 3 && this.data.repeat != 5;
      },
      fileUpload: function fileUpload() {
        return {
          imgIdCompatible: this.data.imgIdCompatible,
          setting: this.data.uploadData,
          imgPath: this.data.imgPath,
          imgId: this.data.imgId,
          title: this.data.title,
          titleclass: this.data.titleclass,
          checkIsFontIcon: this.data.checkIsFontIcon,
          viewPath: this.data.viewPath
        };
      }
    },
    methods: {
      refreshCache: function refreshCache() {
        this.cache = {
          color: this.data.color,
          picScale: this.data.picScale,
          repeat: this.data.repeat,
          effectType: this.data.effectType,
          imgPath: this.data.imgPath,
          imgId: this.data.imgId,
          opacity: this.data.opacity
        };
      },
      effectTypeChange: function effectTypeChange(value) {
        this.effectTypeEmit(value);
        this.$emit("on-undo", this.data, this.cache);
        this.refreshCache();
      },
      effectTypeEmit: function effectTypeEmit(value) {
        this.data.effectType = value;
        this.$emit('bg-effect-change', value);
      },
      bgColorchange: function bgColorchange(value) {
        this.bgColorEmit(value);
      },
      bgColorChangeStop: function bgColorChangeStop(value) {
        this.bgColorEmit(value);
        this.$emit("on-undo", this.data, this.cache);
        this.refreshCache();
      },
      bgColorEmit: function bgColorEmit(value) {
        this.data.color = value;
        this.$emit('bg-color-change', value);
      },
      bgRepeatChange: function bgRepeatChange(value) {
        this.bgRepeatEmit(value);
        this.$emit("on-undo", this.data, this.cache);
        this.refreshCache();
      },
      bgRepeatEmit: function bgRepeatEmit(value) {
        this.data.repeat = value;
        this.$emit('bg-repeat-change', value);
      },
      bgScaleChange: function bgScaleChange(value) {
        // 该判断逻辑以 showColorPicker为基准，没有颜色设置的地方 如 拉伸、填充，把颜色重置为 透明
        if (this.data.picScale != 1 && this.data.picScale != 0) {
          this.bgColorEmit('transparent');
        }

        this.bgScaleEmit(value);
        this.$emit("on-undo", this.data, this.cache);
        this.refreshCache();
      },
      bgScaleEmit: function bgScaleEmit(value) {
        this.data.picScale = value;

        if (value == 2) {
          this.data.repeat = -1;
        } else if (value == 3) {
          this.data.repeat = 4;
        } else if (value == 0 || value == 1) {
          //平铺和非平铺之前repeat切换调整，避免 平铺repeat在非平铺中出现，反之也也是
          if (correctRepeat(this.data)) {
            this.bgRepeatEmit(this.data.repeat);
          }
        }

        this.bgRepeatEmit(this.data.repeat);
        this.$emit('bg-scale-change', value);
      },
      imgChange: function imgChange(value) {
        // 该判断逻辑以 showColorPicker为基准，没有颜色设置的地方 如 拉伸、填充，把颜色重置为 透明
        if (this.data.picScale != 1 && this.data.picScale != 0) {
          this.bgColorEmit('transparent');
        }

        this.imgEmit(value);
        this.$emit("on-undo", this.data, this.cache);
        this.refreshCache();
      },
      imgEmit: function imgEmit(back) {
        this.bgImgChange(back);
      },
      bgImgChange: function bgImgChange(back) {
        this.bgImgEmit(back);
        this.$emit("on-undo", this.data, this.cache);
        this.refreshCache();
      },
      bgImgEmit: function bgImgEmit(back) {
        var resultBack = JSON.parse(back),
            fileData = resultBack.data[0] || {};
        this.data.imgPath = fileData.filePath;
        this.data.imgId = fileData.fileId;

        if (fileData.fileId) {
          this.data.repeat = this.data.repeat == -1 ? 3 : this.data.repeat;
        }

        this.$emit('img-change', back); //平铺和非平铺之前repeat切换调整，避免 平铺repeat在非平铺中出现，反之也也是

        if (correctRepeat(this.data)) {
          this.bgRepeatEmit(this.data.repeat);
        }
      },
      // bgDataChange:function(data){
      // 	this.bgDataEmit(data);
      // 	this.$emit("on-undo", this.data, this.cache);
      // this.refreshCache();
      // },
      bgDataEmit: function bgDataEmit(data) {
        var dataAna = {};
        var back = {
          data: [dataAna]
        };
        this.data.imgPath = data.imgPath;
        this.data.imgId = data.imgId; //this.data.repeat = this.data.repeat == -1? 3: this.data.repeat;

        dataAna.filePath = data.imgPath;
        dataAna.fileId = data.imgId;
        this.$emit('img-change', JSON.stringify(back));
      },
      bgOpacityChange: function bgOpacityChange(value) {
        this.bgOpacityEmit(value);
        this.$emit("on-undo", this.data, this.cache);
        this.refreshCache();
      },
      bgOpacityEmit: function bgOpacityEmit(value) {
        this.data.opacity = value;
        this.$emit('bg-opacity-change', value);
      },
      bgOpacityBlur: function bgOpacityBlur($event) {
        this.$emit('bg-opacity-blur', $event, this.$refs["opacity"]);
      }
    }
  });

  function correctRepeat(data) {
    var before = data.repeat; //平铺 repeat矫正

    data.repeat = data.picScale == 0 && [3, 5, 11, 1, 12, 21, 2, 22].indexOf(data.repeat) < 0 ? 3 : data.repeat; //不平铺 repeat矫正

    data.repeat = data.picScale == 1 && [13, 8, 14, 6, 0, 7, 15, 9, 16].indexOf(data.repeat) < 0 ? 0 : data.repeat;
    return before != data.repeat;
  }
})();
/**
 * Name
 *      Button/按钮组件
 * Temlate
 *      <button-component @click="@Function" :active="@Boolean" :disabled="@Boolean" :icon="@String" :global_oper="@Boolean">按钮</button-component>
 * Attributes
 *      参 数        说 明        类 型     可选值   默认值
 *      icon          图标        string      —         —
 *      active      是否高亮      boolean     —       false
 *     disabled   是否禁用状态    boolean     —       false
 *    globalOper  用于保存、取消  boolean     —       false
 *                等全局操作按钮
 *  Events
 *      click  click事件的handler Function    —         —
 *
 * https://cn.vuejs.org/v2/guide/components.html#什么是组件？
 * Depends: vue.js
 */
;

(function () {
  Vue.component('button-component', {
    name: 'Button',
    template: '<component' + ' :is="href ? \'a\' : \'button\'"' + ' :href="href || null"' + ' :target="href ? (target || null) : null"' + ' class="jz_button"' + ' @click="clickHandler"' + ' :disabled="disabled"' + ' :class="{' + 'jz_button__global_oper: globalOper, ' + 'jz_button__active: active, ' + 'jz_button__link: href' + '}"' + '>' + '<i v-if="icon" class="jz_icon" :class="icon ? \'jz_icon_\' + icon : \'\'"></i>' + '<span class="jz_button_content">' + '<slot></slot>' + '</span>' + '</component>',
    props: {
      icon: String,
      disabled: Boolean,
      active: Boolean,
      globalOper: Boolean,
      href: String,
      target: {
        type: String,
        'default': '_blank'
      }
    },
    methods: {
      clickHandler: function clickHandler(event) {
        this.$emit('click', event);
      }
    }
  });
})();
;

(function () {
  var prefixCls = 'jz-carousel';
  Vue.component('carousel-component', {
    name: 'Carousel',
    template: '<div :class="prefixCls">' + '<button type="button" :class="arrowClasses" class="left" @click="arrowEvent(-1)">' + '</button>' + '<div :class="prefixCls + \'-list\'">' + '<div :class="trackClass" :style="trackStyles" ref="originTrack">' + '<slot></slot>' + '</div>' + '<div v-if="loop" :class="trackCopyClass" :style="copyTrackStyles" ref="copyTrack"></div>' + '</div>' + '<button type="button" :class="arrowClasses" class="right" @click="arrowEvent(1)">' + '</button>' + '<ul :class="dotsClasses">' + '<template v-for="n in slides.length">' + '<li :class="activeClass(n - 1)" @click="dotsEvent(\'click\', n - 1)">' + '<button type="button" :class="radiusDot ? \'radius\' : \'\'"></button>' + '</li>' + '</template>' + '</ul>' + '</div>',
    props: {
      value: {
        'type': Number,
        'default': 0
      },
      arrow: {
        'type': String,
        'default': 'hover',
        'validator': function validator(value) {
          return vue_utils.oneOf(value, ['hover', 'always', 'never']);
        }
      },
      dots: {
        'type': String,
        'default': 'inside',
        'validator': function validator(value) {
          return vue_utils.oneOf(value, ['inside', 'outside', 'none']);
        }
      },
      autoplay: {
        'type': Boolean,
        'default': false
      },
      autoplaySpeed: {
        'type': Number,
        'default': 2000
      },
      loop: {
        'type': Boolean,
        'default': false
      },
      easing: {
        'type': String,
        'default': 'ease'
      },
      radiusDot: {
        'type': Boolean,
        'default': false
      }
    },
    data: function data() {
      return {
        prefixCls: prefixCls,
        listWidth: 0,
        trackWidth: 0,
        trackOffset: 0,
        trackCopyOffset: 0,
        showCopyTrack: false,
        slides: [],
        slideInstances: [],
        timer: null,
        ready: false,
        currentIndex: this.value,
        trackIndex: this.value,
        copyTrackIndex: this.value,
        hideTrackPos: -1 // 默认左滑

      };
    },
    computed: {
      trackClass: function trackClass() {
        return [this.prefixCls + '-track', this.showCopyTrack ? '' : 'higher'];
      },
      trackCopyClass: function trackCopyClass() {
        return [this.prefixCls + '-track', this.showCopyTrack ? 'higher' : ''];
      },
      trackStyles: function trackStyles() {
        return {
          'width': this.trackWidth + 'px',
          'transform': 'translate3d(' + -this.trackOffset + 'px, 0px, 0px)',
          'transition': 'transform 500ms ' + this.easing
        };
      },
      copyTrackStyles: function copyTrackStyles() {
        return {
          'width': this.trackWidth + 'px',
          'transform': 'translate3d(' + -this.trackCopyOffset + 'px, 0px, 0px)',
          'transition': 'transform 500ms ' + this.easing,
          'position': 'absolute',
          'top': 0
        };
      },
      dotsClasses: function dotsClasses() {
        return ['clearFix', this.prefixCls + '-dots', this.prefixCls + '-dots-' + this.dots];
      },
      arrowClasses: function arrowClasses() {
        return [this.prefixCls + '-arrow', this.prefixCls + '-arrow-' + this.arrow];
      }
    },
    methods: {
      arrowEvent: function arrowEvent(offset) {
        this.setAutoplay();
        this.add(offset);
      },
      activeClass: function activeClass(index) {
        return index === this.currentIndex ? this.prefixCls + '-active' : '';
      },
      findChild: function findChild(cb) {
        var find = function find(child) {
          var name = child.$options.componentName;

          if (name) {
            cb(child);
          } else if (child.$children.length) {
            child.$children.forEach(function (innerChild) {
              find(innerChild, cb);
            });
          }
        };

        if (this.slideInstances.length || !this.$children) {
          this.slideInstances.forEach(function (child) {
            find(child);
          });
        } else {
          this.$children.forEach(function (child) {
            find(child);
          });
        }
      },
      slotChange: function slotChange() {
        var _this = this;

        this.$nextTick(function () {
          _this.slides = [];
          _this.slideInstances = [];

          _this.updateSlides(true);

          _this.updatePos();

          _this.updateOffset();
        });
      },
      dotsEvent: function dotsEvent(event, n) {
        var curIndex = this.showCopyTrack ? this.copyTrackIndex : this.trackIndex;

        if (curIndex !== n) {
          this.updateTrackIndex(n);
          this.$emit('input', n);
          this.setAutoplay();
        }
      },
      updateTrackIndex: function updateTrackIndex(index) {
        if (this.showCopyTrack) {
          this.copyTrackIndex = index;
        } else {
          this.trackIndex = index;
        }

        this.currentIndex = index;
      },
      initCopyTrackDom: function initCopyTrackDom() {
        var _this = this;

        this.$nextTick(function () {
          _this.$refs.copyTrack.innerHTML = _this.$refs.originTrack.innerHTML;
        });
      },
      handleResize: function handleResize() {
        this.listWidth = parseInt(vue_utils.getStyle(this.$el, 'width'));
        this.updatePos();
        this.updateOffset();
      },
      updateSlides: function updateSlides(init) {
        var slides = [];
        var index = 1;

        var _this = this;

        this.findChild(function (child) {
          slides.push({
            $el: child.$el
          });
          child.index = index++;

          if (init) {
            _this.slideInstances.push(child);
          }
        });
        this.slides = slides;
        this.updatePos();
      },
      updateOffset: function updateOffset() {
        var _this = this;

        this.$nextTick(function () {
          var ofs = _this.copyTrackIndex > 0 ? -1 : 1;
          _this.trackOffset = _this.trackIndex * _this.listWidth;
          _this.trackCopyOffset = _this.copyTrackIndex * _this.listWidth + ofs;
        });
      },
      updatePos: function updatePos() {
        var _this = this;

        this.findChild(function (child) {
          child.width = _this.listWidth;
          child.height = typeof _this.height === 'number' ? _this.height + 'px' : _this.height;
        });
        this.trackWidth = (this.slides.length || 0) * this.listWidth;
      },
      setAutoplay: function setAutoplay() {
        var _this = this;

        window.clearInterval(this.timer);

        if (this.autoplay) {
          this.timer = window.setInterval(function () {
            _this.add(1);
          }, this.autoplaySpeed);
        }
      },
      updateTrackPos: function updateTrackPos(index) {
        if (this.showCopyTrack) {
          this.trackIndex = index;
        } else {
          this.copyTrackIndex = index;
        }
      },
      add: function add(offset) {
        // 获取单个轨道的图片数
        var slidesLen = this.slides.length; // 如果是无缝滚动，需要初始化双轨道位置

        if (this.loop) {
          if (offset > 0) {
            // 初始化左滑轨道位置
            this.hideTrackPos = -1;
          } else {
            // 初始化右滑轨道位置
            this.hideTrackPos = slidesLen;
          }

          this.updateTrackPos(this.hideTrackPos);
        } // 获取当前展示图片的索引值


        var oldIndex = this.showCopyTrack ? this.copyTrackIndex : this.trackIndex;
        var index = oldIndex + offset;

        while (index < 0) {
          index += slidesLen;
        }

        if ((offset > 0 && index === slidesLen || offset < 0 && index === slidesLen - 1) && this.loop) {
          // 极限值（左滑：当前索引为总图片张数， 右滑：当前索引为总图片张数 - 1）切换轨道
          this.showCopyTrack = !this.showCopyTrack;
          this.trackIndex += offset;
          this.copyTrackIndex += offset;
        } else {
          if (!this.loop) index = index % this.slides.length;
          this.updateTrackIndex(index);
        }

        this.currentIndex = index === this.slides.length ? 0 : index;
        this.$emit('on-change', oldIndex, this.currentIndex);
        this.$emit('input', this.currentIndex);
      }
    },
    mounted: function mounted() {
      this.handleResize();
      this.updateSlides(true);
      this.setAutoplay();
    },
    watch: {
      autoplay: function autoplay() {
        this.setAutoplay();
      },
      autoplaySpeed: function autoplaySpeed() {
        this.setAutoplay();
      },
      trackIndex: function trackIndex() {
        this.updateOffset();
      },
      copyTrackIndex: function copyTrackIndex() {
        this.updateOffset();
      },
      value: function value(val) {
        this.updateTrackIndex(val);
        this.setAutoplay();
      }
    }
  });
  Vue.component('carousel-item-component', {
    name: 'CarouselItem',
    componentName: 'carousel-item',
    template: '<div :class="prefixCls + \'-item\'">' + '<slot></slot>' + '</div>',
    data: function data() {
      return {
        prefixCls: prefixCls,
        width: 0,
        height: 'auto',
        left: 0
      };
    },
    computed: {
      styles: function styles() {
        return {
          'width': this.width + 'px',
          'height': this.height,
          'left': this.left + 'px'
        };
      }
    },
    mounted: function mounted() {
      this.$parent.slotChange();
    },
    watch: {
      width: function width(val) {
        var _this = this;

        if (val && this.$parent.loop) {
          this.$nextTick(function () {
            _this.$parent.initCopyTrackDom();
          });
        }
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.$parent.slotChange();
    }
  });
})();
/*!
 * checkbox-group组件
 */
;

(function () {
  var prefixCls = 'jz-checkbox-group';
  Vue.component('checkbox-group-component', {
    name: 'CheckboxGroup',
    template: '<div :class="classes">' + '<slot></slot>' + '</div>',
    props: {
      value: {
        'type': Array,
        'default': function _default() {
          return [];
        }
      }
    },
    data: function data() {
      return {
        currentValue: this.value,
        childrens: []
      };
    },
    computed: {
      classes: function classes() {
        return prefixCls;
      }
    },
    mounted: function mounted() {
      this.updateModel(true);
    },
    methods: {
      selectAll: function selectAll() {
        var list = [];
        this.childrens = vue_utils.findComponentsDownward(this, 'Checkbox');
        this.childrens.forEach(function (child) {
          list.push(child.label);
        });
        this.currentValue = list;
        this.$emit('input', list);
        this.$emit('on-change', list);
      },
      cancelSelectAll: function cancelSelectAll() {
        this.currentValue = [];
        this.$emit('input', []);
        this.$emit('on-change', []);
      },
      updateModel: function updateModel(update) {
        var value = this.value;
        this.childrens = vue_utils.findComponentsDownward(this, 'Checkbox');

        if (this.childrens) {
          this.childrens.forEach(function (child) {
            child.model = value;

            if (update) {
              child.currentValue = value.indexOf(child.label) >= 0;
              child.group = true;
            }
          });
        }
      },
      change: function change(data) {
        this.currentValue = data;
        this.$emit('input', data);
        this.$emit('on-change', data);
      }
    },
    watch: {
      value: function value() {
        this.updateModel(true);
      }
    }
  });
})();
/*! checkbox组件
 *   
 *  页面插入：
 *
 *	"<checkbox-component style='margin-left: 38px;' :true-value='false' :false-value='true' v-on:on-change='?' v-model='?'>独立设置网站标题</checkbox-component>" 
 * 
 *  原则上checkbox-component 优先显示 slot 内容，如果没有定义 slot，则显示label的值，如果没有设置 label，则显示空。   
 *
 * disabled：Boolean, 是否禁用
 * 
 * 事件：响应父组件事件
 *
 * on-change: 返回value值，可通过设置 true-value 或者 false-value 返回相应的选中和不选中的值
 *
 */
;

(function () {
  var prefixCls = 'jz-checkbox';
  Vue.component('checkbox-component', {
    name: 'Checkbox',
    template: '<label :class="wrapClasses" :title="$slots.default ? $slots.default[0].text : showLabel">' + '<span :class="checkboxClasses">' + '<span :class="innerClasses"></span>' + '<input v-if="group" type="checkbox" :class="inputClasses" :disabled="disabled" :value="label" v-model="model" @change="change">' + '<input v-if="!group" type="checkbox" :class="inputClasses" :disabled="disabled" :checked="currentValue" @change="change">' + '</span>' + '<slot>{{ showLabel }}</slot>' + '</label>',
    props: {
      disabled: Boolean,
      value: [String, Number, Boolean],
      trueValue: {
        'type': [String, Number, Boolean],
        'default': true
      },
      falseValue: {
        'type': [String, Number, Boolean],
        'default': true
      },
      label: [String, Number, Boolean]
    },
    data: function data() {
      return {
        model: [],
        currentValue: this.value,
        group: false,
        showSlot: true,
        parent: vue_utils.findComponentUpward(this, 'CheckboxGroup')
      };
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls + '-wrapper'] = true;
        wrapClasses[prefixCls + '-wrapper-checked'] = !!this.currentValue;
        wrapClasses[prefixCls + '-wrapper-disabled'] = !!this.disabled;
        return wrapClasses;
      },
      checkboxClasses: function checkboxClasses() {
        var checkboxClasses = {};
        checkboxClasses[prefixCls] = true;
        checkboxClasses[prefixCls + '-checked'] = !!this.currentValue;
        checkboxClasses[prefixCls + '-disabled'] = !!this.disabled;
        return checkboxClasses;
      },
      innerClasses: function innerClasses() {
        return prefixCls + '-inner';
      },
      inputClasses: function inputClasses() {
        return prefixCls + '-input';
      },
      showLabel: function showLabel() {
        return this.label ? this.label : '';
      }
    },
    mounted: function mounted() {
      this.parent = vue_utils.findComponentUpward(this, 'CheckboxGroup');
      if (this.parent) this.group = true;

      if (!this.group) {
        this.updateModel();
        this.showSlot = this.$slots['default'] !== undefined;
      } else {
        this.parent.updateModel(true);
      }
    },
    methods: {
      change: function change(event) {
        if (this.disabled) {
          return false;
        }

        var checked = event.target.checked;
        this.currentValue = checked;
        var value = checked ? this.trueValue : this.falseValue,
            OpSideValue = checked ? this.falseValue : this.trueValue;
        this.$emit('input', value);

        if (this.group) {
          this.parent.change(this.model);
        } else {
          this.$emit('on-change', value);
          this.$emit('on-undo', value, OpSideValue);
        }
      },
      updateModel: function updateModel() {
        this.currentValue = this.value === this.trueValue;
      }
    },
    watch: {
      value: function value(val) {
        if (val !== this.trueValue && val !== this.falseValue) {
          throw 'Value should be trueValue or falseValue.';
        }

        this.updateModel();
      }
    }
  });
})();
// 折叠动画组件
(function () {
  var Transition = {
    beforeEnter: function beforeEnter(el) {
      vue_utils.addClass(el, 'collapse-transition');
      if (!el.dataset) el.dataset = {};
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.style.height = '0';
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    },
    enter: function enter(el) {
      el.dataset.oldOverflow = el.style.overflow;

      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + 'px';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      } else {
        el.style.height = '';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      }

      el.style.overflow = 'hidden';
    },
    afterEnter: function afterEnter(el) {
      vue_utils.removeClass(el, 'collapse-transition');
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
    },
    beforeLeave: function beforeLeave(el) {
      if (!el.dataset) el.dataset = {};
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;
      el.style.height = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';
    },
    leave: function leave(el) {
      if (el.scrollHeight !== 0) {
        vue_utils.addClass(el, 'collapse-transition');
        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
      }
    },
    afterLeave: function afterLeave(el) {
      vue_utils.removeClass(el, 'collapse-transition');
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
  };
  Vue.component('collapse-transition-component', {
    name: 'CollapseTransition',
    functional: true,
    render: function render(h, _ref) {
      var children = _ref.children;
      var data = {
        on: Transition
      };
      return h('transition', data, children);
    }
  });
})();
// 折叠组件
// 页面插入：
// <collapse-component v-model="value1">
//     <collapse-item-component name="1">
//         史蒂夫·乔布斯
//         <p slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
//     </collapse-item-component>
// </collapse-component>
// collapse-component 
// props
// 属性       说明                                              类型              默认值
// value    当前激活的面板的 name，可以使用 v-model 双向绑定 Array | String  -
// events
// 事件名      说明                                                  返回值
// on-change    切换面板时触发，返回当前已展开的面板的 key，格式为数组   []
// collapse-item-component 
// props
// 属性   说明                                                              类型      默认值
// name 当前面板的 name，与 collapse-component 的 value 对应，不填为索引值   String  index
(function () {
  var prefixCls = 'jz-collapse';
  Vue.component('collapse-component', {
    name: 'Collapse',
    template: '<div :class="classes">' + '<slot></slot>' + '</div>',
    props: {
      value: {
        type: [Array, String]
      },
      accordion: {
        'type': Boolean,
        'default': false
      }
    },
    data: function data() {
      return {
        currentValue: this.value
      };
    },
    computed: {
      classes: function classes() {
        return prefixCls;
      }
    },
    mounted: function mounted() {
      this.setActive();
    },
    methods: {
      setActive: function setActive() {
        var activeKey = this.getActiveKey();
        this.$children.forEach(function (child, index) {
          var name = child.name || index.toString();
          var isActive = activeKey.indexOf(name) > -1;
          child.isActive = isActive;
          child.index = index;
        });
      },
      getActiveKey: function getActiveKey() {
        var activeKey = this.currentValue || [];
        var accordion = this.accordion;

        if (!Array.isArray(activeKey)) {
          activeKey = [activeKey];
        }

        if (accordion && activeKey.length > 1) {
          activeKey = [activeKey[0]];
        }

        for (var i = 0; i < activeKey.length; i++) {
          activeKey[i] = activeKey[i].toString();
        }

        return activeKey;
      },
      toggle: function toggle(data) {
        var name = data.name.toString();
        var newActiveKey = [];

        if (this.accordion) {
          if (!data.isActive) {
            newActiveKey.push(name);
          }
        } else {
          var activeKey = this.getActiveKey();
          var nameIndex = activeKey.indexOf(name);

          if (data.isActive) {
            if (nameIndex > -1) {
              activeKey.splice(nameIndex, 1);
            }
          } else {
            if (nameIndex < 0) {
              activeKey.push(name);
            }
          }

          newActiveKey = activeKey;
        }

        this.currentValue = newActiveKey;
        this.$emit('input', newActiveKey);
        this.$emit('on-change', newActiveKey);
      }
    },
    watch: {
      value: function value(val) {
        this.currentValue = val;
      },
      currentValue: function currentValue() {
        this.setActive();
      }
    }
  });
  Vue.component('collapse-item-component', {
    name: 'CollapseItem',
    template: '<div :class="itemClasses">' + '<span :class="headerClasses" @click="toggle">' + '<i class="arrow-right"></i>' + '<slot></slot>' + '</span>' + '<collapse-transition-component>' + '<div :class="contentClasses" v-show="isActive">' + '<div :class="boxClasses">' + '<slot name="content"></slot>' + '</div>' + '</div>' + '</collapse-transition-component>' + '</div>',
    props: {
      name: {
        type: String
      }
    },
    data: function data() {
      return {
        index: 0,
        isActive: false
      };
    },
    computed: {
      itemClasses: function itemClasses() {
        var itemClasses = {};
        itemClasses[prefixCls + '-item'] = true;
        itemClasses[prefixCls + '-item-active'] = !!this.isActive;
        return itemClasses;
      },
      headerClasses: function headerClasses() {
        return prefixCls + '-header';
      },
      contentClasses: function contentClasses() {
        return prefixCls + '-content';
      },
      boxClasses: function boxClasses() {
        return prefixCls + '-content-box';
      }
    },
    methods: {
      toggle: function toggle() {
        this.$parent.toggle({
          name: this.name || this.index,
          isActive: this.isActive
        });
      }
    }
  });
})();
/**
 * 拾色条
 * <color-bar-component v-model='style.frontColor' :default-color='style.DATA['MAJOR_COLOR']' :option="{}"></color-bar-component>
 * :color-list="btnColorList" 可选
 */
;

(function () {
  Vue.component('color-bar-component', {
    name: 'ColorBar',
    template: "<div class='jz_color_bar'>\n                <div class='jz_select_color jz_color_default' v-if='!hideDefault' @click='selectColor(defaultColor)' :class='{active:isDefaultColor}'><span>\u9ED8</span></div>\n                <div \n                    class='jz_select_color' \n                    :style='{backgroundColor:color}' \n                    :class='[{active:isCurrentColor(color)&&color!==defaultColor}]' \n                    v-for='color in hexColorList' \n                    @click='selectColor(color)'\n                />\n                <!--<div class='jz_select_color jz_color_multicolor' v-if='!hideMulticolor' :class='{active:multicolorModel}' @click.stop='showColorPicker' ref='multicolor'></div>-->\n                <color-picker-v2-component \n                    v-if=\"!hideMulticolor\"\n                    style=\"width: 20px; height: 20px; vertical-align: baseline; border: none;\"\n                    :options=\"merge({defaultColor: defaultColor}, colorPickerOptions)\" \n                    :value=\"value\" \n                    @on-change=\"handleColorChange\"     \n                />\n            </div>",
    props: {
      'value': String,
      'colorList': {
        'type': Array,
        'default': function _default() {
          return ['rgb(228, 57, 60)', 'rgb(237, 61, 161)', 'rgb(196, 0, 0)', 'rgb(255, 101, 55)', 'rgb(255, 192, 1)', 'rgb(74, 179, 68)', 'rgb(2, 178, 181)', 'rgb(7, 108, 224)', 'rgb(30, 80, 174)', 'rgb(0, 160, 233)', 'rgb(139, 14, 234)', 'rgb(43, 43, 43)'];
        }
      },
      colorPickerOptions: Object,
      'defaultColor': String,
      'hideDefault': Boolean,
      // 示例使用场景：优惠券
      'hideMulticolor': Boolean,
      'option': Object
    },
    computed: {
      //是否是多彩模式
      multicolorModel: function multicolorModel() {
        var color = color2hex(this.value); //默认颜色

        if (color === color2hex(this.defaultColor)) return false; //在列表中存在的颜色

        if (this.hexColorList.indexOf(color) !== -1) return false; //多彩色

        return true;
      },
      hexColorList: function hexColorList() {
        return this.colorList.map(function (color) {
          return color2hex(color);
        });
      },
      isDefaultColor: function isDefaultColor() {
        return this.isCurrentColor(color2hex(this.defaultColor));
      }
    },
    methods: {
      merge: vue_utils.merge,
      handleColorChange: function handleColorChange(color) {
        this.$emit('input', color);
      },
      selectColor: function selectColor(color) {
        this.$emit('input', color);
      },
      isCurrentColor: function isCurrentColor(color) {
        return color2hex(this.value) === color;
      },
      //打开多彩色拾色器
      showColorPicker: function showColorPicker() {
        var self = this;
        $(this.$refs.multicolor).css('background-color', this.value).faiColorPickerAlp($.extend({
          base: $(this.$refs.multicolor),
          target: $(this.$refs.multicolor),
          onchange: function onchange(color) {
            self.$emit('input', color);
          },
          advance: true,
          appendToWeb: false,
          showInTop: true,
          left: 35,
          top: 35
        }, this.option || {}));
      }
    }
  });
  /*颜色转换为16进制*/

  function color2hex(color) {
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; // 如果是rgb颜色表示

    if (/^(rgb|RGB)/.test(color)) {
      var aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
      var strHex = '#';

      for (var i = 0; i < aColor.length; i++) {
        var hex = Number(aColor[i]).toString(16);

        if (hex.length < 2) {
          hex = '0' + hex;
        }

        strHex += hex;
      }

      if (strHex.length !== 7) {
        strHex = color;
      }

      return strHex.toLocaleLowerCase();
    } else if (reg.test(color)) {
      var aNum = color.replace(/#/, '').split('');

      if (aNum.length === 6) {
        return color.toLocaleLowerCase();
      } else if (aNum.length === 3) {
        var numHex = '#';

        for (var i = 0; i < aNum.length; i += 1) {
          numHex += aNum[i] + aNum[i];
        }

        return numHex.toLocaleLowerCase();
      }
    }

    return color.toLocaleLowerCase();
  }
})();
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 *  color-picker-component
 *  @ 2018.12.21
 *  @ author: abbot
 *  eg:
 *      ... your code
 *      methods: {
 *          // 颜色变更时调用
 *          handleChange(color: String) {},
 *          // 颜色面板消失时调用, color为当前颜色,lastColor上次使用的颜色
 *          handleChangeStop(color: String, lastColor: String) {},
 *          // 手动显示颜色面板
 *          manualShow() {
 *              this.$refs.colorPicker.show({})
 *          },
 *          // 手动关闭颜色面板
 *          manualHide() {
 *              this.$refs.colorPicker.hide()
 *          }
 *      }
 *      <color-picker-v2-component
 *          ref="colorPicker"
 *          v-model="yourData"
 *          @on-change="handleChange"
 *          @on-change-stop="handleChangeStop"
 *          :options="{
 *              // 是否开启调色盘入口
 *              advance: true, // boolean
 *              // 是否开启渐变模式
 *              openGradientMode: true, // boolean
 *              // 是否关闭渐变控制条
 *              noAlpha: false, // boolean
 *              // 颜色面板顶部偏移量,用于微调
 *              top: 0, // number
 *              // 左边距偏移量
 *              left: 0, // number
 *              // 默认颜色,传入后会在最近使用颜色开启一个默认颜色按钮
 *              defaultColor: null, // string || object
 *              // 打开面板时的默认颜色,一般不用传入,会自动指向v-model的值
 *              initialColor: null, // string || object
 *              // 颜色面板的相对定位目标,一般不用传入
 *              base: null, // HTMLElement
 *              // 颜色格式
 *              format: 'rgba', // 'hsla' || 'rgba' || 'hex' || 'hsl' || 'rgb'
 *              // 是否显示在顶层窗口,默认情况下如果iframe为跨域,此参数为false,反之为true
 *              showInTop: false, // boolean
 *              // 颜色面板默认显示方向
 *              direction: 'right' // 'left' || 'right'
 *          }"
 *      />
 */
;

(function (Vue) {
  try {
    var emptyFn = function emptyFn() {};

    var isEmpty = function isEmpty(val) {
      return val === null || val === undefined || val === '';
    };

    var rgba2hex = function rgba2hex(r, g, b, a) {
      if (isEmpty(r)) return null;

      if (_typeof(r) === 'object') {
        g = r.g;
        b = r.b;
        r = r.r;
      }

      function componentToHex(val) {
        var hex = val.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }

      return "#".concat(componentToHex(r)).concat(componentToHex(g)).concat(componentToHex(b));
    };

    var rgba2hsla = function rgba2hsla(r, g, b, a) {
      if (isEmpty(r)) return null;

      if (_typeof(r) === 'object') {
        g = r.g;
        b = r.b;
        a = r.a;
        r = r.r;
      }

      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h, s;
      var l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        var diff = max - min;
        s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

        switch (max) {
          case r:
            h = (g - b) / diff + (g < b ? 6 : 0);
            break;

          case g:
            h = (b - r) / diff + 2;
            break;

          case b:
            h = (r - g) / diff + 4;
            break;
        }

        h /= 6;
      }

      return {
        h: h * 360,
        s: s * 100,
        l: l * 100,
        a: isEmpty(a) ? 1 : a
      };
    };

    var rgba2hsva = function rgba2hsva(r, g, b, a) {
      if (isEmpty(r)) return null;

      if (_typeof(r) === 'object') {
        g = r.g;
        b = r.b;
        a = r.a;
        r = r.r;
      }

      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h,
          s,
          v = max;
      var d = max - min;
      s = max === 0 ? 0 : d / max;

      if (max === min) {
        h = 0; // achromatic
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return {
        h: h * 360,
        s: s * 100,
        v: v * 100,
        a: isEmpty(a) ? 1 : a
      };
    };

    var hex2rgba = function hex2rgba(hex) {
      if (isEmpty(hex)) return null;

      if (hex[0] === '#') {
        hex = hex.slice(1);

        while (hex.length < 6) {
          hex += hex;
        }
      }

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1
      } : null;
    };

    var hsla2rgba = function hsla2rgba(h, s, l, a) {
      if (isEmpty(h)) return null;

      if (_typeof(h) === 'object') {
        s = h.s;
        l = h.l;
        a = h.a;
        h = h.h;
      }

      var r, g, b, m, c, x;
      if (!isFinite(h)) h = 0;
      if (!isFinite(s)) s = 0;
      if (!isFinite(l)) l = 0;
      h /= 60;
      if (h < 0) h = 6 - -h % 6;
      h %= 6;
      s = Math.max(0, Math.min(1, s / 100));
      l = Math.max(0, Math.min(1, l / 100));
      c = (1 - Math.abs(2 * l - 1)) * s;
      x = c * (1 - Math.abs(h % 2 - 1));

      if (h < 1) {
        r = c;
        g = x;
        b = 0;
      } else if (h < 2) {
        r = x;
        g = c;
        b = 0;
      } else if (h < 3) {
        r = 0;
        g = c;
        b = x;
      } else if (h < 4) {
        r = 0;
        g = x;
        b = c;
      } else if (h < 5) {
        r = x;
        g = 0;
        b = c;
      } else {
        r = c;
        g = 0;
        b = x;
      }

      m = l - c / 2;
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return {
        r: r,
        g: g,
        b: b,
        a: isEmpty(a) ? 1 : a
      };
    };

    var hsva2rgba = function hsva2rgba(h, s, v, a) {
      if (isEmpty(h)) return null;

      if (_typeof(h) === 'object') {
        s = h.s;
        v = h.v;
        a = h.a;
        h = h.h;
      }

      h /= 360;
      s /= 100;
      v /= 100;
      var r, g, b;
      var i = Math.floor(h * 6);
      var f = h * 6 - i;
      var p = v * (1 - s);
      var q = v * (1 - f * s);
      var t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;

        case 1:
          r = q;
          g = v;
          b = p;
          break;

        case 2:
          r = p;
          g = v;
          b = t;
          break;

        case 3:
          r = p;
          g = q;
          b = v;
          break;

        case 4:
          r = t;
          g = p;
          b = v;
          break;

        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }

      return {
        r: r * 255,
        g: g * 255,
        b: b * 255,
        a: isEmpty(a) ? 1 : a
      };
    };

    var hex2hsla = function hex2hsla(hex) {
      return rgba2hsla(hex2rgba(hex));
    };

    var hsla2hex = function hsla2hex(h, s, l, a) {
      return rgba2hex(hsla2rgba(h, s, l, a));
    };

    var hsla2hsva = function hsla2hsva(h, s, l, a) {
      return rgba2hsva(hsla2rgba(h, s, l, a));
    };

    var hsva2hsla = function hsva2hsla(h, s, v, a) {
      return rgba2hsla(hsva2rgba(h, s, v, a));
    };

    var _isNaN = function _isNaN(val) {
      return Number.isNaN(val);
    };

    var getTag = function getTag(val) {
      return Object.prototype.toString.call(val);
    };

    var baseMerge = function baseMerge(target, filterFn) {
      if (!target) target = {};

      for (var _len = arguments.length, sources = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        sources[_key - 2] = arguments[_key];
      }

      sources.filter(function (v) {
        return v && _typeof(v) === 'object';
      }).forEach(function (source) {
        Object.keys(source).forEach(function (key) {
          var targetTag = getTag(target[key]);
          var sourceTag = getTag(source[key]);

          if (sourceTag === '[object Array]' || sourceTag === '[object Object]') {
            if (targetTag !== sourceTag) target[key] = sourceTag === '[object Array]' ? [] : {};
            baseMerge(target[key], filterFn, source[key]);
          } else if (filterFn(target, source, key)) {
            target[key] = source[key];
          }
        });
      });
      return target;
    };

    var merge = function merge(target) {
      for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        sources[_key2 - 1] = arguments[_key2];
      }

      return baseMerge.apply(void 0, [target, filterFn].concat(sources));
    };

    var deepClone = function deepClone(obj) {
      return merge({}, obj);
    };

    var offset = function offset(el) {
      if (!el.getClientRects().length) {
        return {
          top: 0,
          left: 0
        };
      }

      var rect = el.getBoundingClientRect();
      var win = el.ownerDocument.defaultView;
      var result = {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      };

      if (win !== win.top) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = win.parent.document.querySelectorAll('iframe')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var iframe = _step.value;

            if (iframe.contentWindow === win) {
              var _offset = offset(iframe),
                  top = _offset.top,
                  left = _offset.left;

              result.top += top;
              result.left += left;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return result;
    };

    var getBoundingClientRect = function getBoundingClientRect(el) {
      var bubble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      try {
        var _el$getBoundingClient = el.getBoundingClientRect(),
            top = _el$getBoundingClient.top,
            right = _el$getBoundingClient.right,
            bottom = _el$getBoundingClient.bottom,
            left = _el$getBoundingClient.left;

        var _win = el.ownerDocument.defaultView;
        var result = {
          top: top,
          right: right,
          bottom: bottom,
          left: left
        };

        if (_win !== _win.parent && bubble) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = _win.parent.document.querySelectorAll('iframe')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var iframe = _step2.value;

              if (iframe.contentWindow === _win) {
                var _getBoundingClientRec = getBoundingClientRect(iframe),
                    _top = _getBoundingClientRec.top,
                    _right = _getBoundingClientRec.right,
                    _bottom = _getBoundingClientRec.bottom,
                    _left = _getBoundingClientRec.left;

                result.top += _top;
                result.right += _right;
                result.bottom += _bottom;
                result.left += _left;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        return result;
      } catch (err) {}
    };

    var colorObj2Str = function colorObj2Str(color, format) {
      if (typeof color === 'string') {
        return color;
      } else if (Object.prototype.toString.call(color) === '[object Object]') {
        if (color.colors) {
          var _color = color,
              angle = _color.angle,
              colors = _color.colors;
          return "linear-gradient(".concat(angle, "deg, ").concat(colors.map(function (color) {
            return "".concat(colorObj2Str(color, format), " ").concat(color.end, "%");
          }).join(','), ")");
        }

        if (typeof color.l === 'number') color = hsla2rgba(color);else if (typeof color.v === 'number') color = hsva2rgba(color);

        if (format === 'hex') {
          return rgba2hex(color);
        } else if (format === 'rgb') {
          return "rgb(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ")");
        } else if (format === 'rgba') {
          return "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(color.a, ")");
        } else if (format === 'hsl') {
          color = rgba2hsla(color);
          return "hsl(".concat(color.h, ", ").concat(color.s, "%, ").concat(color.l, "%)");
        } else {
          color = rgba2hsla(color);
          return "hsla(".concat(color.h, ", ").concat(color.s, "%, ").concat(color.l, "%, ").concat(color.a, ")");
        }
      }

      return '';
    };

    var colorStr2Obj = function colorStr2Obj(color) {
      if (typeof color === 'string') {
        color = color.trim();
        if (color === 'transparent') color = 'rgba(255, 255, 255, 0)';

        if (~color.indexOf('linear-gradient')) {
          var position = 0;
          return {
            colors: color.match(/(#[0-9a-fA-F]{1,6})|(hsl|rgb)a?\(.*?\)/g).map(function (colorComponent) {
              position = color.indexOf(colorComponent, position) + colorComponent.length;
              var result = colorStr2Obj(colorComponent);
              result.id = getId();
              var nextPosition = color.indexOf(',', position);
              if (nextPosition === -1) nextPosition = color.length;
              var end = parseFloat(color.substring(position, nextPosition));
              if (!_isNaN(end)) result.end = end;
              return result;
            }),
            angle: parseFloat(color.match(/\d*deg/) ? color.match(/\d*deg/)[0] : 0)
          };
        } else if (~color.indexOf('#')) {
          color = hex2hsla(color);
        } else if (~color.indexOf('hsl')) {
          color = color.split(/[()]/)[1].split(',').map(function (v) {
            return parseFloat(v);
          });
          color = {
            h: color[0],
            s: color[1],
            l: color[2],
            a: color[3] === undefined ? 1 : color[3]
          };
        } else if (~color.indexOf('rgb')) {
          color = color.split(/[()]/)[1].split(',').map(function (v) {
            return parseFloat(v);
          });
          color = rgba2hsla(color[0], color[1], color[2], color[3]);
        }
      }

      return color;
    };

    var getId = function getId() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    var on = function on(el, type, fn) {
      var bubble = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      try {
        var _win2 = el.document ? el : (el.ownerDocument || el).defaultView;

        el.addEventListener(type, fn, options);

        if (_win2 !== _win2.parent && bubble) {
          if (_win2 === el) on(_win2.parent, type, fn, options);else if (el === _win2.document) on(_win2.parent.document, type, fn, options);else if (el === _win2.document.body) on(_win2.parent.document.body, type, fn, options);
        }
      } catch (err) {}
    };

    var off = function off(el, type, fn) {
      var bubble = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      try {
        var _win3 = el.document ? el : (el.ownerDocument || el).defaultView;

        el.removeEventListener(type, fn, options);

        if (_win3 !== _win3.parent && bubble) {
          if (_win3 === el) off(_win3.parent, type, fn, options);else if (el === _win3.document) off(_win3.parent.document, type, fn, options);else if (el === _win3.document.body) off(_win3.parent.document.body, type, fn, options);
        }
      } catch (err) {}
    };

    var firstUpperCase = function firstUpperCase(str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    };

    var required = function required(target, type, msg) {
      if (getTag(target) !== "[object ".concat(firstUpperCase(type), "]")) throw new TypeError(msg);
      return true;
    };

    var optional = function optional(target, type) {
      var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      if (target !== undefined && getTag(target) !== "[object ".concat(firstUpperCase(type), "]")) throw new TypeError(msg);
      return true;
    };

    var win = window;

    var filterFn = function filterFn() {
      return true;
    };

    var XCol = {
      name: 'x-col',
      template: "\n            <div class=\"col\">\n                <slot/>\n            </div>\n        "
    };
    var XRow = {
      name: 'x-row',
      template: "\n                <div class=\"row\">\n                    <slot/>\n                </div>   \n            "
    };

    var Draggable = function () {
      var instances = [];
      var timer;

      function refreshBounds() {
        window.clearTimeout(timer);
        timer = setTimeout(function () {
          return instances.forEach(function (vm) {
            return vm.bounds = vm.getBounds();
          });
        });
      }

      return {
        name: 'draggable',
        props: {
          axis: {
            type: String,
            default: 'x'
          },
          // 0~1
          defaultX: {
            type: Number,
            default: 0
          },
          defaultY: {
            type: Number,
            default: 0
          },
          disableJump: {
            type: Boolean,
            default: false
          },
          // string val: prev(alias: previous, last), next, parent
          topBound: [String, Number],
          rightBound: [String, Number],
          bottomBound: [String, Number],
          leftBound: [String, Number]
        },
        data: function data() {
          return {
            active: false,
            top: 0,
            left: 0,
            lastMouseEvent: {
              x: 0,
              y: 0
            },
            bounds: null
          };
        },
        methods: {
          handleMouseDown: function handleMouseDown(e) {
            var el = this.$el,
                disableJump = this.disableJump,
                axis = this.axis,
                lastMouseEvent = this.lastMouseEvent,
                bounds = this.bounds;
            var topBound = bounds.topBound,
                rightBound = bounds.rightBound,
                bottomBound = bounds.bottomBound,
                leftBound = bounds.leftBound;
            this.active = true;

            if (!disableJump) {
              var _getBoundingClientRec2 = getBoundingClientRect(e.currentTarget),
                  top = _getBoundingClientRec2.top,
                  left = _getBoundingClientRec2.left;

              if (axis === 'x' || axis === 'xy') {
                var nextLeft = e.clientX - left - el.offsetWidth / 2;
                if (nextLeft < leftBound) nextLeft = leftBound;else if (nextLeft > rightBound) nextLeft = rightBound;
                this.left = nextLeft;
              }

              if (axis === 'y' || axis === 'xy') {
                var nextTop = e.clientY - top - el.offsetHeight / 2;
                if (nextTop < topBound) nextTop = topBound;else if (nextTop > bottomBound) nextTop = bottomBound;
                this.top = nextTop;
              }

              this.emit('change');
            }

            lastMouseEvent.x = e.clientX - this.left;
            lastMouseEvent.y = e.clientY - this.top;
            this.emit('dragStart');
            e.stopPropagation();
          },
          handleMouseMove: function handleMouseMove(e) {
            if (!this.active) return;
            var axis = this.axis,
                lastMouseEvent = this.lastMouseEvent,
                bounds = this.bounds;
            var topBound = bounds.topBound,
                rightBound = bounds.rightBound,
                bottomBound = bounds.bottomBound,
                leftBound = bounds.leftBound;
            var nextLeft = e.clientX - lastMouseEvent.x;
            var nextTop = e.clientY - lastMouseEvent.y;

            if ((axis === 'x' || axis === 'xy') && nextLeft >= leftBound && nextLeft <= rightBound) {
              this.left = nextLeft;
            }

            if ((axis === 'y' || axis === 'xy') && nextTop >= topBound && nextTop <= bottomBound) {
              this.top = nextTop;
            }

            this.emit('change');
            this.emit('dragging');
            e.stopPropagation();
          },
          handleMouseUp: function handleMouseUp(e) {
            if (!this.active) return;
            this.active = false;
            refreshBounds();
            this.emit('dragEnd');
            e.stopPropagation();
          },
          getBounds: function getBounds() {
            var el = this.$el,
                _this$topBound = this.topBound,
                topBound = _this$topBound === void 0 ? 0 : _this$topBound,
                _this$rightBound = this.rightBound,
                rightBound = _this$rightBound === void 0 ? el.parentElement.offsetWidth - el.offsetWidth : _this$rightBound,
                _this$bottomBound = this.bottomBound,
                bottomBound = _this$bottomBound === void 0 ? el.parentElement.offsetHeight - el.offsetHeight : _this$bottomBound,
                _this$leftBound = this.leftBound,
                leftBound = _this$leftBound === void 0 ? 0 : _this$leftBound;
            var result = {
              topBound: topBound,
              rightBound: rightBound,
              bottomBound: bottomBound,
              leftBound: leftBound
            };

            function convert(relativeEl, prop, valRelativeParent, valRelativeSibling) {
              if (relativeEl === el.parentElement) result[prop] = valRelativeParent;else result[prop] = valRelativeSibling;
            }

            function getRelativeEl(bound) {
              if (bound === 'prev' || bound === 'previous') return el.previousElementSibling || el.parentElement;else if (bound === 'next') return el.nextElementSibling || el.parentElement;else return el.parentElement;
            }

            var topRelativeEl = getRelativeEl(topBound);
            var rightRelativeEl = getRelativeEl(rightBound);
            var bottomRelativeEl = getRelativeEl(bottomBound);
            var leftRelativeEl = getRelativeEl(leftBound);
            convert(topRelativeEl, 'topBound', 0, topRelativeEl.offsetTop + topRelativeEl.offsetHeight);
            convert(rightRelativeEl, 'rightBound', el.parentElement.offsetWidth - el.offsetWidth, rightRelativeEl.offsetLeft - rightRelativeEl.offsetWidth);
            convert(bottomRelativeEl, 'bottomBound', el.parentElement.offsetHeight - el.offsetHeight, bottomRelativeEl.offsetTop);
            convert(leftRelativeEl, 'leftBound', 0, leftRelativeEl.offsetLeft + leftRelativeEl.offsetWidth);
            return result;
          },
          emit: function emit(type) {
            var el = this.$el;
            var containment = el.parentElement;
            var x = this.left;
            var y = this.top;
            var xPercentDecimal = x / (containment.offsetWidth - el.offsetWidth) || 0;
            var yPercentDecimal = y / (containment.offsetHeight - el.offsetHeight) || 0;
            var args = {
              x: x,
              y: y,
              xPercentDecimal: xPercentDecimal,
              yPercentDecimal: yPercentDecimal,
              xPercent: xPercentDecimal * 100,
              yPercent: yPercentDecimal * 100
            };
            this.$emit(type, args);
          },
          bindEvents: function bindEvents() {
            on(win.document, 'mousemove', this.handleMouseMove);
            on(win.document, 'mouseup', this.handleMouseUp);
            if (!this.disableJump) on(this.parent, 'mousedown', this.handleMouseDown);else on(this.$el, 'mousedown', this.handleMouseDown);
          },
          unbindEvents: function unbindEvents() {
            off(win.document, 'mousemove', this.handleMouseMove);
            off(win.document, 'mouseup', this.handleMouseUp);
            if (!this.disableJump) off(this.parent, 'mousedown', this.handleMouseDown);else off(this.$el, 'mousedown', this.handleMouseDown);
          }
        },
        template: "<div :style=\"{top: top + 'px', left: left + 'px'}\"><slot/></div>",
        mounted: function mounted() {
          var _this = this;

          this.parent = this.$el.parentElement;
          this.$nextTick(function () {
            var el = _this.$el;
            _this.top = (el.parentElement.offsetHeight - el.offsetHeight) * _this.defaultY;
            _this.left = (el.parentElement.offsetWidth - el.offsetWidth) * _this.defaultX;
            refreshBounds();
          });
          instances.push(this);
          this.bindEvents();
        },
        beforeDestroy: function beforeDestroy() {
          instances.splice(instances.indexOf(this), 1);
          this.unbindEvents();
        }
      };
    }();

    var Rotatable = {
      name: 'rotatable',
      props: {
        defaultAngle: {
          type: Number,
          default: 0
        }
      },
      computed: {
        style: function style() {
          return {
            transform: "rotate(".concat(this.angle, "deg)")
          };
        }
      },
      data: function data() {
        return {
          active: false,
          angle: this.defaultAngle,
          // 原点
          origin: {
            x: 0,
            y: 0
          },
          lastMouseEvent: {
            angle: 0,
            x: 0,
            y: 0
          }
        };
      },
      methods: {
        handleMouseDown: function handleMouseDown(e) {
          this.active = true;
          var el = this.$el,
              origin = this.origin,
              lastMouseEvent = this.lastMouseEvent;
          var rect = el.getBoundingClientRect();
          origin.x = rect.left + rect.width / 2;
          origin.y = rect.top + rect.height / 2;
          lastMouseEvent.x = e.clientX;
          lastMouseEvent.y = e.clientY;
          lastMouseEvent.angle = this.angle;
          this.$emit('rotateStart', this.angle);
        },
        handleMouseMove: function handleMouseMove(e) {
          if (!this.active) return;
          var origin = this.origin,
              lastMouseEvent = this.lastMouseEvent;
          var lastX = lastMouseEvent.x,
              lastY = lastMouseEvent.y,
              lastAngle = lastMouseEvent.angle;
          var a = this.getTwoPointAngle(origin, {
            x: lastX,
            y: lastY
          });
          var b = this.getTwoPointAngle(origin, {
            x: e.clientX,
            y: e.clientY
          });
          var diff = -(a - b);
          this.angle = (lastAngle + diff + 360) % 360;
          this.$emit('input', this.angle);
          this.$emit('change', this.angle);
          this.$emit('rotating', this.angle);
        },
        handleMouseUp: function handleMouseUp() {
          if (!this.active) return;
          this.active = false;
          this.$emit('rotateEnd', this.angle);
        },
        bindEvents: function bindEvents() {
          on(win.document, 'mousemove', this.handleMouseMove);
          on(win.document, 'mouseup', this.handleMouseUp);
        },
        unbindEvents: function unbindEvents() {
          off(win.document, 'mousemove', this.handleMouseMove);
          off(win.document, 'mouseup', this.handleMouseUp);
        },
        getTwoPointAngle: function getTwoPointAngle(a, b) {
          var c = {
            x: b.x - a.x,
            y: b.y - a.y
          };
          return Math.atan2(c.y, c.x) / Math.PI * 180;
        }
      },
      template: "<div :style=\"style\" @mousedown=\"handleMouseDown\"><slot/></div>",
      mounted: function mounted() {
        this.bindEvents();
      },
      beforeDestroy: function beforeDestroy() {
        this.unbindEvents();
      }
    };
    var ColorCube = {
      name: 'color-cube',
      props: {
        color: {
          type: [String, Object],
          default: 'rgba(255, 255, 255, 0)'
        },
        hasTransparentBg: {
          type: Boolean,
          default: false
        },
        hoverable: {
          type: Boolean,
          default: false
        }
      },
      methods: {
        colorObj2Str: colorObj2Str,
        colorStr2Obj: colorStr2Obj
      },
      template: "\n                <div :class=\"{color_cube_wrap: true, transparent_bg: hasTransparentBg, hoverable}\">\n                    <div\n                        v-if=\"color\"\n                        class=\"color_cube\" \n                        :class=\"{advance: color === 'advance', transparent: color === 'transparent' || colorStr2Obj(color).a === 0}\"\n                        :style=\"{background: colorObj2Str(color)}\"\n                    />\n                    <slot/>\n                </div>\n            "
    };

    var ProgressColorBar = function () {
      var idPrefix = 'f_color_picker_progress_use_for_style_id';
      var id = 0;

      function getId() {
        return id++;
      }

      return {
        name: 'progress-color-bar',
        components: {
          Draggable: Draggable
        },
        props: {
          hasTransparentBg: {
            type: Boolean,
            default: true
          },
          targetColor: String,
          defaultX: Number
        },
        data: function data() {
          return {
            styleEl: null,
            percent: (this.defaultX || 0) * 100,
            active: false,
            id: "".concat(idPrefix).concat(getId())
          };
        },
        watch: {
          targetColor: {
            handler: function handler(val) {
              val = val.trim();

              if (val.indexOf('linear-gradient') !== -1 && this.styleEl) {
                this.styleEl.innerHTML = "\n                                    #".concat(this.id, " {\n                                        background: -webkit-").concat(val, ";\n                                        background: -moz-").concat(val, ";\n                                        background: -ms-").concat(val, ";\n                                        background: -o-").concat(val, ";\n                                        background: ").concat(val, ";\n                                    }\n                                ");
              }
            },
            immediate: true
          }
        },
        template: "\n                    <div :class=\"{progress_bar: true, transparent_bg: hasTransparentBg}\">\n                        <div class=\"progress_bar_inner\" :id=\"id\">\n                            <draggable \n                                class=\"progress_bar_draggable\"\n                                ref=\"draggable\"\n                                @dragStart=\"($emit('dragStart', $event), active = true)\"\n                                @dragging=\"$emit('dragging', $event)\"\n                                @dragEnd=\"($emit('dragEnd', $event), active = false)\"\n                                @change=\"($emit('change', $event), percent = $event.xPercent)\"\n                                :defaultX=\"defaultX\"\n                            >\n                                <div v-if=\"active\" class=\"progress_bar_tip\">{{percent.toFixed(0)}}%</div>\n                                <div class=\"progress_bar_handle\"/>\n                            </draggable>\n                        </div>\n                    </div>\n                ",
        mounted: function mounted() {
          var val = this.targetColor.trim();
          this.styleEl = document.createElement('style');
          this.styleEl.innerHTML = "\n                        #".concat(this.id, " {\n                            background: -webkit-").concat(val, ";\n                            background: -moz-").concat(val, ";\n                            background: -ms-").concat(val, ";\n                            background: -o-").concat(val, ";\n                            background: ").concat(val, ";\n                        }\n                    ");
          win.document.head.appendChild(this.styleEl);
        },
        beforeDestroy: function beforeDestroy() {
          win.document.head.removeChild(this.styleEl);
        }
      };
    }(); // const ColorStraw = {
    //     name: 'color-straw',
    //     data () {
    //         return {
    //             active: false,
    //             canvas: null,
    //             ctx: null
    //         };
    //     },
    //     methods: {
    //         handleMouseMove (e) {
    //             this.suckColor(e.clientX, e.clientY);
    //         },
    //         handleClick () {
    //             const canvas = this.canvas = document.createElement('canvas');
    //             const ctx = this.ctx = canvas.getContext('2d');
    //             canvas.width = document.documentElement.offsetWidth;
    //             canvas.height = document.documentElement.offsetHeight;
    //             canvas.style.cssText = 'position: absolute; top: 0; left: 0; z-index: 99999;';
    //             document.body.appendChild(canvas);
    //
    //             function test1 () {
    //                 const wrap = this.$refs.canvasWrap;
    //                 const canvas = document.createElement('canvas');
    //                 const ctx = canvas.getContext('2d');
    //                 const body = walkingNode(document.documentElement)[0];
    //                 const width = parseFloat(body.style.width);
    //                 const height = parseFloat(body.style.height);
    //                 const svg = `
    //             <svg xmlns="http://www.w3.org/2000/svg" width="${ width }" height="${ height }">
    //                 <foreignObject x="0" y="0" width="${ width }" height="${ height }">
    //                     ${ new XMLSerializer().serializeToString(body) }
    //                 </foreignObject>
    //             </svg>
    //         `;
    //                 const blob = new Blob([ svg ], { type: 'image/svg+xml' });
    //
    //                 const img = new Image();
    //                 const reader = new FileReader();
    //                 reader.readAsDataURL(blob);
    //                 reader.onload = function () {
    //                     console.log(reader.result);
    //                     img.src = reader.result;
    //                 };
    //                 img.onload = function () {
    //                     // document.body.appendChild(img);
    //                     canvas.width = this.naturalWidth;
    //                     canvas.height = this.naturalHeight;
    //                     ctx.drawImage(img, 0, 0);
    //                 };
    //                 canvas.style.cssText = `position: absolute; top: 0; left: 0; z-index: 99999;`;
    //                 document.body.appendChild(canvas);
    //                 this.canvas = canvas;
    //                 this.ctx = ctx;
    //
    //             }
    //
    //             function testDomToImg () {
    //                 domtoimage.toSvg(document.body).then(dataUrl => {
    //                     const img = new Image();
    //                     img.src = dataUrl;
    //                     img.onload = function () {
    //                         ctx.drawImage(this, 0, 0);
    //                     };
    //                     console.log(dataUrl);
    //                 });
    //             }
    //
    //             testDomToImg();
    //
    //             // html2canvas(window.top.document.body).then(canvas => {
    //             // const clearFn = () => {
    //             //     wrap.style.display = 'none';
    //             //     wrap.removeChild(canvas);
    //             //     canvas.removeEventListener('click', clearFn, false);
    //             //     this.canvas = canvas = null;
    //             //     this.ctx = null;
    //             //     window.top.document.removeEventListener('mousemove', this.handleMouseMove);
    //             // };
    //             //
    //             // this.canvas = canvas;
    //             // this.ctx = canvas.getContext('2d');
    //             // wrap.style.display = 'block';
    //             // wrap.style.zIndex = Number.MAX_SAFE_INTEGER;
    //             // wrap.appendChild(canvas);
    //             // window.top.document.body.appendChild(canvas);
    //             // window.top.document.addEventListener('mousemove', this.handleMouseMove);
    //             // canvas.addEventListener('click', clearFn, false);
    //             // });
    //         },
    //         suckColor (x, y) {
    //             if (!this.ctx) return;
    //             const data = this.ctx.getImageData(x, y, 1, 1).data;
    //             console.log(data);
    //             return {
    //                 r: data[0],
    //                 g: data[1],
    //                 b: data[2],
    //                 a: data[3],
    //                 toString () {
    //                     return `rgba(${ data[0] }, ${ data[1] }, ${ data[2] }, ${ data[3] })`;
    //                 }
    //             };
    //         }
    //     },
    //     template: `
    //     <keep-alive>
    //         <div class="color_straw" @click="handleClick">
    //             <div ref="canvasWrap" style="display: none; position: absolute; top: 0; left: 0;"/>
    //         </div>
    //     </keep-alive>
    // `,
    //     mounted () {
    //         const canvasWrap = this.$refs.canvasWrap;
    //         canvasWrap.style.zIndex = Number.MAX_VALUE;
    //         window.top.document.body.appendChild(canvasWrap);
    //     },
    //     beforeDestroy () {
    //         this.$refs.canvasWrap.parentElement.removeChild(this.$refs.canvasWrap);
    //     }
    // };


    var storage = {
      setItem: function setItem(key, value) {
        if (_typeof(value) === 'object') value = JSON.stringify(value);
        localStorage.setItem(key, value);
      },
      getItem: function getItem(key) {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (e) {
          return localStorage.getItem(key);
        }
      },
      removeItem: function removeItem(key) {
        localStorage.removeItem(key);
      },
      clear: function clear() {
        localStorage.clear();
      },
      keys: {
        recentUse: 'colorPicker.recentUseV2'
      }
    }; // 颜色面板本体

    var vm = new Vue({
      name: 'color-picker',
      components: {
        XRow: XRow,
        XCol: XCol,
        ColorCube: ColorCube,
        ProgressColorBar: ProgressColorBar,
        Draggable: Draggable,
        Rotatable: Rotatable
      },
      data: function data() {
        var result = {
          // 纯颜色
          pure: {
            h: 140,
            s: 50,
            l: 50,
            a: 1
          },
          // 渐变颜色
          gradient: {
            // todos: 渐变终止支持两个数值,现在只支持一个
            colors: [{
              id: getId(),
              h: 0,
              s: 0,
              l: 0,
              a: 1,
              end: 0
            }, {
              id: getId(),
              h: 0,
              s: 0,
              l: 0,
              a: 1,
              end: 100
            }],
            angle: 0
          },
          // 面板显示及隐藏这期间颜色是否有改变过
          // 只有改变过隐藏后面板后才会将当前颜色加入最近使用中
          hasChanged: false,
          // 记录上一次点击的颜色,用于撤回使用
          lastColor: null,
          // 颜色指针,永远指向当前编辑的颜色
          color: null,
          // hide || pure || gradient || custom
          // pure 纯色模式, gradient 渐变模式, custom 进阶颜色模式, hide 隐藏面板
          mode: 'hide',
          // 记录上一次的模式,用于在custom模式下返回使用
          lastMode: 'hide',
          recentUse: [],
          // 最大最近使用颜色个数
          maxRecentUseLength: 5,
          // 配置,选项功能见顶部注释
          options: {
            advance: true,
            openGradientMode: true,
            noAlpha: false,
            top: 0,
            left: 0,
            defaultColor: null,
            initialColor: null,
            base: null,
            format: 'rgba',
            showInTop: false,
            direction: 'right'
          },
          // 默认颜色列表
          colorTable: [['#FCC02E', '#F67C01', '#E64A19', '#D81B43', '#8E24AA', '#512DA7', '#1F87E8', '#008781', '#05A045'], ['#FED835', '#FB8C00', '#F5511E', '#EB1D4E', '#9C28B1', '#5D35B0', '#2097F3', '#029688', '#4CB050'], ['#FFEB3C', '#FFA727', '#FE5722', '#EB4165', '#AA47BC', '#673BB7', '#42A5F6', '#26A59A', '#83C683'], ['#FFF176', '#FFB74E', '#FF8A66', '#F1627E', '#B968C7', '#7986CC', '#64B5F6', '#80CBC4', '#A5D6A7'], ['#FFF59C', '#FFCC80', '#FFAB91', '#FB879E', '#CF93D9', '#9EA8DB', '#90CAF8', '#B2DFDC', '#C8E6CA'], ['transparent', '#FFFFFF', '#DEDEDE', '#A9A9A9', '#4B4B4B', '#353535', '#212121', '#000000']],
          // 存储最近颜色时使用的key
          recentUseKey: ''
        };
        result.color = result.lastColor = result.pure;
        return result;
      },
      watch: {
        recentUseKey: function recentUseKey(val) {
          this.recentUse = storage.getItem(val) ? storage.getItem(val).filter(function (v) {
            return Object.prototype.toString.call(v) === '[object Object]';
          }) : [];
        },
        color: {
          handler: function handler(val) {
            var format = this.options.format;

            if (typeof val.end === 'number') {
              var color = colorObj2Str(this.gradient, format);
              this.$emit('on-change', color);
              this.$emit('input', color);
            } else {
              var _color2 = colorObj2Str(this.pure, format);

              this.$emit('on-change', _color2);
              this.$emit('input', _color2);
            }

            this.hasChanged = true;
          },
          deep: true
        },
        lastColor: function lastColor() {
          this.$emit('on-change-stop', colorObj2Str(this.color), colorObj2Str(this.lastColor));
          this.$emit('on-undo', colorObj2Str(this.color), colorObj2Str(this.lastColor));
        },
        'gradient.angle': function gradientAngle() {
          var color = this.colorObj2Str(this.gradient, this.options.format);
          this.$emit('on-change', color);
          this.$emit('input', color);
          this.hasChanged = true;
        },
        mode: function mode(val, oldVal) {
          this.lastMode = oldVal; // 如果为渐变模式且当前颜色指针未指向渐变点中的任意一点

          if (val === 'gradient' && typeof this.color.end !== 'number') {
            this.color = this.gradient.colors[0];
          } else if (val === 'pure') {
            this.color = this.pure;
          }

          setTimeout(this.syncDraggablePosition.bind(this));
        },
        options: function options(_options) {
          if (_options.initialColor) {
            var color = colorStr2Obj(_options.initialColor); // 如果禁止渐变模式但传入的初始值为渐变值,则重置颜色为渐变第一个值

            if (_options.openGradientMode === false && color.colors) color = color.colors[0]; // 如果关闭透明度通道则透明度全部重置为1

            if (_options.noAlpha) {
              if (color.colors) color.colors.forEach(function (color) {
                return color.a = 1;
              });else color.a = 1;
            }

            this.mode = color.colors ? 'gradient' : 'pure';
            this.changeColor(color);
          }

          function refreshColorTable(colorRow, val, pos, open) {
            var index = colorRow.indexOf(val);

            if (open && index === -1) {
              colorRow.splice(pos, 0, val);
            } else if (!open && index !== -1) {
              colorRow.splice(index, 1);
            }
          }

          refreshColorTable(this.colorTable[5], 'advance', this.colorTable[5].length, _options.advance);
          refreshColorTable(this.colorTable[5], 'transparent', 0, !_options.noAlpha);
          this.recentUseKey = 'colorPicker.recentUse[pure]'; // 不同模式使用不同的key,防止出现关闭渐变模式后,最近使用颜色中含有渐变颜色的情况

          if (_options.noAlpha) {
            this.recentUseKey += '[noAlpha]';
            this.color.a = 1;
          }

          if (_options.openGradientMode) {
            this.recentUseKey += '[gradient]';
          }

          if (_options.advance) {
            this.recentUseKey += '[advance]';
          }
        }
      },
      methods: {
        hex2hsla: hex2hsla,
        hsla2hex: hsla2hex,
        // 参数校验
        validShowOptions: function validShowOptions(_ref) {
          var defaultColor = _ref.defaultColor,
              initialColor = _ref.initialColor,
              advance = _ref.advance,
              openGradientMode = _ref.openGradientMode,
              noAlpha = _ref.noAlpha,
              top = _ref.top,
              left = _ref.left,
              base = _ref.base,
              format = _ref.format,
              direction = _ref.direction,
              showInTop = _ref.showInTop;
          required(initialColor, 'string', "initialColor\u5FC5\u987B\u4F20\u5165\u4E14\u7C7B\u578B\u4E3Astring");
          if (initialColor === '') throw new TypeError('initialColor不能为空');
          if (!(base instanceof HTMLElement)) throw new TypeError('base类型必须为HTML元素');
          optional(defaultColor, 'string', "defaultColor\u7C7B\u578B\u5FC5\u987B\u4E3Astring");
          optional(advance, 'boolean', 'advance类型必须为boolean');
          optional(openGradientMode, 'boolean', 'openGradientMode类型必须为boolean');
          optional(noAlpha, 'boolean', 'noAlpha类型必须为boolean');
          optional(top, 'number', 'top类型必须为number');
          optional(left, 'number', 'left类型必须为number');

          if (format && format !== 'rgba' && format !== 'hex' && format !== 'hsla' && format !== 'rgb' && format !== 'hsl') {
            throw new TypeError("format\u7C7B\u578B\u5FC5\u987B\u4E3A['rgba', 'hex', 'hsla', 'rgb', 'hsl']");
          }

          if (direction && direction !== 'left' && direction !== 'right') {
            throw new TypeError("direction\u7C7B\u578B\u5FC5\u987B\u4E3A['left', 'right']");
          }

          optional(showInTop, 'boolean', 'showInTop类型必须为boolean');
        },
        show: function show(options) {
          var _this2 = this;

          this.validShowOptions(options);

          if (options.showInTop === undefined) {
            // 根据是否为跨域决定是否挂载到顶层window
            try {
              window.top.Number(2);
              options.showInTop = true;
            } catch (err) {
              options.showInTop = false;
            }
          }

          options = merge({
            advance: true,
            openGradientMode: true,
            noAlpha: false,
            top: 0,
            left: 0,
            defaultColor: null,
            initialColor: null,
            base: null,
            format: 'rgba',
            direction: 'right'
          }, options);
          win = options.showInTop ? window.top : window;
          this.options = options;
          on(document.body, 'mousedown', this.hide, true); // 显示时color会改变为initialColor,导致hasChanged为true
          // 所以需要setTimeout将其重置回来

          win.setTimeout(function () {
            _this2.hasChanged = false;
          });
          this.$nextTick(function () {
            if (_this2.$el.ownerDocument.defaultView !== win) win.document.body.appendChild(_this2.$el);
            _this2.hasChanged = false;

            _this2.setPosition();
          });
          this.$emit('show');
        },
        hide: function hide(e) {
          var _this3 = this;

          if (e && e.path.some(function (el) {
            return el === _this3.$el;
          })) return;
          off(document.body, 'mousedown', this.hide, true);

          try {
            this.maskEl.parentElement.removeChild(this.maskEl);
          } catch (err) {}

          if (this.hasChanged) this.saveRecentUse();
          this.mode = 'hide';
          this.$emit('hide');
        },
        handleMouseDown: function handleMouseDown() {
          // maskEl用于增强draggable和rotatable控件的体验
          // 能防止拖拽时因鼠标移动到body外无法拖拽的情况
          try {
            this.maskEl.parentElement.removeChild(this.maskEl);
          } catch (err) {}

          this.maskEl = win.document.createElement('div');
          this.maskEl.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color:transparent; z-index: 9999999;';
          win.document.body.appendChild(this.maskEl);
          on(win.document, 'mouseup', this.handleMouseUp);
          on(win.document, 'mouseleave', this.handleMouseUp);
        },
        handleMouseUp: function handleMouseUp() {
          this.maskEl.parentElement.removeChild(this.maskEl);
          off(win.document, 'mouseup', this.handleMouseUp);
          off(win.document, 'mouseleave', this.handleMouseUp);
        },
        changeColor: function changeColor(color) {
          if (isEmpty(color)) return;
          if (typeof color === 'string') color = colorStr2Obj(color);

          if (typeof color.end === 'number' || color.colors) {
            this.mode = 'gradient';
            var index = this.gradient.colors.indexOf(this.color);
            if (index === -1) index = 0;
            this.lastColor = deepClone(this.gradient);
            if (typeof color.end === 'number') merge(this.gradient.colors[index], color);else merge(this.gradient, color);
            this.color = this.gradient.colors[index];
          } else {
            this.lastColor = deepClone(this.pure);
            merge(this.color, color);
          }

          this.syncDraggablePosition();
        },
        saveRecentUse: function saveRecentUse() {
          var target = null;
          target = this.color.end !== undefined ? this.gradient : this.color;
          this.recentUse.unshift(deepClone(target));
          this.recentUse.length = this.maxRecentUseLength;
          storage.setItem(this.recentUseKey, this.recentUse);
        },
        getPaletteStyle: function getPaletteStyle() {
          var h = this.color.h;
          return {
            backgroundColor: "hsl(".concat(h, ", 100%, 50%)")
          };
        },
        getAlphaBarColor: function getAlphaBarColor() {
          return "linear-gradient(to right, ".concat(colorObj2Str(merge({}, this.color, {
            a: 0
          })), ", ").concat(colorObj2Str(merge({}, this.color, {
            a: 1
          })), ")");
        },
        getLightnessBarColor: function getLightnessBarColor(target) {
          target = merge({}, target, {
            a: 1
          });
          return "\n                        linear-gradient(\n                            left,\n                            ".concat(colorObj2Str(merge(target, {
            l: 100
          })), ",\n                            ").concat(colorObj2Str(merge(target, {
            l: 80
          })), ",\n                            ").concat(colorObj2Str(merge(target, {
            l: 60
          })), ",\n                            ").concat(colorObj2Str(merge(target, {
            l: 40
          })), ",\n                            ").concat(colorObj2Str(merge(target, {
            l: 20
          })), ",\n                            ").concat(colorObj2Str(merge(target, {
            l: 0
          })), "\n                        )\n                    ");
        },
        // 处理hex输入
        handleInputHex: function handleInputHex(e) {
          var val = e.target.value;

          if (val.length === 6) {
            var hsl = hex2hsla(val);
            if (hsl) this.changeColor(hsl);
          }
        },
        // 添加渐变指针 (暂未实装)
        addGradientPointer: function addGradientPointer() {
          var colors = this.gradient.colors;
          var mid = Math.floor(colors.length / 2);
          var willAdd = {
            id: getId(),
            h: 0,
            s: 0,
            l: 0,
            a: 1,
            end: (colors[mid - 1].end + colors[mid].end) / 2
          };
          this.color = willAdd;
          colors.splice(mid, 0, willAdd);
        },
        pickerColor: function pickerColor(_ref2) {
          var xPercent = _ref2.xPercent,
              yPercent = _ref2.yPercent;
          var result = hsva2hsla(this.color.h / 360, xPercent, 100 - yPercent);
          result.h = this.color.h;
          merge(this.color, result);
        },
        // 切换颜色时需要调用此函数同步拖拽条的x,y值
        syncDraggablePosition: function syncDraggablePosition() {
          var _this4 = this;

          var _this$$refs = this.$refs,
              alphaBar = _this$$refs.alphaBar,
              lightnessBar = _this$$refs.lightnessBar,
              customAlphaBar = _this$$refs.customAlphaBar,
              hueBar = _this$$refs.hueBar,
              angleControl = _this$$refs.angleControl,
              palette = _this$$refs.palette,
              gradientPointer = _this$$refs.gradientPointer;
          var _this$color = this.color,
              h = _this$color.h,
              s = _this$color.s,
              l = _this$color.l,
              a = _this$color.a;
          var hsv = hsla2hsva(this.color);
          h /= 360;
          s /= 100;
          l /= 100;

          function sync(target, topVal, leftVal) {
            if (!target) return;
            if (typeof topVal === 'number') target.top = (target.$el.parentElement.offsetHeight - target.$el.offsetHeight) * topVal;
            if (typeof leftVal === 'number') target.left = (target.$el.parentElement.offsetWidth - target.$el.offsetWidth) * leftVal;
          }

          sync(alphaBar && alphaBar.$refs.draggable, null, a);
          sync(customAlphaBar && customAlphaBar.$refs.draggable, null, a);
          sync(lightnessBar && lightnessBar.$refs.draggable, null, 1 - l);
          sync(hueBar && hueBar.$refs.draggable, null, h);
          sync(palette, 1 - hsv.v, hsv.s);
          if (angleControl) angleControl.angle = this.gradient.angle;
          if (gradientPointer) gradientPointer.forEach(function (pointer, i) {
            return sync(pointer, null, _this4.gradient.colors[i].end / 100);
          });
        },
        getPointerStyle: function getPointerStyle(color) {
          return {
            transform: "translateX(".concat(color.end - 50, "%)")
          };
        },
        setPosition: function setPosition() {
          var el = this.$el;
          if (!(el instanceof HTMLElement)) return;
          var _this$options = this.options,
              base = _this$options.base,
              direction = _this$options.direction,
              showInTop = _this$options.showInTop;

          try {
            var baseBound = getBoundingClientRect(base, showInTop);
            var top, left;
            top = baseBound.top + this.options.top - el.clientHeight / 2;
            left = direction === 'right' ? baseBound.left + this.options.left + base.offsetWidth : baseBound.left + this.options.left - el.offsetWidth;
            el.style.cssText = "\n                                    top: ".concat(top, "px;\n                                    left: ").concat(left, "px;\n                                    z-index: ").concat(Number.MAX_SAFE_INTEGER, ";\n                                ");
            var rootBound = getBoundingClientRect(el);
            if (rootBound.top < 0) el.style.top = '0px';else if (rootBound.bottom > win.innerHeight) el.style.top = win.innerHeight - el.offsetHeight + 'px';
            if (rootBound.right > win.innerWidth) el.style.left = baseBound.left - this.options.left - el.offsetWidth + 'px';else if (rootBound.left < 0) el.style.left = baseBound.left + this.options.left + base.offsetWidth + 'px';
          } catch (err) {
            el.style.top = el.style.left = '0px';
            el.style.zIndex = Number.MAX_SAFE_INTEGER + '';
          }
        },
        colorStr2Obj: colorStr2Obj,
        colorObj2Str: colorObj2Str,
        merge: merge,
        deepClone: deepClone
      },
      template: "\n                <div \n                    class=\"f_color_picker entity\" \n                    v-if=\"mode !== 'hide'\" \n                    @mousedown.capture=\"handleMouseDown\"\n                >\n                    <div class=\"panel_wrap\" ref=\"panel\">\n                        <div class=\"default_panel\" v-if=\"mode !== 'custom'\">                \n                           <x-row class=\"header\" v-if=\"options.openGradientMode\">\n                                <span class=\"small_text\">\u586B\u5145: </span>\n                                <select-component v-model=\"mode\" style=\"width: 178px;\">\n                                    <select-item-component value=\"pure\">\u7EAF\u8272</select-item-component>\n                                    <select-item-component value=\"gradient\">\u6E10\u53D8</select-item-component>\n                                </select-component>\n                            </x-row> \n                            \n                            <x-row class=\"gradient_control\" v-if=\"mode === 'gradient'\">\n                                <div class=\"gradient_control_bar_wrap transparent_bg\">\n                                    <div class=\"gradient_control_bar\" :style=\"{background: colorObj2Str(merge({}, gradient, {angle: 90}))}\"/>\n                                    <x-row class=\"gradient_pointers\">\n                                         <draggable\n                                            v-for=\"(_color, i) in gradient.colors\"\n                                            ref=\"gradientPointer\"\n                                            :key=\"_color.id\"\n                                            :class=\"{gradient_control_bar_pointer: true, active: color === _color}\"\n                                            :style=\"getPointerStyle(_color)\"\n                                            :defaultX=\"_color.end / 100\"\n                                            leftBound=\"prev\"\n                                            rightBound=\"next\"\n                                            disableJump\n                                            @dragStart=\"lastColor = deepClone(gradient)\"\n                                            @change=\"_color.end = $event.xPercent\"\n                                            @mousedown.native=\"(color = _color, syncDraggablePosition())\"\n                                            @dblclick.native=\"mode = 'custom'\"\n                                        >\n                                            <color-cube class=\"gradient_control_bar_pointer_color\" hasTransparentBg :color=\"_color\"/>\n                                        </draggable>\n                                    </x-row>\n                                </div>\n                                \n                                <rotatable \n                                    class=\"gradient_control_direction\"\n                                    @rotateStart=\"lastColor = deepClone(gradient)\"\n                                    @change=\"gradient.angle = +$event.toFixed(0)\"\n                                    ref=\"angleControl\"\n                                /> \n                                <div class=\"gradient_control_angle\">\n                                    <input \n                                        class=\"gradient_control_direction_text input\"\n                                        @input=\"(gradient.angle = +$event.target.value, syncDraggablePosition())\"\n                                        :value=\"~~gradient.angle\"  \n                                        maxlength=\"3\" \n                                        type=\"text\"\n                                        @focus=\"$nextTick($event.target.select.bind($event.target))\"\n                                    />\n                                    <span class=\"small_text angle_unit\">\xB0</span>\n                                </div>\n                                \n                                <color-cube \n                                    class=\"gradient_control_preview\" \n                                    hasTransparentBg \n                                    :color=\"gradient\"\n                                />\n                            </x-row>  \n                            \n                            <div class=\"color_table\">\n                                <x-row \n                                    v-for=\"(colors, i) in colorTable\" \n                                    :key=\"i\"\n                                >\n                                    <color-cube \n                                        v-for=\"(color, index) in colors\"\n                                        :key=\"index\" \n                                        :color=\"color\"\n                                        hoverable\n                                        @click.native=\"color === 'advance' ? mode = 'custom' : changeColor(color)\"\n                                    /> \n                                </x-row>\n                            </div>    \n                            \n                            <progress-color-bar \n                                class=\"lightness_control_bar\"\n                                ref=\"lightnessBar\"\n                                :targetColor=\"getLightnessBarColor(color)\"\n                                @dragStart=\"lastColor = typeof color.end === 'number' ? deepClone(gradient) : deepClone(pure)\"\n                                @change=\"color.l = 100 - $event.xPercent\"\n                            />\n                            <progress-color-bar  \n                                v-if=\"!options.noAlpha\"\n                                class=\"opacity_control_bar\"\n                                ref=\"alphaBar\"\n                                :targetColor=\"getAlphaBarColor()\"\n                                @dragStart=\"lastColor = typeof color.end === 'number' ? deepClone(gradient) : deepClone(pure)\"\n                                @change=\"color.a = $event.xPercentDecimal\"\n                            />\n                        \n                            <x-row style=\"margin-bottom: 20px;\">\n                                <color-cube :color=\"color\" hasTransparentBg class=\"current_color\"/>   \n                                <span class=\"small_text\"># </span>\n                                <input \n                                    type=\"text\" \n                                    class=\"input small_text underline\" \n                                    maxlength=\"6\"\n                                    :value=\"hsla2hex(color).slice(1)\"\n                                    @input=\"handleInputHex\"\n                                    @focus=\"$nextTick($event.target.select.bind($event.target))\"\n                                />\n                                <!--<color-straw/>-->\n                            </x-row>\n                            \n                            <div class=\"recent_use\">\n                                <div class=\"recent_use_text\">\u6700\u8FD1\u4F7F\u7528</div>\n                                <x-row>\n                                    <color-cube \n                                        v-if=\"options.defaultColor\"\n                                        color=\"white\" \n                                        hoverable\n                                        @click.native=\"mode = 'pure', $nextTick(function() { changeColor(options.defaultColor); })\"\n                                    >\n                                        <div class=\"default_color\">\u9ED8</div>\n                                    </color-cube>\n                                    <color-cube \n                                        v-for=\"(color, i) in recentUse\"\n                                        v-if=\"color\" \n                                        :key=\"i\" \n                                        :color=\"color\"\n                                        hasTransparentBg\n                                        hoverable\n                                        @click.native=\"(mode = typeof color.angle === 'number' ? 'gradient' : 'pure', $nextTick(function() { changeColor(color); }))\"\n                                    />\n                                </x-row>   \n                            </div>\n                        </div>\n                        \n                        <!--\u81EA\u5B9A\u4E49\u989C\u8272\u9762\u677F-->\n                        <div class=\"custom_color_panel\" v-else>\n                            <div class=\"header\">\n                                <div class=\"back\" @click=\"mode = lastMode\"/>\n                            </div>\n                            \n                            <div class=\"palette\" :style=\"{backgroundColor: 'hsl(' + color.h + ', 100%, 50%)'}\">\n                                <draggable \n                                    class=\"palette_pointer\"\n                                    ref=\"palette\" \n                                    axis=\"xy\"\n                                    @dragStart=\"lastColor = typeof color.end === 'number' ? deepClone(gradient) : deepClone(pure)\" \n                                    @change=\"pickerColor\"\n                                />\n                            </div>\n                                                   \n                            <progress-color-bar \n                                class=\"hue\" \n                                ref=\"hueBar\"\n                                targetColor=\"linear-gradient(left, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%,#00F 66.66%, #F0F 83.33%, #F00 100%)\"\n                                @dragStart=\"lastColor = typeof color.end === 'number' ? deepClone(gradient) : deepClone(pure)\"\n                                @change=\"color.h = $event.xPercentDecimal * 360\"\n                            />\n                            <progress-color-bar  \n                                v-if=\"!options.noAlpha\"\n                                ref=\"customAlphaBar\"\n                                :targetColor=\"getAlphaBarColor()\"\n                                @dragStart=\"lastColor = typeof color.end === 'number' ? deepClone(gradient) : deepClone(pure)\"\n                                @change=\"color.a = $event.xPercentDecimal\"\n                            />\n                            \n                            <x-row class=\"current_color_wrap\">\n                                <color-cube \n                                    class=\"current_color\"\n                                    hasTransparentBg \n                                    :color=\"color\" \n                                />\n                                <span class=\"small_text\"># </span>\n                                <input \n                                    type=\"text\" \n                                    class=\"input small_text underline\" \n                                    maxlength=\"6\"\n                                    :value=\"hsla2hex(color).slice(1)\"\n                                    @input=\"handleInputHex\"\n                                    @focus=\"$nextTick($event.target.select.bind($event.target))\"\n                                />\n                            </x-row>\n                        </div>\n                    </div>\n                </div>\n            ",
      beforeDestroy: function beforeDestroy() {
        off(document.body, 'mousedown', this.hide);
      }
    });
    Vue.component('color-picker-v2-component', {
      name: 'color-picker-v2-component',
      props: {
        value: [Object, String],
        options: {
          type: Object,
          default: function _default() {
            return {};
          }
        }
      },
      components: {
        ColorCube: ColorCube
      },
      data: function data() {
        return {
          color: this.value
        };
      },
      methods: {
        show: function show() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options;
          vm.$on('on-change', this.handleChange);
          vm.$on('input', this.handleInput);
          vm.show(merge({
            base: this.$el,
            initialColor: this.value && colorObj2Str(this.value)
          }, options));
        },
        hide: function hide() {
          vm.$off('on-change', this.handleChange);
          vm.$off('input', this.handleInput);
        },
        handleChange: function handleChange() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          this.$emit.apply(this, ['on-change'].concat(args));
        },
        handleInput: function handleInput() {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          this.color = args[0];
          this.$emit.apply(this, ['input'].concat(args));
        }
      },
      template: "\n                <div \n                    class=\"f_color_picker entry_pointer\" \n                    @click=\"show()\"\n                >\n                    <color-cube \n                        class=\"show_btn\"\n                        :color=\"color\"\n                        :hasTransparentBg=\"false\"\n                    />\n                </div>\n            ",
      mounted: function mounted() {
        vm.$on('hide', this.hide); // 只有这个组件被需要时才挂载上去

        if (!vm._isMounted) {
          var containerEl = document.createElement('div');
          document.body.appendChild(containerEl);
          vm.$mount(containerEl);
        }
      }
    });
  } catch (err) {}
})(Vue);
/*
 *  颜色组件定制 @coyife 201711130
 *	边框颜色，字体颜色等
 *  "<jz-colorpicker  ref='borderColor'  v-model='footerBorder.c'></jz-colorpicker>" + 
 *	@options: jQ 颜色控件的参数
 *  @ref 非必要 （undo撤销操作中必要）
 *  实例中需要在watch接口中监听 数据变化 
 *  watch:{
 *        "footerBorder.c":function(){
 *				//数据变化响应操作
 *		   }
 *	}
 *  或
 *  @on-change = XXX
 *  methods:{
 * 		XXX:funciton(){}
 * 	}
 *  
 *	需要undo功能 
 *     ref 必须
 *     撤销指令  v-undo:c.colorPicker='footerBorder' 或 v-undo:c.colorPicker
 *		 @v-undo  指令
 *		 @ :c  数据的key  footerBorder.c 或 Vm.c
 *		 @ .colorPicker  v-undo指令操作类型
 *		 @ ='footerBorder'  数据对象，如果数据对象是挂靠在Vue实例上的data， 可以不写，
 */
;

(function () {
  // 色板
  Vue.component('colorpicker-component', {
    name: 'Colorpicker',
    template: '<div :class="wrapClasses" @click.stop="handleClick" :style="{backgroundColor: value}">' + '<div :class="btnClasses" :style="{backgroundColor: value}"></div>' + '</div>',
    props: {
      value: String,
      prefixCls: String,
      options: Object
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var classes = {};
        classes[this.prefix + "-wrapper"] = true;
        return classes;
      },
      btnClasses: function btnClasses() {
        var classes = {};
        classes[this.prefix] = true;
        return classes;
      },
      prefix: function prefix() {
        return this.prefixCls || "jz-colorpicker";
      }
    },
    methods: {
      handleClick: function handleClick() {
        var self = this,
            propOptions = this.options || {},
            originalColor = self.value,
            options = {
          base: $(self.$el),
          inputHexStatus: onChange,
          onchange: onChange,
          defaultcolor: self.value,
          //以下设置项以funPanel为默认参数
          advance: typeof propOptions.advance == 'undefined' ? true : propOptions.advance,
          showInTop: propOptions.showInTop || false,
          appendToWeb: typeof propOptions.appendToWeb == 'undefined' ? true : propOptions.appendToWeb,
          changeStop: changeStop,
          left: propOptions.left || 0,
          top: propOptions.top || 0,
          noAlpha: propOptions.noAlpha || false,
          inFaiTop: propOptions.inFaiTop || false //生成面板

        };
        $(this.$el).faiColorPickerAlp(options); //为撤销服务，在面板消失且数据有变化的时候执行

        function changeStop(color) {
          self.$emit("on-change-stop", color, originalColor);
          self.$emit("on-undo", color, originalColor);
          originalColor = color;
        } // onchange接口 直接触发上层数据变化


        function onChange(color) {
          self.$emit("input", color);
          self.$emit("on-change", color, $(self.$el));
        }
      }
    }
  });
})();

;

(function () {
  Vue.component('dialog-component', {
    name: 'Dialog',
    template: '<transition name="jz-dialog-fade" v-if="open">' + '<popup-component>' + '<div class="jz_dialog">'
    /* ~~~~~~~~~~~~~~~ 主要部分 ~~~~~~~~~~~~~~~~~~~~ */
    + '<div class="jz_dialog_main">'
    /* ~~~~~~~~~~~~~~~ 图标层 ~~~~~~~~~~~~~~~~~~~~ */
    + '<div class="jz_dialog_icon" v-if="icon">' + '<i v-if="icon == \'warning\'" class="jz_icon_warning"></i>' + '<div v-else-if="icon == \'success\'" class="jz_icon_success">' + '<div class="jz_icon_success_placeholder"></div>' + '<i class="jz_icon_success_bingo"></i>' + '</div>' + '</div>'
    /* ~~~~~~~~~~~~~~~ 内容层 ~~~~~~~~~~~~~~~~~~~~ */
    + '<div class="jz_dialog_content">' + '<slot name="content">' + '<div v-html="content"></div>' + '</slot>' + '</div>'
    /* ~~~~~~~~~~~~~~~ 描述层 ~~~~~~~~~~~~~~~~~~~~ */
    + '<div class="jz_dialog_description" v-if="$slots.description || description">' + '<slot name="description">' + '<div v-html="description"></div>' + '</slot>' + '</div>'
    /* ~~~~~~~~~~~~~~~ 按钮层 ~~~~~~~~~~~~~~~~~~~~ */
    + '<div class="jz_dialog_buttons" v-if="confirmButton || cancelButton">' + '<button-component' + ' v-if="confirmButton"' + ' class="jz_dialog_button"' + ' global-oper' + ' :active="confirmButton.active || true"' + ' :disabled="confirmButton.disabled || false"' + ' :href="confirmButton.href || null"' + ' @click.stop="clickConfirmHandler"' + '>' + '{{confirmButton.text}}' + '</button-component>' + '<button-component' + ' v-if="cancelButton"' + ' class="jz_dialog_button"' + ' global-oper' + ' :active="cancelButton.active || false"' + ' :disabled="cancelButton.disabled || false"' + ' :href="cancelButton.href || null"' + ' @click.stop="clickCancelHandler"' + '>' + '{{cancelButton.text}}' + '</button-component>' + '</div>' + '</div>'
    /* ~~~~~~~~~~~~~~~ 底部 ~~~~~~~~~~~~~~~~~~~~ */
    + '<div class="jz_dialog_footer" v-if="$slots.footer">' + '<slot name="footer"></slot>' + '</div>'
    /* ~~~~~~~~~~~~~~~ 关闭按钮 ~~~~~~~~~~~~~~~~~~~~ */
    + '<i v-if="showClose" class="jz_dialog_close jz_icon_close" @click.stop="clickCloseHandler"></i>' + '</div>' + '</popup-component>' + '</transition>',
    data: function data() {
      return {
        open: this.value
      };
    },
    props: {
      content: {
        type: String,
        'default': ''
      },
      description: {
        type: String,
        'default': ''
      },
      icon: {
        type: String,
        validator: function validator(val) {
          return ['warning', 'success'].indexOf(val) > -1;
        }
      },
      confirmButton: Object,
      cancelButton: Object,
      value: Boolean,
      showClose: {
        type: Boolean,
        'default': true
      }
    },
    watch: {
      open: function open(newVal) {
        this.$emit('input', newVal);

        if (newVal === false) {
          this.$emit('destroy');
          this.$destroy();
          this.$el && this.$el.parentNode.removeChild(this.$el);
        }
      }
    },
    mounted: function mounted() {
      vue_utils.on(document, 'keydown', this.keydownEnterHandler);
      vue_utils.on(document, 'keydown', this.keydownEscHandler);
    },
    beforeDestroy: function beforeDestroy() {
      vue_utils.off(document, 'keydown', this.keydownEnterHandler);
      vue_utils.off(document, 'keydown', this.keydownEscHandler);
    },
    methods: {
      keydownEnterHandler: function keydownEnterHandler(e) {
        if (e.keyCode == 13) {
          this.confirm();
        }
      },
      keydownEscHandler: function keydownEscHandler(e) {
        if (e.keyCode == 27) {
          this.close();
        }
      },
      clickConfirmHandler: function clickConfirmHandler() {
        this.confirm();
      },
      clickCancelHandler: function clickCancelHandler() {
        this.cancel();
      },
      clickCloseHandler: function clickCloseHandler() {
        this.close();
      },
      confirm: function confirm() {
        this.hide();
        this.$emit('confirm');
      },
      cancel: function cancel() {
        this.hide();
        this.$emit('cancel');
      },
      close: function close() {
        this.hide();
        this.$emit('close');
      },
      hide: function hide() {
        this.open = false;
      },
      show: function show() {
        this.open = true;
      }
    }
  });

  Vue.prototype.$createDialog = function (config, renderFn) {
    var _data = {};

    if (config.data) {
      _data = config.data;
    }

    var _methods = {};

    if (config.onConfirm) {
      _methods.confirmHandler = config.onConfirm;
    }

    if (config.onCancel) {
      _methods.cancelHandler = config.onCancel;
    }

    if (config.onClose) {
      _methods.closeHandler = config.onClose;
    }

    _methods.destroyHandler = function () {
      this.$destroy();
    };

    var instance = new Vue({
      el: document.createElement('div'),
      data: _data,
      methods: _methods,
      render: function render(createElement) {
        var _on = {};

        if (this.confirmHandler) {
          _on.confirm = this.confirmHandler;
        }

        if (this.cancelHandler) {
          _on.cancel = this.cancelHandler;
        }

        if (this.closeHandler) {
          _on.close = this.closeHandler;
        }

        if (this.destroyHandler) {
          _on.destroy = this.destroyHandler;
        }

        var _props = {};

        if (vue_utils.isDef(config.content)) {
          _props.content = config.content;
        }

        if (vue_utils.isDef(config.description)) {
          _props.description = config.description;
        }

        if (vue_utils.isDef(config.icon)) {
          _props.icon = config.icon;
        }

        if (vue_utils.isDef(config.confirmButton)) {
          _props.confirmButton = config.confirmButton;
        }

        if (vue_utils.isDef(config.cancelButton)) {
          _props.cancelButton = config.cancelButton;
        }

        if (vue_utils.isDef(config.value)) {
          _props.cancelButton = config.value;
        }

        if (vue_utils.isDef(config.showClose)) {
          _props.showClose = config.showClose;
        }

        var _slot = [];

        if (renderFn) {
          _slot = renderFn.call(this, createElement);
        }

        return createElement('dialog-component', {
          on: _on,
          props: _props,
          ref: 'dialog'
        }, Array.isArray(_slot) ? _slot : [_slot]);
      }
    });
    top.document.body.appendChild(instance.$el);
    instance.$refs.dialog.show();
    return instance.$refs.dialog;
  };
})();
;

(function () {
  Vue.component('dropdown-menu-component', {
    name: 'DropdownMenu',
    template: '<ul class="jz-dropdown-menu">' + '<slot></slot>' + '</ul>'
  });
  Vue.component('dropdown-menu-item-component', {
    name: 'DropdownMenuItem',
    template: '<li class="jz-dropdown-menu-item" v-if="!subMenu" @click="clickHandler">' + '<slot></slot>' + '</li>' + '<dropdown-component v-else trigger="hover" placement="right-start" :menu-style="menuStyle">' + '<dropdown-menu-item-component>' + '<slot></slot>' + '<div class="second-select-icon"></div>' + '</dropdown-menu-item-component>' + '<template slot="menu">' + '<slot name="menu"></slot>' + '</template>' + '</dropdown-component>',
    props: {
      subMenu: Boolean,
      menuStyle: [Object, String]
    },
    methods: {
      clickHandler: function clickHandler(e) {
        if (this._events["click"]) {
          this.$emit('click', e);
          vue_utils.findComponentsUpward(this, "Dropdown").forEach(function (dropdown) {
            dropdown.$emit("hide");
          });
        }
      }
    }
  });
  Vue.component('dropdown-menu-divider-component', {
    name: 'DropdownMenuItem',
    template: '<li class="jz-dropdown-menu-divider"></li>'
  });
})();
;

(function () {
  var prefixCls = 'jz-dropdown';
  Vue.component('dropdown-component', {
    name: 'Dropdown',
    template: '<div :class="wrapClasses" v-clickoutside="handleClose" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">' + '<div :class="relClasses" ref="reference" @click="handleClick">' + '<slot :is-active="currentVisible"></slot>' + '</div>' + '<transition :name="transition">' + '<select-dropdown-component :style="menuStyle" :secondselect="secondselect" v-show="currentVisible" :placement="placement" ref="drop" @mouseenter.native="handleMouseenter" @mouseleave.native="handleMouseleave">' + '<slot name="menu"></slot>' + '</select-dropdown-component>' + '</transition>' + '</div>',
    props: {
      trigger: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['click', 'hover', 'custom']);
        }
      },
      placement: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
        }
      },
      visible: Boolean,
      secondselect: Boolean,
      menuStyle: String
    },
    data: function data() {
      return {
        prefixCls: prefixCls,
        currentVisible: this.visible
      };
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls] = true;
        return wrapClasses;
      },
      relClasses: function relClasses() {
        var relClasses = {};
        relClasses[prefixCls + "-rel"] = true;
        relClasses[prefixCls + "-rel-active"] = this.currentVisible;
        return relClasses;
      },
      transition: function transition() {
        return 'fade';
      }
    },
    watch: {
      visible: function visible(val) {
        this.currentVisible = val;
      },
      currentVisible: function currentVisible(val) {
        if (val) {
          this.$refs.drop.update();
        } else {
          this.$refs.drop.destroy();
        }

        this.$emit('on-visible-change', val);
      }
    },
    methods: {
      handleClick: function handleClick() {
        if (this.trigger === 'custom') return false;

        if (this.trigger !== 'click') {
          return false;
        }

        this.currentVisible = !this.currentVisible;
      },
      handleMouseenter: function handleMouseenter() {
        var _this = this;

        if (this.trigger === 'custom') return false;

        if (this.trigger !== 'hover') {
          return false;
        }

        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          _this.currentVisible = true;
        }, 250);
      },
      handleMouseleave: function handleMouseleave() {
        var _this = this;

        if (this.trigger === 'custom') return false;

        if (this.trigger !== 'hover') {
          return false;
        }

        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(function () {
            _this.currentVisible = false;
          }, 150);
        }
      },
      handleClose: function handleClose() {
        if (this.trigger === 'custom') return false;

        if (this.trigger !== 'click') {
          return false;
        }

        this.currentVisible = false;
      },
      hasParent: function hasParent() {
        var $parent = vue_utils.findComponentUpward(this, 'Dropdown');

        if ($parent) {
          return $parent;
        } else {
          return false;
        }
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.$on('hide', function () {
        _this.currentVisible = false;
      });
      this.$on('on-click', function (key) {
        var $parent = _this.hasParent();

        if ($parent) $parent.$emit('on-click', key);
      });
      this.$on('on-hover-click', function () {
        var $parent = this.hasParent();

        if ($parent) {
          _this.$nextTick(function () {
            if (_this.trigger === 'custom') return false;
            _this.currentVisible = false;
          });

          $parent.$emit('on-hover-click');
        } else {
          this.$nextTick(function () {
            if (_this.trigger === 'custom') return false;
            _this.currentVisible = false;
          });
        }
      });
      this.$on('on-haschild-click', function () {
        _this.$nextTick(function () {
          if (_this.trigger === 'custom') return false;
          _this.currentVisible = true;
        });

        var $parent = _this.hasParent();

        if ($parent) $parent.$emit('on-haschild-click');
      });
    }
  });
})();
/*  上传文件组件 @ken 20171211
*   用法：<jz-imgupload :data='uploadData'></jz-imgupload>"
*	数据结构：
*		uploadData: {
*			title: String,		 	// 图片标题
*			fileEditTitle: String  	// 修改文件文本
*			fileAddTitle: String  	// 修改文件文本
*			titleclass: String,		// 标题样式
*			setting: Object,		// 上传文件配置setting(文件格式，文件限制大小，入口等)
*			imgPath: String,		// 图片路径
*			imgId: String,			// 图片id
*			imgIdCompatible: Boolean // 欢迎页的图片背景没有记录imgid,只记录了imgPath，所以这里要做兼容,
			checkIsFontIcon: Function // 判断是否是字体图标的方法
			viewPath				// 项目自定义预览路径
*		}
*	方法：
*		file-change: 图片数据发生变化
*		file-remove：删除图片
*/
;

(function () {
  // 上传和展示图片
  Vue.component("jz-file-upload", {
    props: {
      data: Object
    },
    data: function data() {
      return {
        hoverImgPreviewer: false
      };
    },
    computed: {
      isFontIcon: function isFontIcon() {
        return this.checkIsFontIcon(this.data.imgId, this.data.checkIsFontIcon);
      },
      fontClass: function fontClass() {
        return this.data.fontClass || "";
      },
      fontColor: function fontColor() {
        return this.data.fontColor || "rgb(102, 102, 102)";
      },
      imgId: function imgId() {
        return this.data.imgId || "";
      },
      imgPath: function imgPath() {
        return this.data.imgPath || "";
      },
      compatible: function compatible() {
        return this.data && this.data.imgIdCompatible && typeof this.imgPath == "string" && this.imgPath != "";
      },
      showPreview: function showPreview() {
        return this.isFontIcon ? this.fontClass.length > 0 : !!this.imgId || this.compatible;
      },
      fileEditTitle: function fileEditTitle() {
        return typeof this.data.fileEditTitle == "string" ? this.data.fileEditTitle : "修改图片";
      },
      fileAddTitle: function fileAddTitle() {
        return typeof this.data.fileAddTitle == "string" ? this.data.fileAddTitle : "添加图片";
      }
    },
    template: "<div class='jz-fileUpload'>" + "<div class='addFileLine'>" + "<span class='f-fileTitle' :class='data.titleclass'>{{data.title||'图片'}}：</span>" + "<button-component :disabled='data.disabled' class='f-uploadBtn' @click='fileBtnClick'>{{showPreview ? fileEditTitle : fileAddTitle}}</button-component>" + "</div>" + "<div class='imgPreviewerLine' v-if='showPreview'>" + "<span class='f-fileTitle' :class='data.titleclass'></span>" + "<div class='imgPreviewer' v-show='isFontIcon'>" + "<div class='f-previewImg' :class='[fontClass]' :style='{ color: fontColor}' ></div>" + "</div>" + "<div v-show='!isFontIcon' class='imgPreviewer' :class='{imgPreviewerHover: hoverImgPreviewer}' @mouseenter='hoverImgPreviewer = true;' @mouseleave='hoverImgPreviewer = false;'>" + "<img :src='!isFontIcon ? imgPath : \"\"' @load='imgOnload($event)'/>" + "<div class='imgPreviewerMaskLayer' v-if='hoverImgPreviewer'>" + "<div class='imgViewIcon' @click='viewFile'></div>" + "<div class='imgRemoveIcon' @click='removeFile'></div>" + "</div>" + "</div>" + "</div>" + "</div>",
    methods: {
      viewFile: function viewFile() {
        // 字体图标上传没有点击放大展示和删除图片的功能
        if (this.isFontIcon) {
          return;
        }

        var viewPath = "../view.jsp?fileID=" + this.imgId; // 项目自定义预览路径

        if (this.data.viewPath) {
          viewPath = this.data.viewPath;
        }

        window.open(this.compatible ? this.imgPath : viewPath);
      },
      removeFile: function removeFile() {
        var self = this,
            undoData = {
          filePath: self.data.imgPath || "",
          fileId: self.data.imgId || "",
          classname: self.data.classname || "",
          color: self.data.color || ""
        },
            redoData = {
          filePath: "",
          fileId: "",
          classname: "",
          color: ""
        }; // 删除文件

        var reset = {};

        if (this.isFontIcon) {
          self.fontClass = "";
          self.fontColor = "";
          reset.fontClass = "";
          reset.fontColor = "";
        } else {
          reset.filePath = "";
          reset.fileId = "";
        }

        this.$emit('on-change', JSON.stringify({
          data: [reset]
        }));
        this.$emit("on-remove", JSON.stringify({
          data: [reset]
        }));
        self.$emit("on-undo", {
          data: [redoData]
        }, {
          data: [undoData]
        });
      },
      fileBtnClick: function fileBtnClick() {
        // 点击上传文件按钮
        var self = this;

        if (window.Root) {
          Root.fileUpload2(false, this.data.setting, callbackBgUpload);
        } else if (window.MallApp) {
          MallApp.fileUpload(false, this.data.setting, callbackBgUpload);
        } else if (window.Site) {
          Site.fileUpload2(false, this.data.setting, callbackBgUpload);
        } else if (window.Mobi) {
          Mobi.fileUpload2(false, this.data.setting, callbackBgUpload);
        } else if (window.WXApp) {
          WXApp.fileUpload(false, this.data.setting, callbackBgUpload);
        } // 上传文件弹窗回调


        function callbackBgUpload(back) {
          if (!back) {
            return;
          }

          var resultBack = $.parseJSON(back),
              fileData = resultBack.data[0] || {},
              undoData = {
            filePath: self.data.imgPath || "",
            fileId: self.data.imgId || "",
            classname: self.data.fontClass || "",
            color: self.data.fontColor || ""
          },
              redoData = {
            filePath: fileData.filePath || "",
            fileId: fileData.fileId || "",
            classname: fileData.classname || "",
            color: fileData.color || ""
          };
          self.fileChangeCallBack(back);
          self.$emit("on-undo", {
            data: [redoData]
          }, {
            data: [undoData]
          });
        }
      },
      //这个函数提出来，是为了在undo中也能使用，若修改需要考虑undo
      fileChangeCallBack: function fileChangeCallBack(back) {
        var self = this;

        if (!back) {
          return;
        }

        if (back) {
          self.$emit('on-change', back);
          var resultBack = $.parseJSON(back);
          var fileData = resultBack.data[0] || {};
          this.data.imgPath = fileData.filePath;
          this.data.imgId = fileData.fileId;
        }
      },
      imgOnload: function imgOnload(event) {
        var imgPreviewerWidth = this.data.imgPreviewerWidth || 120,
            imgPreviewerHeight = this.data.imgPreviewerHeight || 70; // 加载图片后调用

        vue_utils.optimize(event.currentTarget, {
          width: imgPreviewerWidth,
          height: imgPreviewerHeight,
          mode: vue_utils.Img.MODE_SCALE_DEFLATE_FILL,
          display: 3
        });
      },
      checkIsFontIcon: function checkIsFontIcon(iconId, _checkIsFontIcon) {
        // 判断是否是字体图标
        if (!!_checkIsFontIcon && typeof _checkIsFontIcon == "function") {
          return _checkIsFontIcon.apply(this, [iconId]);
        } else {
          if (!iconId || iconId.length == 0 || iconId.length < "FontIcon_".length) {
            return false;
          }

          return iconId.substring(0, "NewFontIcon_".length) == "NewFontIcon_" || iconId.substring(0, "FontIcon_".length) == "FontIcon_";
        }

        return false;
      }
    }
  });
})();
/*
 * 组件【画廊】，用于出现左右箭头滑动内容的场景。
 */
;

(function () {
  var DEFAULT_INDEX = 0;
  var DEFAULT_WIDTH = 600;
  var DEFAULT_BUTTON_POS = 32;
  var ICON_SIZE = 'default';
  Vue.component('gallery-component', {
    name: 'Gallery',
    props: vue_utils.initDefaultProps({
      wrapWidth: Number,
      viewWidth: Number,
      prevLeft: Number,
      nextRight: Number,
      iconSize: String,
      defaultIndex: Number
    }, {
      wrapWidth: DEFAULT_WIDTH,
      viewWidth: DEFAULT_WIDTH,
      prevLeft: DEFAULT_BUTTON_POS,
      nextRight: DEFAULT_BUTTON_POS,
      iconSize: ICON_SIZE,
      defaultIndex: DEFAULT_INDEX
    }),
    data: function data() {
      return {
        index: this.defaultIndex
      };
    },
    template: '<div class="jz-gallery" :data-index="proxyIndex" :data-max-index="maxIndex">' + '<div class="gallery-wrap" :style="wrapStyles">' + '<div class="gallery-view" :style="viewStyles">' + '<slot></slot>' + '</div>' + '</div>' + '<div class="gallery-button is-prev" :class="prevButtonClasses" :style="prevStyles" v-if="maxIndex > 0" @click="slideToPrev"></div>' + '<div class="gallery-button is-next" :class="nextButtonClasses" :style="nextStyles" v-if="maxIndex > 0" @click="slideToNext"></div>' + '</div>',
    computed: {
      prevStyles: function prevStyles() {
        return {
          'left': '-' + this.prevLeft + 'px'
        };
      },
      nextStyles: function nextStyles() {
        return {
          'right': '-' + this.nextRight + 'px'
        };
      },
      wrapStyles: function wrapStyles() {
        return {
          'width': this.wrapWidth + 'px'
        };
      },
      viewStyles: function viewStyles() {
        var marginLeft = this.proxyIndex * this.wrapWidth,
            maxMarginLeft = this.viewWidth - this.wrapWidth;

        var _marginLeft = marginLeft > maxMarginLeft ? maxMarginLeft : marginLeft;

        return {
          'width': this.viewWidth + 'px',
          'margin-left': '-' + _marginLeft + 'px'
        };
      },
      maxIndex: function maxIndex() {
        return Math.ceil(this.viewWidth / this.wrapWidth) - 1;
      },
      minIndex: function minIndex() {
        return 0;
      },
      // 计算属性代理index, 实现有范围的自动取值
      proxyIndex: {
        get: function get() {
          return this.index;
        },
        set: function set(index) {
          var maxIndex = this.maxIndex,
              minIndex = this.minIndex;
          this.index = index > maxIndex ? maxIndex : index < minIndex ? minIndex : index;
        }
      },
      prevButtonClasses: function prevButtonClasses() {
        var classes = {};
        classes["gallery-button-" + this.iconSize] = true;
        classes["is-disabled"] = this.proxyIndex == this.minIndex;
        return classes;
      },
      nextButtonClasses: function nextButtonClasses() {
        var classes = {};
        classes["gallery-button-" + this.iconSize] = true;
        classes["is-disabled"] = this.proxyIndex == this.maxIndex;
        return classes;
      }
    },
    created: function created() {
      this.$on('slide-to-first', this.slideToFirst);
      this.$on('slide-to-prev', this.slideToPrev);
      this.$on('slide-to-next', this.slideToNext);
      this.$on('slide-to-last', this.slideToLast);
    },
    methods: {
      slideToPrev: function slideToPrev() {
        this.proxyIndex--;
      },
      slideToNext: function slideToNext() {
        this.proxyIndex++;
      },
      slideToLast: function slideToLast() {
        this.proxyIndex = this.maxIndex;
      },
      slideToFirst: function slideToFirst() {
        this.proxyIndex = this.minIndex;
      }
    }
  });
})();
/*
 *	InputNumber组件 用于输入number类型的值
 */
;

(function (global, factory) {
  if (typeof global.Vue !== 'undefined') {
    global.Vue.component('input-number-component', function (resolve) {
      resolve(factory());
    });
  }
})(this, function () {
  return {
    name: 'InputNumber',
    template: '<div class="jz-input-number">' + '<input ' + 'class="input-number-input" ' + ':disabled="disabled" ' + ':style="inputStyle" ' + ':value="showValue" ' + '@input="inputHandler" ' + '@focus="focusHandler" ' + '@blur="blurHandler" ' + 'ref="input"' + '>' + '</div>',
    props: {
      // 宽度
      width: [String, Number],
      // 外部传入的数值
      value: {
        type: [String, Number],
        // 应需求，需要在初始状态时保持空值，故引入String类型
        'default': 0
      },
      // 最大值
      max: {
        type: Number,
        'default': Infinity
      },
      // 最小值
      min: {
        type: Number,
        'default': 0
      },
      // 支持小数
      decimal: Boolean,
      // 支持负数
      nagative: Boolean,
      // 单位
      unit: String,
      // 小数位数
      digitis: {
        type: Number,
        'default': 0
      },
      // 禁止
      disabled: Boolean
    },
    data: function data() {
      return {
        currentValue: 0,
        isFocus: false // 是否在focus状态

      };
    },
    watch: {
      currentValue: function currentValue(val) {
        if (val !== this.value) {
          this.$emit('input', val);
        }
      },
      value: function value(val) {
        this.setCurrentValue(val);
      }
    },
    computed: {
      showValue: function showValue() {
        var val = this.currentValue,
            unit = this.unit,
            isFocus = this.isFocus;
        var showValue = unit ? isFocus ? val : val + unit : val;
        return showValue;
      },
      inputStyle: function inputStyle() {
        var width = this.width;
        var o = {};
        o.width = typeof width == 'string' ? width : typeof width == 'number' ? width + 'px' : '';
        return o;
      },
      validatorMRE: function validatorMRE() {
        var decimal = this.decimal,
            nagative = this.nagative,
            digitis = this.digitis;
        var nonnagativeIntegerMRE = /^(?:0|[1-9]\d*)$/,
            integerMRE = /^(?:0|\-?([1-9]\d*)?)$/,
            nonnagativeFloatMRE = new RegExp('^(?:0|[1-9]\\d*)(\\.\\d' + (digitis > 0 ? '{0,' + digitis + '}' : '*') + ')?$'),
            floatMRE = new RegExp('(^\\-$)|(^(?:0|[1-9]\\d*|\\-\\d+)(\\.\\d' + (digitis > 0 ? '{0,' + digitis + '}' : '*') + ')?$)');
        return decimal && nagative ? floatMRE : decimal ? nonnagativeFloatMRE : nagative ? integerMRE : nonnagativeIntegerMRE;
      },
      validatorRE: function validatorRE() {
        var decimal = this.decimal,
            nagative = this.nagative;
        var nonnagativeIntegerRE = /^(?:0|[1-9]\d*)$/,
            integerRE = /^(?:0|\-?[1-9]\d*)$/,
            nonnagativeFloatRE = /^(?:0|[1-9]\d*)(\.\d+)?$/,
            floatRE = /^(?:0|\-?\d+)(\.\d+)?$/;
        return decimal && nagative ? floatRE : decimal ? nonnagativeFloatRE : nagative ? integerRE : nonnagativeIntegerRE;
      }
    },
    methods: {
      inputHandler: function inputHandler(e) {
        var val = e.target.value;
        if (val === '') return;

        if (this.validatorMRE.test(val)) {
          this.validatorRE.test(val) && this.setCurrentValue(val);
        } else {
          this.$forceUpdate();
        }
      },
      focusHandler: function focusHandler() {
        this.isFocus = true;
        this.$emit('focus');
        this.$emit('on-undo-focus', this.currentValue);
      },
      blurHandler: function blurHandler() {
        if (this.currentValue < this.min || this.$refs.input.value === '') {
          this.setCurrentValue(this.min);
          this.$emit('error');
        }

        this.isFocus = false;
        this.$forceUpdate();
        this.$emit('blur', this.currentValue);
        this.$emit('on-blur', this.currentValue);
        this.$emit('on-undo-blur', this.currentValue);
      },
      setCurrentValue: function setCurrentValue(val) {
        var parseVal = parseFloat(val),
            curVal = isNaN(parseVal) ? '' : parseVal;

        if (curVal > this.max) {
          this.currentValue = this.max;
          this.$emit('error');
          this.$forceUpdate();
        } else {
          this.currentValue = curVal;
        }
      }
    },
    created: function created() {
      // 注意在初始化的时候这里可能会修改数据源
      this.setCurrentValue(this.value);
    }
  };
});
/**
 * input组件
* 页面插入：<input-component :value="String" :maxlength="Number" :readonly="readonly" :unit="String" :number="Boolean" :disabled="Boolean" icon="ClassName(String)" @click="callback" :limit="ClassName(String)"></input-component>
	* 可选参数：classes | id | pattern | value | maxlength | readonly | unit | number | disabled | placeholder | icon | @click

* classes：自定义input class
* id：自定义input id
* pattern：自定义input样式
* value：String, input初始值value
* maxlength：Number, 限制input的输入字符
* readonly：Boolean, 是否只读
* unit：String, 鼠标blur时给input加的单位，如“px”
* number：Boolean, 现在输入的类型为数字，否则置空
* negativeNumber：Boolean, 现在输入的类型为数字，包括负数，否则置空
* disabled：Boolean, 是否禁用
* placeholder：String, input里的提示文字
* icon：String, input里点击可删除输入值的图标按钮,可传入类去覆盖默认jz-input-icon的背景
* @click：callback
* limit: String，提示限制数字长度
*
* https://cn.vuejs.org/v2/guide/components.html#什么是组件？
* Depends: vue.js
*/
;

(function () {
  /* global Vue */
  var prefixCls = 'jz-input';
  var firstClick = true;
  Vue.component('input-component', {
    name: 'Input',
    template: '<div :class="wrapClasses" @click.stop>' + '<template v-if="type !== \'textarea\'">' + '<input ref="input" :id="id" type="text" :maxlength="maxlength" :readonly="readonly" :class="inputClasses" :placeholder="placeholder" :value="currentValue" :unit="unit" @keypress="handleKeypress" :disabled="disabled" :number="number" @click="handleInputClick" @keyup.enter="handleEnter" @input="handleInput" @paste="handleInput" @focus="handleFocus" @blur="handleBlur">' + '<i v-if="icon && !focusStatus" :class="iClasses" @click="clickSearchIcon"></i>' + '<i v-if="icon && focusStatus" :class="iClasses" @mousedown.prevent @click="clickClearIcon"></i>' + '</template>' + '<textarea v-else ref="input" class="input-textarea-inner" :value="currentValue" :disabled="disabled" :class="inputClasses" :placeholder="placeholder" :maxlength="maxlength" @input="handleInput" @blur="handleBlur" @focus="handleFocus"></textarea>' + '<span v-if="limit" :class="lClasses" v-html="limitText"></span>' + '</div>',
    props: {
      id: String,
      classes: String,
      pattern: String,
      maxlength: [String, Number],
      readonly: Boolean,
      type: String,
      placeholder: String,
      disabled: Boolean,
      icon: String,
      value: [String, Number],
      number: Boolean,
      negativeNumber: Boolean,
      unit: String,
      noTrim: Boolean,
      format: String,
      limit: String
    },
    data: function data() {
      return {
        currentValue: this.value,
        showUnit: false,
        focusStatus: false
      };
    },
    methods: {
      handleEnter: function handleEnter(event) {
        this.$emit('on-enter', event);
      },
      handleInputClick: function handleInputClick(event) {
        this.$refs.input.parentNode.click();
        this.$refs.input.focus();

        if (firstClick) {
          this.$refs.input.select();
        }

        firstClick = false;
        this.$emit('click', event);
      },
      handleInput: function handleInput(event) {
        var value = event.target.value;
        var formattedValue = this.noTrim ? value : value.trim();

        if (this.number && formattedValue !== '') {
          if (!this.negativeNumber && formattedValue.charAt(0) === '-') {
            formattedValue = formattedValue.replace('-', '');
          }

          formattedValue = Number.isNaN(Number(formattedValue)) ? formattedValue.replace(/[^0-9]/ig, '') : Number(formattedValue);
          this.$refs.input.value = formattedValue;
        }

        if (this.negativeNumber && formattedValue !== '') {
          if (formattedValue.charAt(0) === '-') {
            var nValue = formattedValue.replace('-', '');
            formattedValue = Number.isNaN(Number(nValue)) ? nValue.replace(/[^0-9]/ig, '') : Number(nValue);
            formattedValue = '-' + (formattedValue === 0 ? '' : formattedValue);
          } else {
            formattedValue = Number.isNaN(Number(formattedValue)) ? formattedValue.replace(/[^0-9]/ig, '') : Number(formattedValue);
          }

          this.$refs.input.value = formattedValue;
        }

        this.setCurrentValue(formattedValue);
        this.$emit('input', formattedValue);
        this.$emit('on-change', event);
      },
      handleKeypress: function handleKeypress(event) {
        if (this.format) {
          var re = new RegExp(this.format);

          if (!re.test(event.key)) {
            event.preventDefault();
            return false;
          }
        }
      },
      handleFocus: function handleFocus(event) {
        if (this.unit) {
          this.$refs.input.value = event.target.value.replace(this.unit, '');
          this.showUnit = false;
        }

        this.focusStatus = true;
        this.$emit('on-focus', event);
        this.$emit('on-undo-focus', this.currentValue);
      },
      handleBlur: function handleBlur(event) {
        if (!!this.unit && event.target.value !== '') {
          this.$refs.input.value = event.target.value + this.unit;
          this.showUnit = true;
        }

        this.focusStatus = false;
        firstClick = true;
        this.$emit('on-blur', event); // 用nextTick的原因：有些操作会在blur的时候改变值，
        // 但组件内的更新是异步的，这时候的currentValue不是我们想要的值，
        // nextTick之后拿的currentValue就是更新完之后的值了。（参见底部版权信息）

        this.$nextTick(function () {
          this.$emit('on-undo-blur', this.currentValue);
        });
      },
      clickSearchIcon: function clickSearchIcon() {
        this.$emit('on-click-search', this.currentValue);
      },
      clickClearIcon: function clickClearIcon() {
        if (this.currentValue !== '') {
          this.setCurrentValue('');
        }

        this.$emit('on-click-clear', this.currentValue);
      },
      setCurrentValue: function setCurrentValue(value) {
        if (this.number && value !== '') {
          value = Number.isNaN(Number(value)) ? '' : Number(value);
        }

        this.currentValue = value;
      },
      focus: function focus() {
        this.$refs.input.focus();
      },
      blur: function blur() {
        this.$refs.input.blur();
      }
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls + '-wrapper'] = true;
        wrapClasses[prefixCls + '-' + this.type] = !!this.type;
        return wrapClasses;
      },
      inputClasses: function inputClasses() {
        var inputClasses = {};
        inputClasses[prefixCls] = true;
        inputClasses[this.classes] = !!this.classes;
        inputClasses[prefixCls + '-limitwrapper'] = !!this.limit;
        return inputClasses;
      },
      iClasses: function iClasses() {
        var iClasses = {};
        iClasses[prefixCls + '-icon'] = true;
        iClasses[this.icon] = !!this.icon;
        return iClasses;
      },
      lClasses: function lClasses() {
        var lClasses = {};
        lClasses[prefixCls + "-limit"] = true;
        lClasses[this.limit] = !!this.limit;
        return lClasses;
      },
      limitText: function limitText() {
        var len = this.currentValue ? this.currentValue.length : 0;
        len = len > this.maxlength ? this.maxlength : len;
        return len + '/' + this.maxlength;
      }
    },
    mounted: function mounted() {
      var _this = this;

      if (this.pattern) {
        this.$nextTick(function () {
          if (typeof _this.$refs.input !== 'undefined') {
            _this.$refs.input.style.cssText += _this.pattern;
          }
        });
      }

      if (this.value !== '' && !!this.unit) {
        this.$nextTick(function () {
          if (typeof _this.$refs.input !== 'undefined') {
            _this.$refs.input.value = _this.value + _this.unit;
          }
        });
      }
    },
    watch: {
      value: function value(val) {
        var inputDom = this.$refs.input,
            _this = this;

        if (document.hasFocus() && document.activeElement == inputDom) {// focus 状态，不做处理
        } else {
          if (this.value !== '' && !!this.unit && !!this.value) {
            this.$nextTick(function () {
              if (typeof _this.$refs.input !== 'undefined' && _this.value.toString().indexOf(_this.unit) == -1) {
                _this.$refs.input.value = _this.value + _this.unit;
              }
            });
          }
        }

        this.setCurrentValue(val);
      }
    }
  });
})();
/**
 * 等比数据输入器
 * <lock-ratio-component :width.sync='width' :height.sync='height' :min-width='1' :max-width='100' :min-height='1' :max-height='100' :unlocked.sync='unlocked' @error:width='error.widthError' @error:height='error.heightError'></lock-ratio-component>
 */
;

(function () {
  Vue.component('lock-ratio-component', {
    template: "<div class='jz_lock_ratio'>" + "   <input-component class='width_input' @input='inputWidth' :value='width' number :maxlength='4' ref='width'></input-component>" + "   <div @click='lockToggle' title='锁定宽高比' class='jz_lock_ratio_btn'><div :class='!unlocked?\"lock_ratio\":\"unlock_ratio\"'></div></div>" + "   <input-component class='height_input' @input='inputHeight' :value='height' number :maxlength='4' ref='height'></input-component>" + "</div>",
    props: {
      'width': Number,
      'height': Number,
      'minWidth': Number,
      'maxWidth': Number,
      'minHeight': Number,
      'maxHeight': Number,
      'unlocked': Boolean
    },
    data: function data() {
      return {
        //计算比例
        'ratio': this.width / this.height,
        //正在输入的项
        'input': ''
      };
    },
    methods: {
      'inputWidth': function inputWidth(new_value) {
        //在数据过大后回填时new_value为undefined的bug
        if (typeof new_value === 'undefined') new_value = this.maxWidth;
        if ((new_value > this.maxWidth || new_value < this.minWidth) && this.input === 'width' && new_value !== '') this.$emit("error:width");

        if (!this.unlocked) {
          var height = Math.ceil(new_value / this.ratio);
          this.$emit('update:height', isNaN(height) || !isFinite(height) ? this.maxHeight : height);
        }

        this.$emit('update:width', new_value);
      },
      'inputHeight': function inputHeight(new_value) {
        //在数据过大后回填时new_value为undefined的bug
        if (typeof new_value === 'undefined') new_value = this.maxWidth;
        if ((new_value > this.maxHeight || new_value < this.minHeight) && this.input === 'height' && new_value !== '') this.$emit("error:height");

        if (!this.unlocked) {
          var width = Math.ceil(new_value * this.ratio);
          this.$emit('update:width', isNaN(width) || !isFinite(width) ? this.maxWidth : width);
        }

        this.$emit('update:height', new_value);
      },
      lockToggle: function lockToggle() {
        this.$emit('update:unlocked', !this.unlocked); //计算新比例,防止比例计算失败

        this.ratio = this.width / this.height || this.ratio;
      }
    },
    mounted: function mounted() {
      //防止等比缩放时导致另外一个超限，导致警告信息错误的问题
      var self = this;

      this.$refs.width.$el.getElementsByTagName('input')[0].onfocus = function () {
        self.input = 'width';
      };

      this.$refs.height.$el.getElementsByTagName('input')[0].onfocus = function () {
        self.input = 'height';
      };
    }
  });
})();
/*! page组件
 *   
 *  页面插入：
 *  样式一（简单版）：  <page-component show-total :page-size="6" :current="1" :total="20" simple style="width: 600px;"></page-component>
 *  样式二（复杂版）：  <page-component show-total show-sizer :page-size="15" :current="1" :total="150" style="width: 600px;"></page-component>
 * 
 *  参数：
 *  current 当前页码
 *  simple  简洁版（不传的话就是默认复杂版）  
 *  total   数据总数
 *  page-size   每页条数
 *  page-size-opts  每页条数切换的配置
 *  show-sizer  显示分页，用来改变 page-size
 *  show-total   显示总数
 *  styles  自定义 style 样式
 *  
 */
;

(function () {
  var prefixCls = 'jz-page';
  var PREV = '上一页';
  var NEXT = '下一页';
  var PAGE_SIZER = '每页显示个数';
  Vue.component('page-component', {
    name: 'Page',
    template: '<ul :class="simpleWrapClasses" :style="styles" v-if="simple">' + '<div class="' + prefixCls + '-wrap" v-if="showTotal">' + '<span class="' + prefixCls + '-size">本页共{{ currentRealPageSize }}个</span>' + '<span class="' + prefixCls + '-total">总共{{ total }}个</span>' + '</div>' + '<li :title="prevPage" :class="prevClasses" @click="prev">' + '<a>{{ prevPage }}</a>' + '</li>' + '<div :class="simplePagerClasses">{{ currentPage }}<span>/</span>{{ allPages }}</div>' + '<li :title="nextPage" :class="nextClasses" @click="next">' + '<a>{{ nextPage }}</a>' + '</li>' + '</ul>' + '<ul :class="wrapClasses" :style="styles" v-else>' + '<div class="clearFix">' + '<div class="' + prefixCls + '-wrap" v-if="showTotal">' + '<span class="' + prefixCls + '-size">本页共{{ currentRealPageSize }}个</span>' + '<span class="' + prefixCls + '-total">总共{{ total }}个</span>' + '</div>' + '<div v-if="showSizer" class="' + prefixCls + '-options-sizer">' + '<div class="' + prefixCls + '-sizer">' + PAGE_SIZER + '</div>' + '<select-component style="width: 56px; text-align: left;" v-model="currentPageSize" placement="bottom" @on-change="changeSize">' + '<select-item-component v-for="item in pageSizeOpts" :key="item" :value="item" style="text-align:center;">{{ item }}</select-item-component>' + '</select-component>' + '</div>' + '</div>' + '<li :title="prevPage" :class="prevClasses" @click="prev">' + '<i class="' + prefixCls + '-arrow-left"></i><a>{{ prevPage }}</a>' + '</li>' + '<li title="1" :class="firstPageClasses" @click="changePage(1)">' + '<a>1</a>' + '</li>' + '<li v-if="currentPage - 3 > 1" class="' + prefixCls + '-item">' + '<i class="' + prefixCls + '-ellipses"></i>' + '</li>' + '<li :title="currentPage - 2" v-if="currentPage - 2 > 1" class="' + prefixCls + '-item" @click="changePage(currentPage - 2)">' + '<a>{{ currentPage - 2 }}</a>' + '</li>' + '<li :title="currentPage - 1" v-if="currentPage - 1 > 1" class="' + prefixCls + '-item" @click="changePage(currentPage - 1)">' + '<a>{{ currentPage - 1 }}</a>' + '</li>' + '<li :title="currentPage" v-if="currentPage != 1 && currentPage != allPages" class="' + prefixCls + '-item ' + prefixCls + '-item-active">' + '<a>{{ currentPage }}</a>' + '</li>' + '<li :title="currentPage + 1" v-if="currentPage + 1 < allPages" class="' + prefixCls + '-item" @click="changePage(currentPage + 1)">' + '<a>{{ currentPage + 1 }}</a>' + '</li>' + '<li :title="currentPage + 2" v-if="currentPage + 2 < allPages" class="' + prefixCls + '-item" @click="changePage(currentPage + 2)">' + '<a>{{ currentPage + 2 }}</a>' + '</li>' + '<li v-if="currentPage + 3 < allPages" class="' + prefixCls + '-item">' + '<i class="' + prefixCls + '-ellipses"></i>' + '</li>' + '<li :title="allPages" v-if="allPages > 1" :class="lastPageClasses" @click="changePage(allPages)">' + '<a>{{ allPages }}</a>' + '</li>' + '<li :title="nextPage" :class="nextClasses" @click="next">' + '<a>{{ nextPage }}</a><i class="' + prefixCls + '-arrow-right"></i>' + '</li>' + '<span class="' + prefixCls + '-allPages">共{{ allPages }}页</span>' + '<span class="' + prefixCls + '-elevator">' + '到第<input-component @on-enter="changePage($refs.elevator.currentValue, \'elevator\')" ref="elevator" number pattern="height: 34px;" style="width: 50px; margin: 0 10px;"></input-component>页' + '</span>' + '<button class="' + prefixCls + '-btn" @click="changePage($refs.elevator.currentValue, \'elevator\')">确定</button>' + '</ul>',
    props: {
      current: Number,
      total: Number,
      pageSize: {
        'type': Number,
        'default': 5
      },
      simple: Boolean,
      className: String,
      styles: Object,
      showTotal: Boolean,
      pageSizeOpts: {
        'type': Array,
        'default': function _default() {
          return [15, 30, 45, 60];
        }
      },
      showSizer: Boolean
    },
    data: function data() {
      return {
        prevPage: PREV,
        nextPage: NEXT,
        currentPage: this.current,
        currentPageSize: this.pageSize
      };
    },
    watch: {
      total: function total(val) {
        var maxPage = Math.ceil(val / this.currentPageSize);

        if (maxPage < this.currentPage && maxPage > 0) {
          this.currentPage = maxPage;
          this.$emit('update:current', this.currentPage);
        }
      },
      current: function current(val) {
        this.currentPage = val;
      },
      pageSize: function pageSize(val) {
        this.currentPageSize = val;
      }
    },
    computed: {
      currentRealPageSize: function currentRealPageSize() {
        var diff = this.total - this.currentPage * this.currentPageSize;

        if (diff < 0) {
          return this.currentPageSize + diff;
        }

        return this.currentPageSize;
      },
      allPages: function allPages() {
        var allPage = Math.ceil(this.total / this.currentPageSize);
        return allPage === 0 ? 1 : allPage;
      },
      simpleWrapClasses: function simpleWrapClasses() {
        var simpleWrapClasses = {};
        simpleWrapClasses[prefixCls] = true;
        simpleWrapClasses[prefixCls + '-simple'] = true;
        simpleWrapClasses[this.className] = !!this.className;
        return simpleWrapClasses;
      },
      simplePagerClasses: function simplePagerClasses() {
        return prefixCls + '-simple-pager';
      },
      prevClasses: function prevClasses() {
        var prevClasses = {};
        prevClasses[prefixCls + '-prev'] = true;
        prevClasses[prefixCls + '-disabled'] = this.currentPage === 1;
        return prevClasses;
      },
      nextClasses: function nextClasses() {
        var nextClasses = {};
        nextClasses[prefixCls + '-next'] = true;
        nextClasses[prefixCls + '-disabled'] = this.currentPage === this.allPages;
        return nextClasses;
      },
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls] = true;
        wrapClasses[prefixCls + '-complex'] = true;
        wrapClasses[this.className] = !!this.className;
        return wrapClasses;
      },
      firstPageClasses: function firstPageClasses() {
        var firstPageClasses = {};
        firstPageClasses[prefixCls + '-item'] = true;
        firstPageClasses[prefixCls + '-item-active'] = this.currentPage === 1;
        return firstPageClasses;
      },
      lastPageClasses: function lastPageClasses() {
        var lastPageClasses = {};
        lastPageClasses[prefixCls + '-item'] = true;
        lastPageClasses[prefixCls + '-item-active'] = this.currentPage === this.allPages;
        return lastPageClasses;
      }
    },
    methods: {
      changePage: function changePage(page, type) {
        if (type == "elevator") {
          if (vue_utils.isValueNumber(page)) {
            page = Number(page);

            if (page != this.currentPage) {
              var allPages = this.allPages;

              if (page > allPages) {
                page = allPages;
              }
            }

            this.$refs.elevator.currentValue = "";
          } else {
            page = 1;
          }
        }

        if (this.currentPage != page) {
          this.currentPage = page;
          this.$emit('on-change', page);
          this.$emit('update:current', page);
        }
      },
      changeSize: function changeSize(pageSize) {
        this.currentPageSize = pageSize;
        this.$emit('on-page-size-change', pageSize);
        this.changePage(1);
      },
      prev: function prev() {
        var current = this.currentPage;

        if (current <= 1) {
          return false;
        }

        this.changePage(current - 1);
      },
      next: function next() {
        var current = this.currentPage;

        if (current >= this.allPages) {
          return false;
        }

        this.changePage(current + 1);
      },
      onPage: function onPage(page) {
        this.changePage(page);
      }
    }
  });
})();
/*!
 * photo-group组件
 */
;

(function () {
  var prefixCls = 'jz-photo-group';
  Vue.component('photo-group-component', {
    name: 'PhotoGroup',
    template: '<div :class="classes">' + '<slot></slot>' + '</div>',
    props: {
      value: {
        type: [String, Number, Boolean]
      }
    },
    data: function data() {
      return {
        currentValue: this.value,
        childrens: []
      };
    },
    computed: {
      classes: function classes() {
        return prefixCls;
      }
    },
    mounted: function mounted() {
      this.updateValue();
    },
    methods: {
      updateValue: function updateValue() {
        var value = this.value;
        this.childrens = vue_utils.findComponentsDownward(this, 'Photo');

        if (this.childrens) {
          this.childrens.forEach(function (child) {
            child.currentValue = value == child.label;
            child.group = true;
          });
        }
      },
      change: function change(data) {
        var cash = this.currentValue;
        this.currentValue = data.value;
        this.updateValue();
        this.$emit('input', data.value);
        this.$emit('on-change', data.value);
        this.$emit('on-undo', data.value, cash);
      }
    },
    watch: {
      value: function value() {
        this.updateValue();
      }
    }
  });
})();
/*
 * 图片列表组件。提供input add-photo edit-photo added-photo等事件，props可以传viewLength，代表一页列表展示的图片数量。
 */
;

(function () {
  /* global Vue, vue_utils */
  Vue.component('img-component', {
    name: 'Img',
    template: '<div class="jz_img">' + '<img class="jz_img_item" :src="src || defaultSrc">' + '</div>',
    props: {
      src: String,
      defaultSrc: {
        type: String,
        'default': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=' // base64空白占位图

      }
    }
  });
  Vue.component('editor-component', {
    name: 'Editor',
    template: '<div class="jz_editor">' + '<slot></slot>' + '<div class="jz_editor_layer" :class="active ? \'jz_editor_layer--active\' : null" @click="clickLayerHandler">' + '<i v-for="btnName in data" class="jz_editor_item" :class="\'jz_editor_\' + btnName" @click.stop="clickItemHandler(btnName)"></i>' + '<i v-for="btnName in activeData" class="jz_editor_item" :class="[\'jz_editor_\' + btnName, \'jz_editor_item--active\']" @click="clickItemHandler(btnName)"></i>' + '</div>' + '</div>',
    props: {
      data: {
        type: Array,
        'default': function _default() {
          return ['del', 'update'];
        }
      },
      activeData: {
        type: Array,
        'default': function _default() {
          return [];
        }
      }
    },
    computed: {
      list: function list() {
        return this.data.concat(this.activeData);
      },
      active: function active() {
        return this.activeData.length > 0;
      }
    },
    methods: {
      clickItemHandler: function clickItemHandler(btnName) {
        this.$emit(btnName);
      },
      clickLayerHandler: function clickLayerHandler(e) {
        this.$emit('click', e);
      }
    }
  });
  Vue.component('upload-component', {
    name: 'Upload',
    template: '<div class="jz_upload" :class="[\'jz_upload_\' + size, {jz_upload_disabled: disabled}]" @click="clickUploadHandler">' + '<div class="jz_upload_icon"></div>' + '<div class="jz_upload_label" v-if="size == \'large\'">{{label}}</div>' + '</div>',
    props: {
      disabled: Boolean,
      label: {
        type: String,
        'default': '点击添加图片'
      },
      size: {
        type: String,
        'default': 'normal',
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['mini', 'normal', 'large']);
        }
      }
    },
    methods: {
      clickUploadHandler: function clickUploadHandler() {
        if (this.disabled) return;
        this.$emit('upload');
      }
    }
  }); // 改这里的值要注意css那边是否有关联

  var UPLOAD_LENGTH = 1;
  var UPLOAD_WIDTH = 78;
  var IETM_WIDTH = 92;
  Vue.component('photo-list-component', {
    name: 'PhotoList',
    props: {
      value: {
        type: Array,
        requied: true
      },
      viewLength: {
        type: Number,
        'default': 4
      },
      pathAlias: {
        type: String,
        'default': 'filePath'
      },
      slideToDirection: {
        type: String,
        'default': 'last'
      },
      max: {
        type: Number,
        'default': Infinity
      },
      itemMargin: {
        type: Number,
        'default': 15
      },
      uploadMargin: {
        type: Number,
        'default': 15
      },
      noPhotoWidth: Number,
      prevLeft: {
        type: Number,
        'default': 125
      },
      nextRight: {
        type: Number,
        'default': 32
      }
    },
    data: function data() {
      return {
        dragging: false,
        hoverIndex: -1,
        canLoad: false
      };
    },
    template: '<div class="jz-photo-list" :class="{\'is-no-photo\': noPhoto}" :style="photoListStyles">' + '<div class="photo-list-wrap">' + '<upload-component @upload="addHandler" class="jz_photo_list_upload" :style="uploadStyles" :size="noPhoto ? \'large\' : \'normal\'" :disabled="maxPhoto"></upload-component>' + '<gallery-component class="photo-list-view" v-if="!noPhoto" :wrap-width="galleryWrapWidth" :view-width="galleryViewWidth" :prev-left="prevLeft" :next-right="nextRight">' + '<draggable class="photo-list-drag" :class="{\'is-dragging\': dragging}" :value="value" @input="dragHandler" @start="startDrag" @end="endDrag" :options="dragOpts">' + '<div class="photo-list-item" v-for="(item, index) in value" :style="itemStyles" @mousemove="mousemoveHandler(index)" @mouseleave="mouseleaveHandler">' + '<editor-component @del="delHandler(item)" @update="editHandler(item)" class="jz_photo_list_editor" :class="{jz_photo_list_editor_hover: index == hoverIndex}">' + '<img-component v-if="(index < viewLength) || canLoad" :src="item[pathAlias]"></img-component>' + '</editor-component>' + '</div>' + '</draggable>' + '</gallery-component>' + '</div>' + '<div class="photo-list-label" v-if="value.length > viewLength">图片已上传{{value.length}}张</div>' + '</div>',
    computed: {
      noPhoto: function noPhoto() {
        return this.value.length == 0;
      },
      maxPhoto: function maxPhoto() {
        return this.value.length >= this.max;
      },
      uploadStyles: function uploadStyles() {
        return this.noPhoto ? {
          margin: '5px 0 0',
          width: this.noPhotoWidth ? this.noPhotoWidth + 'px' : ''
        } : {
          margin: '5px ' + this.uploadMargin / 2 + 'px 0',
          width: UPLOAD_WIDTH + 'px'
        };
      },
      itemStyles: function itemStyles() {
        return {
          'width': IETM_WIDTH + 'px',
          'margin': '5px ' + this.itemMargin / 2 + 'px 0'
        };
      },
      photoListStyles: function photoListStyles() {
        return {
          'width': this.galleryWrapWidth + UPLOAD_LENGTH * this.uploadOuterWidth + 'px'
        };
      },
      // 自动计算传给gallery组件的参数
      galleryWrapWidth: function galleryWrapWidth() {
        return this.viewLength * this.itemOuterWidth;
      },
      galleryViewWidth: function galleryViewWidth() {
        return this.value.length * this.itemOuterWidth;
      },
      // draggable组件的配置
      dragOpts: function dragOpts() {
        return {
          draggable: '.photo-list-item',
          forceFallback: true,
          filter: '.jz_editor_item',
          scrollFn: this.scrollFn,
          preventOnFilter: false
        };
      },
      itemOuterWidth: function itemOuterWidth() {
        return IETM_WIDTH + this.itemMargin;
      },
      uploadOuterWidth: function uploadOuterWidth() {
        return UPLOAD_WIDTH + this.uploadMargin;
      }
    },
    created: function created() {
      // 添加完图片要滑到最后
      this.$on('added-photo', this.addedPhoto);
    },
    mounted: function mounted() {
      // 图片生成延迟加载
      if (document.readyState == 'complete') {
        this.loadImgs();
      } else {
        vue_utils.on(window, 'load', this.loadImgs);
      }
    },
    beforeDestroy: function beforeDestroy() {
      vue_utils.off(window, 'load', this.loadImgs);
    },
    methods: {
      loadImgs: function loadImgs() {
        this.canLoad = true;
      },
      addHandler: function addHandler() {
        if (this.maxPhoto) return;
        this.$emit('add-photo', this.addedPhoto);
      },
      delHandler: function delHandler(item) {
        var currentValue = this.value.slice(),
            index = currentValue.indexOf(item);
        index > -1 && currentValue.splice(index, 1);
        this.$emit('input', currentValue);
        this.$emit('del-photo', item);
      },
      dragHandler: function dragHandler(currentValue) {
        this.$emit('input', currentValue);
        this.$emit('drag-photo', currentValue);
      },
      editHandler: function editHandler(item) {
        this.$emit('edit-photo', item);
      },
      // 触发gallery组件的事件，触发滑动效果
      slideToPrev: function slideToPrev() {
        vue_utils.broadcast(this, 'Gallery', 'slide-to-prev');
      },
      slideToNext: function slideToNext() {
        vue_utils.broadcast(this, 'Gallery', 'slide-to-next');
      },
      slideToFirst: function slideToFirst() {
        vue_utils.broadcast(this, 'Gallery', 'slide-to-first');
      },
      slideToLast: function slideToLast() {
        vue_utils.broadcast(this, 'Gallery', 'slide-to-last');
      },
      addedPhoto: function addedPhoto() {
        // 从无图片状态添加图片，不会触发滑动到最后一张图片的效果
        // 此时子组件的数据还没更新好，要用nextTick
        !this.noPhoto && this.$nextTick(this.slideToDirection == 'last' ? this.slideToLast : this.slideToFirst);
      },
      // 排序的时候检测位置，触发滑动
      scrollFn: vue_utils.throttle(function (offsetX) {
        offsetX < 0 && this.slideToPrev();
        offsetX > 0 && this.slideToNext();
      }, 800),
      // 控制状态，是否排序中
      startDrag: function startDrag() {
        this.dragging = true;
      },
      endDrag: function endDrag() {
        this.dragging = false;
      },
      // 通过操作类来控制hover样式，因为css伪类hover无法处理一些情况
      mousemoveHandler: function mousemoveHandler(index) {
        if (this.dragging) return;
        if (this.hoverIndex == index) return;
        this.hoverIndex = index;
      },
      mouseleaveHandler: function mouseleaveHandler() {
        if (this.dragging) return;
        this.hoverIndex = -1;
      }
    }
  });
})();
/*!photo组件(其实就是选中的一些效果)
 *	页面插入：
 *	<photo-group-component v-model="？" v-on:on-change="？">
 *		<photo-component label="？" >？</photo-component>
 *		<photo-component label="？" >？</photo-component>
 *	</photo-group-component>
 * 
 * 单独使用: 使用 v-model 可以双向绑定数据。
 * 组合使用: 使用 Photo-group实现一组互斥的选项组。在组合使用时，Photo 使用 label 来自动判断。每个 Photo 的内容可以自定义，如不填写则默认使用 label 的值。详见photo-group.js
 * 属性参数如下：
 * 		value：	只在单独使用时有效。可以使用 v-model 双向绑定数据	Boolean
 *		label：	只在组合使用时有效。指定当前选项的 value 值，组合会自动判断当前选择的项目	String | Number	| Boolean	
 *		type :  选中的类型，现在传type='warn',有提供警示性选中提示
 *      size：  选中右下角的图片大小，现在提供两种尺寸，small和large
 * 事件：响应父组件事件
 * 
 * on-change        
 */
;

(function () {
  var prefixCls = 'jz-photo';
  Vue.component('photo-component', {
    name: 'Photo',
    template: '<label :class="wrapClasses" >' + '<input type="radio" :class="inputClasses" :checked="currentValue" @change="change">' + '<slot></slot>' + '</label>',
    props: {
      label: {
        type: [String, Number, Boolean]
      },
      type: String,
      size: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['mini', 'small', 'large']);
        }
      },
      value: Boolean
    },
    data: function data() {
      return {
        currentValue: this.value,
        group: false,
        parent: vue_utils.findComponentUpward(this, 'PhotoGroup')
      };
    },
    mounted: function mounted() {
      if (this.parent) this.group = true;

      if (!this.group) {
        this.updateValue();
      } else {
        this.parent.updateValue();
      }
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls + "-wrapper"] = true;
        wrapClasses[prefixCls + "-group-item"] = !!this.group;
        wrapClasses[prefixCls + "-checked"] = !!this.currentValue;
        wrapClasses[prefixCls + "-" + this.type] = !!this.type;
        wrapClasses[prefixCls + "-" + this.size] = !!this.size;
        return wrapClasses;
      },
      inputClasses: function inputClasses() {
        return "jz-radio-input";
      }
    },
    methods: {
      change: function change(event) {
        var checked = event.target.checked;
        this.currentValue = checked;
        this.$emit('input', checked);

        if (this.group && this.label !== undefined) {
          this.parent.change({
            value: this.label,
            checked: this.value
          });
        }

        if (!this.group) {
          this.$emit('on-change', checked);
        }
      },
      updateValue: function updateValue() {
        this.currentValue = this.value;
      }
    },
    watch: {
      value: function value() {
        this.updateValue();
      }
    }
  });
})();
/*
 *	弹出层组件
 */
;

(function () {
  Vue.component("popover-component", {
    name: "popover",
    template: "<div ref='jzPopover' class='jz_popover' :class='classes'>" + "<div class='popover_bg'></div>" + "<div class='popover_panel' :style='panelStyle'>" + "<div class='popover_wrap'>" + "<div class='popover_header_wrap'>" + "<slot name='header'>" + "<div class='popover_header_wrap2'>" + "<div class='popover_header'>" + "<div class='popover_header_inner'>" + "<span class='popover_header_span1'></span>" + "<span class='popover_header_span2'></span>" + "</div>" + "</div>" + "</div>" + "</slot>" + "</div>" + "<div class='popover_content_wrap'><slot name='content'></slot></div>" + "<div class='popover_operate_wrap'>" + "<slot name='operate'>" + "<button-component class='popover_operate_button' global-oper active @click='popoverSure'>确 定</button-component>" + "<button-component class='popover_operate_button' global-oper @click='popoverCancle'>取 消</button-component>" + "</slot>" + "</div>" + "<div class='popover_close' @click='popoverClose'></div>" + "</div>" + "</div>" + "</div>",
    props: {
      w: Number,
      h: Number,
      bg: String,
      classes: String
    },
    data: function data() {
      var winWidth = document.documentElement.clientWidth,
          winHeight = document.documentElement.clientHeight;
      return {
        panelStyle: {
          width: this.w + "px",
          height: this.h + "px",
          background: this.bg,
          left: (winWidth - this.w) / 2 + "px",
          top: (winHeight - this.h) / 2 + "px"
        },
        close: false
      };
    },
    methods: {
      //确定按钮的事件必须传 其他的可以不传，不传的话取消就直接销毁弹窗
      popoverSure: function popoverSure() {
        this.$emit("sure", this);

        if (this.close) {
          this.popoverDestroy();
        }
      },
      popoverCancle: function popoverCancle() {
        if (this._events.cancle) {
          this.$emit("cancle", this);

          if (this.close) {
            this.popoverDestroy();
          }
        } else {
          this.popoverDestroy();
        }
      },
      popoverClose: function popoverClose() {
        if (this._events.close) {
          this.$emit("close", this);

          if (this.close) {
            this.popoverDestroy();
          }
        } else {
          this.popoverCancle();
        }
      },
      popoverDestroy: function popoverDestroy() {
        this.$refs.jzPopover.parentElement.removeChild(this.$refs.jzPopover);
        this.$destroy();
        this.$parent.$destroy();
      }
    }
  });
})();
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version {{version}}
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
//
// Cross module loader
// Supported: Node, AMD, Browser globals
//
;

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports && typeof window === 'undefined') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Popper = factory();
  }
})(this, function () {
  'use strict';

  var root = window; // default options

  var DEFAULTS = {
    // placement of the popper
    placement: 'bottom',
    gpuAcceleration: true,
    // shift popper from its origin by the given amount of pixels (can be negative)
    offset: 0,
    // the element which will act as boundary of the popper
    boundariesElement: 'viewport',
    // amount of pixel used to define a minimum distance between the boundaries and the popper
    boundariesPadding: 5,
    // popper will try to prevent overflow following this order,
    // by default, then, it could overflow on the left and on top of the boundariesElement
    preventOverflowOrder: ['left', 'right', 'top', 'bottom'],
    // the behavior used by flip to change the placement of the popper
    flipBehavior: 'flip',
    arrowElement: '[x-arrow]',
    arrowOffset: 0,
    // list of functions used to modify the offsets before they are applied to the popper
    modifiers: ['shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle'],
    modifiersIgnored: [],
    forceAbsolute: false,
    forceFixed: false,
    win: window
  };
  /**
   * Create a new Popper.js instance
   * @constructor Popper
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement|Object} popper
   *      The HTML element used as popper, or a configuration used to generate the popper.
   * @param {String} [popper.tagName='div'] The tag name of the generated popper.
   * @param {Array} [popper.classNames=['popper']] Array of classes to apply to the generated popper.
   * @param {Array} [popper.attributes] Array of attributes to apply, specify `attr:value` to assign a value to it.
   * @param {HTMLElement|String} [popper.parent=window.document.body] The parent element, given as HTMLElement or as query string.
   * @param {String} [popper.content=''] The content of the popper, it can be text, html, or node; if it is not text, set `contentType` to `html` or `node`.
   * @param {String} [popper.contentType='text'] If `html`, the `content` will be parsed as HTML. If `node`, it will be appended as-is.
   * @param {String} [popper.arrowTagName='div'] Same as `popper.tagName` but for the arrow element.
   * @param {Array} [popper.arrowClassNames='popper__arrow'] Same as `popper.classNames` but for the arrow element.
   * @param {String} [popper.arrowAttributes=['x-arrow']] Same as `popper.attributes` but for the arrow element.
   * @param {Object} options
   * @param {String} [options.placement=bottom]
   *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -right),
   *      left(-start, -end)`
   *
   * @param {HTMLElement|String} [options.arrowElement='[x-arrow]']
   *      The DOM Node used as arrow for the popper, or a CSS selector used to get the DOM node. It must be child of
   *      its parent Popper. Popper.js will apply to the given element the style required to align the arrow with its
   *      reference element.
   *      By default, it will look for a child node of the popper with the `x-arrow` attribute.
   *
   * @param {Boolean} [options.gpuAcceleration=true]
   *      When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the
   *      browser to use the GPU to accelerate the rendering.
   *      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU.
   *
   * @param {Number} [options.offset=0]
   *      Amount of pixels the popper will be shifted (can be negative).
   *
   * @param {String|Element} [options.boundariesElement='viewport']
   *      The element which will define the boundaries of the popper position, the popper will never be placed outside
   *      of the defined boundaries (except if `keepTogether` is enabled)
   *
   * @param {Number} [options.boundariesPadding=5]
   *      Additional padding for the boundaries
   *
   * @param {Array} [options.preventOverflowOrder=['left', 'right', 'top', 'bottom']]
   *      Order used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,
   *      this means that the last ones will never overflow
   *
   * @param {String|Array} [options.flipBehavior='flip']
   *      The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to
   *      overlap its reference element. Defining `flip` as value, the placement will be flipped on
   *      its axis (`right - left`, `top - bottom`).
   *      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify
   *      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,
   *      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top)
   *
   * @param {Array} [options.modifiers=[ 'shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle']]
   *      List of functions used to modify the data before they are applied to the popper, add your custom functions
   *      to this array to edit the offsets and placement.
   *      The function should reflect the @params and @returns of preventOverflow
   *
   * @param {Array} [options.modifiersIgnored=[]]
   *      Put here any built-in modifier name you want to exclude from the modifiers list
   *      The function should reflect the @params and @returns of preventOverflow
   *
   * @param {Boolean} [options.removeOnDestroy=false]
   *      Set to true if you want to automatically remove the popper when you call the `destroy` method.
   */

  function Popper(reference, popper, options) {
    this._reference = reference.jquery ? reference[0] : reference;
    this.state = {}; // if the popper variable is a configuration object, parse it to generate an HTMLElement
    // generate a default popper if is not defined

    var isNotDefined = typeof popper === 'undefined' || popper === null;
    var isConfig = popper && Object.prototype.toString.call(popper) === '[object Object]';

    if (isNotDefined || isConfig) {
      this._popper = this.parse(isConfig ? popper : {});
    } // otherwise, use the given HTMLElement as popper
    else {
        this._popper = popper.jquery ? popper[0] : popper;
      } // with {} we create a new object with the options inside it


    this._options = Object.assign({}, DEFAULTS, options);
    root = this._options.win; // refactoring modifiers' list

    this._options.modifiers = this._options.modifiers.map(function (modifier) {
      // remove ignored modifiers
      if (this._options.modifiersIgnored.indexOf(modifier) !== -1) return; // set the x-placement attribute before everything else because it could be used to add margins to the popper
      // margins needs to be calculated to get the correct popper offsets

      if (modifier === 'applyStyle') {
        this._popper.setAttribute('x-placement', this._options.placement);
      } // return predefined modifier identified by string or keep the custom one


      return this.modifiers[modifier] || modifier;
    }.bind(this)); // make sure to apply the popper position before any computation

    this.state.position = this._getPosition(this._popper, this._reference);
    setStyle(this._popper, {
      position: this.state.position,
      top: 0
    }); // fire the first update to position the popper in the right place

    this.update(); // setup event listeners, they will take care of update the position in specific situations

    this._setupEventListeners();

    return this;
  } //
  // Methods
  //

  /**
   * Destroy the popper
   * @method
   * @memberof Popper
   */


  Popper.prototype.destroy = function () {
    this._popper.removeAttribute('x-placement');

    this._popper.style.left = '';
    this._popper.style.position = '';
    this._popper.style.top = '';
    this._popper.style[getSupportedPropertyName('transform')] = '';

    this._removeEventListeners(); // remove the popper if user explicity asked for the deletion on destroy


    if (this._options.removeOnDestroy) {
      this._popper.remove();
    }

    return this;
  };
  /**
   * Updates the position of the popper, computing the new offsets and applying the new style
   * @method
   * @memberof Popper
   */


  Popper.prototype.update = function () {
    var data = {
      instance: this,
      styles: {}
    }; // store placement inside the data object, modifiers will be able to edit `placement` if needed
    // and refer to _originalPlacement to know the original value

    data.placement = this._options.placement;
    data._originalPlacement = this._options.placement; // compute the popper and reference offsets and put them inside data.offsets

    data.offsets = this._getOffsets(this._popper, this._reference, data.placement); // get boundaries

    data.boundaries = this._getBoundaries(data, this._options.boundariesPadding, this._options.boundariesElement);
    data = this.runModifiers(data, this._options.modifiers);

    if (typeof this.state.updateCallback === 'function') {
      this.state.updateCallback(data);
    }
  };
  /**
   * If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.
   * @method
   * @memberof Popper
   * @param {Function} callback
   */


  Popper.prototype.onCreate = function (callback) {
    // the createCallbacks return as first argument the popper instance
    callback(this);
    return this;
  };
  /**
   * If a function is passed, it will be executed after each update of popper with as first argument the set of coordinates and informations
   * used to style popper and its arrow.
   * NOTE: it doesn't get fired on the first call of the `Popper.update()` method inside the `Popper` constructor!
   * @method
   * @memberof Popper
   * @param {Function} callback
   */


  Popper.prototype.onUpdate = function (callback) {
    this.state.updateCallback = callback;
    return this;
  };
  /**
   * Helper used to generate poppers from a configuration file
   * @method
   * @memberof Popper
   * @param config {Object} configuration
   * @returns {HTMLElement} popper
   */


  Popper.prototype.parse = function (config) {
    var defaultConfig = {
      tagName: 'div',
      classNames: ['popper'],
      attributes: [],
      parent: root.document.body,
      content: '',
      contentType: 'text',
      arrowTagName: 'div',
      arrowClassNames: ['popper__arrow'],
      arrowAttributes: ['x-arrow']
    };
    config = Object.assign({}, defaultConfig, config);
    var d = root.document;
    var popper = d.createElement(config.tagName);
    addClassNames(popper, config.classNames);
    addAttributes(popper, config.attributes);

    if (config.contentType === 'node') {
      popper.appendChild(config.content.jquery ? config.content[0] : config.content);
    } else if (config.contentType === 'html') {
      popper.innerHTML = config.content;
    } else {
      popper.textContent = config.content;
    }

    if (config.arrowTagName) {
      var arrow = d.createElement(config.arrowTagName);
      addClassNames(arrow, config.arrowClassNames);
      addAttributes(arrow, config.arrowAttributes);
      popper.appendChild(arrow);
    }

    var parent = config.parent.jquery ? config.parent[0] : config.parent; // if the given parent is a string, use it to match an element
    // if more than one element is matched, the first one will be used as parent
    // if no elements are matched, the script will throw an error

    if (typeof parent === 'string') {
      parent = d.querySelectorAll(config.parent);

      if (parent.length > 1) {
        console.warn('WARNING: the given `parent` query(' + config.parent + ') matched more than one element, the first one will be used');
      }

      if (parent.length === 0) {
        throw 'ERROR: the given `parent` doesn\'t exists!';
      }

      parent = parent[0];
    } // if the given parent is a DOM nodes list or an array of nodes with more than one element,
    // the first one will be used as parent


    if (parent.length > 1 && parent instanceof Element === false) {
      console.warn('WARNING: you have passed as parent a list of elements, the first one will be used');
      parent = parent[0];
    } // append the generated popper to its parent


    parent.appendChild(popper);
    return popper;
    /**
     * Adds class names to the given element
     * @function
     * @ignore
     * @param {HTMLElement} target
     * @param {Array} classes
     */

    function addClassNames(element, classNames) {
      classNames.forEach(function (className) {
        element.classList.add(className);
      });
    }
    /**
     * Adds attributes to the given element
     * @function
     * @ignore
     * @param {HTMLElement} target
     * @param {Array} attributes
     * @example
     * addAttributes(element, [ 'data-info:foobar' ]);
     */


    function addAttributes(element, attributes) {
      attributes.forEach(function (attribute) {
        element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
      });
    }
  };
  /**
   * Helper used to get the position which will be applied to the popper
   * @method
   * @memberof Popper
   * @param config {HTMLElement} popper element
   * @param reference {HTMLElement} reference element
   * @returns {String} position
   */


  Popper.prototype._getPosition = function (popper, reference) {
    var container = getOffsetParent(reference);

    if (this._options.forceAbsolute) {
      return 'absolute';
    }

    if (this._options.forceFixed) {
      return 'fixed';
    } // Decide if the popper will be fixed
    // If the reference element is inside a fixed context, the popper will be fixed as well to allow them to scroll together


    var isParentFixed = isFixed(reference, container);
    return isParentFixed ? 'fixed' : 'absolute';
  };
  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper
   * @access private
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */


  Popper.prototype._getOffsets = function (popper, reference, placement) {
    placement = placement.split('-')[0];
    var popperOffsets = {};
    popperOffsets.position = this.state.position;
    var isParentFixed = popperOffsets.position === 'fixed'; //
    // Get reference element position
    //

    var referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper), isParentFixed); //
    // Get popper sizes
    //

    var popperRect = getOuterSizes(popper); //
    // Compute offsets of popper
    //
    // depending by the popper placement we have to compute its offsets slightly differently

    if (['right', 'left'].indexOf(placement) !== -1) {
      popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;

      if (placement === 'left') {
        popperOffsets.left = referenceOffsets.left - popperRect.width;
      } else {
        popperOffsets.left = referenceOffsets.right;
      }
    } else {
      popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;

      if (placement === 'top') {
        popperOffsets.top = referenceOffsets.top - popperRect.height;
      } else {
        popperOffsets.top = referenceOffsets.bottom;
      }
    } // Add width and height to our offsets object


    popperOffsets.width = popperRect.width;
    popperOffsets.height = popperRect.height;
    return {
      popper: popperOffsets,
      reference: referenceOffsets
    };
  };
  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper
   * @access private
   */


  Popper.prototype._setupEventListeners = function () {
    // NOTE: 1 DOM access here
    this.state.updateBound = this.update.bind(this);
    root.addEventListener('resize', this.state.updateBound); // if the boundariesElement is window we don't need to listen for the scroll event

    if (this._options.boundariesElement !== 'window') {
      var target = getScrollParent(this._reference); // here it could be both `body` or `documentElement` thanks to Firefox, we then check both

      if (target === root.document.body || target === root.document.documentElement) {
        target = root;
      }

      target.addEventListener('scroll', this.state.updateBound);
      this.state.scrollTarget = target;
    }
  };
  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper
   * @access private
   */


  Popper.prototype._removeEventListeners = function () {
    // NOTE: 1 DOM access here
    root.removeEventListener('resize', this.state.updateBound);

    if (this._options.boundariesElement !== 'window' && this.state.scrollTarget) {
      this.state.scrollTarget.removeEventListener('scroll', this.state.updateBound);
      this.state.scrollTarget = null;
    }

    this.state.updateBound = null;
  };
  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper
   * @access private
   * @param {Object} data - Object containing the property "offsets" generated by `_getOffsets`
   * @param {Number} padding - Boundaries padding
   * @param {Element} boundariesElement - Element used to define the boundaries
   * @returns {Object} Coordinates of the boundaries
   */


  Popper.prototype._getBoundaries = function (data, padding, boundariesElement) {
    // NOTE: 1 DOM access here
    var boundaries = {};
    var width, height;

    if (boundariesElement === 'window') {
      var body = root.document.body,
          html = root.document.documentElement;
      height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
      boundaries = {
        top: 0,
        right: width,
        bottom: height,
        left: 0
      };
    } else if (boundariesElement === 'viewport') {
      var offsetParent = getOffsetParent(this._popper);
      var scrollParent = getScrollParent(this._popper);
      var offsetParentRect = getOffsetRect(offsetParent); // Thanks the fucking native API, `document.body.scrollTop` & `document.documentElement.scrollTop`

      var getScrollTopValue = function getScrollTopValue(element) {
        return element == document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : element.scrollTop;
      };

      var getScrollLeftValue = function getScrollLeftValue(element) {
        return element == document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : element.scrollLeft;
      }; // if the popper is fixed we don't have to substract scrolling from the boundaries


      var scrollTop = data.offsets.popper.position === 'fixed' ? 0 : getScrollTopValue(scrollParent);
      var scrollLeft = data.offsets.popper.position === 'fixed' ? 0 : getScrollLeftValue(scrollParent);
      boundaries = {
        top: 0 - (offsetParentRect.top - scrollTop),
        right: root.document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
        bottom: root.document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
        left: 0 - (offsetParentRect.left - scrollLeft)
      };
    } else {
      if (getOffsetParent(this._popper) === boundariesElement) {
        boundaries = {
          top: 0,
          left: 0,
          right: boundariesElement.clientWidth,
          bottom: boundariesElement.clientHeight
        };
      } else {
        boundaries = getOffsetRect(boundariesElement);
      }
    }

    boundaries.left += padding;
    boundaries.right -= padding;
    boundaries.top = boundaries.top + padding;
    boundaries.bottom = boundaries.bottom - padding;
    return boundaries;
  };
  /**
   * Loop trough the list of modifiers and run them in order, each of them will then edit the data object
   * @method
   * @memberof Popper
   * @access public
   * @param {Object} data
   * @param {Array} modifiers
   * @param {Function} ends
   */


  Popper.prototype.runModifiers = function (data, modifiers, ends) {
    var modifiersToRun = modifiers.slice();

    if (ends !== undefined) {
      modifiersToRun = this._options.modifiers.slice(0, getArrayKeyIndex(this._options.modifiers, ends));
    }

    modifiersToRun.forEach(function (modifier) {
      if (isFunction(modifier)) {
        data = modifier.call(this, data);
      }
    }.bind(this));
    return data;
  };
  /**
   * Helper used to know if the given modifier depends from another one.
   * @method
   * @memberof Popper
   * @param {String} requesting - name of requesting modifier
   * @param {String} requested - name of requested modifier
   * @returns {Boolean}
   */


  Popper.prototype.isModifierRequired = function (requesting, requested) {
    var index = getArrayKeyIndex(this._options.modifiers, requesting);
    return !!this._options.modifiers.slice(0, index).filter(function (modifier) {
      return modifier === requested;
    }).length;
  }; //
  // Modifiers
  //

  /**
   * Modifiers list
   * @namespace Popper.modifiers
   * @memberof Popper
   * @type {Object}
   */


  Popper.prototype.modifiers = {};
  /**
   * Apply the computed styles to the popper element
   * @method
   * @memberof Popper.modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @returns {Object} The same data object
   */

  Popper.prototype.modifiers.applyStyle = function (data) {
    // apply the final offsets to the popper
    // NOTE: 1 DOM access here
    var styles = {
      position: data.offsets.popper.position
    }; // round top and left to avoid blurry text

    var left = Math.round(data.offsets.popper.left);
    var top = Math.round(data.offsets.popper.top); // if gpuAcceleration is set to true and transform is supported, we use `translate3d` to apply the position to the popper
    // we automatically use the supported prefixed version if needed

    var prefixedProperty;

    if (this._options.gpuAcceleration && (prefixedProperty = getSupportedPropertyName('transform'))) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles.top = 0;
      styles.left = 0;
    } // othwerise, we use the standard `left` and `top` properties
    else {
        styles.left = left;
        styles.top = top;
      } // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!


    Object.assign(styles, data.styles);
    setStyle(this._popper, styles); // set an attribute which will be useful to style the tooltip (use it to properly position its arrow)
    // NOTE: 1 DOM access here

    this._popper.setAttribute('x-placement', data.placement); // if the arrow modifier is required and the arrow style has been computed, apply the arrow style


    if (this.isModifierRequired(this.modifiers.applyStyle, this.modifiers.arrow) && data.offsets.arrow) {
      setStyle(data.arrowElement, data.offsets.arrow);
    }

    return data;
  };
  /**
   * Modifier used to shift the popper on the start or end of its reference element side
   * @method
   * @memberof Popper.modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @returns {Object} The data object, properly modified
   */


  Popper.prototype.modifiers.shift = function (data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftVariation = placement.split('-')[1]; // if shift shiftVariation is specified, run the modifier

    if (shiftVariation) {
      var reference = data.offsets.reference;
      var popper = getPopperClientRect(data.offsets.popper);
      var shiftOffsets = {
        y: {
          start: {
            top: reference.top
          },
          end: {
            top: reference.top + reference.height - popper.height
          }
        },
        x: {
          start: {
            left: reference.left
          },
          end: {
            left: reference.left + reference.width - popper.width
          }
        }
      };
      var axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';
      data.offsets.popper = Object.assign(popper, shiftOffsets[axis][shiftVariation]);
    }

    return data;
  };
  /**
   * Modifier used to make sure the popper does not overflows from it's boundaries
   * @method
   * @memberof Popper.modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @returns {Object} The data object, properly modified
   */


  Popper.prototype.modifiers.preventOverflow = function (data) {
    var order = this._options.preventOverflowOrder;
    var popper = getPopperClientRect(data.offsets.popper);
    var check = {
      left: function left() {
        var left = popper.left;

        if (popper.left < data.boundaries.left) {
          left = Math.max(popper.left, data.boundaries.left);
        }

        return {
          left: left
        };
      },
      right: function right() {
        var left = popper.left;

        if (popper.right > data.boundaries.right) {
          left = Math.min(popper.left, data.boundaries.right - popper.width);
        }

        return {
          left: left
        };
      },
      top: function top() {
        var top = popper.top;

        if (popper.top < data.boundaries.top) {
          top = Math.max(popper.top, data.boundaries.top);
        }

        return {
          top: top
        };
      },
      bottom: function bottom() {
        var top = popper.top;

        if (popper.bottom > data.boundaries.bottom) {
          top = Math.min(popper.top, data.boundaries.bottom - popper.height);
        }

        return {
          top: top
        };
      }
    };
    order.forEach(function (direction) {
      data.offsets.popper = Object.assign(popper, check[direction]());
    });
    return data;
  };
  /**
   * Modifier used to make sure the popper is always near its reference
   * @method
   * @memberof Popper.modifiers
   * @argument {Object} data - The data object generated by _update method
   * @returns {Object} The data object, properly modified
   */


  Popper.prototype.modifiers.keepTogether = function (data) {
    var popper = getPopperClientRect(data.offsets.popper);
    var reference = data.offsets.reference;
    var f = Math.floor;

    if (popper.right < f(reference.left)) {
      data.offsets.popper.left = f(reference.left) - popper.width;
    }

    if (popper.left > f(reference.right)) {
      data.offsets.popper.left = f(reference.right);
    }

    if (popper.bottom < f(reference.top)) {
      data.offsets.popper.top = f(reference.top) - popper.height;
    }

    if (popper.top > f(reference.bottom)) {
      data.offsets.popper.top = f(reference.bottom);
    }

    return data;
  };
  /**
   * Modifier used to flip the placement of the popper when the latter is starting overlapping its reference element.
   * Requires the `preventOverflow` modifier before it in order to work.
   * **NOTE:** This modifier will run all its previous modifiers everytime it tries to flip the popper!
   * @method
   * @memberof Popper.modifiers
   * @argument {Object} data - The data object generated by _update method
   * @returns {Object} The data object, properly modified
   */


  Popper.prototype.modifiers.flip = function (data) {
    // check if preventOverflow is in the list of modifiers before the flip modifier.
    // otherwise flip would not work as expected.
    if (!this.isModifierRequired(this.modifiers.flip, this.modifiers.preventOverflow)) {
      console.warn('WARNING: preventOverflow modifier is required by flip modifier in order to work, be sure to include it before flip!');
      return data;
    }

    if (data.flipped && data.placement === data._originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';
    var flipOrder = [];

    if (this._options.flipBehavior === 'flip') {
      flipOrder = [placement, placementOpposite];
    } else {
      flipOrder = this._options.flipBehavior;
    }

    flipOrder.forEach(function (step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);
      var popperOffsets = getPopperClientRect(data.offsets.popper); // this boolean is used to distinguish right and bottom from top and left
      // they need different computations to get flipped

      var a = ['right', 'bottom'].indexOf(placement) !== -1; // using Math.floor because the reference offsets may contain decimals we are not going to consider here

      if (a && Math.floor(data.offsets.reference[placement]) > Math.floor(popperOffsets[placementOpposite]) || !a && Math.floor(data.offsets.reference[placement]) < Math.floor(popperOffsets[placementOpposite])) {
        // we'll use this boolean to detect any flip loop
        data.flipped = true;
        data.placement = flipOrder[index + 1];

        if (variation) {
          data.placement += '-' + variation;
        }

        data.offsets.popper = this._getOffsets(this._popper, this._reference, data.placement).popper;
        data = this.runModifiers(data, this._options.modifiers, this._flip);
      }
    }.bind(this));
    return data;
  };
  /**
   * Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
   * The offsets will shift the popper on the side of its reference element.
   * @method
   * @memberof Popper.modifiers
   * @argument {Object} data - The data object generated by _update method
   * @returns {Object} The data object, properly modified
   */


  Popper.prototype.modifiers.offset = function (data) {
    var offset = this._options.offset;
    var popper = data.offsets.popper;

    if (data.placement.indexOf('left') !== -1) {
      popper.top -= offset;
    } else if (data.placement.indexOf('right') !== -1) {
      popper.top += offset;
    } else if (data.placement.indexOf('top') !== -1) {
      popper.left -= offset;
    } else if (data.placement.indexOf('bottom') !== -1) {
      popper.left += offset;
    }

    return data;
  };
  /**
   * Modifier used to move the arrows on the edge of the popper to make sure them are always between the popper and the reference element
   * It will use the CSS outer size of the arrow element to know how many pixels of conjuction are needed
   * @method
   * @memberof Popper.modifiers
   * @argument {Object} data - The data object generated by _update method
   * @returns {Object} The data object, properly modified
   */


  Popper.prototype.modifiers.arrow = function (data) {
    var arrow = this._options.arrowElement;
    var arrowOffset = this._options.arrowOffset; // if the arrowElement is a string, suppose it's a CSS selector

    if (typeof arrow === 'string') {
      arrow = this._popper.querySelector(arrow);
    } // if arrow element is not found, don't run the modifier


    if (!arrow) {
      return data;
    } // the arrow element must be child of its popper


    if (!this._popper.contains(arrow)) {
      console.warn('WARNING: `arrowElement` must be child of its popper element!');
      return data;
    } // arrow depends on keepTogether in order to work


    if (!this.isModifierRequired(this.modifiers.arrow, this.modifiers.keepTogether)) {
      console.warn('WARNING: keepTogether modifier is required by arrow modifier in order to work, be sure to include it before arrow!');
      return data;
    }

    var arrowStyle = {};
    var placement = data.placement.split('-')[0];
    var popper = getPopperClientRect(data.offsets.popper);
    var reference = data.offsets.reference;
    var isVertical = ['left', 'right'].indexOf(placement) !== -1;
    var len = isVertical ? 'height' : 'width';
    var side = isVertical ? 'top' : 'left';
    var translate = isVertical ? 'translateY' : 'translateX';
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowSize = getOuterSizes(arrow)[len]; //
    // extends keepTogether behavior making sure the popper and its reference have enough pixels in conjuction
    //
    // top/left side

    if (reference[opSide] - arrowSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowSize);
    } // bottom/right side


    if (reference[side] + arrowSize > popper[opSide]) {
      data.offsets.popper[side] += reference[side] + arrowSize - popper[opSide];
    } // compute center of the popper


    var center = reference[side] + (arrowOffset || reference[len] / 2 - arrowSize / 2);
    var sideValue = center - popper[side]; // prevent arrow from being placed not contiguously to its popper

    sideValue = Math.max(Math.min(popper[len] - arrowSize - 8, sideValue), 8);
    arrowStyle[side] = sideValue;
    arrowStyle[altSide] = ''; // make sure to remove any old style from the arrow

    data.offsets.arrow = arrowStyle;
    data.arrowElement = arrow;
    return data;
  }; //
  // Helpers
  //

  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @function
   * @ignore
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */


  function getOuterSizes(element) {
    // NOTE: 1 DOM access here
    var _display = element.style.display,
        _visibility = element.style.visibility;
    element.style.display = 'block';
    element.style.visibility = 'hidden';
    var calcWidthToForceRepaint = element.offsetWidth; // original method

    var styles = root.getComputedStyle(element);
    var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    var result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x
    }; // reset element styles

    element.style.display = _display;
    element.style.visibility = _visibility;
    return result;
  }
  /**
   * Get the opposite placement of the given one/
   * @function
   * @ignore
   * @argument {String} placement
   * @returns {String} flipped placement
   */


  function getOppositePlacement(placement) {
    var hash = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash[matched];
    });
  }
  /**
   * Given the popper offsets, generate an output similar to getBoundingClientRect
   * @function
   * @ignore
   * @argument {Object} popperOffsets
   * @returns {Object} ClientRect like output
   */


  function getPopperClientRect(popperOffsets) {
    var offsets = Object.assign({}, popperOffsets);
    offsets.right = offsets.left + offsets.width;
    offsets.bottom = offsets.top + offsets.height;
    return offsets;
  }
  /**
   * Given an array and the key to find, returns its index
   * @function
   * @ignore
   * @argument {Array} arr
   * @argument keyToFind
   * @returns index or null
   */


  function getArrayKeyIndex(arr, keyToFind) {
    var i = 0,
        key;

    for (key in arr) {
      if (arr[key] === keyToFind) {
        return i;
      }

      i++;
    }

    return null;
  }
  /**
   * Get CSS computed property of the given element
   * @function
   * @ignore
   * @argument {Eement} element
   * @argument {String} property
   */


  function getStyleComputedProperty(element, property) {
    // NOTE: 1 DOM access here
    var css = root.getComputedStyle(element, null);
    return css[property];
  }
  /**
   * Returns the offset parent of the given element
   * @function
   * @ignore
   * @argument {Element} element
   * @returns {Element} offset parent
   */


  function getOffsetParent(element) {
    // NOTE: 1 DOM access here
    var offsetParent = element.offsetParent;
    return offsetParent === root.document.body || !offsetParent ? root.document.documentElement : offsetParent;
  }
  /**
   * Returns the scrolling parent of the given element
   * @function
   * @ignore
   * @argument {Element} element
   * @returns {Element} offset parent
   */


  function getScrollParent(element) {
    var parent = element.parentNode;

    if (!parent) {
      return element;
    }

    if (parent === root.document) {
      // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
      // greater than 0 and return the proper element
      if (root.document.body.scrollTop || root.document.body.scrollLeft) {
        return root.document.body;
      } else {
        return root.document.documentElement;
      }
    } // Firefox want us to check `-x` and `-y` variations as well


    if (['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 || ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1) {
      // If the detected scrollParent is body, we perform an additional check on its parentNode
      // in this way we'll get body if the browser is Chrome-ish, or documentElement otherwise
      // fixes issue #65
      return parent;
    }

    return getScrollParent(element.parentNode);
  }
  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @function
   * @ignore
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */


  function isFixed(element) {
    if (element === root.document.body) {
      return false;
    }

    if (getStyleComputedProperty(element, 'position') === 'fixed') {
      return true;
    }

    return element.parentNode ? isFixed(element.parentNode) : element;
  }
  /**
   * Set the style to the given popper
   * @function
   * @ignore
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles - Object with a list of properties and values which will be applied to the element
   */


  function setStyle(element, styles) {
    function is_numeric(n) {
      return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
    }

    Object.keys(styles).forEach(function (prop) {
      var unit = ''; // add unit if the value is numeric and is one of the following

      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
        unit = 'px';
      }

      element.style[prop] = styles[prop] + unit;
    });
  }
  /**
   * Check if the given variable is a function
   * @function
   * @ignore
   * @argument {*} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */


  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }
  /**
   * Get the position of the given element, relative to its offset parent
   * @function
   * @ignore
   * @param {Element} element
   * @return {Object} position - Coordinates of the element and its `scrollTop`
   */


  function getOffsetRect(element) {
    var elementRect = {
      width: element.offsetWidth,
      height: element.offsetHeight,
      left: element.offsetLeft,
      top: element.offsetTop
    };
    elementRect.right = elementRect.left + elementRect.width;
    elementRect.bottom = elementRect.top + elementRect.height; // position

    return elementRect;
  }
  /**
   * Get bounding client rect of given element
   * @function
   * @ignore
   * @param {HTMLElement} element
   * @return {Object} client rect
   */


  function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect(); // whether the IE version is lower than 11

    var isIE = navigator.userAgent.indexOf("MSIE") != -1; // fix ie document bounding top always 0 bug

    var rectTop = isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top;
    return {
      left: rect.left,
      top: rectTop,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.right - rect.left,
      height: rect.bottom - rectTop
    };
  }
  /**
   * Given an element and one of its parents, return the offset
   * @function
   * @ignore
   * @param {HTMLElement} element
   * @param {HTMLElement} parent
   * @return {Object} rect
   */


  function getOffsetRectRelativeToCustomParent(element, parent, fixed) {
    var elementRect = getBoundingClientRect(element);
    var parentRect = getBoundingClientRect(parent);

    if (fixed) {
      var scrollParent = getScrollParent(parent);
      parentRect.top += scrollParent.scrollTop;
      parentRect.bottom += scrollParent.scrollTop;
      parentRect.left += scrollParent.scrollLeft;
      parentRect.right += scrollParent.scrollLeft;
    }

    var rect = {
      top: elementRect.top - parentRect.top,
      left: elementRect.left - parentRect.left,
      bottom: elementRect.top - parentRect.top + elementRect.height,
      right: elementRect.left - parentRect.left + elementRect.width,
      width: elementRect.width,
      height: elementRect.height
    };
    return rect;
  }
  /**
   * Get the prefixed supported property name
   * @function
   * @ignore
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase)
   */


  function getSupportedPropertyName(property) {
    var prefixes = ['', 'ms', 'webkit', 'moz', 'o'];

    for (var i = 0; i < prefixes.length; i++) {
      var toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;

      if (typeof root.document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }

    return null;
  }
  /**
   * The Object.assign() method is used to copy the values of all enumerable own properties from one or more source
   * objects to a target object. It will return the target object.
   * This polyfill doesn't support symbol properties, since ES5 doesn't have symbols anyway
   * Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   * @function
   * @ignore
   */


  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function value(target) {
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert first argument to object');
        }

        var to = Object(target);

        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i];

          if (nextSource === undefined || nextSource === null) {
            continue;
          }

          nextSource = Object(nextSource);
          var keysArray = Object.keys(nextSource);

          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }

        return to;
      }
    });
  }

  return Popper;
});
;

(function () {
  Vue.component('popup-component', {
    name: 'Popup',
    template: '<div class="jz_popup">' + '<div class="jz_popup_container">' + '<slot></slot>' + '</div>' + '<div class="jz_popup_mask" @click="maskClick"></div>' + '</div>',
    methods: {
      maskClick: function maskClick(e) {
        this.$emit('mask-click', e);
      }
    }
  });
})();
/*!
* radio-group组件
*/
;

(function () {
  var prefixCls = 'jz-radio-group';
  Vue.component('radio-group-component', {
    name: 'RadioGroup',
    template: '<div :class="classesWrapper">' + '<slot></slot>' + '</div>',
    props: {
      value: {
        type: [String, Number, Boolean]
      },
      classes: String
    },
    data: function data() {
      return {
        currentValue: this.value,
        childrens: [],
        cache: this.value
      };
    },
    computed: {
      classesWrapper: function classesWrapper() {
        var wrapClasses = {};
        wrapClasses[prefixCls] = prefixCls;
        wrapClasses[this.classes] = !!this.classes;
        return wrapClasses;
      }
    },
    mounted: function mounted() {
      this.updateValue();
    },
    methods: {
      updateValue: function updateValue() {
        var value = this.value;
        this.childrens = vue_utils.findComponentsDownward(this, 'Radio');

        if (this.childrens) {
          this.childrens.forEach(function (child) {
            child.currentValue = value == child.label;
            child.group = true;
          });
        }
      },
      change: function change(data) {
        this.currentValue = data.value;
        this.updateValue();
        this.$emit('input', data.value);
        this.$emit('on-change', data.value);
        this.$emit('on-undo', data.value, this.cache);
        this.cache = this.currentValue; //vue_utils.dispatch(this, 'on-form-change', data.value);
      }
    },
    watch: {
      value: function value(val, oldVal) {
        this.cache = val;
        this.updateValue();
      }
    }
  });
})();
/*!radio组件
 *	页面插入（选项组示例，具体例子可参照banner 2.0 的编辑页的高级设置）：
 *	<radio-group-component v-model="？" v-on:on-change="？">
 *		<radio-component label="？" >？</radio-component>
 *		<radio-component label="？" >？</radio-component>
 *	</radio-group-component>
 * 
 * 单独使用: 使用 v-model 可以双向绑定数据。
 * 组合使用: 使用Radio-group实现一组互斥的选项组。在组合使用时，Radio 使用 label 来自动判断。每个 Radio 的内容可以自定义，如不填写则默认使用 label 的值。详见radio-group.js
 * 属性参数如下：
 * 		value：	只在单独使用时有效。可以使用 v-model 双向绑定数据	Boolean
 *		label：	只在组合使用时有效。指定当前选项的 value 值，组合会自动判断当前选择的项目	String | Number	| Boolean
 *		disabled：  是否禁用当前项  Boolean   
 * 事件：响应父组件事件
 * input
 * on-change        
 */
;

(function () {
  var prefixCls = 'jz-radio';
  Vue.component('radio-component', {
    name: 'Radio',
    template: '<label :disabled="disabled" :class="wrapClasses" >' + '<span :class="radioClasses">' + '<span :class="innerClasses"></span>' + '<input type="radio" :class="inputClasses" :checked="currentValue" @change="change">' + '</span>' + '<span :class="textClasses">' + '<slot>{{ label }}</slot>' + '</span>' + '</label>',
    props: {
      value: Boolean,
      label: {
        type: [String, Number, Boolean]
      },
      disabled: Boolean
    },
    data: function data() {
      return {
        currentValue: this.value,
        group: false,
        parent: vue_utils.findComponentUpward(this, 'RadioGroup')
      };
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls + "-wrapper"] = true;
        wrapClasses[prefixCls + "-group-item"] = !!this.group;
        wrapClasses[prefixCls + "-wrapper-checked"] = !!this.currentValue;
        return wrapClasses;
      },
      radioClasses: function radioClasses() {
        var radioClasses = {};
        radioClasses[prefixCls] = true;
        radioClasses[prefixCls + "-checked"] = !!this.currentValue;
        return radioClasses;
      },
      innerClasses: function innerClasses() {
        return prefixCls + "-inner";
      },
      inputClasses: function inputClasses() {
        return prefixCls + "-input";
      },
      textClasses: function textClasses() {
        var textClasses = {};
        textClasses[prefixCls + "-text"] = true;
        return textClasses;
      }
    },
    mounted: function mounted() {
      if (this.parent) this.group = true;

      if (!this.group) {
        this.updateValue();
      } else {
        this.parent.updateValue();
      }
    },
    methods: {
      change: function change(event) {
        if (this.disabled) {
          return false;
        }

        var checked = event.target.checked;
        this.currentValue = checked;
        this.$emit('input', checked);

        if (this.group && this.label !== undefined) {
          this.parent.change({
            value: this.label,
            checked: this.value
          });
        }

        if (!this.group) {
          this.$emit('on-change', checked); //vue_utils.dispatch(this, 'on-form-change', checked);
        }
      },
      updateValue: function updateValue() {
        this.currentValue = this.value;
      }
    },
    watch: {
      value: function value() {
        this.updateValue();
      }
    }
  });
})();
;

(function (global, factory) {
  if (typeof window !== 'undefined') {
    global.ResizeDetector = factory();
  }
})(this, function () {
  'use strict';

  var raf = null;

  function requestAnimationFrame(callback) {
    if (!raf) {
      // binding to window is necessary to make hot reload work in IE in strict mode
      raf = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        return setTimeout(callback, 16);
      }).bind(window);
    }

    return raf(callback);
  }

  var caf = null;

  function cancelAnimationFrame(id) {
    if (!caf) {
      // binding to window is necessary to make hot reload work in IE in strict mode
      caf = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (id) {
        clearTimeout(id);
      }).bind(window);
    }

    caf(id);
  }

  ;

  function createStyles(styleText) {
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = styleText;
    } else {
      style.appendChild(document.createTextNode(styleText));
    }

    (document.querySelector('head') || document.body).appendChild(style);
    return style;
  }

  function createElement(tagName, props) {
    props = props || {};
    var elem = document.createElement(tagName);
    Object.keys(props).forEach(function (key) {
      elem[key] = props[key];
    });
    return elem;
  }

  function getComputedStyle(elem, prop, pseudo) {
    // for older versions of Firefox, `getComputedStyle` required
    // the second argument and may return `null` for some elements
    // when `display: none`
    var computedStyle = window.getComputedStyle(elem, pseudo || null) || {
      display: 'none'
    };
    return computedStyle[prop];
  }

  function getRenderInfo(elem) {
    if (!document.documentElement.contains(elem)) {
      return {
        detached: true,
        rendered: false
      };
    }

    var current = elem;

    while (current !== document) {
      if (getComputedStyle(current, 'display') === 'none') {
        return {
          detached: false,
          rendered: false
        };
      }

      current = current.parentNode;
    }

    return {
      detached: false,
      rendered: true
    };
  }

  var triggerStyles = '.resize-triggers{visibility:hidden;opacity:0;}' + '.resize-triggers, .resize-expand-trigger, .resize-contract-trigger, .resize-contract-trigger:before{' + 'content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;}' + '.resize-expand-trigger, .resize-contract-trigger{background:#eee;overflow:auto;}' + '.resize-contract-trigger:before{width:200%;height:200%;}';
  var total = 0;
  var style = null;

  function addListener(elem, callback) {
    if (!elem.__resize_mutation_handler__) {
      elem.__resize_mutation_handler__ = handleMutation.bind(elem);
    }

    var listeners = elem.__resize_listeners__;

    if (!listeners) {
      elem.__resize_listeners__ = [];

      if (window.ResizeObserver) {
        var offsetWidth = elem.offsetWidth,
            offsetHeight = elem.offsetHeight;
        var ro = new ResizeObserver(function () {
          if (!elem.__resize_observer_triggered__) {
            elem.__resize_observer_triggered__ = true;

            if (elem.offsetWidth === offsetWidth && elem.offsetHeight === offsetHeight) {
              return;
            }
          }

          runCallbacks(elem);
        }); // initially display none won't trigger ResizeObserver callback

        var _getRenderInfo = getRenderInfo(elem),
            detached = _getRenderInfo.detached,
            rendered = _getRenderInfo.rendered;

        elem.__resize_observer_triggered__ = detached === false && rendered === false;
        elem.__resize_observer__ = ro;
        ro.observe(elem);
      } else if (elem.attachEvent && elem.addEventListener) {
        // targeting IE9/10
        elem.__resize_legacy_resize_handler__ = function handleLegacyResize() {
          runCallbacks(elem);
        };

        elem.attachEvent('onresize', elem.__resize_legacy_resize_handler__);
        document.addEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__);
      } else {
        if (!total) {
          style = createStyles(triggerStyles);
        }

        initTriggers(elem);
        elem.__resize_rendered__ = getRenderInfo(elem).rendered;

        if (window.MutationObserver) {
          var mo = new MutationObserver(elem.__resize_mutation_handler__);
          mo.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
          elem.__resize_mutation_observer__ = mo;
        }
      }
    }

    elem.__resize_listeners__.push(callback);

    total++;
  }

  function removeListener(elem, callback) {
    // targeting IE9/10
    if (elem.detachEvent && elem.removeEventListener) {
      elem.detachEvent('onresize', elem.__resize_legacy_resize_handler__);
      document.removeEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__);
      return;
    }

    var listeners = elem.__resize_listeners__;

    if (!listeners) {
      return;
    }

    listeners.splice(listeners.indexOf(callback), 1);

    if (!listeners.length) {
      if (elem.__resize_observer__) {
        elem.__resize_observer__.unobserve(elem);

        elem.__resize_observer__.disconnect();

        elem.__resize_observer__ = null;
      } else {
        if (elem.__resize_mutation_observer__) {
          elem.__resize_mutation_observer__.disconnect();

          elem.__resize_mutation_observer__ = null;
        }

        elem.removeEventListener('scroll', handleScroll);
        elem.removeChild(elem.__resize_triggers__.triggers);
        elem.__resize_triggers__ = null;
      }

      elem.__resize_listeners__ = null;
    }

    if (! --total && style) {
      style.parentNode.removeChild(style);
    }
  }

  function getUpdatedSize(elem) {
    var _elem$__resize_last__ = elem.__resize_last__,
        width = _elem$__resize_last__.width,
        height = _elem$__resize_last__.height;
    var offsetWidth = elem.offsetWidth,
        offsetHeight = elem.offsetHeight;

    if (offsetWidth !== width || offsetHeight !== height) {
      return {
        width: offsetWidth,
        height: offsetHeight
      };
    }

    return null;
  }

  function handleMutation() {
    // `this` denotes the scrolling element
    var _getRenderInfo2 = getRenderInfo(this),
        rendered = _getRenderInfo2.rendered,
        detached = _getRenderInfo2.detached;

    if (rendered !== this.__resize_rendered__) {
      if (!detached && this.__resize_triggers__) {
        resetTriggers(this);
        this.addEventListener('scroll', handleScroll, true);
      }

      this.__resize_rendered__ = rendered;
      runCallbacks(this);
    }
  }

  function handleScroll() {
    var _this = this; // `this` denotes the scrolling element


    resetTriggers(this);

    if (this.__resize_raf__) {
      cancelAnimationFrame(this.__resize_raf__);
    }

    this.__resize_raf__ = requestAnimationFrame(function () {
      var updated = getUpdatedSize(_this);

      if (updated) {
        _this.__resize_last__ = updated;
        runCallbacks(_this);
      }
    });
  }

  function runCallbacks(elem) {
    elem.__resize_listeners__.forEach(function (callback) {
      callback.call(elem);
    });
  }

  function initTriggers(elem) {
    var position = getComputedStyle(elem, 'position');

    if (!position || position === 'static') {
      elem.style.position = 'relative';
    }

    elem.__resize_old_position__ = position;
    elem.__resize_last__ = {};
    var triggers = createElement('div', {
      className: 'resize-triggers'
    });
    var expand = createElement('div', {
      className: 'resize-expand-trigger'
    });
    var expandChild = createElement('div');
    var contract = createElement('div', {
      className: 'resize-contract-trigger'
    });
    expand.appendChild(expandChild);
    triggers.appendChild(expand);
    triggers.appendChild(contract);
    elem.appendChild(triggers);
    elem.__resize_triggers__ = {
      triggers: triggers,
      expand: expand,
      expandChild: expandChild,
      contract: contract
    };
    resetTriggers(elem);
    elem.addEventListener('scroll', handleScroll, true);
    elem.__resize_last__ = {
      width: elem.offsetWidth,
      height: elem.offsetHeight
    };
  }

  function resetTriggers(elem) {
    var _elem$__resize_trigge = elem.__resize_triggers__,
        expand = _elem$__resize_trigge.expand,
        expandChild = _elem$__resize_trigge.expandChild,
        contract = _elem$__resize_trigge.contract; // batch read

    var csw = contract.scrollWidth,
        csh = contract.scrollHeight;
    var eow = expand.offsetWidth,
        eoh = expand.offsetHeight,
        esw = expand.scrollWidth,
        esh = expand.scrollHeight; // batch write

    contract.scrollLeft = csw;
    contract.scrollTop = csh;
    expandChild.style.width = eow + 1 + 'px';
    expandChild.style.height = eoh + 1 + 'px';
    expand.scrollLeft = esw;
    expand.scrollTop = esh;
  }

  return {
    addListener: addListener,
    removeListener: removeListener
  };
});
/*
 *	Scrollbar 滚动条组件
 *	Props
 *		theme 主题名，内置的主题样式名称
 *		maxHeight 流体高度，当内容高度超过这个高度时才会出现滚动条
 *		visible 滚动条是否可见
 *		horizontal 是否开启横向滚动条
 *	Event
 *		@scroll-end 滚动到底部了
 *		@scroll 滚动中
 *	Example
 *		<scrollbar-component theme="popup">
 *			<ul><li v-for="item in list"></li><ul>
 *		</scrollbar-component>
 */
;

(function (global, factory) {
  if (typeof global.Vue !== 'undefined') {
    global.Vue.component('scrollbar-component', function (resolve) {
      return resolve(factory(global));
    });
  }
})(this, function (global) {
  return {
    name: 'Scrollbar',
    props: {
      theme: {
        type: String,
        'default': 'default'
      },
      maxHeight: Number,
      // maxWidth: Number,
      horizontal: Boolean,
      visible: {
        type: Boolean,
        'default': true
      }
    },
    data: function data() {
      return {
        thumbTop: 0,
        thumbHeight: 0,
        thumbLeft: 0,
        thumbWidth: 0,
        isVerticalThumbActive: false,
        isHorizontalThumbActive: false,
        isVerticalTrackHidden: false,
        isHorizontalTrackHidden: false,
        isScrollbarHover: false,
        scrollbarWidth: 0
      };
    },
    template: '<div class="jz_scrollbar"' + ' @mouseenter="mouseenterScrollBarHandler"' + ' @mouseleave="mouseleaveScrollBarHandler"' + ' :style="scrollbarStyle"' + ' :class="scrollbarClass"' + '>' + '<div class="jz_scrollbar__wrap" :class="wrapClass" :style="wrapStyle" @scroll="scrollWrapHandler" ref="wrap" v-resize="update">' + '<div class="jz_scrollbar__resize" :class="resizeClass" v-resize="update">' + '<div class="jz_scrollbar__view" :class="viewClass">' + '<slot></slot>' + '</div>' + '</div>' + '</div>' + '<div :data-theme="theme" :class="themeClass">' + '<div class="jz_scrollbar__track jz_scrollbar__track--vertical" :class="verticalTrackClass" ref="track">' + '<div class="jz_scrollbar__thumb jz_scrollbar__thumb--vertical" :class="verticalThumbClass" :style="thumbStyle" @mousedown.stop="mousedownThumbHandler"></div>' + '</div>' + '<div v-if="horizontal" class="jz_scrollbar__track jz_scrollbar__track--horizontal" :class="horizontalTrackClass" ref="horizontalTrack">' + '<div class="jz_scrollbar__thumb jz_scrollbar__thumb--horizontal" :class="horizontalThumbClass" :style="horizontalThumbStyle" @mousedown.stop="mousedownHorizontalThumbHandler"></div>' + '</div>' + '</div>' + '</div>',
    computed: {
      scrollbarStyle: function scrollbarStyle() {
        return {
          // 'max-width': (this.maxWidth + 'px') || null,
          'max-height': this.maxHeight + 'px' || null
        };
      },
      wrapStyle: function wrapStyle() {
        return {
          'margin-right': '-' + this.scrollbarWidth + 'px',
          'margin-bottom': '-' + this.scrollbarWidth + 'px',
          'height': 'calc(100% + ' + this.scrollbarWidth + 'px)',
          // 'max-width': this.maxWidth ? (this.maxWidth + this.scrollbarWidth + 'px') : null,
          'max-height': this.maxHeight ? this.maxHeight + this.scrollbarWidth + 'px' : null
        };
      },
      themeClass: function themeClass() {
        return {
          'jz_scrollbar__theme--tabs': this.theme == 'tabs',
          'jz_scrollbar__theme--popup': this.theme == 'popup',
          'jz_scrollbar__theme--select': this.theme == 'select',
          'jz_scrollbar__theme--table': this.theme == 'table',
          'jz_scrollbar__theme--menu': this.theme == 'menu'
        };
      },
      scrollbarClass: function scrollbarClass() {
        return {
          'jz_scrollbar--theme_table': this.theme == 'table'
        };
      },
      wrapClass: function wrapClass() {
        return {
          'jz_scrollbar__wrap--theme_table': this.theme == 'table',
          'jz_scrollbar__wrap--horizontal': this.horizontal
        };
      },
      resizeClass: function resizeClass() {
        return {
          'jz_scrollbar__resize--horizontal': this.horizontal,
          'jz_scrollbar__resize--theme_table': this.theme == 'table'
        };
      },
      viewClass: function viewClass() {
        return {
          'jz_scrollbar__view--horizontal': this.horizontal,
          'jz_scrollbar__view--theme_table': this.theme == 'table'
        };
      },
      verticalTrackClass: function verticalTrackClass() {
        return {
          'jz_scrollbar__track--active': this.isScrollbarHover || this.isVerticalThumbActive,
          'jz_scrollbar__track--hidden': this.isVerticalTrackHidden || !this.visible
        };
      },
      horizontalTrackClass: function horizontalTrackClass() {
        return {
          'jz_scrollbar__track--active': this.isScrollbarHover || this.isHorizontalThumbActive,
          'jz_scrollbar__track--hidden': this.isHorizontalTrackHidden || !this.visible
        };
      },
      verticalThumbClass: function verticalThumbClass() {
        return {
          'jz_scrollbar__thumb--active': this.isVerticalThumbActive
        };
      },
      horizontalThumbClass: function horizontalThumbClass() {
        return {
          'jz_scrollbar__thumb--active': this.isHorizontalThumbActive
        };
      },
      thumbStyle: function thumbStyle() {
        return {
          top: this.proxyThumbTop + 'px',
          height: this.proxyThumbHeight + 'px'
        };
      },
      horizontalThumbStyle: function horizontalThumbStyle() {
        return {
          left: this.proxyThumbLeft + 'px',
          width: this.proxyThumbWidth + 'px'
        };
      },
      proxyThumbTop: {
        get: function get() {
          return this.thumbTop;
        },
        set: function set(value) {
          var val = Math.round(value),
              maxThumbTop = this.$refs.track.clientHeight - this.proxyThumbHeight;
          this.thumbTop = val < 0 ? 0 : val > maxThumbTop ? maxThumbTop : val;
        }
      },
      proxyThumbLeft: {
        get: function get() {
          return this.thumbLeft;
        },
        set: function set(value) {
          var val = Math.round(value),
              maxThumbLeft = this.$refs.horizontalTrack.clientWidth - this.proxyThumbWidth;
          this.thumbLeft = val < 0 ? 0 : val > maxThumbLeft ? maxThumbLeft : val;
        }
      },
      proxyThumbHeight: {
        get: function get() {
          return this.thumbHeight;
        },
        set: function set(value) {
          var val = Math.round(value),
              minThumbHeight = 30;
          this.thumbHeight = val < minThumbHeight ? minThumbHeight : val;
        }
      },
      proxyThumbWidth: {
        get: function get() {
          return this.thumbWidth;
        },
        set: function set(value) {
          var val = Math.round(value),
              minThumbWidth = 30;
          this.thumbWidth = val < minThumbWidth ? minThumbWidth : val;
        }
      }
    },
    watch: {
      thumbTop: function thumbTop(value) {
        if (value + this.thumbHeight == this.$refs.track.clientHeight) {
          this.$emit('scroll-end');
        }
      }
    },
    methods: {
      update: function update() {
        var refs = this.$refs,
            wrap = refs.wrap,
            track = refs.track;
        if (!wrap) return; // 时常有把iframe内的代码生成的dom添加到外部window中去，而两者的css影响的滚动条尺寸是不一样的
        
        this.scrollbarWidth = global.vue_utils.scrollbarWidth(wrap.ownerDocument.body);
        this.isVerticalTrackHidden = wrap.clientHeight === 0 || wrap.clientHeight >= wrap.scrollHeight; // 公式：thumbHeight / trackClientHeight = wrapClientHeight / wrapScrollHeight

        this.proxyThumbHeight = wrap.clientHeight / wrap.scrollHeight * track.clientHeight; // 比例尺

        this.ratio = (wrap.scrollHeight - wrap.clientHeight) / (track.clientHeight - this.proxyThumbHeight);
        this.proxyThumbTop = wrap.scrollTop / this.ratio;

        if (this.horizontal) {
          var horizontalTrack = refs.horizontalTrack;
          this.isHorizontalTrackHidden = wrap.clientWidth === 0 || wrap.clientWidth >= wrap.scrollWidth;
          this.proxyThumbWidth = wrap.clientWidth / wrap.scrollWidth * horizontalTrack.clientWidth;
          this.horizontalRatio = (wrap.scrollWidth - wrap.clientWidth) / (horizontalTrack.clientWidth - this.proxyThumbWidth);
          this.proxyThumbLeft = wrap.scrollLeft / this.horizontalRatio;
        }
      },
      mousedownThumbHandler: function mousedownThumbHandler(e) {
        this.prevClientY = e.clientY;
        global.vue_utils.on(document, 'mousemove', this.mousemoveDocumentHandler);
        global.vue_utils.on(document, 'mouseup', this.mouseupDocumentHandler);
        this.isVerticalThumbActive = true;
      },
      mousemoveDocumentHandler: function mousemoveDocumentHandler(e) {
        this.proxyThumbTop += e.clientY - this.prevClientY;
        this.prevClientY = e.clientY; // DOM access

        this.$refs.wrap.scrollTop = this.proxyThumbTop * this.ratio; // this.scrollEnd();
      },
      mouseupDocumentHandler: function mouseupDocumentHandler() {
        global.vue_utils.off(document, 'mousemove', this.mousemoveDocumentHandler);
        global.vue_utils.off(document, 'mouseup', this.mouseupDocumentHandler);
        this.isVerticalThumbActive = false;
      },
      mousedownHorizontalThumbHandler: function mousedownHorizontalThumbHandler(e) {
        this.prevClientX = e.clientX;
        global.vue_utils.on(document, 'mousemove', this.mousemoveDocumentHandlerHorizontal);
        global.vue_utils.on(document, 'mouseup', this.mouseupDocumentHandlerHorizontal);
        this.isHorizontalThumbActive = true;
      },
      mousemoveDocumentHandlerHorizontal: function mousemoveDocumentHandlerHorizontal(e) {
        this.proxyThumbLeft += e.clientX - this.prevClientX;
        this.prevClientX = e.clientX; // DOM access

        this.$refs.wrap.scrollLeft = this.proxyThumbLeft * this.horizontalRatio;
      },
      mouseupDocumentHandlerHorizontal: function mouseupDocumentHandlerHorizontal() {
        global.vue_utils.off(document, 'mousemove', this.mousemoveDocumentHandlerHorizontal);
        global.vue_utils.off(document, 'mouseup', this.mouseupDocumentHandlerHorizontal);
        this.isHorizontalThumbActive = false;
      },
      scrollWrapHandler: function scrollWrapHandler(e) {
        // DOM access
        this.proxyThumbTop = this.$refs.wrap.scrollTop / this.ratio;

        if (this.horizontal) {
          this.proxyThumbLeft = this.$refs.wrap.scrollLeft / this.horizontalRatio;
        }

        this.$emit('scroll', e);
      },
      mouseenterScrollBarHandler: function mouseenterScrollBarHandler() {
        this.isScrollbarHover = true;
      },
      mouseleaveScrollBarHandler: function mouseleaveScrollBarHandler() {
        this.isScrollbarHover = false;
      },
      // 操作滚动位置的方法
      scrollTo: function scrollTo(value) {
        this.$refs.wrap.scrollTop = value;
      },
      scrollToEnd: function scrollToEnd() {
        var wrap = this.$refs.wrap;
        this.scrollTo(wrap.scrollHeight - wrap.clientHeight);
      },
      scrollToDOM: function scrollToDOM(dom) {
        this.scrollTo(dom.offsetTop);
      }
    },
    mounted: function mounted() {
      this.$nextTick(this.update); // 对外暴露方法：

      this.$on('update', this.update); // update事件更新滚动条高度

      this.$on('scrollToEnd', this.scrollToEnd); // 滚动到底部

      this.$on('scrollToDOM', this.scrollToDOM); // 滚动到某个DOM节点

      this.$on('scrollTo', this.scrollTo); // 滚动到某个高度
    }
  };
});
/*
 *	选择控件(下拉带层级)
 */
;

(function () {
  Vue.component('select-column-component', {
    template: '<select-component :value="value" @input="inputHandler" placement="bottom" class="jz-select-column">' + '<select-item-component v-for="(column, index) in data" :value="column[valueAlias]" :key="index">' + '<div class="select-column" :class="\'select-column-level\' + column[levelAlias]">' + '<i v-if="column[levelAlias] > 0" class="select-column-icon"></i>' + '<span class="select-column-text">{{column[labelAlias]}}</span>' + '</div>' + '</select-item-component>' + '</select-component>',
    props: {
      value: [String, Number],
      data: {
        type: Array,
        'default': function _default() {
          return [];
        }
      },
      levelAlias: {
        type: String,
        'default': 'level'
      },
      valueAlias: {
        type: String,
        'default': 'id'
      },
      labelAlias: {
        type: String,
        'default': 'name'
      }
    },
    methods: {
      inputHandler: function inputHandler(e) {
        this.$emit('input', e);
      }
    }
  });
})();
;

(function () {
  Vue.component('select-dropdown-component', {
    name: 'SelectDropdown',
    template: '<div class="jz-select-dropdown" :class="className" :style="styles">' + '<slot></slot>' + '</div>',
    props: {
      placement: String,
      className: String,
      secondselect: Boolean,
      isfixed: Boolean,
      offset: {
        'type': Number,
        'default': 0
      },
      boundariesPadding: {
        'type': Number,
        'default': 0
      },
      boundariesElement: {
        'type': String,
        'default': 'body'
      }
    },
    data: function data() {
      return {
        popper: null,
        width: ''
      };
    },
    computed: {
      styles: function styles() {
        var style = {};
        if (this.width) style.width = this.width + 'px';
        return style;
      }
    },
    created: function created() {
      this.$on('on-update-popper', this.update);
      this.$on('on-destroy-popper', this.destroy);
    },
    beforeDestroy: function beforeDestroy() {
      if (this.popper) {
        this.popper.destroy();
      }
    },
    methods: {
      update: function update() {
        var _this = this;

        var param = {};

        if (this.popper) {
          this.$nextTick(function () {
            _this.popper.update();
          });
        } else {
          this.$nextTick(function () {
            if (_this.secondselect || _this.isfixed) {
              param = {
                gpuAcceleration: false,
                placement: _this.placement,
                boundariesPadding: _this.boundariesPadding,
                forceFixed: true,
                boundariesElement: _this.boundariesElement,
                offset: _this.placement.indexOf('right') > -1 ? -8 : _this.offset
              };
            } else {
              param = {
                gpuAcceleration: false,
                placement: _this.placement,
                boundariesPadding: _this.boundariesPadding,
                forceAbsolute: true,
                boundariesElement: _this.boundariesElement,
                offset: _this.placement.indexOf('right') > -1 ? -8 : _this.offset
              };
            }

            param.win = _this.$el.ownerDocument.defaultView;

            if (typeof _this.$parent.$refs.reference !== 'undefined') {
              _this.popper = new Popper(_this.$parent.$refs.reference, _this.$el, param);

              _this.popper.onCreate(function (popper) {
                _this.resetTransformOrigin(popper);
              });
            }
          });
        }

        if (this.$parent.$options.name === 'Select' || this.$parent.$options.name === 'Dropdown') {
          this.width = parseInt(vue_utils.getStyle(this.$parent.$el, 'width'));
        }
      },
      destroy: function destroy() {
        var _this = this;

        if (this.popper) {
          this.resetTransformOrigin(this.popper);
          setTimeout(function () {
            _this.popper.destroy();

            _this.popper = null;
          }, 300);
        }
      },
      resetTransformOrigin: function resetTransformOrigin(popper) {
        var placementMap = {
          top: 'bottom',
          bottom: 'top',
          right: 'right',
          left: 'left'
        };

        var placement = popper._popper.getAttribute('x-placement').split('-')[0];

        var origin = placementMap[placement];
        popper._popper.style.transformOrigin = 'center ' + origin;
      }
    }
  });
})();
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! select组件
 *   
 *  页面插入：
 *
 *  "<select-component v-on:on-change='?' filterable placement='bottom' v-model='?' style='width: 130px;'>" 
 *       "<select-item-component v-for='?' :value='?'>{{ ?? }}</select-item-component>" 
 *  "</select-component>" 
 * 
 * filterable： 可搜索选项
 *
 * 该组件拆分成5个文件，select.js, select-dropdown.js, select-item.js, dropdown.js, dropdown-menu.js，都是有特定的功能。
 * 
 * 支持二级选择
 * 
 * 事件：响应父组件事件
 *
 * on-change: 返回value值，设置labelInValue 可以返回对象，及value和label值 
 *
 * 原则上select-item-component 优先显示 slot 内容，如果没有定义 slot，则显示label的值，如果没有设置 label，则显示value的值。   
 */
;

(function () {
  var prefixCls = 'jz-select';
  var NOT_FOUND_TEXT = '无匹配数据';
  var PLACEHOLDER = '请选择';
  var MAX_HEIGHT = '154';
  Vue.component('select-filter-component', {
    name: 'Select',
    template: '<div :class="classes" v-clickoutside="handleClose">' + '<div :class="selectionCls" ref="reference" @click="toggleMenu">' + '<slot name="input">' + '<span :class="placeholderCls" v-show="showPlaceholder">{{ localePlaceholder }}</span>' + '<span :class="selectedCls" v-show="!showPlaceholder">{{ selectedSingle }}</span>' // +				'<input type="text" v-if="filterable" v-model="query" :disabled="disabled" :class="inputCls" :placeholder="showPlaceholder ? localePlaceholder : \'\'" @blur="handleBlur" @keydown="resetInputState" ref="input">'
    + '<i :class="iconCls"></i>' + '</slot>' + '</div>' + '<select-dropdown-component :class="isTagNotFoundCls" :isfixed="isfixed" v-show="dropVisible" :placement="placement" ref="drop">' + '<input-component' + ' class="jz_select_filterable_input"' + ' icon="jz-input-icon"' + ' v-if="filterable && !filterableFromTag"' + ' v-model="query"' + ' :disabled="disabled"' + ' :placeholder="showPlaceholder ? localePlaceholder : \'\'"' + ' @on-blur="handleBlur"' + ' @keydown.native="resetInputState"' + ' @on-click-clear="query = \'\'"' + ' ref="inputComponent"' + '>' + '</input-component>' + '<scrollbar-component theme="select" ref="scrollbar">' + '<ul v-show="notFoundShow && !isTag" :class="notFoundCls" ><li>{{ localeNotFoundText }}</li></ul>' + '<ul v-show="!notFound" :style="dropdownListStyle" class="jz-select-dropdown-list"><slot></slot></ul>' + '</scrollbar-component>' + '</select-dropdown-component>' + '</div>',
    props: {
      value: [String, Number],
      label: [String, Number],
      disabled: Boolean,
      placeholder: String,
      notfoundtext: String,
      maxdropheight: String,
      labelinvalue: Boolean,
      placement: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['top', 'bottom']);
        },
        'default': 'bottom'
      },
      isfixed: Boolean,
      isTag: {
        'type': Boolean,
        'default': false
      }
    },
    data: function data() {
      return {
        prefixCls: prefixCls,
        visible: false,
        options: [],
        optionInstances: [],
        selectedSingle: '',
        // label
        selectedMultiple: [],
        focusIndex: 0,
        query: '',
        lastQuery: '',
        selectToChangeQuery: false,
        // 当选择一个选项时，设置第一个和set query，因为query正在监听，它将发出事件
        inputLength: 20,
        notFound: false,
        model: this.value,
        currentLabel: this.label,
        animated: false,
        cacheValue: null
      };
    },
    computed: {
      filterable: function filterable() {
        return true;
      },
      filterableFromTag: function filterableFromTag() {
        return false;
      },
      classes: function classes() {
        var classes = {};
        classes[prefixCls] = true;
        classes[prefixCls + "-single"] = true;
        classes[prefixCls + "-visible"] = !!this.visible;
        classes[prefixCls + "-disabled"] = !!this.disabled;
        return classes;
      },
      notFoundCls: function notFoundCls() {
        var notFoundCls = {};
        notFoundCls[prefixCls + "-not-found"] = true;
        return notFoundCls;
      },
      isTagNotFoundCls: function isTagNotFoundCls() {
        var isTagNotFoundCls = {};
        isTagNotFoundCls["isTag-not-found"] = !!this.isTag && this.notFoundShow;
        return isTagNotFoundCls;
      },
      selectionCls: function selectionCls() {
        var selectionCls = {};
        selectionCls[prefixCls + "-selection"] = !this.isTag;
        return selectionCls;
      },
      placeholderCls: function placeholderCls() {
        var placeholderCls = {};
        placeholderCls[prefixCls + "-placeholder"] = true;
        return placeholderCls;
      },
      selectedCls: function selectedCls() {
        var selectedCls = {};
        selectedCls[prefixCls + "-selected-value"] = true;
        return selectedCls;
      },
      inputCls: function inputCls() {
        var inputCls = {};
        inputCls[prefixCls + "-input"] = true;
        return inputCls;
      },
      iconCls: function iconCls() {
        var iconCls = {};
        iconCls[prefixCls + "-arrow"] = true;
        iconCls[prefixCls + "-trigger-arrow"] = !!this.visible;
        return iconCls;
      },
      showPlaceholder: function showPlaceholder() {
        var status = false;

        if (typeof this.model === 'string') {
          if (this.model === '') {
            status = true;
          }
        } else if (this.model === null) {
          status = true;
        }

        return status;
      },
      localeNotFoundText: function localeNotFoundText() {
        if (this.notfoundtext === undefined) {
          return NOT_FOUND_TEXT;
        } else {
          return this.notfoundtext;
        }
      },
      localePlaceholder: function localePlaceholder() {
        if (this.placeholder === undefined) {
          return PLACEHOLDER;
        } else {
          return this.placeholder;
        }
      },
      dropVisible: function dropVisible() {
        var status = true;
        var options = this.$slots['default'] || [];
        if (this.query === '' && !options.length) status = false;
        if (this.isTag && !options.length) status = false;
        return this.visible && status && this.animated;
      },
      notFoundShow: function notFoundShow() {
        var options = this.$slots['default'] || [];
        return this.notFound || !options.length;
      },
      dropdownListStyle: function dropdownListStyle() {
        var style = {};
        style.maxHeight = (this.maxdropheight || MAX_HEIGHT) + 'px';
        return style;
      }
    },
    watch: {
      value: function value(val) {
        this.model = val;
        if (val === '') this.query = '';
      },
      label: function label(val) {
        this.currentLabel = val;
      },
      model: function model() {
        var _this = this;

        this.$emit('input', this.model);
        this.modelToQuery();
        this.updateSingleSelected();

        if (!this.visible && this.filterable) {
          this.$nextTick(function () {
            _this.broadcastQuery('');
          });
        }
      },
      visible: function visible(val) {
        var _this = this;

        if (this.visible) {
          vue_utils.slideDown(this.$refs.drop.$el, 300, function () {
            _this.$refs.scrollbar.$emit('update');

            vue_utils.dispatch(_this, 'Scrollbar', 'update');
          });
          this.animated = false;
        } else {
          vue_utils.slideUp(this.$refs.drop.$el, 300, function () {
            vue_utils.dispatch(_this, 'Scrollbar', 'update');
          });
          this.animated = true;
        }

        if (val) {
          if (this.filterable) {// if (!this.isTag) this.$refs.inputComponent.$refs.input.select();
          }

          vue_utils.broadcast(this, 'SelectDropdown', 'on-update-popper');
        } else {
          if (this.filterable) {
            if (!this.isTag) {
              this.$refs.inputComponent.$refs.input.blur();
              this.query = '';
            }

            setTimeout(function () {
              _this.broadcastQuery('');
            }, 300);
          }

          vue_utils.broadcast(this, 'SelectDropdown', 'on-destroy-popper');
        }
      },
      query: function query(val) {
        var _this = this;

        if (!this.selectToChangeQuery) {
          this.$emit('on-query-change', val);
        }

        this.broadcastQuery(val);
        var is_hidden = true;
        this.$nextTick(function () {
          _this.findChild(function (child) {
            if (!child.hidden && child.$parent.$options.name !== "DropdownMenu") {
              is_hidden = false;
            }
          });

          _this.notFound = is_hidden;
        });
        this.selectToChangeQuery = false;
        vue_utils.broadcast(this, 'SelectDropdown', 'on-update-popper');
      }
    },
    methods: {
      toggleMenu: function toggleMenu() {
        if (this.disabled || this.isTag) {
          return false;
        }

        this.visible = !this.visible;

        if (this.visible) {
          this.cacheValue = this.model;
        }
      },
      hideMenu: function hideMenu() {
        this.visible = false;
        this.focusIndex = 0;
        vue_utils.broadcast(this, 'SelectItem', 'on-select-close');
      },
      handleClose: function handleClose() {
        this.hideMenu();
      },
      findChild: function findChild(cb) {
        var find = function find(child) {
          var name = child.$options.componentName;

          if (name) {
            cb(child);
          } else if (child.$children.length) {
            child.$children.forEach(function (innerChild) {
              find(innerChild, cb);
            });
          }
        };

        if (this.optionInstances.length) {
          this.optionInstances.forEach(function (child) {
            find(child);
          });
        } else {
          this.$children.forEach(function (child) {
            find(child);
          });
        }
      },
      modelToQuery: function modelToQuery() {
        if (!this.isTag) {
          return;
        }

        var _this = this;

        if (this.filterable && this.model !== undefined) {
          this.findChild(function (child) {
            if (_this.model === child.value) {
              if (child.label) {
                _this.query = child.label;
              } else if (child.searchLabel) {
                _this.query = child.searchLabel;
              } else {
                _this.query = child.value;
              }
            }
          });
        }
      },
      broadcastQuery: function broadcastQuery(val) {
        vue_utils.broadcast(this, 'SelectItem', 'on-query-change', val);
      },
      updateOptions: function updateOptions(init, slot) {
        var slot = slot || false;
        var options = [];
        var index = 1;

        var _this = this;

        this.findChild(function (child) {
          options.push({
            value: child.value,
            label: child.label === undefined ? child.$el.textContent : child.label
          });
          child.index = index++;

          if (init) {
            _this.optionInstances.push(child);
          }
        });
        this.options = options;

        if (init) {
          this.updateSingleSelected(true, slot);
        }
      },
      updateSingleSelected: function updateSingleSelected(init, slot) {
        var init = init || false;
        var slot = slot || false;

        var type = _typeof(this.model);

        if (type === 'string' || type === 'number') {
          var findModel = false;

          for (var i = 0; i < this.options.length; i++) {
            if (this.model === this.options[i].value) {
              this.selectedSingle = this.options[i].label;
              findModel = true;
              break;
            }
          }

          if (slot && !findModel) {
            this.model = '';
            this.query = '';
          }
        }

        this.toggleSingleSelected(this.model, init);
      },
      toggleSingleSelected: function toggleSingleSelected(value, init) {
        var label = '';
        var init = init || false;
        this.findChild(function (child) {
          if (child.value === value) {
            child.selected = true;
            label = child.label === undefined ? child.$el.innerHTML : child.label;
          } else {
            child.selected = false;
          }
        });
        this.hideMenu();

        if (!init) {
          if (this.labelinvalue) {
            this.$emit('on-change', {
              value: value,
              label: label
            });
          } else {
            this.$emit('on-change', value);

            if (this.cacheValue !== null) {
              this.$emit("on-undo", value, this.cacheValue);
              this.cacheValue = null;
            }
          }
        }
      },
      slotChange: function slotChange() {
        this.options = [];
        this.optionInstances = [];
      },
      handleBlur: function handleBlur() {
        if (!this.isTag) {
          return;
        }

        var _this = this;

        setTimeout(function () {
          if (_this.isTag) return;
          var model = _this.model;

          if (model !== '') {
            _this.findChild(function (child) {
              if (child.value === model) {
                _this.query = child.label === undefined ? child.searchLabel : child.label;
              }
            });
          } else {
            _this.query = '';
          }
        }, 300);
      },
      resetInputState: function resetInputState() {
        this.inputLength = this.$refs.inputComponent.$refs.input.value.length * 12 + 20;
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.modelToQuery();
      this.$nextTick(function () {
        _this.broadcastQuery('');
      });
      this.updateOptions(true);
      this.$on('append', function () {
        _this.modelToQuery();

        _this.$nextTick(function () {
          _this.broadcastQuery('');
        });

        _this.slotChange();

        _this.updateOptions(true, true);
      });
      this.$on('remove', function () {
        _this.modelToQuery();

        _this.$nextTick(function () {
          _this.broadcastQuery('');
        });

        _this.slotChange();

        _this.updateOptions(true, true);
      });
      this.$on('on-select-selected', function (value) {
        if (_this.model === value) {
          if (this.isTag) this.$emit('on-change', value);

          _this.hideMenu();
        } else {
          _this.model = value;

          if (_this.filterable) {
            _this.findChild(function (child) {
              if (child.value === value) {
                if (_this.query !== '') _this.selectToChangeQuery = true;
                _this.lastQuery = _this.query = child.label === undefined ? child.searchLabel : child.label;
              }
            });
          }
        }
      });
    }
  });
})();
/*! select-graphic 下拉选择图文组件
 *   
 *  页面插入：
 *	1.小图版： <select-graphic-component v-on:on-change="?" size="small" v-model="?" :list="?"></select-graphic-component>
 *	2.大图版： <select-graphic-component v-on:on-change="?" size="large" v-model="?" :list="?"></select-graphic-component>
 * 
 small list
 	[
		{
            value: 'moren',
            label: '默认',
            type: 'default',
            hidden: false
        },
        {
            value: 'suofangpinpu',
            label: '缩放平铺',
            type: 'zoom-tile',
            hidden: false
        },
        {
            value: 'shang',
            label: '上',
            type: 'top',
            hidden: false
        },
        {
            value: 'zhong-heng',
            label: '中-横向',
            type: 'in-horizontal',
            hidden: false
        },
        {
            value: 'xia',
            label: '下',
            type: 'bottom',
            hidden: false
        },
        {
            value: 'zuo',
            label: '左',
            type: 'left',
            hidden: false
        },
        {
            value: 'zhong-zhong',
            label: '中-纵向',
            type: 'in-vertical',
            hidden: false
        },
        {
            value: 'you',
            label: '右',
            type: 'right',
            hidden: false
        }
    ];
large list
    [
		{
            value: 'pingpu',
            label: '平铺',
            type: 'Tiling',
            hidden: false
        },
        {
            value: 'bupingpu',
            label: '不平铺',
            type: 'not-tile',
            hidden: false
        },
        {
            value: 'lashen',
            label: '拉伸',
            type: 'stretch',
            hidden: false
        },
        {
            value: 'tianchong',
            label: '填充',
            type: 'filling',
            hidden: false
        }
    ]
 *  参数：
 *  list 	循环数组
 *  size 	'small' | 'large'  小图或者大图样式
 * */
;

(function () {
  var prefixCls = 'jz-select-graphic';
  Vue.component('select-graphic-component', {
    name: 'selectGraphic',
    template: '<select-component ref="selectGraphic" :isfixed="isfixed" @on-change="change" maxdropheight="160" :class="classes" style="width: 160px;" v-model="currentValue" placement="bottom">' + '<select-item-component v-show="!item.hidden" class="clearFix" v-for="item in list" :value="item.value" :key="item.value">' + '<i class="img" :class="item.type"></i>' + '<span class="text">{{ item.label }}</span>' + '</select-item-component>' + '</select-component>',
    props: {
      value: [String, Number],
      list: {
        'type': Array,
        'required': true
      },
      size: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['small', 'large']);
        },
        'required': true
      },
      isfixed: Boolean
    },
    data: function data() {
      return {
        currentValue: this.value,
        cacheValue: this.value
      };
    },
    computed: {
      classes: function classes() {
        var classes = {};
        classes[prefixCls + "-" + this.size] = !!this.size;
        return classes;
      }
    },
    methods: {
      change: function change(val) {
        this.currentValue = val;
        this.$emit('input', val);
        this.$emit("on-change", val);
      }
    },
    watch: {
      value: function value(val, oldValue) {
        this.currentValue = val;
      }
    }
  });
})();
;

(function (Vue, vue_utils) {
  var prefixCls = 'jz-select';
  var NOT_FOUND_TEXT = '无匹配数据';
  var PLACEHOLDER = '请选择';
  var MAX_HEIGHT = '157';
  Vue.component('select-input-component', {
    name: 'Select',
    template: '<div class="jz-select jz-select-single" :class="selectCls" v-clickoutside="clickOutSideHandler">' + '<div class="jz-select-selection" @click="clickSelectionHandler" ref="reference">' + '<span class="jz-select-placeholder" v-show="showPlaceholder && !inputEnable">' + '{{localePlaceholder}}' + '</span>' + '<span class="jz-select-selected-value" v-show="!showPlaceholder && !inputEnable">' + '{{selectedValue}}{{unit}}' + '</span>' + '<input type="text" v-show="inputEnable" :value="model" @input="inputHandler" @keydown="keydownInputHandler" :disabled="disabled" ref="input" class="jz-select-input" style="text-align:center;">' + '<i class="jz-select-arrow" :class="iconCls"></i>' + '</div>' + '<select-dropdown-component :isfixed="isfixed" v-if="dropEnable" v-show="dropVisible" :placement="placement" ref="selectDropdown">' + '<scrollbar-component theme="select" :max-height="maxScrollbarHeight">' + '<ul v-show="notFound" class="jz-select-not-found">' + '<li>{{localeNotFoundText}}</li>' + '</ul>' + '<ul v-show="!notFound" class="jz-select-dropdown-list">' + '<li' + ' v-for="item in data"' + ' class="jz-select-item"' + ' :class="model === item ? \'jz-select-item-selected\' : \'\'"' + ' @click.stop="selectHandler(item)"' + ' :key="item"' + '>' + '{{item}}{{unit}}' + '</li>' + '</ul>' + '</scrollbar-component>' + '</select-dropdown-component>' + '</div>',
    props: {
      value: Number,
      disabled: Boolean,
      placeholder: String,
      maxdropheight: {
        type: String,
        'default': MAX_HEIGHT + 'px'
      },
      notfoundtext: String,
      placement: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['top', 'bottom']);
        },
        'default': 'bottom'
      },
      data: {
        type: Array,
        'default': function _default() {
          return [];
        }
      },
      isfixed: {
        type: Boolean,
        'default': true
      },
      unit: {
        type: String,
        'default': ''
      },
      max: {
        type: Number,
        'default': Infinity
      },
      min: {
        type: Number,
        'default': 0
      }
    },
    data: function data() {
      return {
        visible: false,
        dropEnable: false,
        slideUping: false,
        model: this.value
      };
    },
    computed: {
      maxScrollbarHeight: function maxScrollbarHeight() {
        return parseInt(this.maxdropheight);
      },
      selectCls: function selectCls() {
        return [this.disabled ? prefixCls + '-disabled' : ''];
      },
      iconCls: function iconCls() {
        return [this.visible && !this.disabled ? prefixCls + '-trigger-arrow' : ''];
      },
      localeNotFoundText: function localeNotFoundText() {
        return this.notfoundtext || NOT_FOUND_TEXT;
      },
      notFound: function notFound() {
        return this.data.length < 1;
      },
      localePlaceholder: function localePlaceholder() {
        return this.placeholder || PLACEHOLDER;
      },
      showPlaceholder: function showPlaceholder() {
        return this.selectedValue === '';
      },
      dropVisible: function dropVisible() {
        return !this.disabled && this.dropEnable && (this.visible || this.slideUping);
      },
      inputEnable: function inputEnable() {
        return !this.disabled && this.visible;
      },
      selectedValue: function selectedValue() {
        return parseInt(this.value) || "";
      }
    },
    watch: {
      value: function value(val) {
        this.model = val;
      },
      visible: function visible(val) {
        var _this = this;

        if (this.disabled) {
          return;
        }

        if (val) {
          this.$nextTick(function () {
            vue_utils.slideDown(this.$refs.selectDropdown.$el, 300, function () {});
            this.$refs.selectDropdown.$emit('on-update-popper');
          });
        } else {
          this.slideUping = true;
          vue_utils.slideUp(this.$refs.selectDropdown.$el, 300, function () {
            _this.slideUping = false;
          });
          this.$refs.selectDropdown.$emit('on-destroy-popper');
        }
      },
      inputEnable: function inputEnable(enable) {
        if (enable) {
          this.model = this.value;
          this.$emit("on-enable-input");
          var input = this.$refs.input;
          Vue.nextTick(function () {
            input.select();
          });
        } else {
          this.$emit("on-disable-input");
        }
      }
    },
    methods: {
      clickOutSideHandler: function clickOutSideHandler() {
        this.visible = false;
        this.enterValue();
      },
      clickSelectionHandler: function clickSelectionHandler() {
        if (!this.dropEnable) {
          this.dropEnable = true;
        }

        this.visible = !this.visible;
        this.enterValue();
      },
      selectHandler: function selectHandler(val) {
        this.$emit('input', val);
        this.visible = false;
      },
      keydownInputHandler: function keydownInputHandler(e) {
        if (e.keyCode == 13) {
          //按下enter键则退出编辑
          e.preventDefault();
          e.stopPropagation();
          this.visible = false;
          this.enterValue();
          return;
        }

        if (!isNumberKeyCode(e.keyCode)) {
          //不让按除了操作数字的键以外的其他键
          e.preventDefault();
          return;
        }
      },
      inputHandler: function inputHandler(e) {
        var input = e.target,
            value = input.value;

        if (value === "") {
          this.model = "";
          return;
        }

        if (isNaN(value)) {
          //不是数字则退回旧值
          input.value = this.model;
          return;
        }

        if (value > this.max) {
          //如果输入的值超过最大值则为最大值
          input.value = value = this.max;
        }

        this.model = value;
      },
      enterValue: function enterValue() {
        var value = parseInt(this.$refs.input.value);

        if (value !== this.value && !isNaN(value) && value !== "") {
          //值经过修改且不为空才判定这次修改生效
          if (value < this.min) {
            //如果这次修改输入的值小于最小值则修改为最小值
            value = this.min;
          }

          this.$emit("input", value);
        }
      }
    },
    mounted: function mounted() {
      this.$refs.input.addEventListener('mousewheel', function (e) {
        e.preventDefault();

        if (e.deltaY > 0) {
          if (this.model >= this.max) {
            return false;
          }

          if (this.model < this.min) {
            this.model = this.min;
          }

          this.model += 1;
        } else {
          if (this.model <= this.min) {
            return false;
          }

          if (this.model > this.max) {
            this.model = this.max;
          }

          this.model -= 1;
        }

        return false;
      }.bind(this));
    }
  }); //keyCode是否为允许输入的数字操作键

  function isNumberKeyCode(keyCode) {
    // 数字
    if (keyCode >= 48 && keyCode <= 57) {
      return true;
    } // 小数字键盘


    if (keyCode >= 96 && keyCode <= 105) {
      return true;
    } // Backspace, del, 左右方向键


    if (keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39) {
      return true;
    }

    return false;
  }
})(window.Vue, window.vue_utils);
;

(function () {
  var prefixCls = 'jz-select-item';
  Vue.component('select-item-component', {
    name: 'SelectItem',
    componentName: 'select-item',
    template: '<li :class="classes" @mousedown.prevent @click.stop="select" @mouseout.stop="blur" v-show="!hidden">' + '<slot>{{ showLabel }}</slot>' + '<i class="second-select-icon" v-if="showicon"></i>' + '</li>',
    props: {
      secondselect: Boolean,
      showicon: Boolean,
      value: [String, Number],
      label: [String, Number],
      disabled: Boolean,
      isTag: Boolean
    },
    data: function data() {
      return {
        selected: false,
        index: 0,
        isFocus: false,
        hidden: false,
        searchLabel: ''
      };
    },
    computed: {
      classes: function classes() {
        var classes = {};
        classes[prefixCls] = true;
        classes[prefixCls + "-disabled"] = !!this.disabled;
        classes[prefixCls + "-selected"] = !!this.selected;
        classes[prefixCls + "-focus"] = !!this.isFocus;
        return classes;
      },
      showLabel: function showLabel() {
        return this.label ? this.label : this.value;
      }
    },
    methods: {
      select: function select() {
        if (this.disabled || this.secondselect) {
          return false;
        }

        vue_utils.dispatch(this, 'Select', 'on-select-selected', this.value);
      },
      blur: function blur() {
        this.isFocus = false;
      },
      queryChange: function queryChange(val) {
        var parsedQuery = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');

        if (this.$parent.$options.name === "DropdownMenu") {
          this.hidden = false;
          return;
        }

        this.hidden = !new RegExp(parsedQuery, 'i').test(this.searchLabel);

        if (this.hidden) {
          vue_utils.dispatch(this, 'Select', 'on-item-hidden');
        }
      },
      onSelectClose: function onSelectClose() {
        this.isFocus = false;
      },
      onQueryChange: function onQueryChange(val) {
        this.queryChange(val);
      }
    },
    created: function created() {
      this.$on('on-select-close', this.onSelectClose);
      this.$on('on-query-change', this.onQueryChange);
    },
    mounted: function mounted() {
      vue_utils.dispatch(this, 'Select', 'append', this);
      this.searchLabel = this.$el.textContent;
    },
    beforeDestroy: function beforeDestroy() {
      if (!this.isTag) {
        vue_utils.dispatch(this, 'Select', 'remove', this);
      }
    }
  });
})();
;

(function (Vue, vue_utils) {
  var prefixCls = 'jz-select';
  var NOT_FOUND_TEXT = '无匹配数据';
  var PLACEHOLDER = '请选择';
  var MAX_HEIGHT = '157';
  Vue.component('select-search-component', {
    name: 'Select',
    template: '<div class="jz-select jz-select-single" :class="selectCls" v-clickoutside="clickOutSideHandler">' + '<div class="jz-select-selection" @click="clickSelectionHandler" ref="reference">' + '<span class="jz-select-placeholder" v-show="showPlaceholder">' + '{{localePlaceholder}}' + '</span>' + '<span class="jz-select-selected-value" v-show="!showPlaceholder">' + '{{selectedSingle}}' + '</span>' + '<i class="jz-select-arrow" :class="iconCls"></i>' + '</div>' + '<select-dropdown-component :isfixed="isfixed" v-if="dropEnable" v-show="dropVisible" :placement="placement" ref="selectDropdown">' + '<input-component' + ' class="jz_select_filterable_input"' + ' icon="jz-input-icon"' + ' v-model="query"' + ' @on-click-clear="clickClearHandler"' + ' ref="input"' + '>' + '</input-component>' + '<scrollbar-component theme="select" :max-height="maxScrollbarHeight">' + '<ul v-show="notFound" class="jz-select-not-found">' + '<li>{{localeNotFoundText}}</li>' + '</ul>' + '<ul v-show="!notFound" class="jz-select-dropdown-list">' + '<li' + ' v-for="item in filterData"' + ' class="jz-select-item"' + ' :class="value === item[valueAlias] ? \'jz-select-item-selected\' : \'\'"' + ' @click.stop="selectHandler(item[valueAlias])"' + ' :key="item[valueAlias]"' + '>' + '{{(item[preLabelAlias] || \'\') + item[labelAlias]}}' + '</li>' + '</ul>' + '</scrollbar-component>' + '</select-dropdown-component>' + '</div>',
    props: {
      value: [String, Number],
      disabled: Boolean,
      placeholder: String,
      maxdropheight: {
        type: String,
        'default': MAX_HEIGHT + 'px'
      },
      notfoundtext: String,
      placement: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['top', 'bottom']);
        },
        'default': 'bottom'
      },
      data: {
        type: Array,
        'default': function _default() {
          return [];
        }
      },
      valueAlias: {
        type: String,
        'default': 'value'
      },
      labelAlias: {
        type: String,
        'default': 'label'
      },
      preLabelAlias: {
        type: String,
        'default': 'preLabel'
      },
      isfixed: {
        type: Boolean,
        'default': true
      }
    },
    data: function data() {
      return {
        query: '',
        visible: false,
        dropEnable: false,
        slideUping: false
      };
    },
    computed: {
      maxScrollbarHeight: function maxScrollbarHeight() {
        return parseInt(this.maxdropheight);
      },
      filterData: function filterData() {
        var query = this.query,
            labelAlias = this.labelAlias,
            data = this.data;
        return query === '' ? data : data.filter(function (item) {
          return (item[labelAlias] + '').indexOf(query) > -1;
        });
      },
      selectCls: function selectCls() {
        return [this.disabled ? prefixCls + '-disabled' : ''];
      },
      iconCls: function iconCls() {
        return [this.visible && !this.disabled ? prefixCls + '-trigger-arrow' : ''];
      },
      localeNotFoundText: function localeNotFoundText() {
        return this.notfoundtext || NOT_FOUND_TEXT;
      },
      notFound: function notFound() {
        return this.filterData.length < 1;
      },
      localePlaceholder: function localePlaceholder() {
        return this.placeholder || PLACEHOLDER;
      },
      showPlaceholder: function showPlaceholder() {
        return this.selectedSingle === '';
      },
      dropVisible: function dropVisible() {
        return !this.disabled && this.dropEnable && (this.visible || this.slideUping);
      },
      selectedSingle: function selectedSingle() {
        var data = this.data,
            value = this.value,
            valueAlias = this.valueAlias,
            item,
            i;

        for (i = 0; i < data.length; i++) {
          item = data[i];

          if (item[valueAlias] === value) {
            return item[this.labelAlias];
          }
        }

        return '';
      }
    },
    watch: {
      visible: function visible(val) {
        var _this = this;

        if (this.disabled) {
          return;
        }

        if (val) {
          this.$nextTick(function () {
            vue_utils.slideDown(this.$refs.selectDropdown.$el, 300, function () {});
            this.$refs.selectDropdown.$emit('on-update-popper');
          });
        } else {
          this.slideUping = true;
          vue_utils.slideUp(this.$refs.selectDropdown.$el, 300, function () {
            _this.slideUping = false;
          });
          this.$refs.selectDropdown.$emit('on-destroy-popper');
          this.query = '';
        }
      }
    },
    methods: {
      clickOutSideHandler: function clickOutSideHandler() {
        this.visible = false;
      },
      clickSelectionHandler: function clickSelectionHandler() {
        if (!this.dropEnable) {
          this.dropEnable = true;
        }

        this.visible = !this.visible;
      },
      clickClearHandler: function clickClearHandler() {
        this.query = '';
      },
      selectHandler: function selectHandler(val) {
        this.$emit('input', val);
        this.visible = false;
      }
    }
  });
})(window.Vue, window.vue_utils);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! select组件
 *   
 *  页面插入：
 *
 *  "<select-component v-on:on-change='?' filterable placement='bottom' v-model='?' style='width: 130px;'>" 
 *       "<select-item-component v-for='?' :value='?'>{{ ?? }}</select-item-component>" 
 *  "</select-component>" 
 * 
 * filterable： 可搜索选项
 *
 * 该组件拆分成5个文件，select.js, select-dropdown.js, select-item.js, dropdown.js, dropdown-menu.js，都是有特定的功能。
 * 
 * 支持二级选择
 * 
 * 事件：响应父组件事件
 *
 * on-change: 返回value值，设置labelInValue 可以返回对象，及value和label值 
 *
 * 原则上select-item-component 优先显示 slot 内容，如果没有定义 slot，则显示label的值，如果没有设置 label，则显示value的值。   
 */
;

(function () {
  var prefixCls = 'jz-select';
  var NOT_FOUND_TEXT = '无匹配数据';
  var PLACEHOLDER = '请选择';
  var MAX_HEIGHT = '154';
  Vue.component('select-component', {
    name: 'Select',
    template: '<div :class="classes" v-clickoutside="handleClose">' + '<div :class="selectionCls" ref="reference" @click="toggleMenu">' + '<slot name="input">' + '<span :class="placeholderCls" v-show="showPlaceholder && !filterable">{{ localePlaceholder }}</span>' + '<span :class="selectedCls" v-show="!showPlaceholder && !filterable">{{ selectedSingle }}</span>' + '<input type="text" v-if="filterable" v-model="query" :disabled="disabled" :class="inputCls" :placeholder="showPlaceholder ? localePlaceholder : \'\'" @blur="handleBlur" @keydown="resetInputState" ref="input">' + '<i :class="iconCls"></i>' + '</slot>' + '</div>' + '<select-dropdown-component :class="isTagNotFoundCls" :isfixed="isfixed" v-show="dropVisible" :placement="placement" ref="drop">' + '<scrollbar-component theme="select" :max-height="maxScrollbarHeight">' + '<ul v-show="notFoundShow && !isTag" :class="notFoundCls" ><li>{{ localeNotFoundText }}</li></ul>' + '<ul v-show="!notFound" class="jz-select-dropdown-list"><slot></slot></ul>' + '</scrollbar-component>' + '</select-dropdown-component>' + '</div>',
    props: {
      value: [String, Number],
      label: [String, Number],
      disabled: Boolean,
      placeholder: String,
      filterable: Boolean,
      notfoundtext: String,
      maxdropheight: {
        type: String,
        'default': MAX_HEIGHT + 'px'
      },
      labelinvalue: Boolean,
      placement: {
        validator: function validator(value) {
          return vue_utils.oneOf(value, ['top', 'bottom']);
        },
        'default': 'bottom'
      },
      isfixed: Boolean,
      isTag: {
        'type': Boolean,
        'default': false
      },
      list: {
        'type': Array,
        'default': function _default() {
          return [];
        }
      }
    },
    data: function data() {
      return {
        prefixCls: prefixCls,
        visible: false,
        options: [],
        optionInstances: [],
        selectedSingle: '',
        // label
        selectedMultiple: [],
        focusIndex: 0,
        query: '',
        lastQuery: '',
        selectToChangeQuery: false,
        // 当选择一个选项时，设置第一个和set query，因为query正在监听，它将发出事件
        inputLength: 20,
        notFound: false,
        model: this.value,
        currentLabel: this.label,
        animated: false,
        cacheValue: null
      };
    },
    computed: {
      maxScrollbarHeight: function maxScrollbarHeight() {
        return parseInt(this.maxdropheight);
      },
      classes: function classes() {
        var classes = {};
        classes[prefixCls] = true;
        classes[prefixCls + "-single"] = true;
        classes[prefixCls + "-visible"] = !!this.visible;
        classes[prefixCls + "-disabled"] = !!this.disabled;
        return classes;
      },
      notFoundCls: function notFoundCls() {
        var notFoundCls = {};
        notFoundCls[prefixCls + "-not-found"] = true;
        return notFoundCls;
      },
      isTagNotFoundCls: function isTagNotFoundCls() {
        var isTagNotFoundCls = {};
        isTagNotFoundCls["isTag-not-found"] = !!this.isTag && this.notFoundShow;
        return isTagNotFoundCls;
      },
      selectionCls: function selectionCls() {
        var selectionCls = {};
        selectionCls[prefixCls + "-selection"] = !this.isTag;
        return selectionCls;
      },
      placeholderCls: function placeholderCls() {
        var placeholderCls = {};
        placeholderCls[prefixCls + "-placeholder"] = true;
        return placeholderCls;
      },
      selectedCls: function selectedCls() {
        var selectedCls = {};
        selectedCls[prefixCls + "-selected-value"] = true;
        return selectedCls;
      },
      inputCls: function inputCls() {
        var inputCls = {};
        inputCls[prefixCls + "-input"] = true;
        return inputCls;
      },
      iconCls: function iconCls() {
        var iconCls = {};
        iconCls[prefixCls + "-arrow"] = true;
        iconCls[prefixCls + "-trigger-arrow"] = !!this.visible;
        return iconCls;
      },
      showPlaceholder: function showPlaceholder() {
        var status = false;

        if (typeof this.model === 'string') {
          if (this.model === '') {
            status = true;
          }
        } else if (this.model === null) {
          status = true;
        }

        return status;
      },
      localeNotFoundText: function localeNotFoundText() {
        if (this.notfoundtext === undefined) {
          return NOT_FOUND_TEXT;
        } else {
          return this.notfoundtext;
        }
      },
      localePlaceholder: function localePlaceholder() {
        if (this.placeholder === undefined) {
          return PLACEHOLDER;
        } else {
          return this.placeholder;
        }
      },
      dropVisible: function dropVisible() {
        var status = true;
        var options = this.$slots['default'] || [];
        if (this.query === '' && !options.length) status = false;
        if (this.isTag && !options.length) status = false;
        return this.visible && status && this.animated;
      },
      notFoundShow: function notFoundShow() {
        var options = this.options || [];
        return this.notFound || !options.length;
      }
    },
    watch: {
      value: function value(val) {
        this.model = val;
        if (val === '') this.query = '';
      },
      label: function label(val) {
        this.currentLabel = val;
      },
      model: function model() {
        var _this = this;

        this.$emit('input', this.model);
        this.$nextTick(function () {
          this.modelToQuery();
          this.$nextTick(function () {
            this.broadcastQuery('');
          });
        });
        this.updateSingleSelected();

        if (!this.visible && this.filterable) {
          this.$nextTick(function () {
            _this.broadcastQuery('');
          });
        }
      },
      visible: function visible(val) {
        var _this = this;

        if (this.visible) {
          vue_utils.slideDown(this.$refs.drop.$el, 300, function () {
            vue_utils.dispatch(_this, 'Scrollbar', 'update');
          });
          this.animated = false;
        } else {
          vue_utils.slideUp(this.$refs.drop.$el, 300, function () {
            vue_utils.dispatch(_this, 'Scrollbar', 'update');
          });
          this.animated = true;
        }

        if (val) {
          if (this.filterable) {
            if (!this.isTag) this.$refs.input.select();
          }

          vue_utils.broadcast(this, 'SelectDropdown', 'on-update-popper');
        } else {
          if (this.filterable) {
            if (!this.isTag) this.$refs.input.blur();
            setTimeout(function () {
              _this.broadcastQuery('');
            }, 300);
          }

          vue_utils.broadcast(this, 'SelectDropdown', 'on-destroy-popper');
        }
      },
      query: function query(val) {
        var _this = this;

        if (!this.selectToChangeQuery) {
          this.$emit('on-query-change', val);
        }

        this.broadcastQuery(val);
        var is_hidden = true;
        this.$nextTick(function () {
          _this.findChild(function (child) {
            if (!child.hidden && child.$parent.$options.name !== "DropdownMenu") {
              is_hidden = false;
            }
          });

          _this.notFound = is_hidden;
        });
        this.selectToChangeQuery = false;
        vue_utils.broadcast(this, 'SelectDropdown', 'on-update-popper');
      },
      list: function list(val) {
        var _this = this;

        this.$nextTick(function () {
          _this.options = val;
        });
      }
    },
    methods: {
      toggleMenu: function toggleMenu() {
        if (this.disabled || this.isTag) {
          return false;
        }

        this.visible = !this.visible;

        if (this.visible) {
          this.cacheValue = this.model;
        }
      },
      hideMenu: function hideMenu() {
        this.visible = false;
        this.focusIndex = 0;
        vue_utils.broadcast(this, 'SelectItem', 'on-select-close');
      },
      handleClose: function handleClose() {
        this.hideMenu();
      },
      findChild: function findChild(cb) {
        var find = function find(child) {
          var name = child.$options.componentName;

          if (name) {
            cb(child);
          } else if (child.$children.length) {
            child.$children.forEach(function (innerChild) {
              find(innerChild, cb);
            });
          }
        };

        if (this.optionInstances.length) {
          this.optionInstances.forEach(function (child) {
            find(child);
          });
        } else {
          this.$children.forEach(function (child) {
            find(child);
          });
        }
      },
      modelToQuery: function modelToQuery() {
        var _this = this;

        if (this.filterable && this.model !== undefined) {
          this.findChild(function (child) {
            if (_this.model === child.value) {
              if (child.label) {
                _this.query = child.label;
              } else if (child.searchLabel) {
                _this.query = child.searchLabel;
              } else {
                _this.query = child.value;
              }
            }
          });
        }
      },
      broadcastQuery: function broadcastQuery(val) {
        vue_utils.broadcast(this, 'SelectItem', 'on-query-change', val);
      },
      updateOptions: function updateOptions(init, slot) {
        var slot = slot || false;
        var options = [];
        var index = 1;

        var _this = this;

        if (!this.list.length) {
          this.findChild(function (child) {
            options.push({
              value: child.value,
              label: child.label === undefined ? child.$el.textContent : child.label
            });
            child.index = index++;

            if (init) {
              _this.optionInstances.push(child);
            }
          });
        }

        this.options = this.list.length ? this.list : options;

        if (init) {
          this.updateSingleSelected(true, slot);
        }
      },
      updateSingleSelected: function updateSingleSelected(init, slot) {
        var init = init || false;
        var slot = slot || false;

        var type = _typeof(this.model);

        if (type === 'string' || type === 'number') {
          var findModel = false;

          for (var i = 0; i < this.options.length; i++) {
            if (this.model === this.options[i].value) {
              this.selectedSingle = this.options[i].label;
              findModel = true;
              break;
            }
          }

          if (slot && !findModel) {
            this.model = '';
            this.query = '';
          }
        }

        this.toggleSingleSelected(this.model, init);
      },
      toggleSingleSelected: function toggleSingleSelected(value, init) {
        var label = '';
        var init = init || false;
        this.findChild(function (child) {
          if (child.value === value) {
            child.selected = true;
            label = child.label === undefined ? child.$el.innerHTML : child.label;
          } else {
            child.selected = false;
          }
        });
        this.hideMenu();

        if (!init) {
          if (this.labelinvalue) {
            this.$emit('on-change', {
              value: value,
              label: label
            });
          } else {
            this.$emit('on-change', value);

            if (this.cacheValue !== null) {
              this.$emit("on-undo", value, this.cacheValue);
              this.cacheValue = null;
            }
          }
        }
      },
      slotChange: function slotChange() {
        this.options = [];
        this.optionInstances = [];
      },
      handleBlur: function handleBlur() {
        var _this = this;

        setTimeout(function () {
          if (_this.isTag) return;
          var model = _this.model;

          if (model !== '') {
            _this.findChild(function (child) {
              if (child.value === model) {
                _this.query = child.label === undefined ? child.searchLabel : child.label;
              }
            });
          } else {
            _this.query = '';
          }
        }, 300);
      },
      resetInputState: function resetInputState() {
        this.inputLength = this.$refs.input.value.length * 12 + 20;
      }
    },
    mounted: function mounted() {
      console.log("mounted");

      var _this = this;

      this.modelToQuery();
      this.$nextTick(function () {
        _this.broadcastQuery('');
      });
      this.updateOptions(true);
      this.$on('append', function () {
        _this.modelToQuery();

        _this.$nextTick(function () {
          _this.broadcastQuery('');
        });

        _this.slotChange();

        _this.updateOptions(true, true);
      });
      this.$on('remove', function () {
        _this.modelToQuery();

        _this.$nextTick(function () {
          _this.broadcastQuery('');
        });

        _this.slotChange();

        _this.updateOptions(true, true);
      });
      this.$on('on-select-selected', function (value) {
        if (_this.model === value) {
          if (this.isTag) this.$emit('on-change', value);

          _this.hideMenu();
        } else {
          _this.model = value;

          if (_this.filterable) {
            _this.findChild(function (child) {
              if (child.value === value) {
                if (_this.query !== '') _this.selectToChangeQuery = true;
                _this.lastQuery = _this.query = child.label === undefined ? child.searchLabel : child.label;
              }
            });
          }
        }
      });
    }
  });
})();
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * input组件
 * 页面插入：<input-number-component :value="String" :maxlength="Number" :readonly="readonly" :unit="String" :number="Boolean" :disabled="Boolean" icon="ClassName(String)" @click="callback"></input-number-component>
 * 可选参数：classes | id | pattern | value | maxlength | readonly | unit | number | disabled | placeholder | icon | @click

 * 
 * classes: String,  // 自定义类， 可以用来控制样式
 * type: String,	//包裹div类名
 * disabled: Boolean,	//是否禁用
 * value: [String, Number], // 当前值
 * unit: String,			//input数值 的单位
 * max: Number,  			//slider max val
 * min: Number,				//slider min val
 * width: Number,			//slider 滑条总宽度 默认 100
 * handleRadius: Number,	//滑条 圆点半径 默认5
 * step:Number				// 步进 默认1
 * 
 *
 * https://cn.vuejs.org/v2/guide/components.html#什么是组件？
 * Depends: vue.js
 */
;

(function () {
  var _props;

  var prefixCls = 'jz-slider';
  Vue.component('slider-component', {
    name: 'Slider',
    template: "<div :class='wrapClasses'>" + "<div :class='\"slider-outer\" + (classes|| \"\")'>" + "<div :class='\"slider-base-line\" + (classes|| \"\")' :style='{width:width + \"px\"}'>" + "<div :class='\"slider-check-line\" + (classes|| \"\")' :style='checkLineStyle'></div>" + "<a :class='\"slider-handle\" + (classes|| \"\")' :style='handleStyle' @mousedown.stop='mouseDown($event)'></a>" + "</div>" + "</div>" + "<input-number-component :class='\"slider-input\" + (classes|| \"\")' :max='max' :min='min' :decimal='decimal' :nagative='nagative' :digitis='digitis' :unit='unit' :disabled='disabled' ref='silderInput' v-model.number='currentValue' @on-focus='inputFocus' @input='inputChange' @on-blur='inputBlur'></input-number-component>" + "</div>",
    props: (_props = {
      classes: String,
      type: String,
      disabled: Boolean,
      value: [String, Number],
      unit: String,
      max: Number,
      min: Number,
      width: Number,
      radius: Number,
      step: Number,
      decimal: Boolean,
      // 支持小数
      nagative: Boolean
    }, _defineProperty(_props, "unit", String), _defineProperty(_props, "digitis", {
      type: Number,
      // 小数位数
      'default': 0
    }), _props),
    data: function data() {
      return {
        currentValue: this.value,
        focusStatus: false,
        sliderWidth: this.width || 100,
        handleRadius: this.radius || 5,
        cacheVal: this.value
      };
    },
    methods: {
      inputFocus: function inputFocus() {
        this.cacheVal = this.currentValue;
        this.$emit("on-start", this.currentValue);
      },
      inputChange: function inputChange(value) {
        value = Number(value) || 0;

        if (value > this.max || value < this.min) {
          return;
        }

        this.currentValue = value;

        if (value !== "") {
          this.$emit("input", value);
          this.$emit("on-change", value);
          this.$emit("on-slide", value);
        }
      },
      inputBlur: function inputBlur() {
        this.currentValue = Number(this.currentValue) || 0;
        var val = this.protectVal(this.protectStepAdd(this.currentValue));

        if (val != this.currentValue) {
          this.currentValue = val;
          this.$emit("input", val);
          this.$emit("on-change", val);
        }

        this.$emit("on-stop", this.currentValue);

        if (this.cacheVal != this.currentValue) {
          this.$emit("on-undo", this.currentValue, this.cacheVal);
        }
      },
      mouseDown: function mouseDown(event) {
        var _this = this,
            startClientX = event.clientX,
            startCurrentValue = _this.currentValue,
            doc = document;

        this.cacheVal = this.currentValue;
        this.$emit("on-start", startCurrentValue);
        doc.addEventListener("mousemove", mouseMove, false);

        function mouseMove(event) {
          var movePos = event.clientX - startClientX,
              addVal = movePos / _this.scale;
          addVal = addVal - addVal % _this.step;
          _this.currentValue = _this.protectStepAdd(startCurrentValue + addVal);
          _this.currentValue = _this.protectVal(_this.currentValue);

          _this.$emit("input", _this.currentValue);

          _this.$emit("on-change", _this.currentValue);

          _this.$emit("on-slide", _this.currentValue);

          doc.addEventListener("mouseup", mouseUp, false);
        }

        function mouseUp(event) {
          doc.removeEventListener("mousemove", mouseMove);
          doc.removeEventListener("mouseup", mouseUp);

          _this.$emit("on-stop", _this.currentValue);

          if (_this.cacheVal != _this.currentValue) {
            _this.$emit("on-undo", _this.currentValue, _this.cacheVal);
          }
        }
      },
      protectVal: function protectVal(val) {
        if (val > this.max) {
          val = this.max;
        } else if (val < this.min) {
          val = this.min;
        }

        return val;
      },
      protectSliderStyle: function protectSliderStyle(val) {
        if (val > this.sliderWidth - this.handleRadius) {
          val = this.sliderWidth - this.handleRadius;
        } else if (val < 0 - this.handleRadius) {
          val = 0 - this.handleRadius;
        }

        return val;
      },
      protectStepAdd: function protectStepAdd(val) {
        var valStr = this.step.toString(),
            toFixedNum = 0;

        if (valStr.indexOf(".") > -1) {
          toFixedNum = valStr.split(".")[1].length;
        }

        return Number(val.toFixed(toFixedNum));
      }
    },
    computed: {
      scale: function scale() {
        return this.width / (this.max - this.min);
      },
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls + "-wrapper"] = true;
        wrapClasses[prefixCls + "-" + this.type] = !!this.type;
        return wrapClasses;
      },
      checkLineStyle: function checkLineStyle() {
        var width = this.scale * (this.currentValue - this.min);
        width = this.protectSliderStyle(width);
        return {
          width: width + "px"
        };
      },
      handleStyle: function handleStyle() {
        var left = this.scale * (this.currentValue - this.min) - this.handleRadius;
        left = this.protectSliderStyle(left);
        return {
          left: left + "px"
        };
      }
    },
    watch: {
      value: function value(val) {
        this.currentValue = val;
      }
    }
  });
})();

/*! switch组件
 * 
 * 属性参数如下：
 * 		value：	只在单独使用时有效。可以使用 v-model 双向绑定数据	Boolean
 *		disabled：  禁用开关  Boolean   
 * 事件：响应父组件事件
 * on-change      
 *
 * slot: 分发自定义内容
 *
 * open：   自定义显示打开时的内容
 * close：	自定义显示关闭时的内容 
 */
;

(function () {
  var prefixCls = 'jz-switch';
  Vue.component('switch-component', {
    name: 'jz_switch',
    template: '<span :class="wrapClasses" @click="toggle">' + '<span :class="innerClasses">' + '<slot name="open" v-if="currentValue"></slot>' + '<slot name="close" v-if="!currentValue"></slot>' + '</span>' + '</span>',
    props: {
      value: Boolean,
      disabled: Boolean
    },
    data: function data() {
      return {
        currentValue: this.value
      };
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls] = true;
        wrapClasses[prefixCls + "-checked"] = !!this.currentValue;
        wrapClasses[prefixCls + "-disabled"] = !!this.disabled;
        return wrapClasses;
      },
      innerClasses: function innerClasses() {
        return prefixCls + "-inner";
      }
    },
    methods: {
      toggle: function toggle() {
        if (this.disabled) {
          return false;
        }

        var checked = !this.currentValue;
        this.currentValue = checked;
        this.$emit('input', checked);
        this.$emit('on-change', checked);
        this.$emit('on-undo', checked);
      }
    },
    watch: {
      value: function value(val) {
        this.currentValue = val;
      }
    }
  });
})();
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* table 组件
   
表格由两部分构成 表格头 表格体 这两部分高度和等于 prop height 的高，高度不够表格体出滚动条，不设置高度则展示全部
页面插入（基本用法）：
<table-component :width="660" :height="500" :columns="columns" :data="data">
    <slot name="header"></slot>  // 实际是在表格的外部，这里可以放按钮等     
    <slot name="footer"></slot>  // 实际是在表格的外部，这里可以放分页等    
</table-component>  
       
参数(prop)如下:
    data: array, 重点参数, 重点声明,所有的操作都不会去改表格的源数据, 提供返回的数据,需要改表格源数据的话，需要再 vue 实例外部改，有多层级的话统一放在 children 下,
        通过给数据 data 设置字段 cellClassName 可以给任意一个单元格指定样式,
        其他的 key 分别与 columns 定义的 key 对应。示例数据如下：

        data: [
            {
                name: '王小明',
                age: 18,
                address: '北京市朝阳区芍药居',
                cellClassName: { //自定义类设置指定的样式
                    name: 'demo-table-info-cell-name',
                    age: 'demo-table-info-cell-age',
                    address: 'demo-table-info-cell-address'
                },
                _collapsed: false, // 多层级下，单行是否开启合并或者展开
                // 不是多层级的不用传这个 children 关键字
                children: [ 
                    {
                        name: '王小明二级',
                        age: 35,
                        address: '北京市海淀区西二旗',
                        children: [
                            {
                                name: '王小明三级1',
                                age: 29,
                                address: '北京市海淀区西二旗'
                            },
                            {
                                name: '王小明三级2',
                                age: 29,
                                address: '北京市海淀区西二旗'
                            }
                            ...
                        ]
                    },
                    {
                        name: '王小明二二级',
                        age: 35,
                        address: '北京市海淀区西二旗'
                    }
                    ...
                ]
            }
            ...
        ]
    
    columns: array, 重点参数, 列描述数据对象

        各属性如下：
            type: 列类型，可选值为 index、selection、radio、html、expand
            title: 列头显示文字
            key: 对应列内容的字段名
            width: 列宽(建议每列的自定义宽度)
            align: 对齐方式，可选值为 left 左对齐、right 右对齐和 center 居中对齐
            className: 列的样式名称  
            ellipsis: 开启后，文本将不换行，超出部分显示为省略号
            render: 自定义渲染列，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 row、column 和 index，分别指当前行数据，当前列数据，当前行索引
            renderHeader: 自定义列头显示内容，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 column 和 index，分别为当前列数据和当前列索引
            sortable: 对应列是否可以排序(表头)
            sortMethod: 自定义排序使用的方法，接收三个参数 a 、 b 和 type，当设置 sortable: true 时有效。type 值为 asc 和 desc （只排序一层级）
            sortType: 设置初始化排序。值为 asc 和 desc
            filteredValue: 在初始化时使用过滤，数组，值为需要过滤的 value 集合
            filterMethod: 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。（和 filteredValue 一起使用）

        示例数据及各种注意事项如下（列举了很多种情况，根据实际需要自己组合）：
        [
            {
                type: 'selection',  // 给 data 项设置特殊 key _checked: true 可以默认选中当前项。
                                    // 给 data 项设置特殊 key _disabled: true 可以禁止选择当前项。
                width: 60, // 设置宽度
                align: 'center' // 设置位置
            },
            {
                type: 'radio',
                width: 60,
                align: 'center'
            },
            {
                type: 'expand', // 行的拓展，当数据比较多的时候可以设置，最好放在第一列，默认收起，支持展开显示更多数据，展示内容根据 render 函数自己自定义
                width: 40,      // 给行数据 data （即在上面的 data 数据）的某项设置 _expanded 为 true，可以默认展开当前行，设置 _disableExpand 可以禁用当前行的展开功能。
                align: 'center',
                render: (h, params) => {
                    return h('div', {
                            'style': 'display: inline-block'                           
                        },
                        [
                        h('strong', {
                            'class': 'aaa'
                        })
                    ]);
                },
            },
            {
                title: '姓名', // 列头显示文字   
                key: 'name',  // 标志 key
                multiLevel: true,  //如果开启了多层级，需要传入这个参数，由于父层级前有图标，里面默认了一种样式，多层级默认在第一列，即第一列就不要有 radio、checkbox、expand 类型的单元格
                className: 'demo-table-info-column', //自定义列样式
                width: 200
            },
            {
                title: '年龄', 
                sortable: true, // 开启表头排序
                sortType: 'desc',  // 设置初始化排序。值为 asc 和 desc 
                key: 'age',
                width: 100,
                sortMethod: function (a, b, type) {  // 表头排序是支持数字的降序和升序，如果要自定义排序的可以自定义排序方法
                                                     // 自定义排序使用的方法，接收三个参数 a 、 b 和 type，当设置 sortable: true 时有效。type 值为 asc 和 desc   
                },
                filteredValue: [], // filteredValue 和 filterMethod 用在一些表格的筛选功能，在初始化时使用过滤，数组，值为需要过滤的 value 集合     
                filterMethod: function (value, row) { // 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示
                    if (!!value) {
                        return row.name.indexOf(value) > -1;
                    } 
                }
            },
            {
                title: '地址',
                key: 'address',
                width: 200,
                ellipsis: true // 超出部分显示为省略号
            },
            {
                title: '排序',
                type: 'sortable',  // 这种是开启表格体中的上下左右箭头的点击排序 
                width: 100,
                align: 'center'
            },
            {
                title: '操作',    // 针对表格的一些点击，例如编辑，删除等，可以用 render 自定义样式和事件。
                key: 'action',    // 注意：如果是开启了拖拽排序，有需要用的浏览器默认的事件（如click ，链接什么的）的 DOM 需要传入一个公用的类名 jz-table-event-initial ，目的是与拖拽的事件互斥。
                width: 60,
                align: 'center',
                type: 'render',
                render: (h, params) => {
                    return h('div', [
                        h('div', {
                            'class': 'jz-table-event-initial',
                            on: {
                                click: () => {
                                    Vue.remove(params)
                                }
                            }
                        }, 'Delete')
                    ]);
                }
            }
        ]

    drag-sortable: 开启拖拽排序
    multi-level: 开启多层级，目前只支持到 3 级，注意 开启多层级的时会默认给传入的每一行数据设置 _collapsed 属性，所以返回的数据会带有 _collapsed 属性关键字，注意避开
    show-header： 是否显示表头
    no-data-text: 数据为空时显示的提示内容
    no-filtered-data-text: 筛选数据为空时显示的提示内容
    row-class-name: 行的 className 的回调方法，传入参数: (row：当前行数据  index：当前行的索引) 
                例如在 vue 实例挂一个方法，可根据 index 去加自定义类去控制样式（单层级 ），多层级可以根据 row 的 _level 及 _levelKey 去做一些相应的判断 
                rowClassName: function (row, index) {
                   if (index === 1) {
                        return 'demo-table-info-row';
                    } else if (index === 3) {
                        return 'demo-table-error-row';
                    }
                    return '';
                }
    width: 表格宽度，单位 px
    height: 表格高度，单位 px，设置后，如果表格内容大于此值，会固定表头
    loading: 表格是否加载中，通过设置属性 loading 可以让表格处于加载中状态，在异步请求数据、分页时、以及大数据时建议使用。

事件(events)如下:
    on-select: 在多选模式下有效，选中某一项时触发。 返回值：selection：已选项数据, row：刚选择的项数据
    on-select-cancel: 在多选模式下有效，取消选中某一项时触发。 返回值：selection：已选项数据, row：取消选择的项数据
    on-select-all： 在多选模式下有效，点击全选时触发。 selection：已选项数据
    on-select-all-cancel： 在多选模式下有效，点击取消全选时触发。
    on-selection-change： 在多选模式下有效，只要选中项发生变化时就会触发。 selection：已选项数据
    getSelection(): 在多选模式下有效，通过组件的方法可拿到当前已选择的项及下标

    on-radio-change: 在单选模式下有效，选中某一项时触发。 返回值：selection：已选项数据
    getRadioSelection(): 在单选模式下有效，通过组件的方法可拿到当前已选择的项

    on-expand： 展开或收起某一行时触发  返回值： row：当前行的数据  status：当前的状态

    on-sort-up-click
    on-sort-down-click
    on-sort-left-click
    on-sort-right-click
    上面这四个在表格体排序模式下触发，返回下标位置

    on-sort-head-change: 排序时有效，当点击表头的排序时触发。 
    返回值  column：当前列数据
           key：排序依据的指标 
           order：排序的顺序，值为 asc 或 desc
           data: 对应的表格数据

    on-sort-body-change: 排序时有效，当点击表格体的排序时触发。 返回值 data: 表格体数据

    on-drag-data-change: 开启拖拽排序时有效，当拖拽排序时触发。 返回值 data: 表格体数据
    */
; // 表格公用方法

var tableMixin = {
  methods: {
    alignCls: function alignCls(column, row) {
      var row = row || {};
      var cellClassName = '';
      var alignCls = {};

      if (row.cellClassName && column.key && row.cellClassName[column.key]) {
        cellClassName = row.cellClassName[column.key];
      }

      if (column.multiLevel) {
        alignCls['pl40'] = true;
        alignCls['j-multi-level'] = true;
      }

      alignCls[cellClassName] = !!cellClassName;
      alignCls[column.className] = !!column.className;
      alignCls[this.prefixCls + '-column-' + column.align] = !!column.align;
      return alignCls;
    },
    setCellWidth: function setCellWidth(column, index, top) {
      var width = '';

      if (column.width) {
        width = column.width;
      } else if (this.columnsWidth[column._index]) {
        width = this.columnsWidth[column._index].width;
      }

      if (this.columns.length === index + 1 && top && this.$parent.bodyHeight !== 0 && !this.$parent.flexible) {//width += this.$parent.scrollBarWidth;
      }

      if (width === '0') width = '';
      return width;
    }
  }
};

(function () {
  var prefixCls = 'jz-table';
  var multiCount = 0;
  var scrollTop = 0;
  Vue.component('table-render-header', {
    name: 'TableRenderHeader',
    functional: true,
    props: {
      render: Function,
      column: Object,
      index: Number
    },
    render: function render(h, ctx) {
      var params = {
        column: ctx.props.column,
        index: ctx.props.index
      };
      return ctx.props.render(h, params, ctx);
    }
  });
  Vue.component('table-expand', {
    name: 'TableExpand',
    functional: true,
    props: {
      row: Object,
      render: Function,
      index: Number,
      column: {
        'type': Object,
        'default': null
      }
    },
    render: function render(h, ctx) {
      var params = {
        row: ctx.props.row,
        index: ctx.props.index
      };
      if (ctx.props.column) params.column = ctx.props.column;
      return ctx.props.render(h, params, ctx);
    }
  });
  Vue.component('table-tr', {
    name: 'TableTr',
    template: '<li :class="rowClasses(row._index)">' + '<slot></slot>' + '</li>',
    props: {
      row: Object
    },
    data: function data() {
      return {
        table: vue_utils.findComponentUpward(this, 'Table')
      };
    },
    methods: {
      rowClasses: function rowClasses(_index) {
        var rowClasses = {};
        rowClasses[prefixCls + '-row'] = true;
        rowClasses[this.rowClsName(_index)] = !!this.rowClsName(_index);
        rowClasses[prefixCls + '-sort-disabled'] = this.row._fixed || this.isSortDisabled(this.row);
        return rowClasses;
      },
      rowClsName: function rowClsName(_index) {
        return this.table.rowClsName(this.row, _index);
      },
      isSortDisabled: function isSortDisabled(row) {
        if (!this.table.sortDisableAlias) return false;
        return row[this.table.sortDisableAlias] == this.table.sortDisableValue;
      }
    }
  });
  Vue.component('table-cell', {
    name: 'TableCell',
    template: '<div :class="classes" ref="cell">' + '<template v-if="renderType === columnType.expand && !row._disableExpand">' + '<div :class="expandCls" @click="toggleExpand">' + '<i class="' + prefixCls + '-expand-right"></i>' + '</div>' + '</template>' + '<template v-if="renderType === columnType.index">{{ naturalIndex + 1 }}</template>' + '<template v-if="renderType === columnType.selection">' + '<checkbox-component :true-value="true" :false-value="false" :value="checked" @click.native.stop="handleClick" @on-change="toggleSelect" :disabled="disabled"></checkbox-component>' + '</template>' + '<template v-if="renderType === columnType.radio">' + '<radio-component :value="checked" label="" @click.native.stop="handleClick" @on-change="toggleRadio" :disabled="disabled"></radio-component>' + '</template>' + '<template v-if="renderType === columnType.html"><span v-html="row[column.key]"></span></template>' + '<template v-if="renderType === columnType.normal"><span>{{ row[column.key] }}</span></template>' + '<table-expand v-if="renderType === columnType.render" :row="row" :column="column" :index="index" :render="column.render"></table-expand>' + '<template v-if="renderType === columnType.sortable">' + '<span class="jz-sort-body">' + '<span v-if="row._fixed" style="cursor: default;">位置固定</span>' + '<template v-else-if="!isSortDisabled(row)">' + '<i @click="sortUp(level, index, levelKey)" v-if="upCondition" class="jz-sort-arrow-up"></i>' + '<i @click="sortDown(level, index, levelKey)" v-if="downCondition" class="jz-sort-arrow-down"></i>' + '<i @click="sortRight(level, index, levelKey)" v-if="rightCondition && multiLevel" class="jz-sort-arrow-right"></i>' + '<i @click="sortLeft(level, index, levelKey)" v-if="leftCondition && multiLevel" class="jz-sort-arrow-left"></i>' + '</template>' + '</span>' + '</template>' + '</div>',
    props: {
      prefixCls: String,
      multiLevel: Boolean,
      level: Number,
      levelKey: {
        'type': String,
        'default': ''
      },
      row: Object,
      column: Object,
      naturalIndex: Number,
      index: [String, Number],
      checked: Boolean,
      disabled: Boolean,
      expanded: Boolean,
      maxLength: Number
    },
    data: function data() {
      return {
        renderType: '',
        table: vue_utils.findComponentUpward(this, 'Table'),
        level1: 1,
        level2: 2,
        level3: 3
      };
    },
    computed: {
      upCondition: function upCondition() {
        // 位置固定只支持最上和最下的情况 
        if (typeof this.table.objData[this.naturalIndex - 1] !== 'undefined' && typeof this.table.objData[this.naturalIndex - 1]._fixed !== 'undefined' && this.table.objData[this.naturalIndex - 1]._fixed) {
          return false;
        }

        if (typeof this.table.objData[this.naturalIndex - 1] !== 'undefined' && this.isSortDisabled(this.table.objData[this.naturalIndex - 1])) {
          return false;
        }

        return this.naturalIndex !== 0;
      },
      downCondition: function downCondition() {
        // 位置固定只支持最上和最下的情况 
        if (typeof this.table.objData[this.naturalIndex + 1] !== 'undefined' && typeof this.table.objData[this.naturalIndex + 1]._fixed !== 'undefined' && this.table.objData[this.naturalIndex + 1]._fixed) {
          return false;
        }

        if (typeof this.table.objData[this.naturalIndex + 1] !== 'undefined' && this.isSortDisabled(this.table.objData[this.naturalIndex + 1])) {
          return false;
        }

        return this.naturalIndex !== this.maxLength - 1;
      },
      rightCondition: function rightCondition() {
        var children = this.row.children;

        if (this.level === this.level1 && this.index === 0) {
          return false;
        }

        if (!!children && children.length) {
          if (this.level === this.level1) {
            return !children.some(function (row) {
              return !!row.children;
            });
          } else if (this.level === this.level2) {
            return false;
          }
        }

        if (this.level === this.level3 || this.index === 0) {
          return false;
        }

        return true;
      },
      leftCondition: function leftCondition() {
        if (this.level === this.level2 || this.level === this.level3) {
          return true;
        }

        return false;
      },
      columnType: function columnType() {
        var _columnType;

        var columnType = (_columnType = {
          'expand': 'expand',
          'index': 'index',
          'selection': 'selection',
          'radio': 'radio',
          'html': 'html',
          'normal': 'normal'
        }, _defineProperty(_columnType, "expand", 'expand'), _defineProperty(_columnType, 'render', 'render'), _defineProperty(_columnType, 'sortable', 'sortable'), _columnType);
        return columnType;
      },
      classes: function classes() {
        var classes = {};
        classes[this.prefixCls + '-cell'] = true;
        classes[this.prefixCls + '-cell-ellipsis'] = this.column.ellipsis || false;
        return classes;
      },
      expandCls: function expandCls() {
        var expandCls = {};
        expandCls[this.prefixCls + '-click'] = true;
        expandCls[this.prefixCls + '-cell-expand'] = true;
        expandCls[this.prefixCls + '-expand-expanded'] = !!this.expanded;
        return expandCls;
      }
    },
    methods: {
      toggleSelect: function toggleSelect() {
        this.table.toggleSelect(this.index);
      },
      toggleRadio: function toggleRadio() {
        this.table.toggleRadio(this.index);
      },
      toggleExpand: function toggleExpand() {
        this.table.toggleExpand(this.index);
      },
      handleClick: function handleClick() {},
      sortUp: function sortUp(level, index, _levelKey) {
        if (level === 1 && this.table.objData[index - 1]._fixed) return;
        this.table.sortUp(level, this.index, _levelKey);
      },
      sortDown: function sortDown(level, index, _levelKey) {
        if (level === 1 && this.table.objData[index + 1]._fixed) return;
        this.table.sortDown(level, this.index, _levelKey);
      },
      sortRight: function sortRight(level, index, _levelKey) {
        this.table.sortRight(level, this.index, _levelKey);
      },
      sortLeft: function sortLeft(level, index, _levelKey) {
        this.table.sortLeft(level, this.index, _levelKey);
      },
      isSortDisabled: function isSortDisabled(row) {
        if (!this.table.sortDisableAlias) return false;
        return row[this.table.sortDisableAlias] == this.table.sortDisableValue;
      }
    },
    created: function created() {
      if (this.column.type === 'index') {
        this.renderType = 'index';
      } else if (this.column.type === 'selection') {
        this.renderType = 'selection';
      } else if (this.column.type === 'radio') {
        this.renderType = 'radio';
      } else if (this.column.type === 'html') {
        this.renderType = 'html';
      } else if (this.column.type === 'expand') {
        this.renderType = 'expand';
      } else if (this.column.type === 'render') {
        this.renderType = 'render';
      } else if (this.column.type === 'sortable') {
        this.renderType = 'sortable';
      } else if (this.column.type === 'expand') {
        this.renderType = 'expand';
      } else {
        this.renderType = 'normal';
      }
    }
  });
  Vue.component('table-head', {
    name: 'TableHead',
    mixins: [tableMixin],
    template: '<table cellspacing="0" cellpadding="0" border="0" :style="styles">' + '<colgroup>' + '<col v-for="(column, index) in columns" :width="setCellWidth(column, index, true)">' + '</colgroup>' + '<thead>' + '<tr>' + '<th v-for="(column, index) in columns" :class="alignCls(column)" ref="tableHeadTh">' + '<div :class="cellClasses(column)">' + '<template v-if="column.type === columnType.expand">' + '<span v-if="!column.renderHeader">{{ column.title || "" }}</span>' + '<table-render-header v-else :render="column.renderHeader" :column="column" :index="index"></table-render-header>' + '</template>' + '<template v-else-if="column.type === columnType.selection">' + '<checkbox-component :true-value="true" :false-value="false" :value="isSelectAll" @on-change="selectAll" :disabled="!data.length"></checkbox-component>' + '</template>' + '<template v-else-if="column.type === columnType.radio">' + '<span>{{ column.title || "" }}</span>' + '</template>' + '<template v-else>' + '<span v-if="!column.renderHeader" @click="handleSortByHead(index)">{{ column.title }}</span>' + '<table-render-header v-else :render="column.renderHeader" :column="column" :index="index"></table-render-header>' + '<span class="' + prefixCls + '-head-sort" v-if="column.sortable">' + '<i class="jz-sort-arrow-up" :class="sortStatus(column._sortType, sortType.asc)" @click="handleSort(index, sortType.asc)"></i>' + '<i class="jz-sort-arrow-down" :class="sortStatus(column._sortType, sortType.desc)" @click="handleSort(index, sortType.desc)"></i>' + '</span>' + '</template>' + '<i v-if="resizable && (index != columns.length - 1)" class="jz_table__column_resizor" @mousedown="mousedownColumbResizorHandler($event, column)"></i>' + '</div>' + '</th>' + '</tr>' + '</thead>' + '</table>',
    props: {
      prefixCls: String,
      styleObject: Object,
      columns: Array,
      objData: Object,
      data: Array,
      columnsWidth: Object,
      pageSize: Number,
      page: Number,
      resizable: Boolean
    },
    data: function data() {
      return {
        table: vue_utils.findComponentUpward(this, 'Table')
      };
    },
    computed: {
      columnsLength: function columnsLength() {
        return this.columns.length;
      },
      columnType: function columnType() {
        var columnType = {};
        columnType['expand'] = 'expand';
        columnType['selection'] = 'selection';
        columnType['radio'] = 'radio';
        return columnType;
      },
      sortType: function sortType() {
        var sortType = {};
        sortType['asc'] = 'asc';
        sortType['desc'] = 'desc';
        return sortType;
      },
      styles: function styles() {
        var style = Object.assign({}, this.styleObject);
        var width = this.$parent.bodyHeight === 0 ? parseInt(this.styleObject.width) : parseInt(this.styleObject.width)
        /*+ this.$parent.scrollBarWidth*/
        ;

        if (this.table.flexible) {
          style.width = '100%';
        } else {
          style.width = width + 'px';
        }

        return style;
      },
      isSelectAll: function isSelectAll() {
        var isSelectAll = true;
        var showList = this.page !== -1 ? this.data.slice((this.page - 1) * this.pageSize, this.page * this.pageSize) : this.data;
        if (!showList.length) isSelectAll = false;

        if (!showList.every(function (item) {
          return !item._disabled;
        })) {
          isSelectAll = false;
        }

        for (var i = 0; i < showList.length; i++) {
          if (!this.objData[showList[i]._index]._isChecked && !this.objData[showList[i]._index]._isDisabled) {
            isSelectAll = false;
            break;
          }
        }

        return isSelectAll;
      }
    },
    watch: {
      columnsLength: function columnsLength() {
        if (this.table.flexible) {
          this.hasResetWidth = false;
          this.$nextTick(this.resetWidth);
        }
      }
    },
    methods: {
      cellClasses: function cellClasses(column) {
        var cellClasses = {};
        cellClasses[this.prefixCls + '-cell'] = true;
        cellClasses[this.prefixCls + '-selection'] = column.type === this.columnType.selection;
        return cellClasses;
      },
      sortStatus: function sortStatus(sortType, type) {
        var sortStatus = {};
        sortStatus['on'] = sortType === type;
        return sortStatus;
      },
      selectAll: function selectAll() {
        var status = !this.isSelectAll;
        this.$parent.selectAll(status);
      },
      handleSort: function handleSort(index, type) {
        if (this.columns[index]._sortType === type) {
          type = 'normal';
        }

        this.$parent.handleSort(index, type);
      },
      handleSortByHead: function handleSortByHead(index) {
        var column = this.columns[index];

        if (column.sortable) {
          var type = column._sortType;

          if (type === 'normal') {
            this.handleSort(index, 'asc');
          } else if (type === 'asc') {
            this.handleSort(index, 'desc');
          } else {
            this.handleSort(index, 'normal');
          }
        }
      },
      mousedownColumbResizorHandler: function mousedownColumbResizorHandler(e, column) {
        this.prevClientX = e.clientX;
        this.curColmn = this.$parent.columns[column._index];
        vue_utils.on(document, 'mousemove', this.mousemoveDocumentHandler);
        vue_utils.on(document, 'mouseup', this.mouseupDocumentHandler);

        if (this.table.flexible) {
          this.resetWidth();
        }
      },
      resetWidth: function resetWidth() {
        if (this.hasResetWidth) {
          return;
        }

        this.hasResetWidth = true;
        var self = this;
        this.$parent.columns.forEach(function (column, index) {
          var tableHeadThWidth = vue_utils.getStyle(self.$refs.tableHeadTh[index], 'width');
          var tableHeadThMinWidth = column.minWidth || 50;
          tableHeadThWidth = parseFloat(tableHeadThWidth);
          tableHeadThMinWidth = parseFloat(tableHeadThMinWidth);
          var newTableHeadThWidth = tableHeadThWidth < tableHeadThMinWidth ? tableHeadThMinWidth : tableHeadThWidth;
          column._width = column.width;
          column.width = newTableHeadThWidth + 'px';
        });
      },
      mousemoveDocumentHandler: function mousemoveDocumentHandler(e) {
        var width = parseFloat(this.curColmn.width);
        var minWidth = parseFloat(this.curColmn.minWidth) || 50;
        var maxWidth = 2000;
        width += e.clientX - this.prevClientX;
        this.prevClientX = e.clientX;
        var newWidth = width < minWidth ? minWidth : width > maxWidth ? maxWidth : width;
        this.curColmn.width = newWidth + 'px';
      },
      mouseupDocumentHandler: function mouseupDocumentHandler() {
        this.doDestroy();
        this.table.$emit('resize-stop');
      },
      doDestroy: function doDestroy() {
        vue_utils.off(document, 'mousemove', this.mousemoveDocumentHandler);
        vue_utils.off(document, 'mouseup', this.mouseupDocumentHandler);
        this.curColmn = null;
      },
      resizeWindowHandler: function resizeWindowHandler() {
        var self = this;
        var useResetWidth = false;
        this.$parent.columns.forEach(function (column, index) {
          var tableHeadThWidth = vue_utils.getStyle(self.$refs.tableHeadTh[index], 'width');
          var tableHeadThMinWidth = column.minWidth;
          tableHeadThWidth = parseFloat(tableHeadThWidth);
          tableHeadThMinWidth = parseFloat(tableHeadThMinWidth);

          if (tableHeadThWidth < tableHeadThMinWidth) {
            useResetWidth = true;
          }
        });

        if (useResetWidth) {
          this.resetWidth();
        }
      }
    },
    mounted: function mounted() {
      if (this.table.flexible) {
        vue_utils.on(window, 'resize', vue_utils.debounce(this.resizeWindowHandler));
        this.resizeWindowHandler();
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.doDestroy();
      vue_utils.off(window, 'resize', this.resizeWindowHandler);
    }
  });
  Vue.component('table-body', {
    name: 'TableBody',
    mixins: [tableMixin],
    template: '<div v-if="showTableBody" v-nestable="nestableData" :style="styleObject" :class="tableBodyClass">' + '<ol class="' + prefixCls + '-dd-list">' + '<template v-for="(row, firstIndex) in pageData">' + '<table-tr :data-id="liKey(row._rowKey, row)" :row="row" :style="trStyle(firstIndex)" class="' + prefixCls + '-dd-item">' + '<template v-if="!!row.children && multiLevel && row.children.length">' + '<button data-action="collapse" class="dd-collapse" @click="collapse(row)" v-show="!row._collapsed"></button>' + '<button data-action="expand" class="dd-expand" @click="expand(row)" v-show="row._collapsed"></button>' + '</template>' + '<div :class="handleCls" :style="multiStyle(\'\')">' + '<div class="' + prefixCls + '-td" :class="alignCls(column, row)" :style="columnWidth(column._width)" :key="Math.random() * column._columnKey" v-for="column in columns">' + '<table-cell :multi-level="multiLevel" :level="1" :prefix-cls="prefixCls" :row="row" :key="column._columnKey" :column="column" :natural-index="firstIndex" :max-length="data.length" :index="row._index" :checked="rowChecked(row._index)" :disabled="rowDisabled(row._index)" :expanded="rowExpanded(row._index)"></table-cell>' + '</div>' + '</div>' + '<ol v-if="!!row.children && multiLevel && row.children.length" v-show="!row._collapsed" class="' + prefixCls + '-dd-list">' + '<template v-if="!!row.children && multiLevel && row.children.length" v-for="(childRow, secondIndex) in row.children">' + '<table-tr class="' + prefixCls + '-dd-item" :row="childRow" :data-id="liKeyLevel(childRow._levelKey, childRow)">' + '<template v-if="!!childRow.children && multiLevel && childRow.children.length">' + '<button data-action="collapse" class="dd-collapse" @click="collapse(childRow)" v-show="!childRow._collapsed"></button>' + '<button data-action="expand" class="dd-expand" @click="expand(childRow)" v-show="childRow._collapsed"></button>' + '</template>' + '<div :class="handleCls" :style="multiStyle(\'\', row._collapsed)">' + '<div class="dd-fill-style" :style="multiStyle(\'fill\')"></div>' + '<div class="' + prefixCls + '-td" :class="alignCls(column, childRow)" :style="columnWidth(column._width)" v-for="column in columns">' + '<table-cell :multi-level="multiLevel" :level="2" :levelKey="childRow._levelKey" :prefix-cls="prefixCls" :row="childRow" :key="column._columnKey" :column="column" :natural-index="secondIndex" :max-length="childRow._maxLength" :index="childRow._index"></table-cell>' + '</div>' + '</div>' + '<ol v-if="!!childRow.children && multiLevel && childRow.children.length && maxDepth === 3" v-show="!childRow._collapsed" class="' + prefixCls + '-dd-list">' + '<template v-if="!!childRow.children && multiLevel && childRow.children.length" v-for="(grandsonRow, thirdIndex) in childRow.children">' + '<table-tr class="' + prefixCls + '-dd-item" :row="grandsonRow" :data-id="liKeyLevel(grandsonRow._levelKey, grandsonRow)">' + '<div :class="handleCls" :style="multiStyle(\'\', childRow._collapsed)">' + '<div class="dd-fill-style" :style="multiStyle(\'fill\')"></div>' + '<div class="' + prefixCls + '-td" :class="alignCls(column, grandsonRow)" :style="columnWidth(column._width)" v-for="column in columns">' + '<table-cell :multi-level="multiLevel" :level="3" :levelKey="grandsonRow._levelKey" :prefix-cls="prefixCls" :row="grandsonRow" :key="column._columnKey" :column="column" :natural-index="thirdIndex" :max-length="grandsonRow._maxLength" :index="grandsonRow._index"></table-cell>' + '</div>' + '</div>' + '</table-tr>' + '</template>' + '</ol>' + '</table-tr>' + '</template>' + '</ol>' + '</table-tr>' + '<table-tr :row="row" class="' + prefixCls + '-expand-row J-expand-row" v-if="rowExpanded(row._index)">' + '<table-expand :key="row._rowKey" :row="row" :render="expandRender" :index="row._index"></table-expand>' + '</table-tr>' + '</template>' + '</ol>' + '</div>',
    props: {
      prefixCls: String,
      styleObject: Object,
      dragSortable: Boolean,
      multiLevel: Boolean,
      columns: Array,
      data: Array,
      objData: Object,
      columnsWidth: Object,
      pageSize: Number,
      page: Number,
      dragClass: String,
      maxDepth: Number
    },
    directives: {
      'nestable': {
        bind: function bind(el, binding, vnode) {
          var context = vnode.context;
          $(el).nestable({
            group: 0,
            maxDepth: context.multiLevel ? context.maxDepth : 1,
            dragClass: 'jz-table-dragel ' + context.dragClass,
            rootClass: 'jz-table-dd',
            noDragClass: 'dd-fill-style',
            listClass: 'jz-table-dd-list',
            itemClass: 'jz-table-dd-item',
            dragDisableClass: 'jz-table-sort-disabled',
            dropDisableClass: 'jz-table-sort-disabled',
            collapseBtnHTML: '<button data-action="collapse" class="dd-collapse"></button>',
            expandBtnHTML: '<button data-action="expand" class="dd-expand"></button>',
            dragSortable: context.dragSortable
          }).on('drag-change', function (e) {
            (function set(context, str, val) {
              str = str.split('.');

              while (str.length > 1) {
                context = context[str.shift()];
              }

              if (JSON.stringify(context.table.data) !== JSON.stringify(val)) {
                context[str.shift()] = val;
              }
            })(context, binding.expression, $(el).nestable('serialize'));
          });
        },
        unbind: function unbind(el, binding, vnode) {
          var context = vnode.context;

          if (!context.dragSortable) {
            return;
          }

          $(el).nestable('reset');
        }
      }
    },
    data: function data() {
      return {
        multiLevelTdWidth: 0,
        nestableData: [],
        showTableBody: true,
        table: vue_utils.findComponentUpward(this, 'Table')
      };
    },
    computed: {
      pageData: function pageData() {
        return this.page !== -1 ? this.data.slice((this.page - 1) * this.pageSize, this.page * this.pageSize) : this.data;
      },
      handleCls: function handleCls() {
        var handleCls = {};
        handleCls['dd-handle'] = true;
        handleCls['dd-handle-layout'] = !!this.table.flexible;
        return handleCls;
      },
      tableBodyClass: function tableBodyClass() {
        var tableBodyClass = {};
        tableBodyClass[prefixCls + '-ol'] = true;
        tableBodyClass[prefixCls + '-dd'] = true;
        tableBodyClass['nestable'] = !!this.dragSortable;
        tableBodyClass['level-1'] = !this.multiLevel;
        return tableBodyClass;
      },
      expandRender: function expandRender() {
        var render = function render() {
          return '';
        };

        for (var i = 0; i < this.columns.length; i++) {
          var column = this.columns[i];

          if (column.type && column.type === 'expand') {
            if (column.render) render = column.render;
          }
        }

        return render;
      }
    },
    methods: {
      collapse: function collapse(row) {
        row._collapsed = true;
      },
      expand: function expand(row) {
        row._collapsed = false;
      },
      liKey: function liKey(_rowKey, row) {
        var _this = this;

        var obj = vue_utils.deepCopy(row);
        delete obj._index;
        delete obj._level;
        delete obj._rowKey;

        if (obj.hasOwnProperty('children')) {
          delete obj.children;
        } //$(_this.$el).find('[data-id='+ _rowKey +']').data('' + _rowKey, obj);


        return JSON.stringify(obj);
      },
      liKeyLevel: function liKeyLevel(_levelKey, row) {
        var obj = vue_utils.deepCopy(row);
        delete obj._levelKey;
        delete obj._level;

        if (obj.hasOwnProperty('children')) {
          delete obj.children;
        } //$(this.$el).find('[data-id='+ _levelKey +']').data(_levelKey, obj);


        return JSON.stringify(obj);
      },
      columnWidth: function columnWidth(width) {
        var style = {};

        if (this.table.flexible) {
          style.width = width;
        } else {
          style.width = width + 'px';
          style.maxWidth = width + 'px';
        }

        return style;
      },
      rowChecked: function rowChecked(_index) {
        return this.objData[_index] && this.objData[_index]._isChecked;
      },
      rowDisabled: function rowDisabled(_index) {
        return this.objData[_index] && this.objData[_index]._isDisabled;
      },
      rowExpanded: function rowExpanded(_index) {
        return this.objData[_index] && this.objData[_index]._isExpanded;
      },
      trStyle: function trStyle(_index, type) {
        var trStyle = {};
        if (this.multiLevel) return trStyle;

        if (_index % 2 === 1) {
          //#f8f9fb
          trStyle.background = '#f8f9fb';
        } else {
          trStyle.background = '#fff';
        }

        return trStyle;
      },
      multiStyle: function multiStyle(type, collapse) {
        var multiStyle = {};
        if (!this.multiLevel) return multiStyle;

        if (type != 'fill' && !collapse) {
          multiCount++;
        }

        if (multiCount % 2 === 1) {
          multiStyle.background = '#fff';
        } else {
          multiStyle.background = '#f8f9fb';
        }

        return multiStyle;
      },
      adjustTdWidth: function adjustTdWidth() {
        var _this = this;

        if (!_this.multiLevel) {
          return;
        }

        this.$nextTick(function () {
          if (_this.$el.nodeName !== 'DIV') {
            return;
          }

          var level1Class = '.jz-table-dd-list';
          var level2Class = level1Class + ' ' + level1Class;
          var level3Class = level2Class + ' ' + level1Class;
          var tdClass = '.jz-table-dd-item .j-multi-level';

          var $level1List = _this.$el.querySelectorAll(level1Class);

          var $level2List = _this.$el.querySelectorAll(level2Class);

          var $level3List = _this.$el.querySelectorAll(level3Class);

          var $level1Td = _this.$el.querySelectorAll(level1Class + ' ' + tdClass);

          var $level2Td = _this.$el.querySelectorAll(level2Class + ' ' + tdClass);

          var $level3Td = _this.$el.querySelectorAll(level3Class + ' ' + tdClass);

          var pl2 = parseInt(vue_utils.getStyle($level2List[0], 'padding-left')) || 0;
          var pl3 = parseInt(vue_utils.getStyle($level3List[0], 'padding-left')) || 0;
          vue_utils.setStyle($level1Td, 'width', _this.multiLevelTdWidth + 'px');
          vue_utils.setStyle($level2Td, 'width', _this.multiLevelTdWidth - pl2 + 'px');
          vue_utils.setStyle($level2Td, 'max-width', _this.multiLevelTdWidth - pl2 + 'px');
          vue_utils.setStyle($level3Td, 'width', _this.multiLevelTdWidth - pl2 - pl3 + 'px');
          vue_utils.setStyle($level3Td, 'max-width', _this.multiLevelTdWidth - pl2 - pl3 + 'px');
        });
      }
    },
    mounted: function mounted() {
      var _this = this;

      multiCount = 0;
      this.$nextTick(function () {
        _this.multiLevelTdWidth = parseInt(vue_utils.getStyle(_this.$el.querySelectorAll('.jz-table-dd-list .j-multi-level')[0], 'width'));
      });
    },
    updated: function updated() {
      var _this = this;

      multiCount = 0;
      this.adjustTdWidth();
      scrollTop && this.table.$refs.scrollbar.$emit('scrollTo', scrollTop);
      setTimeout(function () {
        scrollTop = 0;
      });
    },
    watch: {
      nestableData: function nestableData(val) {
        var _this = this;

        scrollTop = this.table.$refs.scrollbar.$refs.wrap.scrollTop;
        this.showTableBody = false;
        this.$nextTick(function () {
          _this.showTableBody = true;
        });
        this.table.dragDataChange(this.nestableData);
      },
      dragSortable: function dragSortable() {
        var _this = this;

        this.showTableBody = false;
        this.$nextTick(function () {
          _this.showTableBody = true;
        });
      }
    }
  });
})();

(function () {
  var prefixCls = 'jz-table';
  var rowKey = 1;
  var columnKey = 1;
  Vue.component('table-component', {
    name: 'Table',
    template: '<div :class="wrapClasses" :style="styles">' + '<div class="' + prefixCls + '-title" v-if="showSlotHeader" ref="title">' + '<slot name="header"></slot>' + '</div>' + '<div :class="classes">' + '<div class="' + prefixCls + '-header" v-if="showHeader" ref="header">' + '<table-head :resizable="resizable" :page-size="pageSize" :page="page" :prefix-cls="prefixCls" :styleObject="tableStyle" :columns="cloneColumns" :obj-data="objData" :columns-width="columnsWidth" :data="rebuildData"></table-head>' + '</div>' + '<div class="' + prefixCls + '-body" :style="bodyStyle" ref="body" v-show="!((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))">' + '<scrollbar-component :horizontal="resizable" :max-height="maxBodyHeight" ref="scrollbar" theme="table" @scroll="scrollTableBodyHandler">' + '<table-body :max-depth="maxDepth" :page-size="pageSize" :dragClass="dragClass" :page="page" :drag-sortable="dragSortable" :multiLevel="multiLevel" v-if="!((!data || data.length === 0) || (!rebuildData || rebuildData.length === 0))" ref="tbody" :prefix-cls="prefixCls" :styleObject="tableStyle" :columns="cloneColumns" :data="rebuildData" :columns-width="columnsWidth" :obj-data="objData"></table-body>' + '</scrollbar-component>' + '<div v-if="loading" class="spin spin-fix">' + '<div class="spin-main">' + '<span class="spin-dot"></span>' + '</div>' + '</div>' + '</div>' + '<div class="' + prefixCls + '-tip" v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))">' + '<table :style="tableStyle" cellspacing="0" cellpadding="0" border="0">' + '<tbody>' + '<tr>' + '<td :style="{ height: bodyStyle.height }">' + '<span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>' + '<span v-html="localeNoFilteredDataText" v-else></span>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</div>' + '</div>' + '<div class="' + prefixCls + '-footer" v-if="showSlotFooter" ref="footer">' + '<slot name="footer"></slot>' + '</div>' + '<div class="jz-table-count" v-if="showCount">总共{{count}}个</div>' + '</div>',
    props: {
      data: {
        'type': Array,
        'default': function _default() {
          return [];
        }
      },
      columns: {
        'type': Array,
        'default': function _default() {
          return [];
        }
      },
      dragSortable: {
        'type': Boolean,
        'default': false
      },
      sortDisableAlias: {
        'type': String,
        'default': ""
      },
      sortDisableValue: {
        'type': [Boolean, Number, String],
        'default': true
      },
      multiLevel: {
        'type': Boolean,
        'default': false
      },
      showHeader: {
        'type': Boolean,
        'default': true
      },
      noDataText: {
        'type': String,
        'default': '表格无数据'
      },
      noFilteredDataText: {
        'type': String,
        'default': '无匹配数据'
      },
      rowClassName: {
        'type': Function,
        'default': function _default() {
          return '';
        }
      },
      loading: {
        'type': Boolean,
        'default': false
      },
      pageSize: {
        'type': Number,
        'default': function _default() {
          return -1;
        }
      },
      page: {
        'type': Number,
        'default': function _default() {
          return -1;
        }
      },
      width: [Number, String],
      height: [Number, String],
      dragClass: String,
      flexible: Boolean,
      maxDepth: {
        'type': Number,
        'default': function _default() {
          return 3;
        }
      },
      resizable: Boolean,
      maxBodyHeight: Number,
      showCount: Boolean
    },
    data: function data() {
      return {
        ready: false,
        tableWidth: 0,
        bodyRealHeight: 0,
        scrollBarWidth: vue_utils.scrollbarWidth(),
        prefixCls: prefixCls,
        showSlotHeader: true,
        showSlotFooter: true,
        bodyHeight: 0,
        columnsWidth: {},
        rebuildData: [],
        cloneColumns: this.makeColumns(),
        objData: this.makeObjData(),
        localeNoDataText: this.noDataText,
        localeNoFilteredDataText: this.noFilteredDataText
      };
    },
    computed: {
      count: function count() {
        var flattenByKeyChildren = function flattenByKeyChildren(arr) {
          if (!Array.isArray(arr)) {
            return [];
          }

          return arr.reduce(function (pre, cur) {
            return pre.concat(cur).concat(flattenByKeyChildren(cur.children));
          }, []);
        };

        return this.multiLevel ? flattenByKeyChildren(this.data).length : this.data.length;
      },
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses[prefixCls + '-wrapper'] = true;
        wrapClasses[prefixCls + '-wrapper-hide'] = !this.ready;
        wrapClasses[prefixCls + '-with-header'] = !!this.showSlotHeader;
        wrapClasses[prefixCls + '-with-footer'] = !!this.showSlotFooter;
        return wrapClasses;
      },
      classes: function classes() {
        var classes = {};
        classes[prefixCls] = true;
        classes[prefixCls + '-with-fixed-top'] = !!this.height;
        return classes;
      },
      styles: function styles() {
        var style = {};
        if (this.width) style.width = typeof this.width == 'number' ? this.width + 'px' : this.width;
        return style;
      },
      tableStyle: function tableStyle() {
        var style = {};
        if (this.flexible) return style;

        if (this.tableWidth !== 0) {
          var width = '';

          if (this.bodyHeight === 0) {
            width = this.tableWidth;
            style.width = width + 'px';
          } else {
            //if (this.bodyHeight > this.bodyRealHeight) {
            width = this.tableWidth;
            style.width = width + 'px'; //} else {
            //    width = this.tableWidth;
            //    style.width = width;
            //}
          }
        }

        return style;
      },
      bodyStyle: function bodyStyle() {
        var style = {};

        if (this.bodyHeight !== 0) {
          var height = this.bodyHeight;
          style.height = height + 'px';
        }

        return style;
      }
    },
    methods: {
      scrollTableBodyHandler: function scrollTableBodyHandler(e) {
        this.$refs.header.scrollLeft = e.target.scrollLeft;
      },
      fixedHeader: function fixedHeader() {
        var _this = this;

        if (this.height) {
          this.$nextTick(function () {
            var headerHeight = parseInt(vue_utils.getStyle(_this.$refs.header, 'height')) || 0;
            _this.bodyHeight = _this.height - headerHeight;
          });
        } else {
          this.bodyHeight = 0;
        }
      },
      rowClsName: function rowClsName(row, index) {
        return this.rowClassName(row, index);
      },
      handleResize: function handleResize() {
        var _this = this;

        _this.$nextTick(function () {
          if (!_this.flexible) {
            var allWidth = !_this.columns.some(function (cell) {
              return !cell.width;
            });

            if (allWidth) {
              _this.tableWidth = _this.columns.map(function (cell) {
                return cell.width;
              }).reduce(function (a, b) {
                return a + b;
              }, 0);
            } else {
              _this.tableWidth = parseInt(vue_utils.getStyle(_this.$el, 'width')) - 1;
            }
          }

          _this.columnsWidth = {};
          if (!_this.$refs.tbody) return;

          _this.$nextTick(function () {
            var columnsWidth = {};

            if (_this.data.length) {
              var $td = _this.$refs.tbody.$el.querySelectorAll('.jz-table-ol li')[0].children;

              for (var i = 0; i < $td.length; i++) {
                if ($td[i].classList.contains('jz-table-td')) {
                  var column = _this.cloneColumns[i];
                  var width = parseInt(vue_utils.getStyle($td[i], 'width'));

                  if (column === undefined) {
                    continue;
                  }

                  if (column.width) width = column.width;
                  if (Number.isNaN(width)) continue;
                  _this.cloneColumns[i]._width = width;
                  columnsWidth[column._index] = {
                    width: width
                  };
                }
              }

              _this.columnsWidth = columnsWidth;
            }

            _this.bodyRealHeight = parseInt(vue_utils.getStyle(_this.$refs.tbody.$el, 'height'));
          });
        });
      },
      makeColumns: function makeColumns() {
        var columns = vue_utils.deepCopy(this.columns);
        var center = [];
        columns.forEach(function (column, index) {
          column._index = index;
          column._columnKey = columnKey++;
          column._width = column.width ? column.width : '';
          column._sortType = 'normal';
          column._isFiltered = false;
          column._filterChecked = [];

          if ('filteredValue' in column) {
            column._filterChecked = column.filteredValue;
            column._isFiltered = true;
          }

          if ('sortType' in column) {
            column._sortType = column.sortType;
          }

          center.push(column);
        });
        return center;
      },
      makeObjData: function makeObjData() {
        var data = {};
        this.data.forEach(function (row, index) {
          var newRow = vue_utils.deepCopy(row);
          newRow._index = index;

          if (newRow._fixed) {
            newRow._fixed = newRow._fixed;
          } else {
            newRow._fixed = false;
          }

          if (newRow._disabled) {
            newRow._isDisabled = newRow._disabled;
          } else {
            newRow._isDisabled = false;
          }

          if (newRow._checked) {
            newRow._isChecked = newRow._checked;
          } else {
            newRow._isChecked = false;
          }

          if (newRow._expanded) {
            newRow._isExpanded = newRow._expanded;
          } else {
            newRow._isExpanded = false;
          }

          data[index] = newRow;
        });
        return data;
      },
      sortData: function sortData(data, type, index) {
        var _this = this;

        var key = this.cloneColumns[index].key;
        data.sort(function (a, b) {
          if (_this.cloneColumns[index].sortMethod) {
            return _this.cloneColumns[index].sortMethod(a[key], b[key], type);
          } else {
            if (type === 'asc') {
              return a[key] > b[key] ? 1 : -1;
            } else if (type === 'desc') {
              return a[key] < b[key] ? 1 : -1;
            }
          }
        });
        return data;
      },
      deleteUnrelatedAttr: function deleteUnrelatedAttr() {
        var _this = this;

        var backData = vue_utils.deepCopy(this.rebuildData);
        backData.forEach(function (row, index) {
          delete row._index;
          delete row._rowKey;
          delete row._levelKey;
          delete row._level;

          if (!_this.dragSortable || !_this.multiLevel) {
            return;
          }

          var children = row.children;

          if (!!children) {
            if (!children.length) {
              delete row.children;
            }

            children.forEach(function (row, index) {
              delete row._index;
              delete row._rowKey;
              delete row._levelKey;
              delete row._maxLength;
              delete row._level;
              var grandson = row.children;

              if (!!grandson) {
                if (!grandson.length) {
                  delete row.children;
                }

                grandson.forEach(function (row, index) {
                  delete row._index;
                  delete row._rowKey;
                  delete row._levelKey;
                  delete row._maxLength;
                  delete row._level;
                });
              }
            });
          }
        });
        return backData;
      },
      sortUp: function sortUp(level, index, _levelKey) {
        if (level === 1) {
          var tmp = this.rebuildData[index];
          this.rebuildData[index] = this.rebuildData[index - 1];
          this.rebuildData[index - 1] = tmp;
        } else if (level === 2) {
          var keyArr = vue_utils.stringToIntArray(_levelKey.split('-'));
          var targetArr = this.rebuildData[keyArr[0]].children;
          var targetIndex = keyArr[1];
          var tmp = targetArr[targetIndex];
          targetArr[targetIndex] = targetArr[targetIndex - 1];
          targetArr[targetIndex - 1] = tmp;
        } else if (level === 3) {
          var keyArr = vue_utils.stringToIntArray(_levelKey.split('-'));
          var targetArr = this.rebuildData[keyArr[0]].children[keyArr[1]].children;
          var targetIndex = keyArr[2];
          var tmp = targetArr[targetIndex];
          targetArr[targetIndex] = targetArr[targetIndex - 1];
          targetArr[targetIndex - 1] = tmp;
        } //this.rebuildData.splice(this.rebuildData.length);


        this.$emit('on-sort-up-click', index);
        this.$emit('on-sort-body-change', this.deleteUnrelatedAttr());
      },
      sortDown: function sortDown(level, index, _levelKey) {
        if (level === 1) {
          var tmp = this.rebuildData[index];
          this.rebuildData[index] = this.rebuildData[index + 1];
          this.rebuildData[index + 1] = tmp;
        } else if (level === 2) {
          var keyArr = vue_utils.stringToIntArray(_levelKey.split('-'));
          var targetArr = this.rebuildData[keyArr[0]].children;
          var targetIndex = keyArr[1];
          var tmp = targetArr[targetIndex];
          targetArr[targetIndex] = targetArr[targetIndex + 1];
          targetArr[targetIndex + 1] = tmp;
        } else if (level === 3) {
          var keyArr = vue_utils.stringToIntArray(_levelKey.split('-'));
          var targetArr = this.rebuildData[keyArr[0]].children[keyArr[1]].children;
          var targetIndex = keyArr[2];
          var tmp = targetArr[targetIndex];
          targetArr[targetIndex] = targetArr[targetIndex + 1];
          targetArr[targetIndex + 1] = tmp;
        } //this.rebuildData.splice(this.rebuildData.length);


        this.$emit('on-sort-down-click', index);
        this.$emit('on-sort-body-change', this.deleteUnrelatedAttr());
      },
      sortRight: function sortRight(level, index, _levelKey) {
        if (level === 1) {
          var target = this.rebuildData[index];
          var siblingTarget = this.rebuildData[index - 1];

          if (!!siblingTarget.children) {
            siblingTarget.children.push(target);
          } else {
            siblingTarget.children = [target];
          }

          this.rebuildData.splice(index, 1);
        } else if (level === 2) {
          var keyArr = vue_utils.stringToIntArray(_levelKey.split('-'));
          var targetArr = this.rebuildData[keyArr[0]].children;
          var targetIndex = keyArr[1];
          var tmp = targetArr[targetIndex];
          var target = targetArr[targetIndex - 1];

          if (!!target.children) {
            target.children.push(tmp);
            targetArr.splice(targetIndex, 1);
          } else {
            target.children = [tmp];
            targetArr.splice(targetIndex, 1);
          }
        }

        this.$emit('on-sort-right-click', index);
        this.$emit('on-sort-body-change', this.deleteUnrelatedAttr());
      },
      sortLeft: function sortLeft(level, index, _levelKey) {
        if (level === 2) {
          var keyArr = vue_utils.stringToIntArray(_levelKey.split('-'));
          var targetArr = this.rebuildData[keyArr[0]].children;
          var targetIndex = keyArr[1];
          var tmp = targetArr[targetIndex];
          targetArr.splice(targetIndex, 1);
          this.rebuildData.splice(keyArr[0] + 1, 0, tmp);
        } else if (level === 3) {
          var keyArr = vue_utils.stringToIntArray(_levelKey.split('-'));
          var targetArr = this.rebuildData[keyArr[0]].children[keyArr[1]].children;
          var targetIndex = keyArr[2];
          var tmp = targetArr[targetIndex];
          targetArr.splice(targetIndex, 1);
          this.rebuildData[keyArr[0]].children.splice(keyArr[1] + 1, 0, tmp);
        }

        this.$emit('on-sort-right-click', index);
        this.$emit('on-sort-body-change', this.deleteUnrelatedAttr());
      },
      makeData: function makeData() {
        var _this = this;

        var data = vue_utils.deepCopy(this.data);
        data.forEach(function (row, index) {
          row._index = index;
          row._rowKey = rowKey++;
          row._level = 1;

          if (_this.multiLevel) {
            row._collapsed = row._collapsed || false;
          }

          if (!_this.dragSortable || !_this.multiLevel) {
            return;
          }

          var level1Index = index;
          var children = row.children;

          if (!!children && children.length) {
            children.forEach(function (row, index) {
              row._index = index;
              row._levelKey = level1Index + '-' + index;
              row._maxLength = children.length;
              row._level = 2;

              if (_this.multiLevel) {
                row._collapsed = row._collapsed || false;
              }

              var level2Index = index;
              var grandson = row.children;

              if (!!grandson && grandson.length && _this.maxDepth === 3) {
                grandson.forEach(function (row, index) {
                  row._index = index;
                  row._levelKey = level1Index + '-' + level2Index + '-' + index;
                  row._maxLength = grandson.length;
                  row._level = 3;
                });
              }
            });
          }
        });
        return data;
      },
      makeDataWithFilter: function makeDataWithFilter() {
        var _this = this;

        var data = this.makeData();
        this.cloneColumns.forEach(function (col) {
          return data = _this.filterData(data, col);
        });
        return data;
      },
      handleSort: function handleSort(index, type) {
        this.cloneColumns.forEach(function (col) {
          return col._sortType = 'normal';
        });
        var key = this.cloneColumns[index].key;

        if (type === 'normal') {
          this.rebuildData = this.makeDataWithFilter();
        } else {
          this.rebuildData = this.sortData(this.rebuildData, type, index);
        }

        this.cloneColumns[index]._sortType = type;
        this.$emit('on-sort-head-change', {
          column: JSON.parse(JSON.stringify(this.columns[this.cloneColumns[index]._index])),
          key: key,
          order: type,
          data: this.deleteUnrelatedAttr()
        });
      },
      makeDataWithSort: function makeDataWithSort() {
        var data = this.makeData();
        var sortType = 'normal';
        var sortIndex = -1;
        var isCustom = false;

        for (var i = 0; i < this.cloneColumns.length; i++) {
          if (this.cloneColumns[i]._sortType !== 'normal') {
            sortType = this.cloneColumns[i]._sortType;
            sortIndex = i;
            isCustom = this.cloneColumns[i].sortable === 'custom';
            break;
          }
        }

        if (sortType !== 'normal' && !isCustom) data = this.sortData(data, sortType, sortIndex);
        return data;
      },
      makeDataWithSortAndFilter: function makeDataWithSortAndFilter() {
        var _this = this;

        var data = this.makeDataWithSort();
        this.cloneColumns.forEach(function (col) {
          return data = _this.filterData(data, col);
        });
        return data;
      },
      filterData: function filterData(data, column) {
        var _this = this;

        return data.filter(function (row) {
          var status = !column._filterChecked.length;

          for (var i = 0; i < column._filterChecked.length; i++) {
            status = column.filterMethod(column._filterChecked[i], row);
            if (status) break;
          }

          return status;
        });
      },
      toggleSelect: function toggleSelect(_index) {
        var data = {};

        for (var i in this.objData) {
          if (parseInt(i) === _index) {
            data = this.objData[i];
          }
        }

        var status = !data._isChecked;
        var selection = this.getSelection();
        this.objData[_index]._isChecked = status;
        this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(this.data[_index])));
        this.$emit('on-selection-change', this.getSelection());
      },
      toggleRadio: function toggleRadio(_index) {
        var data = {};

        for (var i in this.objData) {
          if (parseInt(i) === _index) {
            this.objData[i]._isChecked = true;
          } else {
            this.objData[i]._isChecked = false;
          }
        }

        var radioSelection = this.getRadioSelection();
        this.$emit('on-radio-change', radioSelection);
      },
      getRadioSelection: function getRadioSelection() {
        var tmpIndex;
        var data = {};

        for (var i in this.objData) {
          if (this.objData[i]._isChecked) {
            tmpIndex = i;
            break;
          }
        }

        var backObj = this.data[tmpIndex];
        data.selected = backObj;
        data.selectedIndex = tmpIndex;
        return JSON.parse(JSON.stringify(data));
      },
      getSelection: function getSelection(type) {
        var selectionIndexes = [];
        var data = {};

        for (var i in this.objData) {
          if (this.objData[i]._isChecked) {
            selectionIndexes.push(parseInt(i));
          }
        }

        var backArr = this.data.filter(function (data, index) {
          return selectionIndexes.indexOf(index) > -1;
        });
        data.selected = backArr;
        data.selectedIndex = selectionIndexes;
        return JSON.parse(JSON.stringify(data));
      },
      toggleExpand: function toggleExpand(_index) {
        var index = _index;
        var data = {};

        for (var i in this.objData) {
          if (parseInt(i) === index) {
            data = this.objData[i];
          }
        }

        var status = !data._isExpanded;
        this.objData[index]._isExpanded = status;
        this.$emit('on-expand', JSON.parse(JSON.stringify(this.data[index])), status);
      },
      selectAll: function selectAll(status) {
        var selectList = this.page !== -1 ? this.rebuildData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize) : this.rebuildData;

        for (var i = 0; i < selectList.length; i++) {
          if (this.objData[selectList[i]._index]._isDisabled) {
            continue;
          } else {
            this.objData[selectList[i]._index]._isChecked = status;
          }
        }

        var selection = this.getSelection();

        if (status) {
          this.$emit('on-select-all', selection);
        } else {
          this.$emit('on-select-all-cancel');
        }

        this.$emit('on-selection-change', selection);
      },
      dragDataChange: function dragDataChange(data) {
        this.$emit('on-drag-data-change', data);
      }
    },
    created: function created() {
      this.showSlotHeader = this.$slots.header !== undefined;
      this.showSlotFooter = this.$slots.footer !== undefined;
      this.rebuildData = this.makeDataWithSortAndFilter();
    },
    mounted: function mounted() {
      var _this = this;

      _this.handleResize();

      _this.fixedHeader();

      _this.$nextTick(function () {
        _this.ready = true;
      });
    },
    watch: {
      height: function height(val) {
        this.fixedHeader();
      },
      data: {
        handler: function handler() {
          rowKey = 1;
          var oldDataLen = this.rebuildData.length;
          this.objData = this.makeObjData();
          this.rebuildData = this.makeDataWithSortAndFilter();
          this.handleResize();

          if (!oldDataLen) {
            this.fixedHeader();
          }
        },
        deep: true
      },
      columns: {
        handler: function handler() {
          columnKey = 1;
          this.cloneColumns = this.makeColumns();
          this.rebuildData = this.makeDataWithSortAndFilter();
          this.handleResize();
        },
        deep: true
      }
    }
  });
})();
/*
 *	Tabs 标签页
 *	<tabs-component>
 *		<tab-pane-component></tab-pane-component>
 *	<tabs-component>
 */
;

(function () {
  Vue.component('tab-pane-component', {
    name: 'JzTabPane',
    props: {
      label: String,
      hidden: Boolean,
      name: String
    },
    template: '<div class="jz-tab-pane" v-show="active">' + '<slot></slot>' + '</div>',
    data: function data() {
      return {
        index: null
      };
    },
    computed: {
      tabs: function tabs() {
        return vue_utils.findComponentUpward(this, 'JzTabs');
      },
      active: function active() {
        return !this.hidden && this.tabs.currentName === this.paneName;
      },
      paneName: function paneName() {
        return this.name || this.index;
      }
    },
    mounted: function mounted() {
      this.tabs.addPanes(this);
    }
  });
  var tabLabel = {
    props: ['label'],
    render: function render(h) {
      return h('div', this.label);
    }
  };
  Vue.component('tabs-component', {
    name: 'JzTabs',
    components: {
      tabLabel: tabLabel
    },
    props: {
      value: {},
      type: {
        'default': 'default'
      },
      useScrollbar: {
        type: Boolean,
        'default': true
      }
    },
    template: '<div :class="wrapClasses">' + '<div class="tabs-header" v-resize="update">' + '<div class="tabs-nav">' + '<div class="tabs-item" :class="{\'tabs-item-active\': pane.active}" v-for="pane in panes" @click="clickTabHandler(pane.paneName)" v-show="!pane.hidden">' + '<tab-label class="tabs-label" ref="tabs" :label="pane.$slots.label || pane.label"></tab-label>' + '</div>' + '</div>' + '<div class="tabs-bar" :style="barStyles"></div>' + '</div>' + '<div class="tabs-content">' + '<scrollbar-component v-if="useScrollbar" theme="tabs">' + '<slot></slot>' + '</scrollbar-component>' + '<slot v-else></slot>' + '<div class="tabs-footer"><slot name="footer"></slot></div>' + '</div>' + '</div>',
    data: function data() {
      return {
        panes: [],
        currentName: this.value,
        barStyles: {}
      };
    },
    computed: {
      wrapClasses: function wrapClasses() {
        var wrapClasses = {};
        wrapClasses['jz-tabs'] = true;
        wrapClasses['jz-tabs-' + this.type] = true;
        return wrapClasses;
      }
    },
    watch: {
      currentName: function currentName(value) {
        this.$emit('input', value);
        this.update();
      },
      value: function value(_value) {
        this.currentName = _value;
      }
    },
    methods: {
      addPanes: function addPanes(pane) {
        var index = this.$slots['default'].filter(function (item) {
          return item.elm.nodeType === 1 && /JzTabPane/.test(item.componentInstance.$options.name);
        }).indexOf(pane.$vnode);
        pane.index = index;
        this.panes.splice(index, 0, pane);
      },
      clickTabHandler: function clickTabHandler(paneName) {
        this.currentName = paneName;
      },
      update: function update() {
        if (!this.$refs.tabs) return;
        var activeTabLabel = this.$refs.tabs[this.panes.indexOf(this.panes.filter(function (pane) {
          return pane.active;
        })[0])];
        if (!activeTabLabel) return;
        var $el = activeTabLabel.$el;
        if (!$el) return; //各种type的更新钩子,如对应方法不存在则使用default

        var updateHooks = {
          'default': function _default() {
            this.barStyles = {
              'top': $el.offsetTop + 'px',
              'height': $el.offsetHeight + 'px'
            };
          },
          'frame': function frame() {
            this.barStyles = {
              'left': $el.offsetLeft + 'px',
              'width': $el.offsetWidth + 'px'
            };
          }
        };
        var updateFunc = updateHooks[this.type];

        if (typeof updateFunc !== 'function') {
          updateFunc = updateHooks['default'];
        }

        updateFunc.call(this);
      }
    },
    created: function created() {
      !this.currentName && (this.currentName = 0);
    },
    mounted: function mounted() {
      this.$nextTick(this.update);
    }
  });
})();
/*!
 * tag-group组件
 */
;

(function () {
  var prefixCls = 'jz-tag-group';
  var PRODUCT_DEFAULT_WIDTH = 118;
  var NEWS_DEFAULT_WIDTH = 105;
  var PRODUCT_TIPS = '点击添加分类';
  var NEWS_TIPS = '点击添加标签';
  Vue.component('tag-group-component', {
    name: 'TagGroup',
    template: '<div :class="classes">' + '<div class="tag-group-wrapper">' + '<tag-component :isfixed="isfixed" :class="itemCls" :type="type" v-for="(item, index) in rebuildValue" :key="item" :index="index" :label="item" :data="data" :ref="refCls(index)"></tag-component>' + '<i v-if="renderAddTag" :class="addTagCls" @click="addTag"></i>' + '</div>' + '<div :class="tagCls" @mousedown.prevent="handleMousedown" v-if="showTips">' + '<template v-if="type == \'product\'">' + '<input-component ref="input" :pattern="inputPattern"></input-component>' + '<div class="fill">' + '<div class="fill-item">' + '<i class="fill-img"></i>' + '<span>{{ fillText }}</span>' + '</div>' + '</div>' + '</template>' + '<template v-else-if="type == \'news\'">' + '<i class="tag-img"></i>' + '<input-component ref="input" :pattern="inputPattern"></input-component>' + '<div class="fill">' + '<div class="fill-item">' + '<span>{{ fillText }}</span>' + '</div>' + '</div>' + '</template>' + '</div>' + '</div>',
    props: {
      value: {
        'type': Array,
        'default': function _default() {
          return [];
        }
      },
      data: {
        'type': Array,
        'default': function _default() {
          return [];
        }
      },
      type: {
        'type': String,
        'default': 'product'
      },
      fillText: {
        'type': String,
        'default': function _default() {
          if (this.type === 'product') {
            return this.productTips;
          } else if (this.type === 'news') {
            return this.newsTips;
          }
        }
      },
      isfixed: Boolean
    },
    data: function data() {
      return {
        currentValue: this.value,
        showTips: false,
        rebuildValue: [],
        childrens: [],
        productDefaultWidth: PRODUCT_DEFAULT_WIDTH,
        newsDefaultWidth: NEWS_DEFAULT_WIDTH,
        renderAddTag: true,
        productTips: PRODUCT_TIPS,
        newsTips: NEWS_TIPS
      };
    },
    computed: {
      inputPattern: function inputPattern() {
        var cssText = '';

        if (this.type === 'product') {
          cssText = 'width: ' + this.productDefaultWidth + 'px;';
        } else if (this.type === 'news') {
          cssText = 'width: ' + this.newsDefaultWidth + 'px;';
          cssText += 'height: 27px; border-radius: 15px;';
        }

        return cssText;
      },
      classes: function classes() {
        var classes = {};
        classes[prefixCls] = true;
        classes['clearFix'] = true;
        return classes;
      },
      tagCls: function tagCls() {
        var tagCls = {};
        tagCls['jz-tag'] = true;
        tagCls['jz-tag-' + this.type] = true;
        return tagCls;
      },
      itemCls: function itemCls() {
        return prefixCls + '-item';
      },
      addTagCls: function addTagCls() {
        var addTagCls = {};
        addTagCls['tag-group-add-' + this.type] = true;
        return addTagCls;
      }
    },
    mounted: function mounted() {
      var _this = this;

      if (!this.value.length) {
        this.renderAddTag = false;
        this.showTips = true;
      }

      this.$on('tag-delete', function (value) {
        var backArr = this.rebuildValue.filter(function (item) {
          return item !== value;
        });

        _this.$emit('input', backArr);

        _this.$emit('on-change', backArr);
      });
      this.$on('tag-blur', function (index) {
        var rebuildValueLength = _this.rebuildValue.length;

        if (_this.rebuildValue[index] === '') {
          _this.rebuildValue.splice(rebuildValueLength - 1, 1);

          _this.$emit('input', _this.rebuildValue);

          _this.$emit('on-change', _this.rebuildValue);
        } else if (_this.rebuildValue.indexOf(_this.rebuildValue[index]) !== -1) {
          _this.rebuildValue.splice(rebuildValueLength);

          _this.$emit('input', _this.rebuildValue);

          _this.$emit('on-change', _this.rebuildValue);
        }

        _this.renderAddTag = true;
      });
      this.updateModel(true);
    },
    created: function created() {
      this.rebuildValue = JSON.parse(JSON.stringify(this.value));
    },
    methods: {
      refCls: function refCls(index) {
        return 'tag' + (index + 1);
      },
      handleMousedown: function handleMousedown() {
        var _this = this;

        var valueLength = 0;
        this.showTips = false;
        this.rebuildValue.push('');
        this.rebuildValue.splice(this.rebuildValue.length);
        valueLength = this.rebuildValue.length;
        this.$emit('input', this.rebuildValue);
        setTimeout(function () {
          _this.$refs['tag' + valueLength][0].focus();

          _this.$refs['tag' + valueLength][0].valueStatus = true;
        }, 0);
      },
      addTag: function addTag() {
        var _this = this;

        var valueLength = 0;
        this.rebuildValue.push('');
        this.rebuildValue.splice(this.rebuildValue.length);
        valueLength = this.rebuildValue.length;
        this.$emit('input', this.rebuildValue);
        this.renderAddTag = false;
        setTimeout(function () {
          _this.$refs['tag' + valueLength][0].handleMousedown();

          _this.$refs['tag' + valueLength][0].valueStatus = true;
        }, 0);
      },
      updateModel: function updateModel(update) {
        var value = this.value;
        var index = 1;
        this.childrens = vue_utils.findComponentsDownward(this, 'Tag');

        if (this.childrens) {
          this.childrens.forEach(function (child) {
            child.model = value;

            if (update) {
              child.currentValue = child.label;
              child.group = true;
            }
          });
        }
      },
      change: function change(data) {
        this.rebuildValue = data;
        this.rebuildValue.splice(this.rebuildValue.length);
        this.$emit('input', data);
        this.$emit('on-change', data);
      }
    },
    watch: {
      value: {
        handler: function handler(val) {
          if (!val.length) {
            this.renderAddTag = false;
            this.showTips = true;
          }

          this.rebuildValue = JSON.parse(JSON.stringify(this.value));
          this.updateModel(true);
        }
      }
    }
  });
})();
/*!
 * tag 组件
 */
;

(function () {
  var prefixCls = 'jz-tag';
  var PRODUCT_DEFAULT_WIDTH = 118;
  var PRODUCT_FOCUS_WIDTH = 90;
  var NEWS_DEFAULT_WIDTH = 105;
  var NEWS_FOCUS_WIDTH = 80;
  var PRODUCT_TIPS = '点击添加分类';
  var NEWS_TIPS = '点击添加标签';
  Vue.component('tag-component', {
    name: 'Tag',
    template: '<div :class="classes">' + '<select-component :isfixed="isfixed" v-if="renderSelect && type == \'product\'" class="tag-select" ref="select" is-tag :style="inputPattern" placement="bottom" filterable filterable-from-tag @on-change="handleChange">' + '<template slot="input">' + '<input-component v-if="!group" ref="input" class="tag-input" :pattern="inputPattern" v-model="currentValue" @on-focus="handleFocus" @on-enter="handleEnter" @on-blur="handleBlur"></input-component>' + '<input-component v-if="group" ref="input" class="tag-input" :pattern="inputPattern" v-model="currentValue" @on-focus="handleFocus" @on-enter="handleEnter" @on-blur="handleBlur"></input-component>' + '<div v-if="showTips && !group" @mousedown.prevent="handleMousedown" class="fill">' + '<div class="fill-item">' + '<i class="fill-img"></i>' + '<span>{{ fillText }}</span>' + '</div>' + '</div>' + '<i @click="handleDelete" :class="tagDeleteCls"></i>' + '</template>' + '<slot>' + '<select-item-component v-for="(item, index) in filteredData" is-tag :value="item" :key="item">{{ item }}</select-item-component>' + '</slot>' + '</select-component>' + '<template v-else-if="type == \'news\'">' + '<i v-if="!group || index === 0" class="tag-img"></i>' + '<select-component :isfixed="isfixed" v-if="renderSelect" class="tag-select" ref="select" is-tag :style="inputPattern" placement="bottom" filterable filterable-from-tag @on-change="handleChange">' + '<template slot="input">' + '<input-component v-if="!group" ref="input" class="tag-input" :pattern="inputPattern" v-model="currentValue" @on-focus="handleFocus" @on-enter="handleEnter" @on-blur="handleBlur"></input-component>' + '<input-component v-if="group" ref="input" class="tag-input" :maxlength="50" :pattern="inputPattern" v-model="currentValue" @on-focus="handleFocus" @on-enter="handleEnter" @on-blur="handleBlur"></input-component>' + '<div v-if="showTips && !group" @mousedown.prevent="handleMousedown" class="fill">' + '<div class="fill-item">' + '<span>{{ fillText }}</span>' + '</div>' + '</div>' + '<i @click="handleDelete" :class="tagDeleteCls"></i>' + '</template>' + '<slot>' + '<select-item-component v-for="(item, index) in filteredData" is-tag :value="item" :key="item">{{ item }}</select-item-component>' + '</slot>' + '</select-component>' + '</template>' + '</div>',
    props: {
      value: {
        'type': [String, Number],
        'default': ''
      },
      data: {
        'type': Array,
        'default': function _default() {
          return [];
        }
      },
      filterMethod: {
        'type': [Function, Boolean],
        'default': false
      },
      label: [String, Number],
      index: Number,
      type: {
        'type': String,
        'default': 'product'
      },
      fillText: {
        'type': String,
        'default': function _default() {
          if (this.type === 'product') {
            return this.productTips;
          } else if (this.type === 'news') {
            return this.newsTips;
          }
        }
      },
      isfixed: Boolean
    },
    data: function data() {
      return {
        model: [],
        renderSelect: true,
        group: !!vue_utils.findComponentUpward(this, 'TagGroup'),
        focusStatus: false,
        valueStatus: false,
        productFocusWidth: PRODUCT_FOCUS_WIDTH,
        productDefaultWidth: PRODUCT_DEFAULT_WIDTH,
        newsFocusWidth: NEWS_FOCUS_WIDTH,
        newsDefaultWidth: NEWS_DEFAULT_WIDTH,
        parent: vue_utils.findComponentUpward(this, 'TagGroup'),
        currentValue: !!vue_utils.findComponentUpward(this, 'TagGroup') ? this.label : this.value,
        showTips: false,
        productTips: PRODUCT_TIPS,
        newsTips: NEWS_TIPS
      };
    },
    computed: {
      foucsWidth: function foucsWidth() {
        if (this.type === 'product') {
          return this.productFocusWidth;
        } else if (this.type === 'news') {
          return this.newsFocusWidth;
        }
      },
      defaultWidth: function defaultWidth() {
        if (this.type === 'product') {
          return this.productDefaultWidth;
        } else if (this.type === 'news') {
          return this.newsDefaultWidth;
        }
      },
      inputPattern: function inputPattern() {
        var _this = this;

        var cssText = '';

        if (this.type === 'news') {
          cssText = 'height: 27px; border-radius: 15px;';
        }

        if (this.focusStatus || this.currentValue !== '') {
          cssText += 'width: ' + this.foucsWidth + 'px; text-align: center;';
        } else {
          cssText += 'width: ' + _this.defaultWidth + 'px; text-align: center;';
        }

        return cssText;
      },
      classes: function classes() {
        var classes = {};
        classes[prefixCls] = true;
        classes[prefixCls + '-' + this.type] = true;
        return classes;
      },
      tagDeleteCls: function tagDeleteCls() {
        var tagDeleteCls = {};
        tagDeleteCls['tag-delete'] = true;
        tagDeleteCls['on'] = this.currentValue !== '' && !this.focusStatus;
        return tagDeleteCls;
      },
      filteredData: function filteredData() {
        var _this = this;

        if (this.filterMethod) {
          return this.data.filter(function (item) {
            return this.filterMethod(this.currentValue, item);
          });
        } else {
          return this.data;
          /*var copyData = JSON.parse(JSON.stringify(this.data));
          var deleteIndexArr = [];
          
          this.model.forEach(function (child) {
          var matchIndex = _this.data.indexOf(child);
          if (matchIndex !== -1) {
          deleteIndexArr.push(matchIndex);
          }
             });
          // 正序排列
             deleteIndexArr.sort(function(a, b) {
          return a > b;
          });
          for (var i = deleteIndexArr.length - 1; i >= 0; i--) {
          copyData.splice(deleteIndexArr[i], 1);
          }
          return copyData;*/
        }
      }
    },
    methods: {
      handleMousedown: function handleMousedown() {
        var _this = this;

        this.showTips = false;
        this.$nextTick(function () {
          _this.$refs.input.focus();

          _this.$refs.input.$el.click();
        });
      },
      handleChange: function handleChange(val) {
        this.currentValue = val;
        this.$refs.select.model = val;
        this.$refs.input.blur();
        this.$emit('on-select', val);
      },
      handleFocus: function handleFocus() {
        var _this = this;

        this.focusStatus = true;
        this.$nextTick(function () {
          _this.$refs.input.focus();

          _this.$refs.select.visible = true;
        });
      },
      handleBlur: function handleBlur() {
        this.focusStatus = false;
        if (!this.valueStatus) return;
        this.$refs.select.visible = false;

        if (this.group) {
          if (this.model.indexOf(this.currentValue) === -1) {
            this.model[this.index] = this.currentValue;
            this.parent.change(this.model);
          }

          vue_utils.dispatch(this, 'TagGroup', 'tag-blur', this.index);
        } else {
          this.$emit('on-blur', this.currentValue);
        }
      },
      handleEnter: function handleEnter() {
        this.$refs.input.blur();
        this.$emit('on-enter', this.currentValue);
      },
      handleDelete: function handleDelete() {
        if (this.group) {
          vue_utils.dispatch(this, 'TagGroup', 'tag-delete', this.currentValue);
        } else {
          this.currentValue = '';
          this.$refs.select.model = '';
          this.$emit('on-delete', this.currentValue);
        }
      },
      updateTagWidthAndTips: function updateTagWidthAndTips() {
        var inputDom = this.$refs.input.$el.querySelector('input');

        if (this.currentValue !== '' || this.focusStatus) {
          this.showTips = false;
          inputDom.style.width = this.foucsWidth + 'px';
        } else {
          this.showTips = true;
          inputDom.style.width = this.defaultWidth + 'px';
        }
      },
      focus: function focus() {
        this.$refs.input.focus();
        this.$refs.select.visible = true;
      }
    },
    mounted: function mounted() {
      this.$refs.select.model = this.currentValue;

      if (this.group) {
        this.parent.updateModel(true);
        this.currentValue = this.label;
      }

      this.updateTagWidthAndTips();
    },
    watch: {
      focusStatus: function focusStatus(val) {
        this.updateTagWidthAndTips();
      },
      showTips: function showTips(val) {
        var _this = this;

        if (!this.group && val) {
          this.renderSelect = false;
          this.$nextTick(function () {
            _this.renderSelect = true;
          });
        }
      },
      value: function value(val) {
        this.currentValue = val;
      },
      currentValue: function currentValue(val) {
        this.valueStatus = true;
        this.$refs.select.query = val;
        this.updateTagWidthAndTips();

        if (!this.group) {
          this.$emit('input', val);
          this.$emit('on-change', val);
        }

        if (this.group && !this.focusStatus && this.model.indexOf(val) === -1) {
          this.model[this.index] = val;
          this.parent.change(this.model);
        }
      },
      filteredData: function filteredData(val) {
        /*var _this = this;
        
        if (!this.data.length) return;
         	this.renderSelect = false;
         	this.$nextTick(function () {
        _this.renderSelect = true;
        });*/
      }
    }
  });
})();
/**
 *	Tooltip 文字提示框组件
 *	Attributes
 *	参数			说明						类型			可选值													默认值
 *	effect			默认提供的主题				String			light/grey/latte/lace									light
 *	content			显示的内容，也可以通过 		slot#content	传入 DOM												String	—	—
 *	placement		Tooltip 的出现位置			String			top/top-start/top-end/bottom/bottom-start/bottom-end/	bottom
 *																left/left-start/left-end/right/right-start/right-end	
 *	value(v-model)	状态是否可见				Boolean			—														false
 *	disabled		Tooltip 是否可用			Boolean			—														false
 *	offset			出现位置的偏移量			Number			—														0
 *	transition		定义渐变动画				String			—														el-fade-in-linear
 *	visible-arrow	是否显示 Tooltip 箭头，		Boolean			—														true
 *					更多参数可见Vue-popper		
 *	popper-options	popper.js 的参数			Object			参考 popper.js 文档	{ boundariesElement: 'body',
 *																gpuAcceleration: false }
 *	open-delay		延迟出现，单位毫秒			Number			—														0
 *	manual			手动控制模式，设置为		Boolean			—														false
 *					true 后，mouseenter 和 																				
 *					mouseleave 事件将不会生效																			
 *	popper-class	为 Tooltip 的 popper		String			—														—
 *					添加类名																							
 *	enterable		鼠标是否可进入到tooltip中	Boolean			—														true
 *	hide-after		Tooltip 出现后自动隐藏延时	number			—														0
 *					，单位毫秒，为 0 则不会
 *					自动隐藏
 */
;

(function (Vue, name, factory, Popper) {
  Vue.component(name, function (resolve) {
    resolve(factory(Vue, Popper));
  });
})(window.Vue, 'tooltip-component', function (Vue, Popper) {
  var getFirstComponetChild = function getFirstComponetChild(children) {
    return children && children.filter(function (c) {
      return c && c.tag;
    })[0];
  };

  return {
    mixins: [Popper],
    props: {
      openDelay: {
        type: Number,
        'default': 0
      },
      disabled: Boolean,
      manual: Boolean,
      effect: {
        type: String,
        'default': 'default'
      },
      popperClass: String,
      content: String,
      transition: {
        type: String,
        'default': ''
      },
      enterable: {
        type: Boolean,
        'default': true
      },
      hideAfter: {
        type: Number,
        'default': 0
      },
      visibleArrow: {
        'default': true
      },
      popperOptions: {
        'default': function _default() {
          return {
            boundariesPadding: 10,
            gpuAcceleration: false
          };
        }
      }
    },
    data: function data() {
      return {
        timeoutPending: null
      };
    },
    beforeCreate: function beforeCreate() {
      var self = this;
      this.popperVM = new Vue({
        data: {
          node: ''
        },
        render: function render() {
          return this.node;
        }
      }).$mount();

      this.debounceClose = function () {
        self.handleClosePopper();
      };
    },
    render: function render(h) {
      var self = this;
      var popperClass = 'jz_tooltip_popper';
      popperClass += this.effect ? ' jz_tooltip_popper_' + this.effect : '';
      popperClass += this.popperClass ? ' ' + this.popperClass : '';
      popperClass += this.$slots.content ? ' jz_tooltip_popper_' + this.effect + '__multiline' : '';

      if (this.popperVM) {
        this.popperVM.node = h('transition', {
          attrs: {
            name: this.transition
          },
          on: {
            afterLeave: this.doDestroy
          }
        }, [h('div', {
          on: {
            mouseleave: function mouseleave() {
              self.setExpectedState(false);
              self.debounceClose();
            },
            mouseenter: function mouseenter() {
              self.setExpectedState(true);
            }
          },
          ref: 'popper',
          directives: [{
            name: 'show',
            value: !this.disabled && this.showPopper
          }],
          staticClass: popperClass
        }, [this.$slots.content || this.content])]);
      }

      if (!this.$slots['default'] || !this.$slots['default'].length) return this.$slots['default'];
      var vnode = getFirstComponetChild(this.$slots['default']);

      if (!vnode) {
        return vnode;
      }

      var data = vnode.data = vnode.data || {};
      var on = vnode.data.on = vnode.data.on || {};
      var nativeOn = vnode.data.nativeOn = vnode.data.nativeOn || {};
      data.staticClass = this.concatClass(data.staticClass, 'jz_tooltip');
      on.mouseenter = this.addEventHandle(on.mouseenter, this.show);
      on.mouseleave = this.addEventHandle(on.mouseleave, this.hide);
      nativeOn.mouseenter = this.addEventHandle(nativeOn.mouseenter, this.show);
      nativeOn.mouseleave = this.addEventHandle(nativeOn.mouseleave, this.hide);
      return vnode;
    },
    mounted: function mounted() {
      this.referenceElm = this.$el;
    },
    methods: {
      show: function show() {
        this.setExpectedState(true);
        this.handleShowPopper();
      },
      hide: function hide() {
        this.setExpectedState(false);
        this.debounceClose();
      },
      addEventHandle: function addEventHandle(old, fn) {
        if (!old) {
          return fn;
        } else if (Array.isArray(old)) {
          return old.indexOf(fn) > -1 ? old : old.concat(fn);
        } else {
          return old === fn ? old : [old, fn];
        }
      },
      concatClass: function concatClass(a, b) {
        if (a && a.indexOf(b) > -1) return a;
        return a ? b ? a + ' ' + b : a : b || '';
      },
      handleShowPopper: function handleShowPopper() {
        var self = this;
        if (!this.expectedState || this.manual) return;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          self.showPopper = true;
        }, this.openDelay);

        if (this.hideAfter > 0) {
          this.timeoutPending = setTimeout(function () {
            self.showPopper = false;
          }, this.hideAfter);
        }
      },
      handleClosePopper: function handleClosePopper() {
        if (this.enterable && this.expectedState || this.manual) return;
        clearTimeout(this.timeout);

        if (this.timeoutPending) {
          clearTimeout(this.timeoutPending);
        }

        this.showPopper = false;
      },
      setExpectedState: function setExpectedState(expectedState) {
        if (expectedState === false) {
          clearTimeout(this.timeoutPending);
        }

        this.expectedState = expectedState;
      }
    }
  };
}, function (Popper) {
  var stop = function stop(e) {
    e.stopPropagation();
  };

  return {
    props: {
      placement: {
        type: String,
        'default': 'top'
      },
      boundariesPadding: {
        type: Number,
        'default': 5
      },
      reference: {},
      popper: {},
      value: Boolean,
      visibleArrow: Boolean,
      transition: String,
      appendToBody: {
        type: Boolean,
        'default': true
      },
      popperOptions: {
        type: Object,
        'default': function _default() {
          return {
            gpuAcceleration: false
          };
        }
      },
      offset: {
        type: Number,
        'default': 0
      }
    },
    data: function data() {
      return {
        showPopper: false,
        currentPlacement: ''
      };
    },
    watch: {
      value: {
        immediate: true,
        handler: function handler(val) {
          this.showPopper = val;
          this.$emit('input', val);
        }
      },
      showPopper: function showPopper(val) {
        val ? this.updatePopper() : this.destroyPopper();
        this.$emit('input', val);
      }
    },
    methods: {
      createPopper: function createPopper() {
        var self = this;
        if (this.$isServer) return;
        this.currentPlacement = this.currentPlacement || this.placement;

        if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
          return;
        }

        var options = this.popperOptions;
        var popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;
        var reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

        if (!reference && this.$slots.reference && this.$slots.reference[0]) {
          reference = this.referenceElm = this.$slots.reference[0].elm;
        }

        if (!popper || !reference) return;
        if (this.visibleArrow) this.appendArrow(popper);
        if (this.appendToBody) document.body.appendChild(this.popperElm);

        if (this.popperJS && this.popperJS.destroy) {
          this.popperJS.destroy();
        }

        options.placement = this.currentPlacement;
        options.offset = this.offset;
        this.popperJS = new Popper(reference, popper, options);
        this.popperJS.onCreate(function () {
          self.$emit('created', self);
          self.resetTransformOrigin();
          self.$nextTick(self.updatePopper);
        });

        if (typeof options.onUpdate === 'function') {
          this.popperJS.onUpdate(options.onUpdate);
        } // this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();


        this.popperElm.addEventListener('click', stop);
      },
      updatePopper: function updatePopper() {
        this.popperJS ? this.popperJS.update() : this.createPopper();
      },
      doDestroy: function doDestroy() {
        /* istanbul ignore if */
        if (this.showPopper || !this.popperJS) return;
        this.popperJS.destroy();
        this.popperJS = null;
      },
      destroyPopper: function destroyPopper() {
        if (this.popperJS) {
          this.resetTransformOrigin();
        }
      },
      resetTransformOrigin: function resetTransformOrigin() {
        var placementMap = {
          top: 'bottom',
          bottom: 'top',
          left: 'right',
          right: 'left'
        };

        var placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];

        var origin = placementMap[placement];
        this.popperJS._popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? 'center' + origin : origin + 'center';
      },
      appendArrow: function appendArrow(element) {
        var hash;

        if (this.appended) {
          return;
        }

        this.appended = true;

        for (var item in element.attributes) {
          if (/^_v-/.test(element.attributes[item].name)) {
            hash = element.attributes[item].name;
            break;
          }
        }

        var arrow = document.createElement('div');

        if (hash) {
          arrow.setAttribute(hash, '');
        }

        arrow.setAttribute('x-arrow', '');
        arrow.className = 'jz_popper_arrow';
        element.appendChild(arrow);
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.doDestroy();

      if (this.popperElm && this.popperElm.parentNode === document.body) {
        this.popperElm.removeEventListener('click', stop);
        document.body.removeChild(this.popperElm);
      }
    },
    // call destroy in keep-alive mode
    deactivated: function deactivated() {
      this.$options.beforeDestroy[0].call(this);
    }
  };
}(window.Popper));
/*
 *	Transfer 穿梭框
 *	Props
 *		*data: 渲染的数据项，必须传入；
 *			*模式1格式：[[item1, item2, item3], [item4, item5, ...items], ...batches]，每一个batch为一个批次，触发懒加载
 *			*模式2格式：[item1, item2, item3, ...items]，根据member值划分批次触发懒加载
 *			*item是Object类型，需要传入指定的keyAlias和labelAlias值
 *		*value: 选中的数据项的key值数组，必须传入
 *		member: 划分一次加载数据的数量，当传入的数据长度大于这个值会进行懒加载，默认值10000
 *		keyAlias: 可以为默认参数key设置别名
 *		labelAlias: 可以为默认参数label设置别名
 *		hasAdd: 是否有“+”号按钮，默认true
 *		noDataLabel: 自定义没有数据项提示语
 *		noMatchLabel: 自定义没有匹配项提示语
 *		filterLabel: 自定义搜索框提示语
 *		operations: 可配置目标数据操作项
 *		unSortable: 是否支持拖拽排序
 *	Events
 *		@input: 输出选中的数据项的key值数组
 *		@add-click: 点击“+”按钮时触发，供父级组件触发相应的方法
 *	Example
 *		<transfer-component :data="transferData" v-model="transferValue" key-alias="id" label-alias="name" @add-click="addTransferHandler"></transfer-component>
 */
;

(function () {
  Vue.component('transfer-component', {
    name: 'Transfer',
    template: '<div class="jz_transfer">' + '<div class="jz_transfer_panel jz_transfer_source">' + '<div class="jz_transfer_operation" :class="operationClasses">' + '<input-component v-model="query" :placeholder="filterLabel" class="jz_transfer_filter" :icon="query.length ? \'jz_transfer_icon_clear\' : \'jz_transfer_icon_search\'" @on-click-clear="clearQuery" @on-click-search="clearQuery"></input-component>' + '<i v-if="hasAdd" class="jz_transfer_icon_add" @click="addClickHandler"></i>' + '</div>' + '<div class="jz_transfer_content">' + '<scrollbar-component theme="transfer" @scroll-end="scrollEndHandler">' + '<ul v-show="!isEmpty" class="jz_transfer_list" ref="sourceDataList">' + '<li v-for="(item, index) in sourceData" class="jz_transfer_item" @click="addToTarget(item)">' + '<div class="jz_transfer_label">{{item[labelAlias]}}</div>' + '</li>' + '</ul>' + '<div v-show="isEmpty" class="jz_transfer_empty" :class="emptyClasses">' + '<div class="jz_transfer_empty_img"></div>' + '<p class="jz_transfer_empty_label">{{emptyLabel}}</p>' + '</div>' + '</scrollbar-component>' + '</div>' + '</div>' + '<div class="jz_transfer_arrow">' + '<i class="jz_transfer_icon_right"></i>' + '</div>' + '<div class="jz_transfer_panel jz_transfer_target">' + '<div class="jz_transfer_content">' + '<scrollbar-component theme="transfer">' + '<ul class="jz_transfer_list" :class="{jz_transfer_list_is_unsortable: unSortable}">' + '<draggable :value="filterValue" @input="sortHandler" :options="draggableOptions">' + '<li v-for="(item, index) in targetData" class="jz_transfer_item">' + '<div class="jz_transfer_label">{{item[labelAlias]}}</div>' + '<div class="jz_transfer_button" :class="[{\'is-first\': index === 0, \'is-last\': index === targetData.length-1 && index !== 0}]">' + '<i class="jz_transfer_icon_up" :class="{jz_transfer_icon_up_is_hidden: operations.indexOf(\'up\') < 0}" @click="moveHandler(index, index - 1)"></i>' + '<i class="jz_transfer_icon_down" :class="{jz_transfer_icon_down_is_hidden: operations.indexOf(\'down\') < 0 || targetData.length == 1}" @click="moveHandler(index, index + 1)"></i>' + '<i class="jz_transfer_icon_del" :class="{jz_transfer_icon_del_is_hidden: operations.indexOf(\'del\') < 0}" @click="addToSource(item)"></i>' + '</div>' + '</li>' + '</draggable>' + '</ul>' + '</scrollbar-component>' + '</div>' + '</div>' + '</div>',
    props: {
      data: {
        type: Array
      },
      value: {
        type: Array,
        'default': function _default() {
          return [];
        }
      },
      keyAlias: {
        type: String,
        'default': 'key'
      },
      labelAlias: {
        type: String,
        'default': 'label'
      },
      hasAdd: {
        type: Boolean,
        'default': true
      },
      noDataLabel: {
        type: String,
        'default': '主人，赶紧添加产品吧'
      },
      noMatchLabel: {
        type: String,
        'default': '没有找到您搜索的文件'
      },
      filterLabel: {
        type: String,
        'default': '搜索产品'
      },
      member: {
        type: Number,
        validator: function validator(value) {
          return value >= 100;
        },
        'default': 10000
      },
      operations: {
        type: Array,
        'default': function _default() {
          return ['up', 'down', 'del'];
        }
      },
      unSortable: Boolean
    },
    data: function data() {
      return {
        query: '',
        batch: 1
      };
    },
    computed: {
      // merge mode will trigger lazyload
      mergeMode: function mergeMode() {
        return Array.isArray(this.data[0]);
      },
      // data manage
      totalData: function totalData() {
        var data = this.data,
            mergeMode = this.mergeMode;
        return mergeMode ? data.reduce(function (preValue, curValue, curIndex) {
          return preValue.concat(curValue);
        }, []) : data;
      },
      batchData: function batchData() {
        var data = this.data,
            member = this.member,
            curBatch = this.curBatch,
            mergeMode = this.mergeMode;
        return mergeMode ? data.reduce(function (preValue, curValue, curIndex) {
          return preValue.concat(curIndex < curBatch ? curValue : []);
        }, []) : data.slice(0, member * curBatch);
      },
      sourceData: function sourceData() {
        var value = this.value,
            query = this.query,
            keyAlias = this.keyAlias,
            labelAlias = this.labelAlias,
            batchData = this.batchData,
            totalData = this.totalData; // 搜索时从全量数据搜索

        return query.length > 0 ? totalData.filter(function (item) {
          var hasChecked = value.indexOf(item[keyAlias]) > -1,
              hasQueryed = ('' + item[labelAlias]).indexOf(query) > -1;
          return !hasChecked && hasQueryed;
        }) : batchData.filter(function (item) {
          var hasChecked = value.indexOf(item[keyAlias]) > -1;
          return !hasChecked;
        });
      },
      targetData: function targetData() {
        var value = this.value,
            totalData = this.totalData,
            totalKeys = this.totalKeys;
        var data = [],
            item = null;

        for (var i = 0; i < value.length; i++) {
          item = totalData[totalKeys.indexOf(value[i])];

          if (typeof item !== 'undefined') {
            data.push(item);
          }
        }

        return data; // 下面这个会进行两次遍历，影响性能

        /*var self = this;
        return this.value.map(function(key){
        	return self.totalData[self.totalKeys.indexOf(key)];
        }).filter(function(item){
        	return typeof item !== 'undefined';
        });*/
      },
      filterValue: function filterValue() {
        var self = this;
        return this.targetData.map(function (item) {
          return item[self.keyAlias];
        });
      },
      totalKeys: function totalKeys() {
        var keyAlias = this.keyAlias,
            totalData = this.totalData;
        return totalData.map(function (item) {
          return item[keyAlias];
        });
      },
      // batch control
      curBatch: function curBatch() {
        var batch = this.batch,
            maxBatch = this.maxBatch;
        return batch > maxBatch ? maxBatch : batch;
      },
      maxBatch: function maxBatch() {
        var data = this.data,
            member = this.member,
            mergeMode = this.mergeMode;
        return mergeMode ? data.length : Math.ceil(data.length / member);
      },
      canLoadBatch: function canLoadBatch() {
        var curBatch = this.curBatch,
            maxBatch = this.maxBatch,
            query = this.query;
        return !query.length && curBatch < maxBatch;
      },
      // empty state
      isNoData: function isNoData() {
        return this.totalData.length === 0;
      },
      isNoMatch: function isNoMatch() {
        var query = this.query,
            sourceData = this.sourceData;
        return query.length > 0 && sourceData.length === 0;
      },
      isEmpty: function isEmpty() {
        var isNoData = this.isNoData,
            isNoMatch = this.isNoMatch;
        return isNoData || isNoMatch;
      },
      emptyLabel: function emptyLabel() {
        var isNoData = this.isNoData,
            isNoMatch = this.isNoMatch,
            noDataLabel = this.noDataLabel,
            noMatchLabel = this.noMatchLabel;
        return isNoData ? noDataLabel : isNoMatch ? noMatchLabel : '';
      },
      // classes
      operationClasses: function operationClasses() {
        var classes = {};
        classes['is-has-add'] = this.hasAdd;
        return classes;
      },
      emptyClasses: function emptyClasses() {
        var classes = {};
        classes['is-no-data'] = this.isNoData && this.hasAdd && !this.isNoMatch;
        classes['is-no-match'] = !this.isNoData && this.isNoMatch;
        return classes;
      },
      draggableOptions: function draggableOptions() {
        return {
          disabled: this.unSortable
        };
      }
    },
    methods: {
      clearQuery: function clearQuery() {
        this.query = '';
      },
      addToTarget: function addToTarget(item) {
        var currentValue = this.value.concat(item[this.keyAlias]);
        this.$emit('input', currentValue);
      },
      addToSource: function addToSource(item) {
        var currentValue = this.value.concat(),
            index = this.value.indexOf(item[this.keyAlias]);
        currentValue.splice(index, 1);
        this.$emit('input', currentValue);
      },
      addClickHandler: function addClickHandler() {
        this.clearQuery();
        this.$emit("add-click");
      },
      // 下面这个当value是超集时会出现的排序错误

      /*moveHandler: function(index, targetIndex){
      	var currentValue = this.value.concat();
      			var thisValue = currentValue[index],
      		targetValue = currentValue[targetIndex];
      	currentValue[index] = targetValue;
      	currentValue[targetIndex] = thisValue;
      			this.$emit('input', currentValue);
      },*/
      moveHandler: function moveHandler(index, targetIndex) {
        var targetData = this.targetData,
            targetDataItemSource = targetData[index] || {},
            targetDataItemTarget = targetData[targetIndex] || {};
        targetDataItemKeySource = targetDataItemSource[this.keyAlias], targetDataItemKeyTarget = targetDataItemTarget[this.keyAlias];
        if (!targetDataItemKeySource || !targetDataItemKeyTarget) return;
        var cloneValue = this.value.concat(),
            cloneValueItemIndexSource = cloneValue.indexOf(targetDataItemKeySource),
            cloneValueItemIndexTarget = cloneValue.indexOf(targetDataItemKeyTarget);
        if (cloneValueItemIndexSource < 0 || cloneValueItemIndexTarget < 0) return;
        cloneValue[cloneValueItemIndexSource] = targetDataItemKeyTarget;
        cloneValue[cloneValueItemIndexTarget] = targetDataItemKeySource;
        this.$emit('input', cloneValue);
      },
      sortHandler: function sortHandler(currentValue) {
        this.$emit('input', currentValue);
      },

      /*scrollHandler: function(){
      	this.canLoadBatch && this.isScrollEnd() && this.batch++;
      },
      isScrollEnd: function(){
      	var s = this.$refs.sourceDataList,
      		isScrollEnd = s.clientHeight + s.scrollTop >= s.scrollHeight;
      			isScrollEnd && this.$emit('scroll-end');
      			return isScrollEnd;
      },*/
      scrollEndHandler: function scrollEndHandler() {
        this.canLoadBatch && this.batch++;
      }
    }
  });
})();