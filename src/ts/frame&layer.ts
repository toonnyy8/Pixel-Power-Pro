import * as PIXI from 'pixi.js'

export class FL {
    constructor(width: number, height: number, frames: number, layers: number, fps: number = 15) {
        this._frames = frames
        this._layers = layers
        this._width = width
        this._height = height
        this._fps = fps
        this._flUIs = []

        this._pictures = new Array(this.frames)
        for (let f = 0; f < this.frames; f++) {
            this._pictures[f] = new Array(this.layers)
            for (let l = 0; l < this.layers; l++) {
                this._pictures[f][l] = null
            }
        }
    }
    _frames: number
    _layers: number
    _width: number
    _height: number
    _pictures: Array<Array<ImageData>>
    _fps: number
    _flUIs: Array<FLUI>

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

    registerUI(flUI: FLUI) {
        if (this._flUIs.find((_flUI) => _flUI === flUI) === undefined) {
            this._flUIs.push(flUI)
            flUI._FL_setFL(this)
        }
    }

    deregisterUI(flUI: FLUI) {
        let at = 0
        if (this._flUIs.find(
            (_flUI, _idx) => {
                if (_flUI === flUI) {
                    at = _idx
                    return true
                } else {
                    return false
                }
            }
        ) !== undefined) {
            this._flUIs.splice(at, 1)
        }
    }

    getPic(frame: number, layer: number) {
        let copyPic = new ImageData(this.width, this.height)
        copyPic.data.set(this.pictures[frame][layer].data.slice())
        return copyPic
    }

    setPic(imageData: ImageData, frame: number, layer: number) {
        this._pictures[frame][layer] = imageData

        this._flUIs.forEach(_flUI => {
            _flUI._FL_setSprite(this._pictures[frame][layer], frame, layer)
        })
    }

    addFrame(at: number) {
        {
            let frame = new Array(this.layers).fill(null)
            this._pictures.splice(at, 0, frame)
        }

        this._flUIs.forEach(_flUI => {
            let frame = new Array(this.layers).fill(null).map(() => new PIXI.Sprite())
            _flUI._sprites.splice(at, 0, frame)
        })

        this._frames += 1
    }

    moveFrame(from: number, to: number) {
        if (from != to) {
            {
                let frame = this._pictures.slice(from, from + 1)[0]
                this._pictures.splice(from, 1)
                this._pictures.splice(to, 0, frame)
            }

            this._flUIs.forEach(_flUI => {
                let frame = _flUI._sprites.slice(from, from + 1)[0]
                _flUI._sprites.splice(from, 1)
                _flUI._sprites.splice(to, 0, frame)
            })

        }
    }

    deleteFrame(at: number) {
        this._pictures.splice(at, 1)

        this._flUIs.forEach(_flUI => {
            let frame = _flUI._sprites.splice(at, 1)[0]
            frame.forEach(_sprite => _sprite.destroy({ children: true, texture: true, baseTexture: true }))
        })

        this._frames -= 1
    }

    addLayer(at: number) {
        for (let f = 0; f < this.frames; f++) {
            this._pictures[f].splice(at, 0, null)

            this._flUIs.forEach(_flUI => {
                _flUI._sprites[f].splice(at, 0, new PIXI.Sprite())
            })
        }
        this._layers += 1
    }

    moveLayer(from: number, to: number) {
        if (from != to) {
            for (let f = 0; f < this.frames; f++) {
                {
                    let layer = this._pictures[f].slice(from, from + 1)[0]
                    this._pictures[f].splice(from, 1)
                    this._pictures[f].splice(to, 0, layer)
                }
                this._flUIs.forEach(_flUI => {
                    let layer = _flUI._sprites[f].slice(from, from + 1)[0]
                    _flUI._sprites[f].splice(from, 1)
                    _flUI._sprites[f].splice(to, 0, layer)
                })
            }
        }
    }

    deleteLayer(at: number) {
        for (let f = 0; f < this.frames; f++) {
            this._pictures[f].splice(at, 1)

            this._flUIs.forEach(_flUI => {
                let layer = _flUI._sprites[f].splice(at, 1)[0]
                layer.destroy({ children: true, texture: true, baseTexture: true })
            })
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
        for (let f = 0; f < this.frames; f++) {
            for (let l = 0; l < this.layers; l++) {
                if (this._pictures[f][l] != null) {
                    ctx.clearRect(0, 0, this.width, this.height)
                    ctx.putImageData(this.pictures[f][l], dx, dy)
                    this._pictures[f][l] = ctx.getImageData(0, 0, this.width, this.height)
                    this._flUIs.forEach(_flUI => {
                        _flUI._FL_setSprite(this._pictures[f][l], f, l)
                    })
                }
            }
        }
    }
}

export class FLUI {
    constructor() {
        this._app = new PIXI.Application({ backgroundColor: 0xaaccff })

        this._sprites = []
        this._container = new PIXI.Container()
    }
    _FL_setFL(fl: FL) {
        if (this._fl) {
            this._fl.deregisterUI(this)
        }

        this._sprites.forEach(
            _layerSprites => {
                _layerSprites.forEach(
                    _sprite => {
                        _sprite.destroy({
                            children: true,
                            texture: true,
                            baseTexture: true
                        })
                    }
                )
            }
        )

        this._sprites.length = fl.frames
        for (let f = 0; f < fl.frames; f++) {
            this._sprites[f] = this._sprites[f] || []
            this._sprites[f].length = fl.layers
            for (let l = 0; l < fl.layers; l++) {
                let _texture = fl.pictures[f][l] ? PIXI.Texture.fromBuffer(
                    new Uint8Array(fl.pictures[f][l].data.buffer),
                    fl.pictures[f][l].width,
                    fl.pictures[f][l].height
                ) : null
                this._sprites[f][l] = new PIXI.Sprite(_texture)
                this._container.addChild(this._sprites[f][l])
            }
        }
        this._fl = fl
    }

    _FL_setSprite(pic: ImageData, frame: number, layer: number) {
        this._sprites[frame][layer].texture.destroy(true)
        this._sprites[frame][layer].texture = pic ? PIXI
            .Texture
            .fromBuffer(
                new Uint8Array(pic.data.buffer),
                pic.width,
                pic.height
            ) : null
    }

    bindView(element: HTMLElement) {
        this._app.resizeTo = element
        element.appendChild(this._app.view)
    }

    _app: PIXI.Application
    _container: PIXI.Container
    _sprites: Array<Array<PIXI.Sprite>>
    _fl: FL
}