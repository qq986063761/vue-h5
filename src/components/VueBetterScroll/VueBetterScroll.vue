<template>
  <!-- :style="style" -->
  <div class="vue-bs-wrapper">
    <div ref="content" class="vue-bs-content">
      <slot></slot>
      <!-- <div class="pull-up-loading" v-if="pullUp && startPullUp">加载中</div> -->
    </div>
    <!-- <div class="pull-down-loading" v-if="maybePullDown && pullDown && startPullDown">
      <span class="iconfont icon-refresh icon"
        :class="{rotate: !downImgStyle && pullDowning}"
        :style="downImgStyle">
      </span>
      <span class="text" v-show="!pullDowning">
        刷新成功
      </span>
    </div> -->
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { addResizeListener, removeResizeListener, getStyle } from '@/assets/utils'
  import { debounce } from 'throttle-debounce'

  export default {
    name: 'vBs',
    props: {
      pullDown: Boolean,
      pullUp: Boolean
    },
    data() {
      return {

      }
    },
    methods: {
      init() {
        this.bs = new BScroll(this.$el, {
          // 滚动回调触发方式，0：不触发 scroll；2：触摸中滑动时触发；3：滚动过程中任何时间都触发
          probeType: 3,
          // 阻止冒泡，常用于内部还有子 better-scroll 容器的子配置
          stopPropagation: true,
          // 因为 bs 会阻止默认内部事件，所以这里需要指定哪些元素不阻止默认事件
          preventDefaultException: {
            tagName: /^(DIV|SPAN|IMG|INPUT|TABLE|TR|TH|TD|TEXTAREA|BUTTON|SELECT|AUDIO)$/
          },
          scrollbar: {
            fade: true
          },
          // 是否支持下拉刷新
          pullDownRefresh: this.pullDown ? {
            stop: 40
          } : false,
          // 是否支持上拉加载
          pullUpLoad: this.pullUp ? {
            threshold: 10
          } : false
        })

        // 下拉加载
        if (this.pullDown) {
          this.bs.on('pullingDown', () => {
            this.$emit('pull-down')
          })
        }
      }
    },
    beforeDestroy() {
      
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss">
  .vue-bs-wrapper {
    position: relative;
    overflow: hidden;
    touch-action: pan-y;

    @keyframes rotate {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .pull-down-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      height: 80px;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #999;

      .icon {
        position: relative;
        width: 40px;
        height: 40px;
        margin-right: 10px;

        &.rotate {
          animation: rotate 3s linear infinite;
        }
      }
    }
    .pull-up-loading {
      padding: 20px 0 !important;
      /deep/ .loading-icon {
        width: 60px !important;
        height: 60px !important;
      }
    }
  }

  .vue-bs-content {
    position: relative;
    z-index: 1;
  }
</style>
