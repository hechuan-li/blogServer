var express = require('express')
var router = express.Router()
const querySql = require('../db/index.js')

//add new todolist item
router.post('/add', async (req, res, next) => {
	let info = req.body.params
	let { content, level, progress, dashboard, deadline } = req.body.params.form
	console.log(info)
	try {
		let sql =
			'insert into todo (user_id, content, level, progress, dashboard, deadline) value (?,?,?,?,?,?)'
		let result = await querySql(sql, [
			info.user_id,
			content,
			level,
			progress,
			dashboard,
			deadline,
		])
		console.log(result)
		res.send('done')
	} catch (e) {
		console.log(e)
		next(e)
	}
})

//get list
router.get('/list', async (req, res, next) => {
	let info = req.query.user_id
	try {
		let sql = 'select * from todo where user_id=?'
		let result = await querySql(sql, info)
		// console.log(result)
		if (result) {
			res.send({
				code: 0,
				msg: 'success',
				list: result,
			})
		}
	} catch (error) {
		console.log(e)
		next(e)
	}
})

//update list
router.post('/update', async (req, res, next) => {
	let { deadline, progress, id, level } = req.body
	console.log(deadline, progress)
	try {
		if (level && level === 3) {
			let sql = 'update todo set level=3 where id=?'
			let result = await querySql(sql, [id])
			if (result) {
				res.send({
					code: 0,
					msg: 'Update Sucess',
				})
			} else {
				res.send({
					code: 1,
					msg: 'Update Fail',
				})
			}
		} else {
			let sql = 'update todo set deadline=?, progress=? where id=?'
			let result = await querySql(sql, [deadline, progress, id])
			if (result) {
				res.send({
					code: 0,
					msg: 'Update Sucess',
				})
			} else {
				res.send({
					code: 1,
					msg: 'Update Fail',
				})
			}
		}
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
