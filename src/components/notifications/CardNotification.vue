<template>
    <div class='e-card my-card'>
        <div class="card-template">
            <div class="card-left">
                <div class="card-title">
                    <div class="card-title-text">{{ notification.title }}</div>
                </div>
                <div class="card-designation">
                    <div class="card-designation-text">{{ notification.content }}</div>
                </div>
            </div>
            <div class="card-rigth">
                <div class="card-info" @click="deleteNotification">
                    <div class="card-statut">Supprimer</div>
                </div>
                <div class="card-info">
                    <div class="card-priority">{{ notification.id }}</div>
                </div>
                <div class="card-info">
                    <div class="card-agent">{{ notification.label }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {Notification, useNotificationsStore} from "@/stores/notifications.ts";

interface Props {
    notification: Notification
}

const props = defineProps<Props>()

const emit = defineEmits(['delete-notif'])

function deleteNotification() {
    emit("delete-notif", props.notification)
    console.log("delete-notif")
}

</script>

<style scoped>

</style>