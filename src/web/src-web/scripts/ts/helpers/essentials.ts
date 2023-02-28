import { type LibxJS, libx } from 'libx.js/build/bundles/browser.essentials';
import { Deferred } from 'libx.js/build/helpers';
import type Vue from 'vue';
export { default as Vue } from 'vue/dist/vue';

export { default as VueRouter } from 'vue-router';

export { default as Buefy, ToastProgrammatic as Toast } from 'buefy';
export { default as lottieWeb } from 'lottie-web';

// export { AudioPlayer } from 'libx.js/build/browser/AudioPlayer';
import { network } from 'libx.js/build/modules/Network';
libx.di.register('network', network);
import { Firebase } from 'libx.js/build/modules/firebase/FirebaseModule';
libx.di.register('Firebase', Firebase);

import { DataStore } from 'libx.js/build/modules/DataStore.js';
libx.di.register('DataStore', DataStore);
libx.di.register('dataStore', DataStore.init());

import { FireProxy } from 'libx.js/build/modules/firebase/FireProxy';
libx.di.register('FireProxy', FireProxy);
import { ProxyCache } from 'libx.js/build/modules/ProxyCache';
libx.di.register('ProxyCache', ProxyCache);
import DeepProxy from 'libx.js/build/modules/DeepProxy';
libx.di.register('DeepProxy', DeepProxy);
import { Cache } from 'libx.js/build/modules/Cache';
libx.di.register('Cache', Cache);
import { SHA1, Crypto } from 'libx.js/build/modules/Crypto';
libx.di.register('Crypto', Crypto);
import { UserManager } from 'libx.js/build/modules/firebase/UserManager';
libx.di.register('UserManager', UserManager);
import Request from 'libx.js/build/modules/Request';
libx.di.register('Request', Request);
import { Callbacks } from 'libx.js/build/modules/Callbacks';
libx.di.register('Callbacks', Callbacks);

libx.log.isShowStacktrace = true;
libx.log.isBrowser = true;

window.libx = libx;

export { libx, SHA1, type LibxJS, Deferred, FireProxy, ProxyCache, Callbacks, Cache, Firebase, DataStore };

export { LogLevel } from 'libx.js/build/modules/log';
