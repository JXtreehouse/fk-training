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
    if (!modules[i].modules.length) {
      return findModuleById(modules[i].modules, id);
    }
  }
  console.log(modules, id);
  return null;
}
