var config = require('config')
var Faker = require('faker')
var moment = require('moment')
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
var fakePromo = require('sow-api/test/helpers/fake-promo')
var createPromo = require('../helpers/bo/create-promo')

var promo = fakePromo({type: 'PERCENT', value: 50, start: new Date()})
var recipes = [fakeRecipe(), fakeRecipe()]
var menu = fakeMenu()
var tag = fakeClassTag()
var classTemplate = fakeClassTemplate()
var cls = fakeClass({duration: 'THREE_HOUR'})

var maxWait = 2000

module.exports = {
  '01 - Add promo to backoffice': function (browser) {
    browser = createPromo(promo, browser)
    browser = createRecipe(recipes[0], browser)
    browser = createRecipe(recipes[1], browser)
    browser = createMenu(menu, recipes, browser)
    browser = createClassTag(tag, browser)
    browser = createClassTemplate(classTemplate, [tag], browser)
    browser = createClass(cls, [tag], [menu], browser, {template: classTemplate})
    browser.end()
  },
  '02 - Add class to basket': function (browser) {
    browser = browser
      .url(config.web.url + '/')
      .waitForElementVisible('body.home', maxWait)
      .url(config.web.url + '/classes')
      .waitForElementVisible('body.classes', maxWait)

    browser = clickByContainsText('.sow-panel span', tag.name, browser)
      .waitForElementVisible('body.classes', 100000)

    browser = clickByContainsText('.sow-panel span', classTemplate.name, browser)
      .waitForElementVisible('body.class', 100000)
      .click('.book-now')
      .waitForElementVisible('#modal-class-select-date', maxWait)
      .click('#modal-class-select-date [data-date="' + cls.date.toISOString() + '"]')
      .waitForElementVisible('body.basket #basket tr', maxWait)
      .assert.containsText('#basket tr:first-child .product-description p:first-child', classTemplate.name)
  },
  '03 - Apply promo code': function (browser) {
    browser
      .setValue('#promo-code', promo.code)
      .click('.promo-code .btn')
      .waitForElementPresent('.discount-codes ul li .promo', maxWait)
  },
  '04 - Checkout booking info': function (browser) {
    browser = browser
      .click('.btn-go-to-payment')
      .waitForElementVisible('body.booking-info', maxWait)
      .setValue('#firstName', Faker.name.firstName())
      .setValue('#lastName', Faker.name.lastName())
      .setValue('#email', Faker.internet.email())
      .setValue('#tel', Faker.phone.phoneNumber())
      .click('[name="dietNone"]')
      .click('.btn-confirm-attendee')
      .waitForElementVisible('#modal-diet-requirements-anything button', maxWait)
      .click('#modal-diet-requirements-anything button')
      .waitForElementNotVisible('#modal-diet-requirements-anything', maxWait)
      .waitForElementVisible('.btn[href="/checkout/billing-and-shipping"]', maxWait)
      .click('.btn[href="/checkout/billing-and-shipping"]')
      .waitForElementVisible('body.billing-and-shipping', maxWait)
  },
  '05 - Checkout billing and shipping': function (browser) {
    browser = browser
      .setValue('#billingAddress1', Faker.address.streetAddress())
      .setValue('#billingCity', Faker.address.streetAddress())
      .setValue('#billingCounty', Faker.address.streetAddress())
      .setValue('#billingPostcode', Faker.address.streetAddress())
      .click('.btn')
      .waitForElementVisible('body.payment', maxWait)
  },
  '06 - Checkout payment': function (browser) {
    browser = browser
      .waitForElementVisible('#cardNumber', maxWait)
      .setValue('#cardNumber', '4242424242424242')
      .setValue('#cvc', Faker.finance.account(3))
      .setValue('#expMonth', moment().month() + 1)
      .setValue('#expYear', moment().add(1, 'year').year())
      .click('.btn')
      .waitForElementVisible('body.confirm-order', maxWait)
  },
  '07 - Checkout confirm': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.thanks', maxWait)
      .end()
  }
}
