<template>
      <div id="spinnerApp"></div>
      <ToastComponent
          ref="codeEmpty"
          id="main_toast"
          title="Error"
          :position="position"
          cssClass="e-toast-danger"
      ></ToastComponent>
      <ToastComponent
          ref="codeEmpty"
          id="center_toast"
          title="Success"
          :showCloseButton=true
          :position="positionCenter"
          cssClass="e-toast-danger"
      ></ToastComponent>
      <ToastComponent
          ref='swToast'
          id='sw_Toast'
          :position="positionCenter"
          :showCloseButton=true
          :animation='animation'
          :buttons='button'
      ></ToastComponent>
      <Login url-login="https://dev-qbv2-tla.ennovia.local/api/login"/>
</template>

<script setup lang="ts">
import Login from "./components/login/Login.vue";
import { ToastComponent } from "@syncfusion/ej2-vue-notifications";

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

</script>

<style>
/*@import '@/assets/sass/app.scss';
@import '../node_modules/pdfjs-dist/web/pdf_viewer.css';*/

#app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}


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
