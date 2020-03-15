<template>
<body>
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
		<img
			class="self-start pixel min-w-full h-auto rounded-r-lg shadow-lg"
			src="./ms_twbb_pc_2560x1600.png"
		/>
	</div>
	<div class="outline-none whitespace-no-wrap flex ml-64">
		<div class="flex" v-for="(layersURL,frame) in framesURLs" :key="frame">
			<div class="inline-block self-start">
				<div
					class="flex justify-center items-center cursor-pointer outline-none outline-none w-8 h-24 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl"
					v-bind:class="{'rounded-l-lg':frame==0,'ml-12':frame==0}"
				>
					<i class="text-md material-icons not-italic text-white">add</i>
				</div>
			</div>
			<frame
				class="inline-block self-start h-screen-s-56 min-h-32"
				v-bind:width="width"
				v-bind:height="height"
				v-bind:layersURL="layersURL"
				v-bind:frameURL="framesURL[frame]"
			/>
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
import Frame from "./frame.vue";

@Component({
	components: {
		frame: Frame
	}
})
export default class FL extends Vue {
	private framesURLs: Array<Array<string>> = [];
	private framesURL: Array<string> = [];

	private width: number = 10;
	private height: number = 10;
	private nowFrame: number;
	private channel: BroadcastChannel = new BroadcastChannel(window.name);
	private scrollTop = 0;
	mounted() {
		this.channel.onmessage = e => {
			let data = <MessageEventDataOfFL>e.data;
			switch (data.case) {
				case "image": {
					if (data.image.layer != -1) {
						if (!this.framesURLs[data.image.frame]) {
							this.$set(this.framesURLs, data.image.frame, []);
						}
						this.$set(
							this.framesURLs[data.image.frame],
							data.image.layer,
							data.image.url
						);
						console.log(this.framesURLs);
					} else {
						this.$set(
							this.framesURL,
							data.image.frame,
							data.image.url
						);
					}
					break;
				}
				case "size": {
					this.width = data.size.width;
					this.height = data.size.height;
					break;
				}
				case "close": {
					window.close();
					break;
				}
			}
		};
		this.channel.postMessage({ case: "opened" });

		window.onunload = () => {
			this.channel.postMessage({ case: "close" });
			window.close();
			console.log("closed");
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

	get scroll_width() {
		return {
			"min-width": `${16 + this.framesURL.length * (16 + 2) + 3 + 5}rem`
		};
	}
	// mounted() {
	// 	this.channel.onmessage = e => {
	// 		let data = <MessageEventDataOfFL>e.data;
	// 		switch (data.case) {
	// 			case "image": {
	// 				if (data.image.layer != -1) {
	// 					if (!this.frameImageDataURL[data.image.frame]) {
	// 						this.$set(
	// 							this.frameImageDataURL,
	// 							data.image.frame,
	// 							[]
	// 						);
	// 					}
	// 					this.$set(
	// 						this.frameImageDataURL[data.image.frame],
	// 						data.image.layer,
	// 						data.image.url
	// 					);
	// 					console.log(this.frameImageDataURL);
	// 				} else {
	// 					this.$set(
	// 						this.framesImageDataURL,
	// 						data.image.frame,
	// 						data.image.url
	// 					);
	// 				}
	// 				break;
	// 			}
	// 			case "size": {
	// 				this.width = data.size.width;
	// 				this.height = data.size.height;
	// 				break;
	// 			}
	// 			case "close": {
	// 				window.close();
	// 				break;
	// 			}
	// 		}
	// 	};
	// 	this.channel.postMessage({ case: "opened" });

	// 	window.onunload = () => {
	// 		this.channel.postMessage({ case: "close" });
	// 		window.close();
	// 		console.log("closed");
	// 	};

	// 	let deltaY = 0;
	// 	if (window.navigator.userAgent.indexOf("Chrome") > -1) {
	// 		(<HTMLElement>this.$refs["horizontalScroll"]).addEventListener(
	// 			"wheel",
	// 			e => {
	// 				e.preventDefault();
	// 				deltaY = (<WheelEvent>e).deltaY;
	// 				if (deltaY != 0) {
	// 					requestAnimationFrame(() => {
	// 						deltaY = (50 * deltaY) / Math.abs(deltaY);
	// 						if (!Number.isNaN(deltaY)) {
	// 							document.documentElement.scrollLeft += deltaY;
	// 						}
	// 						deltaY = 0;
	// 					});
	// 				}
	// 			}
	// 		);
	// 	} else if (window.navigator.userAgent.indexOf("Firefox") > -1) {
	// 		(<HTMLElement>this.$refs["horizontalScroll"]).addEventListener(
	// 			"wheel",
	// 			e => {
	// 				e.preventDefault();
	// 				deltaY = (<WheelEvent>e).deltaY;
	// 				if (deltaY != 0) {
	// 					requestAnimationFrame(() => {
	// 						deltaY = (50 * deltaY) / Math.abs(deltaY);
	// 						if (!Number.isNaN(deltaY)) {
	// 							document.documentElement.scrollLeft += deltaY;
	// 						}
	// 						deltaY = 0;
	// 					});
	// 				}
	// 			}
	// 		);
	// 	}

	// 	let scrollAnim = () => {
	// 		this.scrollTop = document.documentElement.scrollTop;
	// 		requestAnimationFrame(scrollAnim);
	// 	};
	// 	scrollAnim();
	// }
}

interface MessageEventDataOfFL {
	case: "image" | "size" | "close";
	image: {
		frame: number;
		layer: number;
		url: string;
	};
	size: {
		width: number;
		height: number;
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

.pixel {
	image-rendering: pixelated;
	image-rendering: crisp-edges;
	image-rendering: -moz-crisp-edges;
}

/* img {
	min-width: 100%;
	height: auto;
} */
</style>