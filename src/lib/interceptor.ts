export const createInterceptor = () => {
    let intercepted = false;
    let failed: boolean | Error = false;
    // 调用后拦截默认行为
    const intercept = () => (intercepted = true);
    // 调用后认定操作失败
    const fail = (e: Error) => (failed = e || true);
    return {
        intercept,
        fail,
        getIntercepted: () => intercepted,
        getFailed: () => failed
    };
};
