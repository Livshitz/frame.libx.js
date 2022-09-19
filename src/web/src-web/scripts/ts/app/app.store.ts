// import Vue = require('vue/types/umd');
// import Vue from 'vue';
// declare const Vue: Vue;

import { Vue, libx } from '/frame/scripts/ts/browserified/frame.js';

const store = {
    debug: true,
    state: Vue.observable(<any>{
        profile: null,
        showGameHeader: true,
        test: 1,
    }),
    actions: {
        getProfile: async (id) => {
            const profile = await libx.di.modules['firebase'].get(`/profiles/${id}`);
            // store.state.profile = profile;
            // store.state.profile = Object.assign({}, store.state.profile, profile);
            global.Vue.set(store.state, 'profile', profile);
            return store.state.profile;
        },
        watchProfile: async (id) => {
            // await store.actions.getProfile(id);
            await libx.di.modules['firebase'].listen(`/profiles/${id}`, (data) => {
                store.state.profile = data;
            });
        },
        updateProfile: async () => {
            await libx.di.modules['firebase'].set(`/profiles/${store.state.profile._entity.id}`, store.state.profile);
        },
    },
    // ...actions,
};

export default {
    store,
    // we can add objects to the Vue prototype in the install() hook:
    install(Vue, options) {
        Vue.prototype.$appStore = store;
    },
};
