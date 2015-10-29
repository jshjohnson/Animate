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
        };

        this.animationComplete = 'animated',
        this.options = this.extend(userOptions, defaultOptions); 
    };

    Animate.prototype.extend = function() {
        var extended = {},
            length = arguments.length;

        var merge = function(obj) {
            for(var prop in obg) {
                obj[prop] = extended[prop];
            };
        };

        for(var i = 0; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    Animate.prototype.defaultOptions =  

    Animate.prototype.init = function(){};

    Animate.prototype.kill = function(){};

    Animate.prototype.addAnimation = function(){};

    Animate.prototype.addAnimation = function(){};

    return Animate;
});

