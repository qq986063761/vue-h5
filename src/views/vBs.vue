<template>
  <div class="vbs">
    <v-bs 
      :pull-down="true"
      @pull-down="pullDown">
      <div class="item" v-for="n in total" :key="n">
        很多内容很多内容很多内容很多内容很多内容
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
