var addVoucher = require('../helpers/add-voucher')
var maxWait = 2000
var pauseOnClick = 500

module.exports = {
  '01 - Add voucher to backoffice': function (browser) {
    browser
      .url('http://localhost:3030/shop')
      .waitForElementVisible('body', maxWait)

  },
  '02 - Shop for voucher': function (browser) {
    browser
      .url('http://localhost:3030/shop')
      .waitForElementVisible('body', maxWait)
      .assert.containsText('.cart-graphic .count', '0')
      // click 1st link... vouchers are first
      .click('a[href="/shop/gift-vouchers"]')
      .pause(pauseOnClick)
      .assert.urlContains('/shop/gift-vouchers')
      .click('a[href="/shop/gift-vouchers/' + addVoucher.data.slug + '"]')
      .pause(pauseOnClick)
      .assert.urlContains(addVoucher.data.slug)
      .click('.btn-add-to-cart')
      .pause(pauseOnClick)
      .assert.urlContains('/basket')
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(1)', addVoucher.data.name)
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(2)', 'Full Day')
      .assert.containsText('.cart-graphic .count', '1')
      .end()
  }
}
