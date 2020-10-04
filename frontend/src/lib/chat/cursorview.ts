import 'fast-text-encoding'
import JSBI from 'jsbi'

export class CursorView {
  private readonly _arr: Uint8Array
  private readonly _view: DataView
  private readonly _textEncoder: TextEncoder
  private readonly _textDecoder: TextDecoder

  public cursor: number

  constructor(arr: Uint8Array) {
    this._arr = arr
    this._view = new DataView(arr.buffer)
    this._textEncoder = new TextEncoder()
    this._textDecoder = new TextDecoder()
    this.cursor = 0
  }

  get length() {
    return this._arr.length
  }

  readFloat32(): number {
    const buf = this._view.getFloat32(this.cursor)
    this.cursor += 4
    return buf
  }

  readFloat64(): number {
    const buf = this._view.getFloat64(this.cursor)
    this.cursor += 8
    return buf
  }

  readInt8(): number {
    return this._view.getInt8(this.cursor++)
  }

  readInt16(): number {
    const buf = this._view.getInt16(this.cursor)
    this.cursor += 2
    return buf
  }

  readInt32(): number {
    const buf = this._view.getInt32(this.cursor)
    this.cursor += 4
    return buf
  }

  readInt64(): JSBI {
    const high = JSBI.BigInt(this._view.getInt32(this.cursor))
    const low = JSBI.BigInt(this._view.getUint32(this.cursor + 4))
    this.cursor += 8
    return JSBI.add(JSBI.leftShift(high, JSBI.BigInt(32)), low)
  }

  readUint8(): number {
    return this._arr[this.cursor++]
  }

  readUint16(): number {
    const buf = this._view.getUint16(this.cursor)
    this.cursor += 2
    return buf
  }

  readUint32(): number {
    const buf = this._view.getUint32(this.cursor)
    this.cursor += 4
    return buf
  }

  readUint64(): JSBI {
    const high = JSBI.BigInt(this._view.getUint32(this.cursor))
    const low = JSBI.BigInt(this._view.getUint32(this.cursor + 4))
    this.cursor += 8
    return JSBI.add(JSBI.leftShift(high, JSBI.BigInt(32)), low)
  }

  writeFloat32(value: number): void {
    this._view.setFloat32(this.cursor, value)
    this.cursor += 4
  }

  writeFloat64(value: number): void {
    this._view.setFloat64(this.cursor, value)
    this.cursor += 8
  }

  writeInt8(value: number): void {
    this._view.setInt8(this.cursor, value)
    this.cursor++
  }

  writeInt16(value: number): void {
    this._view.setInt16(this.cursor, value)
    this.cursor += 2
  }

  writeInt32(value: number): void {
    this._view.setInt32(this.cursor, value)
    this.cursor += 4
  }

  writeInt64(value: JSBI): void {
    const high = JSBI.toNumber(JSBI.signedRightShift(value, JSBI.BigInt(32)))
    const low = JSBI.toNumber(JSBI.bitwiseAnd(value, JSBI.BigInt(0xffff_ffff)))
    this.writeInt32(high)
    this.writeUint32(low)
  }

  writeUint8(value: number): void {
    this._view.setUint8(this.cursor, value)
    this.cursor++
  }

  writeUint16(value: number): void {
    this._view.setUint16(this.cursor, value)
    this.cursor += 2
  }

  writeUint32(value: number): void {
    this._view.setUint32(this.cursor, value)
    this.cursor += 4
  }

  writeUint64(value: JSBI): void {
    const high = JSBI.toNumber(JSBI.signedRightShift(value, JSBI.BigInt(32)))
    const low = JSBI.toNumber(JSBI.bitwiseAnd(value, JSBI.BigInt(0xffff_ffff)))
    this.writeUint32(high)
    this.writeUint32(low)
  }

  readString(len: number) {
    const buf = this._textDecoder.decode(
      this._arr.subarray(this.cursor, this.cursor + len)
    )
    this.cursor += len
    return buf
  }

  writeString(input: string) {
    const str = this._textEncoder.encode(input)
    this.writeBinary(str)
  }

  readBinary(len: number) {
    const buf = this._arr.slice(this.cursor, this.cursor + len)
    this.cursor += len
    return buf
  }

  writeBinary(arr: Uint8Array) {
    const len = arr.length
    this._arr.subarray(this.cursor, this.cursor + len).map((_, i) => arr[i])
    this.cursor += len
  }
}
