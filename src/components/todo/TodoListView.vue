<template>
    <div>
        <div id="tasksLisView" >
            <card-task v-for="task in tasksStore.getMyTasks" :key="task.id" :task="task"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import CardTask from "../tasks/template/CardTask.vue";
import {useTasksStore} from "@/stores/tasks.ts";

const tasksStore = useTasksStore();


</script>

<style scoped>



</style>