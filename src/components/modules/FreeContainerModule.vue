<template>
  <div class="u-container-module">
    <div :v-if="title" class="module-title">自由容器模块</div>
    <div class="free-container-module">
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
export default {
  mixins: [Droppable({
    accept: '.u-module-button',
    greedy: true,
    drop: function(event, ui) {
      const name = ui.draggable[0].getAttribute('data-module-name');
      console.log(name)
      this.addModule({
        type: name,
        id: uniqueString(),
        modules: [],
      });
  }})],
  components: {
    'input-module': InputModule,
    'picture-module': PictureModule,
  },
  props: {
    title: String,
    modules: Array,
    id: String,
  },
  methods: {
    addModule(m) {
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