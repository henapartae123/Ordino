<template>
  <div class="home">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800px">
        <template v-slot:activator="{ on }">
          <v-btn color="green lighten-1" dark v-on="on" class="my-6"
            >Add Course</v-btn
          >
        </template>
        <v-card>
          <v-form>
            <v-card-title>
              <span class="headline">Course</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row wrap>
                  <v-col cols="4">
                    <v-text-field
                      label="Name*"
                      v-model="title"
                      :rules="name_rules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-row>
                      priority
                      <span class="ml-2"> {{ priority }}</span>
                      <v-spacer></v-spacer>
                      <v-rating
                        v-model="priority"
                        color="green darken-3"
                        background-color="grey darken-1"
                        empty-icon="$ratingFull"
                        half-increments
                        hover
                        small
                      >
                      </v-rating>
                    </v-row>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field label="links" v-model="links"> </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="start"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="start"
                          label="Start date"
                          :rules="name_rules"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="start" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(start)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4">
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :return-value.sync="end"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="end"
                          label="End date"
                          :rules="name_rules"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="end" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu2 = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu2.save(end)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
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
        <v-card>
          <v-card-title>
            ADDED Courses
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="Course" :search="search">
            <template v-slot:item.id="{ item }">
              <!--<v-chip :color="getColor(item.calories)" dark>{{ item.calories }}</v-chip>-->

              <v-btn small text depressed router :to="`/course/${item.id}`">
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

    <v-dialog v-model="edit_dialog" persistent max-width="600px">
      <v-card>
        <v-form>
          <v-card-title>
            <span class="headline">Edit Course</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row wrap>
                <v-col cols="12">
                  <v-text-field
                    label="Name*"
                    v-model="edit_title"
                    prepend-icon="fa-pen"
                    :rules="name_rules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-menu
                    ref="edit_menu"
                    v-model="edit_menu"
                    :close-on-content-click="false"
                    :return-value.sync="edit_startdate"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="edit_startdate"
                        label="Start date"
                        :rules="name_rules"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="edit_startdate" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="edit_menu = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.edit_menu.save(edit_startdate)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="4">
                  <v-menu
                    ref="edit_menu2"
                    v-model="edit_menu2"
                    :close-on-content-click="false"
                    :return-value.sync="edit_enddate"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="edit_enddate"
                        label="End date"
                        :rules="name_rules"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="edit_enddate" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="edit_menu2 = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.edit_menu2.save(edit_enddate)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
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
  </div>
</template>

<script>
import db from "@/fb.js";

export default {
  data() {
    return {
      dialog: false,
      edit_dialog: false,

      title: "",
      priority: 4,
      links: "",
      start: "",
      menu: false,
      end: "",
      menu2: false,

      edit_title: "",
      edit_startdate: "",
      edit_menu: false,
      edit_enddate: "",
      edit_menu2: false,

      edit_course: {
        title: "",
        startdate: "",
        enddate: "",
      },

      currentUser: "",

      name_rules: [(v) => !!v || "This field is required"],

      search: "",
      headers: [
        { text: "Title", value: "title" },
        { text: "Start Date", value: "startdate" },
        { text: "End Date", value: "enddate" },
        { text: "Priority", value: "priority" },
        { text: "Actions", value: "id" },
      ],
      Course: [],
    };
  },

  props: ["id"],
  methods: {
    async edit_submit() {
      var sfDocRef = db.db
        .collection("Users")
        .doc(this.id)
        .collection("Courses")
        .doc(this.edit_course.id);
      return db.db
        .runTransaction((transaction) => {
          // This code may get re-run multiple times if there are conflicts.
          return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
              throw "Document does not exist!";
            }

            transaction.update(sfDocRef, this.edit_course);
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

    edit(item) {
      this.edit_course.title = item.title;
      this.edit_course.startdate = item.startdate;
      this.edit_course.enddate = item.enddate;
      console.log(item.id);
      this.edit_dialog = true;
    },

    delete_(course) {
      db.db
        .collection("Users")
        .doc(this.currentUser.uid)
        .collection("Courses")
        .doc(course.id)
        .delete()
        .then(() => {
          console.log("success");
        });
    },
    submit() {
      const course = {
        title: this.title,
        priority: this.priority,
        links: this.links,
        start: this.start,
        end: this.end,
      };
      db.db
        .collection("Users")
        .doc(this.currentUser.uid)
        .collection("Courses")
        .add(course)
        .then(() => {
          this.dialog = false;
          (this.title = ""),
            (this.start = ""),
            (this.end = ""),
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
      .collection("Courses")
      .onSnapshot((res) => {
        const changes = res.docChanges();

        changes.forEach((change) => {
          if (change.type === "added") {
            this.Course.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          } else if (change.type === "modified") {
            console.log(this.Course.length);

            for (var i = 0; i < this.Course.length; i++) {
              console.log(change.doc.id);
              if (this.Course[i].id === change.doc.id) {
                this.Course.splice(i, 1, change.doc.data());
              }
            }
          } else if (change.type === "removed") {
            for (var j = 0; j < this.Course.length; j++) {
              console.log(change.doc.id);
              if (this.Course[j].id === change.doc.id) {
                this.Course.splice(j, 1);
              }
            }
          }
        });
      });
  },
};
</script>
