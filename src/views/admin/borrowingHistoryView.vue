<template>
  <div>
    <div>
      <tableBorrowingHistory :role="'admin'"></tableBorrowingHistory>
    </div>
  </div>
</template>
      
      <script>
import tableBorrowingHistory from "@/components/car/tableBorrowingHistory.vue";
import router from "@/router";
export default {
  components: {
    tableBorrowingHistory,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>