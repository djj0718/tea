<template>
  <div class="order-detail">
    <el-button @click.native.prevent="goBack">&lt; 返回历史订单</el-button>
    <div class="head">
      <div class="title">订单详情</div>
      <div>订单号：{{ order_num }}</div>
    </div>
    <!-- 订单详细表格开始 -->
    <el-table :data="goodsData" stripe border style="width: 100%">
      <el-table-column prop="goods_name" label="商品名"></el-table-column>
      <el-table-column label="单价">
        <template slot-scope="scope">{{ scope.row.goods_price | rmb }}</template>
      </el-table-column>
      <el-table-column prop="goods_number" label="数量"></el-table-column>
      <el-table-column label="小计">
        <template slot-scope="scope">{{ scope.row.goods_price * scope.row.goods_number | rmb }}</template>
      </el-table-column>
    </el-table>
    <!-- 订单详细表格结束 -->
    <div class="total">总计：{{ total | rmb }}</div>
    <div class="receiver-info">收货信息： {{ receiver_address }} | {{ receiver_name }} | {{ receiver_phone }}</div>
    <div class="delivery">
      物流单号：
      <span v-if="!delivery_num">暂时没有物流信息</span>
      <span>{{ delivery_num }}</span>
    </div>
  </div>
</template>

<script>
import { rmb } from "@/filters";
export default {
  filters: {
    rmb
  },
  data() {
    return {
      // 订单号
      order_num: 0,
      // 订单商品数据
      goodsData: [],
      // 物流单号
      delivery_num: null,
      // 用户下单时候的收货信息
      receiver_address: "",
      receiver_name: "",
      receiver_phone: ""
    };
  },
  computed: {
    total() {
      let res = 0;
      this.goodsData.forEach(item => {
        res += item.goods_price * item.goods_number;
      });
      return res;
    }
  },
  async created() {
    this.order_num = this.$route.query.id;
    let res = await this.$axios({
      url: `/api/orderdetail?num=${this.order_num}`
    });
    if (res.data.ok) {
      this.goodsData = res.data.goodsData;
      this.delivery_num = res.data.delivery_num;
      this.receiver_address = res.data.receiver_address;
      this.receiver_name = res.data.receiver_name;
      this.receiver_phone = res.data.receiver_phone;
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: "User", query: { active: "third" } });
    }
  }
};
</script>

<style scoped>
.order-detail {
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
.head {
  margin-bottom: 20px;
}
.title {
  text-align: center;
  font-size: 20px;
}
.el-table {
  margin-bottom: 20px;
}
.total,
.receiver-info,
.delivery {
  margin-bottom: 20px;
}
.delivery span {
  margin-right: 20px;
}
</style>