<template>
  <div class="u-container-module" :style="style">
    <div class="module-title">表单模块</div>
    <form class="u-form-module">
      <div class="form-title">title</div>
      <div class="form-section1">
        <label for="name">姓名：</label>
        <input-component v-model="form.name" :maxlength="50" placeholder="在此输入内容"></input-component>
      </div>
      <div class="form-section2">
        <label for="gender">性别: </label>
        <radio-group-component v-model="form.gender">
          <radio-component label="男"></radio-component>
          <radio-component label="女"></radio-component>
        </radio-group-component>
      </div>
      <div class="form-section3">
        <label for="hobby">兴趣：</label>
        <checkbox-group-component class="ex-checkbox-group" v-model="form.hobby">
          <checkbox-component class="ex-checkbox" label="篮球">篮球</checkbox-component>
          <checkbox-component class="ex-checkbox" label="足球">足球</checkbox-component>
          <checkbox-component class="ex-checkbox" label="羽毛球">羽毛球</checkbox-component>
        </checkbox-group-component>
      </div>
      <div class="form-section4">
        <label for="live">居住地：</label>
        <select-column-component v-model="form.live" :data="[{id: 0, name: '北京', level: 0},{id: 1, name: '上海', level: 0}]">
        </select-column-component>
      </div>
      <div class="form-section5">
        <label for="advice">你的建议：</label>
        <textarea v-model="form.advice" name="advice" cols="30" rows="10"></textarea>
      </div>
      <div class="form-example">
        <input type="submit" value="Subscribe!">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        gender: '',
        hobby: [],
        live: '',
        advice: '',
      },
      style: {
        height: 'auto',
        width: '100%',
        paddingLeft: '',
        paddingTop: '',
        fontSize: '',
        color: '',
        zIndex: '',
      }
    }
  },
}
</script>
