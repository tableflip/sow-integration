var config = require('config')
var login = require('../helpers/bo/login')
var fakeRecipe = require('sow-api/test/helpers/fake-recipe')
var createRecipe = require('../helpers/bo/create-recipe')
var fakeMenu = require('sow-api/test/helpers/fake-menu')
var createMenu = require('../helpers/bo/create-menu')
var fakeClassTag = require('sow-api/test/helpers/fake-class-tag')
var createClassTag = require('../helpers/bo/create-class-tag')

module.exports = {
  '01 - Add class to backoffice': function (browser) {
    var recipes = [fakeRecipe(), fakeRecipe()]
    var menu = fakeMenu()
    var tag = fakeClassTag()

    browser = login(browser)
    browser = createClassTag(tag, browser)
    browser = createRecipe(recipes[0], browser)
    browser = createRecipe(recipes[1], browser)
    browser = createMenu(menu, recipes, browser)
    browser.end()
  }
}
