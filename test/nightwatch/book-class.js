var config = require('config')
var moment = require('moment')
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
      .click('#date option[value=' + moment(cls.startTimes[0]).format('YYYY-MM') + ']')
      .waitForElementVisible('body.classes', 1000)
      .useXpath()
      .click('//span[text()="' + cls.name + '"]')
      .useCss()
      .waitForElementVisible('body.class', 1000)
      .click('.btn.book')
      .waitForElementVisible('body.basket', 1000)
  }
}
