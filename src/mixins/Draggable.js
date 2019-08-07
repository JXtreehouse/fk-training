export default {
  mounted() {
    const root = this.$el;
    if(!root) throw Error('draggle root not exist');

    $(root).draggable();
  },
}