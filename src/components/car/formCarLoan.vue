<template>
  <div class="content-block dx-card responsive-paddings">
    <form action="post-action" @submit.prevent="handleSubmit" :ref="formRef">
      <DxDateBox
        class="custom-form"
        label="Tanggal Mulai Penyewaan"
        :value="now"
        :input-attr="{ 'aria-label': 'Date' }"
        type="date"
        v-model="loan.start_date"
      />
      <DxDateBox
        class="custom-form"
        label="Tanggal Pengembalian"
        :value="now"
        :input-attr="{ 'aria-label': 'Date' }"
        type="date"
        v-model="loan.end_date"
      />
      <DxButton
        v-if="!loading"
        text="Submit the Form"
        type="success"
        icon="save"
        :use-submit-behavior="true"
      />
    </form>
  </div>
</template>
    <script>
import DxButton from "devextreme-vue/button";
import DxValidator, { DxRequiredRule } from "devextreme-vue/validator";
import DxTextArea from "devextreme-vue/text-area";
import { DxFileUploader } from "devextreme-vue/file-uploader";
import DxDateBox from "devextreme-vue/date-box";
import { DxTextBox } from "devextreme-vue/text-box";
import { DxNumberBox } from "devextreme-vue/number-box";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    DxButton,
    DxValidator,
    DxRequiredRule,
    DxTextArea,
    DxFileUploader,
    DxDateBox,
    DxTextBox,
    DxNumberBox,
  },
  data() {
    return {
      loan: {},
      formRef: "form-car-list",
      now: new Date(),
      loading: false,
    };
  },
  emits: ["get-loan"],
  mounted() {},
  computed: {
    ...mapGetters("carList", ["getCarList"]),
    ...mapGetters("auth", ["getUserDetail"]),
  },
  methods: {
    async handleSubmit() {
      this.loan.user_id = this.getUserDetail.id;
      this.loan.car_id = this.getCarList.id;

      this.loading = true;
      this.$emit("get-loan", this.loan);
    },
    getFile(params) {
      if (params.component._files.length > 0) {
        this.loading = !params.component._files[0].isValidFileExtension;
        this.file = params.value[0];
      }
    },
  },
};
</script>
    
    <style scoped>
.custom-form {
  margin-bottom: 25px;
  margin-top: 10px;
}
.fileuploader-container {
  border: 1px solid #d3d3d3;
  margin: 0;
}
.main-block {
  max-width: 900px;
  min-width: 700px;
}
</style>