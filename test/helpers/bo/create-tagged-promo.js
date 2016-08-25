var config = require('config')
var moment = require('moment')

module.exports = function (data, browser) {
  return browser
    .url(config.backoffice.url + '/promo')
    .waitForElementVisible('body.promo-create', 1000)
    .setValue('#promo-create-name', data.name)
    .setValue('#promo-create-code', data.code)
    .click('select[id="promo-create-tags"] option[value="' + data.tags[0] + '"]')
    .click('input[type="radio"][value="' + data.type + '"]')
    .setValue('#promo-create-value', data.value)
    .setValue('#promo-create-start', moment(data.start).format('DD/MM/YYYY HH:mm'))
    .setValue('#promo-create-end', moment(data.end).format('DD/MM/YYYY HH:mm'))
    .click('.btn[type=submit]')
    .waitForElementVisible('body.promos', 1000)
    .assert.elementPresent('.alert-success')
}
