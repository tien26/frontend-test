<template>
  <div>
    <div>
      <tableCarLoan :role="'admin'"></tableCarLoan>
    </div>
  </div>
</template>
      
      <script>
import tableCarLoan from "@/components/car/tableCarLoan.vue";
import router from "@/router";
export default {
  components: {
    tableCarLoan,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>