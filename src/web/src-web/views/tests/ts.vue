<template lang="pug">
	.view.container.content.term.ltr
		//- script(src='https://cdn.jsdelivr.net/npm/@tensorflow/tfjs')
		//- script(src='https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands')

		h1 TensorFlow.js Test:
		
		h3 Console:
		#console
		
</template>

<script lang="ts">
import helpers from '/frame/scripts/ts/app/app.helpers.js';

export default {
	created: ()=> {
	},
	data() {
		return {
		}
	},
	watch: {
	},
	methods: {
		async init() {
			console.log('Init!')
			const tf = await helpers.import('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs')
			console.log('2')
			const speechCommands = await helpers.import('https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands')
			console.log('3')

			let recognizer;

			function predictWord() {
				// Array of words that the recognizer is trained to recognize.
				const words = recognizer.wordLabels();
				recognizer.listen(({scores}) => {
					// Turn scores into a list of (score,word) pairs.
					scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
					// Find the most probable word.
					scores.sort((s1, s2) => s2.score - s1.score);
					console.log(scores[0]);
					document.querySelector('#console').textContent = scores[0].word;
				}, {probabilityThreshold: 0.75, includeSpectrogram: true });
			}

			async function app() {
				// '18w' (default): The 20 item vocaulbary, consisting of: 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'up', 'down', 'left', 'right', 'go', 'stop', 'yes', and 'no', in addition to 'background_noise' and 'unknown'.
				//'directional4w': The four directional words: 'up', 'down', 'left', and 'right', in addition to 'background_noise' and 'unknown'.

				recognizer = speechCommands.create('BROWSER_FFT'); // , 'directional4w');
				await recognizer.ensureModelLoaded();

				// See the array of words that the recognizer is trained to recognize.
				console.log(recognizer.wordLabels());

				predictWord();
			}

			app();
		}
	},
	computed: {
	},
	mounted() {
		this.init();
    },
}
</script>

<style lang="scss" scoped>
</style>
