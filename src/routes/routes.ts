import {RouteLocationNormalized} from "vue-router";
import {useNotificationsStore} from "../stores/notifications.ts";


const NotFound = { template: '<div>404</div>'};
const routes = [
    {
        path: '/',
        component: () => import('../components/templates/MainApp.vue'),
        name: 'home',
        redirect: {name: "todo"},
        children: [
            {
                path: 'tasks',
                component: () => import('../components/tasks/TasksLisView.vue'),
                name: 'tasks',
            },
            {
                path: 'todo',
                component: () => import('../components/todo/TodoListView.vue'),
                name: 'todo',
            },
            {
                path: 'notifications',
                component: () => import('../components/notifications/NotificationsListView.vue'),
                name: 'notifications',
                beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: RouteLocationNormalized) => {
                    useNotificationsStore().validAll()
                    next();
                },
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/login/Login.vue'),
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: RouteLocationNormalized) => {
            if (navigator.onLine) {
                if(sessionStorage.getItem('token') === null) {
                    next();
                } else {
                    next({path : "/" });
                }
            } else {
                next({name: "todo" });
            }
        },
    },
    { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound },
];

export default routes;