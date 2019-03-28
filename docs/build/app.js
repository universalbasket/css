(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var convert = require('color-convert');

module.exports = function (cstr) {
    var m, conv, parts, alpha;
    if (m = /^((?:rgb|hs[lv]|cmyk|xyz|lab)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
        var name = m[1];
        var base = name.replace(/a$/, '');
        var size = base === 'cmyk' ? 4 : 3;
        conv = convert[base];
        
        parts = m[2].replace(/^\s+|\s+$/g, '')
            .split(/\s*,\s*/)
            .map(function (x, i) {
                if (/%$/.test(x) && i === size) {
                    return parseFloat(x) / 100;
                }
                else if (/%$/.test(x)) {
                    return parseFloat(x);
                }
                return parseFloat(x);
            })
        ;
        if (name === base) parts.push(1);
        alpha = parts[size] === undefined ? 1 : parts[size];
        parts = parts.slice(0, size);
        
        conv[base] = function () { return parts };
    }
    else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
        var base = cstr.replace(/^#/,'');
        var size = base.length;
        conv = convert.rgb;
        parts = base.split(size === 3 ? /(.)/ : /(..)/);
        parts = parts.filter(Boolean)
            .map(function (x) {
                if (size === 3) {
                    return parseInt(x + x, 16);
                }
                else {
                    return parseInt(x, 16)
                }
            })
        ;
        alpha = 1;
        conv.rgb = function () { return parts };
        if (!parts[0]) parts[0] = 0;
        if (!parts[1]) parts[1] = 0;
        if (!parts[2]) parts[2] = 0;
    }
    else {
        conv = convert.keyword;
        conv.keyword = function () { return cstr };
        parts = cstr;
        alpha = 1;
    }
    
    var res = {
        rgb: undefined,
        hsl: undefined,
        hsv: undefined,
        cmyk: undefined,
        keyword: undefined,
        hex: undefined
    };
    try { res.rgb = conv.rgb(parts) } catch (e) {}
    try { res.hsl = conv.hsl(parts) } catch (e) {}
    try { res.hsv = conv.hsv(parts) } catch (e) {}
    try { res.cmyk = conv.cmyk(parts) } catch (e) {}
    try { res.keyword = conv.keyword(parts) } catch (e) {}
    
    if (res.rgb) res.hex = '#' + res.rgb.map(function (x) {
        var s = x.toString(16);
        if (s.length === 1) return '0' + s;
        return s;
    }).join('');
    
    if (res.rgb) res.rgba = res.rgb.concat(alpha);
    if (res.hsl) res.hsla = res.hsl.concat(alpha);
    if (res.hsv) res.hsva = res.hsv.concat(alpha);
    if (res.cmyk) res.cmyka = res.cmyk.concat(alpha);
    
    return res;
};

},{"color-convert":3}],2:[function(require,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],3:[function(require,module,exports){
var conversions = require("./conversions");

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;
},{"./conversions":2}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":4,"timers":5}],6:[function(require,module,exports){
var Vue // late bind
var version
var map = Object.create(null)
if (typeof window !== 'undefined') {
  window.__VUE_HOT_MAP__ = map
}
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }

  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cached together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }

      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)

      // 2.6: temporarily mark rendered scoped slots as unstable so that
      // child components can be forced to update
      var restore = patchScopedSlots(instance)
      instance.$forceUpdate()
      instance.$nextTick(restore)
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

// 2.6 optimizes template-compiled scoped slots and skips updates if child
// only uses scoped slots. We need to patch the scoped slots resolving helper
// to temporarily mark all scoped slots as unstable in order to force child
// updates.
function patchScopedSlots (instance) {
  if (!instance._u) { return }
  // https://github.com/vuejs/vue/blob/dev/src/core/instance/render-helpers/resolve-scoped-slots.js
  var original = instance._u
  instance._u = function (slots) {
    try {
      // 2.6.4 ~ 2.6.6
      return original(slots, true)
    } catch (e) {
      // 2.5 / >= 2.6.7
      return original(slots, null, true)
    }
  }
  return function () {
    instance._u = original
  }
}

},{}],7:[function(require,module,exports){
(function (global,setImmediate){
/*!
 * Vue.js v2.6.7
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
'use strict';

/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeLetters = 'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD';

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + unicodeLetters + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (!config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (isUndef(target) || isPrimitive(target)
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (isUndef(target) || isPrimitive(target)
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + unicodeLetters + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res)) {
      // issue #9511
      // reassign to res to avoid catch triggering multiple times when nested calls
      res = res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var isUsingMicroTask = false;

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var isStable = slots ? !!slots.$stable : true;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    Object.keys(normalSlots).length === 0
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && res.length === 0
      ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (!isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        if (!(key in hash) && !(camelizedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + camelizedKey)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if (key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  var owner = currentRenderingInstance;
  if (isDef(factory.owners)) {
    // already pending
    factory.owners.push(owner);
  } else {
    var owners = factory.owners = [owner];
    var sync = true;

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
      warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
if (inBrowser && getNow() > document.createEvent('Event').timeStamp) {
  // if the low-res timestamp which is bigger than the event timestamp
  // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
  // and we need to use the hi-res version for event listeners as well.
  getNow = function () { return performance.now(); };
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
      warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if (!(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.7';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

var convertEnumeratedValue = function (key, value) {
  return isFalsyAttrValue(value) || value === 'false'
    ? 'false'
    // allow arbitrary string value for contenteditable
    : key === 'contenteditable' && isValidContentEditableValue(value)
      ? value
      : 'true'
};

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && value !== '' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */

/*  */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1 (event, handler, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

// #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.
var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

function add$1 (
  name,
  handler,
  capture,
  passive
) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;
    handler = original._wrapper = function (e) {
      if (
        // no bubbling, should always fire.
        // this is just a safety net in case event.timeStamp is unreliable in
        // certain weird environments...
        e.target === e.currentTarget ||
        // event is fired after handler attachment
        e.timeStamp >= attachedTimestamp ||
        // #9462 bail for iOS 9 bug: event.timeStamp is 0 after history.pushState
        e.timeStamp === 0 ||
        // #9448 bail if event is fired in another document in a multi-page
        // electron/nw.js app, since event.timeStamp will be using a different
        // starting reference
        e.target.ownerDocument !== document
      ) {
        return original.apply(this, arguments)
      }
    };
  }
  target$1.addEventListener(
    name,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  name,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    name,
    handler._wrapper || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

var svgContainer;

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value' && elm.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
      // IE doesn't support innerHTML for SVG elements
      svgContainer = svgContainer || document.createElement('div');
      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
      var svg = svgContainer.firstChild;
      while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }
      while (svg.firstChild) {
        elm.appendChild(svg.firstChild);
      }
    } else if (
      // skip the update if old and new VDOM state is the same.
      // `value` is handled separately because the DOM value may be temporarily
      // out of sync with VDOM state due to focus, composition and modifiers.
      // This  #4521 by skipping the unnecesarry `checked` update.
      cur !== oldProps[key]
    ) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

var whitespaceRE = /\s+/;

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  // JSDOM may return undefined for transition properties
  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs (s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

var isVShowDirective = function (d) { return d.name === 'show'; };

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(isNotTextNode);
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  beforeMount: function beforeMount () {
    var this$1 = this;

    var update = this._update;
    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1);
      // force removing pass
      this$1.__patch__(
        this$1._vnode,
        this$1.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (e && e.target !== el) {
            return
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if (config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

module.exports = Vue;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":5}],8:[function(require,module,exports){
(function (process){
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./vue.runtime.common.prod.js')
} else {
  module.exports = require('./vue.runtime.common.dev.js')
}

}).call(this,require('_process'))
},{"./vue.runtime.common.dev.js":7,"./vue.runtime.common.prod.js":9,"_process":4}],9:[function(require,module,exports){
(function (global,setImmediate){
/*!
 * Vue.js v2.6.7
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
"use strict";var t=Object.freeze({});function e(t){return null==t}function n(t){return null!=t}function r(t){return!0===t}function o(t){return"string"==typeof t||"number"==typeof t||"symbol"==typeof t||"boolean"==typeof t}function i(t){return null!==t&&"object"==typeof t}var a=Object.prototype.toString;function s(t){return"[object Object]"===a.call(t)}function c(t){var e=parseFloat(String(t));return e>=0&&Math.floor(e)===e&&isFinite(t)}function u(t){return n(t)&&"function"==typeof t.then&&"function"==typeof t.catch}function l(t){return null==t?"":Array.isArray(t)||s(t)&&t.toString===a?JSON.stringify(t,null,2):String(t)}function f(t){var e=parseFloat(t);return isNaN(e)?t:e}function p(t,e){for(var n=Object.create(null),r=t.split(","),o=0;o<r.length;o++)n[r[o]]=!0;return e?function(t){return n[t.toLowerCase()]}:function(t){return n[t]}}var d=p("key,ref,slot,slot-scope,is");function v(t,e){if(t.length){var n=t.indexOf(e);if(n>-1)return t.splice(n,1)}}var h=Object.prototype.hasOwnProperty;function m(t,e){return h.call(t,e)}function y(t){var e=Object.create(null);return function(n){return e[n]||(e[n]=t(n))}}var g=/-(\w)/g,_=y(function(t){return t.replace(g,function(t,e){return e?e.toUpperCase():""})}),b=y(function(t){return t.charAt(0).toUpperCase()+t.slice(1)}),C=/\B([A-Z])/g,$=y(function(t){return t.replace(C,"-$1").toLowerCase()});var w=Function.prototype.bind?function(t,e){return t.bind(e)}:function(t,e){function n(n){var r=arguments.length;return r?r>1?t.apply(e,arguments):t.call(e,n):t.call(e)}return n._length=t.length,n};function A(t,e){e=e||0;for(var n=t.length-e,r=new Array(n);n--;)r[n]=t[n+e];return r}function x(t,e){for(var n in e)t[n]=e[n];return t}function O(t){for(var e={},n=0;n<t.length;n++)t[n]&&x(e,t[n]);return e}function k(t,e,n){}var S=function(t,e,n){return!1},E=function(t){return t};function j(t,e){if(t===e)return!0;var n=i(t),r=i(e);if(!n||!r)return!n&&!r&&String(t)===String(e);try{var o=Array.isArray(t),a=Array.isArray(e);if(o&&a)return t.length===e.length&&t.every(function(t,n){return j(t,e[n])});if(t instanceof Date&&e instanceof Date)return t.getTime()===e.getTime();if(o||a)return!1;var s=Object.keys(t),c=Object.keys(e);return s.length===c.length&&s.every(function(n){return j(t[n],e[n])})}catch(t){return!1}}function T(t,e){for(var n=0;n<t.length;n++)if(j(t[n],e))return n;return-1}function I(t){var e=!1;return function(){e||(e=!0,t.apply(this,arguments))}}var D="data-server-rendered",N=["component","directive","filter"],P=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured","serverPrefetch"],L={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:S,isReservedAttr:S,isUnknownElement:S,getTagNamespace:k,parsePlatformTagName:E,mustUseProp:S,async:!0,_lifecycleHooks:P};function M(t,e,n,r){Object.defineProperty(t,e,{value:n,enumerable:!!r,writable:!0,configurable:!0})}var R=new RegExp("[^a-zA-Z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c-\u200d\u203f-\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd.$_\\d]");var F,U="__proto__"in{},H="undefined"!=typeof window,V="undefined"!=typeof WXEnvironment&&!!WXEnvironment.platform,z=V&&WXEnvironment.platform.toLowerCase(),B=H&&window.navigator.userAgent.toLowerCase(),W=B&&/msie|trident/.test(B),q=B&&B.indexOf("msie 9.0")>0,K=B&&B.indexOf("edge/")>0,X=(B&&B.indexOf("android"),B&&/iphone|ipad|ipod|ios/.test(B)||"ios"===z),G=(B&&/chrome\/\d+/.test(B),B&&/phantomjs/.test(B),B&&B.match(/firefox\/(\d+)/)),Z={}.watch,J=!1;if(H)try{var Q={};Object.defineProperty(Q,"passive",{get:function(){J=!0}}),window.addEventListener("test-passive",null,Q)}catch(t){}var Y=function(){return void 0===F&&(F=!H&&!V&&"undefined"!=typeof global&&(global.process&&"server"===global.process.env.VUE_ENV)),F},tt=H&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__;function et(t){return"function"==typeof t&&/native code/.test(t.toString())}var nt,rt="undefined"!=typeof Symbol&&et(Symbol)&&"undefined"!=typeof Reflect&&et(Reflect.ownKeys);nt="undefined"!=typeof Set&&et(Set)?Set:function(){function t(){this.set=Object.create(null)}return t.prototype.has=function(t){return!0===this.set[t]},t.prototype.add=function(t){this.set[t]=!0},t.prototype.clear=function(){this.set=Object.create(null)},t}();var ot=k,it=0,at=function(){this.id=it++,this.subs=[]};at.prototype.addSub=function(t){this.subs.push(t)},at.prototype.removeSub=function(t){v(this.subs,t)},at.prototype.depend=function(){at.target&&at.target.addDep(this)},at.prototype.notify=function(){for(var t=this.subs.slice(),e=0,n=t.length;e<n;e++)t[e].update()},at.target=null;var st=[];function ct(t){st.push(t),at.target=t}function ut(){st.pop(),at.target=st[st.length-1]}var lt=function(t,e,n,r,o,i,a,s){this.tag=t,this.data=e,this.children=n,this.text=r,this.elm=o,this.ns=void 0,this.context=i,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=e&&e.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1},ft={child:{configurable:!0}};ft.child.get=function(){return this.componentInstance},Object.defineProperties(lt.prototype,ft);var pt=function(t){void 0===t&&(t="");var e=new lt;return e.text=t,e.isComment=!0,e};function dt(t){return new lt(void 0,void 0,void 0,String(t))}function vt(t){var e=new lt(t.tag,t.data,t.children&&t.children.slice(),t.text,t.elm,t.context,t.componentOptions,t.asyncFactory);return e.ns=t.ns,e.isStatic=t.isStatic,e.key=t.key,e.isComment=t.isComment,e.fnContext=t.fnContext,e.fnOptions=t.fnOptions,e.fnScopeId=t.fnScopeId,e.asyncMeta=t.asyncMeta,e.isCloned=!0,e}var ht=Array.prototype,mt=Object.create(ht);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){var e=ht[t];M(mt,t,function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var o,i=e.apply(this,n),a=this.__ob__;switch(t){case"push":case"unshift":o=n;break;case"splice":o=n.slice(2)}return o&&a.observeArray(o),a.dep.notify(),i})});var yt=Object.getOwnPropertyNames(mt),gt=!0;function _t(t){gt=t}var bt=function(t){var e;this.value=t,this.dep=new at,this.vmCount=0,M(t,"__ob__",this),Array.isArray(t)?(U?(e=mt,t.__proto__=e):function(t,e,n){for(var r=0,o=n.length;r<o;r++){var i=n[r];M(t,i,e[i])}}(t,mt,yt),this.observeArray(t)):this.walk(t)};function Ct(t,e){var n;if(i(t)&&!(t instanceof lt))return m(t,"__ob__")&&t.__ob__ instanceof bt?n=t.__ob__:gt&&!Y()&&(Array.isArray(t)||s(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new bt(t)),e&&n&&n.vmCount++,n}function $t(t,e,n,r,o){var i=new at,a=Object.getOwnPropertyDescriptor(t,e);if(!a||!1!==a.configurable){var s=a&&a.get,c=a&&a.set;s&&!c||2!==arguments.length||(n=t[e]);var u=!o&&Ct(n);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):n;return at.target&&(i.depend(),u&&(u.dep.depend(),Array.isArray(e)&&function t(e){for(var n=void 0,r=0,o=e.length;r<o;r++)(n=e[r])&&n.__ob__&&n.__ob__.dep.depend(),Array.isArray(n)&&t(n)}(e))),e},set:function(e){var r=s?s.call(t):n;e===r||e!=e&&r!=r||s&&!c||(c?c.call(t,e):n=e,u=!o&&Ct(e),i.notify())}})}}function wt(t,e,n){if(Array.isArray(t)&&c(e))return t.length=Math.max(t.length,e),t.splice(e,1,n),n;if(e in t&&!(e in Object.prototype))return t[e]=n,n;var r=t.__ob__;return t._isVue||r&&r.vmCount?n:r?($t(r.value,e,n),r.dep.notify(),n):(t[e]=n,n)}function At(t,e){if(Array.isArray(t)&&c(e))t.splice(e,1);else{var n=t.__ob__;t._isVue||n&&n.vmCount||m(t,e)&&(delete t[e],n&&n.dep.notify())}}bt.prototype.walk=function(t){for(var e=Object.keys(t),n=0;n<e.length;n++)$t(t,e[n])},bt.prototype.observeArray=function(t){for(var e=0,n=t.length;e<n;e++)Ct(t[e])};var xt=L.optionMergeStrategies;function Ot(t,e){if(!e)return t;for(var n,r,o,i=rt?Reflect.ownKeys(e):Object.keys(e),a=0;a<i.length;a++)"__ob__"!==(n=i[a])&&(r=t[n],o=e[n],m(t,n)?r!==o&&s(r)&&s(o)&&Ot(r,o):wt(t,n,o));return t}function kt(t,e,n){return n?function(){var r="function"==typeof e?e.call(n,n):e,o="function"==typeof t?t.call(n,n):t;return r?Ot(r,o):o}:e?t?function(){return Ot("function"==typeof e?e.call(this,this):e,"function"==typeof t?t.call(this,this):t)}:e:t}function St(t,e){var n=e?t?t.concat(e):Array.isArray(e)?e:[e]:t;return n?function(t){for(var e=[],n=0;n<t.length;n++)-1===e.indexOf(t[n])&&e.push(t[n]);return e}(n):n}function Et(t,e,n,r){var o=Object.create(t||null);return e?x(o,e):o}xt.data=function(t,e,n){return n?kt(t,e,n):e&&"function"!=typeof e?t:kt(t,e)},P.forEach(function(t){xt[t]=St}),N.forEach(function(t){xt[t+"s"]=Et}),xt.watch=function(t,e,n,r){if(t===Z&&(t=void 0),e===Z&&(e=void 0),!e)return Object.create(t||null);if(!t)return e;var o={};for(var i in x(o,t),e){var a=o[i],s=e[i];a&&!Array.isArray(a)&&(a=[a]),o[i]=a?a.concat(s):Array.isArray(s)?s:[s]}return o},xt.props=xt.methods=xt.inject=xt.computed=function(t,e,n,r){if(!t)return e;var o=Object.create(null);return x(o,t),e&&x(o,e),o},xt.provide=kt;var jt=function(t,e){return void 0===e?t:e};function Tt(t,e,n){if("function"==typeof e&&(e=e.options),function(t,e){var n=t.props;if(n){var r,o,i={};if(Array.isArray(n))for(r=n.length;r--;)"string"==typeof(o=n[r])&&(i[_(o)]={type:null});else if(s(n))for(var a in n)o=n[a],i[_(a)]=s(o)?o:{type:o};t.props=i}}(e),function(t,e){var n=t.inject;if(n){var r=t.inject={};if(Array.isArray(n))for(var o=0;o<n.length;o++)r[n[o]]={from:n[o]};else if(s(n))for(var i in n){var a=n[i];r[i]=s(a)?x({from:i},a):{from:a}}}}(e),function(t){var e=t.directives;if(e)for(var n in e){var r=e[n];"function"==typeof r&&(e[n]={bind:r,update:r})}}(e),!e._base&&(e.extends&&(t=Tt(t,e.extends,n)),e.mixins))for(var r=0,o=e.mixins.length;r<o;r++)t=Tt(t,e.mixins[r],n);var i,a={};for(i in t)c(i);for(i in e)m(t,i)||c(i);function c(r){var o=xt[r]||jt;a[r]=o(t[r],e[r],n,r)}return a}function It(t,e,n,r){if("string"==typeof n){var o=t[e];if(m(o,n))return o[n];var i=_(n);if(m(o,i))return o[i];var a=b(i);return m(o,a)?o[a]:o[n]||o[i]||o[a]}}function Dt(t,e,n,r){var o=e[t],i=!m(n,t),a=n[t],s=Lt(Boolean,o.type);if(s>-1)if(i&&!m(o,"default"))a=!1;else if(""===a||a===$(t)){var c=Lt(String,o.type);(c<0||s<c)&&(a=!0)}if(void 0===a){a=function(t,e,n){if(!m(e,"default"))return;var r=e.default;if(t&&t.$options.propsData&&void 0===t.$options.propsData[n]&&void 0!==t._props[n])return t._props[n];return"function"==typeof r&&"Function"!==Nt(e.type)?r.call(t):r}(r,o,t);var u=gt;_t(!0),Ct(a),_t(u)}return a}function Nt(t){var e=t&&t.toString().match(/^\s*function (\w+)/);return e?e[1]:""}function Pt(t,e){return Nt(t)===Nt(e)}function Lt(t,e){if(!Array.isArray(e))return Pt(e,t)?0:-1;for(var n=0,r=e.length;n<r;n++)if(Pt(e[n],t))return n;return-1}function Mt(t,e,n){ct();try{if(e)for(var r=e;r=r.$parent;){var o=r.$options.errorCaptured;if(o)for(var i=0;i<o.length;i++)try{if(!1===o[i].call(r,t,e,n))return}catch(t){Ft(t,r,"errorCaptured hook")}}Ft(t,e,n)}finally{ut()}}function Rt(t,e,n,r,o){var i;try{(i=n?t.apply(e,n):t.call(e))&&!i._isVue&&u(i)&&(i=i.catch(function(t){return Mt(t,r,o+" (Promise/async)")}))}catch(t){Mt(t,r,o)}return i}function Ft(t,e,n){if(L.errorHandler)try{return L.errorHandler.call(null,t,e,n)}catch(e){e!==t&&Ut(e,null,"config.errorHandler")}Ut(t,e,n)}function Ut(t,e,n){if(!H&&!V||"undefined"==typeof console)throw t;console.error(t)}var Ht,Vt=!1,zt=[],Bt=!1;function Wt(){Bt=!1;var t=zt.slice(0);zt.length=0;for(var e=0;e<t.length;e++)t[e]()}if("undefined"!=typeof Promise&&et(Promise)){var qt=Promise.resolve();Ht=function(){qt.then(Wt),X&&setTimeout(k)},Vt=!0}else if(W||"undefined"==typeof MutationObserver||!et(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())Ht="undefined"!=typeof setImmediate&&et(setImmediate)?function(){setImmediate(Wt)}:function(){setTimeout(Wt,0)};else{var Kt=1,Xt=new MutationObserver(Wt),Gt=document.createTextNode(String(Kt));Xt.observe(Gt,{characterData:!0}),Ht=function(){Kt=(Kt+1)%2,Gt.data=String(Kt)},Vt=!0}function Zt(t,e){var n;if(zt.push(function(){if(t)try{t.call(e)}catch(t){Mt(t,e,"nextTick")}else n&&n(e)}),Bt||(Bt=!0,Ht()),!t&&"undefined"!=typeof Promise)return new Promise(function(t){n=t})}var Jt=new nt;function Qt(t){!function t(e,n){var r,o;var a=Array.isArray(e);if(!a&&!i(e)||Object.isFrozen(e)||e instanceof lt)return;if(e.__ob__){var s=e.__ob__.dep.id;if(n.has(s))return;n.add(s)}if(a)for(r=e.length;r--;)t(e[r],n);else for(o=Object.keys(e),r=o.length;r--;)t(e[o[r]],n)}(t,Jt),Jt.clear()}var Yt=y(function(t){var e="&"===t.charAt(0),n="~"===(t=e?t.slice(1):t).charAt(0),r="!"===(t=n?t.slice(1):t).charAt(0);return{name:t=r?t.slice(1):t,once:n,capture:r,passive:e}});function te(t,e){function n(){var t=arguments,r=n.fns;if(!Array.isArray(r))return Rt(r,null,arguments,e,"v-on handler");for(var o=r.slice(),i=0;i<o.length;i++)Rt(o[i],null,t,e,"v-on handler")}return n.fns=t,n}function ee(t,n,o,i,a,s){var c,u,l,f;for(c in t)u=t[c],l=n[c],f=Yt(c),e(u)||(e(l)?(e(u.fns)&&(u=t[c]=te(u,s)),r(f.once)&&(u=t[c]=a(f.name,u,f.capture)),o(f.name,u,f.capture,f.passive,f.params)):u!==l&&(l.fns=u,t[c]=l));for(c in n)e(t[c])&&i((f=Yt(c)).name,n[c],f.capture)}function ne(t,o,i){var a;t instanceof lt&&(t=t.data.hook||(t.data.hook={}));var s=t[o];function c(){i.apply(this,arguments),v(a.fns,c)}e(s)?a=te([c]):n(s.fns)&&r(s.merged)?(a=s).fns.push(c):a=te([s,c]),a.merged=!0,t[o]=a}function re(t,e,r,o,i){if(n(e)){if(m(e,r))return t[r]=e[r],i||delete e[r],!0;if(m(e,o))return t[r]=e[o],i||delete e[o],!0}return!1}function oe(t){return o(t)?[dt(t)]:Array.isArray(t)?function t(i,a){var s=[];var c,u,l,f;for(c=0;c<i.length;c++)e(u=i[c])||"boolean"==typeof u||(l=s.length-1,f=s[l],Array.isArray(u)?u.length>0&&(ie((u=t(u,(a||"")+"_"+c))[0])&&ie(f)&&(s[l]=dt(f.text+u[0].text),u.shift()),s.push.apply(s,u)):o(u)?ie(f)?s[l]=dt(f.text+u):""!==u&&s.push(dt(u)):ie(u)&&ie(f)?s[l]=dt(f.text+u.text):(r(i._isVList)&&n(u.tag)&&e(u.key)&&n(a)&&(u.key="__vlist"+a+"_"+c+"__"),s.push(u)));return s}(t):void 0}function ie(t){return n(t)&&n(t.text)&&!1===t.isComment}function ae(t,e){if(t){for(var n=Object.create(null),r=rt?Reflect.ownKeys(t):Object.keys(t),o=0;o<r.length;o++){var i=r[o];if("__ob__"!==i){for(var a=t[i].from,s=e;s;){if(s._provided&&m(s._provided,a)){n[i]=s._provided[a];break}s=s.$parent}if(!s&&"default"in t[i]){var c=t[i].default;n[i]="function"==typeof c?c.call(e):c}}}return n}}function se(t,e){if(!t||!t.length)return{};for(var n={},r=0,o=t.length;r<o;r++){var i=t[r],a=i.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot,i.context!==e&&i.fnContext!==e||!a||null==a.slot)(n.default||(n.default=[])).push(i);else{var s=a.slot,c=n[s]||(n[s]=[]);"template"===i.tag?c.push.apply(c,i.children||[]):c.push(i)}}for(var u in n)n[u].every(ce)&&delete n[u];return n}function ce(t){return t.isComment&&!t.asyncFactory||" "===t.text}function ue(e,n,r){var o,i=!e||!!e.$stable,a=e&&e.$key;if(e){if(e._normalized)return e._normalized;if(i&&r&&r!==t&&a===r.$key&&0===Object.keys(n).length)return r;for(var s in o={},e)e[s]&&"$"!==s[0]&&(o[s]=le(n,s,e[s]))}else o={};for(var c in n)c in o||(o[c]=fe(n,c));return e&&Object.isExtensible(e)&&(e._normalized=o),M(o,"$stable",i),M(o,"$key",a),o}function le(t,e,n){var r=function(){var t=arguments.length?n.apply(null,arguments):n({});return(t=t&&"object"==typeof t&&!Array.isArray(t)?[t]:oe(t))&&0===t.length?void 0:t};return n.proxy&&Object.defineProperty(t,e,{get:r,enumerable:!0,configurable:!0}),r}function fe(t,e){return function(){return t[e]}}function pe(t,e){var r,o,a,s,c;if(Array.isArray(t)||"string"==typeof t)for(r=new Array(t.length),o=0,a=t.length;o<a;o++)r[o]=e(t[o],o);else if("number"==typeof t)for(r=new Array(t),o=0;o<t;o++)r[o]=e(o+1,o);else if(i(t))if(rt&&t[Symbol.iterator]){r=[];for(var u=t[Symbol.iterator](),l=u.next();!l.done;)r.push(e(l.value,r.length)),l=u.next()}else for(s=Object.keys(t),r=new Array(s.length),o=0,a=s.length;o<a;o++)c=s[o],r[o]=e(t[c],c,o);return n(r)||(r=[]),r._isVList=!0,r}function de(t,e,n,r){var o,i=this.$scopedSlots[t];i?(n=n||{},r&&(n=x(x({},r),n)),o=i(n)||e):o=this.$slots[t]||e;var a=n&&n.slot;return a?this.$createElement("template",{slot:a},o):o}function ve(t){return It(this.$options,"filters",t)||E}function he(t,e){return Array.isArray(t)?-1===t.indexOf(e):t!==e}function me(t,e,n,r,o){var i=L.keyCodes[e]||n;return o&&r&&!L.keyCodes[e]?he(o,r):i?he(i,t):r?$(r)!==e:void 0}function ye(t,e,n,r,o){if(n)if(i(n)){var a;Array.isArray(n)&&(n=O(n));var s=function(i){if("class"===i||"style"===i||d(i))a=t;else{var s=t.attrs&&t.attrs.type;a=r||L.mustUseProp(e,s,i)?t.domProps||(t.domProps={}):t.attrs||(t.attrs={})}var c=_(i);i in a||c in a||(a[i]=n[i],o&&((t.on||(t.on={}))["update:"+c]=function(t){n[i]=t}))};for(var c in n)s(c)}else;return t}function ge(t,e){var n=this._staticTrees||(this._staticTrees=[]),r=n[t];return r&&!e?r:(be(r=n[t]=this.$options.staticRenderFns[t].call(this._renderProxy,null,this),"__static__"+t,!1),r)}function _e(t,e,n){return be(t,"__once__"+e+(n?"_"+n:""),!0),t}function be(t,e,n){if(Array.isArray(t))for(var r=0;r<t.length;r++)t[r]&&"string"!=typeof t[r]&&Ce(t[r],e+"_"+r,n);else Ce(t,e,n)}function Ce(t,e,n){t.isStatic=!0,t.key=e,t.isOnce=n}function $e(t,e){if(e)if(s(e)){var n=t.on=t.on?x({},t.on):{};for(var r in e){var o=n[r],i=e[r];n[r]=o?[].concat(o,i):i}}else;return t}function we(t,e,n,r){e=e||{$stable:!n};for(var o=0;o<t.length;o++){var i=t[o];Array.isArray(i)?we(i,e,n):i&&(i.proxy&&(i.fn.proxy=!0),e[i.key]=i.fn)}return r&&(e.$key=r),e}function Ae(t,e){for(var n=0;n<e.length;n+=2){var r=e[n];"string"==typeof r&&r&&(t[e[n]]=e[n+1])}return t}function xe(t,e){return"string"==typeof t?e+t:t}function Oe(t){t._o=_e,t._n=f,t._s=l,t._l=pe,t._t=de,t._q=j,t._i=T,t._m=ge,t._f=ve,t._k=me,t._b=ye,t._v=dt,t._e=pt,t._u=we,t._g=$e,t._d=Ae,t._p=xe}function ke(e,n,o,i,a){var s,c=this,u=a.options;m(i,"_uid")?(s=Object.create(i))._original=i:(s=i,i=i._original);var l=r(u._compiled),f=!l;this.data=e,this.props=n,this.children=o,this.parent=i,this.listeners=e.on||t,this.injections=ae(u.inject,i),this.slots=function(){return c.$slots||ue(e.scopedSlots,c.$slots=se(o,i)),c.$slots},Object.defineProperty(this,"scopedSlots",{enumerable:!0,get:function(){return ue(e.scopedSlots,this.slots())}}),l&&(this.$options=u,this.$slots=this.slots(),this.$scopedSlots=ue(e.scopedSlots,this.$slots)),u._scopeId?this._c=function(t,e,n,r){var o=Le(s,t,e,n,r,f);return o&&!Array.isArray(o)&&(o.fnScopeId=u._scopeId,o.fnContext=i),o}:this._c=function(t,e,n,r){return Le(s,t,e,n,r,f)}}function Se(t,e,n,r,o){var i=vt(t);return i.fnContext=n,i.fnOptions=r,e.slot&&((i.data||(i.data={})).slot=e.slot),i}function Ee(t,e){for(var n in e)t[_(n)]=e[n]}Oe(ke.prototype);var je={init:function(t,e){if(t.componentInstance&&!t.componentInstance._isDestroyed&&t.data.keepAlive){var r=t;je.prepatch(r,r)}else{(t.componentInstance=function(t,e){var r={_isComponent:!0,_parentVnode:t,parent:e},o=t.data.inlineTemplate;n(o)&&(r.render=o.render,r.staticRenderFns=o.staticRenderFns);return new t.componentOptions.Ctor(r)}(t,qe)).$mount(e?t.elm:void 0,e)}},prepatch:function(e,n){var r=n.componentOptions;!function(e,n,r,o,i){var a=o.data.scopedSlots,s=e.$scopedSlots,c=!!(a&&!a.$stable||s!==t&&!s.$stable||a&&e.$scopedSlots.$key!==a.$key),u=!!(i||e.$options._renderChildren||c);e.$options._parentVnode=o,e.$vnode=o,e._vnode&&(e._vnode.parent=o);if(e.$options._renderChildren=i,e.$attrs=o.data.attrs||t,e.$listeners=r||t,n&&e.$options.props){_t(!1);for(var l=e._props,f=e.$options._propKeys||[],p=0;p<f.length;p++){var d=f[p],v=e.$options.props;l[d]=Dt(d,v,n,e)}_t(!0),e.$options.propsData=n}r=r||t;var h=e.$options._parentListeners;e.$options._parentListeners=r,We(e,r,h),u&&(e.$slots=se(i,o.context),e.$forceUpdate())}(n.componentInstance=e.componentInstance,r.propsData,r.listeners,n,r.children)},insert:function(t){var e,n=t.context,r=t.componentInstance;r._isMounted||(r._isMounted=!0,Ze(r,"mounted")),t.data.keepAlive&&(n._isMounted?((e=r)._inactive=!1,Qe.push(e)):Ge(r,!0))},destroy:function(t){var e=t.componentInstance;e._isDestroyed||(t.data.keepAlive?function t(e,n){if(n&&(e._directInactive=!0,Xe(e)))return;if(!e._inactive){e._inactive=!0;for(var r=0;r<e.$children.length;r++)t(e.$children[r]);Ze(e,"deactivated")}}(e,!0):e.$destroy())}},Te=Object.keys(je);function Ie(o,a,s,c,l){if(!e(o)){var f=s.$options._base;if(i(o)&&(o=f.extend(o)),"function"==typeof o){var p;if(e(o.cid)&&void 0===(o=function(t,o){if(r(t.error)&&n(t.errorComp))return t.errorComp;if(n(t.resolved))return t.resolved;if(r(t.loading)&&n(t.loadingComp))return t.loadingComp;var a=Re;if(!n(t.owners)){var s=t.owners=[a],c=!0,l=function(t){for(var e=0,n=s.length;e<n;e++)s[e].$forceUpdate();t&&(s.length=0)},f=I(function(e){t.resolved=Fe(e,o),c?s.length=0:l(!0)}),p=I(function(e){n(t.errorComp)&&(t.error=!0,l(!0))}),d=t(f,p);return i(d)&&(u(d)?e(t.resolved)&&d.then(f,p):u(d.component)&&(d.component.then(f,p),n(d.error)&&(t.errorComp=Fe(d.error,o)),n(d.loading)&&(t.loadingComp=Fe(d.loading,o),0===d.delay?t.loading=!0:setTimeout(function(){e(t.resolved)&&e(t.error)&&(t.loading=!0,l(!1))},d.delay||200)),n(d.timeout)&&setTimeout(function(){e(t.resolved)&&p(null)},d.timeout))),c=!1,t.loading?t.loadingComp:t.resolved}t.owners.push(a)}(p=o,f)))return function(t,e,n,r,o){var i=pt();return i.asyncFactory=t,i.asyncMeta={data:e,context:n,children:r,tag:o},i}(p,a,s,c,l);a=a||{},gn(o),n(a.model)&&function(t,e){var r=t.model&&t.model.prop||"value",o=t.model&&t.model.event||"input";(e.attrs||(e.attrs={}))[r]=e.model.value;var i=e.on||(e.on={}),a=i[o],s=e.model.callback;n(a)?(Array.isArray(a)?-1===a.indexOf(s):a!==s)&&(i[o]=[s].concat(a)):i[o]=s}(o.options,a);var d=function(t,r,o){var i=r.options.props;if(!e(i)){var a={},s=t.attrs,c=t.props;if(n(s)||n(c))for(var u in i){var l=$(u);re(a,c,u,l,!0)||re(a,s,u,l,!1)}return a}}(a,o);if(r(o.options.functional))return function(e,r,o,i,a){var s=e.options,c={},u=s.props;if(n(u))for(var l in u)c[l]=Dt(l,u,r||t);else n(o.attrs)&&Ee(c,o.attrs),n(o.props)&&Ee(c,o.props);var f=new ke(o,c,a,i,e),p=s.render.call(null,f._c,f);if(p instanceof lt)return Se(p,o,f.parent,s);if(Array.isArray(p)){for(var d=oe(p)||[],v=new Array(d.length),h=0;h<d.length;h++)v[h]=Se(d[h],o,f.parent,s);return v}}(o,d,a,s,c);var v=a.on;if(a.on=a.nativeOn,r(o.options.abstract)){var h=a.slot;a={},h&&(a.slot=h)}!function(t){for(var e=t.hook||(t.hook={}),n=0;n<Te.length;n++){var r=Te[n],o=e[r],i=je[r];o===i||o&&o._merged||(e[r]=o?De(i,o):i)}}(a);var m=o.options.name||l;return new lt("vue-component-"+o.cid+(m?"-"+m:""),a,void 0,void 0,void 0,s,{Ctor:o,propsData:d,listeners:v,tag:l,children:c},p)}}}function De(t,e){var n=function(n,r){t(n,r),e(n,r)};return n._merged=!0,n}var Ne=1,Pe=2;function Le(t,a,s,c,u,l){return(Array.isArray(s)||o(s))&&(u=c,c=s,s=void 0),r(l)&&(u=Pe),function(t,o,a,s,c){if(n(a)&&n(a.__ob__))return pt();n(a)&&n(a.is)&&(o=a.is);if(!o)return pt();Array.isArray(s)&&"function"==typeof s[0]&&((a=a||{}).scopedSlots={default:s[0]},s.length=0);c===Pe?s=oe(s):c===Ne&&(s=function(t){for(var e=0;e<t.length;e++)if(Array.isArray(t[e]))return Array.prototype.concat.apply([],t);return t}(s));var u,l;if("string"==typeof o){var f;l=t.$vnode&&t.$vnode.ns||L.getTagNamespace(o),u=L.isReservedTag(o)?new lt(L.parsePlatformTagName(o),a,s,void 0,void 0,t):a&&a.pre||!n(f=It(t.$options,"components",o))?new lt(o,a,s,void 0,void 0,t):Ie(f,a,t,s,o)}else u=Ie(o,a,t,s);return Array.isArray(u)?u:n(u)?(n(l)&&function t(o,i,a){o.ns=i;"foreignObject"===o.tag&&(i=void 0,a=!0);if(n(o.children))for(var s=0,c=o.children.length;s<c;s++){var u=o.children[s];n(u.tag)&&(e(u.ns)||r(a)&&"svg"!==u.tag)&&t(u,i,a)}}(u,l),n(a)&&function(t){i(t.style)&&Qt(t.style);i(t.class)&&Qt(t.class)}(a),u):pt()}(t,a,s,c,u)}var Me,Re=null;function Fe(t,e){return(t.__esModule||rt&&"Module"===t[Symbol.toStringTag])&&(t=t.default),i(t)?e.extend(t):t}function Ue(t){return t.isComment&&t.asyncFactory}function He(t){if(Array.isArray(t))for(var e=0;e<t.length;e++){var r=t[e];if(n(r)&&(n(r.componentOptions)||Ue(r)))return r}}function Ve(t,e){Me.$on(t,e)}function ze(t,e){Me.$off(t,e)}function Be(t,e){var n=Me;return function r(){null!==e.apply(null,arguments)&&n.$off(t,r)}}function We(t,e,n){Me=t,ee(e,n||{},Ve,ze,Be,t),Me=void 0}var qe=null;function Ke(t){var e=qe;return qe=t,function(){qe=e}}function Xe(t){for(;t&&(t=t.$parent);)if(t._inactive)return!0;return!1}function Ge(t,e){if(e){if(t._directInactive=!1,Xe(t))return}else if(t._directInactive)return;if(t._inactive||null===t._inactive){t._inactive=!1;for(var n=0;n<t.$children.length;n++)Ge(t.$children[n]);Ze(t,"activated")}}function Ze(t,e){ct();var n=t.$options[e],r=e+" hook";if(n)for(var o=0,i=n.length;o<i;o++)Rt(n[o],t,null,t,r);t._hasHookEvent&&t.$emit("hook:"+e),ut()}var Je=[],Qe=[],Ye={},tn=!1,en=!1,nn=0;var rn=0,on=Date.now;function an(){var t,e;for(rn=on(),en=!0,Je.sort(function(t,e){return t.id-e.id}),nn=0;nn<Je.length;nn++)(t=Je[nn]).before&&t.before(),e=t.id,Ye[e]=null,t.run();var n=Qe.slice(),r=Je.slice();nn=Je.length=Qe.length=0,Ye={},tn=en=!1,function(t){for(var e=0;e<t.length;e++)t[e]._inactive=!0,Ge(t[e],!0)}(n),function(t){var e=t.length;for(;e--;){var n=t[e],r=n.vm;r._watcher===n&&r._isMounted&&!r._isDestroyed&&Ze(r,"updated")}}(r),tt&&L.devtools&&tt.emit("flush")}H&&on()>document.createEvent("Event").timeStamp&&(on=function(){return performance.now()});var sn=0,cn=function(t,e,n,r,o){this.vm=t,o&&(t._watcher=this),t._watchers.push(this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync,this.before=r.before):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++sn,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new nt,this.newDepIds=new nt,this.expression="","function"==typeof e?this.getter=e:(this.getter=function(t){if(!R.test(t)){var e=t.split(".");return function(t){for(var n=0;n<e.length;n++){if(!t)return;t=t[e[n]]}return t}}}(e),this.getter||(this.getter=k)),this.value=this.lazy?void 0:this.get()};cn.prototype.get=function(){var t;ct(this);var e=this.vm;try{t=this.getter.call(e,e)}catch(t){if(!this.user)throw t;Mt(t,e,'getter for watcher "'+this.expression+'"')}finally{this.deep&&Qt(t),ut(),this.cleanupDeps()}return t},cn.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},cn.prototype.cleanupDeps=function(){for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var n=this.depIds;this.depIds=this.newDepIds,this.newDepIds=n,this.newDepIds.clear(),n=this.deps,this.deps=this.newDeps,this.newDeps=n,this.newDeps.length=0},cn.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():function(t){var e=t.id;if(null==Ye[e]){if(Ye[e]=!0,en){for(var n=Je.length-1;n>nn&&Je[n].id>t.id;)n--;Je.splice(n+1,0,t)}else Je.push(t);tn||(tn=!0,Zt(an))}}(this)},cn.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||i(t)||this.deep){var e=this.value;if(this.value=t,this.user)try{this.cb.call(this.vm,t,e)}catch(t){Mt(t,this.vm,'callback for watcher "'+this.expression+'"')}else this.cb.call(this.vm,t,e)}}},cn.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},cn.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},cn.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||v(this.vm._watchers,this);for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1}};var un={enumerable:!0,configurable:!0,get:k,set:k};function ln(t,e,n){un.get=function(){return this[e][n]},un.set=function(t){this[e][n]=t},Object.defineProperty(t,n,un)}function fn(t){t._watchers=[];var e=t.$options;e.props&&function(t,e){var n=t.$options.propsData||{},r=t._props={},o=t.$options._propKeys=[];t.$parent&&_t(!1);var i=function(i){o.push(i);var a=Dt(i,e,n,t);$t(r,i,a),i in t||ln(t,"_props",i)};for(var a in e)i(a);_t(!0)}(t,e.props),e.methods&&function(t,e){t.$options.props;for(var n in e)t[n]="function"!=typeof e[n]?k:w(e[n],t)}(t,e.methods),e.data?function(t){var e=t.$options.data;s(e=t._data="function"==typeof e?function(t,e){ct();try{return t.call(e,e)}catch(t){return Mt(t,e,"data()"),{}}finally{ut()}}(e,t):e||{})||(e={});var n=Object.keys(e),r=t.$options.props,o=(t.$options.methods,n.length);for(;o--;){var i=n[o];r&&m(r,i)||(a=void 0,36!==(a=(i+"").charCodeAt(0))&&95!==a&&ln(t,"_data",i))}var a;Ct(e,!0)}(t):Ct(t._data={},!0),e.computed&&function(t,e){var n=t._computedWatchers=Object.create(null),r=Y();for(var o in e){var i=e[o],a="function"==typeof i?i:i.get;r||(n[o]=new cn(t,a||k,k,pn)),o in t||dn(t,o,i)}}(t,e.computed),e.watch&&e.watch!==Z&&function(t,e){for(var n in e){var r=e[n];if(Array.isArray(r))for(var o=0;o<r.length;o++)mn(t,n,r[o]);else mn(t,n,r)}}(t,e.watch)}var pn={lazy:!0};function dn(t,e,n){var r=!Y();"function"==typeof n?(un.get=r?vn(e):hn(n),un.set=k):(un.get=n.get?r&&!1!==n.cache?vn(e):hn(n.get):k,un.set=n.set||k),Object.defineProperty(t,e,un)}function vn(t){return function(){var e=this._computedWatchers&&this._computedWatchers[t];if(e)return e.dirty&&e.evaluate(),at.target&&e.depend(),e.value}}function hn(t){return function(){return t.call(this,this)}}function mn(t,e,n,r){return s(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=t[n]),t.$watch(e,n,r)}var yn=0;function gn(t){var e=t.options;if(t.super){var n=gn(t.super);if(n!==t.superOptions){t.superOptions=n;var r=function(t){var e,n=t.options,r=t.sealedOptions;for(var o in n)n[o]!==r[o]&&(e||(e={}),e[o]=n[o]);return e}(t);r&&x(t.extendOptions,r),(e=t.options=Tt(n,t.extendOptions)).name&&(e.components[e.name]=t)}}return e}function _n(t){this._init(t)}function bn(t){t.cid=0;var e=1;t.extend=function(t){t=t||{};var n=this,r=n.cid,o=t._Ctor||(t._Ctor={});if(o[r])return o[r];var i=t.name||n.options.name,a=function(t){this._init(t)};return(a.prototype=Object.create(n.prototype)).constructor=a,a.cid=e++,a.options=Tt(n.options,t),a.super=n,a.options.props&&function(t){var e=t.options.props;for(var n in e)ln(t.prototype,"_props",n)}(a),a.options.computed&&function(t){var e=t.options.computed;for(var n in e)dn(t.prototype,n,e[n])}(a),a.extend=n.extend,a.mixin=n.mixin,a.use=n.use,N.forEach(function(t){a[t]=n[t]}),i&&(a.options.components[i]=a),a.superOptions=n.options,a.extendOptions=t,a.sealedOptions=x({},a.options),o[r]=a,a}}function Cn(t){return t&&(t.Ctor.options.name||t.tag)}function $n(t,e){return Array.isArray(t)?t.indexOf(e)>-1:"string"==typeof t?t.split(",").indexOf(e)>-1:(n=t,"[object RegExp]"===a.call(n)&&t.test(e));var n}function wn(t,e){var n=t.cache,r=t.keys,o=t._vnode;for(var i in n){var a=n[i];if(a){var s=Cn(a.componentOptions);s&&!e(s)&&An(n,i,r,o)}}}function An(t,e,n,r){var o=t[e];!o||r&&o.tag===r.tag||o.componentInstance.$destroy(),t[e]=null,v(n,e)}!function(e){e.prototype._init=function(e){var n=this;n._uid=yn++,n._isVue=!0,e&&e._isComponent?function(t,e){var n=t.$options=Object.create(t.constructor.options),r=e._parentVnode;n.parent=e.parent,n._parentVnode=r;var o=r.componentOptions;n.propsData=o.propsData,n._parentListeners=o.listeners,n._renderChildren=o.children,n._componentTag=o.tag,e.render&&(n.render=e.render,n.staticRenderFns=e.staticRenderFns)}(n,e):n.$options=Tt(gn(n.constructor),e||{},n),n._renderProxy=n,n._self=n,function(t){var e=t.$options,n=e.parent;if(n&&!e.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(t)}t.$parent=n,t.$root=n?n.$root:t,t.$children=[],t.$refs={},t._watcher=null,t._inactive=null,t._directInactive=!1,t._isMounted=!1,t._isDestroyed=!1,t._isBeingDestroyed=!1}(n),function(t){t._events=Object.create(null),t._hasHookEvent=!1;var e=t.$options._parentListeners;e&&We(t,e)}(n),function(e){e._vnode=null,e._staticTrees=null;var n=e.$options,r=e.$vnode=n._parentVnode,o=r&&r.context;e.$slots=se(n._renderChildren,o),e.$scopedSlots=t,e._c=function(t,n,r,o){return Le(e,t,n,r,o,!1)},e.$createElement=function(t,n,r,o){return Le(e,t,n,r,o,!0)};var i=r&&r.data;$t(e,"$attrs",i&&i.attrs||t,null,!0),$t(e,"$listeners",n._parentListeners||t,null,!0)}(n),Ze(n,"beforeCreate"),function(t){var e=ae(t.$options.inject,t);e&&(_t(!1),Object.keys(e).forEach(function(n){$t(t,n,e[n])}),_t(!0))}(n),fn(n),function(t){var e=t.$options.provide;e&&(t._provided="function"==typeof e?e.call(t):e)}(n),Ze(n,"created"),n.$options.el&&n.$mount(n.$options.el)}}(_n),function(t){var e={get:function(){return this._data}},n={get:function(){return this._props}};Object.defineProperty(t.prototype,"$data",e),Object.defineProperty(t.prototype,"$props",n),t.prototype.$set=wt,t.prototype.$delete=At,t.prototype.$watch=function(t,e,n){if(s(e))return mn(this,t,e,n);(n=n||{}).user=!0;var r=new cn(this,t,e,n);if(n.immediate)try{e.call(this,r.value)}catch(t){Mt(t,this,'callback for immediate watcher "'+r.expression+'"')}return function(){r.teardown()}}}(_n),function(t){var e=/^hook:/;t.prototype.$on=function(t,n){var r=this;if(Array.isArray(t))for(var o=0,i=t.length;o<i;o++)r.$on(t[o],n);else(r._events[t]||(r._events[t]=[])).push(n),e.test(t)&&(r._hasHookEvent=!0);return r},t.prototype.$once=function(t,e){var n=this;function r(){n.$off(t,r),e.apply(n,arguments)}return r.fn=e,n.$on(t,r),n},t.prototype.$off=function(t,e){var n=this;if(!arguments.length)return n._events=Object.create(null),n;if(Array.isArray(t)){for(var r=0,o=t.length;r<o;r++)n.$off(t[r],e);return n}var i,a=n._events[t];if(!a)return n;if(!e)return n._events[t]=null,n;for(var s=a.length;s--;)if((i=a[s])===e||i.fn===e){a.splice(s,1);break}return n},t.prototype.$emit=function(t){var e=this._events[t];if(e){e=e.length>1?A(e):e;for(var n=A(arguments,1),r='event handler for "'+t+'"',o=0,i=e.length;o<i;o++)Rt(e[o],this,n,this,r)}return this}}(_n),function(t){t.prototype._update=function(t,e){var n=this,r=n.$el,o=n._vnode,i=Ke(n);n._vnode=t,n.$el=o?n.__patch__(o,t):n.__patch__(n.$el,t,e,!1),i(),r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n),n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el)},t.prototype.$forceUpdate=function(){this._watcher&&this._watcher.update()},t.prototype.$destroy=function(){var t=this;if(!t._isBeingDestroyed){Ze(t,"beforeDestroy"),t._isBeingDestroyed=!0;var e=t.$parent;!e||e._isBeingDestroyed||t.$options.abstract||v(e.$children,t),t._watcher&&t._watcher.teardown();for(var n=t._watchers.length;n--;)t._watchers[n].teardown();t._data.__ob__&&t._data.__ob__.vmCount--,t._isDestroyed=!0,t.__patch__(t._vnode,null),Ze(t,"destroyed"),t.$off(),t.$el&&(t.$el.__vue__=null),t.$vnode&&(t.$vnode.parent=null)}}}(_n),function(t){Oe(t.prototype),t.prototype.$nextTick=function(t){return Zt(t,this)},t.prototype._render=function(){var t,e=this,n=e.$options,r=n.render,o=n._parentVnode;o&&(e.$scopedSlots=ue(o.data.scopedSlots,e.$slots,e.$scopedSlots)),e.$vnode=o;try{Re=e,t=r.call(e._renderProxy,e.$createElement)}catch(n){Mt(n,e,"render"),t=e._vnode}finally{Re=null}return Array.isArray(t)&&1===t.length&&(t=t[0]),t instanceof lt||(t=pt()),t.parent=o,t}}(_n);var xn=[String,RegExp,Array],On={KeepAlive:{name:"keep-alive",abstract:!0,props:{include:xn,exclude:xn,max:[String,Number]},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){for(var t in this.cache)An(this.cache,t,this.keys)},mounted:function(){var t=this;this.$watch("include",function(e){wn(t,function(t){return $n(e,t)})}),this.$watch("exclude",function(e){wn(t,function(t){return!$n(e,t)})})},render:function(){var t=this.$slots.default,e=He(t),n=e&&e.componentOptions;if(n){var r=Cn(n),o=this.include,i=this.exclude;if(o&&(!r||!$n(o,r))||i&&r&&$n(i,r))return e;var a=this.cache,s=this.keys,c=null==e.key?n.Ctor.cid+(n.tag?"::"+n.tag:""):e.key;a[c]?(e.componentInstance=a[c].componentInstance,v(s,c),s.push(c)):(a[c]=e,s.push(c),this.max&&s.length>parseInt(this.max)&&An(a,s[0],s,this._vnode)),e.data.keepAlive=!0}return e||t&&t[0]}}};!function(t){var e={get:function(){return L}};Object.defineProperty(t,"config",e),t.util={warn:ot,extend:x,mergeOptions:Tt,defineReactive:$t},t.set=wt,t.delete=At,t.nextTick=Zt,t.observable=function(t){return Ct(t),t},t.options=Object.create(null),N.forEach(function(e){t.options[e+"s"]=Object.create(null)}),t.options._base=t,x(t.options.components,On),function(t){t.use=function(t){var e=this._installedPlugins||(this._installedPlugins=[]);if(e.indexOf(t)>-1)return this;var n=A(arguments,1);return n.unshift(this),"function"==typeof t.install?t.install.apply(t,n):"function"==typeof t&&t.apply(null,n),e.push(t),this}}(t),function(t){t.mixin=function(t){return this.options=Tt(this.options,t),this}}(t),bn(t),function(t){N.forEach(function(e){t[e]=function(t,n){return n?("component"===e&&s(n)&&(n.name=n.name||t,n=this.options._base.extend(n)),"directive"===e&&"function"==typeof n&&(n={bind:n,update:n}),this.options[e+"s"][t]=n,n):this.options[e+"s"][t]}})}(t)}(_n),Object.defineProperty(_n.prototype,"$isServer",{get:Y}),Object.defineProperty(_n.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Object.defineProperty(_n,"FunctionalRenderContext",{value:ke}),_n.version="2.6.7";var kn=p("style,class"),Sn=p("input,textarea,option,select,progress"),En=p("contenteditable,draggable,spellcheck"),jn=p("events,caret,typing,plaintext-only"),Tn=function(t,e){return Ln(e)||"false"===e?"false":"contenteditable"===t&&jn(e)?e:"true"},In=p("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),Dn="http://www.w3.org/1999/xlink",Nn=function(t){return":"===t.charAt(5)&&"xlink"===t.slice(0,5)},Pn=function(t){return Nn(t)?t.slice(6,t.length):""},Ln=function(t){return null==t||!1===t};function Mn(t){for(var e=t.data,r=t,o=t;n(o.componentInstance);)(o=o.componentInstance._vnode)&&o.data&&(e=Rn(o.data,e));for(;n(r=r.parent);)r&&r.data&&(e=Rn(e,r.data));return function(t,e){if(n(t)||n(e))return Fn(t,Un(e));return""}(e.staticClass,e.class)}function Rn(t,e){return{staticClass:Fn(t.staticClass,e.staticClass),class:n(t.class)?[t.class,e.class]:e.class}}function Fn(t,e){return t?e?t+" "+e:t:e||""}function Un(t){return Array.isArray(t)?function(t){for(var e,r="",o=0,i=t.length;o<i;o++)n(e=Un(t[o]))&&""!==e&&(r&&(r+=" "),r+=e);return r}(t):i(t)?function(t){var e="";for(var n in t)t[n]&&(e&&(e+=" "),e+=n);return e}(t):"string"==typeof t?t:""}var Hn={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},Vn=p("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),zn=p("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Bn=function(t){return Vn(t)||zn(t)};var Wn=Object.create(null);var qn=p("text,number,password,search,email,tel,url");var Kn=Object.freeze({createElement:function(t,e){var n=document.createElement(t);return"select"!==t?n:(e.data&&e.data.attrs&&void 0!==e.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n)},createElementNS:function(t,e){return document.createElementNS(Hn[t],e)},createTextNode:function(t){return document.createTextNode(t)},createComment:function(t){return document.createComment(t)},insertBefore:function(t,e,n){t.insertBefore(e,n)},removeChild:function(t,e){t.removeChild(e)},appendChild:function(t,e){t.appendChild(e)},parentNode:function(t){return t.parentNode},nextSibling:function(t){return t.nextSibling},tagName:function(t){return t.tagName},setTextContent:function(t,e){t.textContent=e},setStyleScope:function(t,e){t.setAttribute(e,"")}}),Xn={create:function(t,e){Gn(e)},update:function(t,e){t.data.ref!==e.data.ref&&(Gn(t,!0),Gn(e))},destroy:function(t){Gn(t,!0)}};function Gn(t,e){var r=t.data.ref;if(n(r)){var o=t.context,i=t.componentInstance||t.elm,a=o.$refs;e?Array.isArray(a[r])?v(a[r],i):a[r]===i&&(a[r]=void 0):t.data.refInFor?Array.isArray(a[r])?a[r].indexOf(i)<0&&a[r].push(i):a[r]=[i]:a[r]=i}}var Zn=new lt("",{},[]),Jn=["create","activate","update","remove","destroy"];function Qn(t,o){return t.key===o.key&&(t.tag===o.tag&&t.isComment===o.isComment&&n(t.data)===n(o.data)&&function(t,e){if("input"!==t.tag)return!0;var r,o=n(r=t.data)&&n(r=r.attrs)&&r.type,i=n(r=e.data)&&n(r=r.attrs)&&r.type;return o===i||qn(o)&&qn(i)}(t,o)||r(t.isAsyncPlaceholder)&&t.asyncFactory===o.asyncFactory&&e(o.asyncFactory.error))}function Yn(t,e,r){var o,i,a={};for(o=e;o<=r;++o)n(i=t[o].key)&&(a[i]=o);return a}var tr={create:er,update:er,destroy:function(t){er(t,Zn)}};function er(t,e){(t.data.directives||e.data.directives)&&function(t,e){var n,r,o,i=t===Zn,a=e===Zn,s=rr(t.data.directives,t.context),c=rr(e.data.directives,e.context),u=[],l=[];for(n in c)r=s[n],o=c[n],r?(o.oldValue=r.value,o.oldArg=r.arg,ir(o,"update",e,t),o.def&&o.def.componentUpdated&&l.push(o)):(ir(o,"bind",e,t),o.def&&o.def.inserted&&u.push(o));if(u.length){var f=function(){for(var n=0;n<u.length;n++)ir(u[n],"inserted",e,t)};i?ne(e,"insert",f):f()}l.length&&ne(e,"postpatch",function(){for(var n=0;n<l.length;n++)ir(l[n],"componentUpdated",e,t)});if(!i)for(n in s)c[n]||ir(s[n],"unbind",t,t,a)}(t,e)}var nr=Object.create(null);function rr(t,e){var n,r,o=Object.create(null);if(!t)return o;for(n=0;n<t.length;n++)(r=t[n]).modifiers||(r.modifiers=nr),o[or(r)]=r,r.def=It(e.$options,"directives",r.name);return o}function or(t){return t.rawName||t.name+"."+Object.keys(t.modifiers||{}).join(".")}function ir(t,e,n,r,o){var i=t.def&&t.def[e];if(i)try{i(n.elm,t,n,r,o)}catch(r){Mt(r,n.context,"directive "+t.name+" "+e+" hook")}}var ar=[Xn,tr];function sr(t,r){var o=r.componentOptions;if(!(n(o)&&!1===o.Ctor.options.inheritAttrs||e(t.data.attrs)&&e(r.data.attrs))){var i,a,s=r.elm,c=t.data.attrs||{},u=r.data.attrs||{};for(i in n(u.__ob__)&&(u=r.data.attrs=x({},u)),u)a=u[i],c[i]!==a&&cr(s,i,a);for(i in(W||K)&&u.value!==c.value&&cr(s,"value",u.value),c)e(u[i])&&(Nn(i)?s.removeAttributeNS(Dn,Pn(i)):En(i)||s.removeAttribute(i))}}function cr(t,e,n){t.tagName.indexOf("-")>-1?ur(t,e,n):In(e)?Ln(n)?t.removeAttribute(e):(n="allowfullscreen"===e&&"EMBED"===t.tagName?"true":e,t.setAttribute(e,n)):En(e)?t.setAttribute(e,Tn(e,n)):Nn(e)?Ln(n)?t.removeAttributeNS(Dn,Pn(e)):t.setAttributeNS(Dn,e,n):ur(t,e,n)}function ur(t,e,n){if(Ln(n))t.removeAttribute(e);else{if(W&&!q&&"TEXTAREA"===t.tagName&&"placeholder"===e&&""!==n&&!t.__ieph){var r=function(e){e.stopImmediatePropagation(),t.removeEventListener("input",r)};t.addEventListener("input",r),t.__ieph=!0}t.setAttribute(e,n)}}var lr={create:sr,update:sr};function fr(t,r){var o=r.elm,i=r.data,a=t.data;if(!(e(i.staticClass)&&e(i.class)&&(e(a)||e(a.staticClass)&&e(a.class)))){var s=Mn(r),c=o._transitionClasses;n(c)&&(s=Fn(s,Un(c))),s!==o._prevClass&&(o.setAttribute("class",s),o._prevClass=s)}}var pr,dr={create:fr,update:fr},vr="__r",hr="__c";function mr(t,e,n){var r=pr;return function o(){null!==e.apply(null,arguments)&&_r(t,o,n,r)}}var yr=Vt&&!(G&&Number(G[1])<=53);function gr(t,e,n,r){if(yr){var o=rn,i=e;e=i._wrapper=function(t){if(t.target===t.currentTarget||t.timeStamp>=o||0===t.timeStamp||t.target.ownerDocument!==document)return i.apply(this,arguments)}}pr.addEventListener(t,e,J?{capture:n,passive:r}:n)}function _r(t,e,n,r){(r||pr).removeEventListener(t,e._wrapper||e,n)}function br(t,r){if(!e(t.data.on)||!e(r.data.on)){var o=r.data.on||{},i=t.data.on||{};pr=r.elm,function(t){if(n(t[vr])){var e=W?"change":"input";t[e]=[].concat(t[vr],t[e]||[]),delete t[vr]}n(t[hr])&&(t.change=[].concat(t[hr],t.change||[]),delete t[hr])}(o),ee(o,i,gr,_r,mr,r.context),pr=void 0}}var Cr,$r={create:br,update:br};function wr(t,r){if(!e(t.data.domProps)||!e(r.data.domProps)){var o,i,a=r.elm,s=t.data.domProps||{},c=r.data.domProps||{};for(o in n(c.__ob__)&&(c=r.data.domProps=x({},c)),s)e(c[o])&&(a[o]="");for(o in c){if(i=c[o],"textContent"===o||"innerHTML"===o){if(r.children&&(r.children.length=0),i===s[o])continue;1===a.childNodes.length&&a.removeChild(a.childNodes[0])}if("value"===o&&"PROGRESS"!==a.tagName){a._value=i;var u=e(i)?"":String(i);Ar(a,u)&&(a.value=u)}else if("innerHTML"===o&&zn(a.tagName)&&e(a.innerHTML)){(Cr=Cr||document.createElement("div")).innerHTML="<svg>"+i+"</svg>";for(var l=Cr.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;l.firstChild;)a.appendChild(l.firstChild)}else if(i!==s[o])try{a[o]=i}catch(t){}}}}function Ar(t,e){return!t.composing&&("OPTION"===t.tagName||function(t,e){var n=!0;try{n=document.activeElement!==t}catch(t){}return n&&t.value!==e}(t,e)||function(t,e){var r=t.value,o=t._vModifiers;if(n(o)){if(o.number)return f(r)!==f(e);if(o.trim)return r.trim()!==e.trim()}return r!==e}(t,e))}var xr={create:wr,update:wr},Or=y(function(t){var e={},n=/:(.+)/;return t.split(/;(?![^(]*\))/g).forEach(function(t){if(t){var r=t.split(n);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e});function kr(t){var e=Sr(t.style);return t.staticStyle?x(t.staticStyle,e):e}function Sr(t){return Array.isArray(t)?O(t):"string"==typeof t?Or(t):t}var Er,jr=/^--/,Tr=/\s*!important$/,Ir=function(t,e,n){if(jr.test(e))t.style.setProperty(e,n);else if(Tr.test(n))t.style.setProperty($(e),n.replace(Tr,""),"important");else{var r=Nr(e);if(Array.isArray(n))for(var o=0,i=n.length;o<i;o++)t.style[r]=n[o];else t.style[r]=n}},Dr=["Webkit","Moz","ms"],Nr=y(function(t){if(Er=Er||document.createElement("div").style,"filter"!==(t=_(t))&&t in Er)return t;for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=0;n<Dr.length;n++){var r=Dr[n]+e;if(r in Er)return r}});function Pr(t,r){var o=r.data,i=t.data;if(!(e(o.staticStyle)&&e(o.style)&&e(i.staticStyle)&&e(i.style))){var a,s,c=r.elm,u=i.staticStyle,l=i.normalizedStyle||i.style||{},f=u||l,p=Sr(r.data.style)||{};r.data.normalizedStyle=n(p.__ob__)?x({},p):p;var d=function(t,e){var n,r={};if(e)for(var o=t;o.componentInstance;)(o=o.componentInstance._vnode)&&o.data&&(n=kr(o.data))&&x(r,n);(n=kr(t.data))&&x(r,n);for(var i=t;i=i.parent;)i.data&&(n=kr(i.data))&&x(r,n);return r}(r,!0);for(s in f)e(d[s])&&Ir(c,s,"");for(s in d)(a=d[s])!==f[s]&&Ir(c,s,null==a?"":a)}}var Lr={create:Pr,update:Pr},Mr=/\s+/;function Rr(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(Mr).forEach(function(e){return t.classList.add(e)}):t.classList.add(e);else{var n=" "+(t.getAttribute("class")||"")+" ";n.indexOf(" "+e+" ")<0&&t.setAttribute("class",(n+e).trim())}}function Fr(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(Mr).forEach(function(e){return t.classList.remove(e)}):t.classList.remove(e),t.classList.length||t.removeAttribute("class");else{for(var n=" "+(t.getAttribute("class")||"")+" ",r=" "+e+" ";n.indexOf(r)>=0;)n=n.replace(r," ");(n=n.trim())?t.setAttribute("class",n):t.removeAttribute("class")}}function Ur(t){if(t){if("object"==typeof t){var e={};return!1!==t.css&&x(e,Hr(t.name||"v")),x(e,t),e}return"string"==typeof t?Hr(t):void 0}}var Hr=y(function(t){return{enterClass:t+"-enter",enterToClass:t+"-enter-to",enterActiveClass:t+"-enter-active",leaveClass:t+"-leave",leaveToClass:t+"-leave-to",leaveActiveClass:t+"-leave-active"}}),Vr=H&&!q,zr="transition",Br="animation",Wr="transition",qr="transitionend",Kr="animation",Xr="animationend";Vr&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Wr="WebkitTransition",qr="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Kr="WebkitAnimation",Xr="webkitAnimationEnd"));var Gr=H?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(t){return t()};function Zr(t){Gr(function(){Gr(t)})}function Jr(t,e){var n=t._transitionClasses||(t._transitionClasses=[]);n.indexOf(e)<0&&(n.push(e),Rr(t,e))}function Qr(t,e){t._transitionClasses&&v(t._transitionClasses,e),Fr(t,e)}function Yr(t,e,n){var r=eo(t,e),o=r.type,i=r.timeout,a=r.propCount;if(!o)return n();var s=o===zr?qr:Xr,c=0,u=function(){t.removeEventListener(s,l),n()},l=function(e){e.target===t&&++c>=a&&u()};setTimeout(function(){c<a&&u()},i+1),t.addEventListener(s,l)}var to=/\b(transform|all)(,|$)/;function eo(t,e){var n,r=window.getComputedStyle(t),o=(r[Wr+"Delay"]||"").split(", "),i=(r[Wr+"Duration"]||"").split(", "),a=no(o,i),s=(r[Kr+"Delay"]||"").split(", "),c=(r[Kr+"Duration"]||"").split(", "),u=no(s,c),l=0,f=0;return e===zr?a>0&&(n=zr,l=a,f=i.length):e===Br?u>0&&(n=Br,l=u,f=c.length):f=(n=(l=Math.max(a,u))>0?a>u?zr:Br:null)?n===zr?i.length:c.length:0,{type:n,timeout:l,propCount:f,hasTransform:n===zr&&to.test(r[Wr+"Property"])}}function no(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max.apply(null,e.map(function(e,n){return ro(e)+ro(t[n])}))}function ro(t){return 1e3*Number(t.slice(0,-1).replace(",","."))}function oo(t,r){var o=t.elm;n(o._leaveCb)&&(o._leaveCb.cancelled=!0,o._leaveCb());var a=Ur(t.data.transition);if(!e(a)&&!n(o._enterCb)&&1===o.nodeType){for(var s=a.css,c=a.type,u=a.enterClass,l=a.enterToClass,p=a.enterActiveClass,d=a.appearClass,v=a.appearToClass,h=a.appearActiveClass,m=a.beforeEnter,y=a.enter,g=a.afterEnter,_=a.enterCancelled,b=a.beforeAppear,C=a.appear,$=a.afterAppear,w=a.appearCancelled,A=a.duration,x=qe,O=qe.$vnode;O&&O.parent;)x=(O=O.parent).context;var k=!x._isMounted||!t.isRootInsert;if(!k||C||""===C){var S=k&&d?d:u,E=k&&h?h:p,j=k&&v?v:l,T=k&&b||m,D=k&&"function"==typeof C?C:y,N=k&&$||g,P=k&&w||_,L=f(i(A)?A.enter:A),M=!1!==s&&!q,R=so(D),F=o._enterCb=I(function(){M&&(Qr(o,j),Qr(o,E)),F.cancelled?(M&&Qr(o,S),P&&P(o)):N&&N(o),o._enterCb=null});t.data.show||ne(t,"insert",function(){var e=o.parentNode,n=e&&e._pending&&e._pending[t.key];n&&n.tag===t.tag&&n.elm._leaveCb&&n.elm._leaveCb(),D&&D(o,F)}),T&&T(o),M&&(Jr(o,S),Jr(o,E),Zr(function(){Qr(o,S),F.cancelled||(Jr(o,j),R||(ao(L)?setTimeout(F,L):Yr(o,c,F)))})),t.data.show&&(r&&r(),D&&D(o,F)),M||R||F()}}}function io(t,r){var o=t.elm;n(o._enterCb)&&(o._enterCb.cancelled=!0,o._enterCb());var a=Ur(t.data.transition);if(e(a)||1!==o.nodeType)return r();if(!n(o._leaveCb)){var s=a.css,c=a.type,u=a.leaveClass,l=a.leaveToClass,p=a.leaveActiveClass,d=a.beforeLeave,v=a.leave,h=a.afterLeave,m=a.leaveCancelled,y=a.delayLeave,g=a.duration,_=!1!==s&&!q,b=so(v),C=f(i(g)?g.leave:g),$=o._leaveCb=I(function(){o.parentNode&&o.parentNode._pending&&(o.parentNode._pending[t.key]=null),_&&(Qr(o,l),Qr(o,p)),$.cancelled?(_&&Qr(o,u),m&&m(o)):(r(),h&&h(o)),o._leaveCb=null});y?y(w):w()}function w(){$.cancelled||(!t.data.show&&o.parentNode&&((o.parentNode._pending||(o.parentNode._pending={}))[t.key]=t),d&&d(o),_&&(Jr(o,u),Jr(o,p),Zr(function(){Qr(o,u),$.cancelled||(Jr(o,l),b||(ao(C)?setTimeout($,C):Yr(o,c,$)))})),v&&v(o,$),_||b||$())}}function ao(t){return"number"==typeof t&&!isNaN(t)}function so(t){if(e(t))return!1;var r=t.fns;return n(r)?so(Array.isArray(r)?r[0]:r):(t._length||t.length)>1}function co(t,e){!0!==e.data.show&&oo(e)}var uo=function(t){var i,a,s={},c=t.modules,u=t.nodeOps;for(i=0;i<Jn.length;++i)for(s[Jn[i]]=[],a=0;a<c.length;++a)n(c[a][Jn[i]])&&s[Jn[i]].push(c[a][Jn[i]]);function l(t){var e=u.parentNode(t);n(e)&&u.removeChild(e,t)}function f(t,e,o,i,a,c,l){if(n(t.elm)&&n(c)&&(t=c[l]=vt(t)),t.isRootInsert=!a,!function(t,e,o,i){var a=t.data;if(n(a)){var c=n(t.componentInstance)&&a.keepAlive;if(n(a=a.hook)&&n(a=a.init)&&a(t,!1),n(t.componentInstance))return d(t,e),v(o,t.elm,i),r(c)&&function(t,e,r,o){for(var i,a=t;a.componentInstance;)if(a=a.componentInstance._vnode,n(i=a.data)&&n(i=i.transition)){for(i=0;i<s.activate.length;++i)s.activate[i](Zn,a);e.push(a);break}v(r,t.elm,o)}(t,e,o,i),!0}}(t,e,o,i)){var f=t.data,p=t.children,m=t.tag;n(m)?(t.elm=t.ns?u.createElementNS(t.ns,m):u.createElement(m,t),g(t),h(t,p,e),n(f)&&y(t,e),v(o,t.elm,i)):r(t.isComment)?(t.elm=u.createComment(t.text),v(o,t.elm,i)):(t.elm=u.createTextNode(t.text),v(o,t.elm,i))}}function d(t,e){n(t.data.pendingInsert)&&(e.push.apply(e,t.data.pendingInsert),t.data.pendingInsert=null),t.elm=t.componentInstance.$el,m(t)?(y(t,e),g(t)):(Gn(t),e.push(t))}function v(t,e,r){n(t)&&(n(r)?u.parentNode(r)===t&&u.insertBefore(t,e,r):u.appendChild(t,e))}function h(t,e,n){if(Array.isArray(e))for(var r=0;r<e.length;++r)f(e[r],n,t.elm,null,!0,e,r);else o(t.text)&&u.appendChild(t.elm,u.createTextNode(String(t.text)))}function m(t){for(;t.componentInstance;)t=t.componentInstance._vnode;return n(t.tag)}function y(t,e){for(var r=0;r<s.create.length;++r)s.create[r](Zn,t);n(i=t.data.hook)&&(n(i.create)&&i.create(Zn,t),n(i.insert)&&e.push(t))}function g(t){var e;if(n(e=t.fnScopeId))u.setStyleScope(t.elm,e);else for(var r=t;r;)n(e=r.context)&&n(e=e.$options._scopeId)&&u.setStyleScope(t.elm,e),r=r.parent;n(e=qe)&&e!==t.context&&e!==t.fnContext&&n(e=e.$options._scopeId)&&u.setStyleScope(t.elm,e)}function _(t,e,n,r,o,i){for(;r<=o;++r)f(n[r],i,t,e,!1,n,r)}function b(t){var e,r,o=t.data;if(n(o))for(n(e=o.hook)&&n(e=e.destroy)&&e(t),e=0;e<s.destroy.length;++e)s.destroy[e](t);if(n(e=t.children))for(r=0;r<t.children.length;++r)b(t.children[r])}function C(t,e,r,o){for(;r<=o;++r){var i=e[r];n(i)&&(n(i.tag)?($(i),b(i)):l(i.elm))}}function $(t,e){if(n(e)||n(t.data)){var r,o=s.remove.length+1;for(n(e)?e.listeners+=o:e=function(t,e){function n(){0==--n.listeners&&l(t)}return n.listeners=e,n}(t.elm,o),n(r=t.componentInstance)&&n(r=r._vnode)&&n(r.data)&&$(r,e),r=0;r<s.remove.length;++r)s.remove[r](t,e);n(r=t.data.hook)&&n(r=r.remove)?r(t,e):e()}else l(t.elm)}function w(t,e,r,o){for(var i=r;i<o;i++){var a=e[i];if(n(a)&&Qn(t,a))return i}}function A(t,o,i,a,c,l){if(t!==o){n(o.elm)&&n(a)&&(o=a[c]=vt(o));var p=o.elm=t.elm;if(r(t.isAsyncPlaceholder))n(o.asyncFactory.resolved)?k(t.elm,o,i):o.isAsyncPlaceholder=!0;else if(r(o.isStatic)&&r(t.isStatic)&&o.key===t.key&&(r(o.isCloned)||r(o.isOnce)))o.componentInstance=t.componentInstance;else{var d,v=o.data;n(v)&&n(d=v.hook)&&n(d=d.prepatch)&&d(t,o);var h=t.children,y=o.children;if(n(v)&&m(o)){for(d=0;d<s.update.length;++d)s.update[d](t,o);n(d=v.hook)&&n(d=d.update)&&d(t,o)}e(o.text)?n(h)&&n(y)?h!==y&&function(t,r,o,i,a){for(var s,c,l,p=0,d=0,v=r.length-1,h=r[0],m=r[v],y=o.length-1,g=o[0],b=o[y],$=!a;p<=v&&d<=y;)e(h)?h=r[++p]:e(m)?m=r[--v]:Qn(h,g)?(A(h,g,i,o,d),h=r[++p],g=o[++d]):Qn(m,b)?(A(m,b,i,o,y),m=r[--v],b=o[--y]):Qn(h,b)?(A(h,b,i,o,y),$&&u.insertBefore(t,h.elm,u.nextSibling(m.elm)),h=r[++p],b=o[--y]):Qn(m,g)?(A(m,g,i,o,d),$&&u.insertBefore(t,m.elm,h.elm),m=r[--v],g=o[++d]):(e(s)&&(s=Yn(r,p,v)),e(c=n(g.key)?s[g.key]:w(g,r,p,v))?f(g,i,t,h.elm,!1,o,d):Qn(l=r[c],g)?(A(l,g,i,o,d),r[c]=void 0,$&&u.insertBefore(t,l.elm,h.elm)):f(g,i,t,h.elm,!1,o,d),g=o[++d]);p>v?_(t,e(o[y+1])?null:o[y+1].elm,o,d,y,i):d>y&&C(0,r,p,v)}(p,h,y,i,l):n(y)?(n(t.text)&&u.setTextContent(p,""),_(p,null,y,0,y.length-1,i)):n(h)?C(0,h,0,h.length-1):n(t.text)&&u.setTextContent(p,""):t.text!==o.text&&u.setTextContent(p,o.text),n(v)&&n(d=v.hook)&&n(d=d.postpatch)&&d(t,o)}}}function x(t,e,o){if(r(o)&&n(t.parent))t.parent.data.pendingInsert=e;else for(var i=0;i<e.length;++i)e[i].data.hook.insert(e[i])}var O=p("attrs,class,staticClass,staticStyle,key");function k(t,e,o,i){var a,s=e.tag,c=e.data,u=e.children;if(i=i||c&&c.pre,e.elm=t,r(e.isComment)&&n(e.asyncFactory))return e.isAsyncPlaceholder=!0,!0;if(n(c)&&(n(a=c.hook)&&n(a=a.init)&&a(e,!0),n(a=e.componentInstance)))return d(e,o),!0;if(n(s)){if(n(u))if(t.hasChildNodes())if(n(a=c)&&n(a=a.domProps)&&n(a=a.innerHTML)){if(a!==t.innerHTML)return!1}else{for(var l=!0,f=t.firstChild,p=0;p<u.length;p++){if(!f||!k(f,u[p],o,i)){l=!1;break}f=f.nextSibling}if(!l||f)return!1}else h(e,u,o);if(n(c)){var v=!1;for(var m in c)if(!O(m)){v=!0,y(e,o);break}!v&&c.class&&Qt(c.class)}}else t.data!==e.text&&(t.data=e.text);return!0}return function(t,o,i,a){if(!e(o)){var c,l=!1,p=[];if(e(t))l=!0,f(o,p);else{var d=n(t.nodeType);if(!d&&Qn(t,o))A(t,o,p,null,null,a);else{if(d){if(1===t.nodeType&&t.hasAttribute(D)&&(t.removeAttribute(D),i=!0),r(i)&&k(t,o,p))return x(o,p,!0),t;c=t,t=new lt(u.tagName(c).toLowerCase(),{},[],void 0,c)}var v=t.elm,h=u.parentNode(v);if(f(o,p,v._leaveCb?null:h,u.nextSibling(v)),n(o.parent))for(var y=o.parent,g=m(o);y;){for(var _=0;_<s.destroy.length;++_)s.destroy[_](y);if(y.elm=o.elm,g){for(var $=0;$<s.create.length;++$)s.create[$](Zn,y);var w=y.data.hook.insert;if(w.merged)for(var O=1;O<w.fns.length;O++)w.fns[O]()}else Gn(y);y=y.parent}n(h)?C(0,[t],0,0):n(t.tag)&&b(t)}}return x(o,p,l),o.elm}n(t)&&b(t)}}({nodeOps:Kn,modules:[lr,dr,$r,xr,Lr,H?{create:co,activate:co,remove:function(t,e){!0!==t.data.show?io(t,e):e()}}:{}].concat(ar)});q&&document.addEventListener("selectionchange",function(){var t=document.activeElement;t&&t.vmodel&&go(t,"input")});var lo={inserted:function(t,e,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?ne(n,"postpatch",function(){lo.componentUpdated(t,e,n)}):fo(t,e,n.context),t._vOptions=[].map.call(t.options,ho)):("textarea"===n.tag||qn(t.type))&&(t._vModifiers=e.modifiers,e.modifiers.lazy||(t.addEventListener("compositionstart",mo),t.addEventListener("compositionend",yo),t.addEventListener("change",yo),q&&(t.vmodel=!0)))},componentUpdated:function(t,e,n){if("select"===n.tag){fo(t,e,n.context);var r=t._vOptions,o=t._vOptions=[].map.call(t.options,ho);if(o.some(function(t,e){return!j(t,r[e])}))(t.multiple?e.value.some(function(t){return vo(t,o)}):e.value!==e.oldValue&&vo(e.value,o))&&go(t,"change")}}};function fo(t,e,n){po(t,e,n),(W||K)&&setTimeout(function(){po(t,e,n)},0)}function po(t,e,n){var r=e.value,o=t.multiple;if(!o||Array.isArray(r)){for(var i,a,s=0,c=t.options.length;s<c;s++)if(a=t.options[s],o)i=T(r,ho(a))>-1,a.selected!==i&&(a.selected=i);else if(j(ho(a),r))return void(t.selectedIndex!==s&&(t.selectedIndex=s));o||(t.selectedIndex=-1)}}function vo(t,e){return e.every(function(e){return!j(e,t)})}function ho(t){return"_value"in t?t._value:t.value}function mo(t){t.target.composing=!0}function yo(t){t.target.composing&&(t.target.composing=!1,go(t.target,"input"))}function go(t,e){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}function _o(t){return!t.componentInstance||t.data&&t.data.transition?t:_o(t.componentInstance._vnode)}var bo={model:lo,show:{bind:function(t,e,n){var r=e.value,o=(n=_o(n)).data&&n.data.transition,i=t.__vOriginalDisplay="none"===t.style.display?"":t.style.display;r&&o?(n.data.show=!0,oo(n,function(){t.style.display=i})):t.style.display=r?i:"none"},update:function(t,e,n){var r=e.value;!r!=!e.oldValue&&((n=_o(n)).data&&n.data.transition?(n.data.show=!0,r?oo(n,function(){t.style.display=t.__vOriginalDisplay}):io(n,function(){t.style.display="none"})):t.style.display=r?t.__vOriginalDisplay:"none")},unbind:function(t,e,n,r,o){o||(t.style.display=t.__vOriginalDisplay)}}},Co={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]};function $o(t){var e=t&&t.componentOptions;return e&&e.Ctor.options.abstract?$o(He(e.children)):t}function wo(t){var e={},n=t.$options;for(var r in n.propsData)e[r]=t[r];var o=n._parentListeners;for(var i in o)e[_(i)]=o[i];return e}function Ao(t,e){if(/\d-keep-alive$/.test(e.tag))return t("keep-alive",{props:e.componentOptions.propsData})}var xo=function(t){return t.tag||Ue(t)},Oo=function(t){return"show"===t.name},ko={name:"transition",props:Co,abstract:!0,render:function(t){var e=this,n=this.$slots.default;if(n&&(n=n.filter(xo)).length){var r=this.mode,i=n[0];if(function(t){for(;t=t.parent;)if(t.data.transition)return!0}(this.$vnode))return i;var a=$o(i);if(!a)return i;if(this._leaving)return Ao(t,i);var s="__transition-"+this._uid+"-";a.key=null==a.key?a.isComment?s+"comment":s+a.tag:o(a.key)?0===String(a.key).indexOf(s)?a.key:s+a.key:a.key;var c=(a.data||(a.data={})).transition=wo(this),u=this._vnode,l=$o(u);if(a.data.directives&&a.data.directives.some(Oo)&&(a.data.show=!0),l&&l.data&&!function(t,e){return e.key===t.key&&e.tag===t.tag}(a,l)&&!Ue(l)&&(!l.componentInstance||!l.componentInstance._vnode.isComment)){var f=l.data.transition=x({},c);if("out-in"===r)return this._leaving=!0,ne(f,"afterLeave",function(){e._leaving=!1,e.$forceUpdate()}),Ao(t,i);if("in-out"===r){if(Ue(a))return u;var p,d=function(){p()};ne(c,"afterEnter",d),ne(c,"enterCancelled",d),ne(f,"delayLeave",function(t){p=t})}}return i}}},So=x({tag:String,moveClass:String},Co);function Eo(t){t.elm._moveCb&&t.elm._moveCb(),t.elm._enterCb&&t.elm._enterCb()}function jo(t){t.data.newPos=t.elm.getBoundingClientRect()}function To(t){var e=t.data.pos,n=t.data.newPos,r=e.left-n.left,o=e.top-n.top;if(r||o){t.data.moved=!0;var i=t.elm.style;i.transform=i.WebkitTransform="translate("+r+"px,"+o+"px)",i.transitionDuration="0s"}}delete So.mode;var Io={Transition:ko,TransitionGroup:{props:So,beforeMount:function(){var t=this,e=this._update;this._update=function(n,r){var o=Ke(t);t.__patch__(t._vnode,t.kept,!1,!0),t._vnode=t.kept,o(),e.call(t,n,r)}},render:function(t){for(var e=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,o=this.$slots.default||[],i=this.children=[],a=wo(this),s=0;s<o.length;s++){var c=o[s];c.tag&&null!=c.key&&0!==String(c.key).indexOf("__vlist")&&(i.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a)}if(r){for(var u=[],l=[],f=0;f<r.length;f++){var p=r[f];p.data.transition=a,p.data.pos=p.elm.getBoundingClientRect(),n[p.key]?u.push(p):l.push(p)}this.kept=t(e,null,u),this.removed=l}return t(e,null,i)},updated:function(){var t=this.prevChildren,e=this.moveClass||(this.name||"v")+"-move";t.length&&this.hasMove(t[0].elm,e)&&(t.forEach(Eo),t.forEach(jo),t.forEach(To),this._reflow=document.body.offsetHeight,t.forEach(function(t){if(t.data.moved){var n=t.elm,r=n.style;Jr(n,e),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(qr,n._moveCb=function t(r){r&&r.target!==n||r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(qr,t),n._moveCb=null,Qr(n,e))})}}))},methods:{hasMove:function(t,e){if(!Vr)return!1;if(this._hasMove)return this._hasMove;var n=t.cloneNode();t._transitionClasses&&t._transitionClasses.forEach(function(t){Fr(n,t)}),Rr(n,e),n.style.display="none",this.$el.appendChild(n);var r=eo(n);return this.$el.removeChild(n),this._hasMove=r.hasTransform}}}};_n.config.mustUseProp=function(t,e,n){return"value"===n&&Sn(t)&&"button"!==e||"selected"===n&&"option"===t||"checked"===n&&"input"===t||"muted"===n&&"video"===t},_n.config.isReservedTag=Bn,_n.config.isReservedAttr=kn,_n.config.getTagNamespace=function(t){return zn(t)?"svg":"math"===t?"math":void 0},_n.config.isUnknownElement=function(t){if(!H)return!0;if(Bn(t))return!1;if(t=t.toLowerCase(),null!=Wn[t])return Wn[t];var e=document.createElement(t);return t.indexOf("-")>-1?Wn[t]=e.constructor===window.HTMLUnknownElement||e.constructor===window.HTMLElement:Wn[t]=/HTMLUnknownElement/.test(e.toString())},x(_n.options.directives,bo),x(_n.options.components,Io),_n.prototype.__patch__=H?uo:k,_n.prototype.$mount=function(t,e){return function(t,e,n){var r;return t.$el=e,t.$options.render||(t.$options.render=pt),Ze(t,"beforeMount"),r=function(){t._update(t._render(),n)},new cn(t,r,k,{before:function(){t._isMounted&&!t._isDestroyed&&Ze(t,"beforeUpdate")}},!0),n=!1,null==t.$vnode&&(t._isMounted=!0,Ze(t,"mounted")),t}(this,t=t&&H?function(t){if("string"==typeof t){var e=document.querySelector(t);return e||document.createElement("div")}return t}(t):void 0,e)},H&&setTimeout(function(){L.devtools&&tt&&tt.emit("init",_n)},0),module.exports=_n;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":5}],10:[function(require,module,exports){
var inserted = exports.cache = {}

function noop () {}

exports.insert = function (css) {
  if (inserted[css]) return noop
  inserted[css] = true

  var elem = document.createElement('style')
  elem.setAttribute('type', 'text/css')

  if ('textContent' in elem) {
    elem.textContent = css
  } else {
    elem.styleSheet.cssText = css
  }

  document.getElementsByTagName('head')[0].appendChild(elem)
  return function () {
    document.getElementsByTagName('head')[0].removeChild(elem)
    inserted[css] = false
  }
}

},{}],11:[function(require,module,exports){
module.exports={
  "name": "@ubio/css",
  "version": "2.0.5",
  "description": "UBIO CSS framework foundation",
  "main": "index.css",
  "repository": "git@github.com:universalbasket/css",
  "author": "ubio",
  "license": "MIT",
  "private": false,
  "pre-commit": [
    "check",
    "stylelint",
    "build"
  ],
  "files": [
    "index.css"
  ],
  "scripts": {
    "check": "eslint --ext=js,vue .",
    "stylelint": "stylelint stylesheets/*",
    "dev": "run-p watch:* serve",
    "build": "run-p build:* && git add -A",
    "serve": "ws",
    "build:js": "browserify site/ -o docs/build/app.js",
    "build:html": "node build-html.js",
    "build:css": "postcss stylesheets/index.css -o index.css",
    "watch:js": "watchify -p browserify-hmr site/ -o docs/build/app.js",
    "preversion": "run-p check",
    "version": "run-p build",
    "postversion": "npm publish && git push origin master --tags"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babelify": "8",
    "browserify": "^16.2.3",
    "browserify-hmr": "^0.3.7",
    "eslint": "^5.14.1",
    "eslint-config-ub": "^3.0.0",
    "eslint-plugin-vue": "5.2.2",
    "local-web-server": "^2.6.1",
    "npm-run-all": "^4.1.5",
    "postcss": "^7.0.14",
    "postcss-cli": "^6.1.2",
    "pre-commit": "^1.2.2",
    "stylelint": "^9.10.1",
    "stylelint-config-standard": "^18.2.0",
    "vue": "^2.6.7",
    "vueify": "^9.4.1",
    "watchify": "^3.11.1"
  },
  "dependencies": {
    "parse-color": "^1.0.0",
    "postcss-import": "^12.0.1"
  }
}

},{}],12:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("@import \"https://fonts.googleapis.com/css?family=Libre+Franklin:100,200,300,400,500,600,700\";\n:root {\n    /* Typography */\n\n    --font-family: 'Libre Franklin', Helvetica, Arial, sans-serif;\n\n    /* Color Palette */\n\n    --color-mono--000: #fafafa;\n    --color-mono--100: #f3f3f3;\n    --color-mono--200: #ebebeb;\n    --color-mono--300: #e0e0e0;\n    --color-mono--400: #ccc;\n    --color-mono--500: #919191;\n    --color-mono--600: #757575;\n    --color-mono--700: #575757;\n    --color-mono--800: #383838;\n    --color-mono--900: #262626;\n    --color-warm--000: #fafaf7;\n    --color-warm--100: #f5f5f0;\n    --color-warm--200: #ebebe4;\n    --color-warm--300: #e0e0d7;\n    --color-warm--400: #cfcfbc;\n    --color-warm--500: #949485;\n    --color-warm--600: #787869;\n    --color-warm--700: #595947;\n    --color-warm--800: #3b3b2a;\n    --color-warm--900: #29291b;\n    --color-cool--000: #f7fafc;\n    --color-cool--100: #edf2f7;\n    --color-cool--200: #e4ecf5;\n    --color-cool--300: #d3e0ed;\n    --color-cool--400: #bfd0e3;\n    --color-cool--500: #8394a6;\n    --color-cool--600: #647a8f;\n    --color-cool--700: #445a70;\n    --color-cool--800: #2a3c4f;\n    --color-cool--900: #1c2936;\n    --color-blue--000: #f5fcff;\n    --color-blue--100: #ebf7fc;\n    --color-blue--200: #d7f1fc;\n    --color-blue--300: #c2ebfc;\n    --color-blue--400: #8ce0ff;\n    --color-blue--500: #31aade;\n    --color-blue--600: #268fbd;\n    --color-blue--700: #0873a1;\n    --color-blue--800: #004969;\n    --color-blue--900: #003247;\n    --color-green--000: #f0fcf5;\n    --color-green--100: #e8faf1;\n    --color-green--200: #daf5e5;\n    --color-green--300: #c2f0d6;\n    --color-green--400: #94ebbb;\n    --color-green--500: #54b364;\n    --color-green--600: #489448;\n    --color-green--700: #2e732e;\n    --color-green--800: #144f14;\n    --color-green--900: #0d360d;\n    --color-yellow--000: #fffff2;\n    --color-yellow--100: #ffffd9;\n    --color-yellow--200: #fffab3;\n    --color-yellow--300: #ffee80;\n    --color-yellow--400: #ffde59;\n    --color-yellow--500: #fb0;\n    --color-yellow--600: #d17d00;\n    --color-yellow--700: #b36b00;\n    --color-yellow--800: #8c4b00;\n    --color-yellow--900: #663000;\n    --color-red--000: #fff7f9;\n    --color-red--100: #fcf0f3;\n    --color-red--200: #ffe2e7;\n    --color-red--300: #ffd1d9;\n    --color-red--400: #fcb6c2;\n    --color-red--500: #eb5965;\n    --color-red--600: #c9404c;\n    --color-red--700: #b32733;\n    --color-red--800: #85151e;\n    --color-red--900: #4d1315;\n    --color-brand-red--000: #fff7f7;\n    --color-brand-red--100: #faf0f0;\n    --color-brand-red--200: #ffe2e2;\n    --color-brand-red--300: #ffd1d1;\n    --color-brand-red--400: #ffb5b5;\n    --color-brand-red--500: #ff5a5f;\n    --color-brand-red--600: #e64343;\n    --color-brand-red--700: #c72828;\n    --color-brand-red--800: #821616;\n    --color-brand-red--900: #520b0b;\n    --color-brand-blue--000: #f2feff;\n    --color-brand-blue--100: #e8f8fa;\n    --color-brand-blue--200: #d5f1f5;\n    --color-brand-blue--300: #bceef5;\n    --color-brand-blue--400: #8ae6f2;\n    --color-brand-blue--500: #28b5c7;\n    --color-brand-blue--600: #109cad;\n    --color-brand-blue--700: #007987;\n    --color-brand-blue--800: #004e57;\n    --color-brand-blue--900: #003238;\n}\n:root { /* stylelint-disable-line */\n    --font-family--mono: Menlo, Consolas, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace;\n\n    /* Gaps */\n\n    --gap--small: 5px;\n    --gap: 10px;\n    --gap--large: 20px;\n\n\n    /* Base components */\n\n    --font-size: 12px;\n    --font-size--small: .8em;\n    --font-size--large: 1.5em;\n    --control-height: 2.3335em;\n    --control-height--small: 18px;\n    --control-height--large: 2.66675em;\n\n    /* UI Colours: black on white */\n\n    --ui-background: white;\n    --ui-color: var(--ui-color--black);\n    --ui-color--default: var(--color-mono--200);\n    --ui-color--default--hover: var(--color-mono--300);\n    --ui-color--cta: var(--color-blue--500);\n    --ui-color--cta--hover: var(--color-blue--600);\n    --ui-color--accent: var(--color-brand-red--500);\n    --ui-color--accent--hover: var(--color-brand-red--600);\n    --ui-color--inverse: var(--ui-color--white);\n    --ui-color--primary: var(--color-blue--600);\n    --ui-color--secondary: var(--color-cool--600);\n    --ui-color--muted: var(--color-cool--400);\n    --ui-color--black: var(--color-mono--800);\n    --ui-color--white: white;\n    --ui-color--mono: var(--color-mono--600);\n    --ui-color--cool: var(--color-cool--600);\n    --ui-color--warm: var(--color-warm--600);\n    --ui-color--blue: var(--color-blue--600);\n    --ui-color--yellow: var(--color-yellow--600);\n    --ui-color--green: var(--color-green--600);\n    --ui-color--red: var(--color-red--600);\n    --ui-color--brand-red: var(--color-brand-red--600);\n    --ui-color--brand-blue: var(--color-brand-blue--600);\n    --ui-color--mono--pale: var(--color-mono--000);\n    --ui-color--cool--pale: var(--color-cool--000);\n    --ui-color--warm--pale: var(--color-warm--000);\n    --ui-color--blue--pale: var(--color-blue--000);\n    --ui-color--yellow--pale: var(--color-yellow--000);\n    --ui-color--green--pale: var(--color-green--000);\n    --ui-color--red--pale: var(--color-red--000);\n    --ui-color--brand-red--pale: var(--color-brand-red--000);\n    --ui-color--brand-blue--pale: var(--color-brand-blue--000);\n\n\n    /* Tabs */\n\n    --tab-slider-size: 2px;\n    --tab-slider-color: var(--color-warm--200);\n    --tab-slider-color--active: var(--color-blue--500);\n\n\n    /* Borders */\n\n    --border-color: var(--color-cool--400);\n    --border-color--merged: var(--color-cool--400);\n    --border-color--focus: var(--color-blue--600);\n    --border-shadow--focus: var(--color-blue--300);\n    --border-color--hover: var(--color-blue--500);\n    --border-radius: 4px;\n\n\n    /* Inputs */\n\n    --input-background: var(--ui-color--white);\n    --input-background--readonly: var(--color-warm--100);\n    --input-background--disabled: var(--color-cool--200);\n    --input-color: var(--ui-color--black);\n    --input-color--placeholder: var(--color-cool--400);\n\n    /* Frameless */\n    --button-background--frameless: var(--ui-color--cool--pale);\n}\n.theme--night-dark {\n    --ui-background: var(--color-cool--800);\n    --ui-color--default: rgba(0, 0, 0, .5);\n    --ui-color--default--hover: black;\n    --ui-color: white;\n    --ui-color--inverse: var(--ui-color--black);\n    --ui-color--primary: var(--color-blue--400);\n    --ui-color--secondary: var(--color-cool--400);\n    --ui-color--muted: var(--color-cool--500);\n    --ui-color--mono: var(--color-mono--400);\n    --ui-color--cool: var(--color-cool--400);\n    --ui-color--warm: var(--color-warm--400);\n    --ui-color--blue: var(--color-blue--400);\n    --ui-color--yellow: var(--color-yellow--400);\n    --ui-color--green: var(--color-green--400);\n    --ui-color--red: var(--color-red--400);\n    --ui-color--brand-red: var(--color-brand-red--400);\n    --ui-color--brand-blue: var(--color-brand-blue--400);\n    --ui-color--mono--pale: var(--color-mono--700);\n    --ui-color--cool--pale: var(--color-cool--700);\n    --ui-color--warm--pale: var(--color-warm--700);\n    --ui-color--blue--pale: var(--color-blue--700);\n    --ui-color--yellow--pale: var(--color-yellow--700);\n    --ui-color--green--pale: var(--color-green--700);\n    --ui-color--red--pale: var(--color-red--700);\n    --ui-color--brand-red--pale: var(--color-brand-red--700);\n    --ui-color--brand-blue--pale: var(--color-brand-blue--700);\n\n    /* Tabs */\n\n    /* --tab-slider-size: 2px; */\n    --tab-slider-color: var(--color-cool--900);\n    --tab-slider-color--active: var(--ui-color--blue);\n\n    /* Borders */\n\n    --border-color: var(--color-cool--600);\n    --border-color--merged: var(--color-cool--600);\n    --border-color--focus: var(--color-blue--600);\n    --border-shadow--focus: var(--color-blue--400);\n    --border-color--hover: var(--color-blue--300);\n\n    /* --border-radius: 4px; */\n\n\n    /* Inputs */\n\n    --input-background: var(--ui-background);\n    --input-background--readonly: var(--color-cool--700);\n    --input-background--disabled: var(--color-mono--700);\n    --input-color: var(--ui-color--white);\n    --input-color--placeholder: var(--ui-color--muted);\n\n    /* Frameless */\n    --button-background--frameless: var(--ui-color--cool--pale);\n\n    background: var(--ui-background);\n    color: var(--ui-color);\n}\n/* http://meyerweb.com/eric/tools/css/reset/\n   v2.0 | 20110126\n   License: none (public domain)\n*/\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\ntt,\nvar,\nfieldset,\nform,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    vertical-align: baseline;\n    box-sizing: border-box;\n}\narticle,\naside,\nfooter,\nheader,\nsection {\n    display: block;\n}\ninput,\ntextarea,\nbutton,\nselect {\n    font: inherit;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n    display: block;\n}\nblockquote,\nq {\n    quotes: none;\n}\nblockquote::before,\nblockquote::after,\nq::before,\nq::after {\n    content: '';\n    content: none;\n}\n/* Semantic tags styled */\n/* Base states */\n:disabled,\n[disabled] {\n    cursor: not-allowed;\n    pointer-events: none;\n}\nhtml {\n    scroll-behavior: smooth;\n    height: 100%;\n}\nbody {\n    font-family: var(--font-family);\n    font-size: var(--font-size);\n    font-weight: 400;\n    line-height: 1;\n    background: var(--ui-background);\n    color: var(--ui-color);\n    height: auto;\n    min-height: 100vh;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\nb,\nu,\ni,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nlabel,\nlegend {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    vertical-align: baseline;\n    box-sizing: border-box;\n}\nhr {\n    margin: var(--gap) 0;\n    border: 0;\n    height: 1px;\n    background: var(--color-mono--300);\n}\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}\nimg {\n    max-width: 100%;\n}\nlabel {\n    cursor: pointer;\n    font-weight: 400;\n}\nform label {\n    display: inline-block;\n    margin: 0 0 .25em;\n    font-size: 1.1em;\n    line-height: 1.5em;\n    font-weight: 500;\n}\nlabel[disabled] {\n    opacity: .5;\n}\nselect {\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    appearance: none;\n    background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 960 560\" fill=\"grey\"><path d=\"M480 344.2L268.9 131.9c-15.8-15.9-41.3-15.9-57.1 0 -15.8 15.9-15.8 41.6 0 57.4l237.6 238.9c8.4 8.5 19.6 12.3 30.6 11.7 11 0.6 22.2-3.2 30.6-11.7l237.6-238.9c15.8-15.9 15.8-41.6 0-57.4s-41.3-15.9-57.1 0L480 344.2z\"/></svg>');\n    background-position: 100%;\n    background-size: 1.5em;\n    background-repeat: no-repeat;\n    background-color: transparent;\n    color: inherit;\n    height: 2em;\n    padding: 0 2em 0 var(--gap--small);\n    border-radius: 4px;\n    border: 0;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    font-family: var(--font-family);\n    font-size: 1em;\n    line-height: initial;\n}\nselect:hover {\n    cursor: pointer;\n}\nselect[disabled] {\n    background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"grey\" viewBox=\"0 0 960 560\"><path d=\"M480 344.2L268.9 131.9c-15.8-15.9-41.3-15.9-57.1 0 -15.8 15.9-15.8 41.6 0 57.4l237.6 238.9c8.4 8.5 19.6 12.3 30.6 11.7 11 0.6 22.2-3.2 30.6-11.7l237.6-238.9c15.8-15.9 15.8-41.6 0-57.4s-41.3-15.9-57.1 0L480 344.2z\"/></svg>');\n}\nselect[multiple] {\n    height: auto;\n}\noption {\n    color: #000;\n}\ninput,\ntextarea {\n    display: inline-block;\n    box-sizing: border-box;\n    padding: calc((var(--control-height) - var(--font-size) * 1.35) / 2) .5em;\n    border-radius: var(--border-radius);\n    border: 1px solid var(--border-color);\n    background-color: var(--input-background);\n    color: var(--input-color);\n    text-overflow: ellipsis;\n    font-family: var(--font-family);\n    font-size: var(--font-size);\n    line-height: 1.35;\n    letter-spacing: 0;\n}\ntextarea {\n    line-height: 1.35;\n    min-height: var(--control-height);\n    width: 100%;\n}\ninput::placeholder,\ntextarea::placeholder {\n    color: var(--input-color--placeholder);\n}\ninput:hover,\ntextarea:hover,\nselect:hover {\n    border-color: var(--border-color--hover);\n}\na {\n    cursor: pointer;\n    color: var(--color-blue--500);\n    text-decoration: underline;\n}\na:hover {\n    text-decoration: none;\n}\nbutton {\n    display: inline-flex;\n    box-sizing: border-box;\n    height: var(--control-height);\n    padding: calc((var(--control-height) - 1em) / 2 - 2px) 1.25em;\n    border-radius: 4px;\n    border: 0;\n    background-color: var(--ui-color--default);\n    fill: var(--ui-color);\n    color: var(--ui-color);\n    font-size: 1em;\n    font-family: var(--font-family);\n    line-height: 1.25;\n    font-weight: 500;\n    letter-spacing: .01em;\n    cursor: pointer;\n}\nbutton[disabled] {\n    cursor: not-allowed;\n    color: var(--color-mono--500);\n    fill: var(--color-mono--500);\n    opacity: .7;\n}\nbutton:hover {\n    background: var(--ui-color--default--hover);\n    color: var(--ui-color);\n}\ninput[type=\"text\"],\ninput[type=\"password\"],\ninput[type=\"email\"],\ninput[type=\"number\"] {\n    width: 100%;\n    text-overflow: ellipsis;\n    overflow: hidden;\n    box-shadow: none;\n}\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n    height: auto;\n    margin: 0 var(--gap--small) 0 0;\n}\ninput[readonly],\ntextarea[readonly] {\n    background: var(--input-background--readonly);\n    box-shadow: none;\n}\ninput[disabled],\ntextarea[disabled] {\n    background: var(--input-background--disabled);\n    color: var(--ui-color--secondary);\n}\nbutton:focus,\ninput:focus,\ntextarea:focus,\nselect:focus,\na:focus,\na:active {\n    border-color: var(--border-color--focus);\n    box-shadow: 0 0 0 2px var(--border-shadow--focus);\n    outline: none;\n}\np {\n    line-height: 1.5;\n    margin: .5em 0;\n}\nul {\n    list-style-type: disc;\n}\nol {\n    list-style-type: decimal;\n}\nli {\n    line-height: 1.5;\n    margin: 0 0 .65em 1.4em;\n    list-style-position: outside;\n}\nb {\n    font-weight: 600;\n}\nstrong {\n    font-weight: 700;\n}\ntime,\ncode,\npre {\n    font-family: var(--font-family--mono);\n    word-wrap: break-word;\n    word-break: break-word;\n}\ncode {\n    font-size: inherit;\n    font-weight: inherit;\n}\npre {\n    line-height: 1.6;\n    white-space: pre-wrap;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n    line-height: 1;\n    margin: 0 0 2rem;\n}\nh1 {\n    margin: 0 0 2rem;\n    font-size: 32px;\n    font-weight: 300;\n}\nh2 {\n    font-size: 25px;\n    line-height: 1;\n    font-weight: 300;\n}\nh3 {\n    font-size: 22px;\n    line-height: 1;\n    font-weight: 300;\n}\nh4 {\n    font-size: 18px;\n    font-weight: 500;\n}\nh5 {\n    font-size: 16px;\n    font-weight: 500;\n    margin: 0 0 1rem;\n}\nh6 {\n    font-size: 13px;\n    font-weight: 600;\n    margin: 0 0 1rem;\n}\nsub {\n    font-size: 70%;\n}\nmark {\n    background-color: var(--color-yellow--400);\n    border-radius: 2px;\n    box-shadow: 1px 0 0 var(--color-yellow--400), -1px 0 0 var(--color-yellow--400);\n}\nmenu li {\n    margin: 0;\n    padding: 0;\n}\n/* Core UI components */\n.spinner {\n    animation: spin 1.3s infinite linear;\n    width: 2em;\n    height: 2em;\n}\n.spinner.button__icon {\n    height: 1em;\n}\n@keyframes spin {\n    0% {\n        transform: rotate(0deg);\n    }\n\n    to {\n        transform: rotate(1turn);\n    }\n}\n.button {\n    display: inline-flex;\n    box-sizing: border-box;\n    align-items: center;\n    padding: 0 1.25em;\n    height: var(--control-height);\n    line-height: var(--control-height);\n    border-radius: 4px;\n    border: 0;\n    background-color: var(--ui-color--default);\n    fill: var(--ui-color);\n    color: var(--ui-color);\n    font-size: var(--font-size);\n    font-family: var(--font-family);\n    font-weight: 500;\n    white-space: nowrap;\n    letter-spacing: .01em;\n    text-decoration: none;\n    cursor: pointer;\n}\n.button:visited {\n    color: var(--ui-color);\n}\n.button:hover {\n    text-decoration: none;\n    background-color: var(--ui-color--default--hover);\n    color: var(--ui-color);\n}\n.button:focus,\n.button:active {\n    border-color: var(--border-color--focus);\n    box-shadow: 0 0 0 2px var(--border-shadow--focus);\n    outline: none;\n}\n.button--primary,\n.button--primary:visited {\n    background: var(--ui-color--cta);\n    color: white;\n}\n.button--primary:hover {\n    background: var(--ui-color--cta--hover);\n    color: white;\n}\n.button--secondary,\n.button--secondary:visited {\n    color: var(--ui-color--cta);\n    background: transparent;\n    box-shadow: 0 0 0 2px currentColor inset;\n}\n.button--secondary.button--small {\n    box-shadow: 0 0 0 1.5px currentColor inset;\n}\n.button--secondary:hover {\n    background: transparent;\n    color: var(--ui-color--cta--hover);\n}\n.button--accent,\n.button--accent:visited {\n    background: var(--ui-color--accent);\n    color: white;\n}\n.button--accent:hover {\n    background: var(--ui-color--accent--hover);\n    color: white;\n}\n.button[disabled] {\n    color: var(--color-mono--500);\n    fill: var(--color-mono--500);\n    opacity: .7;\n    background-color: var(--ui-color--default);\n    border-color: transparent;\n}\n.button.frameless {\n    color: var(--ui-color);\n    background: transparent;\n}\n.button.frameless:hover {\n    background: var(--button-background--frameless);\n}\n.button--primary.frameless { color: var(--ui-color--primary); }\n.button--secondary.frameless { color: var(--ui-color--secondary); }\n.button--accent.frameless { color: var(--ui-color--accent); }\n.button--inverse.frameless { color: var(--ui-background); }\n.button--muted.frameless { color: var(--ui-color--muted); }\n.button--small {\n    font-size: var(--font-size--small);\n    height: var(--control-height--small);\n    line-height: var(--control-height--small);\n    padding: 0 .85em;\n    border-radius: 2px;\n}\n.button--large {\n    font-size: var(--font-size--large);\n    height: var(--control-height--large);\n    line-height: var(--control-height--large);\n    padding: 0 1.25em;\n    border-radius: calc(var(--border-radius) * 1.5);\n}\n.button--icon {\n    padding: 0;\n    width: calc(var(--control-height) * 1.2);\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n}\n.button--icon.button--large {\n    width: calc(var(--control-height--large) * 1.1);\n}\n.button--icon.button--small {\n    width: calc(var(--control-height--small) * 1.3);\n}\n.button__icon {\n    position: relative;\n    width: auto;\n    color: currentColor;\n    fill: currentColor;\n    margin-right: .3em;\n    left: -.1em;\n    flex-shrink: 0;\n    line-height: inherit;\n    vertical-align: baseline;\n}\n.button--icon svg,\n.button--icon .button__icon {\n    height: 1em;\n    fill: currentColor;\n    color: currentColor;\n    left: 0;\n    margin: 0;\n}\n.button select {\n    line-height: initial;\n    margin: 0 calc(-1 * 1.25em);\n    padding: 0 2em 0 var(--gap--small);\n}\n.button--small select {\n    margin: 0 calc(-1 * .85em);\n}\nselect.button {\n    padding: 0 2em 0 var(--gap--small);\n    letter-spacing: 0;\n}\ninput.button {\n    padding: 0 var(--gap--small);\n    text-align: center;\n}\n.icon {\n    display: inline-flex;\n    width: var(--control-height);\n    align-items: center;\n    justify-content: start;\n}\n.icon--small {\n    width: var(--control-height--small);\n    font-size: var(--font-size--small);\n}\n.icon--large {\n    width: var(--control-height--large);\n    font-size: var(--font-size--large);\n}\n.input {\n    display: inline-flex;\n    box-sizing: border-box;\n    height: var(--control-height);\n    align-items: center;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    border-radius: var(--border-radius);\n    border: 1px solid var(--border-color);\n    background-color: var(--input-background);\n    color: var(--input-color);\n}\n.input--small {\n    font-size: .95em;\n    height: var(--control-height--small);\n}\n.input--large {\n    font-size: var(--font-size--large);\n}\n.input:hover {\n    border-color: var(--border-color--hover);\n}\n.input.frameless {\n    color: var(--ui-color);\n}\n.input.frameless::placeholder {\n    color: var(--ui-color--muted);\n}\n.input.frameless:hover {\n    border-color: transparent;\n    background: transparent;\n}\n.input:focus,\n.input:focus-within {\n    border-color: var(--border-color--focus);\n    box-shadow: 0 0 0 2px var(--border-shadow--focus);\n    outline: none;\n}\n.input input,\n.input textarea {\n    border: 0;\n    box-shadow: none;\n    flex: 1;\n    background: transparent;\n}\n.input.frameless input,\n.input.frameless textarea {\n    color: var(--ui-color);\n}\n.input input::placeholder,\n.input textarea::placeholder {\n    color: var(--ui-color--muted);\n}\n.input select {\n    line-height: initial;\n}\n.input--area {\n    height: auto;\n}\n.input--area--fixed {\n    resize: vertical;\n}\n.input * {\n    max-height: 100%;\n}\n.input .icon {\n    justify-content: center;\n    align-items: center;\n}\n.input--block {\n    display: block;\n    width: 100%;\n}\n.input[disabled] {\n    opacity: .5;\n    cursor: not-allowed;\n    pointer-events: none;\n}\n.toggle {\n    --toggle__width: 4em;\n    --toggle__height: 1em;\n\n    font-size: 1em;\n    display: inline-grid;\n    grid-gap: var(--gap--small);\n    align-items: center;\n    grid-auto-flow: column;\n    justify-self: start;\n}\n.toggle__toggler {\n    position: relative;\n    display: inline-block;\n    width: var(--toggle__width);\n    height: calc(2 * 3px + var(--toggle__height));\n    vertical-align: middle;\n}\n.toggle__label {\n    font-weight: 500;\n}\n.toggle__slider {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    display: inline-block;\n    margin: 0 !important;\n    padding: 0;\n    border-radius: var(--toggle__height);\n    cursor: pointer;\n    background-color: var(--ui-color--default);\n    transition: .4s;\n}\n.toggle__slider::before {\n    content: '';\n    position: absolute;\n    left: 3px;\n    bottom: 3px;\n    display: block;\n    height: var(--toggle__height);\n    width: var(--toggle__height);\n    border-radius: 50%;\n    background-color: var(--ui-background);\n    transition: .4s;\n}\n.toggle__input {\n    display: none;\n    visibility: hidden;\n}\n.toggle__slider--off {\n    background-color: var(--ui-color--default);\n}\n.toggle__slider--on {\n    background-color: var(--ui-color--primary);\n}\n.toggle__slider--on::before {\n    transform: translateX(calc(var(--toggle__width) - var(--toggle__height) - 6px));\n}\n.toggle__slider::after {\n    position: absolute;\n    top: 3px;\n    bottom: 3px;\n    line-height: var(--toggle__height);\n    color: var(--ui-background);\n    height: var(--toggle__height);\n    width: calc(var(--toggle__width) - 2 * var(--toggle__height));\n}\n.toggle__slider--on::after {\n    content: 'On';\n    left: 6px;\n}\n.toggle__slider--off::after {\n    content: 'Off';\n    color: var(--ui-color);\n    left: calc(var(--toggle__height) + 7px);\n    text-align: left;\n}\n.badge {\n    display: inline-grid;\n    grid-gap: 4px;\n    grid-auto-flow: column;\n    align-items: center;\n    justify-content: start;\n    border-radius: 2px;\n    border: 0;\n    white-space: nowrap;\n    text-align: center;\n    letter-spacing: .6px;\n    font-weight: 500;\n    font-size: var(--font-size--small);\n    color: var(--ui-background);\n    background-color: var(--ui-color--mono);\n    line-height: calc(1.1 * var(--control-height--small));\n    height: var(--control-height--small);\n    min-width: var(--control-height--small);\n    padding: 0 .5em;\n    text-decoration: none;\n    text-transform: uppercase;\n}\n.badge--production { background-color: var(--color-brand-red--500); }\n.badge--staging { background-color: var(--color-yellow--500); }\n.badge--development { background: var(--color-red--700); }\n.badge--mono { background-color: var(--ui-color--mono); }\n.badge--cool { background-color: var(--ui-color--cool); }\n.badge--warm { background-color: var(--ui-color--warm); }\n.badge--blue { background-color: var(--ui-color--blue); }\n.badge--brand-blue { background-color: var(--ui-color--brand-blue); }\n.badge--yellow { background-color: var(--ui-color--yellow); }\n.badge--red { background-color: var(--ui-color--red); }\n.badge--brand-red { background-color: var(--ui-color--brand-red); }\n.badge--green { background-color: var(--ui-color--green); }\n.badge[class*=\"--light\"],\n.badge[class*=\"--light\"]:hover {\n    color: var(--ui-color--black);\n}\n.badge--mono--light { background-color: var(--color-mono--400); }\n.badge--cool--light { background-color: var(--color-cool--400); }\n.badge--warm--light { background-color: var(--color-warm--400); }\n.badge--blue--light { background-color: var(--color-blue--400); }\n.badge--yellow--light { background-color: var(--color-yellow--400); }\n.badge--red--light { background-color: var(--color-red--400); }\n.badge--green--light { background-color: var(--color-green--400); }\n.badge--brand-red--light { background-color: var(--color-brand-red--400); }\n.badge--brand-blue--light { background-color: var(--color-brand-blue--400); }\n.badge[class*=\"--outline\"] {\n    box-shadow: 0 0 0 1px currentColor inset;\n    background: transparent;\n}\n.badge--outline { color: var(--ui-color--mono); }\n.badge--mono--outline { color: var(--ui-color--mono); }\n.badge--cool--outline { color: var(--ui-color--cool); }\n.badge--warm--outline { color: var(--ui-color--warm); }\n.badge--blue--outline { color: var(--ui-color--blue); }\n.badge--yellow--outline { color: var(--ui-color--yellow); }\n.badge--red--outline { color: var(--ui-color--red); }\n.badge--green--outline { color: var(--ui-color--green); }\n.badge--brand-red--outline { color: var(--ui-color--brand-red); }\n.badge--brand-blue--outline { color: var(--ui-color--brand-blue); }\n.badge--small {\n    font-size: 8px;\n    line-height: 14px;\n    height: 14px;\n    min-width: 14px;\n}\n.badge--inline {\n    height: auto;\n    line-height: 1.1;\n    padding: 2px 4px;\n    text-transform: initial;\n    font-size: .85em;\n    font-weight: 400;\n}\n.badge--large {\n    line-height: var(--control-height);\n    height: var(--control-height);\n    min-width: var(--control-height);\n    font-size: var(--font-size);\n}\n.badge--fixed {\n    min-width: 14ch;\n    max-width: 100%;\n}\n.badge--round {\n    border-radius: var(--control-height--small);\n    justify-content: center;\n}\n.badge--round.badge--small { border-radius: 14px; }\n.badge--round.badge--large { border-radius: var(--control-height); }\n.loader {\n    height: var(--gap);\n    text-align: center;\n    display: inline-flex;\n    color: var(--color-cool--400);\n}\n.loader--small { height: var(--gap--small); }\n.loader--large { height: var(--gap--large); }\n.loader__rect {\n    background: currentColor;\n    height: 100%;\n    width: 4px;\n    border-radius: 1.5px;\n    margin: 0 2px;\n    animation: loading 1s ease-in-out infinite;\n}\n.loader__rect2 {\n    animation-delay: -1.1s;\n}\n.loader__rect3 {\n    animation-delay: -1s;\n}\n.loader__rect4 {\n    animation-delay: -.9s;\n}\n.loader__rect5 {\n    animation-delay: -.8s;\n}\n@keyframes loading {\n    0% {\n        transform: scale(1);\n    }\n\n    20% {\n        transform: scale(1, 2.2);\n    }\n\n    40% {\n        transform: scale(1);\n    }\n}\n.progress-bar {\n    color: var(--color-cool--400);\n    display: flex;\n    position: relative;\n    min-width: 5vw;\n    font-size: 10px;\n    background: var(--color-cool--100);\n    box-shadow: 0 0 0 1px currentColor inset;\n    vertical-align: middle;\n    line-height: 15px;\n    overflow: hidden;\n    border-radius: 1px;\n}\n.progress-bar--large {\n    line-height: 26px;\n    font-size: 15px;\n    border-radius: 3px;\n}\n.progress-bar__width {\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    width: 0;\n    background-color: var(--color-cool--400);\n    border-radius: inherit;\n    transition: width 1s;\n}\n.progress-bar__counter {\n    align-self: center;\n    margin-left: auto;\n    font-weight: 600;\n    padding: 0 var(--gap--small);\n    color: var(--color-mono--800);\n    z-index: 1;\n}\n.tag {\n    display: inline-flex;\n    align-items: stretch;\n    justify-content: center;\n    line-height: 1.75em;\n    width: auto;\n    color: var(--ui-color--black);\n    border-radius: 1px;\n    font-weight: 500;\n}\n.tag__remover {\n    color: var(--ui-color--white);\n    margin-left: 2px;\n    padding: 0 var(--gap--small);\n    background-color: var(--color-mono--200);\n}\n.tag__label {\n    background-color: var(--color-mono--200);\n    padding: 0 var(--gap--small);\n    color: inherit;\n    width: 100%;\n}\n.tag--mono > * { background-color: var(--color-mono--400); }\n.tag--cool > * { background-color: var(--color-cool--400); }\n.tag--warm > * { background-color: var(--color-warm--400); }\n.tag--blue > * { background-color: var(--color-blue--400); }\n.tag--yellow > * { background-color: var(--color-yellow--400); }\n.tag--red > * { background-color: var(--color-red--400); }\n.tag--green > * { background-color: var(--color-green--400); }\n.tag--brand-red > * { background-color: var(--color-brand-red--400); }\n.tag--brand-blue > * { background-color: var(--color-brand-blue--400); }\n.group {\n    display: inline-flex;\n    align-items: center;\n    max-width: 100%;\n}\n.group > * {\n    margin: 0;\n    flex-shrink: 0;\n}\n.group--gap > * + * { margin-left: var(--gap); }\n.group--gap--small > * + * { margin-left: var(--gap--small); }\n.group--gap--large > * + * { margin-left: var(--gap--large); }\n.group--block {\n    display: flex;\n}\n.group--merged {\n    flex-wrap: nowrap;\n    align-items: stretch;\n    white-space: nowrap;\n    border-radius: var(--border-radius);\n}\n.group--merged > * + * {\n    margin-left: -1px;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.group--merged > button + button,\n.group--merged > button + .button,\n.group--merged > .button + button,\n.group--merged > .button + .button {\n    margin-left: 0;\n}\n.group--merged--border > * + * {\n    border-left: 1px solid var(--border-color--merged);\n}\n.group--semi-merged {\n    display: inline-grid;\n    grid-auto-flow: column;\n    grid-gap: 2px;\n    align-content: center;\n}\n.group--semi-merged > * {\n    border-radius: 0;\n}\n.group--semi-merged > *:first-child {\n    border-top-left-radius: var(--border-radius);\n    border-bottom-left-radius: var(--border-radius);\n}\n.group--semi-merged > *:last-child {\n    border-top-right-radius: var(--border-radius);\n    border-bottom-right-radius: var(--border-radius);\n}\n.group--merged > *:not(:last-child) {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.box {\n    padding: var(--gap) 30px var(--gap) var(--gap--large);\n    border: 2px solid transparent;\n    line-height: 1.6;\n    border-radius: var(--border-radius);\n    font-weight: 400;\n    font-size: var(--font-size);\n    box-sizing: border-box;\n}\n.box--center {\n    text-align: center;\n    justify-content: center;\n    align-items: center;\n}\n.box--mono {\n    background: var(--color-mono--100);\n    color: var(--color-mono--600);\n}\n.box--cool {\n    background: var(--color-cool--100);\n    color: var(--color-cool--600);\n}\n.box--warm {\n    background: var(--color-warm--100);\n    color: var(--color-warm--600);\n}\n.box--blue {\n    background: var(--color-blue--100);\n    color: var(--color-blue--600);\n}\n.box--yellow {\n    background: var(--color-yellow--100);\n    color: var(--color-yellow--600);\n}\n.box--red {\n    background: var(--color-red--100);\n    color: var(--color-red--600);\n}\n.box--green {\n    background: var(--color-green--100);\n    color: var(--color-green--600);\n}\n.box--brand-red {\n    background: var(--color-brand-red--100);\n    color: var(--color-brand-red--600);\n}\n.box--brand-blue {\n    background: var(--color-brand-blue--100);\n    color: var(--color-brand-blue--600);\n}\n.box--mono--outline {\n    background: var(--color-mono--000);\n    color: var(--color-mono--500);\n}\n.box--cool--outline {\n    background: var(--color-cool--000);\n    color: var(--color-cool--500);\n    border-color: currentColor;\n}\n.box--warm--outline {\n    background: var(--color-warm--000);\n    color: var(--color-warm--500);\n    border-color: currentColor;\n}\n.box--blue--outline {\n    background: var(--color-blue--000);\n    color: var(--color-blue--600);\n    border-color: currentColor;\n}\n.box--yellow--outline {\n    background: var(--color-yellow--000);\n    color: var(--color-yellow--600);\n    border-color: currentColor;\n}\n.box--red--outline {\n    background: var(--color-red--000);\n    color: var(--color-red--600);\n    border-color: currentColor;\n}\n.box--green--outline {\n    background: var(--color-green--000);\n    color: var(--color-green--600);\n    border-color: currentColor;\n}\n.box--brand-red--outline {\n    background: var(--color-brand-red--00);\n    color: var(--color-brand-red--500);\n    border-color: currentColor;\n}\n.box--brand-blue--outline {\n    background: var(--color-brand-blue--00);\n    color: var(--color-brand-blue--500);\n    border-color: currentColor;\n}\n.box--outline {\n    border-color: currentColor;\n}\n.box--small {\n    padding: var(--gap--small) var(--gap--large);\n    font-size: var(--font-size--small);\n}\n.box--large {\n    padding: var(--gap--large) calc(2 * var(--gap--large));\n    font-size: var(--font-size--large);\n}\n.box--panel {\n    padding: var(--gap);\n    line-height: 1.6;\n    font-size: var(--font-size);\n    color: var(--ui-color);\n}\n.box--panel--mono { background: var(--color-mono--200); }\n.box--panel--cool { background: var(--color-cool--200); }\n.box--panel--warm { background: var(--color-warm--200); }\n.box--panel--blue { background: var(--color-blue--200); }\n.box--panel--yellow { background: var(--color-yellow--200); }\n.box--panel--green { background: var(--color-green--200); }\n.box--panel--red { background: var(--color-red--200); }\n.box--panel--border {\n    border-radius: var(--border-radius);\n}\n.box--panel--small { padding: var(--gap--small); }\n.box--panel--large { padding: var(--gap--large); }\n.tabs {\n    display: flex;\n    align-items: baseline;\n    list-style: none;\n    border-bottom: var(--tab-slider-size) solid var(--tab-slider-color);\n    margin: 0;\n}\n.tabs__item {\n    position: relative;\n    top: var(--tab-slider-size);\n    padding: var(--gap) var(--gap--large) var(--gap) var(--gap);\n    border-bottom: var(--tab-slider-size) solid var(--tab-slider-color);\n    color: inherit;\n    font-size: 13px;\n    font-weight: 300;\n    text-decoration: none;\n    cursor: pointer;\n}\n.tabs__item:hover {\n    color: currentColor;\n}\n.tabs__item:active,\n.tabs__item:focus {\n    box-shadow: none;\n}\n.tabs__item::after {\n    content: '';\n    position: absolute;\n    display: block;\n    bottom: calc(-1 * var(--tab-slider-size));\n    left: 0;\n    height: var(--tab-slider-size);\n    width: 0%;\n    background: transparent;\n    border-radius: var(--tab-slider-size);\n    transition: width .4s;\n}\n.tabs__item--active,\n.tabs__item.active {\n    font-weight: 500;\n}\n.tabs__item--active::after,\n.tabs__item.active::after {\n    background: var(--tab-slider-color--active);\n    width: 100%;\n}\n.tabs__icon {\n    width: 1.5em;\n}\n.tabs__slot {\n    margin-left: auto;\n    display: inline-grid;\n    grid-auto-flow: column;\n    grid-gap: var(--gap);\n    align-items: center;\n}\n.block {\n    padding: var(--gap);\n    line-height: 1.6;\n    font-size: var(--font-size);\n}\n.block--mono--pale {\n    background: var(--color-mono--100);\n    color: var(--ui-color--black);\n}\n.block--cool--pale {\n    background: var(--color-cool--100);\n    color: var(--ui-color--black);\n}\n.block--warm--pale {\n    background: var(--color-warm--100);\n    color: var(--ui-color--black);\n}\n.block--blue--pale {\n    background: var(--color-blue--100);\n    color: var(--ui-color--black);\n}\n.block--yellow--pale {\n    background: var(--color-yellow--100);\n    color: var(--ui-color--black);\n}\n.block--green--pale {\n    background: var(--color-green--100);\n    color: var(--ui-color--black);\n}\n.block--red--pale {\n    background: var(--color-red--100);\n    color: var(--ui-color--black);\n}\n.block--brand-red--pale {\n    background: var(--color-brand-red--100);\n    color: var(--ui-color--black);\n}\n.block--brand-blue--pale {\n    background: var(--color-brand-blue--100);\n    color: var(--ui-color--black);\n}\n.block--mono {\n    background: var(--color-mono--600);\n    color: var(--ui-color--white);\n}\n.block--cool {\n    background: var(--color-cool--600);\n    color: var(--ui-color--white);\n}\n.block--warm {\n    background: var(--color-warm--600);\n    color: var(--ui-color--white);\n}\n.block--blue {\n    background: var(--color-blue--600);\n    color: var(--ui-color--white);\n}\n.block--yellow {\n    background: var(--color-yellow--600);\n    color: var(--ui-color--white);\n}\n.block--green {\n    background: var(--color-green--600);\n    color: var(--ui-color--white);\n}\n.block--red {\n    background: var(--color-red--600);\n    color: var(--ui-color--white);\n}\n.block--brand-red {\n    background: var(--color-brand-red--600);\n    color: var(--ui-color--white);\n}\n.block--brand-blue {\n    background: var(--color-brand-blue--600);\n    color: var(--ui-color--white);\n}\n.block--rounded {\n    border-radius: var(--border-radius);\n}\n.block--small { padding: var(--gap--small) var(--gap); }\n.block--large { padding: var(--gap--large); }\n/* UI helpers */\n/* TEXT */\n.text--mono { font-family: var(--font-family--mono); }\n.text--highlight {\n    background-color: var(--color-yellow--400);\n    padding: 3px 0;\n    border-radius: 2px;\n    box-shadow: 3px 0 0 var(--color-yellow--400), -3px 0 0 var(--color-yellow--400);\n    color: var(--ui-color--black);\n}\n.text--truncate {\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    overflow: hidden;\n    max-width: 100%;\n    display: inline-block;\n}\n.text--break {\n    word-break: break-all;\n}\n.text--small {\n    font-size: var(--font-size--small);\n}\n.text--large {\n    font-size: var(--font-size--large);\n}\n.nowrap {\n    white-space: nowrap;\n}\n.code {\n    color: var(--color-blue--500);\n    font-family: var(--font-family--mono);\n    background: var(--color-cool--200);\n    display: inline-block;\n    padding: 0 3px;\n    border-radius: 2px;\n    font-size: inherit;\n    font-weight: inherit;\n}\n.pre {\n    display: block;\n    font-family: var(--font-family--mono);\n    line-height: 1.6;\n    font-size: 1.1em;\n    font-weight: 400;\n    word-wrap: break-word;\n    word-break: break-word;\n    white-space: pre-wrap;\n    background: var(--color-cool--800);\n    color: white;\n    border-radius: var(--border-radius);\n    padding: var(--gap);\n    overflow-x: auto;\n}\n.no-caps { text-transform: initial; }\n.all-caps { text-transform: uppercase; }\n/* CONTROLS */\n.frameless {\n    border-color: transparent;\n    box-shadow: none;\n    background: transparent;\n}\n.frameless:hover {\n    background: transparent;\n}\n.select {\n    box-shadow: 0 0 0 1px var(--border-color);\n    box-shadow: 0 -1px 0 0 rgba(0, 0, 0, .3) inset;\n    background-color: var(--color-mono--200);\n    height: 2em;\n    padding: 0 2em 0 .5em;\n    font-weight: 500;\n}\n/* GRID */\n.grid {\n    display: grid;\n    align-items: start;\n    justify-items: start;\n    max-width: 100%;\n}\n.grid--gap { grid-gap: var(--gap); }\n.grid--gap--small { grid-gap: var(--gap--small); }\n.grid--gap--large { grid-gap: var(--gap--large); }\n.shift { margin-left: var(--control-height); }\n.shift--small { margin-left: var(--control-height--small); }\n.shift--large { margin-left: var(--control-height--large); }\n.stretch {\n    width: 100%;\n    justify-items: stretch;\n}\n/* VISIBILITY */\n.hidden {\n    display: none;\n}\n/* semantic foreground colours */\n.color--default { color: var(--ui-color); }\n.color--inverse { color: var(--ui-color--inverse); }\n.color--primary { color: var(--ui-color--primary); }\n.color--secondary { color: var(--ui-color--secondary); }\n.color--accent { color: var(--ui-color--accent); }\n.color--muted { color: var(--ui-color--muted); }\n/* base foreground colours */\n.color--mono { color: var(--ui-color--mono); }\n.color--cool { color: var(--ui-color--cool); }\n.color--warm { color: var(--ui-color--warm); }\n.color--blue { color: var(--ui-color--blue); }\n.color--yellow { color: var(--ui-color--yellow); }\n.color--green { color: var(--ui-color--green); }\n.color--red { color: var(--ui-color--red); }\n.color--brand-red { color: var(--ui-color--brand-red); }\n.color--brand-blue { color: var(--ui-color--brand-blue); }\n/* semantic background colours */\n.bg--default { background: var(--ui-background); }\n/* base background colours */\n.bg--mono { background: var(--ui-color--mono); }\n.bg--cool { background: var(--ui-color--cool); }\n.bg--warm { background: var(--ui-color--warm); }\n.bg--blue { background: var(--ui-color--blue); }\n.bg--yellow { background: var(--ui-color--yellow); }\n.bg--green { background: var(--ui-color--green); }\n.bg--red { background: var(--ui-color--red); }\n.bg--brand-red { background: var(--ui-color--brand-red); }\n.bg--brand-blue { background: var(--ui-color--brand-blue); }\n.bg--mono--pale { background: var(--ui-color--mono--pale); }\n.bg--cool--pale { background: var(--ui-color--cool--pale); }\n.bg--warm--pale { background: var(--ui-color--warm--pale); }\n.bg--blue--pale { background: var(--ui-color--blue--pale); }\n.bg--yellow--pale { background: var(--ui-color--yellow--pale); }\n.bg--green--pale { background: var(--ui-color--green--pale); }\n.bg--red--pale { background: var(--ui-color--red--pale); }\n.bg--brand-red--pale { background: var(--ui-color--brand-red--pale); }\n.bg--brand-blue--pale { background: var(--ui-color--brand-blue--pale); }\n.bg--mono--light { background: var(--color-mono--400); }\n.bg--cool--light { background: var(--color-cool--400); }\n.bg--warm--light { background: var(--color-warm--400); }\n.bg--blue--light { background: var(--color-blue--400); }\n.bg--yellow--light { background: var(--color-yellow--400); }\n.bg--green--light { background: var(--color-green--400); }\n.bg--red--light { background: var(--color-red--400); }\n.bg--brand-red--light { background: var(--color-brand-red--400); }\n.bg--brand-blue--light { background: var(--color-brand-blue--400); }\n.bg--mono--dark { background: var(--color-mono--800); }\n.bg--cool--dark { background: var(--color-cool--800); }\n.bg--warm--dark { background: var(--color-warm--800); }\n.bg--blue--dark { background: var(--color-blue--800); }\n.bg--yellow--dark { background: var(--color-yellow--800); }\n.bg--green--dark { background: var(--color-green--800); }\n.bg--red--dark { background: var(--color-red--800); }\n.bg--brand-red--dark { background: var(--color-brand-red--800); }\n.bg--brand-blue--dark { background: var(--color-brand-blue--800); }\n/* Print CSS base */\n@media print {\n    body {\n        color: #000;\n        background: white;\n        width: 100%;\n        margin: 0;\n        padding: 0;\n    }\n\n    .no-print {\n        display: none;\n    }\n\n    @page {\n        margin: 1.5cm;\n    }\n}\n.demo {\n    --header-bg: rgba(255,255,255,.85);\n    --snippet-bg: var(--color-warm--100);\n\n    padding: 0 40px 0 80px;\n    display: grid;\n    grid-template-rows: 100vh;\n}\n.demo__snippet {\n    display: grid;\n    grid-gap: var(--gap);\n    background-color: var(--snippet-bg);\n    color: var(--color-cool--500);\n    border-radius: 3px;\n    padding: var(--gap);\n    font-size: 1em;\n    line-height: 1.6;\n    align-items: start;\n    width: 100%;\n}\n.demo__snippet-source {\n    color: var(--color-yellow--600);\n}\n.demo__snippet-code {\n    height: min-content;\n    white-space: pre-wrap;\n}\n.demo.theme--night-dark {\n    --header-bg: var(--ui-background);\n    --snippet-bg: rgba(0,0,0,.5);\n}\n/* Inbox */\nsection {\n    border-bottom: 0.5px solid var(--color-warm--300);\n    margin-bottom: var(--gap);\n    padding-bottom: var(--gap--large);\n}\nsection:last-of-type {\n    border-bottom: 0;\n}\nsection > header {\n    position: sticky;\n    top: 0;\n    left: 0;\n    z-index: 1;\n\n    background: var(--header-bg);\n    padding: var(--gap--large) 0;\n\n    color: var(--color-blue--500);\n    margin: var(--gap--large) 0;\n\n    font-size: 25px;\n    line-height: 1;\n    font-weight: 300;\n}\narticle {\n    border-bottom: 0.5px dashed var(--color-warm--300);\n    padding-bottom: var(--gap--large);\n    margin: var(--gap--large) 0;\n    display: grid;\n    grid-gap: var(--gap);\n}\narticle:last-of-type {\n    border-bottom: 0;\n}\narticle > header {\n    color: var(--color-blue--500);\n\n    position: sticky;\n    top: 65px;\n    left: 0;\n    z-index: 1;\n\n    background: var(--header-bg);\n    margin: var(--gap) 0 calc(2 * var(--gap--large));\n    padding: 0 0 var(--gap--large);\n\n    font-size: 18px;\n    line-height: 1;\n    font-weight: 300;\n}\n.navigation {\n    padding-top: 60px;\n}\n.navigation__headline {\n    display: grid;\n    grid-auto-flow: column;\n    grid-gap: var(--gap);\n    align-items: center;\n    justify-content: start;\n}\n.navigation__headline-logo {\n    display: inline-grid;\n}\n.navigation__headline-title {\n    line-height: 1;\n    font-size: 32px;\n    margin: 0;\n    padding: 0;\n}\n.navigation__menu {\n    position: sticky;\n    top: 0;\n    left: 0;\n    padding: var(--gap--large) 0;\n}\n.navigation__menu-item {\n    list-style-type: none;\n    display: inline-grid;\n    grid-gap: var(--gap--small);\n    align-items: baseline;\n    grid-auto-flow: column;\n    margin: 15px 30px 0 0;\n    font-size: 16px;\n    text-decoration: none;\n}\n.navigation__menu-item:hover {\n    color: var(--ui-color--secondary);\n}\n.navigation__menu-icon {\n    width: 16px;\n    color: currentColor;\n}\n.navigation__up {\n    text-decoration: none;\n    position: fixed;\n    bottom: 0;\n    left: 0;\n    padding: var(--gap--large);\n    display: grid;\n    grid-gap: var(--gap--small);\n    align-items: center;\n    justify-content: center;\n    justify-items: center;\n    font-size: var(--font-size--large);\n\n    color: var(--ui-color--muted);\n    font-size: var(--font-size--large);\n}\n.navigation__night-dark {\n    position: fixed;\n    bottom: 0;\n    right: 0;\n    padding: var(--gap--large);\n}")
;(function(){


module.exports = {
    data() {
        return {
            sections: {
                'colour': 'Colour',
                'typography': 'Typography',
                'buttons': 'Buttons',
                'inputs': 'Inputs',
                'badges': 'Badges',
                'tags': 'Tags',
                'containers': 'Containers',
                'loaders': 'Loaders'
            }
        };
    },

    components: {
        'navigation': require('./navigation.vue'),
        'colour': require('./sections/colour/index.vue'),
        'typography': require('./sections/typography/index.vue'),
        'buttons': require('./sections/button/index.vue'),
        'inputs': require('./sections/inputs/index.vue'),
        'badges': require('./sections/badge.vue'),
        'tags': require('./sections/tag.vue'),
        'containers': require('./sections/containers/index.vue'),
        'loaders': require('./sections/loaders/index.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"demo",class:{ 'theme--night-dark': _vm.$root.darkMode }},[_c('navigation',{attrs:{"sections":_vm.sections}}),_vm._v(" "),_c('div',{staticClass:"demo__container"},_vm._l((_vm.sections),function(sectionTitle,component){return _c('section',{key:component,staticClass:"section",class:_vm.activeItem === component ? 'section--active' : '',attrs:{"id":component}},[_c('header',[_vm._v(_vm._s(sectionTitle))]),_vm._v(" "),_c(component,{tag:"component"})],1)}),0)],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3d7a7128", __vue__options__)
  } else {
    hotAPI.reload("data-v-3d7a7128", __vue__options__)
  }
})()}
},{"./navigation.vue":13,"./sections/badge.vue":14,"./sections/button/index.vue":17,"./sections/colour/index.vue":26,"./sections/containers/index.vue":35,"./sections/inputs/index.vue":37,"./sections/loaders/index.vue":43,"./sections/tag.vue":46,"./sections/typography/index.vue":49,"vue":8,"vue-hot-reload-api":6,"vueify/lib/insert-css":10}],13:[function(require,module,exports){
;(function(){


const { version } = require('../../package.json');

module.exports = {
    props: {
        sections: { type: Object, required: true }
    },

    data() {
        return {
            version
        };
    },

    created() {
        this.$nextTick(() => this.scrollToActive());
    },

    watch: {
        activeMenuItem(hash) {
            if (hash) {
                this.scrollToActive();
            }
        }
    },

    methods: {
        scrollToActive() {
            if (!this.activeMenuItem) {
                return;
            }

            try {
                const el = this.$el.querySelector('#' + this.activeMenuItem);
                if (el) {
                    el.scrollIntoViewIfNeeded();
                }
            } catch (err) {}
        }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',{staticClass:"navigation",attrs:{"id":"top"}},[_c('div',{staticClass:"navigation__headline"},[_c('span',{staticClass:"navigation__headline-logo"},[_c('svg',{attrs:{"viewBox":"0 0 32.42 28.7","width":"42","fill":"currentColor"}},[_c('path',{attrs:{"d":"M16.8 14.3C16.8 11.2 19.3 8.7 22.5 8.7 25.6 8.7 28.1 11.2 28.1 14.3 28.1 17.5 25.6 20 22.5 20 19.3 20 16.8 17.5 16.8 14.3ZM4.3 14.3C4.3 11.2 6.9 8.7 10 8.7 13.1 8.7 15.7 11.2 15.7 14.3 15.7 17.5 13.1 20 10 20 6.9 20 4.3 17.5 4.3 14.3ZM25.1 1C24.7 0.4 24 0 23.3 0L9.1 0C8.4 0 7.7 0.4 7.4 1L0.3 13.3C-0.1 14-0.1 14.7 0.3 15.4L7.4 27.7C7.7 28.3 8.4 28.7 9.1 28.7L23.3 28.7C24 28.7 24.7 28.3 25.1 27.7L32.2 15.4C32.5 14.7 32.5 14 32.2 13.3L25.1 1ZM20.3 14.3C20.3 13.1 21.3 12.2 22.5 12.2 23.7 12.2 24.6 13.1 24.6 14.3 24.6 15.5 23.7 16.5 22.5 16.5 21.3 16.5 20.3 15.5 20.3 14.3ZM19.4 14.3C19.4 16 20.8 17.4 22.5 17.4 24.2 17.4 25.5 16 25.5 14.3 25.5 12.6 24.2 11.3 22.5 11.3 20.8 11.3 19.4 12.6 19.4 14.3ZM6.9 14.3C6.9 16 8.3 17.4 10 17.4 11.7 17.4 13.1 16 13.1 14.3 13.1 12.6 11.7 11.3 10 11.3 8.3 11.3 6.9 12.6 6.9 14.3Z"}})])]),_vm._v(" "),_c('h1',{staticClass:"navigation__headline-title"},[_c('b',[_vm._v("ubio")]),_vm._v(" "),_c('span',[_vm._v("CSS Framework")]),_vm._v(" "),_c('sub',{staticClass:"color--muted"},[_vm._v("v"+_vm._s(_vm.version))])])]),_vm._v(" "),_c('menu',{staticClass:"navigation__menu"},_vm._l((_vm.sections),function(section,key){return _c('a',{key:key,staticClass:"navigation__menu-item",class:{ 'navigation__menu-item--active': key === _vm.activeMenuItem },attrs:{"href":'#' + key},on:{"click":function($event){_vm.activeMenuItem = key}}},[_c('i',{staticClass:"fa navigation-icon",class:{
                'fas fa-paint-brush': key === 'colour',
                'fas fa-font': key === 'typography',
                'fas fa-hand-pointer': key === 'buttons',
                'fas fa-keyboard': key === 'inputs',
                'fas fa-columns': key === 'containers',
                'fas fa-certificate': key === 'badges',
                'fas fa-tag': key === 'tags',
                'fas fa-spinner': key === 'loaders',
                'fas fa-gift': key === 'other'
            }}),_vm._v("\n            "+_vm._s(section)+"\n        ")])}),0),_vm._v(" "),_vm._m(0),_vm._v(" "),_c('a',{staticClass:"navigation__night-dark",attrs:{"title":"Dark theme is work in progress"},on:{"click":function($event){_vm.$root.darkMode = !_vm.$root.darkMode}}},[_c('i',{staticClass:"far color--muted",class:{
                'fa-moon': !_vm.$root.darkMode,
                'fa-sun': _vm.$root.darkMode
            }})])])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('a',{staticClass:"navigation__up",attrs:{"href":"#top","title":"UP!"}},[_c('i',{staticClass:"fas fa-angle-double-up"})])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ecdcaae", __vue__options__)
  } else {
    hotAPI.reload("data-v-7ecdcaae", __vue__options__)
  }
})()}
},{"../../package.json":11,"vue":8,"vue-hot-reload-api":6}],14:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'badges'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('article',[_c('header',[_vm._v("Styling")]),_vm._v(" "),_c('spec',{attrs:{"name":"Foundation","code":".badge, .badge--outline","source":"badge.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(6, auto)"}},[_c('span',{staticClass:"badge badge--small"},[_vm._v("Small")]),_vm._v(" "),_c('span',{staticClass:"badge"},[_vm._v("Default")]),_vm._v(" "),_c('span',{staticClass:"badge badge--large"},[_vm._v("Large")]),_vm._v(" "),_c('span',{staticClass:"badge badge--outline badge--small"},[_vm._v("Small")]),_vm._v(" "),_c('span',{staticClass:"badge badge--outline"},[_vm._v("Default")]),_vm._v(" "),_c('span',{staticClass:"badge badge--outline badge--large"},[_vm._v("Large")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Custom","code":".badge.badge--yellow","hint":"Size is relative:\n<code>font-size</code>","source":"variables.css, badge.css"}},[_c('div',{staticClass:"group group--gap",staticStyle:{"font-size":"16px"}},[_c('span',{staticClass:"badge badge--yellow"},[_vm._v("PROCESSING")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Tinted","code":".badge.badge--[name]\n.badge.badge--[name]--light\n.badge.badge--[name]--outline","source":"badge.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(4, auto)"}},[_vm._l((_vm.$root.colorsSemaphore),function(color){return _c('span',{key:color,staticClass:"badge badge--fixed all-caps",class:("badge--" + color)},[_vm._v("\n                    "+_vm._s(color)+"\n                ")])}),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--blue--light"},[_c('i',{staticClass:"fas fa-info-circle"}),_vm._v("\n                    info\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--yellow--light"},[_c('i',{staticClass:"fas fa-exclamation-triangle"}),_vm._v("\n                    warning\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--red--light"},[_c('i',{staticClass:"fas fa-exclamation-circle"}),_vm._v("\n                    failure\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--green--light"},[_c('i',{staticClass:"fas fa-check-circle"}),_vm._v("\n                    success\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--blue--outline"},[_c('i',{staticClass:"fas fa-info-circle"}),_vm._v("\n                    info\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--yellow--outline"},[_c('i',{staticClass:"fas fa-exclamation-triangle"}),_vm._v("\n                    warning\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--red--outline"},[_c('i',{staticClass:"fas fa-exclamation-circle"}),_vm._v("\n                    failure\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge all-caps badge--green--outline"},[_c('i',{staticClass:"fas fa-check-circle"}),_vm._v("\n                    success\n                ")])],2)]),_vm._v(" "),_c('spec',{attrs:{"name":"No caps","code":".badge.badge--[name].no-caps\n.badge.badge--[name]--outline.no-caps","source":"badge.css"}},[_c('div',{staticClass:"grid grid--gap--small",staticStyle:{"grid-template-columns":"repeat(3, auto)"}},[_c('span',{staticClass:"badge no-caps badge--yellow"},[_vm._v("awaitingInput")]),_vm._v(" "),_c('span',{staticClass:"badge no-caps badge--yellow--outline"},[_vm._v("awaitingTds")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Fixed width","code":".badge.badge--[name].no-caps\n.badge.badge--[name]--outline.no-caps","source":"badge.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(5, 1fr)"}},_vm._l((_vm.$root.colorsGrey.concat( _vm.$root.colorsSemaphore,
                        _vm.$root.colorsBrand
                    )),function(colour){return _c('div',{key:colour,staticClass:"grid grid--gap--small"},[_c('span',{staticClass:"badge no-caps badge--fixed",class:("bg--" + colour)},[_vm._v("\n                        "+_vm._s(colour)+"\n                    ")]),_vm._v(" "),_c('span',{staticClass:"badge no-caps badge--fixed",class:("bg--" + colour)},[_c('i',{staticClass:"fas fa-bullseye"}),_vm._v("\n                        "+_vm._s(colour)+"\n                    ")]),_vm._v(" "),_c('span',{staticClass:"badge no-caps badge--fixed",class:("badge--" + colour + "--outline")},[_vm._v(_vm._s(colour))]),_vm._v(" "),_c('span',{staticClass:"badge no-caps badge--fixed",class:("badge--" + colour + "--outline")},[_c('i',{staticClass:"fas fa-bullseye"}),_vm._v("\n                        "+_vm._s(colour)+"\n                    ")]),_vm._v(" "),_c('span',{staticClass:"badge badge--fixed",class:("badge--" + colour)},[_vm._v("\n                        "+_vm._s(colour)+"\n                    ")]),_vm._v(" "),_c('span',{staticClass:"badge badge--fixed",class:("badge--" + colour)},[_c('i',{staticClass:"fas fa-bullseye"}),_vm._v("\n                        "+_vm._s(colour)+"\n                    ")]),_vm._v(" "),_c('span',{staticClass:"badge badge--fixed",class:("badge--" + colour + "--outline")},[_vm._v("\n                        "+_vm._s(colour)+"\n                    ")]),_vm._v(" "),_c('span',{staticClass:"badge badge--fixed",class:("badge--" + colour + "--outline")},[_c('i',{staticClass:"fas fa-bullseye"}),_vm._v("\n                        "+_vm._s(colour)+"\n                    ")])])}),0)]),_vm._v(" "),_c('spec',{attrs:{"name":"In-table small badge","code":".badge.badge--inline.badge--blue--outline","source":"badge.css"}},[_c('div',{staticClass:"box box--mono"},[_c('span',{staticClass:"badge badge--inline badge--blue--outline"},[_vm._v("\n                    c69\n                ")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Environment","code":".badge.badge--production\n.badge.badge--staging","source":"badge.css"}},[_c('div',{staticClass:"grid grid--gap--small",staticStyle:{"grid-template-columns":"repeat(7, 1fr)"}},[_c('span',{staticClass:"badge badge--production"},[_vm._v("\n                    production\n                ")]),_vm._v(" "),_c('span',{staticClass:"badge badge--staging"},[_vm._v("\n                    staging\n                ")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Round","code":".badge.badge--round","source":"badge.css"}},[_c('div',{staticClass:"group group--gap--large"},[_c('span',{staticClass:"badge badge--large badge--production badge--round"},[_vm._v("p")]),_vm._v(" "),_c('span',{staticClass:"badge badge--large badge--staging badge--round"},[_vm._v("s")]),_vm._v(" "),_c('span',{staticClass:"badge badge--large badge--round"},[_vm._v("126")]),_vm._v(" "),_c('span',{staticClass:"badge badge--production badge--round"},[_vm._v("p")]),_vm._v(" "),_c('span',{staticClass:"badge badge--staging badge--round"},[_vm._v("s")]),_vm._v(" "),_c('span',{staticClass:"badge badge--round"},[_vm._v("126")]),_vm._v(" "),_c('span',{staticClass:"badge badge--small badge--production badge--round"},[_vm._v("p")]),_vm._v(" "),_c('span',{staticClass:"badge badge--small badge--staging badge--round"},[_vm._v("s")]),_vm._v(" "),_c('span',{staticClass:"badge badge--small badge--round"},[_vm._v("126")])])])],1)])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-030025c8", __vue__options__)
  } else {
    hotAPI.reload("data-v-030025c8", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],15:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-base-size'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('spec',{attrs:{"name":"Base pure HTML button","code":"button, button:disabled","source":"base.css"}},[_c('div',{staticClass:"group group--gap"},[_c('button',[_vm._v("Base button")]),_vm._v(" "),_c('button',{attrs:{"disabled":""}},[_vm._v("Base button disabled")])])]),_vm._v(" "),_c('spec',{attrs:{"name":".button","code":"a.button\na.button[disabled]","source":"button.css"}},[_c('div',{staticClass:"group group--gap"},[_c('a',{staticClass:"button"},[_vm._v("Link as a button")]),_vm._v(" "),_c('a',{staticClass:"button",attrs:{"disabled":""}},[_vm._v("Disabled link as a button")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Small, normal & large scalers","code":".button.button--small\n.button\n.button.button--large","source":"button.css"}},[_c('div',{staticClass:"group group--gap"},[_c('a',{staticClass:"button button--small"},[_vm._v("Small")]),_vm._v(" "),_c('a',{staticClass:"button"},[_vm._v("Regular")]),_vm._v(" "),_c('a',{staticClass:"button button--large"},[_vm._v("Large")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Custom size & colour","code":".button, .button--small, .button--large","hint":"Amend variables:\n<code>--ui-color--cta</code>\n<code>--ui-color--cta--hover</code>\n<code>--font-size</code>","source":"variables.css, button.css"}},[_c('div',{staticClass:"group group--gap",staticStyle:{"--font-size":"16px"}},[_c('a',{staticClass:"button button--small"},[_vm._v("Small button")]),_vm._v(" "),_c('a',{staticClass:"button"},[_vm._v("Regular button")]),_vm._v(" "),_c('a',{staticClass:"button button--large"},[_vm._v("Large button")])])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-62686e77", __vue__options__)
  } else {
    hotAPI.reload("data-v-62686e77", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],16:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-sets'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('header',[_vm._v("Groups")]),_vm._v(" "),_c('spec',{attrs:{"name":"Merged together","code":".group.group--merged","source":"group.css"}},[_c('div',{staticClass:"grid"},[_c('div',{staticClass:"group group--merged"},[_c('button',{staticClass:"button button--accent"},[_vm._v("All")]),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("Live")]),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("Test")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Merged together with border","code":".group.group--merged.group--merged--border","source":"group.css"}},[_c('div',{staticClass:"grid"},[_c('div',{staticClass:"group group--merged group--merged--border"},[_c('button',{staticClass:"button button--accent"},[_vm._v("All")]),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("Live")]),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("Test")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Merged with a space between","code":".group.group--semi-merged","source":"group.css"}},[_c('div',{staticClass:"grid grid--gap--large",staticStyle:{"grid-template-columns":"1fr 1fr"}},[_c('div',{staticClass:"group group--semi-merged"},[_c('button',{staticClass:"button"},[_vm._v("All")]),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("Live")]),_vm._v(" "),_c('button',{staticClass:"button button--accent"},[_vm._v("Test")])]),_vm._v(" "),_c('div',{staticClass:"group group--semi-merged"},[_c('button',{staticClass:"button button--icon"},[_c('svg',{attrs:{"viewBox":"0 0 15 16"}},[_c('path',{attrs:{"fill":"currentColor","d":"M3.5,12.9761811 L11.6666667,12.9761811 L11.6666667,10.6428478 L3.5,10.6428478 L3.5,12.9761811 Z M3.5,7.14284778 L11.6666667,7.14284778 L11.6666667,3.64284778 L10.2083333,3.64284778 C9.72526042,3.64284778 9.33333333,3.25092069 9.33333333,2.76784778 L9.33333333,1.30951444 L3.5,1.30951444 L3.5,7.14284778 Z M14,7.72618111 C14,7.40717069 13.7356771,7.14284778 13.4166667,7.14284778 C13.0976563,7.14284778 12.8333333,7.40717069 12.8333333,7.72618111 C12.8333333,8.04519153 13.0976563,8.30951444 13.4166667,8.30951444 C13.7356771,8.30951444 14,8.04519153 14,7.72618111 Z M15.1666667,7.72618111 L15.1666667,11.5178478 C15.1666667,11.6727957 15.0299479,11.8095144 14.875,11.8095144 L12.8333333,11.8095144 L12.8333333,13.2678478 C12.8333333,13.7509207 12.4414062,14.1428478 11.9583333,14.1428478 L3.20833333,14.1428478 C2.72526042,14.1428478 2.33333333,13.7509207 2.33333333,13.2678478 L2.33333333,11.8095144 L0.291666667,11.8095144 C0.13671875,11.8095144 0,11.6727957 0,11.5178478 L0,7.72618111 C0,6.76914986 0.79296875,5.97618111 1.75,5.97618111 L2.33333333,5.97618111 L2.33333333,1.01784778 C2.33333333,0.53477486 2.72526042,0.142847776 3.20833333,0.142847776 L9.33333333,0.142847776 C9.81640625,0.142847776 10.4817708,0.416285276 10.828125,0.762639443 L12.2135417,2.14805611 C12.5598958,2.49441028 12.8333333,3.15977486 12.8333333,3.64284778 L12.8333333,5.97618111 L13.4166667,5.97618111 C14.3736979,5.97618111 15.1666667,6.76914986 15.1666667,7.72618111 Z"}})])]),_vm._v(" "),_c('button',{staticClass:"button button--icon"},[_c('svg',{attrs:{"viewBox":"0 0 15 16"}},[_c('g',{attrs:{"transform":"translate(-709.000000, -561.000000)"}},[_c('path',{attrs:{"fill":"currentColor","d":"M721.331891,572.620595 C720.98011,572.679226 720.618557,572.708541 720.257004,572.708541 C716.631701,572.708541 713.690418,569.767258 713.690418,566.141955 C713.690418,564.900949 714.051971,563.689257 714.706676,562.653457 C712.107402,563.425421 710.250778,565.809717 710.250778,568.643511 C710.250778,572.092923 713.055257,574.897402 716.504669,574.897402 C718.390608,574.897402 720.159287,574.037492 721.331891,572.620595 Z M723.315547,571.79 C722.094084,574.438132 719.416637,576.148181 716.504669,576.148181 C712.371238,576.148181 709,572.776943 709,568.643511 C709,564.588254 712.175804,561.29519 716.22129,561.148614 C716.494897,561.138842 716.719647,561.29519 716.817364,561.529711 C716.924852,561.774003 716.856451,562.057383 716.670788,562.233273 C715.556814,563.249531 714.941196,564.637113 714.941196,566.141955 C714.941196,569.073466 717.325492,571.457762 720.257004,571.457762 C721.028968,571.457762 721.771618,571.291643 722.484952,570.959405 C722.729245,570.851917 723.002853,570.900775 723.188515,571.086438 C723.374178,571.2721 723.423036,571.555479 723.315547,571.79 Z"}})])])]),_vm._v(" "),_c('button',{staticClass:"button button--icon"},[_c('svg',{attrs:{"viewBox":"0 0 16 16"}},[_c('g',{attrs:{"transform":"translate(-695.000000, -561.000000)"}},[_c('path',{attrs:{"d":"M705.590948,561.026 L710.926,561.026 L710.926,566.361052 L708.812598,566.361052 L708.812598,563.139402 L705.590948,563.139402 L705.590948,561.026 Z M708.812598,573.912598 L708.812598,570.690948 L710.926,570.690948 L710.926,576.026 L705.590948,576.026 L705.590948,573.912598 L708.812598,573.912598 Z M695.926,566.361052 L695.926,561.026 L701.261052,561.026 L701.261052,563.139402 L698.039402,563.139402 L698.039402,566.361052 L695.926,566.361052 Z M698.039402,570.690948 L698.039402,573.912598 L701.261052,573.912598 L701.261052,576.026 L695.926,576.026 L695.926,570.690948 L698.039402,570.690948 Z"}})])])])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Pagination","code":".group.group--gap--small","source":"group.css"}},[_c('div',{staticClass:"grid grid--gap-small"},[_c('div',{staticClass:"group group--gap--small"},[_c('a',{staticClass:"button button--flat button--icon",attrs:{"disabled":""}},[_c('svg',{attrs:{"width":"8","height":"10"}},[_c('path',{attrs:{"d":"M5.4 8.4C5.4 8.4 5.4 8.5 5.3 8.6L4.9 9C4.8 9.1 4.7 9.1 4.7 9.1 4.6 9.1 4.5 9.1 4.4 9L0.3 4.9C0.2 4.8 0.2 4.7 0.2 4.7 0.2 4.6 0.2 4.5 0.3 4.4L4.4 0.3C4.5 0.2 4.6 0.2 4.7 0.2 4.7 0.2 4.8 0.2 4.9 0.3L5.3 0.7C5.4 0.8 5.4 0.9 5.4 0.9 5.4 1 5.4 1.1 5.3 1.1L1.8 4.7 5.3 8.2C5.4 8.2 5.4 8.3 5.4 8.4ZM8.8 8.4C8.8 8.4 8.8 8.5 8.7 8.6L8.3 9C8.2 9.1 8.2 9.1 8.1 9.1 8 9.1 7.9 9.1 7.9 9L3.7 4.9C3.7 4.8 3.6 4.7 3.6 4.7 3.6 4.6 3.7 4.5 3.7 4.4L7.9 0.3C7.9 0.2 8 0.2 8.1 0.2 8.2 0.2 8.2 0.2 8.3 0.3L8.7 0.7C8.8 0.8 8.8 0.9 8.8 0.9 8.8 1 8.8 1.1 8.7 1.1L5.2 4.7 8.7 8.2C8.8 8.2 8.8 8.3 8.8 8.4Z"}})])]),_vm._v(" "),_c('a',{staticClass:"button button--flat button--icon",attrs:{"disabled":""}},[_c('svg',{attrs:{"width":"5","height":"10"}},[_c('path',{attrs:{"d":"M5.4 0.9C5.4 1 5.4 1.1 5.3 1.1L1.8 4.7 5.3 8.2C5.4 8.2 5.4 8.3 5.4 8.4 5.4 8.4 5.4 8.5 5.3 8.6L4.9 9C4.8 9.1 4.7 9.1 4.7 9.1 4.6 9.1 4.5 9.1 4.5 9L0.3 4.9C0.2 4.8 0.2 4.7 0.2 4.7 0.2 4.6 0.2 4.5 0.3 4.5L4.5 0.3C4.5 0.2 4.6 0.2 4.7 0.2 4.7 0.2 4.8 0.2 4.9 0.3L5.3 0.7C5.4 0.8 5.4 0.9 5.4 0.9Z"}})])]),_vm._v(" "),_c('div',{staticClass:"group"},[_c('a',{staticClass:"button button--icon frameless",attrs:{"disabled":"disabled"}},[_vm._v("\n                        1\n                    ")]),_c('a',{staticClass:"button button--icon frameless"},[_vm._v("\n                        2\n                    ")]),_c('a',{staticClass:"button button--icon frameless"},[_vm._v("\n                        3\n                    ")]),_c('a',{staticClass:"button button--icon frameless"},[_vm._v("\n                        4\n                    ")]),_c('a',{staticClass:"button button--icon frameless"},[_vm._v("\n                        5\n                    ")])]),_vm._v(" "),_c('a',{staticClass:"button button--flat button--icon"},[_c('svg',{staticClass:"pagination__arrow-icon",attrs:{"width":"5","height":"10"}},[_c('path',{attrs:{"d":"M5.3 4.7C5.3 4.7 5.2 4.8 5.2 4.9L1 9C1 9.1 0.9 9.1 0.8 9.1 0.7 9.1 0.6 9.1 0.6 9L0.1 8.6C0.1 8.5 0.1 8.5 0.1 8.4 0.1 8.3 0.1 8.2 0.1 8.2L3.7 4.7 0.1 1.1C0.1 1.1 0.1 1 0.1 0.9 0.1 0.9 0.1 0.8 0.1 0.7L0.6 0.3C0.6 0.2 0.7 0.2 0.8 0.2 0.9 0.2 1 0.2 1 0.3L5.2 4.5C5.2 4.5 5.3 4.6 5.3 4.7Z"}})])]),_vm._v(" "),_c('a',{staticClass:"button button--flat button--icon"},[_c('svg',{staticClass:"pagination__arrow-icon",attrs:{"width":"8","height":"10"}},[_c('path',{attrs:{"d":"M5.3 4.7C5.3 4.7 5.2 4.8 5.2 4.9L1 9C1 9.1 0.9 9.1 0.8 9.1 0.7 9.1 0.6 9.1 0.6 9L0.1 8.6C0.1 8.5 0.1 8.4 0.1 8.4 0.1 8.3 0.1 8.2 0.1 8.2L3.7 4.7 0.1 1.1C0.1 1.1 0.1 1 0.1 0.9 0.1 0.9 0.1 0.8 0.1 0.7L0.6 0.3C0.6 0.2 0.7 0.2 0.8 0.2 0.9 0.2 1 0.2 1 0.3L5.2 4.4C5.2 4.5 5.3 4.6 5.3 4.7ZM8.7 4.7C8.7 4.7 8.6 4.8 8.6 4.9L4.4 9C4.4 9.1 4.3 9.1 4.2 9.1 4.2 9.1 4.1 9.1 4 9L3.6 8.6C3.5 8.5 3.5 8.4 3.5 8.4 3.5 8.3 3.5 8.2 3.6 8.2L7.1 4.7 3.6 1.1C3.5 1.1 3.5 1 3.5 0.9 3.5 0.9 3.5 0.8 3.6 0.7L4 0.3C4.1 0.2 4.2 0.2 4.2 0.2 4.3 0.2 4.4 0.2 4.4 0.3L8.6 4.4C8.6 4.5 8.7 4.6 8.7 4.7Z"}})])])])])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-33a39fc9", __vue__options__)
  } else {
    hotAPI.reload("data-v-33a39fc9", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],17:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'buttons',

    components: {
        'base-size': require('./base-size.vue'),
        'button-styles': require('./styles.vue'),
        'button-groups': require('./button-groups.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('base-size'),_vm._v(" "),_c('button-styles'),_vm._v(" "),_c('button-groups')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6de3104c", __vue__options__)
  } else {
    hotAPI.reload("data-v-6de3104c", __vue__options__)
  }
})()}
},{"./base-size.vue":15,"./button-groups.vue":16,"./styles.vue":24,"vue":8,"vue-hot-reload-api":6}],18:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-styles-accent'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('spec',{attrs:{"name":"Accent","code":".button.button--accent","hint":"To use with sets","source":"button.css"}},[_c('div',{staticClass:"group group--gap--large"},[_c('div',{staticClass:"group group--semi-merged"},[_c('button',{staticClass:"button button--accent"},[_vm._v("All")]),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("Live")]),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("Test")])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c9f49fe2", __vue__options__)
  } else {
    hotAPI.reload("data-v-c9f49fe2", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],19:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-styles-icon-only'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('spec',{attrs:{"name":"Icon only","code":"button.button--icon\n    i.fas | svg","source":"button.css"}},[_c('div',{staticClass:"grid grid--gap--large"},[_c('div',{staticClass:"group group--gap"},[_c('a',{staticClass:"button button--icon button--large"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--primary button--icon button--large"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--secondary button--icon button--large"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--icon"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--primary button--icon"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--secondary button--icon"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--icon button--small"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--primary button--icon button--small"},[_c('i',{staticClass:"fas fa-bullseye"})]),_vm._v(" "),_c('a',{staticClass:"button button--secondary button--icon button--small"},[_c('i',{staticClass:"fas fa-bullseye"})])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c7bbbb6a", __vue__options__)
  } else {
    hotAPI.reload("data-v-c7bbbb6a", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],20:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-styles-icon-within',

    components: {
        spinner: require('../loaders/spinner.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('spec',{attrs:{"name":"Icon within","code":".button\n    .button__icon.fas.fa-bullseye\n    ...","source":"button.css"}},[_c('div',{staticClass:"grid grid--gap--large"},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(7, auto)"}},[_c('a',{staticClass:"button button--large"},[_c('i',{staticClass:"button__icon fas fa-bullseye"}),_vm._v("\n                Large\n            ")]),_vm._v(" "),_c('a',{staticClass:"button"},[_c('spinner',{staticClass:"button__icon"}),_vm._v("\n                Regular\n            ")],1),_vm._v(" "),_c('a',{staticClass:"button button--small"},[_c('i',{staticClass:"button__icon fas fa-bullseye"}),_vm._v("\n                Small\n            ")])]),_vm._v(" "),_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(7, auto)"}},[_c('a',{staticClass:"button button--primary button--large"},[_c('i',{staticClass:"button__icon fas fa-bullseye"}),_vm._v("\n                Large\n            ")]),_vm._v(" "),_c('a',{staticClass:"button button--primary"},[_c('i',{staticClass:"button__icon fas fa-bullseye"}),_vm._v("\n                Regular\n            ")]),_vm._v(" "),_c('a',{staticClass:"button button--primary button--small"},[_c('spinner',{staticClass:"button__icon"}),_vm._v("\n                Small\n            ")],1)]),_vm._v(" "),_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(7, auto)"}},[_c('a',{staticClass:"button button--secondary button--large"},[_c('spinner',{staticClass:"button__icon"}),_vm._v("\n                Large\n            ")],1),_vm._v(" "),_c('a',{staticClass:"button button--secondary"},[_c('i',{staticClass:"button__icon fas fa-bullseye"}),_vm._v("\n                Regular\n            ")]),_vm._v(" "),_c('a',{staticClass:"button button--secondary button--small"},[_c('i',{staticClass:"button__icon fas fa-bullseye"}),_vm._v("\n                Small\n            ")])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0e166c6c", __vue__options__)
  } else {
    hotAPI.reload("data-v-0e166c6c", __vue__options__)
  }
})()}
},{"../loaders/spinner.vue":45,"vue":8,"vue-hot-reload-api":6}],21:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-styles-primary-secondary-custom'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('spec',{attrs:{"name":"Primary & Secondary custom","code":".button.button--primary\n.button.button--secondary","hint":"Amend variables:\n<code>--ui-color--accent</code>\n<code>--ui-color--accent--hover</code>\n<code>--font-size</code>","source":"variables.css, button.css"}},[_c('div',{staticClass:"group group--gap",staticStyle:{"--ui-color--accent--hover":"var(--color-brand-red--600)","--ui-color--accent":"var(--color-brand-red--500)","--font-size":"16px"}},[_c('a',{staticClass:"button button--primary"},[_vm._v("Primary")]),_vm._v(" "),_c('a',{staticClass:"button button--secondary"},[_vm._v("Secondary")])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7b0d42da", __vue__options__)
  } else {
    hotAPI.reload("data-v-7b0d42da", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],22:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-styles-primary-secondary'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('spec',{attrs:{"name":"Primary & Secondary","code":".button.button--primary\n.button.button--secondary","hint":"There supposed to be only one primary action per context","source":"button.css"}},[_c('div',{staticClass:"grid grid--gap"},[_c('div',{staticClass:"group group--gap"},[_c('a',{staticClass:"button button--primary"},[_vm._v("Primary")]),_vm._v(" "),_c('a',{staticClass:"button button--secondary"},[_vm._v("Secondary")]),_vm._v(" "),_c('a',{staticClass:"button button--primary",attrs:{"disabled":""}},[_vm._v("Disabled primary")]),_vm._v(" "),_c('a',{staticClass:"button button--secondary",attrs:{"disabled":""}},[_vm._v("Disabled secondary")])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6b5f01b4", __vue__options__)
  } else {
    hotAPI.reload("data-v-6b5f01b4", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],23:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-styles-primary-secondary'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('spec',{attrs:{"name":"Select.button","code":"select.button.button--large, \nselect.button, \nselect.button.button--small","source":"button.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"auto auto auto"}},[_c('span',{staticClass:"button button--large"},[_c('select',[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])]),_vm._v(" "),_c('span',{staticClass:"button"},[_c('select',[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])]),_vm._v(" "),_c('span',{staticClass:"button button--small"},[_c('select',[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f644717e", __vue__options__)
  } else {
    hotAPI.reload("data-v-f644717e", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],24:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'button-styles',

    components: {
        'styles-primary-secondary': require('./styles-primary-secondary.vue'),
        'styles-primary-secondary-custom': require('./styles-primary-secondary-custom.vue'),
        'styles-accent': require('./styles-accent.vue'),
        'styles-icon-within': require('./styles-icon-within.vue'),
        'styles-icon-only': require('./styles-icon-only.vue'),
        'styles-select': require('./styles-select.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('header',[_vm._v("Styles")]),_vm._v(" "),_c('styles-primary-secondary'),_vm._v(" "),_c('styles-accent'),_vm._v(" "),_c('styles-primary-secondary-custom'),_vm._v(" "),_c('styles-icon-within'),_vm._v(" "),_c('styles-icon-only'),_vm._v(" "),_c('styles-select')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2dfbd8d8", __vue__options__)
  } else {
    hotAPI.reload("data-v-2dfbd8d8", __vue__options__)
  }
})()}
},{"./styles-accent.vue":18,"./styles-icon-only.vue":19,"./styles-icon-within.vue":20,"./styles-primary-secondary-custom.vue":21,"./styles-primary-secondary.vue":22,"./styles-select.vue":23,"vue":8,"vue-hot-reload-api":6}],25:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'bg--pale'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Pale background (messages)")]),_vm._v(" "),_c('spec',{attrs:{"name":"Grey colors","code":".color--[name]\n.bg--[name]--pale","source":"color.css, bg.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"align-items":"stretch","grid-template-columns":"1fr 1fr 1fr"}},_vm._l((_vm.$root.colorsGrey),function(color){return _c('div',{key:color},[_c('div',{staticClass:"box--panel",class:("bg--" + color + "--pale color--" + color)},[_c('b',[_vm._v(_vm._s(color.toUpperCase())+" text")]),_vm._v(".\n                    Ut non condimentum mauris, eu sodales\n                    neque.\n                ")])])}),0)]),_vm._v(" "),_c('spec',{attrs:{"name":"Semaphore colors","code":".color--[name]\n.bg--[name]--pale","source":"color.css, bg.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"align-items":"stretch","grid-template-columns":"1fr 1fr 1fr 1fr"}},_vm._l((_vm.$root.colorsSemaphore),function(color){return _c('div',{key:color},[_c('div',{staticClass:"box",class:("bg--" + color + "--pale color--" + color)},[_c('b',[_vm._v("Lorem ipsum")]),_vm._v(".\n                    Ut non condimentum mauris, eu sodales\n                    neque.\n                ")])])}),0)])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1d216246", __vue__options__)
  } else {
    hotAPI.reload("data-v-1d216246", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],26:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'colour',

    components: {
        'swatches': require('./swatches.vue'),
        'semantics': require('./semantics.vue'),
        'semaphore': require('./semaphore.vue'),
        'bg-pale': require('./bg-pale.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Palette")]),_vm._v(" "),_c('swatches')],1),_vm._v(" "),_c('semantics'),_vm._v(" "),_c('semaphore'),_vm._v(" "),_c('bg-pale')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-02e0a334", __vue__options__)
  } else {
    hotAPI.reload("data-v-02e0a334", __vue__options__)
  }
})()}
},{"./bg-pale.vue":25,"./semantics.vue":27,"./semaphore.vue":28,"./swatches.vue":29,"vue":8,"vue-hot-reload-api":6}],27:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'semantics'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',{staticClass:"article"},[_c('spec',{attrs:{"name":"Semantic","code":".color--[name]","source":"color.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(5, 1fr)"}},_vm._l((['default', 'primary', 'secondary', 'accent', 'muted']),function(color){return _c('div',{key:color,staticClass:"box"},[_c('p',[_c('span',{staticClass:"badge badge--outline badge--small",class:("color--" + color)},[_vm._v("\n                        "+_vm._s(color)+"\n                    ")])]),_vm._v(" "),_c('p',{class:("color--" + color + " bg--default")},[_vm._v("\n                    Lorem ipsum. Ut non condimentum mauris, eu sodales neque.\n                ")])])}),0)])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0278a4fe", __vue__options__)
  } else {
    hotAPI.reload("data-v-0278a4fe", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],28:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'semaphore',

    components: {
        'text-variations-sample': require('./text-variations-sample.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',{staticClass:"article"},[_c('spec',{attrs:{"name":"Semaphore","code":".color--[name]","source":"color.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(4, 1fr)"}},_vm._l((_vm.$root.colorsSemaphore),function(color){return _c('div',{key:color,staticClass:"box"},[_c('p',[_c('span',{staticClass:"badge badge--small",class:("badge--" + color)},[_vm._v("\n                        "+_vm._s(color)+"\n                    ")])]),_vm._v(" "),_c('text-variations-sample',{class:("color--" + color)})],1)}),0)])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c2118650", __vue__options__)
  } else {
    hotAPI.reload("data-v-c2118650", __vue__options__)
  }
})()}
},{"./text-variations-sample.vue":30,"vue":8,"vue-hot-reload-api":6}],29:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".swatches {\n    display: flex;\n    flex-flow: row nowrap;\n}\n\n.swatches__column {\n    display: flex;\n    flex-flow: column nowrap;\n    min-width: 100px;\n}\n\n.swatches__name {\n    padding: var(--gap);\n}\n\n.swatches__step {\n    padding: var(--gap);\n}\n\n.swatches__hex,\n.swatches__hsl {\n    margin-top: var(--gap--small);\n    font-size: var(--font-size--small);\n    opacity: .75;\n}")
;(function(){


const parseColor = require('parse-color');

module.exports = {
    name: 'palette',

    data() {
        const swatchNumbers = ['000', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
        return {
            swatchNumbers
        };
    },

    computed: {

        swatches() {
            const swatches = [];
            for (const name of this.$root.colors) {
                const steps = [];
                const swatch = { name, steps };
                swatches.push(swatch);
                for (const number of this.swatchNumbers) {
                    const variable = `--color-${name}--${number}`;
                    const fgColor = number >= '500' ? 'white' : 'black';
                    const style = `background: var(${variable}); color: ${fgColor}`;
                    const color = evalColor(style);
                    steps.push({
                        number,
                        variable,
                        style,
                        color
                    });
                }
            }
            return swatches;
        }

    }

};

function evalColor(style) {
    const e = document.createElement('div');
    e.style = style;
    document.documentElement.appendChild(e);
    const s = window.getComputedStyle(e);
    const bgColor = s['background-color'];
    document.documentElement.removeChild(e);
    return parseColor(bgColor);
}
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"swatches"},_vm._l((_vm.swatches),function(swatch){return _c('div',{key:swatch.name,staticClass:"swatches__column"},[_c('div',{staticClass:"swatches__name"},[_c('strong',[_vm._v(_vm._s(swatch.name))])]),_vm._v(" "),_c('div',{staticClass:"swatches__steps"},_vm._l((swatch.steps),function(step){return _c('div',{key:step.number,staticClass:"swatches__step",style:(step.style)},[_c('div',{staticClass:"swatches__number"},[_vm._v(_vm._s(step.number))]),_vm._v(" "),_c('div',{staticClass:"swatches__hex"},[_vm._v(_vm._s(step.color.hex))]),_vm._v(" "),_c('div',{staticClass:"swatches__hsl"},[_vm._v(_vm._s(step.color.hsl))])])}),0)])}),0)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-47f3d206", __vue__options__)
  } else {
    hotAPI.reload("data-v-47f3d206", __vue__options__)
  }
})()}
},{"parse-color":1,"vue":8,"vue-hot-reload-api":6,"vueify/lib/insert-css":10}],30:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'text-variations-sample'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"text-variations-sample"},[_vm._m(0),_vm._v(" "),_vm._m(1),_vm._v(" "),_c('div',{staticClass:"text-variations-sample__item"},[_c('big',[_c('span',{staticClass:"all-caps"},[_vm._v("all caps")]),_vm._v(" "),_c('b',[_vm._v("bold")]),_vm._v(" "),_c('strong',[_vm._v("strong")]),_vm._v(" "),_c('i',[_vm._v("italic")])])],1),_vm._v(" "),_c('div',{staticClass:"text-variations-sample__item"},[_vm._m(2),_vm._v(" "),_c('i',{staticClass:"fas fa-bullseye"}),_vm._v(" "),_c('big',[_c('i',{staticClass:"fas fa-bullseye"})])],1)])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"text-variations-sample__item"},[_c('span',{staticClass:"all-caps"},[_vm._v("all caps")]),_vm._v(" "),_c('b',[_vm._v("bold")]),_vm._v(" "),_c('strong',[_vm._v("strong")]),_vm._v(" "),_c('i',[_vm._v("italic")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"text-variations-sample__item"},[_c('small',[_c('span',{staticClass:"all-caps"},[_vm._v("all caps")]),_vm._v(" "),_c('b',[_vm._v("bold")]),_vm._v(" "),_c('strong',[_vm._v("strong")]),_vm._v(" "),_c('i',[_vm._v("italic")])])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('small',[_c('i',{staticClass:"fas fa-bullseye"})])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f7ec755a", __vue__options__)
  } else {
    hotAPI.reload("data-v-f7ec755a", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],31:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'box-outline',

    components: {
        'box-sample': require('./box-sample.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Outlined box")]),_vm._v(" "),_vm._l((_vm.$root.colorsSemaphore),function(color){return _c('spec',{key:color,attrs:{"name":color,"code":("p.box.box--" + color + "--outline"),"source":"box.css"}},[_c('div',{staticClass:"group"},[_c('box-sample',{class:("box box--" + color + "--outline")})],1)])})],2)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63111d8c", __vue__options__)
  } else {
    hotAPI.reload("data-v-63111d8c", __vue__options__)
  }
})()}
},{"./box-sample.vue":32,"vue":8,"vue-hot-reload-api":6}],32:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'box-sample'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box box--blue"},[_vm._v("\n    Donec efficitur eget lectus eget placerat. Ut non condimentum mauris, eu sodales neque. Mauris suscipit pretium lectus, nec pharetra mauris vulputate molestie.\n")])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5428d282", __vue__options__)
  } else {
    hotAPI.reload("data-v-5428d282", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],33:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'boxes',

    components: {
        'box-sample': require('./box-sample.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Tinted box")]),_vm._v(" "),_vm._l((_vm.$root.colorsSemaphore),function(color){return _c('spec',{key:color,attrs:{"name":color,"code":("p.box.box--" + color),"source":"box.css"}},[_c('div',{staticClass:"group"},[_c('box-sample',{class:("box box--" + color)})],1)])})],2)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a0fd1b2", __vue__options__)
  } else {
    hotAPI.reload("data-v-1a0fd1b2", __vue__options__)
  }
})()}
},{"./box-sample.vue":32,"vue":8,"vue-hot-reload-api":6}],34:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'containers-boxes',

    components: {
        'box-tinted': require('./box-tinted.vue'),
        'box-outlined': require('./box-outlined.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('article',[_c('header',{staticClass:"article__title"},[_vm._v("Boxes")]),_vm._v(" "),_c('spec',{attrs:{"name":"Sizing","code":".box\n.box.box--small\n.box.box--large","source":"box.css"}},[_c('div',{staticClass:"group group--gap"},[_c('div',{staticClass:"grid grid--gap"},[_c('div',{staticClass:"box box--blue"},[_c('p',[_c('span',{staticClass:"badge badge--blue"},[_vm._v("Regular box")])]),_vm._v(" "),_c('p',[_vm._v("Mauris suscipit pretium lectus")])]),_vm._v(" "),_c('div',{staticClass:"box box--small box--red"},[_c('p',[_c('span',{staticClass:"badge badge--red"},[_vm._v("Small box")])]),_vm._v(" "),_c('p',[_vm._v("Mauris suscipit pretium lectus, nec pharetra.")])])]),_vm._v(" "),_c('div',{staticClass:"box box--large box--green"},[_c('p',[_c('span',{staticClass:"badge badge--green"},[_vm._v("Large box")])]),_vm._v(" "),_c('p',[_vm._v("Mauris suscipit pretium lectus, nec pharetra mauris vulputate molestie, nec pharetra mauris vulputate molestie.")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Custom size","code":".box.box--yellow","hint":"Amend variables:\n<code>--font-size</code>","source":"variables.css, button.css"}},[_c('div',{staticClass:"box box--yellow stretch",staticStyle:{"--font-size":"16px"}},[_c('p',[_c('i',{staticClass:"icon far fa-clock"}),_c('b',[_vm._v("This might take a moment")])]),_vm._v(" "),_c('p',{staticClass:"shift"},[_vm._v("We generate live data for test jobs. Hold on while we get it.")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Tinting & outline","code":".box.box--outline.color--blue","source":"box.css"}},[_c('div',{staticClass:"box box--outline color--blue stretch"},[_c('p',[_c('b',[_vm._v("Donec efficitur eget lectus eget placerat. Ut non condimentum mauris, eu sodales neque.")])]),_vm._v(" "),_c('p',[_vm._v(" Mauris suscipit pretium lectus, nec pharetra mauris vulputate molestie.")])])])],1),_vm._v(" "),_c('box-tinted'),_vm._v(" "),_c('box-outlined')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2adc8d13", __vue__options__)
  } else {
    hotAPI.reload("data-v-2adc8d13", __vue__options__)
  }
})()}
},{"./box-outlined.vue":31,"./box-tinted.vue":33,"vue":8,"vue-hot-reload-api":6}],35:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'containers',

    components: {
        'boxes': require('./boxes.vue'),
        'tabs': require('./tabs.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('article',[_c('header',{staticClass:"article__title"},[_vm._v("Blocks")]),_vm._v(" "),_c('spec',{attrs:{"name":"Sizing & tinting","code":".block--small\n.block--large\n.block--[colour-name]--pale","source":"block.css"}},[_c('div',{staticClass:"grid stretch grid--gap--small"},[_c('div',{staticClass:"block block--small block--mono--pale"},[_c('b',[_vm._v("Small block panel")]),_vm._v("\n                    Mauris suscipit pretium lectus, nec pharetra.\n                ")]),_vm._v(" "),_c('div',{staticClass:"block block--warm--pale"},[_c('b',[_vm._v("Regular block panel")]),_vm._v("\n                    Mauris suscipit pretium lectus.\n                ")]),_vm._v(" "),_c('div',{staticClass:"block block--large block--cool--pale"},[_c('b',[_vm._v("Large block panel")]),_vm._v("\n                    Mauris suscipit pretium lectus, nec pharetra.\n                ")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Rounded","code":".block.block--[colour-name].block--rounded","source":"block.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr 1fr"}},[_c('div',{staticClass:"block block--rounded block--red text--truncate"},[_vm._v("\n                    Regular block panel Mauris suscipit pretium lectus.\n                ")]),_vm._v(" "),_c('div',{staticClass:"block block--rounded block--green text--truncate"},[_vm._v("\n                    Regular block panel Mauris suscipit pretium lectus.\n                ")]),_vm._v(" "),_c('div',{staticClass:"block block--rounded block--yellow text--truncate"},[_vm._v("\n                    Regular block panel Mauris suscipit pretium lectus.\n                ")]),_vm._v(" "),_c('div',{staticClass:"block block--rounded block--blue text--truncate"},[_vm._v("\n                    Regular block panel Mauris suscipit pretium lectus.\n                ")])])])],1),_vm._v(" "),_c('boxes'),_vm._v(" "),_c('tabs')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a1b784a8", __vue__options__)
  } else {
    hotAPI.reload("data-v-a1b784a8", __vue__options__)
  }
})()}
},{"./boxes.vue":34,"./tabs.vue":36,"vue":8,"vue-hot-reload-api":6}],36:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'tabs',

    data() {
        return {
            tabs: ['Database', 'Magic', 'Check'],
            activeTab: 'Database',
            activeDarkTab: 'Database',
            activeTabIcons: 'Database'
        };
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('header',{staticClass:"article__title"},[_vm._v("Tabs")]),_vm._v(" "),_c('spec',{attrs:{"name":"Basic tabs","code":".tabs .tabs__item[.tabs__item--active]","source":"tabs.css"}},[_c('div',[_c('menu',{staticClass:"tabs"},_vm._l((_vm.tabs),function(tab){return _c('span',{key:tab,staticClass:"tabs__item",class:{ 'tabs__item--active': tab === _vm.activeTab },on:{"click":function($event){_vm.activeTab = tab}}},[_vm._v("\n                    "+_vm._s(tab)+"\n                ")])}),0),_vm._v(" "),_c('div',{staticClass:"box"},[_c('p',[_c('b',[_vm._v(_vm._s(_vm.activeTab)+" content")]),_vm._v("\n                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet sollicitudin tellus, eget eleifend sapien volutpat sed. Curabitur vestibulum vitae dui et tincidunt. Proin tellus magna, imperdiet nec rutrum id, pulvinar vitae nunc. Quisque eu ligula eleifend, fringilla enim sit amet, porttitor felis.\n                ")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Tabs with icons","code":".tabs .tabs__item[.tabs__item--active]","source":"tabs.css"}},[_c('div',[_c('menu',{staticClass:"tabs"},_vm._l((_vm.tabs),function(tab){return _c('span',{key:tab,staticClass:"tabs__item",class:{ 'tabs__item--active': tab === _vm.activeTabIcons },on:{"click":function($event){_vm.activeTabIcons = tab}}},[_c('i',{class:("tabs__icon fas fa-" + (tab.toLowerCase()))}),_vm._v(" "),_c('span',[_vm._v(_vm._s(tab))])])}),0),_vm._v(" "),_c('div',{staticClass:"box"},[_c('p',[_c('b',[_vm._v(_vm._s(_vm.activeTabIcons)+" content")]),_vm._v("\n                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet sollicitudin tellus, eget eleifend sapien volutpat sed. Curabitur vestibulum vitae dui et tincidunt. Proin tellus magna, imperdiet nec rutrum id, pulvinar vitae nunc. Quisque eu ligula eleifend, fringilla enim sit amet, porttitor felis. Donec nec varius felis, non imperdiet nunc.\n                ")])])])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5e826b94", __vue__options__)
  } else {
    hotAPI.reload("data-v-5e826b94", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],37:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'inputs',

    components: {
        'input-base': require('./input-base.vue'),
        'input-styles': require('./input-styles.vue'),
        'input-groups': require('./input-groups.vue'),
        'input-toggle': require('./input-toggle.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('input-base'),_vm._v(" "),_c('input-styles'),_vm._v(" "),_c('input-toggle'),_vm._v(" "),_c('input-groups')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cc485b7a", __vue__options__)
  } else {
    hotAPI.reload("data-v-cc485b7a", __vue__options__)
  }
})()}
},{"./input-base.vue":39,"./input-groups.vue":40,"./input-styles.vue":41,"./input-toggle.vue":42,"vue":8,"vue-hot-reload-api":6}],38:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'input-base-select'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"grid grid--gap--large",staticStyle:{"grid-template-columns":"auto 1fr 1fr"}},[_c('big',[_c('select',[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])]),_vm._v(" "),_c('select',{attrs:{"disabled":""}},[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_vm._m(0),_vm._v(" "),_vm._m(1)]),_vm._v(" "),_c('small',[_c('select',[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])])],1)}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('optgroup',{attrs:{"label":"Set 1"}},[_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('optgroup',{attrs:{"label":"Set 2"}},[_c('option',{attrs:{"value":"4"}},[_vm._v("Chocolate hobnob")]),_vm._v(" "),_c('option',{attrs:{"value":"5"}},[_vm._v("Garibaldi")]),_vm._v(" "),_c('option',{attrs:{"value":"6"}},[_vm._v("Brandy snap")])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e5d82f34", __vue__options__)
  } else {
    hotAPI.reload("data-v-e5d82f34", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],39:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'input-base',

    components: {
        'base-select': require('./input-base-select.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('header',[_vm._v("Base (pure HTML)")]),_vm._v(" "),_c('spec',{attrs:{"name":"Base input","code":"input, input:disabled, input:readonly","source":"base.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('input',{attrs:{"placeholder":"Placeholder","type":"text"}}),_vm._v(" "),_c('input',{attrs:{"placeholder":"Placeholder","disabled":"","type":"text"}}),_vm._v(" "),_c('input',{attrs:{"placeholder":"Placeholder","readonly":"","type":"text"}}),_vm._v(" "),_c('input',{attrs:{"value":"Value","type":"text"}}),_vm._v(" "),_c('input',{attrs:{"value":"Value","disabled":"","type":"text"}}),_vm._v(" "),_c('input',{attrs:{"value":"Value","readonly":"","type":"text"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Base textarea","code":"textarea, textarea:disabled, textarea:readonly","source":"base.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('textarea',{attrs:{"placeholder":"Placeholder"}}),_vm._v(" "),_c('textarea',{attrs:{"placeholder":"Placeholder","disabled":""}}),_vm._v(" "),_c('textarea',{attrs:{"placeholder":"Placeholder","readonly":""}}),_vm._v(" "),_c('textarea',[_vm._v("Ut non condimentum mauris, eu sodales neque.")]),_vm._v(" "),_c('textarea',{attrs:{"disabled":""}},[_vm._v("Ut non condimentum mauris, eu sodales neque.")]),_vm._v(" "),_c('textarea',{attrs:{"readonly":""}},[_vm._v("Ut non condimentum mauris, eu sodales neque.")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Base text (email, password) input, disabled, readonly","code":"input[type=text|email|password]","source":"base.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('input',{attrs:{"value":"text","type":"text"}}),_vm._v(" "),_c('input',{attrs:{"value":"text","disabled":"","type":"text"}}),_vm._v(" "),_c('input',{attrs:{"value":"text","readonly":"","type":"text"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Base number","code":"input[type=number]","source":"base.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('input',{attrs:{"value":"10","type":"number"}}),_vm._v(" "),_c('input',{attrs:{"value":"10","disabled":"","type":"number"}}),_vm._v(" "),_c('input',{attrs:{"value":"10","readonly":"","type":"number"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Base select","code":"big select\nselect:disabled\nsmall select","source":"base.css"}},[_c('base-select')],1),_vm._v(" "),_c('spec',{attrs:{"name":"Base checkbox (initial, active, disabled)","code":"input[type=checkbox]","source":"base.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('label',[_c('input',{attrs:{"value":"10","type":"checkbox"}}),_vm._v("\n                Initial\n            ")]),_vm._v(" "),_c('label',[_c('input',{attrs:{"value":"10","type":"checkbox","checked":""}}),_vm._v("\n                Active\n            ")]),_vm._v(" "),_c('label',{attrs:{"disabled":""}},[_c('input',{attrs:{"value":"10","disabled":"","type":"checkbox"}}),_vm._v("\n                Disabled\n            ")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Base radio (initial, active, disabled)","code":"input[type=radio]","source":"base.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('label',[_c('input',{attrs:{"value":"10","type":"radio"}}),_vm._v("\n                Initial\n            ")]),_vm._v(" "),_c('label',[_c('input',{attrs:{"value":"10","type":"radio","checked":""}}),_vm._v("\n                Active\n            ")]),_vm._v(" "),_c('label',{attrs:{"disabled":""}},[_c('input',{attrs:{"value":"10","disabled":"","type":"radio"}}),_vm._v("\n                Disabled\n            ")])])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-46368753", __vue__options__)
  } else {
    hotAPI.reload("data-v-46368753", __vue__options__)
  }
})()}
},{"./input-base-select.vue":38,"vue":8,"vue-hot-reload-api":6}],40:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'controls-groups'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('header',[_vm._v("Groups")]),_vm._v(" "),_c('spec',{attrs:{"name":"Labeled input","code":".group.group--gap","source":"group.css"}},[_c('div',{staticClass:"group group--gap"},[_c('label',{attrs:{"for":"input1"}},[_vm._v("Label")]),_vm._v(" "),_c('input',{attrs:{"id":"input1","placeholder":"Placeholder","type":"text"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Labeled input stretched","code":".group.group--gap.stretch","source":"group.css"}},[_c('div',{staticClass:"group group--gap stretch"},[_c('label',{attrs:{"for":"input2"}},[_vm._v("Label")]),_vm._v(" "),_c('input',{attrs:{"id":"input2","placeholder":"Placeholder","type":"text"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Labeled input","code":".grid.box, .grid.box.stretch","source":"grid.css"}},[_c('div',{staticClass:"group stretch group--gap--large"},[_c('div',{staticClass:"grid box box--cool"},[_c('label',{attrs:{"for":"input3"}},[_vm._v("Label")]),_vm._v(" "),_c('input',{attrs:{"id":"input3","placeholder":"Placeholder","type":"text"}})]),_vm._v(" "),_c('div',{staticClass:"grid box stretch"},[_c('label',{attrs:{"for":"input4"}},[_vm._v("Label")]),_vm._v(" "),_c('input',{attrs:{"id":"input4","placeholder":"Placeholder","type":"text"}})])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Icon label","code":".group","source":"group.css"}},[_c('div',{staticClass:"group group--gap stretch"},[_c('div',{staticClass:"box box--mono group stretch"},[_c('label',{staticClass:"icon"},[_c('i',{staticClass:"fa fa-search"})]),_vm._v(" "),_c('input',{attrs:{"type":"text","placeholder":"Search"}})]),_vm._v(" "),_c('div',{staticClass:"box group"},[_c('label',{staticClass:"icon"},[_c('i',{staticClass:"fa fa-search"})]),_vm._v(" "),_c('input',{attrs:{"type":"text","placeholder":"Search"}})])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Icon label stretch","code":".group.stretch","source":"group.css"}},[_c('div',{staticClass:"box box--warm group stretch"},[_c('label',{staticClass:"icon"},[_c('i',{staticClass:"fa fa-search"})]),_vm._v(" "),_c('input',{attrs:{"type":"text","placeholder":"Search"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Icon inside","code":".input.stretch\n    .icon.color--muted\n    input[type=text]","source":"input.css"}},[_c('span',{staticClass:"input stretch"},[_c('span',{staticClass:"icon color--muted"},[_c('i',{staticClass:"fa fa-search"})]),_vm._v(" "),_c('input',{attrs:{"type":"text","placeholder":"key for user@ub.io"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Frameless button inside","code":".button.button--icon frameless","source":"input.css, button.css"}},[_c('div',{staticClass:"group group--gap--large"},[_c('span',{staticClass:"input stretch"},[_c('input',{attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button button--primary button--icon frameless"},[_c('i',{staticClass:"fa fa-sync"})])]),_vm._v(" "),_c('span',{staticClass:"input"},[_c('input',{attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button button--secondary button--icon frameless"},[_c('i',{staticClass:"fa fa-sync"})])]),_vm._v(" "),_c('span',{staticClass:"input"},[_c('input',{attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button button--accent button--icon frameless"},[_c('i',{staticClass:"fa fa-sync"})])]),_vm._v(" "),_c('span',{staticClass:"input"},[_c('input',{attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button button--icon frameless"},[_c('i',{staticClass:"fa fa-sync"})])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Icon inside","code":".input\n    .icon.color--muted\n    input[type=text]","source":"input.css"}},[_c('span',{staticClass:"input"},[_c('span',{staticClass:"icon color--muted"},[_c('i',{staticClass:"fa fa-search"})]),_vm._v(" "),_c('input',{attrs:{"type":"text","placeholder":"key for user@ub.io"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Button aside","code":".group.group--gap--small","source":"input.css, button.css"}},[_c('div',{staticClass:"grid"},[_c('div',{staticClass:"group group--gap--small"},[_c('input',{attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button button--primary"},[_c('i',{staticClass:"icon fa fa-sync"}),_vm._v("\n                    Search\n                ")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Button merged with input","code":".group.group--merged","source":"input.css, button.css"}},[_c('div',{staticClass:"group group--gap--large"},[_c('div',{staticClass:"group group--merged"},[_c('input',{staticClass:"input",attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button button--primary"},[_vm._v("\n                    Search\n                ")])]),_vm._v(" "),_c('div',{staticClass:"group group--merged group--merged--border"},[_c('input',{staticClass:"input",attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button"},[_vm._v("\n                    Search\n                ")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Buttons merged with input","code":".group.group--merged","source":"input.css, button.css"}},[_c('div',{staticClass:"grid"},[_c('div',{staticClass:"group group--merged"},[_c('input',{staticClass:"input",attrs:{"type":"text","placeholder":"key for user@ub.io"}}),_vm._v(" "),_c('button',{staticClass:"button button--icon button--secondary"},[_c('i',{staticClass:"fa fa-cog"})]),_vm._v(" "),_c('button',{staticClass:"button button--icon button--flat button--primary"},[_c('i',{staticClass:"fas fa-mouse-pointer"})])])])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4fe12e56", __vue__options__)
  } else {
    hotAPI.reload("data-v-4fe12e56", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],41:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'input-class'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('header',[_vm._v("Styles")]),_vm._v(" "),_c('spec',{attrs:{"name":".input","code":"input.input input, textarea.input","source":"input.css"}},[_c('div',{staticClass:"block block--rounded grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr"}},[_c('input',{staticClass:"input",attrs:{"type":"text","placeholder":"I'm input"}}),_vm._v(" "),_c('textarea',{staticClass:"input"},[_vm._v("I'm text area")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Sizes","code":".input--small, .input--large","source":"input.css"}},[_c('div',{staticClass:"block block--rounded grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('input',{staticClass:"input input--small",attrs:{"type":"text","placeholder":"I'm small input"}}),_vm._v(" "),_c('input',{staticClass:"input",attrs:{"type":"text","placeholder":"I'm default input"}}),_vm._v(" "),_c('input',{staticClass:"input input--large",attrs:{"type":"text","placeholder":"I'm large input"}})])]),_vm._v(" "),_c('spec',{attrs:{"name":"Text area input","code":".input.input--area\n.input.input--area.input--area--fixed","source":"input.css"}},[_c('div',{staticClass:"group group--gap stretch box box--warm"},[_c('textarea',{staticClass:"input input--area"},[_vm._v("I'm flexible text area")]),_vm._v(" "),_c('textarea',{staticClass:"input input--area input--area--fixed"},[_vm._v("I'm fixed width text area")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Inner text area","code":".input.input--area textarea","source":"input.css"}},[_c('div',{staticClass:"box box--cool stretch"},[_c('div',{staticClass:"input input--area stretch"},[_c('textarea',[_vm._v("I'm text area")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Frameless input","code":".input.frameless input|textarea","source":"input.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('div',[_c('input',{staticClass:"input frameless",attrs:{"type":"text","placeholder":"I'm input"}})]),_vm._v(" "),_c('div',{staticClass:"input frameless"},[_c('textarea',[_vm._v("I'm text area")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":".input--area","code":".input.input--area textarea","source":"input.css"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('div',{staticClass:"input input--area"},[_c('textarea',[_vm._v("I'm text area")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Input-styled dropdowns","code":"select.input.input--large\nselect.input\nselect.input.input--small","source":"input.css"}},[_c('div',{staticClass:"grid grid--gap--large",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('select',{staticClass:"input input--large"},[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])]),_vm._v(" "),_c('select',{staticClass:"input"},[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('optgroup',{attrs:{"label":"Set 1"}},[_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])]),_vm._v(" "),_c('optgroup',{attrs:{"label":"Set 2"}},[_c('option',{attrs:{"value":"4"}},[_vm._v("Chocolate hobnob")]),_vm._v(" "),_c('option',{attrs:{"value":"5"}},[_vm._v("Garibaldi")]),_vm._v(" "),_c('option',{attrs:{"value":"6"}},[_vm._v("Brandy snap")])])]),_vm._v(" "),_c('select',{staticClass:"input input--small"},[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Button-styled dropdowns","code":"select.button.button--large\nselect.button\nselect.button.button--small","source":"button.css"}},[_c('div',{staticClass:"grid grid--gap--large",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('span',[_c('select',{staticClass:"button button--large"},[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])]),_vm._v(" "),_c('span',[_c('select',{staticClass:"button"},[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('optgroup',{attrs:{"label":"Set 1"}},[_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])]),_vm._v(" "),_c('optgroup',{attrs:{"label":"Set 2"}},[_c('option',{attrs:{"value":"4"}},[_vm._v("Chocolate hobnob")]),_vm._v(" "),_c('option',{attrs:{"value":"5"}},[_vm._v("Garibaldi")]),_vm._v(" "),_c('option',{attrs:{"value":"6"}},[_vm._v("Brandy snap")])])])]),_vm._v(" "),_c('span',[_c('select',{staticClass:"button button--small"},[_c('option',{domProps:{"value":undefined}},[_vm._v("Please select an option")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Bourbon")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Custard cream")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Digestive")])])])])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0bc9b664", __vue__options__)
  } else {
    hotAPI.reload("data-v-0bc9b664", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],42:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'input-toggle',

    data() {
        return {
            bool: false
        };
    },

    components: {
        'toggle': require('../../../inbox-components/toggle.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',[_c('header',[_vm._v("Toggle")]),_vm._v(" "),_c('spec',{attrs:{"name":"Toggle vue-component","code":"toggle","source":"toggle.vue"}},[_c('div',{staticClass:"grid grid--gap stretch",staticStyle:{"grid-template-columns":"1fr 1fr 1fr"}},[_c('small',[_c('toggle',{attrs:{"bool":_vm.bool,"label":"Small"},on:{"update":function (val) { return _vm.bool = val; }}})],1),_vm._v(" "),_c('toggle',{attrs:{"bool":_vm.bool,"label":"Regular"},on:{"update":function (val) { return _vm.bool = val; }}}),_vm._v(" "),_c('big',[_c('toggle',{attrs:{"bool":_vm.bool,"label":"Big"},on:{"update":function (val) { return _vm.bool = val; }}})],1)],1)])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-60d56054", __vue__options__)
  } else {
    hotAPI.reload("data-v-60d56054", __vue__options__)
  }
})()}
},{"../../../inbox-components/toggle.vue":52,"vue":8,"vue-hot-reload-api":6}],43:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'loaders',

    components: {
        spinner: require('./spinner.vue'),
        loader: require('./loader.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('article',[_c('spec',{attrs:{"name":"Basic loaders","code":".loader.loader--small\n.loader.color--[name]\n.loader.loader--large.color--[name]","source":"loader.css"}},[_c('div',{staticClass:"stretch grid grid--gap--large",staticStyle:{"grid-template-columns":"1fr 1fr"}},[_c('div',{staticClass:"box box--center box--mono group group--gap--large"},[_c('loader',{staticClass:"loader--small"}),_vm._v(" "),_c('loader',{staticClass:"color--primary"}),_vm._v(" "),_c('loader',{staticClass:"color--secondary"}),_vm._v(" "),_c('loader',{staticClass:"loader--large color--muted"})],1),_vm._v(" "),_c('div',{staticClass:"box box--center group group--gap--large"},[_c('loader',{staticClass:"loader--small"}),_vm._v(" "),_c('loader',{staticClass:"color--primary"}),_vm._v(" "),_c('loader',{staticClass:"color--secondary"}),_vm._v(" "),_c('loader',{staticClass:"loader--large color--muted"})],1)])]),_vm._v(" "),_c('spec',{attrs:{"name":"Spinners","code":".spinner.color--[name]","source":"spinner.css"}},[_c('div',{staticClass:"stretch grid grid--gap--large",staticStyle:{"grid-template-columns":"1fr 1fr"}},[_c('div',{staticClass:"box box--center box--mono group group--gap--large"},[_c('small',[_c('spinner',{staticClass:"color--primary"})],1),_vm._v(" "),_c('spinner',{staticClass:"color--secondary"}),_vm._v(" "),_c('big',[_c('spinner',{staticClass:"color--muted"})],1)],1),_vm._v(" "),_c('div',{staticClass:"box box--center group group--gap--large"},[_c('small',[_c('spinner',{staticClass:"color--primary"})],1),_vm._v(" "),_c('spinner',{staticClass:"color--secondary"}),_vm._v(" "),_c('big',[_c('spinner',{staticClass:"color--muted"})],1)],1)])]),_vm._v(" "),_c('spec',{attrs:{"name":"Progress bar","source":"progress-bar.css","code":".progress-bar\n.progress-bar.progress-bar--large"}},[_c('div',{staticClass:"stretch grid grid--gap",staticStyle:{"grid-template-columns":"repeat(3, 1fr)"}},[_c('div',{staticClass:"progress-bar"},[_c('span',{staticClass:"progress-bar__width",style:("width: 0%")}),_vm._v(" "),_c('span',{staticClass:"progress-bar__counter"},[_vm._v("0%")])]),_vm._v(" "),_c('div',{staticClass:"progress-bar"},[_c('span',{staticClass:"progress-bar__width",style:("width: 50%")}),_vm._v(" "),_c('span',{staticClass:"progress-bar__counter"},[_vm._v("50%")])]),_vm._v(" "),_c('div',{staticClass:"progress-bar"},[_c('span',{staticClass:"progress-bar__width",style:("width: 100%")}),_vm._v(" "),_c('span',{staticClass:"progress-bar__counter"},[_vm._v("100%")])]),_vm._v(" "),_c('div',{staticClass:"progress-bar progress-bar--large"},[_c('span',{staticClass:"progress-bar__width",style:("width: 0%")}),_vm._v(" "),_c('span',{staticClass:"progress-bar__counter"},[_vm._v("0%")])]),_vm._v(" "),_c('div',{staticClass:"progress-bar progress-bar--large"},[_c('span',{staticClass:"progress-bar__width",style:("width: 50%")}),_vm._v(" "),_c('span',{staticClass:"progress-bar__counter"},[_vm._v("50%")])]),_vm._v(" "),_c('div',{staticClass:"progress-bar progress-bar--large"},[_c('span',{staticClass:"progress-bar__width",style:("width: 100%")}),_vm._v(" "),_c('span',{staticClass:"progress-bar__counter"},[_vm._v("100%")])])])])],1)])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3c6a813c", __vue__options__)
  } else {
    hotAPI.reload("data-v-3c6a813c", __vue__options__)
  }
})()}
},{"./loader.vue":44,"./spinner.vue":45,"vue":8,"vue-hot-reload-api":6}],44:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'loader'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"loader no-print",attrs:{"title":"Loading..."}},[_c('span',{staticClass:"loader__rect loader__rect1"}),_vm._v(" "),_c('span',{staticClass:"loader__rect loader__rect2"}),_vm._v(" "),_c('span',{staticClass:"loader__rect loader__rect3"}),_vm._v(" "),_c('span',{staticClass:"loader__rect loader__rect4"}),_vm._v(" "),_c('span',{staticClass:"loader__rect loader__rect5"})])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-38ae1c99", __vue__options__)
  } else {
    hotAPI.reload("data-v-38ae1c99", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],45:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'spinner'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"spinner no-print",attrs:{"title":"Loading...","viewBox":"0 0 25 25","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"cx":"50%","cy":"50%","stroke":"currentColor","stroke-width":"3","fill":"none","stroke-dasharray":"30 18","r":"10.5"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5e15a283", __vue__options__)
  } else {
    hotAPI.reload("data-v-5e15a283", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],46:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'badges'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('article',[_c('spec',{attrs:{"name":"Basic tags","code":".tag","source":"tag.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(6, auto)"}},[_c('small',{staticClass:"tag"},[_c('span',{staticClass:"tag__label"},[_vm._v("Small")]),_vm._v(" "),_c('a',{staticClass:"tag__remover"},[_c('i',{staticClass:"fas fa-times"})])]),_vm._v(" "),_c('span',{staticClass:"tag"},[_c('span',{staticClass:"tag__label"},[_vm._v("Default")]),_vm._v(" "),_c('a',{staticClass:"tag__remover"},[_c('i',{staticClass:"fas fa-times"})])]),_vm._v(" "),_c('big',{staticClass:"tag"},[_c('span',{staticClass:"tag__label"},[_vm._v("Big")]),_vm._v(" "),_c('a',{staticClass:"tag__remover"},[_c('i',{staticClass:"fas fa-times"})])])],1)]),_vm._v(" "),_c('spec',{attrs:{"name":"Tinted","code":".tag.tag--[name]","source":"tag.css"}},[_c('div',{staticClass:"grid grid--gap",staticStyle:{"grid-template-columns":"repeat(9, 1fr)"}},_vm._l((_vm.$root.colors),function(color){return _c('span',{key:color,staticClass:"tag",class:("tag--" + color)},[_c('span',{staticClass:"tag__label"},[_vm._v("Lorem")]),_vm._v(" "),_c('a',{staticClass:"tag__remover"},[_c('i',{staticClass:"fas fa-times"})])])}),0)])],1)])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2dfee1d3", __vue__options__)
  } else {
    hotAPI.reload("data-v-2dfee1d3", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],47:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'typography-base-copy'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Base: Copy styles")]),_vm._v(" "),_c('spec',{attrs:{"name":"Standard paragraph","code":"p","source":"base.css"}},[_c('p',[_vm._v("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare non odio sed lobortis. Mauris in tortor vitae ex venenatis tempus. Donec efficitur eget lectus eget placerat. Ut non condimentum mauris, eu sodales neque. Proin porttitor bibendum ullamcorper. Mauris suscipit pretium lectus, nec pharetra mauris vulputate molestie.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"Inline elements <br />(bolds, italics, links, code, time)","code":"b, strong\ni, em\na\ncode, time\nmark","source":"base.css"}},[_c('p',[_c('b',[_vm._v("Lorem "),_c('strong',[_vm._v("STRONGER TEXT")]),_vm._v(" dolor sit amet")]),_vm._v(", consectetur "),_c('code',[_vm._v("I'm code sample: 1ee37a17-a730-405e-b066")]),_vm._v(" adipiscing elit. Ut ornare non odio sed lobortis. "),_c('i',[_vm._v("Mauris in tortor")]),_vm._v(" vitae ex venenatis tempus. "),_c('em',[_vm._v("Donec efficitur "),_c('a',{attrs:{"href":"#"}},[_vm._v("eget")]),_vm._v(" lectus "),_c('mark',[_vm._v("eget placerat. Ut non condimentum mauris, eu sodales neque")])]),_vm._v(". "),_c('time',[_vm._v("I'm time sample: 11.12.2019")]),_vm._v(" porttitor bibendum ullamcorper. Mauris suscipit pretium lectus, nec "),_c('strong',[_vm._v("pharetra")]),_vm._v(" mauris vulputate molestie.\n    ")])]),_vm._v(" "),_c('spec',{attrs:{"name":"Preformated code","code":"pre","source":"base.css"}},[_c('pre',[_vm._v(_vm._s("curl -X GET \\\nhttps://api.automationcloud.net/services \\\n-H 'authorization: $BASIC_AUTH_HEADER' \\\n-H 'content-type: application/json'")+"\n        ")])]),_vm._v(" "),_c('spec',{attrs:{"name":"Unordered list","code":"ul li","source":"base.css"}},[_c('ul',[_c('li',[_vm._v("Lorem ipsum dolor sit amet")]),_vm._v(" "),_c('li',[_vm._v("Consectetur adipiscing elit")]),_vm._v(" "),_c('li',[_vm._v("Ut ornare non odio sed lobortis")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Ordered list","code":"ol li","source":"base.css"}},[_c('ol',[_c('li',[_vm._v("Lorem ipsum dolor sit amet")]),_vm._v(" "),_c('li',[_vm._v("Consectetur adipiscing elit")]),_vm._v(" "),_c('li',[_vm._v("Ut ornare non odio sed lobortis")])])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a275ba8", __vue__options__)
  } else {
    hotAPI.reload("data-v-2a275ba8", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],48:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'typography-base-headings'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Base: Headings")]),_vm._v(" "),_c('spec',{attrs:{"name":"h1","source":"base.css"}},[_c('h1',[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"h2","source":"base.css"}},[_c('h2',[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"h3","source":"base.css"}},[_c('h3',[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"h4","source":"base.css"}},[_c('h4',[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"h5","source":"base.css"}},[_c('h5',[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"h6","source":"base.css"}},[_c('h6',[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ee92938", __vue__options__)
  } else {
    hotAPI.reload("data-v-4ee92938", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],49:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'typography',

    components: {
        'base-headings': require('./base-headings.vue'),
        'base-copy': require('./base-copy.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('base-headings'),_vm._v(" "),_c('base-copy'),_vm._v(" "),_c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Custom headings")]),_vm._v(" "),_c('spec',{attrs:{"name":"All caps h1","code":"h1.all-caps.color--secondary","source":"typography.css"}},[_c('h1',{staticClass:"all-caps color--secondary"},[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"All caps h2","code":"h2.all-caps.color--secondary","source":"typography.css"}},[_c('h2',{staticClass:"all-caps color--secondary"},[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"All caps h3","code":"h3.all-caps.color--secondary","source":"typography.css"}},[_c('h3',{staticClass:"all-caps color--secondary"},[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"All caps h4","code":"h4.all-caps.color--secondary","source":"typography.css"}},[_c('h4',{staticClass:"all-caps color--secondary"},[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"All caps h5","code":"h5.all-caps.color--secondary","source":"typography.css"}},[_c('h5',{staticClass:"all-caps color--secondary"},[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])]),_vm._v(" "),_c('spec',{attrs:{"name":"All caps h6","code":"h6.all-caps.color--secondary","source":"typography.css"}},[_c('h6',{staticClass:"all-caps color--secondary"},[_vm._v("We are "),_c('strong',[_vm._v("ubio")]),_vm._v(". We automate the web.")])])],1),_vm._v(" "),_c('article',{staticClass:"article"},[_c('header',{staticClass:"article__title"},[_vm._v("Text helpers")]),_vm._v(" "),_c('spec',{attrs:{"name":"Highlight","code":".text--highlight","source":"typography.css"}},[_c('p',[_c('b',{staticClass:"text--highlight"},[_vm._v("Lorem ipsum dolor sit amet")]),_vm._v(", consectetur adipiscing elit. Ut ornare non odio sed lobortis. "),_c('i',[_vm._v("Mauris in tortor")]),_vm._v(" vitae ex venenatis tempus. "),_c('em',{staticClass:"text--highlight"},[_vm._v("Donec efficitur "),_c('a',{attrs:{"href":"#"}},[_vm._v("eget")]),_vm._v(" lectus eget placerat. Ut non condimentum mauris, eu sodales neque")]),_vm._v(". Proin porttitor bibendum ullamcorper. Mauris suscipit pretium lectus, nec "),_c('strong',[_vm._v("pharetra")]),_vm._v(" "),_c('span',{staticClass:"text--highlight"},[_vm._v("mauris vulputate molestie.")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Truncate","code":".text--truncate","source":"typography.css"}},[_c('p',{staticClass:"text--truncate"},[_c('b',[_vm._v("Lorem ipsum dolor sit amet")]),_vm._v(", consectetur adipiscing elit. Ut ornare non odio sed lobortis. "),_c('i',[_vm._v("Mauris in tortor")]),_vm._v(" vitae ex venenatis tempus. Proin porttitor bibendum ullamcorper. Mauris suscipit pretium lectus, nec "),_c('strong',[_vm._v("pharetra")]),_vm._v(" "),_c('span',{staticClass:"text--highlight"},[_vm._v("mauris vulputate molestie.")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"All caps","code":".all-caps","source":"typography.css"}},[_c('p',{staticClass:"all-caps"},[_c('b',[_vm._v("Lorem ipsum dolor sit amet")]),_vm._v(", consectetur adipiscing elit. "),_c('i',[_vm._v("Mauris in tortor")]),_vm._v(" vitae ex venenatis tempus. Mauris suscipit pretium lectus, nec "),_c('strong',[_vm._v("pharetra")])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Monospaced","code":".text--mono","source":"typography.css"}},[_c('p',{staticClass:"text--mono"},[_vm._v("\n                THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG."),_c('br'),_vm._v("\n                The quick brown fox jumped over the lazy dog."),_c('br'),_vm._v("\n                0123456789"),_c('br'),_vm._v("\n                11111.11"),_c('br'),_vm._v("\n                88888.88"),_c('br'),_vm._v("\n                0Oo il1I! Z2z 8$s5S😺‼✏⚠😭⤴⤵")])]),_vm._v(" "),_c('spec',{attrs:{"name":"Code","code":".code","source":"typography.css"}},[_c('div',[_c('p',[_c('strong',[_vm._v("During the lifecycle of a Job its state changes. You poll to get the latest status.")]),_c('br'),_vm._v(" "),_c('code',{staticClass:"code"},[_vm._v("processing")]),_vm._v(",\n                    "),_c('span',{staticClass:"code"},[_vm._v("awaitingInput")]),_vm._v(",\n                    "),_c('code',{staticClass:"code"},[_vm._v("awaitingTds")]),_vm._v(",\n                    "),_c('span',{staticClass:"code"},[_vm._v("success")]),_vm._v(",\n                    "),_c('code',{staticClass:"code"},[_vm._v("fail")])])])]),_vm._v(" "),_c('spec',{attrs:{"name":"Dark preformated code snippet","code":".pre","source":"base.css"}},[_c('div',{staticClass:"pre stretch"},[_vm._v("curl -X GET \\\n    https://api-staging.automationcloud.net/services \\\n    -H 'authorization: $BASIC_AUTH_HEADER' \\\n    -H 'content-type: application/json'")])])],1)],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79496e89", __vue__options__)
  } else {
    hotAPI.reload("data-v-79496e89", __vue__options__)
  }
})()}
},{"./base-copy.vue":47,"./base-headings.vue":48,"vue":8,"vue-hot-reload-api":6}],50:[function(require,module,exports){
;(function(){


module.exports = {
    name: 'snippet',

    props: {
        code: { type: String, required: true },
        source: { type: String, required: true }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"demo__snippet"},[_c('em',{staticClass:"demo__snippet-source"},[_vm._v(_vm._s(_vm.source))]),_vm._v(" "),_c('pre',{staticClass:"demo__snippet-code"},[_vm._v(_vm._s(_vm.code))])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a7fd371a", __vue__options__)
  } else {
    hotAPI.reload("data-v-a7fd371a", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],51:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".spec {\n    display: grid;\n    grid-template-columns: 160px 2fr 1fr;\n    grid-column-gap: 40px;\n    align-items: start;\n    justify-items: start;\n}\n\n.spec__description {\n    color: var(--color-blue--500);\n    line-height: 1.5;\n    margin: .5rem 0;\n}\n\n.spec__hint {\n    word-wrap: break-word;\n    word-break: break-word;\n    white-space: pre-wrap;\n    font-size: var(--font-size--small);\n}\n\n.spec__name {\n    font-weight: 600;\n    grid-gap: var(--gap--small);\n    display: inline-grid;\n    grid-auto-flow: column;\n    align-items: center;\n}")
;(function(){


module.exports = {
    name: 'spec',

    props: {
        name: { type: String, required: true },
        source: { type: String, required: true },
        code: { type: String, required: false, default: '' },
        hint: { type: String, required: false, default: '' }
    },

    components: {
        snippet: require('./snippet.vue')
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"spec"},[_c('div',{staticClass:"spec__description"},[_c('div',{staticClass:"spec__name"},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.name)}}),_vm._v(" "),_vm._t("name")],2),_vm._v(" "),_c('div',{staticClass:"spec__hint",domProps:{"innerHTML":_vm._s(_vm.hint)}})]),_vm._v(" "),_vm._t("default"),_vm._v(" "),_c('snippet',{attrs:{"source":_vm.source,"code":_vm.code || _vm.name}})],2)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-18f33655", __vue__options__)
  } else {
    hotAPI.reload("data-v-18f33655", __vue__options__)
  }
})()}
},{"./snippet.vue":50,"vue":8,"vue-hot-reload-api":6,"vueify/lib/insert-css":10}],52:[function(require,module,exports){
;(function(){


module.exports = {
    props: {
        label: { type: String, required: false, default: '' },
        bool: { type: Boolean, required: true }
    },

    data() {
        return {
            val: this.bool
        };
    },

    watch: {
        bool(value) {
            this.val = value;
        },

        val(value) {
            this.$emit('update', value);
        }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{staticClass:"toggle"},[_c('span',{staticClass:"toggle__toggler"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.val),expression:"val"}],staticClass:"toggle__input",attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.val)?_vm._i(_vm.val,null)>-1:(_vm.val)},on:{"change":function($event){var $$a=_vm.val,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.val=$$a.concat([$$v]))}else{$$i>-1&&(_vm.val=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.val=$$c}}}}),_vm._v(" "),_c('span',{staticClass:"toggle__slider",class:{
                'toggle__slider--on': _vm.bool,
                'toggle__slider--off': !_vm.bool }})]),_vm._v(" "),(_vm.label)?_c('span',{staticClass:"toggle__label"},[_vm._v("\n        "+_vm._s(_vm.label)+"\n    ")]):_vm._e()])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6a75d0d4", __vue__options__)
  } else {
    hotAPI.reload("data-v-6a75d0d4", __vue__options__)
  }
})()}
},{"vue":8,"vue-hot-reload-api":6}],53:[function(require,module,exports){
'use strict';

const Vue = require('vue');
Vue.component('spec', require('./demo/spec.vue'));

const App = Vue.component('app', require('./demo/index.vue'));

new App({
    el: '#app',
    data: {
        colors: ['mono', 'cool', 'warm', 'yellow', 'blue', 'brand-blue', 'red', 'brand-red', 'green'],
        colorsGrey: ['mono', 'cool', 'warm'],
        colorsSemaphore: ['blue', 'yellow', 'red', 'green'],
        colorsBrand: ['brand-blue', 'brand-red'],
        darkMode: false
    }
});

},{"./demo/index.vue":12,"./demo/spec.vue":51,"vue":8}]},{},[53]);
