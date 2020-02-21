<template>
	<div ref="frame&layer" class="relative w-screen bg-gray-400 z-20" v-bind:style="pageHeight"></div>
</template>

<script>
import { FLUI, FL } from "../../ts/frame&layer";

export default {
	props: { height: Number, fl: FL },
	data() {
		return { flUI: new FLUI() };
	},
	mounted() {
		this.fl.registerUI(this.flUI);
		this.flUI.bindView(this.$refs["frame&layer"]);
	},
	computed: {
		pageHeight() {
			return { height: `${this.height}vh` };
		}
	}
};
</script>