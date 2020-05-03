<template>
  <div class="user-container">
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="购物车" name="first">
        <div class="cart">
          <!-- 购物车表格开始 -->
          <el-table :data="arrCartData" stripe border style="width: 100%">
            <el-table-column prop="name" label="商品名"></el-table-column>
            <el-table-column label="单价">
              <template slot-scope="scope">{{ scope.row.price | rmb }}</template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  @change="handleChange($event, scope.$index)"
                  :min="0"
                  :max="10"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="小计">
              <template slot-scope="scope">{{ scope.row.price * scope.row.num | rmb}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="op-container">
            <div>商品项：{{ arrCartData.length }}</div>
            <div>价格总计：{{ total | rmb }}</div>
            <div>
              订单备注：
              <el-input
                class="order-remark"
                type="textarea"
                :rows="1"
                placeholder="请输入订单备注"
                v-model="orderRemark"
              ></el-input>
            </div>
            <div>
              当前默认收货地址：
              <span
                v-if="defaultAddress"
              >{{ defaultAddress.receiver_address }} | {{ defaultAddress.receiver_name }} | {{ defaultAddress.receiver_phone }}</span>
              <span v-else>暂无默认地址</span>
            </div>
            <el-button class="btn-buy" type="primary" @click.native.prevent="buyGoods">确认下单</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="收货地址" name="second">
        <div class="default-address-title">默认地址：</div>
        <div class="default-address">
          <div
            v-if="defaultAddress"
          >{{ defaultAddress.receiver_address }} | {{ defaultAddress.receiver_name }} | {{ defaultAddress.receiver_phone }}</div>
          <div v-else>暂无默认地址</div>
        </div>
        <div class="other-address-title">其他地址：</div>
        <el-table :data="otherAddress" stripe border style="width: 100%">
          <el-table-column prop="receiver_address" label="地址" width="300px"></el-table-column>
          <el-table-column prop="receiver_name" label="收货人"></el-table-column>
          <el-table-column prop="receiver_phone" label="手机号码"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="setDefaultAddress(scope.row.id)" type="text">设为默认</el-button>&nbsp;
              <el-button @click.native.prevent="deleteAddress(scope.row.id)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-address">
          <el-button type="primary" @click.native.prevent="addAddress">新增地址</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="历史订单" name="third">
        <!-- 历史订单表格开始 -->
        <el-table :data="orderData" :row-class-name="tableRowClassName" border style="width: 100%">
          <el-table-column prop="order_num" label="订单号"></el-table-column>
          <el-table-column prop="order_datetime" label="下单时间"></el-table-column>
          <el-table-column prop="order_remark" label="订单备注"></el-table-column>
          <el-table-column label="是否被管理员处理">
            <template slot-scope="scope">{{ scope.row.is_handle ? "已处理" : "未处理" }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="checkOrdersDetail(scope.row.order_num)"
                type="text"
              >查看详细信息</el-button>&nbsp;
              <el-button
                v-if="scope.row.is_handle"
                @click.native.prevent="deleteOrder(scope.row.order_num)"
                type="text"
              >删除此条订单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 历史订单表格结束 -->
      </el-tab-pane>
    </el-tabs>
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
      activeName: "first",
      // 下单备注
      orderRemark: "",
      // 一条默认地址
      defaultAddress: null,
      // 多条其他地址
      otherAddress: null,
      // 订单数据
      orderData: null
    };
  },
  computed: {
    // 价钱总计
    total() {
      let res = 0;
      this.$store.state.arrCartData.forEach(item => {
        res += item.price * item.num;
      });
      return res;
    },
    // store中的购物车数据
    arrCartData() {
      return this.$store.state.arrCartData;
    }
  },
  async created() {
    // 通过query来确定activeName
    if (this.$route.query.active) {
      this.activeName = this.$route.query.active;
    }
    // 取得用户名
    let userName = this.$store.state.userName;
    // 获取用户的收货地址
    let resReceiverInfo = await this.$axios({
      url: `/api/receiver?name=${userName}`
    });
    if (resReceiverInfo.data.ok) {
      let { defaultAddress, otherAddress } = resReceiverInfo.data.addressData;
      this.defaultAddress = defaultAddress;
      this.otherAddress = otherAddress;
    }
    // 获取用户的历史订单
    this.getHistoryOrders();
  },
  methods: {
    // 切换标签
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 购物车某个商品从store中移除
    deleteRow(index) {
      this.$store.commit({
        type: "deleteGoods",
        index
      });
    },
    // 购物车商品数量改变在store中改变
    handleChange(val, index) {
      if (val === 0) {
        this.deleteRow(index);
      }
    },
    // 提交订单
    async buyGoods() {
      // ====================================================================================================================
      let userName = this.$store.state.userName;
      // 购物车数据只要id和num
      let arrCartData = this.$store.state.arrCartData.map(item => {
        return {
          id: item.id,
          num: item.num
        };
      });
      // 空订单不允许提交
      if (arrCartData.length === 0) {
        this.$message({ message: "请勿提交空订单", type: "warning" });
        return;
      }
      if (!this.defaultAddress) {
        this.$confirm("您还未设置默认收货地址，现在去设置？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(
          () => {
            this.$router.push({ name: "AddAddress" });
          },
          () => {}
        );
        return;
      }
      // 向服务端发数据包括用户名，订单备注，购物车数据
      let res = await this.$axios({
        method: "post",
        url: "/api/order",
        data: {
          user_name: userName,
          order_remark: this.orderRemark,
          receiver_id: this.defaultAddress.id,
          arrCartData
        }
      });
      if (res.data.ok) {
        this.$message({ message: "成功提交订单", type: "success" });
        // 订单提交成功以后清空购物车
        this.$store.commit("clearCart");
        // 再次获取历史订单
        await this.getHistoryOrders();
        // 显示到历史订单
        this.activeName = "third";
        return;
      }
      this.$message({ message: "提交订单失败", type: "error" });
    },
    // 设为默认地址
    async setDefaultAddress(id) {
      let user_name = this.$store.state.userName;
      let res = await this.$axios({
        method: "put",
        url: "/api/receiver",
        data: {
          id,
          user_name
        }
      });
      if (res.data.ok) {
        this.$message({ message: "设置默认地址成功", type: "success" });
        // 设置好了之后直接在前端把数据交换一下 不用重新请求数据
        let index = this.otherAddress.findIndex(item => item.id === id);
        let temp = this.defaultAddress;
        this.defaultAddress = this.otherAddress.splice(index, 1)[0];
        index = 0;
        while (
          index < this.otherAddress.length &&
          this.otherAddress[index++].id < temp.id
        );
        this.otherAddress.splice(index, 0, temp);
        return;
      }
      this.$message({ message: "设置默认地址失败", type: "error" });
    },
    // 删除地址
    deleteAddress(id) {
      this.$confirm("您确认要删除这一条收货地址吗？", "删除收货地址", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        async () => {
          let res = await this.$axios({
            method: "delete",
            url: `/api/receiver?id=${id}`
          });
          if (res.data.ok) {
            this.$message({ message: "成功删除此条收货地址", type: "success" });
            let index = this.otherAddress.findIndex(item => item.id === id);
            this.otherAddress.splice(index, 1);
            return;
          }
          this.$message({ message: "删除收货地址失败", type: "error" });
        },
        () => {}
      );
    },
    // 添加新地址
    addAddress() {
      this.$router.push({ name: "AddAddress" });
    },
    // 给未处理的订单添加className
    tableRowClassName({ row }) {
      if (!row.is_handle) {
        return "not-handle";
      }
      return "";
    },
    // 查看订单详情
    checkOrdersDetail(orderNum) {
      this.$router.push({ name: "OrderDetail", query: { id: orderNum } });
    },
    // 删除一条订单记录
    async deleteOrder(orderNum) {
      this.$confirm("此操作将删除该条订单记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        async () => {
          let res = await this.$axios({
            method: "delete",
            url: `/api/order?num=${orderNum}`
          });
          if (res.data.ok) {
            this.$message({ message: "删除成功", type: "success" });
            // 后端操作成功之后前端数据直接删除掉
            let index = this.orderData.findIndex(
              item => item.order_num === orderNum
            );
            this.orderData.splice(index, 1);
            return;
          }
          this.$message({ message: "删除失败", type: "error" });
        },
        () => {}
      );
    },
    // 获取历史订单数据，进入页面调用一次，提交订单之后再次调用更新数据
    async getHistoryOrders() {
      let name = this.$store.state.userName;
      let res = await this.$axios({
        url: `/api/order?name=${name}`
      });
      if (res.data.ok) {
        this.orderData = res.data.orderData;
      }
    }
  }
};
</script>

<style>
.user-container {
  width: 1200px;
  padding: 20px;
  margin: 0 auto;
}
.user-container .el-tabs {
  min-height: 527px;
  padding: 20px;
  background: #fff;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.user-container .op-container {
  padding: 20px;
  line-height: 60px;
}
.user-container .order-remark {
  width: 300px;
  vertical-align: middle;
}
.user-container .default-address-title,
.user-container .other-address-title {
  font-size: 20px;
  margin-bottom: 20px;
}
.user-container .default-address {
  padding-left: 20px;
  margin-bottom: 20px;
}
.user-container .add-address {
  margin-top: 20px;
}
.user-container .el-table .not-handle {
  background-color: oldlace;
}
</style>