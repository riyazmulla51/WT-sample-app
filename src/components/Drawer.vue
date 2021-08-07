<template>
  <v-content>
    <v-navigation-drawer
      :right="$vuetify.rtl"
      class="appDrawer"
      :dark="$vuetify.dark"
      app
      v-model="drawer"
      hide-overlay
      width="300"
    >
      <v-flex class="body-2 font-weight-bold mt-10">
        <v-row justify="center" align="center">
          <v-btn text @click="dialog = true" color="primary">
            LOGOUT
          </v-btn>
        </v-row>
      </v-flex>
    </v-navigation-drawer>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline" style="color:#5E35B1">
          Are You Sure?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="logout">
            Yes
          </v-btn>
          <v-btn color="primary" text @click="dialog = false">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>
<script>
import event from "@/plugins/event";

export default {
  name: "drawer",
  props: {
    expanded: {
      default: true,
      type: Boolean,
    },
  },
  created() {
    event.$on("APP_DRAWER_TOGGLED", () => {
      this.drawer = !this.drawer;
    });
  },
  data() {
    return {
      drawer: true,
      right: null,
      dialog: false,
    };
  },
  methods: {
    logout() {
      this.$router.push("/login");
      this.dialog = false;
    },
  },
};
</script>
