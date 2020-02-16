export class FL {
    constructor(width: number, height: number, frames: number, layers: number, fps: number = 15) {
        this._frames = frames
        this._layers = layers
        this._width = width
        this._height = height
        this._fps = fps

        this._pictures = new Array(this.frames)
        for (let i = 0; i < this.frames; i++) {
            this._pictures[i] = new Array(this.layers)
            for (let j = 0; j < this.layers; j++) {
                this._pictures[i][j] = null
            }
        }
    }
    _frames: number
    _layers: number
    _width: number
    _height: number
    _pictures: Array<Array<ImageData>>
    _fps: number

    get frames() {
        return this._frames
    }
    get layers() {
        return this._layers
    }
    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
    get pictures() {
        return this._pictures
    }
    get fps() {
        return this._fps
    }

    getPic(frame: number, layer: number) {
        return this.pictures[frame][layer]
    }

    addFrame(at: number) {
        let frame = new Array(this.layers).fill(null)
        this._pictures.splice(at, 0, frame)
        this._frames += 1
    }

    moveFrame(from: number, to: number) {
        let frame = this._pictures.slice(from, from + 1)[0]
        this._pictures.splice(from, 1)
        this._pictures.splice(to, 0, frame)
    }

    deleteFrame(at: number) {
        this._pictures.splice(at, 1)
        this._frames -= 1
    }

    addLayer(at) {
        for (let i = 0; i < this.frames; i++) {
            this._pictures[i].splice(at, 0, null)
        }
        this._layers += 1
    }

    moveLayer(from: number, to: number) {
        for (let i = 0; i < this.frames; i++) {
            let layer = this._pictures[i].slice(from, from + 1)[0]
            this._pictures[i].splice(from, 1)
            this._pictures[i].splice(to, 0, layer)
        }
    }

    deleteLayer(at: number) {
        for (let i = 0; i < this.frames; i++) {
            this._pictures[i].splice(at, 1)
        }
        this._layers -= 1
    }

    setFPS(fps: number) {
        this._fps = fps
    }

    setSize(width: number, height: number, dx: number = 0, dy: number = 0) {
        this._width = width
        this._height = height
        let canvas = document.createElement("canvas")
        canvas.width = this.width
        canvas.height = this.height
        let ctx = canvas.getContext("2d")
        for (let i = 0; i < this.frames; i++) {
            for (let j = 0; j < this.layers; j++) {
                if (this._pictures[i][j] != null) {
                    ctx.clearRect(0, 0, this.width, this.height)
                    ctx.putImageData(this.pictures[i][j], dx, dy)
                    this._pictures[i][j] = ctx.getImageData(0, 0, this.width, this.height)
                }
            }
        }
    }
}