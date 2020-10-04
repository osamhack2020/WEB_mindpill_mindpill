import { CursorView } from './cursorview'
import JSBI from 'jsbi'

const helloworld = [
  0x0d, // Lenght
  0x48,
  0x65,
  0x6c,
  0x6c,
  0x6f,
  0x2c,
  0x20,
  0x57,
  0x6f,
  0x72,
  0x6c,
  0x64,
  0x21
]
const float32 = 3.14
const float32b = Uint8Array.from([0x40, 0x48, 0xf5, 0xc3])
const float64 = 3.141592
const float64b = Uint8Array.from([
  0x40,
  0x09,
  0x21,
  0xfa,
  0xfc,
  0x8b,
  0x00,
  0x7a
])
const int8 = 3
const int8b = Uint8Array.from([0x03])
const int16 = 3
const int16b = Uint8Array.from([0x00, 0x03])
const int32 = 3
const int32b = Uint8Array.from([0x00, 0x00, 0x00, 0x03])
const int64 = JSBI.BigInt(3)
const int64b = Uint8Array.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03])
const uint8 = 3
const uint8b = Uint8Array.from([0x03])
const uint16 = 3
const uint16b = Uint8Array.from([0x00, 0x03])
const uint32 = 3
const uint32b = Uint8Array.from([0x00, 0x00, 0x00, 0x03])
const uint64 = JSBI.BigInt(3)
const uint64b = Uint8Array.from([
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x03
])

test('CursorView#float32', () => {
  const buf = new Uint8Array(4)
  new CursorView(buf).writeFloat32(float32)
  expect(buf).toEqual(float32b)

  const num = new CursorView(buf).readFloat32()
  expect(num).toBeCloseTo(float32)
})

test('CursorView#float64', () => {
  const buf = new Uint8Array(8)
  new CursorView(buf).writeFloat64(float64)
  expect(buf).toEqual(float64b)

  const num = new CursorView(buf).readFloat64()
  expect(num).toBeCloseTo(float64)
})

test('CursorView#int8', () => {
  const buf = new Uint8Array(1)
  new CursorView(buf).writeInt8(int8)
  expect(buf).toEqual(int8b)

  const num = new CursorView(buf).readInt8()
  expect(num).toEqual(int8)
})

test('CursorView#int16', () => {
  const buf = new Uint8Array(2)
  new CursorView(buf).writeInt16(int16)
  expect(buf).toEqual(int16b)

  const num = new CursorView(buf).readInt16()
  expect(num).toEqual(int16)
})

test('CursorView#int32', () => {
  const buf = new Uint8Array(4)
  new CursorView(buf).writeInt32(int32)
  expect(buf).toEqual(int32b)

  const num = new CursorView(buf).readInt32()
  expect(num).toEqual(int32)
})

test('CursorView#int64', () => {
  const buf = new Uint8Array(8)
  new CursorView(buf).writeInt64(int64)
  expect(buf).toEqual(int64b)

  const num = new CursorView(buf).readInt64()
  expect(num).toEqual(int64)
})

test('CursorView#uint8', () => {
  const buf = new Uint8Array(1)
  new CursorView(buf).writeUint8(uint8)
  expect(buf).toEqual(uint8b)

  const num = new CursorView(buf).readUint8()
  expect(num).toEqual(uint8)
})

test('CursorView#uint16', () => {
  const buf = new Uint8Array(2)
  new CursorView(buf).writeUint16(uint16)
  expect(buf).toEqual(uint16b)

  const num = new CursorView(buf).readUint16()
  expect(num).toEqual(uint16)
})

test('CursorView#uint32', () => {
  const buf = new Uint8Array(4)
  new CursorView(buf).writeUint32(uint32)
  expect(buf).toEqual(uint32b)

  const num = new CursorView(buf).readUint32()
  expect(num).toEqual(uint32)
})

test('CursorView#uint64', () => {
  const buf = new Uint8Array(8)
  new CursorView(buf).writeUint64(uint64)
  expect(buf).toEqual(uint64b)

  const num = new CursorView(buf).readUint64()
  expect(num).toEqual(uint64)
})
