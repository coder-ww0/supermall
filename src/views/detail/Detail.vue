<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
<!--      <ul>-->
<!--        <li v-for="item in $store.state.cartList">{{item}}</li>-->
<!--      </ul>-->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <good-list :goods="recommends" ref="recommend"></good-list>

    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @backTop="backTop" class="back-top" v-show="isShowBackTop"></back-top>
<!--    <toast :message="message" :show="show"></toast>-->
  </div>

</template>

<script>

import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import GoodList from "@/components/content/goods/GoodList";
import BackTop from "@/components/content/backTop/BackTop";
import Scroll from "@/components/common/scroll/Scroll";
// import Toast from "@/components/common/toast/Toast";

import {getRecommend,getDeatil,Goods,Shop,GoodsParam} from "@/network/detail";
import {itemListenerMixin} from "@/common/mixin";

import {BACKTOP_DISTANCE} from '@/common/const'
import { mapActions } from 'vuex'


export default {
name: "Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodList,
    DetailBottomBar,
    BackTop

  },
  mixins:[itemListenerMixin],
  data() {
    return {
      iid:null,
      topImages:[],
      goods: {},
      shop : {},
      detailInfo:{},
      paramInfo : {},
      commentInfo :{},
      recommends:[],
      themeTopYs:[],
      currentIndex:0,
      isShowBackTop:false,
      // message:'',
      // show:false

    }
  },
  created() {
    this.iid = this.$route.params.iid
    getDeatil(this.iid).then(res =>{
      const data = res.result

      this.topImages = data.itemInfo.topImages
      //获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
      //创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      //保存商品的详细数据
      this.detailInfo = data.detailInfo
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
      if(data.rate.cRate !==0){
        this.commentInfo = data.rate.list[0]
      }
      this.$nextTick(()=>{

      })
    })
      getRecommend().then(res =>{
        this.recommends = res.data.list
      })
  },
  mounted() {
  },
  methods:{
  ...mapActions(['addCart']),
    imageLoad(){
      this.$refs.scroll.refresh()
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      console.log(this.themeTopYs)
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
    },
    contentScroll(position){

      const positionY = -position.y
      let length = this.themeTopYs.length
      for(let i = 0;i<length;i++){
        if(this.currentIndex !==i &&((i<length-1 &&positionY>=this.themeTopYs[i] &&positionY<this.themeTopYs[i+1]) || (i ===length-1 && positionY>=this.themeTopYs[i]))){
          this.currentIndex=i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      this.isShowBackTop = positionY > BACKTOP_DISTANCE
    },
    backTop(){
      this.$refs.scroll.scrollTo(0,0)
    },
    addToCart(){
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.nowPrice
      product.iid = this.iid

      // this.$store.dispatch('addCart',product).then(res =>{
      //   console.log(res)
      // })
      this.addCart(product).then(res =>{
        // this.show = true;
        // this.message = res;
        // setTimeout(() =>{
        //   this.show=false;
        //   this.message = ''
        // },1500)

        // this.$toast.show(res,20000)
        console.log(this.$toast)
        this.$toast.show(res,20000)


      })
    }
  },

  destroyed() {
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  /*height: calc(100% - 44px);*/
  position: absolute;
  top: 44px;
  bottom: 60px;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.back-top {
  position: fixed;
  right: 10px;
  bottom: 65px;
}
</style>
