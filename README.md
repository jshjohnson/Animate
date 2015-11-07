# Animate.js [![Build Status](https://travis-ci.org/jshjohnson/animate.js.svg?branch=develop)](https://travis-ci.org/jshjohnson/animate.js)

Trigger animations on elements when they are in view

##Installation
```html
<script src="/assets/js/dist/animate.js"></script>
<script>
    var animate = new Animate({
        animatedClass: 'js-animated',
        offset: 0.5, 
        target: '[data-animate]',
        reverse: false,
        debug: false,
        onLoad: true,
        onScroll: true,
        callback: function (element) {
            console.log(element)
        }
    });
    animate.init();
</script>
```

##Animating elements

To animate an element, it will need a target data attribute set to it - by default this is `data-animate`. Assign animations via the `data-animation-classes` attribute (seperated by a comma). Optionally set a milisecond delay via the `data-animation-delay` attribute - by default there is no delay. 

####Examples
```html
<div data-animate data-animation-classes="animated fadeIn" data-animation-delay="1000"></div>
```

##Options
####target
Type: `String` Default: `[data-animate]`

Element/s to target. Once this element is in view, add animations

####offset
Type: `Number` Default: `0.5` (50%)

Percentage of element that needs to be in the viewport before the animation triggers

####animatedClass
Type: `String` Default: `js-animated`

Class to be added to element once animation has completed

####reverse
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
####callback
Type: `Function` Default: `function(){}`

Function to run once animation has completed

##Methods
####init();
Initialises event listeners
####kill();
Kills event listeners and resets options
####render();
Adds/removes animations without the need for event listeners
####getAnimatedElements();
Returns an array of elements that have been animated
