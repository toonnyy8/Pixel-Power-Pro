import "core-js/stable"
import "regenerator-runtime/runtime"
import eruda from "eruda"
import erudaDom from "eruda-dom"
eruda.init();
eruda.add(erudaDom)

import "../ts/test"
// import * as idb from "idb"
// import Vue from 'vue'
// import App from '../vue/app.vue'

// document.oncontextmenu = () => {
//     window.event.returnValue = false; //將滑鼠右鍵事件取消
// }

// idb.openDB("ppp", 1, {
//     upgrade: (db) => {
//         console.log("upgradeDB")
//         db.createObjectStore('FL')
//         db.createObjectStore('setting')
//         db.createObjectStore('tool')
//     }
// }).then((db) => {
//     const store = db.transaction('FL', "readwrite").objectStore('FL');
//     store.add(new ImageData(10, 10), 1);
//     return db
// }).then((db) => {

// }).then((db) => {
//     new Vue(App).$mount("#app")
// })
