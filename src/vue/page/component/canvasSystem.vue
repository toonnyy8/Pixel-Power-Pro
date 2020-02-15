<template>
	<div ref="container" v-bind:style="calcSize" class="relative pixel">
		<canvas ref="backGrid" v-bind:width="width" v-bind:height="height" class="absolute h-full w-full"></canvas>
		<canvas
			ref="backLayer"
			v-bind:width="width"
			v-bind:height="height"
			class="absolute h-full w-full"
		></canvas>
		<canvas ref="nowLayer" v-bind:width="width" v-bind:height="height" class="absolute h-full w-full"></canvas>
		<canvas
			ref="bufferLayer"
			v-bind:width="width"
			v-bind:height="height"
			class="absolute h-full w-full"
		></canvas>
		<canvas
			ref="foreLayer"
			v-bind:width="width"
			v-bind:height="height"
			class="absolute h-full w-full"
		></canvas>
		<canvas
			ref="foreGrid"
			v-bind:width="width*unit*3"
			v-bind:height="height*unit*3"
			class="absolute h-full w-full"
		></canvas>
		<canvas
			ref="maskLayer"
			v-bind:width="width"
			v-bind:height="height"
			class="absolute h-full w-full"
		></canvas>
	</div>
</template>

<script>
// import * as tf from "@tensorflow/tfjs";
import * as pic from "../../../ts/picture";

export default {
	props: ["width", "height", "unit", "scale", "x", "y", "isShowGrid"],
	data() {
		return {};
	},
	watch: {
		width() {
			this.$nextTick().then(() => {
				this.drawBackGrid();
				this.drawForeGrid();
			});
		},
		height() {
			this.$nextTick().then(() => {
				this.drawBackGrid();
				this.drawForeGrid();
			});
		},
		unit() {
			this.$nextTick().then(() => {
				this.drawForeGrid();
			});
		},
		scale() {
			this.$nextTick().then(() => {
				this.drawForeGrid();
			});
		}
	},
	created() {},
	mounted() {
		// const imageData = new ImageData(this.width, this.height);

		// let p = pic.setPixel(imageData)(0, 0, 0, 255);

		// for (let i = 0; i < this.width; i++) {
		// 	for (let j = 0; j <= i; j++) {
		// 		p(i, j);
		// 	}
		// }
		// tf.browser.toPixels(
		// 	tf.browser.fromPixels(imageData, 4),
		// 	this.$refs.nowLayer
		// );
		this.$nextTick().then(() => {
			this.drawBackGrid();
			this.drawForeGrid();
		});
	},
	computed: {
		calcSize() {
			return {
				width: `${this.width * this.unit}px`,
				height: `${this.height * this.unit}px`,
				transform: `translate(${this.x}px,${this.y}px) scale(${this.scale})`
			};
		},
		calcWidth() {
			return this.width * this.unit * 3;
		},
		calcHeight() {
			return this.height * this.unit * 3;
		}
	},
	methods: {
		drawBackGrid() {
			let ctx = this.$refs.backGrid.getContext("2d");

			ctx.fillStyle = "rgba(200,200,200,1)";

			let _w = this.width % 2 == 0 ? this.width + 1 : this.width;
			let _h = this.height % 2 == 0 ? this.height + 1 : this.height;
			for (let i = 0; i < _w; i++) {
				for (let j = 0; j < _h; j++) {
					if ((j + i * _h) % 2) {
						ctx.fillStyle = "rgba(200,200,200,1)";
						ctx.fillRect(i, j, 1, 1);
					} else {
						ctx.fillStyle = "rgba(255,255,255,1)";
						ctx.fillRect(i, j, 1, 1);
					}
				}
			}
		},
		drawForeGrid() {
			let ctx = this.$refs.foreGrid.getContext("2d");
			let _w = this.$refs.foreGrid.width;
			let _h = this.$refs.foreGrid.height;
			let _u = _w / this.width;
			ctx.clearRect(0, 0, _w, _h);
			let _draw = () => {
				ctx.beginPath();
				for (let i = 0; i <= this.width; i++) {
					ctx.moveTo(i * _u, 0);
					ctx.lineTo(i * _u, _h);
				}
				for (let i = 0; i <= this.height; i++) {
					ctx.moveTo(0, i * _u);
					ctx.lineTo(_w, i * _u);
				}
				ctx.closePath();
				ctx.stroke();
			};
			ctx.strokeStyle = "rgba(255,255,255,1)";
			ctx.lineWidth = 5 / this.scale / (this.unit / _u);
			_draw();
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = 3 / this.scale / (this.unit / _u);
			_draw();
		}
	}
};
</script>

<style>
@import url(../../../css/index.css);
.pixel {
	image-rendering: pixelated;
	image-rendering: crisp-edges;
	image-rendering: -moz-crisp-edges;
}
</style>