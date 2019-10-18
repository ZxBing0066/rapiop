import { createSandbox } from 'z-sandbox';

import Hooks from '../Hooks';

interface OPTIONS {
    useStrict?: boolean;
    useWith?: boolean;
    inheritWindow?: boolean;
    blacklist?: string[];
}

export default class JSSandbox {
    constructor(options: OPTIONS) {
        this.options = options;
    }
    options: OPTIONS;
    call({ hooks }: { hooks: Hooks }) {
        hooks.amendInstance.tap('amend sandbox', (instance: any, amendInstance: (instanceProps: any) => void) => {
            amendInstance({
                createSandbox
            });
        });
    }
}
