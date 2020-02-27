// import * as tf from '@tensorflow/tfjs'

// class Picture {
//     constructor({
//         width,
//         height
//     }: {
//         width: number,
//         height: number
//     }) {
//         this.width = width
//         this.height = height
//     }

//     width: number
//     height: number
//     image: ImageData
// }

export let getPixel = (image: ImageData) => {
    return (x: number, y: number) => {
        let start = (image.width * y + x) * 4
        return image.data.slice(start, start + 4)
    }
}

export let setPixel = (image: ImageData) => {
    function f(x: number, y: number): (red: number, green: number, blue: number, alpha: number) => ImageData
    function f(red: number, green: number, blue: number, alpha: number): (x: number, y: number) => ImageData
    function f(...args: number[]) {
        switch (args.length) {
            case 2: {
                let x = args[0]
                let y = args[1]
                let start = (image.width * y + x) * 4
                return (red: number, green: number, blue: number, alpha: number) => {
                    image.data[start] = red
                    image.data[start + 1] = green
                    image.data[start + 2] = blue
                    image.data[start + 3] = alpha
                    return image
                }
            }
            case 4: {
                let red = args[0]
                let green = args[1]
                let blue = args[2]
                let alpha = args[3]
                return (x: number, y: number) => {
                    let start = (image.width * y + x) * 4
                    image.data[start] = red
                    image.data[start + 1] = green
                    image.data[start + 2] = blue
                    image.data[start + 3] = alpha
                    return image
                }
            }
            default: {
                console.error("args error")
                return
            }
        }

    }

    return f
}