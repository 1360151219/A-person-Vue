export default class Dep {
    constructor() {
        // 存储所有的观察者
        this.subs = []
    }
    /** 添加观察者 */
    addSub(watcher) {
        if (watcher && watcher.update) {
            this.subs.push(watcher)
        }
    }
    /** 发送通知 */
    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}