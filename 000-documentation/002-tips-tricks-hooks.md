# Tips and Tricks for Vue.js Lifecycle Hooks (Vue 3 Composition API)

Lifecycle hooks in Vue.js 3's Composition API provide powerful ways to manage a component's lifecycle. However, using them effectively requires understanding best practices and common pitfalls. In this tutorial, we'll explore practical tips and tricks for working with lifecycle hooks, complete with examples to help you apply these techniques in your projects. We'll assume you're familiar with the lifecycle hooks: `onBeforeMount`, `onMounted`, `onBeforeUpdate`, `onUpdated`, `onBeforeUnmount`, `onUnmounted`, `onErrorCaptured`, `onRenderTracked`, `onRenderTriggered`, `onActivated`, and `onDeactivated`.

---

## Tip 1: Use `onMounted` for Async Initialization, but Handle Cleanup

### Why It Matters
`onMounted` is the go-to hook for initializing resources like API calls, timers, or event listeners. However, if the component unmounts before the async operation completes, you might encounter memory leaks or errors (e.g., trying to update state on an unmounted component). Always handle cleanup in `onBeforeUnmount` or `onUnmounted`.

### Example
Let's fetch data on mount and ensure cleanup if the component unmounts during the fetch.

```javascript
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const data = ref(null);
const isMounted = ref(true);

onMounted(async () => {
  console.log('Fetching data...');
  try {
    // Simulate a slow API call
    const response = await new Promise(resolve => 
      setTimeout(() => resolve({ message: 'Data loaded!' }), 3000)
    );
    if (isMounted.value) {
      data.value = response;
    }
  } catch (error) {
    if (isMounted.value) {
      console.error('Fetch error:', error);
    }
  }
});

onBeforeUnmount(() => {
  isMounted.value = false;
  console.log('Component unmounted, canceling updates.');
});
</script>

<template>
  <div>
    <h3>Async Initialization</h3>
    <p>{{ data ? data.message : 'Loading...' }}</p>
  </div>
</template>
```

### Explanation
- We use a flag `isMounted` to track the component's mounted state.
- In `onMounted`, we fetch data asynchronously but only update `data` if the component is still mounted.
- In `onBeforeUnmount`, we set `isMounted` to `false` to prevent state updates after unmounting.
- This prevents errors like "Cannot set property on unmounted component" when the API call resolves after the component is gone.

---

## Tip 2: Avoid Infinite Loops in `onUpdated`

### Why It Matters
The `onUpdated` hook runs after the DOM updates, but modifying reactive state inside it can trigger another update, leading to an infinite loop. Always ensure that state changes in `onUpdated` are conditional or avoided altogether.

### Example
Let's log the DOM height after an update, but avoid triggering another update.

```javascript
<script setup>
import { ref, onUpdated } from 'vue';

const items = ref(['Item 1']);
const containerHeight = ref(0);

onUpdated(() => {
  // Access the DOM after update
  const container = document.querySelector('#item-container');
  if (container) {
    // Only update non-reactive state to avoid re-renders
    containerHeight.value = container.offsetHeight;
    console.log(`Container height after update: ${containerHeight.value}px`);
  }
});
</script>

<template>
  <div>
    <h3>Avoid Infinite Loops</h3>
    <button @click="items.push(`Item ${items.length + 1}`)">Add Item</button>
    <div id="item-container">
      <p v-for="item in items" :key="item">{{ item }}</p>
    </div>
    <p>Container Height: {{ containerHeight }}px</p>
  </div>
</template>
```

### Explanation
- We use `onUpdated` to measure the height of the container after the DOM updates.
- We store the height in `containerHeight`, but we avoid modifying `items` or other reactive state inside `onUpdated` to prevent an infinite loop.
- Clicking "Add Item" updates `items`, which triggers a re-render, and `onUpdated` logs the new height without causing further updates.

---

## Tip 3: Centralize Error Handling with `onErrorCaptured`

### Why It Matters
`onErrorCaptured` allows a parent component to catch errors in its child components, making it ideal for centralized error handling. You can log errors, display user-friendly messages, and prevent errors from crashing the app.

### Example
Let's create a parent component that catches errors from a child and displays a fallback UI.

```javascript
<!-- Parent Component -->
<script setup>
import { ref, onErrorCaptured } from 'vue';

const errorMessage = ref('');
const hasError = ref(false);

onErrorCaptured((err, instance, info) => {
  errorMessage.value = `Error: ${err.message}`;
  hasError.value = true;
  console.log('Captured error:', err, info);
  return false; // Prevent error propagation
});
</script>

<template>
  <div>
    <h3>Centralized Error Handling</h3>
    <div v-if="hasError">
      <p>{{ errorMessage }}</p>
      <button @click="hasError = false">Retry</button>
    </div>
    <child-component v-else />
  </div>
</template>

<!-- ChildComponent.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const shouldFail = ref(true);

onMounted(() => {
  if (shouldFail.value) {
    throw new Error('Failed to load child component!');
  }
});
</script>

<template>
  <div>Child Component Loaded Successfully</div>
</template>
```

### Explanation
- The parent uses `onErrorCaptured` to catch errors from the child component.
- When the child throws an error in `onMounted`, the parent captures it, sets `hasError` to `true`, and displays an error message.
- Returning `false` in `onErrorCaptured` prevents the error from bubbling up further.
- The user can click "Retry" to reset the error state and try rendering the child again.

---

## Tip 4: Optimize Performance with `onActivated` and `onDeactivated`

### Why It Matters
When using `<KeepAlive>`, components are cached instead of destroyed. `onActivated` and `onDeactivated` allow you to pause and resume resources (e.g., timers, API polling) to save memory and improve performance.

### Example
Let's create a component with a timer that pauses when deactivated.

```javascript
<!-- Parent Component -->
<script setup>
import { ref } from 'vue';
import TimerComponent from './TimerComponent.vue';

const showTimer = ref(true);
</script>

<template>
  <div>
    <h3>Optimize with KeepAlive</h3>
    <button @click="showTimer = !showTimer">
      {{ showTimer ? 'Hide' : 'Show' }} Timer
    </button>
    <KeepAlive>
      <timer-component v-if="showTimer" />
    </KeepAlive>
  </div>
</template>

<!-- TimerComponent.vue -->
<script setup>
import { ref, onActivated, onDeactivated } from 'vue';

const time = ref(0);
let timer = null;

const startTimer = () => {
  timer = setInterval(() => {
    time.value++;
  }, 1000);
};

onActivated(() => {
  console.log('Timer activated!');
  startTimer();
});

onDeactivated(() => {
  console.log('Timer deactivated!');
  clearInterval(timer);
});
</script>

<template>
  <div>
    <p>Time: {{ time }} seconds</p>
  </div>
</template>
```

### Explanation
- The parent uses `<KeepAlive>` to cache the `TimerComponent`.
- In `onActivated`, the timer starts when the component becomes visible.
- In `onDeactivated`, the timer is paused when the component is hidden but still cached.
- This prevents the timer from running unnecessarily, saving resources while maintaining the component's state.

---

## Tip 5: Debug Performance Issues with `onRenderTracked` and `onRenderTriggered`

### Why It Matters
`onRenderTracked` and `onRenderTriggered` are powerful debugging tools for identifying why a component renders or re-renders. Use them to optimize performance by reducing unnecessary renders.

### Example
Let's debug why a component re-renders unexpectedly.

```javascript
<script setup>
import { ref, onRenderTracked, onRenderTriggered } from 'vue';

const count = ref(0);
const staticValue = 'I am static'; // Non-reactive

onRenderTracked((event) => {
  console.log('Tracked dependency:', event.key, event);
});

onRenderTriggered((event) => {
  console.log('Re-render triggered by:', event.key, event);
});

const increment = () => {
  count.value++;
};
</script>

<template>
  <div>
    <h3>Debug Performance</h3>
    <p>Count: {{ count }}</p>
    <p>Static: {{ staticValue }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Explanation
- `onRenderTracked` logs all reactive dependencies (`count`) accessed during the initial render.
- `onRenderTriggered` logs what causes a re-render (`count` changes when the button is clicked).
- `staticValue` is non-reactive, so it doesn't trigger re-renders, helping you confirm which dependencies are causing updates.
- Use these logs to identify and eliminate unnecessary reactive dependencies (e.g., by moving logic to computed properties or watchers).

---

## Tip 6: Combine `onBeforeUpdate` and `onUpdated` for DOM Comparisons

### Why It Matters
`onBeforeUpdate` and `onUpdated` allow you to compare the DOM state before and after an update. This is useful for tasks like animations, logging changes, or ensuring UI consistency.

### Example
Let's compare an element's text content before and after an update.

```javascript
<script setup>
import { ref, onBeforeUpdate, onUpdated } from 'vue';

const text = ref('Initial Text');
const beforeUpdateText = ref('');
const afterUpdateText = ref('');

onBeforeUpdate(() => {
  const element = document.querySelector('#text-element');
  if (element) {
    beforeUpdateText.value = element.textContent;
    console.log('Before update:', beforeUpdateText.value);
  }
});

onUpdated(() => {
  const element = document.querySelector('#text-element');
  if (element) {
    afterUpdateText.value = element.textContent;
    console.log('After update:', afterUpdateText.value);
  }
});
</script>

<template>
  <div>
    <h3>DOM Comparison</h3>
    <p id="text-element">{{ text }}</p>
    <p>Before Update: {{ beforeUpdateText }}</p>
    <p>After Update: {{ afterUpdateText }}</p>
    <button @click="text = 'Updated Text ' + Math.random()">Change Text</button>
  </div>
</template>
```

### Explanation
- `onBeforeUpdate` captures the text content of the element before the DOM updates.
- `onUpdated` captures the text content after the DOM updates.
- Clicking the button changes `text`, triggering an update cycle, and the hooks log the DOM state before and after.
- This technique is useful for debugging DOM changes or implementing custom animations based on DOM differences.

---

## Tip 7: Use `onBeforeUnmount` for Cleanup of Global Resources

### Why It Matters
`onBeforeUnmount` (and `onUnmounted`) is critical for cleaning up global resources like event listeners, timers, or third-party libraries. Failing to clean up can lead to memory leaks or unexpected behavior.

### Example
Let's add a global window event listener and clean it up on unmount.

```javascript
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  console.log('Window resized to:', windowWidth.value);
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  console.log('Resize listener added.');
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  console.log('Resize listener removed.');
});
</script>

<template>
  <div>
    <h3>Cleanup Global Resources</h3>
    <p>Window Width: {{ windowWidth }}px</p>
  </div>
</template>
```

### Explanation
- In `onMounted`, we add a `resize` event listener to the window to track its width.
- In `onBeforeUnmount`, we remove the listener to prevent it from running after the component is unmounted.
- This ensures there are no lingering event listeners, which could cause memory leaks or errors if the handler tries to update the unmounted component's state.

---

## Tip 8: Conditionally Skip Lifecycle Logic with Flags

### Why It Matters
Sometimes, you may want to skip lifecycle logic based on certain conditions (e.g., user permissions, app state). Using flags to control when lifecycle hooks execute can make your components more flexible and efficient.

### Example
Let's conditionally fetch data in `onMounted` based on a user role.

```javascript
<script setup>
import { ref, onMounted } from 'vue';

const userRole = ref('guest'); // Could be 'admin' or 'guest'
const data = ref(null);

onMounted(() => {
  if (userRole.value !== 'admin') {
    console.log('Skipping data fetch: User is not an admin.');
    return;
  }

  console.log('Fetching data for admin...');
  // Simulate an API call
  data.value = { message: 'Admin data loaded!' };
});
</script>

<template>
  <div>
    <h3>Conditional Lifecycle Logic</h3>
    <p>User Role: {{ userRole }}</p>
    <p>{{ data ? data.message : 'No data available.' }}</p>
    <button @click="userRole = userRole === 'admin' ? 'guest' : 'admin'">
      Toggle Role
    </button>
  </div>
</template>
```

### Explanation
- We use a `userRole` ref to determine whether to fetch data in `onMounted`.
- If the user is not an admin, we skip the fetch logic entirely.
- This approach prevents unnecessary operations and makes the component more adaptable to different states.

---

## Summary of Tips

1. **Handle Async Cleanup**: Use flags to prevent state updates after unmounting during async operations.
2. **Avoid Infinite Loops**: Be cautious with reactive state changes in `onUpdated`.
3. **Centralize Error Handling**: Use `onErrorCaptured` for consistent error management.
4. **Optimize with KeepAlive**: Pause and resume resources in `onActivated` and `onDeactivated`.
5. **Debug Performance**: Leverage `onRenderTracked` and `onRenderTriggered` to identify re-render causes.
6. **Compare DOM States**: Use `onBeforeUpdate` and `onUpdated` for DOM comparisons.
7. **Clean Up Global Resources**: Always remove global event listeners or timers in `onBeforeUnmount`.
8. **Conditional Logic**: Use flags to control when lifecycle logic executes.