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
    <template v-for="(m) in modules" >
      <component
        :is="m.type"
        :id="m.id"
        :key="m.id"
        :modules="m.modules"
        @can-add-module="handleCanAddModule"
        @throw-module="handleThrowModule"
        >
      </component>
    </template>
  </div>
</template>

<script>
import IosCopyIcon from 'vue-ionicons/dist/ios-copy.vue';
import Sortable from '../mixins/Sortable';
import Droppable from '../mixins/Droppable';
import FormModule from './modules/FormModule.vue';
import FreeContainerModule from './modules/FreeContainerModule.vue';
import { findModuleById,genarateModule } from '../utils';

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
    addModule(m) {
      if (typeof m === 'string') {
        m = genarateModule(m)
      }
      const target = this.modules;
      if(m.type === 'free-container-module' || m.type === 'form-module') {
        target.push(m);
      } else if (m.type === 'input-module' || m.type === 'picture-module') {
        const newContainer = genarateModule('free-container-module');
        newContainer.modules.push(m);
        target.push(newContainer)
      }
    },
    handleCanAddModule({
      m, targetId
    }) {
      const target = findModuleById(this.modules, targetId);
      target.modules.push(m);
    },
    handleThrowModule(m) {
      console.log('throw module');
      this.addModule(m);
    }
  }
}
</script>
