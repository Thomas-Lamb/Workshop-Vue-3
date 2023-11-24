<template>
    <div>
        <ejs-dialog
            ref="modalEdition"
            visible=true
            :header='trans.get("__JSON__.main.content.secondAuth")'
            :animationSettings='animationSettings'
            :close="onModalClose"
            :allowDragging="true"
            :width='width'
            isModal=true>
            <div class="row">
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-12">
                            {{ trans.get("__JSON__.main.content.enterSecondAuthCode") }}
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="e-input-group data" style="width:200px">
                                <input
                                    class="e-input mb-0"
                                    type="text"
                                    v-model.lazy="code"
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="e-footer-content mt-4">
					<span>
						<ejs-button
                            class="e-control e-btn sendButton"
                            style="background: green;color:white;"
                            @click.native="restartSecondAuth"
                        >{{ trans.get("__JSON__.main.modal.button.sendAgain") }}</ejs-button>
						<ejs-button
                            class="e-control e-btn sendButton"
                            @click="onModalClose"
                        >{{ trans.get("__JSON__.main.modal.button.cancel") }}</ejs-button>
						<ejs-button
                            cssClass="e-info"
                            class="e-control e-btn e-primary sendButton"
                            @click.native="checkSecondAuth"
                        >{{ trans.get("__JSON__.main.modal.button.continue") }}</ejs-button>
					</span>
                </div>
            </div>
        </ejs-dialog>
    </div>
</template>

<script setup lang="ts">
import { ButtonComponent as EjsButton } from "@syncfusion/ej2-vue-buttons";
import {Data} from "@/components/login/interfaces/interfaceData.ts";
import axios from "axios";
interface Props {
    token: string
}

const props = defineProps<Props>()

const emit = defineEmits(['close'])

let data: object = {
    width: '600px',
    animationSettings: { effect: 'None' },
    code : "",
    tokenSecondAuth : props.token
};

function restartSecondAuth(){
    axios.post("api/restartSecondAuth", {
        token: this.tokenSecondAuth
    }).then(response => {
        this.tokenSecondAuth = response.data.tokenSecondAuth;

        this.showCenterToast(this.trans.get("__JSON__.main.content.secondAuthSentAgain"), "e-toast-success");
    }).catch(error => {
        let dataError = error.response.data['error'];

        this.showCenterToast(dataError, "e-toast-danger");
        if(error.response.data.hasOwnProperty('expired')){
            //the second auth is no longer valid
            onModalClose();
        }
    });
}

function checkSecondAuth(){
    if(this.code && this.code !== ""){
        axios.post("api/secondAuthLogin", {
            code: this.code,
            token: this.tokenSecondAuth,
        }).then(response => {
            //if success, then we have login
            this.$emit('logged',response.data)
        }).catch(error => {
            let dataError = error.response.data['error'];

            this.showCenterToast(dataError,"e-toast-danger");
            if(error.response.data.hasOwnProperty('expired')){
                //the second auth is no longer valid
                onModalClose();
            }
        });
    }else{
        this.showCenterToast(this.trans.get("__JSON__.main.content.pleaseEnterSecondAuthCode"),"e-toast-info");
    }
}

function onModalClose(){
    emit("close");
}

</script>

<style scoped>

</style>
