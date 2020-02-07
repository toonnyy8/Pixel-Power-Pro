import "core-js/stable"
import "regenerator-runtime/runtime"

import * as tf from '@tensorflow/tfjs';
import { setWasmPath } from '@tensorflow/tfjs-backend-wasm';
import { wasmPath } from '../js/file'

setWasmPath(wasmPath); // or tf.wasm.setWasmPath when using <script> tags.
tf.setBackend("webgl").then(() => {
    console.log(tf.getBackend())

    tf.tidy(() => {
        tf.add(
            tf.tensor([1, 2, 3]),
            tf.tensor([4, 5, 6])
        ).print()
    })
});
// tf.setBackend('wasm').then(() => {
//     console.log(tf.getBackend())

//     tf.tidy(() => {
//         tf.add(
//             tf.tensor([1, 2, 3]),
//             tf.tensor([4, 5, 6])
//         ).print()
//     })
// });

import * as PIXI from 'pixi.js'

let app = new PIXI.Application({
    width: 24, height: 24, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
})
document.body.appendChild(app.view)

let fps = 120
app.ticker.speed = fps / 60