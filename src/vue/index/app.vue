<template>
<body class>
	<button @click="openFL()">openFL</button>
</body>
</template>

<script lang="ts">
import * as Immutable from "immutable";
import * as tfc from "@tensorflow/tfjs-core";
import { Component, Prop, Vue } from "vue-property-decorator";

let overlap = (
	layerImageDate: Immutable.List<ImageData>,
	width: number,
	height: number
) => {
	let overlapPixels = tfc.tidy(() => {
		return layerImageDate.reduceRight((reduction, value) => {
			return tfc.tidy(() => {
				let pixels = tfc.browser.fromPixels(<ImageData>value, 4);
				let alpha = tfc.div<tfc.Tensor3D>(
					pixels.slice([0, 0, 3], [height, width, 1]),
					255
				);

				let reductionAlpha = tfc.div<tfc.Tensor3D>(
					reduction.slice([0, 0, 3], [height, width, 1]),
					255
				);

				return tfc.add<tfc.Tensor3D>(
					tfc.mul<tfc.Tensor3D>(pixels, alpha),
					tfc.mul<tfc.Tensor3D>(
						tfc.mul<tfc.Tensor3D>(reduction, reductionAlpha),
						tfc.sub<tfc.Tensor3D>(1, alpha)
					)
				);
			});
		}, tfc.zeros([height, width, 4]));
	});

	return overlapPixels.data().then(data => {
		overlapPixels.dispose();
		return data;
	});
};

@Component
export default class Frame extends Vue {
	private frameImageData: Immutable.List<
		Immutable.List<ImageData>
	> = Immutable.List.of(
		// Immutable.List.of(new ImageData(10, 10), new ImageData(10, 10)),
		// Immutable.List.of(new ImageData(10, 10)),
		// Immutable.List.of(new ImageData(10, 10)),
		// Immutable.List.of(new ImageData(10, 10)),
		// Immutable.List.of(new ImageData(10, 10)),
		// Immutable.List.of(new ImageData(10, 10)),
		Immutable.List.of(new ImageData(20, 10))
	);
	private framesImageData: Immutable.List<ImageData> = Immutable.List.of();
	private width = 20;
	private height = 10;
	private flChannel: BroadcastChannel;
	private drawerChannels: {
		[key: string]: BroadcastChannel;
	};
	private canvas: HTMLCanvasElement = document.createElement("canvas");
	mounted() {
		window.name = "aaa";
		this.resize(this.width, this.height, 0, 0);
		window.onunload = () => {
			if (this.flChannel) {
				this.flChannel.postMessage({ case: "close" });
			}
		};

		this.frameImageData.forEach((layerImageData, frame) => {
			overlap(layerImageData, this.width, this.height).then(data => {
				let imageData = new ImageData(this.width, this.height);
				imageData.data.set(new Uint8ClampedArray(data));
				this.framesImageData = this.framesImageData.setIn(
					[frame],
					imageData
				);
			});
		});
	}
	toURL(imageData: ImageData) {
		let ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, imageData.width, imageData.height);
		ctx.putImageData(imageData, 0, 0);
		console.log(this.canvas);
		return this.canvas.toDataURL("image/png");
	}
	resize(width: number, height: number, dx: number, dy: number) {
		this.canvas.width = width;
		this.canvas.height = height;
		let ctx = this.canvas.getContext("2d");
		this.frameImageData = this.frameImageData.map(layerImageData => {
			return layerImageData.map(imageData => {
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(imageData, dx, dy);
				return ctx.getImageData(0, 0, width, height);
			});
		});
	}
	openFL() {
		if (this.flChannel != null) {
			window.open("", `${window.name}-frame&layer`).focus();
		} else {
			window.open("./fl.html", `${window.name}-frame&layer`).focus();
			this.flChannel = new BroadcastChannel(`${window.name}-frame&layer`);
			this.flChannel.onmessage = e => {
				let data = <MessageEventDataOfFL>e.data;
				switch (data.case) {
					case "opened": {
						this.flChannel.postMessage({
							case: "size",
							size: {
								width: this.width,
								height: this.height
							}
						});
						this.frameImageData.forEach((layerImageData, frame) => {
							layerImageData.forEach((imageData, layer) => {
								this.flChannel.postMessage({
									case: "image",
									image: {
										frame: frame,
										layer: layer,
										url: this.toURL(imageData)
									}
								});
								console.log("image");
							});
						});
						this.framesImageData.forEach((imageData, frame) => {
							this.flChannel.postMessage({
								case: "image",
								image: {
									frame: frame,
									layer: -1,
									url: this.toURL(imageData)
								}
							});
						});

						break;
					}
					case "close": {
						this.flChannel.close();
						this.flChannel = null;
						console.log("close");
						break;
					}
				}
			};
		}
	}
}

interface MessageEventDataOfFL {
	case: "opened" | "close";
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