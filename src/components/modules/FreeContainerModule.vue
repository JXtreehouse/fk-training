<template>
  <div class="u-container-module">
    <div class="module-title">自由容器模块</div>
    <div class="z-placeholder"></div>
    <div ref="freeContainer" class="free-container-module">
      <template v-for="(m) in modules">
        <component :is="m.type" :key="m.id"></component>
      </template>
    </div>
  </div>
</template>

<script>
import uniqueString from 'unique-string';
import InputModule from './InputModule.vue';
import PictureModule from './PictureModule.vue';
import Droppable from '../../mixins/Droppable';
import Resizable from '../../mixins/Resizable';

export default {
  mixins: [
    Droppable({
      accept: '.u-module-button',
      greedy: true,
      target: function() { return this.$refs.freeContainer },
      drop: function(event, ui) {
        const name = ui.draggable[0].getAttribute('data-module-name');
        console.log(name);
        this.addModule({
          type: name,
          id: uniqueString(),
          modules: [],
          information: {}
        });
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
      if (m.type === 'input-module' || m.type === 'picture-module') {
        console.log(this.id);
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