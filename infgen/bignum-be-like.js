//BigNum be like by prokingnoob2513
//can go up to 1e1e696969, and can go down to 1e(-1e696969) (negative bignums also apply)
//functions: toString, toFloat, toBigNum, fixerrors, sqrt, less, more, equal, lseq, meeq, add, sub, mul, div, nroot, pow, log10, abs, random

//FORMATTING:
//[m, e] - m: mantissa, e: exponent (bigint)
//mantissa MUST be 1 <= m < 10

export function toString(x, dp, n = 0) {
  //converts from BigNum to string along with notations
  //x: [m, e], dp: number, n: number (optional)
  //n=0: scientific
  //n=1: standard (not yet)
  //n=2: logarithmic
  //n=3: YesNo
  const isNeg = x[1] < 0;
  if (String(x[1]).length >= 696970) return isNeg ? "-Infinity" : "Infinity";
  const s = (isNeg ? -x[1] : x[1]).toString();
  const b = s.length + Math.log10("0." + s.substring(0));
  const l = Number(x[1]) + Math.log10(x[0]);
  if (n == 0) {
    if (x[1] < 12 && x[1] > -12) return `${toFloat(x).toFixed(dp)}`;
    if (x[1] < 1e12 && x[1] > -1e12) return `${x[0].toFixed(dp)}e${x[1]}`;
    return `e${10 ** (b - Math.floor(b))}e${Math.floor(b)}`;
  }
  if (n == 1) {
      let lv = Number(x[1] % 3n)
      let s = x[1] / 3n - 1n
      let sh = s
      let sh4 = sh / 1000n <= 2 ? Number(String(sh).substring(0, 4)) : sh
      let max = 0
      while (sh4 >= 1000000) {sh4 /= 1000n}
      
      const sf1 = ["", "U", "D", "T", "Qa", "Qn", "Sx", "Sp", "Oc", "No"]
      const sf2 = ["", "De", "Vg", "Tg", "qg", "Qg", "sg", "Sg", "Og", "Ng"]
      const sf3 = ["", "Ce", "Du", "Tr", "QdC", "QnC", "SxC", "SpC", "OcC", "NoC"]
      const sfM = ["", "Mi ", "Mc ", "Na ", "Pc ", "Fm ", "At ", "Zp ", "Yc ", "Ve "
                  ,"Mec ", "DMec ", "TMec ", "TrMec ", "PMec ", "HMec ", "HpMec ", "OMec ", "EMec "
                  ,"Ics "]
      
      if (s <= 2) return `${(x[0]*10**Number(x[1])).toFixed(dp)}`
      let text
      let sL = []
      while (s >= 1000) {
        sL.push(s%1000n)
        s /= 1000n
      }
      sL.push(s)
      sL.reverse()
      for (let i = sL.length; i > 0; i--) {
        if (sh / 1000n <= 2) sh4 = Number(String(sh).substring(0, 4))
        if (sh4 >= 1000 && sh4 < 2000) text += `${sfM[i-1]}`
        else text += `${sf1[sL[0]%10n]}${sf2[(sL[0]/10n)%10n]}${sf3[(sL[0]/100n)%10n]}${sfM[i-1]}`
        
        sL.shift()
        sh /= 1000n
      }
      return `${(x[0]*10**lv).toFixed(dp)}${text}`.replace(/undefined/i, '')
  }
  if (n == 2) {
    if (x[1] < 1e12 && x[1] > -1e12)
      return isNeg ? `e-${l.toFixed(dp)}` : `e${l.toFixed(dp)}`;
    return isNeg ? `e(-e${b.toFixed(dp)})` : `ee${b.toFixed(dp)}`;
  }
  if (n == 3) return x[0] <= 0 ? "No" : "Yes";
  return "[GLITCH DETECTED]: notation out of range";
}

export function toFloat(x) {
  //converts from BigNum to float
  //x: [m, e]
  if (x[1] >= 308)
    if (x[0] >= (x[1] == 308 ? 1.797693134862315907729 : 1)) {
      const isNeg = x[0] < 0;
      return isNeg ? -1.7976931348623157e308 : 1.7976931348623157e308;
    }
  return x[0] * 10 ** Number(x[1]);
}

export function toBigNum(x) {
  if (typeof x === "number") {
    let isNeg = x < 0;
    let xe = 0n;
    if (x === 0) return [0, 0n];
    if (x === Infinity) return [1.797693134862315907729, 308n];
    if (x === -Infinity) return [-1.797693134862315907729, 308n];
    x = Math.abs(x);
    while (x < 1) {
      x *= 10;
      xe -= 1n;
    }
    while (x >= 10) {
      x /= 10;
      xe += 1n;
    }
    return isNeg ? [-x, xe] : [x, xe];
  } else if (typeof x === "string") {
    x = x.split(/e/i);
    if (x.length == 1) return toBigNum(Number(x[0]));
    if (x.length == 2) {
      if (x[0] == "") x[0] = "1";
      return [Number(x[0]), BigInt(x[1])];
    }
    if (x.length == 3) {
      if (Number(x[2]) >= 696969) x[2] = "696969"
      if (x[0] == "") x[0] = "1";
      if (x[1] == "") x[1] = "1";
      const d = x[1].substring(2);
      return [Number(x[0]), BigInt(x[1][0] + d) * 10n ** BigInt(x[2] - d.length)];
    }
  } else if (typeof x === "bigint") {
    if (x < 2n ** 1024n) return toBigNum(Number(x));
    const s = x.toString(10);
    const b = s.length + Math.log10("0." + s.substring(0, 15));

    return [10 ** (b - Math.floor(b)), BigInt(Math.floor(b))];
  }
}

export function fixerrors(x) {
  //fixes errors. without it, BigNum wouldnt be possible
  //x: [m, e]
  const isNeg = x[0] < 0;
  if (x[0] == 0) return [0, 0n];
  if (String(x[1]).length >= 696970) {
    if (x[1] < 0) return isNeg ? [-1, -(10n ** 696969n)] : [1, -(10n ** 696969n)];
    return isNeg ? [-1, 10n ** 696969n] : [1, 10n ** 696969n];
  }
  while (x[0] >= 10 || (x[0] < 0 && x[0] >= 10)) {
    x[0] /= 10;
    x[1] += 1n;
  }
  while ((x[0] < 1 && x[0] > 0) || (x[0] < 0 && x[0] > -1)) {
    x[0] *= 10;
    x[1] -= 1n;
  }
  return x;
}

export function less(a, b) {
  //compares a<b in BigNum format
  //a, b: [m, e]
  return a[1] < b[1] || (a[1] == b[1] && a[0] < b[0]) || a[0] < 0;
}
export function equal(a, b) {
  //compares a==b in BigNum format
  //a, b: [m, e]
  return !less(a, b) && !more(a, b);
}
export function more(a, b) {
  //compares a>b in BigNum format
  //a, b: [m, e]
  return a[1] > b[1] || (a[1] == b[1] && a[0] > b[0]) || b[0] < 0;
}
export function lseq(a, b) {
  //compares a<=b in BigNum format
  //a, b: [m, e]
  return less(a, b) || equal(a, b);
}
export function meeq(a, b) {
  //compares a>=b in BigNum format
  //a, b: [m, e]
  return more(a, b) || equal(a, b);
}

export function add(a, b) {
  //calculates a+b in BigNum format
  //a, b: [m, e]
  let aCopy = [...a];
  let bCopy = [...b];
  if (a[1] - b[1] >= 20) return a
  if (b[1] - a[1] >= 20) return b
  if (less(a, b)) {
    aCopy[0] /= Number(10n ** (bCopy[1] - aCopy[1]));
    aCopy[1] = bCopy[1];
  } else {
    bCopy[0] /= Number(10n ** (aCopy[1] - bCopy[1]));
    bCopy[1] = aCopy[1];
  }
  aCopy[0] += bCopy[0];
  return fixerrors(aCopy);
}

export function sub(a, b) {
  //calculates a-b in BigNum format
  //a, b: [m, e]
  let aCopy = [...a];
  let bCopy = [...b];
  if (equal(a, b)) return [0, 0n];
  if (a[1] - b[1] >= 20) return a
  if (b[1] - a[1] >= 20) return [-b[0], b[1]]
  if (abs(aCopy[1] - bCopy[1]) > 308) {
    if (aCopy[1] > bCopy[1]) {
      return aCopy;
    } else {
      bCopy[0] = -bCopy[0];
      return fixerrors(bCopy);
    }
  }
  if (aCopy[1] < bCopy[1]) {
    aCopy[0] /= Number(10n ** (bCopy[1] - aCopy[1]));
    aCopy[1] = bCopy[1];
  } else if (aCopy[1] > bCopy[1]) {
    bCopy[0] /= Number(10n ** (aCopy[1] - bCopy[1]));
    bCopy[1] = aCopy[1];
  }
  aCopy[0] -= bCopy[0];
  return fixerrors(aCopy);
}

export function mul(a, b) {
  //calculates a*b in BigNum format
  //a, b: [m, e]
  a = fixerrors(a);
  b = fixerrors(b);
  if (equal(a, [0, 0n]) || equal(b, [0, 0n])) return [0, 0n];
  let result = [...a];
  result[0] *= b[0];
  result[1] += b[1];
  return fixerrors(result);
}

export function div(a, b) {
  //calculates a/b in BigNum format
  //a, b: [m, e]
  if (equal(a, [0, 0n]) || equal(b, [0, 0n])) return [0, 0n];
  // 5/0 = 0 just in case
  let result = [...a];
  result[0] /= b[0];
  result[1] -= b[1];
  return fixerrors(result);
}

export function pow(a, b) {
  //calculates a^b in BigNum format
  //a, b: [m, e]
  let result = [...a];
  if (a[0] == 0) return [0, 0n];
  if (b[0] == 0) return [1, 0n];
  let power = toFloat(b) * toFloat(log10(a));
  let resultExponent = Math.floor(power);
  let resultMantissa = 10 ** (power - resultExponent);
  result = [resultMantissa, BigInt(resultExponent)];
  return fixerrors(result);
}

export function sqrt(x) {
  //calculates sqrt(x) in BigNum format
  //x: [m, e]
  if (less(x, [0, 0n])) {
    console.log("imaginary numbers suck 👎");
    return [9.999999999999999, -2147483647n];
  }
  if (equal(x, [0, 0n])) return [0, 0n];
  x = fixerrors(x);
  if (x[1] % 2n == 1) {
    x[0] *= 10;
    x[1] -= 1n;
  }
  x[0] = x[0] ** 0.5;
  x[1] /= 2n;
  return fixerrors(x);
}

export function nroot(x, r) {
  //calculates r-th root of x in BigNum format
  //x, r: [m, e]
  return pow(x, div([1, 0n], r));
}

export function log10(x) {
  //calculates log10(x) in BigNum format
  //x: [m, e]
  const s = x[0].toString();
  return toBigNum(Number(x[1]) + Math.log10(s.substring(0, 15)));
}

export function abs(x) {
  //calculates absolute number of x in BigNum format
  //x: [m, e]
  if (x[0] < 0) return [-x[0], x[1]];
  return [x[0], x[1]];
}

export function random(a, b) {
  //returns a random BigNum between bnum1 and bnum2
  //a, b: [m, e]
  return add(mul(toBigNum(Math.random()), sub(a, b)), b);
}
