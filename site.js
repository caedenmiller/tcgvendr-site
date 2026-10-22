// tcgvendr.com motion (2026-10-21): the hero phones rise on the app's spring and
// the portfolio header lifts out of the Home phone; phones drift a little as you
// scroll; the Base phone taps Share, its real sheet slides up and the share card
// pops out; a faint shader moves light across the flat teal. main.js still owns
// reveal, nav, menu and the tables strip. The page reads fine without this file.
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SPRING_MS = 620; // --spring-ms in site.css

  /* Hero entrance, then the lift */
  var stage = document.querySelector('.hero-stage');
  if (stage) {
    var start = function () {
      stage.classList.add('go');
      setTimeout(function () { stage.classList.add('lifted'); }, reduce ? 0 : SPRING_MS + 180);
    };
    var center = stage.querySelector('.p-center img');
    if (center && center.decode) center.decode().then(start, start); else start();
    setTimeout(start, 1600); // never leave the hero empty on a slow image
  }

  /* Scroll drift: hero phones by their data-depth, feature phones by their
     distance from the middle of the screen. Small on purpose. */
  if (!reduce) {
    var heroItems = stage ? [].slice.call(stage.querySelectorAll('[data-depth]')) : [];
    var floats = [].slice.call(document.querySelectorAll('[data-float]'));
    var ticking = false;
    var drift = function () {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      if (y < vh * 1.4) {
        heroItems.forEach(function (el) {
          el.style.setProperty('--py', (-y * Number(el.getAttribute('data-depth')) * 0.22).toFixed(1) + 'px');
        });
      }
      floats.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var off = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty('--py', (off * -36).toFixed(1) + 'px');
      });
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(drift); }
    }, { passive: true });
    window.addEventListener('resize', drift);
    drift();
  }

  /* Base: tap Share, the sheet slides up (TIMING.sheet 280), the card pops */
  var share = document.querySelector('[data-share]');
  if (share) {
    var phone = share.querySelector('.base-phone');
    var run = function () {
      if (reduce) { phone.classList.add('shared'); share.classList.add('popped'); return; }
      setTimeout(function () { phone.classList.add('tapping'); }, 250);
      setTimeout(function () { phone.classList.add('shared'); }, 650);
      setTimeout(function () { share.classList.add('popped'); }, 1150);
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); run(); }
      }, { threshold: 0.55 });
      io.observe(share);
    } else run();
  }

  /* The shader: soft moving light, white at a few percent over the flat teal */
  var canvas = document.querySelector('.hero-shader');
  if (canvas && !reduce) {
    var gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false });
    if (gl) {
      var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      var fs = [
        'precision mediump float;uniform vec2 r;uniform float t;',
        'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
        'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
        'return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
        'float fbm(vec2 p){float v=0.,a=.5;for(int k=0;k<4;k++){v+=a*n(p);p*=2.02;a*=.5;}return v;}',
        'void main(){vec2 uv=gl_FragCoord.xy/r.y;',
        'vec2 q=vec2(fbm(uv*1.4+vec2(0.,t*.035)),fbm(uv*1.4+vec2(5.2,-t*.03)));',
        'float v=fbm(uv*1.1+q*1.6+t*.02);',
        'gl_FragColor=vec4(1.,1.,1.,smoothstep(.35,.85,v)*.07);}'
      ].join('');
      var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      var prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog);
      if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        var uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't');
        var size = function () {
          var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
          canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
          gl.viewport(0, 0, canvas.width, canvas.height);
        };
        size();
        window.addEventListener('resize', size);
        var visible = true, t0 = performance.now();
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) requestAnimationFrame(frame); }).observe(canvas);
        }
        var frame = function (now) {
          if (!visible) return;
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.uniform2f(uR, canvas.width, canvas.height);
          gl.uniform1f(uT, (now - t0) / 1000);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }
    }
  }
})();
