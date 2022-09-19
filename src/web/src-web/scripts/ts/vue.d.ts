import { App } from './app';
import Vue from 'vue';

declare module '*.vue' {
    import Vue = require('vue');
    export const value: Vue.ComponentOptions<Vue>;
    export default Vue;
    declare var $app: App;
    export const $app: App;
}

declare global {
    declare var app: App;
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        layout?: {
            headers?: {
                viewName?: string;
                pageTitle?: string;
                desc?: string;
            };
        };
    }
}
