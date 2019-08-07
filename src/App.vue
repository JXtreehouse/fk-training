<template>
  <div class="g-main">
    <div class="g-left">
      <menu-button 
        v-show="!menuPanelTriggered"
        @click="handleMenuButtonClick"
        />
      <div
        v-show="menuPanelTriggered"
        class="m-menu-panel-container">
        <menu-panel
          @menu-button-click="handleMenuButtonClick"
        >
        </menu-panel>
      </div>
    </div>
    <div class="g-center">
      <div class="m-container1">
        <view-container 
          :menuPanelTriggered="menuPanelTriggered"
        />
      </div>
      <div class="m-container2">
        <view-container 
          :menuPanelTriggered="menuPanelTriggered"
        />
      </div>
    </div>
    <div class="g-right">
      <button-component class="jz-button-primary">保存</button-component>
    </div>
    
  </div>
</template>

<script>
import ViewContainer from './components/ViewContainer.vue';
import MenuButton from './components/MenuButton.vue';
import MenuPanel from './components/MenuPanel/index.vue';

export default {
  components: {
    'view-container': ViewContainer,
    'menu-button': MenuButton,
    'menu-panel': MenuPanel
  },
  data() {
    return {
      menuPanelTriggered: false,
    }
  },
  methods: {
    handleMenuButtonClick() {
      this.menuPanelTriggered = !this.menuPanelTriggered;
    },
  }
}
</script>

