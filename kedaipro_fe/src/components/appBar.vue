<template>
  <div>
    <v-app-bar
      :key="store.appbar"
      density="compact"
      v-if="router.currentRoute.value.path != '/admin'"
    >
      <template #prepend>
        <v-btn
          size="small"
          @click="drawer = !drawer"
          flat
          icon
          color="brown-lighten-1"
        >
          <v-icon size="large" v-if="!drawer">mdi-menu-close</v-icon>
          <v-icon size="large" v-else>mdi-menu-open</v-icon>
        </v-btn>
      </template>
      <template #title>
        <div class="text-uppercase">
          {{ menu.label }}
        </div>
      </template>
      <template #append>
        <v-btn
          size="small"
          @click="
            () => {
              drawer2 = !drawer2;
              drawer = false;
            }
          "
          flat
          icon
          color="brown-lighten-1"
        >
          <v-icon size="large">mdi-cog</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      width="300"
      temporary=""
      v-model="drawer"
      location="left"
    >
      <template #prepend>
        <v-card elevation="0" rounded="0">
          <template #title>
            <div class="text-uppercase">{{ store.userData.userName }}</div>
          </template>
          <template #subtitle>{{ store.userData.roleName }}</template>
          <template #prepend>
            <v-img width="45" src="../assets/logo.png"></v-img>
          </template>
        </v-card>
        <v-divider class="my-2"></v-divider>
      </template>
      <template #default>
        <v-list>
          <v-list-item
            :active="router.currentRoute.value.path == menu.path"
            rounded="0"
            @click="goTo(menu)"
            v-for="(menu, index) in store.menus"
            :key="index"
            v-show="store.userData.hakAkses.includes(menu.path)"
          >
            <template #title>{{ menu.label }}</template>
            <template #subtitle>{{ menu.subtitle }}</template>
            <template #prepend>
              <v-icon>
                {{ menu.icon }}
              </v-icon>
            </template>
            <v-divider></v-divider>
          </v-list-item>
        </v-list>
      </template>

      <template #append>
        <div class="pa-2 w-100">
          <v-btn
            color="error"
            prepend-icon="mdi-logout"
            size="45"
            block=""
            variant="outlined"
            rounded="lg"
            @click="logoutDialog = true"
          >
            Log Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-navigation-drawer
      width="300"
      temporary=""
      v-model="drawer2"
      location="right"
    >
      <template #default>
        <v-list>
          <v-list-item
            :active="router.currentRoute.value.path == menu.path"
            rounded="0"
            @click="openDialog(menu)"
            v-for="(menu, index) in setups"
            :key="index"
          >
            <template #title>{{ menu.label }}</template>
            <template #subtitle>{{ menu.subtitle }}</template>
            <template #prepend>
              <v-icon>
                {{ menu.icon }}
              </v-icon>
            </template>
            <v-divider></v-divider>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-dialog
      v-model="setupDialog"
      scrollable
      fullscreen
      persistent
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card>
        <template #title>
          <div class="text-uppercase">
            {{ setup.label }}
          </div>
          <v-divider></v-divider>
        </template>

        <template #prepend>
          <v-icon>{{ setup.icon }}</v-icon>
        </template>
        <template #append>
          <v-btn flat icon @click="setupDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #text>
          <setProfil
            :close-me="
              () => {
                setupDialog = false;
              }
            "
            v-if="setup.path == 'profil'"
          />
          <roleControl
            :close-me="
              () => {
                setupDialog = false;
              }
            "
            v-if="setup.path == 'role'"
          />
          <accountControl
            :close-me="
              () => {
                setupDialog = false;
              }
            "
            v-if="setup.path == 'akun'"
          />
        </template>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="logoutDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="400"
      transition="dialog-transition"
    >
      <v-card class="text-center">
        <template #prepend>
          <v-icon color="warning" size="50">mdi-help</v-icon>
        </template>
        <template #title> Anda akan keluar dari aplikasi</template>
        <template #subtitle> apakah anda yakin?</template>
        <template #text>
          <v-btn-group
            density="compact"
            class="w-100"
            variant="outlined"
            rounded="lg"
          >
            <v-btn class="w-50" @click="logoutDialog = false">Batal</v-btn>
            <v-btn
              @click="store.logout"
              class="w-50"
              color="error"
              prepend-icon="mdi-logout"
              >Keluar</v-btn
            >
          </v-btn-group>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";
const store = useAppStore();
const drawer = ref(false);
const drawer2 = ref(false);
const setupDialog = ref(false);
const logoutDialog = ref(false);
const menu = ref({
  label: "Dashboard",
  icon: "mdi-view-dashboard",
  subtitle: "Halaman utama aplikasi",
  path: "/admin/dashboard",
});

const setup = ref({
  label: "Dashboard",
  icon: "mdi-view-dashboard",
  subtitle: "Halaman utama aplikasi",
  path: "/admin/dashboard",
});

const setups = ref([
  {
    label: "Pengaturan Profil",
    icon: "mdi-domain",
    subtitle: "Pengaturan profil perusahaan",
    path: "profil",
  },
  {
    label: "Pengaturan Role",
    icon: "mdi-shield-account-outline",
    subtitle: "Pengaturan role sistem",
    path: "role",
  },
  {
    label: "Pengaturan Akun",
    icon: "mdi-account-multiple-outline",
    subtitle: "Pengaturan akun karyawan",
    path: "akun",
  },
  {
    label: "Pengaturan Inventrory",
    icon: "mdi-warehouse",
    subtitle: "Pengaturan stok bahan",
    path: "inventory",
  },
  {
    label: "Pengaturan Menu",
    icon: "mdi-food",
    subtitle: "Pengaturan menu kedai",
    path: "inventory",
  },
]);

const goTo = (item) => {
  drawer.value = false;
  drawer2.value = false;
  menu.value = item;
  router.push(item.path);
};

const openDialog = (item) => {
  setupDialog.value = true;
  drawer2.value = false;
  setup.value = item;
};

console.log(store.userData.hakAkses);
</script>
