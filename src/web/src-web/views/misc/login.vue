<template lang="pug">
	.view.container.content.term
		form(v-if="!isSignedIn", @submit.prevent="submit")
			fieldset
				legend Login
				.field.is-grouped
					.control
						button.btn.btn-primary.fg-white(@click="loginGoogle()") Sign In With Google
		div(v-else)
			h4 You're already signed in...
			button.btn.btn-primary.bg-red.fg-white(@click="logout()") Sign Out
</template>

<script lang="ts">
import { libx } from '/frame/scripts/ts/browserified/frame.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';

export default {
	layout: {
		headers: {
			viewName: 'Login',
			pageTitle: 'Blog - Hello World',
			desc: 'This is my first blog post',
		}
	},
	data() {
		return {
			isSignedIn: null,
		};
	},
	created() {	},
	mounted() {
		this.isSignedIn = libx.di.modules.userManager.isSignedIn();
		libx.di.modules.userManager.onSignIn.once(data=>{
			this.isSignedIn = data != null;
			console.log('onSignIn: ', this.isSignedIn, data);

			helpers.identifyUser(data.public.id, data.public.displayName, data.private.email, { profilePic: data.public.profilePicUrl });
			// console.log('isSignedIn: ', libx.di.modules.userManager.isSignedIn());
		});
	},
	methods: {
		async submit(ev, isCancle) {
			console.log('submitted', isCancle);
			ev.preventDefault();
		},
		async loginGoogle() {
			await libx.di.modules.userManager.signInGoogle();
		},
		async logout() {
			await libx.di.modules.userManager.signOut();
		},
	},
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
