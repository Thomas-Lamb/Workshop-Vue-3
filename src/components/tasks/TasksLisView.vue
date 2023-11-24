<template>
    <div>
        <div id="tasksLisView" >
            <card-task v-for="task in tasksStore.getAllTasks" :key="task.id" :task="task"/>
        </div>
    </div>
</template>

<script setup lang="ts">
//Pas de syncfusion ici car syncfusion ça pue la merde !
import CardTask from "./template/CardTask.vue";
import {useTasksStore} from "@/stores/tasks.ts";

const tasksStore = useTasksStore();


</script>

<style scoped>



</style>