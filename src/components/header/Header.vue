<template>
    <div id="header">
        <nav>
            <div id="avatar">
                <span @click="toggleMobileNav" class="e-avatar e-avatar-small e-avatar-circle" style="border: 3px white solid;" :style="avatarStyle">
                    <img v-if="data.userImage" class="image" :src="data.userImage" alt="image" />
                    <div v-else>{{ data.avatar }}</div>
                </span>
            </div>
            <div class="searchBar">
                <div id='input-container'>
                    <ejs-textbox id="researchTextBox" :placeholder="trans.get('__JSON__.main.content.globalSearch')"></ejs-textbox>
                </div>

                <div class="search" id="buttonSearch">
                    <span @click="searchValue" class="e-icons e-search-3 color"></span>
                </div>

            </div>

            <ul v-show="!data.mobile" class="navigation">
                <li><router-link class="link" :to="{ name: 'home' }">Home</router-link></li>
                <li><router-link class="link" :to="{ name: 'home' }">About</router-link></li>
                <li><router-link class="link" :to="{ name: 'home' }">Test</router-link></li>
                <li><router-link class="link" :to="{ name: 'home' }">Hello</router-link></li>
            </ul>
            <transition name="mobile-nav">
                <ul v-show="data.mobileNav" class="dropDown-nav">
                    <ejs-button @click="toggleMobileNav">Close</ejs-button>
                    <li v-if="data.online" style="color: black">Connexion : en ligne</li>
                    <li v-if="!data.online" style="color: red">Connexion : hors ligne</li>
                    <li v-if="data.notifActivate == 'granted'" style="color: black">Notifications activé</li>
                    <li v-if="data.notifActivate != 'granted'" style="color: red">Notifications désactivé</li>
                    <ejs-button @click="useAuthStore().logoutUser()">Logout</ejs-button>
                </ul>
            </transition>
        </nav>
    </div>
</template>

<script setup lang="ts">
import {onBeforeMount, reactive} from "vue";
import axios from "axios";
import { ButtonComponent as EjsButton } from "@syncfusion/ej2-vue-buttons";
import { TextBoxComponent as EjsTextbox } from "@syncfusion/ej2-vue-inputs";
import {useAuthStore} from "@/components/login/store/authStore.ts";


let data = reactive<any> ({
    scrollPosition: null,
    mobile: true, //todo listener pour passer du mode mobile à pc en fonction de l'écran (pour le moment forcé en mobile)
    mobileNav: false,
    windowWidth: null,
    user: null,
    urlImage: null,
    userImage: null,
    avatar: null,
    colorCalcul: null,
    online: true,
    notifActivate: "granted"
})

const trans = window.trans;

function toggleMobileNav() {
    data.mobileNav = !data.mobileNav;
}

function updateStatus() {
    if (navigator.onLine) {
        data.online = true
    } else {
        data.online = false
    }
}

onBeforeMount(() => {
    data.user = JSON.parse(sessionStorage.getItem("user"));
    if(data.user != null) {
        axios
            .get(window.api_path + "users/" + data.user.id, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                }
            })
            .then((response: any) => {
                if (response.status == 200) {
                    //Images
                    data.urlImage = response.data.main.user.urlImage
                    data.userImage = data.urlImage;
                }
            });
        data.avatar = data.user.firstname.substr(0, 1) + "" + data.user.lastname.substr(0, 1);
    } else {
        data.avatar = 'QB';
    }
    data.notifActivate = Notification.requestPermission().then(response => {data.notifActivate = response})
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
})

function avatarStyle(){
    if(data.user && data.user.color && !data.userImage){
        let colors = data.colorCalcul(data.user.color);
        return colors.colorBadge+colors.colorText;
    }else{
        return "";
    }
}

function logout() {

}

</script>

<style lang="scss" scoped>
</style>
