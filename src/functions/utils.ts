import { libx } from 'libx.js/build/bundles/node.essentials';
import { node } from 'libx.js/build/node';
import * as functions from 'firebase-functions';
import fs from 'fs';

export class Utils {
    // public constructor(public options?: Partial<ModuleOptions>) {
    // 	libx.log.v('MyModule:ctor: ');
    // 	this.options = { ...new ModuleOptions(), ...options };
    // }
    public static isDev = !!process.env.FUNCTIONS_EMULATOR;
    public static getProjectConfig(projName: string) {
        // const projconfig = node.getProjectConfig('prod', libFolder, firebaseConfig.secret || node.args.secret);

        let firebaseConfig = functions.config()[projName] || null;
        // libx.log.v('init: Config from FB', firebaseConfig, functions.config());
        const fConfigFolder = __dirname + '/../';
        const runtimeConfigPath = fConfigFolder + '.runtimeconfig.json';
        if (firebaseConfig == null && fs.existsSync(runtimeConfigPath)) {
            libx.log.v('init: reading FB config');
            const x = node.readJson(runtimeConfigPath);
            firebaseConfig = node.readJson(runtimeConfigPath)[projName];
            libx.log.d('init: config: ', firebaseConfig);
        }

        if (firebaseConfig == null) {
            throw `Utils: Could not locate .runtimeconfig.json at "${runtimeConfigPath}" (wd: ${process.cwd()})`;
        }

        const libFolder = __dirname + '/../lib/';
        const projconfig = node.getProjectConfig(this.isDev ? 'dev' : 'prod', libFolder, firebaseConfig.secret || node.args.secret);
        libx.di.register('projconfig', projconfig);
        return projconfig;
    }
}

// export class ModuleOptions {}
