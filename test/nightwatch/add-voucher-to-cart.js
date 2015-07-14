var config = require('config')
var login = require('../helpers/bo/login')
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
    login(browser)
      .url(config.backoffice.url + '/voucher/template')
      .waitForElementVisible('body.voucher-template-create', 1000)
      .setValue('#voucher-template-create-name', voucher.name)
      .setValue('#voucher-template-create-info-what', voucher.info.what)
      .setValue('#voucher-template-create-price', '100')
      .click('#voucher-template-create-duration')
      .click('#voucher-template-create-duration option[value="ONE_DAY"]')
      .click('#voucher-template-create-published ~ .toggle')
      .click('.btn[type=submit]')
      .waitForElementVisible('body.voucher-templates', 1000)
      .assert.elementPresent('.alert-success')
      .end()
  },
  '02 - Shop for voucher': function (browser) {
    browser
      .url(config.web.url + '/shop')
      .waitForElementVisible('body', maxWait)
      .assert.containsText('.cart-graphic .count', '0')
      // click 1st link... vouchers are first
      .click('a[href="/shop/gift-vouchers"]')
      .pause(pauseOnClick)
      .assert.urlContains('/shop/gift-vouchers')
      .click('a[href="/shop/gift-vouchers/' + voucher.slug + '"]')
      .pause(pauseOnClick)
      .assert.urlContains(voucher.slug)
      .click('.btn-add-to-cart')
      .pause(pauseOnClick)
      .assert.urlContains('/basket')
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(1)', voucher.name)
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(2)', 'Full Day')
      .assert.containsText('.cart-graphic .count', '1')
      .end()
  }
}
