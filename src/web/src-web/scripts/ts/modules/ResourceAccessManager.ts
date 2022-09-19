import { UserManager } from 'libx.js/build/modules/firebase/UserManager';
import { Callbacks, Firebase, libx } from '/frame/scripts/ts/browserified/frame.js';

export class ResourceAccessManager {
    public constructor(private firebase: Firebase, private userManager: UserManager, public options?: Partial<ModuleOptions>) {
        libx.log.v('ResourceAccessManager:ctor: ');
        this.options = { ...new ModuleOptions(), ...options };
    }

    public async createResource(resource: string) {
        const ownerId = this.userManager.data.public.id;
        await this.firebase.set(`/access/${resource}`, {
            owner: ownerId,
        });
    }

    public async grantAccess(resource: string, userEmail: string, accessTypes: AccessTypes) {
        userEmail = userEmail.replace(/\./g, '_');
        await this.firebase.set(`/access/${resource}/users/${userEmail}`, {
            read: libx.enum.has(accessTypes, AccessTypes.Readonly),
            write: libx.enum.has(accessTypes, AccessTypes.Write),
            admin: libx.enum.has(accessTypes, AccessTypes.Admin),
        });
    }

    public async checkAccess(resource: string) {
        const userId = this.userManager.data.public.id;
        let userEmail = this.userManager.data.private.email;
        userEmail = userEmail.replace(/\./g, '_');
        let access = null;
        try {
            access = await this.firebase.get(`/access/${resource}/users/${userEmail}`);
            if (access == null) {
                const owner = await this.firebase.get(`/access/${resource}/owner`);
                if (owner != userId) return false;
                else return { admin: true, read: true, write: true };
            }
        } catch (ex) {
            libx.log.w('ResourceAccessManager:checkAccess: could not get access', { userEmail, err: ex?.code });
            return false;
        }

        return access;
    }
}

export enum AccessTypes {
    Readonly,
    Write,
    Admin,
}

export class ModuleOptions {}
