/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { indexedDb } from "@/assets/mixins/indexedDb";
import { indexeddb } from "@/assets/store/indexedDbStore";
import TraductionMessagesLocal from '@/lang/traductionMessagesLocal';
import LangOverride from '@/lang/lang-override';

let default_locale = window.default_locale ? window.default_locale :  navigator.language.substring(0,2);
let translate = new LangOverride( {messages: TraductionMessagesLocal.get() ,locale: default_locale, fallback: 'en' } );
let db = indexedDb;
let store = indexeddb();

export function swRegister(active = true) {
  console.log("swRegister")

  let swPath = '/quickmaint/quickmaint-sw.js';
  if(process.env.NODE_ENV !== 'production') {
    swPath = '/quickmaint-sw.js';
  }

  register(swPath, {
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
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  });
}

