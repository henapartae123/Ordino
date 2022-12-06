<template>
  <div class="setup">
    <v-row justify="center">
      <v-btn color="green lighten-1" dark @click="edit()" class="ma-6"
        >Edit</v-btn
      >

      <v-dialog v-model="pass_dialog" persistent max-width="400px">
        <template v-slot:activator="{ on }">
          <v-btn color="green lighten-1" dark v-on="on" class="my-6"
            >Change Password</v-btn
          >
        </template>
        <v-card class="mx-auto my-6" max-width="500">
          <v-card-title> Change Password </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="new_"
              :type="show1 ? 'text' : 'password'"
              label="New Password"
            ></v-text-field>
            <v-text-field
              v-model="confirm"
              :type="show1 ? 'text' : 'password'"
              label="Confirm Password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="pass_dialog = false" text>Close</v-btn>
            <v-btn color="green lighten-1" @click="change" text>Change</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="edit_dialog" persistent max-width="600px">
        <v-card>
          <v-form>
            <v-card-title>
              <span class="headline">Edit Note</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row wrap>
                  <v-col cols="5">
                    <v-text-field
                      label="First Name*"
                      v-model="edit_User.firstname"
                      :rules="name_rules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      label="Last Name*"
                      v-model="edit_User.lastname"
                      :rules="name_rules"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8">
                    <v-text-field
                      label="Email"
                      v-model="edit_User.email"
                      required
                      outlined
                    >
                    </v-text-field>
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
    </v-row>
    <v-row justify="center" class="ma-6">
      <v-card min-height="400" min-width="450" color="grey lighten-4">
        <v-card-title>User Details</v-card-title>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>First name</v-list-item-title>
          </v-list-item-content>

          <v-spacer></v-spacer>

          <v-list-item-content>
            <v-list-item-title>{{ Users.firstname }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Last name</v-list-item-title>
          </v-list-item-content>

          <v-spacer></v-spacer>

          <v-list-item-content>
            <v-list-item-title>{{ Users.lastname }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Email</v-list-item-title>
          </v-list-item-content>

          <v-spacer></v-spacer>

          <v-list-item-content>
            <v-list-item-title>{{ Users.email }}</v-list-item-title>
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
      pass_dialog: false,
      edit_dialog: false,
      show1: false,
      edit_User: {
        firstname: "",
        lastname: "",
        email: "",
      },
      old: "",
      new_: "",
      confirm: "",
      name_rules: [(v) => !!v || "This field is required"],

      Users: [],
    };
  },

  methods: {
    /* password change */
    change() {
      if (this.new_ == this.confirm) {
        var user = db.auth.currentUser;
        var newPassword = this.new_;

        user
          .updatePassword(newPassword)
          .then(function () {
            // Update successful.
            alert("success");
          })
          .catch((error) => {
            // An error happened.
            alert(error);
          });
      } else if (this.new_ != this.confirm) {
        alert("wrong");
      }
    },
    /* edit */
    edit() {
      this.edit_dialog = true;
      this.edit_User.firstname = this.Users.firstname;
      this.edit_User.lastname = this.Users.lastname;
      this.edit_User.email = this.Users.email;
      console.log(this.currentUser.uid);
    },

    edit_submit() {
      var sfDocRef = db.db.collection("Users").doc(this.currentUser.uid);
      return db.db
        .runTransaction((transaction) => {
          // This code may get re-run multiple times if there are conflicts.
          return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
              throw "Document does not exist!";
            }

            transaction.update(sfDocRef, this.edit_User);
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
      .get()
      .then((doc) => {
        this.Users = doc.data();
        console.log(this.Users.firstname);
      });
  },
};
</script>
