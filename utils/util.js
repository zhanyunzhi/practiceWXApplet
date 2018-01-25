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
//����ȥ��
const arrayUnique = array => {
  var temp = []; //һ���µ���ʱ����
  for(var i = 0; i < array.length; i++){//������ǰ����
    if (temp.indexOf(array[i]) == -1) temp.push(array[i]);//�����ǰ����ĵ�i�Ѿ����������ʱ���飬��ô����������ѵ�ǰ��push����ʱ��������
  }
  return temp;
}
//������:  arrayRemoveByValue
//����:    ɾ�������е�ĳ��ֵ
//�������: arr  ����յ����� ;val  ��ɾ����ֵ
const arrayRemoveByValue = (arr, val) => {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
}
//������:  arrayEquals
//����:    �Ƚ����������Ƿ�һ��
//�������: arr1  ����1 ;arr2   ����2
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
