<template>
  <div
    class="u-collapse-panel"
  >
    <div class="title">
      {{title}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Array,
    title: String
  }
}
</script>