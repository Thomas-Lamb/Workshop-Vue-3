<template>
    <div class='e-card my-card' :style="'border-left: 4px solid ' + task.status_color">
        <div class="card-template">
            <div class="card-left">
                <div class="card-title">
                    <div class="card-title-text">{{ task.code }}</div>
                </div>
                <div class="card-designation">
                    <div class="card-designation-text">{{ task.designation }}</div>
                </div>
            </div>
            <div class="card-rigth">
                <div class="card-info">
                    <div class="card-statut">{{ task.status }}</div>
                </div>
                <div class="card-info">
                    <div class="card-priority">{{ task.priority }}</div>
                </div>
                <div class="card-info">
                    <div class="card-agent">{{ task.agent }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {Task} from "@/stores/tasks.ts";

interface Props {
    task: Task
}

const props = defineProps<Props>()
</script>

<style scoped>

</style>