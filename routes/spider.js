const cheerio = require('cheerio')
const fs = require('fs')
const http = require('https')
const request = require('request')
http.globalAgent.maxSockets = 100
var express = require('express')
var router = express.Router()

router.post('/spider', (req, res, next) => {
  let { titleUrl, title } = req.body
  console.log(titleUrl)
  console.log(title);

  getTitle(titleUrl).then((value) => {
		//使用cheerio，拿到所有的章节连接，进行拼接
		//返回值是每个章节的请求地址
		// console.log(value)
		let urlList = query(value)
		// console.log(urlList)

		//use map() method to keep sent request
		let contentArr = urlList.map((x) => {
			return sentReq(x)
		})

		//let all requestes are come back in order
		Promise.all(contentArr)
      .then((value) => {
				let dir = path.join(__dirname, '../public/novel')
				//判断该文件夹是否存在，没有就新建一个
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true })
        }
        
				for (let i = 0; i < value.length; i++) {
					fs.appendFileSync(
						`${dir}/${title}.txt`,
						`|=>|=>|=>|=>|${value[i].chapterTitle}=>|=>||=>||=>|${value[i].content}`
					)
					console.log(`第${i}章=>${value[i].chapterTitle}写入完成`)
				}
			})
			.catch((err) => {
				console.log(err)
      })
    res.download ('job done')
  })
  
})



function getTitle(urlTitle) {
	return new Promise((resolve, reject) => {
		http.get(urlTitle, (res) => {
			let content = ''
			res.on('data', (chunk) => {
				content += chunk
			})
			res.on('end', (err) => {
				if (err) throw reject(err)
				//返回的是整段的html
				resolve(content)
			})
		})
	})
}

function sentReq(url) {
	return new Promise((resolve, reject) => {
		request(url, function (err, res, body) {
			if (!err && res.statusCode == 200) {
				// 拿到每个章节的标题
				let $ = cheerio.load(body)
				let booksName = $('.bookname').find('h1').text()
				let detail = $('#content')
					.text()
					.replace(/\s+\r\n\r\n&emsp;&emsp;&emsp;&emsp;/gi, '')
				// console.log(booksName)
				let chapterInfo = {
					chapterTitle: booksName,
					content: detail,
				}
				resolve(chapterInfo)
			} else {
				reject(err)
				// console.log('err:' + err)
			}
		})
	})
}

function query(body) {
	// console.log(body)
	let list = []
	let numberList = []
	$ = cheerio.load(body)
	$('#list')
		.find('dd')
		.find('a')
		.each(function (i, e) {
			//获取章节UrlList
			list.push($(e).attr('href'))
		})

	for (let i = 0; i < list.length; i++) {
		numberList[i] = 'https://www.biquge.com.cn' + list[i]
	}

	return numberList
}




module.exports = router