# 官方文档：https://better-scroll.github.io/docs/zh-CN/guide/

```vue
<template>
  <vue-bs
    ref="bs" 
    :pull-down="true"
    :pull-up="true"
    @pull-down="pullDown" 
    @pull-up="pullUp">
    <div>
      很多内容很多内容很多内容
    </div>
  </vue-bs>
</template>

<script>
  export default {
    methods: {
      pullDown() {
        console.log('pullDown：这里要调用组件内部的 finishPullDown 方法结束下拉加载')
        this.bs.finishPullDown()
      },
      pullUp() {
        console.log('pullUp：这里要调用组件内部的 finishPullUp 方法结束下拉加载')
        this.bs.finishPullUp()
      }
    }
  }
</script>
```