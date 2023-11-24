<template>
    <div id="spinnerApp"></div>
    <ejs-toast
      ref="codeEmpty"
      id="main_toast"
      title="Error"
      :position="position"
      cssClass="e-toast-danger"
    ></ejs-toast>
    <ejs-toast
      ref="codeEmpty"
      id="center_toast"
      title="Success"
      :showCloseButton=true
      :position="positionCenter"
      cssClass="e-toast-danger"
    ></ejs-toast>
    <ejs-toast
      ref='swToast'
      id='sw_Toast'
      :position="positionCenter"
      :showCloseButton=true
      :animation='animation'
      :buttons='button'
    ></ejs-toast>
    <router-view
        :key="routerKey"
    ></router-view>
</template>

<script setup lang="ts">
import { ToastComponent as ejsToast} from "@syncfusion/ej2-vue-notifications";
import {useLaravelEchoStore} from "@/stores/laravel-echo.ts";
import {useAppConfigStore} from "@/stores/app-config.ts";
import {useAuthStore} from "@/components/login/store/authStore.ts";

let positionCenter : any = { X: "Center", Y: "Top"}
let position : any = { X: "Right", Y: "Top"}
let animation: any =
    {
        show: { effect: "Fade Zoom In" },
        hide: { effect: "Slide Left Out" },
    }
let button: any =
    [{
        model: { content: "refresh" },
        click: null
    }, {
        model: { content: "reply" }
    }]
let routerKey = 0;

window.onfocus = function () {
    console.log('sur la page')
    useAppConfigStore().setIsOnPage(true)
};

window.onblur = function () {
    console.log("en dehors de la page")
    useAppConfigStore().setIsOnPage(false)
};

let laravelEcho = useLaravelEchoStore()
useAppConfigStore()
useAuthStore().storeSessionInIndexDb()

</script>

<style>
@import './assets/sass/app.scss';

@media print
{
  *
  {
    display: none;
  }
  canvas
  {
    display: inline;
  }
}
</style>
