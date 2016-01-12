var config = require('config')
var Faker = require('faker')
var moment = require('moment')
var mongojs = require('mongojs')
var login = require('../helpers/bo/login')
var createVoucher = require('../helpers/bo/create-voucher')
var fakeRecipe = require('sow-api/test/helpers/fake-recipe')
var createRecipe = require('../helpers/bo/create-recipe')
var fakeMenu = require('sow-api/test/helpers/fake-menu')
var createMenu = require('../helpers/bo/create-menu')
var fakeClassTag = require('sow-api/test/helpers/fake-class-tag')
var createClassTag = require('../helpers/bo/create-class-tag')
var fakeClassTemplate = require('sow-api/test/helpers/fake-class-template')
var createClassTemplate = require('../helpers/bo/create-class-template')
var fakeClass = require('sow-api/test/helpers/fake-class')
var createClass = require('../helpers/bo/create-class')
var clickByContainsText = require('../helpers/click-by-contains-text')

var recipes = [fakeRecipe(), fakeRecipe()]
var menu = fakeMenu()
var tag = fakeClassTag()
var classTemplate = fakeClassTemplate()
var cls = fakeClass({duration: 'THREE_HOUR'})

var maxWait = 2000
var pauseOnClick = 500
var voucher = {
  name: 'Multi Voucher Test Voucher',
  duration: 'ONE_DAY',
  price: 101,
  published: true,
  validity: 'SIX_MONTH',
  tags: [],
  info: {
      what: 'A free 1 day Dim Sum course'
  },
  slug: 'multi-voucher-test-voucher'
}
var giftCodes = []

var dbConn = mongojs(config.mongo)

module.exports = {
  '01 - Add voucher to backoffice': function (browser) {
    browser = createVoucher(voucher, browser)
    browser = createRecipe(recipes[0], browser)
    browser = createRecipe(recipes[1], browser)
    browser = createMenu(menu, recipes, browser)
    browser = createClassTag(tag, browser)
    browser = createClassTemplate(classTemplate, [tag], browser)
    browser = createClass(cls, [tag], [menu], browser, {template: classTemplate})
    browser.end()
  },
  '02 - Shop for vouchers': function (browser) {
    browser
      .url(config.web.url + '/shop')
      .waitForElementVisible('body', maxWait)
      .assert.containsText('#cart-mini .count', '0')
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
      .waitForElementVisible('#basket .line-item', maxWait)
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(1)', voucher.name)
      .assert.containsText('.line-item:nth-of-type(1) .product-description p:nth-of-type(2)', 'Full Day')
      .click('select.select-quantity option:nth-of-type(2)')
      .pause(pauseOnClick)
      .assert.containsText('#cart-mini .count', '2')
  },
  '03 - Voucher recipients info': function (browser) {
    browser = browser
      .click('.btn-go-to-payment')
      .waitForElementVisible('body.booking-info', 1000)
      .setValue('#gift-voucher-first-name-0', Faker.name.firstName())
      .setValue('#gift-voucher-last-name-0', Faker.name.lastName())
      .setValue('#gift-voucher-first-name-1', Faker.name.firstName())
      .setValue('#gift-voucher-last-name-1', Faker.name.lastName())
      .click('.btn[href="/checkout/billing-and-shipping"]')
      .waitForElementVisible('body.billing-and-shipping', 1000)
  },
  '04 - Checkout billing and shipping': function (browser) {
    browser = browser
      .setValue('#billingFirstName', Faker.name.firstName())
      .setValue('#billingLastName', Faker.name.lastName())
      .setValue('#billingEmail', Faker.internet.email())
      .setValue('#billingPhone', Faker.phone.phoneNumber())
      .setValue('#billingAddress1', Faker.address.streetAddress())
      .setValue('#billingCity', Faker.address.streetAddress())
      .setValue('#billingCounty', Faker.address.streetAddress())
      .setValue('#billingPostcode', Faker.address.streetAddress())
      .click('.btn')
      .waitForElementVisible('body.payment', 1000)
  },
  '05 - Checkout payment': function (browser) {
    browser = browser
      .pause(1000) // No idea, needed for next setValue to work
      .setValue('#cardNumber', '4242424242424242')
      .setValue('#cvc', Faker.finance.account(3))
      .setValue('#expMonth', moment().month() + 1)
      .setValue('#expYear', moment().add(1, 'year').year())
      .click('.btn')
      .waitForElementVisible('body.confirm-order', 5000)
  },
  '06 - Checkout confirm': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.thanks', 5000)
      .end()
  },
  '07 - Get gift codes from DB': function () {
    var Voucher = dbConn.collection('vouchers')
    Voucher.find({name: 'Multi Voucher Test Voucher'}).limit(2, function (err, vouchers) {
      if (err) return console.error(err)
      console.log('VOUCHERS:',vouchers)
      giftCodes = vouchers.map(function (voucher) {
        return voucher.code
      })
    })
  },
  '08 - Add class to basket': function (browser) {
    browser = browser
      .url(config.web.url + '/')
      .waitForElementVisible('body.home', 1000)
      .url(config.web.url + '/classes')
      .waitForElementVisible('body.classes', 1000)
      .click('#month option[value="' + moment(cls.startTimes[0]).format('YYYY-MM') + '"]')
      .waitForElementVisible('body.classes', 1000)

    browser = clickByContainsText('.sow-panel span', classTemplate.name, browser)
      .waitForElementVisible('body.class', 1000)
      .click('.btn.book-now')
      .waitForElementVisible('body.basket', 1000)
      .assert.containsText('#basket tr:first-child .product-description p:first-child', classTemplate.name)
      .setValue('#voucher-code', giftCodes[0])
      .click('.voucher-code .btn')
      .waitForElementPresent('.discount-codes ul li .voucher', 100000)
      .setValue('#voucher-code', giftCodes[1])
      .click('.voucher-code .btn')
      .waitForElementPresent('.discount-codes ul li:nth-of-type(2) .voucher', maxWait)
  },
  '09 - Checkout booking info': function (browser) {
    browser = browser
      .click('.btn-go-to-payment')
      .waitForElementVisible('body.booking-info', 1000)
      .setValue('#firstName', Faker.name.firstName())
      .setValue('#lastName', Faker.name.lastName())
      .setValue('#email', Faker.internet.email())
      .setValue('#tel', Faker.phone.phoneNumber())
      .click('[name="dietNone"]')
      .click('.btn-confirm-attendee')
      .pause(1000)
      .click('#modal-diet-requirements-anything button')
      .pause(1000)
      .click('.btn[href="/checkout/billing-and-shipping"]')
      .waitForElementVisible('body.billing-and-shipping', 1000)
  },
  '10 - Checkout billing and shipping': function (browser) {
    browser = browser
      .setValue('#billingAddress1', Faker.address.streetAddress())
      .setValue('#billingCity', Faker.address.streetAddress())
      .setValue('#billingCounty', Faker.address.streetAddress())
      .setValue('#billingPostcode', Faker.address.streetAddress())
      .click('.btn')
      .waitForElementVisible('body.payment', 1000)
  },
  '11 - Checkout payment': function (browser) {
    browser = browser
      .pause(1000) // No idea, needed for next setValue to work
      .setValue('#cardNumber', '4242424242424242')
      .setValue('#cvc', Faker.finance.account(3))
      .setValue('#expMonth', moment().month() + 1)
      .setValue('#expYear', moment().add(1, 'year').year())
      .click('.btn')
      .waitForElementVisible('body.confirm-order', 5000)
  },
  '12 - Checkout confirm': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.thanks', 5000)
      .end()
  }
}
