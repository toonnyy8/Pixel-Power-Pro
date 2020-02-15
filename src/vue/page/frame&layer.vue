<template>
	<div ref="frame&layer" class="relative w-screen bg-gray-400 z-20" v-bind:style="pageHeight">
		<canvas :width="fl.width" :height="fl.height" ref="fl"></canvas>
	</div>
</template>

<script>
export default {
	props: { height: Number },
	data() {
		return { fl: { width: 1, height: 1 } };
	},
	mounted() {
		{
			let onload = window.onload || (() => {});
			window.onload = () => {
				onload();
				this.fl.width = this.$refs["frame&layer"].offsetWidth;
				this.fl.height = this.$refs["frame&layer"].offsetHeight;
			};
		}
		{
			let onresize = window.onresize || (() => {});
			window.onresize = () => {
				onresize();
				this.fl.width = this.$refs["frame&layer"].offsetWidth;
				this.fl.height = this.$refs["frame&layer"].offsetHeight;
			};
		}
	},
	computed: {
		pageHeight() {
			return { height: `${this.height}vh` };
		}
	}
};
</script>