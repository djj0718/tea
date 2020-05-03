import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        // 用户登录信息
        userName: '',
        // 购物车数据
        arrCartData: [
            // {
            //     id: 1,
            //     name: "信阳毛尖500",
            //     price: 50000,
            //     num: 5
            // }
        ]
    },
    mutations: {
        // 保存用户信息
        saveUserName(state, payload) {
            state.userName = payload.userName;
        },
        // 退出登录
        logout(state) {
            state.userName = "";
        },
        // 添加商品到购物车
        addGoods(state, payload) {
            // 添加同一件商品，只需加num就行了
            let index = state.arrCartData.findIndex(item => item.id === payload.data.id);
            if (index !== -1) {
                state.arrCartData[index].num += payload.data.num;
            } else {
                state.arrCartData.push(payload.data);
            }
        },
        // 从购物车删除一项商品
        deleteGoods(state, payload) {
            state.arrCartData.splice(payload.index, 1);
        },
        // 清空购物车
        clearCart (state) {
            state.arrCartData.splice(0, state.arrCartData.length);
        }
    }
});
export default store;