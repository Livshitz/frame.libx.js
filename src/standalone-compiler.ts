import { Bundler, Steps, ModuleOptions } from './webBundler';
import { libx } from 'libx.js/build/bundles/node.essentials';
import pax from 'pax.libx.js/build';

const options: ModuleOptions = {
    src: libx.node.args.src,
    steps: libx.enum.combine(Steps.Browserify),
    except: libx.enum.combine(),
    root: '.',
    dest: libx.node.args.dest,
    mainJS: libx.node.args.mainJS,
    shouldMinify: libx.node.args.minify ?? true,
    shouldWatch: libx.node.args.watch,
    shouldServe: false,
};
var browserifyOptions = {
    standalone: true,
    babelify: true,
    // rename: '.js',
    babelifyOptions: {
        // sourceMaps: false
        // presets: ['@babel/preset-env'],
        // presets: ["es2015"],
        // sourceMaps: true,
        // global: true,
    },
    tsify: true,
    tsifyOptions: {
        global: false,
        files: [],
        declaration: true,
        // target: 'es6',
        module: 'CommonJS',
        // include: mod.options.tsconfig.include || [],
        // project: this.tsConfig, //mod.options.tsconfig, //__dirname + '/tsconfig.json',
    },
};

(async () => {
    const pMain = pax.copy(
        options.mainJS,
        options.dest,
        () => [
            pax.middlewares.browserify(browserifyOptions),
            pax.middlewares.renameFunc((file) => {
                /*file.basename = 'browser';*/ file.extname = '.js';
            }),
            pax.middlewares.if(options.shouldMinify, pax.middlewares.minify()),
        ],
        options.shouldWatch,
        {
            callback: () => libx.log.v('build done'),
        }
    );
    await pMain;
})();
