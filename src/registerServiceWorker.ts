/* eslint-disable no-console */

import { register } from 'register-service-worker';
/*
To do
import { indexedDb } from "@/assets/mixins/indexedDb";
import { indexeddb } from "@/assets/store/indexedDbStore";
import TraductionMessagesLocal from '@/lang/traductionMessagesLocal';
import LangOverride from '@/lang/lang-override';
let default_locale = window.default_locale ? window.default_locale :  navigator.language.substring(0,2);
let translate = new LangOverride( {messages: TraductionMessagesLocal.get() ,locale: default_locale, fallback: 'en' } );
let db = indexedDb;
let store = indexeddb();
 */

export function swRegister() {
  console.log("swRegister")

  let swPath = import.meta.env.VITE_APP_URL+'quickmaint-sw.js';

  navigator.serviceWorker.register(swPath, {
    ready () {
      console.log('App is being served from cache by a service worker.');
    },
    registered () {
      console.log('Service worker has been registered.');
    },
    cached () {
      console.log('Content has been cached for offline use.');
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error: any) {
      console.error('Error during service worker registration');
      console.error(error);
    }
  })
      .then((reg) => {
        console.log('SW registered!', reg)
      })
      .catch(err => console.log('Boo!', err));;
}

