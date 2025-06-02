# Common Patterns and Tips in Vue.js 3 (Composition API)

Vue.js 3's Composition API offers a flexible and powerful way to build applications, but mastering common patterns and best practices can significantly improve your development experience. In this tutorial, we'll explore practical tips, tricks, and patterns that are widely used in Vue.js projects. Each section includes a detailed explanation and a working example using the `<script setup>` syntax for brevity. These tips will help you write cleaner, more maintainable, and performant code.

---

## Tip 1: Use Composables for Reusable Logic

### Why It Matters
Composables are a powerful pattern in Vue 3 for encapsulating reusable logic (e.g., state, methods, or lifecycle hooks) that can be shared across components. They promote DRY (Don't Repeat Yourself) principles and make your code more modular and testable.

### Example
Let’s create a `useCounter` composable to manage a counter with increment and decrement functionality.

```javascript
// composables/useCounter.js
import { ref } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    count.value--;
  };

  return { count, increment, decrement };
}

// Component using the composable
<script setup>
import { useCounter } from './composables/useCounter';

const { count, increment, decrement } = useCounter(5);
</script>

<template>
  <div>
    <h3>useCounter Composable</h3>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>
```

### Explanation
- `useCounter` is a composable that encapsulates counter logic (state and methods).
- The component imports and uses `useCounter`, making the logic reusable across multiple components.
- This pattern keeps your components focused on presentation while moving logic into composables, improving maintainability.

---

## Tip 2: Optimize Reactivity with `shallowRef` or `shallowReactive` for Large Data

### Why It Matters
Vue’s reactivity system is deep by default, which can be expensive for large objects or arrays. Using `shallowRef` or `shallowReactive` can improve performance by limiting reactivity to the top level, reducing the overhead of tracking nested changes.

### Example
Let’s manage a large dataset with `shallowRef` to optimize performance.

```javascript
<script setup>
import { shallowRef, triggerRef } from 'vue';

const largeData = shallowRef({
  items: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `Item ${i}` })),
});

const updateItem = (index) => {
  largeData.value.items[index].value = `Updated Item ${index}`;
  triggerRef(largeData); // Manually trigger reactivity
};

const updateFirstItem = () => {
  updateItem(0);
};
</script>

<template>
  <div>
    <h3>shallowRef for Large Data</h3>
    <p>First Item: {{ largeData.items[0].value }}</p>
    <button @click="updateFirstItem">Update First Item</button>
  </div>
</template>
```

### Explanation
- `largeData` is a `shallowRef`, so changes to nested properties (`items[0].value`) don’t automatically trigger reactivity.
- We use `triggerRef` to manually force a re-render when needed.
- This approach reduces the reactivity overhead for large datasets, improving performance while still allowing controlled updates.

---

## Tip 3: Use `v-bind` in CSS for Dynamic Styling

### Why It Matters
Vue allows you to bind CSS variables to reactive data using `v-bind` in `<style>` tags (introduced in Vue 3.2). This enables dynamic styling without needing to manipulate inline styles or classes, keeping your styles declarative and scoped.

### Example
Let’s create a component that dynamically changes its background color using `v-bind` in CSS.

```javascript
<script setup>
import { ref } from 'vue';

const color = ref('#ff0000');

const changeColor = () => {
  color.value = color.value === '#ff0000' ? '#00ff00' : '#ff0000';
};
</script>

<template>
  <div class="box">
    <h3>Dynamic Styling with v-bind in CSS</h3>
    <button @click="changeColor">Toggle Color</button>
  </div>
</template>

<style scoped>
.box {
  padding: 20px;
  background-color: v-bind(color);
  transition: background-color 0.3s;
}
</style>
```

### Explanation
- `color` is a reactive `ref` that toggles between red and green.
- `v-bind(color)` in the `<style>` tag binds the CSS `background-color` to the `color` value.
- When `color` changes, the background updates automatically with a smooth transition, keeping the styling logic in CSS while leveraging Vue’s reactivity.

---

## Tip 4: Use `provide` and `inject` for Dependency Injection

### Why It Matters
The `provide` and `inject` APIs allow you to pass data or methods down the component tree without prop drilling. This is especially useful for sharing global state (e.g., a theme or user settings) with deeply nested components.

### Example
Let’s provide a theme to child components using `provide` and `inject`.

```javascript
<!-- Parent Component -->
<script setup>
import { provide, ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const theme = ref('light');

provide('theme', theme);

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <div>
    <h3>provide/in�트 Example (Parent)</h3>
    <p>Current Theme: {{ theme }}</p>
    <button @click="toggleTheme">Toggle Theme</button>
    <child-component />
  </div>
</template>

<!-- ChildComponent.vue -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme');
</script>

<template>
  <div>
    <h4>Child Component</h4>
    <p>Theme (injected): {{ theme }}</p>
  </div>
</template>
```

### Explanation
- The parent component uses `provide` to share the `theme` ref with its descendants.
- The child component uses `inject` to access the `theme` without needing props.
- When the parent toggles the theme, the child automatically updates, demonstrating how `provide` and `inject` simplify state sharing.

---

## Tip 5: Debounce or Throttle Expensive Operations with a Composable

### Why It Matters
Expensive operations like API calls or heavy computations can hurt performance if triggered too frequently (e.g., on every input event). Using a debounce or throttle utility in a composable can limit how often these operations run, improving performance.

### Example
Let’s create a `useDebounce` composable to debounce an API call triggered by user input.

```javascript
// composables/useDebounce.js
import { ref, watch } from 'vue';

export function useDebounce(value, delay) {
  const debouncedValue = ref(value.value);

  let timeout;
  watch(value, (newValue) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
}

// Component using the composable
<script setup>
import { ref } from 'vue';
import { useDebounce } from './composables/useDebounce';

const searchQuery = ref('');
const debouncedQuery = useDebounce(searchQuery, 500);

watch(debouncedQuery, (newQuery) => {
  console.log(`Searching for: ${newQuery}`);
  // Simulate an API call
});
</script>

<template>
  <div>
    <h3>Debounce with Composable</h3>
    <input v-model="searchQuery" placeholder="Type to search..." />
    <p>Debounced Query: {{ debouncedQuery }}</p>
  </div>
</template>
```

### Explanation
- `useDebounce` takes a `ref` and a delay, returning a debounced version of the value.
- The `watch` inside `useDebounce` updates `debouncedValue` only after the user stops typing for 500ms.
- This prevents the API call (simulated by the `console.log`) from firing on every keystroke, reducing unnecessary requests.

---

## Tip 6: Use Slots for Flexible Component Composition

### Why It Matters
Slots allow you to create flexible, reusable components by letting parent components inject custom content into child components. This pattern is essential for building components like modals, cards, or layouts that need to be customizable.

### Example
Let’s create a reusable `Card` component with slots for a header, body, and footer.

```javascript
<!-- Card.vue -->
<script setup>
// No logic needed for this example
</script>

<template>
  <div class="card">
    <header class="card-header">
      <slot name="header">Default Header</slot>
    </header>
    <div class="card-body">
      <slot>Default Body Content</slot>
    </div>
    <footer class="card-footer">
      <slot name="footer">Default Footer</slot>
    </footer>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
}
.card-header { font-weight: bold; }
.card-body { padding: 10px 0; }
.card-footer { font-style: italic; }
</style>

<!-- Parent Component -->
<script setup>
// No logic needed for this example
</script>

<template>
  <div>
    <h3>Slots Example</h3>
    <card>
      <template #header>
        <h4>Custom Header</h4>
      </template>
      <p>This is the custom body content.</p>
      <template #footer>
        <button>Custom Action</button>
      </template>
    </card>
  </div>
</template>
```

### Explanation
- The `Card` component defines three slots: a named `header`, a default slot (body), and a named `footer`.
- The parent component customizes the `Card` by providing content for each slot using `<template #slot-name>`.
- This pattern makes the `Card` component highly reusable while allowing the parent to control its content.

---

## Tip 7: Use `watchEffect` for Reactive Side Effects

### Why It Matters
`watchEffect` is a convenient way to perform side effects that depend on multiple reactive sources. It automatically tracks dependencies and re-runs when they change, making it ideal for reactive logic that doesn’t need explicit source specification.

### Example
Let’s synchronize a reactive form with localStorage using `watchEffect`.

```javascript
<script setup>
import { ref, watchEffect } from 'vue';

const name = ref('');
const email = ref('');

watchEffect(() => {
  const formData = { name: name.value, email: email.value };
  localStorage.setItem('formData', JSON.stringify(formData));
});
</script>

<template>
  <div>
    <h3>watchEffect for Side Effects</h3>
    <div>
      <label>Name: <input v-model="name" /></label>
    </div>
    <div>
      <label>Email: <input v-model="email" /></label>
    </div>
  </div>
</template>
```

### Explanation
- `watchEffect` tracks `name` and `email` as dependencies.
- Whenever either `name` or `email` changes, `watchEffect` re-runs and saves the updated form data to `localStorage`.
- This pattern simplifies reactive side effects without needing to manually specify which sources to watch.

---

## Tip 8: Use Teleport for Modals and Overlays

### Why It Matters
The `<Teleport>` component allows you to render a component’s DOM in a different part of the page (e.g., directly under `<body>`), which is useful for modals, toasts, or overlays. This ensures proper stacking and styling, avoiding issues with parent `z-index` or `overflow`.

### Example
Let’s create a modal component using `<Teleport>`.

```javascript
<!-- Modal.vue -->
<script setup>
defineProps(['isOpen']);
defineEmits(['close']);
</script>

<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal">
        <h4>Modal Title</h4>
        <p>This is a modal rendered with Teleport.</p>
        <button @click="$emit('close')">Close</button>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>

<!-- Parent Component -->
<script setup>
import { ref } from 'vue';
import Modal from './Modal.vue';

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div>
    <h3>Teleport for Modals</h3>
    <button @click="openModal">Open Modal</button>
    <modal :is-open="isModalOpen" @close="closeModal" />
  </div>
</template>
```

### Explanation
- `<Teleport to="body">` renders the modal directly under the `<body>` tag, ensuring it’s not affected by parent styles like `overflow: hidden`.
- The `isOpen` prop controls the modal’s visibility, and the `close` event allows the parent to close it.
- This pattern ensures modals are properly layered and styled, improving the user experience.

---

## Tip 9: Use `defineProps` and `defineEmits` for Type Safety and Clarity

### Why It Matters
In `<script setup>`, `defineProps` and `defineEmits` provide a clean way to declare props and emits with type safety (especially with TypeScript). They also make the component’s interface explicit, improving readability and maintainability.

### Example
Let’s create a typed child component that receives props and emits events.

```javascript
<!-- ChildComponent.vue -->
<script setup>
const props = defineProps<{
  message: string;
  count: number;
}>();

const emit = defineEmits<{
  (e: 'update', newCount: number): void;
}>();

const incrementAndEmit = () => {
  emit('update', props.count + 1);
};
</script>

<template>
  <div>
    <h4>Child Component</h4>
    <p>Message: {{ message }}</p>
    <p>Count: {{ count }}</p>
    <button @click="incrementAndEmit">Increment</button>
  </div>
</template>

<!-- Parent Component -->
<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const count = ref(0);
</script>

<template>
  <div>
    <h3>defineProps and defineEmits</h3>
    <child-component
      :message="'Hello from Parent'"
      :count="count"
      @update="(newCount) => count = newCount"
    />
  </div>
</template>
```

### Explanation
- `defineProps` declares `message` and `count` with TypeScript types, ensuring type safety.
- `defineEmits` declares an `update` event with a `newCount` parameter, making the component’s events explicit.
- The parent passes props and listens for the `update` event to update its `count`, demonstrating a clear parent-child communication pattern.

---

## Tip 10: Use `computed` for Reactive Filters and Derived State

### Why It Matters
`computed` properties are ideal for creating derived state or filtering data reactively. They’re cached, so they only recompute when their dependencies change, making them efficient for tasks like filtering or formatting.

### Example
Let’s filter a list of items using a `computed` property.

```javascript
<script setup>
import { ref, computed } from 'vue';

const items = ref([
  { id: 1, name: 'Apple', category: 'Fruit' },
  { id: 2, name: 'Carrot', category: 'Vegetable' },
  { id: 3, name: 'Banana', category: 'Fruit' },
]);

const filterCategory = ref('Fruit');

const filteredItems = computed(() => {
  return items.value.filter(item => item.category === filterCategory.value);
});

const toggleFilter = () => {
  filterCategory.value = filterCategory.value === 'Fruit' ? 'Vegetable' : 'Fruit';
};
</script>

<template>
  <div>
    <h3>Computed for Filtering</h3>
    <p>Filtering by: {{ filterCategory }}</p>
    <button @click="toggleFilter">Toggle Filter</button>
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }} ({{ item.category }})
      </li>
    </ul>
  </div>
</template>
```

### Explanation
- `filteredItems` is a `computed` property that filters `items` based on `filterCategory`.
- When `filterCategory` changes, `filteredItems` automatically updates, re-rendering the list.
- `computed` ensures the filter only runs when `items` or `filterCategory` changes, optimizing performance.

---

## Summary of Patterns and Tips

1. **Composables for Reusability**: Encapsulate logic in composables to keep components clean and reusable.
2. **Optimize Reactivity**: Use `shallowRef` or `shallowReactive` for large data to reduce reactivity overhead.
3. **Dynamic Styling**: Use `v-bind` in CSS for reactive styling.
4. **Dependency Injection**: Use `provide` and `inject` to share state without prop drilling.
5. **Debounce/Throttle**: Create composables to debounce or throttle expensive operations.
6. **Flexible Components with Slots**: Use slots to make components customizable.
7. **Reactive Side Effects**: Use `watchEffect` for side effects that depend on multiple reactive sources.
8. **Teleport for Overlays**: Use `<Teleport>` for modals and overlays to ensure proper rendering.
9. **Type-Safe Props and Emits**: Use `defineProps` and `defineEmits` for clarity and type safety.
10. **Computed for Derived State**: Use `computed` for reactive filtering and derived state.

These patterns and tips will help you build Vue.js applications that are modular, performant, and easy to maintain. Experiment with these techniques to see how they fit into your projects!

# Extended Common Patterns and Tips in Vue.js 3 (Composition API)

This tutorial extends the previous guide on common Vue.js patterns by introducing more advanced and practical tips and tricks for building robust applications with Vue 3's Composition API. We'll cover state management, performance optimization, component communication, and developer experience improvements. Each section includes a detailed explanation and a working example using the `<script setup>` syntax. These tips will help you enhance your Vue.js projects further, making them more scalable, performant, and maintainable.

---

## Tip 11: Use a Global State Composable for Lightweight State Management

### Why It Matters
For small to medium-sized apps, you might not need a full state management library like Pinia or Vuex. A global state composable can provide a lightweight alternative by combining `reactive` and `provide`/`inject`. This pattern centralizes state management without the overhead of a dedicated library.

### Example
Let’s create a `useGlobalState` composable to manage a global theme and user settings.

```javascript
// composables/useGlobalState.js
import { reactive, provide, inject } from 'vue';

const GlobalStateSymbol = Symbol('global-state');

export function provideGlobalState() {
  const state = reactive({
    theme: 'light',
    user: { name: 'Guest', isAuthenticated: false },
  });

  const toggleTheme = () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
  };

  const login = (name) => {
    state.user = { name, isAuthenticated: true };
  };

  const logout = () => {
    state.user = { name: 'Guest', isAuthenticated: false };
  };

  provide(GlobalStateSymbol, { state, toggleTheme, login, logout });
}

export function useGlobalState() {
  const globalState = inject(GlobalStateSymbol);
  if (!globalState) {
    throw new Error('useGlobalState must be used within a component where provideGlobalState is called');
  }
  return globalState;
}

// App.vue (Root Component)
<script setup>
import { provideGlobalState } from './composables/useGlobalState';
import ChildComponent from './ChildComponent.vue';

provideGlobalState();
</script>

<template>
  <div>
    <h3>Global State Composable (Root)</h3>
    <child-component />
  </div>
</template>

// ChildComponent.vue
<script setup>
import { useGlobalState } from './composables/useGlobalState';

const { state, toggleTheme, login, logout } = useGlobalState();
</script>

<template>
  <div>
    <h4>Child Component</h4>
    <p>Theme: {{ state.theme }}</p>
    <p>User: {{ state.user.name }} (Authenticated: {{ state.user.isAuthenticated }})</p>
    <button @click="toggleTheme">Toggle Theme</button>
    <button @click="state.user.isAuthenticated ? logout() : login('Alice')">
      {{ state.user.isAuthenticated ? 'Logout' : 'Login' }}
    </button>
  </div>
</template>
```

### Explanation
- `provideGlobalState` creates a reactive global state and provides it using a unique `Symbol` to avoid injection conflicts.
- `useGlobalState` injects the state and methods, throwing an error if used outside a provided context.
- The root component (`App.vue`) provides the global state, and any child component can access it using `useGlobalState`.
- This pattern is lightweight and avoids the complexity of a full state management library for simpler applications.

---

## Tip 12: Lazy-Load Components for Better Performance

### Why It Matters
Lazy-loading components with `defineAsyncComponent` reduces the initial bundle size and improves load times, especially for large applications with many components. Vue 3 makes this easy by allowing you to dynamically import components only when they’re needed.

### Example
Let’s lazy-load a heavy component that’s only shown conditionally.

```javascript
<script setup>
import { ref, defineAsyncComponent } from 'vue';

// Lazy-load the HeavyComponent
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
);

const showHeavyComponent = ref(false);

const toggleComponent = () => {
  showHeavyComponent.value = !showHeavyComponent.value;
};
</script>

<template>
  <div>
    <h3>Lazy-Load Component</h3>
    <button @click="toggleComponent">
      {{ showHeavyComponent ? 'Hide' : 'Show' }} Heavy Component
    </button>
    <heavy-component v-if="showHeavyComponent" />
  </div>
</template>

<!-- HeavyComponent.vue -->
<script setup>
// Simulate a heavy component
console.log('HeavyComponent loaded!');
</script>

<template>
  <div>
    <h4>Heavy Component</h4>
    <p>This component was lazy-loaded.</p>
  </div>
</template>
```

### Explanation
- `defineAsyncComponent` dynamically imports `HeavyComponent.vue` only when it’s needed (i.e., when `showHeavyComponent` is `true`).
- The component isn’t included in the initial bundle, reducing the initial load time.
- This pattern is especially useful for modals, tabs, or rarely used features, improving the performance of your application.

---

## Tip 13: Use `v-memo` for Performance Optimization in Loops

### Why It Matters
Vue 3.2 introduced the `v-memo` directive, which memoizes a template block and only re-renders it if its dependencies change. This can significantly improve performance in scenarios like rendering large lists where items rarely change.

### Example
Let’s use `v-memo` to optimize a list of items that only re-renders when specific data changes.

```javascript
<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
]);

const counter = ref(0);

const updateCounter = () => {
  counter.value++;
};

const updateItemName = (id, newName) => {
  const item = items.value.find(item => item.id === id);
  if (item) item.name = newName;
};
</script>

<template>
  <div>
    <h3>v-memo for Performance</h3>
    <p>Counter: {{ counter }}</p>
    <button @click="updateCounter">Update Counter</button>
    <button @click="updateItemName(1, 'Updated Item 1')">Update Item 1</button>
    <ul>
      <li v-for="item in items" :key="item.id" v-memo="[item.name]">
        {{ item.name }} (Rendered only if name changes)
      </li>
    </ul>
  </div>
</template>
```

### Explanation
- `v-memo="[item.name]"` ensures the `<li>` element only re-renders if `item.name` changes.
- When `counter` updates, the list doesn’t re-render because `item.name` hasn’t changed.
- When `updateItemName` changes an item’s name, only that specific `<li>` re-renders.
- This pattern reduces unnecessary DOM updates, improving performance in large lists or complex templates.

---

## Tip 14: Use `watch` with `deep` Option for Nested Reactive Objects

### Why It Matters
When working with nested `reactive` objects, changes to nested properties don’t automatically trigger a `watch` unless you enable the `deep` option. This ensures that your watcher reacts to changes at any level of the object, which is crucial for complex state.

### Example
Let’s watch a nested `reactive` object and react to deep changes.

```javascript
<script setup>
import { reactive, watch } from 'vue';

const user = reactive({
  profile: {
    name: 'Alice',
    details: {
      age: 25,
    },
  },
});

watch(user, (newUser, oldUser) => {
  console.log('User changed:', newUser);
}, { deep: true });

const updateAge = () => {
  user.profile.details.age++;
};

const updateName = () => {
  user.profile.name = 'Bob';
};
</script>

<template>
  <div>
    <h3>watch with deep Option</h3>
    <p>Name: {{ user.profile.name }}</p>
    <p>Age: {{ user.profile.details.age }}</p>
    <button @click="updateName">Update Name</button>
    <button @click="updateAge">Update Age</button>
  </div>
</template>
```

### Explanation
- `watch(user, ..., { deep: true })` ensures the watcher triggers for changes at any level of the `user` object.
- Updating `user.profile.details.age` (a nested property) triggers the watcher because of the `deep` option.
- This pattern is essential when dealing with complex state where nested changes need to trigger side effects, like saving to an API.

---

## Tip 15: Use `Suspense` for Async Component Loading

### Why It Matters
Vue 3’s `<Suspense>` component simplifies handling asynchronous operations, such as lazy-loaded components or async setup logic. It allows you to show a fallback UI while waiting for async dependencies to resolve, improving the user experience.

### Example
Let’s use `<Suspense>` to show a loading state while a component fetches data.

```javascript
<!-- AsyncComponent.vue -->
<script setup>
import { ref } from 'vue';

const data = ref(null);

// Simulate an async operation (e.g., API call)
const loadData = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  data.value = 'Data loaded successfully!';
};

await loadData();
</script>

<template>
  <div>
    <h4>Async Component</h4>
    <p>{{ data }}</p>
  </div>
</template>

<!-- Parent Component -->
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => import('./AsyncComponent.vue'));
</script>

<template>
  <div>
    <h3>Suspense for Async Loading</h3>
    <suspense>
      <async-component />
      <template #fallback>
        <p>Loading...</p>
      </template>
    </suspense>
  </div>
</template>
```

### Explanation
- `AsyncComponent` simulates an async operation with a 2-second delay.
- `<Suspense>` wraps `AsyncComponent` and shows the `#fallback` slot (`Loading...`) while the async operation resolves.
- Once `loadData` completes, `<Suspense>` renders `AsyncComponent` with the loaded data.
- This pattern provides a seamless way to handle async operations with a better user experience.

---

## Tip 16: Use Event Bus Pattern with `mitt` for Cross-Component Communication

### Why It Matters
For components that aren’t directly related (e.g., siblings or distant components), an event bus can simplify communication. While Vue 3 removed the built-in `$emit` event bus, you can use a lightweight library like `mitt` to achieve the same result.

### Example
Let’s use `mitt` to create an event bus for communication between sibling components.

```javascript
// eventBus.js
import mitt from 'mitt';

export const eventBus = mitt();

// Sibling1.vue
<script setup>
import { eventBus } from './eventBus';

const sendMessage = () => {
  eventBus.emit('message', 'Hello from Sibling 1!');
};
</script>

<template>
  <div>
    <h4>Sibling 1</h4>
    <button @click="sendMessage">Send Message</button>
  </div>
</template>

// Sibling2.vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { eventBus } from './eventBus';

const receivedMessage = ref('');

onMounted(() => {
  eventBus.on('message', (msg) => {
    receivedMessage.value = msg;
  });
});

onUnmounted(() => {
  eventBus.off('message');
});
</script>

<template>
  <div>
    <h4>Sibling 2</h4>
    <p>Received: {{ receivedMessage }}</p>
  </div>
</template>

<!-- Parent Component -->
<script setup>
import Sibling1 from './Sibling1.vue';
import Sibling2 from './Sibling2.vue';
</script>

<template>
  <div>
    <h3>Event Bus with mitt</h3>
    <sibling1 />
    <sibling2 />
  </div>
</template>
```

### Explanation
- `mitt` creates a simple event bus (`eventBus`) for emitting and listening to events.
- `Sibling1` emits a `message` event when the button is clicked.
- `Sibling2` listens for the `message` event and updates `receivedMessage` when it’s received.
- We clean up the event listener in `onUnmounted` to prevent memory leaks.
- This pattern is useful for decoupled communication between components that don’t share a direct parent-child relationship.

---

## Tip 17: Use `reactive` with `toRefs` for Prop Destructuring

### Why It Matters
When a parent passes a `reactive` object as a prop, the child component loses reactivity if it destructures the prop directly. Using `toRefs` ensures that the destructured properties remain reactive, maintaining two-way binding with the parent.

### Example
Let’s pass a `reactive` object as a prop and use `toRefs` to keep it reactive.

```javascript
<!-- Parent Component -->
<script setup>
import { reactive } from 'vue';
import ChildComponent from './ChildComponent.vue';

const user = reactive({
  name: 'Alice',
  age: 25,
});
</script>

<template>
  <div>
    <h3>reactive Prop with toRefs</h3>
    <p>Parent - Name: {{ user.name }}, Age: {{ user.age }}</p>
    <child-component :user="user" />
  </div>
</template>

<!-- ChildComponent.vue -->
<script setup>
import { toRefs } from 'vue';

const props = defineProps(['user']);
const { name, age } = toRefs(props.user);

const updateUser = () => {
  name.value = 'Bob';
  age.value++;
};
</script>

<template>
  <div>
    <h4>Child Component</h4>
    <p>Name: {{ name }}</p>
    <p>Age: {{ age }}</p>
    <button @click="updateUser">Update User</button>
  </div>
</template>
```

### Explanation
- The parent passes the `user` `reactive` object as a prop to the child.
- The child uses `toRefs` to destructure `user` into `name` and `age`, keeping them reactive.
- Updating `name` and `age` in the child updates the parent’s `user` object because they’re linked.
- This pattern ensures reactivity is preserved when working with `reactive` props.

---

## Tip 18: Use `v-once` to Prevent Unnecessary Re-Renders

### Why It Matters
The `v-once` directive renders an element or component only once and prevents it from re-rendering, even if its dependencies change. This can improve performance for static content that doesn’t need to update.

### Example
Let’s use `v-once` to render a static message that doesn’t re-render.

```javascript
<script setup>
import { ref } from 'vue';

const message = ref('Static Message');
const counter = ref(0);

const updateCounter = () => {
  counter.value++;
};

const updateMessage = () => {
  message.value = 'Updated Message';
};
</script>

<template>
  <div>
    <h3>v-once for Static Content</h3>
    <p v-once>Message (won't update): {{ message }}</p>
    <p>Counter (updates): {{ counter }}</p>
    <button @click="updateCounter">Update Counter</button>
    <button @click="updateMessage">Update Message</button>
  </div>
</template>
```

### Explanation
- The `<p v-once>` element renders `message` only once when the component mounts.
- When `message` changes, the `v-once` element doesn’t re-render, keeping the original value.
- The `counter` updates normally because it’s not using `v-once`.
- This pattern is useful for static content like disclaimers or labels that never change after the initial render.

---

## Tip 19: Use `defineExpose` for Parent-Child Interaction

### Why It Matters
In `<script setup>`, components are closed by default, meaning their internal methods and state aren’t accessible to the parent. `defineExpose` allows you to explicitly expose methods or properties to the parent, enabling controlled interaction.

### Example
Let’s expose a method in a child component for the parent to call.

```javascript
<!-- ChildComponent.vue -->
<script setup>
import { ref, defineExpose } from 'vue';

const childCount = ref(0);

const incrementChild = () => {
  childCount.value++;
};

defineExpose({
  incrementChild,
});
</script>

<template>
  <div>
    <h4>Child Component</h4>
    <p>Child Count: {{ childCount }}</p>
  </div>
</template>

<!-- Parent Component -->
<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const childRef = ref(null);

const callChildMethod = () => {
  childRef.value.incrementChild();
};
</script>

<template>
  <div>
    <h3>defineExpose for Parent-Child Interaction</h3>
    <child-component ref="childRef" />
    <button @click="callChildMethod">Call Child Method</button>
  </div>
</template>
```

### Explanation
- The child uses `defineExpose` to expose the `incrementChild` method to the parent.
- The parent accesses the child’s method via a `ref` (`childRef.value.incrementChild()`).
- Clicking the button in the parent calls the child’s method, updating `childCount`.
- This pattern provides a controlled way for parents to interact with child components without breaking encapsulation.

---

## Tip 20: Use `onMounted` with `nextTick` for DOM-Dependent Logic

### Why It Matters
Sometimes, you need to access the DOM immediately after a component mounts or updates. `nextTick` ensures that the DOM has been updated before running your logic, preventing issues with timing or unrendered elements.

### Example
Let’s focus an input field after the component mounts using `onMounted` and `nextTick`.

```javascript
<script setup>
import { onMounted, nextTick, ref } from 'vue';

const inputRef = ref(null);

onMounted(async () => {
  await nextTick();
  inputRef.value.focus();
});
</script>

<template>
  <div>
    <h3>onMounted with nextTick</h3>
    <input ref="inputRef" placeholder="This input will be focused on mount" />
  </div>
</template>
```

### Explanation
- `onMounted` runs after the component mounts, but the DOM might not be fully updated.
- `nextTick` ensures the DOM is ready before calling `focus()` on the input.
- The input is automatically focused when the component mounts, providing a better user experience.
- This pattern is useful for DOM-dependent operations like focusing elements, measuring dimensions, or initializing third-party libraries.

---

## Summary of Extended Patterns and Tips

11. **Global State Composable**: Use a composable with `provide`/`inject` for lightweight state management.
12. **Lazy-Load Components**: Use `defineAsyncComponent` to improve initial load times.
13. **v-memo for Loops**: Optimize performance in lists by memoizing template blocks.
14. **Deep Watching**: Use the `deep` option in `watch` for nested `reactive` objects.
15. **Suspense for Async**: Use `<Suspense>` to handle async operations with a fallback UI.
16. **Event Bus with mitt**: Use `mitt` for decoupled cross-component communication.
17. **reactive Props with toRefs**: Preserve reactivity when destructuring `reactive` props.
18. **v-once for Static Content**: Prevent re-renders of static content for performance.
19. **defineExpose for Interaction**: Expose methods to parents for controlled interaction.
20. **onMounted with nextTick**: Use `nextTick` for reliable DOM-dependent logic.

These additional patterns and tips enhance your Vue.js development workflow, focusing on scalability, performance, and maintainability. Combine them with the previous tips to build more robust applications!