import * as pic from './picture'

let createCanvas = (width: number, height: number) => {
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

export class ScreenSystem {
    constructor(width, height, unit) {
        this._width = width
        this._height = height
        this._unit = unit
        this._scale = 1
        this._x = 0
        this._y = 0

        this.canvases = {
            backGrid: createCanvas(this.width, this.height),
            backLayer: createCanvas(this.width, this.height),
            render: createCanvas(this.width, this.height),
            buffer: createCanvas(this.width, this.height),
            foreLayer: createCanvas(this.width, this.height),
            mask: createCanvas(this.width, this.height),
            foreGrid: createCanvas(this.width * this.unit * 3, this.height * this.unit * 3)
        }
        this.canvases.foreGrid.style["image-rendering"] = null

        this.container = document.createElement("div")
        this.container.style["position"] = "relative"
        this.container.style.width = `${this.width * this.unit}px`
        this.container.style.height = `${this.height * this.unit}px`
        this.container.style["transform"] = `translate(${this.x}px,${this.y}px) scale(${this.scale})`

        this.container.appendChild(this.canvases.backGrid)
        this.container.appendChild(this.canvases.backLayer)
        this.container.appendChild(this.canvases.render)
        this.container.appendChild(this.canvases.buffer)
        this.container.appendChild(this.canvases.foreLayer)
        this.container.appendChild(this.canvases.mask)
        this.container.appendChild(this.canvases.foreGrid)

        this._drawBackGrid()
        this._drawForeGrid()
        console.log(this.canvases.foreGrid)
    }

    setScale(scale: number) {
        this._scale = scale
        this.container.style.transform = `translate(${this.x}px,${this.y}px) scale(${this.scale})`

        this._drawForeGrid()
    }
    setTranslate(x: number, y: number) {
        this._x = x
        this._y = y
        this.container.style.transform = `translate(${this.x}px,${this.y}px) scale(${this.scale})`
    }
    setPosition(x: number, y: number) {
        this._x = x
        this._y = y
        this.container.style.transform = `translate(${this.x}px,${this.y}px) scale(${this.scale})`
    }
    _drawBackGrid() {
        let ctx = this.canvases.backGrid.getContext("2d")

        ctx.fillStyle = "rgba(200,200,200,1)"

        let _w = this.width % 2 == 0 ? this.width + 1 : this.width
        let _h = this.height % 2 == 0 ? this.height + 1 : this.height
        for (let i = 0; i < _w; i++) {
            for (let j = 0; j < _h; j++) {
                if ((j + i * _h) % 2) {
                    ctx.fillStyle = "rgba(200,200,200,1)"
                    ctx.fillRect(i, j, 1, 1)
                } else {
                    ctx.fillStyle = "rgba(255,255,255,1)"
                    ctx.fillRect(i, j, 1, 1)
                }
            }
        }
    }
    _drawForeGrid() {
        let ctx = this.canvases.foreGrid.getContext("2d")
        ctx.clearRect(0, 0, this.width * this.unit * 3, this.height * this.unit * 3)

        ctx.fillStyle = "rgba(0,0,0,1)"
        ctx.lineWidth = 4 / this.scale

        ctx.beginPath()

        for (let i = 0; i <= this.width; i++) {
            ctx.moveTo(i * this.unit * 3, 0)
            ctx.lineTo(i * this.unit * 3, this.height * this.unit * 3)
        }
        for (let i = 0; i <= this.height; i++) {
            ctx.moveTo(0, i * this.unit * 3)
            ctx.lineTo(this.width * this.unit * 3, i * this.unit * 3)
        }
        ctx.closePath();

        ctx.stroke()
    }

    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
    get unit() {
        return this._unit
    }
    get scale() {
        return this._scale
    }
    get x() {
        return this._x
    }
    get y() {
        return this._y
    }

    set unit(unit: number) {
        this._unit = unit

        this.container.style.width = `${this.width * this.unit}px`
        this.container.style.height = `${this.height * this.unit}px`

        this._drawForeGrid()
    }

    _width: number
    _height: number
    _unit: number
    _scale: number
    _x: number
    _y: number

    container: HTMLDivElement

    canvases: {
        backGrid: HTMLCanvasElement
        backLayer: HTMLCanvasElement
        render: HTMLCanvasElement
        buffer: HTMLCanvasElement
        foreLayer: HTMLCanvasElement
        mask: HTMLCanvasElement
        foreGrid: HTMLCanvasElement
    }
}

export let screenSystem = (width: number, height: number, unit: number = 1) => {
    return new ScreenSystem(width, height, unit)
}