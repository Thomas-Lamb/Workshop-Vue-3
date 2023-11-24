import {defineStore} from "pinia";
import {IDBManager} from "../assets/mixins/indexDb/IDBManager.ts";
import {useIDBStore} from "./IDB-store.ts";
import {useTasksStore} from "./tasks.ts";

export const useAppConfigStore = defineStore('appConfig',{
    state: () => {
        useIDBStore()
        return {
            messages: window.message,
            mix_config: window.mix_config,
            IDBManager: IDBManager,
            isOnPage: true
        };
    },
    actions: {
        setIsOnPage(bool: boolean) {
            this.isOnPage = bool
        }
    },
    getters: {
        getIsOnPage(): boolean {
            return this.isOnPage
        },
        getMessages(): string | null {
            return this.messages
        },
        getMixConfig(): any | null {
            return this.mix_config
        },
        getIDBManager(): any{
            return this.IDBManager
        },
        getIDB(): any {
            return this.db
        }
    }
});
