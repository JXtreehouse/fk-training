<template>
  <div class="u-module u-module-inline" :style="{ width: '100px', height: '100px', backgroundColor: 'red'}">
    <div class="u-picture-module"></div>
  </div>
</template>

<script>
import Draggable from '../../mixins/Draggable';
import Resizable from '../../mixins/Resizable';
import Selectable from '../../mixins/Selectable';
import Emitter from '../../mixins/Emitter';

export default {
  name: 'PictureModule',
  mixins: [
    Emitter,
    Selectable({
      click: onInfChange
    }),
    Draggable({
      start: onInfChange,
      stop: onInfChange,
    }),
    Resizable({
      start: onInfChange,
      stop: onInfChange,
    }),
  ],
  props: {
    id: String,
  },
  methods: {
    
  }
}



function onInfChange(event, ui) {
  const root = this.$el;
  this.dispatch('ViewContainer', '$inf-change', { targetId: this.id, inf: {
    width: root.style.width,
    height: root.style.height,
    left: root.style.left,
    top: root.style.top,
    backgroundColor: root.style.backgroundColor,
  }})
}
</script>