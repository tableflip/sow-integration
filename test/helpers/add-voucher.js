var SowApi = require('sow-api-client')
var api = new SowApi('http://localhost:3300')
var _ = require('underscore')

var voucher = {
  name: 'Dim Sum On Me',
  duration: 'ONE_DAY',
  price: 101,
  published: true,
  validity: 'SIX_MONTH',
  tags: [],
  info: {
      what: 'A free 1 day Dim Sum course'
  },
  slug: 'dim-sum-on-me'
}

module.exports = function (done) {
  api.voucherTemplateBySlug(voucher.slug, function (err, data) {
    if (data && (data.slug === voucher.slug)) return done()
    if (err && err.data && (err.data.statusCode === 404)) {
      api.createVoucherTemplate(_.omit(voucher, 'slug'), function (err) {
        if (err) return console.error(err)
        return done()
      })
    } else {
      return console.error(err)
    }
  })
}

module.exports.undo = function (done) {
  api.voucherTemplateBySlug(voucher.slug, function (err, data) {
    if (err) return console.error(err)
    if (!data) return done()
    api.removeVoucherTemplate(data._id, done)
  })
}

module.exports.data = voucher
