<template>
<body class="overflow-x-hidden" v-bind:class="{'overflow-y-hidden':!frozen}">
	<div
		ref="frozen"
		class="flex fixed h-screen w-screen bg-transparent bg-blue-100-t"
		v-bind:class="{'z-40':frozen,'z-0':!frozen}"
	></div>
	<button
		class="rounded-full h-24 w-24 flex items-center justify-center bg-gray-600 fixed z-30 right-0 bottom-0 mr-6 mb-12"
	>B</button>
	<button
		ref="F"
		class="rounded-full h-24 w-24 flex items-center justify-center bg-gray-600 fixed z-50 left-0 top-0 ml-6 mt-12"
		@click="_frozen"
	>F</button>
	<setting></setting>
	<frameAndLayer :height="page.flHeight"></frameAndLayer>
	<drawer :height="page.drawerHeight" :image="image"></drawer>
	<tooler></tooler>
</body>
</template>

<script>
import Vue from "vue";

import setting from "./page/setting.vue";
import frameAndLayer from "./page/frame&layer.vue";
import drawer from "./page/drawer.vue";
import tooler from "./page/tooler.vue";

import { FL } from "../ts/frame&layer";

export default {
	components: {
		setting: setting,
		frameAndLayer: frameAndLayer,
		drawer: drawer,
		tooler: tooler
	},
	data() {
		return {
			frozen: false,
			page: { flHeight: 50, drawerHeight: 50 },
			image: { width: 10, height: 10 }
			// FL:new FL(10,10)
		};
	},
	created() {
		this;
	},
	methods: {
		_frozen() {
			this.frozen = !this.frozen;
		},
		setImageSize(width, height) {
			this.image.width = width;
			this.image.height = height;
		}
	}
};
</script>

<style>
@import url(../css/index.css);

::-webkit-scrollbar {
	width: 20px;
	height: 20px;
}

::-webkit-scrollbar-track {
	background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
	border-radius: 50% 0 0 50%;
	background-color: rgb(0, 165, 187);
}

html,
body {
	margin: 0;
	padding: 0;
}

.bg-blue-100-t {
	background-color: #ebf8ff55;
}
</style>