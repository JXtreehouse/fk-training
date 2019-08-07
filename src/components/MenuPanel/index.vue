<template>
  <div class="u-menu-panel">
    <div class="inner">
      <div class="menu-status-bar">
        <status-bar
          :navIndex="navIndex"
          @menu-button-click="() => { this.$emit('menu-button-click') }"
          @close-click="() => { this.$emit('close-click') }"
          @nav-click="handleNavClick">
        </status-bar>
      </div>
      <div class="menu-content">
        <div class="inner">
          <div v-show="navIndex===0" class="u-content1">content1</div>
          <div v-show="navIndex===1" class="u-content2">content2</div>
          <div v-show="navIndex===2" class="u-content3">content3</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StatusBar from './StatusBar.vue';

export default {
  components: {
    'status-bar': StatusBar,
  },
  data() {
    return {
      navIndex: 0,
    }
  },
  methods: {
    handleNavClick(index) {
      this.navIndex = index;
    }
  }
}
</script>