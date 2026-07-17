// JX1DX1Num.js - can go up to 10{1.79e308}10 i think????
// inbetween OmegaNum.js and ExpantaNum.js

// prototype 3.1

const x = {arr: [[0n, 123142342]], sign: 1} // -> 123142342
const y = {arr: [[0n, 69421.82], [1n, 1]], sign: -1} // -> -6.60693448008e69421
const z = {arr: [[0n, 913], [1n, 234], [2n, 41], [3n, 1918]], sign: -1} // -(10^^^)*1918 (10^^)*41 (10^)*234 913

function log10BN(n) {
    const firstDigits = Number(n.toString().slice(0, 15));
    const fractionalPart = Math.log10(firstDigits) - Math.floor(Math.log10(firstDigits));

    return n.toString().length - 1 + fractionalPart;
}
function pars(L) {
  const matches = [...L.matchAll(/{(\d+)}(\d+)/g)];

  // Build a map from exponent to value
  const entries = matches.map(([, exp, val]) => [BigInt(exp), Number(val)]);
  const map = new Map(entries);

  if (entries.length === 0) return { sign: 1, arr: [] };

  // Determine min and max exponent
  const exponents = entries.map(([e]) => e);
  const min = exponents.reduce((a, b) => a < b ? a : b);
  const max = exponents.reduce((a, b) => a > b ? a : b);

  // Fill in missing exponents with 0
  const arr = [];
  for (let i = min; i <= max; i++) {
    arr.push([i, map.get(i) ?? 0]);
  }

  return arr
}

class JX1DX1Num {
  constructor(n) {
    if (typeof n == "number") {
      this.sign = n >= 0 ? 1 : -1;
      n = Math.abs(n);
      if (n <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, n]];
      else this.arr = [[0n, Math.log10(n)], [1n, 1]];
      return
    }
    if (typeof n == "bigint") {
      this.sign = n >= 0n ? 1 : -1;
      n = n < 0n ? -n : n;
      if (n <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, Number(n)]];
      else this.arr = [[0n, log10BN(n)], [1n, 1]];
      return
    }
    if (typeof n == "string") {
      if (n[0]=="-") {
        this.sign = -1
        n = n.slice(1)
      } else {this.sign = 1}
      
      let R = n.replace(/\(?(10\^+|10{\d+})(\)\*)?\d*\s/g, "")
      let L = n.replace(/\(?10|\)\*/g,"")
      .replace(/\^\^\^\^/g,"{4}").replace(/\^\^\^/g,"{3}").replace(/\^\^/g,"{2}").replace(/\^/g,"{1}").replace(R,"").replaceAll("} ", "}1") // Damn is
      
      if (R.includes("e")) {
        let X = 0
        while (R[0] == "e"){
          R = R.slice(1)
          X++
        }
        X += (R.match(/e/g)||[]).length
        
        let M = Number(R.slice(0,  R.indexOf("e") == -1 ? 0 : R.indexOf("e")  ))
        M=M==0?1:M
        let E = Number(R.slice(R.indexOf("e")+1))
        if (Number(E) <= 15.954589770191003) {
          if (X <= 1) this.arr = [[0n, 10**(E+Math.log10(M))]]
          else this.arr = [[0n, 10**(E+Math.log10(M))], [1n, X-1]]
        }
        else if (Number(E) <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, E+Math.log10(M)], [1n, X]]
        else this.arr = [[0n, Math.log10(E)], [1n, X+1]]
      } else {
        R = Number(R)
        if (R <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, R]];
        else this.arr = [[0n, Math.log10(R)], [1n, 1]];
      }
      
      if (/\(?(10\^+|10{\d+})(\)\*)?\d*\s/.test(n)) {
        /*
        const entries = [...L.matchAll(/{(\d+)}(\d+)/g)]
          .map(([, a, b]) => [BigInt(a), Number(b)]);
        const map = new Map(entries);
        const key = entries.map(([k]) => k);
        const min = key.reduce((a, b) => a < b ? a : b);
        const max = key.reduce((a, b) => a > b ? a : b);
        const res = [];
        for (let i = min; i <= max; i++) {res.push([i, map.get(i) ?? 0]);}
        this.arr = (this.arr??[]).concat(res)
        */
        this.arr = this.arr.concat(pars(L))
      }
      const ph=new Map();
      for (const[k,v]of this.arr) {
        const x=ph.get(k)||0
        ph.set(k,x+v)
      }
      this.arr=Array.from(ph.entries());
    }
  }
  
  abs() {this.sign = 1}
  neg() {this.sign = -1}
  
  toNumber() {
    if (this.arr.length == 1) return this.arr[0][1]*this.sign
    else return 10**this.arr[0][1]*this.sign
  }
  toString() {
    let res=""
    if (this.arr.length>=1) {
      if (this.arr.length>=2) res += String(Math.floor(this.arr[0][1]))
      else res += String(this.arr[0][1])
    }
    if (this.arr.length>=2) {
      const h = this.arr[0][1]-Math.floor(this.arr[0][1])
      if (this.arr[1][1] > 10) res = `(10^)*${this.arr[1][1]-1} ${10**h}e`+res
      else res = `${"e".repeat(this.arr[1][1]-1)}${10**h}e`+res
    }
    if (this.arr.length>=3) {
      for (let i=2; i<this.arr.length; i++) {
        if (i<5) {
          if (this.arr[i][1] == 0) continue
          if (this.arr[i][1] == 1) res=`10${"^".repeat(i)} `+res
          else res=`(10${"^".repeat(i)})*${this.arr[i][1]} `+res
        } else {
          if (this.arr[i][1] == 0) continue
          if (this.arr[i][1] == 1) res=`10{${i}} `+res
          else res=`(10{${i}})*${this.arr[i][1]} `+res
        }
      }
    }
    return (this.sign==-1?"-":"") + res
  }
  
  isInteger() {if (this.arr.length == 1) return this.arr[0][1] == Math.floor(this.arr[0][1])}
  isPositive() {return this.sign == 1}
  isNegative() {return this.sign == -1}
  
  floor() {if (this.arr.length == 1) this.arr = [[0n, Math.floor(this.arr[0][1])]]}
  ceil() {if (this.arr.length == 1) this.arr = [[0n, Math.ceil(this.arr[0][1])]]}
  round() {if (this.arr.length == 1) this.arr = [[0n, Math.round(this.arr[0][1])]]}
}