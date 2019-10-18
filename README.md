# RAPIOP - Run All Project In One Project/Place

> A simple micro frontend library

## 背景

当公司有多个部门、多个团队，而每个团队都开发了自己的一系列系统、工具、网站，随着时间的推移，网站越来越多、碎片化越来越严
重，这时想要把所有的网站放在一处管理，但是却发现大家的框架、构建、代码完全不一致，如果需要统一改造，那么势必成本过高。

这个库的职责就是让所有主流的框架说搭建的网站，无论原来在哪里，只需要做小小的改动，就可以和其它网站融合在一起，避免网站的
碎片化。

## 想法

目前主流框架大体是根据代码来生成 dom 并嵌入页面中，依赖的只是一个固定的 mount dom 元素，利用主流框架的这个一致性，将项目
的初始化嵌入 dom 的行为抽离出来，便可实现多项目共存。

每个项目主要的关注点：项目对应的路由（可以是任何种类的路由，如基于内存的历史栈），项目对应的文件（可选）,项目的挂载和卸
载

## 特点

-   支持 tapable hooks，方便插件化，方便各个生命周期的拦截和自定义
-   体积小，无侵入，主要功能通过插件提供
-   通过 iframe 插件可以达到彻底的隔离，可支持各种古老的 spa 项目（backbone，jQuery 等）
-   支持多实例，嵌套等
-   提供了丰富的插件，组装完成各种功能
    -   frame - 方便外层骨架和主逻辑解藕
    -   dependence - 方便统一提供公共依赖，减少项目体积
    -   iframe - 通过 iframe 来彻底隔离某些项目，避免被老项目搞挂
    -   sandbox（开发中） - 通过简单的 sandbox 实现来隔离全局变量的变更，避免项目间的互相影响
    -   prefetch - 通过 prefetch 来预加载特定项目资源（如常用产品）提升体验

## 如何使用

-   新建一个前端项目作为所有项目的容器
-   项目中安装 rapiop

    ```sh
    yarn add @rapiop/rapiop
    ```

-   参考`examples/basic/index.ts`，创建一个新的实例。

    ```ts
    import RAPIOP from '@rapiop/rapiop';
    import { createBrowserHistory } from 'history';

    // 各个小项目的配置
    function getConfig() {
        return {
            demo: {
                url: '^/demo/'
            },
            'demo-2': {
                url: '^/demo-2/'
            }
        };
    }
    const history = createBrowserHistory();

    const app = RAPIOP({
        // 产品配置，支持异步
        getConfig,
        // 项目的挂载点，异步可使用 FramePlugin
        mountDOM: document.getElementById('mount-dom'),
        // 自定义路由
        history
    });
    ```

    `getConfig`为必要参数

*   注册各个子项目

    ```ts
    app.register(
        'home',
        (mountDOM: Element) => {
            const content = document.createElement('div');
            content.innerText = 'this is my home';
            mountDOM.appendChild(content);
            console.log('home mounted');
        },
        (mountDOM: Element) => {
            mountDOM.innerHTML = null;
            console.log('home unmounted');
        }
    );

    app.register(
        'demo',
        (mountDOM: Element) => {
            const content = document.createElement('div');
            content.innerText = 'this is my demo';
            mountDOM.appendChild(content);
            console.log('demo mounted');
        },
        (mountDOM: Element) => {
            mountDOM.innerHTML = null;
            console.log('demo unmounted');
        }
    );

    app.register(
        'demo-2',
        (mountDOM: Element) => {
            const content = document.createElement('div');
            content.innerText = 'this is my demo-2';
            mountDOM.appendChild(content);
            console.log('demo-2 mounted');
        },
        (mountDOM: Element) => {
            mountDOM.innerHTML = null;
            console.log('demo-2 unmounted');
        }
    );
    ```

    `home`为默认页面 key，若 config 中无可匹配路由的项目，则渲染该页面，可使用`option.fallbackProjectKey`来自定义

    启动后项目根据 config 中的 url 规则匹配的地址进入对应项目

*   config 中传入 files，可支持在路由切换时自动加载文件然后执行挂载，可参考 examples/advance
