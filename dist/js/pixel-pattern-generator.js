(function(root) {
    "use strict";
    root.PPG = root.PPG || {};
})(this);

(function(root) {
    "use strict";
    var PPG = root.PPG;
    PPG.util = {
        filter: function(input, fn) {
            if ("function" === typeof input.filter) {
                return input.filter(fn);
            }
            var result = [], inputLength = input.length, i;
            for (i = 0; i < inputLength; i++) {
                if (fn(input[i])) {
                    result.push(input[i]);
                }
            }
            return result;
        }
    };
})(this);

(function(root) {
    "use strict";
    var cssomPrefixes = "Webkit Moz O ms".split(" "), testProps = function(props, mStyle) {
        var i, p;
        for (i in props) {
            p = props[i];
            if ("undefined" !== typeof mStyle[p]) {
                return true;
            }
        }
        return false;
    }, hasSupportFor = function(prop) {
        var modElem = document.createElement("modernizr"), mStyle = modElem.style, ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), props = (prop + " " + cssomPrefixes.join(ucProp + " ") + ucProp).split(" ");
        return testProps(props, mStyle);
    }, hasBoxShadow = hasSupportFor("boxShadow");
    root.PPG.isEnabled = function() {
        return !hasBoxShadow;
    };
})(this);

(function(root) {
    "use strict";
    function hasClass(el, className) {
        var classNames = (el.className || "").split(" "), i;
        for (i = 0; i < classNames.length; i++) {
            if (className === classNames[i]) {
                return true;
            }
        }
        return false;
    }
    function cssToCamelCase(cssString) {
        return cssString.replace(/-([a-zA-Z]{1})/g, function(match, letter) {
            return letter.toUpperCase();
        });
    }
    root.PPG.dom = {
        hasClass: hasClass,
        addClass: function(el, className) {
            if (false === hasClass(el, className)) {
                el.className += " " + className;
            }
        },
        getComputedStyle: function(el, property) {
            var camelCase;
            if ("function" === typeof root.getComputedStyle) {
                return root.getComputedStyle(el, null).getPropertyValue(property);
            } else if ("undefined" !== typeof el.currentStyle) {
                try {
                    return el.currentStyle.getPropertyValue(property);
                } catch (ex) {
                    camelCase = cssToCamelCase(property);
                    return el.currentStyle[camelCase] || el.currentStyle[property];
                }
            }
            throw new Error("Cant find value for " + property);
        },
        getChildByClass: function(el, className) {
            var children = el.childNodes, n = children.length, child, i;
            for (i = 0; i < n; i++) {
                child = children[i];
                if (this.hasClass(child, className)) {
                    return child;
                }
            }
            return null;
        },
        getContainer: function(el, className) {
            var container = this.getChildByClass(el, className);
            if (null === container) {
                container = document.createElement("div");
                container.className = className;
                el.appendChild(container);
            }
            return container;
        },
        removeChildren: function(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            return el;
        }
    };
})(this);

(function(root) {
    "use strict";
    var PPG = root.PPG, dom = PPG.dom;
    function Fallback(element) {
        this.el = element;
        this.pixel = PPG.dom.getChildByClass(this.el, "pixel-pattern-pixel");
        PPG.dom.addClass(this.el, "pixel-pattern-fallback");
    }
    Fallback.prototype.update = function() {
        var pixels = this.getPixelsFrom_(this.pixel), pixelsNum = pixels.length, pixelEl, container = dom.getContainer(this.el, "pixel-pattern-fallback-container"), i;
        container = dom.removeChildren(container);
        container.style.position = "relative";
        for (i = 0; i < pixelsNum; i++) {
            pixelEl = this.createPixel_(pixels[i]);
            container.appendChild(pixelEl);
        }
    };
    Fallback.prototype.createPixel_ = function(pixelData) {
        var el = this.createPixelElement_();
        el.style.backgroundColor = pixelData.col;
        el.style.left = pixelData.x;
        el.style.top = pixelData.y;
        return el;
    };
    Fallback.prototype.createPixelElement_ = function() {
        var el = document.createElement("div");
        el.className = "pixel-pattern-fallback-pixel";
        el.style.position = "absolute";
        el.style.width = "1em";
        el.style.height = "1em";
        return el;
    };
    Fallback.prototype.getPixelsFrom_ = function(el) {
        var boxShadow = dom.getComputedStyle(el, "box-shadow"), fontSizeValue = dom.getComputedStyle(el, "font-size"), fontSize = parseInt(fontSizeValue, 10), pixels = [], boxShadowItems, boxShadowItem, boxShadowItemParts, pixel, i;
        boxShadow = this.tweakRgbColors_(boxShadow);
        boxShadowItems = (boxShadow || "").split(",");
        for (i = 0; i < boxShadowItems.length; i++) {
            boxShadowItem = boxShadowItems[i];
            boxShadowItemParts = PPG.util.filter(boxShadowItem.split(" "), function(v) {
                return v;
            });
            pixel = {};
            if (boxShadowItem.indexOf("rgb") === -1) {
                pixel.x = boxShadowItemParts[0];
                pixel.y = boxShadowItemParts[1];
                pixel.col = boxShadowItemParts.pop();
            } else {
                pixel.x = boxShadowItemParts[1];
                pixel.y = boxShadowItemParts[2];
                pixel.col = boxShadowItemParts[0];
            }
            if (pixel.x.indexOf("px") !== -1) {
                pixel.x = parseInt(pixel.x, 10) / fontSize + "em";
            }
            if (pixel.y.indexOf("px") !== -1) {
                pixel.y = parseInt(pixel.y, 10) / fontSize + "em";
            }
            pixel.col = pixel.col.replace(/;/g, ",");
            pixels.push(pixel);
        }
        return pixels;
    };
    Fallback.prototype.tweakRgbColors_ = function(string) {
        return string.replace(/rgb\([^\([^\)]+\)/g, function(match) {
            return match.replace(/,/g, ";").replace(/\s/g, "");
        });
    };
    PPG.setupFallback = function(el) {
        if (!PPG.isEnabled()) {
            return null;
        }
        if ("string" === typeof el) {
            el = document.getElementById(el);
        }
        var fallback = new Fallback(el);
        fallback.update();
        return fallback;
    };
})(this);