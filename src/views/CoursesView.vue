<template>
  <div class="home">
    <!-- Course Adding dialog -->
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
                      v-model="name"
                      :rules="name_rules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-row wrap>
                      <span
                        class="
                          pl-2
                          grey--text
                          text--darken-2
                          font-weight-light
                          text-caption
                        "
                        >priority</span
                      >
                      <v-rating
                        v-model="priority"
                        color="green darken-3"
                        background-color="grey darken-1"
                        empty-icon="$ratingFull"
                        half-increments
                        hover
                        large
                      >
                      </v-rating>
                    </v-row>
                  </v-col>

                  <v-col cols="4">
                    <!-- <div
                      v-for="(input, index) in links"
                      :key="`phoneInput-${index}`"
                    > -->
                    <v-text-field label="Video Link" v-model="links" outlined>
                    </v-text-field>
                    <!-- <v-btn @click="addField(input, links)" text
                        ><v-icon color="blue" small> mdi-plus </v-icon></v-btn
                      ><v-btn
                        v-show="links.length > 1"
                        @click="removeField(index, links)"
                        text
                        >remove</v-btn
                      > -->
                    <!-- </div> -->
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
    <!-- Courses Table -->
    <template>
      <v-row justify="center">
        <v-card color="grey lighten-4">
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
          <v-data-table :headers="headers" :items="Courses" :search="search">
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
    <!-- Course Edit dialog -->
    <v-dialog v-model="edit_dialog" persistent max-width="600px">
      <v-card>
        <v-form>
          <v-card-title>
            <span class="headline">Edit Course</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row wrap>
                <v-col cols="6">
                  <v-text-field
                    label="Name*"
                    v-model="edit_Course.name"
                    :rules="name_rules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-row wrap>
                    priority
                    <span class="ml-2"> {{ priority }}</span>
                    <v-spacer></v-spacer>
                    <v-rating
                      v-model="edit_Course.priority"
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
                  <v-menu
                    ref="edit_menu"
                    v-model="edit_Course.menu"
                    :close-on-content-click="false"
                    :return-value.sync="edit_Course.start"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="edit_Course.start"
                        label="Start date"
                        :rules="name_rules"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="edit_Course.start"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="edit_menu = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.edit_menu.save(edit_Course.start)"
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
                    :return-value.sync="edit_Course.end"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="edit_Course.end"
                        label="End date"
                        :rules="name_rules"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="edit_Course.end"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="edit_menu2 = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.edit_menu2.save(edit_Course.end)"
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

      name: "",
      priority: 4,
      links: "",
      start: "",
      menu: false,
      end: "",
      menu2: false,

      edit_name: "",
      edit_startdate: "",
      edit_menu: false,
      edit_enddate: "",
      edit_menu2: false,

      edit_Course: {
        name: "",
        date: "",
        date: "",
      },

      currentUser: "",

      name_rules: [(v) => !!v || "This field is required"],

      search: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Start Date", value: "start" },
        { text: "End Date", value: "end" },
        { text: "Priority", value: "priority" },
        { text: "Actions", value: "id" },
      ],
      Courses: [],
    };
  },

  props: ["id"],
  methods: {
    /* edit */
    edit(item) {
      this.edit_dialog = true;
      this.edit_Course.name = item.name;
      this.edit_Course.start = item.start;
      this.edit_Course.end = item.end;
      this.edit_Course.id = item.id;
      console.log(item.id);
    },

    edit_submit() {
      var sfDocRef = db.db
        .collection("Users")
        .doc(this.currentUser.uid)
        .collection("Courses")
        .doc(this.edit_Course.id);
      return db.db
        .runTransaction((transaction) => {
          // This code may get re-run multiple times if there are conflicts.
          return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
              throw "Document does not exist!";
            }

            transaction.update(sfDocRef, this.edit_Course);
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
    delete_(course) {
      confirm("Are You sure?") &&
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

    /* create */
    submit() {
      const course = {
        name: this.name,
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
  /* read */
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
            this.Courses.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          } else if (change.type === "modified") {
            console.log(this.Courses.length);

            for (var i = 0; i < this.Courses.length; i++) {
              console.log(change.doc.id);
              if (this.Courses[i].id === change.doc.id) {
                this.Courses.splice(i, 1, change.doc.data());
              }
            }
          } else if (change.type === "removed") {
            for (var j = 0; j < this.Courses.length; j++) {
              console.log(change.doc.id);
              if (this.Courses[j].id === change.doc.id) {
                this.Courses.splice(j, 1);
              }
            }
          }
        });
      });
  },
};
</script>
