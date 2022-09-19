<template lang="pug">
	section.section.view.content.term
		.container
			animation.ani-confetti(:file="'/resources/animations/kittie.json'" :height='400', :options="{ speed: 0.3, loop: true, autoplay: true }", ref="ani_kittie", v-show="true", @completed="'do something'")


			h4 Tests:
			ul
				li
					router-link(to="/login") Login
				//- li
					router-link(to="/utilities/cssSqueezer") CssSqueezer
				//- li
					router-link(to="/utilities/poker-voter") PokerVoter
				//- li
					router-link(to="/tests/gantt") MasterPlan
				//- li
					router-link(to="/utilities/jira") Jira
				li
					router-link(to="/tests/terminal?view=page-1") Terminal - with page-1 md
					br
					router-link(to="/tests/terminal?view=example") Terminal - with example md
				li
					router-link(to="/tests/form") Form
				li
					router-link(to="/tests/pages") Pages
				li
					router-link(to="/tests/view1") View1
				li
					router-link(to="/tests/view2") View2
				li
					router-link(to="/tests/icons") Icons
				li
					router-link(to="/tests/test") Test
				li
					router-link(to="/tests/bar") bar
				li
					router-link(to="/tests/foo") foo
				li
					router-link(to="/tests/ts") TensorFlow.js Test
				li
					router-link(to="/unsupported") Unsupported
			
			
</template>

<script lang="ts">
import { libx } from '/frame/scripts/ts/browserified/frame.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';

export default {
	layout: {
		headers: {
			viewName: 'Menux',
			pageTitle: 'Menu',
			// desc: 'This is my first blog post',
		}
	},
	data() {
		return {};
	},
	created() { },
	mounted() {},
	methods: {},
	watch: {},
	computed: {},
};
</script>

<style lang="less" scoped>
@import (reference) '../../styles/essentials.less';
@import (reference) '../../styles/frame.less';

.view { --variable: 4px; }
.content {  }
</style>
