import { LittleEndian, BigEndian } from './binary'

test('BigEndian', () => {
  const buf = new ArrayBuffer(8)
  const arr = new Uint8Array(buf)

  BigEndian.putUint16(arr, 1)
  expect(arr.subarray(0, 2)).toEqual(Uint8Array.from([0, 1]))
  expect(BigEndian.uint16(arr)).toEqual(1)

  BigEndian.putUint32(arr, 1)
  expect(arr.subarray(0, 4)).toEqual(Uint8Array.from([0, 0, 0, 1]))
  expect(BigEndian.uint32(arr)).toEqual(1)
})

test('LittleEndian', () => {
  const buf = new ArrayBuffer(8)
  const arr = new Uint8Array(buf)

  LittleEndian.putUint16(arr, 1)
  expect(arr.subarray(0, 2)).toEqual(Uint8Array.from([1, 0]))
  expect(LittleEndian.uint16(arr)).toEqual(1)

  LittleEndian.putUint32(arr, 1)
  expect(arr.subarray(0, 4)).toEqual(Uint8Array.from([1, 0, 0, 0]))
  expect(LittleEndian.uint32(arr)).toEqual(1)
})
