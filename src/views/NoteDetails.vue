<template>
  <v-row justify="center">
    <v-card class="ma-6">
      <v-card-title>
        {{ Note.name }}
      </v-card-title>

      <p class="ma-3">{{ Note.content }}</p>
    </v-card>
  </v-row>
</template>

<script>
import db from "@/fb.js";

export default {
  data() {
    return {
      Note: {},
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
      .collection("Notes")
      .doc(this.id)
      .get()
      .then((doc) => {
        this.Note = doc.data();
      });
  },
};
</script>
