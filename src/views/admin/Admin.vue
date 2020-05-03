<template>
  <div id="admin">
    <el-container>
      <aheader />
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        重庆师范大学计算机与信息科学学院16级计算机科学与技术 段金江制作
        <br />
        Copyright © 2019 - {{ new Date().getFullYear() }} Duan Jinjiang. All Rights Reserved.
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Aheader from "@/components/Aheader.vue";

export default {
  name: "Admin",
  components: {
    Aheader
  },
  data() {
    return {};
  },
  methods: {
    logOut() {
      localStorage.removeItem("admin");
      this.$router.push("/admin/login");
    }
  }
};
</script>

<style scoped>
.el-main {
  background-color: #e9eef3;
  color: #333;
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 30px;
}
</style>