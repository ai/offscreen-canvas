module.exports = function (listener) {
  if (typeof window !== 'object') {
    onmessage = listener
    return {
      post: function (a, b) {
        postMessage(a, b)
      },
      isWorker: true
    }
  } else {
    var randomId = document.currentScript.dataset.id
    var connection = window[randomId]
    delete window[randomId]

    connection.worker = listener

    setTimeout(function () {
      connection.msgs.forEach(function (data) {
        connection.worker({ data: data })
      })
    }, 1)

    return {
      post: function (data) {
        connection.host({ data: data })
      },
      isWorker: false
    }
  }
}
