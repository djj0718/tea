<template>
  <div class="add-goods-container">
    <el-button @click.native="$router.push({name: 'Admin'})">&lt; 返回商品管理</el-button>
    <div class="title">新增商品</div>
    <div class="content clearfix">
      <div class="left">
        <div>商品名：</div>
        <div>描述信息：</div>
        <div>价格：</div>
        <div>图片：</div>
      </div>
      <div class="right">
        <div>
          <el-input v-model="goodsData.name" placeholder="请输入商品名"></el-input>
        </div>
        <div>
          <el-input v-model="goodsData.description" placeholder="请输入商品描述信息"></el-input>
        </div>
        <div>
          <el-input v-model.number="goodsData.price" placeholder="请输入商品价格"></el-input>（单位：分）
        </div>
        <div>
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="/api/addgoods"
            :show-file-list="false"
            :auto-upload="false"
            :on-success="handleAvatarSuccess"
            :on-change="change"
            :data="goodsData"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" @click="clearFiles" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <div>
        <el-button @click.native="submit">提交新增</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddGoods",
  data() {
    return {
      goodsData: {
        name: "",
        description: "",
        price: ""
      },
      imageUrl: "",
      success: false
    };
  },
  methods: {
    // 成功以后
    handleAvatarSuccess(res, file) {
      if (res.ok) {
        this.$message({ message: "新增商品成功！", type: "success" });
      } else {
        this.$message({ message: "新增商品失败！", type: "error" });
      }
      this.goodsData.name = this.goodsData.description = this.goodsData.price =
        "";
      this.success = true;
    },
    // 在一开始就把这个file给预览一下 结束之后清空upload供下次继续使用
    change(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (this.success) {
        this.clearFiles();
        this.success = false;
      }
    },
    // 提交新增商品开始上传文件和数据
    submit() {
      let { name, description, price } = this.goodsData;
      if (name.trim() === "") {
        this.$message({ message: "请输入商品名", type: "warning" });
        return;
      }
      if (description.trim() === "") {
        this.$message({ message: "请输入商品描述信息", type: "warning" });
        return;
      }
      if (String(price).trim() === "") {
        this.$message({ message: "请输入商品价格", type: "warning" });
        return;
      }
      if ("number" !== typeof this.goodsData.price) {
        this.$message({ message: "商品价格必须为数字", type: "warning" });
        return;
      }
      if (!this.imageUrl) {
        this.$message({ message: "请选择商品图片", type: "warning" });
        return;
      }
      this.$refs.upload.submit();
    },
    // 点击图片把之前的清空一次只提交一个图片
    clearFiles() {
      this.imageUrl = "";
      this.$refs.upload.clearFiles();
    }
  }
};
</script>

<style>
.add-goods-container {
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
.add-goods-container .el-input {
  width: 500px;
}
.add-goods-container .title {
  font-size: 20px;
  text-align: center;
}
.add-goods-container .content {
  padding-top: 30px;
  width: 700px;
  margin: 0 auto;
  line-height: 60px;
}
.clearfix::before,
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.add-goods-container .left {
  float: left;
  text-align: right;
}
.add-goods-container .right {
  margin-left: 100px;
}
.add-goods-container .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.add-goods-container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.add-goods-container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.add-goods-container .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>