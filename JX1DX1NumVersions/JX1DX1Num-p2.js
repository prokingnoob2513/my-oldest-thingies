// JX1DX1Num.js - can go up to 10{1.79e308}10 i think????
// inbetween OmegaNum.js and ExpantaNum.js

// prototype 2

const x = {arr: [[0n, 123142342]], sign: 1} // -> 123142342
const y = {arr: [[0n, 69421.82], [1n, 1]], sign: -1} // -> -6.60693448008e69421
const z = {arr: [[0n, 913], [1n, 234], [2n, 41], [3n, 1918]], sign: -1} // -(10^^^)*1918 (10^^)*41 (10^)*234 913

function log10BN(n) {
    const firstDigits = Number(n.toString().slice(0, 15));
    const fractionalPart = Math.log10(firstDigits) - Math.floor(Math.log10(firstDigits));

    return n.toString().length - 1 + fractionalPart;
}

class JX1DX1Num {
  constructor(n) {
    // constructs any type to JX1DX1Num
    
    if (typeof n == "number") {
      this.sign = n > 0 ? 1 : -1
      n = Math.abs(n)
      if (n <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, n]]
      else this.arr = [[0n,Math.log10(n)], [1n,1]]
    }
    if (typeof n == "bigint") {
      this.sign = n > 0 ? 1 : -1
      if (!this.sign) n *= -1n
      if (n <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, Number(n)]]
      else this.arr = [[0n,log10BN(n)], [1n,1]]
    }
    if (typeof n == "string") {
      this.sign = !(n[0]=="-") ? 1 : -1
      if (!this.sign) n = n.slice(1)
      
      if (!n.includes("e")) {
        if (Number(n) <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, Number(n)]]
        else this.arr = [[0n,Math.log10(n)], [1n,1]]
      } else {
        let ee = n.match(/e/g).length
        let n1 = n.includes("e") ? n.slice(0, n.indexOf("e")) : 1
        
        //leading E
        n = n.split('').reverse().join('')
        let p = n.indexOf("e")+1
        n = n.slice(0,n.indexOf("e",p))
        n = n.split('').reverse().join('')
        
        let n2 = Number(n.slice(n.indexOf("e")+1))
        n1 = n1=="" ? 1 : Number(n1)
        if (n2 <= Number.MAX_SAFE_INTEGER) this.arr = [[0n, n2+Math.log10(n1)], [1n, ee]]
        else this.arr = [[0n, Math.log10(n2)], [1n, ee+1]]
      }
    }
    
    if (this.arr.length == 2 && this.arr[0][1] < 15.954589770191003) this.arr = [[0n, 10**this.arr[0][1]], [1n, this.arr[1][1]-1]]
  }
  abs() {this.sign = 1}
  neg() {this.sign = -1}
  
  toNumber() {
    if (this.arr.length == 1) return this.arr[0][1]*this.sign
    else return 10**this.arr[0][1]*this.sign
  }
  toString() {
    let negNeeded = this.sign==-1 ? "-" : ""
    if (this.arr.length == 1) return negNeeded+String(this.arr[0][1])
    if (this.arr.length == 2) return negNeeded+"e".repeat(this.arr[1][1]-1)+String(10**(this.arr[0][1]-Math.floor(this.arr[0][1])))+"e"+String(Math.floor(this.arr[0][1]))
  }
  
  isInteger() {
    if (this.arr.length == 1) return this.arr[0][1] == Math.floor(this.arr[0][1])
  }
  isPositive() {
    return this.sign == 1
  }
  isNegative() {
    return this.sign == -1
  }
  
  floor() {
    if (this.arr.length == 1) this.arr = [[0n, Math.floor(this.arr[0][1])]]
  }
  ceil() {
    if (this.arr.length == 1) this.arr = [[0n, Math.ceil(this.arr[0][1])]]
  }
  round() {
    if (this.arr.length == 1) this.arr = [[0n, Math.round(this.arr[0][1])]]
  }
}


