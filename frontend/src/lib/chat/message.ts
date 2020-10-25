import JSBI from 'jsbi'

export type Message =
  | TextMessage
  | ImageMessage
  | AudioMessage
  | VideoMessage
  | UserChangedMessage
  | TimeChangedMessage
  | ErrorMessage

export interface TextMessage {
  text: string
}

export interface ImageMessage {
  imageID: Uint8Array
}

export interface AudioMessage {
  audioID: Uint8Array
}

export interface VideoMessage {
  videoID: Uint8Array
}

export interface UserChangedMessage {
  userID: Uint8Array
}

export interface TimeChangedMessage {
  lastTimestamp: JSBI
  timestamp: JSBI
}

export interface ErrorMessage {
  code: number
}
