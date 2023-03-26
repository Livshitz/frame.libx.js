import Helpers from './app.helpers.js';
import { libx, Deferred, DataStore } from '/frame/scripts/ts/browserified/frame.js';

interface IDeferredWithProgress<T = any> extends Deferred<T> {
    progress: any;
}

export class Api {
    public currentVersion: string = null;

    public async uploadFile(file, path, useRandomPrefix = false) {
        let p: IDeferredWithProgress = <IDeferredWithProgress>libx.newPromise();

        p.progress = new libx.Callbacks();

        path = path || 'uploads';

        let userId = 'anonymous';
        // path = 'public';

        if (app.userManager.data == null) {
            userId = 'anonymous';
            path = 'public';
        } else {
            userId = app.userManager.data.public.id;
        }

        let storageRef = window.firebase.storage().ref();
        let rand = '-' + Math.round(Math.random() * 1000000);
        const fileName = file.name ?? '';
        const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
        const fileExtension = fileName.split('.').slice(1, 2).join('.');
        let imgRef = storageRef.child(`/user/${userId}/${path}/${fileNameWithoutExtension}${useRandomPrefix ? rand : ''}.${fileExtension}`);
        let task = imgRef.put(file);
        task.then(async (snapshot) => {
            libx.log.i('app:api:uploadFile: Successfully uploaded ', snapshot?.metadata);
            let url = await snapshot.ref.getDownloadURL();
            p.resolve({ url, meta: snapshot.metadata, location: snapshot.metadata?.fullPath });
        }).catch((ex) => {
            libx.log.e('app:api:uploadFile: Error: ', ex);
            p.reject(ex);
        });
        task.on(
            'state_changed',
            (snapshot) => {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                p.progress.trigger(percentage, snapshot.bytesTransferred, snapshot.totalBytes);
                libx.log.d('app:api:uploadFile: progress: ', percentage);
            },
            (err) => p.reject(err),
            async () => {
                let url = await task.snapshot.ref.getDownloadURL();
                return p.resolve({ url, meta: task.snapshot.metadata, location: task.snapshot.metadata?.fullPath });
            }
        );

        return p;
    }

    public async listStorageFiles(path: string = null, bucket: string = null, recursive = false) {
        if (path == null) {
            let userId = app.userManager.data.public.id;
            path = `/user/${userId}/uploads`;
        }

        var storageRef = null;
        if (bucket) {
            storageRef = window.firebase.app().storage(bucket).ref(path);
        } else {
            storageRef = window.firebase.storage().ref(path);
        }

        const result = await storageRef.listAll();
        let items = result.items;
        let ret = [];

        const pAll = [];
        for (const prefix of result.prefixes) {
            const newItem = {
                type: 'folder',
                ref: prefix,
                name: prefix.name,
                location: prefix.fullPath,
                content: null,
            };
            if (recursive) {
                const p = this.listStorageFiles(prefix.fullPath, bucket);
                p.then((subitems) => {
                    newItem.content = subitems;
                    ret.push(newItem);
                });
                pAll.push(p);
            } else {
                ret.push(newItem);
            }
        }
        await Promise.all(pAll);

        for (let item of items) {
            ret.push({
                type: 'file',
                ref: item,
                name: item.name,
                location: item.location?.path ?? item.fullPath,
            });
        }
        return ret;
    }

    public anonymizeName(text) {
        return String(text).replace(/([\u0590-\u05FF\w\.]+)\s([\u0590-\u05FF\w\.])([\u0590-\u05FF\w\.]+).*/, '$1 $2.');
    }
    public anonymizeJobTitle(text) {
        return String(text).replace(/ at(.*)/, ' at xxx');
    }

    public queryString() {
        return location.search;
    }

    public getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    public log(obj) {
        return console.log(JSON.stringify(obj, null, 2));
    }

    public async getProfile(id) {
        return await libx.di.get('firebase').get(`/profiles/${id}`);
    }

    public async listenToVersion(path: string = '/version') {
        const parse = (ver) => {
            let parts = ver.split('.');
            let value = parts[0] * 1000000 + parts[1] * 1000 + parts[2] * 1; // support version with 3 digits at most
            return value;
        };

        libx.log.v('app.api.version.watch: Starting watching version...');
        return libx.di.inject((firebase) => {
            firebase.listen(path, async (newVal) => {
                if (this.currentVersion == null) this.currentVersion = newVal;
                else {
                    libx.log.i('app.api.version.watch: Version was changed, requesting to reload');
                    if (parse(newVal) > parse(this.currentVersion)) {
                        libx.log.w('Helpers:listenToVersion: Detected newer version!', this.currentVersion);
                        // let response = await app.api.showConfirm('App was updated', 'The webapp was updated, you must reload the page. Reload now?');
                        Helpers.toast('New version is available, please save your changes and reload the page', 'is-warning', 'is-top', { indefinite: true });
                        // if (response == true) bundular.reload();
                        // else {
                        // 	libx.log.w('app.api.version.watch: User declined reload!');
                        // 	alert('WARNING! Please note to reload the page as soon as possible as you may experience really weird stuff when your version is outdated!')
                        // }
                    }
                }
            });
        });
    }

    public async showLogin(options: any = {}) {
        const modal = app.layout.$buefy.modal.open({
            ...options,
            // parent: this,
            component: Helpers.lazyLoader('/views/misc/login.vue.js'),
            hasModalCard: true,
            trapFocus: true,
            props: {
                caption: options?.caption,
            },
            events: {
                loggedIn(value) {
                    console.log('loggedIn: ', value);
                    modal.close();
                },
            },
        });
    }
    public async signout() {
        return await app.userManager.signOut();
    }
}

export const api = new Api();
