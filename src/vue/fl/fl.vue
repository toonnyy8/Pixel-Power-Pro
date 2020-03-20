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
	<div class="whitespace-no-wrap flex ml-64">
		<div class="flex" v-for="(_, frame) in framesURL.size" :key="frame">
			<div class="inline-block self-start">
				<div
					class="flex justify-center items-center cursor-pointer w-8 h-24 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl"
					v-bind:class="{
                            'rounded-l-lg': frame == 0,
                            'ml-12': frame == 0
                        }"
					@click="addFrame(frame)"
				>
					<i class="text-md material-icons not-italic text-white">add</i>
				</div>
			</div>
			<frame
				class="inline-block self-start h-screen-s-56 min-h-32"
				v-bind:width="width"
				v-bind:height="height"
				v-bind:layersURL="framesURLs.get(frame)"
				v-bind:frameURL="framesURL.get(frame)"
				v-bind:addLayer="addLayer(frame)"
				v-bind:todo="todo(frame)"
				v-bind:todoType="todoType(frame)"
			/>
		</div>
		<div class="inline-block self-start">
			<div
				class="flex justify-center items-center cursor-pointer w-8 h-24 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl mr-12 rounded-r-lg"
				@click="addFrame(framesURL.toList().size)"
			>
				<i class="text-md material-icons not-italic text-white">add</i>
			</div>
		</div>
	</div>
</body>
</template>

<script lang="ts">
import * as Immutable from "immutable";
import { Component, Prop, Vue } from "vue-property-decorator";
import Frame from "./frame.vue";

@Component({
	components: {
		frame: Frame
	}
})
export default class FL extends Vue {
	private framesURLs: Immutable.List<
		Immutable.List<string>
	> = Immutable.List.of();
	private framesURL: Immutable.List<string> = Immutable.List.of();

	private width: number = 10;
	private height: number = 10;
	private nowFrame: number;
	private channel: BroadcastChannel = new BroadcastChannel(window.name);
	private scrollTop = 0;

	private Immutable = Immutable;

	private todoBuffer: Immutable.List<{
		frame: number;
		layer: number;
		type: string;
	}> = Immutable.List.of();

	mounted() {
		// 接收到控制頁訊息時的反應
		this.channel.onmessage = e => {
			let data = <MessageEventDataOfFL>e.data;
			switch (data.case) {
				case "image": {
					if (data.image.layer == -1) {
						this.framesURL = this.framesURL.setIn(
							[data.image.frame],
							data.image.url
						);
						this.framesURLs = this.framesURLs.setIn(
							[data.image.frame],
							(
								this.framesURLs.get(data.image.frame) ||
								Immutable.List.of()
							).toList()
						);
					} else {
						this.framesURLs = this.framesURLs.setIn(
							[data.image.frame, data.image.layer],
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
		// 告訴控制頁，圖層頁已準備好
		this.channel.postMessage({ case: "opened" });

		// 當圖層頁 unload 時，就向控制頁傳送 close 訊息，並關閉圖層頁
		window.onunload = () => {
			this.channel.postMessage({ case: "close" });
			window.close();
			console.log("closed");
		};

		// 當於 horizontalScroll 上發生滾動事件時，讓頁面左右滾動
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

		// 使 horizontalScroll、按鍵與展示區會隨著上下滾動而偏移
		let scrollAnim = () => {
			this.scrollTop = document.documentElement.scrollTop;
			requestAnimationFrame(scrollAnim);
		};
		scrollAnim();
	}
	addFrame(frame: number) {
		this.todoBuffer = Immutable.List.of();

		this.framesURLs = this.framesURLs.insert(frame, Immutable.List.of());
		this.framesURL = this.framesURL.insert(frame, "");
		this.channel.postMessage({
			case: "add",
			add: { frame: frame, layer: -1 }
		});
	}
	addLayer(frame: number) {
		return (layer: number) => {
			this.todoBuffer = Immutable.List.of();

			this.framesURLs = this.framesURLs.set(
				frame,
				this.framesURLs.get(frame).insert(layer, "")
			);
			this.channel.postMessage({
				case: "add",
				add: { frame: frame, layer: layer }
			});
		};
	}
	todo(frame: number) {
		return (layer: number) => {
			return (type: string) => {
				if (
					(layer == -1) /* */ !=
					(this.todoBuffer.get(0, { layer: layer }).layer == -1)
				) {
					this.todoBuffer = Immutable.List.of();
				}

				let todo = this.todoBuffer.find(todo => {
					if (todo.frame == frame && todo.layer == layer) return true;
					else return false;
				});
				let index = this.todoBuffer.indexOf(todo);
				if (index != -1) {
					this.todoBuffer = this.todoBuffer.remove(index);
				}
				if (index == -1 || todo.type != type) {
					this.todoBuffer = this.todoBuffer.push({
						frame: frame,
						layer: layer,
						type: type
					});
				}
			};
		};
	}
	todoType(frame: number) {
		return (layer: number) => {
			return (type: string) => {
				return (
					this.todoBuffer.find(todo => {
						return (
							todo.frame == frame &&
							todo.layer == layer &&
							todo.type == type
						);
					}) != undefined
				);
			};
		};
	}
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
</style>
