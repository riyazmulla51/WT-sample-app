<template>
  <v-container>
    <!-- Select/Search Customer Section -->
    <v-card color="#EEEEEE" elevation="1">
      <v-card-title class="fontStyles"> Search Customer</v-card-title>
      <v-card-text>
        <v-row>
          <v-select
            :items="usersKeys"
            class="px-2"
            label="Select Option"
            v-model="selectedOption"
            @change="changeEntries"
          >
            <template v-slot:item="{ item, attrs, on }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-title
                  class="text-capitalize"
                  :id="attrs['aria-labelledby']"
                  v-text="item"
                ></v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
          <v-autocomplete
            v-model="model"
            class="px-2"
            :items="items"
            :loading="isLoading"
            :search-input.sync="searchKeyword"
            hide-no-data
            hide-selected
            item-text="description"
            item-value="API"
            label="Search for Value"
            placeholder="Start typing to Search"
            return-object
          ></v-autocomplete>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-list v-if="model" color="#EEEEEE" elevation="1">
          <v-flex v-for="(field, i) in fields" :key="i">
            <v-list-item>
              <v-list-item-content class="pointer">
                <v-list-item-title>
                  {{ field.user.name }}
                  <v-btn
                    small
                    class="px-2 mx-2 float-right"
                    color="primary"
                    @click="getOrgDetails(field.user.organization_id)"
                  >
                    Organization Details
                  </v-btn>
                  <v-btn
                    small
                    class="px-2 mx-2 float-right"
                    color="primary"
                    @click="getTicketDetails(field.user.organization_id)"
                  >
                    Ticket Details
                  </v-btn>
                  <v-btn
                    :disabled="isAlreadyInList(field.user)"
                    small
                    class="px-2 mx-2 float-right"
                    color="primary"
                    @click="addToList(field.user)"
                  >
                    Add To List</v-btn
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i < fields.length - 1"></v-divider>
          </v-flex>
        </v-list>
      </v-expand-transition>
    </v-card>
    <br />
    <!-- Add/Update Customer Section -->
    <div class="text-center">
      <v-dialog
        persistent
        v-model="isAddUpdateCard"
        hide-default-footer
        width="800"
      >
        <v-card v-if="isAddUpdateCard" color="#EEEEEE" elevation="1">
          <v-card-title class="fontStyles">
            {{ updateBtn ? "Update Customer Details" : "Add New Customer" }}
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="
                isAddUpdateCard = false;
                data = {};
              "
            >
              <v-icon>mdi-close-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-flex class="px-4 pt-4" xs12 sm12 md12 lg12 xl12>
              <v-form ref="addCustomerForm">
                <v-layout row wrap>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.name"
                      color="#5E35B1"
                      :rules="rules"
                      :error="checkUsernameValidation().error"
                      :error-messages="checkUsernameValidation().message"
                      maxlength="40"
                      minlength="05"
                      label="Name"
                      placeholder="Name"
                      outlined
                      counter
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.email"
                      color="#5E35B1"
                      :rules="rules"
                      :error="checkEmailValidation().error || emailError"
                      :error-messages="
                        checkEmailValidation().message || emailErrorMsg
                      "
                      maxlength="40"
                      minlength="05"
                      :disabled="updateBtn"
                      label="E-mail"
                      outlined
                      counter
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.phone"
                      color="#5E35B1"
                      maxlength="12"
                      minlength="10"
                      label="Phone"
                      outlined
                      counter
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.url"
                      color="#5E35B1"
                      label="URL"
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.alias"
                      color="#5E35B1"
                      label="Alias"
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.locale"
                      color="#5E35B1"
                      label="Locale"
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.timezone"
                      color="#5E35B1"
                      label="Timezone"
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.signature"
                      color="#5E35B1"
                      label="Signature"
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6 lg6 xl6 class="pa-2">
                    <v-text-field
                      v-model="data.role"
                      color="#5E35B1"
                      label="Role"
                      outlined
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
            <v-row justify="center" no-gutters>
              <v-btn
                class="primary text-none"
                :disabled="checkSubmitBtnDisable()"
                color="success"
                @click="updateBtn ? onUpdate() : onSubmit()"
              >
                {{ updateBtn ? "Update" : "Submit" }}
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <!-- Customers List Section -->
    <v-card color="#EEEEEE" elevation="1">
      <v-card-title class="fontStyles"> Available Customers </v-card-title>
      <v-flex lg12>
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              color="#5E35B1"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="storeData" :search="search">
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                color="blue"
                @click="
                  isAddUpdateCard = !isAddUpdateCard;
                  updateBtn = false;
                "
              >
                mdi-plus
              </v-icon>
              <v-icon
                small
                class="mr-2"
                color="green"
                @click="editUserDetails(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                color="#D50000"
                @click="
                  isDelete = true;
                  itemToDelete = item;
                "
              >
                mdi-delete
              </v-icon>
            </template></v-data-table
          >
        </v-card>
      </v-flex>
    </v-card>
    <!-- Ticket/Organization Details Section -->
    <div class="text-center">
      <!-- Ticket Details Modal -->
      <v-dialog
        v-model="showTicketDetails"
        hide-default-footer
        :width="isTicketDetails ? '' : '350'"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Ticket Details
            <v-spacer />
            <v-btn color="primary" text @click="showTicketDetails = false">
              <v-icon>mdi-close-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              v-if="isTicketDetails"
              :headers="ticktTableHeaders"
              :items="[selectedTicket]"
              hide-default-footer
              class="elevation-1"
            ></v-data-table>
            <v-flex class="pt-2" v-else>
              Ticket Details are not available
            </v-flex>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Organization Details Modal -->
      <v-dialog
        v-model="showOrgDetails"
        hide-default-footer
        :width="isOrgDetails ? '' : '350'"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Organization Details
            <v-spacer />
            <v-btn color="primary" text @click="showOrgDetails = false">
              <v-icon>mdi-close-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              v-if="isOrgDetails"
              :headers="orgTableHeaders"
              :items="[selectedOrganization]"
              hide-default-footer
              class="elevation-1"
            ></v-data-table>
            <v-flex class="pt-2" v-else>
              Organization Details are not available
            </v-flex>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Delete Confirm Modal -->
      <v-dialog v-model="isDelete" persistent max-width="290">
        <v-card>
          <v-card-title class="headline" style="color: #5e35b1">
            Are You Sure?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="deleteUserDetails(itemToDelete)"
            >
              Yes
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="
                isDelete = false;
                itemToDelete = null;
              "
            >
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import store from "@/store";
import usersDetails from "@/mock/users.json";
import tickets from "@/mock/tickets.json";
import organizations from "@/mock/organizations.json";

export default {
  data() {
    return {
      valid: false,
      updateBtn: false,
      isAddUpdateCard: false,
      data: {
        name: "",
        email: "",
        phone: "",
      },
      storeData: [],
      rules: [(v) => Boolean(v) || "Required"],
      search: "",
      editedIndex: "",
      emailError: false,
      emailErrorMsg: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      usersKeys: [],
      usersDetails,
      tickets,
      organizations,
      isLoading: false,
      searchValue: null,
      selectedOption: null,
      model: null,
      entries: [],
      selectedEntries: [],
      searchKeyword: null,
      descriptionLimit: 60,
      showTicketDetails: false,
      selectedTicket: {},
      showOrgDetails: false,
      selectedOrganization: {},
      ticketsData: [],
      orgData: [],
      ticktTableHeaders: [
        {
          text: "ID",
          value: "_id",

          align: "start",
          sortable: false,
        },
        { text: "URL", value: "url", align: "start", sortable: false },
        {
          text: "External ID",
          value: "external_id",
          align: "start",
          sortable: false,
        },
        {
          text: "Created At",
          value: "created_at",
          align: "start",
          sortable: false,
        },
        { text: "Type", value: "type", align: "start", sortable: false },
        { text: "Subject", value: "subject", align: "start", sortable: false },
        {
          text: "Description",
          value: "description",
          align: "start",
          sortable: false,
        },
        {
          text: "Priority",
          value: "priority",
          align: "start",
          sortable: false,
        },
        { text: "Status", value: "status", align: "start", sortable: false },
        {
          text: "Submitter ID",
          value: "submitter_id",
          align: "start",
          sortable: false,
        },
        { text: "Tags", value: "tags", align: "start", sortable: false },
        {
          text: "Has_incidents",
          value: "has_incidents",
          align: "start",
          sortable: false,
        },
        { text: "Due At", value: "due_at", align: "start", sortable: false },
        { text: "Via", value: "via", align: "start", sortable: false },
      ],
      orgTableHeaders: [
        {
          text: "ID",
          value: "_id",

          align: "start",
          sortable: false,
        },
        { text: "URL", value: "url", align: "start", sortable: false },
        {
          text: "External ID",
          value: "external_id",
          align: "start",
          sortable: false,
        },
        { text: "Name", value: "name", align: "start", sortable: false },
        {
          text: "Domain Names",
          value: "domain_names",
          align: "start",
          sortable: false,
        },
        {
          text: "Created At",
          value: "created_at",
          align: "start",
          sortable: false,
        },
        { text: "Details", value: "details", align: "start", sortable: false },
        {
          text: "Shared Tickets",
          value: "shared_tickets",
          align: "start",
          sortable: false,
        },
        { text: "Tags", value: "tags", align: "start", sortable: false },
      ],
      isDelete: false,
      isTicketDetails: false,
      isOrgDetails: false,
      itemToDelete: {},
    };
  },
  created() {
    this.storeData = store.getters["userStore/userData"].userDetails;
  },
  mounted() {
    let keys = [];
    for (var k in usersDetails[0]) keys.push(k);
    this.usersKeys = keys;
  },
  methods: {
    changeEntries() {
      this.entries = [];
      for (let user of usersDetails) {
        for (const key in user) {
          if (key === this.selectedOption) {
            this.entries.push({
              user: user,
              description: user[key],
            });
          }
        }
      }
    },
    onSubmit() {
      let isCustomerPresent = false;
      for (let i = 0; i < this.storeData.length; i++) {
        if (this.storeData[i].email === this.data.email)
          isCustomerPresent = true;
      }
      if (!isCustomerPresent) {
        this.storeData.push(this.data);
        this.updateStoreDetails();
        this.data = {};
        this.$refs.addCustomerForm.resetValidation();
        this.emailError = false;
        this.emailErrorMsg = "";
        this.isAddUpdateCard = false;
      } else {
        this.emailError = true;
        this.emailErrorMsg = "E-mail ID already exists";
      }
    },
    editUserDetails(item) {
      this.isAddUpdateCard = !this.isAddUpdateCard;
      this.editedIndex = this.storeData.indexOf(item);
      this.data = Object.assign({}, item);
      this.updateBtn = true;
    },
    deleteUserDetails(item) {
      this.storeData = this.storeData.filter(
        (data) => data.email !== item.email
      );
      this.isDelete = false;
      this.updateStoreDetails();
    },
    onUpdate() {
      if (this.editedIndex > -1) {
        Object.assign(this.storeData[this.editedIndex], this.data);
        this.updateStoreDetails();
        this.updateBtn = false;
        this.data = {};
        this.$refs.addCustomerForm.resetValidation();
      } else {
        this.storeData.push(this.data);
        this.updateStoreDetails();
        this.$refs.addCustomerForm.resetValidation();
      }
      this.isAddUpdateCard = false;
    },
    checkSubmitBtnDisable() {
      if (
        this.data.name &&
        this.data.name.length &&
        this.data.email &&
        this.data.email.length &&
        this.data.phone &&
        this.data.phone.length &&
        !this.checkUsernameValidation().error &&
        !this.checkEmailValidation().error
      ) {
        return false;
      }
      return true;
    },
    updateStoreDetails() {
      store.dispatch("userStore/setUserData", {
        userDetails: this.storeData,
      });
    },
    checkUsernameValidation() {
      if (this.data.name && !/[A-Za-z]+$/.test(this.data.name)) {
        return {
          error: true,
          message: "Invalid Input",
        };
      }
      return {
        error: false,
        message: "",
      };
    },
    checkEmailValidation() {
      if (this.data.email && !/.+@.+$/.test(this.data.email)) {
        return {
          error: true,
          message: "Invalid Input",
        };
      }
      return {
        error: false,
        message: "",
      };
    },
    addToList(user) {
      if (user && user._id) {
        this.storeData.push(user);
        this.selectedOption = "";
        this.model = null;
        this.searchKeyword = null;
        this.updateStoreDetails();
      }
    },
    getTicketDetails(id) {
      if (tickets && tickets.length) {
        for (let ticket of tickets) {
          if (ticket.organization_id === id) {
            this.showTicketDetails = true;
            this.showOrgDetails = false;
            this.selectedTicket = ticket;
            this.isTicketDetails = true;
          }
        }
        if (!this.isTicketDetails) {
          this.showTicketDetails = true;
          this.showOrgDetails = false;
        }
      } else {
        this.showTicketDetails = true;
        this.isTicketDetails = false;
      }
    },
    getOrgDetails(id) {
      if (organizations && organizations.length) {
        for (let organization of organizations) {
          if (organization._id === id) {
            this.showOrgDetails = true;
            this.showTicketDetails = false;
            this.isOrgDetails = true;
            this.selectedOrganization = organization;
          }
        }
        if (!this.isOrgDetails) {
          this.showOrgDetails = true;
          this.showTicketDetails = false;
        }
      } else {
        this.showOrgDetails = true;
        this.showTicketDetails = false;
        this.isOrgDetails = false;
      }
    },
    isAlreadyInList(user) {
      if (user && user._id) {
        for (let item of this.storeData) {
          if (item._id === user._id) return true;
        }
        return false;
      }
      return false;
    },
  },
  computed: {
    fields() {
      const self = this;
      let res = [];
      if (!this.model) return [];
      for (let item of self.entries) {
        if (item.user[self.selectedOption] == self.searchKeyword) {
          res.push(item);
        }
      }
      return res;
    },
    items() {
      return this.entries.map((entry) => {
        const description =
          entry.description.length > this.descriptionLimit
            ? entry.description.slice(0, this.descriptionLimit) + "..."
            : entry.description;
        return Object.assign({}, entry, { description });
      });
    },
  },

  watch: {
    searchKeyword() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.float-right {
  float: right;
}
label[for="required"]::after {
  color: red;
  content: "*";
}
.fontStyles {
  color: #5e35b1;
}
</style>
