(function (root) {
    'use strict';

    var PPG = root.PPG;

    PPG.util = {
        filter: function (input, fn) {
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
