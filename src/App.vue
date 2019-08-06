<template>
  <div class="g-main">
    <div class="g-center">
      <div class="m-container1">
        <view-container />
      </div>
      <div class="m-container2">
        <view-container />
      </div>
    </div>
    <div class="g-left">
      <button>menu</button>
    </div>
    <div class="g-right">
      <button-component>保存</button-component>
    </div>
  </div>
</template>

<script>
import ViewContainer from './components/ViewContainer.vue';

export default {
  components: {
    'view-container': ViewContainer
  }
}
</script>

