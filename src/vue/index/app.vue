<template>
<body class>
	<button @click="openFL()">openFL</button>
</body>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Frame extends Vue {
	private flChannel: BroadcastChannel;
	private drawerChannels: { [key: string]: BroadcastChannel };
	mounted() {
		window.name = "aaa";
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
	case: "close";
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