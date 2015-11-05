# Animate.js [![Build Status](https://travis-ci.org/jshjohnson/animate.js.svg?branch=develop)](https://travis-ci.org/jshjohnson/animate.js)

Trigger animations on elements when they are in view

##Installation
```html
<script src="/assets/js/dist/animate.js"></script>
<script>
    var animate = new Animate();
</script>
```

##Options
####target
Type: `String` Default: `[data-animate]`

Element/s to target. Once this element is in view, add animations

####offset (still in development)
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
