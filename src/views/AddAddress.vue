<template>
  <div class="add-address-container">
    <div class="head">
      <div class="title">添加收货地址</div>
      <el-button @click.native="goBack">&lt; 返回收货地址</el-button>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="收货地址" prop="address">
        <el-input v-model.trim="form.address" clearable placeholder="请输入收货地址"></el-input>
      </el-form-item>
      <el-form-item label="收货人姓名" prop="name">
        <el-input v-model.trim="form.name" clearable placeholder="请输入收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model.trim="form.phone" clearable placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn-login" @click="onSubmit">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback("请输入手机号码");
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback("手机号格式不正确");
      } else {
        callback();
      }
    };
    return {
      form: {
        address: "重庆市沙坪坝区重庆师范大学大学城校区",
        name: "段金江",
        phone: "17754927797"
      },
      rules: {
        address: [
          { required: true, message: "请输入收货地址", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" }
        ],
        phone: [{ validator: validatePhone, required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "User", query: { active: "second" } });
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        // 校验成功，可以提交
        if (valid) {
          let user_name = this.$store.state.userName;
          let receiver_name = this.form.name;
          let receiver_address = this.form.address;
          let receiver_phone = this.form.phone;
          let res = await this.$axios({
            method: "post",
            url: "/api/receiver",
            data: {
              user_name,
              receiver_name,
              receiver_address,
              receiver_phone
            }
          });
          if (res.data.ok) {
            this.$message({ message: "收货地址添加成功", type: "success" });
            return;
          }
          this.$message({ message: "收货地址添加失败", type: "error" });
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
.add-address-container {
  width: 1200px;
  min-height: 567px;
  padding: 20px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.add-address-container .head {
  margin-bottom: 20px;
}
.add-address-container .title {
  text-align: center;
  font-size: 20px;
}
.add-address-container .el-form {
  width: 500px;
  margin: 20px auto;
}
.add-address-container .btn-login,
.add-address-container .btn-register {
  width: 100%;
}
</style>