var config = require('config')
var moment = require('moment')
var selectByText = require('../select-by-text')

module.exports = function (data, tags, menus, browser, opts) {
  opts = opts || {}

  browser = browser
    .url(config.backoffice.url + '/class')
    .waitForElementVisible('body.class-create', 1000)

  if (opts.template) {
    browser = browser
      .useXpath()
      .click('//select[@id="class-create-template"]/option[text()="' + opts.template.name + '"]')
      .useCss()
      .waitForElementVisible('body.class-create', 1000)
  }

  if (!opts.template || (opts.template && !opts.template.name)) {
    browser = browser.setValue('#class-create-name', data.name)
  }

  if (!opts.template || (opts.template && !opts.template.intro)) {
    browser = browser.setValue('#class-create-intro', data.intro)
  }

  if (!opts.template || (opts.template && !opts.template.desc)) {
    browser = browser.setValue('#class-create-desc', data.desc)
  }

  if (!opts.template || (opts.template && !opts.template.info.duration)) {
    browser = browser.setValue('#class-create-info-duration', data.info.duration)
  }

  if (!opts.template || (opts.template && !opts.template.info.duration)) {
    browser = browser.setValue('#class-create-info-duration', data.info.duration)
  }

  if (!opts.template || (opts.template && !opts.template.info.skills)) {
    browser = browser.setValue('#class-create-info-skills', data.info.skills)
  }

  if (!opts.template || (opts.template && !opts.template.info.suitability)) {
    browser = browser.setValue('#class-create-info-suitability', data.info.suitability)
  }

  if (!opts.template || (opts.template && !opts.template.info.size)) {
    browser = browser.setValue('#class-create-info-size', data.info.size)
  }

  if (!opts.template || (opts.template && !opts.template.info.additional)) {
    browser = browser.setValue('#class-create-info-additional', data.info.additional)
  }

  if (!opts.template || (opts.template && !opts.template.info.recommendations)) {
    browser = browser.setValue('#class-create-info-recommendations', data.info.recommendations)
  }

  if (!opts.template || (opts.template && !opts.template.info.learning)) {
    browser = browser.setValue('#class-create-info-learning', data.info.learning)
  }

  if (!opts.template || (opts.template && !opts.template.info.dietary)) {
    browser = browser.setValue('#class-create-info-dietary', data.info.dietary)
  }

  if (!opts.template || (opts.template && !opts.template.info.faqs)) {
    browser = browser.setValue('#class-create-info-faqs', data.info.faqs)
  }

  if (!opts.template || (opts.template && !opts.template.info.reviews)) {
    browser = browser.setValue('#class-create-info-reviews', data.info.reviews)
  }

  browser = selectByText('#class-create-tags', tags.map(function (t) { return t.name }), browser)

  browser = browser
    .click('#class-create-duration option[value="' + data.duration + '"]')

  browser = data.startTimes.reduce(function (browser, startTime, i) {
    var endTime = data.endTimes[i]

    return browser
      .clearValue('#class-create-start-time-' + i)
      .setValue('#class-create-start-time-' + i, moment(startTime).format('DD/MM/YYYY HH:mm'))
      .clearValue('#class-create-end-time-' + i)
      .setValue('#class-create-end-time-' + i, moment(endTime).format('DD/MM/YYYY HH:mm'))
      .useXpath()
      .click('//select[@id="class-create-menu-' + i + '"]/option[text()="' + menus[i].name + '"]')
      .useCss()
  }, browser)

  return browser
    .setValue('#class-create-price', data.price)
    .setValue('#class-create-capacity', data.capacity)
    .click('#class-create-published ~ .toggle')
    .click('.btn.submit')
    .waitForElementVisible('body.home', 1000)
    .assert.elementPresent('.alert-success')
}
