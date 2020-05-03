<template>
  <div id="admin-login">
    <div class="container">
      <h1>管理员登录</h1>管理员账号：
      <el-input v-model="adminName" placeholder="请输入管理员账号"></el-input>
      <br />管理员密码：
      <el-input v-model="adminPass" type="password" placeholder="请输入管理员密码"></el-input>
      <br />
      <el-button @click.native="checkUser">登录</el-button>
      <br />
      {{msg}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adminName: "",
      adminPass: "",
      msg: ""
    };
  },
  created() {
    let isLogin = localStorage.getItem("admin");
    if (isLogin) {
      this.$router.push("/admin");
    }
  },
  methods: {
    async checkUser() {
      let res = await this.$axios({
        method: "post",
        url: "/api/admin",
        data: {
          adminName: this.adminName,
          adminPass: this.adminPass
        }
      });
      if (res.data.ok) {
        localStorage.setItem("admin", "admin");
        this.$router.push("/admin");
      } else {
        this.msg = "管理员用户名或者密码错误";
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin: 100px auto;
  padding: 50px;
  width: 700px;
  height: 400px;
  text-align: center;
  border: 1px solid #000;
  border-radius: 5px;
}
.el-input,
.el-button {
  width: 300px;
  margin-bottom: 20px;
}
.el-button {
    margin-left: 100px;
}
</style>