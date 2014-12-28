jasmine.getEnv().addReporter(new jasmineRequire.JSReporter2());

var customMatchers = {
    toBeColor: function (util, customEqualityTesters) {
        return {
            compare: function (actual, expected) {
                var result = {},
                    rgbActual = new RGBColor(actual),
                    rgbExpected = new RGBColor(expected);

                if (rgbActual.ok && rgbActual.ok) {
                    result.pass = rgbActual.toHex() === rgbExpected.toHex();
                } else {
                    result.pass = false;
                }

                if (!result.pass) {
                    result.message = 'Expected ' + expected + ', given ' + actual;
                }

                return result;
            }
        }
    }
};

describe('Pixel Pattern Generator Fallback', function () {
    function setupHtmlFixtures() {
        jasmine.getFixtures().set(
            '<div id="case1" class="pixel-pattern pixel-pattern-fixture">' +
                '<div id="case1-pixel" class="pixel-pattern-pixel"></div>' +
            '</div>'
        );
    }

    var isEnabledSpy;

    beforeEach(function () {
        jasmine.addMatchers(customMatchers);
        setupHtmlFixtures();
    });

    it('should be able to recognize pixel by classname', function () {
        isEnabledSpy = spyOn(PPG, 'isEnabled').and.returnValue(true);

        var el = $('#case1').get(0),
            pixel = $('#case1-pixel').get(0),
            pp = PPG.setupFallback(el);

        expect(pp.pixel).toBe(pixel);
    });

    it('should add class pixel-pattern-fallback', function () {
        isEnabledSpy = spyOn(PPG, 'isEnabled').and.returnValue(true);

        var el = $('#case1').get(0),
            pixel = $('#case1-pixel').get(0),
            pf = PPG.setupFallback(el);

        expect(el).toHaveClass('pixel-pattern-fallback');
    });

    it('should create subcontainer', function () {
        isEnabledSpy = spyOn(PPG, 'isEnabled').and.returnValue(true);

        var el = $('#case1').get(0),
            pixel = $('#case1-pixel').get(0),
            pf = PPG.setupFallback(el);

        expect(el).toHaveClass('pixel-pattern-fallback');

        expect($('#case1 .pixel-pattern-fallback-container')).toHaveLength(1);
        expect($('#case1 .pixel-pattern-fallback-container')).toHaveCss({
            position: 'relative'
        });

        pf.update();
        expect($('#case1 .pixel-pattern-fallback-container')).toHaveLength(1);
        expect($('#case1 .pixel-pattern-fallback-container')).toHaveCss({
            position: 'relative'
        });
    });

    it('should pixel divs', function () {
        isEnabledSpy = spyOn(PPG, 'isEnabled').and.returnValue(true);

        var el = $('#case1').get(0),
            pixel = $('#case1-pixel').get(0),
            pf = PPG.setupFallback(el),
            collection, item, $item, expectedShape, i;

        collection = $('#case1 .pixel-pattern-fallback-pixel');


        expectedShape = [
            { x: '1em', y: '0em', c: '#0000ff'},
            { x: '1em', y: '1em', c: '#008000'},
            { x: '0em', y: '1em', c: '#ff0000'}
        ];

        expect(collection).toHaveLength(expectedShape.length);

        for (i=0; i < expectedShape.length; i++) {
            item = collection.get(i);
            $item = $(item);

            expect($item.css('position')).toBe('absolute');
            expect($item.css('backgroundColor')).toBeColor(expectedShape[i].c);
            expect(item.style.left).toBe(expectedShape[i].x);
            expect(item.style.top).toBe(expectedShape[i].y);
        }
    });

    it('should acceppt', function () {
        isEnabledSpy = spyOn(PPG, 'isEnabled').and.returnValue(true);

        var el = $('#case1').get(0),
            pixel = $('#case1-pixel').get(0),
            pf = PPG.setupFallback(el);

        expect(el).toHaveClass('pixel-pattern-fallback');

        expect($('#case1 .pixel-pattern-fallback-container')).toHaveLength(1);
        expect($('#case1 .pixel-pattern-fallback-container')).toHaveCss({
            position: 'relative'
        });

        pf.update();
        expect($('#case1 .pixel-pattern-fallback-container')).toHaveLength(1);
        expect($('#case1 .pixel-pattern-fallback-container')).toHaveCss({
            position: 'relative'
        });
    });

    it('should accept string with id', function () {
        isEnabledSpy = spyOn(PPG, 'isEnabled').and.returnValue(true);

        var el = $('#case1').get(0),
            pixel = $('#case1-pixel').get(0),
            pp = PPG.setupFallback('case1');

        expect(pp.pixel).toBe(pixel);
    });

    afterEach(function () {
        if (isEnabledSpy) {
            isEnabledSpy.and.callThrough();
            isEnabledSpy = null;
        }
    });
});

