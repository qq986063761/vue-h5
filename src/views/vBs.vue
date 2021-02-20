<template>
  <div class="vbs">
    <v-bs 
      ref="bs"
      :pull-down="true"
      :pull-up="true"
      @pull-down="pullDown"
      @pull-up="pullUp">
      <div class="item" v-for="n in total" :key="n">
        很多内容很多内容很多内容很多内容很多内容很多内容
      </div>
    </v-bs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 100
    }
  },
  methods: {
    pullDown() {
      console.log('pull-down')
      setTimeout(() => {
        this.$refs.bs.finishPullDown()
      }, 2000)
    },
    pullUp() {
      if (this.total >= 200) return
      
      console.log('pull-up')
      setTimeout(() => {
        this.total += 50
        this.$refs.bs.finishPullUp(this.total >= 200)
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
  .vbs {
    .vue-bs-wrapper {
      height: 100%;
    }
  }
</style>
