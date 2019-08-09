<template>
  <div class="u-tree-node">
    <div class="u-tree-item" @click="handleClick">
      <span style="float-left;">{{ targetModule.type }}</span>
      <div class="item-action-btn" style="float:right;">
        <div @click.stop="handleDelete" style="float:right;">
          <md-trash-icon
            :h="'14'"
            :w="'14'" 
            style="float:right; margin-right: 5px"
            />
        </div>
        <div @click.stop="handleVisiable" style="float:right;">
          <md-eye-icon
            :h="'14'"
            :w="'14'"
            style="float:right; margin-right: 5px"
            />
        </div>
      </div>
    </div>
    <div v-show="isOpened" v-if="targetModule.modules && targetModule.modules.length">
      <div v-for="(m, index) in targetModule.modules" :key="index">
        <module-tree :targetModule="m"></module-tree>
      </div>
    </div>
  </div>
</template>


<script>
import MdEyeOffIcon from 'vue-ionicons/dist/md-eye-off.vue';
import MdEyeIcon from 'vue-ionicons/dist/md-eye.vue';
import MdTrashIcon from 'vue-ionicons/dist/md-trash.vue'

export default {
  name: 'module-tree',
  components: {
    'md-eye-icon': MdEyeIcon,
    'md-eye-off-icon': MdEyeOffIcon,
    'md-trash-icon': MdTrashIcon,
  },
  data() {
    return {
      isOpened: true,
    }
  },
  props: {
    targetModule: Object,
  },
  methods: {
    handleClick() {
      this.isOpened = !this.isOpened;
    },
    handleDelete() {
      this.$emit('module-delete', this.targetModule)
    },
    handleVisiable() {
      this.$emit('module-set-visable', {
        value: true,
        target: this.targetModule,
      })
    }
  }
}
</script>
