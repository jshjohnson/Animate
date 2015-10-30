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
            target: '.js-animate'
        };

        this.options = this.extend(userOptions, defaultOptions); 
        this.elements = root.document.querySelectorAll(this.options.target);
        this.init();
    };

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
            merge(obj);
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
        root.addEventListener('scroll', function(){
            this.handleScroll();
        }.bind(this));
    };

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
            var animation = el.getAttribute('data-animation');
            if(this.isInView(el)) {
                el.setAttribute('data-visibility', true);
                el.classList.add(animation);
            }
        };
    };

    Animate.prototype.kill = function(){};

    Animate.prototype.addAnimation = function(el){};

    return Animate;
});

