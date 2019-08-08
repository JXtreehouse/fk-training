<template>
  <div class="u-module" :style="style">
    <input :v-model="text" type="text" placeholder="在这里输入内容" maxlength="30"/>
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
      text: '',
      height: 'auto',
      width: 'auto',
      paddingLeft: '',
      paddingTop: '',
      fontSize: '',
      color: '',
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
        fontSize: this.fontSize,
        color: this.color,
        zIndex: this.zIndex,
      }
    }
  }
}
</script>