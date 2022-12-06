<template>
  <div class="register">
    <v-row justify="center" class="my-3 py-3">
      <v-card max-height="550" max-width="450" color="white lighten-4">
        <v-card-title>
          <span class="headline">Register</span>
        </v-card-title>
        <!-- register form -->
        <v-container>
          <v-row wrap>
            <v-col cols="12">
              <v-text-field
                label="First name*"
                v-model="firstname"
                prepend-icon="fa-at"
                :rules="name_rules"
                density="compact"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Last name*"
                v-model="lastname"
                prepend-icon="fa-at"
                :rules="name_rules"
                density="compact"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Email*"
                v-model="email"
                prepend-icon="fa-at"
                :rules="email_rules"
                density="compact"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                density="compact"
                counter
                @click:append="show1 = !show1"
                prepend-icon="fa-key"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="teal-accent-4" @click="submit">
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import auth from "@/fb.js";
import db from "@/fb.js";

export default {
  data() {
    return {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      reveal: false,
      show1: false,
      rules: {
        required: (value) => !!value || "Password is Required.",
        min: (v) => v.length >= 6 || "Min 6 characters",
      },
      name_rules: [(v) => !!v || "This field is required"],
      email_rules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    /* creating a user */
    submit() {
      auth.auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((cred) => {
          // Signed in
          return db.db.collection("Users").doc(cred.user.uid).set({
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
          });
        })
        .then(() => {
          this.$router.go({ path: this.$router.path });
        });
    },
  },
};
</script>