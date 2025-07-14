<template>
  <div class="d-flex w-100 flex-column align-center justify-center">
    <v-img src="../assets/batasit.png" width="250" class="mb-10" />
    <v-card rounded="xl" class="w-100 mb-5">
      <template #title>Selamat Datang</template>
      <template #subtitle>Selamat bekerja</template>
      <template #text>
        <v-text-field
          :error-messages="validate[index].$errors.map((e) => e.$message)"
          v-for="(item, index) in structure"
          :key="index"
          :label="item.label"
          variant="outlined"
          rounded="pill"
          density="compact"
          :append-inner-icon="item.append"
          :prepend-inner-icon="item.prepend"
          :hint="item.hint"
          :type="item.type"
          v-model="formData[index]"
        >
          <template #prepend-inner>{{ item.prependTest }}</template>
        </v-text-field>
        <v-checkbox
          density="compact"
          hide-details=""
          label="Perlihatkan Kata Sandi"
          v-model="showPass"
        />
        <v-divider class="my-2"></v-divider>
        <v-btn
          @click="submit"
          color="brown-lighten-1"
          variant="tonal"
          rounded="pill"
          block
          light
        >
          Masuk</v-btn
        >
      </template>
    </v-card>
  </div>
</template>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const store = useAppStore();
const showPass = ref(false);
const formData = reactive({
  userPhone: "",
  userPassword: "",
});

const structure = reactive({
  userId: {
    label: "User ID",
    hint: "Masukan user ID anda",
    prepend: "mdi-id-card",
    type: "text",
  },
  userPassword: {
    label: "Kata sandi",
    hint: "Masukan kata sandi anda",
    prepend: "mdi-key",
    append: computed(() => (showPass.value ? "mdi-eye" : "mdi-eye-off")),
    type: computed(() => (showPass.value ? "text" : "password")),
  },
});

const rules = {
  userId: {
    req: helpers.withMessage("Harus diisi!!", required),
  },
  userPassword: {
    req: helpers.withMessage("Harus diisi!!", required),
  },
};

const validate = useVuelidate(rules, formData);

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid)
      throw {
        text: "Periksa input isian.",
        icon: "error",
      };
    store.preload = true;
    const res = await store.ajaxPost("/login", formData);

    const { userName, userId, userRole, roleName, hakAkses, homePage } =
      res.dupe[0];
    store.userData = {
      userName,
      userId,
      userRole,
      roleName,
      homePage,
      hakAkses: JSON.parse(hakAkses),
    };
    store.compData = res.prof[0];
    router.push(homePage);
  } catch (error) {
    console.log(error);
    store.alertFire(error);
    store.preload = false;
  }
};
</script>
