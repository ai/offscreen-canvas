module.exports = function (canvas, workerUrl, listener) {
  if (canvas.transferControlToOffscreen) {
    var worker = new Worker(workerUrl)
    worker.onmessage = listener
    var offscreen = canvas.transferControlToOffscreen()
    worker.postMessage({
      canvas: offscreen,
      width: canvas.clientWidth,
      height: canvas.clientHeight
    }, [offscreen])
    return {
      post: function (a, b) {
        worker.postMessage(a, b)
      }
    }
  } else {
    var randomId = 'Offscreen' + Math.round(Math.random() * 1000)
    var script = document.createElement('script')
    script.src = workerUrl
    script.async = true
    script.dataset.id = randomId

    var connection = { msgs: [], host: listener }
    var api = {
      post: function (data) {
        if (connection.worker) {
          connection.worker({ data: data })
        } else {
          connection.msgs.push(data)
        }
      }
    }

    script.onload = function () {
      api.post({
        canvas: canvas,
        width: canvas.clientWidth,
        height: canvas.clientHeight
      })
    }

    document.head.appendChild(script)
    window[randomId] = connection
    return api
  }
}
