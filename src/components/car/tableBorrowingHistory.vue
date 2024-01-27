<template>
  <div>
    <h2 class="content-block">Daftar Riwayat Peminjaman</h2>

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
          v-if="role == 'user'"
        />
      </dx-column>
      <dx-column data-field="no_loan" caption="Code Peminjaman" />
      <dx-column data-field="start_date" caption="Tanggal Pinjam" />
      <dx-column data-field="end_date" caption="Tanggal Pengembalian" />
      <dx-column data-field="name" caption="Customer" />
      <dx-column data-field="phone" caption="Phone" />
      <dx-column data-field="sim" caption="Sim" />
      <dx-column data-field="total" caption="Total Bayar" />
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
      gridRef: "borrowing-table",
      dataSource: dataSource,
      pageSizes: [5, 10, 15],
      status: "",
      btnAdd: null,
      readOnlyStatus: true,
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
    changeStatus() {
      this.dataGrid.refresh();
      this.readOnlyStatus = false;
    },
    edit(params) {
      console.log(params.data.row);
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
            console.log("ini tambah");
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
        "borrowingHistory/getBorrowingHistory",
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