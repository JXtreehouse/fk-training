<template>
  <div 
    class="u-module-button"
    @click="() => onClick()">
    <slot></slot>
    <div class="u-module-double"></div>
  </div>
</template>

<script>
import Draggable from "../../mixins/Draggable";

export default {
  mixins: [
    Draggable({
      opacity: 0.7,
      helper: "clone",
      zIndex: '1000'
    })
  ],
  props: {
    name: {
      type: String,
      required: true,
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.name);
    }
  }
};
</script>