<template>
  <div class="u-status-bar">
    <span class="menu-button">
      <button
      @click="onMenuButtonClick" 
      class="u-menu-btn u-menu-btn-sp2">
      <md-app-icon :h="'20'" :w="'20'" class="u-icon"/>
    </button>
    </span>
    <ul class="nav-list">
      <template v-for="(item, index) in nav">
        <li :class="`item ${navIndex === index ? 'z-selected': ''}`" :key="index">
          <div 
            class="nav-button"
            @click="() => onNavClick(index) "
            >
            <span>{{item}}</span>
          </div>
        </li>
      </template>
    </ul>
    <span class="close-button">
      <button
      @click="onMenuButtonClick" 
      class="u-menu-btn u-menu-btn-sp2">
      <md-close-icon :h="'20'" :w="'20'" class="u-icon"/>
    </button>
    </span>
  </div>
</template>

<script>
import MdAppsIcon from 'vue-ionicons/dist/md-apps.vue'
import MdCloseIcon from 'vue-ionicons/dist/md-close.vue';

export default {
  components: {
    'md-app-icon': MdAppsIcon,
    'md-close-icon': MdCloseIcon,
  },
  props: {
    navIndex: Number,
  },
  data() {
    return {
      nav: ['新增模块', '模块信息', '当前模块']
    }
  },
  methods: {
    onNavClick(index) {
      this.$emit('nav-click', index);
    },
    onCloseButtonClick() {
      this.$emit('close-click');
    },
    onMenuButtonClick() {
      this.$emit('menu-button-click')
    }
  }
}
</script>