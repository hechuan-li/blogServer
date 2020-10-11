var express = require('express')
var router = express.Router()
const querySql = require('../db/index.js')
const { PWD_SALT, PRIVATE_KEY, EXPIRESD } = require('../utiles/constant')
const md5 = require('../utiles//index.js')
const jwt = require('jsonwebtoken') //生产token的
const { password } = require('../db/config.js')
var upload = require('../utiles/imgUpload')
// var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })

/* 注册接口 */
router.post('/register', async (req, res, next) => {
	let { username, password, nickname } = req.body
	//先从数据库查找是否有注册过
	try {
		let user = await querySql('select * from user where username = ?', [
			username,
		])

		if (!user || user.length === 0) {
			console.log('未注册')
			//进行加密
			password = md5(`${password}${PWD_SALT}`)
			console.log(password)
			await querySql(
				'insert into user (username,password,nickname) value (?,?,?)',
				[username, password, nickname]
			)
			res.send({
				code: '0',
				msg: '注册成功',
			})
		} else {
			res.send({ code: '-1', msg: 'this username have registed' })
		}
	} catch (e) {
		console.log(e)
		next(e)
	}
})

/* 登陆接口 */
router.post('/login', async (req, res, next) => {
	let { acc, pass } = req.body
	//进行sql查找
	try {
		//判断是否注册过
		let user = await querySql('select username from user where username=?', [
			acc,
		])
		console.log(user)
		if (!user || user.length === 0) {
			res.send({ code: '-1', msg: 'this username has not been registed' })
		} else {
			pass = md5(`${pass}${PWD_SALT}`)
			let info = await querySql(
				'select * from user where username=? and password=?',
				[acc, pass]
			)
			if (!info || info.length === 0) {
				res.send({ code: '-2', msg: 'password incorrect' })
			} else {
				let token = jwt.sign({ acc }, PRIVATE_KEY, { expiresIn: EXPIRESD })
				console.log(info[0].head_img)
				res.send({
					code: 0,
					msg: 'login success',
					token: token,
					username: acc,
					head_img: info[0].head_img,
					user_id: info[0].id
				})
			}
		}
	} catch (e) {
		console.log(e)
	}
})

/* 获取用户信息接口 */
router.get('/info', (req, res, next) => {
	let name = req.query.username
	querySql('select id, nickname, head_img from user where username=?', [
		name,
	])
		.then((value) => {
			if (!value || value.length === 0) {
				res.send({
					code: '-1',
					msg: 'no such info',
				})
			} else {
				res.send({
					code: 0,
					msg: value[0],
				})
			}
		})
		.catch((err) => {
			if (err) throw err
		})
	// res.send('get info')
})

/* 上传图片接口 */
router.post('/upload', upload.single('header_img'), (req, res, next) => {
	let imgpath = req.file.path.split('public')[1]
	let imgUrl = 'http://192.168.1.100:3000' + imgpath
	res.send({
		code: 0,
		msg: 'upload success',
		data: imgUrl,
	})
})

/* 更新用户信息接口 */
router.post('/updateUserInfo', (req, res, next) => {
	let { nickname, imgUrl, username } = req.body
	try {
		querySql('update user set nickname=?,head_img=? where username=?', [
			nickname,
			imgUrl,
			username,
		]).then((value) => {
			res.send({
				code: 0,
				msg: 'update success',
			})
		})
	} catch (e) {
		console.log(e)
		next(e)
	}
})

//根据用户id获取用户信息
router.get('/authorInfo', async (req, res, next) => {
	let user_id = req.query.id
	let sql = 'select username, nickname from user where id=?'
	let result = await querySql(sql, [user_id])
	res.send({
		code: 0,
		msg: 'request success',
		list:result[0]
	})
})

module.exports = router
