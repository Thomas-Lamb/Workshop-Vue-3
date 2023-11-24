<template>
    <form id="form-login" class="e-lib e-formvalidator" @submit.prevent>
        <h3 class="form-title">
            <img id="logo-login"
                 :src="srcImg"
                 alt="QuickMaint"/>
        </h3>
        <div id="input-container">
            <div class="input-login form-group">
                <div class="e-float-input">
                    <input type="text" id="login" name="login" v-model="data.login" required/>
                    <span class="e-float-line"> </span>
                    <label class="e-float-text">{{ trans.get('__JSON__.user.value.login') }}</label>
                </div>
                <!--                                <div id="loginError" class="e-error" v-if="data.errorLogin">Un identifiant est requis</div>-->
            </div>
            <div class="input-login">
                <div class="e-float-input form-group">
                    <input type="password" v-model="data.password" required />
                    <span class="e-float-line"> </span>
                    <label class="e-float-text">{{ trans.get('__JSON__.user.value.password') }}</label>
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
                        {{ trans.get('__JSON__.main.content.passwordForgot') }}
                    </ejs-button>
                </div>
            </div>
            <div class="w-50">
                <div class="submit-btn mt-3">
                    <ejs-button id="submit-btn" cssClass='e-btn' style="margin-right: 10px"
                                @click="onFormSubmit">
                        {{ trans.get('__JSON__.main.content.signIn') }}
                    </ejs-button>
                </div>
            </div>
        </div>

        <div class="or-container mt-5 mb-3" style="display: flex; text-align: center; align-items: center; margin-top: 15px">
            <hr class="login-separator" style=" text-align: center;">
            <div class="or-label">{{ trans.get("__JSON__.main.login.orSignIn") }}</div>
            <hr class="login-separator">
        </div>

        <div class="d-flex" style="display: flex; justify-content: space-around; margin-top:15px;">
            <div class="w-50 text-center">
                <ejs-button
                    :disabled="appConfig.mix_config ? !appConfig.mix_config.HAS_GOOGLE_OAUTH : true"
                    id="oauthGoogle"
                    class="oauth-btn"
                    type="button"
                    @click="oauthGoogle">
                    <i class="sf-icon-google sf-icon"></i> Google
                </ejs-button>
            </div>
            <div class="w-50 text-center">
                <ejs-button
                    :disabled="appConfig.mix_config ? !appConfig.mix_config.HAS_AZURE_OAUTH : true"
                    id="oauthMicrosoft"
                    class="oauth-btn"
                    type="button"
                    @click="oauthMicrosoft">
                    <i class="sf-icon-microsoft sf-icon" ></i> Microsoft
                </ejs-button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { Data } from "../interfaces/interfaceData.ts"
import { ButtonComponent as EjsButton } from "@syncfusion/ej2-vue-buttons";
import {useAppConfigStore} from "@/stores/app-config.ts";

interface Props {
    data: Data,
    srcImg: string,
}

const trans = window.trans;

const props = defineProps<Props>()

const emit = defineEmits(['forgotPassword', 'onFormSubmit', 'oauthGoogle', 'oauthMicrosoft'])

const appConfig = useAppConfigStore();

function forgotPassword() {
    emit("forgotPassword", 'toto')
}
function onFormSubmit() {
    emit("onFormSubmit")
}
function oauthGoogle() {
    emit("oauthGoogle")
}
function oauthMicrosoft() {
    emit("oauthMicrosoft")
}
</script>

<style scoped>

</style>