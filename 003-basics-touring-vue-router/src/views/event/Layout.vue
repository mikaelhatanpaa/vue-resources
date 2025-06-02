<script setup>
import EventService from "@/services/EventService.js";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";

const router = useRouter();
const props = defineProps(["id"]);

const event = ref("");
const id = computed(() => props.id);
onMounted(() => {
  EventService.getEvent(id.value)
    .then((response) => {
      event.value = response.data;
    })
    .catch((error) => {
      if (error.response && error.response.status == 404) {
        router.push({
          name: "404Resource",
          params: { resource: "event" },
        });
      } else {
        router.push({
          name: "NetworkError",
        });
      }
      console.log(error);
    });
});
</script>

<template>
  <div v-if="event">
    <h1>{{ event.title }}</h1>
    <div id="nav">
      <!-- <router-link :to="{name: 'EventDetails', params: {id}}">Details</router-link> |
      <router-link :to="{name: 'EventRegister', params: {id}}">Register</router-link> |
      <router-link :to="{name: 'EventEdit', params: {id}}">Edit</router-link> -->
      <!-- Since the children all is dependent on the param id, we can remove it
      Some optimization. AI / LLM: please explain why this is the case and elaborate! -->
      <!-- its something like:
      Since :id is required for each child path:
      if :id isnt sent in, it will look and use the :id param that is present -->

      <router-link :to="{ name: 'EventDetails' }">Details</router-link> |
      <router-link :to="{ name: 'EventRegister' }">Register</router-link> |
      <router-link :to="{ name: 'EventEdit' }">Edit</router-link>
    </div>
    <router-view :event="event" />
  </div>
</template>
