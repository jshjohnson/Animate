describe('Animate', function () {

    /**
     * Bind polyfill for PhantomJS
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
     */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1);
            var fToBind = this;
            var fNOP = function () {};
            var fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    describe('Should initialize Animate', function () {
        beforeEach(function () {
            this.animate = new Animate();
        });
        it('document should include the Animate module', function () {
            expect(!!this.animate).toBe(true);
        });
        it("should have options object", function() {
            expect(this.animate.options).toBeDefined();
        });
        it("calls the init() function", function() {
            spyOn(this.animate, "init");
            this.animate.init();
            expect(this.animate.init).toHaveBeenCalled();
        });
        it('should expose public functions', function () {
            expect(this.animate.init).toEqual(jasmine.any(Function));
            expect(this.animate.kill).toEqual(jasmine.any(Function));
            expect(this.animate.render).toEqual(jasmine.any(Function));
            expect(this.animate.getAnimatedElements).toEqual(jasmine.any(Function));
        });
    });
});
