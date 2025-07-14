<template>
  <v-container class="fill-height" max-width="400">
    <div class="d-flex align-center justify-center w-100 fill-height">
      <loginForm></loginForm>
    </div>
  </v-container>
</template>

<script setup>
import { useAppStore } from "@/stores/app";

//
onMounted(() => {
  useAppStore().preload = true;
  setTimeout(() => {
    useAppStore().preload = false;
  }, 1000);
});
</script>
