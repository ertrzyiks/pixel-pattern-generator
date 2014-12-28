(function (root) {
    'use strict';

    function hasClass(el, className) {
        var classNames = (el.className || '').split(' '), i;

        for (i = 0; i < classNames.length; i++) {
            if (className === classNames[i]) {
                return true;
            }
        }

        return false;
    }

    function cssToCamelCase(cssString) {
        return cssString.replace(/-([a-zA-Z]{1})/g, function (match, letter) {
            return letter.toUpperCase();
        });
    }

    root.PPG.dom = {
        hasClass: hasClass,

        addClass: function (el, className) {
            if (false === hasClass(el, className)) {
                el.className += ' ' + className;
            }
        },

        getComputedStyle: function (el, property) {
            var camelCase;

            if ('function' === typeof root.getComputedStyle) {
                return root.getComputedStyle(el, null).getPropertyValue(property);
            } else if ('undefined' !== typeof el.currentStyle) {
                try {
                    return el.currentStyle.getPropertyValue(property);
                }
                catch (ex) {
                    camelCase = cssToCamelCase(property);
                    return el.currentStyle[camelCase] || el.currentStyle[property];
                }
            }

            throw new Error('Cant find value for ' + property);
        },

        getChildByClass: function (el, className) {
            var children = el.childNodes,
                n = children.length,
                child,
                i;

            for (i = 0; i < n; i++) {
                child = children[i];

                if (this.hasClass(child, className)) {
                    return child;
                }
            }

            return null;
        },

        getContainer: function (el, className) {
            var container = this.getChildByClass(el, className);

            if (null === container) {
                container = document.createElement('div');
                container.className = className;
                el.appendChild(container);
            }

            return container;
        },

        removeChildren: function (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }

            return el;
        }
    };
})(this);
