<template>
  <div class="login-container">
    <div class="title">用户登录</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model.trim="form.name" clearable placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" clearable type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn-login" @click.native="onSubmit">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-register" @click.native="gotoRegister">没有账号？去注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        name: "",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async valid => {
        // 校验成功，可以提交
        if (valid) {
          let res = await this.$axios({
            method: "post",
            url: "/api/user",
            data: {
              user_name: this.form.name,
              user_password: this.form.password
            }
          });
          if (!res.data.ok) {
            this.$alert("用户名或密码错误", "登录失败", {
              confirmButtonText: "确定"
            });
          } else {
// ====================================================================================================================
            // 用户信息保存到store中 以及 localStorage中
            localStorage.setItem("user_name", this.form.name);
            this.$store.commit({
              type: "saveUserName",
              userName: this.form.name
            });
            this.$router.push({ name: "Home" });
          }
        }
      });
    },
    gotoRegister() {
      this.$router.push({ name: "Register" });
    }
  }
};
</script>

<style>
.login-container {
  width: 1200px;
  margin: 0 auto;
  min-height: 567px;
  padding: 20px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.login-container .title {
  text-align: center;
  font-size: 20px;
  padding-top: 20px;
}
.login-container .el-form {
  width: 500px;
  margin: 20px auto;
}
.login-container .btn-login,
.login-container .btn-register {
  width: 100%;
}
</style>