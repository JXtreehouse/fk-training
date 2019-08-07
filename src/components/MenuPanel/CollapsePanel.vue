<template>
  <div
    class="u-collapse-panel"
  >
    <div
      class="show-content"
      @click="handleClick">
      <div 
        :class="`title ${opened ? 'z-opened' : ''}`"
        >
        {{title}}
      </div>
    </div>
    <div :class="`collapse-content ${opened ? '': 'z-collapsed'}`">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    handleClick() {
      this.opened = !this.opened;
    }
  }
}
</script>