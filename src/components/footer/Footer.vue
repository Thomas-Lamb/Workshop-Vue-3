<template>
    <div id="footer">
        <div id="todoFooterButton" class="footerNavButton selected" @click="footerNavigation('todo', 0)">
            <span class="e-icons sf-icon-tasks color"></span>
            <div>ToDo</div>
        </div>
        <div id="tasksFooterButton" class="footerNavButton" @click="footerNavigation('tasks', 1)">
            <span class="e-icons sf-icon-tasks color"></span>
            <div>Tasks</div>
        </div>
        <div id="notificationsFooterButton" class="footerNavButton" @click="footerNavigation('notifications', 2)">
            <div id="wrapper-notification">
                <span class="e-icons sf-icon-reminder--02 color"></span>
                <span v-if="notificationsStore.count > 0" id="notification-indicator" class="e-badge e-badge-primary e-badge-notification">{{ notificationsStore.count }}</span>
            </div>
            <div>Notifications</div>
        </div>
        <div id="selector" class="footerNavButton"></div>
    </div>
</template>

<script setup lang="ts">
import {useNotificationsStore} from "@/stores/notifications.ts";

const router = window.router
let selectorPos = 0
let notificationsStore = useNotificationsStore()

function footerNavigation(next: string, position: number) {
    document.getElementById("selector")?.classList.remove("position-" + selectorPos)
    document.getElementById("selector")?.classList.add("position-" + position)
    document.getElementsByClassName("selected")[0]?.classList.remove("selected");
    document.getElementById(next+"FooterButton")?.classList.add("selected");
    selectorPos = position
    router.push({ name: next })
}
</script>

<style scoped lang="scss">



</style>