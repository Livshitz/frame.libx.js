<template lang="pug">
	.view.container.content.term.bg-white
		//.hero.is-fullheight-with-navbar
		.hero-body
			.container
				form
					fieldset
						legend Login/Sign-up:

						div(v-if="isLoading")
							div.loader
						div(v-else)
							h2.caption.text-center {{caption}}

							div(v-if="!isSignedIn", @submit.prevent="submit")
								div(layout="column",layout-align="space-around center")
									.control.margin-bottom20
										img.google-button(src="/frame/resources/imgs/login/sign_in_with_google.svg", @click="login('google')", alt="Sign In With Google").pointer
									.control.margin-bottom20
										img.google-button(src="/frame/resources/imgs/login/sign_in_with_facebook.svg", @click="login('facebook')", alt="Sign In With Facebook").pointer
									//- .control.margin-bottom20
										.btn.bg-yellow.fg-white(@click="step='email'") Email

									div(v-if='step=="email"').margin-top20
										.display-1.fg-dark.text-center.small ----- Or: Sign with email -----
										br
										fieldset
											legend Email:
											form(@submit.prevent="", :disabled="isBusy", @submit="login('email-signin')").text-left
												.form-group
													label.label Email:
														.control
															input(v-model='form.email', type="email", name="email", maxlength='80', autofocus, required)

												.form-group
													label.label Password:
														.control
															input(v-model='password', type="password", name="password", maxlength='80', required)
												div.text-center
													button.btn.btn-primary.my-bg.fg-blue(:disabled="isBusy", style='',type="submit").margin20 Sign In
													.btn.btn-secondary.my-bg.fg-blue(:disabled="isBusy", @click="login('email-signup')").margin20 Sign Up

									//- .control
										button.btn.btn-primary.fg-white(@click="loginAnon()") Anonymously
							div(v-if="isSignedIn",layout="column",layout-align="space-around center").margin-bottom40
								h4.margin-bottom10(v-show="$app.userManager?.data?.private?.email",v-cloak) {{$app.userManager?.data?.private?.email}}
								//- h4 You're already signed in...
								button.btn.btn-primary.bg-red.fg-white(@click="logout()") Sign Out


		//- div
			div(ng-show="step=='chooseMethod'",layout="column",layout-align="center center")
				.md-display-2.fg-dark {{ !app.userManager.data.isAnonymous ? 'Login' : 'Link Account' }}
				
				br
				md-button.fg-white.bg-red.signin-btn(ng-click="login('google')") Google
				md-button.fg-white.bg-darkBlue.signin-btn(ng-click="login('facebook')") Facebook
				md-button.fg-white.bg-gray.signin-btn(ng-click="step='signInEmail'") Email
				//- md-button.fg-white.bg-gray.signin-btn(ng-click="step='signInAnon'",ng-hide="app.userManager.data.isAnonymous") Anonymously

			div(ng-show="step=='signInEmail'").relative.text-center
				.btn-close.md-icons.huge-2x(ng-click="step='chooseMethod'") close
				.md-display-1.fg-dark Sign with email
				br
				form(ng-submit="login('email-signin')").text-left
					md-input-container.md-block
						label Email
						input(ng-model='form.email', type="email", name="email", md-maxlength='80', autofocus, md-required)
					md-input-container.md-block
						label Password
						input(ng-model='form.password', type="password", name="password", md-maxlength='80', md-required)
					div.text-center
						md-button.my-bg.fg-blue(ng-disabled="isBusy || form.newMessage.length==0", style='',type="submit").margin20 Sign in
						md-button.my-bg.fg-blue(ng-disabled="isBusy || form.newMessage.length==0", ng-click="login('email-signup')").margin20 Sign Up
		b-loading(:is-full-page='true', :active.sync='isBusy', :can-cancel='false')
</template>

<script lang="ts">
import { libx, ProxyCache } from '/frame/scripts/ts/browserified/frame.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';

const cache = new ProxyCache('login', {
	email: '',
	inviteCode: '',
}).proxy;

export default {
	data() {
		return {
			password: '',
			isBusy: true,
			isLoading: true,
			form: cache,
			step: 'email',
			isSignedIn: null,
			isInvalidCode: false,
			navback: this.$route?.query.navback,
		};
	},
	props: ['caption'],
	created() {},
	mounted() {
		const invite = this.$route?.query.invite;
		if (invite) this.form.inviteCode = invite;

		this.isSignedIn = libx.di.modules.userManager.isSignedIn();
		if (this.isSignedIn) {
			this.isBusy = false;
			this.isLoading = false;
		}

		app.userManager.onSignIn.once((data) => {
			this.isSignedIn = data != null;
			console.log('onSignIn: ', this.isSignedIn, data);
			this.isLoading = false;
			if (this.navback) this.$app.helpers.navigate(this.navback);
			// console.log('isSignedIn: ', libx.di.modules.userManager.isSignedIn());
		});
		app.userManager.onDataChanged.once(async (data) => {
			console.log('onDataChanged: ', this.isSignedIn, data);
			await libx.di.modules.dataStore.set(`/profiles/${data.id}`, {
				email: this.form.email,
				displayName: this.form.email,
				color: app.api.getRandomColor(),
			});
		});

		const fnReady = () => {
			console.log('ready');
			this.isBusy = false;
			if (libx.di.modules.userManager.isSignedIn()) {
				this.$emit('loggedIn');
			} else {
				this.isLoading = false;
				this.$forceUpdate();
			}
		};
		if (!libx.di.modules.userManager.isReady) {
			libx.di.modules.userManager.onReady.once(fnReady);
		} else {
			fnReady();
		}

		// update here to avoid overriding when loaded as a modal
		if (!helpers.isModal(this)) {
			helpers.updateMeta({...this.$app.layout.headers, ...{
				viewName: 'Login',
				pageTitle: 'Login',
				desc: '',
			}});
			this.$forceUpdate();
		}
	},
	methods: {
		async submit(ev, isCancle) {
			console.log('submitted', isCancle);
			ev.preventDefault();
			if (this.navback) this.$app.helpers.navigate(this.navback);
		},
		async loginGoogle() {
			await libx.di.modules.userManager.signInGoogle();
		},
		async loginFacebook() {
			await libx.di.modules.userManager.signInFacebook();
		},
		async loginEmail(type) {
			if (type == 'signin') {
				await libx.di.modules.userManager.signInEmail(this.form.email, this.password);
			} else {
				await libx.di.modules.userManager.signUpEmail(this.form.email, this.password);
			}
			// case "email-signup":
			// 			await app.userManager.signUpEmail($scope.form.email, $scope.form.password);
			// 			app.user.manager.onDataChanged.once(async data=>{
			// 				await libx.di.modules.dataStore.set(`/profiles/${data.id}`, {
			// 					email: $scope.form.email,
			// 					displayName: $scope.form.email,
			// 					color: app.api.getRandomColor(),
			// 				});
			// 			})
			// 		break;
			// 		case "email-signin":
			// 			await app.userManager.signInEmail($scope.form.email, $scope.form.password);
		},
		async login(type) {
			console.log('login: type: ', type);
			switch (type) {
				case 'google':
					await this.loginGoogle();
					break;
				case 'facebook':
					await this.loginFacebook();
					break;
				case 'email-signin':
					await this.loginEmail('signin');
					break;
				case 'email-signup':
					await this.loginEmail('signup');
					break;
			}

			this.$emit('loggedIn');
		},
		async logout() {
			await libx.di.modules.userManager.signOut();
		},
	},
	watch: {
	},
	computed: {},
};
</script>

<style lang="less" scoped>
@import (reference) '../../styles/essentials.less';
@import (reference) '../../styles/frame.less';

.bg-yellow {
	background-color: #ffdd00;
}
.bg-green {
	background-color: #30b32d;
}
.bg-red {
	background-color: #f03e3e;
}
.bg-blue {
	background-color: #1a95e0;
}
.bg-orange {
	background-color: #ffb700;
}
fieldset {
	@media screen and (min-width: 600px) {
		min-width: 200px;
		min-height: 200px;
	}
}
.caption {
	max-width: 400px;
	margin-bottom: 40px;
	.centered;
}
.btn {
	min-width: 200px;
}
.view {
	--variable: 4px;
}
.content {
}
</style>
