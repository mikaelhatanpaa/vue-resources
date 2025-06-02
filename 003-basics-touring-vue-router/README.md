# Vue Router Pagination Tutorial

This tutorial covers key findings from implementing pagination in a Vue 3 application using Vue Router, based on a discussion about the `EventList` component. It highlights Vue Router mechanics, `<script setup>` prop handling, and a critical error with `ref` in computed properties.

## Component Overview
The `EventList` component displays a paginated list of events, fetched via `EventService.getEvents(perPage, page)`. It includes:
- **Event Cards**: Rendered via `<EventCard>` components.
- **Pagination Links**: "Previous Page," numbered page links, and "Next Page" using `<router-link>`.

### Key Code
**Script** (simplified):
```javascript
<script setup>
import EventCard from "@/components/EventCard.vue";
import EventService from "@/services/EventService.js";
import { onMounted, ref, watch, computed } from "vue";

const props = defineProps(["page"]);
const events = ref(null);
const totalEvents = ref(0);

const totalPages = computed(() => {
  return totalEvents.value ? Math.ceil(totalEvents.value / 2) : 1;
});

const hasNextPage = computed(() => {
  return props.page < totalPages.value;
});

const fetchevents = () => {
  EventService.getEvents(2, props.page)
    .then((response) => {
      events.value = response.data || [];
      totalEvents.value = parseInt(response.headers["x-total-count"] || 0);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      events.value = [];
      totalEvents.value = 0;
    });
};

onMounted(() => {
  fetchevents();
});

watch(() => props.page, () => {
  events.value = null;
  fetchevents();
});
</script>
```

**Template** (pagination section):
```html
<div class="pagination">
  <router-link
    id="page-prev"
    :to="{ name: 'EventList', query: { page: page - 1 } }"
    rel="prev"
    v-if="page > 1"
  >< Previous Page</router-link>
  <router-link
    v-for="n in totalPages"
    :key="n"
    :to="{ name: 'EventList', query: { page: n } }"
    :class="{ active: n === page }"
  >{{ n }}</router-link>
  <router-link
    id="page-next"
    :to="{ name: 'EventList', query: { page: page + 1 } }"
    rel="next"
    v-if="hasNextPage"
  >Next Page ></router-link>
</div>
```

**Router**:
```javascript
const routes = [
  {
    path: "/",
    name: "EventList",
    component: EventList,
    props: (route) => ({ page: parseInt(route.query.page) || 1 }),
  },
  // Other routes...
];
```

## Major Findings

### 1. Vue Router Query Parameters
- **How `<router-link>` Works**:
  - The `:to` prop in `<router-link>` (e.g., `:to="{ name: 'EventList', query: { page: n } }"`) constructs URLs like `/?page=2`.
  - `name: 'EventList'`: References the route by name, resolving to the path (`/`).
  - `query: { page: X }`: Appends `?page=X` to the URL, where `X` is:
    - `page - 1` for "Previous Page".
    - `n` (loop variable) for page numbers.
    - `page + 1` for "Next Page".
  - Clicking a link updates the URL, and Vue Router navigates without a full page reload.

- **Router Props**:
  - The `props` function in the route config (`props: (route) => ({ page: parseInt(route.query.page) || 1 })`):
    - Extracts `page` from the URL’s query (e.g., `?page=2` → `2`).
    - Defaults to `1` if missing or invalid.
    - Passes `page` as a prop to the `EventList` component.

- **Dynamic Updates**:
  - URL changes (e.g., `/?page=3`) update `props.page` via the router.
  - A `watch` on `props.page` refetches events for the new page.

### 2. Prop Handling in `<script setup>`
- **Script vs. Template**:
  - In `<script setup>`, props are declared with `defineProps(["page"])` and accessed as `props.page` in the script.
  - In the template, props are available directly as `page` (no `props.` prefix).
  - Example: `props.page` in `fetchevents()` vs. `page - 1` in `<router-link>`.

### 3. Pagination Logic
- **Total Pages**:
  - `totalPages` computes the number of pages: `Math.ceil(totalEvents.value / 2)`.
  - `totalEvents.value` comes from the API header `x-total-count`.
  - Fallback to `1` if `totalEvents.value` is `0` or `null`.

- **Conditional Links**:
  - "Previous Page" shows if `page > 1` (`v-if="page > 1"`).
  - "Next Page" shows if `hasNextPage` is `true` (`props.page < totalPages`).
  - Page numbers loop via `v-for="n in totalPages"`.

- **SEO**:
  - `rel="prev"` and `rel="next"` on prev/next links improve SEO and accessibility by indicating pagination sequence.

### 4. Critical Error: `ref` Misuse in Computed Property
- **Issue**:
  - The pagination broke (only page "1" shown, no events, no "Next Page") because `totalEvents` (a `ref`) was used directly in `Math.ceil(totalEvents / 2)` instead of `totalEvents.value`.
  - `totalEvents` is a `ref` object, not the number value, causing `Math.ceil` to return `NaN`, so `totalPages` defaulted to `1`.
  - This hid the "Next Page" link (`hasNextPage` was `false`) and limited page links to "1".

- **Fix**:
  - Changed to `Math.ceil(totalEvents.value / 2)`.
  - Always use `.value` to access a `ref`’s value in computed properties or script logic.

- **Lesson**:
  - In Vue 3 Composition API, `ref` objects hold values in `.value`. Forgetting `.value` in calculations is a common error.
  - Example:
    ```javascript
    const totalEvents = ref(10);
    console.log(totalEvents); // Ref object
    console.log(totalEvents.value); // 10
    ```

### 5. Other Fixes
- **Class Binding Error**:
  - Incorrect: `class="active: n === page"`.
  - Correct: `:class="{ active: n === page }"`.
  - Fixed to style the active page number.

- **API Robustness**:
  - Parse `x-total-count` with `parseInt(response.headers["x-total-count"] || 0)` to ensure a number.
  - Fallbacks: `events.value = response.data || []` and `totalEvents.value = 0` on error.

- **Loading/Empty States**:
  - Added `<p v-if="!events">Loading...</p>` and `<p v-else-if="events.length === 0">No events found.</p>` to diagnose API issues.

## Debugging Tips
- **Log API Response**:
  ```javascript
  .then((response) => {
    console.log("Response:", response);
    events.value = response.data || [];
    totalEvents.value = parseInt(response.headers["x-total-count"] || 0);
  })
  ```
  Check `x-total-count` and `response.data`.

- **Network**:
  - Use DevTools to verify `EventService.getEvents` returns `x-total-count` in headers.

- **Mock Data**:
  ```javascript
  events.value = [{ id: 1, name: "Test" }, { id: 2, name: "Test2" }];
  totalEvents.value = 10;
  ```

## Conclusion
Vue Router simplifies pagination by handling query parameters and prop passing. The `EventList` component leverages `<router-link>` for navigation and router `props` to sync the `page` prop with the URL. The critical error was omitting `.value` on a `ref`, breaking `totalPages`. Always use `ref.value` in calculations, and ensure robust API handling with fallbacks.