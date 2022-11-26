<template>
  <v-row justify="center">
    <v-card>
      <v-container>
        <v-card-title>
          {{ Course.title }}
        </v-card-title>
      </v-container>
    </v-card>
  </v-row>
</template>

<script>
import db from "@/fb.js";

export default {
  data() {
    return {
      Course: {},
    };
  },

  props: ["id"],

  created() {
    if (db.auth.currentUser) {
      this.isLoggedIn = true;
      this.currentUser = db.auth.currentUser;
    }

    db.db
      .collection("Users")
      .doc(this.currentUser.uid)
      .collection("Courses")
      .doc(this.id)
      .get()
      .then((doc) => {
        this.Course = doc.data();
      });
  },
};
</script>
