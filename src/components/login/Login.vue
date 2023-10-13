<template>
    <div id="boxLogin" class="">
        <div id="spinnerLogin"></div>
        <div  class="control_wrapper e-card" id="wrapper-login">
            <!-- Initialize Uploader -->
            <div class="e-card-stacked">
                <div class="e-card-content m-2">
                    <form v-if="!data.forgotPassword" id="form-login" class="e-lib e-formvalidator" @submit.prevent>
                        <h3 class="form-title">
                            <img id="logo-login"
                                 src="/img/icons/logo-text-sombre.svg"
                                 alt="QuickMaint"/>
                        </h3>
                        <div id="input-container">
                            <div class="input-login form-group">
                                <div class="e-float-input">
                                    <input type="text" v-model="data.login" required />
                                    <span class="e-float-line"> </span>
                                    <label class="e-float-text">Identifiant</label>
                                </div>
<!--                                <div id="loginError" class="e-error" v-if="data.errorLogin">Un identifiant est requis</div>-->
                            </div>
                            <div class="input-login">
                                <div class="e-float-input form-group">
                                    <input type="password" v-model="data.password" required />
                                    <span class="e-float-line"> </span>
                                    <label class="e-float-text">Mot de passe</label>
                                </div>
<!--                                <div id="passwordError" class="e-error" v-if="data.errorPassword" >Un mot de passe est requis</div>-->
                            </div>
                        </div>
                        <div id="credentialsError" class="e-error" v-if="data.errorCredentials">Identifiant ou mot de passe incorrect</div>
                        <div class="first-btns">
                            <div class="w-50">
                                <div class="submit-btn mt-3">
                                    <ejs-button type="button" id="recup-password" cssClass='e-link e-small' style="padding: 0px; margin-left: 10px;"
                                                @click="forgotPassword">
                                        Mot de passe oublié
                                    </ejs-button>
                                </div>
                            </div>
                            <div class="w-50">
                                <div class="submit-btn mt-3">
                                    <button class="e-btn" id="submit-btn" @click="onFormSubmit" style="margin-right: 10px">Se connecter</button>
                                </div>
                            </div>
                        </div>
                        <!--<div class="or-container mt-5 mb-3">
                            <div class="line-separator"></div>
                            <div class="or-label">Se connecter avec :</div>
                            <div class="line-separator"></div>
                        </div>


                        <div class="d-flex justify-content-center ">
                            <div class="w-50 text-center">
                                <ButtonComponent
                                    cssClass='e-btn'
                                    id="oauthGoogle">
                                        <i class="sf-icon-google"></i> Google
                                </ButtonComponent>
                            </div>
                            <div class="w-50 text-center">
                                <ButtonComponent
                                cssClass='e-btn'
                                id="oauthMicrosoft">
                                    <i class="sf-icon-microsoft" ></i> Microsoft
                                </ButtonComponent>
                            </div>
                        </div>-->

                    </form>


                    <form v-if="data.forgotPassword" id="form-forgot-password" class="e-lib e-formvalidator" @submit.prevent>
                        <h3 class="form-title">
                            <img id="logo-login"
                                 src="/img/icons/logo-text-sombre.svg"
                                 alt="QuickMaint"/>
                        </h3>
                        <div id="input-container">
                            <div class="input-login form-group">
                                <div class="e-float-input">
                                    <input type="text" v-model="data.login" required />
                                    <span class="e-float-line"> </span>
                                    <label class="e-float-text">Identifiant</label>
                                </div>
<!--                                <div id="loginError" class="e-error" v-if="data.errorLogin">Un identifiant est requis</div>-->
                            </div>
                        </div>

                        <div class="first-btns">
                            <div class="w-50">
                                <div class="submit-btn mt-3">
                                    <ejs-button @click="props.functionSetSession" type="button" id="recup-password" cssClass='e-link e-small' style="padding: 0px; margin-left: 10px;">
                                        Annuler
                                    </ejs-button>
                                </div>
                            </div>
                            <div class="w-50">
                                <div class="submit-btn mt-3">
                                    <button class="e-btn" id="submit-btn" @click="" style="margin-right: 10px">Changer le mot de passe</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ButtonComponent as EjsButton } from "@syncfusion/ej2-vue-buttons";
import { onMounted, ref, reactive } from "vue";
import { hideSpinner, showSpinner} from "@syncfusion/ej2-popups";
import axios from "axios";
import { setSession } from "./functions/functionSetSession.ts";
import { Data } from "./interfaces/interfaceData.ts"
import { Credentials, DataUser } from "./interfaces/interfaceLogin.ts"

const emit = defineEmits(['fncSetSession', 'needRgbd', 'passwordNeedUpdate', 'passwordValidationDateExpired', 'secondAuthToken'])

interface Props {
    urlLogin?: string,
    functionSetSession?: Function
}


const props = withDefaults(defineProps<Props>(), {
    urlLogin: 'https://dev-qbv2-tla.ennovia.local/api/login',//todo récupérer l'url de base dunavigateur en cours
    functionSetSession: setSession
})

const data = reactive<Data>({
    login : "",
    password : "",
    errorLogin : false,
    errorPassword : false,
    errorCredentials : false,
    forgotPassword: false
})

const dataUser: DataUser = ({
    token : "",
})

onMounted(() => {
    let inputElement: NodeListOf<Element>;
    inputElement = document.querySelectorAll('.e-float-input input');

    inputElement.forEach((item) => {
        item.addEventListener("focus", function (this: Element) {
            if (this.parentNode) {
                this.parentNode.classList.add('e-input-focus');
            }
        });
        item.addEventListener("blur", function (this: Element) {
            if (this.parentNode) {
                this.parentNode.classList.remove('e-input-focus');
            }
        })
    })
})

function showLoginSpinner(){
    let spinnerApp: HTMLElement | null = document.getElementById("spinnerLogin")
    if (spinnerApp) showSpinner(spinnerApp)
}
function hideLoginSpinner(){
    let spinnerApp: HTMLElement | null = document.getElementById("spinnerLogin")
    if (spinnerApp) hideSpinner(spinnerApp)
}

function onFormSubmit() {
    data.errorPassword = false
    data.errorLogin = false
    data.errorCredentials = false
    if(data.login === "") {data.errorLogin = true}
    if (data.password === "") {data.errorPassword = true}
    if (!data.errorLogin && !data.errorPassword) {
        let credentials: Credentials = {login: data.login, password: data.password};
        login(credentials)
    }
}

function checkUserIsLog(token: any) {
    return dataUser.token = token;
}

function login(credentials: Credentials) {
    // let router = dataLogin.router;
    axios.post(
        props.urlLogin, {
            login: credentials.login,
            password: credentials.password,
        }
    ).then(({ data }) => {
        console.log(data)

        // that.setLocalStorageInfo(data); todo à voir, certainement index db
        //Need new password
        if(data.user.ip_terms_validation === null) {
            emit('needRgbd');
        }
        if(data.passwordNeedUpdate){
            //Show popup to update the password to the current parameters
            emit("passwordNeedUpdate");
            return;
        }
        if(data.validationDateExpired){
            //Show popup to update the password because it has expired(renewal or not connected since a long time)
            emit("passwordValidationDateExpired");
            return;
        }
        //Two Factor Auth
        if(data.tokenSecondAuth){
            //Go for second auth
            emit("secondAuthToken",data.tokenSecondAuth);
        }else{
            //go for direct login
            props.functionSetSession(data)
            checkUserIsLog(data.success.token); //todo fnc
            if(typeof data.user.date_terms_validation == "object" || typeof data.user.ip_terms_validation == "object") {
                sessionStorage.removeItem('isAuth');
                // router.push({ todo mettre en place router
                //     name: "rgpd"
                // });
            } else {
                console.error('Connection par lien indisponible')
                //todo c'est la redirection par lien vers un fichier, c'est à faire pour l'implémentation dans QB
                // showLoginSpinner();
                // if(this.externalSearch && this.externalSearch.type && this.externalSearch.content){
                //     hideLoginSpinner();
                //     if(this.externalSearch.type === "centralPanels"){
                //         centralpanelStore.addingCentralPanels(this.externalSearch.content);
                //         setTimeout(() => {
                //             location.href = window.mix_config.MIX_APP_URL+'/#/'+this.externalSearch.type;
                //         })
                //     }else{
                //         location.href = window.mix_config.MIX_APP_URL+'/#/'+this.externalSearch.type;
                //     }
                // }else{
                //     router.push({
                //         name: "Loading"
                //     }).then(()=>{
                //         hideLoginSpinner();
                //     });
                // }
            }
        }
    }).catch(error => {
        if(error) {
            data.errorCredentials = true
            console.log(error)
        }
    });
}

function forgotPassword() {
    if (data.forgotPassword) {data.forgotPassword = false; return;}
    if (!data.forgotPassword) {data.forgotPassword = true; return;}
}

</script>

<style>
@import "/node_modules/@syncfusion/ej2-base/styles/material.css";
@import "/node_modules/@syncfusion/ej2-vue-inputs/styles/material.css";
@import "/node_modules/@syncfusion/ej2-vue-buttons/styles/material.css";

body {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-image: url("@/assets/img/bg_login.png");
    background-repeat: no-repeat;
    background-position: bottom left;
    background-size: auto 100vh;
    background-color: #1e222b;
    align-items: center;
    justify-content: center;
}

#boxLogin {
    width: 100%;
    height: 100vh;
    display:flex;
    align-items: center;
    justify-content: center;
}

#logo-login {
    width: 100%;
}

.e-float-text {
    color: lightgray !important;
    text-align: left;
}

.e-float-input input {
    border-color: lightgray;
    color: lightgray;
}
.e-float-input input:hover {
    border-color: lightgray !important;
    color: lightgray !important;
}

.input-login {
    padding: 5px 10px;
}

.e-float-line:before, .e-float-line:after {
   background: #D66D26 !important;
}

#wrapper-login {
    max-height: 600px;
    max-width: 400px;
}

#recup-password {
    color: #D66D26;
}

#submit-btn {
    background-color: #D66D26;
    color: white;
}

.first-btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 25px;
}

</style>
