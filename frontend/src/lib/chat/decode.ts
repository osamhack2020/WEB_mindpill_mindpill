import JSBI from 'jsbi'
import { CursorView } from './cursorview'
import Base64Binary from './base64'

export type MessageToken =
  | string
  | { type: 'image'; id: Uint8Array }
  | { type: 'audio'; id: Uint8Array }
  | { type: 'video'; id: Uint8Array }
  | { type: 'uid'; id: Uint8Array }
  | { type: 'timestamp'; timestamp: JSBI }
  | { type: 'error'; code: number }

export function decodeBase64(str: string) {
  const buf = Base64Binary.decodeArrayBuffer(str)
  const arr = new Uint8Array(buf)
  return decode(arr)
}

export function decode(arr: Uint8Array) {
  const view = new CursorView(arr)

  const result: Array<MessageToken> = []

  let header: number, len: number
  while (view.length > view.cursor) {
    header = view.readUint8()

    // fixstr
    if (header < 0x80) {
      result.push(view.readString(header))
      continue
    }

    // str8
    if (header === 0x80) {
      result.push(view.readString(view.readUint8()))
      continue
    }

    // str16
    if (header === 0x81) {
      result.push(view.readString(view.readUint16()))
      continue
    }

    // str32
    if (header === 0x82) {
      result.push(view.readString(view.readUint32()))
      continue
    }

    // image
    if (header === 0x90) {
      result.push({
        type: 'image',
        id: view.readBinary(8)
      })
      continue
    }

    // audio
    if (header === 0x91) {
      result.push({
        type: 'audio',
        id: view.readBinary(8)
      })
      continue
    }

    // video
    if (header === 0x92) {
      result.push({
        type: 'video',
        id: view.readBinary(8)
      })
      continue
    }

    // uid
    if (header === 0xe0) {
      result.push({
        type: 'uid',
        id: view.readBinary(8)
      })
      continue
    }

    // timestamp
    if (header === 0xe1) {
      result.push({
        type: 'timestamp',
        timestamp: view.readInt64()
      })
      continue
    }

    // error
    if (header === 0xe2) {
      result.push({
        type: 'error',
        code: view.readInt32()
      })
      arr = arr.subarray(5)
      continue
    }

    throw new Error('unknown header')
  }

  return result
}
