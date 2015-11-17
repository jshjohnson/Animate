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

    var optionsTest = {
        animatedClass: jasmine.any(String),
        offset: jasmine.any(Number),
        delay: jasmine.any(Number), 
        target: jasmine.any(String),
        removeAnimations: jasmine.any(Boolean),
        reverse: jasmine.any(Boolean),
        debug: jasmine.any(Boolean),
        onLoad: jasmine.any(Boolean),
        onScroll: jasmine.any(Boolean),
        onResize: jasmine.any(Boolean),
        callback: jasmine.any(Function)
    };

    describe('should initialize Animate', function() {
        beforeEach(function() {
            this.animate = new Animate();
        });
        afterEach(function() {
            this.animate.kill();
        });
        it('document should include the Animate module', function () {
            expect(!!this.animate).toBe(true);
        });
        it("should have options object", function() {
            expect(this.animate.options).toBeDefined();
        });
        it("options object should be correct data types", function(){
            expect(this.animate.options).toEqual(optionsTest);
        });
        it("calls the init() function", function() {
            spyOn(this.animate, "init");
            this.animate.init();
            expect(this.animate.init).toHaveBeenCalled();
        });
        it('should be initialised', function() {
            this.animate.init();
            expect(this.animate.initialised).toEqual(true);
        });
        it("shoud fire scroll event listener if set", function() {
            spyOn(window, 'addEventListener');
            this.animate.init();
            if(this.animate.options.onScroll === true) {
                expect(window.addEventListener).toHaveBeenCalledWith('scroll', jasmine.any(Function), false);
            }
        });
        it("shoud fire resize event listener if set", function() {
            spyOn(window, 'addEventListener');
            this.animate.init();
            if(this.animate.options.onResize === true) {
                expect(window.addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function), false);
            }
        });
        it("shoud fire DOMContentLoaded event listener if set", function() {
            spyOn(document, 'addEventListener');
            this.animate.init();
            if(this.animate.options.onLoad === true) {
                expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', jasmine.any(Function));
            }
        });
        it('should expose public functions', function() {
            expect(this.animate.init).toEqual(jasmine.any(Function));
            expect(this.animate.kill).toEqual(jasmine.any(Function));
            expect(this.animate.render).toEqual(jasmine.any(Function));
        });
    });

    describe('should have private methods that return correct data types', function() {
        var el = document.createElement('div');

        beforeEach(function() {
            this.animate = new Animate();
        });

        afterEach(function() {
            this.animate.kill();
        });
        it('_debounce() should return an function', function(){
            var test = this.animate._debounce();
            expect(test).toEqual(jasmine.any(Function));
        });
        it('_extend() should return an object', function(){
            var test = this.animate._extend();
            expect(test).toEqual(jasmine.any(Object));
        });
        it('_getElemDistance() should return an number', function(){
            var test = this.animate._getElemDistance(el);
            expect(test).toEqual(jasmine.any(Number));
        });
        it('_getElemOffset() should return an number', function(){
            var test = this.animate._getElemOffset(el);
            expect(test).toEqual(jasmine.any(Number));
        });
        it('_getScrollPosition() should return an number', function(){
            var test = this.animate._getScrollPosition();
            expect(test).toEqual(jasmine.any(Number));
        });
        it('_isInView() should return an boolean', function(){
            var test = this.animate._isInView(el);
            expect(test).toEqual(jasmine.any(Boolean));
        });
        it('_isVisible() should return an boolean', function(){
            var test = this.animate._isVisible(el);
            expect(test).toEqual(jasmine.any(Boolean));
        });
        it('_hasAnimated() should return an boolean', function(){
            var test = this.animate._hasAnimated(el);
            expect(test).toEqual(jasmine.any(Boolean));
        });
        it('_isType() should return an boolean', function(){
            var test = this.animate._isType();
            expect(test).toEqual(jasmine.any(Boolean));
        });
    });

    describe('should kill Animate', function() {
        beforeEach(function() {
            this.animate = new Animate();
            this.animate.init();
            this.animate.kill();
        });
        it('should be uninitialised', function() {
            expect(this.animate.initialised).toEqual(false);
        });
        it('should null settings when killed', function() {
            expect(this.animate.options).toBeNull();
        });
    });
});
