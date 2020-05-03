<template>
  <div class="orders-container">
    <el-table :data="orderData" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="order_num" label="订单号"></el-table-column>
      <el-table-column prop="user_name" label="用户名"></el-table-column>
      <el-table-column prop="order_datetime" label="下单时间"></el-table-column>
      <el-table-column prop="order_remark" label="订单备注"></el-table-column>
      <el-table-column label="是否处理">
        <template slot-scope="scope">{{ scope.row.is_handle ? '已处理' : '未处理' }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.native="gotoEditOrder(scope.row.order_num)">查看订单详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {
      orderData: [
        {
          order_num: 1,
          user_name: "duan",
          order_datetime: "2020-04-01 20:03",
          order_remark: "快递发顺丰",
          is_handle: false
        }
      ]
    };
  },
  async created () {
    let res = await this.$axios({
      url: '/api/order'
    });
    if (res.data.ok) {
      let arrHandled = [], arrNotHandled = [];
      res.data.orderData.forEach(item => {
        if (item.is_handle) {
          arrHandled.push(item);
        } else {
          arrNotHandled.push(item);
        }
      });
      this.orderData = arrNotHandled.concat(arrHandled.reverse());
      
    }
  },
  methods: {
    tableRowClassName({ row }) {
      if (!row.is_handle) {
        return "not-handle";
      }
    },
    // 跳转到编辑订单页面
    gotoEditOrder(orderNum) {
      this.$router.push({ name: "EditOrder", query: { id: orderNum } });
    }
  }
};
</script>

<style>
.orders-container {
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
.orders-container .el-table .not-handle {
  background-color: oldlace;
}
</style>