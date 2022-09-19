<template lang="pug">
	section.section.view.content.term
		.container
			p.margin20 - Pages
			div(v-for="page in pages").margin-bottom40
				h3 {{ page.fields.title }}
				p(v-html="page.html")

				br
				div(v-for="address in page.fields.address") איזור: 
					span.tag.is-primary.is-light {{ address }}

				div(v-for="area in page.fields.deliveryAreas") איזורי משלוח: 
					span.tag.is-info.is-light {{ area }}

				div(v-for="phone in page.fields.phones") טלפון: 
					span.tag.is-light {{ phone }}

				br
				button.button.is-primary(@click="imagesCyrcleRight(page)") Next
				.columns
					div.column.pic
						img(:src="page.fields.images[page.curImageIndex].fields.file.url")
					//- div.column.image(v-for="image in page.fields.images")
					//- 	img(:src="image.fields.file.url")
				//- div {{ page.fields.content }}
				//- p(v-html="sanitize(page.html)")


				//- p {{ page.fields }}

				hr

</template>

<script lang="ts">
export default {
	created () {
	},
	mounted () {
		this.getPages();
	},
	data() {
		return {
			pages: [],
		}
	},
	methods: {
		sanitize(html) {
			return sanitizeHtml(html);
		},
		async getPages() {
			this.pagesQuery = await app.contentful.getEntries({ content_type: 'ad' });
			this.pages = this.pagesQuery.items;
			for(let page of this.pages) {
				page.html = app.helpers.renderContentful(page.fields.description);
				this.$set(page, 'curImageIndex', 0);
			}
		},
		imagesCyrcleRight(page) {
			page.curImageIndex = (page.curImageIndex+1) % page.fields.images.length;
		},
		imagesCyrcleLeft(page) {
			page.curImageIndex = (page.curImageIndex-1) % page.fields.images.length;
		},
	},
	computed: {
	},
	watch: {
    },
}
</script>


<style lang="scss" scoped>
	$color: #ffdd57;
	.section { border: 1px solid $color; }
	.box { background-color: green; }
</style>