import { libx } from '/frame/scripts/ts/browserified/frame.js';
// const libx: LibxJS.ILibxJS = require('libx.js');

export class Synthesis {
    allVoices;
    allLanguages;
    primaryLanguages;
    initialSetup = true;
    selectedLangCode = 'en-us';
    selectedVoice: SpeechSynthesisVoice;
    voices = [];
    rate = 0.8;
    currentTalk: SpeechSynthesisUtterance; // here to avoid getting GC collected, ref: https://stackoverflow.com/a/55067370

    constructor(private onReady?: () => void) {
        if (window.speechSynthesis == null) throw 'Speech Synthesis not supported!';

        if (onReady) this.init();
    }

    async init() {
        const p = libx.newPromise();
        this.onReady = () => p.resolve;
        console.log('- Synthesis');
        const availableVoices = speechSynthesis.getVoices();
        if (availableVoices != null && availableVoices.length == 0) {
            // Chrome gets the voices asynchronously so this is needed
            speechSynthesis.onvoiceschanged = () => this.setUpVoices();
        } else {
            this.setUpVoices(); //for all the other browsers
        }
        return p;
    }

    async speak(text: string) {
        await this.stop();
        this.currentTalk = new SpeechSynthesisUtterance(text);
        this.currentTalk.voice = this.selectedVoice; //this.allVoices[this.selectedVoice.voiceURI];
        this.currentTalk.lang = this.currentTalk.voice.lang;
        // this.currentTalk.text = text;
        this.currentTalk.rate = this.rate;
        const p = libx.newPromise();
        this.currentTalk.onend = (event) => {
            // console.log('speechSynthesis:speak: on end');
            p.resolve();
        };

        // console.log('utterance', this.currentTalk);
        speechSynthesis.speak(this.currentTalk);
        return p;
    }

    async stop() {
        await speechSynthesis.cancel();
    }

    pause() {
        speechSynthesis.pause();
    }

    resume() {
        speechSynthesis.resume();
    }

    setUpVoices() {
        this.allVoices = this.getAllVoices();
        this.selectedVoice = this.allVoices.filter((x) => x.lang == 'he-IL')[0];
        this.allLanguages = this.getAllLanguages(this.allVoices);
        this.primaryLanguages = this.getPrimaryLanguages(this.allLanguages);
        this.voices = this.filterVoices();
        if (this.initialSetup && this.allVoices.length) {
            this.initialSetup = false;
        }
        if (this.onReady) this.onReady();
    }

    getAllLanguages(voices) {
        let langs = [];
        voices.forEach((vobj) => {
            langs.push(vobj.lang.trim());
        });
        return [...new Set(langs)];
    }

    getPrimaryLanguages(langlist) {
        let langs = [];
        langlist.forEach((vobj) => {
            langs.push(vobj.substring(0, 2));
        });
        return [...new Set(langs)];
    }

    selectLanguage() {
        this.filterVoices();
    }

    filterVoices() {
        let langcode = this.selectedLangCode;
        const voices = this.allVoices.filter(function (voice) {
            return langcode === 'all' ? true : voice.lang.indexOf(langcode + '-') >= 0;
        });
        return voices;
    }

    getAllVoices() {
        let voicesall = speechSynthesis.getVoices();
        let vuris = [];
        let voices = [];
        //unfortunately we have to check for duplicates
        voicesall.forEach(function (obj, index) {
            let uri = obj.voiceURI;
            if (!vuris.includes(uri)) {
                vuris.push(uri);
                voices.push(obj);
            }
        });
        voices.forEach(function (obj, index) {
            obj.id = index;
        });
        return voices;
    }
}
