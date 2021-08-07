<template>
  <v-flex>
    <v-app-bar app class="mx-auto overflow-hidden">
      <v-icon v-if="showDrawerButton" @click="toggleDrawer()" color="primary"
        >mdi-menu</v-icon
      >
    </v-app-bar>
  </v-flex>
</template>
<script>
import event from "@/plugins/event";

export default {
  name: "Header",
  props: {
    headerConfig: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      showDrawerButton: this.headerConfig.showDrawerButton || false,
    };
  },
  methods: {
    toggleDrawer() {
      event.$emit("APP_DRAWER_TOGGLED", true);
    },
    logout() {
      this.$router.push("/login");
    },
  },
};
</script>
