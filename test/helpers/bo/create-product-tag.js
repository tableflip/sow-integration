var config = require('config')

module.exports = function (data, browser) {
  return browser
    .url(config.backoffice.url + '/product/tags')
    .waitForElementVisible('body.product-tags', 1000)
    .click('.btn[href="/product/tag"]')
    .waitForElementVisible('body.product-tag-create', 1000)
    .setValue('#product-tag-create-name', data.name)
    .click('.btn.submit')
    .waitForElementVisible('body.product-tags', 1000)
    .assert.elementPresent('.alert-success')
}
