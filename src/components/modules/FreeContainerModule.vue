<template>
  <div class="u-module u-module-container">
    <div class="module-title">自由容器模块</div>
    <div ref="freeContainer" class="free-container-module">
      <template v-for="(m) in modules">
        <component :is="m.type" :key="m.id" :id="m.id"></component>
      </template>
    </div>
  </div>
</template>

<script>

import InputModule from './InputModule.vue';
import PictureModule from './PictureModule.vue';
import Droppable from '../../mixins/Droppable';
import Resizable from '../../mixins/Resizable';
import Emitter from '../../mixins/Emitter';
import { genarateModule } from '../../utils';

export default {
  name: 'FreeContainerModule',
  mixins: [
    Emitter,
    Droppable({
      accept: '.u-module-button',
      greedy: true,
      target: function() { return this.$refs.freeContainer },
      drop: function(event, ui) {
        const name = ui.draggable[0].getAttribute('data-module-name');
        this.addModule(name);
    }}),
    Resizable({
      minHeight: '200',
      handles: 's'
    })
  ],
  components: {
    'input-module': InputModule,
    'picture-module': PictureModule,
  },
  props: {
    modules: Array,
    id: String,
  },
  methods: {
    addModule(m) {
      if (typeof m === 'string') {
        m = genarateModule(m)
      }
      if (m.type === 'input-module' || m.type === 'picture-module') {
        this.$emit('can-add-module', {
          m: m,
          targetId: this.id,
        })
      } else {
        this.$emit('throw-module', m);
      }
    }
  }
}

</script>