<template>
  <div class="register-container">
    <div class="title">用户注册</div>
    <el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model.trim="form.name"
          minlength="2"
          maxlength="20"
          clearable
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" clearable type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password1">
        <el-input v-model.trim="form.password1" clearable type="password" placeholder="请再输入一次密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn-register" @click.native.prevent="onSubmit">注册</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-login" @click.native.prevent="gotoLogin">已有账号？去登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    // 检查用户名格式
    let validateName = (rule, value, callback) => {
      clearTimeout(validateName.timer);
      if (value === "") {
        callback(new Error("请输入用户名"));
        return;
      }
      validateName.timer = setTimeout(async () => {
        if (!/^[0-9a-zA-Z_]{2,20}$/.test(value)) {
          callback(
            new Error("用户名必须为长度在2到20之间的数字或字母或下划线")
          );
          return;
        }
        // 符合格式之后，检查用户名有没有被注册
        let res = await this.$axios({
          url: `/api/user?name=${value}`
        });
        if (res.data.ok) {
          callback(new Error("该用户名已经被注册"));
          return;
        }
        callback();
      }, 500);
    };
    // 检查密码格式
    let validatePassword = (rule, value, callback) => {
      clearTimeout(validatePassword.timer);
      if (value === "") {
        callback(new Error("请输入密码"));
        return;
      }
      validatePassword.timer = setTimeout(() => {
        if (!/^[0-9a-zA-Z_]{2,20}$/.test(value)) {
          callback(new Error("密码必须为长度在2到20之间的数字或字母或下划线"));
          return;
        }
        if (this.form.password1 !== "") {
          this.$refs.form.validateField("password1");
        }
        callback();
      }, 500);
    };
    // 检查两次密码是不是一样的
    let validatePassword1 = (rule, value, callback) => {
      clearTimeout(validatePassword1.timer);
      if (value === "") {
        callback(new Error("请再输入一次密码"));
        return;
      }
      validatePassword1.timer = setTimeout(() => {
        if (this.form.password !== value) {
          callback(new Error("两次输入的密码不一致"));
        }
        callback();
      }, 499);
    };
    return {
      form: {
        name: "",
        password: "",
        password1: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "change" }],
        password: [{ validator: validatePassword, trigger: "change" }],
        password1: [{ validator: validatePassword1, trigger: "change" }]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.$axios({
            method: "post",
            url: "/api/register",
            data: {
              user_name: this.form.name,
              user_password: this.form.password
            }
          });
          if (!res.data.ok) {
            this.$alert("服务器发生未知错误", "注册失败", {
              confirmButtonText: "确定"
            });
          } else {
            this.$alert("直接用此账号进行登录？", "注册成功", {
              confirmButtonText: "确定"
            }).then(
              () => {
// ====================================================================================================================
                // 用户信息保存到store中 以及 localStorage中
                localStorage.setItem("user_name", this.form.name);
                this.$store.commit({
                  type: "saveUserName",
                  userName: this.form.name
                });
                this.$router.push({ name: "Home" });
              },
              () => {
                console.log("继续注册账号");
              }
            );
          }
        }
      });
    },
    gotoLogin() {
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style>
.register-container {
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
.register-container .title {
  text-align: center;
  font-size: 20px;
  padding-top: 20px;
}
.register-container .el-form {
  width: 500px;
  margin: 20px auto;
}
.register-container .btn-register,
.register-container .btn-login {
  width: 100%;
}
</style>