<template lang="pug">
	.view.container.content.term
		form(@submit="submit")
			.columns
				.column
					.field
						label.label Title:
						.control
							input.input(v-model='form.title', type='text', placeholder='Text input')
					//- .field
					//- 	label.label Username
					//- 	.control.has-icons-left.has-icons-right
					//- 		input.input.is-success(type='text', placeholder='Text input', value='bulma')
					//- 		span.icon.is-small.is-left
					//- 			i.fas.fa-user
					//- 		span.icon.is-small.is-right
					//- 			i.fas.fa-check
					//- 	p.help.is-success This username is available
					//- .field
						label.label Email
						.control.has-icons-left.has-icons-right
							input.input.is-danger(type='email', placeholder='Email input', value='hello@')
							span.icon.is-small.is-left
								i.fas.fa-envelope
							span.icon.is-small.is-right
								i.fas.fa-exclamation-triangle
						p.help.is-danger This email is invalid
					//- .field
					//- 	label.label Subject
					//- 	.control
					//- 		.select
					//- 			select
					//- 				option Select dropdown
					//- 				option With options
					.field
						label.label Message:
						.control
							textarea.textarea(v-model='form.text', placeholder='Textarea')

					.field
						label.label Phone:
						.control
							input.input(v-model='form.phone', type='tel', placeholder='Phone')
					.field
						label.label Address:
						.control
							input.input(v-model='form.address', type='text', placeholder='Address')
					.field
						label.label Website:
						.control
							input.input(v-model='form.website', type='url', placeholder='Website')
					.field
						label.label Deliveries:
						.control
							label.radio
								input(v-model='form.hasDeliveries', type='radio', name='question', v-bind:value='true')
								|       Yes
							label.radio
								input(v-model='form.hasDeliveries', type='radio', name='question', v-bind:value='false')
								|       No
					.field
						label.label Delivery Areas:
						.control
							input.input(v-model='form.deliveryAreas', type='tel', placeholder='Phone')
					.field
						label.label Source:
						.control
							input.input(v-model='form.source', type='text', placeholder='Source')

					//- .field
						.control
							label.checkbox
								input(type='checkbox')
								|       I agree to the 
								a(href='#') terms and conditions

					//- .field
						.control
							.file.has-name
								label.file-label
									input.file-input(type='file', name='resume')
									span.file-cta
										span.file-icon
											i.fas.fa-upload
										span.file-label Choose a file…
									span.file-name Screen Shot 2017-07-29 at 15.54.25.png

					

					.field.is-grouped
						.control
							button.button.is-primary(type="submit") Save
						//- .control
							.button.is-link.is-light(@click="submit($event, true)") Cancel
						.control
							.button.is-link.is-danger(@click="deleteItem()") Delete


				.column
					.field
						label.label Images:
						.control
							form-upload(v-model="form.images")

						b-carousel(:pause-info='false')
							b-carousel-item(v-for='(image, i) in form.images', :key='i')
								section(:class='`hero is-medium`')
									.hero-body.has-text-centered
										//- h1.title {{image.meta.name}}
										img(:src="image.url")

</template>

<script lang="ts">
import { App, PageMixin } from '/scripts/ts/app/index.js';
import { libx, VueComponent, Vue } from '/frame/scripts/ts/browserified/frame.js';


export default {	
	layout: {},
	created: () => {},
	data() {
		return {
			form: {
				title: null,
				text: null,
				address: null,
				phone: null,
				website: null,
				hasDeliveries: null,
				deliveryAreas: null,
				createdAt: null,
				updatedAt: null,
				source: null,
				images: [],
			},
		};
	},
	watch: {
		// form() {
		// 	if (this.id == null) view.form = libx.parse(localStorage.temp);
		// }
	},
	methods: {
		async submit(ev, isCancle) {
			console.log('submitted', isCancle);
			ev.preventDefault();

			if (this.form.createdAt == null) this.form.createdAt = new Date();
			this.form.updatedAt = new Date();

			if (this.id != null) {
				let newItem = await libx.di.modules.firebase.set(`/ads/${this.id}`, this.form);
				console.log('updated', this.id);
			} else {
				let newItem = await libx.di.modules.firebase.push('/ads', this.form);
				console.log('new item:', newItem);
			}

			App.instance.helpers.goBack();
		},
		async get(id) {
			let ad = await libx.di.modules.firebase.get(`/ads/${id}`);
			this.form = { ...ad }; //Object.assign({}, this.form, ad);
		},
		async deleteItem() {
			await libx.di.modules.firebase.delete(`/ads/${this.id}`);
			console.log('Deleted item:', this.id);
			App.instance.helpers.goBack();
		},
	},
	computed: {},
	mounted() {
		console.log('mounted:', this.$route.params);
		this.id = this.$route.params.id;
		if (this.id != null) this.methods.get(this.id);
	},
}

</script>

<style lang="less">
@import (reference) '../../styles/essentials.less';
@import (reference) '../../styles/frame.less';

</style>
