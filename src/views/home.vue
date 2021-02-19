<template>
  <div class="home">
    <div class="item" v-for="item in btns" :key="item.value" @click="clickItem(item)">{{ item.label }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btns: [{
        value: 'vBs',
        label: 'vue-better-scroll'
      }]
    }
  },
  methods: {
    clickItem(item) {
      this.$router.push({
        name: item.value
      })
    }
  }
}
</script>

<style lang="scss">
  .home {
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 90px;
      background-color: $primaryColor;
      color: #fff;
      font-size: 42px;
      &:active {
        background-color: mix(#000, $primaryColor, 10%);
      }
    }
  }
</style>
