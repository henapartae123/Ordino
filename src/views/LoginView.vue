<template>
  <div class="login">
    <v-row justify="center" class="my-6 py-6">
      <v-card min-height="400" max-width="450" color="white lighten-4">
        <v-card-title>
          <span class="headline">Log In</span>
        </v-card-title>
        <!-- login form -->
        <v-container>
          <v-row wrap>
            <v-col cols="10">
              <v-text-field
                label="Email*"
                v-model="email"
                prepend-icon="fa-at"
                density="compact"
                :rules="email_rules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password*"
                hint="At least 8 characters"
                density="compact"
                counter
                @click:append="show1 = !show1"
                prepend-icon="fa-key"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small><v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text router :to="'/register'"
            >Register</v-btn
          >
          <v-btn color="green darken-1" text @click="login">Log In</v-btn>
        </v-card-actions>

        <small>Test Email: johndoe@gmail.com</small><v-spacer></v-spacer>
        <small>Test Password: 123456789</small>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import auth from "@/fb.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      show1: false,
      rules: {
        required: (value) => !!value || "Password is Required.",
        min: (v) => v.length >= 6 || "Min 6 characters",
      },
      email_rules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    /* logging in */
    login() {
      auth.auth.signInWithEmailAndPassword(this.email, this.password).then(
        () => {
          this.$router.go({ path: this.$router.path });
        },
        (err) => {
          alert(err.message);
        }
      );
    },
  },
};
</script>
