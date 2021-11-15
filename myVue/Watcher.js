import Dep from './Dep.js';
export default class Watcher {
    //每当有新数据的时候，创建一个Watcher来监听它
    /** 
    * vm: vue实例
    * key: data中的属性名
    * cb: 负责更新视图的回调函数
    */
    constructor(vm, key, cb) {
        this.vm = vm
        // data中的属性名称
        this.key = key
        // 回调函数负责更新视图
        this.cb = cb
        // 把watcher对象记录到Dep类的静态属性target
        Dep.target = this
        // 触发get⽅法，在get⽅法中会调⽤addSub
        this.oldValue = vm[key]
        Dep.target = null
    }
    /** 当数据发⽣变化的时候更新视图 */
    update() {
        let newValue = this.vm[this.key]
        if (this.oldValue === newValue) {
            return
        }
        this.cb(newValue)
    }
}