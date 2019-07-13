import debounce from "lodash-es/debounce";
import merge from "lodash-es/merge";

interface Animate {
  options: AnimateOptions;
  elements: NodeListOf<Element>;
  initialised: boolean;
  verticalOffset: number;
  horizontalOffset: number;
  throttledEvent: () => void;
}

interface AnimateOptions {
  target: string;
  animatedClass: string;
  offset: number[] | string;
  delay: number;
  remove: boolean;
  scrolled: boolean;
  reverse: boolean;
  onLoad: boolean;
  onScroll: boolean;
  onResize: boolean;
  disableFilter: () => boolean | void;
  callbackOnInit: () => void;
  callbackOnInView: () => void;
  callbackOnAnimate: () => void;
}

class Animate implements Animate {
  public constructor(options: AnimateOptions) {
    const defaultOptions = {
      target: "[data-animate]",
      animatedClass: "js-animated",
      offset: [0.5, 0.5],
      delay: 0,
      remove: true,
      scrolled: false,
      reverse: false,
      onLoad: true,
      onScroll: true,
      onResize: false,
      disableFilter: (): boolean | void => {},
      callbackOnInit(): void {},
      callbackOnInView(): void {},
      callbackOnAnimate(): void {}
    };

    this.options = merge(defaultOptions, options || {});
    this.elements = document.querySelectorAll(this.options.target);
    this.initialised = false;

    if (Animate.isType("string", this.options.offset)) {
      const splitOffset = (this.options.offset as string).split(",");

      this.verticalOffset = parseInt(splitOffset[0], 10);
      this.horizontalOffset = parseInt(splitOffset[1], 10);
    } else {
      const [verticalOffset, horizontalOffset] = this.options
        .offset as number[];

      this.verticalOffset = verticalOffset as number;
      this.horizontalOffset = horizontalOffset as number;
    }

    this.throttledEvent = debounce((): void => {
      this.render();
    }, 15);
  }

  /**
   * Determines when an animation has completed
   * @author  David Walsh
   * @link https://davidwalsh.name/css-animation-callback
   * @private
   * @return {String} Appropriate 'animationEnd' event for browser to handle
   */
  private static whichAnimationEvent(): string | void {
    const el = document.createElement("temp");

    const browserPrefixes = {
      animation: "animationend",
      OAnimation: "oAnimationEnd",
      MozAnimation: "animationend",
      WebkitAnimation: "webkitAnimationEnd"
    };

    let prefix: keyof typeof browserPrefixes;

    for (prefix in browserPrefixes) {
      if (Object.prototype.hasOwnProperty.call(browserPrefixes, prefix)) {
        if (el.style[prefix as keyof CSSStyleDeclaration] !== undefined) {
          return browserPrefixes[prefix];
        }
      }
    }

    return null;
  }

  /**
   * Determines whether we have already scrolled past the element
   * @param  {Element}  el Element to test
   * @return {Boolean}
   */
  private isAboveScrollPos(el: Element): boolean {
    const dimensions = el.getBoundingClientRect();
    const scrollPos = window.scrollY || window.pageYOffset;

    return dimensions.top + dimensions.height * this.verticalOffset < scrollPos;
  }

  /**
   * Determines the offset for a particular element considering
   * any attribute overrides. Falls back to config options otherwise
   * @param  {Element} el Element to get offset for
   * @return {Array}    An offset array of [Y,X] offsets
   */
  private getElementOffset(el: Element): number[] {
    const elementOffset = el.getAttribute("data-animation-offset");
    let elementOffsetArray = [this.verticalOffset, this.horizontalOffset];

    if (elementOffset) {
      const stringArray = elementOffset.split(",");
      if (stringArray.length === 1) {
        elementOffsetArray = [
          parseFloat(stringArray[0]),
          parseFloat(stringArray[0])
        ];
      } else {
        elementOffsetArray = [
          parseFloat(stringArray[0]),
          parseFloat(stringArray[1])
        ];
      }
    }

    return elementOffsetArray;
  }

  /**
   * Determine whether an element is within the viewport
   * @param  {Element}  el Element to test for
   * @return {String} Position of scroll
   * @return {Boolean}
   */
  private isInView(el: Element): boolean {
    // Dimensions
    const dimensions = el.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    // Offset
    const elementOffset = this.getElementOffset(el);
    const verticalOffset = elementOffset[0];
    const horizontalOffset = elementOffset[1];

    // Vertical
    const isInViewFromTop =
      dimensions.bottom - dimensions.height * verticalOffset > 0;
    const isInViewFromBottom =
      dimensions.top + dimensions.height * verticalOffset < viewportHeight;
    const isInViewVertically = isInViewFromTop && isInViewFromBottom;

    // Horizontal
    const isInViewFromLeft =
      dimensions.right - dimensions.width * horizontalOffset > 0;
    const isInViewFromRight =
      dimensions.left + dimensions.width * horizontalOffset < viewportWidth;
    const isInViewHorizontally = isInViewFromLeft && isInViewFromRight;

    return isInViewVertically && isInViewHorizontally;
  }

  /**
   * Tests whether a DOM node's visibility attribute is set to true
   * @private
   * @param  {Element}  el Element to test
   * @return {Boolean}
   */
  private static isVisible(el: Element): boolean {
    const visibility = el.getAttribute("data-visibility");
    return visibility === "true";
  }

  /**
   * Tests whether a DOM node has already been animated
   * @private
   * @param  {Element}  el Element to test
   * @return {Boolean}
   */
  private static hasAnimated(el: Element): boolean {
    const animated = el.getAttribute("data-animated");
    return animated === "true";
  }

  /**
   * Test whether an object is of a give type
   * @private
   * @param  {String}  type Type to test for e.g. 'String', 'Array'
   * @param  {Object}  obj  Object to test type against
   * @return {Boolean}      Whether object is of a type
   */
  private static isType(type: string, obj: any): boolean {
    const test = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== null && obj !== undefined && test === type;
  }

  /**
   * Add animation to given element
   * @private
   * @param {Element} el Element to target
   */
  private addAnimation(el: Element): void {
    if (!Animate.isVisible(el)) {
      Animate.doCallback(this.options.callbackOnInView, el);

      const classes = el.getAttribute("data-animation-classes");
      if (classes) {
        el.setAttribute("data-visibility", "true");
        const animations = classes.split(" ");
        const animationDelay =
          parseInt(el.getAttribute("data-animation-delay"), 10) ||
          this.options.delay;

        if (
          animationDelay &&
          Animate.isType("Number", animationDelay) &&
          animationDelay !== 0
        ) {
          setTimeout((): void => {
            animations.forEach((animation): void => {
              el.classList.add(animation);
            });
          }, animationDelay);
        } else {
          animations.forEach((animation): void => {
            el.classList.add(animation);
          });
        }

        this.completeAnimation(el);
      } else {
        console.error("No animation classes were given");
      }
    }
  }

  /**
   * Remove animation from given element
   * @private
   * @param {Element} el Element to target
   */
  private removeAnimation(el: Element): void {
    const classes = el.getAttribute("data-animation-classes");
    if (classes) {
      el.setAttribute("data-visibility", "false");
      el.removeAttribute("data-animated");
      const animations = classes.split(" ");
      const animationDelay = parseInt(
        el.getAttribute("data-animation-delay"),
        10
      );

      animations.push(this.options.animatedClass);

      if (animationDelay && Animate.isType("Number", animationDelay)) {
        setTimeout((): void => {
          animations.forEach((animation): void => {
            el.classList.remove(animation);
          });
        }, animationDelay);
      } else {
        animations.forEach((animation): void => {
          el.classList.remove(animation);
        });
      }
    } else {
      console.error("No animation classes were given");
    }
  }

  /**
   * If valid callback has been passed, run it with optional element as a parameter
   * @private
   * @param  {Function}         fn Callback function
   * @param  {Element}      el
   */
  private static doCallback(
    fn: (el?: Element) => void,
    el: Element = null
  ): void {
    if (fn && Animate.isType("Function", fn)) {
      fn(el);
    } else {
      console.error("Callback is not a function");
    }
  }

  /**
   * Add class & data attribute to element on animation completion
   * @private
   * @param  {Element} el Element to target
   */
  private completeAnimation(el: Element): void {
    // Store animation event
    const animationEvent = Animate.whichAnimationEvent();

    if (animationEvent) {
      // When animation event has finished
      el.addEventListener(animationEvent, (): void => {
        const removeOverride = el.getAttribute("data-animation-remove");

        // If remove animations on completion option is turned on
        if (removeOverride !== "false" && this.options.remove) {
          // Separate each class held in the animation classes attribute
          const animations = el
            .getAttribute("data-animation-classes")
            .split(" ");

          // Remove each animation from element
          animations.forEach((animation): void => {
            el.classList.remove(animation);
          });
        }

        // Add animation complete class
        el.classList.add(this.options.animatedClass);
        // Set animated attribute to true
        el.setAttribute("data-animated", "true");

        Animate.doCallback(this.options.callbackOnAnimate, el);
      });
    }
  }

  /**
   * Remove event listeners
   * @public
   */
  public removeEventListeners(): void {
    if (this.options.onResize) {
      window.removeEventListener("resize", this.throttledEvent, false);
    }

    if (this.options.onScroll) {
      window.removeEventListener("scroll", this.throttledEvent, false);
    }
  }

  /**
   * Add event listeners
   * @public
   */
  public addEventListeners(): void {
    if (this.options.onLoad) {
      document.addEventListener("DOMContentLoaded", (): void => {
        this.render(true);
      });
    }

    if (this.options.onResize) {
      window.addEventListener("resize", this.throttledEvent, false);
    }

    if (this.options.onScroll) {
      window.addEventListener("scroll", this.throttledEvent, false);
    }
  }

  /**
   * Initializes Animate.js and adds event listeners
   * @public
   */
  public init(): void {
    this.initialised = true;

    this.addEventListeners();

    Animate.doCallback(this.options.callbackOnInit);
  }

  /**
   * Stop all running event listeners & resets options to null
   * @public
   */
  public kill(): void {
    // If we haven't initialised, there is nothing to kill.
    if (!this.initialised) {
      return;
    }

    this.removeEventListeners();

    // Reset settings
    this.options = null;
    this.initialised = false;
  }

  /**
   * Toggles animations on an event
   * @public
   * @return {}
   */
  public render(onLoad?: boolean): void {
    if (this.initialised) {
      // If a disability filter function has been passed...
      if (
        this.options.disableFilter &&
        Animate.isType("Function", this.options.disableFilter)
      ) {
        const test = this.options.disableFilter();
        // ...and it passes, kill render
        if (test === true) {
          return;
        }
      }

      // Grab all elements in the DOM with the correct target
      const els = this.elements;

      // Loop through all elements
      for (let i = els.length - 1; i >= 0; i--) {
        // Store element at location 'i'
        const el = els[i];

        // If element is in view
        if (this.isInView(el)) {
          // Add those snazzy animations
          this.addAnimation(el);
        } else if (Animate.hasAnimated(el)) {
          // See whether it has a reverse override
          const reverseOverride = el.getAttribute("data-animation-reverse");

          if (reverseOverride !== "false" && this.options.reverse) {
            this.removeAnimation(el);
          }
        } else if (onLoad) {
          const animateScrolled = el.getAttribute("data-animation-scrolled");

          // If this render has been triggered on load and the element is above our current
          // scroll position and the `scrolled` option is set, animate it.
          if (
            (this.options.scrolled || animateScrolled) &&
            this.isAboveScrollPos(el)
          ) {
            this.addAnimation(el);
          }
        }
      }
    }
  }
}

export default Animate;
