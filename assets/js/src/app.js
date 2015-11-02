/**

    TODO:
    - Init - Done
    - Add scroll event listener - Done
    - Determine whether element is in view - Done
    - Determine whether element is in view minus offset
    - Add animation - Done
    - Kill - Done

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
            offsetTop: 0, 
            offsetRight: (window.innerWidth || document.documentElement.clientWidth),
            offsetBottom: (window.innerHeight || document.documentElement.clientHeight),
            offsetLeft: 0,
            target: '[data-animate]',
            reverse: false,
            debug: false,
            onLoad: true,
            onScroll: true,
            callback: function(){}
        };

        this.options = this.extend(defaultOptions, userOptions); 
        this.elements = root.document.querySelectorAll(this.options.target);
        this.initialised = false;
        this.init();
    };

    /**
     * Merges unspecified amount of objects into new object
     * @return {Object} Merged object of arguments
     */
    Animate.prototype.extend = function() {
        var extended = {},
            length = arguments.length;

        var merge = function(obj) {
            for(var prop in obj) {
                extended[prop] = obj[prop];
            }
        };

        for(var i = 0; i < length; i++) {
            var obj = arguments[i];
            if(this.isType('Object', obj)) {
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
    Animate.prototype.whichAnimationEvent = function(){
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

        this.animateListener = function(){
            this.handleEvent();
        }.bind(this);

        if(this.options.onScroll) {
            root.addEventListener('scroll', this.animateListener);
        }

        if(this.options.onLoad) {
            root.addEventListener('DOMContentLoaded', this.animateListener);
        }

        this.initialised = true;

        this.callback();
    };

    /**
     * Callback method to run on initialisation
     * @return {Function} Passed function
     */
    Animate.prototype.callback = function(){
        return this.options.callback();
    };

    /**
     * Tests whether give DOM node is within viewport boundaries
     * @param  {Node}  el Element to test for 
     * @return {Boolean}
     */
    Animate.prototype.isInView = function(el){
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= this.options.offsetTop &&
            rect.left >= this.options.offsetLeft &&
            rect.bottom <= this.options.offsetBottom &&
            rect.right <= this.options.offsetRight
        );
    };

    /**
     * Tests whether a DOM node's visibility attribute is set to true
     * @param  {Node}  el Element to test
     * @return {Boolean}
     */
    Animate.prototype.isVisible = function(el){
        var visibility = el.getAttribute('data-visibility');
        return true ? visibility === 'true' : '';
    };

    /**
     * Test whether an object is of a give type
     * @param  {String}  type Type to test for e.g. 'String', 'Array'
     * @param  {Object}  obj  Object to test type against
     * @return {Boolean}      Whether object is of type
     */
    Animate.prototype.isType = function(type, obj) {
        var test = Object.prototype.toString.call(obj).slice(8,-1);
        if(test !== null && test !== undefined && test === type) {
            return true;
        } else {
            return false;
        }
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
            if(this.isInView(el)) {
                if(this.isVisible(el) === false){
                    this.addAnimation(el);
                }
            } else {
                if(this.options.reverse && this.isVisible(el) === true) {
                    // This runs everytime the user scrolls, it shouldn't. Hmm
                    this.removeAnimation(el);
                }
            }
        }
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
     * Add class & data attribute to element on animation completion
     * @param  {Node} el Element to target
     */
    Animate.prototype.completeAnimation = function(el){
        if(this.options.debug) {
            console.log('Animation completed');
        }

        el.classList.add('js-animate-complete');
        el.setAttribute('data-animated', true);
        if(this.options.reverse) {
            this.removeAnimation(el);
        }
    };

    /**
     * Add animation to given element 
     * @param {Node} el Element to target
     */
    Animate.prototype.addAnimation = function(el){
        if(this.options.debug) {
            console.log('Animation added');
        }

        el.setAttribute('data-visibility', true);
        var animations = el.getAttribute('data-animation').split(' ');
        
        animations.forEach(function(animation){
            el.classList.add(animation);
        });


        // This seems out of place. Hmmm
        var animationEvent = this.whichAnimationEvent();
        el.addEventListener(animationEvent, function() {
            this.completeAnimation(el);
        }.bind(this));
    };

    /**
     * Remove animation from given element 
     * @param {Node} el Element to target
     */
    Animate.prototype.removeAnimation = function(el){
        if(this.options.debug) {
            console.log('Animation removed');
        }

        el.setAttribute('data-visibility', false);
        var animations = el.getAttribute('data-animation').split(' ');
        animations.forEach(function(animation){
            el.classList.remove(animation);
        });
        
    };

    return Animate;
});

