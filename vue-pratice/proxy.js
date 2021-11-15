// 实现一个简单的相应式函数 使用proxy
let map = new Map()
const makeObservable = (obj) => {
    let handlerName = Symbol('handler')
    map.set(handlerName, [])
    obj.observe = (handler) => {
        map.get(handlerName).push(handler)
    }
    let proxyHandler = {
        get(target, key, recevier) {
            if (typeof target[key] === 'object') {
                return new Proxy(target[key], proxyHandler)
            }
            let success = Reflect.get(...arguments)
            if (success) {
                map.get(handlerName).forEach(handler => handler('GET', key, target[key]))
            }
            return success
        },
        set(target, key, val, recevier) {
            let success = Reflect.set(...arguments)
            if (success) {
                map.get(handlerName).forEach(handler => handler('SET', key, val))
            }
            return success
        },
        deleteProperty(target, key, recevier) {
            let oldVal = target[key]
            let success = Reflect.deleteProperty(...arguments)
            if (success) {
                map.get(handlerName).forEach(handler => handler('DELETE', key, oldVal))
            }
            return success
        },
    }
    return new Proxy(obj, proxyHandler)
}

let user = {}
user = makeObservable(user)
user.observe((action, key, val) => {
    console.log(`${action} key=${key} value=${val || ''}`)
})

user.name = 'John'
console.log(user.name)
delete user.name