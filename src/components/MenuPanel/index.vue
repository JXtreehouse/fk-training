<template>
  <div class="u-menu-panel">
    <div class="inner">
      <div class="menu-status-bar">
        <status-bar
          :navIndex="navIndex"
          @menu-button-click="() => { this.$emit('menu-button-click') }"
          @close-click="() => { this.$emit('close-click') }"
          @nav-click="handleNavClick">
        </status-bar>
      </div>
      <div class="menu-content">
        <div class="inner">
          <div v-show="navIndex===0" class="u-content1">
            <collapse-panel :title="'常用'">
              <div class="inner">
                <module-button>
                  <div class="icon">
                    <md-create-icon 
                      class="u-icon u-icon-sp1"
                      :h="'40'"
                      :w="'40'"
                    />
                  </div>
                  <div class="title">
                    <span>文本</span>
                  </div>
                </module-button>
                <module-button>
                  <div class="icon">
                    <md-image-icon   
                      class="u-icon u-icon-sp1"
                      :h="'40'"
                      :w="'40'"
                    />
                  </div>
                  <div class="title">
                    <span>图片</span>
                  </div>
                </module-button>
              </div>
            </collapse-panel>
            <collapse-panel :title="'互动'">
              <div class="inner">
                <module-button>
                  <div class="icon">
                    <md-listbox-icon   
                      class="u-icon u-icon-sp1"
                      :h="'40'"
                      :w="'40'"
                    />
                  </div>
                  <div class="title">
                    <span>在线表单</span>
                  </div>
                </module-button>
              </div>
            </collapse-panel>
          </div>
          <div v-show="navIndex===1" class="u-content2">content2</div>
          <div v-show="navIndex===2" class="u-content3">content3</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StatusBar from './StatusBar.vue';
import CollapsePanel from './CollapsePanel.vue';
import MdCreateIcon from 'vue-ionicons/dist/md-create.vue';
import MdImageIcon from 'vue-ionicons/dist/md-image.vue';
import MdListBoxIcon from 'vue-ionicons/dist/md-list-box.vue';
import ModuleButton from './ModuleButton.vue';

export default {
  components: {
    'status-bar': StatusBar,
    'module-button': ModuleButton,
    'collapse-panel': CollapsePanel,
    'md-create-icon': MdCreateIcon,
    'md-image-icon': MdImageIcon,
    'md-listbox-icon': MdListBoxIcon,
  },
  data() {
    return {
      navIndex: 0,
      modules: ['常用', '互动']
    }
  },
  methods: {
    handleNavClick(index) {
      this.navIndex = index;
    }
  }
}
</script>