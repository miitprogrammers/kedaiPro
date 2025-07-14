<template></template>

<route lang="yaml">
meta:
  layout: admin
</route>

<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
onMounted(() => {
  store.preload = false;
});
</script>
