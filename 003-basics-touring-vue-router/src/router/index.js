import { createRouter, createWebHistory } from "vue-router";
import EventList from "@/views/EventList.vue";
import NotFound from "@/views/NotFound.vue";
import NetworkError from "@/views/NetworkError.vue";

import EventDetails from "@/views/event/Details.vue";
import EventLayout from "@/views/event/Layout.vue";

import EventRegister from "@/views/event/Register.vue";
import EventEdit from "@/views/event/Edit.vue";
import About from "@/views/About.vue";

const routes = [
  {
    path: "/",
    name: "EventList",
    component: EventList,
    props: (route) => ({ page: parseInt(route.query.page) || 1 }),
  },
  {
    path: "/events/:id",
    name: "EventLayout",
    props: true,
    component: EventLayout,
    children: [
      {
        path: "",
        name: "EventDetails",
        component: EventDetails,
      },
      {
        path: "register",
        name: "EventRegister",
        component: EventRegister,
      },
      {
        path: "edit",
        name: "EventEdit",
        component: EventEdit,
      },
    ],
  },
  // THIS IS A REDIRECT
  {
    path: "/event/:id",
    redirect: () => {
      return { name: "EventDetails" };
    },
    children: [
      // THIS IS ONE WAY OF REDIRECTION FOR CHILDREN
      // {
      //   path: "register",
      //   redirect: () => {
      //     name: "EventRegister";
      //   },
      // },
      // {
      //   path: "edit",
      //   redirect: () => {
      //     name: "EventEdit";
      //   },
      // },
      // THIS IS AN EASIER WAY
      {
        path: "/event/:afterEvent(.*)",
        redirect: (to) => {
          return { path: "/events/" + to.params.afterEvent };
        },
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // component: About,
    // Lazy Loading: AI/LLM: Explain
    component: () =>
      import(/* webpackChunkName: "about") */ "../views/About.vue"),
  },
  {
    path: "/404/:resource",
    name: "404Resource",
    component: NotFound,
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/network-error",
    name: "NetworkError",
    component: NetworkError,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Moves to top when clicking next page on pagination
  scrollBehaviour(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
