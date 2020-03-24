
import * as Immutable from "immutable";
import * as tfc from "@tensorflow/tfjs-core";
import { Component, Prop, Vue } from "vue-property-decorator";

let a = Immutable.List.of();
console.log(a.set(0, 2).size);
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
	/* [frame, layer]
	 * layer = 0, 存放該 frame 的疊加圖
	 * 其他存放每個 layer
	 */
    private framesImageDatas: Immutable.List<
        Immutable.List<ImageData>
    > = Immutable.List.of();
    private width = 20;
    private height = 10;
    private flChannel: BroadcastChannel;
    private drawerChannels: {
        [key: string]: BroadcastChannel;
    };
    private canvas: HTMLCanvasElement = document.createElement("canvas");
    mounted() {
        {
            this.framesImageDatas = this.framesImageDatas
                .setIn([0, 0], new ImageData(this.width, this.height))
                .setIn([1, 0], new ImageData(this.width, this.height))
                .setIn([1, 1], new ImageData(this.width, this.height))
                .setIn([1, 2], new ImageData(this.width, this.height))
                .setIn([2, 0], new ImageData(this.width, this.height))
                .setIn([2, 1], new ImageData(this.width, this.height));
        }

        window.name = "aaa";
        this.resize(this.width, this.height, 0, 0);
        window.onunload = () => {
            if (this.flChannel) {
                this.flChannel.postMessage({ case: "close" });
            }
        };

        this.framesImageDatas.forEach((layerImageData, frame) => {
            overlap(layerImageData.remove(0), this.width, this.height).then(
                data => {
                    let imageData = new ImageData(this.width, this.height);
                    imageData.data.set(new Uint8ClampedArray(data));
                    this.framesImageDatas = this.framesImageDatas.setIn(
                        [frame, 0],
                        imageData
                    );
                }
            );
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
        this.framesImageDatas = this.framesImageDatas.map(layerImageData => {
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
                        this.framesImageDatas.forEach(
                            (layerImageData, frame) => {
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
                            }
                        );

                        break;
                    }
                    case "close": {
                        this.flChannel.close();
                        this.flChannel = null;
                        console.log("close");
                        break;
                    }
                    case "add": {
                        if (data.add.layer == 0) {
                            this.framesImageDatas = this.framesImageDatas.insert(
                                data.add.frame,
                                (<Immutable.List<ImageData>>(
                                    Immutable.List.of()
                                )).set(
                                    0,
                                    new ImageData(this.width, this.height)
                                )
                            );
                            this.flChannel.postMessage({
                                case: "image",
                                image: {
                                    frame: data.add.frame,
                                    layer: 0,
                                    url: this.toURL(
                                        this.framesImageDatas.getIn([
                                            data.add.frame,
                                            0
                                        ])
                                    )
                                }
                            });
                        } else {
                            this.framesImageDatas = this.framesImageDatas.set(
                                data.add.frame,
                                this.framesImageDatas
                                    .get(data.add.frame)
                                    .toList()
                                    .insert(
                                        data.add.layer,
                                        new ImageData(this.width, this.height)
                                    )
                            );
                            this.flChannel.postMessage({
                                case: "image",
                                image: {
                                    frame: data.add.frame,
                                    layer: data.add.layer,
                                    url: this.toURL(
                                        this.framesImageDatas.getIn([
                                            data.add.frame,
                                            data.add.layer
                                        ])
                                    )
                                }
                            });
                        }
                        break;
                    }
                }
            };
        }
    }
}


interface MessageEventDataOfFL {
    case: "opened" | "close" | "add";
    add: {
        frame: number;
        layer: number;
        todo: Array<{
            frame: number;
            layer: number;
            type: string;
        }>;
    };
}