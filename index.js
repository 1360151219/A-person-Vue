import Vue from './vue.js'
let vm = new Vue({
    el: '#app',
    data: {
        person: {
            name: 'Alice',
            age: 18,
        },
        html: `<h1>这是v-html渲染出来的</h1>`,
        text: 'v-text的文本',
        inputContent: '7'
    },
    methods: {
        stopChange() {
            clearTimeout(timer)
        },
        changeHTMLOrText() {
            this.html = `<h2>这是改变后v-html渲染出来的</h2>`
            this.text += 'more..'
        }
    }
})
console.log(vm);
let timer = setInterval(() => {
    vm.data.person.name += '!'
    vm.data.person.age++
    // console.log(vm.data);
}, 500)