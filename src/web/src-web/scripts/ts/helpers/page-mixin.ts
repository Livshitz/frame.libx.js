import helpers from '/frame/scripts/ts/app/app.helpers.js';
import { libx, Vue } from '/frame/scripts/ts/browserified/frame.js';

// export default {

// };

export class PageMixin extends Vue.mixin({}) {
    created() {
        const { layout } = this.$options;
        if (layout == null) return;

        console.log('-------- PageMixin');
        debugger;

        // libx.merge(this.$app.layout, layout);

        // helpers.updateMeta(this.$app.layout.headers);
    }

    appName: string;
    headers?: {
        viewName?: string;
        pageTitle?: string;
        desc?: string;
    };
    position?: {
        x?: number;
        y?: number;
    };
    currentPath: string;
    currentRoute: string;
    isMenuActive: boolean;
}
