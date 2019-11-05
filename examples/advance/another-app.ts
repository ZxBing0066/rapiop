import _ from 'lodash';

import RAPIOP from '@rapiop/rapiop';

export const init = () => {
    const app = RAPIOP({
        config: {
            home: {
                files: ['/another/home/index.js']
            }
        }
    });
    return app;
};
