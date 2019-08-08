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
    <template v-for="(name, index) in modules" >
      <component :is="name" :key="index" @add-module-failure="handleAddModuleFailure"></component>
    </template>
  </div>
</template>

<script>
import IosCopyIcon from 'vue-ionicons/dist/ios-copy.vue';
import Sortable from '../mixins/Sortable';
import Droppable from '../mixins/Droppable';
import InputModule from './modules/InputModule.vue';
import PictureModule from './modules/PictureModule.vue';
import FormModule from './modules/FormModule.vue';
import FreeContainerModule from './modules/FreeContainerModule.vue';

export default {
  mixins: [Droppable({
    accept: '.u-module-button',
    greedy: true,
    drop: function(event, ui) {
      const name = ui.draggable[0].getAttribute('data-module-name');
      this.addModule(name);
    },
  }), Sortable({ revert: true })],
  components: {
    'ios-copy-icon': IosCopyIcon,
    'input-module': InputModule,
    'picture-module': PictureModule,
    'form-module': FormModule,
    'free-container-module': FreeContainerModule,
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
      if(name === 'free-container-module' || name === 'form-module') {
        this.modules.push(name);
        this.$emit('add-module-sucess');
      } else {
        this.modules.push('free-container-module');
      }
    },
    handleAddModuleFailure(name) {
      this.addModule(name)
    }
  }
}
</script>
