// declare module "*.vue" {
// 	import Vue from 'vue'
// 	export default Vue
// }

import { ILibxBrowser } from 'libx.js/build/bundles/browser.essentials';
import { System } from 'typescript';
import { App } from './app';

// import { LibxJS } from "./browserified";
// import type { LibxJS } from 'libx.js';

// import App from "./Main";

// declare var app: any;
export {};

declare var sanitizeHtml: Function;
declare const System: System;

interface String {
    test();
}

// declare var require: typeof libx.browser.require;

declare global {
    declare var sanitizeHtml: Function;
    declare var app: App;

    interface Window {
        webkitSpeechRecognition: SpeechRecognition | any;
        webkitSpeechGrammarList: SpeechGrammarList | any;
        SpeechRecognition: SpeechRecognition;
        SpeechGrammarList: SpeechGrammarList;
        SpeechSynthesisUtterance: any;
        // speechSynthesis: SpeechSynthesis;
        // require<T=any>(identifier: string): Promise<T>; //typeof libx.browser.require;
        view: any;
        firebase: any;
        app: any;
        projconfig: any;
        bulmaToast: any;
        contentful: any;
        libx: ILibxBrowser;
        vuex: any;
        FS: any;
    }
}

declare namespace Vue {
    $router: any;
}

declare module NodeJS {
    interface Global {
        webkitSpeechRecognition: SpeechRecognition;
        webkitSpeechGrammarList: SpeechGrammarList;
        Vue: Vue;
    }

    // 	namespace LibxJS {
    // 		interface IDeferred<T> extends Promise<any> {
    // 			progress: any;
    // 		}
    // 	}
}

interface IDeferred {
    progress: any;
}

// declare namespace globalThis.LibxJS {
//     interface IDeferred<T> {
//         progress: any;
//     }
// }
