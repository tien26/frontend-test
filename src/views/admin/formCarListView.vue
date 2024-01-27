<template>
  <div>
    <h2 class="content-block">
      {{ getCarListStatus == "Add" ? "Membuat" : "Edit" }}
      Daftar Mobil
    </h2>
    <DxButton
      class="content-block"
      type="default"
      icon="back"
      hint="kembali"
      @click="this.$router.back()"
    />
    <formCar @get-car-list="submit"></formCar>
  </div>
</template>
        <script>
import formCar from "@/components/car/formCar.vue";
import notify from "devextreme/ui/notify";
import DxButton from "devextreme-vue/button";
import router from "@/router";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    formCar,
    DxButton,
  },
  computed: {
    ...mapGetters("carList", ["getCarListStatus"]),
  },
  methods: {
    async submit(value) {
      console.log(this.getCarListStatus);
      if (this.getCarListStatus == "Add") {
        this.$store
          .dispatch("carList/postCarList", value)
          .then((res) => {
            router.push(`/car-list`);
            notify("Berhasil", "success", 2000);
          })
          .catch((e) => {
            console.log(e);
            notify(e.message, "error", 2000);
            return;
          });
      } else if (this.getCarListStatus == "Edit") {
        value._method = "PUT";
        this.$store
          .dispatch("carList/editCarList", value)
          .then((res) => {
            router.push(`/car-list`);
            notify("Berhasil", "success", 2000);
          })
          .catch((e) => {
            console.log(e);
            notify(e.message, "error", 2000);
            return;
          });
      } else {
        console.log("error");
        return;
      }
    },
  },
};
</script>