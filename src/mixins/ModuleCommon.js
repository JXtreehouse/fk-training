/**
 * 该mixin定义一些module通用的行为，例如响应hover，click等行为
 */

export default {
  methods: {
    handleClick() {
      console.log(`${this.$options.name} click!`);
    }
  },
  mounted() {
    const root = this.$el;
    if(!root) throw Error(`component: ${this.$options.name} has no this.$el`)
    root.addEventListener('click', this.handleClick.bind(this));
  }
}