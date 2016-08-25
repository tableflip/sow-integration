module.exports = function (selector, text, browser) {
  return browser.execute(function (selector, text) {
    var elements = document.querySelectorAll(selector)

    console.log(selector, text, elements.length)

    for (var i = 0; i < elements.length; ++i) {
      var textContent = elements[i].textContent
      if (textContent.toLowerCase().indexOf(text.toLowerCase()) !== -1) return elements[i].click()
    }
  }, [selector, text])
}
