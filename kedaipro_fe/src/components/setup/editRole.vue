<template>
  <div class="py-2">
    <v-text-field
      density="compact"
      v-model="formData.roleName"
      variant="outlined"
      rounded="lg"
      label="Nama Role"
      :error-messages="validate.roleName.$errors.map((e) => e.$message)"
    />
    <v-autocomplete
      density="compact"
      v-model="formData.homePage"
      variant="outlined"
      rounded="lg"
      :items="pages"
      :item-props="itemProps"
      item-value="path"
      :error-messages="validate.homePage.$errors.map((e) => e.$message)"
    >
    </v-autocomplete>
    <v-divider></v-divider>
    <v-btn @click="submit" variant="outlined" rounded="lg" block dark>
      Submit
    </v-btn>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const props = defineProps(["closeMe", "selectedData"]);
const formData = reactive({
  roleID: props.selectedData.roleID,
  roleName: props.selectedData.roleName,
  homePage: props.selectedData.homePage,
});
const store = useAppStore();
const pages = ref(store.menus);

const rules = {
  roleName: {
    req: helpers.withMessage("Harus diisi", required),
  },
  homePage: {
    req: helpers.withMessage("Harus diisi", required),
  },
};

const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        icon: "error",
        text: "Perhatikan field input",
      };
    store.preload = true;

    await store.ajaxPost("/newrole", formData);

    store.utils = {};
    const res = await store.ajaxPost("/utildata");
    store.utils = res;
    props.closeMe();
    store.preload = false;
  } catch (error) {
    console.log(error);
    store.alertFire(error);
    store.preload = false;
  }
};

function itemProps(item) {
  return {
    title: item.label,
    subtitle: item.path,
    prependIcon: item.icon,
  };
}
</script>
