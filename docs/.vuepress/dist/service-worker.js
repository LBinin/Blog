/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "e32ed72167ab5227c851a94058958fc8"
  },
  {
    "url": "archives/index.html",
    "revision": "c60ddc4605cda5897954ce9b5d13d92d"
  },
  {
    "url": "assets/css/1.styles.9af8234c.css",
    "revision": "a9f79e7036b6367cf770807cb2d06bad"
  },
  {
    "url": "assets/css/2.styles.d5996ff8.css",
    "revision": "67e4f12ed91a03bc12e1a51aac7323dd"
  },
  {
    "url": "assets/css/4.styles.4233fedb.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "assets/css/styles.5ba99ac2.css",
    "revision": "cdbcfbd9a0654e6beec824fcc18d54a3"
  },
  {
    "url": "assets/img/050D8060-0847-4108-A80F-15A1C3A9D7A5.f3b60159.png",
    "revision": "f3b601595f4766b3cbd626fa9de12c06"
  },
  {
    "url": "assets/img/B1D287E6-6A57-4518-B145-2314DBC9CF54.8567d6c8.png",
    "revision": "8567d6c846e1abff8b331e33158b51bb"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.9af8234c.js",
    "revision": "cb15bffacab291d8b76001e0459e0158"
  },
  {
    "url": "assets/js/10.7b0ef11f.js",
    "revision": "e02d51d469575f2c99aac271dd260ab3"
  },
  {
    "url": "assets/js/11.ab54e425.js",
    "revision": "1e82c7dd1daa368a286b032891934010"
  },
  {
    "url": "assets/js/12.0e4638ef.js",
    "revision": "b2a9bdbbf63030f9fd6beb534e69d182"
  },
  {
    "url": "assets/js/2.d5996ff8.js",
    "revision": "9231f532e961042cd2d629a211271825"
  },
  {
    "url": "assets/js/3.9b64f8d0.js",
    "revision": "7ad7b9ca45d791f2ac80f39ca6883f4e"
  },
  {
    "url": "assets/js/4.4233fedb.js",
    "revision": "61cfd9fc8e580331ab347bd392117919"
  },
  {
    "url": "assets/js/5.3c408278.js",
    "revision": "52d9a7aea0171fc5a55abf44bdce4215"
  },
  {
    "url": "assets/js/6.c8cefb91.js",
    "revision": "54427944db2f1ba42314d91b29b7d1df"
  },
  {
    "url": "assets/js/7.a82471a5.js",
    "revision": "36b60a88d7be9f64ec0029fe2ba3382a"
  },
  {
    "url": "assets/js/8.432be79a.js",
    "revision": "d94b4b8bc9cf6979d4ae2e6b1a0f86ab"
  },
  {
    "url": "assets/js/9.1d73bce8.js",
    "revision": "8aa29f3dee3e1ab17cec446297956fb3"
  },
  {
    "url": "assets/js/app.5ba99ac2.js",
    "revision": "b03f263df37f9f34a8c793c47a894cf3"
  },
  {
    "url": "backEnd/index.html",
    "revision": "cc24b4a8d55c5c1fd3d24b6915c54a98"
  },
  {
    "url": "config.html",
    "revision": "60ce696d4cd606012cdc45097b39b6ff"
  },
  {
    "url": "frontEnd/index.html",
    "revision": "0a15bb23bd882d0265e016d775efcec5"
  },
  {
    "url": "frontEnd/深入理解闭包及原理.html",
    "revision": "099dbd7abad90649e8ff2a0b95025abc"
  },
  {
    "url": "frontEnd/理解JavaScript的原型及原型链.html",
    "revision": "d82fd015f2b0a48cd3235471ac18dbeb"
  },
  {
    "url": "guide/index.html",
    "revision": "1e616fd361550dfd46cc43a3f10782de"
  },
  {
    "url": "index.html",
    "revision": "3b1ae899642072b62463d65d24ac3e37"
  },
  {
    "url": "note/index.html",
    "revision": "e161cba89cda3956a876fd6760581dc3"
  },
  {
    "url": "note/愿.html",
    "revision": "a382c6ef50ac17ca8015db7d76752649"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
