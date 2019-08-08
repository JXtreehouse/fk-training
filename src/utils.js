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
        link: '',
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