var config = require('config')

module.exports = function (browser) {
  return browser
    .url(config.backoffice.url)
    .waitForElementVisible('body', 1000)
    .click('a[href="/login"]')
    .waitForElementVisible('#Email', 1000)
    .setValue('#Email', config.backoffice.login.email)
    .click('#next')
    .waitForElementVisible('#Passwd', 2000)
    .setValue('#Passwd', config.backoffice.login.password)
    .click('#signIn')
    .waitForElementVisible('#submit_approve_access:not([disabled])', 5000)
    .click('#submit_approve_access')
    .pause(1000)
}
