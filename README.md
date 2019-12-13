# RAPIOP - Run All Project In One Project/Place

> A simple micro frontend library

## 介绍

当公司有数十、甚至上百的前端项目，终于由于难以管理维护，想要统一管理的时候，最先能想到的大概是将所有的项目再统一的平台上全部重构，然而这必然会消耗大量的人力，甚至做到一半后因为各种高优先级任务而不了了之。

RAPIOP 出现的初心就是，让任意技术栈的前端项目（目前只支持 SPA 项目，多页应用后续计划支持），只需通过简单的改动（10 分钟 - 30 分钟），便可以无痛的和其它项目共存，大大减少前期的重构人力。在所有项目介入后，便可以方便的对项目进行无痛迭代更新，直至统一化。

最近一两年微前端的概念兴起，RAPIOP 能够很好的承载各种微前端设计。

## 特点

-   支持 tapable hooks，方便插件化，方便各个生命周期的拦截和统一管理
-   体积小，无侵入，主要功能通过插件提供
-   通过 iframe 插件可以达到彻底的隔离，可支持各种古老的 spa 项目（backbone，jQuery 等），并且支持路由同步和切换缓存
-   支持多实例
-   提供了丰富的插件，组装完成各种功能
    -   frame - 方便外层骨架和主逻辑解藕
    -   dependence - 方便统一提供公共依赖，减少项目体积
    -   iframe - 通过 iframe 来彻底隔离某些项目，避免被老项目搞挂
    -   sandbox - 通过简单的 sandbox 实现来隔离全局变量的变更，避免项目间的互相影响（由于依赖 Proxy 等对兼容性要求较高，对性能有一定影响）
    -   prefetch - 通过 prefetch 来预加载特定项目资源（如常用产品）提升体验

## 能做什么

-   快速的将各种不同技术栈的前端 SPA 项目聚合在一起
-   可通过 iframe 和 沙箱隔离各项目的代码，避免干扰
-   方便各项目共享公共文件
-   方便的拦截项目加载、渲染等各个环节，做统一的权限配置、认证
-   iframe 也能缓存和同步路由，提升性能、体验
-   等等

## 如何使用

-   新建一个前端项目作为所有项目的容器，也可选择一个已有项目
-   项目中安装 rapiop

    ```sh
    yarn add @rapiop/rapiop
    ```

-   参考`examples/basic/index.ts`，创建一个新的实例。

    ```ts
    import RAPIOP from "@rapiop/rapiop";
    import { createBrowserHistory } from "history";

    // 路由可自定义，或通过其它方式实现，非必要
    const history = createBrowserHistory();

    const app = RAPIOP({
        // 产品配置，支持函数、异步函数
        config: {
            demo: {
                prefix: "/demo/"
            },
            "demo-2": {
                prefix: "/demo-2/"
            }
        },
        // 项目的挂载点，异步可使用 FramePlugin，或使用 hooks
        mountDOM: document.getElementById("mount-dom"),
        // 自定义路由
        history
    });
    ```

    `config`为必要参数

*   注册各个子项目

    ```ts
    app.register(
        "home",
        (mountDOM: Element) => {
            const content = document.createElement("div");
            content.innerText = "this is my home";
            mountDOM.appendChild(content);
            console.log("home mounted");
        },
        (mountDOM: Element) => {
            mountDOM.innerHTML = null;
            console.log("home unmounted");
        }
    );

    app.register(
        "demo",
        (mountDOM: Element) => {
            const content = document.createElement("div");
            content.innerText = "this is my demo";
            mountDOM.appendChild(content);
            console.log("demo mounted");
        },
        (mountDOM: Element) => {
            mountDOM.innerHTML = null;
            console.log("demo unmounted");
        }
    );

    app.register(
        "demo-2",
        (mountDOM: Element) => {
            const content = document.createElement("div");
            content.innerText = "this is my demo-2";
            mountDOM.appendChild(content);
            console.log("demo-2 mounted");
        },
        (mountDOM: Element) => {
            mountDOM.innerHTML = null;
            console.log("demo-2 unmounted");
        }
    );
    ```

    `home`为默认页面 key，若 config 中无可匹配路由的项目，则渲染该页面，可使用`option.fallbackProjectKey`来自定义

    启动后项目根据 config 中的 url 规则匹配的地址进入对应项目

*   config 中传入 files，可支持在路由切换时自动加载文件然后执行挂载，可参考 examples/advance

## 文档

### hooks

> 等待施工 👷‍👷
