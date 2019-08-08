<template>
  <div class="u-module" :style="style">
    <div class="u-picture-module"></div>
  </div>
</template>

<script>
import Draggable from '../../mixins/Draggable';

export default {
  mixins: [Draggable({
    zIndex: '1000'
  })],
  data() {
    return {
      height: '100px',
      width: '100px',
      paddingLeft: '',
      paddingTop: '',
      backgroundColor: 'blue',
      zIndex: '',
    }
  },
  computed: {
    style() {
      return {
        height: this.height,
        width: this.width,
        paddingLeft: this.paddingLeft,
        paddingTop: this.paddingTop,
        backgroundColor: this.backgroundColor,
        zIndex: this.zIndex,
      }
    }
  }
}
</script>