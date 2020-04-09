import Hook from './Hook';
import { AnyFn } from './interface';

class SyncHook extends Hook {
    tapAsync(tapName: string, fn: AnyFn) {
        throw new Error('tapPromise is not supported on a SyncHook');
    }
    tapPromise(tapName: string, fn: AnyFn) {
        throw new Error('tapPromise is not supported on a SyncHook');
    }
}
export { SyncHook };

export default SyncHook;
