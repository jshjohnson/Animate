/**

    TODO:
    - Init - Done
    - Add scroll event listener - Done
    - Determine whether element is in view - Done
    - Determine whether element is in view minus offset - Done
    - Add animation - Done
    - Kill - Done
    - Throttle scroll event listener - Done
    - Animation delays - Done
    - Improve reverse method to trigger when element leaves viewport from top
    - Classlist polyfill?
    - Support in readme
    - Use object for data attribute options?

 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.Animate = factory(root);
    }
})(this, function (root) {

    'use strict';

    var Animate = function(userOptions){
        var defaultOptions = {
            animatedClass: 'js-animated',
            offset: 0.5,
            delay: 0, 
            target: '[data-animate]',
            removeAnimations: true,
            reverse: false,
            debug: false,
            onLoad: true,
            onScroll: true,
            onResize: false,
            callback: function(){}
        };

        this.supports = 'querySelector' in document && 'addEventListener' in root;
        this.options = this._extend(defaultOptions, userOptions || {});
        this.elements = root.document.querySelectorAll(this.options.target);
        this.initialised = false;
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    // @private
    // @author David Walsh
    // @link https://davidwalsh.name/javascript-debounce-function
    Animate.prototype._debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if(callNow) {
                func.apply(context, args);
            }
        };
    };

    /**
     * Merges unspecified amount of objects into new object
     * @private
     * @return {Object} Merged object of arguments
     */
    Animate.prototype._extend = function() {
        var extended = {},
            length = arguments.length;

        var merge = function(obj) {
            for(var prop in obj) {
                extended[prop] = obj[prop];
            }
        };

        for(var i = 0; i < length; i++) {
            var obj = arguments[i];
            if(this._isType('Object', obj)) {
                merge(obj);
            } else {
                console.error('Animate.js: Custom options must be an object');
            }
        }

        return extended;
    };

    /**
     * Determines when an animation has completed
     * @author  David Walsh
     * @link https://davidwalsh.name/css-animation-callback
     * @private
     * @return {[type]} [description]
     */
    Animate.prototype._whichAnimationEvent = function(){
        var t,
        el = document.createElement("fakeelement");

        var animations = {
            "animation"      : "animationend",
            "OAnimation"     : "oAnimationEnd",
            "MozAnimation"   : "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        };

        for (t in animations){
            if (el.style[t] !== undefined){
                return animations[t];
            }
        }
    };

    /**
     * Get scroll position
     * @private
     * @return {Number} Position of scroll
     */
    Animate.prototype._getScrollPosition = function() {
        return Math.max((root.innerHeight || document.documentElement.clientHeight) + root.scrollY);
    };

    /**
     * Get an element's distance from the top of the page
     * @private
     * @param  {Node} el Element to test for
     * @return {Number} Elements Distance from top of page
     */
    Animate.prototype._getElemDistance = function(el) {
        var location = 0;
        if (el.offsetParent) {
            do {
                location += el.offsetTop;
                el = el.offsetParent;
            } while (el);
        }
        return location >= 0 ? location : 0;
    };

    /**
     * Determine element height multiplied by any offsets
     * @private
     * @param  {Node} el Element to test for
     * @return {Number}    Height of element
     */
    Animate.prototype._getElementOffset = function(el) {
        var elOffset = parseFloat(el.getAttribute('data-animation-offset'));
        if(elOffset > 1) elOffset = 1; 

        if(!isNaN(elOffset)) {
            return Math.max(el.offsetHeight*elOffset);
        } else {
            return Math.max(el.offsetHeight*this.options.offset);
        }
    };

    /**
     * Determine whether an element is within the viewport
     * @param  {Node}  el [description]
     * @return {Boolean}    [description]
     */
    Animate.prototype._isOutView = function(el) {
        return window.pageYOffset > (this._getElemDistance(el) + this._getElementOffset(el))  ? true : false;
    };

    /**
     * Determine whether an element is within the viewport
     * @param  {Node}  el [description]
     * @return {Boolean}    [description]
     */
    Animate.prototype._isInView = function(el) {
        return this._getScrollPosition() > (this._getElemDistance(el) + this._getElementOffset(el))  ? true : false;
    };

    /**
     * Tests whether a DOM node's visibility attribute is set to true
     * @private
     * @param  {Node}  el Element to test
     * @return {Boolean}
     */
    Animate.prototype._isVisible = function(el){
        var visibility = el.getAttribute('data-visibility');
        return true ? visibility === 'true' : '';
    };

    /**
     * Tests whether a DOM node has already been animated
     * @private
     * @param  {Node}  el Element to test
     * @return {Boolean}
     */
    Animate.prototype._hasAnimated = function(el){
        var animated = el.getAttribute('data-animated');
        return true ? animated === 'true' : '';
    };

    /**
     * Test whether an object is of a give type
     * @private
     * @param  {String}  type Type to test for e.g. 'String', 'Array'
     * @param  {Object}  obj  Object to test type against
     * @return {Boolean}      Whether object is of a type
     */
    Animate.prototype._isType = function(type, obj) {
        var test = Object.prototype.toString.call(obj).slice(8,-1);
        return obj !== null && obj !== undefined && test === type;
    };

    /**
     * Add animation to given element
     * @private
     * @param {Node} el Element to target
     */
    Animate.prototype._addAnimation = function(el){

        el.setAttribute('data-visibility', true);
        var animations = el.getAttribute('data-animation-classes').split(' ');
        var animationDelay = parseInt(el.getAttribute('data-animation-delay'), 10) || this.options.delay;

        if(animationDelay && this._isType('Number', animationDelay) && animationDelay !== 0) {
            setTimeout(function() {
                if(this.options.debug) console.debug('animate.js: Animation added');
                animations.forEach(function(animation) {
                    el.classList.add(animation);
                });
            }.bind(this), animationDelay);
        } else {
            if(this.options.debug) console.debug('animate.js: Animation added');
            animations.forEach(function(animation){
               el.classList.add(animation);
            });
        }

        this._completeAnimation(el);
    };

    /**
     * Remove animation from given element
     * @private
     * @param {Node} el Element to target
     */
    Animate.prototype._removeAnimation = function(el){

        el.setAttribute('data-visibility', false);
        el.removeAttribute('data-animated');
        var animations = el.getAttribute('data-animation-classes').split(' ');
        var animationDelay = parseInt(el.getAttribute('data-animation-delay'), 10);
        animations.push(this.options.animatedClass);

        if(animationDelay && this._isType('Number', animationDelay)) {
            setTimeout(function() {
                if(this.options.debug) console.debug('animate.js: Animation removed');
                animations.forEach(function(animation) {
                    el.classList.remove(animation);
                });
            }.bind(this), animationDelay);
        } else {
            if(this.options.debug) console.debug('animate.js: Animation removed');
            animations.forEach(function(animation){
               el.classList.remove(animation);
            });
        }

    };

    /**
     * Add class & data attribute to element on animation completion
     * @private
     * @param  {Node} el Element to target
     */
    Animate.prototype._completeAnimation = function(el){
        var animationEvent = this._whichAnimationEvent();
        el.addEventListener(animationEvent, function() {
            if(this.options.debug) console.debug('animate.js: Animation completed');

            el.classList.add(this.options.animatedClass);
            el.setAttribute('data-animated', true);
        
            var removeOveride = el.getAttribute('data-animate-remove');
            if(this.options.removeAnimations && (removeOveride !== "false")) {
                var animations = el.getAttribute('data-animation-classes').split(' ');
                animations.forEach(function(animation) {
                    el.classList.remove(animation);
                });
            }

            if(this._isType('Function', this.options.callback)) {
                this.options.callback(el);
            }
        }.bind(this));
    };

    /**
     * Initalises event listeners
     * @public
     */
    Animate.prototype.init = function(){
        if(this.options.debug) {
            console.debug('animate.js: Animate.js successfully initialised');
            console.debug('animate.js: Found ' + this.elements.length + ' elements to animate');
        }

        if(!this.supports) return;

        var throttledEvent = this._debounce(function() {
            this.render();
        }.bind(this), 15);

        if(this.options.onLoad) {
            root.addEventListener('DOMContentLoaded', throttledEvent());
        }

        if(this.options.onResize) {
            root.addEventListener('resize', function(){
                throttledEvent();
            }, false);
        }

        if(this.options.onScroll) {
            root.addEventListener('scroll', function(){
                throttledEvent();
            }, false);
        }

        this.initialised = true;
    };

    /**
     * Stop all running event listeners & resets options to null
     * @public
     */
    Animate.prototype.kill = function(){
        if(this.options.debug) console.debug('animate.js: Animation.js nuked');

        // Test to see whether we have actually initialised
        if (!this.initialised) return;

        // Remove event listeners
        if(this.options.onScroll) {
            root.removeEventListener('scroll', this.animateListener);
        }

        if(this.options.onResize) {
            root.removeEventListener('resize', this.animateListener);
        }

        if(this.options.onLoad) {
            root.removeEventListener('DOMContentLoaded', this.animateListener);
        }

        // Reset settings
        this.settings = null;
    };

    /**
     * Toggles animations on an event
     * @public
     * @return {}
     */
    Animate.prototype.render = function(){
        var els = this.elements;
        for (var i = els.length - 1; i >= 0; i--) {
            var el = els[i];

            // If element is in view and is not set to visible
            if(this._isInView(el) && !this._isOutView(el)) {
                if(!this._isVisible(el)){
                    this._addAnimation(el);
                }
            } else if(this._isOutView(el) && this._hasAnimated(el) && this.options.reverse) {
                this._removeAnimation(el);
            }
        }
    };

    /**
     * Get elements that have been animated
     * @public
     * @return {Array} Array of nodes
     */
    Animate.prototype.getAnimatedElements = function() {
        var animatedEls = [];
        for (var i = this.elements.length - 1; i >= 0; i--) {
            var el = this.elements[i];
            if(this._hasAnimated(el)) {
                animatedEls.push(el);
            }
        }
        return animatedEls;
    };


    return Animate;
});
