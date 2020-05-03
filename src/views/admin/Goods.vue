<template>
  <div class="goods-container">
    <el-button @click.native="gotoAddGoods" style="margin-bottom: 10px;">新增商品</el-button>
    <el-table :data="arrGoodsData" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="'../' + scope.row.goods_imgsrc" width="100%" :alt="scope.row.imgsrc" />
        </template>
      </el-table-column>
      <el-table-column prop="goods_id" label="商品编号"></el-table-column>
      <el-table-column prop="goods_name" label="商品名"></el-table-column>
      <el-table-column prop="goods_description" label="描述"></el-table-column>
      <el-table-column label="单价">
        <template slot-scope="scope">{{ scope.row.goods_price | rmb }}</template>
      </el-table-column>
      <el-table-column label="销售状态">
        <template slot-scope="scope">{{ scope.row.on_sale ? '在售' : '下架' }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.native="gotoEditGoods(scope.row.goods_id)">编辑商品</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { rmb } from "@/filters/index";

export default {
  name: "Goods",
  filters: {
    rmb
  },
  data() {
    return {
      arrGoodsData: [
        // {
        //   goods_id: 1,
        //   goods_name: "http:",
        //   goods_name: "信阳毛尖500",
        //   goods_description: "刚刚上架的新茶，一斤500元，欢迎各位购买品尝。",
        //   goods_price: 50000,
        //   on_sale: 1
        // }
      ]
    };
  },
  async created() {
    let res = await this.$axios({
      url: "/api/goods"
    });
    this.arrGoodsData = res.data.arrData;
  },
  methods: {
    // 给下架的商品添加className
    tableRowClassName({ row }) {
      if (!row.on_sale) {
        return "offsale";
      }
      return "";
    },
    // 点击跳转到编辑商品页面
    gotoEditGoods(id) {
      this.$router.push({ name: "EditGoods", query: { id } });
    },
    gotoAddGoods() {
      this.$router.push({ name: "AddGoods" });
    }
  }
};
</script>

<style>
.goods-container {
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
.goods-container .el-table .offsale {
  background-color: oldlace;
}
</style>