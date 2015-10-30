describe('Animate', function () {
    describe('Should initialize plugin', function () {
        it('Should export the Animate module', function () {
            expect(Animate).toBeDefined();
        });
        it('Should have init() method', function() {
            expect(new Animate()).toBeDefined();
        });
    });
});
