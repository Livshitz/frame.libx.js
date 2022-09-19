<template lang="pug">
	.view.container.content.term
		.notification.is-warning.padding20
			div(layout="row", layout-align="start center")
				div.huge-x2 ⚠️&nbsp;
				div
					h2.title.word-break You browser/device is not supported!
					h4.subtitle.is-2.light.word-break(style="max-width:600px;") Please try again with modern browser or device.
</template>

<script lang="ts">
export default {};
</script>

<style lang="less" scoped>
@import (reference) '../../styles/essentials.less';
@import (reference) '../../styles/frame.less';

.section {
}
</style>
