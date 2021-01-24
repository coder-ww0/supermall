<template>
<div class="wrapper" ref="wrapper">
  <div class="content">
    <slot></slot>
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
name: "Scroll",
  props:{
    probeType:{
      type : Number,
      default : 0
    },
    pullUpLoad:{
      type:Boolean,
      default: false
    }
  },
  data(){
  return {
    scroll:null
  }
  },
  mounted() {
  // this.scroll=new BScroll(document.querySelector('.wrapper'),{})
    this.scroll = new BScroll(this.$refs.wrapper,{
      // mouseWheel:true,
      // cancelable:true
      probeType: this.probeType,
      click:true,
      pullUpLoad: this.pullUpLoad
    })
    if (this.probeType === 2 || this.probeType === 3){
      this.scroll.on('scroll',(position) =>{
        this.$emit('scroll',position)
      })
    }

    // this.scroll.scrollTo(0,0)
    //监听上拉事件
    if (this.pullUpLoad){
      this.scroll.on('pullingUp',() =>{
        this.$emit('pullingUp')
      })
    }


  },
  methods:{
    scrollTo(x,y,time=300) {
      this.scroll && this.scroll.scrollTo(x,y,time)
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh(){
      this.scroll &&  this.scroll.refresh()
      console.log('----')
    },
    getScrollY(){
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
