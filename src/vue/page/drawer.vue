<template>
	<div
		ref="drawer"
		class="relative w-screen bg-gray-800 z-10 flex items-center justify-center"
		v-bind:style="pageHeight"
	>
		<canvasSystem
			ref="canvasSystem"
			v-bind:width="image.width"
			v-bind:height="image.height"
			v-bind:unit="unit"
			v-bind:scale="scale"
			v-bind:x="x"
			v-bind:y="y"
			v-bind:isShowGrid="isShowGrid"
		></canvasSystem>
	</div>
</template>

<script>
import canvasSystem from "./component/canvasSystem.vue";

export default {
	components: {
		canvasSystem: canvasSystem
	},
	props: { image: { width: Number, height: Number }, height: Number },
	data() {
		return { unit: 1, scale: 1, x: 0, y: 0, isShowGrid: true };
	},
	created() {},
	mounted() {
		{
			let onload = window.onload || (() => {});
			window.onload = () => {
				onload();
				this.$nextTick().then(() => {
					this.unit = Math.min(
						this.$refs.drawer.offsetWidth / this.image.width,
						this.$refs.drawer.offsetHeight / this.image.height
					);
				});
			};
		}

		{
			let onresize = window.onresize || (() => {});
			window.onresize = () => {
				onresize();
				this.$nextTick().then(() => {
					this.unit = Math.min(
						this.$refs.drawer.offsetWidth / this.image.width,
						this.$refs.drawer.offsetHeight / this.image.height
					);
				});
			};
		}
		this.$refs.drawer.onmousedown = e => {
			e.preventDefault();

			let mouseX = e.clientX;
			let mouseY = e.clientY;
			let x = this.x;
			let y = this.y;
			console.log("down");
			switch (e.button) {
				case 0: {
					this.$refs.drawer.onmousemove = () => {
						console.log("left");
					};
					break;
				}
				case 1: {
					// ss.showGrid(!ss.isShowGrid)
					this.$refs.drawer.onmousemove = () => {
						console.log("middle");
					};
					break;
				}
				case 2: {
					this.$refs.drawer.onmousemove = e => {
						console.log("right");
						this.x = x + (e.clientX - mouseX);
						this.y = y + (e.clientY - mouseY);
					};
					break;
				}
				default: {
				}
			}
		};

		this.$refs.drawer.onmouseup = e => {
			this.$refs.drawer.onmousemove = null;
		};
		this.$refs.drawer.onmouseleave = e => {
			this.$refs.drawer.onmousemove = null;
		};
		this.$refs.drawer.onwheel = e => {
			e.preventDefault();
			let scale = this.scale * 100;
			scale += e.deltaY > 0 ? -15 : 15;
			scale = Math.min(Math.max(scale, 50), 200);
			this.scale = scale / 100;
			// ss.setScale(scale / 100);
		};
	},
	computed: {
		pageHeight() {
			return { height: `${this.height}vh` };
		}
	}
};
</script>

<style scoped>
@import url(../../css/index.css);
</style>