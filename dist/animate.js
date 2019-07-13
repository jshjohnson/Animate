(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash-es/debounce'), require('lodash-es/merge')) :
  typeof define === 'function' && define.amd ? define(['lodash-es/debounce', 'lodash-es/merge'], factory) :
  (global = global || self, global.Animate = factory(global.debounce, global.merge));
}(this, function (debounce, merge) { 'use strict';

  debounce = debounce && debounce.hasOwnProperty('default') ? debounce['default'] : debounce;
  merge = merge && merge.hasOwnProperty('default') ? merge['default'] : merge;

  var Animate = (function () {
      function Animate(options) {
          var _this = this;
          var defaultOptions = {
              target: "[data-animate]",
              animatedClass: "js-animated",
              offset: [0.5, 0.5],
              delay: 0,
              remove: true,
              scrolled: false,
              reverse: false,
              onLoad: true,
              onScroll: true,
              onResize: false,
              disableFilter: function () { },
              callbackOnInit: function () { },
              callbackOnInView: function () { },
              callbackOnAnimate: function () { }
          };
          this.options = merge(defaultOptions, options || {});
          this.elements = document.querySelectorAll(this.options.target);
          this.initialised = false;
          if (Animate.isType("string", this.options.offset)) {
              var splitOffset = this.options.offset.split(",");
              this.verticalOffset = parseInt(splitOffset[0], 10);
              this.horizontalOffset = parseInt(splitOffset[1], 10);
          }
          else {
              var _a = this.options
                  .offset, verticalOffset = _a[0], horizontalOffset = _a[1];
              this.verticalOffset = verticalOffset;
              this.horizontalOffset = horizontalOffset;
          }
          this.throttledEvent = debounce(function () {
              _this.render();
          }, 15);
      }
      Animate.whichAnimationEvent = function () {
          var el = document.createElement("temp");
          var browserPrefixes = {
              animation: "animationend",
              OAnimation: "oAnimationEnd",
              MozAnimation: "animationend",
              WebkitAnimation: "webkitAnimationEnd"
          };
          var prefix;
          for (prefix in browserPrefixes) {
              if (Object.prototype.hasOwnProperty.call(browserPrefixes, prefix)) {
                  if (el.style[prefix] !== undefined) {
                      return browserPrefixes[prefix];
                  }
              }
          }
          return null;
      };
      Animate.prototype.isAboveScrollPos = function (el) {
          var dimensions = el.getBoundingClientRect();
          var scrollPos = window.scrollY || window.pageYOffset;
          return dimensions.top + dimensions.height * this.verticalOffset < scrollPos;
      };
      Animate.prototype.getElementOffset = function (el) {
          var elementOffset = el.getAttribute("data-animation-offset");
          var elementOffsetArray = [this.verticalOffset, this.horizontalOffset];
          if (elementOffset) {
              var stringArray = elementOffset.split(",");
              if (stringArray.length === 1) {
                  elementOffsetArray = [
                      parseFloat(stringArray[0]),
                      parseFloat(stringArray[0])
                  ];
              }
              else {
                  elementOffsetArray = [
                      parseFloat(stringArray[0]),
                      parseFloat(stringArray[1])
                  ];
              }
          }
          return elementOffsetArray;
      };
      Animate.prototype.isInView = function (el) {
          var dimensions = el.getBoundingClientRect();
          var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
          var elementOffset = this.getElementOffset(el);
          var verticalOffset = elementOffset[0];
          var horizontalOffset = elementOffset[1];
          var isInViewFromTop = dimensions.bottom - dimensions.height * verticalOffset > 0;
          var isInViewFromBottom = dimensions.top + dimensions.height * verticalOffset < viewportHeight;
          var isInViewVertically = isInViewFromTop && isInViewFromBottom;
          var isInViewFromLeft = dimensions.right - dimensions.width * horizontalOffset > 0;
          var isInViewFromRight = dimensions.left + dimensions.width * horizontalOffset < viewportWidth;
          var isInViewHorizontally = isInViewFromLeft && isInViewFromRight;
          return isInViewVertically && isInViewHorizontally;
      };
      Animate.isVisible = function (el) {
          var visibility = el.getAttribute("data-visibility");
          return visibility === "true";
      };
      Animate.hasAnimated = function (el) {
          var animated = el.getAttribute("data-animated");
          return animated === "true";
      };
      Animate.isType = function (type, obj) {
          var test = Object.prototype.toString.call(obj).slice(8, -1);
          return obj !== null && obj !== undefined && test === type;
      };
      Animate.prototype.addAnimation = function (el) {
          if (!Animate.isVisible(el)) {
              Animate.doCallback(this.options.callbackOnInView, el);
              var classes = el.getAttribute("data-animation-classes");
              if (classes) {
                  el.setAttribute("data-visibility", "true");
                  var animations_1 = classes.split(" ");
                  var animationDelay = parseInt(el.getAttribute("data-animation-delay"), 10) ||
                      this.options.delay;
                  if (animationDelay &&
                      Animate.isType("Number", animationDelay) &&
                      animationDelay !== 0) {
                      setTimeout(function () {
                          animations_1.forEach(function (animation) {
                              el.classList.add(animation);
                          });
                      }, animationDelay);
                  }
                  else {
                      animations_1.forEach(function (animation) {
                          el.classList.add(animation);
                      });
                  }
                  this.completeAnimation(el);
              }
              else {
                  console.error("No animation classes were given");
              }
          }
      };
      Animate.prototype.removeAnimation = function (el) {
          var classes = el.getAttribute("data-animation-classes");
          if (classes) {
              el.setAttribute("data-visibility", "false");
              el.removeAttribute("data-animated");
              var animations_2 = classes.split(" ");
              var animationDelay = parseInt(el.getAttribute("data-animation-delay"), 10);
              animations_2.push(this.options.animatedClass);
              if (animationDelay && Animate.isType("Number", animationDelay)) {
                  setTimeout(function () {
                      animations_2.forEach(function (animation) {
                          el.classList.remove(animation);
                      });
                  }, animationDelay);
              }
              else {
                  animations_2.forEach(function (animation) {
                      el.classList.remove(animation);
                  });
              }
          }
          else {
              console.error("No animation classes were given");
          }
      };
      Animate.doCallback = function (fn, el) {
          if (el === void 0) { el = null; }
          if (fn && Animate.isType("Function", fn)) {
              fn(el);
          }
          else {
              console.error("Callback is not a function");
          }
      };
      Animate.prototype.completeAnimation = function (el) {
          var _this = this;
          var animationEvent = Animate.whichAnimationEvent();
          if (animationEvent) {
              el.addEventListener(animationEvent, function () {
                  var removeOverride = el.getAttribute("data-animation-remove");
                  if (removeOverride !== "false" && _this.options.remove) {
                      var animations = el
                          .getAttribute("data-animation-classes")
                          .split(" ");
                      animations.forEach(function (animation) {
                          el.classList.remove(animation);
                      });
                  }
                  el.classList.add(_this.options.animatedClass);
                  el.setAttribute("data-animated", "true");
                  Animate.doCallback(_this.options.callbackOnAnimate, el);
              });
          }
      };
      Animate.prototype.removeEventListeners = function () {
          if (this.options.onResize) {
              window.removeEventListener("resize", this.throttledEvent, false);
          }
          if (this.options.onScroll) {
              window.removeEventListener("scroll", this.throttledEvent, false);
          }
      };
      Animate.prototype.addEventListeners = function () {
          var _this = this;
          if (this.options.onLoad) {
              document.addEventListener("DOMContentLoaded", function () {
                  _this.render(true);
              });
          }
          if (this.options.onResize) {
              window.addEventListener("resize", this.throttledEvent, false);
          }
          if (this.options.onScroll) {
              window.addEventListener("scroll", this.throttledEvent, false);
          }
      };
      Animate.prototype.init = function () {
          this.initialised = true;
          this.addEventListeners();
          Animate.doCallback(this.options.callbackOnInit);
      };
      Animate.prototype.kill = function () {
          if (!this.initialised) {
              return;
          }
          this.removeEventListeners();
          this.options = null;
          this.initialised = false;
      };
      Animate.prototype.render = function (onLoad) {
          if (this.initialised) {
              if (this.options.disableFilter &&
                  Animate.isType("Function", this.options.disableFilter)) {
                  var test = this.options.disableFilter();
                  if (test === true) {
                      return;
                  }
              }
              var els = this.elements;
              for (var i = els.length - 1; i >= 0; i--) {
                  var el = els[i];
                  if (this.isInView(el)) {
                      this.addAnimation(el);
                  }
                  else if (Animate.hasAnimated(el)) {
                      var reverseOverride = el.getAttribute("data-animation-reverse");
                      if (reverseOverride !== "false" && this.options.reverse) {
                          this.removeAnimation(el);
                      }
                  }
                  else if (onLoad) {
                      var animateScrolled = el.getAttribute("data-animation-scrolled");
                      if ((this.options.scrolled || animateScrolled) &&
                          this.isAboveScrollPos(el)) {
                          this.addAnimation(el);
                      }
                  }
              }
          }
      };
      return Animate;
  }());

  return Animate;

}));
