/**
 * 封装jq库，通过高阶mixins混入到其他组件中
 * 在初始化opts传入函数时需要做一些转化，使得函数内的this绑定到此Droppable组件上
 */
import { bindFunctions } from '../utils';

export default function Droppable(opts) {
  return {
    mounted() {
      const self = this;
      const options = bindFunctions(opts, self);
      console.log(options)
      const root = options && options.target ? options.target() : this.$el;
      if(!root) throw Error('draggle root not exist');
      this.$root = $(root);
      this.$root.droppable(options);
    },
    beforeDestroy() {
      this.$root.droppable('destroy');
    },
  }
}

