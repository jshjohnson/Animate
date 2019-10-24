/**
 * Determines when an animation has completed
 * @return {String} Appropriate 'animationEnd' event for browser to handle
 */
export default function getBrowserAnimationPrefix(): string | void {
  const el = document.createElement('temp');

  const browserPrefixes = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
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
