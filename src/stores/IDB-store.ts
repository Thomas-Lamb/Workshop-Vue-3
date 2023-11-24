import {defineStore} from "pinia";
import {IDBManager} from "../assets/mixins/indexDb/IDBManager.ts";
import {useLaravelEchoStore} from "./laravel-echo.ts";
import {toRaw} from "vue";

export const useIDBStore = defineStore('IDB',{
    state: () => {
        const myVersion = 4;
        const myDbName = "quickmaint"
        let db = null

        /**--- Création et mise à jour d'index db ---*/
        const request = window.indexedDB.open("quickmaint", myVersion);

        request.onerror = (event) => {
            console.error(`Database error: ${event.target?.errorCode}`);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStoreTasks = db.createObjectStore("tasks", { keyPath: "id" });
            const objectStoreTodo = db.createObjectStore("todo", { keyPath: "id" });
            const objectStoreNewNotifications = db.createObjectStore("newNotifications", { keyPath: "id" });
            const objectStoreOldNotifications = db.createObjectStore("oldNotifications", { keyPath: "id" });
            const objectStoreRequests = db.createObjectStore("requests");
            const objectStoreSession = db.createObjectStore("session");
        };

        return {
            version: myVersion,
            db_name: myDbName,
        };
    },
    actions: {
        async getAllFromTable(table: string): Promise {
            let that = this
            return new Promise(function (resolve, _) {
                let openRequest = indexedDB.open(that.db_name, that.version);
                openRequest.onsuccess = function(event) {
                    const db = event.target?.result;
                    const txn = db.transaction(table, "readonly");
                    const objectStore = txn.objectStore(table);
                    objectStore.getAll().onsuccess = function (event: any) {
                        resolve(event.target.result);
                    }
                    txn.oncomplete = function () {
                        db.close();
                    };
                }})
        },
        async getStoreDataByKey(table: string, key: any) {
            let that = this
            return new Promise((resolve,_) => {
                let openRequest = indexedDB.open(that.db_name, that.version);
                openRequest.onsuccess = function(event) {
                    const db = event.target.result;
                    const txn = db.transaction(table, "readonly");
                    const objectStore = txn.objectStore(table);
                    objectStore.get(key).onsuccess = function (event) {
                        resolve(event.target.result);
                    }
                    txn.oncomplete = function () {
                        db.close();
                    };
                }
            });
        },
        async storeAllInTable(table: string, elements: Array<any>): Promise<boolean> {
            let that = this
            return new Promise((resolve,_)  => {
                let openRequest = indexedDB.open(that.db_name, that.version);
                openRequest.onsuccess = function(event) {
                    const db = event.target.result;
                    const txn = db.transaction(table, "readwrite");
                    const store = txn.objectStore(table);
                    elements.forEach(element => {
                        store.put(element);
                    });
                    txn.oncomplete = function () {
                        db.close();
                        console.log("store dans index db finit !")
                    };
                    resolve(true);
                };
            })
        },
        async upDateStoreInIndexedDbByKey(data: any, table: string, key : any): Promise<boolean> {
            let that = this
            return new Promise(function (resolve, _) {
                let openRequest = indexedDB.open(that.db_name, that.version);
                openRequest.onsuccess = function (event) {
                    const db = event.target.result;
                    const txn = db.transaction(table, "readwrite");
                    const store = txn.objectStore(table);
                    store.put(toRaw(data), key);
                    txn.oncomplete = function () {
                        db.close();
                    };
                    resolve(true)
                };
            })
        },
        async upDateStoreInIndexedDb(data: any, table: string): Promise<boolean> {
            let that = this
            return new Promise(function (resolve, _) {
                let openRequest = indexedDB.open(that.db_name, that.version);
                openRequest.onsuccess = function (event) {
                    const db = event.target.result;
                    const txn = db.transaction(table, "readwrite");
                    const store = txn.objectStore(table);
                    store.put(toRaw(data));
                    txn.oncomplete = function () {
                        db.close();
                    };
                    resolve(true)
                };
            })
        },
        async deleteStoreBykey(table: string, key : any) {
            let that = this
            return new Promise(function (resolve, _) {
                let openRequest = indexedDB.open(that.db_name, that.version);
                openRequest.onsuccess = function (event) {
                    const db = event.target.result;
                    const txn = db.transaction(table, 'readwrite');
                    const store = txn.objectStore(table);
                    store.delete(key);
                    txn.oncomplete = function () {
                        db.close();
                    };
                }
                resolve(true)
            })
        },
    },
    getters: {
    }
});
