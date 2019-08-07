<template>
  <div>
    <button
      @click="onClick" 
      class="u-menu-btn u-menu-btn-circle u-menu-btn-shadow u-menu-btn-sp1">
      <md-app-icon :h="'20'" :w="'20'" class="btn-icon-sp1"/>
    </button>
  </div>
</template>

<script>
import MdAppsIcon from 'vue-ionicons/dist/md-apps.vue'
export default {
  components: {
    'md-app-icon': MdAppsIcon,
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
}
</script>