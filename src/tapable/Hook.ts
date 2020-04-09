import { HookArguments, Tap, AnyFn, TapType, CallType, Callback } from './interface';

class Hook {
    _args: HookArguments;
    taps: Tap[];
    constructor(_args: HookArguments) {
        if (!Array.isArray(_args)) _args = [];
        this._args = _args;
        this.taps = [];
        // this.interceptors = [];
    }
    tap(tapName: string, fn: AnyFn) {
        this._tap('sync', tapName, fn);
    }
    tapAsync(tapName: string, fn: AnyFn) {
        this._tap('async', tapName, fn);
    }
    tapPromise(tapName: string, fn: AnyFn) {
        this._tap('promise', tapName, fn);
    }
    _tap(type: TapType, tapName: string, fn: AnyFn) {
        this.taps.push({
            type,
            name: tapName,
            fn
        });
    }
    call(...args: any[]) {
        this._call('sync', args);
    }
    callAsync(...args: any[]) {
        let cb;
        if (args.length) {
            cb = args.pop();
        }
        if (!cb) throw new Error('You must provide a callback for callAsync');
        this._call('async', args, cb);
    }
    promise(...args: any[]) {
        return new Promise(resolve => {
            let cb = resolve;
            this._call('async', args, cb);
        });
    }
    _call(type: CallType, args: unknown[], cb?: AnyFn) {
        args.length = this._args.length;

        this.taps.forEach(tap => {
            const { fn } = tap;
            fn(...args);
        });
        switch (type) {
            case 'async': {
                cb();
            }
        }
    }
}
export { Hook as SyncHook };

export default Hook;
