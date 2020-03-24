import * as Immutable from "immutable";
import { Component, Prop, Vue } from "vue-property-decorator";
import Layer from "./layer.vue";
@Component({
    components: {
        layer: Layer
    }
})
export default class Frame extends Vue {
    @Prop(Number)
    private width: number;

    @Prop(Number)
    private height: number;

    @Prop(Object)
    private layersURL: Immutable.List<string>;

    @Prop(Function)
    private addLayer: (layer: number) => void;

    @Prop(Function)
    private todo: (layer: number) => (type: string) => void;

    @Prop(Function)
    private todoType: (layer: number) => (type: string) => void;

    mounted() { }
}