import helpers from '/frame/scripts/ts/app/app.helpers.js';
import { Buefy, libx, Vue, Callbacks } from '/frame/scripts/ts/browserified/frame.js';
// import { DynamicProps } from 'libx.js/src/types/interfaces';

// export default {

// };

export const PageMixin = Vue.mixin({
    created() {
        const hasHeaders = this.$options.layout?.headers != null;
        if (hasHeaders == null) return;
        if (!this.$options.layout.headers) {
            this.$options.layout.headers = {
                viewName: null,
                pageTitle: null,
                desc: null,
            };
        }
        const diff = libx.diff(this.$options.layout.headers, this.$app.layout.headers, true);
        libx.merge(this.$options.layout, diff);
        if (hasHeaders) helpers.updateMeta(this.$options.layout.headers);
    },
    methods: {
        updateMeta(values) {
            helpers.updateMeta({ ...this.$options.layout.headers, ...values });
        }

    },
});
/*
export class PageMixin extends Vue.mixin({}) {
    created() {
        const hasHeaders = this.$options.layout?.headers != null;
        if (!this.$options.layout) {
            this.$options.layout = {
                headers: {
                    viewName: null,
                    pageTitle: null,
                    desc: null,
                }
            };
        }
        libx.merge(this.$options.layout, (<any>this).$app.layout);
        if (hasHeaders) helpers.updateMeta(this.$options.layout);
    }
    methods: {
        updateMeta: function(values) {
            helpers.updateMeta({...this.$options.layout, ...values});
        }
        
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
*/