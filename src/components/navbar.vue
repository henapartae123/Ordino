<template>
  <v-app id="nav">
    <v-navigation-drawer
      v-if="isLoggedIn"
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      color="green dark-4"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-list-item link router :to="item.route" :key="item.text">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="green dark-4"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span class="hidden-sm-and-down white--text">Ordino</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn v-if="!isLoggedIn" router :to="`/login`" icon px-5>
        <v-icon>fa-sign-in</v-icon>
        <span>Log In</span>
      </v-btn>
      <v-btn v-if="isLoggedIn" v-on:click="logout" icon px-2>
        <v-icon>fa-sign-out</v-icon>
        <span>Sign Out</span>
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>

    <router-view></router-view>
  </v-app>
</template>

<script>
import db from "@/fb.js";

export default {
  data: () => ({
    drawer: null,
    isLoggedIn: false,
    currentUser: "",

    items: [
      { icon: "fa-users", text: "Courses", route: "/home" },
      { icon: "fa-users", text: "Notes", route: "/notes" },
      { icon: "fa-users", text: "Calender", route: "/calender" },
      { icon: "mdi-config", text: "Set Up", route: "/setup" },
    ],
  }),
  created() {
    if (db.auth.currentUser) {
      this.isLoggedIn = true;
      this.currentUser = db.auth.currentUser;
    }
  },
  methods: {
    logout() {
      db.auth.signOut().then(() => {
        // this.$router.push('/login')
        this.$router.go("/login");
      });
    },
  },
};
</script>