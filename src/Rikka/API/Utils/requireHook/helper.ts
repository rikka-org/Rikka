/**
 * Created by Ralph Varjabedian on 11/11/14.
 * require-hook is licensed under the [MIT]
 * do not remove this notice.
 */
'use strict';

export = {
    copyProperties: function (src: Object, dst: Object) {
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                // @ts-ignore
                dst[prop] = src[prop];
            }
        }
    }
};