<template>
  <div class="goods-detail-container">
    <div class="container">
      <div class="left">
        <img :src="goods_imgsrc" />
      </div>
      <div class="right">
        <span>商品名：{{ goods_name }}</span>
        <br />
        <span>商品描述：{{ goods_description }}</span>
        <br />
        <span>单价：{{ goods_price | rmb }}</span>
        <br />
        <span>购买数量：</span>
        <el-input-number v-model="goodsNum" :min="1" :max="10"></el-input-number>
        <div class="btn-container">
          <el-button type="primary" @click.native="addToCart">加入购物车</el-button>
          <el-button type="primary" @click.native="gotoCart">去购物车结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { rmb } from "@/filters/index";

export default {
  filters: {
    rmb
  },
  data() {
    return {
      // 商品数量
      goodsNum: 1,
      goods_name: "信阳毛尖500",
      goods_price: 50000,
      goods_description: "刚刚上架的新茶，一斤500元，欢迎各位购买品尝。",
      goods_imgsrc: ""
    };
  },
  async created() {
    let { id } = this.$route.query;
    let res = await this.$axios({
      url: `/api/goods?id=${id}`
    });
    if (res.data.ok) {
      this.goods_name = res.data.goods_name;
      this.goods_price = res.data.goods_price;
      this.goods_description = res.data.goods_description;
      this.goods_imgsrc = res.data.goods_imgsrc;
    }
  },
  methods: {
    // 添加商品到store中的购物车数据中
    addToCart() {
      this.$store.commit({
        type: "addGoods",
        data: {
          id: this.$route.query.id,
          name: this.goods_name,
          price: this.goods_price,
          num: this.goodsNum
        }
      });
      this.$message({
        message: `成功将 ${this.goodsNum} 件商品添加到购物车`,
        type: "success"
      });
    },
    gotoCart() {
      this.$router.push({ name: "User" });
    }
  }
};
</script>

<style scoped>
.goods-detail-container {
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
.container {
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.left img {
  width: 380px;
  margin: 0 auto;
  display: block;
}
.right span {
  display: inline-block;
  font-size: 20px;
  line-height: 76px;
}
.btn-container {
  padding-top: 28px;
}
.el-button {
  margin-right: 30px;
}
</style>