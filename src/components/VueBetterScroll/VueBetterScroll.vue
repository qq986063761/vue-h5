<template>
  <div class="vue-bs-wrapper" :style="style">
    <div ref="content" class="vue-bs-content">
      <div class="placeholder" v-if="placeholderStyle" :style="placeholderStyle"></div>
      <slot></slot>
      <loading class="pull-up-slot" v-if="pullUp && startPullUp"></loading>
    </div>

    <div class="pull-down-slot" v-if="maybePullDown && pullDown && startPullDown">
      <span class="iconfont icon-refresh icon"
        :class="{rotate: !downImgStyle && pullDowning}"
        :style="downImgStyle">
      </span>
      <span class="text" v-show="!pullDowning">
        刷新成功
      </span>
    </div>
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
        style: null,
        maybePullDown: false,
        pullDowning: false,
        downImgStyle: null,
        startPullUp: false,
        startPullDown: false,
        placeholderStyle: null
      }
    },
    methods: {
      resize: debounce(500, function () {
        this.refresh()
      }),
      setStyle(obj) {
        this.style = obj
      },
      scrollBy(x, y) {
        // 只有向上滚动,或者是有向下滚动的距离的时候才滚动,没有距离了就不滚动了
        if (y < 0 || y > 0 && this.bs.y < 0 && y < (-this.bs.y)) {
          this.bs.scrollBy(x, y)
          this.placeholderStyle = null
          return true
        } else {
          // 这里如果顶部没有地方可以滚动了,就垫一个相同高度的元素再滚动
          this.placeholderStyle = y ? {
            height: y + 'px',
            background: '#fff'
          } : null
          return false
        }
      },
      // 下拉刷新后告诉组件已经完毕了，优化体验
      finishPullDown() {
        this.pullDowning = false;
        this.downImgStyle = null;
        setTimeout(() => {
          this.bs.finishPullDown()
          this.startPullDown = false
        }, 500)
      },
      // 上拉加载后告诉组件已经完毕了，优化体验
      finishPullUp() {
        this.startPullUp = false
        this.bs.finishPullUp()
        console.log('finishPullUp')
      },
      // 数据有变化之后，要刷新
      refresh() {
        this.bs.refresh()
      },
      // 矫正滚动状态
      correctScrollStatus: debounce(function () {
        // 如果滚动结束后滚动条没消失,组件会以为还在滚动中,导致无法点击,则立即停止当前滚动过程
        if (getStyle(this.scrollbar).opacity === '1') {
          // 这个方法是在源码中找到的设置 pointer-event 样式的方法,因为 pointer-event 被设置为了 none 导致无法点击
          this.bs.scroller.togglePointerEvents(true)
        }

        // 滚动完成后一段时间还存在 startPullDown 则强制重置,避免下拉刷新的内容显示出来
        setTimeout(() => {
          this.startPullDown = false
        }, 500)
      }, 500),
      init() {
        let stop = 80

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
            stop
          } : false,
          // 是否支持上拉加载
          pullUpLoad: this.pullUp ? {
            threshold: 20
          } : false
        })
        const hooks = this.bs.scroller.actionsHandler.hooks

        // 下拉加载
        if (this.pullDown) {
          this.bs.on('pullingDown', event => {
            this.downImgStyle = null
            this.emitPullDown = true
            this.$emit('pull-down')
          })
        }

        hooks.on('beforeStart', event => {
          this.maybePullDown = this.bs.y
        })

        hooks.on('move', event => {
          // 如果开始触摸到滑动是向下滑，则被认为可能是要下拉刷新了
          if (this.maybePullDown === 0 && this.bs.y > 0) {
            this.maybePullDown = true
          }

          if (this.pullDown) {
            // 如果手指向下滑动
            if (this.bs.movingDirectionY < 0) {
              this.startPullDown = true
            }
          }
        })

        this.bs.on('scroll', position => {
          // 下拉时，如果开始触摸位置是顶部，才算作下拉刷新
          if (this.pullDown && this.maybePullDown) {
            if (position.y > 0) {
              if (this.emitPullDown) {
                this.downImgStyle = null
                return
              }

              this.pullDowning = true
              this.downImgStyle = {
                top: `${position.y / 3}px`,
                transform: `rotate(${position.y}deg)`
              }
            } else {
              this.pullDowning = false
              this.downImgStyle = null
            }
            this.$emit('scroll', position.y)
          }

          // 滚动后不断触发滚动状态校验
          this.correctScrollStatus() 
        })

        this.bs.on('scrollEnd', () => {
          if (this.pullDown) {
            this.emitPullDown = false
            this.startPullDown = false
          }
        })

        // 上拉加载
        if (this.pullUp) {
          this.bs.on('pullingUp', event => {
            this.startPullUp = true
            console.log('pull-up')
            this.$emit('pull-up')
          })
        }

        addResizeListener(this.$refs.content, this.resize)

        // 初始化完成后，触发一次刷新
        this.$nextTick(() => {
          this.scrollbar = this.bs.wrapper.querySelector('.bscroll-vertical-scrollbar')
          this.refresh()
        })
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

    .pull-down-slot {
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
    .pull-up-slot {
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
