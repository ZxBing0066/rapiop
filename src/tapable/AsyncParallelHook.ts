import Hook from './Hook';
import { AnyFn, CallType } from './interface';

class AsyncParallelHook extends Hook {
    _call(type: CallType, args: unknown[], cb?: AnyFn) {
        args.length = this._args.length;

        switch (type) {
            case 'sync': {
                this.taps.forEach(tap => {
                    const { fn } = tap;
                    fn(...args);
                });
            }
            case 'promise': {
                const jobs = this.taps.map(tap => {
                    const { fn, type } = tap;
                    switch (type) {
                        case 'async': {
                            return new Promise(resolve => {
                                fn(...args, resolve);
                            });
                        }
                        case 'promise': {
                            return fn(...args);
                        }
                        default: {
                            fn(...args);
                            return Promise.resolve();
                        }
                    }
                });
                Promise.all(jobs).then(cb);
            }
            case 'async': {
                const jobs = this.taps.map(tap => {
                    const { fn, type } = tap;
                    switch (type) {
                        case 'async': {
                            return new Promise((resolve, reject) => {
                                fn(...args, (err: Error, result: Result) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            });
                        }
                        case 'promise': {
                            return fn(...args);
                        }
                        default: {
                            fn(...args);
                            return Promise.resolve();
                        }
                    }
                });
                Promise.all(jobs)
                    .then(() => cb())
                    .catch(e => cb(e));
            }
        }
    }
}
export { AsyncParallelHook };

export default AsyncParallelHook;
