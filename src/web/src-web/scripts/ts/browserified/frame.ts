// import Vue from 'vue/types/umd';

export type { LibxJS } from 'libx.js/build/bundles/browser.essentials';
import { libx } from 'libx.js/build/bundles/browser.essentials';
export { Deferred } from 'libx.js/build/helpers';
export { DataStore } from 'libx.js/build/modules/DataStore.js';

import VueDist from 'vue/dist/vue';
import { VueConstructor } from 'vue/types/umd';
import VueRouter from 'vue-router';
import VueComponent from 'vue-class-component';
import VueType from 'vue';
import _Vue from 'vue/dist/vue';
const Vue: typeof VueType = _Vue;
// import * as Buefy from 'buefy';
import Buefy from 'buefy';
export { ToastProgrammatic as Toast } from 'buefy';

export { Vue, VueComponent, VueRouter, Buefy };

export { default as snakeCase } from 'lodash/snakeCase';

// export { default as Vue } from 'vue';
// export { default as Vue } from 'vue/types/vue';
// export { default as Vue } from 'vue/dist/vue.common';
// import Vue from 'vue/dist/vue.common';
// import Vue = require('vue/dist/vue.common');
// export * as libx from 'libx.js/bundles/browser.essentials';
// import libx from 'libx.js/bundles/browser.essentials';
// import * as libx from 'libx.js/bundles/browser.essentials';
// import {  } from 'libx.js/bundles/browser.essentials';
// import libx = require('libx.js/bundles/browser.essentials');
// const Vue: Vue.VueConstructor = require('vue/dist/vue.common');

export { default as lottieWeb } from 'lottie-web';

export { LogLevel } from 'libx.js/build/modules/log';
export { ObjectIdentifiers } from 'libx.js/build/modules/ObjectIdentifiers';

// export { AudioPlayer } from 'libx.js/build/browser/AudioPlayer';

import { Firebase } from 'libx.js/build/modules/firebase/FirebaseModule';
import { network } from 'libx.js/build/modules/Network';
import { FireProxy } from 'libx.js/build/modules/firebase/FireProxy';
import { ProxyCache } from 'libx.js/build/modules/ProxyCache';
import { default as DeepProxy } from 'libx.js/build/modules/DeepProxy';
import { Cache } from 'libx.js/build/modules/Cache';
import { SHA1, Crypto } from 'libx.js/build/modules/Crypto';
import { default as Request } from 'libx.js/build/modules/Request';
import { Callbacks } from 'libx.js/build/modules/Callbacks';
import { UserManager } from 'libx.js/build/modules/firebase/UserManager';
import { DataStore } from 'libx.js/build/modules/DataStore.js';

export { libx, Firebase, network, FireProxy, ProxyCache, DeepProxy, Cache, SHA1, Crypto, Request, Callbacks, UserManager };

(() => {
    (<any>window).c = Callbacks;
    libx.di.register('Vue', Vue);
    libx.di.register('Callbacks', Callbacks);
    libx.di.register('Firebase', Firebase);
    libx.di.register('network', network);
    libx.di.register('FireProxy', FireProxy);
    libx.di.register('ProxyCache', ProxyCache);
    libx.di.register('DeepProxy', DeepProxy);
    libx.di.register('Cache', Cache);
    libx.di.register('Crypto', Crypto);
    libx.di.register('UserManager', UserManager);
    libx.di.register('Request', Request);
    libx.di.register('DataStore', DataStore);
})();

/*
export { UserManager } from 'libx.js/build/modules/firebase/UserManager';

libx.di.register('Firebase', Firebase);
libx.di.register('network', network);
libx.di.register('FireProxy', FireProxy);
libx.di.register('ProxyCache', ProxyCache);
libx.di.register('DeepProxy', DeepProxy);
libx.di.register('Cache', Cache);
libx.di.register('Crypto', Crypto);
libx.di.register('UserManager', UserManager);
libx.di.register('Request', Request);

export { libx, FireProxy, ProxyCache, Callbacks, Cache, Firebase };

libx.log.isShowStacktrace = true;
libx.log.isBrowser = true;

window.libx = libx;
*/
// import Wave from 'wave-visualizer';
// export { Wave };

// ----

// ----

// if (true || projconfig.env == 'dev')
// 	firebase.analytics();

// export interface Global {
// 	document: Document;
// 	window: Window;
//   }

//   declare var global: Global;

// declare global {
//     interface Window {
//         xxx: typeof Vue;
//     }
// }
