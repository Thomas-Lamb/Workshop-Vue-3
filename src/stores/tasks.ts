import {defineStore} from "pinia";
import axios from "axios";
import {useIDBStore} from "./IDB-store.ts";

export interface Task {
    code: string,
    id: number,
    designation: string,
    status: string,
    agent: string,
    priority: string,
    status_color: string,
}

export interface TasksState {
    tasks: Array<Task>,
    myTasks: Array<Task>,
    length: number,
    initialize_tasks: boolean
    initialize_todo: boolean
}

export const useTasksStore = defineStore('tasks',{
    state: (): TasksState => {
        return {
            tasks: [],
            myTasks: [],
            length: 0,
            initialize_tasks: false,
            initialize_todo: false
        };
    },
    actions: {
        init() {
            //Get all task from IDB
            useIDBStore().getAllFromTable("tasks").then((result: any) => {
                if (this.initialize_tasks == false) {
                    this.initialize_tasks = true
                    this.tasks = result
                    console.log("Index tasks loaded !", result)
                }
            })
            //Get todoo from IDB
            useIDBStore().getAllFromTable("todo").then((result: any) => {
                if (this.initialize_todo == false) {
                    this.initialize_todo = true
                    this.myTasks = result
                    console.log("Index todo loaded !", result)
                }
            })


            // Get my Tasks and store all in IDB todo
            axios.get(
                window.api_path + 'tasks/getmytasks', {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    }
                }).then(response => {
                let myTasks: Array<Task> = []
                response.data.my_tasks.forEach((item: any) => {
                    let tmp_task = JSON.parse(item)
                    let task: Task = {
                        code: tmp_task.code,
                        id: tmp_task.id,
                        designation: tmp_task.designation,
                        status: tmp_task.status_name,
                        agent: tmp_task.responsible_name,
                        priority: tmp_task.priority_name,
                        status_color: tmp_task.status_color,
                    };
                    myTasks.push(task)
                })
                this.initialize_todo = true
                this.myTasks = myTasks
                console.log("axios tasks loaded !", myTasks)
                return myTasks
            }).then((myTasks) => {
                useIDBStore().storeAllInTable("todo", myTasks)
            })

            // Get all tasks and store all in IDB tasks
            axios.get(
                window.api_path + 'tasks/grid/1', {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    }
                }).then(response => {
                let tmp_myTasks: Array<Task> = []
                console.log(response)
                response.data.items.forEach((item: any) => {
                    let tmp_task = JSON.parse(item)
                    let task: Task = {
                        code: tmp_task.code,
                        id: tmp_task.id,
                        designation: tmp_task.designation,
                        status: tmp_task.status_name,
                        agent: tmp_task.responsible_name,
                        priority: tmp_task.priority_name,
                        status_color: tmp_task.status_color,
                    };
                    tmp_myTasks.push(task)
                })
                this.initialize_tasks = true
                this.tasks = tmp_myTasks
                console.log("axios tasks loaded !", tmp_myTasks)
                return tmp_myTasks
            }).then((tasks) => {
                useIDBStore().storeAllInTable("tasks", tasks)
            })
        },
        add(eventTask: any) {
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
            useIDBStore().upDateStoreInIndexedDb(newTask, "tasks")
        },
        assign(eventTask: any) {
            let newTask: Task = {
                code: eventTask.code,
                id: eventTask.id,
                designation: eventTask.designation,
                status: eventTask.status_name,
                agent: eventTask.responsible_name,
                priority: eventTask.priority_name,
                status_color: eventTask.status_color,
            }
            this.myTasks.push(newTask)
            useIDBStore().upDateStoreInIndexedDb(newTask, "todo")
        },
        remove(eventTask: any) {
            this.tasks.forEach((task: Task, key: number) => {
                if (task.id == eventTask.id) {
                    this.tasks.splice(key, 1)
                    useIDBStore().deleteStoreBykey('tasks', eventTask.id)
                }
            })
            this.myTasks.forEach((task: Task, key: number) => {
                if (task.id == eventTask.id) {
                    this.myTasks.splice(key, 1)
                    useIDBStore().deleteStoreBykey('todo', eventTask.id)
                }
            })
        },
        unassign(eventTask: any) {
            this.myTasks.forEach((task: Task, key: number) => {
                if (task.id == eventTask.id) {
                    console .log("splice !", this.myTasks.splice(key, 1))
                    useIDBStore().deleteStoreBykey('todo', eventTask.id)
                    return
                }
            })
        },
        update(eventTask: any) { //todo upgrade utiliser un find
            this.myTasks.forEach((task: Task, key: number) => {
                if (task.id == eventTask.id) {
                    this.myTasks[key].code = eventTask.code
                    this.myTasks[key].designation = eventTask.designation
                    this.myTasks[key].status = eventTask.status_name
                    this.myTasks[key].agent = eventTask.responsible_name
                    this.myTasks[key].priority = eventTask.priority_name
                    this.myTasks[key].status_color = eventTask.status_color
                    useIDBStore().upDateStoreInIndexedDb(this.myTasks[key], "todo")
                }
            });
            this.tasks.forEach((task: Task, key: number) => {
                if (task.id == eventTask.id) {
                    this.tasks[key].code = eventTask.code
                    this.tasks[key].designation = eventTask.designation
                    this.tasks[key].status = eventTask.status_name
                    this.tasks[key].agent = eventTask.responsible_name
                    this.tasks[key].priority = eventTask.priority_name
                    this.tasks[key].status_color = eventTask.status_color
                    useIDBStore().upDateStoreInIndexedDb(this.tasks[key], "tasks")
                }
            });
        }
    },
    getters: {
        getAllTasks(): Array<Task> | null {
            return this.tasks
        },
        getLength(): number {
            return this.length
        },
        getMyTasks(): Array<Task> {
            return this.myTasks
        }
    }
});
