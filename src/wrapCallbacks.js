import _ from 'lodash';
import invariant from 'invariant';
import {proxyDispatch, proxyGetState} from "./proxy";

export default function (app, callbacks, prefix) {
    const initializedCallbacks = {};

    return !callbacks ? undefined : function() {
        const prefixCacheKey = JSON.stringify(prefix);

        if (!initializedCallbacks[prefixCacheKey]) {
            initializedCallbacks[prefixCacheKey] = {};

            invariant(
                _.isPlainObject(callbacks),
                'dva->$connect: callbacks should be plain object'
            );

            Object.keys(callbacks).map((key) => {

                invariant(
                    typeof callbacks[key] === 'function',
                    'dva->$connect: callbacks\'s each item should be function, but found ' + key
                );

                initializedCallbacks[prefixCacheKey][key] = function(...args) {
                    callbacks[key].call(null, {
                        getState: proxyGetState(app._store.getState, prefix),
                        dispatch: proxyDispatch(app._store.dispatch, key, prefix)
                    }, ...args);
                }
            });
        }
        return initializedCallbacks[prefixCacheKey];
    };
}