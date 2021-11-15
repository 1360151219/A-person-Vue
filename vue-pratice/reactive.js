// 实现一个简单的相应式函数
const reactive = (obj) => {
    if (typeof obj === 'object') {
        const keys = Object.keys(obj)
        for (let k of keys) {
            defineReactive(obj, k, obj[k])
        }

    }
}
const defineReactive = (obj, key, val) => {
    reactive(val)
    Object.defineProperty(obj, key, {
        get() {
            console.log(`GET key=${key} val=${val}`)
            return val
        },
        set(newVal) {
            if (newVal === val) return
            val = newVal
            console.log(`SET key=${key} val=${newVal}`)
        }
    })
}
const data = {
    a: 1,
    b: 2,
    c: {
        c1: {
            a1: 100
        },
        c2: 3
    }
}
reactive(data)

data.a = 5// SET key=a val=5
data.c.c2 = 4