# Beginner Tutorial: Creating Composables in Vue 3 Composition API

## Introduction
In Vue 3, the **Composition API** allows you to organize and reuse logic in a flexible, modular way. **Composables** are reusable functions that encapsulate reactive logic, making your code cleaner and more maintainable. This tutorial will guide you through creating composables step-by-step, following Vue's idiomatic conventions.

By the end, you'll create a `useCounter` composable to manage a counter state and a `useWindowSize` composable to track the browser window's dimensions.

---

## What is a Composable?
A composable in Vue 3 is a JavaScript function that:
- Uses Vue's Composition API (e.g., `ref`, `reactive`, `computed`, etc.).
- Starts with the prefix `use` (e.g., `useCounter`), following Vue's naming convention.
- Encapsulates reusable, reactive logic that can be shared across components.
- Returns reactive state, computed properties, or methods for components to use.

Composables are Vue's way of extracting and reusing logic, similar to how components encapsulate UI.

---

## Prerequisites
- Basic understanding of Vue 3 and the Composition API.
- A Vue 3 project set up (e.g., using `npm create vue@latest`).
- Node.js and a code editor (e.g., VS Code).

---

## Step 1: Setting Up Your Vue 3 Project
If you don’t have a Vue 3 project, create one:

```bash
npm create vue@latest
```

Follow the prompts to set up your project (enable TypeScript if desired, but this tutorial uses JavaScript for simplicity). Navigate to your project folder and start the development server:

```bash
cd your-project
npm install
npm run dev
```

---

## Step 2: Creating Your First Composable (`useCounter`)
Let’s create a `useCounter` composable to manage a counter with increment and decrement functionality.

### 2.1 Create a Composables Folder
In your project’s `src` directory, create a folder called `composables` to store your composables, as this is the idiomatic convention in Vue 3:

```
src/
  composables/
    useCounter.js
```

### 2.2 Write the `useCounter` Composable
In `src/composables/useCounter.js`, add the following code:

```javascript
import { ref } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    increment,
    decrement,
  };
}
```

**Explanation:**
- We import `ref` from Vue to create a reactive `count` variable.
- The composable accepts an optional `initialValue` parameter (defaults to 0).
- We define `increment` and `decrement` functions to modify `count`.
- The composable returns an object with the reactive `count` and the two methods.
- We use `function` declarations for methods, which is common in Vue composables for clarity.

### 2.3 Use the Composable in a Component
Modify `src/App.vue` (or create a new component) to use the `useCounter` composable, using Vue's `<script setup>` syntax for simplicity:

```vue
<script setup>
import { useCounter } from './composables/useCounter';

const { count, increment, decrement } = useCounter(5); // Start counter at 5
</script>

<template>
  <div>
    <h1>Counter: {{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>
```

**Explanation:**
- We import `useCounter` from the `composables` folder.
- We call `useCounter` in the `<script setup>` section, passing an initial value of 5.
- We destructure `count`, `increment`, and `decrement` from the composable.
- In the template, we display `count` and bind the buttons to the `increment` and `decrement` methods.

Run your project (`npm run dev`) and test the counter. The count should start at 5, and the buttons will increment or decrement it.

---

## Step 3: Creating a More Complex Composable (`useWindowSize`)
Now, let’s create a `useWindowSize` composable to track the browser window’s width and height reactively.

### 3.1 Write the `useWindowSize` Composable
In `src/composables/useWindowSize.js`, add the following code:

```javascript
import { ref, onMounted, onUnmounted } from 'vue';

export function useWindowSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  function updateSize() {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });

  return {
    width,
    height,
  };
}
```

**Explanation:**
- We use `ref` to create reactive `width` and `height` variables, initialized with the current window dimensions.
- The `updateSize` function updates the dimensions when the window is resized.
- We use `onMounted` to add a `resize` event listener and `onUnmounted` to remove it, preventing memory leaks.
- The composable returns the reactive `width` and `height`.
- We follow Vue's convention of using `function` declarations and clear, descriptive names.

### 3.2 Use the Composable in a Component
Update `src/App.vue` (or create a new component) to use `useWindowSize`:

```vue
<script setup>
import { useWindowSize } from './composables/useWindowSize';

const { width, height } = useWindowSize();
</script>

<template>
  <div>
    <h1>Window Size</h1>
    <p>Width: {{ width }}px</p>
    <p>Height: {{ height }}px</p>
  </div>
</template>
```

**Explanation:**
- We import and call `useWindowSize`, destructuring `width` and `height`.
- The template displays the current window dimensions, which update automatically when the window is resized.

Test it by resizing your browser window. The displayed width and height should update in real-time.

---

## Step 4: Idiomatic Best Practices for Composables
To write idiomatic Vue 3 composables:
- **Use the `use` Prefix**: Name composables starting with `use` (e.g., `useCounter`, `useWindowSize`) to follow Vue conventions.
- **Store in `composables` Folder**: Place composables in `src/composables/` for consistency with Vue’s ecosystem.
- **Keep Composables Focused**: Each composable should handle a single piece of functionality to maximize reusability.
- **Clean Up Side Effects**: Use `onUnmounted` to remove event listeners, intervals, or other side effects to prevent memory leaks.
- **Use Vue’s Reactivity**: Leverage `ref`, `reactive`, or `computed` to ensure the composable’s state is reactive.
- **Use `<script setup>`**: When using composables in components, prefer `<script setup>` for its concise syntax, as it’s the idiomatic choice in Vue 3.
- **Test Composables**: Since composables are plain JavaScript functions, you can test them independently of components.

---

## Step 5: Example of Composing Multiple Composables
To show how composables can be reused and combined, let’s use both `useCounter` and `useWindowSize` in a single component:

```vue
<script setup>
import { useCounter } from './composables/useCounter';
import { useWindowSize } from './composables/useWindowSize';

const { count, increment, decrement } = useCounter(10);
const { width, height } = useWindowSize();
</script>

<template>
  <div>
    <h1>Counter: {{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <h2>Window Size</h2>
    <p>Width: {{ width }}px</p>
    <p>Height: {{ height }}px</p>
  </div>
</template>
```

This component demonstrates how composables can be composed together, each managing its own piece of reactive logic.

---

## Conclusion
Composables in Vue 3’s Composition API are a powerful way to encapsulate and reuse reactive logic. In this tutorial, you:
- Created a `useCounter` composable to manage a counter.
- Built a `useWindowSize` composable to track window dimensions.
- Followed Vue’s idiomatic conventions, including the `composables` folder and `use` prefix.
- Learned best practices for writing clean, reusable composables.

Try creating your own composables for other reusable logic, such as form handling, API calls, or local storage management. Composables make your Vue applications modular, maintainable, and fun to build!

---

## Next Steps
- Explore Vue’s Composition API documentation: [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html).
- Experiment with composables like `useFetch` for API calls or `useStorage` for local storage.
- Share composables across projects by packaging them as a library.

Happy coding!

# Tutorial Continuation: Creating Useful Composables in Vue 3 Composition API

## Introduction
This tutorial builds on the previous guide to creating composables in Vue 3. Here, we’ll create four **useful composables** that address common use cases in Vue applications:
1. **`useForm`** – Manages form state and validation.
2. **`useFetch`** – Handles API requests with loading and error states.
3. **`useLocalStorage`** – Syncs reactive state with local storage.
4. **`useMouse`** – Tracks the mouse position reactively.

Each composable is written idiomatically, stored in the `src/composables/` directory, and follows Vue 3 best practices (e.g., `use` prefix, cleanup of side effects, `<script setup>` in components). We’ll also show how to use these composables in components to build practical features.

---

## Prerequisites
- A Vue 3 project set up (e.g., using `npm create vue@latest`).
- Basic understanding of Vue 3’s Composition API and the previous tutorial’s concepts.
- Node.js and a code editor.
- For `useFetch`, access to a public API (we’ll use [JSONPlaceholder](https://jsonplaceholder.typicode.com)).

If you don’t have a project, set one up:

```bash
npm create vue@latest
cd your-project
npm install
npm run dev
```

Ensure the `src/composables/` folder exists from the previous tutorial.

---

## Step 1: Creating the `useForm` Composable
The `useForm` composable simplifies form handling by managing form state, validation, and submission status.

### 1.1 Write the `useForm` Composable
In `src/composables/useForm.js`, add:

```javascript
import { reactive, computed } from 'vue';

export function useForm(initialState, validationRules) {
  const form = reactive({ ...initialState });
  const errors = reactive({});
  const isSubmitting = reactive({ value: false });

  const isValid = computed(() => Object.keys(errors).length === 0);

  function validate() {
    Object.keys(validationRules).forEach((field) => {
      const rule = validationRules[field];
      errors[field] = rule(form[field]) ? '' : `${field} is invalid`;
    });
  }

  function reset() {
    Object.assign(form, initialState);
    Object.keys(errors).forEach((field) => {
      errors[field] = '';
    });
    isSubmitting.value = false;
  }

  async function submit(submitCallback) {
    validate();
    if (!isValid.value) return;
    isSubmitting.value = true;
    try {
      await submitCallback(form);
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    form,
    errors,
    isValid,
    isSubmitting,
    validate,
    reset,
    submit,
  };
}
```

**Explanation:**
- Uses `reactive` for form state and errors to support complex objects.
- Accepts `initialState` (form fields) and `validationRules` (functions to validate each field).
- `isValid` is a computed property that checks if there are no errors.
- `validate` runs validation rules and updates `errors`.
- `reset` restores the form to its initial state.
- `submit` validates the form and calls a provided callback if valid, managing `isSubmitting`.

### 1.2 Use `useForm` in a Component
In `src/components/FormExample.vue`, add:

```vue
<script setup>
import { useForm } from '../composables/useForm';

const initialState = { email: '', password: '' };
const validationRules = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => value.length >= 6,
};

const { form, errors, isValid, isSubmitting, submit, reset } = useForm(
  initialState,
  validationRules
);

async function handleSubmit(formData) {
  console.log('Form submitted:', formData);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
</script>

<template>
  <div>
    <h1>Login Form</h1>
    <form @submit.prevent="submit(handleSubmit)">
      <div>
        <label>Email</label>
        <input v-model="form.email" type="email" />
        <span v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div>
        <label>Password</label>
        <input v-model="form.password" type="password" />
        <span v-if="errors.password">{{ errors.password }}</span>
      </div>
      <button type="submit" :disabled="!isValid || isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
      <button type="button" @click="reset">Reset</button>
    </form>
  </div>
</template>
```

**Explanation:**
- Defines `initialState` and `validationRules` for email and password.
- Uses `useForm` to manage form state, errors, and submission.
- Binds form fields to `form.email` and `form.password` with `v-model`.
- Displays errors and disables the submit button if the form is invalid or submitting.
- The `submit` method calls `handleSubmit`, which logs the form data and simulates an API call.

---

## Step 2: Creating the `useFetch` Composable
The `useFetch` composable handles API requests with reactive loading and error states.

### 2.1 Write the `useFetch` Composable
In `src/composables/useFetch.js`, add:

```javascript
import { ref, computed } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const isLoading = ref(false);

  const isEmpty = computed(() => !data.value && !error.value && !isLoading.value);

  async function fetchData() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      data.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch immediately
  fetchData();

  return {
    data,
    error,
    isLoading,
    isEmpty,
    refetch: fetchData,
  };
}
```

**Explanation:**
- Uses `ref` for `data`, `error`, and `isLoading` to track API state.
- `isEmpty` indicates if no data, error, or loading state exists.
- `fetchData` performs the API request and updates reactive states.
- Automatically fetches data when the composable is called.
- Returns `refetch` to allow manual re-fetching.

### 2.2 Use `useFetch` in a Component
In `src/components/FetchExample.vue`, add:

```vue
<script setup>
import { useFetch } from '../composables/useFetch';

const { data, error, isLoading, isEmpty, refetch } = useFetch(
  'https://jsonplaceholder.typicode.com/posts?_limit=5'
);
</script>

<template>
  <div>
    <h1>Posts</h1>
    <button @click="refetch" :disabled="isLoading">Refresh</button>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="isEmpty">No data available</div>
    <ul v-else>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

**Explanation:**
- Uses `useFetch` to fetch a list of posts from JSONPlaceholder.
- Displays loading, error, or empty states as needed.
- Renders the post titles in a list when data is available.
- Includes a refresh button to call `refetch`.

---

## Step 3: Creating the `useLocalStorage` Composable
The `useLocalStorage` composable syncs a reactive value with the browser’s local storage.

### 3.1 Write the `useLocalStorage` Composable
In `src/composables/useLocalStorage.js`, add:

```javascript
import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  const value = ref(stored ? JSON.parse(stored) : defaultValue);

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return value;
}
```

**Explanation:**
- Reads the initial value from `localStorage` or uses `defaultValue`.
- Creates a `ref` for the reactive value.
- Uses `watch` to sync changes to `localStorage` whenever `value` changes.
- Returns the reactive `value` for use in components.

### 3.2 Use `useLocalStorage` in a Component
In `src/components/StorageExample.vue`, add:

```vue
<script setup>
import { useLocalStorage } from '../composables/useLocalStorage';

const username = useLocalStorage('username', '');
</script>

<template>
  <div>
    <h1>Persistent Username</h1>
    <input v-model="username" placeholder="Enter your username" />
    <p>Stored username: {{ username || 'None' }}</p>
  </div>
</template>
```

**Explanation:**
- Uses `useLocalStorage` to store the username in `localStorage`.
- Binds an input to `username` with `v-model`.
- Displays the stored username, which persists across page reloads.

---

## Step 4: Creating the `useMouse` Composable
The `useMouse` composable tracks the mouse position reactively.

### 4.1 Write the `useMouse` Composable
In `src/composables/useMouse.js`, add:

```javascript
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  onMounted(() => {
    window.addEventListener('mousemove', update);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });

  return { x, y };
}
```

**Explanation:**
- Uses `ref` for reactive `x` and `y` coordinates.
- `update` sets the coordinates based on mouse events.
- Adds a `mousemove` listener on mount and removes it on unmount to prevent memory leaks.
- Returns the reactive `x` and `y` coordinates.

### 4.2 Use `useMouse` in a Component
In `src/components/MouseExample.vue`, add:

```vue
<script setup>
import { useMouse } from '../composables/useMouse';

const { x, y } = useMouse();
</script>

<template>
  <div>
    <h1>Mouse Position</h1>
    <p>X: {{ x }}px, Y: {{ y }}px</p>
  </div>
</template>
```

**Explanation:**
- Uses `useMouse` to track mouse coordinates.
- Displays the current `x` and `y` positions, which update as the mouse moves.

---

## Step 5: Combining Composables in a Single Component
To demonstrate composability, let’s create a component that uses multiple composables together:

In `src/App.vue`, add:

```vue
<script setup>
import { useCounter } from './composables/useCounter';
import { useLocalStorage } from './composables/useLocalStorage';
import { useMouse } from './composables/useMouse';

const { count, increment, decrement } = useCounter(0);
const theme = useLocalStorage('theme', 'light');
const { x, y } = useMouse();
</script>

<template>
  <div :class="theme">
    <h1>Dashboard</h1>
    <p>Counter: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <p>Theme: {{ theme }}</p>
    <button @click="theme = theme === 'light' ? 'dark' : 'light'">Toggle Theme</button>
    <p>Mouse: X: {{ x }}px, Y: {{ y }}px</p>
  </div>
</template>

<style>
.light {
  background: white;
  color: black;
}
.dark {
  background: black;
  color: white;
}
</style>
```

**Explanation:**
- Combines `useCounter`, `useLocalStorage`, and `useMouse`.
- Uses `useCounter` for a counter, `useLocalStorage` to persist a theme, and `useMouse` to track mouse position.
- Toggles between light and dark themes, with the theme persisting in `localStorage`.
- Applies the theme as a class to the root `div`.

---

## Step 6: Idiomatic Best Practices Recap
- **Naming**: All composables use the `use` prefix (e.g., `useForm`, `useFetch`).
- **Directory**: Stored in `src/composables/` for consistency.
- **Reactivity**: Use `ref`, `reactive`, or `computed` appropriately.
- **Cleanup**: Remove event listeners (`useMouse`) or handle async states (`useFetch`) properly.
- **Single Responsibility**: Each composable focuses on one feature (e.g., form handling, API fetching).
- **Component Syntax**: Use `<script setup>` for concise, idiomatic component code.
- **Type Safety**: For TypeScript users, add type annotations (not shown here for simplicity).

---

## Conclusion
In this continuation, you created four useful composables:
- `useForm` for form management with validation.
- `useFetch` for API requests with loading and error handling.
- `useLocalStorage` for persistent reactive state.
- `useMouse` for tracking mouse position.

These composables are practical, reusable, and follow Vue 3’s idiomatic patterns. You also learned how to combine composables in a single component to build rich features. Experiment with these composables in your projects, or create new ones for tasks like authentication, timers, or drag-and-drop functionality.

---

## Next Steps
- Explore Vue’s official composables (e.g., `useSlots`, `useAttrs`): [Vue 3 API](https://vuejs.org/api/).
- Build a `useAuth` composable for user authentication.
- Package your composables as an npm library for reuse across projects.
- Add TypeScript for type-safe composables.

Happy coding!

# Tutorial Continuation: Creating Advanced Composables in Vue 3 Composition API

## Introduction
This tutorial extends the previous Vue 3 Composition API guides by introducing five new **composables** that tackle diverse, real-world scenarios:
1. **`useAuth`** – Manages user authentication state.
2. **`useDebounce`** – Debounces reactive input values for performance.
3. **`useInterval`** – Runs a callback on a timed interval.
4. **`useDarkMode`** – Toggles and persists dark mode with system preference detection.
5. **`useDragDrop`** – Handles drag-and-drop interactions.

Each composable is written idiomatically, stored in the `src/composables/` directory, and follows Vue 3 best practices (e.g., `use` prefix, proper cleanup, `<script setup>`). We’ll demonstrate their usage in components and show how to combine them for complex features.

---

## Prerequisites
- A Vue 3 project set up (e.g., using `npm create vue@latest`).
- Basic understanding of Vue 3’s Composition API and the concepts from previous tutorials.
- Node.js and a code editor.
- For `useAuth`, a mock authentication API is simulated (in a real app, replace with your backend).

If you don’t have a project, set one up:

```bash
npm create vue@latest
cd your-project
npm install
npm run dev
```

Ensure the `src/composables/` folder exists from previous tutorials.

---

## Step 1: Creating the `useAuth` Composable
The `useAuth` composable manages user authentication state, including login, logout, and user data.

### 1.1 Write the `useAuth` Composable
In `src/composables/useAuth.js`, add:

```javascript
import { ref, computed } from 'vue';

// Mock API for demonstration
const mockApi = {
  async login(credentials) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return { id: 1, name: 'Test User', email: credentials.email };
    }
    throw new Error('Invalid credentials');
  },
  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export function useAuth() {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(false);
  const error = ref(null);

  async function login(credentials) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await mockApi.login(credentials);
      user.value = response;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    error.value = null;
    try {
      await mockApi.logout();
      user.value = null;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
```

**Explanation:**
- Uses `ref` for `user`, `isLoading`, and `error` to manage state.
- `isAuthenticated` is a computed property checking if a user is logged in.
- `login` and `logout` handle async API calls with loading and error states.
- Uses a mock API for demonstration; replace with your real authentication service (e.g., Firebase, Supabase).

### 1.2 Use `useAuth` in a Component
In `src/components/AuthExample.vue`, add:

```vue
<script setup>
import { useAuth } from '../composables/useAuth';

const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
const credentials = { email: '', password: '' };
</script>

<template>
  <div>
    <h1>Authentication</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="isAuthenticated">
      <p>Welcome, {{ user.name }} ({{ user.email }})</p>
      <button @click="logout">Logout</button>
    </div>
    <form v-else @submit.prevent="login(credentials)">
      <div>
        <label>Email</label>
        <input v-model="credentials.email" type="email" />
      </div>
      <div>
        <label>Password</label>
        <input v-model="credentials.password" type="password" />
      </div>
      <button type="submit" :disabled="isLoading">Login</button>
    </form>
  </div>
</template>
```

**Explanation:**
- Uses `useAuth` to manage authentication.
- Displays a login form when not authenticated; shows user info and a logout button when authenticated.
- Handles loading and error states.
- Test with `test@example.com` and `password` to log in.

---

## Step 2: Creating the `useDebounce` Composable
The `useDebounce` composable debounces a reactive value to prevent excessive updates, useful for search inputs or API calls.

### 2.1 Write the `useDebounce` Composable
In `src/composables/useDebounce.js`, add:

```javascript
import { ref, watch, onUnmounted } from 'vue';

export function useDebounce(value, delay = 500) {
  const debouncedValue = ref(value);
  let timeout = null;

  watch(value, (newValue) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  onUnmounted(() => {
    if (timeout) clearTimeout(timeout);
  });

  return debouncedValue;
}
```

**Explanation:**
- Takes a reactive `value` (e.g., a `ref`) and a `delay` (default 500ms).
- Creates a `debouncedValue` that updates only after the delay.
- Uses `watch` to monitor `value` and set a timeout.
- Cleans up the timeout on unmount to prevent memory leaks.

### 2.2 Use `useDebounce` in a Component
In `src/components/DebounceExample.vue`, add:

```vue
<script setup>
import { ref } from 'vue';
import { useDebounce } from '../composables/useDebounce';

const search = ref('');
const debouncedSearch = useDebounce(search, 1000);
</script>

<template>
  <div>
    <h1>Search</h1>
    <input v-model="search" placeholder="Type to search..." />
    <p>Immediate: {{ search }}</p>
    <p>Debounced: {{ debouncedSearch }}</p>
  </div>
</template>
```

**Explanation:**
- Creates a `search` ref for the input.
- Uses `useDebounce` to create a `debouncedSearch` that updates 1 second after typing stops.
- Displays both immediate and debounced values to show the effect.

---

## Step 3: Creating the `useInterval` Composable
The `useInterval` composable runs a callback on a timed interval, with start/stop controls.

### 3.1 Write the `useInterval` Composable
In `src/composables/useInterval.js`, add:

```javascript
import { ref, onUnmounted } from 'vue';

export function useInterval(callback, interval = 1000) {
  const isRunning = ref(false);
  let intervalId = null;

  function start() {
    if (!isRunning.value) {
      isRunning.value = true;
      intervalId = setInterval(callback, interval);
    }
  }

  function stop() {
    if (isRunning.value) {
      isRunning.value = false;
      clearInterval(intervalId);
    }
  }

  onUnmounted(() => {
    stop();
  });

  return {
    isRunning,
    start,
    stop,
  };
}
```

**Explanation:**
- Takes a `callback` function and an `interval` (default 1000ms).
- Uses `isRunning` to track the interval’s state.
- `start` begins the interval; `stop` clears it.
- Cleans up the interval on unmount.

### 3.2 Use `useInterval` in a Component
In `src/components/IntervalExample.vue`, add:

```vue
<script setup>
import { ref } from 'vue';
import { useInterval } from '../composables/useInterval';

const seconds = ref(0);
const { isRunning, start, stop } = useInterval(() => {
  seconds.value++;
}, 1000);
</script>

<template>
  <div>
    <h1>Timer</h1>
    <p>Seconds: {{ seconds }}</p>
    <button @click="start" :disabled="isRunning">Start</button>
    <button @click="stop" :disabled="!isRunning">Stop</button>
  </div>
</template>
```

**Explanation:**
- Uses `useInterval` to increment `seconds` every second.
- Provides buttons to start and stop the timer.
- Disables buttons based on `isRunning`.

---

## Step 4: Creating the `useDarkMode` Composable
The `useDarkMode` composable toggles dark mode, syncs with local storage, and respects system preferences.

### 4.1 Write the `useDarkMode` Composable
In `src/composables/useDarkMode.js`, add:

```javascript
import { ref, watch, onMounted } from 'vue';

export function useDarkMode() {
  const isDark = ref(
    localStorage.getItem('dark-mode') === 'true' ||
    (!localStorage.getItem('dark-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  watch(isDark, (newValue) => {
    localStorage.setItem('dark-mode', newValue);
    document.documentElement.classList.toggle('dark', newValue);
  });

  onMounted(() => {
    document.documentElement.classList.toggle('dark', isDark.value);
  });

  function toggle() {
    isDark.value = !isDark.value;
  }

  return {
    isDark,
    toggle,
  };
}
```

**Explanation:**
- Initializes `isDark` based on local storage or system preference.
- Watches `isDark` to update local storage and toggle the `dark` class on `<html>`.
- Applies the initial class on mount.
- Provides a `toggle` function to switch modes.

### 4.2 Use `useDarkMode` in a Component
In `src/components/DarkModeExample.vue`, add:

```vue
<script setup>
import { useDarkMode } from '../composables/useDarkMode';

const { isDark, toggle } = useDarkMode();
</script>

<template>
  <div class="min-h-screen transition-colors">
    <h1>Dark Mode</h1>
    <button @click="toggle">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</button>
    <p :class="{ 'text-white': isDark, 'text-black': !isDark }">
      This text changes color based on the mode.
    </p>
  </div>
</template>

<style>
.dark {
  background: #1a202c;
  color: #e2e8f0;
}
</style>
```

**Explanation:**
- Uses `useDarkMode` to toggle dark mode.
- Applies a `dark` class to the `<html>` element via the composable.
- Includes basic styles for light and dark modes.

---

## Step 5: Creating the `useDragDrop` Composable
The `useDragDrop` composable handles drag-and-drop functionality for a list of items.

### 5.1 Write the `useDragDrop` Composable
In `src/composables/useDragDrop.js`, add:

```javascript
import { ref } from 'vue';

export function useDragDrop(items) {
  const list = ref([...items]);
  let draggedIndex = null;

  function onDragStart(index) {
    draggedIndex = index;
  }

  function onDrop(index) {
    if (draggedIndex === null) return;
    const [item] = list.value.splice(draggedIndex, 1);
    list.value.splice(index, 0, item);
    draggedIndex = null;
  }

  return {
    list,
    onDragStart,
    onDrop,
  };
}
```

**Explanation:**
- Takes an array of `items` and creates a reactive `list`.
- Tracks the `draggedIndex` during drag operations.
- `onDragStart` sets the dragged item’s index.
- `onDrop` reorders the list by moving the dragged item to the drop index.

### 5.2 Use `useDragDrop` in a Component
In `src/components/DragDropExample.vue`, add:

```vue
<script setup>
import { useDragDrop } from '../composables/useDragDrop';

const initialItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
const { list, onDragStart, onDrop } = useDragDrop(initialItems);
</script>

<template>
  <div>
    <h1>Drag and Drop</h1>
    <ul>
      <li
        v-for="(item, index) in list"
        :key="item"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent
        @drop="onDrop(index)"
        class="p-2 m-1 bg-gray-200 cursor-move"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
```

**Explanation:**
- Uses `useDragDrop` to manage a draggable list.
- Each list item is marked `draggable` and handles `dragstart`, `dragover`, and `drop` events.
- Reorders items when dropped.

---

## Step 6: Combining Composables in a Dashboard Component
To showcase composability, let’s create a dashboard that uses multiple composables:

In `src/App.vue`, add:

```vue
<script setup>
import { useAuth } from './composables/useAuth';
import { useDarkMode } from './composables/useDarkMode';
import { useInterval } from './composables/useInterval';
import { ref } from 'vue';

const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
const { isDark, toggle } = useDarkMode();
const uptime = ref(0);
const { start } = useInterval(() => {
  uptime.value++;
}, 1000);

// Start interval on mount
start();

const credentials = { email: '', password: '' };
</script>

<template>
  <div class="min-h-screen transition-colors">
    <div class="p-4">
      <h1>Dashboard</h1>
      <button @click="toggle" class="mb-4">
        {{ isDark ? 'Light Mode' : 'Dark Mode' }}
      </button>
      <p>Uptime: {{ uptime }} seconds</p>
      <div v-if="isLoading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div v-else-if="isAuthenticated">
        <p>Welcome, {{ user.name }}</p>
        <button @click="logout">Logout</button>
      </div>
      <form v-else @submit.prevent="login(credentials)" class="mt-4">
        <div>
          <label>Email</label>
          <input v-model="credentials.email" type="email" class="border" />
        </div>
        <div>
          <label>Password</label>
          <input v-model="credentials.password" type="password" class="border" />
        </div>
        <button type="submit" :disabled="isLoading">Login</button>
      </form>
    </div>
  </div>
</template>

<style>
.dark {
  background: #1a202c;
  color: #e2e8f0;
}
</style>
```

**Explanation:**
- Combines `useAuth`, `useDarkMode`, and `useInterval`.
- Displays user authentication status, a dark mode toggle, and an uptime counter.
- Applies dark mode styles based on `isDark`.

---

## Step 7: Idiomatic Best Practices Recap
- **Naming**: Use `use` prefix (e.g., `useAuth`, `useDebounce`).
- **Directory**: Store in `src/composables/`.
- **Reactivity**: Use `ref`, `reactive`, or `computed` appropriately.
- **Cleanup**: Remove timers (`useDebounce`, `useInterval`) and listeners (`useDarkMode`) on unmount.
- **Single Responsibility**: Each composable handles one feature.
- **Component Syntax**: Use `<script setup>` for concise components.
- **Error Handling**: Manage loading and error states (`useAuth`, `useFetch`).

---

## Conclusion
In this tutorial, you created five advanced composables:
- `useAuth` for authentication state.
- `useDebounce` for debounced inputs.
- `useInterval` for timed callbacks.
- `useDarkMode` for theme toggling.
- `useDragDrop` for drag-and-drop lists.

These composables are practical, reusable, and adhere to Vue 3’s idiomatic patterns. You also learned how to combine them in a dashboard component. Try extending these composables (e.g., add refresh tokens to `useAuth`, drag-and-drop nesting to `useDragDrop`) or create new ones for your needs.

---

## Next Steps
- Explore Vue’s built-in composables: [Vue 3 API](https://vuejs.org/api/).
- Add TypeScript for type-safe composables.
- Create a `useWebSocket` composable for real-time updates.
- Publish your composables as an npm package.

Happy coding!

# Tutorial: Advanced Vue 3 Composables with TypeScript and Packaging

## Introduction
This tutorial continues the Vue 3 Composition API series, focusing on advanced topics:
1. **`useWebSocket`** – Manages real-time WebSocket connections for live updates.
2. **`useTypeSafeForm`** – Handles forms with TypeScript for type safety.
3. **Packaging Composables** – Publishes your composables as an npm library.

These composables are written idiomatically, stored in `src/composables/`, and use TypeScript for type safety. We’ll demonstrate their usage in a real-time chat application and guide you through creating an npm package. The tutorial assumes familiarity with previous tutorials’ concepts (e.g., `useAuth`, `useDarkMode`).

---

## Prerequisites
- A Vue 3 project with TypeScript enabled (`npm create vue@latest`, select TypeScript).
- Node.js, a code editor, and `npm` or `yarn`.
- Basic understanding of Vue 3 Composition API, TypeScript, and WebSockets.
- A WebSocket server (we’ll use a public echo server for testing: `wss://echo.websocket.org`).

Set up a new Vue 3 project if needed:

```bash
npm create vue@latest
cd your-project
npm install
npm run dev
```

Ensure the `src/composables/` folder exists. Install TypeScript if not already included:

```bash
npm install typescript --save-dev
```

---

## Step 1: Creating the `useWebSocket` Composable
The `useWebSocket` composable manages a WebSocket connection for real-time communication, handling connection state, messages, and errors.

### 1.1 Write the `useWebSocket` Composable
In `src/composables/useWebSocket.ts`, add:

```typescript
import { ref, onUnmounted, Ref } from 'vue';

interface WebSocketState {
  isConnected: Ref<boolean>;
  message: Ref<string | null>;
  error: Ref<string | null>;
  sendMessage: (msg: string) => void;
  reconnect: () => void;
}

export function useWebSocket(url: string): WebSocketState {
  const isConnected = ref(false);
  const message = ref<string | null>(null);
  const error = ref<string | null>(null);
  let ws: WebSocket | null = null;

  function connect() {
    ws = new WebSocket(url);
    
    ws.onopen = () => {
      isConnected.value = true;
      error.value = null;
    };

    ws.onmessage = (event) => {
      message.value = event.data;
    };

    ws.onerror = () => {
      error.value = 'WebSocket error';
    };

    ws.onclose = () => {
      isConnected.value = false;
      error.value = 'WebSocket disconnected';
    };
  }

  function sendMessage(msg: string) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(msg);
    } else {
      error.value = 'WebSocket is not connected';
    }
  }

  function reconnect() {
    if (ws) {
      ws.close();
    }
    connect();
  }

  // Initial connection
  connect();

  onUnmounted(() => {
    if (ws) {
      ws.close();
    }
  });

  return {
    isConnected,
    message,
    error,
    sendMessage,
    reconnect,
  };
}
```

**Explanation:**
- Uses TypeScript to define a `WebSocketState` interface for type safety.
- Manages `isConnected`, `message`, and `error` with `ref`.
- `connect` establishes the WebSocket connection and sets up event handlers.
- `sendMessage` sends messages when connected.
- `reconnect` closes and reopens the connection.
- Cleans up the WebSocket on unmount to prevent memory leaks.

### 1.2 Use `useWebSocket` in a Component
In `src/components/WebSocketChat.vue`, add:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useWebSocket } from '../composables/useWebSocket';

const { isConnected, message, error, sendMessage } = useWebSocket('wss://echo.websocket.org');
const input = ref('');
</script>

<template>
  <div>
    <h1>Real-Time Chat</h1>
    <p>Status: {{ isConnected ? 'Connected' : 'Disconnected' }}</p>
    <p v-if="error">Error: {{ error }}</p>
    <div>
      <input v-model="input" placeholder="Type a message..." />
      <button @click="sendMessage(input); input = ''" :disabled="!isConnected">
        Send
      </button>
    </div>
    <p v-if="message">Received: {{ message }}</p>
  </div>
</template>
```

**Explanation:**
- Uses `useWebSocket` with a public echo server (echos back sent messages).
- Manages an `input` ref for the message.
- Displays connection status, errors, and received messages.
- Sends messages and clears the input on button click.

---

## Step 2: Creating the `useTypeSafeForm` Composable
The `useTypeSafeForm` composable extends the `useForm` from a previous tutorial, adding TypeScript for type-safe form handling.

### 2.1 Write the `useTypeSafeForm` Composable
In `src/composables/useTypeSafeForm.ts`, add:

```typescript
import { reactive, computed, ComputedRef, UnwrapNestedRefs } from 'vue';

interface FormState<T> {
  form: UnwrapNestedRefs<T>;
  errors: UnwrapNestedRefs<Partial<Record<keyof T, string>>>;
  isValid: ComputedRef<boolean>;
  isSubmitting: UnwrapNestedRefs<{ value: boolean }>;
  validate: () => void;
  reset: () => void;
  submit: (submitCallback: (form: T) => Promise<void>) => Promise<void>;
}

export function useTypeSafeForm<T extends Record<string, any>>(
  initialState: T,
  validationRules: Partial<Record<keyof T, (value: any) => boolean>>
): FormState<T> {
  const form = reactive({ ...initialState });
  const errors = reactive<Partial<Record<keyof T, string>>>({});
  const isSubmitting = reactive({ value: false });

  const isValid = computed(() => Object.keys(errors).length === 0);

  function validate() {
    Object.keys(validationRules).forEach((field) => {
      const key = field as keyof T;
      const rule = validationRules[key];
      errors[key] = rule && rule(form[key]) ? '' : `${String(key)} is invalid`;
    });
  }

  function reset() {
    Object.assign(form, initialState);
    Object.keys(errors).forEach((key) => {
      errors[key as keyof T] = '';
    });
    isSubmitting.value = false;
  }

  async function submit(submitCallback: (form: T) => Promise<void>) {
    validate();
    if (!isValid.value) return;
    isSubmitting.value = true;
    try {
      await submitCallback(form);
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    form,
    errors,
    isValid,
    isSubmitting,
    validate,
    reset,
    submit,
  };
}
```

**Explanation:**
- Uses TypeScript generics (`T`) to type the form state and validation rules.
- Defines a `FormState` interface for return types.
- Extends `useForm` with type-safe `form`, `errors`, and `validationRules`.
- Ensures `validate`, `reset`, and `submit` respect the generic type `T`.

### 2.2 Use `useTypeSafeForm` in a Component
In `src/components/TypeSafeForm.vue`, add:

```vue
<script setup lang="ts">
import { useTypeSafeForm } from '../composables/useTypeSafeForm';

interface LoginForm {
  email: string;
  password: string;
}

const initialState: LoginForm = { email: '', password: '' };
const validationRules = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value: string) => value.length >= 6,
};

const { form, errors, isValid, isSubmitting, submit, reset } = useTypeSafeForm(
  initialState,
  validationRules
);

async function handleSubmit(formData: LoginForm) {
  console.log('Submitted:', formData);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
</script>

<template>
  <div>
    <h1>Login Form</h1>
    <form @submit.prevent="submit(handleSubmit)">
      <div>
        <label>Email</label>
        <input v-model="form.email" type="email" />
        <span v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div>
        <label>Password</label>
        <input v-model="form.password" type="password" />
        <span v-if="errors.password">{{ errors.password }}</span>
      </div>
      <button type="submit" :disabled="!isValid || isSubmitting.value">
        {{ isSubmitting.value ? 'Submitting...' : 'Submit' }}
      </button>
      <button type="button" @click="reset">Reset</button>
    </form>
  </div>
</template>
```

**Explanation:**
- Defines a `LoginForm` interface for type safety.
- Uses `useTypeSafeForm` with typed `initialState` and `validationRules`.
- TypeScript ensures `form` and `errors` match `LoginForm`.
- Handles form submission and reset with type-safe callbacks.

---

## Step 3: Packaging Composables as an npm Library
To share your composables across projects, package them as an npm library.

### 3.1 Set Up the Library Project
Create a new directory for the library:

```bash
mkdir vue-composables-lib
cd vue-composables-lib
npm init -y
```

Install dependencies:

```bash
npm install typescript vue --save-dev
```

Update `package.json`:

```json
{
  "name": "@yourname/vue-composables",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc --emitDeclarationOnly && rollup -c"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vue": "^3.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "rollup": "^4.0.0"
  }
}
```

Install Rollup for bundling:

```bash
npm install @rollup/plugin-typescript rollup --save-dev
```

Create a `rollup.config.js`:

```javascript
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'es' },
  ],
  plugins: [typescript()],
  external: ['vue'],
};
```

### 3.2 Add Composables
Create `src/composables/` and copy `useWebSocket.ts` and `useTypeSafeForm.ts` from your Vue project. Create `src/index.ts` to export them:

```typescript
export { useWebSocket } from './composables/useWebSocket';
export { useTypeSafeForm } from './composables/useTypeSafeForm';
```

Create a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "declaration": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

### 3.3 Build and Publish
Build the library:

```bash
npm run build
```

Test locally by linking:

```bash
npm link
```

In your Vue project, link the library:

```bash
npm link @yourname/vue-composables
```

Use in your Vue project:

```typescript
import { useWebSocket } from '@yourname/vue-composables';
```

To publish to npm:

```bash
npm login
npm publish --access public
```

Replace `@yourname` with your npm username or scope.

---

## Step 4: Combining Composables in a Chat Application
Create a chat app that combines `useWebSocket`, `useTypeSafeForm`, `useDarkMode` (from the previous tutorial), and `useAuth`.

In `src/App.vue`, add:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useWebSocket } from './composables/useWebSocket';
import { useTypeSafeForm } from './composables/useTypeSafeForm';
import { useDarkMode } from './composables/useDarkMode';
import { useAuth } from './composables/useAuth';

interface ChatForm {
  message: string;
}

const { isDark, toggle } = useDarkMode();
const { user, isAuthenticated, login, logout } = useAuth();
const { isConnected, message, error, sendMessage } = useWebSocket('wss://echo.websocket.org');

const initialState: ChatForm = { message: '' };
const validationRules = { message: (value: string) => value.trim().length > 0 };
const { form, errors, isValid, submit } = useTypeSafeForm(initialState, validationRules);

async function handleSubmit(formData: ChatForm) {
  if (isAuthenticated) {
    sendMessage(`${user.value?.name}: ${formData.message}`);
    form.message = '';
  }
}

const credentials = ref({ email: '', password: '' });
</script>

<template>
  <div class="min-h-screen transition-colors">
    <div class="p-4">
      <h1>Chat App</h1>
      <button @click="toggle" class="mb-4">
        {{ isDark ? 'Light Mode' : 'Dark Mode' }}
      </button>
      <div v-if="!isAuthenticated">
        <form @submit.prevent="login(credentials.value)">
          <input v-model="credentials.value.email" type="email" placeholder="Email" class="border" />
          <input v-model="credentials.value.password" type="password" placeholder="Password" class="border" />
          <button type="submit">Login</button>
        </form>
      </div>
      <div v-else>
        <p>Welcome, {{ user.name }}</p>
        <button @click="logout">Logout</button>
        <p>WebSocket: {{ isConnected ? 'Connected' : 'Disconnected' }}</p>
        <p v-if="error">Error: {{ error }}</p>
        <form @submit.prevent="submit(handleSubmit)" class="mt-4">
          <input v-model="form.message" placeholder="Type a message..." class="border" />
          <span v-if="errors.message">{{ errors.message }}</span>
          <button type="submit" :disabled="!isValid || !isConnected">Send</button>
        </form>
        <p v-if="message">Message: {{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.dark {
  background: #1a202c;
  color: #e2e8f0;
}
</style>
```

**Explanation:**
- Combines `useWebSocket` for real-time messaging, `useTypeSafeForm` for the chat input, `useDarkMode` for theming, and `useAuth` for user authentication.
- Requires login before sending messages.
- Validates messages and sends them via WebSocket when valid.
- Displays received messages and connection status.

---

## Step 5: Idiomatic Best Practices Recap
- **TypeScript**: Use interfaces and generics for type safety (`useTypeSafeForm`, `useWebSocket`).
- **Naming**: Prefix with `use` and store in `src/composables/`.
- **Cleanup**: Close WebSocket connections (`useWebSocket`) on unmount.
- **Reactivity**: Use `ref` and `computed` appropriately.
- **Modularity**: Each composable focuses on a single responsibility.
- **Packaging**: Bundle with Rollup for npm distribution.

---

## Conclusion
You created:
- `useWebSocket` for real-time WebSocket communication.
- `useTypeSafeForm` for type-safe form handling.
- An npm library to share composables.

You also built a chat app combining multiple composables, demonstrating their power in real-world applications. By using TypeScript and packaging your composables, you’ve made your code robust and reusable.

---

## Next Steps
- Add error retry logic to `useWebSocket`.
- Extend `useTypeSafeForm` with server-side validation.
- Publish your npm library and use it in multiple projects.
- Explore Vue’s ecosystem libraries (e.g., Pinia, Vue Router) for advanced state and routing.

Happy coding!

# Tutorial: Vue 3 Composables Inspired by TanStack Query

## Introduction
TanStack Query (`@tanstack/vue-query`) is a powerful library for managing server-side state in Vue 3, offering composables like `useQuery` for fetching and caching data and `useMutation` for updating server state. Its declarative API, automatic caching, and background synchronization make it a favorite for Vue developers. However, you might wonder if there are Vue-specific composables or libraries that provide similar functionality or if you can build custom composables to mimic its core features.

In this tutorial, we’ll:
1. Discuss Vue-specific alternatives to TanStack Query (e.g., Pinia Colada, VueUse’s `useFetch`).
2. Create two custom composables inspired by TanStack Query:
   - **`useSimpleQuery`** – Fetches data with basic caching and refetching.
   - **`useSimpleMutation`** – Handles server mutations with cache invalidation.
3. Demonstrate their usage in a Vue 3 application, combining them with previous composables (e.g., `useDarkMode`, `useAuth`).
4. Explain why TanStack Vue Query is often the preferred choice.

These composables are written idiomatically for Vue 3, use TypeScript for type safety, and are stored in `src/composables/`. The goal is to understand TanStack Query’s concepts by building simplified versions, not to replace it.

---

## Prerequisites
- A Vue 3 project with TypeScript enabled (`npm create vue@latest`, select TypeScript).
- Node.js, a code editor, and `npm` or `yarn`.
- Familiarity with Vue 3 Composition API, TypeScript, and previous tutorials’ composables (e.g., `useAuth`, `useDarkMode`).
- A mock API for testing (we’ll use JSONPlaceholder: `https://jsonplaceholder.typicode.com`).

Set up a Vue 3 project if needed:

```bash
npm create vue@latest
cd your-project
npm install
npm run dev
```

Ensure the `src/composables/` folder exists from previous tutorials.

---

## Step 1: Exploring Vue-Specific Alternatives to TanStack Query
Before building custom composables, let’s review Vue-specific options that offer functionality similar to TanStack Query’s data fetching, caching, and mutation handling:

### 1.1 Pinia Colada
Pinia Colada is a Vue library that provides a TanStack Query-like API for data fetching, built on top of Pinia (Vue’s state management library). It offers composables like `useQuery` and `useMutation`, with caching and background updates, and integrates tightly with Vue’s ecosystem.

- **Similarities to TanStack Query**: Declarative `useQuery` and `useMutation`, caching, automatic refetching, and invalidation.
- **Differences**: Relies on Pinia for state management, which might add overhead if you don’t already use Pinia. TanStack Query is more lightweight and framework-agnostic.
- **When to Use**: If your project heavily uses Pinia and you prefer a Vue-specific solution.

**Example (from Pinia Colada docs)**:
```vue
<script setup>
import { useQuery } from '@pinia/colada';

const { data, isLoading, error } = useQuery({
  key: ['posts'],
  query: () => fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
});
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <ul v-else>
    <li v-for="post in data" :key="post.id">{{ post.title }}</li>
  </ul>
</template>
```

### 1.2 VueUse’s `useFetch`
VueUse provides `useFetch`, a composable for data fetching with reactive state, but it lacks advanced features like query caching or mutation invalidation.

- **Similarities to TanStack Query**: Reactive data fetching, loading/error states.
- **Differences**: No built-in caching, refetching, or mutation handling. It’s simpler and better for basic fetch scenarios.
- **When to Use**: For simple API calls without complex caching needs.

**Example**:
```vue
<script setup>
import { useFetch } from '@vueuse/core';

const { data, isFetching, error } = useFetch('https://jsonplaceholder.typicode.com/posts', { refetch: true });
</script>
```

### 1.3 Custom Composables (This Tutorial)
You can build custom composables to emulate TanStack Query’s core features (e.g., caching, refetching, mutations). These are useful for learning or when you need lightweight, tailored solutions without external dependencies. However, they won’t match TanStack Query’s robustness for production apps.

### 1.4 Why TanStack Vue Query?
TanStack Vue Query is often preferred because:
- **Comprehensive Features**: Automatic caching, background refetching, pagination, infinite scrolling, and mutation handling.[](https://lirantal.com/blog/supercharging-vuejs-3-app-tanstack-query-practical-refactoring-guide)
- **Framework-Agnostic**: Works with any API (fetch, Axios, etc.) and supports Vue’s reactivity.[](https://www.vuemastery.com/blog/advanced-data-fetching-in-vue-w-tanstack-query/)
- **Minimal Boilerplate**: Simplifies state management compared to Pinia or Vuex for server state.[](https://medium.com/%40bsalwiczek/why-to-use-tanstack-query-in-vue-106f60863582)
- **Community and Docs**: Extensive documentation and community support.[](https://www.npmjs.com/package/%40tanstack/vue-query)

If you want a Vue-specific feel, Pinia Colada is the closest alternative, but TanStack Vue Query’s maturity and flexibility make it the standard choice.

---

## Step 2: Creating the `useSimpleQuery` Composable
Let’s create a `useSimpleQuery` composable inspired by TanStack Query’s `useQuery`. It will fetch data, cache results in memory, and support refetching, with TypeScript for type safety.

### 2.1 Write the `useSimpleQuery` Composable
In `src/composables/useSimpleQuery.ts`, add:

```typescript
import { ref, computed, onUnmounted, Ref, ComputedRef } from 'vue';

// Simple in-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface QueryState<T> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  error: Ref<string | null>;
  isStale: ComputedRef<boolean>;
  refetch: () => Promise<void>;
}

export function useSimpleQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: { staleTime?: number } = {}
): QueryState<T> {
  const { staleTime = CACHE_DURATION } = options;
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const isError = ref(false);
  const error = ref<string | null>(null);

  const isStale = computed(() => {
    const cached = cache[queryKey];
    return !cached || Date.now() - cached.timestamp > staleTime;
  });

  async function fetchData() {
    // Use cache if available and not stale
    if (cache[queryKey] && !isStale.value) {
      data.value = cache[queryKey].data;
      return;
    }

    isLoading.value = true;
    isError.value = false;
    error.value = null;

    try {
      const result = await queryFn();
      data.value = result;
      cache[queryKey] = { data: result, timestamp: Date.now() };
    } catch (err) {
      isError.value = true;
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  // Initial fetch
  fetchData();

  // Expose refetch method
  const refetch = () => fetchData();

  return {
    data,
    isLoading,
    isError,
    error,
    isStale,
    refetch,
  };
}
```

**Explanation:**
- **Type Safety**: Uses TypeScript generics (`T`) to type the data returned by `queryFn`.
- **Cache**: Stores results in a simple in-memory `cache` object with a timestamp.
- **State**: Manages `data`, `isLoading`, `isError`, `error`, and `isStale` with `ref` and `computed`.
- **Options**: Supports a `staleTime` option to control cache duration.
- **Refetching**: Provides a `refetch` method to manually refresh data.
- **Limitations**: Lacks advanced features like background refetching, pagination, or query deduplication compared to TanStack Query.

### 2.2 Use `useSimpleQuery` in a Component
In `src/components/SimpleQueryExample.vue`, add:

```vue
<script setup lang="ts">
import { useSimpleQuery } from '../composables/useSimpleQuery';

interface Post {
  id: number;
  title: string;
  body: string;
}

const { data, isLoading, isError, error, isStale, refetch } = useSimpleQuery<Post[]>(
  'posts',
  () => fetch('https://jsonplaceholder.typicode.com/posts?_limit=5').then(res => res.json()),
  { staleTime: 30_000 } // 30 seconds
);
</script>

<template>
  <div>
    <h1>Posts</h1>
    <p>Cache: {{ isStale ? 'Stale' : 'Fresh' }}</p>
    <button @click="refetch" :disabled="isLoading">Refresh</button>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

**Explanation:**
- Fetches a list of posts from JSONPlaceholder, typed as `Post[]`.
- Uses `useSimpleQuery` with a `queryKey` of `'posts'` and a 30-second `staleTime`.
- Displays loading, error, or data states, with a button to refetch.
- Shows cache status (`isStale`).

---

## Step 3: Creating the `useSimpleMutation` Composable
The `useSimpleMutation` composable emulates TanStack Query’s `useMutation`, handling server updates and cache invalidation.

### 3.1 Write the `useSimpleMutation` Composable
In `src/composables/useSimpleMutation.ts`, add:

```typescript
import { ref, Ref } from 'vue';

interface MutationState<T, V> {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  error: Ref<string | null>;
  mutate: (variables: V) => Promise<T>;
  invalidateQueries: (queryKey: string) => void;
}

export function useSimpleMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>
): MutationState<T, V> {
  const isLoading = ref(false);
  const isError = ref(false);
  const error = ref<string | null>(null);

  async function mutate(variables: V): Promise<T> {
    isLoading.value = true;
    isError.value = false;
    error.value = null;

    try {
      const result = await mutationFn(variables);
      return result;
    } catch (err) {
      isError.value = true;
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function invalidateQueries(queryKey: string) {
    delete cache[queryKey]; // Invalidate cache for the query
  }

  return {
    isLoading,
    isError,
    error,
    mutate,
    invalidateQueries,
  };
}
```

**Explanation:**
- **Type Safety**: Uses generics `T` (mutation result) and `V` (variables passed to `mutationFn`).
- **State**: Manages `isLoading`, `isError`, and `error` with `ref`.
- **Mutate**: Executes the mutation and handles errors.
- **Cache Invalidation**: Provides `invalidateQueries` to clear cache entries (tied to `useSimpleQuery`’s cache).
- **Limitations**: Lacks optimistic updates or automatic refetching after mutations.

### 3.2 Use `useSimpleMutation` in a Component
In `src/components/SimpleMutationExample.vue`, add:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useSimpleMutation } from '../composables/useSimpleMutation';
import { useSimpleQuery } from '../composables/useSimpleQuery';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface NewPost {
  title: string;
  body: string;
}

// Mutation
const { isLoading: isMutating, isError: isMutationError, error: mutationError, mutate, invalidateQueries } = useSimpleMutation<Post, NewPost>(
  async (newPost) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    return response.json();
  }
);

// Query to display posts
const { data, isLoading, isError, error } = useSimpleQuery<Post[]>('posts', () =>
  fetch('https://jsonplaceholder.typicode.com/posts?_limit=5').then(res => res.json())
);

const title = ref('');
const body = ref('');

async function handleSubmit() {
  try {
    await mutate({ title: title.value, body: body.value });
    invalidateQueries('posts'); // Refresh posts after mutation
    title.value = '';
    body.value = '';
  } catch {
    // Error handled by mutation state
  }
}
</script>

<template>
  <div>
    <h1>Create Post</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Title</label>
        <input v-model="title" />
      </div>
      <div>
        <label>Body</label>
        <textarea v-model="body"></textarea>
      </div>
      <button type="submit" :disabled="isMutating">Submit</button>
      <p v-if="isMutationError">Error: {{ mutationError }}</p>
    </form>
    <h2>Posts</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

**Explanation:**
- Uses `useSimpleMutation` to create a new post via a POST request.
- Uses `useSimpleQuery` to display the list of posts.
- On form submission, `mutate` sends the new post, and `invalidateQueries` clears the cache to trigger a refetch.
- Handles mutation and query states separately.

---

## Step 4: Combining Composables in a Blog App
Let’s create a mini blog app combining `useSimpleQuery`, `useSimpleMutation`, `useDarkMode`, and `useAuth` (from previous tutorials) to show how they work together.

In `src/App.vue`, add:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useSimpleQuery } from './composables/useSimpleQuery';
import { useSimpleMutation } from './composables/useSimpleMutation';
import { useDarkMode } from './composables/useDarkMode';
import { useAuth } from './composables/useAuth';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface NewPost {
  title: string;
  body: string;
}

const { isDark, toggle } = useDarkMode();
const { user, isAuthenticated, login, logout } = useAuth();
const credentials = ref({ email: '', password: '' });

// Query
const { data, isLoading, isError, error } = useSimpleQuery<Post[]>('posts', () =>
  fetch('https://jsonplaceholder.typicode.com/posts?_limit=5').then(res => res.json())
);

// Mutation
const { isLoading: isMutating, isError: isMutationError, error: mutationError, mutate, invalidateQueries } = useSimpleMutation<Post, NewPost>(
  async (newPost) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPost, userId: user.value?.id }),
    });
    return response.json();
  }
);

const title = ref('');
const body = ref('');

async function handleSubmit() {
  try {
    await mutate({ title: title.value, body: body.value });
    invalidateQueries('posts');
    title.value = '';
    body.value = '';
  } catch {
    // Error handled by mutation
  }
}
</script>

<template>
  <div class="min-h-screen transition-colors">
    <div class="p-4">
      <h1>Blog App</h1>
      <button @click="toggle" class="mb-4">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</button>
      <div v-if="!isAuthenticated">
        <form @submit.prevent="login(credentials.value)">
          <input v-model="credentials.value.email" type="email" placeholder="Email" class="border" />
          <input v-model="credentials.value.password" type="password" placeholder="Password" class="border" />
          <button type="submit">Login</button>
        </form>
      </div>
      <div v-else>
        <p>Welcome, {{ user.name }}</p>
        <button @click="logout">Logout</button>
        <form @submit.prevent="handleSubmit" class="mt-4">
          <input v-model="title" placeholder="Post title" class="border" />
          <textarea v-model="body" placeholder="Post body" class="border"></textarea>
          <button type="submit" :disabled="isMutating">Create Post</button>
          <p v-if="isMutationError">Error: {{ mutationError }}</p>
        </form>
        <h2>Posts</h2>
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="isError">Error: {{ error }}</div>
        <ul v-else>
          <li v-for="post in data" :key="post.id">{{ post.title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.dark {
  background: #1a202c;
  color: #e2e8f0;
}
</style>
```

**Explanation:**
- Combines `useSimpleQuery` for fetching posts, `useSimpleMutation` for creating posts, `useDarkMode` for theming, and `useAuth` for authentication.
- Requires login to create posts, using the authenticated user’s ID.
- Displays posts and handles form submission with cache invalidation.
- Applies dark mode styles reactively.

---

## Step 5: Why Use TanStack Vue Query Over Custom Composables?
While `useSimpleQuery` and `useSimpleMutation` demonstrate TanStack Query’s concepts, they are simplified and lack production-ready features. TanStack Vue Query offers:

- **Advanced Caching**: Deduplicates requests, supports query keys with parameters, and provides cache persistence.[](https://www.vuemastery.com/blog/advanced-data-fetching-in-vue-w-tanstack-query/)
- **Background Refetching**: Automatically refetches stale data or on window focus.[](https://lirantal.com/blog/supercharging-vuejs-3-app-tanstack-query-practical-refactoring-guide)
- **Pagination/Infinite Queries**: Built-in support for paginated and infinite scrolling data.[](https://grafikart.fr/tutoriels/vuejs-tanstack-query-2247)
- **Optimistic Updates**: Simplifies mutation handling with automatic rollback on failure.
- **DevTools**: Provides debugging tools for inspecting queries and cache.[](https://wagmi.sh/vue/guides/tanstack-query)
- **Ecosystem**: Integrates with tools like Wagmi for blockchain data.[](https://wagmi.sh/vue/guides/tanstack-query)

**Pinia Colada** is a strong Vue-specific alternative if you’re tied to Pinia, but it’s less mature and requires Pinia’s state management overhead. For most Vue 3 projects, TanStack Vue Query is the recommended choice due to its robustness and community support.[](https://medium.com/%40petrankar/master-efficient-data-fetching-in-vue3-with-tanstack-query-flow-diagram-code-walkthrough-f59bb6875247)

**Example with TanStack Vue Query**:
```vue
<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient();

const { data, isLoading, isError, error } = useQuery({
  queryKey: ['posts'],
  queryFn: () => fetch('https://jsonplaceholder.typicode.com/posts?_limit=5').then(res => res.json()),
});

const mutation = useMutation({
  mutationFn: (newPost: { title: string; body: string }) =>
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    }).then(res => res.json()),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
});
</script>
```

This achieves the same result as our custom composables but with less code and more features.

---

## Step 6: Idiomatic Best Practices Recap
- **TypeScript**: Use generics and interfaces for type-safe composables (`useSimpleQuery`, `useSimpleMutation`).
- **Naming**: Prefix with `use` and store in `src/composables/`.
- **Reactivity**: Leverage `ref` and `computed` for reactive state.
- **Cleanup**: No event listeners in these composables, but always clean up side effects when needed.
- **Simplicity**: Keep composables focused on single responsibilities.
- **TanStack Query**: Prefer it for production due to its advanced features and ecosystem.

---

## Conclusion
You explored:
- Vue-specific alternatives like Pinia Colada and VueUse’s `useFetch`.
- Custom `useSimpleQuery` and `useSimpleMutation` composables inspired by TanStack Query.
- A blog app combining these with `useDarkMode` and `useAuth`.

While custom composables are great for learning, TanStack Vue Query is the recommended tool for managing server state in Vue 3 due to its comprehensive features and minimal boilerplate. Pinia Colada is a viable alternative if you prefer a Pinia-based solution, but it’s less feature-complete.

---

## Next Steps
- Integrate TanStack Vue Query into your project for production-ready data management.
- Explore Pinia Colada for Pinia-based projects: [Pinia Colada Docs](https://pinia-colada.vuejs.org/).
- Add optimistic updates to `useSimpleMutation` for a more TanStack Query-like experience.
- Experiment with TanStack Query’s `useInfiniteQuery` for infinite scrolling.

Happy coding!
>[!NOTE]
>One question, composables look very much like a store in Pinia works. Is a Pinia store a replacement for a composable?

Great question! Composables in Vue 3 and Pinia stores share some similarities, as both are ways to manage and share reactive state or logic in a Vue application, but they serve different purposes and are not direct replacements for each other. Below, I’ll clarify the differences, similarities, and when to use a Pinia store versus a composable, addressing whether a Pinia store can replace a composable.

### Key Similarities
- **Reactivity**: Both composables and Pinia stores leverage Vue’s reactivity system (e.g., `ref`, `reactive`, `computed`) to manage state that updates the UI automatically.
- **Reusability**: Both can encapsulate logic and state, making them reusable across components.
- **Composition API**: Both are designed to work seamlessly with Vue 3’s Composition API, often used in `<script setup>`.

### Key Differences
| **Aspect**            | **Composable**                                                                 | **Pinia Store**                                                              |
|-----------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **Purpose**           | Encapsulates reusable logic or state for specific features (e.g., `useFetch`, `useDarkMode`). | Centralized state management for shared application state (e.g., user data, app settings). |
| **Scope**             | Typically local to a component or feature; state is not inherently shared.    | Globally accessible; designed for sharing state across the entire app.        |
| **Structure**         | A function returning reactive state/methods, often stored in `src/composables/`. | A defined store with `state`, `getters`, and `actions`, stored in `src/stores/`. |
| **State Management**  | State is created per instance of the composable; multiple calls create independent state. | Single source of truth; one instance of the store’s state shared across components. |
| **Use Case**          | Feature-specific logic (e.g., form handling, WebSocket connections).          | App-wide state (e.g., authentication status, cart items).                    |
| **Persistence**       | No built-in persistence; you add it manually (e.g., `useLocalStorage`).       | Can integrate with plugins for persistence (e.g., `pinia-plugin-persistedstate`). |
| **DevTools**          | No specific DevTools integration.                                             | Integrates with Vue DevTools for state inspection and time-travel debugging.  |

### Can a Pinia Store Replace a Composable?
**No, a Pinia store is not a direct replacement for a composable**, and vice versa, because they address different needs. Here’s why:

1. **Different Abstraction Levels**:
   - **Composables** are lightweight, focused utilities for specific functionality (e.g., `useWebSocket` for real-time communication, `useTypeSafeForm` for form handling). They’re like modular tools you compose into components. Each call to a composable creates a new instance of its state, making it ideal for isolated or feature-specific logic.
   - **Pinia Stores** are for managing **global, shared state** that multiple components need to access and modify consistently (e.g., a user’s profile, a shopping cart). Stores provide a single source of truth, ensuring all components see the same state.

2. **State Sharing**:
   - If you need **isolated state** (e.g., a form’s state in one component shouldn’t affect another), a composable like `useTypeSafeForm` is better. Using a Pinia store for this would force you to manage unique keys or namespaces to avoid conflicts, which is overkill.
   - If you need **shared state** (e.g., all components should see the same list of posts), a Pinia store is the right choice. A composable could share state via a shared cache (as in `useSimpleQuery`), but this is less centralized and harder to manage than a store.

3. **Use Case Fit**:
   - **Composables** shine for encapsulating logic that doesn’t need to be globally shared, such as:
     - API fetching (`useFetch`, `useSimpleQuery`).
     - UI-specific behavior (`useDarkMode`, `useMouse`).
     - Feature-specific utilities (`useDebounce`, `useDragDrop`).
   - **Pinia Stores** are ideal for:
     - Application-wide state (e.g., `authStore` for user data, `cartStore` for shopping items).
     - State that needs to persist across routes or components.
     - Scenarios requiring centralized actions (e.g., `fetchCartItems`, `updateUserProfile`).

4. **Overhead and Complexity**:
   - Composables are simpler to create and use for one-off logic. You call a composable in a component, and it’s self-contained.
   - Pinia stores require defining a store with `defineStore`, managing `state`, `getters`, and `actions`, and accessing it via `useStore()`. This is more structured but adds overhead for simple, non-shared logic.

### When to Use Each
- **Use a Composable**:
  - For feature-specific, reusable logic that doesn’t need to be shared globally (e.g., a form, a WebSocket connection, or mouse tracking).
  - When you want isolated state per component or feature.
  - When you need flexibility without the structure of a store (e.g., `useSimpleQuery` for ad-hoc API calls).
  - Example: `useTypeSafeForm` for a login form, `useDebounce` for a search input.

- **Use a Pinia Store**:
  - For global, shared state that multiple components or routes need to access (e.g., user authentication, app settings).
  - When you need centralized state management with DevTools support and persistence.
  - When actions need to coordinate complex logic across the app (e.g., updating a cart and notifying the UI).
  - Example: `authStore` to manage user login state, `postStore` to manage a list of posts.

### Example: Composable vs. Pinia Store
Let’s compare how you’d handle a list of posts with a composable (`useSimpleQuery` from the previous tutorial) versus a Pinia store.

#### Using a Composable (`useSimpleQuery`)
```vue
<script setup lang="ts">
import { useSimpleQuery } from '../composables/useSimpleQuery';

interface Post {
  id: number;
  title: string;
}

const { data, isLoading, isError, error } = useSimpleQuery<Post[]>(
  'posts',
  () => fetch('https://jsonplaceholder.typicode.com/posts?_limit=5').then(res => res.json())
);
</script>

<template>
  <div>
    <h1>Posts</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

**Pros**:
- Isolated state; each component gets its own instance of the query.
- Simple to set up for one-off data fetching.
- Flexible for feature-specific logic.

**Cons**:
- No global sharing; another component calling `useSimpleQuery('posts')` creates a new fetch unless cached.
- Manual cache management (as in `useSimpleQuery`’s in-memory cache).

#### Using a Pinia Store
In `src/stores/postStore.ts`:

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    isLoading: false,
    isError: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPosts() {
      this.isLoading = true;
      this.isError = false;
      this.error = null;
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        this.posts = await response.json();
      } catch (err) {
        this.isError = true;
        this.error = err instanceof Error ? err.message : 'Unknown error';
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {
    postCount: (state) => state.posts.length,
  },
});

interface Post {
  id: number;
  title: string;
}
```

In a component:

```vue
<script setup lang="ts">
import { usePostStore } from '../stores/postStore';

const store = usePostStore();
store.fetchPosts(); // Trigger fetch on mount
</script>

<template>
  <div>
    <h1>Posts ({{ store.postCount }})</h1>
    <div v-if="store.isLoading">Loading...</div>
    <div v-else-if="store.isError">Error: {{ store.error }}</div>
    <ul v-else>
      <li v-for="post in store.posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

**Pros**:
- Global state; all components share the same `posts` array.
- Centralized logic for fetching and updating posts.
- DevTools integration for debugging state changes.
- Easy to persist state with plugins.

**Cons**:
- More boilerplate to define the store.
- Overkill for isolated, component-specific data fetching.

### Can You Use a Pinia Store Instead of a Composable?
You *can* use a Pinia store to handle logic that a composable might cover, but it’s often not ideal:
- **Overhead**: Defining a store for every feature (e.g., a form, a WebSocket connection) adds unnecessary structure and global state when local state would suffice.
- **Misuse of Purpose**: Stores are for shared state. Using them for isolated logic (e.g., a form’s state) goes against their design, leading to cluttered store definitions or namespace conflicts.
- **Flexibility**: Composables are more flexible for composing logic within components. Stores are better for managing a single, consistent state tree.

Conversely, composables can’t fully replace Pinia stores for global state management:
- **Global Access**: Composables don’t provide a single source of truth unless you implement a shared cache or state (which mimics a store’s role).
- **Ecosystem**: Pinia’s DevTools and plugins (e.g., persistence) are tailored for state management, not easily replicable with composables.

### Combining Composables and Pinia Stores
In practice, composables and Pinia stores complement each other:
- Use **composables** for feature-specific logic or isolated state (e.g., `useSimpleQuery` for fetching posts in one component, `useTypeSafeForm` for a form).
- Use **Pinia stores** for shared, app-wide state (e.g., `authStore` for user data, `postStore` for a shared post list).
- Integrate them when needed. For example, a composable like `useSimpleMutation` can update a Pinia store’s state after a mutation.

**Example: Combining `useSimpleMutation` with a Pinia Store**
```vue
<script setup lang="ts">
import { useSimpleMutation } from '../composables/useSimpleMutation';
import { usePostStore } from '../stores/postStore';

interface Post {
  id: number;
  title: string;
}

const store = usePostStore();
const { mutate, isLoading, isError, error } = useSimpleMutation<Post, { title: string }>(
  async (newPost) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    return response.json();
  }
);

const title = ref('');

async function handleSubmit() {
  try {
    const newPost = await mutate({ title: title.value });
    store.posts.push(newPost); // Update Pinia store directly
    title.value = '';
  } catch {
    // Error handled by mutation
  }
}
</script>

<template>
  <div>
    <h1>Add Post</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="title" placeholder="Post title" />
      <button type="submit" :disabled="isLoading">Add</button>
      <p v-if="isError">Error: {{ error }}</p>
    </form>
    <h2>Posts</h2>
    <ul>
      <li v-for="post in store.posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

Here, `useSimpleMutation` handles the mutation logic, while the Pinia store (`usePostStore`) maintains the shared list of posts, showing how they work together.

### Conclusion
- **Pinia stores are not a replacement for composables**, nor are composables a replacement for stores. They serve distinct purposes:
  - **Composables**: For reusable, feature-specific logic or isolated state (e.g., forms, API fetching, UI interactions).
  - **Pinia Stores**: For centralized, shared state management across the app (e.g., user data, global settings).
- Use composables for flexibility and isolation, and Pinia stores for global state and coordination.
- Combine them when appropriate, such as using a composable to fetch data and update a store, or accessing store state within a composable.

If you’re building something like TanStack Query’s functionality (as in `useSimpleQuery`), a composable is the right choice for encapsulating fetching logic, but you might store the fetched data in a Pinia store if it needs to be shared globally. For production apps, consider using `@tanstack/vue-query` or Pinia Colada for robust server-state management, as they’re optimized for these scenarios.

If you have a specific use case in mind (e.g., replacing a particular composable with a store), let me know, and I can provide a tailored example!

>[!NOTE]
>I know but with the Vue 3 Composition API syntax in Pinia without state, actions, getters it seems very similar?

You're absolutely right to point out that with Vue 3's Composition API syntax in Pinia, particularly when using the **Setup Store** syntax (introduced in Pinia to align with the Composition API), the structure of a Pinia store can look *very* similar to a composable. Both leverage the Composition API’s `ref`, `reactive`, and `computed` to manage reactive state and logic, and both are defined as functions that return reactive state and methods. This similarity can make it seem like a Pinia store could replace a composable, or vice versa. Let’s dive deeper into this comparison, focusing on Pinia’s Setup Store syntax, and clarify whether a Pinia store can truly replace a composable in this context.

### Pinia Setup Store vs. Composable: A Closer Look
Pinia’s **Setup Store** syntax allows you to define a store using the Composition API directly, without the traditional `state`, `getters`, and `actions` structure of Pinia’s Options Store. This makes the store definition look almost identical to a composable, as both are functions that return an object of reactive state and methods. Let’s compare them closely to understand the nuances.

#### Example: Composable (`useCounter`)
Here’s a composable from the previous tutorials, `useCounter`, which manages a counter:

```typescript
// src/composables/useCounter.ts
import { ref } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    increment,
    decrement,
  };
}
```

Usage in a component:

```vue
<script setup lang="ts">
import { useCounter } from '../composables/useCounter';

const { count, increment, decrement } = useCounter(5);
</script>

<template>
  <div>
    <h1>Counter: {{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>
```

#### Example: Pinia Setup Store (`useCounterStore`)
Now, let’s define a Pinia Setup Store that does the same thing:

```typescript
// src/stores/counterStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    increment,
    decrement,
  };
});
```

Usage in a component:

```vue
<script setup lang="ts">
import { useCounterStore } from '../stores/counterStore';

const store = useCounterStore();
const { count, increment, decrement } = store;
</script>

<template>
  <div>
    <h1>Counter: {{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>
```

### Why They Look Similar
- **Composition API Syntax**: Both use `ref`, `reactive`, or `computed` to define reactive state, and both return an object of state and methods.
- **Function-Based**: Both are defined as functions (`useCounter` composable, `useCounterStore` store) that encapsulate logic.
- **Reactivity**: Both integrate seamlessly with Vue’s reactivity system, making state changes reactive in components.
- **Usage in `<script setup>`**: Both are called in a component’s setup context and destructured for use in templates.

At first glance, the Pinia Setup Store’s `useCounterStore` looks like it could replace the `useCounter` composable, as the API and behavior are nearly identical. However, there are critical differences that determine when each should be used and whether a Pinia store can truly replace a composable.

### Key Differences Between Pinia Setup Stores and Composables
Despite their syntactic similarity, Pinia Setup Stores and composables serve different purposes, and these differences are crucial:

1. **State Scope and Sharing**:
   - **Composable**: Each call to a composable creates a **new, isolated instance** of its state. For example, calling `useCounter()` in two components creates two independent `count` refs. This is ideal for feature-specific logic where state shouldn’t be shared.
     ```vue
     <script setup>
     const counter1 = useCounter(5); // count starts at 5
     const counter2 = useCounter(10); // count starts at 10, independent
     </script>
     ```
   - **Pinia Setup Store**: A Pinia store is a **singleton** with a single instance of its state shared across the entire application. Calling `useCounterStore()` in multiple components returns the same `count` ref, ensuring all components share the same state.
     ```vue
     <script setup>
     const store1 = useCounterStore(); // count is shared
     const store2 = useCounterStore(); // same count as store1
     </script>
     ```
   - **Implication**: Use a composable for isolated state (e.g., a form’s state in one component). Use a Pinia store for shared state (e.g., a global counter displayed across components).

2. **Global Accessibility**:
   - **Composable**: Not inherently global; you must import and call the composable in each component. Sharing state requires manual mechanisms (e.g., a shared cache, as in `useSimpleQuery` from the previous tutorial).
   - **Pinia Setup Store**: Automatically global via Pinia’s store management. Once defined, any component can access the store with `useCounterStore()`, and Pinia ensures a single instance.
   - **Implication**: Pinia stores are better for app-wide state (e.g., user authentication, app settings), while composables are better for localized logic.

3. **Pinia’s Ecosystem Features**:
   - **Composable**: No built-in integration with Vue DevTools, persistence, or store-specific features. You’d need to implement these manually (e.g., `useLocalStorage` for persistence).
   - **Pinia Setup Store**: Benefits from Pinia’s ecosystem:
     - **Vue DevTools**: Inspect and debug store state with time-travel debugging.
     - **Plugins**: Use plugins like `pinia-plugin-persistedstate` for automatic state persistence.
     - **Store Management**: Pinia manages store lifecycle, ensuring singletons and proper reactivity.
   - **Implication**: Pinia stores are more powerful for managing complex, shared state with tooling support.

4. **Initialization and Configuration**:
   - **Composable**: Can accept parameters to configure its behavior. For example, `useCounter(initialValue)` allows different initial counts per instance.
     ```typescript
     const { count } = useCounter(10); // Starts at 10
     ```
   - **Pinia Setup Store**: Cannot accept parameters directly, as `defineStore` creates a fixed store definition. You’d need to expose methods or reactive properties to configure the store after creation.
     ```typescript
     const store = useCounterStore();
     store.count = 10; // Modify after creation
     ```
   - **Implication**: Composables are more flexible for parameterized logic; stores require additional logic for dynamic initialization.

5. **Purpose and Design**:
   - **Composable**: Designed for **reusable, feature-specific logic** (e.g., `useWebSocket` for real-time updates, `useTypeSafeForm` for form handling). They’re like utility functions that encapsulate a single piece of functionality.
   - **Pinia Setup Store**: Designed for **centralized state management**, providing a single source of truth for app-wide data (e.g., `useAuthStore` for user data, `usePostStore` for posts).
   - **Implication**: Use composables for modular, isolated features; use Pinia stores for shared, coordinated state.

### Can a Pinia Setup Store Replace a Composable?
Given the similarities in syntax, you *could* use a Pinia Setup Store to handle logic typically managed by a composable, but it’s **not always appropriate** and depends on the use case. Let’s evaluate:

#### Scenarios Where a Pinia Setup Store Could Replace a Composable
- **Shared State Requirement**: If the logic involves state that *must* be shared across multiple components, a Pinia store is a natural fit. For example, instead of `useCounter`, you might use `useCounterStore` if the counter value needs to be synchronized across the app.
  ```vue
  <!-- Component A -->
  <script setup>
  const store = useCounterStore();
  </script>
  <template>
    <div>Counter: {{ store.count }}</div>
  </template>

  <!-- Component B -->
  <script setup>
  const store = useCounterStore();
  </script>
  <template>
    <button @click="store.increment">Increment</button>
  </template>
  ```
  Here, both components share the same `count`, which a composable wouldn’t do without extra work.

- **DevTools and Persistence**: If you need Vue DevTools integration or persistence (e.g., saving state to `localStorage`), a Pinia store is easier, as it supports these out of the box.
  ```typescript
  // src/stores/counterStore.ts
  import { defineStore } from 'pinia';
  import { ref } from 'vue';

  export const useCounterStore = defineStore('counter', () => {
    const count = ref(0);
    function increment() { count.value++; }
    return { count, increment };
  }, { persist: true }); // With pinia-plugin-persistedstate
  ```

- **Centralized Logic**: If the logic involves coordinating multiple components or complex state updates, a Pinia store’s centralized nature makes it a better choice than a composable with shared state.

#### Scenarios Where a Composable Is Better
- **Isolated State**: If the state is local to a component or feature, a composable is more appropriate. For example, `useTypeSafeForm` creates a form’s state per component, avoiding global state pollution.
  ```vue
  <script setup>
  const form1 = useTypeSafeForm({ email: '' }, { email: (v) => v.includes('@') });
  const form2 = useTypeSafeForm({ email: '' }, { email: (v) => v.includes('@') });
  // form1 and form2 are independent
  </script>
  ```
  Using a Pinia store for this would require managing separate state keys, which is cumbersome.

- **Parameterized Logic**: Composables can accept parameters to customize behavior, making them more flexible for reusable utilities.
  ```typescript
  const { count } = useCounter(10); // Custom initial value
  ```
  A Pinia store can’t be parameterized in the same way, requiring post-creation configuration.

- **Feature-Specific Logic**: Composables are ideal for encapsulating logic that doesn’t need global access, such as:
  - `useWebSocket` for a chat feature.
  - `useSimpleQuery` for fetching data in one component.
  - `useMouse` for tracking mouse position in a canvas.
  Using a Pinia store for these would add unnecessary global state and complexity.

- **Lightweight Setup**: Composables require less boilerplate than defining a Pinia store, especially for simple logic. A composable is just a function, while a store involves `defineStore` and Pinia’s infrastructure.

#### Why a Pinia Setup Store Isn’t a Full Replacement
Even with the syntactic similarity, a Pinia Setup Store doesn’t fully replace a composable because:
- **Isolation vs. Sharing**: Composables excel at creating isolated, reusable logic, while Pinia stores are designed for shared, global state. Forcing a store to handle isolated state (e.g., multiple forms) requires awkward workarounds like namespacing.
- **Flexibility**: Composables are more flexible for ad-hoc, parameterized logic. Stores are less dynamic due to their singleton nature.
- **Overhead**: Using a Pinia store for every piece of logic (e.g., forms, API calls, UI interactions) bloats the store directory and misuses Pinia’s purpose as a state management tool.
- **Design Intent**: Composables are for modular, feature-specific utilities; Pinia stores are for centralized state management. Using a store for composable-like logic goes against Vue’s design philosophy.

### Combining Composables and Pinia Setup Stores
In practice, composables and Pinia Setup Stores work best together, leveraging their strengths:
- **Composables** handle feature-specific logic or isolated state (e.g., `useSimpleQuery` for fetching, `useTypeSafeForm` for forms).
- **Pinia Stores** manage shared state or coordinate app-wide data (e.g., `useAuthStore` for user data, `usePostStore` for posts).
- You can use composables *within* a Pinia store to encapsulate logic.

**Example: Using a Composable Inside a Pinia Store**
Let’s create a Pinia Setup Store that uses `useSimpleQuery` (from the previous tutorial) to fetch posts and store them globally.

```typescript
// src/stores/postStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSimpleQuery } from '../composables/useSimpleQuery';

interface Post {
  id: number;
  title: string;
}

export const usePostStore = defineStore('post', () => {
  const { data, isLoading, isError, error, refetch } = useSimpleQuery<Post[]>(
    'posts',
    () => fetch('https://jsonplaceholder.typicode.com/posts?_limit=5').then(res => res.json())
  );

  // Additional store-specific state
  const selectedPostId = ref<number | null>(null);

  function selectPost(id: number) {
    selectedPostId.value = id;
  }

  return {
    posts: data,
    isLoading,
    isError,
    error,
    selectedPostId,
    selectPost,
    refetch,
  };
});
```

Usage in a component:

```vue
<script setup lang="ts">
import { usePostStore } from '../stores/postStore';

const store = usePostStore();
</script>

<template>
  <div>
    <h1>Posts</h1>
    <button @click="store.refetch" :disabled="store.isLoading">Refresh</button>
    <div v-if="store.isLoading">Loading...</div>
    <div v-else-if="store.isError">Error: {{ store.error }}</div>
    <ul v-else>
      <li
        v-for="post in store.posts"
        :key="post.id"
        @click="store.selectPost(post.id)"
        :class="{ 'bg-gray-200': store.selectedPostId === post.id }"
      >
        {{ post.title }}
      </li>
    </ul>
    <p v-if="store.selectedPostId">Selected Post ID: {{ store.selectedPostId }}</p>
  </div>
</template>
```

**Explanation**:
- The `usePostStore` Setup Store uses `useSimpleQuery` to fetch posts, making the data globally accessible.
- It adds store-specific state (`selectedPostId`) and methods (`selectPost`) for app-wide coordination.
- Components share the same `posts` and `selectedPostId`, which a composable alone couldn’t achieve without a shared cache.
- This shows how composables (feature logic) and Pinia stores (shared state) complement each other.

### Conclusion
While Pinia’s Setup Store syntax makes it look very similar to a composable due to the shared use of the Composition API, **a Pinia store is not a replacement for a composable**:
- **Composables** are for **isolated, reusable, feature-specific logic** (e.g., `useCounter`, `useSimpleQuery`, `useTypeSafeForm`) where state is local or parameterized.
- **Pinia Setup Stores** are for **centralized, shared state management** (e.g., `useCounterStore`, `usePostStore`) where state must be globally accessible and consistent.
- The similarity in syntax (returning `ref`s and methods) is due to the Composition API, but their purposes differ: composables are modular utilities, while Pinia stores are singletons for app-wide state.

You *could* use a Pinia Setup Store instead of a composable for shared state scenarios (e.g., replacing `useCounter` with `useCounterStore` if the counter is global), but it’s overkill for isolated logic, less flexible for parameterization, and misaligns with Pinia’s design as a state management tool. Conversely, composables can’t replace stores for global state without complex shared state mechanisms.

**Best Practice**:
- Use **composables** for feature-specific logic (e.g., forms, API fetching, UI interactions).
- Use **Pinia Setup Stores** for shared, app-wide state (e.g., user data, posts, settings).
- Combine them when needed, such as using a composable like `useSimpleQuery` inside a store to fetch data, or updating a store’s state from a composable like `useSimpleMutation`.

If you’re inspired by TanStack Query’s composables (e.g., `useQuery`), note that they’re closer to composables than Pinia stores, as they encapsulate fetching logic per component or feature, not global state. However, you might store `useQuery`’s data in a Pinia store for sharing, as shown in the blog app example.

If you want to explore a specific scenario (e.g., converting a composable to a Pinia Setup Store or vice versa), let me know, and I can provide a tailored example!
