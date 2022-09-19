const { libx } = require('libx.js/build/bundles/node.essentials');
const { Crypto } = require('libx.js/build/modules/Crypto');
libx.pax = require("pax.libx.js/build/index");
const path = require('path');
const fs = require('fs');
const argv = require('yargs').argv;
const showdown = require('showdown');
libx.log.isShowStacktrace = false;
// libx.log.isDebug = true;
// libx.log.filterLevel = libx.log.severities.debug;

libx.node.catchErrors((err) => {
	console.log('error!', err);//(typeof err == 'string' || err == null) ? err : { message: err.message, stack: err.stack });
})

const tsConfig = libx.node.readJsonStripComments('tsconfig.json');
const tsProject = libx.pax.tsProject('tsconfig.json', {
});

// const classMap = {
// 	h1: '',
// 	h2: '',
// 	ul: '',
// 	li: ''
// }

// const bindings = Object.keys(classMap)
// 	.map(key => ({
// 		type: 'output',
// 		regex: new RegExp(`<${key}(.*)>`, 'g'),
// 		replace: `<${key} class="${classMap[key]}" $1>`
// 	}));

libx.pax.showdownConverter = new libx.pax.showdown.Converter({
	// extensions: [...bindings],
	tables: true, strikethrough: true, tasklists: true, emoji: true, openLinksInNewWindow: true,
});

const browserifyOptions = {
	// useStream: true,
	paths: ['./node_modules', './src/web/'],
	// sourcemaps: true,
	// esmify: true,
	standalone: 'browserified',
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
			['@babel/preset-env', {
				// [ 'es2015', {
				// targets: { "esmodules": true },
				// modules: false,
				// useBuiltIns: "entry",
			}],
			'es2015'
			// "stage-2",

		],
		// ignore: [/\/node_modules\/(?!your module folder\/)/],
		extensions: ['.js', '.ts'],
		plugins: [
			// "transform-es2015-arrow-functions",
			// "@babel/transform-runtime",
			// "transform-es2015-modules-commonjs",
		],
		sourceType: "module",

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
		// project: tsConfig, //mod.options.tsconfig, //__dirname + '/tsconfig.json',
	},
};

(async () => { /* init */
	var src = "./src/web";
	var dest = "./build";
	var mainJS = src + '/site.js';

	var shouldWatch = libx.node.args.watch || false;
	var shouldMinify = libx.node.args.minify || false;
	var shouldServe = libx.node.args.serve || false;
	libx.pax.config.debug = true;
	var isDev = shouldMinify == false;

	await libx.pax.delete(dest);
	libx.node.mkdirRecursiveSync(dest + "/styles");

	// const projconfig = libx.node.getProjectConfig(isDev ? 'dev' : 'prod', './');

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
		}
	};

	var pMain, pScripts, pTs, pBrowserify, pPug, pResources, pStyleScss, pStyleLess, pVue, pOthers, pManifest, pMD, pLibs = null;

	pMain = libx.pax.copy(mainJS, dest + '/scripts/', () => [
		libx.pax.middlewares.browserify(bundlerOptions),
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minify()),
	], shouldWatch, {
		callback: () => libx.log.v('mainjs build done')
	});

	TBD:
	pTs = libx.pax.copy([src + '/scripts/ts/**/*.ts', '!' + src + '/scripts/ts/browserified/*.ts'], `${dest}/scripts`, () => [
		// libx.pax.middlewares.sourcemaps.init({loadMaps: true}),
		libx.pax.middlewares.tsWithProject(tsProject),
		// libx.pax.middlewares.ts(tsConfig.compilerOptions),
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minify()),
		// libx.pax.middlewares.buffer(),
		// libx.pax.middlewares.sourcemaps.write('./'),
	], shouldWatch, { debug: false, useSourceDir: true, base: src + '/scripts' });

	// pLibs = libx.pax.copy(['./lib/**/*.ts'], `${dest}/libs`, () => [
	// 	libx.pax.middlewares.ts(tsConfig.compilerOptions),
	// 	// libx.pax.middlewares.tsWithProject(tsProject),
	// 	libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minify()),
	// ], shouldWatch, { debug: false, useSourceDir: true, base: 'libs' });

	pScripts = libx.pax.copy([src + '/scripts/**/*.js'], `${dest}/scripts/`, () => [
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minify()),
	], shouldWatch, { debug: false });

	pResources = libx.pax.copy([src + '/resources/**/*'], `${dest}/resources/`, () => [
	], shouldWatch, { debug: false });

	pManifest = libx.pax.copy([src + '/manifest.json', src + '/favicon.ico', src + '/sitemap.xml'], `${dest}/`, () => [
	], shouldWatch, { debug: false });

	pStyleScss = libx.pax.copy([src + '/styles/*.scss'], `${dest}/styles/`, () => [
		libx.pax.middlewares.sass(),
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minifyCss()),
	], shouldWatch, { debug: false });
	pStyleLess = libx.pax.copy([src + '/styles/*.less'], `${dest}/styles/`, () => [
		libx.pax.middlewares.less(),
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minifyCss()),
	], shouldWatch, { debug: false });

	pVue = libx.pax.copy([src + '/**/*.vue'], `${dest}/`, () => [
		libx.pax.middlewares.customFileModify((content, file) => {
			return libx.pax.middlewares.vue(content.toString(), file, `${dest}/styles/vue-components.css`, tsConfig.compilerOptions);
		}),
		libx.pax.middlewares.renameFunc(file => file.extname = '.vue.js'),
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minify()),
	], shouldWatch, { debug: false });

	pMD = libx.pax.copy([src + '/**/*.md'], `${dest}/`, () => [
		libx.pax.middlewares.customFileModify((content, file) => {
			const html = libx.pax.showdownConverter.makeHtml(content.toString());
			return html;
		}),
		libx.pax.middlewares.renameFunc(file => file.extname = '.html'),
		// libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minify()),
	], shouldWatch, { debug: false });

	await Promise.all([pMain, pScripts, pTs, pBrowserify, pPug, pResources, pStyleScss, pStyleLess, pVue, pOthers, pManifest, pMD, pLibs]);

	pBrowserify = libx.pax.copy([src + '/scripts/ts/browserified/*.ts'], `${dest}/scripts/ts/browserified`, () => [
		// libx.pax.middlewares.ts(tsconfig.compilerOptions),
		libx.pax.middlewares.browserify(browserifyOptions),
		libx.pax.middlewares.renameFunc(file => { /*file.basename = 'browser';*/ file.extname = '.js' }),
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.minify()),
	], shouldWatch, { debug: false });
	await pBrowserify;

	// const projectSecretsStr = libx.node.encryptFile('./project-secrets.json', 'unboxed5');
	// let projectConfig = libx.node.getProjectConfig('./', 'unboxed5');
	// const projectConfig = libx.node.getProjectConfig(isDev ? 'dev' : 'prod', __dirname + '/./', 'unboxed5');
	// var projectFile = fs.readFileSync('./project.json');
	// var projectConfig = libx.parseJsonFileStripComments(projectFile.toString());
	// var projectSecretsFile = fs.readFileSync('./project-secrets.json');
	// var projectSecretsStr = Crypto.decrypt(projectSecretsFile.toString(), 'unboxed5');
	// var projectSecrets = libx.parseConfig(projectSecretsStr, isDev ? 'dev' : 'prod');
	// projectConfig = { ...projectConfig, ...projectSecrets };
	// if (projectConfig.private == null) projectConfig.private = {};

	pPug = await libx.pax.copy([src + '/**/*.pug'], dest, () => [
		libx.pax.middlewares.pug({ isDev }),
		libx.pax.middlewares.localize('./', dest),
		// libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.localize('./', dest)),
		// libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.useref()),
		libx.pax.middlewares.if(shouldMinify, libx.pax.middlewares.usemin(dest)),
	], shouldWatch, { debug: false });

	if (shouldServe) {
		var port = 3010;
		libx.pax.config.devServer.livePort = 35731;
		libx.pax.config.devServer.reloadGraceMS = 200;
		libx.pax.config.devServer.reloadDebounceMS = 500;
		libx.pax.config.devServer.useHttps = libx.node.args.secure;
		libx.log.info(`test: serving... http://0.0.0.0:${port}/index.html`);
		libx.pax.serve(dest, { port: port }, [dest + '/**/*'], () => {
			libx.pax.middlewares.liveReload();
		});
	}

	if (shouldWatch) {
		// libx.pax.watchSimple([src + '/scripts/ts/Main.ts'], (ev, p)=>{
		// 	if (ev.type != 'changed') return;
		// 	libx.pax.triggerChange(mainJS);
		// });
		// var mainTS = '/scripts/ts/Main.ts';
		// libx.pax.watchSimple([src + '/scripts/**/*.ts', '!Main.ts'], (ev, p)=>{
		// 	if (ev.type != 'change' || ev.path.endsWith(mainTS)) return;
		// 	libx.pax.triggerChange(src + mainTS);
		// });
		libx.pax.watchSimple([dest + '/**/*'], (ev, p) => {
			libx.pax.middlewares.liveReload();
		}, { allowEmpty: true });

		libx.pax.watchSimple([src + '/footer.pug', src + '/header.pug'], (ev, p) => {
			if (ev.type != 'change') return;
			libx.pax.triggerChange(src + '/index.pug');
			// setTimeout(() => libx.pax.middlewares.liveReload(), 500);
		});

		libx.pax.watchSimple([src + '/styles/*/**/*.less'], (ev, p) => {
			if (ev.type != 'change') return;
			libx.pax.triggerChange(src + '/styles/style-less.less');
			setTimeout(() => libx.pax.middlewares.liveReload(), 500);
		});
	}

	console.log('-- Ready!')
})();