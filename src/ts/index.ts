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


window.onload = () => {
    if (window.innerWidth < window.innerHeight) {
        canvas.style.width = `${window.innerWidth * (scale / 100)}px`
        canvas.style.height = null
    } else {
        canvas.style.height = `${window.innerHeight * (scale / 100)}px`
        canvas.style.width = null
    }
}
window.onresize = () => {

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


})