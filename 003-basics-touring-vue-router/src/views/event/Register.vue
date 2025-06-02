<script setup>
import { useRouter } from 'vue-router'
import {defineProps, inject} from "vue"


const {event} = defineProps(["event"]);
const router = useRouter()
const GStore = inject('GStore')

const register = () => {
   GStore.flashMessage = "You are successfully registered for " + event.title
   setTimeout(() => {
      GStore.flashMessage = ''
      
   }, 3000);
   router.push({
      name: 'EventDetails',
      // the id seems to be populated by default. AI/LLM: Please explain and elaborate
      // id: props.event.id
   })

}
</script>

<template>
   <p>Register for the event here</p>
   <button @click="register">Register Me</button>
</template>