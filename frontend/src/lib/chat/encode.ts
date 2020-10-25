import BinaryBuffer from './buffer'
import { Message } from './message'

export function encode(msg: Message): Uint8Array {
  let buf = new BinaryBuffer()

  if ('text' in msg && typeof msg['text'] === 'string') {
    if (msg.text.length < 0x80) {
      buf.append(msg.text.length)
    } else if (msg.text.length <= 0xff) {
      buf.append(0x80)
    } else if (msg.text.length <= 0xffff) {
      buf.append(0x81)
    } else if (msg.text.length <= 0xffffffff) {
      buf.append(0x82)
    }
    buf.append(msg.text)
  } else {
    throw new Error('unsupported message type')
  }
  // else if ('imageID' in msg && msg['imageID'] instanceof Uint8Array) {
  //   buf.append(0x90)
  //   buf.append(msg.imageID)
  // } else if ('audioID' in msg && msg['audioID'] instanceof Uint8Array) {
  //   buf.append(0x90)
  //   buf.append(msg.audioID)
  // } else if ('videoID' in msg && msg['videoID'] instanceof Uint8Array) {
  //   buf.append(0x90)
  //   buf.append(msg.videoID)
  // } else if ('userID' in msg && msg['userID'] instanceof Uint8Array) {
  //   buf.append(0x90)
  //   buf.append(msg.userID)
  // } else if ('timestamp' in msg && msg['timestamp'] instanceof JSBI) {
  //   buf.append(0x90)
  //   if (buf.cap < 16) {
  //     buf.grow(16)
  //   }
  //   const view = new CursorView(buf.raw.slice(buf.length))
  //   view.writeUint64(msg.timestamp)
  //   view.writeUint64(msg.lastTimestamp)
  // } else if ('code' in msg && typeof msg['code'] === 'number') {
  //   buf.append(0x90)
  //   buf.append(msg.code)
  // }

  return buf.data
}
