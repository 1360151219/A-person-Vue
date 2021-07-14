import Watcher from './Watcher.js';
export default class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.methods = vm.$methods
        this.compile(vm.$el)
    }
    // 编译模版
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) { // 处理⽂本节点
                this.compileText(node)
            } else if (this.isElementNode(node)) { // 处理元素节点
                this.compileElement(node)
            }
            // 如果还有⼦节点，递归调⽤
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node) {
        // console.log(node.attributes) if (node.attributes.length) {
        Array.from(node.attributes).forEach(attr => { // 遍历所有元素节点
            let attrName = attr.name
            if (this.isDirective(attrName)) { // 判断是否是指令
                attrName = attrName.indexOf(':') > -1 ?
                    attrName.substr(5) : attrName.substr(2) // 获取 v- 后⾯的值
                let key = attr.value // 获取data名称
                this.update(node, key, attrName)
            }
        })
    }

    // 更新
    update(node, key, attrName) {
        const updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key, attrName)
    }
    // 解析 v-text
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => { // 创建watcher对象，当数据改变更

            node.textContent = newValue
        })
    }
    // 解析 v-model
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => { // 创建watcher对象，当数据改变更

            node.value = newValue
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    // 解析 v-html
    htmlUpdater(node, value, key) {
        node.innerHTML = value
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue
        })
    }
    // 解析 v-on:click
    clickUpdater(node, value, key, attrName) {
        node.addEventListener(attrName, this.methods[key])
    }
    // 编译⽂本节点，处理差值表达式, {{ }}
    compileText(node) {
        // 获取 {{ }} 中的值
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim() // 返回匹配到的第⼀个字符串，去掉空格
            node.textContent = value.replace(reg, this.vm[key])
            new Watcher(this.vm, key, (newValue) => { // 创建watcher对象，当数据改

                node.textContent = newValue
            })
        }
    }
    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 判断是否是⽂本节点
    isTextNode(node) {
        return node.nodeType === 3
    } // 判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}