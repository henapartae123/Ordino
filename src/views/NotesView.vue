<template>
  <div class="home">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800px">
        <template v-slot:activator="{ on }">
          <v-btn color="green lighten-1" dark v-on="on" class="my-6"
            >Add Note</v-btn
          >
        </template>
        <v-card>
          <v-form>
            <v-card-title>
              <span class="headline">Note Details</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row wrap>
                  <v-col cols="4">
                    <v-text-field
                      label="Name*"
                      v-model="name"
                      :rules="name_rules"
                      required
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="course"
                      :items="courses"
                      label="Course"
                      outlined
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8">
                    <v-textarea
                      label="Details*"
                      v-model="content"
                      required
                      outlined
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="4"> </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false"
                >Close</v-btn
              >
              <v-btn color="blue darken-1" text @click="submit">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>

    <template>
      <v-row justify="center">
        <v-card max-width="">
          <v-card-title>
            ADDED Notes
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="Note" :search="search">
            <template v-slot:item.id="{ item }">
              <!--<v-chip :color="getColor(item.calories)" dark>{{ item.calories }}</v-chip>-->

              <v-btn small text depressed router :to="`/note/${item.id}`">
                <v-icon color="blue" small> mdi-eye </v-icon>
              </v-btn>

              <v-icon color="green" @click="edit(item)" small>
                mdi-pencil
              </v-icon>

              <v-icon color="red" @click="delete_(item)" small>
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-row>
    </template>
  </div>
</template>
<script>
import db from "@/fb.js";

export default {
  data() {
    return {
      dialog: false,

      name: "",
      course: "",
      content: "",

      search: "",
      headers: [
        { text: "Title", value: "name" },
        { text: "Course", value: "course" },
        { text: "Content", value: "content", height: "", width: "400px" },
        { text: "Actions", value: "id" },
      ],
      name_rules: [(v) => !!v || "This field is required"],
      Note: [],
      Course: [],
      courses: [],
    };
  },
  props: ["id"],

  setup() {},

  methods: {
    delete_(note) {
      db.db
        .collection("Users")
        .doc(this.currentUser.uid)
        .collection("Notes")
        .doc(note.id)
        .delete()
        .then(() => {
          console.log("success");
        });
    },
    submit() {
      const note = {
        name: this.name,
        course: this.course,
        content: this.content,
      };
      db.db
        .collection("Users")
        .doc(this.currentUser.uid)
        .collection("Notes")
        .add(note)
        .then(() => {
          this.dialog = false;
          console.log("Done");
        });
    },
  },

  created() {
    if (db.auth.currentUser) {
      this.isLoggedIn = true;
      this.currentUser = db.auth.currentUser;
    }

    db.db
      .collection("Users")
      .doc(this.currentUser.uid)
      .collection("Notes")
      .onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (change.type === "added") {
            this.Note.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          } else if (change.type === "modified") {
            console.log(this.Note.length);

            for (var i = 0; i < this.Note.length; i++) {
              console.log(change.doc.id);
              if (this.Note[i].id === change.doc.id) {
                this.Note.splice(i, 1, change.doc.data());
              }
            }
          } else if (change.type === "removed") {
            for (var j = 0; j < this.Note.length; j++) {
              console.log(change.doc.id);
              if (this.Note[j].id === change.doc.id) {
                this.Note.splice(j, 1);
              }
            }
          }
        });
        console.log(this.Note.length);
      });

    db.db
      .collection("Users")
      .doc(this.currentUser.uid)
      .collection("Courses")
      .onSnapshot((res) => {
        const changes = res.docChanges();

        changes.forEach((change) => {
          if (change.type === "added") {
            this.Course.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
            this.courses.push(change.doc.data().title);
          }
        });
      });
  },
};
</script>
