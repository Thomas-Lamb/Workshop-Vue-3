<template>
    <div id="boxLogin" class="">
        <div id="spinnerLogin"></div>
        <div  class="control_wrapper e-card" id="wrapper-login">
            <div class="e-card-stacked">
                <div class="e-card-content">
                    <form-login
                        v-if="!data.forgotPassword && !authStore.showSecondAuthPopup"
                        :data="data"
                        :src-img="srcImg"
                        @forgot-password="forgotPassword"
                        @on-form-submit="onFormSubmit"
                        @oauth-google="oauthGoogle"
                        @oauth-microsoft="oauthMicrosoft"
                        :function-login="functionLogin"
                    ></form-login>

                    <form-forgot-password
                        v-if="data.forgotPassword"
                        :data="data"
                        :src-img="srcImg"
                        @forgot-password="forgotPassword"
                        @submit-forgot-password="submitForgotPassword"
                    ></form-forgot-password>

                    <second-auth-popup
                        v-if="authStore.showSecondAuthPopup"
                        :token="authStore.secondAuthToken"
                        @close="closeSecondAuthPopup"
                        @logged="secondAuthLogged"
                    ></second-auth-popup>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, watchEffect} from "vue";
import {createSpinner, DialogUtility, hideSpinner, showSpinner} from "@syncfusion/ej2-popups";
import axios from "axios";
import { Data } from "./interfaces/interfaceData.ts"
import { Credentials } from "./interfaces/interfaceLogin.ts"
import { useAuthStore } from "./store/authStore.ts";
import secondAuthPopup from "./templates/secondAuthPopup.vue";
import FormLogin from "./templates/FormLogin.vue";
import FormForgotPassword from "./templates/FormForgotPassword.vue";

interface Props {
    functionLogin?: Function,
    primaryColor?: string,
    secondaryColor?: string,
    srcImg?: string,
    authStore?: any
}

const props = withDefaults(defineProps<Props>(), {
    authStore: useAuthStore(),
    functionLogin: useAuthStore().login,
    primaryColor: "#D66D26",
    secondaryColor: "#D3D3D3",
    srcImg: "/img/icons/logo-text-claire.svg",
})

const data = reactive<Data>({
    login : "",
    password : "",
    forgotPasswordLogin: "",
    errorLogin : false,
    errorPassword : false,
    errorCredentials : false,
    forgotPassword: false,
    spinnerLogin: null,
    showSecondAuthPopup: false,
    secondAuthToken: null,
    dialogElement: null,
    googleAuthDisabled: true, // todo récupérer l'environement (mix_config)
    microsoftAuthDisabled: true, // todo récupérer l'environement (mix_config)
})

onMounted(() => {
    let inputElement: NodeListOf<Element>;
    inputElement = document.querySelectorAll('.e-float-input input');

    inputElement.forEach((item) => {
        item.addEventListener("focus", function (this: Element) {
                this.parentElement!.classList.add('e-input-focus');
        });
        item.addEventListener("blur", function (this: Element) {
                this.parentElement!.classList.remove('e-input-focus');
        });
    })
    data.spinnerLogin = document.getElementById("spinnerLogin");
    createSpinner({
        target: data.spinnerLogin!
    });
})

function showLoginSpinner(){
    showSpinner(data.spinnerLogin!)
}
function hideLoginSpinner(){
    hideSpinner(data.spinnerLogin!)
}
function setErrorCredentials(){
    data.errorCredentials = true;
}

function onFormSubmit() {
    data.errorPassword = false
    data.errorLogin = false
    data.errorCredentials = false
    if(data.login === "") {data.errorLogin = true}
    if (data.password === "") {data.errorPassword = true}
    if (!data.errorLogin && !data.errorPassword) {
        let credentials: Credentials = {login: data.login, password: data.password};
        props.functionLogin(credentials, showLoginSpinner, hideLoginSpinner, setErrorCredentials)
        // if (sessionStorage.getItem('token'))
    }
}

function submitForgotPassword() {
    showLoginSpinner();
    let dataUser: object = { login: data.forgotPasswordLogin};
    axios.post(api_path+"forgotPassword", dataUser)
        .then(() => {
            hideLoginSpinner();
            showCenterToast(
                trans.get('__JSON__.main.modal.toast.success.email'),
                "e-toast-success",
                trans.get('__JSON__.user.toast.success.mailChangePassword'),
            );
            forgotPassword();
        })
        .catch(error => {
            hideLoginSpinner();
            console.error(error)
        });
    data.forgotPasswordLogin = "";
}


function getSyncfusionInstance(elementId: string, functionWanted: string){
    let element = document.getElementById(elementId);
    return getSyncfusionInstanceFromElement(element!, functionWanted);
}

function getSyncfusionInstanceFromElement(element: HTMLElement, functionWanted: string){
    if(!element){
        return null;
    }
    let syncfusionInstance = null;
    let firstInstance: any = null;
    if(element && element.ej2_instances){
        element.ej2_instances.forEach((instance: any) => {
            if(!firstInstance){
                firstInstance = instance;
            }
            if(typeof instance[functionWanted] == "function"){
                syncfusionInstance = instance;
            }
        })
    }
    if(!syncfusionInstance){
        //last try if not found
        syncfusionInstance = firstInstance;
    }
    return syncfusionInstance;
}

function showToastFromId(idToast: string, title: string, cssClass = "e-toast-success", content = "", timeout = 5000){
    let toast = getSyncfusionInstance(idToast, 'show');
    if(toast){
        toast.show({
            title : title,
            content : content,
            cssClass : cssClass,
            timeout : timeout,
        })
    }
}

function showCenterToast(title: string,  cssClass = "e-toast-success", content = "", timeout = 5000){
    showToastFromId('center_toast', title, cssClass, content, timeout);
}

function oauthGoogle(){
    oauthAxios('GoogleOAuth'); //689
}
function oauthMicrosoft(){
    oauthAxios('AzureOAuth'); //690
}

function secondAuthLogged() {
    closeSecondAuthPopup();
    props.authStore.secondAuthLogin({
        dataSource: data,
        //router: this.$router, todo quand le router sera là ajouter le router
        spinnerOn : showLoginSpinner,
        spinnerOff : hideLoginSpinner
    });
}

function closeSecondAuthPopup(){
    props.authStore.setShowSecondAuthPopup(false);
    props.authStore.secondAuthToken = false;
}

function passwordNeedUpdate(){
    showPopupMail(trans.get("__JSON__.main.content.passwordNeedUpdate"));
}
function passwordValidationDateExpired(){
    showPopupMail(trans.get("__JSON__.main.content.passwordExpired"));
}
function showPopupMail(content: string){
    data.dialogElement = DialogUtility.alert({
        title: trans.get('__JSON__.main.content.passwordRenewalNeeded'),
        content: content,
        okButton: { text: trans.get('__JSON__.main.modal.button.ok'), click: closePopup },
        showCloseIcon: true,
        closeOnEscape: true,
        animationSettings: { effect: "Zoom" }
    });
}


function closePopup(){
    if(data.dialogElement){
        data.dialogElement.hide();
    }
}

function oauthAxios(provider: string){
    axios
        .get(api_path + "oauth_connect/"+provider)
        .then(response => {
            let result = response.data.result;
            if(result === true || result === false){
                //deployment case
                if(response.data.result){
                    showCenterToast(trans.get('__JSON__.connection.toast.success.test'), "e-toast-success");
                }else{
                    showCenterToast(trans.get('__JSON__.connection.toast.warning.test'), "e-toast-warning");
                }
            }else{
                location.href = result;
            }
        })
        .catch(() => {
            hideSpinner(document.getElementById("spinnerMainConnection")!);
            showCenterToast(trans.get('__JSON__.connection.toast.error.test'),"e-toast-danger");
        });
}

function forgotPassword() {
    if (data.forgotPassword) {data.forgotPassword = false; return;}
    if (!data.forgotPassword) {data.forgotPassword = true; return;}
}

watchEffect( () => {
    if (props.authStore.showPasswordValidationDateExpired) {
        passwordValidationDateExpired()
        props.authStore.showPasswordValidationDateExpired = false;
    }
    if (props.authStore.showPasswordNeedUpdate) {
        passwordNeedUpdate()
        props.authStore.showPasswordNeedUpdate = false;
    }
})

</script>

<style>

</style>
