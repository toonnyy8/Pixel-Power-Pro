import "core-js/stable"
import "regenerator-runtime/runtime"

import * as idb from "idb"
import Vue from 'vue'
import App from '../vue/fl/fl.vue'

new Vue(App).$mount("#app")