type AnyFn = (...args: any) => any;
type HookArguments = string[];
type TapType = 'sync' | 'async' | 'promise';
type CallType = 'sync' | 'async' | 'promise';
type Result = unknown;
type Callback = (err: Error, result: Result) => void;

interface Hook {
    tap: (name: string | Tap, fn: (...args: any[]) => Result) => void;
    tapAsync: (name: string | Tap, fn: (...args: (any | Callback)[]) => void) => void;
    tapPromise: (name: string | Tap, fn: (...args: any[]) => Promise<Result>) => void;
    // intercept: (interceptor: HookInterceptor) => void;
    isUsed: () => boolean;
    call: (...args: unknown[]) => Result;
    promise: (...args: unknown[]) => Promise<Result>;
    callAsync: (...args: (unknown | Callback)[]) => void;
}
// interface HookInterceptor {
//     call: (context?, ...args) => void;
//     loop: (context?, ...args) => void;
//     tap: (context?, tap: Tap) => void;
//     register: (tap: Tap) => Tap;
//     context: boolean;
// }

// interface HookMap {
//     for: (key: any) => Hook;
//     intercept: (interceptor: HookMapInterceptor) => void;
//     get: (key: any) => Hook | undefined;
//     for: (key: any) => Hook;
// }

// interface HookMapInterceptor {
//     factory: (key: any, hook: Hook) => Hook;
// }

interface Tap {
    name: string;
    type: TapType;
    fn: Function;
    stage?: number;
    context?: boolean;
    before?: string | string[];
}

export { AnyFn, HookArguments, TapType, CallType, Result, Callback, Hook, Tap };
