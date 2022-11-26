import Vue from "vue";
import VueRouter from "vue-router";
import CoursesView from "@/views/CoursesView.vue";
import NotesView from "@/views/NotesView.vue";
import CalenderView from "@/views/CalenderView.vue";
import SetupView from "@/views/SetupView.vue";
import CourseDetails from "@/views/CourseDetails.vue";
import NoteDetails from "@/views/NoteDetails.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import firebase from "firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    component: CoursesView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/notes",
    name: "notes",
    component: NotesView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/calender",
    name: "calender",
    component: CalenderView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/setup",
    name: "setup",
    component: SetupView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/course/:id",
    name: "course",
    component: CourseDetails,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/note/:id",
    name: "note",
    component: NoteDetails,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      requiresGuest: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!firebase.auth().currentUser) {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      next({
        path: "/home",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
