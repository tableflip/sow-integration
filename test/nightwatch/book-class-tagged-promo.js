var config = require('config')
var Faker = require('faker')
var moment = require('moment')
var mongojs = require('mongojs')
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
var clickByContainsText = require('../helpers/click-by-contains-text')
var fakePromo = require('sow-api/test/helpers/fake-promo')
var createPromo = require('../helpers/bo/create-tagged-promo')

var dbConn = mongojs(config.mongo)
var ClassTags = dbConn.collection('classtags')

var promo = null
var recipes = [fakeRecipe(), fakeRecipe()]
var menu = fakeMenu()
var fakeClassTagName = 'class-tag-' + Date.now()
var tag = fakeClassTag({
  name: fakeClassTagName,
  slug: fakeClassTagName
})
var otherTagName = 'other-class-' + Date.now()
var otherTag = fakeClassTag({
  name: otherTagName,
  slug: otherTagName
})
var classTemplate = fakeClassTemplate({
  price: null
})
var otherClassTemplate = fakeClassTemplate({
  price: null
})
var classes = [
  fakeClass({
    duration: 'THREE_HOUR',
    price: 100
  }),
  fakeClass({
    duration: 'THREE_HOUR',
    price: 100
  })
]

var maxWait = 2500

module.exports = {
  '01 - Set up tagged Promocode': function (browser) {
    ClassTags.insert(tag, function (err, tag) {
      if (err) return console.error(err)
      var name = 'test-promo-' + Date.now()
      var code = name.split('-').pop()
      promo = fakePromo({
        name: name,
        code: code,
        type: 'CURRENCY',
        value: 10,
        tags: [tag._id]
      })
      browser = login(browser)
      browser = createPromo(promo, browser)
      browser.end()
    })
  },
  '02 - Add classes to backoffice': function (browser) {
    browser = login(browser)
    browser = createRecipe(recipes[0], browser)
    browser = createRecipe(recipes[1], browser)
    browser = createMenu(menu, recipes, browser)
    browser = createClassTag(tag, browser)
    browser = createClassTag(otherTag, browser)
    browser = createClassTemplate(classTemplate, [tag], browser)
    browser = createClassTemplate(otherClassTemplate, [otherTag], browser)
    browser = createClass(classes[0], [tag], [menu], browser, {template: classTemplate})
    browser = createClass(classes[1], [otherTag], [menu], browser, {template: otherClassTemplate})
    browser.end()
  },
  '03 - Add 1st class to basket': function (browser) {
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
      .click('#modal-class-select-date [data-date="' + classes[0].date.toISOString() + '"]')
      .waitForElementVisible('body.basket #basket tr', maxWait)
      .assert.containsText('#basket tr:first-child .product-description p:first-child', classTemplate.name)
  },
  '04 - Add 2nd class to basket': function (browser) {
    browser = browser
      .url(config.web.url + '/')
      .waitForElementVisible('body.home', maxWait)
      .url(config.web.url + '/classes')
      .waitForElementVisible('body.classes', maxWait)

    browser = clickByContainsText('.sow-panel span', otherTag.name, browser)
      .waitForElementVisible('body.classes', 100000)

    browser = clickByContainsText('.sow-panel span', otherClassTemplate.name, browser)
      .waitForElementVisible('body.class', 100000)
      .click('.book-now')
      .waitForElementVisible('#modal-class-select-date', maxWait)
      .click('#modal-class-select-date [data-date="' + classes[1].date.toISOString() + '"]')
      .waitForElementVisible('body.basket #basket tr', maxWait)
      .assert.containsText('#basket tr:nth-child(2) .product-description p:first-child', otherClassTemplate.name)
  },
  '05 - Apply promo code': function (browser) {
    var totalPreDiscount = classes[0].price + classes[1].price
    var totalAfterDiscount = totalPreDiscount - promo.value
    browser
      .assert.containsText('.total p', '£' + totalPreDiscount)
      .setValue('#promo-code', promo.code)
      .click('.promo-code .btn')
      .waitForElementPresent('#promo', maxWait)
      .assert.containsText('#promo', 'PROMO CODE: ' + promo.code)
      .assert.containsText('.total p', '£' + totalAfterDiscount)
  },
  '06 - Checkout booking info': function (browser) {
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
  '07 - Checkout billing and shipping': function (browser) {
    browser = browser
      .setValue('#billingAddress1', Faker.address.streetAddress())
      .setValue('#billingCity', Faker.address.streetAddress())
      .setValue('#billingCounty', Faker.address.streetAddress())
      .setValue('#billingPostcode', Faker.address.streetAddress())
      .click('.btn')
      .waitForElementVisible('body.payment', maxWait)
  },
  '08 - Checkout payment': function (browser) {
    browser = browser
      .waitForElementVisible('#cardNumber', maxWait)
      .setValue('#cardNumber', '4242424242424242')
      .setValue('#cvc', Faker.finance.account(3))
      .setValue('#expMonth', moment().month() + 1)
      .setValue('#expYear', moment().add(1, 'year').year())
      .click('.btn')
      .waitForElementVisible('body.confirm-order', maxWait)
  },
  '09 - Checkout confirm': function (browser) {
    browser = browser
      .click('.btn')
      .waitForElementVisible('body.thanks', maxWait)
      .end()

    dbConn.close()
  }
}
