const test = () => {
    const s1 = window._MY_APP.createSandbox({ a: 1, b: 2 }, { useStrict: true, useWith: true });
    window.s1 = s1;
    window.abc = { a: 1, b: 2 };
    s1(`
    debugger
    console.log(a, b, window, abc);
    abc.a = 2;
    window.c = 1;
    d = 2;
    var e = 5;
    console.log(c, d, e);
    console.log(this);
    (function() {
        console.log(this);
    })()
`);
    console.log(window, window.c, window.d, window.e, window.abc);
};
window._MY_APP.register(
    'sandbox',
    mountDOM => {
        const content = document.createElement('div');
        content.innerText = 'sandbox';
        mountDOM.appendChild(content);
        test();
    },
    mountDOM => {
        mountDOM.innerHTML = null;
    }
);
