<template>
<div id="home">
  <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
  <tab-control class="tab-control" :titles="['流行','新款','精选']"
               @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed"
  ></tab-control>

  <scroll class="content" ref="scroll" :probe-type="3"
          :pull-up-load="true"
          @scroll="contentScroll" @pullingUp="loadMore">
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
    <recommend-view :recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control  :titles="['流行','新款','精选']"
                 @tabClick="tabClick" ref="tabControl2"
    ></tab-control>
    <good-list :goods="showGoods"></good-list>
  </scroll>
  <back-top @click.native="backclick" v-show="isShowBackTop"></back-top>


</div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import Scroll from "@/components/common/scroll/Scroll";
import TabControl from "@/components/content/tabcontrol/TabControl";
import GoodList from "@/components/content/goods/GoodList";
import BackTop from "@/components/content/backTop/BackTop";


import HomeSwiper from "@/views/home/childcomps/HomeSwiper";
import RecommendView from "@/views/home/childcomps/RecommendView";
import FeatureView from "@/views/home/childcomps/FeatureView";



import {getHomeMultidata,getHomeGoods} from "@/network/home";
import {debounce} from "@/common/utils";
import {itemListenerMixin} from "@/common/mixin";


export default {
name: "Home",
  components:{
  NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  mixins:[itemListenerMixin],
  data(){
  return{
    banners:[],
    recommends:[],
    goods:{
      'pop':{page:0,list:[]},
      'new':{page:0,list:[]},
      'sell':{page:0,list:[]},
    },
    currentType:'pop',
    isShowBackTop:false,
    tabOffsetTop:0,
    isTabFixed:false,
    saveY:0,

  }
  },
  computed:{
  showGoods() {
    return this.goods[this.currentType].list
  }
  },
  created() {
    //请求轮播图和推荐
    this.getHomeMultidata()
    //请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')


  },
  // mounted() {
  //     let refresh = debounce(this.$refs.scroll.refresh,200)
  //     this.itemImgListener =()=>{
  //       refresh()
  //     }
  //     this.$bus.$on('itemImageLoad',this.itemImgListener)
  //
  // },
  activated() {
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {

    this.saveY = this.$refs.scroll.getScrollY()
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  methods:{
    //事件监听

    tabClick(index) {
      switch (index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType= 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index

    },
    backclick(){
      this.$refs.scroll.scrollTo(0,0)
    },
    contentScroll(position){
      this.isShowBackTop = -position.y >1000
      this.isTabFixed = -position.y>this.tabOffsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
      this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad(){
      this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop;
    },
    //网络请求相关
    getHomeMultidata(){
      getHomeMultidata().then(res=>{
        this.banners=res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page+1
      getHomeGoods(type,page).then(res =>{
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page+=1

        this.$refs.scroll.finishPullUp()
      })
    }

  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color:var(--color-tint);
  color: #fff;

  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top:0;*/
  /*z-index: 9;*/
}
.tab-control {
  /*到达固定位置黏住*/
  /*position: sticky;*/

  /*top:44px;*/
  position: relative;
  z-index: 9;
}
.content {
  /*height: 300px;*/
  overflow:hidden ;
  position: absolute;
  top:44px;
  bottom: 49px;
  left: 0;
  right: 0;
  /*margin-top: 44px;*/
}
/*.fixed {*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  top: 44px;*/
/*}*/
/*.content {*/
/*  height: calc(100% - 93px);*/
/*  overflow: hidden;*/
/*  !*margin-top: 44px;*!*/
/*}*/
</style>
