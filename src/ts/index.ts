import "core-js/stable"
import "regenerator-runtime/runtime"

import * as tf from '@tensorflow/tfjs'
import * as pic from './picture'
import * as system from './system'

tf.setBackend("webgl")

window.onload = () => {
    let drawer = document.getElementById("drawer")

    let ss: system.ScreenSystem
    let scale: number = 100
    let width: number = 10
    let height: number = 10

    ss = system.screenSystem(
        width,
        height,
        Math.min(
            drawer.offsetWidth / width,
            drawer.offsetHeight / height
        )
    )
    drawer.appendChild(ss.container)

    window.onresize = () => {
        ss.unit = 0
        ss.unit = Math.min(
            drawer.offsetWidth / width,
            drawer.offsetHeight / height
        )
    }

    document.oncontextmenu = function () {
        window.event.returnValue = false; //將滑鼠右鍵事件取消
    }

    tf.ready()
        .then(() => {
            console.log(tf.getBackend())

            const imageData = new ImageData(width, height)

            let p = pic.setPixel(imageData)(0, 0, 0, 255)

            for (let i = 0; i < width; i++) {
                for (let j = 0; j <= i; j++) {
                    p(i, j)
                }
            }
            tf.browser.toPixels(
                tf.browser.fromPixels(imageData, 4),
                ss.canvases.render
            ).then(() => {
                // tf.browser.fromPixels(canvas, 4).print()
                console.log(tf.util.now());
            })

            drawer.onmousedown = (e) => {
                e.preventDefault()

                let x = e.clientX
                let y = e.clientY
                let ssX = ss.x
                let ssY = ss.y
                console.log("down")
                switch (e.button) {
                    case 0: {
                        drawer.onmousemove = () => {
                            console.log("left")
                        }
                        break
                    }
                    case 1: {
                        ss.showGrid(!ss.isShowGrid)
                        drawer.onmousemove = () => {
                            console.log("middle")
                        }
                        break
                    }
                    case 2: {
                        drawer.onmousemove = (e) => {
                            console.log("right")
                            ss.setTranslate(ssX + (e.clientX - x), ssY + (e.clientY - y))
                        }
                        break
                    }
                    default: {
                    }
                }
            }
            drawer.onmouseup = (e) => {
                drawer.onmousemove = null
            }
            drawer.onmouseleave = (e) => {
                drawer.onmousemove = null
            }
            drawer.onwheel = (e) => {
                scale += e.deltaY > 0 ? -15 : 15;
                scale = Math.min(Math.max(scale, 50), 200)
                ss.setScale(scale / 100);
            }
        })
}


