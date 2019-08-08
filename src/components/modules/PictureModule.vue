<template>
  <div class="u-module" :style="{ width: '100px', height: '100px', backgroundColor: 'red'}">
    <div class="u-picture-module"></div>
  </div>
</template>

<script>
import Draggable from '../../mixins/Draggable';
import Resizable from '../../mixins/Resizable';

export default {
  mixins: [
    Draggable({}),
    Resizable({
      resize(event, ui) {
        console.log(ui);
      }
    }),
  ],
  data() {
    return {
    
    }
  },
  methods: {
    onChange() {
      this.$emit('change', information)
    }
  }
}
</script>