/**
 * 封装jq sortable库，通过高阶mixins混入到其他组件中
 */
import { bindFunctions } from '../utils';

export default function Sortable(opts) {
  return {
    mounted() {
      const self = this;
      const root = this.$el;
      if(!root) throw Error('draggle root not exist');
      this.$root = $(root);
      this.$root.sortable(bindFunctions(opts, self));
    },
    beforeDestroy() {
      this.$root.sortable('destroy');
    },
  }
}