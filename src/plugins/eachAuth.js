/*遍历整理角色菜单*/
var eachAuth = (auth) => {
  let arr = [];
  let holdArr = [];
  auth.map(item => { //提取一级菜单
    if (!item.parentId) {
      item.children = [];
      arr.push(item);
    } else {
      holdArr.push(item);
    }
  });
  arr.map(item => { //整合一二级菜单
    holdArr.map(holdItem => {
      if (item.authId === holdItem.parentId) {
        item.children.push(holdItem);
      }
    });
  });
  return arr;
}
export default eachAuth;
