<template>
  <div class="u-module" data-module-name="input-module" :style="style">
    <div 
      class="input-area"
      ref="inputArea"
      @dblclick="handleDoubleClick">
      {{text}}
    </div>
  </div>
</template>

<script>
import Draggable from '../../mixins/Draggable';
import Resizable from '../../mixins/Resizable';
import Emitter from '../../mixins/Emitter';

export default {
  name: 'InputModule',
  mixins: [
    Emitter,
    Draggable({}),
    Resizable(),],
  data() {
    return {
      text: '你好',
      style: {
        height: '20px',
        width: '100px',
        paddingLeft: '',
        paddingTop: '',
        fontSize: '',
        color: '',
        zIndex: '',
      }
    }
  },
  methods: {
    handleDoubleClick() {
      const dom = this.$refs.inputArea;
      if(!dom) throw Error('inputArea not exist');

      dom.setAttribute('contenteditable', true);
    }
  }

}
</script>