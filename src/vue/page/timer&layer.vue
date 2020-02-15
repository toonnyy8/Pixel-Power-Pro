<template>
	<div ref="timer&layer" class="relative w-screen bg-gray-400 z-20" v-bind:style="pageHeight">
		<canvas :width="tl.width" :height="tl.height" ref="tl"></canvas>
	</div>
</template>

<script>
export default {
	props: { height: Number },
	data() {
		return { tl: { width: 1, height: 1 } };
	},
	mounted() {
		{
			let onload = window.onload || (() => {});
			window.onload = () => {
				onload();
				this.tl.width = this.$refs["timer&layer"].offsetWidth;
				this.tl.height = this.$refs["timer&layer"].offsetHeight;
			};
		}
		{
			let onresize = window.onresize || (() => {});
			window.onresize = () => {
				onresize();
				this.tl.width = this.$refs["timer&layer"].offsetWidth;
				this.tl.height = this.$refs["timer&layer"].offsetHeight;
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