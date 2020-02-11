export let createCanvas = (width: number, height: number) => {
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    canvas.style["image-rendering"] = "pixelated"
    canvas.style["image-rendering"] = "crisp-edges"

    canvas.style["position"] = "absolute"
    canvas.style["width"] = "100%"
    canvas.style["height"] = "100%"

    return canvas
}