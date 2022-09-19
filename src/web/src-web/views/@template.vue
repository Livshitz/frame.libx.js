<template lang="pug">
	.view.container.content.term
		.view-intro
			:markdown
				> {{$root.headers.viewName}} - {{$root.headers.pageTitle}}
				===============
				
				{{$root.headers.desc}}

				----

		.view-content
			
</template>

<script lang="ts">
// import { libx as x } from '../scripts/ts/browserified/frame';
import { PageMixin } from '/frame/scripts/ts/app/index.js';
import { libx, Vue } from '/frame/scripts/ts/browserified/frame.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';

export default class Page extends PageMixin {
	headers: {
		viewName: '@Template',
		pageTitle: '@Template',
		desc: '@Template Description',
	}
	data() {
		return {};
	}
	created() {}
	mounted() {}
	methods: {}
	watch: {}
	computed: {}
};
</script>

<style lang="less" scoped>
@import (reference) '../styles/essentials.less';
@import (reference) '../styles/frame.less';

.view { --variable: 4px; }
.content { /* border-radius: var(--variable); border:1px solid @gray; */ }
</style>
