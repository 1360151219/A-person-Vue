import Dep from "./Dep.js";
export default class Observer {
    constructor(data) {
        if (typeof data === 'object') this.walk(data)
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        if (typeof val === 'object') new Observer(val)
        let dep = new Dep()
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                if (Dep.target) dep.addSub(Dep.target)
                return val
            },
            // 注意事项：这里一定要先改变值再触发更新逻辑，否则第一次永远不会更新
            set(newVal) {
                if (newVal === val) return
                val = newVal
                dep.notify()
            }
        })
    }
}