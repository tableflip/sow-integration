module.exports = function (selector, text, browser) {
  return browser.execute(function (selector, text) {
    var elements = document.querySelectorAll(selector)

    for (var i = 0; i < elements.length; ++i) {
      var textContent = elements[i].textContent
      if (textContent && textContent.indexOf(text) > -1) return elements[i].click()
    }
  }, [selector, text])
}
