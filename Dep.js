export default class Dep {
    constructor() {
        this.subs = []
    }
    addSub(watcher) {
        if (watcher && watcher.update)
            this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}