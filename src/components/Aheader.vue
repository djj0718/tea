<template>
  <el-header height="230px">
    <div class="banner-container">
      <div class="container banner clearfix">
        <div id="logo">
          <img :src="logo" />
        </div>
        <div id="title-content">信阳毛尖后台管理</div>
        <div id="user-box">
          管理员 {{ username }} 欢迎您
          <el-button @click.native="logout">退出登录</el-button>
        </div>
      </div>
    </div>
    <!-- 导航栏 -->
    <div id="nav">
      <div class="container">
        <router-link :to="{name: 'Admin'}">
          <span>商品管理</span>
        </router-link>
        <router-link :to="{name: 'Orders'}">
          <span>订单管理</span>
        </router-link>
      </div>
    </div>
  </el-header>
</template>

<script>
import logo from '@/assets/logo.png';

export default {
  data() {
    return {
      logo,
      username: "admin"
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("admin");
      this.$router.push({ name: "AdminLogin" });
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