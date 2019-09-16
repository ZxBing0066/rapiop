import { SyncHook, SyncWaterfallHook, AsyncParallelHook } from 'tapable';

// 提供的钩子
export default class Hooks {
    // instance
    amendInstance = new SyncWaterfallHook(['instance', 'amendInstance']);
    // 配置加载完成
    afterGetConfig = new SyncHook(['config']);
    // 初始化完成
    afterInit = new SyncHook();
    // mountDOM 注入
    mountDOM = new SyncHook(['setMountDOM']);
    // mountDOM 提供后
    afterMountDOM = new SyncHook(['mountDOM']);
    // 项目注册后
    afterRegister = new SyncHook(['project']);
    /**
     * 项目挂载前
     * 可通过调用 project.callOrigin 拦截默认行为，传入 true 触发默认行为，传入 false 拦截默认行为
     */
    beforeMount = new AsyncParallelHook(['project']);
    // 项目挂载后
    afterMount = new SyncHook(['project']);
    /**
     * 项目卸载前
     * 可通过调用 project.callOrigin 拦截默认行为，传入 true 触发默认行为，传入 false 拦截默认行为
     */
    beforeUnmount = new AsyncParallelHook(['project']);
    // 项目卸载后
    afterUnmount = new SyncHook(['project']);
    // 更新
    refresh = new SyncHook();
    // 报错
    error = new SyncHook(['error']);
}
