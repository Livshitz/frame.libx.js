import { libx } from '/frame/scripts/ts/browserified/frame.js';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList || null;

// const libx: LibxJS.ILibxJS = require('libx.js');
// const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;

type Result = { [text: string]: number };

export class SpeechRecognizer {
    private _recognizer: typeof window.SpeechRecognition;
    private _running = false;
    private _onCapture: (text, confidence) => boolean;
    public autoRestart = false;
    public onInterim: (results: Result) => void;
    public isListeningActive = true;

    constructor(private onStart?: () => void, private onEnd?: () => void, private onSoundChange?: (hasSound: boolean) => void) {
        this._recognizer = new window.SpeechRecognition();
        this._recognizer.continuous = false;
        this._recognizer.interimResults = true;
        this._recognizer.lang = 'he-IL';
        this._recognizer.maxAlternatives = 100;
        // this.recognizer.grammars.addFromString('אלף');

        // var speechRecognitionList = new window.SpeechGrammarList();
        // var grammar =
        // 	'#JSGF V1.0; grammar letters; public <letter> = aleph | alef;';
        // var grammar =
        // 	'#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;';
        // speechRecognitionList.addFromString(grammar, 1);
        // this._recognizer.grammars = speechRecognitionList;

        this._recognizer.onstart = () => {
            // this.recognizer.recognizing = true;
            console.log('start');
            this._running = true;
            if (this.onSoundChange) this.onSoundChange(false);
            if (this.onStart) this.onStart();
        };

        this._recognizer.onsoundstart = (event) => {
            console.log('on sound start');
            if (this.onSoundChange) this.onSoundChange(true);
        };

        this._recognizer.onsoundend = (event) => {
            console.log('on sound end');
            if (this.onSoundChange) this.onSoundChange(false);
        };

        this._recognizer.onaudiostart = (event) => {
            console.log('on audio start');
            // if (this.onSoundChange) this.onSoundChange(true);
        };

        this._recognizer.onaudioend = (event) => {
            console.log('on audio end');
            // if (this.onSoundChange) this.onSoundChange(false);
        };

        this._recognizer.onspeechstart = (event) => {
            console.log('on speech start');
            if (this.onSoundChange) this.onSoundChange(true);
        };

        this._recognizer.onspeechend = (event) => {
            console.log('on speech end');
            if (this.onSoundChange) this.onSoundChange(false);
        };

        this._recognizer.onnomatch = (event) => {
            console.log('on no match');
            if (this.onSoundChange) this.onSoundChange(false);
        };

        this._recognizer.onend = (event) => {
            console.log('on end');
            if (this.onSoundChange) this.onSoundChange(false);

            if (this.autoRestart) {
                console.log('** on end - restart');
                return this.restart();
            }

            this._running = false;
            if (this.onEnd) this.onEnd();
        };

        this._recognizer.onresult = (event) => {
            if (!this.isListeningActive) {
                console.log('* ignoring results', event);
                return;
            }
            console.log('on result', event.results.length);

            const allResults: Result = {};
            let topResult: SpeechRecognitionAlternative = null;
            for (let res of event.results) {
                for (let alternation of res) {
                    allResults[alternation.transcript] = alternation.confidence;
                    if (topResult == null || alternation.confidence > topResult.confidence) topResult = alternation;
                }
            }

            if (this.onInterim) this.onInterim(allResults);

            for (let key of Object.keys(allResults)) {
                const shouldStop = this._onCapture(key, allResults[key]);
                if (shouldStop) break;
            }

            console.log('-- top result: ', topResult.transcript, topResult.confidence, allResults);

            // for (var i = event.resultIndex; i < event.results.length; ++i) {
            // 	var result = event.results[i][0];
            // 	results[result.confidence] = result.transcript;
            // }

            // console.log('-- results: ', results, event.results);
            // const topConfidence = Object.keys(results).sort()[0];
            // const topResult = results[topConfidence];

            // this._onCapture(topResult, topConfidence);

            /*
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (this._running == false) {
					this.stop();
					return;
				}

				var result = event.results[i][0];
				if (this.onInterim) this.onInterim(result.transcript, result.confidence);
				// if (this._onCapture && result.confidence > 0.3)

				// if (event.results[i].isFinal) {
				// 	// if (!this.running) return;
				// 	if (result.confidence < 0.3) {
				// 		console.log('Unrecognized result - Please try again', result);
				// 	} else {
				// 		console.log('Result: ', { value: result.transcript, confidence: result.confidence });
				// 		// this._running = false;
				// 		return;
				// 	}
				// } else {
				// 	if (result.confidence > 0.8) {
				// 		if (this._recognizer.continuous == false) {
				// 			this._recognizer.stop();
				// 			this._running = false;
				// 		}
				// 		// this._onCapture(result.transcript, result.confidence);
				// 		return;
				// 	}
				// 	interim_transcript += result.transcript;
				// 	console.log(`Did you said? -> "${result.transcript}" (conf: ${result.confidence}) , If not then say something else...`);
				// 	// this.onCapture(result.transcript, result.confidence);
				// }
			}
			*/
        };

        this._recognizer.onerror = function (event) {
            // console.log('Something went wrong. Try reloading the page.', event);
        };

        this._recognizer.onnomatch = function (event) {
            console.log('no match');
        };
    }

    public static test() {
        console.log('test!');
    }

    public listen(onCapture: (text, confidence) => boolean) {
        this._onCapture = onCapture;
        this.start();
    }

    public listenToOneResult(onCapture: (text, confidence) => void, confidenceThreshold?: number) {
        this._onCapture = (text, confidence) => {
            if (confidenceThreshold && confidence < confidenceThreshold) return false;
            onCapture(text, confidence);
            this.stop();
            return true;
        };
        this.start();
    }

    public listenUntilMatch(possibilities: string[], onCapture?: (text, confidence) => void, _onSoundChange?: SpeechRecognizer['onSoundChange']): Promise<any> {
        const p = libx.newPromise();
        if (_onSoundChange) this.onSoundChange = _onSoundChange;

        this._onCapture = (text, confidence) => {
            console.log('listenUntilMatch:_onCapture: ', text, confidence);
            const phrase = text.trim();
            const words = phrase.split(' ');
            let found = null;

            if (possibilities.contains(phrase)) {
                found = phrase;
            } else {
                for (let word of words) {
                    if (possibilities.contains(word)) {
                        found = word;
                    }
                }
            }

            if (found != null) {
                p.resolve(found);
                if (onCapture) onCapture(found, confidence);
                this.stop();
                return true;
            } else {
                if (words.length >= 3) this.restart();
            }
        };
        this.start();

        return p;
    }

    public start() {
        try {
            this._recognizer.start();
        } catch (err) {
            console.warn(err);
        }
    }

    public addKnownWords(words: string[]) {
        for (let word of words) {
            this._recognizer.grammars.addFromString(word, 1);
        }
    }

    public changeActive(val: boolean) {
        console.log('SpeechRecognizer:changeActive: ', val);
        this.isListeningActive = val;
        this._recognizer.continuous = val;
    }

    public stop() {
        try {
            this._recognizer.abort();
            this._recognizer.stop();
        } catch (err) {
            console.warn(err);
        }
    }

    public restart() {
        this.stop();
        setTimeout(() => {
            this.start();
        }, 100);
    }
}
