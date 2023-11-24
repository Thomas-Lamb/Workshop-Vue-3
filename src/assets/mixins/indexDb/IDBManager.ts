import { toRaw } from 'vue';
const version = 1;
//let openRequest = indexedDB.open("quickdoc", version);
export const IDBManager = {
    data() {
        return {
        }
    },
    methods: {
        /**
         *
         * get toute la donnée d'un store
         *
         * @param {string} storeName
         *
         * @return {promise}
         *
         * */
        getStoreContent(storeName: string) {
            return new Promise(function (resolve, _) {
                let openRequest = indexedDB.open("quickmaint", version);
                openRequest.onsuccess = function(event) {
                    const db = event.target.result;
                    const txn = db.transaction(storeName, "readonly");
                    const objectStore = txn.objectStore(storeName);
                    objectStore.getAll().onsuccess = function (event) {
                        resolve(event.target.result);
                    }
                    txn.oncomplete = function () {
                        db.close();
                    };
                }
            });
        },
        /**
         *
         * get une donnée d'un store
         *
         * @param {string} storeName
         * @param {number} fileId
         *
         * @return {promise}
         *
         * */
        getStoreBykey(storeName,fileId) {
            let that = this;
            return new Promise(function (resolve, _) {
                let openRequest = indexedDB.open("quickdoc", version);
                openRequest.onsuccess = function(event) {
                    that.getStoreDataByKey(event,storeName,fileId).then(data => {
                        resolve(data);
                    })
                }
            });
        },
        /**
         *
         * Insert les données dans un store
         *
         * @param {array} data
         * @param {number} idUser
         * @param {string} storeName
         *
         * */
        insertDataInStoreIndexedDb(data,idUser,storeName) {
            return new Promise((resolve,_) => {
                let openRequest = indexedDB.open("quickdoc", version);
                openRequest.onsuccess = function(event) {
                    const db = event.target.result;
                    const txn = db.transaction(storeName, "readwrite");
                    const store = txn.objectStore(storeName);
                    data.forEach(element => {
                        //le 2eme parametre, la condition ternaire  est specifique à quickdoc doit être remplacé par id d'un element inseré dans indexed db
                        store.put(element,element.fileId ? element.fileId : element.id);
                    });

                    txn.oncomplete = function () {
                        db.close();
                    };
                    resolve(true);
                };
            });
        },
        /**
         *
         * update une donnée dans un store
         *
         * @param {object} data
         * @param {number} idUser
         * @param {string} storeName
         * @param {number} fileId
         *
         * @return {void}
         *
         * */
        upDateStoreInIndexedDbByKey(data,idUser,storeName,fileId) {
            let openRequest = indexedDB.open("quickdoc", version);
            openRequest.onsuccess = function(event) {
                const db = event.target.result;
                const txn = db.transaction(storeName, "readwrite");
                const store = txn.objectStore(storeName);
                store.put(toRaw(data),fileId);
                txn.oncomplete = function () {
                    db.close();
                };
            };
        },
        /**
         *
         * get une donnée venant d'un store
         *
         * @param {Event} event
         * @param {string} storeName
         * @param {number} key
         *
         * @return {Promise}
         *
         * */
        getStoreDataByKey(event,storeName,key) {
            return new Promise((resolve,_) => {
                const db = event.target.result;
                const txn = db.transaction(storeName, "readonly");
                const objectStore = txn.objectStore(storeName);
                objectStore.get(key).onsuccess = function (event) {
                    resolve(event.target.result);
                }
                txn.oncomplete = function () {
                    db.close();
                };
            });
        },
        /**
         *
         * delete une donnée d'un store
         *
         * @param {string} storeName
         * @param {number} fileId
         *
         *
         * @return {void}
         * */
        deleteStoreBykey(storeName,fileId) {
            let openRequest = indexedDB.open("quickdoc", version);
            openRequest.onsuccess = function(event) {
                const db = event.target.result;
                const txn = db.transaction(storeName, 'readwrite');
                const store = txn.objectStore(storeName);
                store.delete(fileId);
                txn.oncomplete = function () {
                    db.close();
                };
            }
        },
        /**
         *
         * delete toute la donnée d'un store
         *
         * @param {string} storeName
         *
         * @return {void}
         * */
        deleteStore(storeName) {
            let openRequest = indexedDB.open("quickdoc", version);
            openRequest.onsuccess = function(event) {
                const db = event.target.result;
                const txn = db.transaction(storeName, 'readwrite');
                const store = txn.objectStore(storeName);
                store.clear();
                txn.oncomplete = function () {
                    db.close();
                };
            }
        },
    }
}
