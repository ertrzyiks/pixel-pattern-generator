(function (root) {
    'use strict';

    var PPG = root.PPG,
        dom = PPG.dom;

    /**
     * Internal function which parse box shadow into collection of pixel data
     *
     * @class
     * @constructor
     * @param {HTMLElement} el pixel element
     * @ignore
     */
    function PixelsParser(el) {
        this.el = el;
    }

    /**
     * Loop through all defined box shadows, gather coordinates with color and normalize computed units
     *
     * @method process
     * @return {Array} collection of pixel data
     */
    PixelsParser.prototype.process = function () {
        var boxShadow = dom.getComputedStyle(this.el, 'box-shadow'),
            boxShadowItems,
            fontSize = this.getComputedFontSize_(),
            pixels = [],
            pixel,
            i;

        boxShadow = this.corruptRgbColors_(boxShadow);

        boxShadowItems = (boxShadow || '').split(',');

        for (i = 0; i < boxShadowItems.length; i++) {
            pixel = this.processComponent_(boxShadowItems[i]);

            pixel.x = this.toEm_(pixel.x, fontSize);
            pixel.y = this.toEm_(pixel.y, fontSize);
            pixel.col = this.repairRgbColors_(pixel.col);

            pixels.push(pixel);
        }

        return pixels;
    };

    /**
     * Retrieve coords and color from one of three forms of input:
     *
     * 1em 1em #000000 (plain)
     * 1em 1em 0 0 #000000  (theoretical, never got it during browsers test)
     * rgb(0, 0, 0) 1em 1em 0 0 (parser and computed)
     *
     * @param {String} component
     * @return {Object} data of single pixel
     * @private
     */
    PixelsParser.prototype.processComponent_ = function (component) {
        var pixel = {},
            componentParts = PPG.util.filter(component.split(' '), function (v) {
                return v;
            });

        if (component.indexOf('rgb') === -1) {
            pixel.x = componentParts[0];
            pixel.y = componentParts[1];
            pixel.col = componentParts.pop();
        } else {
            pixel.x = componentParts[1];
            pixel.y = componentParts[2];
            pixel.col = componentParts[0];
        }

        return pixel;
    };

    /**
     * Convert pixels into em's using computed font-size
     *
     * @param {String} value
     * @param {Number} fontSize
     * @return {String}
     * @private
     */
    PixelsParser.prototype.toEm_ = function (value, fontSize) {
        if (value.indexOf('px') !== -1) {
            return (parseInt(value, 10) / fontSize) + 'em';
        }

        return value;
    };

    /**
     * Retrieve and parse as number computed font size of pixel element
     *
     * @return {Number}
     * @private
     */
    PixelsParser.prototype.getComputedFontSize_ = function () {
        var fontSizeValue = dom.getComputedStyle(this.el, 'font-size'),
            fontSize = parseInt(fontSizeValue, 10);

        return fontSize;
    };

    /**
     * Corrupt rgb format to avoid whitespace and comma chars. Thanks to that, we can split by them safely.
     *
     * @param {String} string
     * @return {String}
     * @private
     */
    PixelsParser.prototype.corruptRgbColors_ = function (string) {
        return string.replace(/rgb\([^\([^\)]+\)/g, function (match) {
            return match.replace(/,/g, ';').replace(/\s/g, '');
        });
    };

    /**
     * Revert changes done to rgb formatted colo done by corruptRgbColors_
     *
     * @param {String} string
     * @return {String}
     * @private
     */
    PixelsParser.prototype.repairRgbColors_ = function (string) {
        return string.replace(/;/g, ',');
    };

    /**
     * This class is not intended to be used directly. Object of this class may be returned by public methods.
     *
     * Elements handled by this fallback will be filled with HTML elements
     * to mimic pixel pattern generated by box-shadow.
     *
     * Intended for IE<9
     *
     * @class
     * @constructor
     * @param {HTMLElement} element Html element of pixel figure
     */
    function Fallback(element) {
        this.el = element;
        this.pixel = PPG.dom.getChildByClass(this.el, 'pixel-pattern-pixel');

        PPG.dom.addClass(this.el, 'pixel-pattern-fallback');
    }

    /**
     * Creates or recreates html structure, which mimic box shadow pixels.
     *
     * @method update
     */
    Fallback.prototype.update = function () {
        var parser = new PixelsParser(this.pixel),
            pixels = parser.process(),
            pixelsNum = pixels.length,
            pixelEl,
            container = dom.getContainer(this.el, 'pixel-pattern-fallback-container'),
            i;

        container = dom.removeChildren(container);
        container.style.position = 'relative';

        for (i = 0; i < pixelsNum; i++) {
            pixelEl = this.createPixel_(pixels[i]);
            container.appendChild(pixelEl);
        }
    };

    /**
     * Build html replacement by pixel details
     *
     * @method createPixel_
     * @param {Object} pixelData object with x,y coords and color of pixel
     * @private
     * @ignore
     */
    Fallback.prototype.createPixel_ = function (pixelData) {
        var el = this.createPixelElement_();

        el.style.backgroundColor = pixelData.col;
        el.style.left = pixelData.x;
        el.style.top = pixelData.y;

        return el;
    };

    /**
     * Create and apply preset styles of html element for pixel
     *
     * @method createPixelElement_
     * @return {HTMLElement}
     * @private
     * @ignore
     */
    Fallback.prototype.createPixelElement_ = function () {
        var el = document.createElement('div');
        el.className = 'pixel-pattern-fallback-pixel';
        el.style.position = 'absolute';
        el.style.width = '1em';
        el.style.height = '1em';

        return el;
    };

    /**
     * @class PPG
     */
    function getOrCreateFallback(el) {
        if ('string' === typeof el) {
            el = document.getElementById(el);
        }

        if (!el) {
            throw "Invalid element to apply fallback";
        }

        if ('undefined' === typeof el._ppgFallbackObj) {
            el._ppgFallbackObj = new Fallback(el);
        }

        return el._ppgFallbackObj;
    }

    function getTargetCollection(el) {
        var elements;

        if (el) {
            elements = [el];
        } else {
            elements = dom.getElementsByClass('pixel-pattern');
        }

        return elements;
    }

    /**
     * Update fallback on all figures or single element.
     * It may be necessary to update fallback after change of class of figure or other DOM changes.
     *
     * Update will affect all elements with class `pixel-pattern`, when element is not specified.
     *
     * Note: Currently update is actually re-init, so internally init and update methods share logic.
     *
     * @param {HTMLElement|String} [el] Html node or id of element as string
     * @return {Array} Array of affected elements or null
     */
    PPG.update = function (el) {
        if (!PPG.isEnabled()) {
            return null;
        }

        var elements = getTargetCollection(el), i, fallback;

        for (i = 0; i < elements.length; i++) {
            fallback = getOrCreateFallback(elements[i]);
            fallback.update();
        }

        return elements;
    };

    /**
     * Initialize fallback on all figures or single element.
     *
     * Update will affect all elements with class `pixel-pattern`, when element is not specified.
     *
     * Note: Currently update is actually re-init, so internally init and update methods share logic.
     *
     * @param {HTMLElement|String} [el] Html node or id of element as string
     * @return {Array} Array of affected elements or null
     */
    PPG.init = function (el) {
        return PPG.update(el);
    };

    /**
     * Setup fallback manually on specific html element.
     *
     * @method setupFallback
     * @param {HTMLElement|String} el Html node or id of element as string
     * @return {Fallback}
     * @deprecated Use init/update instead
     */
    PPG.setupFallback = function (el) {
        return PPG.init(el)
            .shift()._ppgFallbackObj;
    };
})(this);
