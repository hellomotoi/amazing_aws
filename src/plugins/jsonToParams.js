/**
 * 将json转为url参数
 *
 * parseParam(obj)         //name=tom&class=active
 **/
var jsonToParams = (param) => {
  let paramStr = "";
  for (let i in param) {
    paramStr += `&${i}=${param[i]}`;
  }
  return paramStr.substring(1);
};
export default jsonToParams;
