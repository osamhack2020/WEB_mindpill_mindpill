import JSBI from 'jsbi'

export type Message =
  | string
  | { type: 'image' | 'audio' | 'video'; id: Uint8Array }
  | { type: 'uid'; id: Uint8Array }
  | { type: 'timestamp'; timestamp: JSBI }
  | { type: 'error'; code: number }
