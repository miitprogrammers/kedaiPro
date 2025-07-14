<template>
  <v-card rounded="lg" class="w-100">
    <template #title>Pendaftaran</template>
    <template #subtitle>Daftarkan kedai anda di sini</template>
    <template #text></template>
    <template #append>
      <v-btn flat icon \>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </template>
  </v-card>
</template>
<script setup>
const formData = reactive({
  userPhone: "",
  userPassword: "",
});
</script>
