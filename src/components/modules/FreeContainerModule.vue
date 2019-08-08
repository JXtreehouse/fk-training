<template>
  <div class="u-container-module">
    <div :v-if="title" class="module-title">自由容器模块</div>
    <div class="free-container-module">
      <template v-for="(name, index) in modules">
        <component :is="name" :key="index"></component>
      </template>
    </div>
  </div>
</template>

<script>
import InputModule from './InputModule.vue';
import PictureModule from './PictureModule.vue';

import Droppable from '../../mixins/Droppable';
export default {
  mixins: [Droppable({
    accept: '.u-module-button',
    greedy: true,
    drop: function(event, ui) {
      const name = ui.draggable[0].getAttribute('data-module-name');
      this.addModule(name);
  }})],
  components: {
    'input-module': InputModule,
    'picture-module': PictureModule,
  },
  props: {
    title: String,
  },

  data() {
    return {
      modules: [],
    }
  },
  methods: {
    addModule(name) {
      if(name === 'input-module' || name === 'picture-module') {
        this.modules.push(name);
        this.$emit('add-module-sucess');
      } else {
        this.$emit('add-module-failure', name);
      }
    }
  }

}
</script>