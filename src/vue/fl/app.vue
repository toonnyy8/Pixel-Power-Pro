<template>
<body class>
	<div
		ref="horizontalScroll"
		class="fixed flex w-screen h-24"
		v-bind:style="`transform:translate(0, ${-scrollTop}px);`"
	>
		<div
			class="self-center flex justify-center cursor-pointer rounded-full w-16 h-16 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg ml-4"
		>
			<i class="self-center text-4xl material-icons not-italic text-white">delete_forever</i>
		</div>
	</div>
	<div class="h-24"></div>
	<div
		class="fixed flex rounded-r-lg w-64 h-64"
		v-bind:style="`transform:translate(0, ${-scrollTop}px);`"
	>
		<img class="self-start rounded-r-lg shadow-lg" src="./ms_twbb_pc_2560x1600.png" />
	</div>
	<div class="outline-none whitespace-no-wrap flex ml-64">
		<div class="flex" v-for="(layerImageData,frame) in frameImageData" :key="frame">
			<div class="inline-block self-start">
				<div
					class="flex justify-center items-center cursor-pointer outline-none outline-none w-8 h-24 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl"
					v-bind:class="{'rounded-l-lg':frame==0,'ml-12':frame==0}"
				>
					<i class="text-md material-icons not-italic text-white">add</i>
				</div>
			</div>
			<div class="inline-block self-start h-screen-s-56 min-h-32">
				<div class="flex justify-center bg-gray-500 w-64 h-24 shadow-lg">
					<div
						class="self-center flex justify-center cursor-pointer outline-none outline-none rounded-full w-8 h-8 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl mr-4"
					>
						<i class="self-center text-md material-icons not-italic text-white">reply</i>
					</div>
					<div class="self-center flex items-center bg-gray-500 w-24 h-24 shadow-md">
						<img :src="toURL(framesImageData[frame])" />
					</div>
					<div
						class="self-center flex justify-center cursor-pointer outline-none outline-none rounded-full w-8 h-8 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg ml-4"
					>
						<i class="self-center text-md material-icons not-italic text-white">filter_none</i>
					</div>
				</div>
				<div class="w-64 h-auto max-h-full overflow-x-hidden overflow-y-auto rounded-b-lg shadow-lg">
					<div v-for="(imageData,layer) in layerImageData" :key="layer">
						<div
							class="flex justify-center cursor-pointer outline-none outline-none w-64 h-6 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg"
						>
							<i class="text-md material-icons not-italic text-white">add</i>
						</div>
						<div class="flex justify-center bg-gray-500 w-64 h-24 shadow-md">
							<div
								class="self-center flex justify-center cursor-pointer outline-none outline-none rounded-full w-8 h-8 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg mr-4"
							>
								<i class="self-center text-md material-icons not-italic text-white">reply</i>
							</div>
							<div class="self-center flex items-center bg-gray-500 w-24 h-24 shadow-md">
								<img :src="toURL(imageData)" />
							</div>
							<div
								class="self-center flex justify-center cursor-pointer outline-none outline-none rounded-full w-8 h-8 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg ml-4"
							>
								<i class="self-center text-md material-icons not-italic text-white">filter_none</i>
							</div>
						</div>
					</div>
					<div
						class="flex justify-center cursor-pointer outline-none outline-none w-64 h-6 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg"
					>
						<i class="text-md material-icons not-italic text-white">add</i>
					</div>
				</div>
				<div class="h-4"></div>
			</div>
		</div>
		<div class="inline-block self-start">
			<div
				class="flex justify-center items-center cursor-pointer outline-none outline-none w-8 h-24 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl mr-12 rounded-r-lg"
			>
				<i class="text-md material-icons not-italic text-white">add</i>
			</div>
		</div>
	</div>
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
		[new ImageData(100, 10), new ImageData(100, 10)],
		[new ImageData(100, 10)],
		[new ImageData(100, 10)],
		[new ImageData(100, 10)],
		[new ImageData(100, 10), new ImageData(100, 10), new ImageData(100, 10)]
	];
	private framesImageData: Array<ImageData> = [
		new ImageData(100, 10),
		new ImageData(100, 10),
		new ImageData(100, 10),
		new ImageData(100, 10),
		new ImageData(100, 10),
		new ImageData(100, 10),
		new ImageData(100, 10)
	];
	private canvas: HTMLCanvasElement = document.createElement("canvas");
	private width: number;
	private height: number;
	private nowFrame: number;
	private channel: BroadcastChannel = new BroadcastChannel(
		`${window.name}-frame&layer`
	);
	private scrollTop = 0;
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

		let deltaY = 0;
		if (window.navigator.userAgent.indexOf("Chrome") > -1) {
			(<HTMLElement>this.$refs["horizontalScroll"]).addEventListener(
				"wheel",
				e => {
					e.preventDefault();
					deltaY = (<WheelEvent>e).deltaY;
					if (deltaY != 0) {
						requestAnimationFrame(() => {
							deltaY = (50 * deltaY) / Math.abs(deltaY);
							if (!Number.isNaN(deltaY)) {
								document.documentElement.scrollLeft += deltaY;
							}
							deltaY = 0;
						});
					}
				}
			);
		} else if (window.navigator.userAgent.indexOf("Firefox") > -1) {
			(<HTMLElement>this.$refs["horizontalScroll"]).addEventListener(
				"wheel",
				e => {
					e.preventDefault();
					deltaY = (<WheelEvent>e).deltaY;
					if (deltaY != 0) {
						requestAnimationFrame(() => {
							deltaY = (50 * deltaY) / Math.abs(deltaY);
							if (!Number.isNaN(deltaY)) {
								document.documentElement.scrollLeft += deltaY;
							}
							deltaY = 0;
						});
					}
				}
			);
		}

		let scrollAnim = () => {
			this.scrollTop = document.documentElement.scrollTop;
			requestAnimationFrame(scrollAnim);
		};
		scrollAnim();
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
@import url(../../css/icon.css);
</style>
<style scoped>
::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-track {
	background-color: rgba(0, 78, 131, 0.288);
}

::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: rgb(0, 165, 187);
}

::-webkit-scrollbar {
	width: 5px;
	height: 5px;
}

.outline-none.outline-none {
	outline: 0;
}

.h-screen-s-56 {
	height: calc(100vh - 14rem);
}

.min-h-32 {
	min-height: 8rem;
}
</style>