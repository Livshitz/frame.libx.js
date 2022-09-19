<template lang="pug">
	div

		ul
			li This is a list item
			li So is this - there could be more
			li
				| Make sure to style list items to:
				ul
					li Not forgetting child list items
					li Not forgetting child list items
					li Not forgetting child list items
					li Not forgetting child list items
			li A couple more
			li Top-level list items


		section.section.is-hero
			.container
				.columns.is-vcentered
					.column.is-6.is-5-fullhd.is-offset-1-fullhd
						.section-header
							h1.title.is-spaced
								| The bedtime story
								span.is-hidden-touch
									br
								|  app for families
							h2.subtitle.is-3
								| Awaken the inner storyteller with diverse and empowering stories for young & old. Storytelling has never been easier.
							.field.is-grouped
								.control
									a.button.is-primary.is-medium(href='#platform') How does it work?
								.control
									a.button.is-light.is-medium(href='/library') 📚 Explore Library
							hr.spacer.is-1-5
							a.has-tint.has-text-weight-semibold(href='http://www.parents-choice.org/product.cfm?product_id=35555', target='_blank')
								i.icon.icon-award
								span Parents' Choice Approved App
					.column.is-6
						.section-media
							img(role='presentation', src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTADOKvvA8ztGgxKVwfk6B1irgrCoYFA9qngm5JqrYBp6WIYBAnIQ65Gn_FIAs3KWWcGhM&usqp=CAU´')
							p
								small
									a(href='/library/karlotta-the-knight')
										u Karlotta the Knight
									|  with her squire and steed.



		h1.title HELLO - View 1

		h1.some Lazy load component
		//- test-comp

		hr

		mycomp

		hr

		//- div.border.bg-gray
			//- h3 dynamicComponent: 
			//- component(v-bind:is="dynamicComponent")
</template>

<script lang="ts">
import helpers from '/frame/scripts/ts/app/app.helpers.js';

export default {
	layout: {
		headers: {
			pageTitle: 'Test',
			// desc: 'This is my first blog post',
		}
	},
	created: () => {
		// app.helpers.lazyLoad('/components/prompt.vue.js', 'dynamicComp');
	},
	computed: {},
	data() {
		return {
			dynamicComponent: {}, //helpers.lazyLoadAnonComponent('/components/prompt.vue.js', 'dynamicComp'),
			items: [
				{ id: 1, title: 'one' },
				{ id: 2, title: 'two' },
			],
		};
	},
};
</script>

<style lang="css"></style>
