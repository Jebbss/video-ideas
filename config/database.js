if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://jeb:jeb@ds147668.mlab.com:47668/jebvidjot-prod'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}
