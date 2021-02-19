<template>
  <div id="app">
    <router-view class="app-view"/>
  </div>
</template>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
  }

  #app {
    height: 100vh;
  }

  .app-view {
    height: 100%;
  }
</style>
