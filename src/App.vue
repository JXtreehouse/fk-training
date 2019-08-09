<template>
  <div class="g-main">
    <div class="g-left">
      <menu-button 
        v-show="!menuPanel.menuPanelTriggered"
        @click="handleMenuButtonClick"
        />
      <div
        v-show="menuPanel.menuPanelTriggered"
        class="m-menu-panel-container">
        <menu-panel
          ref="menuPanel"
          :activeIndex="menuPanel.activeIndex"
          :activeModule="activeModule"
          @menu-button-click="handleMenuButtonClick"
          @nav-click="handleNavClick"
          @module-button-click="handleModuleButtonClick"
        >
        </menu-panel>
      </div>
    </div>
    <div class="g-center">
      <div class="m-container1">
        <view-container
          name="1"
          ref="viewContainer1"
          :activeModule="activeModule"
          @click="handleViewContainerClick"
          @module-change="handleViewContainerModuleChange"
        />
      </div>
      <div class="m-container2">
        <view-container 
          name="2"
          ref="viewContainer2"
          :activeModule="activeModule"
          @click="handleViewContainerClick"
          @module-change="handleViewContainerModuleChange"
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
import Emitter from './mixins/Emitter';
export default {
  mixins: [Emitter],
  components: {
    'view-container': ViewContainer,
    'menu-button': MenuButton,
    'menu-panel': MenuPanel
  },
  data() {
    return {
      activeViewContainer: '1',
      activeModule: null,
      menuPanel: {
        activeIndex: 0,
        menuPanelTriggered: false,
      }
    }
  },
  methods: {
    handleNavClick(index) {
      this.menuPanel.activeIndex = index;
    },
    handleMenuButtonClick() {
      this.menuPanel.menuPanelTriggered = !this.menuPanel.menuPanelTriggered;
    },
    handleViewContainerClick(name) {
      this.activeViewContainer = name;
      this.menuPanel.menuPanelTriggered = true;
      this.menuPanel.activeIndex = 0;
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
    },
    handleViewContainerModuleChange(target) {
      this.menuPanel.activeIndex = 1; //强制切换到信息版
      this.activeModule = target;
    }
  },

}
</script>

