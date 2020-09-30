var express = require('express')
var router = express.Router()
const querySql = require('../db/index.js')

//新增接口
router.post('/add', async (req, res, next) => {
	let { title, content, user } = req.body
	let result = await querySql('select id from user where username=?', [user])
	let userid = result[0].id
	await querySql(
		'insert into article (title, content,user_id,publish_date) values(?,?,?,NOW())',
		[title, content, userid]
	)
	res.send({
		code: 0,
		msg: 'insert success',
	})
})

//获取所有文章接口
router.get('/allArticle', async (req, res, next) => {
	let sql =
		'select id, title, content, DATE_FORMAT(publish_date,"%d-%m-%Y %H:%i:%s") AS publish_date from article'
	let result = await querySql(sql)
	res.send({
		code: 0,
		msg: 'success',
		list: result,
	})
})

//获取当前用户的所有文章接口
router.get('/myArticle', async (req, res, next) => {
	let username = req.query.username
	let userId = await querySql('select id from user where username=?', [
		username,
	])

	let result = await querySql(
		'select id, title, content, DATE_FORMAT(publish_date,"%d-%m-%Y %H:%i:%s") AS publish_date from article where user_id=?',
		[userId[0].id]
	)
	res.send({
		code: 0,
		msg: 'myArticle',
		list: result,
	})
})

//获取博客详情接口
router.get('/detail', async (req, res, next) => {
	let article_id = req.query.article_id
	try {
		let sql =
			'select title, content, user_id,DATE_FORMAT(publish_date,"%d-%m-%Y %H:%i:%s") AS publish_date from article where id=?'
		let result = await querySql(sql, [article_id])
		let u_id = result[0].user_id
		let author = await querySql('select nickname from user where id=?',[u_id])
		res.send({
			code: 0,
			msg: 'success',
			article: result[0],
			author:author[0].nickname
		})
	} catch (err) {
		if (err) throw err
	}
})

//博客编辑接口
router.post('/update', async (req, res, next) => {
	let { article_id, title, content } = req.body.params
	console.log(article_id);
	try {
		let sql = 'update article set title=?, content=? where id=?'
		await querySql(sql, [title, content, article_id])
		res.send({
			code: 0,
			msg: 'update success',
			data: null,
		})
	} catch (error) {
		console.log(error) 
	}
})

//博客删除接口
router.post('/delete', async (req, res, next) => {
	let { article_id } = req.body
	try {
		let sql = 'delete from article where id=?'
		let result = await querySql(sql, [article_id])
		res.send({
			code: 0,
			msg: 'delete success',
			data:null
		})
	} catch (error) {
		console.log(error);
		next(e)
	}
	
})

module.exports = router
