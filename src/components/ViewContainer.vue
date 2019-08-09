<template>
  <div class="u-view-container">
    <button-component
      v-if="!rootModule.modules.length"
      class="jz-button-outline-primary u-view-btn"
      @click.stop="onButtonClick">
      <span>
        <ios-copy-icon class="u-icon-inline u-icon-sp1"></ios-copy-icon>
        添加模块
      </span>
    </button-component>
    <template v-for="(m) in rootModule.modules" >
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
import uniqueString from 'unique-string';
import IosCopyIcon from 'vue-ionicons/dist/ios-copy.vue';
import Selectable from '../mixins/Selectable';
import Sortable from '../mixins/Sortable';
import Droppable from '../mixins/Droppable';
import Emitter from '../mixins/Emitter';
import FormModule from './modules/FormModule.vue';
import FreeContainerModule from './modules/FreeContainerModule.vue';
import { findModuleById,genarateModule } from '../utils';

export default {
  name: 'ViewContainer',
  mixins: [
    Emitter,
    Selectable({
      click(event) {
        event.stopPropagation();
        this.$emit('module-change', this.module)
      }
    }),
    Droppable({
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
      rootModule: {
        type: 'view-container',
        id: uniqueString(),
        information: {},
        modules: []
      },
    }
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    onButtonClick() {
      this.$emit('click', this.name);
    },
    addModule(m) {
      if (typeof m === 'string') {
        m = genarateModule(m)
      }
      const target = this.rootModule.modules;
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
      const target = findModuleById(this.rootModule, targetId);
      target.modules.push(m);
    },
    handleThrowModule(m) {
      this.addModule(m);
    },
    handleInfChange({ targetId, inf }) {
      const target = findModuleById(this.rootModule, targetId);
      Object.keys(inf).forEach(key => {
        target.information[key] = inf[key]
      })
      this.$emit('module-change', target)
    }
  },
  mounted() {
    this.$on('$inf-change', this.handleInfChange.bind(this));
  }
}
</script>
