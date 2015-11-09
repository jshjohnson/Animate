# Animate.js [![Build Status](https://travis-ci.org/jshjohnson/animate.svg?branch=develop)](https://travis-ci.org/jshjohnson/animate)

Trigger animations on elements when they are in view

##Installation
```html
<script src="/assets/js/dist/animate.js"></script>
<script>
    var animate = new Animate({
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
        callback: function (element) {
            console.log(element)
        }
    });
    animate.init();
</script>
```

##Animating elements
#####`data-animate`

Default way of targeting an element to animate (no value required). This can be overridden to be a custom attribute or class.

#####`data-animation-classes`

Animations to be added to element when it is in view. To add multiple classes, seperate each class with a comma.

###Optional element overrides
#####`data-animation-delay`

Overide the plugin `delay` per element

#####`data-animation-offset`

Override the plugin `offset` per element.

#####`data-animate-remove`

Overide the plugin `removeAnimations` per element.

####Examples
```html
<div data-animate data-animation-classes="animated fadeIn" data-animation-delay="1000" data-animation-offset="0.2"></div>
```

##Options
####target
Type: `String` Default: `[data-animate]`

Element/s to target. Once this element is in view, add animations

####offset
Type: `Number` Default: `0.5` (50%)

Percentage of element that needs to be in the viewport before the animation triggers

####delay
Type: `Number` Default: `0`

Milisecond delay before animation is added to element in view

####animatedClass
Type: `String` Default: `js-animated`

Class to be added to element once animation has completed

####reverse (experimental)
Type: `Boolean` Default: `false`

Once the element is out of view, remove animations

####debug
Type: `Boolean` Default: `false`

Debugging information in console

####onLoad
Type: `Boolean` Default: `true`

Whether to fire on DOMContentLoaded

####onScroll
Type: `Boolean` Default: `true`

Whether to fire on scroll

####onResize
Type: `Boolean` Default: `false`

Whether to fire on resize

####callback
Type: `Function` Default: `function(){}`

Function to run once animation has completed (pass parameter to access the animated element)

##Methods
####init();
Initialises event listeners
####kill();
Kills event listeners and resets options
####render();
Adds/removes animations without the need for event listeners
####getAnimatedElements();
Returns an array of elements that have been animated

##Development
To setup a local environment, clone this repo, navigate into the directory and run the following commands in a terminal windows:
* ``npm install``

###Gulp tasks
* ``gulp dev``
* ``gulp test``
* ``gulp build``
