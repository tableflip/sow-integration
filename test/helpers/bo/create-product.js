var config = require('config')
var selectByText = require('../select-by-text')

module.exports = function (data, tags, browser, opts) {
  opts = opts || {}

  browser = browser
    .url(config.backoffice.url + '/product')
    .waitForElementVisible('body.product-create', 1000)
    .setValue('#product-create-name', data.name)
    .setValue('#product-create-intro', data.intro)
    .setValue('#product-create-desc', data.desc)

  if (data.videos && data.videos.length) {
    data.videos.forEach(function (url, i) {
      browser = browser.setValue('[name=videos]:nth-child(' + (i + 1) + ')', url)
    })
  }

  browser = selectByText('#product-create-tags', tags.map(function (t) { return t.name }), browser)

  return browser
    .setValue('#product-create-price', data.price)
    .setValue('#product-create-shipping', data.shipping)
    .setValue('#product-create-stock', data.stock)
    .click('#product-create-published ~ .toggle')
    .click('.btn.submit')
    .waitForElementVisible('body.products', 1000)
    .assert.elementPresent('.alert-success')
}
