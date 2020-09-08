var express = require('express')
var router = express.Router()
const querySql = require('../db//index')

/* GET users listing. */
router.post('/login', function (req, res, next) {
	let {username,password,nickname} =  req.body
})

module.exports = router
