# Offscreen Canvas Polyfill

JS polyfill (375 bytes) for `OffscreenCanvas` to move Three.js, WebGL or 2D
canvas to Web Worker.

It will improve performance in Chrome and will load worker by `<script>`
in Firefox, Safari, and other browsers.

```js
// index.js
import createWorker from 'offscreen-canvas/create-worker'

const worker = createWorker(canvas, '/worker.js', e => {
  // Messages from the worker
})

button.addEventListener('click', () => {
  worker.post({ message: 'update' })
})
```

```js
import insideWorker from 'offscreen-canvas/inside-worker'

const worker = insideWorker(e => {
  if (e.data.canvas) {
    // Draw on the canvas
  } else if (e.data.message === 'update') {
    // Messages from main thread
  }
})
```

<a href="https://evilmartians.com/?utm_source=offscreen-canvas">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>
