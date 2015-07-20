var config = require('config')
var selectByText = require('../select-by-text')

module.exports = function (data, recipes, browser) {
  browser = browser
    .url(config.backoffice.url + '/menus')
    .waitForElementVisible('body.menus', 1000)
    .click('.btn[href="/menu"]')
    .waitForElementVisible('body.menu-create', 1000)
    .setValue('#menu-create-name', data.name)
    .setValue('#menu-create-desc', data.desc)

  browser = recipes.reduce(function (browser, recipe, i) {
    if (i > 0) {
      browser = browser.click('#menu-create-recipe-add')
      return selectByText('#menu-recipe-' + i, recipe.name, browser)
    }
    return selectByText('#menu-create-recipe-' + i, recipe.name, browser)
  }, browser)

  return browser
    .click('.btn.submit')
    .waitForElementVisible('body.menus', 1000)
    .assert.elementPresent('.alert-success')
}
