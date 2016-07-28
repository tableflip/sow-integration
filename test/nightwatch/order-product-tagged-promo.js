var async = require('async')
var config = require('config')
var moment = require('moment')
var Faker = require('faker')
var login = require('../helpers/bo/login')
var mongojs = require('mongojs')
var fakeProductTag = require('sow-api/test/helpers/fake-product-tag')
var fakeProduct = require('sow-api/test/helpers/fake-product')
var createProduct = require('../helpers/bo/create-product')
var fakePromo = require('sow-api/test/helpers/fake-promo')
var createTaggedPromo = require('../helpers/bo/create-tagged-promo')
var clickByContainsText = require('../helpers/click-by-contains-text')

var dbConn = mongojs(config.mongo)

var productTagName = 'test-tag-' + Date.now()
var tag = fakeProductTag({
  name: productTagName,
  slug: productTagName
})
var product = fakeProduct({name: 'test-product-' + Date.now()})
var promo = null

module.exports = {
  '00 - set up the product tag and promo code': function () {
    async.waterfall([
      function cleanDb (cb) {
        var ProductTags = dbConn.collection('producttags')
        ProductTags.remove({}, function (err) {
          cb(err, ProductTags)
        })
      },
      function insertProductTag (ProductTags, cb) {
        ProductTags.insert(tag, cb)
      },
      function createPromoCode (productTag, cb) {
        var name = 'test-promo-' + Date.now()
        var code = name.split('-').pop()
        promo = fakePromo({
          name: name,
          code: code,
          type: 'PERCENT',
          value: 50,
          tags: [productTag._id]
        })
        cb(null, promo)
      }
    ], function (err, promo) {
      if (err) return console.error(err)
      dbConn.close()
    })
  },
  '01 - Add product to backoffice': function (browser) {
    browser = login(browser)
    browser = createProduct(product, [tag], browser)
    browser = createTaggedPromo(promo, browser)
    browser.end()
  },
  '02 - Add product to basket': function (browser) {
    browser = browser
      .url(config.web.url + '/')
      .waitForElementVisible('body.home', 1000)
      .url(config.web.url + '/shop')
      .waitForElementVisible('body.shop', 2000)

    browser = clickByContainsText('h2', tag.name, browser)
      .waitForElementVisible('body.shop.' + tag.name, 1000)

    browser = clickByContainsText('span', product.name, browser)
      .waitForElementVisible('body.shop.product.' + product.name, 2000)
      .click('.btn-add-to-cart')
      .waitForElementVisible('body.basket #basket tr', 1000)
      .assert.containsText('#basket tr:first-child .product-description p:first-child', product.name)
      .setValue('#promo-code', promo.code)
      .pause(1000)
      .click('.promo-code .btn.btn-primary')
      .waitForElementVisible('#promo', 1000)
      .assert.containsText('#promo', 'PROMO CODE: ' + promo.code)
  },
  '03 - Checkout billing and shipping': function (browser) {
    browser = browser
      .click('.btn-go-to-payment')
      .waitForElementVisible('body.billing-and-shipping', 1000)
      .setValue('#billingFirstName', Faker.name.firstName())
      .setValue('#billingLastName', Faker.name.lastName())
      .setValue('#billingEmail', Faker.internet.email())
      .setValue('#billingPhone', Faker.phone.phoneNumber())
      .setValue('#billingAddress1', Faker.address.streetAddress())
      .setValue('#billingCity', Faker.address.streetAddress())
      .setValue('#billingCounty', Faker.address.streetAddress())
      .setValue('#billingPostcode', Faker.address.streetAddress())
      .moveToElement('body', 0, 0)
      .click('[name="sameAddress"]')
      .setValue('#shippingFirstName', Faker.name.firstName())
      .setValue('#shippingLastName', Faker.name.lastName())
      .setValue('#shippingEmail', Faker.internet.email())
      .setValue('#shippingAddress1', Faker.address.streetAddress())
      .setValue('#shippingCity', Faker.address.streetAddress())
      .setValue('#shippingCounty', Faker.address.streetAddress())
      .setValue('#shippingPostcode', Faker.address.streetAddress())
  },
  '04 - Checkout payment': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.payment', 1000)
      .waitForElementVisible('#cardNumber', 2000)
      .setValue('#cardNumber', '4242424242424242')
      .setValue('#cvc', Faker.finance.account(3))
      .setValue('#expMonth', moment().month() + 1)
      .setValue('#expYear', moment().add(1, 'year').year())
      .click('.btn')
      .waitForElementVisible('body.confirm-order', 5000)
      .assert.containsText('.total p', 'Total £' + (product.price / 2) + '.00')
  },
  '05 - Checkout confirm': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.thanks', 5000)
      .end()
  }
}
