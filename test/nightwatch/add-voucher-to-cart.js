var config = require('config')
var login = require('../helpers/bo/login')
var createVoucher = require('../helpers/bo/create-voucher')
var maxWait = 2000
var pauseOnClick = 500
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

module.exports = {
  '01 - Add voucher to backoffice': function (browser) {
    browser = createVoucher(voucher, browser)
    browser.end()
  },
  '02 - Shop for voucher': function (browser) {
    browser
      .url(config.web.url + '/shop')
      .waitForElementVisible('body', maxWait)
      .assert.containsText('#cart-mini .count', '0')
      .click('a[href="/shop/gift-vouchers"]')
      .waitForElementVisible('body.gift-vouchers', maxWait)
      .assert.urlContains('/shop/gift-vouchers')
      .click('a[href="/shop/gift-vouchers/' + voucher.slug + '"]')
      .waitForElementVisible('body.dim-sum-on-me', maxWait)
      .assert.urlContains(voucher.slug)
      .click('.btn-add-to-cart')
      .waitForElementVisible('body.basket', maxWait)
      .assert.urlContains('/basket')
      .waitForElementVisible('#basket .line-item', maxWait)
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(1)', voucher.name)
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(2)', 'Full Day')
      .assert.containsText('#cart-mini .count', '1')
      .end()
  }
}
