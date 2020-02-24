import * as Immutable from "immutable"
let l = Immutable.List.of(new ImageData(1, 1))
l.getIn([0]).data[0] = 100
console.log(l.getIn([0]))