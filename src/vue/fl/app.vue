<template>
<body class="bg-gray-200 ml-4">
	<div v-for="(layerImageData,frame) in frameImageData" :key="frame">
		<button class="rounded h-2 w-11/12 my-1" v-bind:class="`bg-teal-${Math.abs(frame%4-2)*2+4}00`"></button>
		<div
			class="shadow-lg bg-white rounded h-auto w-11/12 whitespace-no-wrap overflow-x-visible overflow-y-hidden ddd"
		>
			<button class="w-px-72 h-px-72 border-t-2 border-b-2 border-r-2 border-black rounded-r-lg"></button>
			<div v-for="(imageData,layer) in layerImageData" :key="layer" class="inline-block">
				<button
					class="rounded w-2 h-px-72 ml-2 my-1"
					v-bind:class="`bg-orange-${Math.abs(layer%4-2)+4}00`"
				></button>
				<button class="w-px-72 h-px-72 ml-2 my-1">
					<img :src="toURL(imageData)" class="rounded border-2 border-black" />
				</button>
			</div>
			<button
				class="rounded w-2 h-px-72 ml-2 my-1 mr-2"
				v-bind:class="`bg-orange-${Math.abs(layerImageData.length%6-3)+4}00`"
			></button>
		</div>
	</div>
	<button
		class="rounded h-2 w-11/12 my-1"
		v-bind:class="`bg-teal-${Math.abs(frameImageData.length%4-2)*2+4}00`"
	></button>
</body>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Frame extends Vue {
	private frameImageData: Array<Array<ImageData>> = [
		[
			new ImageData(100, 10),
			new ImageData(100, 10),
			new ImageData(100, 10),
			new ImageData(100, 10)
		],
		[new ImageData(100, 10)],
		[new ImageData(100, 10)],
		[new ImageData(100, 10)],
		[new ImageData(100, 10)],
		[new ImageData(100, 10)],
		[new ImageData(100, 10)]
	];
	private canvas: HTMLCanvasElement = document.createElement("canvas");
	private width: number;
	private height: number;
	private channel: BroadcastChannel = new BroadcastChannel(
		`${window.name}-frame&layer`
	);

	mounted() {
		this.frameImageData;
		this.channel.onmessage = e => {
			let data = <MessageEventDataOfFL>e.data;
			switch (data.case) {
				case "images": {
					this.setImageData(data.images);
					break;
				}
				case "size": {
					this.resize(
						data.size.width,
						data.size.height,
						data.size.dx,
						data.size.dy
					);
					break;
				}
			}

			// this.channel.postMessage({
			// 	case: "images",
			// 	images: [
			// 		[new ImageData(100, 10), new ImageData(100, 10)],
			// 		[new ImageData(100, 10)]
			// 	]
			// });
		};
	}
	toURL(imageData: ImageData) {
		let ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, imageData.width, imageData.height);
		ctx.putImageData(imageData, 0, 0);

		return this.canvas.toDataURL("image/png");
	}
	resize(width: number, height: number, dx: number, dy: number) {
		this.canvas.width = width;
		this.canvas.width = width;
		let ctx = this.canvas.getContext("2d");
		for (let f = 0; f < this.frameImageData.length; f++) {
			for (let l = 0; l < this.frameImageData[f].length; l++) {
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(this.frameImageData[f][l], dx, dy);

				this.$set(
					this.frameImageData[f],
					l,
					ctx.getImageData(0, 0, width, height)
				);
			}
		}
	}
	setImageData(imageDatas: Array<Array<ImageData>>) {
		for (let f = 0; f < this.frameImageData.length; f++) {
			for (let l = 0; l < this.frameImageData[f].length; l++) {
				this.$set(this.frameImageData[f], l, imageDatas[f][l]);
			}
		}
		console.log(this.frameImageData);
	}
}

interface MessageEventDataOfFL {
	case: "images" | "size";
	images: Array<Array<ImageData>>;
	size: {
		width: number;
		height: number;
		dx: number;
		dy: number;
	};
}
</script>

<style>
@import url(../../css/index.css);
</style>
<style scoped>
::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-track {
	background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: rgb(0, 165, 187);
}

::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

.ddd::-webkit-scrollbar-track {
	background-color: rgba(0, 78, 131, 0.288);
}

.ddd::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: rgb(0, 165, 187);
}

.w-px-72 {
	width: 72px;
}

.h-px-72 {
	height: 72px;
}
</style>