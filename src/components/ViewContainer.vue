<template>
  <div class="u-view-container">
    <button-component
      v-if="!modules.length"
      class="jz-button-outline-primary u-view-btn"
      @click="onClick">
      <span>
        <ios-copy-icon class="u-icon-inline u-icon-sp1"></ios-copy-icon>
        添加模块
      </span>
    </button-component>
    <template v-for="(item, index) in modules" >
      <div :key="index">{{ item }}</div>
    </template>
  </div>
</template>

<script>
import IosCopyIcon from 'vue-ionicons/dist/ios-copy.vue';
import Sortable from '../mixins/Sortable';
import Droppable from '../mixins/Droppable';

export default {
  mixins: [Droppable({
    accept: '.u-module-button',
    drop: function() {
      this.modules.push('helloworld');
    },
  }), Sortable({ revert: true })],
  components: {
    'ios-copy-icon': IosCopyIcon
  },
  data() {
    return {
      modules: [],
    }
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$emit('click', this.name);
    },
    addModule(name) {
      this.modules.push(name);
    }
  }
}
</script>
