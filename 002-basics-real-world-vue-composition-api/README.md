# Comprehensive Vue.js Composition API Tutorial for Event App

This tutorial provides a thorough and intuitive guide to the Vue.js concepts used in the provided event management application, focusing exclusively on Vue.js-related logic, including the Composition API, Vue Router, and Pinia. Each section includes detailed explanations, code snippets, and practical examples to enhance understanding.

## Table of Contents
- [Comprehensive Vue.js Composition API Tutorial for Event App](#comprehensive-vuejs-composition-api-tutorial-for-event-app)
  - [Table of Contents](#table-of-contents)
  - [Vue Composition API Overview](#vue-composition-api-overview)
  - [Script Setup Syntax](#script-setup-syntax)
  - [Vue Router](#vue-router)
    - [Router Setup](#router-setup)
    - [RouterLink and RouterView](#routerlink-and-routerview)
    - [Dynamic Routes and Props](#dynamic-routes-and-props)
  - [Pinia for State Management](#pinia-for-state-management)
    - [Defining a Store](#defining-a-store)
    - [Using the Store](#using-the-store)
  - [Components and Props](#components-and-props)
    - [Defining Props](#defining-props)
    - [Using Components](#using-components)
  - [Reactivity with ref and computed](#reactivity-with-ref-and-computed)
  - [Lifecycle Hooks with onMounted](#lifecycle-hooks-with-onmounted)
  - [Conditional Rendering with v-if](#conditional-rendering-with-v-if)
  - [List Rendering with v-for](#list-rendering-with-v-for)
  - [Integrating External Services](#integrating-external-services)
  - [Conclusion](#conclusion)
  - [What is Dynamic Routing?](#what-is-dynamic-routing)
  - [Dynamic Routing in the App](#dynamic-routing-in-the-app)
    - [1. Router Configuration (`router/index.js`)](#1-router-configuration-routerindexjs)
    - [2. Navigation Link (`EventCard.vue`)](#2-navigation-link-eventcardvue)
    - [3. Event Details Component (`EventDetailsView.vue`)](#3-event-details-component-eventdetailsviewvue)
  - [The Full Flow](#the-full-flow)
  - [Common Questions and Clarifications](#common-questions-and-clarifications)
  - [Practical Example: Testing the Route](#practical-example-testing-the-route)
  - [Debugging Tips](#debugging-tips)
  - [Enhancing Dynamic Routing](#enhancing-dynamic-routing)
  - [Conclusion](#conclusion-1)

---

## Vue Composition API Overview

The Composition API is a modern way to build Vue.js applications, introduced in Vue 3. Unlike the Options API, it organizes code by logical concerns rather than splitting it into options like `data`, `methods`, and `computed`. The Composition API is used throughout the app, primarily with the `<script setup>` syntax for conciseness.

**Key Benefits**:
- Logical grouping of related code.
- Better TypeScript support.
- Reusability through composables.

**Example**:
Instead of defining `data` and `methods` separately, you can group reactive state and functions together:

```javascript
import { ref } from 'vue'

const count = ref(0)
function increment() {
  count.value++
}
```

This pattern is used extensively in the app, as seen in `EventListView.vue` and `EventDetailsView.vue`.

---

## Script Setup Syntax

The `<script setup>` syntax is a concise way to use the Composition API. It automatically makes variables, functions, and imports available in the template without explicitly declaring them in a `setup` function or `return` statement.

**Example from `App.vue`**:
```javascript
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
```

**Explanation**:
- `RouterLink` and `RouterView` are imported and automatically available in the template.
- No need to write `export default { setup() { ... } }` or return variables.
- Props, emits, and other features are defined using macros like `defineProps`.

**Benefits**:
- Reduces boilerplate code.
- Improves readability and maintainability.

**Practical Example**:
In `EventCard.vue`, the `event` prop is defined directly in `<script setup>`:

```javascript
<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>
```

This makes `event` available in the template without additional setup.

---

## Vue Router

Vue Router is used for client-side routing, enabling navigation between views like the event list, event details, and about page.

### Router Setup

The router is configured in `router/index.js` using `createRouter` and `createWebHistory`.

**Code**:
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import EventListView from '../views/EventListView.vue'
import EventDetailsView from '../views/EventDetailsView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'event-list',
      component: EventListView,
    },
    {
      path: '/event/:id',
      name: 'event-details',
      props: true,
      component: EventDetailsView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
})

export default router
```

**Explanation**:
- `createRouter`: Initializes the router.
- `createWebHistory`: Enables HTML5 history mode for clean URLs (e.g., `/event/1` instead of `#/event/1`).
- `routes`: An array of route objects, each mapping a URL path to a component.
- `name`: A unique identifier for the route, used in programmatic navigation.
- `props: true`: Automatically passes route params (e.g., `:id`) as props to the component.
- `import.meta.env.BASE_URL`: Ensures the router respects the app’s base URL, useful for deployment.

**Integration in `main.js`**:
The router is registered with the app:

```javascript
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

This makes the router available globally.

### RouterLink and RouterView

`RouterLink` creates navigation links, and `RouterView` renders the matched component for the current route.

**Example from `App.vue`**:
```javascript
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink :to="{name: 'event-list'}">Events</RouterLink> |
    <RouterLink :to="{name: 'about'}">About</RouterLink>
  </nav>
  <RouterView />
</template>
```

**Explanation**:
- `RouterLink`: Generates an `<a>` tag that navigates to the specified route. Using `:to` with a route name (e.g., `{name: 'event-list'}`) is preferred over hardcoding paths for maintainability.
- `RouterView`: A placeholder where the component associated with the current route is rendered (e.g., `EventListView` for `/`).

**Example in `EventCard.vue`**:
```javascript
<RouterLink class="event-link" :to="{name: 'event-details', params: {id: event.id}}">
  <div class="event-card">
    <h2>{{ event.title }}</h2>
    <span>@{{ event.time }} on {{ event.date }}</span>
  </div>
</RouterLink>
```

Here, `RouterLink` navigates to the `event-details` route, passing the event’s `id` as a parameter.

### Dynamic Routes and Props

Dynamic routes allow URLs with variable segments, such as `/event/:id`. The `props: true` option passes these segments as props to the component.

**Route Definition**:
```javascript
{
  path: '/event/:id',
  name: 'event-details',
  props: true,
  component: EventDetailsView,
}
```

**Component Usage in `EventDetailsView.vue`**:
```javascript
<script setup>
import { ref, onMounted } from 'vue'
import EventService from '../services/EventService.js'

const props = defineProps({
  id: { required: true }
})

const event = ref(null)

onMounted(() => {
  EventService.getEvent(props.id)
    .then((response) => {
      event.value = response.data
    })
    .catch((error) => console.log('@ERROR: ', error))
})
</script>
```

**Explanation**:
- `:id` in the route path is a dynamic segment (e.g., `/event/1` sets `id` to `1`).
- `props: true` passes `id` as a prop to `EventDetailsView`.
- `defineProps` declares the `id` prop, which is used to fetch event data.

**Why Use Props?**
- Decouples the component from the router (no need to access `$route.params`).
- Improves testability and reusability.

**Example**:
Navigating to `/event/42` passes `id: "42"` to `EventDetailsView`, which fetches the corresponding event.

---

## Pinia for State Management

Pinia is a lightweight state management library for Vue 3, used in the app to manage a counter.

### Defining a Store

The `counter` store is defined in `stores/counter.js`.

**Code**:
```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

**Explanation**:
- `defineStore('counter', ...)`: Creates a store named `counter`.
- `ref(0)`: Defines a reactive `count` variable.
- `computed(() => count.value * 2)`: Creates a reactive `doubleCount` that updates when `count` changes.
- `increment`: A function to modify `count`.
- The store returns `count`, `doubleCount`, and `increment` for use in components.

**Setup in `main.js`**:
```javascript
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

This registers Pinia with the app.

### Using the Store

To use the store in a component, import and call `useCounterStore`.

**Example**:
```javascript
<script setup>
import { useCounterStore } from '../stores/counter'

const store = useCounterStore()
</script>

<template>
  <div>
    <p>Count: {{ store.count }}</p>
    <p>Double Count: {{ store.doubleCount }}</p>
    <button @click="store.increment">Increment</button>
  </div>
</template>
```

**Explanation**:
- `useCounterStore()`: Accesses the store instance.
- `store.count`: Reactive state, updates the UI when changed.
- `store.doubleCount`: Computed property, automatically updates.
- `store.increment`: Function to modify the state.

**Why Use Pinia?**
- Centralized state management.
- Reactive integration with Vue.
- Type-safe and modular.

---

## Components and Props

Components are reusable UI building blocks. The app uses `EventCard` to display event summaries.

### Defining Props

Props pass data from a parent to a child component. In `EventCard.vue`:

**Code**:
```javascript
<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <RouterLink class="event-link" :to="{name: 'event-details', params: {id: event.id}}">
    <div class="event-card">
      <h2>{{ event.title }}</h2>
      <span>@{{ event.time }} on {{ event.date }}</span>
    </div>
  </RouterLink>
</template>
```

**Explanation**:
- `defineProps`: Declares the `event` prop with type `Object` and `required: true`.
- The `event` prop is used in the template to display `title`, `time`, and `date`.

### Using Components

`EventCard` is used in `EventListView.vue`:

**Code**:
```javascript
<script setup>
import EventCard from "../components/EventCard.vue"
</script>

<template>
  <EventCard v-for="event in events" :key="event.id" :event="event" />
</template>
```

**Explanation**:
- `EventCard` is imported and used with `v-for` to render a card for each event.
- `:event="event"`: Passes the `event` object as a prop.
- `:key="event.id"`: Ensures efficient DOM updates by uniquely identifying each card.

---

## Reactivity with ref and computed

Vue’s reactivity system makes state changes automatically update the UI. The app uses `ref` and `computed`.

**Example in `EventListView.vue`**:
```javascript
import { ref, onMounted } from "vue"
import EventService from "../services/EventService.js"

const events = ref(null)
onMounted(() => {
  EventService.getEvents()
    .then((response) => {
      events.value = response.data
    })
    .catch((error) => console.log("@ERROR: ", error))
})
```

**Explanation**:
- `ref(null)`: Creates a reactive `events` variable initialized to `null`.
- `events.value = response.data`: Updates the reactive state, triggering UI re-renders.
- The template uses `events` to render the event list.

**Computed Example from `counter.js`**:
```javascript
const doubleCount = computed(() => count.value * 2)
```

**Explanation**:
- `computed`: Creates a reactive value that depends on `count`.
- Automatically updates when `count` changes.
- Used in components to display derived data efficiently.

**Practical Example**:
To display the number of events:

```javascript
const eventCount = computed(() => events.value ? events.value.length : 0)
```

This updates automatically as `events` changes.

---

## Lifecycle Hooks with onMounted

Lifecycle hooks allow code to run at specific points in a component’s lifecycle. The app uses `onMounted` to fetch data when a component is mounted.

**Example in `EventDetailsView.vue`**:
```javascript
import { ref, onMounted } from 'vue'
import EventService from '../services/EventService.js'

const event = ref(null)

onMounted(() => {
  EventService.getEvent(props.id)
    .then((response) => {
      event.value = response.data
    })
    .catch((error) => console.log('@ERROR: ', error))
})
```

**Explanation**:
- `onMounted`: Runs after the component is mounted to the DOM.
- Fetches event data using `EventService` and updates `event`.
- Ensures data is loaded only when the component is ready.

**Other Hooks**:
- `onBeforeMount`: Before mounting.
- `onUnmounted`: When the component is destroyed.

**Example**:
To log when a component mounts:

```javascript
onMounted(() => {
  console.log('Component mounted!')
})
```

---

## Conditional Rendering with v-if

The `v-if` directive conditionally renders elements based on a truthy value.

**Example in `EventDetailsView.vue`**:
```javascript
<template>
  <div v-if="event">
    <h1>{{ event.title }}</h1>
    <p>{{ event.time }} on {{ event.date }} @ {{ event.location }}</p>
    <p>{{ event.description }}</p>
  </div>
</template>
```

**Explanation**:
- `v-if="event"`: Renders the `<div>` only if `event` is not `null`.
- Prevents errors when `event` is still loading.

**Alternative**:
Use `v-else` for a loading state:

```javascript
<template>
  <div v-if="event">
    <h1>{{ event.title }}</h1>
  </div>
  <div v-else>Loading...</div>
</template>
```

---

## List Rendering with v-for

The `v-for` directive renders a list of items.

**Example in `EventListView.vue`**:
```javascript
<template>
  <EventCard v-for="event in events" :key="event.id" :event="event" />
</template>
```

**Explanation**:
- `v-for="event in events"`: Iterates over the `events` array.
- `:key="event.id"`: Provides a unique identifier for each item, optimizing DOM updates.
- `:event="event"`: Passes each `event` object to the `EventCard` component.

**Practical Example**:
To display a numbered list:

```javascript
<template>
  <ul>
    <li v-for="(event, index) in events" :key="event.id">
      {{ index + 1 }}. {{ event.title }}
    </li>
  </ul>
</template>
```

---

## Integrating External Services

The app uses `EventService.js` to fetch data, integrated with Vue’s reactivity system.

**Code in `EventService.js`**:
```javascript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://my-json-server.typicode.com/Code-Pop/Real-World_Vue-3',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getEvents() {
    return apiClient.get('/events')
  },
  getEvent(id) {
    return apiClient.get(`/events/${id}`)
  },
}
```

**Usage in `EventListView.vue`**:
```javascript
import EventService from "../services/EventService.js"

const events = ref(null)
onMounted(() => {
  EventService.getEvents()
    .then((response) => {
      events.value = response.data
    })
    .catch((error) => console.log("@ERROR: ", error))
})
```

**Explanation**:
- `EventService` uses Axios to make HTTP requests.
- `onMounted` triggers the API call, and the response updates the reactive `events` state.
- Vue’s reactivity ensures the UI updates when `events.value` changes.

**Why Separate Services?**
- Keeps components focused on UI logic.
- Reusable across components.
- Easier to mock for testing.

---

## Conclusion

This tutorial covered the Vue.js concepts in the event app, including the Composition API, `<script setup>`, Vue Router, Pinia, components, reactivity, lifecycle hooks, and directives. Each concept was explained with code snippets and practical examples to enhance understanding. By mastering these, you can build robust Vue.js applications with clean, maintainable code.

Let’s dive deep into the dynamic routing used in the event management application, specifically focusing on how it enables navigation to a specific event’s details page. I’ll break it down step-by-step, explaining the concepts, code, and flow in an intuitive and thorough way, with examples and analogies to clarify. Since you mentioned not fully following the dynamic routing part, I’ll assume you’re familiar with basic Vue.js concepts but need a clear explanation of how dynamic routes work in this app, particularly for the `EventDetailsView`.

---

## What is Dynamic Routing?

Dynamic routing in Vue Router allows you to define routes with variable segments in the URL, which are called **dynamic segments**. These segments act as placeholders for values that change based on user interaction. In this app, dynamic routing is used to display details for a specific event by including the event’s `id` in the URL (e.g., `/event/1` for event with ID 1).

**Analogy**: Think of dynamic routing like a library catalog system. The catalog has a general template for book details pages, but the specific book shown depends on the book’s ID number you provide. Similarly, the `/event/:id` route is a template that Vue Router fills with the correct event data based on the `id` in the URL.

---

## Dynamic Routing in the App

The app uses dynamic routing to navigate from the event list (`EventListView`) to a specific event’s details (`EventDetailsView`). Let’s examine the key components involved:

1. **Router Configuration** (`router/index.js`)
2. **Navigation Link** (`EventCard.vue`)
3. **Event Details Component** (`EventDetailsView.vue`)

### 1. Router Configuration (`router/index.js`)

The router is set up to handle dynamic routes for event details.

**Code**:
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import EventDetailsView from '../views/EventDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/event/:id',
      name: 'event-details',
      props: true,
      component: EventDetailsView,
    },
    // Other routes...
  ],
})
```

**Breakdown**:
- **Dynamic Segment (`:id`)**: The `:id` in `/event/:id` is a placeholder. It matches any value in that part of the URL (e.g., `/event/1`, `/event/42`). The value of `:id` becomes a route parameter (`id`).
- **Route Name (`name: 'event-details'`)**: Assigns a unique name to the route, allowing navigation by name instead of path (more maintainable).
- **Props (`props: true`)**: Tells Vue Router to pass the route parameters (like `id`) as props to the `EventDetailsView` component. This decouples the component from directly accessing the router’s `$route` object.
- **Component**: Specifies that `EventDetailsView` will handle this route.

**How It Works**:
- When the user navigates to `/event/1`, Vue Router matches the `/event/:id` route, extracts `id` as `1`, and renders `EventDetailsView`, passing `id: "1"` as a prop.

**Example**:
- URL: `/event/123`
- Route Matched: `/event/:id`
- Parameter: `id = "123"`
- Component: `EventDetailsView`
- Prop Passed: `{ id: "123" }`

**Why Use `:id`?**
- It allows the app to handle any event ID dynamically without hardcoding routes for each event (e.g., no need for `/event1`, `/event2`, etc.).
- The `id` is used to fetch the specific event’s data from the API.

---

### 2. Navigation Link (`EventCard.vue`)

The `EventCard` component creates a clickable link to navigate to an event’s details page using `RouterLink`.

**Code**:
```javascript
<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <RouterLink class="event-link" :to="{name: 'event-details', params: {id: event.id}}">
    <div class="event-card">
      <h2>{{ event.title }}</h2>
      <span>@{{ event.time }} on {{ event.date }}</span>
    </div>
  </RouterLink>
</template>
```

**Breakdown**:
- **RouterLink**: A Vue Router component that generates an `<a>` tag for navigation without reloading the page.
- **`:to`**: Specifies the destination route using an object:
  - `name: 'event-details'`: Refers to the `event-details` route defined in the router.
  - `params: {id: event.id}`: Provides the `id` parameter, taken from the `event` prop (e.g., `event.id = 1`).
- **Dynamic Navigation**: The `event.id` is dynamically inserted into the route, forming URLs like `/event/1`.

**How It Works**:
- When a user clicks an `EventCard`, the `RouterLink` navigates to `/event/[event.id]`.
- Vue Router matches this URL to the `/event/:id` route and renders `EventDetailsView`.

**Example**:
- If `event.id = 5`, the `RouterLink` generates a link to `/event/5`.
- Clicking it triggers the `event-details` route with `id = "5"`.

**Why Use Named Routes?**
- Using `name: 'event-details'` instead of `to="/event/{{event.id}}"` makes the code more maintainable. If the route path changes (e.g., to `/events/:id`), you only update the router configuration, not every `RouterLink`.

**Analogy**: Imagine sending a letter. Instead of writing the full address (`/event/5`), you use the recipient’s name (`event-details`) and include a note with the ID (`params: {id: 5}`). The postal system (Vue Router) knows where to deliver it.

---

### 3. Event Details Component (`EventDetailsView.vue`)

The `EventDetailsView` component receives the `id` prop and uses it to fetch and display the event’s details.

**Code**:
```javascript
<script setup>
import { ref, onMounted } from 'vue'
import EventService from '../services/EventService.js'

const props = defineProps({
  id: { required: true }
})

const event = ref(null)

onMounted(() => {
  EventService.getEvent(props.id)
    .then((response) => {
      event.value = response.data
    })
    .catch((error) => console.log('@ERROR: ', error))
})
</script>

<template>
  <div v-if="event">
    <h1>{{ event.title }}</h1>
    <p>{{ event.time }} on {{ event.date }} @ {{ event.location }}</p>
    <p>{{ event.description }}</p>
  </div>
</template>
```

**Breakdown**:
- **Props (`defineProps`)**: Declares the `id` prop, which is automatically provided by Vue Router because `props: true` is set in the route configuration.
- **Reactivity (`ref`)**: Creates a reactive `event` variable, initially `null`, to store the fetched event data.
- **Lifecycle Hook (`onMounted`)**: Fetches the event data when the component is mounted:
  - `EventService.getEvent(props.id)`: Calls the API with the `id` (e.g., `/events/1`).
  - `event.value = response.data`: Updates the reactive state with the API response.
- **Template**: Uses `v-if="event"` to render the event details only when data is available, preventing errors while loading.

**How It Works**:
- When the route `/event/1` is accessed, Vue Router passes `id: "1"` as a prop.
- `onMounted` triggers the API call to fetch the event with ID `1`.
- Once the data is received, `event.value` is updated, and the template renders the event’s title, time, date, location, and description.

**Example**:
- URL: `/event/2`
- Prop Received: `id: "2"`
- API Call: `GET /events/2`
- Rendered: Details of the event with ID 2 (e.g., “Charity Run” at “10 AM on 2025-06-01”).

**Why Use Props?**
- Without `props: true`, the component would need to access `$route.params.id`, tightly coupling it to Vue Router.
- Props make the component reusable (e.g., it could be used outside routing with a manual `id` prop).

---

## The Full Flow

Let’s trace the dynamic routing process from clicking an event card to displaying its details:

1. **User Action**: The user clicks an `EventCard` in `EventListView`. Suppose the event has `id: 3`.
2. **RouterLink**: The `RouterLink` in `EventCard.vue` generates a navigation to `/event/3` using:
   ```javascript
   :to="{name: 'event-details', params: {id: 3}}"
   ```
3. **Route Matching**: Vue Router matches `/event/3` to the `/event/:id` route, extracting `id: "3"`.
4. **Props Passing**: Because `props: true` is set, Vue Router passes `{ id: "3" }` as a prop to `EventDetailsView`.
5. **Component Rendering**:
   - `EventDetailsView` receives `id: "3"`.
   - `onMounted` calls `EventService.getEvent("3")`, fetching the event data.
   - The response updates `event.value`, and the template renders the event details.

**Visual Flow**:
```
User Clicks EventCard -> RouterLink (/event/3) -> Vue Router -> EventDetailsView (id: "3") -> API Call -> Render Event Details
```

---

## Common Questions and Clarifications

**Q: Why `:id` and not something else?**
- The `:id` is just a name for the dynamic segment. You could use `:eventId` or `:slug`, but `id` is conventional for unique identifiers. The name must match the `params` key in `RouterLink` (e.g., `params: {id: event.id}`).

**Q: What happens if the ID is invalid?**
- If `EventService.getEvent` fails (e.g., no event with ID 999), the `catch` block logs an error, and `event.value` remains `null`. The `v-if="event"` ensures nothing is rendered. You could enhance this by showing an error message:
  ```javascript
  <template>
    <div v-if="event">...</div>
    <div v-else-if="error">Event not found</div>
    <div v-else>Loading...</div>
  </template>
  ```

**Q: Why `props: true`?**
- Without it, you’d access the ID via `$route.params.id`:
  ```javascript
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const id = route.params.id
  ```
- Using props is cleaner, makes the component reusable, and aligns with Vue’s component-based philosophy.

**Q: Can I pass multiple parameters?**
- Yes! Define multiple segments, like `/event/:id/:tab`:
  ```javascript
  path: '/event/:id/:tab',
  name: 'event-details',
  props: true,
  component: EventDetailsView
  ```
- The component would receive `id` and `tab` as props.

---

## Practical Example: Testing the Route

To solidify your understanding, let’s simulate a scenario:

1. **Event Data**: Assume the API has an event:
   ```json
   {
     "id": 4,
     "title": "Tree Planting",
     "time": "2 PM",
     "date": "2025-06-10",
     "location": "City Park",
     "description": "Join us to plant trees!"
   }
   ```
2. **User Action**: In `EventListView`, the user clicks the `EventCard` for “Tree Planting” (ID 4).
3. **Navigation**: The `RouterLink` navigates to `/event/4`.
4. **Router**: Matches `/event/4` to `/event/:id`, passes `id: "4"` to `EventDetailsView`.
5. **Data Fetch**: `EventDetailsView` calls `EventService.getEvent("4")`, receives the event data, and renders:
   ```
   Tree Planting
   2 PM on 2025-06-10 @ City Park
   Join us to plant trees!
   ```

**Code to Log the Process**:
Add console logs to `EventDetailsView.vue` to see the flow:

```javascript
<script setup>
import { ref, onMounted } from 'vue'
import EventService from '../services/EventService.js'

const props = defineProps({
  id: { required: true }
})

const event = ref(null)

onMounted(() => {
  console.log(`Fetching event with ID: ${props.id}`)
  EventService.getEvent(props.id)
    .then((response) => {
      console.log('Event data received:', response.data)
      event.value = response.data
    })
    .catch((error) => {
      console.error('Error fetching event:', error)
    })
})
</script>
```

Navigating to `/event/4` would log:
```
Fetching event with ID: 4
Event data received: { id: 4, title: "Tree Planting", ... }
```

---

## Debugging Tips

If dynamic routing isn’t working:
- **Check Route Definition**: Ensure `path: '/event/:id'` and `name: 'event-details'` match the `RouterLink`’s `:to`.
- **Verify Props**: Confirm `props: true` is set, and `defineProps` includes `id`.
- **Test API**: Use `console.log` or a tool like Postman to verify `EventService.getEvent(id)` returns data.
- **Inspect URL**: Ensure the URL (e.g., `/event/3`) is correct when clicking `RouterLink`.

---

## Enhancing Dynamic Routing

To make the app more robust, consider:
- **404 Handling**: Redirect to a “Not Found” page if the event doesn’t exist.
  ```javascript
  routes: [
    {
      path: '/event/:id',
      name: 'event-details',
      props: true,
      component: EventDetailsView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ]
  ```
- **Loading States**: Show a spinner while fetching:
  ```javascript
  <template>
    <div v-if="event">...</div>
    <div v-else>Loading event...</div>
  </template>
  ```
- **Route Guards**: Prevent navigation to invalid IDs (e.g., non-numeric).
  ```javascript
  beforeEnter: (to, from, next) => {
    if (isNaN(to.params.id)) next({ name: 'not-found' })
    else next()
  }
  ```

---

## Conclusion

Dynamic routing in this app allows users to view specific event details by including the event’s `id` in the URL (`/event/:id`). The process involves:
- Defining a dynamic route in `router/index.js` with `:id` and `props: true`.
- Using `RouterLink` in `EventCard.vue` to navigate to the `event-details` route with the event’s `id`.
- Receiving the `id` as a prop in `EventDetailsView.vue` and fetching the event data.

By using named routes, props, and Vue Router’s dynamic segments, the app creates a flexible and maintainable navigation system. Hopefully, this deep dive clarified how the pieces fit together! If you have specific parts that are still unclear, let me know, and I’ll zoom in further.