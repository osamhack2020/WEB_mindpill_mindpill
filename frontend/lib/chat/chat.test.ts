import { Message } from './message'
import { decode } from './chat'

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
const dummyid = [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01]
const dummytime = 1601191007260n
const dummytimeb = [0x00, 0x00, 0x01, 0x74, 0xce, 0x6b, 0xd4, 0x1c]

test('Decoder#fixstr', () => {
  const expected: Array<Message> = ['Hello, World!']
  const result = decode(Uint8Array.from(helloworld))
  expect(result).toEqual(expected)
})

test('Decoder#str8', () => {
  const expected: Array<Message> = ['Hello, World!']
  const result = decode(Uint8Array.from([0x80, ...helloworld]))
  expect(result).toEqual(expected)
})

test('Decoder#str16', () => {
  const expected: Array<Message> = ['Hello, World!']
  const result = decode(Uint8Array.from([0x81, 0x00, ...helloworld]))
  expect(result).toEqual(expected)
})

test('Decoder#str32', () => {
  const expected: Array<Message> = ['Hello, World!']
  const result = decode(
    Uint8Array.from([0x82, 0x00, 0x00, 0x00, ...helloworld])
  )
  expect(result).toEqual(expected)
})

test('Decoder#image', () => {
  const expected: Array<Message> = [
    {
      type: 'image',
      id: Uint8Array.from(dummyid)
    }
  ]
  const result = decode(Uint8Array.from([0x90, ...dummyid]))
  expect(result).toEqual(expected)
})

test('Decoder#audio', () => {
  const expected: Array<Message> = [
    {
      type: 'audio',
      id: Uint8Array.from(dummyid)
    }
  ]
  const result = decode(Uint8Array.from([0x91, ...dummyid]))
  expect(result).toEqual(expected)
})

test('Decoder#video', () => {
  const expected: Array<Message> = [
    {
      type: 'video',
      id: Uint8Array.from(dummyid)
    }
  ]
  const result = decode(Uint8Array.from([0x92, ...dummyid]))
  expect(result).toEqual(expected)
})

test('Decoder#uid', () => {
  const expected: Array<Message> = [
    {
      type: 'uid',
      id: Uint8Array.from(dummyid)
    }
  ]
  const result = decode(Uint8Array.from([0xe0, ...dummyid]))
  expect(result).toEqual(expected)
})

test('Decoder#timestamp', () => {
  const expected: Array<Message> = [
    {
      type: 'timestamp',
      timestamp: dummytime
    }
  ]
  const result = decode(Uint8Array.from([0xe1, ...dummytimeb]))
  expect(result).toEqual(expected)
})
