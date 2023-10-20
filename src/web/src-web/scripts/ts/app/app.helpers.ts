import { Vue, libx, Firebase, Toast, Buefy } from '/frame/scripts/ts/browserified/frame.js';
import BuefyComponents from 'buefy/types/components';
import UMD from 'vue/types/umd';
import { copyJs } from '/frame/scripts/ts/browserified/libs.js';
import { Dictionary } from 'libx.js/src/types/interfaces';

let renderMedia = (file, title) => {
    if (file.contentType === 'video/mp4') {
        return `<div className='embed-responsive embed-responsive-16by9'>
			<video controls>
			<source src=${file.url} type='video/mp4'/>
			<p>Your browser doesnt support HTML5 video.</p>
			</video>
		</div>`;
    } else if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        return `<img src="${file.url}" alt="${title}" />`;
    } else {
        return `<p>Unknown content type</p>`;
    }
};

export class Helpers {
    public static appVersion: string = null;

    public static lazyLoader(url): () => Promise<any> {
        return () => System.import(url);
    }

    public static updateMeta(values: any, skipPrefix = false) {
        const elms = document.querySelectorAll('head meta[__content^="{{"]');
        const _values = { ...values };
        _values.appName = _values.appName;

        if (!skipPrefix) {
            _values.pageTitle = `${_values.appName}${_values.viewName ? '/' + _values.viewName : ''}${_values.pageTitle ? ' - ' + _values.pageTitle : ''}`;
        }

        _values.pageUrl = _values.pageUrl ?? window.location.href;
        elms.forEach((elm) => {
            const key = elm.getAttribute('__content').replace(/[{}]*/g, '');
            const value = _values[key]; //libx.getDeep(app, content, '.');
            // if (!value) return;
            elm.setAttribute('content', value);
        });

        if (_values.pageTitle) {
            // const title = typeof layout.headers.pageTitle === 'function' ? layout.headers.pageTitle.call(this) : layout.headers.pageTitle;
            document.title = _values.pageTitle;
        }
    }

    public static lazyLoadAnonComponent(url, componentName = null) {
        if (componentName == null) componentName = 'anon-component-' + libx.randomNumber();
        return Vue.component(componentName, async () => {
            // console.log('--- test');
            return await System.import(url); //libx.browser.require(url)
        });
    }

    public static async import(url) {
        return System.import(url);
    }

    public static getCurrentView() {
        return app.router.currentRoute.matched[0].instances.default;
    }

    public static toast(
        message,
        type?: 'is-white' | 'is-black' | 'is-light' | 'is-dark' | 'is-primary' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger',
        position?: 'is-top-right' | 'is-top' | 'is-top-left' | 'is-bottom-right' | 'is-bottom' | 'is-bottom-left',
        options?
    ) {
        // return window.bulmaToast.toast({ message, type: type || 'is-primary', position: position || 'top-center', ...options });
        console.log('app:helpers:toast: ' + message, { type });
        return Toast.open({ message, type, position, duration: 5000, queue: false, ...options });
    }

    public static sanetize(html) {
        return sanitizeHtml(html);
    }

    public static goBack() {
        window.history.length > 1 ? window.view.$router.go(-1) : window.view.$router.push('/');
    }

    public static isBrowserSupported() {
        return libx.browser.browserInfo.device.type == 'Desktop' && libx.browser.browserInfo.browser.family == 'Chrome';
    }

    public static navigate(destination, keepQuery = false) {
        if (keepQuery) {
            window.view.$router.push({ path: destination, query: window.view.$route.query });
        } else {
            window.view.$router.push(destination);
        }
    }

    public static bindQueryParam(paramName: string, defaultValue?: any, isBoolean = false) {
        return {
            get() {
                let ret = this.$route.query[paramName];
                if (isBoolean) {
                    if (ret === 'true' || ret === true) ret = true;
                    else if (ret == 'false' || ret === false) ret = false;
                    else ret = defaultValue == true || defaultValue == 'true';
                }
                return ret ?? defaultValue;
            },
            set(value) {
                this.$router.replace({
                    query: {
                        ...this.$route.query,
                        [paramName]: value,
                    },
                    // params: { savePosition: true },
                });
            },
        };
    }

    public static copyToClipboard(content: any) {
        copyJs(content, {
            debug: true,
            message: 'Press #{key} to copy',
        });
        this.toast('Copied!', 'is-success');
    }

    public static async copyCanvasToClipboard(canvas: HTMLCanvasElement) {
        try {
            // Can we copy a text or an image ?
            const canWriteToClipboard = await this.askWritePermission();

            // Copy a PNG image to clipboard
            if (canWriteToClipboard) {
                const p = libx.newPromise();
                await canvas.toBlob((blob) => p.resolve(blob));
                const blob = await p;
                await this.setToClipboard(blob);
            }

            /*
            // Copy a text to clipboard
            if (canWriteToClipboard) {
                const blob = new Blob(['Hello World'], { type: 'text/plain' });
                await this.setToClipboard(blob);
            }
            */
            this.toast('Copied!', 'is-success');
        } catch (err) {
            this.toast('Failed! Error:' + err?.message || err, 'is-danger');
        }
    }

    public static async uploadToStorage(path: string, file: any, fileName?: string, useRandomPrefix = true, isBase64 = false) {
        let storageRef = libx.di.modules.firebase.firebaseProvider.storage().ref();
        let rand = Math.round(Math.random() * 1000000) + '-';
        const userId = libx.di.modules.userManager.data.public.id;
        let imgRef = storageRef.child(`/user/${userId}/${path}/${useRandomPrefix ? rand : ''}${fileName ?? file.name ?? ''}`);

        let task = null;
        if (isBase64) {
            const mimeType = file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/) ? file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1] : null;
            file = file.replace(/data:image\/.+?;.+?,/, '');

            task = imgRef.putString(file, 'base64', { contentType: mimeType });
        } else {
            task = imgRef.put(file);
        }

        const p: any = libx.newPromise();
        p.progress = new libx.Callbacks();
        task.then(async (snapshot) => {
            let url = await snapshot.ref.getDownloadURL();
            libx.log.v('app:api:uploadFile: Successfully uploaded ', url);
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

    public static resizeCanvas(canvas: HTMLCanvasElement, newWidth: number, newHeight: number) {
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = newWidth;
        tmpCanvas.height = newHeight;

        var ctx = tmpCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);

        return tmpCanvas;
    }

    public static identifyUser(userId: string, email: string, displayName?: string, customVars?: Object) {
        // This is an example script - don't forget to change it!
        window.FS.identify(userId, {
            displayName: displayName,
            email: email,
            // TODO: Add your own custom user variables here, details at
            // https://help.fullstory.com/hc/en-us/articles/360020623294-FS-setUserVars-Recording-custom-user-data
            // reviewsWritten_int: 14
            ...customVars,
        });
    }

    public static hasQueryParam(param: string) {
        return app.layout.$route.query.hasOwnProperty(param);
    }

    public static urlParamsToObj(queryDic: Dictionary<string | string[]>, objectRef: Object) {
        const ret = {};
        const keys = Object.keys(objectRef);
        for (let key of keys) {
            if (queryDic[key] == null) continue;

            if (queryDic[key] == 'false') ret[key] = false;
            else if (queryDic[key] == 'true') ret[key] = true;
            else if (queryDic[key].contains(',')) ret[key] = queryDic[key];
            else if ((<string>queryDic[key]).match(/[^\d|\.|\,]/g) == null && !isNaN(parseFloat(<string>queryDic[key])))
                ret[key] = parseFloat(<string>queryDic[key]);
            else ret[key] = queryDic[key];
        }
        return libx.isEmpty(ret) ? objectRef : ret;
    }

    public static objToUrlParams(view: Vue, obj: Object) {
        if (obj == null) return;
        const configKeys = Object.keys(obj);
        for (let key of configKeys) {
            if (obj[key] == null) continue;
            view.$router.replace({ query: { ...view.$route.query, [key]: obj[key].toString() } });
        }
    }

    public static watchObjToUrlParams(view: Vue, objectToWatch: any) {
        return view.$watch(
            () => objectToWatch,
            (val) => {
                this.objToUrlParams(view, val);
            },
            { deep: true, immediate: true }
        );
    }

    public static generateBase64Image(color, width = 1200, height = 630) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg');
    }

    public static isModal(view: Vue) {
        return view.$parent.$el.className.contains('modal');
    }

    // @params blob - The ClipboardItem takes an object with the MIME type as key, and the actual blob as the value.
    // @return Promise<void>
    private static async setToClipboard(blob) {
        const data = [new ClipboardItem({ [blob.type]: blob })];
        await navigator.clipboard.write(data);
    }

    // @return Promise<boolean>
    private static async askWritePermission() {
        try {
            // The clipboard-write permission is granted automatically to pages
            // when they are the active tab. So it's not required, but it's more safe.
            /*
			Query : 'accelerometer', 'accessibility-events', 'ambient-light-sensor', 'background-sync', 'camera'​, 'clipboard-read', 'clipboard-write', 'geolocation', 'gyroscope', 'magnetometer', 'microphone', 'midi', 'notifications', 'payment-handler', 'persistent-storage', 'push'

			Revoke : 'geolocation', 'midi', 'notifications', 'push'
			*/
            const { state } = await navigator.permissions.query(<any>{ name: 'clipboard-write' });
            return state === 'granted';
        } catch (error) {
            // Browser compatibility / Security error (ONLY HTTPS) ...
            return false;
        }
    }
}

export default Helpers;
