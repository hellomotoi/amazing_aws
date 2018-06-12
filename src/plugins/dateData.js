const myDate = new Date();
const thisYear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
const thisMonth = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
const thisDay = myDate.getDate();        //获取当前日(1-31)
let date = [{
  value: -1,
  label: '未确定'
}];
for (let i = 0; i < 10; i++) {
  let year = {
    value   : thisYear + i,
    label   : `${thisYear + i}年`,
    children: []
  }
  for (let k = 1; k < 13; k++) {
    let month = {
      value   : k,
      label   : `${k}月`,
      disabled: false,
      children: []
    };
    /*禁选本月之前的月份*/
    if (thisYear + i == thisYear && k < thisMonth) {
      month.disabled = true;
    }
    year.children.push(month);
    for (let j = 1; j < 32; j++) {
      let day = {
        value: j,
        label: `${j}日`,
        disabled: false
      };
      /*大月*/
      if (month.value == 1 || month.value == 3 || month.value == 5 || month.value == 7 || month.value == 8 || month.value == 10 || month.value == 12) {
        month.children.push(day);
      }
      /*二月*/
      else if (month.value == 2) {
        if (year.value % 4 == 0) {
          if (j < 30) {
            month.children.push(day);
          }
        } else {
          if (j < 29) {
            month.children.push(day);
          }
        }
      }
      /*小月*/
      else {
        if (j < 31) {
          month.children.push(day);
        }
      }
      /*禁选本日之前的日期*/
      if(year.value == thisYear && month.value == thisMonth && j < thisDay){
        day.disabled = true;
      }
    }
  }
  date.push(year);
}
export default date;
