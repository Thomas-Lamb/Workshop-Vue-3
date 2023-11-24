import {defineStore, StoreDefinition} from "pinia";
import {Task, useTasksStore} from "./tasks.ts";
import {useAuthStore} from "../components/login/store/authStore.ts";
import {useNotificationsStore} from "./notifications.ts";
import Echo from "laravel-echo";

export const useLaravelEchoStore = defineStore('laravelEcho',{
    state: () => {
        return {
            echo: window.Echo,
            echoListenTask: null,
            echoListenNotifications: null,
            tasksStore: useTasksStore(),
            notificationsStore: useNotificationsStore()
        };
    },
    actions: {
        init_private() {
            window.Echo.connector.options.auth.headers["Authorization"] = "Bearer " + sessionStorage.getItem("token");
            this.echo = window.Echo;
            this.echoListenTask = window.Echo.private('channel-MCB.tasks.' + useAuthStore().getUser.id)
                .listen('\\Quickbrain\\Events\\ModelChangeBroadcast', function (event: any) {
                    let tasksStore = useTasksStore()
                    console.log(event)
                    switch (event.state) {
                        case "created":
                            tasksStore.add(event.model)
                            break;
                        case "assign":
                            tasksStore.assign(event.model)
                            break;
                        case "unassign":
                            tasksStore.unassign(event.model)
                            break;
                        case "updated":
                            tasksStore.update(event.model)
                            break;
                        case "deleted":
                            tasksStore.remove(event.model)
                            break;
                    }
                })
            this.echoListenNotifications = window.Echo.private('notifications.' + useAuthStore().getUser.id)
                .listen('\\Quickbrain\\Events\\EventNotifications', function (event: any) {
                    let notificationsStore = useNotificationsStore()
                    console.log(event)
                    notificationsStore.add(event.notification)
                })
        },
        leave(chanel:string) {
            this.echo.leave(chanel)
        },
        leaveAll() {
            this.leave("channel_task")
        },
        add(eventNotification: any) {
            let newTask: Task = {
                code: eventTask.code,
                id: eventTask.id,
                designation: eventTask.designation,
                status: eventTask.status_name,
                agent: eventTask.responsible_name,
                priority: eventTask.priority_name,
                status_color: eventTask.status_color,
            }
            this.tasks.push(newTask)
        }
    },
    getters: {
    }
});
