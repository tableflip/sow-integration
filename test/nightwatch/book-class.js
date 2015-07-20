var config = require('config')
var moment = require('moment')
var Faker = require('faker')
var login = require('../helpers/bo/login')
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
var clickByText = require('../helpers/click-by-text')

var recipes = [fakeRecipe(), fakeRecipe()]
var menu = fakeMenu()
var tag = fakeClassTag()
var classTemplate = fakeClassTemplate()
var cls = fakeClass({duration: 'THREE_HOUR'})

module.exports = {
  '01 - Add class to backoffice': function (browser) {
    browser = login(browser)
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
      .waitForElementVisible('body.home', 1000)
      .url(config.web.url + '/classes')
      .waitForElementVisible('body.classes', 1000)
      .click('#date option[value="' + moment(cls.startTimes[0]).format('YYYY-MM') + '"]')
      .waitForElementVisible('body.classes', 1000)

    browser = clickByText('.sow-panel span', classTemplate.name, browser)
      .waitForElementVisible('body.class', 1000)
      .click('.btn.book-now')
      .waitForElementVisible('body.basket', 1000)
      .assert.containsText('#basket tr:first-child .product-description p:first-child', classTemplate.name)
  },
  '03 - Checkout booking info': function (browser) {
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
  '04 - Checkout billing and shipping': function (browser) {
    browser = browser
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
      .setValue('#expMonth', moment().month())
      .setValue('#expYear', moment().add(1, 'year').year())
      .click('.btn')
      .waitForElementVisible('body.confirm-order', 5000)
  },
  '06 - Checkout confirm': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.thanks', 1000)
      .end()
  }
}
