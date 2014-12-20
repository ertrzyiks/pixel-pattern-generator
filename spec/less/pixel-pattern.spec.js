describe('Pixel Pattern Generator', function () {
    describe('pixel-pattern-set-pixel', function () {
        it('should render 0,0 pixel background color', function (done) {
            renderLessWithLibrary('.mypixel{ .pixel-pattern-set-pixel(0, 0, #ff0000); }', function (err, css) {
                expect(err).toBe(null);
                expect(css).toContain('background-color: #ff0000;');
                done();
            });
        });

        it('should render other pixels as shadow', function (done) {
            renderLessWithLibrary('.mypixel{ .pixel-pattern-set-pixel(1, 0, #ff0000); }', function (err, css) {
                expect(err).toBe(null);
                expect(css).toContain('0em 1em #ff0000');
                done();
            });
        });
    });

    describe('pixel-pattern', function () {
        it('should render all pixels', function (done) {
            renderLessWithLibrary('.mypixel{ .pixel-pattern(1 0 #ff0000, 0 1 #00ff00); }', function (err, css) {
                expect(err).toBe(null);
                expect(css).toContain('0em 1em #ff0000, 1em 0em #00ff00;');
                done();
            });
        });

        it('should force container width to contain all pixels', function (done) {
            renderLessWithLibrary('.mypixel{ .pixel-pattern(0 10 #ff0000, 15 0 #00ff00); }', function (err, css) {
                expect(err).toBe(null);
                expect(css).toContain('width: 11em;');
                expect(css).toContain('height: 16em;');
                done();
            });
        });
    });

    describe('pixel-pattern-size', function () {
        it('should set font size in pixels', function (done) {
            renderLessWithLibrary('.mypixel{ .pixel-pattern-size(25px); }', function (err, css) {
                expect(err).toBe(null);
                expect(css).toContain('font-size: 25px;')
                done();
            });
        });

        it('should set font size in ems', function (done) {
            renderLessWithLibrary('.mypixel{ .pixel-pattern-size(2em); }', function (err, css) {
                expect(err).toBe(null);
                expect(css).toContain('font-size: 2em;');
                done();
            });
        });
    });
});
