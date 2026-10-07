// WebGL 舞台：画当前风格、两个风格之间的方块故障转场、悬停物件的描边。
// 只管画；状态（view、转场进度、悬停）都由 app.js 传进来。

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

const FRAG = `
precision highp float;
uniform sampler2D uA, uB, uHot;
uniform vec2 uRes, uImg, uCenter;
uniform float uScale, uT, uTime, uHover;
uniform vec3 uHi;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hotAt(vec2 uv){ return floor(texture2D(uHot, uv).r * 255.0 / 8.0 + 0.5); }
vec3 split(sampler2D t, vec2 uv, float sh){
  return vec3(texture2D(t, uv + vec2(sh, 0.0)).r, texture2D(t, uv).g, texture2D(t, uv - vec2(sh, 0.0)).b);
}

void main(){
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 uv = ((frag - uRes * 0.5) / uScale + uCenter) / uImg;

  // 转场：画面切成方块，一块块翻到新宇宙；中途带横向错位和 RGB 分离
  float peak = 1.0 - abs(2.0 * uT - 1.0);
  vec2 cell = floor(uv * vec2(28.0, 15.75));
  float order = hash(cell) * 0.6 + hash(floor(uv * vec2(7.0, 4.0)) + 3.1) * 0.4;
  float jit = hash(cell + floor(uTime * 14.0));
  vec2 duv = uv + vec2((jit - 0.5) * 0.06 * peak * step(0.7, jit), 0.0);
  float flip = step(order, uT * 1.25 - 0.12);
  float sh = 0.007 * peak;
  vec3 col = mix(split(uA, duv, sh), split(uB, duv, sh), flip);
  float seam = step(abs(order - (uT * 1.25 - 0.12)), 0.035) * step(0.001, peak);
  col = mix(col, uHi, seam * 0.85);

  // 悬停描边：热点图里序号等于 uHover 的像素，外沿画一圈
  if (uHover > 0.5) {
    float inside = step(abs(hotAt(uv) - uHover), 0.5);
    vec2 px = 4.5 / uImg;
    float near = 0.0;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.7853982;
      near = max(near, step(abs(hotAt(uv + vec2(cos(a), sin(a)) * px) - uHover), 0.5));
    }
    float pulse = 0.72 + 0.28 * sin(uTime * 5.0);
    col = mix(col, vec3(1.0), inside * 0.10);
    col = mix(col, uHi, near * (1.0 - inside) * pulse);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader compile failed');
  return sh;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error(`加载失败：${src}`));
    im.src = src;
  });
}

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

export function createStage(canvas, img, assetBase = 'assets/') {
  const gl2 = canvas.getContext('webgl2', { antialias: false, alpha: false });
  const gl = gl2 || canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) throw new Error('这台设备不支持 WebGL');

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'program link failed');
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['uA', 'uB', 'uHot', 'uRes', 'uImg', 'uCenter', 'uScale', 'uT', 'uTime', 'uHover', 'uHi'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);

  function texture(source, { nearest = false } = {}) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, nearest ? gl.NEAREST : gl.LINEAR);
    if (gl2 && !nearest) {  // 网点图缩小时没有 mipmap 会起摩尔纹
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, nearest ? gl.NEAREST : gl.LINEAR);
    }
    return t;
  }

  const styles = new Map();   // id → { lo, hi, loading: {lo, hi} }
  let hotTex = null;
  const entry = (id) => {
    if (!styles.has(id)) styles.set(id, { lo: null, hi: null, pending: {} });
    return styles.get(id);
  };

  /** 载入一个风格的贴图；hi=true 取全尺寸。重复调用返回同一个 Promise。 */
  function loadStyle(id, hi = false) {
    const e = entry(id);
    const key = hi ? 'hi' : 'lo';
    if (e[key]) return Promise.resolve();
    if (!e.pending[key]) {
      e.pending[key] = loadImage(`${assetBase}styles/${id}${hi ? '' : '@1x'}.webp`).then((im) => {
        if (Math.max(im.width, im.height) > maxTex) return;   // 设备放不下全尺寸，就一直用半尺寸
        e[key] = texture(im);
      });
    }
    return e.pending[key];
  }

  /** 只留当前和上一个风格的全尺寸贴图，别把显存吃满。 */
  function trim(keep) {
    styles.forEach((e, id) => {
      if (!keep.includes(id) && e.hi) {
        gl.deleteTexture(e.hi);
        e.hi = null;
        e.pending.hi = null;
      }
    });
  }

  const pick = (id) => {
    const e = styles.get(id);
    return e ? e.hi || e.lo : null;
  };

  function setHot(image) {
    hotTex = texture(image, { nearest: true });
  }

  function resize(vp, dpr) {
    const w = Math.round(vp.w * dpr);
    const h = Math.round(vp.h * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  /** frame = { a, b, t, view, scale(设备像素/图像像素), time, hover(热点序号), hi([r,g,b]) } */
  function draw(frame) {
    const ta = pick(frame.a);
    const tb = pick(frame.b) || ta;
    if (!ta) return false;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ta);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tb);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, hotTex);
    gl.uniform1i(U.uA, 0);
    gl.uniform1i(U.uB, 1);
    gl.uniform1i(U.uHot, 2);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform2f(U.uImg, img.w, img.h);
    gl.uniform2f(U.uCenter, frame.view.cx, frame.view.cy);
    gl.uniform1f(U.uScale, frame.scale);
    gl.uniform1f(U.uT, frame.t);
    gl.uniform1f(U.uTime, frame.time);
    gl.uniform1f(U.uHover, hotTex ? frame.hover : 0);
    gl.uniform3fv(U.uHi, frame.hi);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return true;
  }

  return { loadStyle, trim, setHot, resize, draw, has: (id, hi) => Boolean(styles.get(id)?.[hi ? 'hi' : 'lo']) };
}
