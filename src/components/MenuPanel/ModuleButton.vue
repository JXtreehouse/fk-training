<template>
  <div class="u-module-button">
    <slot></slot>
    <div class="u-module-double"></div>
  </div>
</template>

<script>
import Draggable from '../../mixins/Draggable';

export default {
  mixins:[Draggable],
}
</script>