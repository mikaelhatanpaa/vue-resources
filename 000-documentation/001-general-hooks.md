# Comprehensive Vue.js Lifecycle Hooks Tutorial (Vue 3 Composition API)

Vue.js provides a set of lifecycle hooks that allow developers to tap into specific stages of a component's lifecycle. These hooks are especially useful for performing setup, cleanup, debugging, and error handling. In this tutorial, we'll explore all the lifecycle hooks available in Vue 3's Composition API, with detailed explanations and practical examples.

This tutorial assumes you're familiar with Vue 3 and the Composition API. All examples will use the `<script setup>` syntax for brevity, which is syntactic sugar for the Composition API.

---

## 1. onBeforeMount

### Overview
The `onBeforeMount` hook runs just before the component is mounted to the DOM. At this stage, the component's reactive setup is complete, but the DOM has not yet been rendered. This hook is ideal for performing setup tasks that need to happen before the initial render, such as initializing data or setting up configurations.

### Use Case
- Pre-fetching data or setting initial state before the component renders.
- Performing one-time setup that doesn't depend on the DOM (since the DOM isn't available yet).

### Example
Let's create a simple component that logs a message before mounting and sets an initial message.

```javascript
<script setup>
import { ref, onBeforeMount } from 'vue';

const message = ref('Not mounted yet');

onBeforeMount(() => {
  console.log('onBeforeMount: Component is about to mount!');
  message.value = 'Ready to mount!';
});
</script>

<template>
  <div>
    <h3>onBeforeMount Example</h3>
    <p>{{ message }}</p>
  </div>
</template>
```

### Explanation
- The `message` ref is initially set to `'Not mounted yet'`.
- `onBeforeMount` updates the `message` to `'Ready to mount!'` just before the component is mounted.
- When the component mounts, the template reflects the updated message.

---

## 2. onMounted

### Overview
The `onMounted` hook runs after the component has been mounted to the DOM. At this point, the component's DOM is fully accessible, making it the perfect place for DOM-related operations or side effects like fetching data, setting up event listeners, or initializing third-party libraries.

### Use Case
- Fetching data from an API after the component is rendered.
- Accessing the DOM directly (e.g., for canvas rendering or third-party DOM manipulation).

### Example
Let's fetch some mock data after the component mounts.

```javascript
<script setup>
import { ref, onMounted } from 'vue';

const data = ref(null);

onMounted(async () => {
  console.log('onMounted: Component has mounted!');
  // Simulate an API call
  const response = await new Promise(resolve => {
    setTimeout(() => resolve({ name: 'Vue.js', version: '3.0' }), 1000);
  });
  data.value = response;
});
</script>

<template>
  <div>
    <h3>onMounted Example</h3>
    <p v-if="data">Framework: {{ data.name }} (v{{ data.version }})</p>
    <p v-else>Loading...</p>
  </div>
</template>
```

### Explanation
- The `data` ref starts as `null`.
- `onMounted` simulates an API call with a 1-second delay, then updates `data` with the fetched result.
- The template conditionally renders the data or a loading message.

---

## 3. onBeforeUpdate

### Overview
The `onBeforeUpdate` hook runs before the component updates due to a reactive state change. At this stage, the DOM has not yet been re-rendered, so you can access the DOM in its pre-update state. This hook is useful for capturing the state of the DOM before an update occurs.

### Use Case
- Logging or comparing DOM state before an update.
- Performing actions that depend on the pre-update DOM.

### Example
Let's create a counter that logs its value before each update.

```javascript
<script setup>
import { ref, onBeforeUpdate } from 'vue';

const counter = ref(0);
const previousCounter = ref(null);

onBeforeUpdate(() => {
  console.log('onBeforeUpdate: DOM is about to update!');
  previousCounter.value = counter.value;
});
</script>

<template>
  <div>
    <h3>onBeforeUpdate Example</h3>
    <p>Current Counter: {{ counter }}</p>
    <p>Previous Counter (before update): {{ previousCounter }}</p>
    <button @click="counter++">Increment</button>
  </div>
</template>
```

### Explanation
- The `counter` ref starts at 0, and `previousCounter` is initially `null`.
- `onBeforeUpdate` captures the current value of `counter` before the update and stores it in `previousCounter`.
- Clicking the button increments `counter`, triggering the update cycle, and `previousCounter` reflects the value before the update.

---

## 4. onUpdated

### Overview
The `onUpdated` hook runs after the component has updated and the DOM has been re-rendered. This hook is useful for performing actions that depend on the updated DOM, but be cautious not to modify reactive state here, as it can cause an infinite update loop.

### Use Case
- Accessing the DOM after an update to perform measurements or updates.
- Logging changes after a re-render.

### Example
Let's log the updated counter value after the DOM updates.

```javascript
<script setup>
import { ref, onUpdated } from 'vue';

const counter = ref(0);
const updateMessage = ref('');

onUpdated(() => {
  console.log('onUpdated: DOM has updated!');
  updateMessage.value = `Counter updated to ${counter.value}`;
});
</script>

<template>
  <div>
    <h3>onUpdated Example</h3>
    <p>Counter: {{ counter }}</p>
    <p>{{ updateMessage }}</p>
    <button @click="counter++">Increment</button>
  </div>
</template>
```

### Explanation
- The `counter` ref starts at 0, and `updateMessage` is initially empty.
- `onUpdated` runs after the DOM updates, setting `updateMessage` to reflect the new `counter` value.
- Clicking the button increments `counter`, triggering a re-render, and `updateMessage` updates accordingly.

---

## 5. onBeforeUnmount

### Overview
The `onBeforeUnmount` hook runs just before a component is unmounted from the DOM. This is the ideal place to perform cleanup tasks, such as clearing timers, canceling API requests, or removing event listeners, to prevent memory leaks.

### Use Case
- Cleaning up timers or intervals.
- Removing global event listeners.

### Example
Let's create a component with a timer that cleans up when unmounted.

```javascript
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const timerCount = ref(0);
const cleanupMessage = ref('');
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    timerCount.value++;
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  cleanupMessage.value = 'Timer cleared before unmounting!';
  console.log('onBeforeUnmount: Cleaning up timer!');
});
</script>

<template>
  <div>
    <h3>onBeforeUnmount Example</h3>
    <p>Timer: {{ timerCount }} seconds</p>
    <p>{{ cleanupMessage }}</p>
  </div>
</template>
```

### Explanation
- A timer increments `timerCount` every second when the component mounts.
- `onBeforeUnmount` clears the timer and sets a `cleanupMessage` before the component is removed.
- This prevents the timer from running after the component is unmounted, avoiding memory leaks.

---

## 6. onUnmounted

### Overview
The `onUnmounted` hook runs after the component has been unmounted from the DOM. At this stage, the component is fully removed, and you can perform final cleanup tasks that don't require DOM access.

### Use Case
- Logging that a component has been unmounted.
- Performing final cleanup that doesn't depend on the DOM.

### Example
Let's log a message after the component is unmounted.

```javascript
<script setup>
import { onUnmounted } from 'vue';

onUnmounted(() => {
  console.log('onUnmounted: Component has been unmounted!');
});
</script>

<template>
  <div>
    <h3>onUnmounted Example</h3>
    <p>Unmount this component to see the console log.</p>
  </div>
</template>
```

### Explanation
- `onUnmounted` simply logs a message to the console after the component is unmounted.
- To test this, you can toggle the component's visibility in a parent component using `v-if`.

---

## 7. onErrorCaptured

### Overview
The `onErrorCaptured` hook allows a parent component to capture errors that occur in its child components, including their lifecycle hooks and render functions. This hook is useful for centralized error handling and can prevent errors from propagating further up the component tree.

### Use Case
- Implementing global error handling for child components.
- Logging errors for debugging.

### Example
Let's create a parent component that captures an error from a child component.

```javascript
<!-- Parent Component -->
<script setup>
import { ref, onErrorCaptured } from 'vue';

const errorMessage = ref('');
const shouldError = ref(false);

onErrorCaptured((err, instance, info) => {
  errorMessage.value = `Captured error: ${err.message}`;
  console.log('onErrorCaptured:', err, info);
  return false; // Prevent error propagation
});
</script>

<template>
  <div>
    <h3>onErrorCaptured Example</h3>
    <button @click="shouldError = true">Cause Error in Child</button>
    <p>{{ errorMessage }}</p>
    <child-component :should-error="shouldError" />
  </div>
</template>

<!-- Child Component (child-component.vue) -->
<script setup>
defineProps(['shouldError']);

if (props.shouldError) {
  throw new Error('Error in child component!');
}
</script>

<template>
  <div>Child Component</div>
</template>
```

### Explanation
- The parent component uses `onErrorCaptured` to catch errors from the child.
- Clicking the button sets `shouldError` to `true`, causing the child to throw an error.
- `onErrorCaptured` captures the error, updates `errorMessage`, and prevents further propagation by returning `false`.

---

## 8. onRenderTracked

### Overview
The `onRenderTracked` hook is a debugging tool that runs during the initial render and tracks every reactive dependency (e.g., refs, computed properties) accessed during rendering. It provides an event object with details about the dependency.

### Use Case
- Debugging why a component renders unexpectedly.
- Understanding which dependencies are being tracked.

### Example
Let's track dependencies during rendering.

```javascript
<script setup>
import { ref, onRenderTracked } from 'vue';

const count = ref(0);
const trackedMessage = ref('');

onRenderTracked((event) => {
  trackedMessage.value = `Tracked dependency: ${event.key}`;
  console.log('onRenderTracked:', event);
});
</script>

<template>
  <div>
    <h3>onRenderTracked Example</h3>
    <p>Count: {{ count }}</p>
    <p>{{ trackedMessage }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```

### Explanation
- `onRenderTracked` logs each reactive dependency accessed during rendering.
- On the initial render, it logs the `count` dependency.
- The `trackedMessage` updates with the last tracked dependency's key.

---

## 9. onRenderTriggered

### Overview
The `onRenderTriggered` hook is another debugging tool that runs whenever a re-render is triggered by a reactive dependency change. It provides an event object with details about what caused the re-render.

### Use Case
- Debugging what causes a component to re-render.
- Optimizing performance by identifying unnecessary re-renders.

### Example
Let's identify what triggers a re-render.

```javascript
<script setup>
import { ref, onRenderTriggered } from 'vue';

const count = ref(0);
const triggeredMessage = ref('');

onRenderTriggered((event) => {
  triggeredMessage.value = `Re-render triggered by: ${event.key}`;
  console.log('onRenderTriggered:', event);
});
</script>

<template>
  <div>
    <h3>onRenderTriggered Example</h3>
    <p>Count: {{ count }}</p>
    <p>{{ triggeredMessage }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```

### Explanation
- `onRenderTriggered` logs the dependency that caused a re-render.
- Clicking the button increments `count`, triggering a re-render, and `onRenderTriggered` logs the `count` dependency as the cause.
- `triggeredMessage` updates with the key of the dependency that triggered the re-render.

---

## 10. onActivated

### Overview
The `onActivated` hook is used with `<KeepAlive>` components. It runs when a cached component is re-activated (i.e., when it becomes visible again after being cached). This hook is useful for re-initializing resources that were cleaned up during deactivation.

### Use Case
- Restoring state or re-adding event listeners when a cached component is re-activated.
- Fetching fresh data when a component becomes active again.

### Example
Let's create a component that logs when it's activated within a `<KeepAlive>` wrapper.

```javascript
<!-- Parent Component -->
<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const showChild = ref(true);
</script>

<template>
  <div>
    <h3>onActivated Example</h3>
    <button @click="showChild = !showChild">
      {{ showChild ? 'Hide' : 'Show' }} Child
    </button>
    <KeepAlive>
      <child-component v-if="showChild" />
    </KeepAlive>
  </div>
</template>

<!-- ChildComponent.vue -->
<script setup>
import { onActivated } from 'vue';

onActivated(() => {
  console.log('onActivated: Component has been re-activated!');
});
</script>

<template>
  <div>Child Component</div>
</template>
```

### Explanation
- The parent component uses `<KeepAlive>` to cache the child component.
- When `showChild` is toggled to `false`, the child is deactivated but cached.
- When `showChild` is toggled back to `true`, `onActivated` runs, logging that the child has been re-activated.

---

## 11. onDeactivated

### Overview
The `onDeactivated` hook also works with `<KeepAlive>` components. It runs when a cached component is deactivated (i.e., when it becomes invisible but is still cached). This hook is useful for cleaning up resources while the component is inactive.

### Use Case
- Pausing timers or removing event listeners when a component is deactivated.
- Saving state before deactivation.

### Example
Let's log when a component is deactivated.

```javascript
<!-- Parent Component -->
<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const showChild = ref(true);
</script>

<template>
  <div>
    <h3>onDeactivated Example</h3>
    <button @click="showChild = !showChild">
      {{ showChild ? 'Hide' : 'Show' }} Child
    </button>
    <KeepAlive>
      <child-component v-if="showChild" />
    </KeepAlive>
  </div>
</template>

<!-- ChildComponent.vue -->
<script setup>
import { onDeactivated } from 'vue';

onDeactivated(() => {
  console.log('onDeactivated: Component has been deactivated!');
});
</script>

<template>
  <div>Child Component</div>
</template>
```

### Explanation
- The parent component uses `<KeepAlive>` to cache the child.
- When `showChild` is toggled to `false`, the child is deactivated, and `onDeactivated` runs, logging the event.
- The child remains cached and can be re-activated later.

---

## Summary of Vue.js Lifecycle Hooks

- **Creation Phase**:
  - `onBeforeMount`: Before the component mounts (setup tasks).
  - `onMounted`: After the component mounts (DOM-related initialization).

- **Update Phase**:
  - `onBeforeUpdate`: Before the DOM updates (pre-update DOM access).
  - `onUpdated`: After the DOM updates (post-update DOM operations).

- **Destruction Phase**:
  - `onBeforeUnmount`: Before the component unmounts (cleanup).
  - `onUnmounted`: After the component unmounts (final cleanup).

- **Error Handling**:
  - `onErrorCaptured`: Captures errors in child components.

- **Debugging**:
  - `onRenderTracked`: Tracks dependencies during rendering.
  - `onRenderTriggered`: Identifies what triggers a re-render.

- **KeepAlive**:
  - `onActivated`: When a cached component is re-activated.
  - `onDeactivated`: When a cached component is deactivated.

---

## Best Practices

1. **Avoid Infinite Loops in `onUpdated`**: Don't modify reactive state in `onUpdated`, as it can trigger another update cycle.
2. **Clean Up in `onBeforeUnmount` and `onUnmounted`**: Always clean up timers, event listeners, and subscriptions to prevent memory leaks.
3. **Use Debugging Hooks Sparingly**: `onRenderTracked` and `onRenderTriggered` are for debugging and should be removed in production.
4. **Leverage `<KeepAlive>` for Performance**: Use `onActivated` and `onDeactivated` to optimize components that are frequently toggled.

This tutorial covers all Vue.js lifecycle hooks in the Composition API, providing you with the tools to manage a component's lifecycle effectively. Experiment with the examples to deepen your understanding!