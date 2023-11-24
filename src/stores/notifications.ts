import {defineStore} from "pinia";
import axios from "axios";
import {Task} from "./tasks.ts";
import {onBeforeRouteLeave} from "vue-router";
import {useIDBStore} from "./IDB-store.ts";
import {useAppConfigStore} from "./app-config.ts";

export interface Notification {
    id: number,
    title: string,
    content: string,
    label: string,
    deletable: boolean,
    read: boolean,
}

interface NotificationsState {
    new_notifications: Array<Notification>,
    old_notifications: Array<Notification>,
    count: number,
    initialize_new_notif: boolean,
    initialize_old_notif: boolean
}

export const useNotificationsStore = defineStore('notifications',{
    state: (): NotificationsState => {
        return {
            new_notifications: [], //todo remplire les notifs avec index db
            old_notifications: [], //todo remplire les notifs avec index db
            count: 0,
            initialize_new_notif: false,
            initialize_old_notif: false
        };
    },
    actions: {
        init() { //todo après avoir récupéré les notifs, les push dans index db
            //Get all newNotifications from IDB
            useIDBStore().getAllFromTable("newNotifications").then((result: any) => {
                if (this.initialize_new_notif == false) {
                    this.initialize_new_notif = true
                    this.new_notifications = result
                    console.log("Index tasks loaded !", result)
                }
            })
            //Get oldNotifications from IDB
            useIDBStore().getAllFromTable("oldNotifications").then((result: any) => {
                if (this.initialize_old_notif == false) {
                    this.initialize_old_notif = true
                    this.old_notifications = result
                    console.log("Index todo loaded !", result)
                }
            })


            axios.get(
                window.api_path + 'notifications', {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    }
                }).then(response => {
                let tmp_newNotifs: Array<Notification> = [];
                response.data.items.new.forEach((item: any) => {
                    let notification: Notification = {
                        id: item.id,
                        title: JSON.parse(item.content)[0],
                        content: JSON.parse(item.content)[1],
                        label: item.label,
                        deletable: item.deletable,
                        read: false,
                    }
                    tmp_newNotifs.push(notification)
                })
                this.new_notifications = tmp_newNotifs
                this.count = tmp_newNotifs.length

                useIDBStore().storeAllInTable("newNotifications", tmp_newNotifs)

                let tmp_oldNotifs: Array<Notification> = [];

                response.data.items.old.forEach((item: any) => {
                    let notification: Notification = {
                        id: item.id,
                        title: JSON.parse(item.content)[0],
                        content: JSON.parse(item.content)[1],
                        label: item.label,
                        deletable: item.deletable,
                        read: false,
                    }
                    tmp_oldNotifs.push(notification)
                })
                this.old_notifications = tmp_oldNotifs

                useIDBStore().storeAllInTable("oldNotifications", tmp_oldNotifs)
            })
        },
        add(eventNotification: any) {
            let newNotification: Notification = {
                id: eventNotification.id,
                title: JSON.parse(eventNotification.content)[0],
                content: JSON.parse(eventNotification.content)[1],
                label: eventNotification.label,
                deletable: eventNotification.deletable,
                read: false,
            }
            if (useAppConfigStore().getIsOnPage == false) {
                console.log("notification en mode push")
                new Notification(newNotification.title)
            }
            this.new_notifications.push(newNotification)
            this.count ++

            useIDBStore().upDateStoreInIndexedDb(newNotification, "newNotifications")
        },
        delete(notif: Notification) {
            this.new_notifications.every((notification: Notification, key: number) => {
                if (notification.id == notif.id) {
                    console.log(this.new_notifications.splice(key, 1))
                    useIDBStore().deleteStoreBykey('newNotifications', notif.id)
                    return false
                }
                return true
            })
            this.old_notifications.every((notification: Notification, key: number) => {
                if (notification.id == notif.id) {
                    console.log(this.old_notifications.splice(key, 1))
                    useIDBStore().deleteStoreBykey('oldNotifications', notif.id)
                    return false
                }
                return true
            })
            axios.delete(window.api_path + 'notifications/' + notif.id,{
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                },
            })
        },
        remove(eventTask: any) { //todo
        },
        update(eventTask: any) { //todo
        },
        validAll() {
            let notifId: number[] = []
            this.new_notifications.forEach((item) => {
                notifId.push(item.id)
                useIDBStore().deleteStoreBykey('newNotifications', item.id)
                useIDBStore().upDateStoreInIndexedDb(item, "oldNotifications")
            })
            axios.post(window.api_path + 'notifications/valideNotifications', {
                notificationsId : notifId,
            },{
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                },
            })
            this.count = 0
        },
        validAllFinish() {
            let new_oldNotifications: Array<Notification> = this.new_notifications.concat(this.old_notifications)
            this.new_notifications = []
            this.old_notifications = new_oldNotifications
        }
    },
    getters: {
        getAllNewNotifications(): Array<Notification> | null {
            let response: Array<Notification> = [].concat(this.new_notifications).reverse()
            return response
        },
        getAllOldNotifications(): Array<Notification> | null {
            let response: Array<Notification> = [].concat(this.old_notifications).reverse()
            return response
        },
        getCount(): number {
            return this.count
        }
    }
});
