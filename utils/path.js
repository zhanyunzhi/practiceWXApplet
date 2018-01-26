const getPath = (id) => {    //获取接口地址
  const path = {
    'practiceList': 'practice/list',
    'questionsAfter': 'practice/chapter/questions_after',
    'list': 'practice/chapter/list',
  }
  return path[id];
}


module.exports = {
  getPath: getPath
}
