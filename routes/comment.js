var express = require('express')
var router = express.Router()
const querySql = require('../db/index.js')

//发表评论
router.post('/public', async (req, res, next) => {
  let { article_id, content, user_id,nickname , head_img} = req.body.params
  try {
    let sql ='insert into comment (cm_content,user_id,article_id,head_img,nickname,publish_time) values (?,?,?,?,?,NOW())'
    let result = await querySql(sql, [content, user_id, article_id, head_img, nickname])

    res.send({
      code: 0,
      msg: 'post comment sucess',
      data:result
    })
  } catch (error) {
    console.log(error);
  }
  
})

//评论列表接口
router.get('/list', async (req, res, next) => {
  let article_id = req.query.id
  try {
    let sql =
			'select id,head_img,nickname,cm_content,DATE_FORMAT(publish_time,"%d-%m-%Y %H:%i:%s") AS publish_time from comment where article_id=?'
    let result = await querySql(sql, [article_id])
    res.send({
      code: 0,
      msg: 'comment list',
      list:result
    })
  } catch (error) {
    console.log(error);
  }
})

module.exports = router