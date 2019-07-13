(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Animate = factory());
}(this, function () { 'use strict';

  var Animate = function (userOptions) {
      var el = document.createElement('fakeelement');
      var defaultOptions = {
          target: '[data-animate]',
          animatedClass: 'js-animated',
          offset: [0.5, 0.5],
          delay: 0,
          remove: true,
          scrolled: false,
          reverse: false,
          onLoad: true,
          onScroll: true,
          onResize: false,
          disableFilter: null,
          callbackOnInit: function () { },
          callbackOnInView: function () { },
          callbackOnAnimate: function () { }
      };
      this.supports =
          'querySelector' in document &&
              'addEventListener' in window &&
              'classList' in el &&
              Function.prototype.bind;
      this.options = this._extend(defaultOptions, userOptions || {});
      this.elements = document.querySelectorAll(this.options.target);
      this.initialised = false;
      this.verticalOffset = this.options.offset;
      this.horizontalOffset = this.options.offset;
      if (this._isType('Array', this.options.offset)) {
          this.verticalOffset = this.options.offset[0];
          this.horizontalOffset = this.options.offset[1]
              ? this.options.offset[1]
              : this.options.offset[0];
      }
      this.throttledEvent = this._debounce(function () {
          this.render();
      }.bind(this), 15);
  };
  Animate.prototype._debounce = function (func, wait, immediate) {
      var timeout;
      return function () {
          var context = this;
          var args = arguments;
          var later = function () {
              timeout = null;
              if (!immediate) {
                  func.apply(context, args);
              }
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) {
              func.apply(context, args);
          }
      };
  };
  Animate.prototype._extend = function () {
      var extended = {};
      var length = arguments.length;
      var merge = function (obj) {
          for (var prop in obj) {
              if (Object.hasOwnProperty.call(obj, prop)) {
                  extended[prop] = obj[prop];
              }
          }
      };
      for (var i = 0; i < length; i++) {
          var obj = arguments[i];
          if (this._isType('Object', obj)) {
              merge(obj);
          }
          else {
              console.error('Custom options must be an object');
          }
      }
      return extended;
  };
  Animate.prototype._whichAnimationEvent = function () {
      var t;
      var el = document.createElement('fakeelement');
      var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'animationend',
          WebkitAnimation: 'webkitAnimationEnd'
      };
      for (t in animations) {
          if (Object.hasOwnProperty.call(animations, t)) {
              if (el.style[t] !== undefined) {
                  return animations[t];
              }
          }
      }
  };
  Animate.prototype._isAboveScrollPos = function (el) {
      var dimensions = el.getBoundingClientRect();
      var scrollPos = window.scrollY || window.pageYOffset;
      return dimensions.top + dimensions.height * this.verticalOffset < scrollPos;
  };
  Animate.prototype._getElementOffset = function (el) {
      var elementOffset = el.getAttribute('data-animation-offset');
      var elementOffsetArray = [this.verticalOffset, this.horizontalOffset];
      if (elementOffset) {
          var stringArray = elementOffset.split(',');
          if (stringArray.length === 1) {
              elementOffsetArray = [
                  parseFloat(stringArray[0]),
                  parseFloat(stringArray[0]),
              ];
          }
          else {
              elementOffsetArray = [
                  parseFloat(stringArray[0]),
                  parseFloat(stringArray[1]),
              ];
          }
      }
      return elementOffsetArray;
  };
  Animate.prototype._isInView = function (el) {
      var dimensions = el.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      var elementOffset = this._getElementOffset(el);
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
  Animate.prototype._isVisible = function (el) {
      var visibility = el.getAttribute('data-visibility');
      return visibility === 'true';
  };
  Animate.prototype._hasAnimated = function (el) {
      var animated = el.getAttribute('data-animated');
      return animated === 'true';
  };
  Animate.prototype._isType = function (type, obj) {
      var test = Object.prototype.toString.call(obj).slice(8, -1);
      return obj !== null && obj !== undefined && test === type;
  };
  Animate.prototype._addAnimation = function (el) {
      if (!this._isVisible(el)) {
          this._doCallback(this.options.callbackOnInView, el);
          var classes = el.getAttribute('data-animation-classes');
          if (classes) {
              el.setAttribute('data-visibility', true);
              var animations_1 = classes.split(' ');
              var animationDelay = parseInt(el.getAttribute('data-animation-delay'), 10) ||
                  this.options.delay;
              var addAnimation_1 = function (animation) {
                  el.classList.add(animation);
              };
              if (animationDelay &&
                  this._isType('Number', animationDelay) &&
                  animationDelay !== 0) {
                  setTimeout(function () {
                      animations_1.forEach(addAnimation_1);
                  }, animationDelay);
              }
              else {
                  animations_1.forEach(addAnimation_1);
              }
              this._completeAnimation(el);
          }
          else {
              console.error('No animation classes were given');
          }
      }
  };
  Animate.prototype._removeAnimation = function (el) {
      var classes = el.getAttribute('data-animation-classes');
      if (classes) {
          el.setAttribute('data-visibility', false);
          el.removeAttribute('data-animated');
          var animations_2 = classes.split(' ');
          var animationDelay = parseInt(el.getAttribute('data-animation-delay'), 10);
          var removeAnimation_1 = function (animation) {
              el.classList.remove(animation);
          };
          animations_2.push(this.options.animatedClass);
          if (animationDelay && this._isType('Number', animationDelay)) {
              setTimeout(function () {
                  animations_2.forEach(removeAnimation_1);
              }, animationDelay);
          }
          else {
              animations_2.forEach(removeAnimation_1);
          }
      }
      else {
          console.error('No animation classes were given');
      }
  };
  Animate.prototype._doCallback = function (fn) {
      var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (fn && this._isType('Function', fn)) {
          fn(el);
      }
      else {
          console.error('Callback is not a function');
      }
  };
  Animate.prototype._completeAnimation = function (el) {
      var animationEvent = this._whichAnimationEvent();
      el.addEventListener(animationEvent, function () {
          var removeOverride = el.getAttribute('data-animation-remove');
          if (removeOverride !== 'false' && this.options.remove) {
              var animations = el.getAttribute('data-animation-classes').split(' ');
              var removeAnimation = function (animation) {
                  el.classList.remove(animation);
              };
              animations.forEach(removeAnimation);
          }
          el.classList.add(this.options.animatedClass);
          el.setAttribute('data-animated', true);
          this._doCallback(this.options.callbackOnAnimate, el);
      }.bind(this));
  };
  Animate.prototype.removeEventListeners = function () {
      if (this.options.onResize) {
          window.removeEventListener('resize', this.throttledEvent, false);
      }
      if (this.options.onScroll) {
          window.removeEventListener('scroll', this.throttledEvent, false);
      }
  };
  Animate.prototype.addEventListeners = function () {
      if (this.options.onLoad) {
          document.addEventListener('DOMContentLoaded', function () {
              this.render(true);
          }.bind(this));
      }
      if (this.options.onResize) {
          window.addEventListener('resize', this.throttledEvent, false);
      }
      if (this.options.onScroll) {
          window.addEventListener('scroll', this.throttledEvent, false);
      }
  };
  Animate.prototype.init = function () {
      if (!this.supports) {
          return;
      }
      this.initialised = true;
      this.addEventListeners();
      this._doCallback(this.options.callbackOnInit);
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
              this._isType('Function', this.options.disableFilter)) {
              var test = this.options.disableFilter();
              if (test === true) {
                  return;
              }
          }
          var els = this.elements;
          for (var i = els.length - 1; i >= 0; i--) {
              var el = els[i];
              if (this._isInView(el)) {
                  this._addAnimation(el);
              }
              else if (this._hasAnimated(el)) {
                  var reverseOverride = el.getAttribute('data-animation-reverse');
                  if (reverseOverride !== 'false' && this.options.reverse) {
                      this._removeAnimation(el);
                  }
              }
              else if (onLoad) {
                  var animateScrolled = el.getAttribute('data-animation-scrolled');
                  if ((this.options.scrolled || animateScrolled) &&
                      this._isAboveScrollPos(el)) {
                      this._addAnimation(el);
                  }
              }
          }
      }
  };

  return Animate;

}));
