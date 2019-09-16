window.app.registerFrame(() => {
    const mountDOM = document.createElement('div');
    document.getElementById('mount-dom').appendChild(mountDOM);
    return Promise.resolve(mountDOM);
});
