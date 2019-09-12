// const { SyncHook } = require('tapable');

// class App {
//     constructor() {
//         this.hooks = {
//             test: new SyncHook()
//         };
//     }
// }

// const app = new App();

// app.hooks.test.tap('tap 1', () => {
//     setTimeout(() => {
//         console.log('tap 1');
//     }, 100);
// });

// app.hooks.test.tap('tap 2', () => {
//     setTimeout(() => {
//         console.log('tap 2');
//     }, 200);
// });

// app.hooks.test.tapAsync('tap async', () => {
    
// })

// app.hooks.test.tap('tap 3', () => {
//     console.log('tap 3');
// });



// app.hooks.test.call();

// AsyncParallelHook 钩子：tapAsync/callAsync 的使用
const { AsyncParallelHook } = require("tapable");

// 创建实例
let asyncParallelHook = new AsyncParallelHook(["name", "age"]);

// 注册事件
console.time("time");
asyncParallelHook.tap("1", (name, age, done) => {
    setTimeout(() => {
        console.log("1", name, age, new Date());

    }, 1000);
});

asyncParallelHook.tapAsync("2", (name, age, done) => {
    setTimeout(() => {
        console.log("2", name, age, new Date());
        done();
    }, 2000);
});

asyncParallelHook.tap("3", (name, age, done) => {
    setTimeout(() => {
        console.log("3", name, age, new Date());

        console.timeEnd("time");
    }, 3000);
});

// 触发事件，让监听函数执行
asyncParallelHook.callAsync("panda", 18, () => {
    console.log("complete");
});

// 1 panda 18 2018-08-07T10:38:32.675Z
// 2 panda 18 2018-08-07T10:38:33.674Z
// 3 panda 18 2018-08-07T10:38:34.674Z
// complete
// time: 3005.060ms