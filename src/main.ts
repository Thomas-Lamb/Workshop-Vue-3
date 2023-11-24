import {createApp} from 'vue'
import './style.css'

// ---------- Licence ----------
import license from "./syncfusion_license.ts";
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense(license.key);

// ---------- Pinia ----------
import pinia from "./stores";

// ---------- Router ----------
import {createRouter, createWebHashHistory, Router} from 'vue-router';
import routes from './routes/routes.ts';

// ---------- App ----------
import App from './App.vue'

// ---------- Langs ----------
import LangOverride from './lang/lang-override';

// ---------- Emit ----------
import mitt from 'mitt';
//const emitter = mitt();

// ---------- Echo ----------
import Echo from "laravel-echo";

// ---------- Service Worker ----------
import { swRegister } from "./registerServiceWorker.ts";

// ---------- Globals ----------
declare global {
    interface Window {
        trans: LangOverride;
        api_path: string;
        default_locale: any;
        router: Router;
        axios: any;
        mix_config: any;
        message: any;
        UUID: UUID;
        Echo: Echo;
        io: any;
    }
}
import io from 'socket.io-client';
window.io = io;

import axios from "axios";
import {UUID} from "vue-uuid";

let default_locale = window.default_locale ? window.default_locale :  navigator.language.substring(0,2);
let base_path = import.meta.env.VITE_APP_QBV2_URL;
let api_path = base_path+"/api/";
window.api_path = api_path;

// Register SW
if(navigator.onLine) {
    swRegister()
}

await axios.get(api_path+'main_data')
    .then(response => {
        window.message = response.data.messages;
        window.mix_config = response.data.mix_config;

        let socketAdress = base_path;
        window.Echo = new Echo({
            broadcaster: 'socket.io',
            host: socketAdress,
            authEndpoint: "/api/broadcasting/auth",
            transports: ['websocket', 'polling', 'flashsocket'] // Fix CORS error!
        });
        console.log("MAIN DATA !!!")
    });

let translate = new LangOverride( {messages: window.message ,locale: default_locale, fallback: 'en' } );
window.trans = translate;

import.meta.env.BASE_URL

const piniaUse = pinia;

const app = createApp(App);

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
window.router = router;

router.beforeEach((to, from, next) => {
    if (navigator.onLine) {
        if (sessionStorage.getItem('token') === null && to.path !== "/login") {
            next({path : "/login" });
            return;
        } else {
            next()
        }
    }
})

// App use
app.use(piniaUse);
app.use(router);

app.mount('#app')

function checkNotifPermission() {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API")
    }
}

async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.log("Permission not granted")
    }
}

checkNotifPermission()
requestNotificationPermission()