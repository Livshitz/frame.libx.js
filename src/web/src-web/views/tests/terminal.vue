<template lang="pug">
	.view.container.content.term
		div.padding20
			component(:is="dynamic")

		hr
		hr

		:markdown
			Heading level 1  
			===============

			# H1 - Main Title
			## H2 - Secondary Title
			### H3 - Sub Title
			#### H4 - Headline
			#### H5
			##### H6

			Some text,  {{ text }}

			> Dorothy followed her through many of the beautiful rooms in her castle.
			>
			>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

			--------

			1. First ~~strikethrough~~
			1. Second This <em>word</em> is italic.
			1. Third ``Use `code` in your Markdown file.``
			1. Fourth `item`
			1. Fifth `item`
			```
				<html>
					<head>
						<title>Test</title>
					</head>
			```


			::: warning
			*here be dragons*
			:::

			--------

			<mycomp></mycomp>

			--------

			- First item
			- Second item
				- Third item
				- Fourth item

			--------

			Table: Your Caption
			| Syntax | Description |
			| ----------- | ----------- |
			| Header | Title |
			| Paragraph | Text |

			--------

			- [x] Write the press release
			- [ ] Update the website
			- [ ] Contact the media

			--------

			![Tux, the Linux mascot](https://d33wubrfki0l68.cloudfront.net/e7ed9fe4bafe46e275c807d63591f85f9ab246ba/e2d28/assets/images/tux.png)

			--------


		section.section.is-hero
			.container
				.terminal-nav
					.terminal-logo
						.logo.terminal-prompt
							a.no-style(href='#') Logo
					nav.terminal-menu
						ul
							li
								a.menu-item(href='#') Item #1
							li
								a.menu-item.active(href='#') Active Item #2
							li
								a.menu-item(href='#') Item #3
				br


				h3 Lists
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
				br

				h3 Grid System
				.image-grid
					a(href='https://picsum.photos' style='border: none;')
						img(src='https://picsum.photos/200/300?random&1' width='auto' height='auto' alt='random image')
					a(href='https://picsum.photos' style='border: none;')
						img(src='https://picsum.photos/200/300?random&2' width='auto' height='auto' alt='random image')
					a(href='https://picsum.photos' style='border: none;')
						img(src='https://picsum.photos/200/300?random&3' width='auto' height='auto' alt='random image')
					a(href='https://picsum.photos' style='border: none;')
						img(src='https://picsum.photos/200/300?random&4' width='auto' height='auto' alt='random image')
					a(href='https://picsum.photos' style='border: none;')
						img(src='https://picsum.photos/200/300?random&5' width='auto' height='auto' alt='random image')
					a(href='https://picsum.photos' style='border: none;')
						img(src='https://picsum.photos/200/300?random&6' width='auto' height='auto' alt='random image')
					a(href='https://picsum.photos' style='border: none;')
						img(src='https://picsum.photos/200/300?random&7' width='auto' height='auto' alt='random image')
				br


				h3 Navigation Lists
				nav
					ul
						li
							a(href='#') Dashboard
						li
							a(href='#') Members
						li
							a(href='#') Settings
						li
							a(href='#') Profile
							ul
								li
									a(href='#') Account
								li
									a(href='#') Billing
								li
									a(href='#') Logout
				br


				h3 Grid System
				ol.terminal-toc
					li
						a(href='#') Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
					li
						a(href='#') Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
					li
						a(href='#') Aliquam tincidunt mauris eu risus.
					li
						a(href='#') Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
					li
						a(href='#') Aliquam tincidunt mauris eu risus.
				br

				h3 Blockquote
				blockquote
					p
						em This is a properly formatted blockquote, btw.
						|  Measuring
						|       programming progress by lines of code is like measuring aircraft building
						|       progress by weight.
					footer
						cite
							a(href='http://www.thegatesnotes.com') Bill Gates
				br

				
				h3 Forms
				form(action='#')
					fieldset
						legend Form legend
						.form-group
							label(for='email') Email input:
							input#email(name='email' type='email' required='' minlength='5' placeholder='test')
						.form-group
							label(for='text') Text input:
							input#text(name='text' type='text' required='' minlength='5' placeholder='test')
						.form-group
							label(for='itext') Invalid input (min-length 10):
							input#itext(name='itext' type='text' minlength='10')
						.form-group
							label(for='pw') Password input:
							input#pw(type='password' name='pw' value='password')
						.form-group
							label(for='radio') Radio input:
							input#radio(name='radio' type='radio')
						.form-group
							label(for='check') Checkbox input:
							input#check(for='check' type='checkbox')
						.form-group
							label(for='select') Select field:
							select#select(name='select')
								option  Option 01 
								option  Option 02 
						.form-group
							label(for='tarea') Textarea:
							textarea#tarea(cols='30' rows='5' name='="tarea"') Textarea text
						.form-group
							label(for='submit') Input Button:
							button#submit.btn.btn-default(type='submit' role='button' name='submit') Submit
				br

				h3 Progress Bar
				p With only an arrow
				.progress-bar
					.progress-bar-filled(style='width: 40%')
				p With a percentage showing above the arrow
				.progress-bar.progress-bar-show-percent
					.progress-bar-filled(style='width: 30%' data-filled='Loading 30%')
				p Without arrow
				.progress-bar.progress-bar-no-arrow
					.progress-bar-filled(style='width: 60%' data-filled='Loading 60%')
				br

				h3 Buttons
				button.btn.btn-default Default
				button.btn.btn-primary Primary
				button.btn.btn-error Error
				button.btn.btn-default.btn-ghost Ghost Button
				button.btn.btn-primary.btn-ghost Ghost Button
				button.btn.btn-error.btn-ghost Ghost Button
				button.btn.btn-primary.btn-block Block Level Button
				p Button Group
				.btn-group
					button.btn.btn-default.btn-ghost Left
					button.btn.btn-default.btn-ghost Middle
					button.btn.btn-default.btn-ghost Right
				br

				h3 Card
				.terminal-card
					header Card Title
					div
						| Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, quas
						| ex vero enim in doloribus officiis ullam vel nam esse sapiente velit
						| incidunt. Eaque quod et, aut maiores excepturi sint.
				br

				h3 Timeline
				.terminal-timeline
					.terminal-card
						header Card Title
						div
							| Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, quas
							| ex vero enim in doloribus officiis ullam vel nam esse sapiente velit
							| incidunt. Eaque quod et, aut maiores excepturi sint.
					.terminal-card
						header Card Title
						div
							| Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, quas
							| ex vero enim in doloribus officiis ullam vel nam esse sapiente velit
							| incidunt. Eaque quod et, aut maiores excepturi sint.
				br

				h3 Alerts
				.terminal-alert Default message
				.terminal-alert.terminal-alert-primary Primary message
				.terminal-alert.terminal-alert-error Error message
				br

				h3 Image with caption
				figure
					img.fill(src='https://picsum.photos/200/100?random&imageWithCaption' alt='Image with caption' title='Image with caption')
					figcaption Image with caption
				br

				h3 Highlight
				pre
					code.
						.hljs {
							display: block;
							overflow-x: auto;
							padding: 0.5em;
							background: var(--block-background-color);
							color: var(--font-color);
						}

						.hljs-comment,.hljs-quote {
							color: var(--secondary-color);
						}
				br

				h3 Template
				br

				h3 Table
				editable
				table(contenteditable="true")
					caption
						| Most Downloaded Movies on BitTorrent, 2011
					thead
						tr
							th Rank
							th Movie
							th Downloads
					tfoot
						tr
							th(colspan='4') torrentfreak.com
					tbody
						tr
							th 1
							td Fast Five
							td 9,260,000
						tr
							th 2
							td The Hangover II
							td 8,840,000
						tr
							th 3
							td Thor
							td 8,330,000
						tr
							th 4
							td Source Code
							td 7,910,000
						tr
							th 5
							td I Am Number Four
							td 7,670,000
						tr
							th 6
							td Sucker Punch
							td 7,200,000
						tr
							th 7
							td 127 Hours
							td 6,910,000
						tr
							th 8
							td Rango
							td 6,480,000
						tr
							th 9
							td The King’s Speech
							td 6,250,000
						tr
							th 10
							td Harry Potter and the Deathly Hallows Part 2
							td 6,030,000
				br

				hr
				H3 Editable:
				editable(v-model='editableContent')



</template>

<script lang="ts">
import { libx } from '/frame/scripts/ts/browserified/frame.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';
const hljs = (<any>window).hljs;

export default {
	layout: {
		headers: {
			pageTitle: 'Terminal',
			viewName: 'Terminal',
			// desc: 'This is my first blog post',
		}
	},
	data() {
		return {
			dynamic: '',
			dynamicComponent: {}, //helpers.lazyLoadAnonComponent('/components/prompt.vue.js', 'dynamicComp'),
			text: 'My Text',
			items: [
				{ id: 1, title: 'one' },
				{ id: 2, title: 'two' },
			],
			editableContent: 'Hello there! Edit me!',
		};
	},
	created() {
		// app.helpers.lazyLoad('/components/prompt.vue.js', 'dynamicComp');
	},
	async mounted() {
		console.log('mounted');

		const view = this.$route.query.view;

		if (view != null) {
			this.dynamic = {
				template: '<div>' + (await libx.di.modules.network.httpGetString(`/views/md/${view}.html`)) + '</div>',
				data: () => this.$data,
			};
		}

		setTimeout(hljs.highlightAll, 500);
	},
	computed: {},
};
</script>

<style lang="less" scoped>
// link(rel="stylesheet",href="./node_modules/terminal.css/dist/terminal.min.css")
// link(rel="stylesheet",href="styles/terminal-overrides.css")

:root {
	--global-font-size: 30px;
	--font-color: red;
}

.terminal-timeline .terminal-card::before {
	left: 28px !important;
}

.image-grid {
	display: grid;
	grid-template-rows: auto;
	display: grid;
	grid-gap: 1em;
	grid-template-rows: auto;
	grid-template-columns: repeat(auto-fit, minmax(calc(var(--page-width) / 12), 1fr));
}
</style>
