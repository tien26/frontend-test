<template>
  <div>
    <h2 class="content-block">
      {{ getCarLoanStatus == "Add" ? "Membuat" : "Edit" }}
      Daftar Penyewaan Mobil
    </h2>
    <DxButton
      class="content-block"
      type="default"
      icon="back"
      hint="kembali"
      @click="this.$router.back()"
    />
    <formCarLoan @get-loan="submit"></formCarLoan>
  </div>
</template>
          <script>
import formCarLoan from "@/components/car/formCarLoan.vue";
import notify from "devextreme/ui/notify";
import DxButton from "devextreme-vue/button";
import router from "@/router";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    formCarLoan,
    DxButton,
  },
  computed: {
    ...mapGetters("carLoan", ["getCarLoanStatus"]),
    ...mapGetters("carList", ["getCarList"]),
  },
  methods: {
    async submit(value) {
      console.log(this.getCarLoanStatus);
      if (this.getCarLoanStatus == "Add") {
        this.getCarList.status = 1;
        this.getCarList._method = "PUT";
        this.$store
          .dispatch("carLoan/postCarLoan", value)
          .then((res) => {
            this.$store
              .dispatch("carList/editCarList", this.getCarList)
              .then((res) => {
                router.push(`/user/car-loan`);
                notify("Berhasil", "success", 2000);
              });
          })
          .catch((e) => {
            console.log(e);
            notify(e.message, "error", 2000);
            return;
          });
      } else if (this.getCarLoanStatus == "Edit") {
        value._method = "PUT";
        this.$store
          .dispatch("carLoan/editCarLoan", value)
          .then((res) => {
            router.push(`/user/car-loan`);
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