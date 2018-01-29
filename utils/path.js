const getPath = (id) => {    //获取接口地址
  const path = {
    'practiceChapterList': 'practice_chapter_list',
    'practiceList': 'practice_list',
    'questionsAfter': 'practice_questions_after',
  }
  return path[id];
}


module.exports = {
  getPath: getPath
}
