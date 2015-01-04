(function (root) {
    'use strict';

    var PPG = root.PPG;

    /**
     * Utilities
     *
     * @class PPG.util
     * @singleton
     * @private
     */
    PPG.util = {
        /**
         * Filter out all array items, for which fn return falsy value.
         * Use Array.prototype.filter when available.
         *
         * @param {Array} input
         * @param {Function} fn
         * @returns {Array}
         */
        filter: function (input, fn) {
            if ('function' === typeof input.filter) {
                return input.filter(fn);
            }

            var result = [],
                inputLength = input.length,
                i;

            for (i = 0; i < inputLength; i++) {
                if (fn(input[i])) {
                    result.push(input[i]);
                }
            }

            return result;
        }
    };
})(this);
