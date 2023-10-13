import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import license from "./assets/authServer/keyLisenseSyncfusion.ts";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(license.key);
createApp(App).mount('#app')
