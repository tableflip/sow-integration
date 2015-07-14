var config = require('config')

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
      return browser
        .click('#menu-create-recipe-add')
        .useXpath()
        .click('//select[@id="menu-recipe-' + i + '"]/option[text()="' + recipe.name + '"]')
        .useCss()
    }

    return browser
      .useXpath()
      .click('//select[@id="menu-create-recipe-' + i + '"]/option[text()="' + recipe.name + '"]')
      .useCss()
  }, browser)

  return browser
    .click('.btn.submit')
    .waitForElementVisible('body.menus', 1000)
    .assert.elementPresent('.alert-success')
}
