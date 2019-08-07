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
          @module-button-click="handleModuleButtonClick"
        >
        </menu-panel>
      </div>
    </div>
    <div class="g-center">
      <div class="m-container1">
        <view-container
          name="1"
          @click="handleViewContainerClick"
          ref="viewContainer1"
        />
      </div>
      <div class="m-container2">
        <view-container 
          name="2"
          @click="handleViewContainerClick"
          ref="viewContainer2"
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
      activeViewContainer: '1',
      menuPanelTriggered: false,
    }
  },
  methods: {
    handleMenuButtonClick() {
      this.menuPanelTriggered = !this.menuPanelTriggered;
    },
    handleViewContainerClick(name) {
      this.activeViewContainer = name;
      this.menuPanelTriggered = true;
    },
    handleModuleButtonClick(name) {
      switch (this.activeViewContainer) {
        case '1':
          this.$refs.viewContainer1.addModule(name);
          break;
        case '2':
          this.$refs.viewContainer2.addModule(name);
          break;
        default:
          break;
      }
    }
  }
}
</script>

