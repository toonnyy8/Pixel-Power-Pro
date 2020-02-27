import * as Immutable from "immutable"
import eruda from "eruda"
import erudaDom from "eruda-dom"
eruda.init();
eruda.add(erudaDom)

export class FL {
    constructor() {
        let id = privateFLs.findIndex((v) => v === null)
        id = id == -1 ? privateFLs.size : id
        Object.defineProperty(this, 'id', { get: () => id })
        privateFLs = privateFLs.set(id, new PrivateFL())
    }

    dispose() {
        privateFLs = privateFLs.set(this.id, null)
    }

    id: number
}
class PrivateFL {
    counter
}

let privateFLs: Immutable.List<PrivateFL> = Immutable.List.of()

let fl = new FL()
console.log(fl.id)


let fl2 = new FL()
console.log(fl2.id)
console.log(fl.id)
let idata = new ImageData(1, 1)
interface ImmutableImageData {

}
let fl_: Immutable.Map<string, number | Immutable.List<ImageData | Immutable.List<ImageData>>>
fl_ = Immutable.Map.of(
    "a", 12,
    "b", Immutable.List.of(
        Immutable.Map.of(
            "width", idata.width,
            "height", idata.height,
            "data", Immutable.List.of(...idata.data)
        )
    )
);
let a: Immutable.List<ImageData> = <Immutable.List<ImageData>>fl_.get("b");

console.log(
    (<Immutable.List<ImageData>>fl_.get("b"))
)

class __FL {
    core: Immutable.Map<string, number | Immutable.List<ImageData | Immutable.List<ImageData>>>

    a(): number {
        return <number>this.core.get("a")
    }

    b(): Immutable.List<ImageData> {
        return (<Immutable.List<ImageData>>this.core.get("b"))
    }
}
