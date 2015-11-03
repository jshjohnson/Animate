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

    describe('Should initialize plugin', function () {
        beforeEach(function () {
            animateTest = new Animate();
        });
        it('Document should include the Animate module', function () {
            expect(!!animateTest).toBe(true);
        });
        it("has options object", function() {
            expect(animateTest.options).toBeDefined();
        });
        it("calls the init() function", function() {
            spyOn(animateTest, "init");
            animateTest.init();
            expect(animateTest.init).toHaveBeenCalled();
        });
    });
});
