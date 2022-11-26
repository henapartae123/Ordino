<template>
  <div class="setup">
    <v-row justify="center">
      <v-card>
        <v-card-title> User Details </v-card-title>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>First name</v-list-item-title>
          </v-list-item-content>

          <v-spacer></v-spacer>

          <v-list-item-content>
            <v-list-item-title>{{ user.firstname }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import db from "@/fb.js";

export default {
  data() {
    return {
      Users: [],
    };
  },

  created() {
    if (db.auth.currentUser) {
      this.isLoggedIn = true;
      this.currentUser = db.auth.currentUser;
    }

    db.db
      .collection("Users")
      .doc(this.currentUser.uid)
      .onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (change.type === "added") {
            this.Users.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          } else if (change.type === "removed") {
            for (var i = 0; i < this.Users.length; i++) {
              window.console.log(change.doc.id);
              if (this.Users[i].id === change.doc.id) {
                this.Users.splice(i, 1);
              }
            }
          }
        });
      });
  },
};
</script>
