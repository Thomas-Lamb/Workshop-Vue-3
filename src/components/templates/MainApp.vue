<template>
    <Header>
    </Header>
    <router-view id="mainAppBody"
        :key="routerKey"
    ></router-view>
    <Footer>
    </Footer>
</template>

<script setup lang="ts">
import Header from "../header/Header.vue";
import Footer from "../footer/Footer.vue";
import {onBeforeMount, onUnmounted} from "vue";
import {useNotificationsStore} from "@/stores/notifications.ts";
import {useLaravelEchoStore} from "@/stores/laravel-echo.ts";
import {useTasksStore} from "@/stores/tasks.ts";

let routerKey = 1;
let scrollY = window.scrollY;

onBeforeMount(() => {
    useLaravelEchoStore().init_private(); // subscribe to private channels
    useNotificationsStore().init() // get all notification in the server
    useTasksStore().init()
    window.addEventListener('scroll', scroll);
})

onUnmounted(() => {
    window.removeEventListener('scroll', scroll);
})

function scroll() {
    if (window.scrollY > scrollY) {
        hideHeaderFooter();
    }
    if (window.scrollY < scrollY) {
        showHeaderFooter();
    }
    scrollY = window.scrollY
}

function hideHeaderFooter() {
    document.getElementById("footer")?.classList.add("hideFooter");
    document.getElementById("header")?.classList.add("hideHeader");
}

function showHeaderFooter() {
    document.getElementById("footer")?.classList.remove("hideFooter");
    document.getElementById("header")?.classList.remove("hideHeader");
}

</script>

<style scoped>

</style>