<template>
	<div ref="root" class="overflow-x-auto w-screen h-screen">
		<div
			ref="horizontalScroll"
			class="fixed flex h-24"
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
			<div class="flex" v-for="(_, frame) in framesURLs.size" :key="frame">
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
					v-bind:addLayer="addLayer(frame)"
					v-bind:todo="todo(frame)"
					v-bind:todoType="todoType(frame)"
				/>
			</div>
			<div class="inline-block self-start">
				<div
					class="flex justify-center items-center cursor-pointer w-8 h-24 transition duration-500 ease-out bg-black hover:bg-gray-600 active:bg-gray-800 shadow-lg hover:shadow-2xl active:shadow-xl mr-12 rounded-r-lg"
					@click="addFrame(framesURLs.size)"
				>
					<i class="text-md material-icons not-italic text-white">add</i>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import FL from "./fl_";

export default FL;
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
