<template lang="pug">
.view.container.content.term.hero.is-fullheight-with-navbar
	// Hero head: will stick at the top
	.hero-head
		
	// Hero content: will be in the middle
	.hero-body
		.has-text-centered.main-slogan.centered
			h1.title.bolder.prompt.marked-primary liv.tools
			h2.subtitle.lighter by Elya Livshitz

	div(primary-green)

	// Hero footer: will stick at the bottom
	.hero-foot
		
		//- nav.tabs.is-boxed.is-fullwidth
			.container
				ul
					li.is-active
						a Overview
					li
						a Modifiers
					li
						a Grid
					li
						a Elements
					li
						a Components
					li
						a Layout
										
</template>

<script lang="ts">
import { PageMixin } from '/frame/scripts/ts/app/index.js';

export default class Page extends PageMixin {
	layout: {
		headers: {
			pageTitle: 'FRAME: Elya Livshitz\'s Personal Website: tools, utilities, libraries and blog',
			desc: 'Handful collection of self-made tools, utilities, libraries and my personal blog',
		}
	}
	data() {
		return {
		};
	}
	created() {}
	mounted() {}
	methods: {}
	watch: {}
	computed: {}
}
</script>

<style lang="less" scoped>
@import (reference) '../styles/essentials.less';
@import (reference) '../styles/frame.less';

.main-slogan h1 { font-size:68px; .bolder }

@media screen and (max-width: 599px) {
	
}
</style>
