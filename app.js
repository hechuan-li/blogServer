var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const cors = require('cors')
const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('./utiles/constant')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var articleRouter = require('./routes/article')
var spiderRouter = require('./routes/spider')
var commentRouter = require('./routes/comment')

// const loginRouter = require('./routes/login')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(logger('dev'))
app.use(express.json()) //解析post请求
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser()) //解析cookie
app.use(express.static(path.join(__dirname, 'public')))

//登陆拦截，写在路由之前
app.use(
	expressJwt({
		secret: PRIVATE_KEY,
		algorithms: ['HS256'],
	}).unless({
		//设置白名单，除此之外的全要验证
		path: [
			'/api/users/register',
			'/api/users/login',
			'/api/users/upload',
			'/api/article/allArticle',
			'/api/article/detail',
			'/api/comment/list'
		],
	})
)

app.use('/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/article', articleRouter)
app.use('/api/spider', spiderRouter)
app.use('/api/comment', commentRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('invalid token...')
	} else {
		// set locals, only providing error in development
		res.locals.message = err.message
		res.locals.error = req.app.get('env') === 'development' ? err : {}

		// render the error page
		res.status(err.status || 500)
		res.render('error')
	}
})

module.exports = app
