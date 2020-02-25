import * as PIXI from 'pixi.js'
import * as tfc from '@tensorflow/tfjs-core'
import * as Immutable from "immutable"


export class FL {
    constructor(width: number, height: number, fps: number = 15) {
        let id = privateFLs.findIndex((v) => v === null)
        id = id == -1 ? privateFLs.size : id
        Object.defineProperty(this, 'id', { get: () => id });

        this._frames = 1
        this._layers = 1
        this._width = width
        this._height = height
        this._fps = fps

        this._pictures = Immutable.List.of(Immutable.List.of(new ImageData(width, height)))
    }
    private _frames: number
    private _layers: number
    private _width: number
    private _height: number
    private _pictures: Immutable.List<Immutable.List<ImageData>>
    private _overlaps: Immutable.List<ImageData>
    private _fps: number
    private _flUIs: Array<FLUI>

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
            setFL(flUI, this)
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
}

class PrivateFL {

}

let privateFLs: Immutable.List<PrivateFL> = Immutable.List.of(null)

export class FLUI {
    constructor() {
        this._app = new PIXI.Application({ backgroundColor: 0xaaccff })

        this._thumbnail.pic.sprites = Immutable.List.of(Immutable.List.of(new PIXI.Sprite()))
        this._thumbnail.pic.container = new PIXI.Container()

        this._thumbnail.frame.sprites = Immutable.List.of(new PIXI.Sprite())
        this._thumbnail.frame.container = new PIXI.Container()

        this._thumbnail.layer.sprites = Immutable.List.of(new PIXI.Sprite())
        this._thumbnail.layer.container = new PIXI.Container()

        this._now.frame = 0
        this._now.layer = 0
    }

    _app: PIXI.Application

    _thumbnail: {
        pic: {
            container: PIXI.Container
            sprites: Immutable.List<Immutable.List<PIXI.Sprite>>
        }
        frame: {
            container: PIXI.Container
            sprites: Immutable.List<PIXI.Sprite>
        }
        layer: {
            container: PIXI.Container
            sprites: Immutable.List<PIXI.Sprite>
        }
    }
    _fl: FL
    _now: {
        frame: number
        layer: number
    }
}

let setFL = (flUI: FLUI, fl: FL) => {
    flUI._thumbnail.pic.sprites
}

let initPosition = (flUI: FLUI) => {

}

export let getPic = (fl: FL, frame: number, layer: number) => {
    let copyPic = new ImageData(fl.width, fl.height)
    copyPic.data.set(fl.pictures.getIn([frame, layer]).data.slice())
    return copyPic
}

export let setPic = (fl: FL, imageData: ImageData, frame: number, layer: number) => {
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

export let addFrame = (at: number) => {

}

export let moveFrame = (from: number, to: number) => {

}

export let removeFrame = (at: number) => {

}

export let addLayer = (at: number) => {

}

export let moveLayer = (from: number, to: number) => {
}

export let removeLayer = (at: number) => {
}

