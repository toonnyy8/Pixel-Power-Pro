import * as PIXI from 'pixi.js'
import * as tfc from '@tensorflow/tfjs-core'

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
                this._pictures[f][l] = f - 1
            }
        }
    }
    _frames: number
    _layers: number
    _width: number
    _height: number
    _pictures: Array<Array<ImageData | number>>
    _overlaps: Array<ImageData>
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

    _FLUI_pictures() {
        return this._pictures
    }
    _FLUI_overlaps() {
        return this._overlaps
    }

    _FLUI_getKeyframe(frame: number, layer: number) {
        let keyframe = this.pictures[frame][layer]
        while (!(keyframe instanceof ImageData) && keyframe != -1) {
            keyframe = this.pictures[keyframe][layer]
        }
        keyframe = keyframe == -1 ? null : keyframe
        return <ImageData>keyframe
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
        copyPic.data.set((<ImageData>this.pictures[frame][layer]).data.slice())
        return copyPic
    }

    setPic(imageData: ImageData, frame: number, layer: number) {
        if (imageData == null) {
            this._pictures[frame][layer] = frame - 1
        } else {
            this._pictures[frame][layer] = imageData
        }

        if (this._pictures[0][layer] == -1) {
            this._pictures[0][layer] = this._pictures.findIndex((_pic) => _pic instanceof ImageData) || -1
        }



        this._flUIs.forEach(_flUI => {
            _flUI._FL_updatePicSprite(frame, layer)
            if (frame == _flUI._now.frame) {
                _flUI._FL_updateLayerThumbnail()
            }
        })
        this._updateOverlap(frame)
            .then(() => {
                this._flUIs.forEach(_flUI => {
                    _flUI._FL_updateFrameThumbnail(frame)
                })
            })
    }

    addFrame(at: number) {
        {
            let frame = new Array(this.layers).fill(at - 1)
            this._pictures.splice(at, 0, frame)
        }
        {
            this._overlaps.splice(at, 0, new ImageData(this.width, this.height))
        }

        this._flUIs.forEach(_flUI => {
            _flUI._FL_addFrame(at)
            _flUI._FL_updateFrameThumbnail()
        })

        this._frames += 1
    }

    moveFrame(from: number, to: number) {
        if (from != to) {
            {
                let frame = this._pictures.slice(from, from + 1)[0]
                this._pictures.splice(from, 1)
                this._pictures.splice(to, 0, frame)
                this._updateDefaultFrame()
            }
            {
                this._overlaps.splice(to, 0, ...this._overlaps.splice(from, 1))
            }

            this._flUIs.forEach(_flUI => {
                _flUI._FL_moveFrame(from, to)
                _flUI._FL_updateFrameThumbnail()
            })

        }
    }

    removeFrame(at: number) {
        this._pictures.splice(at, 1)
        this._overlaps.splice(at, 1)

        this._updateDefaultFrame()

        this._flUIs.forEach(_flUI => {
            _flUI._FL_removeFrame(at)
            _flUI._FL_updateFrameThumbnail()
        })

        this._frames -= 1
    }

    addLayer(at: number) {
        for (let f = 0; f < this.frames; f++) {
            this._pictures[f].splice(at, 0, null)
        }
        this._updateDefaultFrame()

        this._flUIs.forEach(_flUI => {
            _flUI._FL_addLayer(at)
            _flUI._FL_updateLayerThumbnail()
        })
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
            }
            this._updateDefaultFrame()

            this._flUIs.forEach(_flUI => {
                _flUI._FL_moveLayer(from, to)

                _flUI._FL_updateLayerThumbnail()
            })

            for (let f = 0; f < this.frames; f++) {
                this._updateOverlap(f)
                    .then(() => {
                        this._flUIs.forEach(_flUI => {
                            _flUI._FL_updateFrameThumbnail(f)
                        })
                    })
            }
        }
    }

    removeLayer(at: number) {
        for (let f = 0; f < this.frames; f++) {
            this._pictures[f].splice(at, 1)
        }
        this._updateDefaultFrame()

        this._flUIs.forEach(_flUI => {
            _flUI._FL_removeLayer(at)

            _flUI._FL_updateLayerThumbnail()
        })

        for (let f = 0; f < this.frames; f++) {
            this._updateOverlap(f)
                .then(() => {
                    this._flUIs.forEach(_flUI => {
                        _flUI._FL_updateFrameThumbnail(f)
                    })
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
                if (this._pictures[f][l] instanceof ImageData) {
                    ctx.clearRect(0, 0, this.width, this.height)
                    ctx.putImageData(<ImageData>this.pictures[f][l], dx, dy)
                    this._pictures[f][l] = ctx.getImageData(0, 0, this.width, this.height)
                    this._flUIs.forEach(_flUI => {
                        _flUI._FL_updatePicSprite(f, l)
                    })
                }
            }
        }

        this._flUIs.forEach(_flUI => {
            _flUI._FL_updateLayerThumbnail()
        })
        for (let f = 0; f < this.frames; f++) {
            this._updateOverlap(f)
                .then(() => {
                    this._flUIs.forEach(_flUI => {
                        _flUI._FL_updateFrameThumbnail(f)
                    })
                })
        }
    }

    private _updateOverlap(frame: number) {
        let _overlapPixels = tfc.tidy(() => {
            return this._pictures[frame].reduce(
                (_pixels, _pic) => {
                    return tfc.tidy(() => {
                        let pixels = tfc.browser.fromPixels(<ImageData>_pic)
                        let alpha = tfc.div<tfc.Tensor3D>(
                            pixels.slice([0, 0, 3], [this.width, this.height, 1]),
                            255
                        )

                        let _alpha = tfc.div<tfc.Tensor3D>(
                            _pixels.slice([0, 0, 3], [this.width, this.height, 1]),
                            255
                        )

                        return tfc.add<tfc.Tensor3D>(
                            tfc.mul<tfc.Tensor3D>(
                                pixels,
                                alpha
                            ),
                            tfc.mul<tfc.Tensor3D>(
                                tfc.mul<tfc.Tensor3D>(
                                    _pixels,
                                    _alpha
                                ),
                                tfc.sub<tfc.Tensor3D>(
                                    1,
                                    alpha
                                )
                            )
                        )
                    })
                },
                tfc.zeros([this.width, this.height, 4])
            )
        })

        return _overlapPixels.data()
            .then((data) => {
                this._overlaps[frame].data.set(new Uint8ClampedArray(data.buffer))

                _overlapPixels.dispose()
            })
    }

    private _updateDefaultFrame() {
        for (let f = 0; f < this.frames; f++) {
            for (let l = 0; l < this.layers; l++) {
                if (!(this._pictures[f][l] instanceof ImageData)) {
                    this._pictures[f][l] = f - 1
                }
            }
        }
        for (let l = 0; l < this.layers; l++) {
            if (this._pictures[0][l] == -1) {
                this._pictures[0][l] = this._pictures.findIndex((_pic) => _pic instanceof ImageData) || -1
            }
        }
    }
}

export class FLUI {
    constructor() {
        this._app = new PIXI.Application({ backgroundColor: 0xaaccff })

        this._pic.sprites = []
        this._pic.container = new PIXI.Container()

        this._thumbnail.frame.sprites = []
        this._thumbnail.frame.container = new PIXI.Container()

        this._thumbnail.layer.sprites = []
        this._thumbnail.layer.container = new PIXI.Container()

        this._now.frame = 0
        this._now.layer = 0
    }

    _app: PIXI.Application
    _pic: {
        container: PIXI.Container
        sprites: Array<Array<PIXI.Sprite>>
    }

    _thumbnail: {
        frame: {
            container: PIXI.Container
            sprites: Array<PIXI.Sprite>
        }
        layer: {
            container: PIXI.Container
            sprites: Array<PIXI.Sprite>
        }
    }
    _fl: FL
    _now: {
        frame: number
        layer: number
    }
    _unit: number

    get fl() {
        return this._fl
    }
    get unit() {
        return this._unit
    }

    bindView(element: HTMLElement) {
        this._app.resizeTo = element
        element.appendChild(this._app.view)
    }

    _FL_setFL(fl: FL) {
        if (this._fl) {
            this._fl.deregisterUI(this)
        }

        this._pic.sprites.forEach(
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
        this._thumbnail.frame.sprites.forEach(
            _sprite => {
                _sprite.destroy({
                    children: true,
                    texture: true,
                    baseTexture: true
                })
            }
        )
        this._thumbnail.layer.sprites.forEach(
            _sprite => {
                _sprite.destroy({
                    children: true,
                    texture: true,
                    baseTexture: true
                })
            }
        )

        this._pic.sprites.length = fl.frames
        for (let f = 0; f < fl.frames; f++) {
            this._pic.sprites[f] = this._pic.sprites[f] || []
            this._pic.sprites[f].length = fl.layers
            for (let l = 0; l < fl.layers; l++) {
                this._pic.sprites[f][l] = new PIXI.Sprite()
                this._FL_updatePicSprite(f, l)
                this._pic.container.addChild(this._pic.sprites[f][l])
            }
        }

        this._thumbnail.frame.sprites.length = fl.frames
        for (let f = 0; f < fl.frames; f++) {
            this._thumbnail.frame.sprites[f] = new PIXI.Sprite()
            this._thumbnail.frame.sprites[f].texture.destroy(true)
            this._thumbnail.frame.container.addChild(this._thumbnail.frame.sprites[f])
        }

        this._thumbnail.layer.sprites.length = fl.layers
        for (let f = 0; f < fl.layers; f++) {
            this._thumbnail.layer.sprites[f] = new PIXI.Sprite()
            this._thumbnail.layer.sprites[f].texture.destroy(true)
            this._thumbnail.layer.container.addChild(this._thumbnail.frame.sprites[f])
        }

        this._fl = fl

        this._now.frame = 0
        this._now.layer = 0
    }

    _FL_addFrame(at: number) {
        {
            let frame = new Array(this._fl.layers).fill(null).map(() => new PIXI.Sprite())
            frame.forEach(_sprite => _sprite.texture.destroy(true))
            this._pic.sprites.splice(at, 0, frame)
            this._pic.container.addChild(...frame)
        }
        {
            let frame = new PIXI.Sprite()
            this._thumbnail.frame.sprites.splice(at, 0, frame)
            this._thumbnail.frame.container.addChild(frame)
        }
    }

    _FL_moveFrame(from: number, to: number) {
        if (from != to) {
            let frame = this._pic.sprites.slice(from, from + 1)[0]
            this._pic.sprites.splice(from, 1)
            this._pic.sprites.splice(to, 0, frame)
        }
    }

    _FL_removeFrame(at: number) {
        {
            let _sprites = this._pic.sprites.splice(at, 1)[0]
            _sprites.forEach(_sprite => _sprite.destroy({ children: true, texture: true, baseTexture: true }))
        }
        {
            let _sprite = this._thumbnail.frame.sprites.splice(at, 1)[0]
            _sprite.destroy({ children: true, texture: true, baseTexture: true })
        }
    }

    _FL_addLayer(at: number) {
        for (let f = 0; f < this._fl.frames; f++) {
            let _sprite = new PIXI.Sprite()
            _sprite.texture.destroy(true)
            this._pic.sprites[f].splice(at, 0, _sprite)
            this._pic.container.addChild(_sprite)
        }
        {
            let _sprite = new PIXI.Sprite()
            _sprite.texture.destroy(true)
            this._thumbnail.layer.sprites.splice(at, 0, _sprite)
            this._thumbnail.layer.container.addChild(_sprite)
        }
    }

    _FL_moveLayer(from: number, to: number) {
        if (from != to) {
            for (let f = 0; f < this._fl.frames; f++) {
                let layer = this._pic.sprites[f].slice(from, from + 1)[0]
                this._pic.sprites[f].splice(from, 1)
                this._pic.sprites[f].splice(to, 0, layer)
            }
            {
                let layer = this._thumbnail.layer.sprites.slice(from, from + 1)[0]
                this._thumbnail.layer.sprites.splice(from, 1)
                this._thumbnail.layer.sprites.splice(to, 0, layer)
            }
        }
    }

    _FL_removeLayer(at: number) {
        for (let f = 0; f < this._fl.frames; f++) {
            let layerPic = this._pic.sprites[f].splice(at, 1)[0]
            layerPic.destroy({ children: true, texture: true, baseTexture: true })
        }

        {
            let layerPic = this._thumbnail.layer.sprites.splice(at, 1)[0]
            layerPic.destroy()
        }
    }

    _FL_updatePicSprite(frame: number, layer: number) {
        FLUI._setSprite(
            this._pic.sprites[frame][layer],
            this._fl._FLUI_getKeyframe(frame, layer),
            this.unit
        )
    }

    _FL_initPosition() {

    }

    _FL_updateFrameThumbnail(frame?: number) {
        if (frame === null || frame === undefined) {
            for (let f = 0; f < this._fl.frames; f++) {
                FLUI._setSprite(this._thumbnail.frame.sprites[f], this._fl._FLUI_overlaps()[f], this.unit)
            }
        } else {
            FLUI._setSprite(this._thumbnail.frame.sprites[frame], this._fl._FLUI_overlaps()[frame], this.unit)
        }
    }

    _FL_updateLayerThumbnail() {
        this._thumbnail.layer.sprites.forEach(
            (_sprite, l) => {
                _sprite.texture = this._pic.sprites[this._now.frame][l].texture
            }
        )
    }

    private static _setSprite(sprite: PIXI.Sprite, pic: ImageData, unit: number) {
        sprite.texture.destroy(true)
        sprite.texture = pic ? PIXI
            .Texture
            .fromBuffer(
                new Uint8Array(pic.data.buffer),
                pic.width,
                pic.height
            ) : null
        if (pic) {
            let scale = unit / Math.max(pic.width, pic.height)
            sprite.scale.x = scale
            sprite.scale.y = scale
        }
    }
}