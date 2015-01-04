(function (root) {
    'use strict';

    var PPG = root.PPG,
        dom = PPG.dom;

    /**
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
     * Creates or recreates html structure, which mirror box shadow pixels.
     *
     * @method update
     */
    Fallback.prototype.update = function () {
        var pixels = this.getPixelsFrom_(this.pixel),
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

    Fallback.prototype.createPixel_ = function (pixelData) {
        var el = this.createPixelElement_();

        el.style.backgroundColor = pixelData.col;
        el.style.left = pixelData.x;
        el.style.top = pixelData.y;

        return el;
    };

    Fallback.prototype.createPixelElement_ = function () {
        var el = document.createElement('div');
        el.className = 'pixel-pattern-fallback-pixel';
        el.style.position = 'absolute';
        el.style.width = '1em';
        el.style.height = '1em';

        return el;
    };

    Fallback.prototype.getPixelsFrom_ = function (el) {
        var boxShadow = dom.getComputedStyle(el, 'box-shadow'),
            fontSizeValue = dom.getComputedStyle(el, 'font-size'),
            fontSize = parseInt(fontSizeValue, 10),
            pixels = [],
            boxShadowItems,
            boxShadowItem,
            boxShadowItemParts,
            pixel,
            i;

        boxShadow = this.tweakRgbColors_(boxShadow);

        boxShadowItems = (boxShadow || '').split(',');

        for (i = 0; i < boxShadowItems.length; i++) {
            boxShadowItem = boxShadowItems[i];
            boxShadowItemParts = PPG.util.filter(boxShadowItem.split(' '), function (v) {
                return v;
            });

            pixel = {};

            if (boxShadowItem.indexOf('rgb') === -1) {
                pixel.x = boxShadowItemParts[0];
                pixel.y = boxShadowItemParts[1];
                pixel.col = boxShadowItemParts.pop();
            } else {
                pixel.x = boxShadowItemParts[1];
                pixel.y = boxShadowItemParts[2];
                pixel.col = boxShadowItemParts[0];
            }

            if (pixel.x.indexOf('px') !== -1) {
                pixel.x = (parseInt(pixel.x, 10) / fontSize) + 'em';
            }
            if (pixel.y.indexOf('px') !== -1) {
                pixel.y = (parseInt(pixel.y, 10) / fontSize) + 'em';
            }

            pixel.col = pixel.col.replace(/;/g, ',');
            pixels.push(pixel);
        }

        return pixels;
    };

    Fallback.prototype.tweakRgbColors_ = function (string) {
        return string.replace(/rgb\([^\([^\)]+\)/g, function (match) {
            return match.replace(/,/g, ';').replace(/\s/g, '');
        });
    };

    /**
     * @class PPG
     */
    /**
     * Setup fallback manually on specific html element.
     *
     * @method setupFallback
     * @param {HTMLElement|String} el Html node or id of element as string
     * @return {Fallback}
     */
    PPG.setupFallback = function (el) {
        if (!PPG.isEnabled()) {
            return null;
        }

        if ('string' === typeof el) {
            el = document.getElementById(el);
        }

        var fallback = new Fallback(el);
        fallback.update();

        return fallback;
    };
})(this);
