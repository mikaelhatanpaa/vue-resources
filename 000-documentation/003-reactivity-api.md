# Vue.js 3 Reactivity APIs and Functions Tutorial (Composition API)

Vue.js 3's Composition API provides a powerful set of reactivity APIs and utility functions to manage state, computed properties, watchers, and more. This tutorial covers all the built-in reactivity functions, including `ref`, `reactive`, `computed`, `watch`, `watchEffect`, `toRef`, `toRefs`, `isRef`, `isReactive`, `isProxy`, `shallowRef`, `shallowReactive`, `readonly`, `shallowReadonly`, `toRaw`, `markRaw`, `unref`, and `triggerRef`. Each section includes a detailed explanation and a practical example using the `<script setup>` syntax.

---

## 1. `ref`

### Overview
`ref` creates a reactive reference to a single value (primitive or object). It’s the most common way to create reactive state in Vue 3. You access or modify its value using the `.value` property in JavaScript, but in templates, Vue automatically unwraps it.

### Use Case
- Managing simple reactive state like numbers, strings, or objects.
- When you need a single reactive value that can be passed around or used in computed properties.

### Example
Let’s create a counter that increments when a button is clicked.

```javascript
<script setup>
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>

<template>
  <div>
    <h3>ref Example</h3>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Explanation
- `count` is a reactive `ref` initialized to `0`.
- We modify it using `count.value++` in the `increment` function.
- In the template, `{{ count }}` automatically unwraps `count.value` to display the value.

---

## 2. `reactive`

### Overview
`reactive` creates a reactive object (or array) where all its properties are deeply reactive. Unlike `ref`, you don’t need `.value` to access properties; the object itself is a reactive proxy.

### Use Case
- Managing complex state objects with nested properties.
- When you want to make an entire object reactive without wrapping it in a `ref`.

### Example
Let’s create a reactive user object and update its properties.

```javascript
<script setup>
import { reactive } from 'vue';

const user = reactive({
  name: 'Alice',
  age: 25,
});

const updateUser = () => {
  user.name = 'Bob';
  user.age++;
};
</script>

<template>
  <div>
    <h3>reactive Example</h3>
    <p>Name: {{ user.name }}</p>
    <p>Age: {{ user.age }}</p>
    <button @click="updateUser">Update User</button>
  </div>
</template>
```

### Explanation
- `user` is a reactive object with `name` and `age` properties.
- We update its properties directly (`user.name`, `user.age`), and the changes are reactive.
- The template re-renders automatically when `user` changes.

---

## 3. `computed`

### Overview
`computed` creates a reactive computed property that automatically updates when its dependencies change. It’s ideal for deriving state based on other reactive state.

### Use Case
- Calculating derived state (e.g., a total price, filtered lists).
- Caching expensive computations that depend on reactive data.

### Example
Let’s compute the square of a number.

```javascript
<script setup>
import { ref, computed } from 'vue';

const number = ref(5);
const square = computed(() => number.value * number.value);

const increment = () => {
  number.value++;
};
</script>

<template>
  <div>
    <h3>computed Example</h3>
    <p>Number: {{ number }}</p>
    <p>Square: {{ square }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Explanation
- `square` is a computed property that depends on `number`.
- When `number` changes, `square` automatically updates.
- `computed` properties are cached, so `square` only recalculates when `number` changes.

---

## 4. `watch`

### Overview
`watch` allows you to observe a reactive source (e.g., a `ref`, `reactive` object, or getter) and execute a callback when it changes. It’s more explicit than `watchEffect` and supports options like `immediate` and `deep`.

### Use Case
- Performing side effects when a specific value changes (e.g., saving to localStorage).
- Reacting to changes in a specific reactive source with custom logic.

### Example
Let’s watch a `ref` and save its value to localStorage.

```javascript
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
  localStorage.setItem('count', newValue);
});

const increment = () => {
  count.value++;
};
</script>

<template>
  <div>
    <h3>watch Example</h3>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Explanation
- `watch` observes `count` and runs the callback whenever `count.value` changes.
- The callback receives the new and old values, which we log and save to `localStorage`.
- Clicking the button increments `count`, triggering the watcher.

---

## 5. `watchEffect`

### Overview
`watchEffect` automatically tracks all reactive dependencies in its callback and re-runs the callback whenever any dependency changes. It’s less explicit than `watch` and runs immediately on setup.

### Use Case
- Reacting to multiple reactive sources without specifying them explicitly.
- Performing side effects that depend on multiple reactive values.

### Example
Let’s watch two values and log their combined state.

```javascript
<script setup>
import { ref, watchEffect } from 'vue';

const firstName = ref('Alice');
const lastName = ref('Smith');

watchEffect(() => {
  console.log(`Full name: ${firstName.value} ${lastName.value}`);
});

const updateNames = () => {
  firstName.value = 'Bob';
  lastName.value = 'Jones';
};
</script>

<template>
  <div>
    <h3>watchEffect Example</h3>
    <p>Full Name: {{ firstName }} {{ lastName }}</p>
    <button @click="updateNames">Update Names</button>
  </div>
</template>
```

### Explanation
- `watchEffect` runs immediately and tracks `firstName` and `lastName` as dependencies.
- When either `firstName` or `lastName` changes, the callback re-runs.
- Clicking the button updates both names, triggering the `watchEffect` callback.

---

## 6. `toRef`

### Overview
`toRef` creates a reactive reference to a specific property of a `reactive` object. This allows you to pass a single property as a `ref` while keeping it reactive and linked to the original object.

### Use Case
- Passing a single property of a `reactive` object to a child component or function.
- Creating a `ref` that stays in sync with the original `reactive` object.

### Example
Let’s create a `ref` for a property of a `reactive` object.

```javascript
<script setup>
import { reactive, toRef } from 'vue';

const state = reactive({
  name: 'Alice',
});

const nameRef = toRef(state, 'name');

const updateName = () => {
  nameRef.value = 'Bob'; // Updates state.name
};
</script>

<template>
  <div>
    <h3>toRef Example</h3>
    <p>Name (via state): {{ state.name }}</p>
    <p>Name (via toRef): {{ nameRef }}</p>
    <button @click="updateName">Update Name</button>
  </div>
</template>
```

### Explanation
- `nameRef` is a `ref` that points to `state.name`.
- Updating `nameRef.value` updates `state.name`, and vice versa, because they’re linked.
- The template re-renders when `nameRef` changes, reflecting the update in `state`.

---

## 7. `toRefs`

### Overview
`toRefs` converts all properties of a `reactive` object into individual `ref`s. This is useful for destructuring a `reactive` object while keeping its properties reactive.

### Use Case
- Destructuring a `reactive` object for use in a component or function.
- Passing multiple properties of a `reactive` object as individual `ref`s to a child component.

### Example
Let’s destructure a `reactive` object into `ref`s.

```javascript
<script setup>
import { reactive, toRefs } from 'vue';

const state = reactive({
  name: 'Alice',
  age: 25,
});

const { name, age } = toRefs(state);

const updateState = () => {
  name.value = 'Bob';
  age.value++;
};
</script>

<template>
  <div>
    <h3>toRefs Example</h3>
    <p>Name: {{ name }}</p>
    <p>Age: {{ age }}</p>
    <button @click="updateState">Update State</button>
  </divsript>

### Explanation
- `toRefs` converts `state`’s properties (`name` and `age`) into individual `ref`s.
- We destructure them into `name` and `age`, which remain reactive and linked to `state`.
- Updating `name` or `age` updates the original `state` object, and the template reflects the changes.

---

## 8. `isRef`

### Overview
`isRef` checks if a value is a `ref`. It returns `true` if the value is a `ref` object, and `false` otherwise.

### Use Case
- Debugging or validating whether a value is a `ref`.
- Writing generic utility functions that handle both `ref`s and non-`ref`s.

### Example
Let’s check if a value is a `ref`.

```javascript
<script setup>
import { ref, isRef } from 'vue';

const count = ref(0);
const notARef = 42;

console.log('Is count a ref?', isRef(count)); // true
console.log('Is notARef a ref?', isRef(notARef)); // false
</script>

<template>
  <div>
    <h3>isRef Example</h3>
    <p>Check the console for results.</p>
  </div>
</template>
```

### Explanation
- `isRef(count)` returns `true` because `count` is a `ref`.
- `isRef(notARef)` returns `false` because `notARef` is a plain number.
- This utility is useful when writing reusable functions that need to handle different types of values.

---

## 9. `isReactive`

### Overview
`isReactive` checks if a value is a `reactive` object (or a `shallowReactive` object). It returns `true` if the value is a reactive proxy, and `false` otherwise.

### Use Case
- Debugging or validating whether a value is a `reactive` object.
- Writing utility functions that behave differently based on whether an object is reactive.

### Example
Let’s check if a value is a `reactive` object.

```javascript
<script setup>
import { reactive, isReactive } from 'vue';

const state = reactive({ count: 0 });
const plainObject = { count: 0 };

console.log('Is state reactive?', isReactive(state)); // true
console.log('Is plainObject reactive?', isReactive(plainObject)); // false
</script>

<template>
  <div>
    <h3>isReactive Example</h3>
    <p>Check the console for results.</p>
  </div>
</template>
```

### Explanation
- `isReactive(state)` returns `true` because `state` is a `reactive` object.
- `isReactive(plainObject)` returns `false` because `plainObject` is not reactive.
- This is useful for debugging or ensuring an object is reactive before performing operations on it.

---

## 10. `isProxy`

### Overview
`isProxy` checks if a value is a Vue proxy (either `reactive`, `shallowReactive`, `readonly`, or `shallowReadonly`). It’s a broader check than `isReactive`.

### Use Case
- Debugging or validating whether a value is any type of Vue proxy.
- Writing generic code that needs to handle Vue proxies differently.

### Example
Let’s check if a value is a Vue proxy.

```javascript
<script setup>
import { reactive, readonly, isProxy } from 'vue';

const state = reactive({ count: 0 });
const readonlyState = readonly(state);
const plainObject = { count: 0 };

console.log('Is state a proxy?', isProxy(state)); // true
console.log('Is readonlyState a proxy?', isProxy(readonlyState)); // true
console.log('Is plainObject a proxy?', isProxy(plainObject)); // false
</script>

<template>
  <div>
    <h3>isProxy Example</h3>
    <p>Check the console for results.</p>
  </div>
</template>
```

### Explanation
- `isProxy(state)` and `isProxy(readonlyState)` return `true` because both are Vue proxies.
- `isProxy(plainObject)` returns `false` because `plainObject` is not a proxy.
- This is broader than `isReactive`, as it includes `readonly` objects as well.

---

## 11. `shallowRef`

### Overview
`shallowRef` creates a `ref` where only the `.value` access is reactive, but the inner structure of the value (if it’s an object) is not deeply reactive. This can improve performance for large objects.

### Use Case
- Managing large objects where you don’t need deep reactivity.
- Optimizing performance by avoiding unnecessary reactivity overhead.

### Example
Let’s create a `shallowRef` and compare it to a regular `ref`.

```javascript
<script setup>
import { ref, shallowRef } from 'vue';

const regularRef = ref({ count: 0 });
const shallowRefObj = shallowRef({ count: 0 });

const updateInner = () => {
  regularRef.value.count++;
  shallowRefObj.value.count++;
};
</script>

<template>
  <div>
    <h3>shallowRef Example</h3>
    <p>Regular Ref Count: {{ regularRef.count }}</p>
    <p>Shallow Ref Count: {{ shallowRefObj.count }}</p>
    <button @click="updateInner">Update Inner Count</button>
  </div>
</template>
```

### Explanation
- `regularRef` is deeply reactive, so changing `regularRef.value.count` triggers a re-render.
- `shallowRefObj` is not deeply reactive, so changing `shallowRefObj.value.count` does **not** trigger a re-render.
- To make `shallowRefObj` reactive, you’d need to replace the entire `value` (e.g., `shallowRefObj.value = { count: shallowRefObj.value.count + 1 }`).

---

## 12. `shallowReactive`

### Overview
`shallowReactive` creates a reactive object where only the top-level properties are reactive, but nested objects are not. This is similar to `shallowRef` but for objects.

### Use Case
- Managing large nested objects where only the top level needs to be reactive.
- Optimizing performance by reducing reactivity overhead for nested properties.

### Example
Let’s create a `shallowReactive` object and compare it to a `reactive` object.

```javascript
<script setup>
import { reactive, shallowReactive } from 'vue';

const regularReactive = reactive({ data: { count: 0 } });
const shallowReactiveObj = shallowReactive({ data: { count: 0 } });

const updateInner = () => {
  regularReactive.data.count++;
  shallowReactiveObj.data.count++;
};
</script>

<template>
  <div>
    <h3>shallowReactive Example</h3>
    <p>Regular Reactive Count: {{ regularReactive.data.count }}</p>
    <p>Shallow Reactive Count: {{ shallowReactiveObj.data.count }}</p>
    <button @click="updateInner">Update Inner Count</button>
  </div>
</template>
```

### Explanation
- `regularReactive` is deeply reactive, so changing `regularReactive.data.count` triggers a re-render.
- `shallowReactiveObj` is only reactive at the top level, so changing `shallowReactiveObj.data.count` does **not** trigger a re-render.
- To make `shallowReactiveObj` reactive, you’d need to replace the `data` property (e.g., `shallowReactiveObj.data = { count: shallowReactiveObj.data.count + 1 }`).

---

## 13. `readonly`

### Overview
`readonly` creates a read-only proxy of a `reactive` object, `ref`, or another proxy. You cannot modify its properties, and any attempts to do so will be ignored (in development, it logs a warning).

### Use Case
- Protecting state from being modified (e.g., passing props to a child component).
- Ensuring immutability for certain parts of your application.

### Example
Let’s create a `readonly` object and try to modify it.

```javascript
<script setup>
import { reactive, readonly } from 'vue';

const state = reactive({ count: 0 });
const readOnlyState = readonly(state);

const tryUpdate = () => {
  readOnlyState.count++; // This will not work and logs a warning in dev mode
  state.count++; // This works because state is not readonly
};
</script>

<template>
  <div>
    <h3>readonly Example</h3>
    <p>Count: {{ readOnlyState.count }}</p>
    <button @click="tryUpdate">Try Update</button>
  </div>
</template>
```

### Explanation
- `readOnlyState` is a read-only proxy of `state`.
- Attempting to modify `readOnlyState.count` fails silently (or logs a warning in dev mode).
- However, modifying the original `state` still works, and `readOnlyState` reflects the changes because it’s a proxy.

---

## 14. `shallowReadonly`

### Overview
`shallowReadonly` creates a read-only proxy where only the top-level properties are read-only, but nested objects can still be modified. This is a lighter version of `readonly`.

### Use Case
- Protecting top-level properties but allowing nested objects to be modified.
- Optimizing performance by avoiding deep read-only proxies.

### Example
Let’s create a `shallowReadonly` object and test its behavior.

```javascript
<script setup>
import { reactive, shallowReadonly } from 'vue';

const state = reactive({ data: { count: 0 } });
const shallowReadOnlyState = shallowReadonly(state);

const tryUpdate = () => {
  shallowReadOnlyState.data.count++; // This works because data is not readonly
  shallowReadOnlyState.data = { count: 0 }; // This fails because data is a top-level property
};
</script>

<template>
  <div>
    <h3>shallowReadonly Example</h3>
    <p>Count: {{ shallowReadOnlyState.data.count }}</p>
    <button @click="tryUpdate">Try Update</button>
  </div>
</template>
```

### Explanation
- `shallowReadOnlyState` makes top-level properties read-only, so `shallowReadOnlyState.data = ...` fails.
- However, `shallowReadOnlyState.data.count` can be modified because `data` is a nested object, and `shallowReadonly` doesn’t make nested properties read-only.
- The template updates when `data.count` changes.

---

## 15. `toRaw`

### Overview
`toRaw` returns the original, non-reactive object from a `reactive`, `readonly`, `shallowReactive`, or `shallowReadonly` proxy. This is useful when you need to work with the raw data without reactivity.

### Use Case
- Passing data to a third-party library that doesn’t work well with proxies.
- Performing operations that don’t need reactivity (e.g., serialization).

### Example
Let’s get the raw object from a `reactive` proxy.

```javascript
<script setup>
import { reactive, toRaw } from 'vue';

const state = reactive({ count: 0 });
const rawState = toRaw(state);

const updateRaw = () => {
  rawState.count++;
};
</script>

<template>
  <div>
    <h3>toRaw Example</h3>
    <p>Count (reactive): {{ state.count }}</p>
    <p>Count (raw): {{ rawState.count }}</p>
    <button @click="updateRaw">Update Raw</button>
  </div>
</template>
```

### Explanation
- `rawState` is the non-reactive original object from `state`.
- Updating `rawState.count` changes the underlying object, but it doesn’t trigger reactivity.
- The template doesn’t update because `rawState` is not reactive, but `state` still reflects the change because it’s a proxy of the same object.

---

## 16. `markRaw`

### Overview
`markRaw` marks an object as non-reactive, preventing Vue from turning it into a reactive proxy. This is useful for objects that should never be reactive, such as third-party instances.

### Use Case
- Integrating third-party libraries or objects that shouldn’t be reactive.
- Optimizing performance by excluding objects from reactivity.

### Example
Let’s mark an object as non-reactive and use it in a `reactive` object.

```javascript
<script setup>
import { reactive, markRaw } from 'vue';

class MyClass {
  value = 0;
}

const nonReactiveObj = markRaw(new MyClass());
const state = reactive({
  obj: nonReactiveObj,
});

const updateObj = () => {
  state.obj.value++;
};
</script>

<template>
  <div>
    <h3>markRaw Example</h3>
    <p>Value: {{ state.obj.value }}</p>
    <button @click="updateObj">Update Value</button>
  </div>
</template>
```

### Explanation
- `nonReactiveObj` is marked as non-reactive using `markRaw`.
- When added to `state`, it doesn’t become a reactive proxy.
- Updating `state.obj.value` changes the value, but it doesn’t trigger reactivity, so the template doesn’t update automatically.

---

## 17. `unref`

### Overview
`unref` returns the inner value of a `ref`, or the value itself if it’s not a `ref`. It’s a shorthand for `isRef(val) ? val.value : val`.

### Use Case
- Writing utility functions that work with both `ref`s and non-`ref`s.
- Simplifying code when you don’t care whether a value is a `ref`.

### Example
Let’s use `unref` to handle both `ref`s and non-`ref`s.

```javascript
<script setup>
import { ref, unref } from 'vue';

const countRef = ref(5);
const countValue = 10;

const getValue = (val) => unref(val);

console.log(getValue(countRef)); // 5
console.log(getValue(countValue)); // 10
</script>

<template>
  <div>
    <h3>unref Example</h3>
    <p>Check the console for results.</p>
  </div>
</template>
```

### Explanation
- `unref(countRef)` returns `countRef.value` (5) because `countRef` is a `ref`.
- `unref(countValue)` returns `countValue` (10) because it’s not a `ref`.
- This utility simplifies code when you need to work with values that might or might not be `ref`s.

---

## 18. `triggerRef`

### Overview
`triggerRef` manually triggers the reactivity system for a `shallowRef`, forcing a re-render even if the inner structure of the `shallowRef`’s value changes.

### Use Case
- Forcing a re-render when a `shallowRef`’s inner structure changes.
- Manually controlling reactivity for performance optimization.

### Example
Let’s use `triggerRef` to force a re-render with a `shallowRef`.

```javascript
<script setup>
import { shallowRef, triggerRef } from 'vue';

const state = shallowRef({ count: 0 });

const updateInnerAndTrigger = () => {
  state.value.count++;
  triggerRef(state); // Force re-render
};
</script>

<template>
  <div>
    <h3>triggerRef Example</h3>
    <p>Count: {{ state.count }}</p>
    <button @click="updateInnerAndTrigger">Update and Trigger</button>
  </div>
</template>
```

### Explanation
- `state` is a `shallowRef`, so changing `state.value.count` doesn’t trigger a re-render by default.
- `triggerRef(state)` manually forces the reactivity system to re-run, updating the template.
- Without `triggerRef`, the template wouldn’t update because `shallowRef` isn’t deeply reactive.

---

## Summary of Vue.js Reactivity APIs

- **Core Reactivity**:
  - `ref`: Single reactive value.
  - `reactive`: Deeply reactive object.
  - `computed`: Derived reactive value.
  - `watch`: Explicitly watch a reactive source.
  - `watchEffect`: Automatically watch all dependencies.

- **Utilities for Refs and Reactives**:
  - `toRef`: Create a `ref` from a `reactive` property.
  - `toRefs`: Convert a `reactive` object to `ref`s.
  - `shallowRef`: Shallowly reactive `ref`.
  - `shallowReactive`: Shallowly reactive object.
  - `triggerRef`: Manually trigger reactivity for a `shallowRef`.

- **Read-Only**:
  - `readonly`: Deeply read-only proxy.
  - `shallowReadonly`: Shallowly read-only proxy.

- **Debugging and Utilities**:
  - `isRef`: Check if a value is a `ref`.
  - `isReactive`: Check if a value is a `reactive` object.
  - `isProxy`: Check if a value is a Vue proxy.
  - `toRaw`: Get the raw object from a proxy.
  - `markRaw`: Mark an object as non-reactive.
  - `unref`: Unwrap a `ref` or return the value.

These APIs provide a flexible and powerful way to manage reactivity in Vue.js 3, allowing you to build efficient and maintainable applications.