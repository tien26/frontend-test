<template>
  <div>
    <div>
      <tableCar :role="'user'"></tableCar>
    </div>
  </div>
</template>
    
    <script>
import tableCar from "@/components/car/tableCar.vue";
import router from "@/router";
export default {
  components: {
    tableCar,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>