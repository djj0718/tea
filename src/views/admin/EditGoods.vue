<template>
  <div class="edit-goods-container">
    <el-button @click.native="$router.push({name: 'Admin'})">&lt; 返回商品管理</el-button>
    <div class="title">编辑商品</div>
    <div class="content clearfix">
      <div class="left">
        <div>商品名：</div>
        <div>描述信息：</div>
        <div>价格：</div>
        <div>是否在售：</div>
        <div>图片：</div>
      </div>
      <div class="right">
        <div>
          <el-input v-model="goodsData.goods_name" placeholder="请输入商品名"></el-input>
        </div>
        <div>
          <el-input v-model="goodsData.goods_description" placeholder="请输入商品描述信息"></el-input>
        </div>
        <div>
          <el-input v-model.number="goodsData.goods_price" placeholder="请输入商品价格"></el-input>（单位：分）
        </div>
        <div>
          <el-switch v-model="goodsData.isSale" active-text="在售" inactive-text="下架"></el-switch>
        </div>
        <div>
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="/api/editgoods"
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
        <el-button @click.native="submit">提交编辑</el-button>
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
        goods_id: -1,
        goods_name: "",
        goods_description: "",
        goods_price: "",
        isSale: true
      },
      imageUrl: "",
      success: false,
      // 看是不是点击了图片选择图片了
      selectImg: false
    };
  },
  async created() {
    let id = this.$route.query.id;
    let res = await this.$axios({
      url: `/api/goods?id=${id}`
    });
    this.goodsData.goods_id = res.data.goods_id;
    this.goodsData.goods_name = res.data.goods_name;
    this.goodsData.goods_description = res.data.goods_description;
    this.goodsData.goods_price = res.data.goods_price;
    this.goodsData.isSale = res.data.on_sale ? true : false;
    this.imageUrl = "../../" + res.data.goods_imgsrc;
  },
  methods: {
    // 成功以后
    handleAvatarSuccess(res, file) {
      if (res.ok) {
        this.$message({ message: "编辑商品成功！", type: "success" });
      } else {
        this.$message({ message: "编辑商品失败！", type: "success" });
      }
      this.success = true;
      this.selectImg = false;
    },
    // 在一开始就把这个file给预览一下 结束之后清空upload供下次继续使用
    change(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (this.success) {
        this.$refs.upload.clearFiles();
        this.success = false;
      }
    },
    // 提交新增商品开始上传文件和数据
    async submit() {
      let { goods_name, goods_description, goods_price } = this.goodsData;
      if (goods_name.trim() === "") {
        this.$message({ message: "请输入商品名", type: "warning" });
        return;
      }
      if (goods_description.trim() === "") {
        this.$message({ message: "请输入商品描述信息", type: "warning" });
        return;
      }
      if (String(goods_price).trim() === "") {
        this.$message({ message: "请输入商品价格", type: "warning" });
        return;
      }
      if ("number" !== typeof this.goodsData.goods_price) {
        this.$message({ message: "商品价格必须为数字", type: "warning" });
        return;
      }
      if (!this.imageUrl) {
        this.$message({ message: "请选择商品图片", type: "warning" });
        return;
      }
      if (!this.selectImg) {
        let res = await this.$axios({
          method: "post",
          url: "/api/editgoods",
          data: {
            goods_id: this.goodsData.goods_id,
            goods_name: this.goodsData.goods_name,
            goods_description: this.goodsData.goods_description,
            goods_price: this.goodsData.goods_price,
            isSale: this.goodsData.isSale
          }
        });
        if (res.data.ok) {
          this.$message({ message: "编辑商品成功！", type: "success" });
        } else {
          this.$message({ message: "编辑商品失败！", type: "error" });
        }
        this.success = true;
        return;
      }
      this.$refs.upload.submit();
    },
    // 点击图片把之前的清空一次只提交一个图片
    clearFiles() {
      this.selectImg = true;
      this.imageUrl = "";
      this.$refs.upload.clearFiles();
    }
  }
};
</script>

<style>
.edit-goods-container {
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
.edit-goods-container .el-input {
  width: 500px;
}
.edit-goods-container .title {
  font-size: 20px;
  text-align: center;
}
.edit-goods-container .content {
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
.edit-goods-container .left {
  float: left;
  text-align: right;
}
.edit-goods-container .right {
  margin-left: 100px;
}
.edit-goods-container .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.edit-goods-container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.edit-goods-container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.edit-goods-container .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>