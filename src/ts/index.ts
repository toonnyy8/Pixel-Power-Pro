import "core-js/stable"
import "regenerator-runtime/runtime"

import * as tf from '@tensorflow/tfjs'
import * as pic from './picture'
import * as system from './system'


document.body.style["padding"] = "0"
document.body.style["margin"] = "0"
document.body.style["overflow"] = "hidden"
document.body.style["align-items"] = "center"
document.body.style["justify-content"] = "center"
document.body.style["display"] = "flex"
document.body.style["backgroundColor"] = "rgba(100, 100, 100,1)"

tf.setBackend("webgl")

window.onload = () => {
    let ss: system.ScreenSystem
    let scale: number = 100
    let width: number = 11
    let height: number = 10

    ss = system.screenSystem(
        width,
        height,
        Math.min(
            window.innerWidth / width,
            window.innerHeight / height
        )
    )

    document.body.style["width"] = `${window.innerWidth}px`
    document.body.style["height"] = `${window.innerHeight}px`
    document.body.appendChild(ss.container)

    window.onresize = () => {
        ss.unit = Math.min(
            window.innerWidth / width,
            window.innerHeight / height
        )
        document.body.style["width"] = `${window.innerWidth}px`
        document.body.style["height"] = `${window.innerHeight}px`
    }

    document.oncontextmenu = function () {
        window.event.returnValue = false; //將滑鼠右鍵事件取消
    }

    tf.ready()
        .then(() => {
            console.log(tf.getBackend())

            const imageData = new ImageData(width, height)

            let p = pic.setPixel(imageData)(255, 0, 255, 20)

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

            document.onmousedown = (e) => {
                e.preventDefault()

                let x = e.clientX
                let y = e.clientY
                let ssX = ss.x
                let ssY = ss.y
                console.log("down")
                switch (e.button) {
                    case 0: {
                        document.onmousemove = () => {
                            console.log("left")
                        }
                        break
                    }
                    case 1: {
                        document.onmousemove = () => {
                            console.log("middle")
                        }
                        break
                    }
                    case 2: {
                        document.onmousemove = (e) => {
                            console.log("right")
                            ss.setTranslate(ssX + (e.clientX - x), ssY + (e.clientY - y))
                        }
                        break
                    }
                    default: {
                    }
                }
            }
            document.onmouseup = (e) => {
                document.onmousemove = null
            }
            document.onmouseleave = (e) => {
                document.onmousemove = null
            }
            document.onwheel = (e) => {
                scale += e.deltaY > 0 ? -15 : 15;
                scale = Math.min(Math.max(scale, 50), 200)
                ss.setScale(scale / 100);
            }
        })
}


