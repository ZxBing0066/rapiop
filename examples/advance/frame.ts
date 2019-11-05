import _ from 'lodash';

export const init = () => {
    document.body.innerHTML = `
    <nav id="menu"></nav>
    <div class="row no-gutters" id="wrapper">
        <div class="col-3" id="container-secondary">
        </div>
        <div class="col-9" id="container-main">
            <div id="mount-dom"></div>
            <div id="iframe-mount-dom" style="display: none"></div>
            <div id="loading" style="display: none">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
    `;
};
