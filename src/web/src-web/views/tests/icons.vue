<template lang="pug">
	.view.container.content.term.ltr
		h1 Icons

		hr
		div(layout="row",ng-init="show='mdIcons'")
			button(@click="show='mdIcons'") Material Icons
			button(@click="show='iconMoon'") IconMoon

		span.icon.is-small
			i.fas.fa-minus

		//- div(v-if="show=='iconMoon'")
		//- 	h1 Icon Moon
		//- 	div(layout="row",layout-align="space-between",layout-wrap).fg-light
		//- 		div(v-for="style in icons").huge-x2.border.padding20
		//- 			.small .{{style}}
		//- 			span.icon
		//- 				i.fas(:class="style") &nbsp;
			
		//- div(v-if="show=='mdIcons'")
		//- 	h1 Material Icons
		//- 	div(layout="row",layout-align="space-between",layout-wrap).fg-light
		//- 		div(v-if="show=='mdIcons'",v-for="icon in mdIcons").huge-x2.border.padding20
		//- 			i.md-icons.huge-x3 {{icon}}
		//- 			//- i.fab(:class="style") &nbsp;
		//- 			.small {{icon}}

		.tile.is-ancestor
			div(layout="row",layout-align="space-between",layout-wrap).fg-light
				.icon-tile.tile.is-parent(v-for="style in icons").is-1
					div
						div.small .{{style}}
						div.icon
							i.fas(:class="style").fa-x2 &nbsp;
							i.fab(:class="style").fa-x2 &nbsp;
		
</template>

<script lang="ts">
export default {
	created() {},
	data() {
		return {
			icons: [],
			mdIcons: [],
			show: 'iconMoon',
		};
	},
	mounted() {
		var sSheetList = document.styleSheets;
		console.log('--------');
		for (var sSheet = 0; sSheet < sSheetList.length; sSheet++) {
			var ruleList = document.styleSheets[sSheet].cssRules;
			for (var rule = 0; rule < ruleList.length; rule++) {
				var n = (<any>ruleList[rule]).selectorText;
				if (n == null || !n.startsWith('.fa-')) continue;
				n = n.replace('::before', '');
				n = n.substr(1);
				this.icons.push(n);
			}
		}
	},
	methods: {},
	watch: {},
	computed: {},
};
</script>

<style lang="less" scoped>
@import (reference) '../../styles/essentials.less';
@import (reference) '../../styles/frame.less';
@import (reference) '../../styles/icons.less';

.icon-tile {
	text-align: center;
	.huge;
	.border;
	.padding20;
	.fa-icon;
}
</style>
