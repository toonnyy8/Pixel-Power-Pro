<template>
	<div class="flex justify-center bg-gray-500 w-64 h-24 shadow-lg">
		<div
			class="self-center flex justify-center cursor-pointer rounded-full w-8 h-8 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl mr-4"
		>
			<i class="self-center text-md material-icons not-italic text-white">reply</i>
		</div>
		<div class="self-center flex justify-center cursor-pointer bg-gray-500 w-24 h-24 shadow-md">
			<img
				class="self-center pixel"
				v-bind:class="{
								'min-w-full':width>=height,
								'min-h-full':width<=height,
								'w-auto':width>height,
								'h-auto':width<height
							}"
				:src="url"
			/>
		</div>
		<div
			class="self-center flex justify-center cursor-pointer rounded-full w-8 h-8 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl ml-4"
		>
			<i class="self-center text-md material-icons not-italic text-white">filter_none</i>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Layer extends Vue {
	@Prop(Number)
	private width: number;

	@Prop(Number)
	private height: number;

	@Prop(String)
	private url: string;
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