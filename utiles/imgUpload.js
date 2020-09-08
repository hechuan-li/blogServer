var multer = require('multer')
const path = require('path')
const fs = require('fs')
// var upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
	//设置上传的文件路径
	destination: function (req, file, cb) {
		let date = new Date()
		let year = date.getFullYear()
		let month = (date.getMonth() + 1).toString().padStart(2, '0')
		let day = date.getDay()
		//拼接后的文件路径
		let dir = path.join(__dirname, '../public/uploads')

		//判断该文件夹是否存在，没有就新建一个
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}
		//cd()是最后配置后返回的路径
		cb(null, dir)
	},
	//设置文件名称
	filename: function (req, file, cb) {
		let fileName = Date.now() + path.extname(file.originalname)
		cb(null, fileName)
	},
})

module.exports = multer({ storage: storage })
