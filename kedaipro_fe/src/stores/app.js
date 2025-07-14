// Utilities
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import $ from "jquery";
import router from "@/router";

const apiserver = "https://localhost:3000";

export const useAppStore = defineStore("app", {
  persist: {
    pick: ["compData", "userData"],
  },
  state: () => ({
    //
    utils: {
      city: [],
      prov: [],
      role: [],
    },
    preload: false,
    compData: {},
    userData: {},
    menus: [
      {
        label: "Dashboard",
        icon: "mdi-view-dashboard",
        subtitle: "Halaman utama aplikasi",
        path: "/admin/dashboard",
      },
      {
        label: "Cashier",
        icon: "mdi-cash-register",
        subtitle: "Halaman aplikasi kasir",
        path: "/admin/cashier",
      },
      {
        label: "Laporan",
        icon: "mdi-chart-box-multiple",
        subtitle: "Halaman laporan",
        path: "/admin/report",
      },
      {
        label: "Kitchen Dahsboard",
        icon: "mdi-chef-hat",
        subtitle: "Halaman dashboar dapur",
        path: "/admin/kitchendashboard",
      },
      {
        label: "Inventory Control",
        icon: "mdi-warehouse",
        subtitle: "Halaman management stock",
        path: "/admin/inventorycontrol",
      },
    ],
    appbar: 0,
  }),
  actions: {
    ajaxPost(url, data) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "POST",
          url: apiserver + url,
          data: data,
          dataType: "JSON",
          success: (response) => {
            resolve(response);
          },
          error: (e) => {
            reject(e.responseJSON);
          },
        });
      });
    },
    alertFire(data) {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
        customClass: {
          container: "swal-custom-zindex",
          cancelButton:
            "swal-btn swal-btn-cancel v-btn v-theme--light v-btn--density-default rounded-pill v-btn--size-default v-btn--variant-outlined",
          confirmButton:
            "swal-btn swal-btn-confirm text-error v-btn v-theme--light v-btn--density-default rounded-pill v-btn--size-default v-btn--variant-outlined",
        },
      }).fire(data);
    },
    logout() {
      this.preload = true;
      this.compData = {};
      this.userData = {};
      router.push("/");
    },
    async refreshData() {
      const res = await this.ajaxPost("/refreshdata", {
        userId: this.userData.userId,
      });

      const { userName, userId, userRole, roleName, hakAkses, homePage } =
        res.dupe[0];
      this.userData = {
        userName,
        userId,
        userRole,
        roleName,
        homePage,
        hakAkses: JSON.parse(hakAkses),
      };
      this.compData = res.prof[0];
    },
  },
});
