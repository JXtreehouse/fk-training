/**
 * 封装jq库，通过高阶mixins混入到其他组件中
 */
import { bindFunctions } from '../utils';

export default function Selectable(opts) {
  return {
    mounted() {
      const self = this;
      const root = opts && opts.target || this.$el;
      const options = bindFunctions(opts, self);
      if(!root) throw Error('selectable root not exist');
      this.$root = $(root);
      this.destroyList = []
      if(options.click) {
        const onClick = options.click;
        this.$root.bind('click', onClick);
        this.destroyList.push(['click', onClick])
      }
    },
    beforeDestroy() {
      this.destroyList.forEach(entites => {
        this.$root.unbind(entites[0], entites[1]);
      });
    },
  }
}