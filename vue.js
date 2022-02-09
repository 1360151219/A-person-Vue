import Observer from "./Observer.js";
import Compiler from "./Compiler.js";

export default class Vue {
    constructor(options) {
        this.el = options.el
        this.data = options.data
        this.methods = options.methods
        this.computed = options.computed
        this._initRoot(options.el)
        this._proxyData(this.data)
        this._bindHandlers(this.methods)
        new Observer(this.data)
        new Compiler(this)
    }
    _initRoot(el) {
        if (typeof el === 'string') {
            this.el = document.querySelector(el)

        } else if (el instanceof HTMLElement) {
            this.el = el
        }

        if (!this.el) throw new Error('The el must existing')
    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(newVal) {
                    if (newVal === data[key]) return
                    // 将this.data的属性改变，触发监听机制
                    data[key] = newVal
                }
            })
        })
    }
    _bindHandlers(methods) {
        if (methods) {
            Object.keys(methods).forEach(key => {
                const methodHandler = methods[key];
                Object.defineProperty(this.methods, key, {
                    configurable: true,
                    enumerable: true,
                    value: methodHandler.bind(this)
                })
            })
        }
    }
}