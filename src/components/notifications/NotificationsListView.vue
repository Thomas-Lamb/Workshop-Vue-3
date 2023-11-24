<template>
    <div>
        <div id="tasksLisView" >
            <card-notification @delete-notif="deleteNotification" v-for="notification in notificationsStore.getAllNewNotifications" :key="notification.id" :notification="notification" style="border-left: 4px solid red"/>
            <card-notification @delete-notif="deleteNotification" v-for="notification in notificationsStore.getAllOldNotifications" :key="notification.id" :notification="notification"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onBeforeRouteLeave} from "vue-router";

onBeforeRouteLeave(() => {
    const notificationStore = useNotificationsStore()
    notificationStore.validAllFinish()
})

import CardNotification from "@/components/notifications/CardNotification.vue";
import {useNotificationsStore} from "@/stores/notifications.ts";

const notificationsStore = useNotificationsStore()

function deleteNotification(notification: Notification) {
    useNotificationsStore().delete(notification)
}

</script>

<style scoped>

</style>