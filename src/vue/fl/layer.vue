<template>
	<div class="flex justify-center bg-gray-500 w-64 h-24 shadow-lg">
		<div
			class="self-center flex justify-center cursor-pointer rounded-full w-8 h-8 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl mr-4"
			@click="todo('move')"
			v-bind:class="{'bg-green-600':todoType('move'), 'hover:bg-green-400':todoType('move'), 'active:bg-green-200':todoType('move')}"
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
			@click="todo('copy')"
			v-bind:class="{'bg-green-600':todoType('copy'), 'hover:bg-green-400':todoType('copy'), 'active:bg-green-200':todoType('copy')}"
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

	@Prop(Function)
	private todo: (type: string) => void;

	@Prop(Function)
	private todoType: (type: string) => void;

	mounted() {}
}
</script>

<style>
@import url(../../css/index.css);
@import url(../../css/icon.css);
</style>
<style scoped>
.pixel {
	image-rendering: pixelated;
	image-rendering: crisp-edges;
	image-rendering: -moz-crisp-edges;
}
</style>
