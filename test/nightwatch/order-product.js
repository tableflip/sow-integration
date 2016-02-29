var config = require('config')
var moment = require('moment')
var Faker = require('faker')
var login = require('../helpers/bo/login')
var fakeProductTag = require('sow-api/test/helpers/fake-product-tag')
var createProductTag = require('../helpers/bo/create-product-tag')
var fakeProduct = require('sow-api/test/helpers/fake-product')
var createProduct = require('../helpers/bo/create-product')

var tag = fakeProductTag({name: 'test-tag-' + Date.now()})
var product = fakeProduct({name: 'test-product-' + Date.now()})

module.exports = {
  '01 - Add product to backoffice': function (browser) {
    browser = login(browser)
    browser = createProductTag(tag, browser)
    browser = createProduct(product, [tag], browser)
    browser.end()
  },
  '02 - Add product to basket': function (browser) {
    browser = browser
      .url(config.web.url + '/')
      .waitForElementVisible('body.home', 1000)
      .url(config.web.url + '/shop')
      .waitForElementVisible('body.shop', 2000)
      .click('[href="/shop/' + tag.name + '"]')
      .waitForElementVisible('body.shop.' + tag.name, 1000)
      .click('[href="/shop/' + tag.name + '/' + product.name + '"]')
      .waitForElementVisible('body.shop.product.' + product.name, 1000)
      .click('.btn-add-to-cart')
      .waitForElementVisible('body.basket #basket tr', 1000)
      .assert.containsText('#basket tr:first-child .product-description p:first-child', product.name)
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
      .waitForElementVisible('#cardNumber', 1000)
      .setValue('#cardNumber', '4242424242424242')
      .setValue('#cvc', Faker.finance.account(3))
      .setValue('#expMonth', moment().month() + 1)
      .setValue('#expYear', moment().add(1, 'year').year())
      .click('.btn')
      .waitForElementVisible('body.confirm-order', 5000)
  },
  '05 - Checkout confirm': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.thanks', 5000)
      .end()
  }
}
