// import { libx, LibxJS } from 'libx.js/build/bundles/browser.essentials';
// import type { LibxJS } from 'libx.js';
import { Vue, VueRouter, libx, Buefy, type LibxJS, LogLevel } from '/frame/scripts/ts/browserified/frame.js';

libx.log.filterLevel = LogLevel.Debug;
libx.log.isShowStacktrace = true;

// import store from '/frame/scripts/ts/app/app.store.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';
import { router, registerEvents } from '/frame/scripts/ts/app/app.routes.js';
import { api } from '/frame/scripts/ts/app/app.api.js';
import { CombinedVueInstance, ExtendedVue } from 'vue/types/vue';
import { PageMixin } from '/frame/scripts/ts/helpers/page-mixin.js';
import { Log } from 'libx.js/build/modules/log';
import { UserManager } from 'libx.js/build/modules/firebase/UserManager';
import { DynamicProperties, IFirebase } from 'libx.js/build/types/interfaces';
import UMD from 'vue/types/umd';

Vue.config.productionTip = false;

// export interface ILayout {
//     headers?: {
//         viewName?: string;
//         pageTitle?: string;
//         desc?: string;
//     };
// }

export class App {
	name: string;
	api = null;
	router = null;
	firebase = null;
	layout: PageMixin = null;
	contentful = null;
	helpers: typeof helpers = null;
	originalHeaders = {
		appName: null,
		desc: null,
		pageUrl: null,
		image: null,
		appStoreId: null,
		deepLink: null,
		facebookAppId: null,
		viewName: null,
		keywords: null,
	};
	userManager: UserManager = null;

	private static _instance: App = null;;
    public static get instance(): App {
        return this._instance;
    }
    public static set instance(value: App) {
        this._instance = value;
    }

	constructor() {
		libx.log.v('frame:App:ctor');
	}

	resetHeaders() {
		this.layout.headers = libx.clone(this.originalHeaders);
		this.helpers.updateMeta(this.layout.headers);
	}

	public static async init() {
		App.instance = new App();
		libx.log.v('frame:app:init');

		App.instance.name = window.projconfig.projectCaption;
		App.instance.originalHeaders.appName = App.instance.name;
		App.instance.api = api;
		App.instance.router = router; //System.import('/frame/scripts/app.routers.js'),
		App.instance.firebase = libx.di.get<IFirebase>('firebase');
		App.instance.layout = null;
		App.instance.helpers = helpers;

		Vue.use({
			install(Vue, options) {
				Vue.prototype.$app = App.instance;
			},
		});

		// Initialize Firebase
		const firebaseApp = window.firebase.initializeApp(window.projconfig.firebaseConfig);

		// Register general dependencies:
		App.instance.firebase = new (libx.di.get('Firebase'))(firebaseApp, window.firebase);
		App.instance.firebase.firebasePathPrefix = '/' + App.instance.name.replace(/[\s\.]/g, '-') + '/';

		libx.di.register('firebase', App.instance.firebase);
		const userManager = new (libx.di.get<typeof UserManager>('UserManager'))(App.instance.firebase);
		libx.di.register('userManager', userManager);
		App.instance.userManager = userManager;
		App.instance.userManager.onSignIn.once((data) => {
			App.instance.layout.isSignedIn = data != null;
			App.instance.layout.$forceUpdate();
		});

		Vue.use(<any>Buefy, {
			defaultIconPack: 'fas',
			rtl: false,
		});

		libx.di.inject((log: Log, network, activityLog, myModule) => {
			log.isDebug = false;
			log.isShowStacktrace = true;
			log.debug('net: ', network, activityLog);
		});

		Vue.mixin(PageMixin);

		// const TestComp2 = Vue.component("test", () => {
		// 	console.log('--- test')
		// 	var p = System.import('/components/prompt.vue.js')
		// 	return p;
		// });
		// const Foo = () => import('./Foo.vue')

		// var fooComponent2 = { template: '<div>Home</div>' }

		// let fooComponent = {
		// 	data: function () {
		// 		return {
		// 			count: 0
		// 		}
		// 	},
		// 	template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
		// };

		App.instance.layout = new Vue({
			el: '#app',
			data: {
				pageTitle: null,
				isReady: true,
				isMenuActive: false,
				currentRoute: null,
				currentPath: null,
				isSupported: helpers.isBrowserSupported(),
				appName: 'frame.libx.js',
				headers: null,
				position: {
					y: 0,
					x: 0
				}
			},

			// render (h) { return h(this.ViewComponent) },
			router: router,
			// render: h => h(App)
			components: {},
		});
		App.instance.resetHeaders();

		registerEvents(App.instance, router);

		// api.listenToVersion();

		App.instance.initComponents();

		libx.di.register('app', App.instance);

		libx.log.i('frame: --- app is ready');

		return App.instance;
	}

	initComponents() {
		Vue.component('animation', helpers.lazyLoader('/components/animation.vue.js'));
		Vue.component('loader', helpers.lazyLoader('/components/loader.vue.js'));
		Vue.component('editable', helpers.lazyLoader('/components/editable.vue.js'));
		Vue.component('form-upload', helpers.lazyLoader('/components/form-upload.vue.js'));
		Vue.component('form-upload', helpers.lazyLoader('/components/form-upload.vue.js'));
		Vue.component('draggable', helpers.lazyLoader('/components/draggable.vue.js'));

		// Vue.use(store);
	}
}

export { PageMixin };