// fix "NavigationDuplicated":
import { Vue, VueRouter, libx } from '/frame/scripts/ts/browserified/frame.js';
import helpers from '/frame/scripts/ts/app/app.helpers.js';
import { App } from '.';
import { DynamicProps } from 'libx.js/build/types/interfaces';

const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};
VueRouter.prototype.replace = function push(location) {
    return originalReplace.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash,
                behavior: 'smooth',
                // , offset: { x: 0, y: 10 }
            };
        }

        if (savedPosition) return savedPosition;
        // return { x: app.layout.position.x, y: app.layout.position.y };
        if (from.path == to.path || from.matched?.[0]?.path == to.matched?.[0]?.path) return { x: app.layout.position.x, y: app.layout.position.y };
        return { x: 0, y: 0 };
    },
});

export const baseRoutes = {
    // tests
    '/tests/': { component: helpers.lazyLoader('/frame/views/tests/menu.vue.js') },
    '/tests/gantt': { component: helpers.lazyLoader('/frame/views/tests/gantt.vue.js') },
    '/tests/terminal': { component: helpers.lazyLoader('/frame/views/tests/terminal.vue.js') },
    '/tests/ts': { component: helpers.lazyLoader('/frame/views/tests/ts.vue.js') },
    '/tests/bar': { component: { template: '<div>bar</div>' } },
    '/tests/foo': { component: { template: '<div><h1>foo1</h1><test-comp>foo</test-comp></div>' } }, //TestComp2 },
    '/tests/pages': { component: helpers.lazyLoader('/frame/views/tests/pages.vue.js') },
    '/tests/view1': { component: helpers.lazyLoader('/frame/views/tests/view-1.vue.js') },
    '/tests/view2': { component: helpers.lazyLoader('/frame/views/tests/view-2.vue.js') },
    '/tests/form/:id?': { component: helpers.lazyLoader('/frame/views/tests/form.vue.js') },
    '/tests/icons': { component: helpers.lazyLoader('/frame/views/tests/icons.vue.js') },

    // misc
    '/terms': { component: helpers.lazyLoader('/frame/views/misc/terms.vue.js') },
    '/privacy': { component: helpers.lazyLoader('/frame/views/misc/privacy.vue.js') },
    '/login': { component: helpers.lazyLoader('/frame/views/misc/login.vue.js') },
    '/unsupported': { component: helpers.lazyLoader('/frame/views/misc/unsupported.vue.js') },
    '*': { component: helpers.lazyLoader('/frame/views/misc/404.vue.js') },
};

export const applyRoutes = (routesMapping: any) => {
    for (let path in routesMapping) {
        const route = routesMapping[path];
        route.path = path;
        router.addRoute(route);
    }
};

export function registerEvents(app: App, router: VueRouter) {
    router.beforeEach((to, from, next) => {
        // libx.log.v('app.routes:beforeEach');
        app.layout.position.y = window.scrollY;
        app.layout.position.x = window.scrollX;
        next();
    });
    router.afterEach((to, from) => {
        libx.log.v('app.routes:afterEach');
        if (from.matched?.[0]?.path != to.matched?.[0]?.path) app.resetHeaders();
        app.layout.currentPath = window.location.pathname;
        app.layout.currentRoute = app.router?.currentRoute?.matched[0]?.path;
        app.layout.isMenuActive = false;

        setTimeout(() => {
            window.view = to.matched[0].instances.default;
        }, 100);
    });

    // window.addEventListener('popstate', () => {
    // 	app.currentRoute = window.location.pathname;
    // });
}

libx.di.register('router', router);
