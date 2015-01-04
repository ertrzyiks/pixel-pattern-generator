(function (root) {
    'use strict';

    /**
     * based on Modernizr
     * https://github.com/Modernizr/Modernizr
     */
    var cssomPrefixes = 'Webkit Moz O ms'.split(' '),
        testProps = function (props, mStyle) {
            var i, p;
            /* jshint forin:false */
            for (i in props) {
                p = props[i];

                if ('undefined' !== typeof mStyle[p]) {
                    return true;
                }
            }
            return false;
        },
        hasSupportFor = function (prop) {
            var modElem = document.createElement('modernizr'),
                mStyle = modElem.style,

                ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
                props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            return testProps(props, mStyle);
        },

        hasBoxShadow = hasSupportFor('boxShadow');

    /**
     * @class PPG
     */
    /**
     * Check if fallback is necessary.
     *
     * @method isEnabled
     * @return {Boolean} True, when box-shadow is not supported; false otherwise
     */
    root.PPG.isEnabled = function () {
        return !hasBoxShadow;
    };
})(this);
