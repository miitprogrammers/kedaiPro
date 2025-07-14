<template>
  <setProfil></setProfil>
</template>
<script setup>
import router from "@/router";
import { useAppStore } from "@/stores/app";

const store = useAppStore();

onMounted(() => {
  if (store.compData.compName != "") {
    const homePage = store.userData.homePage;
    router.push(homePage);
  }
});
</script>
<route lang="yaml">
meta:
  layout: admin
</route>
