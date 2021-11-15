import Dep from './Dep.js';
export default class Observer {
    constructor(value) {
        this.value = value;
        /* 只有是对象的时候，开始遍历 */
        if (!Array.isArray(value)) {
            this.walk(value);
        }
    }
    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            this.defineReactive(obj, keys[i], obj[keys[i]]);
        }
    }
    defineReactive(data, key, val) {
        if (typeof val === "object") {
            new Observer(val);
        }
        let dep = new Dep();
        Object.defineProperty(data, key, {
            configurable: true /* 可修改 */,
            enumerable: true /* 可遍历 */,
            get: function () {
                Dep.target && dep.addSub(Dep.target)
                return val;
            },
            set: function (newVal) {
                if (val === newVal) return;
                dep.notify();
                val = newVal;
            },
        });
    }

}
