import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Layer extends Vue {
    @Prop(Number)
    private width: number;

    @Prop(Number)
    private height: number;

    @Prop(String)
    private url: string;

    @Prop(Function)
    private todo: (type: string) => void;

    @Prop(Function)
    private todoType: (type: string) => void;

    mounted() { }
}