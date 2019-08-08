<template>
  <div class="u-module" :style="{ width: '100px', height: '100px', backgroundColor: 'red'}">
    <div class="u-picture-module"></div>
  </div>
</template>

<script>
import Draggable from '../../mixins/Draggable';
import Resizable from '../../mixins/Resizable';
import eventBus from '../../eventBus';

export default {
  mixins: [
    Draggable({}),
    Resizable(),
  ],
  data() {
    return {
    
    }
  },
  methods: {
    
  }
}
</script>