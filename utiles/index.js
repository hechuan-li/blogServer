const crypto = require('crypto')

module.exports = function md5(s) {
  
  return crypto.createHash('md5').update(String(s)).digest('hex')
}