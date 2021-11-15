// 实现一个监听数组的方法:Vue中的思想是重写原型方法
const arrayPrototype = Array.prototype
const newPrototype = Object.create(arrayPrototype)// 这里复制一份
const reactive = (obj) => {
    if (Array.isArray(obj))
        obj.__proto__ = newPrototype
}
['push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'sort', 'reverse'].forEach(name => {
    newPrototype[name] = function () {
        arrayPrototype[name].call(this, ...arguments)
        console.log(`Action=${name},args=${[].join.call(arguments, ',') || ''}`)
    }
})
const data = [1, 2, 3, 4]
reactive(data)

data.push(10, 5)// Action=push,args=10
data.reverse()// Action=reverse,args=
console.log(data)
