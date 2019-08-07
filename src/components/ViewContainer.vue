<template>
  <div class="u-view-container">
    <button-component
      class="jz-button-outline-primary u-view-btn"
      v-if="!menuPanelTriggered"
      @click="onClick">
      <span>
        <ios-copy-icon class="u-icon-inline btn-icon-sp1"></ios-copy-icon>
        添加模块
      </span>
    </button-component>
  </div>
</template>

<script>
import IosCopyIcon from 'vue-ionicons/dist/ios-copy.vue';
export default {
  components: {
    'ios-copy-icon': IosCopyIcon
  },
  props: {
    menuPanelTriggered: Boolean,
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
}
</script>
