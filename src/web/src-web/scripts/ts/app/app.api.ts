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

        // if (app.user.manager.data == null) {
        // 	userId = 'anonymous';
        // 	path = 'public';

        // } else {
        // 	userId = app.user.manager.data.id;
        // }

        let storageRef = window.firebase.storage().ref();
        let rand = Math.round(Math.random() * 1000000) + '-';
        let imgRef = storageRef.child(`/user/${userId}/${path}/${useRandomPrefix ? rand : ''}${file.name}`);
        let task = imgRef.put(file);
        task.then(async (snapshot) => {
            libx.log.i('app:api:uploadFile: Successfully uploaded ', snapshot?.metadata);
            let url = await snapshot.ref.getDownloadURL();
            p.resolve({ url, meta: snapshot.metadata });
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
                return p.resolve({ url, meta: task.snapshot.metadata });
            }
        );

        return p;
    }

    public async listStorageFiles(path = null) {
        let p = libx.newPromise();

        if (path == null) {
            let userId = libx.di.modules.userManager.data.public.id; //app.user.manager.data.id;
            path = `/user/${userId}/uploads`;
        }
        var storageRef = window.firebase.storage().ref(path);

        storageRef
            .listAll()
            .then(function (result) {
                let items = result.items;
                let ret = [];
                for (let item of items) {
                    ret.push({
                        ref: item,
                        name: item.name,
                        location: item.location.path,
                    });
                }
                p.resolve(ret);
            })
            .catch(function (error) {
                p.reject(error);
            });

        // imageRef.getDownloadURL().then(function(url) {
        // 	// TODO: Display the image on the UI
        // }).catch(function(error) {
        // 	// Handle any errors
        // });

        return p;
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
        return await libx.di.modules.firebase.listen(path, async (newVal) => {
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
    }
}

export const api = new Api();
