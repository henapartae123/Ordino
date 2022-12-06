import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import LazyTube from "vue-lazytube";

Vue.use(LazyTube);

import firebase from "firebase";
import "@/fb";

Vue.config.productionTip = false;

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
