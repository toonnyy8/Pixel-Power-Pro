class FL {
    constructor(width: number, height: number, frames: number, layers: number) {
        this._frames = frames
        this._layers = layers
        this._width = width
        this._height = height

        this._pictures = new Array(this.frames)
        for (let i = 0; i < this.frames; i++) {
            this._pictures[i] = new Array(this.layers)
            for (let j = 0; j < this.layers; j++) {
                this._pictures[i][j] = new ImageData(this.width, this.height)
            }
        }
        this._pictures
    }
    _frames: number
    _layers: number
    _width: number
    _height: number
    _pictures: Array<Array<ImageData>>

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

    moveFrame(from: number, to: number) {
        let frame = this._pictures.slice(from, from + 1)[0]
        this._pictures.splice(from, 1)
        this._pictures.splice(to, 0, frame)
    }

    deleteFrame(at: number) {
        this._pictures.splice(at, 1)
        this._frames -= 1
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
}