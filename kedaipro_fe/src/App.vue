<template>
  <v-app>
    <router-view />
    <v-dialog
      v-model="store.preload"
      scrollable
      fullscreen
      persistent
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card>
        <div class="d-flex flex-column h-100 w-100 align-center justify-center">
          <v-progress-circular
            indeterminate=""
            size="350"
            width="15"
            color="gold"
          >
            <v-img src="./assets/batasit.png" width="300"></v-img>
          </v-progress-circular>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { useAppStore } from "./stores/app";

const store = useAppStore();
store.refreshData();
</script>
