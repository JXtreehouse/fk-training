import uniqueString from 'unique-string';

export function bindFunctions(obj, context) {
  if(!obj) return;
  let result = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'function') result[key] = obj[key].bind(context);
    else result[key] = obj[key];
  })
  return result;
}

export function findModuleById(modules, id) {
  for (let i = 0; i <　modules.length; i++) {
    if (modules[i].id === id) return modules[i];
    if (modules[i].modules.length) {
      return findModuleById(modules[i].modules, id);
    }
  }

  throw Error(`can't find module:${id}`);
}
export function genarateModule(name) {
  const result = {
    type: name,
    id: uniqueString(),
    modules: [],
  };

  switch (name) {
    case 'input-module':
      result.information = {
        width: '',
        height: '',
        left: '',
        top: '',
        fontSize: '',
        text: '',
        color: '',
      }
      break;
    case 'picture-module':
      result.information = {
        width: '',
        height: '',
        left: '',
        top: '',
        picLink: '',
      }
      break;
    case 'free-container-module':
      result.information = {
        height: '',
      }
      break;
    case 'form-module':
      result.information = {
        name: '',
        gender: '',
        hobby: [],
        live: '',
        advice: '',
      }
      break;
    default:
      break;
  }

  return result;

}

const map =  {
  'picture-module': '图片模块',
  'input-module': '文本模块',
  'free-container-module': '自由容器模块',
  'form-module': '表单模块',
  width: '模块宽度',
  height: '模块高度',
  left: '模块左距',
  top: '模块顶距',
  level: '模块层级',
  picLink: '图片连接',
  color: '文本颜色',
  content: '文本内容',
  font: '文本字号',
  backgroundColor: '背景颜色'
}

export default function mapChinese(str) {
  return map[str];
}