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
  if (e.data.started) {
    text.innerHTML =
      'Started in ' + formatTime(Date.now() - start) + '. ' +
      'In worker: ' + formatTime(e.data.started) + '.'
  } else if (e.data.ping) {
    console.log('Ping from worker: ' + e.data.ping)
  }
})

button.addEventListener('click', function () {
  worker.post('blink')
})

worker.post('init')
