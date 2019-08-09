<template>
  <div class="u-menu-panel">
    <div class="inner">
      <div class="menu-status-bar">
        <status-bar
          :navIndex="activeIndex"
          @menu-button-click="() => { this.$emit('menu-button-click') }"
          @close-click="() => { this.$emit('close-click') }"
          @nav-click="handleNavClick">
        </status-bar>
      </div>
      <div class="menu-content">
        <div class="inner">
          <div v-show="activeIndex===0" class="u-content1">
            <collapse-panel :title="'常用'">
              <div class="inner">
                <module-button 
                  name="input-module"
                  @click="handleModuleButtonClick"
                >
                  <div class="icon">
                    <md-create-icon 
                      class="u-icon u-icon-sp1"
                      :h="'30'"
                      :w="'30'"
                    />
                  </div>
                  <div class="title">
                    <span>文本</span>
                  </div>
                </module-button>
                <module-button
                  name="picture-module"
                  @click="handleModuleButtonClick"
                >
                  <div class="icon">
                    <md-image-icon   
                      class="u-icon u-icon-sp1"
                      :h="'30'"
                      :w="'30'"
                    />
                  </div>
                  <div class="title">
                    <span>图片</span>
                  </div>
                </module-button>
                <module-button 
                  name="free-container-module"
                  @click="handleModuleButtonClick"
                >
                  <div class="icon">
                    <md-square-outline-icon 
                      class="u-icon u-icon-sp1"
                      :h="'30'"
                      :w="'30'"
                    />
                  </div>
                  <div class="title">
                    <span>自由容器</span>
                  </div>
                </module-button>
              </div>
            </collapse-panel>
            <collapse-panel :title="'互动'">
              <div class="inner">
                <module-button
                  name="form-module"
                  @click="handleModuleButtonClick"
                >
                  <div class="icon">
                    <md-listbox-icon   
                      class="u-icon u-icon-sp1"
                      :h="'30'"
                      :w="'30'"
                    />
                  </div>
                  <div class="title">
                    <span>在线表单</span>
                  </div>
                </module-button>
              </div>
            </collapse-panel>
          </div>
          <div v-show="activeIndex===1" class="u-content2">
            <div class="content2-inner">
              <template v-for="(entities, index) in activeInformation" >
                <div class="item" :key="index">
                  <label :for="entities[0]">{{ entities[1] }}:</label>
                  <input-component inputType="text" :name="entities[0]" :value="entities[2]"/>
                </div>
              </template>
            </div>
          </div>
          <div v-show="activeIndex===2" class="u-content3">
            <div class="content3-inner">
              <module-tree v-if="activeModule" :targetModule="activeModule"></module-tree>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CollapsePanel from './CollapsePanel.vue';
import MdCreateIcon from 'vue-ionicons/dist/md-create.vue';
import MdImageIcon from 'vue-ionicons/dist/md-image.vue';
import MdListBoxIcon from 'vue-ionicons/dist/md-list-box.vue';
import MdSquareOutlineIcon from 'vue-ionicons/dist/md-square-outline.vue'

import StatusBar from './StatusBar.vue';
import ModuleButton from './ModuleButton.vue';
import ModuleTree from '../ModuleTree.vue';
import mapChinese from '../../utils';

export default {
  name: 'MenuPanel',
  components: {
    'status-bar': StatusBar,
    'module-button': ModuleButton,
    'module-tree': ModuleTree,
    'collapse-panel': CollapsePanel,
    'md-create-icon': MdCreateIcon,
    'md-image-icon': MdImageIcon,
    'md-listbox-icon': MdListBoxIcon,
    'md-square-outline-icon': MdSquareOutlineIcon,
  },
  props: {
    activeIndex: Number,
    activeModule: Object,
  },
  data() {
    return {
      modules: ['常用', '互动']
    }
  },
  computed: {
    activeInformation() {
      if(!this.activeModule) return [];
      const result = [];
      Object.keys(this.activeModule.information).forEach(key => {
        const ckey = mapChinese(key);
        result.push([ key, ckey, this.activeModule.information[key] ]);
      })
      return result;
    }
  },
  methods: {
    handleNavClick(index) {
      this.$emit('nav-click', index);
    },
    handleModuleButtonClick(name) {
      this.$emit('module-button-click', name);
    },
    switchTab(number) {
      this.navIndex = number;
    }
  }
}
</script>