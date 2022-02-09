import Dep from "./Dep.js";
export default class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        Dep.target = this
        this.oldVal = vm[key]// 调用getter将自动将this推进Dep中
        Dep.target = null
    }
    update() {
        const newVal = this.vm.data[this.key]
        if (newVal === this.oldVal) return
        this.oldVal = newVal // 需要更新oldVal的值
        this.cb(newVal)
    }
}