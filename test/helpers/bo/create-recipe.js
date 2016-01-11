var config = require('config')

module.exports = function (data, browser) {
  browser = browser
    .url(config.backoffice.url + '/recipes')
    .waitForElementVisible('body.recipes', 1000)
    .click('.btn[href="/recipe"]')
    .waitForElementVisible('body.recipe-create', 1000)
    .setValue('#recipe-create-name', data.name)
    .setValue('#recipe-create-desc', data.desc)

  browser = data.ingredients.reduce(function (browser, ingredient, i) {
    if (i > 0) {
      return browser
        .click('#recipe-create-ingredients-add')
        .setValue('#recipe-ingredient-quantity-' + i, ingredient.quantity)
        .setValue('#recipe-ingredient-unit-' + i, ingredient.unit)
        .setValue('#recipe-ingredient-name-' + i, ingredient.name)
    }

    return browser
      .setValue('#recipe-create-ingredient-quantity-' + i, ingredient.quantity)
      .setValue('#recipe-create-ingredient-unit-' + i, ingredient.unit)
      .setValue('#recipe-create-ingredient-name-' + i, ingredient.name)
  }, browser)

  return browser
    .click('.btn.submit')
    .waitForElementVisible('body.recipes', 5000)
    .assert.elementPresent('.alert-success')
}
