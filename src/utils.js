export function bindFunctions(obj, context) {
  let result = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'function') result[key] = obj[key].bind(context);
    else result[key] = obj[key];
  })
  return result;
}