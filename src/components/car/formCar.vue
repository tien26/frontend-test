<template>
  <div class="content-block dx-card responsive-paddings">
    <form action="post-action" @submit.prevent="handleSubmit" :ref="formRef">
      <DxTextBox
        class="custom-form"
        label="Merk"
        v-model:value="car.merk"
        :is-required="true"
        ><DxValidator>
          <DxRequiredRule message="Required" />
        </DxValidator>
      </DxTextBox>

      <DxTextBox
        class="custom-form"
        label="Model"
        v-model:value="car.model"
        :is-required="true"
        ><DxValidator>
          <DxRequiredRule message="Required" />
        </DxValidator>
      </DxTextBox>

      <DxTextBox
        class="custom-form"
        label="Plat Nomor"
        v-model:value="car.no_car"
        :is-required="true"
        ><DxValidator>
          <DxRequiredRule message="Required" />
        </DxValidator>
      </DxTextBox>

      <DxNumberBox
        class="custom-form"
        label="Harga"
        :min="0"
        :show-spin-buttons="true"
        :input-attr="{ 'aria-label': 'Min And Max' }"
        v-model:value="car.price"
      />

      <div class="fileuploader-container custom-form">
        <DxFileUploader
          select-button-text="Pilih Photo"
          label-text="upload file"
          :allowed-file-extensions="['.png', '.jpg', '.jpeg']"
          :max-file-size="1000000"
          upload-mode="useForm"
          @value-changed="getFile"
        >
          <!-- <DxValidator v-if="this.getDocumentFileStatus == 'Add'">
                  <DxRequiredRule message="Required" />
                </DxValidator> -->
        </DxFileUploader>
      </div>
      <div style="text-align: right; margin-bottom: 10px">
        Maximum file size:
        <span>5 MB</span>.
      </div>

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
      car: {},
      file: "",
      formRef: "form-car-list",
      loading: false,
    };
  },
  emits: ["get-car-list"],
  mounted() {
    if (this.getCarListStatus == "Edit") {
      this.car = this.getCarList;
    }
  },
  computed: {
    ...mapGetters("carList", ["getCarList", "getCarListStatus"]),
  },
  methods: {
    async handleSubmit() {
      this.car.photo = this.file;
      this.car.status = this.car.status ? 1 : 0;
      this.loading = true;
      this.$emit("get-car-list", this.car);
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