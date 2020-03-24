import * as Immutable from "immutable";
import { Component, Prop, Vue } from "vue-property-decorator";
import Frame from "./frame.vue";

@Component({
    components: {
        frame: Frame
    }
})
export default class FL_ extends Vue {
    private framesURLs: Immutable.List<
        Immutable.List<string>
    > = Immutable.List.of();

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
                    this.framesURLs = this.framesURLs.set(
                        data.image.frame,
                        (
                            this.framesURLs.get(data.image.frame) ||
                            Immutable.List.of()
                        )
                            .toList()
                            .set(data.image.layer, data.image.url)
                    );
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
        (<HTMLElement>this.$refs["root"]).addEventListener("wheel", e => {
            if (
                (<WheelEvent>e).clientY <
                (<HTMLElement>this.$refs["horizontalScroll"]).offsetHeight -
                (<HTMLElement>this.$refs["root"]).scrollTop
            ) {
                console.log((<HTMLElement>this.$refs["root"]).scrollTop);
                e.preventDefault();
                deltaY = (<WheelEvent>e).deltaY;
                if (deltaY != 0) {
                    requestAnimationFrame(() => {
                        deltaY = (50 * deltaY) / Math.abs(deltaY);
                        if (!Number.isNaN(deltaY)) {
                            (<HTMLElement>(
                                this.$refs["root"]
                            )).scrollLeft += deltaY;
                        }
                        deltaY = 0;
                    });
                }
            }
        });

        // 使 horizontalScroll、按鍵與展示區會隨著上下滾動而偏移
        let scrollAnim = () => {
            this.scrollTop = (<HTMLElement>this.$refs["root"]).scrollTop;
            requestAnimationFrame(scrollAnim);
        };
        scrollAnim();
    }
    addFrame(frame: number) {
        this.framesURLs = this.framesURLs.insert(
            frame,
            (<Immutable.List<string>>Immutable.List.of()).set(0, "")
        );
        this.channel.postMessage({
            case: "add",
            add: { frame: frame, layer: 0, todo: this.todoBuffer.toArray() }
        });
        this.todoBuffer = Immutable.List.of();
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
                    (layer == 0) /* */ !=
                    (this.todoBuffer.get(0, { layer: layer }).layer == 0)
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