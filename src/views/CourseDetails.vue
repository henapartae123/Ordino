<template>
  <v-row justify="center">
    <v-card min-width="800px" class="ma-6">
      <v-card-title>
        {{ Course.name }}
      </v-card-title>

      <v-row>
        <v-col cols="6" class="ma-4">
          <v-card-title>Video</v-card-title>
          <template>
            <LazyYoutube
              ref="youtubeLazyVideo"
              :src="Course.links"
              max-width="720px"
              aspect-ratio="16:9"
              thumbnail-quality="standard"
            />
          </template>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="5" class="ma-4">
          <v-card-title>Notes</v-card-title>

          <div v-for="Note in Notes" :key="Note.id">
            {{ Note.name }}
            {{ Note.content }}
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-row>
</template>

<script>
import db from "@/fb.js";

export default {
  data() {
    return {
      Course: [],
      Notes: [],
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
        console.log(this.Course.length);
      });

    const Coursename = Course.name;
    console.log(Coursename);
    /* db.db
      .collection("Users")
      .doc(this.currentUser.uid)
      .collection("Notes")
      .where("course", "==", "Coursename")
      .onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (change.type === "added") {
            this.Notes.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          } else if (change.type === "modified") {
            for (var i = 0; i < this.Notes.length; i++) {
              console.log(change.doc.id);
              if (this.Notes[i].id === change.doc.id) {
                this.Notes.splice(i, 1, change.doc.data());
              }
            }
          } else if (change.type === "removed") {
            for (var j = 0; j < this.Notes.length; j++) {
              console.log(change.doc.id);
              if (this.Notes[j].id === change.doc.id) {
                this.Notes.splice(j, 1);
              }
            }
          }
        });
        console.log(this.Notes.length);
      }); */
  },
};
</script>
