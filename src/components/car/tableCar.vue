<template>
  <div>
    <h2 class="content-block">Daftar Mobil</h2>
    <div class="content-block dx-card responsive-paddings">
      <DxSelectBox
        :data-source="statusOptions"
        label="Pilih Status"
        value-expr="status"
        display-expr="name"
        :is-required="true"
        v-model.value="status"
        @valueChanged="changeStatus()"
      >
      </DxSelectBox>
      <DxButtonx
        v-if="!readOnlyStatus"
        class="custom-form"
        type="default"
        icon="clearsquare"
        text="clear"
        hint="Reset"
        stylingMode="outlined"
        @click="clear()"
      />
    </div>
    <br />
    <br />

    <dx-data-grid
      class="dx-card wide-card"
      :data-source="dataSource"
      :show-borders="false"
      :column-auto-width="true"
      :show-row-lines="true"
      :row-alternation-enabled="true"
      :remote-operations="true"
      :ref="gridRef"
      @toolbar-preparing="onToolbarPreparing($event)"
    >
      <dx-paging :page-size="10" />
      <dx-pager
        :show-page-size-selector="true"
        :show-info="true"
        :allowed-page-sizes="pageSizes"
        :showNavigationButtons="true"
        infoText="Hal {0} dari {1} ({2} items)"
        :visible="true"
      />
      <DxSearchPanel :visible="true" />

      <dx-column type="buttons" :width="110" data-field="Action">
        <!-- <DxButton hint="details" icon="more" @click="details" /> -->
        <DxButton
          text="edit"
          hint="edit"
          icon="edit"
          @click="edit"
          v-if="role == 'admin'"
        />
      </dx-column>
      <dx-column data-field="merk" caption="Merk" />
      <dx-column data-field="model" caption="Model" />
      <dx-column data-field="no_car" caption="Plat Nomor" />
      <dx-column data-field="price" caption="Harga" />
      <dx-column data-field="photo" caption="Foto" />
      <dx-column data-field="status" caption="Status" />
    </dx-data-grid>
  </div>
</template>
          <script>
import DxDataGrid, {
  DxColumn,
  DxFilterRow,
  DxLookup,
  DxPager,
  DxPaging,
  DxEditing,
  DxForm,
  DxSearchPanel,
  DxButton,
  DxMasterDetail,
} from "devextreme-vue/data-grid";
import { DxSelectBox } from "devextreme-vue/select-box";
import DxButtonx from "devextreme-vue/button";
import CustomStore from "devextreme/data/custom_store";
import axios from "axios";
import DxPopup from "devextreme-vue/popup";
import router from "@/router";

import notify from "devextreme/ui/notify";

const isNotEmpty = (value) =>
  value !== undefined && value !== null && value !== "";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxFilterRow,
    DxLookup,
    DxPager,
    DxPaging,
    DxEditing,
    DxPopup,
    DxForm,
    DxSearchPanel,
    DxButton,
    DxMasterDetail,
    DxSelectBox,
    DxButtonx,
  },
  data() {
    const vthis = this;
    const dataSource = {
      store: new CustomStore({
        key: "id",
        load: async function (loadOptions) {
          var sortedBy = "";
          var sort = "";
          let filterValue = "";
          if (loadOptions.sort) {
            sortedBy += loadOptions.sort[0].selector;
            if (loadOptions.sort[0].desc) {
              sort += "desc";
            } else {
              sort += "asc";
            }
          }

          if (loadOptions.filter) {
            filterValue = loadOptions.filter[0].filterValue;
          }

          var perPage = loadOptions.take;
          var offset = loadOptions.skip;
          var page = offset / perPage + 1;

          var datax = vthis.fetch({
            limit: perPage || 10,
            page: page || 1,
            sorted_by: sortedBy || "updated_at",
            sort: sort || "desc",
            search: filterValue,
            status: vthis.status || "",
          });

          return await datax;
        },
      }),
    };
    return {
      gridRef: "car-table",
      dataSource: dataSource,
      pageSizes: [5, 10, 15],
      status: "",
      btnAdd: null,
      readOnlyStatus: true,
      statusOptions: [
        {
          status: true,
          name: "Dipinjam",
        },
        {
          status: false,
          name: "Tersedia",
        },
      ],
    };
  },
  props: {
    role: {
      type: String,
    },
  },
  computed: {
    dataGrid: function () {
      return this.$refs[this.gridRef].instance;
    },
  },
  methods: {
    clear() {
      this.readOnlyStatus = true;
      this.status = "";
    },
    changeStatus() {
      this.dataGrid.refresh();
      this.readOnlyStatus = false;
    },
    async details(params) {
      await this.console.log(params.data);
    },
    edit(params) {
      console.log(params);
      this.$store.dispatch("carList/setCarListStatus", "Edit");
      this.$store.dispatch("carList/setCarList", params.row.data);
      router.push(`/car-list/form`);
    },
    onToolbarPreparing(e) {
      const vThis = this;
      e.toolbarOptions.items.unshift({
        location: "after",
        widget: "dxButton",
        options: {
          icon: "refresh",
          stylingMode: "outlined",
          type: "default",
          onInitialized: function (e) {
            this.btnAdd = e.component;
          },
          onClick: function () {
            vThis.dataGrid.refresh();
          },
        },
      });
      e.toolbarOptions.items.unshift({
        location: "before",
        widget: "dxButton",
        options: {
          icon: "add",
          text: "Tambah",
          stylingMode: "outlined",
          type: "default",
          onInitialized: function (e) {
            this.btnAdd = e.component;
          },
          onClick: function () {
            vThis.$store.dispatch("carList/setCarListStatus", "Add");
            router.push(`/car-list/form`);
          },
        },
      });
    },
    async fetch(params = {}) {
      // eslint-disable-next-line no-console
      if (Object.keys(params).length === 0) {
        params = {};
      }

      let text = "?";
      const keys = Object.keys(params);
      keys.forEach((i) => {
        if (i in params && isNotEmpty(params[i])) {
          text += `${i}=${JSON.stringify(params[i])}&`;
        }
      });
      text = text.slice(0, -1);

      var results = await this.$store.dispatch(
        "carList/getCarList",
        text.replace(/['"]+/g, "")
      );
      // eslint-disable-next-line no-console
      var datax = await {
        data: results.data,
        totalCount: results.paginate.total,
      };
      return await datax;
    },
  },
};
</script>
          <style scoped>
.custom-form {
  margin-top: 20px;
}
</style>