var insideWorker = require('../inside-worker')

var start = Date.now()
var ctx, width, height

function fill (color) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}

var worker = insideWorker(function (e) {
  if (e.data.canvas) {
    ctx = e.data.canvas.getContext('2d')
    width = e.data.width
    height = e.data.height
    fill(worker.isWorker ? 'green' : 'red')
  } else if (e.data === 'blink') {
    fill('white')
    setTimeout(function () {
      fill(worker.isWorker ? 'green' : 'red')
    }, 200)
  } else if (e.data === 'init') {
    worker.post({ started: Date.now() - start })
  }
})

setInterval(function () {
  worker.post({ ping: Date.now() })
}, 1000)
