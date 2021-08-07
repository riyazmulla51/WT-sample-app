<template>
  <div id="app">
    <v-app
      ><v-flex fluid class="fill-height pa-0">
        <!-- logged in header part -->
        <div v-if="$route.name != 'Login'" class="header-app-bar">
          <Drawer />
          <Header :headerConfig="headerConfig" />
          <!-- Sizes your content based upon application components -->
          <v-main style="padding-top:0px">
            <!-- Provides the application the proper gutter -->
            <v-flex class="container">
              <router-view></router-view>
            </v-flex>
          </v-main>
        </div>
        <v-main v-else class="fill-height">
          <v-container fluid class="pa-0 fill-height align-start">
            <router-view />
          </v-container>
        </v-main>
      </v-flex>
    </v-app>
  </div>
</template>

<script>
import Drawer from "@/components/Drawer";
import Header from "@/components/Header";
export default {
  name: "app",
  components: {
    Drawer,
    Header,
  },
  data() {
    return {
      headerConfig: {
        showDrawerButton: true,
      },
    };
  },
};
</script>
