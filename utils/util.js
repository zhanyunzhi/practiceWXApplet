const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//数组去重
const arrayUnique = array => {
  var temp = []; //一个新的临时数组
  for(var i = 0; i < array.length; i++){//遍历当前数组
    if (temp.indexOf(array[i]) == -1) temp.push(array[i]);//如果当前数组的第i已经保存进了临时数组，那么跳过，否则把当前项push到临时数组里面
  }
  return temp;
}
//函数名:  arrayRemoveByValue
//功能:    删除数组中的某个值
//输入参数: arr  被清空的数组 ;val  被删除的值
const arrayRemoveByValue = (arr, val) => {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
}
//函数名:  arrayEquals
//功能:    比较两个数组是否一样
//输入参数: arr1  数组1 ;arr2   数组2
const arrayEquals = (arr1, arr2) => {
  if (!arr1 || !arr2) return false;
  if (arr1.length != arr2.length)
    return false;
  for (var i = 0, l = arr1.length; i < l; i++) {
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      if (!arrayEquals(arr1[i],arr2[i]))
        return false;
    }
    else if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

module.exports = {
  formatTime: formatTime,
  arrayUnique: arrayUnique,
  arrayRemoveByValue: arrayRemoveByValue,
  arrayEquals: arrayEquals
}
