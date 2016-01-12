var config = require('config')
var login = require('./login')
var maxWait = 2000
var pauseOnClick = 500

module.exports = function (data, browser) {
  return login(browser)
    .url(config.backoffice.url + '/voucher/template')
    .waitForElementVisible('body.voucher-template-create', 1000)
    .setValue('#voucher-template-create-name', data.name)
    .setValue('#voucher-template-create-info-what', data.info.what)
    .setValue('#voucher-template-create-price', '100')
    .click('#voucher-template-create-duration')
    .click('#voucher-template-create-duration option[value="ONE_DAY"]')
    .click('#voucher-template-create-published ~ .toggle')
    .click('.btn[type=submit]')
    .waitForElementVisible('body.voucher-templates', 1000)
    .assert.elementPresent('.alert-success')
}