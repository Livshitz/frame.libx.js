<template lang="pug">
	div
		section.hero.is-info.is-large 
			//.is-primary.is-medium
			// Hero head: will stick at the top
			.hero-head
				nav.navbar
					.container
						.navbar-brand
							a.navbar-item
								img(src='https://bulma.io/images/bulma-type-white.png', alt='Logo')
							span.navbar-burger.burger(data-target="navbarMenuHeroA", @click="isMenuActive=!isMenuActive", :class="{ 'is-active': isMenuActive }")
								span
								span
								span
						#navbarMenuHeroA.navbar-menu(:class="{ 'is-active': isMenuActive }")
							.navbar-end
								a.navbar-item.is-active
									| Home
								a.navbar-item
									| Examples
								a.navbar-item
									| Documentation
								span.navbar-item
									a.button.is-primary.is-inverted
										span.icon
											i.fab.fa-github
										span Download
			// Hero content: will be in the middle
			.hero-body
				.container.has-text-centered
					h1.title
						| Title
					h2.subtitle
						| Subtitle
			// Hero footer: will stick at the bottom
			.hero-foot
				nav.tabs.is-boxed.is-fullwidth
					.container
						ul
							li.is-active
								a Overview
							li
								a Modifiers
							li
								a Grid
							li
								a Elements
							li
								a Components
							li
								a Layout



		h1.title View 2

		input(type="text" v-on:input="changeTitle")
		p {{ title }}
		div(v-text="message") qqq
		ol
			li(v-for="todo in todos")
				| {{ todo.text }}

		button(@click="initArr") Init array
		button(v-on:click="makeChanges()") Make changes

		h3(:class="{'some': counter % 2}", :style="{ borderColor: counter % 3 ? borderColor : ''}") Counter: {{ counter / 10 }} | {{ counter2 }}
		div
			span(v-bind:attr="counter")
			span  | 
			span(:attr="counter")
		button(v-on:click="increase()") Increase Counter

		div
			.columns
				.column 1
				.column 2
				.column 3
				.column 4
				.column 5
				.column 6
				.column 7

		div(v-for="item in items")
			div {{ item.string }} | {{ item.rand }}

		hr
		button(v-on:click="test(title, $event)") Test

		hr

		my-inline-template

		br
		br

</template>

<script lang="ts">
import { libx } from '/frame/scripts/ts/browserified/frame.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';

export default {
	created: ()=> {
		helpers.lazyLoadAnonComponent('/components/my-inline-template.vue.js', 'my-inline-template');
	},
	mounted() {
		helpers.toast('helper test');
	},
	data() {
		return {
			currentRoute: window.location.pathname,
			title: 'Hello world!',
			isMenuActive: false,
			message: 'Msg',
			todos: [
				{
					text: 'A'
				},
				{
					text: 'B'
				},
				{
					text: 'C'
				},
			],
			items: [],
			counter: 0,
			borderColor: 'green',
		}
	},
	computed: {
        dynamicComponent() {
            switch(this.counter % 3) {
                case 0: return app.dynamicComp; 
                case 1: return fooComponent; 
                case 2: return fooComponent2; 
            }
            // return this.counter % 2 ? fooComponent : fooComponent2; //  TestComp;
            // return this.counter % 2 ? fooComponent : fooComponent2;
        },
        counter2: function () {
            return this.counter * 10;
        },
        ViewComponent() {
            return app.routes[this.currentRoute] || NotFound
        }
	},
	watch: {
        counter: function (newValue) {
            console.log('watch-counter, new value: ', newValue, this.counter);
        },
        '$route'(to, from) {
            console.log('$route: ', to, from)
        },
    },
    methods: {
        test(title) {
            console.log(title)
        },
        increase() {
            this.counter += 1;
        },
        makeChanges(count) {
            count = count || this.items.length;
            for (var i = 0; i <= count - 1; i++) {
                this.items[i].string = libx.randomNumber(9999);
            }
        },
        changeTitle(ev) {
            console.log(`---| ${this.title} | ${ev.target.value}`)
            let newVal = ev.target.value;
            this.title = newVal;
            this.message = libx.randomNumber(999);
        },
        goBack() {
            window.history.length > 1
                ? this.$router.go(-1)
                : this.$router.push('/')
		},
		initArr($ev, count = 1000) {
			var arr = libx._.range(0, count);
			var arr = [];
			libx._.range(0, count).forEach(i => arr.push({
				id: i,
				string: i.toString(),
				rand: libx.randomNumber(9999),
			}));

			//- angular.element('[ng-controller="testCtrl"]').scope().arr = arr;
			return this.items = arr;
		}
	},
}
</script>

<style lang="css">
</style>
