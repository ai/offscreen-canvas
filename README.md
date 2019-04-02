# Offscreen Canvas Polyfill

JS polyfill (**375 bytes**) for `OffscreenCanvas` to move **Three.js**,
**WebGL** or 2D canvas to **Web Worker**.

It will improve performance in Chrome and will load worker by `<script>`
in Firefox, Safari, and other browsers.

The tutorial for this library:
**[Faster WebGL/Three.js 3D graphics with OffscreenCanvas and Web Workers]**.

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
// worker.js
import insideWorker from 'offscreen-canvas/inside-worker'

const worker = insideWorker(e => {
  if (e.data.canvas) {
    // Draw on the canvas
  } else if (e.data.message === 'move') {
    // Messages from main thread
  }
})
```

[Faster WebGL/Three.js 3D graphics with OffscreenCanvas and Web Workers]: https://dev.to/evilmartians/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers-43he

<a href="https://evilmartians.com/?utm_source=offscreen-canvas">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Usage

Create separated bundle in webpack, Parcel or any other bundler:

```diff js
  entry: {
    app: './src/app.js',
+   worker: './src/worker.js'
  }
```

Move all code working with `<canvas>` to `worker.js`. It means to move all WebGL
or Three.js imports and scene related code.

```js
import insideWorker from 'offscreen-canvas/inside-worker'
// Move Three.js imports here if you use Three.js

const worker = insideWorker(e => {
  if (e.data.canvas) {
    // Move scene building code here
  }
})
```

Some of Three.js code (mostly loaders) will not work in Web Worker.
Use `worker.isWorker` to switch loaders:

```js
    if (worker.isWorker) {
      loader = new ImageBitmapLoader()
    } else {
      loader = new ImageLoader()
    }
```

Put preload link to HTML templates with a URL to `worker.js`.
Your bundle will add cache buster to bundle names, so bundle names will
change every time you deploy application. This is why we need to store
path to `worker.js` in HTML:

```diff html
+   <link type="preload" as="script" href="./worker.js">
  </head>
```

Load worker in main `app.js`:

```js
import createWorker from 'offscreen-canvas/create-worker'

const workerUrl = document.querySelector('[rel=preload][as=script]').href
const canvas = document.querySelector('canvas')

const worker = createWorker(canvas, workerUrl)
```

Keep all UI interaction code (listeners for clicks, mouse move, etc)
in `app.js`. Send message to Worker when your need to update `<canvas>`
after user actions:

```js
button.addEventListener('click', () => {
  worker.post({ message: 'move' })
})
```

Process this messages in the worker:

```diff js
  const worker = insideWorker(e => {
    if (e.data.canvas) {
      // Move scene building code here
-   }
+   } else if (e.data.message === 'move') {
+     // Move object on the scene
+   }
  })
```
