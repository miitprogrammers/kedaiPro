/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";
import { useAppStore } from "@/stores/app";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;

router.beforeEach((e) => {
  const path = e.path;
  const store = useAppStore();
  const userId = store.userData.userId;
  if (!userId) {
    if (path != "/") {
      router.push("/");
    }
  } else {
    store.ajaxPost("/utildata").then((res) => {
      store.utils.role = res.role;
      store.utils.city = res.city;
      store.utils.prov = res.prov;
    });
    const homePage = store.userData.homePage;
    if (path == "/") {
      if (!store.userData.hakAkses.includes(path)) {
        router.push(homePage);
      }
    }
  }
});
