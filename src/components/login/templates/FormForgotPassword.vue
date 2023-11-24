<template>
    <form id="form-forgot-password" class="e-lib e-formvalidator" @submit.prevent>
        <h3 class="form-title">
            <img id="logo-login"
                 :src="srcImg"
                 alt="QuickMaint"/>
        </h3>
        <div id="input-container">
            <div class="input-login form-group">
                <div class="e-float-input">
                    <input type="login" v-model="data.forgotPasswordLogin" required />
                    <span class="e-float-line"> </span>
                    <label class="e-float-text">{{ trans.get('__JSON__.user.value.login') }}</label>
                </div>
            </div>
        </div>

        <div class="first-btns">
            <div class="w-50">
                <div class="submit-btn mt-3">
                    <ejs-button @click="forgotPassword" type="button" id="recup-password" cssClass='e-link e-small' style="padding: 0px; margin-left: 10px;">
                        {{ trans.get('__JSON__.main.modal.button.cancel') }}
                    </ejs-button>
                </div>
            </div>
            <div class="w-50">
                <div class="submit-btn mt-3">
                    <ejs-button type="submit" id="submit-btn" cssClass='e-btn' style="margin-right: 10px"
                                @click="submitForgotPassword">
                        {{ trans.get('__JSON__.user.content.changePassword') }}
                    </ejs-button>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ButtonComponent as EjsButton } from "@syncfusion/ej2-vue-buttons";
import {Data} from "@/components/login/interfaces/interfaceData.ts";

interface Props {
    data: Data,
    srcImg: string
}

const props = defineProps<Props>()

const trans = window.trans;

const emit = defineEmits(['submitForgotPassword', 'forgotPassword'])

function submitForgotPassword() {
    if (props.data.forgotPasswordLogin == "") {
        return;
    }
    emit("submitForgotPassword")
}
function forgotPassword() {
    emit("forgotPassword")
}

</script>

<style scoped>

</style>