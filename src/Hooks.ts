import SyncHook from './tapable/lib/SyncHook';
import AsyncParallelHook from './tapable/lib/AsyncParallelHook';

export type Hook = SyncHook | AsyncParallelHook;

// 提供的钩子
export default class Hooks {
    /**
     * 为返回的实例附加属性，只在实例返回前调用一次，一般 for 插件用来注入一些扩展方法
     * @param instance 当前返回的实例
     * @param amendInstance 调用为实例附加属性
     *      @argument instance 附加的属性实例
     */
    amendInstance = new SyncHook(['instance', 'amendInstance']);
    /**
     * 为返回的实例附加属性，只在实例返回前调用一次，一般 for 插件用来注入一些自定义的 hooks
     * @param hooks 当前返回的 hooks
     * @param amendHooks 调用为现有 hooks 添加自定义 hooks
     *      @argument hooks 附加的自定义 hooks
     */
    amendHooks = new SyncHook(['hooks', 'amendHooks']);
    /**
     * 给插件、库内部共享提供属性
     */
    amendInnerShared = new SyncHook(['innerShared', 'amendInnerShared']);
    /**
     * 配置加载完成调用，最早也会在 amendInstance 后调用
     * @param config 加载完成的配置
     * @param instance 返回的实例
     */
    afterConfig = new SyncHook(['config', 'instance']);
    /**
     * 设置 mountDOM
     * @param mountDOM 挂载的 DOM
     */
    mountDOM = new SyncHook(['mountDOM']);
    /**
     * mountDOM 提供后
     * @param mountDOM 挂载的 DOM
     */
    afterMountDOM = new SyncHook(['mountDOM']);
    /**
     * Async
     * 获取项目资源
     * @param project 项目
     * @param projectInfo.files 项目的资源文件列表
     * @param projectInfo.cacheBeforeRun 是否需要先全部缓存
     * @param projectInfo.projectConfig 项目配置
     * @param interceptor.intercept 拦截默认行为
     * @param interceptor.fail 操作失败，触发错误回调，不会调用默认行为
     */
    loadResources = new AsyncParallelHook(['project', 'projectInfo', 'interceptor']);
    /**
     * 项目注册后
     * @param project 变化的项目
     */
    afterRegister = new SyncHook(['project']);
    /**
     * Async
     * 进入项目
     * @param project 进入的项目
     * @param interceptor.intercept 拦截默认行为
     * @param interceptor.fail 操作失败，触发错误回调，不会调用默认行为，且当前挂载项目不会变更
     */
    enter = new AsyncParallelHook(['project', 'projectInfo', 'interceptor']);
    /**
     * 项目挂载前
     * @param project 进入的项目
     */
    beforeMount = new SyncHook(['project']);
    /**
     * Async
     * 项目挂载
     * @param project 挂载的项目
     * @param projectInfo.projectRegisterConfig 注册信息
     * @param interceptor.intercept 拦截默认行为
     * @param interceptor.fail 操作失败，触发错误回调，不会调用默认行为，且当前挂载项目不会变更
     */
    mount = new AsyncParallelHook(['project', 'projectInfo', 'interceptor']);
    /**
     * 项目挂载后
     * @param project 进入的项目
     */
    afterMount = new SyncHook(['project']);
    /**
     * Async
     * 退出项目
     * @param project 退出的项目
     * @param interceptor.intercept 拦截默认行为
     * @param interceptor.fail 操作失败，触发错误回调，不会调用默认行为，且当前挂载项目不会变更
     */
    exit = new AsyncParallelHook(['project', 'projectInfo', 'interceptor']);
    /**
     * 项目卸载前
     * @param project 卸载的项目
     */
    beforeUnmount = new SyncHook(['project']);
    /**
     * Async
     * 项目卸载
     * @param project 卸载的项目
     * @param projectInfo.projectRegisterConfig 注册信息
     * @param interceptor.intercept 拦截默认 unmount 行为
     * @param interceptor.fail 操作失败，触发错误回调，不会调用默认行为，且当前挂载项目不会变更
     */
    unmount = new AsyncParallelHook(['project', 'projectInfo', 'interceptor']);
    /**
     * 项目卸载后
     * @param project 卸载的项目
     */
    afterUnmount = new SyncHook(['project']);
    /**
     * 刷新项目
     */
    refresh = new SyncHook();
    /**
     * 报错
     * @param error 错误信息
     */
    error = new SyncHook(['error']);
}
