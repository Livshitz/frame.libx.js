import helpers from '/frame/scripts/ts/app/app.helpers.js';
import { Buefy, libx, Vue, Callbacks } from '/frame/scripts/ts/browserified/frame.js';
// import { DynamicProps } from 'libx.js/src/types/interfaces';

// export default {

// };

export class PageMixin extends Vue.mixin({}) {
    created() {
        console.log('-------- PageMixin');
        const { layout } = this.$options;
        if (layout == null) return;

        // libx.merge(this.$app.layout, layout);

        // helpers.updateMeta(this.$app.layout.headers);
    }

    curProject?: string;
    appName: string;
    isSignedIn: boolean;
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
    isReady: boolean;
    onReady: Callbacks;
    $route: any;
    $buefy: any;
}
