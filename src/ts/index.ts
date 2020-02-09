import "core-js/stable"
import "regenerator-runtime/runtime"

import * as tf from '@tensorflow/tfjs'
import * as pic from './picture'

let rgba = (red: number, green: number, blue: number, alpha: number) => {
    return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`
}
let scale: number = 100

document.body.style["padding"] = "0"
document.body.style["margin"] = "0"
document.body.style["overflow"] = "hidden"


let canvas = document.createElement('canvas')
canvas.width = 10
canvas.height = 10

canvas.style["image-rendering"] = "pixelated"

console.log(document.body.offsetWidth)
console.log(document.body.offsetHeight)

document.body.appendChild(canvas)

let unit: number

window.onload = () => {
    unit = Number(`${canvas.style.height || canvas.style.width}`.split("px")[0]) / (canvas.width)
    if (window.innerWidth < window.innerHeight) {
        canvas.style.width = `${window.innerWidth * (scale / 100)}px`
        canvas.style.height = null
    } else {
        canvas.style.height = `${window.innerHeight * (scale / 100)}px`
        canvas.style.width = null
    }
}
window.onresize = () => {
    unit = Number(`${canvas.style.height || canvas.style.width}`.split("px")[0]) / (canvas.width)

    if (window.innerWidth < window.innerHeight) {
        canvas.style.width = `${window.innerWidth * (scale / 100)}px`
        canvas.style.height = null
    } else {
        canvas.style.height = `${window.innerHeight * (scale / 100)}px`
        canvas.style.width = null
    }
}


tf.setBackend("webgl").then(() => {
    console.log(tf.getBackend())

    const imageData = new ImageData(10, 10)

    let p = pic.setPixel(imageData)(255, 0, 255, 20)

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j <= i; j++) {
            p(i, j)
        }
    }

    tf.browser.toPixels(
        tf.browser.fromPixels(imageData, 4),
        canvas
    ).then(() => {
        // tf.browser.fromPixels(canvas, 4).print()
        console.log(tf.util.now());
    })

    canvas.onmousedown = (e) => {
        console.log(unit)
        let x = Math.floor(e.clientX / unit)
        let y = Math.floor(e.clientY / unit)
        console.log("x", x)
        console.log("y", y)

        p(x, y)

    }
    canvas.onmouseup = () => {
        tf.browser.toPixels(
            tf.browser.fromPixels(imageData, 4),
            canvas
        )
    }
    canvas.onmousemove = (e) => {
        let x = Math.floor(e.clientX / unit)
        let y = Math.floor(e.clientY / unit)
        console.log("x", x)
        console.log("y", y)

        p(x, y)

        // canvas.getContext('2d').putImageData(imageData, 0, 0)
        tf.browser.toPixels(
            tf.browser.fromPixels(imageData, 4),
            canvas
        )
    }
})