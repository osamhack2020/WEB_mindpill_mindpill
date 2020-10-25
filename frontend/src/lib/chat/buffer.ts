export default class BinaryBuffer {
  private _arr: Uint8Array
  private _len: number

  constructor(arr?: Uint8Array) {
    this._arr = arr == null ? new Uint8Array(1024) : arr
    this._len = arr == null ? 0 : arr.length
  }

  static of(...items: number[]): BinaryBuffer {
    return new BinaryBuffer(Uint8Array.of(...items))
  }

  grow(n: number) {
    const narr = new Uint8Array(this._arr.length * 2 + n)
    narr.set(this._arr)
    this._arr = narr
  }

  append(buf: BinaryBuffer | Uint8Array | string | number) {
    if (buf instanceof BinaryBuffer) {
      if (this.cap < buf._len) {
        this.grow(buf._len - this.cap)
      }
      this._arr.set(buf._arr, this._len)
      this._len += buf._arr.length
    } else if (buf instanceof Uint8Array) {
      if (this.cap < buf.length) {
        this.grow(buf.length)
      }
      this._arr.set(buf, this._len)
      this._len += buf.length
    } else if (typeof buf === 'string') {
      const enc = new TextEncoder()
      this.append(enc.encode(buf))
    } else if (typeof buf === 'number') {
      if (this.cap === 0) {
        this.grow(1)
      }
      this._arr.set([buf], this._len)
      this._len++
    }
  }

  get data() {
    return this._arr.slice(0, this._len)
  }

  get raw() {
    return this._arr
  }

  get length() {
    return this._len
  }

  get cap() {
    return this._arr.length - this._len
  }
}
