<template>
  <v-card class="h-100">
    <v-card-text class="h-100">
      <v-row class="h-100">
        <v-col cols="5">
          <v-card class="h-100">
            <template #title>
              Daftar Role
              <v-divider></v-divider>
            </template>
            <template #append>
              <v-btn flat icon @click="openDialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <template #text>
              <v-data-table :items="store.utils.role">
                <template #headers>
                  <tr class="text-uppercase">
                    <th class="text-center">No</th>
                    <th>Nama Role</th>
                    <th>Home Page</th>
                    <th class="text-center">Tindakan</th>
                  </tr>
                </template>
                <template #item="{ item, index }">
                  <tr v-if="item.roleID != 1">
                    <td class="text-center">{{ index }}</td>
                    <td class="text-uppercase">{{ item.roleName }}</td>
                    <td>{{ item.homePage }}</td>
                    <td class="text-center">
                      <v-icon
                        color="primary"
                        class="me-1"
                        @click="openDialog(item)"
                        >mdi-pencil</v-icon
                      >
                      <v-icon
                        v-if="item.roleID != 9"
                        @click="openDialog(item, true)"
                        color="error"
                        class="ms-1"
                        >mdi-delete</v-icon
                      >
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </template>
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card class="h-100">
            <template #title>
              Hak Akses
              <v-divider></v-divider>
            </template>
            <template #text>
              <div class="h-100">
                <hakTable :key="kk"></hakTable>
              </div>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <template v-if="deleteItem" #prepend>
          <v-icon color="warning" size="100">mdi-help</v-icon>
        </template>
        <template v-if="!deleteItem" #append>
          <v-btn flat icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>
          <div v-if="deleteItem" class="text-center text-uppercase">
            {{ dialogTitle }}
          </div>
          <div v-else class="text-start">
            {{ dialogTitle }}
          </div>
        </template>
        <template #subtitle v-if="deleteItem">
          <div class="text-center text-h5">
            {{ selected.roleName }}
          </div>

          <div v-if="deleteItem" class="text-h6 w-100 text-center">
            Apakah anda yakin?
          </div>
        </template>
        <template #text>
          <newRole
            :close-me="
              () => {
                dialog = false;
                nextTick().then(() => {
                  kk++;
                });
              }
            "
            v-if="selected == null"
          >
          </newRole>
          <editRole
            :close-me="
              () => {
                dialog = false;
                nextTick().then(() => {
                  kk++;
                });
              }
            "
            v-if="selected != null && !deleteItem"
            :selected-data="selected"
          >
          </editRole>
          <v-row v-if="deleteItem">
            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                rounded="lg"
                @click="dialog = false"
                dark
                >Batal</v-btn
              >
            </v-col>

            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                rounded="lg"
                @click="deleteMe"
                dark
                color="error"
                prepend-icon="mdi-delete"
              >
                Hapus
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const dialog = ref(false);
const selected = ref(null);
const dialogTitle = ref("");
const deleteItem = ref(false);
const kk = ref(0);

watch(dialog, (e) => {
  if (!e) {
    setTimeout(() => {
      deleteItem.value = false;
    }, 500);
  }
});
const openDialog = (item, f) => {
  kk.value++;
  if (item.roleID) {
    selected.value = item;
    if (f) {
      deleteItem.value = true;
      dialogTitle.value = `Anda akan menghapus role `;
    } else {
      dialogTitle.value = "Edit Role";
    }
  } else {
    dialogTitle.value = "Buat Role";
    selected.value = null;
  }
  dialog.value = true;
};

const deleteMe = async () => {
  try {
    store.preload = true;
    await store.ajaxPost("/deleterole", selected.value);
    const res = await store.ajaxPost("/utildata");
    store.utils = res;
    dialog.value = false;
    store.preload = false;
  } catch (error) {
    store.preload = false;
    console.log(error);
    store.alertFire(error);
  }
};

onMounted(() => {
  kk.value++;
});
</script>
