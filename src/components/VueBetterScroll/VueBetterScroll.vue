<template>
  <div class="vue-bs-wrapper">
    <div ref="content" class="vue-bs-content">
      <slot></slot>
      <div class="pull-up-loading" v-if="pullUp">
        {{ pullUpEnd ? '~已经到底了~' : '加载中...' }}
      </div>
    </div>
    <div class="pull-down-loading" v-show="showDownLoading">
      <span class="iconfont icon-refresh icon"
        :class="{rotate: pullDowning}"
        :style="downIconStyle"
        v-show="!pullDowned">
      </span>
      <span class="text" v-show="pullDowned">
        刷新成功
      </span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { addResizeListener, removeResizeListener } from '@/assets/utils'
  import { debounce } from 'throttle-debounce'

  export default {
    name: 'vBs',
    props: {
      pullDown: Boolean,
      pullUp: Boolean
    },
    data() {
      return {
        downIconStyle: null,
        pullDowning: false,
        pullDowned: false,
        pullUpEnd: false
      }
    },
    computed: {
      showDownLoading() {
        return this.downIconStyle || this.pullDowning || this.pullDowned
      }
    },
    methods: {
      // 下拉刷新后告诉组件已经完毕了，优化体验
      finishPullDown() {
        this.pullDowning = false
        this.pullDowned = true
        setTimeout(() => {
          this.bs.finishPullDown()
          this.pullDowned = false
        }, 500)
      },
      // 上拉加载后告诉组件已经完毕了，优化体验
      finishPullUp(isEnd) {
        this.pullUpEnd = isEnd
        this.bs.finishPullUp()
      },
      refresh() {
        this.bs.refresh()
      },
      resize: debounce(500, function () {
        this.refresh()
      }),
      initEvent() {
        if (this.pullDown) {
          const hooks = this.bs.scroller.actionsHandler.hooks
          let touchMoving = false

          hooks.on('start', event => { 
            console.log('start', event)
          })

          hooks.on('move', ({ deltaX, deltaY, e }) => {
            touchMoving = true
            console.log('move', deltaX, deltaY)
          })

          this.bs.on('scroll', ({ x, y }) => {
            if (!touchMoving) return
            this.downIconStyle = {
              top: `${ y / 3 }px`,
              transform: `rotate(${ y * 2 }deg)`
            }
            // console.log('scroll', x, y)
          })

          this.bs.on('touchEnd', ({ x, y }) => {
            touchMoving = false
            this.downIconStyle = null
            console.log('touchEnd', x, y) 
          })

          // 触发下拉加载
          this.bs.on('pullingDown', () => {
            this.pullDowning = true
            this.$emit('pull-down') // 需要用户手动调用 finishPullDown 完成下拉刷新
          })
        }

        // 上拉加载
        if (this.pullUp) {
          this.bs.on('pullingUp', event => {
            this.$emit('pull-up') // 需要用户手动调用 finishPullUp 完成上拉加载
          })
        }

        addResizeListener(this.$refs.content, this.resize)
      },
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
        this.initEvent()
      }
    },
    beforeDestroy() {
      removeResizeListener(this.$refs.content, this.resize)
      this.bs.destroy()
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
        &.rotate {
          animation: rotate 3s linear infinite;
        }
      }
    }
    .pull-up-loading {
      display: flex;
      justify-content: center;
      padding: 20px 0;
      color: #999;
    }
  }

  .vue-bs-content {
    position: relative;
    z-index: 1;
  }
</style>
