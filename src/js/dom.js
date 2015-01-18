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

    //IE8quirks/IE7 compatible version
    function legacyGetElementsByClassName(node, classname) {
        var a = [],
            re = new RegExp('(^| )' + classname + '( |$)'),
            els = node.getElementsByTagName('*'),
            i, j;

        for (i = 0, j = els.length; i < j; i++) {
            if (re.test(els[i].className)) {
                a.push(els[i]);
            }
        }
        return a;
    }

    /**
     * DOM manipulation helpers
     *
     * @class PPG.dom
     * @singleton
     * @private
     */
    root.PPG.dom = {
        /**
         * @method hasClass
         * @param {HTMLElement} el
         * @param {String} className
         * @return {Boolean}
         */
        hasClass: hasClass,

        /**
         * @param {HTMLElement} el
         * @param {String} className
         */
        addClass: function (el, className) {
            if (false === hasClass(el, className)) {
                el.className += ' ' + className;
            }
        },

        /**
         * @param {HTMLElement} el
         * @param {String} property
         * @returns {String}
         */
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

        /**
         * @param {HTMLElement} el
         * @param {String} className
         * @returns {HTMLElement}
         */
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

        /**
         * @param {HTMLElement} el
         * @param {String} className
         * @returns {HTMLElement}
         */
        getContainer: function (el, className) {
            var container = this.getChildByClass(el, className);

            if (null === container) {
                container = document.createElement('div');
                container.className = className;
                el.appendChild(container);
            }

            return container;
        },

        /**
         * @param {HTMLElement} el
         * @returns {HTMLElement}
         */
        removeChildren: function (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }

            return el;
        },

        /**
         * @param {String} className
         * @return {Array}
         */
        getElementsByClass: function (className) {
            if ('undefined' === typeof (document.querySelectorAll)) {
                return legacyGetElementsByClassName(document.body, className);
            }

            return document.querySelectorAll('.' + className);
        }
    };
})(this);
