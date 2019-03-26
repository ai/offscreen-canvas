var createOffscreenWorker = require('../create-worker')

var scriptUrl = document.querySelector('link').href
var canvas = document.querySelector('canvas')
var button = document.querySelector('button')
var text = document.querySelector('p')

function formatTime (ms) {
  return Math.round(ms / 10) / 100
}

var start = Date.now()
var worker = createOffscreenWorker(canvas, scriptUrl, function (e) {
  text.innerHTML =
    'Started in ' + formatTime(Date.now() - start) + '. ' +
    'In worker: ' + formatTime(e.data) + '.'
})

button.addEventListener('click', function () {
  worker.post('blink')
})

worker.post('init')
