import "core-js/stable"
import "regenerator-runtime/runtime"

import Vue from 'vue'
import App from '../vue/app.vue'

document.oncontextmenu = () => {
    window.event.returnValue = false; //將滑鼠右鍵事件取消
}

new Vue(App).$mount("#app")
