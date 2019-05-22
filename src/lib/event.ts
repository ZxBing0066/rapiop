interface Listener {
    (event: CustomEvent): void;
}
interface ListenerMap {
    [eventType: string]: Listener[];
}

export class CustomEvent {
    type: string = '';
    info: object;
    constructor(eventType: string, info?: object) {
        this.type = eventType;
        this.info = info;
    }
}

export class Event {
    listenerMap: ListenerMap = {};
    addEventListener = (eventType: string, listener: Listener) => {
        if (!this.listenerMap[eventType]) {
            this.listenerMap[eventType] = [];
        }
        const listeners = this.listenerMap[eventType];
        listeners.push(listener);
    };
    dispatchEvent = (eventType: string, info?: object) => {
        const listeners = this.listenerMap[eventType] || [];
        listeners.forEach((listener: Listener) => {
            listener(new CustomEvent(eventType, info));
        });
    };
}
export const EVENT_TYPES = {
    // 项目初始化前
    BEFORE_INIT: 'BEFORE_INIT',
    // 项目初始化之后
    AFTER_INIT: 'AFTER_INIT',
    // frame注册后
    AFTER_FRAME_REGISTER: 'AFTER_FRAME_REGISTER',
    // frame mount 后
    AFTER_FRAME_MOUNT: 'AFTER_FRAME_MOUNT',
    // 项目注册后
    AFTER_REGISTER: 'AFTER_REGISTER',
    // 项目mount前
    BEFORE_MOUNT: 'BEFORE_MOUNT',
    // 项目mount后
    AFTER_MOUNT: 'AFTER_MOUNT',
    // 项目卸载前
    BEFORE_UNMOUNT: 'BEFORE_UNMOUNT',
    // 项目卸载后
    AFTER_UNMOUNT: 'AFTER_UNMOUNT',
    // 地址变化
    PATH_CHANGE: 'PATH_CHANGE',
    // dom解锁
    UNLOCK_DOM: 'UNLOCK_DOM'
};
