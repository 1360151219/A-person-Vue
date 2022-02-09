import Watcher from "./Watcher.js";
export default class Compiler {
    constructor(vm) {
        this.vm = vm
        this.el = vm.el
        this.methods = vm.methods
        this.compiler(this.el)
    }
    compiler(el) {
        const childNodes = el.childNodes
        for (let node of childNodes) {
            // nodeType：1元素节点 2属性节点 3文本节点
            if (this._isTextNode(node)) this._compileText(node)
            else if (this._isElementNode(node)) this._compileElement(node)
            if (node.childNodes && node.childNodes.length > 0) this.compiler(node)
        }
    }
    _isElementNode(node) {
        return node.nodeType === 1
    }
    // v-on:click v-html @click
    _isDirective(attrName) {
        return attrName.startsWith('v-') || attrName.startsWith('@')
    }
    _compileElement(node) {
        // attributes 行内属性节点
        const attrs = node.attributes
        // console.log(attrs[0].nodeType);  2
        for (let attr of attrs) {
            // 属性节点：键值对 nodeName和nodeValue
            const attrName = attr.nodeName;
            const attrValur = attr.nodeValue
            // console.log(nodeName);
            if (this._isDirective(attrName)) {
                if (attrName.startsWith('@')) {
                    const fnName = attrName.slice(1)
                    this._update(node, fnName, attrValur)
                }
                if (attrName.startsWith('v-')) {
                    const fnName = attrName.includes(':') ? attrName.slice(5) : attrName.slice(2)
                    this._update(node, fnName, attrValur)
                }
            }
        }
    }
    _isTextNode(node) {
        return node.nodeType === 3
    }
    _compileText(node) {
        const regexp = /{{(.*?)}}/g
        let text = node.textContent // 这里要将原始节点text保存下来，更新的时候用，否则会将非差值表达式给更掉！
        const keyIterator = text.matchAll(regexp)
        for (let k of keyIterator) {
            const expression = k[0]
            const key = k[1]
            if (key.split('.').length < 2) {
                if (this.vm[key] !== null && this.vm[key] !== undefined) {
                    node.textContent = text.replace(expression, this.vm[key])
                    new Watcher(this.vm, key, (newVal) => {
                        node.textContent = text.replace(expression, newVal)
                        console.log(node.textContent, newVal);
                    })
                }
            } else {
                let keyObj = key.split('.')
                let realValue = this.vm[keyObj[0]]
                let realKey;
                for (let i = 1; i < keyObj.length; i++) {
                    if (i === keyObj.length - 1) realKey = realValue
                    realValue = realValue[keyObj[i]]
                }
                console.log(realKey);// 获取到父对象
                if (realValue !== undefined) {
                    node.textContent = text.replace(expression, realValue)
                    // new Watcher(this.vm, key, (newVal) => {
                    //     node.textContent = text.replace(expression, newVal)
                    //     console.log(node.textContent, newVal);
                    // })
                }
            }

        }

    }

    // 处理指令
    _update(node, fnName, val) {
        const updateFunction = this['_' + fnName]
        updateFunction && updateFunction.call(this, node, val)
    }
    _click(node, cb) {
        if (cb.endsWith('()')) cb = cb.replace('()', '')
        if (document.addEventListener) {
            node.addEventListener('click', this.vm.methods[cb])
        }
        else if (document.attachEvent) {
            node.attachEvent('onclick', this.vm.methods[cb])
        }

    }
    _html(node, value) {
        node.innerHTML = this.vm[value]
        new Watcher(this.vm, value, (newVal) => {
            node.innerHTML = newVal
        })
    }
    _text(node, key) {
        node.textContent = this.vm[key]
        new Watcher(this.vm, key, (newVal) => {
            node.textContent = newVal
        })
    }
    // 双向绑定
    _model(node, key) {
        node.value = this.vm[key]
        new Watcher(this.vm, key, (newVal) => {
            node.value = newVal
        })
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        }, false)
    }
}