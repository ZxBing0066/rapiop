import _ from 'lodash';

import RAPIOP from '@rapiop/rapiop';

export const init = () => {
    let currentProject = 'home';
    const routeMatcher = (projectKey: string) => () => currentProject === projectKey;
    const app = RAPIOP({
        config: {
            home: {
                files: ['/another/home/index.js'],
                matcher: routeMatcher('home')
            },
            other: {
                files: ['/another/other/index.js'],
                matcher: routeMatcher('other')
            }
        }
    });
    app.jumpTo = (project: 'home' | 'other') => {
        currentProject = project;
        app.hooks.refresh.call();
    };
    return app;
};
