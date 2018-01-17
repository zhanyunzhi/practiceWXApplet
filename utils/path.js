const getPath = (id) => {    //获取接口地址
  const path = {
    'practiceList': 'practice/list'
  }
  return path[id];
}


module.exports = {
  getPath: getPath
}
