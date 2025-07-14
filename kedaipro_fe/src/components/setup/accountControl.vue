<template>
  <v-card class="h-100">
    <template #text>
      <v-data-table :items="users" fixed-header max-height="75vh">
        <template #top>
          <v-toolbar color="transparent">
            <template #title>
              <v-text-field
                class="mt-2"
                hide-details
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-magnify"
                label="Search"
              />
            </template>
            <template #append>
              <v-btn flat icon class="ms-2" @click="openDialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-toolbar>
        </template>
        <template #headers>
          <tr class="text-uppercase">
            <th class="text-center">No</th>
            <th>ID Pengguna</th>
            <th>Nama Pengguna</th>
            <th>Telpon Pengguna</th>
            <th>Role Pengguna</th>
            <th class="text-center">Tindakan</th>
          </tr>
        </template>
        <template #item="{ item, index }">
          <tr v-if="item.userRole != 1">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.userId }}</td>
            <td class="text-uppercase">{{ item.userName }}</td>
            <td class="text-uppercase">0{{ item.userWhatsapp }}</td>
            <td class="text-uppercase">
              {{ item.roleName }}
            </td>
            <td class="text-center">
              <v-btn-group density="compact" variant="flat">
                <v-btn @click="openDialog(item)">
                  <v-icon color="primary">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.userRole != 9"
                  @click="openDialog(item, true)"
                >
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-btn-group>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card rounded="lg">
        <template #title>
          <div class="text-uppercase" v-if="!deleteItem">
            {{ dialogTitle }}
          </div>
          <div class="w-100 text-center" v-if="deleteItem">
            Anda akan menghapus akun
          </div>

          <div class="w-100 text-center" v-if="deleteItem">
            {{ selected.userName }}
          </div>
        </template>
        <template #subtitle v-if="deleteItem">
          <div class="w-100 text-center">Apakah anda yakin?</div>
        </template>
        <template #prepend v-if="deleteItem">
          <v-icon color="warning" size="85">mdi-help</v-icon>
        </template>
        <template #append v-if="!deleteItem">
          <v-btn flat icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #text>
          <newAccount
            :close-me="
              () => {
                refresh();
                dialog = false;
              }
            "
            v-if="!deleteItem && selected == null"
          />
          <editAccount
            :close-me="
              () => {
                refresh();
                dialog = false;
              }
            "
            :selected-data="selected"
            v-if="!deleteItem && selected != null"
          />
          <div v-if="deleteItem" class="w-100">
            <v-btn-group class="w-100" variant="outlined" rounded="lg">
              <v-btn class="w-50" @click="dialog = false">Batal</v-btn>
              <v-btn
                @click="deleteMe"
                class="w-50"
                color="error"
                prepend-icon="mdi-delete"
                >Hapus</v-btn
              >
            </v-btn-group>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const dialog = ref(false);
const selected = ref();
const deleteItem = ref(false);
const dialogTitle = ref("");
const users = ref([]);
const openDialog = (item, f) => {
  if (item.userId) {
    selected.value = item;
    deleteItem.value = f;
    dialogTitle.value = f ? "Hapus Akun" : "Edit Akun";
  } else {
    selected.value = null;
    dialogTitle.value = "Buat Akun Baru";
    deleteItem.value = false;
  }
  dialog.value = true;
};

const roleName = ref();

const refresh = async () => {
  try {
    const res = await store.ajaxPost("/getusers", {});
    users.value = res;
  } catch (error) {
    console.log(error);
  }
};

const deleteMe = async () => {
  store.preload = true;
  await store.ajaxPost("/deleteuser", { userId: selected.value.userId });
  refresh();
  dialog.value = false;
  store.preload = false;
  dialog.value = false;
};

onMounted(() => {});

onBeforeMount(() => {
  refresh();
});
</script>
