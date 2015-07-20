module.exports = function (selector, texts, browser) {
  texts = Array.isArray(texts) ? texts : [texts]

  return browser.execute(function (selector, texts) {
    var options = document.querySelectorAll(selector + ' option')

    for (var i = 0; i < options.length; ++i) {
      var textContent = options[i].textContent
      if (texts.indexOf(textContent) > -1) {
        options[i].selected = true
      }
    }
  }, [selector, texts])
}