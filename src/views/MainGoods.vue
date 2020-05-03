<template>
  <div class="container">
    <!-- 走马灯 -->
    <div id="carousel">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="item in carouselImages" :key="item">
          <img width="100%" :src="item" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 走马灯结束 -->
    <!-- 卡片开始 -->
    <div class="goods-container">
      <el-card
        v-for="item in arrGoods"
        :key="item.goods_id"
        :body-style="{ padding: '0px'}"
        @click.native="gotoDetail(item.goods_id)"
      >
        <img :src="item.goods_imgsrc" width="100%" :alt="item.goods_name" />
        <div class="card-info">
          <div class="info clearfix">
            <h3 class="price">{{ item.goods_price | rmb }}</h3>
            <span class="name">{{ item.goods_name }}</span>
          </div>
          <span class="description">{{ item.goods_description }}</span>
        </div>
      </el-card>
    </div>
    <!-- 卡片结束 -->
  </div>
</template>

<script>
import c5 from '@/assets/img-carousel/c5.jpg';
import c6 from '@/assets/img-carousel/c6.jpg';
import c7 from '@/assets/img-carousel/c7.jpg';
import c8 from '@/assets/img-carousel/c8.jpg';
import c9 from '@/assets/img-carousel/c9.jpg';
import c10 from '@/assets/img-carousel/c10.jpg';
import { rmb } from '@/filters/index';

export default {
  filters: {
    rmb
  },
  data() {
    return {
      carouselImages: [
        c5, c6, c7, c8, c9, c10
      ],
      arrGoods: [
        // {
        //   goods_id: 1,
        //   goods_name: "信阳毛尖500",
        //   goods_description: "刚上架的新茶，欢迎大家购买品尝",
        //   goods_price: 50000,
        //   goods_imgsrc: "api/images/logo1587036194649.png",
        // }
      ]
    };
  },
  async created () {
    let res = await this.$axios({
      url: '/api/goods'
    });
    this.arrGoods = res.data.arrData.filter(item => item.on_sale === 1);
  },
  methods: {
    gotoDetail(id) {
      this.$router.push({ name: "GoodsDetail", query: { id } });
    }
  }
};
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
#carousel {
  margin-bottom: 20px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.goods-container {
  /* display: flex;
  flex-wrap: wrap;
  justify-content: space-between; */
  width: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 25px;
}
.el-card {
  width: 100%;
  height: 400px;
}
.el-card:hover {
  cursor: pointer;
  box-shadow: 0px 5px 20px 0 rgba(0, 0, 0, 0.4);
}
.clearfix::before,
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.card-info {
  padding: 10px 30px 10px;
}
.card-info .info {
  margin-bottom: 10px;
}
.card-info .price {
  margin: 0;
  color: rgb(255, 68, 0);
  float: left;
}
.card-info .name {
  margin: 0;
  line-height: 25px;
  float: right;
}
.card-info .description {
  font-size: 12px;
}
</style>