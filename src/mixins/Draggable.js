/**
 * 封装jq库，通过高阶mixins混入到其他组件中
 */
import { bindFunctions } from '../utils';

export default function Draggable(opts) {
  return {
    mounted() {
      const self = this;
      const root = opts && opts.target || this.$el;
      if(!root) throw Error('draggle root not exist');
      this.$root = $(root);
      this.$root.draggable(bindFunctions(opts, self));
    },
    beforeDestroy() {
      this.$root.draggable('destroy');
    },
  }
}