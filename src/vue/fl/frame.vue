<template>
	<div class>
		<layer
			v-bind:width="width"
			v-bind:height="height"
			v-bind:url="layersURL.get(0)"
			v-bind:todo="todo(0)"
			v-bind:todoType="todoType(0)"
		></layer>
		<div class="w-64 h-auto max-h-full overflow-x-hidden overflow-y-auto rounded-b-lg shadow-lg">
			<div v-for="layer in (layersURL.size-1)" :key="layer">
				<div
					class="flex justify-center cursor-pointer w-64 h-6 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg"
					@click="addLayer(layer)"
				>
					<i class="text-md material-icons not-italic text-white">add</i>
				</div>
				<layer
					v-bind:width="width"
					v-bind:height="height"
					v-bind:url="layersURL.get(layer)"
					v-bind:todo="todo(layer)"
					v-bind:todoType="todoType(layer)"
				></layer>
			</div>
			<div
				class="flex justify-center cursor-pointer w-64 h-6 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-xs hover:shadow-xl active:shadow-lg"
				@click="addLayer(layersURL.size)"
			>
				<i class="text-md material-icons not-italic text-white">add</i>
			</div>
		</div>
		<div class="h-4"></div>
	</div>
</template>

<script lang="ts">
import * as Immutable from "immutable";
import { Component, Prop, Vue } from "vue-property-decorator";
import Layer from "./layer.vue";
@Component({
	components: {
		layer: Layer
	}
})
export default class Frame extends Vue {
	@Prop(Number)
	private width: number;

	@Prop(Number)
	private height: number;

	@Prop(Object)
	private layersURL: Immutable.List<string>;

	@Prop(Function)
	private addLayer: (layer: number) => void;

	@Prop(Function)
	private todo: (layer: number) => (type: string) => void;

	@Prop(Function)
	private todoType: (layer: number) => (type: string) => void;

	mounted() {}
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
</style>
