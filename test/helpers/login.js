var config = require('sow-backoffice/config/test.json')

module.exports = function (browser) {
  return browser
    .url(config.url)
    .waitForElementVisible('body', 1000)
    .click('a[href="/login"]')
    .waitForElementVisible('#Email', 1000)
    .setValue('#Email', config.login.email)
    .click('#next')
    .waitForElementVisible('#Passwd', 2000)
    .setValue('#Passwd', "set me!")
    .click('#signIn')
    .waitForElementVisible('#submit_approve_access:not([disabled])', 5000)
    .click('#submit_approve_access')
    .waitForElementVisible('body', 1000)
}
