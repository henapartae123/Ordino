<template>
  <div class="home">
    <!-- Note adding dialog -->
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
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Name*"
                      v-model="name"
                      :rules="name_rules"
                      required
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
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
    <!-- note edit dialog -->
    <v-dialog v-model="edit_dialog" persistent max-width="800px">
      <v-card>
        <v-form>
          <v-card-title>
            <span class="headline">Edit Note</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Name*"
                    v-model="edit_Note.name"
                    :rules="name_rules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-select
                    v-model="edit_Note.course"
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
                    v-model="edit_Note.content"
                    required
                    outlined
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="edit_dialog = false"
              >Close</v-btn
            >
            <v-btn color="blue darken-1" text @click="edit_submit"
              >Update</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- notes view table -->
    <template>
      <v-row justify="center">
        <v-card color="grey lighten-4">
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
          <v-data-table :headers="headers" :items="Notes" :search="search">
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
      edit_dialog: false,

      name: "",
      course: "",
      content: "",

      edit_Note: {
        name: "",
        course: "",
        content: "",
      },

      search: "",
      headers: [
        { text: "Title", value: "name" },
        { text: "Course", value: "course" },
        { text: "Content", value: "content", height: "", width: "400px" },
        { text: "Actions", value: "id" },
      ],
      name_rules: [(v) => !!v || "This field is required"],
      Notes: [],
      Course: [],
      courses: [],
    };
  },
  props: ["id"],

  setup() {},

  methods: {
    /* edit */
    edit(item) {
      this.edit_dialog = true;
      this.edit_Note.name = item.name;
      this.edit_Note.content = item.content;
      this.edit_Note.course = item.course;
      this.edit_Note.id = item.id;
      console.log(item.id);
    },

    edit_submit() {
      var sfDocRef = db.db
        .collection("Users")
        .doc(this.currentUser.uid)
        .collection("Notes")
        .doc(this.edit_Note.id);
      return db.db
        .runTransaction((transaction) => {
          // This code may get re-run multiple times if there are conflicts.
          return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
              throw "Document does not exist!";
            }

            transaction.update(sfDocRef, this.edit_Note);
          });
        })
        .then(() => {
          console.log("Transaction successfully committed!");
          this.edit_dialog = false;
        })
        .catch((error) => {
          console.log("Transaction failed: ", error);
        });
    },
    /* delete */
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
    /* create */
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
  /* read */
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
            this.Notes.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          } else if (change.type === "modified") {
            console.log(this.Notes.length);

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
            this.courses.push(change.doc.data().name);
          }
        });
      });
  },
};
</script>
