<template>
  <v-container
    fluid
    max-width="800"
    class="h-100 d-flex flex-column w-100 align-center justify-center"
  >
    <v-card class="w-100">
      <v-card-text>
        <div class="d-flex align-center justify-center w-100">
          <v-img src="../../assets/batasit.png" height="300" />
        </div>
        <v-container fluid>
          <v-row>
            <v-col
              :cols="item.cols"
              v-for="(item, index) in structure"
              :key="index"
            >
              <v-text-field
                :error-messages="valid[index].$errors.map((e) => e.$message)"
                density="compact"
                v-if="item.type == 'text' || item.type == 'number'"
                :hint="item.hint"
                :label="item.label"
                variant="outlined"
                rounded="lg"
                v-model="store.compData[index]"
                :type="item.type"
                hide-spin-buttons
              >
                <template #prepend-inner v-if="index == 'compTelp'">
                  +62
                </template>
              </v-text-field>
              <v-autocomplete
                v-else
                :error-messages="valid[index].$errors.map((e) => e.$message)"
                density="compact"
                v-model="store.compData[index]"
                :hint="item.hint"
                :label="item.label"
                variant="outlined"
                rounded="lg"
                item-value="id"
                item-title="nama"
                :items="index == 'prof' ? provinsi : c"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-btn @click="submit" block variant="outlined" rounded="lg" dark
            >Simpan</v-btn
          >
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: admin
</route>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const store = useAppStore();
const provinsi = ref(store.utils.prov);
const city = ref(store.utils.city);
const c = ref(
  store.utils.city.filter((e) => e.id_provinsi == store.compData.prof)
);

const props = defineProps(["closeMe"]);

const structure = reactive({
  compName: {
    label: "Nama Perusahaan",
    hint: "Isi nama perusahaan anda.",
    cols: "6",
    type: "text",
  },
  compTelp: {
    label: "Telpon Perusahaan",
    hint: "Isi telpon perusahaan anda.",
    cols: "6",
    type: "number",
  },
  compAddress: {
    label: "Alamat Perusahaan",
    hint: "Isi alamat perusahaan anda.",
    cols: "12",
    type: "text",
  },
  prof: {
    label: "Provinsi ",
    hint: "Pilih provinsi",
    cols: "6",
    type: "select",
  },
  city: {
    label: "Kota ",
    hint: "Pilih kota",
    cols: "6",
    type: "select",
  },
});
watch(
  () => store.compData.prof,
  (val) => {
    store.compData.city = "";
    c.value = city.value.filter((e) => e.id_provinsi == val);
  }
);

const rules = {
  compName: {
    req: helpers.withMessage("Harus diisi!", required),
  },
  compAddress: {
    req: helpers.withMessage("Harus diisi!", required),
  },
  city: {
    req: helpers.withMessage("Harus diisi!", required),
  },
  prof: {
    req: helpers.withMessage("Harus diisi!", required),
  },
  compTelp: {
    req: helpers.withMessage("Harus diisi!", required),
  },
};

const valid = useVuelidate(rules, store.compData);

const submit = async () => {
  try {
    const validate = await valid.value.$validate();
    if (!validate)
      throw {
        icon: "error",
        text: "Perhatikan input isian",
      };
    store.preload = true;
    await store.ajaxPost("/setprofile", store.compData);
    if (router.currentRoute.value.path != "/admin") {
      props.closeMe();
      store.preload = false;
    } else {
      store.preload = false;
      router.push("/admin/dashboard");
    }
  } catch (error) {
    store.alertFire(error);
    console.log(error);
  }
};
</script>
