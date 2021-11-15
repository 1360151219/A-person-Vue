import Observer from './Observer.js';
import Compiler from './Compiler.js'
export default class Vue {
    constructor(options) {
        this.$options = options
        this.$el = options.el
        this.$data = options.data
        this.$methods = options.methods
        this._initRoot(options)
        /* 将data注入到vue实例 */
        this._proxyData(this.$data)
        /* 初始化 */
        new Observer(this.$data)
        new Compiler(this)
    }
    _initRoot(options) {
        if (typeof options.el === 'string') {
            this.$el = document.querySelector(options.el)
        } else if (options.el instanceof HTMLElement) {
            this.$el = options.el
        }
        /* 合理的抛出错误 */
        if (!this.$el) {
            throw new Error('请输入合法的el')
        }
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
                    if (data[key] === newVal) return
                    data[key] = newVal
                }
            })
        })
    }
}