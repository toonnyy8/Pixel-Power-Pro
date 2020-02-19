<template>
	<div ref="frame&layer" class="relative w-screen bg-gray-400 z-20" v-bind:style="pageHeight"></div>
</template>

<script>
import { FLUI } from "../../ts/frame&layer";

export default {
	props: { height: Number },
	data() {
		return {};
	},
	mounted() {
		new FLUI(this.$refs["frame&layer"]);
	},
	computed: {
		pageHeight() {
			return { height: `${this.height}vh` };
		}
	}
};
</script>