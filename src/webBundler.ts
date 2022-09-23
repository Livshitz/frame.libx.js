import { libx } from 'libx.js/build/bundles/node.essentials';
import { Crypto } from 'libx.js/build/modules/Crypto';
import pax from 'pax.libx.js/build';
import path from 'path';
import fs from 'fs';

libx.log.isShowStacktrace = false;
libx.node.catchErrors((err) => {
    console.log('error!', {
        message: err?.message?.toString(),
        stacK: err?.stack,
        // err
    });
});

enum Steps {
    // ALL = 1 << 0, // 0000,
    Cleanup = 1 << 1, // 0001,
    Frame = 1 << 2, // 0010,
    MainJS = 1 << 3, // 0010,
    Scripts = 1 << 4,
    TS = 1 << 5,
    Browserify = 1 << 6,
    Resources = 1 << 7,
    StyleLess = 1 << 8,
    StyleSCSS = 1 << 9,
    Vue = 1 << 10,
    Manifest = 1 << 11,
    MD = 1 << 12,
    Libs = 1 << 13,
    Others = 1 << 14,
    Styles = 1 << 15,
    Pug = 1 << 16,
}

class Bundler {
    private tsConfig;
    private tsProject;

    public constructor(public options?: Partial<ModuleOptions>) {
        this.options = { ...new ModuleOptions(), ...options };

        libx.log.v('Bundler starting... ', { minify: this.options.shouldMinify });

        // this.options.mainJS = this.options.src + '/' + this.options.mainJS;

        if (libx.node.args.steps) {
            this.options.steps = this.parseSteps(libx.node.args.steps);
        }

        this.tsConfig = libx.node.readJsonStripComments(this.options.src + '/../tsconfig.json');
        this.tsProject = pax.tsProject(this.options.src + '/../tsconfig.json', {});

        pax.showdownConverter = new pax.showdown.Converter({
            // extensions: [...bindings],
            tables: true,
            strikethrough: true,
            tasklists: true,
            emoji: true,
            openLinksInNewWindow: true,
        });
    }

    public async build() {
        pax.config.debug = true;
        var isDev = this.options.shouldMinify == false;

        if (libx.enum.has(this.options.steps, Steps.Cleanup)) {
            libx.log.v('bundler: performing step', Steps[Steps.Cleanup]);
            await pax.delete(this.options.dest);
            libx.node.mkdirRecursiveSync(this.options.dest + '/styles');
        }

        // const projconfig = libx.node.getProjectConfig(isDev ? 'dev' : 'prod', './');

        var pMain,
            pFrame,
            pBrowserifyFrame,
            pResourcesFrame,
            pScripts,
            pTs,
            pBrowserify,
            pPug,
            pResources,
            pStyleScss,
            pStyleLess,
            pVue,
            pOthers,
            pManifest,
            pMD,
            pLibs = null;

        if (libx.enum.has(this.options.steps, Steps.Frame)) {
            libx.log.v('bundler: performing step', Steps[Steps.Frame]);

            // if (libx.enum.has(this.options.steps, Steps.Resources)) {
            //     pBrowserifyFrame = pax.copy(
            //         [this.options.src + '../../node_modules/frame.libx.js/build-web/scripts/ts/browserified/frame*'],
            //         `${this.options.dest}/scripts/ts/browserified/`,
            //         () => [],
            //         this.options.shouldWatch,
            //         {
            //             debug: false,
            //         }
            //     );
            // }

            // if (libx.enum.has(this.options.steps, Steps.Browserify)) {
            //     pResourcesFrame = pax.copy(
            //         [this.options.src + '../../node_modules/frame.libx.js/build-web/resources/**/*'],
            //         `${this.options.dest}/resources/`,
            //         () => [],
            //         this.options.shouldWatch,
            //         {
            //             debug: false,
            //         }
            //     );
            // }

            pFrame = pax.copy(
                [this.options.src + '../../node_modules/frame.libx.js/build-web/**/*'],
                `${this.options.dest}/frame/`,
                () => [],
                this.options.shouldWatch,
                { debug: false }
            );
            // if (libx.enum.has(this.options.steps, Steps.Resources)) {
            // }
        }

        await Promise.all([pFrame, pBrowserifyFrame, pResourcesFrame]);

        if (libx.enum.has(this.options.steps, Steps.MainJS)) {
            libx.log.v('bundler: performing step', Steps[Steps.MainJS]);
            var bundlerOptions = {
                tsify: true,
                babelify: true,
                rename: 'site.js',
                // target: { node: 'v6.16.0' },
                babelifyOptions: {
                    // sourceMaps: false
                    // presets: ['@babel/preset-env'],
                    // presets: ["es2015"],
                    // sourceMaps: true,
                    // global: true,
                },
            };

            pMain = pax.copy(
                this.options.mainJS,
                this.options.dest + '/scripts/',
                () => [pax.middlewares.browserify(bundlerOptions), pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minify())],
                this.options.shouldWatch,
                {
                    callback: () => libx.log.v('mainjs build done'),
                }
            );
        }

        if (libx.enum.has(this.options.steps, Steps.TS)) {
            libx.log.v('bundler: performing step', Steps[Steps.TS]);
            pTs = pax.copy(
                [this.options.src + '/scripts/ts/**/!(browserified)/*.ts', this.options.src + '/scripts/ts/*'],
                `${this.options.dest}/scripts`,
                () => [
                    // pax.middlewares.sourcemaps.init({loadMaps: true}),
                    pax.middlewares.tsWithProject(this.tsProject),
                    // pax.middlewares.ts(tsConfig.compilerOptions),
                    // pax.middlewares.if(
                    //     this.options.shouldMinify,
                    //     pax.middlewares.minify({
                    //         keepClassName: true,
                    //     })
                    // ),
                    // pax.middlewares.buffer(),
                    // pax.middlewares.sourcemaps.write('./'),
                ],
                this.options.shouldWatch,
                { debug: false, useSourceDir: true, base: this.options.src + '/scripts' }
            );
        }

        if (libx.enum.has(this.options.steps, Steps.Libs)) {
            libx.log.v('bundler: performing step', Steps[Steps.Libs]);
            pLibs = pax.copy(
                ['./lib/**/*.ts'],
                `${this.options.dest}/libs`,
                () => [
                    pax.middlewares.ts(this.tsConfig.compilerOptions),
                    // pax.middlewares.tsWithProject(tsProject),
                    pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minify()),
                ],
                this.options.shouldWatch,
                { debug: false, useSourceDir: true, base: 'libs' }
            );
        }

        if (libx.enum.has(this.options.steps, Steps.Scripts)) {
            libx.log.v('bundler: performing step', Steps[Steps.Scripts]);
            pScripts = pax.copy(
                [this.options.src + '/scripts/**/*.js', `!${this.options.src}/scripts/ts/**`],
                `${this.options.dest}/scripts/`,
                () => [pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minify())],
                this.options.shouldWatch,
                {
                    debug: false,
                }
            );
        }

        if (libx.enum.has(this.options.steps, Steps.Resources)) {
            libx.log.v('bundler: performing step', Steps[Steps.Resources]);

            pResources = pax.copy([this.options.src + '/resources/**/*'], `${this.options.dest}/resources/`, () => [], this.options.shouldWatch, {
                debug: false,
            });
        }

        if (libx.enum.has(this.options.steps, Steps.Manifest)) {
            libx.log.v('bundler: performing step', Steps[Steps.Manifest]);
            pManifest = pax.copy(
                [this.options.src + '/manifest.json', this.options.src + '/favicon.ico', this.options.src + '/sitemap.xml'],
                `${this.options.dest}/`,
                () => [],
                this.options.shouldWatch,
                { debug: false }
            );
        }

        if (
            libx.enum.has(this.options.steps, Steps.Styles) ||
            libx.enum.has(this.options.steps, Steps.StyleSCSS) ||
            libx.enum.has(this.options.steps, Steps.StyleLess)
        ) {
            libx.log.v('bundler: performing step', Steps[Steps.Styles]);

            if (libx.enum.has(this.options.steps, Steps.Styles) || libx.enum.has(this.options.steps, Steps.StyleSCSS)) {
                libx.log.v('bundler: performing step', Steps[Steps.StyleSCSS]);
                // pStyleScss = pax.copy(
                //     [this.options.src + '/styles/*.scss'],
                //     `${this.options.dest}/styles/`,
                //     () => [pax.middlewares.sass(), pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minifyCss())],
                //     this.options.shouldWatch,
                //     { debug: true }
                // );

                pStyleScss = pax.copy(
                    [this.options.src + '/styles/*.scss'],
                    `${this.options.dest}/styles/`,
                    () => [pax.middlewares.sass(), pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minifyCss())],
                    this.options.shouldWatch,
                    { debug: false }
                );
            }
            if (libx.enum.has(this.options.steps, Steps.Styles) || libx.enum.has(this.options.steps, Steps.StyleLess)) {
                libx.log.v('bundler: performing step', Steps[Steps.StyleLess]);
                pStyleLess = pax.copy(
                    [this.options.src + '/styles/*.less'],
                    `${this.options.dest}/styles/`,
                    () => [pax.middlewares.less(), pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minifyCss())],
                    this.options.shouldWatch,
                    { debug: false }
                );
            }
        }

        if (libx.enum.has(this.options.steps, Steps.Vue)) {
            libx.log.v('bundler: performing step', Steps[Steps.Vue]);
            pVue = pax.copy(
                [this.options.src + '/**/*.vue'],
                `${this.options.dest}/`,
                () => [
                    pax.middlewares.customFileModify((content, file) => {
                        return pax.middlewares.vue(content.toString(), file, `${this.options.dest}/styles/vue-components.css`, this.tsConfig.compilerOptions);
                    }),
                    pax.middlewares.renameFunc((file) => (file.extname = '.vue.js')),
                    pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minify()),
                ],
                this.options.shouldWatch,
                { debug: false, useSourceDir: true, base: this.options.src }
            );
        }

        if (libx.enum.has(this.options.steps, Steps.MD)) {
            libx.log.v('bundler: performing step', Steps[Steps.MD]);
            pMD = pax.copy(
                [this.options.src + '/**/*.md'],
                `${this.options.dest}/`,
                () => [
                    pax.middlewares.customFileModify((content, file) => {
                        const html = pax.showdownConverter.makeHtml(content.toString());
                        return html;
                    }),
                    pax.middlewares.renameFunc((file) => (file.extname = '.html')),
                    // pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minify()),
                ],
                this.options.shouldWatch,
                { debug: false }
            );
        }

        await Promise.all([pMain, pScripts, pTs, pBrowserify, pPug, pResources, pResourcesFrame, pStyleScss, pStyleLess, pVue, pOthers, pManifest, pMD, pLibs]);

        if (libx.enum.has(this.options.steps, Steps.Browserify)) {
            libx.log.v('bundler: performing step', Steps[Steps.Browserify]);

            const browserifyOptions = {
                // useStream: true,
                paths: ['./node_modules', './src/'],
                // sourcemaps: true,
                // esmify: true,
                standalone: true,
                // bare: true,
                // bundleExternal: true,

                // sourcemapDest: mod.options.dest,
                babelify: true, //libx.node.args.babelify || libx.node.args.browserify || true,
                babelifyOptions: {
                    // global: true,
                    // presets: ['@babel/preset-env'],
                    // extensions : ['.js','.ts'],
                    // presets: [ '@babel/preset-modules'], //'@babel/env', 'stage-0', '@babel/react'],
                    presets: [
                        // [
                        // 	'@babel/preset-modules',
                        // 	{
                        // 		targets: { "esmodules": true },
                        // 	},
                        // ],
                        [
                            '@babel/preset-env',
                            {
                                // [ 'es2015', {
                                // targets: { "esmodules": true },
                                // modules: false,
                                // useBuiltIns: "entry",
                            },
                        ],
                        'es2015',
                        // "stage-2",
                    ],
                    // ignore: [/\/node_modules\/(?!your module folder\/)/],
                    extensions: ['.js', '.ts'],
                    plugins: [
                        // "transform-es2015-arrow-functions",
                        // "@babel/transform-runtime",
                        // "transform-es2015-modules-commonjs",
                    ],
                    sourceType: 'module',

                    // 	["@babel/plugin-proposal-decorators",{ "decoratorsBeforeExport": false}],
                    // 	["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
                    // 	// [ "@babel/plugin-transform-runtime", { regenerator: true } ]
                    // ],
                },
                // rename: '.js',
                // extensions : ['.ts', '.js'],
                tsify: true,
                tsifyOptions: {
                    global: false,
                    files: [],
                    declaration: true,
                    // target: 'es6',
                    module: 'systemjs',
                    // include: mod.options.tsconfig.include || [],
                    // project: this.tsConfig, //mod.options.tsconfig, //__dirname + '/tsconfig.json',
                },
            };

            pBrowserify = pax.copy(
                [this.options.src + '/scripts/ts/browserified/**/*.ts', `!${this.options.src}/frame/scripts/ts/browserified/**/*.ts`],
                `${this.options.dest}/scripts/ts/browserified`,
                () => [
                    // pax.middlewares.ts(tsconfig.compilerOptions),
                    pax.middlewares.browserify(browserifyOptions),
                    pax.middlewares.renameFunc((file) => {
                        /*file.basename = 'browser';*/ file.extname = '.js';
                    }),
                    pax.middlewares.if(this.options.shouldMinify, pax.middlewares.minify()),
                ],
                this.options.shouldWatch,
                { debug: false }
            );

            await Promise.all([pBrowserify, pBrowserifyFrame]);
        }

        let projectConfig = null;
        try {
            projectConfig = libx.node.getProjectConfig(
                isDev ? 'dev' : 'prod',
                this.options.src + '/../',
                libx.node.args.secret || process.env.FUSER_SECRET_KEY
            );
        } catch (ex) {
            libx.log.w('bundler: Error loading project config', ex);
        }

        if (libx.enum.has(this.options.steps, Steps.Pug)) {
            libx.log.v('bundler: performing step', Steps[Steps.Pug], this.options.shouldMinify);
            pPug = await pax.copy(
                [this.options.src + '/**/*.pug'],
                this.options.dest,
                () => [
                    pax.middlewares.pug({ isDev, config: projectConfig }), //projectConfig }),
                    pax.middlewares.localize('./', this.options.dest),
                    // pax.middlewares.if(this.options.shouldMinify, pax.middlewares.localize('./', this.options.dest)),
                    // pax.middlewares.if(this.options.shouldMinify, pax.middlewares.useref()),
                    pax.middlewares.if(this.options.shouldMinify, pax.middlewares.usemin(this.options.dest)),
                ],
                this.options.shouldWatch,
                { debug: false }
            );
        }

        if (this.options.shouldServe) {
            libx.log.v('bundler: starting serving...');
            var port = 3010;
            pax.config.devServer.livePort = projectConfig?.private?.livereloadPort || 35731;
            pax.config.devServer.reloadGraceMS = 200;
            pax.config.devServer.reloadDebounceMS = 500;
            pax.config.devServer.useHttps = libx.node.args.secure || projectConfig?.private?.useHttps;
            libx.log.info(`test: serving... http://0.0.0.0:${port}/index.html`);
            pax.serve(this.options.dest, { port: port }, [this.options.dest + '/**/*'], () => {
                pax.middlewares.liveReload();
            });
        }

        if (this.options.shouldWatch) {
            libx.log.v('bundler: starting watching...');
            // pax.watchSimple([this.options.src + '/scripts/ts/Main.ts'], (ev, p)=>{
            // 	if (ev.type != 'changed') return;
            // 	pax.triggerChange(this.options.mainJS);
            // });
            // var mainTS = '/scripts/ts/Main.ts';
            // pax.watchSimple([this.options.src + '/scripts/**/*.ts', '!Main.ts'], (ev, p)=>{
            // 	if (ev.type != 'change' || ev.path.endsWith(mainTS)) return;
            // 	pax.triggerChange(this.options.src + mainTS);
            // });
            pax.watchSimple(
                [this.options.dest + '/**/*'],
                (ev, p) => {
                    pax.middlewares.liveReload();
                },
                { allowEmpty: true }
            );

            pax.watchSimple([this.options.src + '/footer.pug', this.options.src + '/header.pug'], (ev, p) => {
                if (ev.type != 'change') return;
                pax.triggerChange(this.options.src + '/index.pug');
                // setTimeout(() => pax.middlewares.liveReload(), 500);
            });

            pax.watchSimple([this.options.src + '/styles/*/**/*.less'], (ev, p) => {
                if (ev.type != 'change') return;
                pax.triggerChange(this.options.src + '/styles/style.less');
                setTimeout(() => pax.middlewares.liveReload(), 500);
            });
        }
    }

    private parseSteps(steps: string) {
        if (steps == null) return null;

        let ret = 0;
        steps.split(',').map((x) => (ret = libx.enum.combine(ret, Steps[x.trim()])));

        return ret;
    }
}

export class ModuleOptions {
    root = process.cwd();
    src = this.root + '/' + (libx.node.args.src || 'src/web');
    dest = this.root + '/' + (libx.node.args.dest || 'build-web');
    mainJS = this.src + '/' + (libx.node.args.mainjs || 'site.js');
    shouldWatch = libx.node.args.watch || false;
    shouldMinify = libx.node.args.minify || false;
    shouldServe = libx.node.args.serve || false;
    steps = libx.enum.combine(
        Steps.Cleanup,
        Steps.Frame,
        Steps.MainJS,
        Steps.Scripts,
        Steps.TS,
        Steps.Browserify,
        Steps.Pug,
        Steps.Resources,
        Steps.StyleLess,
        Steps.StyleSCSS,
        Steps.Vue,
        Steps.Manifest,
        Steps.MD,
        Steps.Manifest,
        Steps.Libs,
        Steps.Others
    );
}

if (libx.node.isCalledDirectly()) {
    new Bundler().build().then(() => {
        libx.log.i('DONE');
    });
}
