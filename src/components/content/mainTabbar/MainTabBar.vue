<template>
  <tab-bar>
    <tab-bar-item path="/home" activeColor="yellow">
      <img src="../../../assets/img/tabbar/home.svg" alt="" slot="item-icon" >
      <img src="../../../assets/img/tabbar/home_active.svg" alt="" slot="item-icon-active">
      <div slot="item-text" >主页</div>
    </tab-bar-item>
    <tab-bar-item path="/category" active-color="purple">
      <img src="../../../assets/img/tabbar/category.svg" alt="" slot="item-icon">
      <img src="../../../assets/img/tabbar/category_active.svg" alt="" slot="item-icon-active">
      <div slot="item-text">分类</div>
    </tab-bar-item>
    <tab-bar-item path="/cart">
      <img src="../../../assets/img/tabbar/cart.svg" alt="" slot="item-icon">
      <img src="../../../assets/img/tabbar/cart_active.svg" alt="" slot="item-icon-active">
      <div slot="item-text">购物车</div>
    </tab-bar-item>
    <tab-bar-item path="profile">
      <img src="../../../assets/img/tabbar/profile.svg" alt="" slot="item-icon">
      <img src="../../../assets/img/tabbar/profile_active.svg" alt="" slot="item-icon-active">
      <div slot="item-text">我的</div>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
import TabBar from '../../common/tabbar/TabBar'
import TabBarItem from '../../common/tabbar/TabBarItem'

export default {
  name: "MainTabBar",
  components:{
    TabBar,
    TabBarItem
  }
}
</script>

<style scoped>

</style>
