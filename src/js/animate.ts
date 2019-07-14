import debounce from 'lodash-es/debounce';
import merge from 'lodash-es/merge';

import getBrowserAnimationPrefix from './utils/getBrowserAnimationPrefix';

interface Animate {
  options: AnimateOptions;
  elements: Element[];
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

/**
 * @name Animate.js
 * @author Josh Johnson
 * @license MIT
 */
class Animate implements Animate {
  public constructor(options: AnimateOptions) {
    const defaultOptions = {
      target: '[data-animate]',
      animatedClass: 'js-animated',
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
      callbackOnAnimate(): void {},
    };

    this.options = merge(defaultOptions, options || {});
    this.elements = Array.from(document.querySelectorAll(this.options.target));
    this.initialised = false;

    if (typeof this.options.offset === 'string') {
      const splitOffset = (this.options.offset as string).split(',');

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

  private isAboveScrollPos(el: Element): boolean {
    const dimensions = el.getBoundingClientRect();
    const scrollPos = window.scrollY || window.pageYOffset;

    return dimensions.top + dimensions.height * this.verticalOffset < scrollPos;
  }

  private getElementOffset(el: Element): number[] {
    const elementOffset = el.getAttribute('data-animation-offset');
    let elementOffsetArray = [this.verticalOffset, this.horizontalOffset];

    if (elementOffset) {
      const stringArray = elementOffset.split(',');
      if (stringArray.length === 1) {
        elementOffsetArray = [
          parseFloat(stringArray[0]),
          parseFloat(stringArray[0]),
        ];
      } else {
        elementOffsetArray = [
          parseFloat(stringArray[0]),
          parseFloat(stringArray[1]),
        ];
      }
    }

    return elementOffsetArray;
  }

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

  private static isVisible(el: Element): boolean {
    const visibility = el.getAttribute('data-visibility');
    return visibility === 'true';
  }

  private static hasAnimated(el: Element): boolean {
    const animated = el.getAttribute('data-animated');
    return animated === 'true';
  }

  private addAnimation(el: Element): void {
    if (Animate.isVisible(el)) {
      return;
    }

    Animate.doCallback(this.options.callbackOnInView, el);

    const classes = el.getAttribute('data-animation-classes');

    if (!classes) {
      console.error('No animation classes were given');
      return;
    }

    el.setAttribute('data-visibility', 'true');

    const animations = classes.split(' ');
    const animationDelay =
      parseInt(el.getAttribute('data-animation-delay'), 10) ||
      this.options.delay;

    if (
      animationDelay &&
      typeof animationDelay === 'number' &&
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
  }

  private removeAnimation(el: Element): void {
    const classes = el.getAttribute('data-animation-classes');

    if (!classes) {
      console.error('No animation classes were given');
      return;
    }

    el.setAttribute('data-visibility', 'false');
    el.removeAttribute('data-animated');
    const animations = classes.split(' ');
    const animationDelay = parseInt(
      el.getAttribute('data-animation-delay'),
      10,
    );

    animations.push(this.options.animatedClass);

    if (animationDelay && typeof animationDelay === 'number') {
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
  }

  private static doCallback(
    fn: (el?: Element) => void,
    el: Element = null,
  ): void {
    if (fn && typeof fn === 'function') {
      fn(el);
    } else {
      console.error('Callback is not a function');
    }
  }

  private completeAnimation(el: Element): void {
    // Store animation event
    const animationEvent = getBrowserAnimationPrefix();

    if (!animationEvent) {
      return;
    }

    // When animation event has finished
    el.addEventListener(animationEvent, (): void => {
      const removeOverride = el.getAttribute('data-animation-remove');

      if (removeOverride !== 'false' && this.options.remove) {
        // Separate each class held in the animation classes attribute
        const animations = el.getAttribute('data-animation-classes').split(' ');

        animations.forEach((animation): void => {
          el.classList.remove(animation);
        });
      }

      el.classList.add(this.options.animatedClass);
      el.setAttribute('data-animated', 'true');

      Animate.doCallback(this.options.callbackOnAnimate, el);
    });
  }

  public removeEventListeners(): void {
    const { onResize, onScroll } = this.options;

    if (onResize) {
      window.removeEventListener('resize', this.throttledEvent, false);
    }

    if (onScroll) {
      window.removeEventListener('scroll', this.throttledEvent, false);
    }
  }

  public addEventListeners(): void {
    const { onLoad, onResize, onScroll } = this.options;

    if (onLoad) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', (): void => {
          this.render(true);
        });
      } else {
        // Call render immediately if document already loaded
        this.render(true);
      }
    }

    if (onResize) {
      window.addEventListener('resize', this.throttledEvent, false);
    }

    if (onScroll) {
      window.addEventListener('scroll', this.throttledEvent, false);
    }
  }

  public init(): void {
    this.initialised = true;
    this.addEventListeners();

    Animate.doCallback(this.options.callbackOnInit);
  }

  public kill(): void {
    if (!this.initialised) {
      return;
    }

    this.removeEventListeners();
    this.options = null;
    this.initialised = false;
  }

  public render(onLoad?: boolean): void {
    if (!this.initialised) {
      return;
    }

    if (
      this.options.disableFilter &&
      typeof this.options.disableFilter === 'function'
    ) {
      const test = this.options.disableFilter();
      // ...and it passes, kill render
      if (test === true) {
        return;
      }
    }

    this.elements.forEach((el): void => {
      if (this.isInView(el)) {
        this.addAnimation(el);
      } else if (Animate.hasAnimated(el)) {
        const reverseOverride = el.getAttribute('data-animation-reverse');

        if (reverseOverride !== 'false' && this.options.reverse) {
          this.removeAnimation(el);
        }
      } else if (onLoad) {
        const animateScrolled = el.getAttribute('data-animation-scrolled');

        // If this render has been triggered on load and the element is above our current
        // scroll position and the `scrolled` option is set, animate it.
        if (
          (this.options.scrolled || animateScrolled) &&
          this.isAboveScrollPos(el)
        ) {
          this.addAnimation(el);
        }
      }
    });
  }
}

export default Animate;
