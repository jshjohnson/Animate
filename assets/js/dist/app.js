/*! to-do-app v1.0.0 | (c) 2015 Josh Johnson | https://github.com/jshjohnson/to-do-list-app#readme */
/**

    TODO:
    - Init - Done
    - Add scroll event listener - Done
    - Determine whether element is in view - Done
    - Determine whether element is in view minus offset
    - Add animation - Done
    - Kill - Done
    - Throttle scroll event listener

 */

(function(root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.Animate = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

    'use strict';

    var Animate = function(userOptions){
        var defaultOptions = {
            animationComplete: 'js-animated',
            offset: 0, 
            target: '[data-animate]',
            reverse: false,
            debug: false,
            onLoad: true,
            onScroll: true,
            callback: function(){}
        };

        this.options = this._extend(defaultOptions, userOptions || {}); 
        this.elements = root.document.querySelectorAll(this.options.target);
        this.initialised = false;
        this.init();
    };

    /**
     * Merges unspecified amount of objects into new object
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
                console.warn('Custom options must be an object');
            }
        }

        return extended;
    };

    /**
     * Determines when an animation has completed
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
     * Tests whether give DOM node is within viewport boundaries
     * @param  {Node}  el Element to test for 
     * @return {Boolean}
     */
    Animate.prototype._isInView = function(el){
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    /**
     * Tests whether a DOM node's visibility attribute is set to true
     * @param  {Node}  el Element to test
     * @return {Boolean}
     */
    Animate.prototype._isVisible = function(el){
        var visibility = el.getAttribute('data-visibility');
        return true ? visibility === 'true' : '';
    };

    /**
     * Test whether an object is of a give type
     * @param  {String}  type Type to test for e.g. 'String', 'Array'
     * @param  {Object}  obj  Object to test type against
     * @return {Boolean}      Whether object is of type
     */
    Animate.prototype._isType = function(type, obj) {
        var test = Object.prototype.toString.call(obj).slice(8,-1);
        return obj !== null && obj !== undefined && test === type;
    };

    /**
     * Add class & data attribute to element on animation completion
     * @param  {Node} el Element to target
     */
    Animate.prototype._completeAnimation = function(el){
        if(this.options.debug) {
            console.log('Animation completed');
        }

        el.classList.add('js-animate-complete');
        el.setAttribute('data-animated', true);

        if(this._isType('Function', this.options.callback)) {
            this.options.callback();
        }

        if(this.options.reverse) {
            this._removeAnimation(el);
        }
    };

    /**
     * Add animation to given element 
     * @param {Node} el Element to target
     */
    Animate.prototype._addAnimation = function(el){
        if(this.options.debug) {
            console.log('Animation added');
        }

        el.setAttribute('data-visibility', true);
        var animations = el.getAttribute('data-animation-classes').split(' ');
        
        animations.forEach(function(animation){
            el.classList.add(animation);
        });


        // This seems out of place. Hmmm
        var animationEvent = this._whichAnimationEvent();
        el.addEventListener(animationEvent, function() {
            this._completeAnimation(el);
        }.bind(this));
    };

    /**
     * Remove animation from given element 
     * @param {Node} el Element to target
     */
    Animate.prototype._removeAnimation = function(el){
        if(this.options.debug) {
            console.log('Animation removed');
        }

        el.setAttribute('data-visibility', false);
        var animations = el.getAttribute('data-animation-classes').split(' ');
        animations.forEach(function(animation){
            el.classList.remove(animation);
        });
        
    };

    /**
     * Initalises event listeners
     */
    Animate.prototype.init = function(){
        if(this.options.debug) {
            console.log('Animate.js successfully initialised');
            if(this.elements.length !== 0) {
                console.log('Found ' + this.elements.length + ' elements to animate');
            } else {
                console.warn('No elements to animate');
            }
        }

        if(this.options.onScroll) {
            root.addEventListener('scroll', function(){
                this.handleEvent();
            }.bind(this));
        }

        if(this.options.onLoad) {
            root.addEventListener('DOMContentLoaded', function(){
                this.handleEvent();
            }.bind(this));
        }

        this.initialised = true;

    };

    /**
     * Stop all running event listeners & resets options to null
     */
    Animate.prototype.kill = function(){
        if(this.options.debug) {
            console.log('Animation.js nuked');
        }

        // Test to see whether we have actually initialised
        if (!this.initialised) return;

        // Remove event listeners
        root.removeEventListener('scroll', this.animateListener);
        root.removeEventListener('DOMContentLoaded', this.animateListener);

        // Reset settings
        this.settings = null;
        this.eventTimeout = null;
    };

    /**
     * Toggles animations on an event
     * @return {}
     */
    Animate.prototype.handleEvent = function(){
        var els = this.elements;
        for (var i = els.length - 1; i >= 0; i--) {
            var el = els[i];
            // If element is in view and is not set to visible
            if(this._isInView(el)) {
                if(this._isVisible(el) === false){
                    this._addAnimation(el);
                }
            } else {
                if(this.options.reverse && this._isVisible(el) === true) {
                    // This runs everytime the user scrolls, it shouldn't. Hmm
                    this._removeAnimation(el);
                }
            }
        }
    };

    return Animate;
});

