<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 引入 api
import {test} from "@/api/test";
export default {
  name: "App",
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      test().then((response) => {
        console.log(response);
      });
    }
  },
};
</script>
