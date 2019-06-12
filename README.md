# RAPIOP - Run All Project In One Project/Place

## 背景

当公司有多个部门、多个团队，而每个团队都开发了自己的一系列系统、工具、网站，网站越来越多、碎片化越来越严重，这时想要把所
有的网站放在一处管理，但是却发现大家的框架、构建、代码完全不一致，如果需要统一改造，那么势必成本过高。

故本 lib 应运而生，本 lib 的职责就是让所有主流的框架说搭建的网站，无论原来在哪里，只需要做小小的改动，就可以和其它网站跑
在一处，避免网站的碎片化。

## 想法

目前主流框架大体是根据代码来生成 dom 并嵌入页面中，依赖的只是一个固定的 mount dom 元素，利用主流框架的这个一致性，将项目
的初始化嵌入 dom 的行为抽离出来，便可实现多项目共存

## 如何使用

-   新建一个前端项目作为所有项目的容器
-   项目中安装 rapiop

    ```sh
    yarn add @rapiop/rapiop
    ```

-   参考`examples/basic/index.ts`，创建一个新的实例。

    ```js
    import RAPIOP from '@rapiop/rapiop';

    function getConfig() {
        return new Promise(resolve =>
            resolve({
                demo: {
                    url: '^/demo/'
                },
                'demo-2': {
                    url: '^/demo-2/'
                }
            })
        );
    }

    const app = new RAPIOP({
        getConfig: getConfig
    });
    ```

    `getConfig`为必要参数

-   注册一个容器

    ```js
    app.registerFrame((rootDOM: Element) => {
        return new Promise(resolve => {
            const frame = document.createElement('div');
            frame.id = 'frame';
            const header = document.createElement('div');
            header.id = 'header';
            const ul = document.createElement('ul');
            _.each(
                {
                    home: { href: '/' },
                    ...app.config
                },
                (info, key) => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.onclick = () => app.navigate(`\\${info.key}\\`);
                    a.innerText = key;
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            );
            header.appendChild(ul);
            const mountDOM = document.createElement('div');
            mountDOM.id = 'mount-dom';
            frame.appendChild(header);
            frame.appendChild(mountDOM);
            rootDOM.appendChild(frame);
            resolve(mountDOM);
        });
    });
    ```

    注册完成后容器项目可以运行，容器会被渲染出来。

-   注册项目

    ```js
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

    `home`为默认页面 key，若 config 中无可匹配陆游的项目，则渲染该页面，可使用`option.homeKey`来自定义

    启动后项目根据 config 中的 url 规则匹配的地址进入对应项目
