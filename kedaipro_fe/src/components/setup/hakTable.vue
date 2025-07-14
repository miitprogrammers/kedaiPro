<template>
  <v-table fixed-header>
    <thead class="text-uppercase">
      <tr>
        <th rowspan="2">Nama Role</th>
        <th class="text-center" :colspan="menus.length">Hak Akses</th>
      </tr>
      <tr>
        <th class="text-center" v-for="(item, index) in menus" :key="index">
          {{ item.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in roleData" :key="index">
        <td class="text-uppercase">{{ item.roleName }}</td>
        <td class="text-center" v-for="(i, ind) in menus" :key="ind">
          <v-checkbox
            v-model="roleData[index].hakAkses"
            :disabled="item.homePage == i.path || item.roleID == 1"
            @change="updateAkses(item.roleID)"
            :value="i.path"
            class="align-center justify-center d-flex"
          >
          </v-checkbox>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const roleData = ref();
const updateAkses = async (roleID) => {
  const ha = roleData.value.find((e) => e.roleID == roleID);
  const updateData = {
    roleID,
    hakAkses: JSON.stringify(ha.hakAkses),
  };
  await store.ajaxPost("/updateakses", updateData);
  await store.refreshData();
};

const menus = store.menus;

onMounted(() => {
  roleData.value = store.utils.role;
  console.log(roleData.value);
});
</script>
