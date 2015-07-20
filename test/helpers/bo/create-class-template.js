var config = require('config')
var selectByText = require('../select-by-text')

module.exports = function (data, tags, browser) {
  browser = browser
    .url(config.backoffice.url + '/class/templates')
    .waitForElementVisible('body.class-templates', 1000)
    .click('.btn[href="/class/template"]')
    .waitForElementVisible('body.class-template-create', 1000)
    .setValue('#class-template-create-name', data.name)
    .setValue('#class-template-create-intro', data.intro)
    .setValue('#class-template-create-desc', data.desc)
    .setValue('#class-template-create-info-duration', data.info.duration)
    .setValue('#class-template-create-info-skills', data.info.skills)
    .setValue('#class-template-create-info-suitability', data.info.suitability)
    .setValue('#class-template-create-info-size', data.info.size)
    .setValue('#class-template-create-info-additional', data.info.additional)
    .setValue('#class-template-create-info-recommendations', data.info.recommendations)
    .setValue('#class-template-create-info-learning', data.info.learning)
    .setValue('#class-template-create-info-dietary', data.info.dietary)
    .setValue('#class-template-create-info-faqs', data.info.faqs)
    .setValue('#class-template-create-info-reviews', data.info.reviews)

   browser = selectByText('#class-template-create-tags', tags.map(function (t) { return t.name }), browser)

  return browser
    .click('#class-template-create-duration option[value="' + data.duration + '"]')
    .setValue('#class-template-create-price', data.price)
    .setValue('#class-template-create-capacity', data.capacity)
    .click('.btn.submit')
    .waitForElementVisible('body.class-templates', 1000)
    .assert.elementPresent('.alert-success')
}
