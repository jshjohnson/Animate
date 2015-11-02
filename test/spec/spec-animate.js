describe('Animate', function () {
    describe('Should initialize plugin', function () {
        it('Should export the Animate module', function () {
            expect(Animate).toBeDefined();
        });
        it("calls the init() function", function() {
            var animateTest = new Animate();
            expect(animateTest.options).toBeDefined();
        });
    });
});
