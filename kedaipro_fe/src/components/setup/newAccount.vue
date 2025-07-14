<template>
  <div>
    <div class="pa-2" v-for="(item, index) in structure" :key="index">
      <v-text-field
        v-if="item.type() != 'autocomplete'"
        :label="item.label"
        variant="outlined"
        rounded="lg"
        density="comfortable"
        :hint="item.hint"
        :type="item.type()"
        v-model="formData[index]"
        hide-spin-buttons
        :error-messages="validate[index].$errors.map((e) => e.$message)"
      >
        <template #append-inner>
          <v-icon v-if="item.appendIcon">{{ item.appendIcon() }}</v-icon>
        </template>
        <template #prepend-inner>
          <div v-if="item.preprendText">{{ item.preprendText }}</div>
          <v-icon v-else>{{ item.prependIcon }}</v-icon>
        </template>
      </v-text-field>
      <v-autocomplete
        v-else
        v-model="formData[index]"
        :items="roles"
        :label="item.label"
        variant="outlined"
        rounded="lg"
        density="comfortable"
        item-title="roleName"
        item-value="roleID"
        :hint="item.hint"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
      >
        <template #prepend-inner>
          <div v-if="item.preprendText">{{ item.preprendText }}</div>
          <v-icon v-else>{{ item.prependIcon }}</v-icon>
        </template>
      </v-autocomplete>
    </div>
    <v-checkbox
      density="compact"
      label="Perlihatkan Sandi"
      v-model="showPass"
      value="value"
    ></v-checkbox>
    <v-btn
      @click="submit"
      variant="outlined"
      rounded="lg"
      block
      color="primary"
      dark
      >submit</v-btn
    >
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import moment from "moment";

const dateCode = moment().format("YYMM");
const props = defineProps(["closeMe"]);
const store = useAppStore();
const showPass = ref(false);
const formData = reactive({
  userName: "",
  userWhatsapp: "",
  userPassword: "123456",
  confPassword: "123456",
  userRole: "",
  userId: dateCode,
});

const roles = store.utils.role.filter((e) => e.roleID != 1);

const structure = reactive({
  userName: {
    label: "Nama Pengguna",
    hint: "Silahkan isi nama pengguna",
    type: () => "text",
    prependIcon: "mdi-account",
  },
  userWhatsapp: {
    label: "Telpon Pengguna",
    hint: "Silahkan isi nomor telpon pengguna",
    type: () => "number",
    preprendText: "+62",
    appendIcon: () => "mdi-whatsapp",
  },
  userRole: {
    label: "Role Penguna",
    hint: "Silahkan pilih role pengguna",
    type: () => "autocomplete",
    prependIcon: "mdi-shield-account",
  },
  userPassword: {
    prependIcon: "mdi-lock",
    label: "Sandi Pengguna",
    hint: "Silahkan isi kata sandi pengguna (default: 123456)",
    type: () => (showPass.value ? "text" : "password"),
    appendIcon: () => (showPass.value ? "mdi-eye" : "mdi-eye-off"),
  },
  confPassword: {
    prependIcon: "mdi-lock",
    label: "Ulang Sandi",
    hint: "Silahkan isi kata sandi pengguna",
    type: () => (showPass.value ? "text" : "password"),
    appendIcon: () => (showPass.value ? "mdi-eye" : "mdi-eye-off"),
  },
});

const rules = {
  userName: {
    req: helpers.withMessage("Harus diisi!", required),
  },
  userWhatsapp: {
    req: helpers.withMessage("Harus diisi!", required),
  },
  userPassword: {
    req: helpers.withMessage("Harus diisi!", required),
  },
  confPassword: {
    req: helpers.withMessage("Harus diisi!", required),
    match: helpers.withMessage("Password tidak sama", () => {
      return formData.confPassword == formData.userPassword;
    }),
  },
  userRole: {
    req: helpers.withMessage("Harus diisi!", required),
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
    await store.ajaxPost("/newuser", formData);
    props.closeMe();
    store.preload = false;
  } catch (error) {
    console.log(error);
    store.alertFire(error);
    store.preload = false;
  }
};
</script>
