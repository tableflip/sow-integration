var config = require('config')

module.exports = function (data, browser) {
  return browser
    .url(config.backoffice.url + '/class/tags')
    .waitForElementVisible('body.class-tags', 1000)
    .click('.btn[href="/class/tag"]')
    .waitForElementVisible('body.class-tag-create', 1000)
    .setValue('#class-tag-create-name', data.name)
    .click('.btn.submit')
    .waitForElementVisible('body.class-tags', 1000)
    .assert.elementPresent('.alert-success')
}
