/**
 * 封装jq库，通过高阶mixins混入到其他组件中
 */

export default function Draggable(opts) {
  return {
    mounted() {
      const root = this.$el;
      if(!root) throw Error('draggle root not exist');
      this.$root = $(root);
      this.$root.draggable(opts);
    },
    beforeDestroy() {
      this.$root.draggable('destroy');
    },
  }
}