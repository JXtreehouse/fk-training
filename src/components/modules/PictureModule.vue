<template>
  <div class="u-module" :style="{ width: '100px', height: '100px', backgroundColor: 'red'}">
    <div class="u-picture-module"></div>
  </div>
</template>

<script>
import Draggable from '../../mixins/Draggable';
import Resizable from '../../mixins/Resizable';
import Emitter from '../../mixins/Emitter';

export default {
  name: 'PictureModule',
  mixins: [
    Emitter,
    Draggable({}),
    Resizable({
      stop(event, ui) {
        this.dispatch('ViewContainer', '$inf-change', { targetId: this.id, inf: {
          width: ui.size.width,
          height: ui.size.height,
          left: ui.position.left,
          top: ui.position.top,
        }})
      }
    }),
  ],
  props: {
    id: String,
  },
  methods: {
    
  }
}
</script>