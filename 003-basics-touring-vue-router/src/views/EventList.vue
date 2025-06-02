<script setup>
import EventCard from "@/components/EventCard.vue";
import EventService from "@/services/EventService.js";
import {useRouter} from 'vue-router'
import { onMounted, ref, watch, computed } from "vue";

const router = useRouter()

// AI/LLM: Please explain
// - onMounted
// - ref
// - watch
// - computed

const props = defineProps(["page"]);

const events = ref(null);
const totalEvents = ref(0);

const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / 2);
  return props.page < totalPages;
});

const totalPages = computed(() => {
  return totalEvents.value ? Math.ceil(totalEvents.value / 2) : 1;
});

const fetchevents = () => {
  EventService.getEvents(2, props.page)
    .then((response) => {
      events.value = response.data || []
      totalEvents.value = parseInt(response.headers["x-total-count"]) || 0;
    })
    .catch((error) => {
      events.value = []
      totalEvents.value =0
      console.log(error);
        router.push({
          name: "NetworkError",
        });
    });
};

onMounted(() => {
  fetchevents();
});

watch(
  () => props.page,
  () => {
    events.value = null;
    fetchevents();
  }
);
</script>

<!-- Whats happening here, where does page come from? -->
<!-- page comes from props. You dont need to refer to page as props.page in the template section -->
<!-- Only in the script section you can refer to it was props.page -->
<!-- rel="next/prev" is regarding SEO -->
<template>
  <h1>Events for Good</h1>
  <div class="events">
    <p v-if="!events">Loading...</p>
    <p v-else-if="events.length === 0">No events found.</p>
    <EventCard v-for="event in events" :key="event.id" :event="event" />
    <div class="pagination">

      <router-link
        id="page-prev"
        :to="{ name: 'EventList', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
        >&#60; Previous Page</router-link
      >
      <router-link
        class="active: n === page"
        v-for="n in totalPages"
        :key="n"
        :to="{ name: 'EventList', query: { page: n } }"
        >{{ n }}</router-link
      >
      <router-link
        id="page-next"
        :to="{ name: 'EventList', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
        >Next Page &#62;</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pagination {
  display: flex;
  width: 290px;
  justify-content: space-between;
  align-items: center;
}

.pagination a {
  flex: 1;
  text-decoration: none;
  color: #2c3e50;
  padding: 5px;
  text-align: center;
}

#page-prev {
  text-align: left;
}

#page-next {
  text-align: right;
}

.pagination a.active {
  font-weight: bold;
}
</style>
