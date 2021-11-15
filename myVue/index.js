import Vue from './vue.js'
const vm = new Vue({
    el: '#app',
    data: {
        msg: 'Hello Vue',
        count: 100,
        myHtml: '<ul><li>这是v-html编译的</li></ul>',
    },
    methods: {
        handler() {
            alert('handler')
        }
    }
})
console.log(vm)