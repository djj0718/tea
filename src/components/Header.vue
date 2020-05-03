<template>
  <el-header height="230px">
    <div class="banner-container">
      <div class="container banner clearfix">
        <div id="logo">
          <img :src="logo" />
        </div>
        <div id="title-content">信阳毛尖销售系统</div>
        <div id="user-box">
          {{ userName }}
          <el-button @click="gotoLogin">{{ isLogin ? "退出" : "登录" }}</el-button>
        </div>
      </div>
    </div>
    <!-- 导航栏 -->
    <div id="nav">
      <div class="container">
        <router-link to="/">
          <span>首页</span>
        </router-link>
        <router-link v-if="isLogin" to="/user">
          <span>个人中心</span>
        </router-link>
      </div>
    </div>
  </el-header>
</template>

<script>
import logo from "@/assets/logo.png";

export default {
  data() {
    return {
      logo
    };
  },
  computed: {
    isLogin() {
      return !(this.$store.state.userName === "");
    },
    userName() {
      return this.$store.state.userName || "用户请登录：";
    }
  },
  created() {
    // ====================================================================================================================
    let userName = localStorage.getItem("user_name");
    if (userName) {
      this.$store.commit({
        type: "saveUserName",
        userName
      });
    }
  },
  methods: {
    gotoLogin() {
      if (this.isLogin) {
        // ====================================================================================================================
        // 用户退出 清空store中上个用户的相关信息
        localStorage.removeItem("user_name");
        this.$store.commit("logout");
        this.$store.commit("clearCart");
        if (this.$route.name !== "Home") {
          this.$router.push({ name: "Home" });
        }
        return;
      }
      if (this.$route.name === "Login") return;
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style scoped>
.el-header {
  padding: 0;
}
.banner-container {
  height: 154px;
  color: #333;
  background-color: #b3c0d1;
}
.banner {
  position: relative;
}
.container {
  width: 1200px;
  margin: 0 auto;
}
.clearfix::before,
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
#logo {
  float: left;
}
#logo img {
  height: 154px;
  display: block;
}
#title-content {
  font-size: 50px;
  letter-spacing: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
#user-box {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
#nav span {
  box-sizing: border-box;
  display: inline-block;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active span {
  border-bottom: 10px cyan solid;
}
</style>