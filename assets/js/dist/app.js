/*! to-do-app v1.0.0 | (c) 2015 Josh Johnson | https://github.com/jshjohnson/to-do-list-app#readme */
/**

    TODO:
    - Add scroll event listener
    - Determine whether element is in view
    - Determine whether element is in view minus offset
    - 
    - Add animation

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
            animationComplete: 'animated',
            offset: 0, 
            target: '.js-animate',
            reverse: false,
            debug: false,
        };

        this.options = this.extend(defaultOptions, userOptions); 
        this.elements = root.document.querySelectorAll(this.options.target);
        this.init();
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
                console.warn('Custom options must be within an object');
            }
        }

        return extended;
    };


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

    Animate.prototype.init = function(){
        if(this.options.debug === true) {
            console.log('Animate.js successfully initialised');
            if(this.elements.length !== 0) {
                console.log('Found elements to animate');
            } else {
                console.warn('No elements to animate');
            }
        }
        root.addEventListener('scroll', function(){
            this.handleScroll();
        }.bind(this));
    };

    /**
     * Tests whether give DOM node is within viewport boundaries
     * @param  {Node}  el Element to test for 
     * @return {Boolean}
     */
    Animate.prototype.isInView = function(el){
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    };

    Animate.prototype.handleScroll = function(){
        var els = this.elements;
        for (var i = els.length - 1; i >= 0; i--) {
            var el = els[i];
            if(this.isInView(el)) {
                this.addAnimation(el);
            } else {
                if(this.options.reverse === true) {
                    // This runs everytime the user scrolls, it shouldn't. Hmm
                    this.removeAnimation(el);
                }
            }
        }
    };

    Animate.prototype.kill = function(){};

    /**
     * Add animation to given element 
     * @param {Node} el Element to target
     */
    Animate.prototype.addAnimation = function(el){
        if(this.options.debug === true) {
            console.log('Animation added');
        }
        var animation = el.getAttribute('data-animation');
        el.setAttribute('data-visibility', true);
        el.classList.add(animation);
    };

    /**
     * Remove animation from given element 
     * @param {Node} el Element to target
     */
    Animate.prototype.removeAnimation = function(el){
        if(this.options.debug === true) {
            console.log('Animation removed');
        }
        var animation = el.getAttribute('data-animation');
        el.setAttribute('data-visibility', false);
        el.classList.remove(animation);
    };

    return Animate;
});

