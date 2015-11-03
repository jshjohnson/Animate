# Animate.js [![Build Status](https://travis-ci.org/jshjohnson/animate.js.svg?branch=develop)](https://travis-ci.org/jshjohnson/animate.js)

Trigger animations on elements when they are in view

##Installation
```
<script type="text/javascript" src="/assets/js/dist/animate.js"></script>
<script>
    var animate = new Animate();
</script>
```

##Options
####animatedClass
Type: `String` Default: `js-animated`
####offset (still in development)
Type: `Number` Default: `0`
####target
Type: `String` Default: `[data-animate]`
####reverse (still in development)
Type: `Boolean` Default: `false`
####debug
Type: `Boolean` Default: `false`
####onLoad
Type: `Boolean` Default: `true`
####onScroll
Type: `Boolean` Default: `true`
####callback
Type: `Function` Default: `function(){}`

##Methods
####init();
####kill();
####resolveAnimations();
####getAnimatedElements();
