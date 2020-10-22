import JSBI from 'jsbi'
import { decode } from './decode'
import { Driver, OnErrorParam } from './driver'
import { TextMessage, ImageMessage, AudioMessage, VideoMessage, UserChangedMessage, TimeChangedMessage } from './message'

export type TextListener = (msg: TextMessage) => void
export type ImageListener = (msg: ImageMessage) => void
export type AudioListener = (msg: AudioMessage) => void
export type VideoListener = (msg: VideoMessage) => void
export type UserChangedListener = (msg: UserChangedMessage) => void
export type TimeChangedListener = (msg: TimeChangedMessage) => void
export type ErrorListener = (e: any) => void

export class Room {
  private _textEvent?: TextListener
  private _imageEvent?: ImageListener
  private _audioEvent?: AudioListener
  private _videoEvent?: VideoListener
  private _userEvent?: UserChangedListener
  private _timeEvent?: TimeChangedListener
  private _errorEvent?: ErrorListener

  private _lastUpdatedTimestamp: JSBI = JSBI.BigInt(0)

  private _driver: Driver

  private constructor(driver: Driver) {
    this._driver = driver

    this._driver.onmessage = this.onMessage.bind(this)
    this._driver.onerror = this.onError.bind(this)
  }

  get ontext() {
    return this._textEvent || (() => {})
  }

  set ontext(fn: TextListener) {
    this._textEvent = fn
  }

  get onimage(): ImageListener {
    return this._imageEvent || (() => {})
  }

  set onimage(fn: ImageListener) {
    this._imageEvent = fn
  }

  get onaudio(): AudioListener {
    return this._audioEvent || (() => {})
  }

  set onaudio(fn: AudioListener) {
    this._audioEvent = fn
  }

  get onvideo(): VideoListener {
    return this._videoEvent || (() => {})
  }

  set onvideo(fn: VideoListener) {
    this._videoEvent = fn
  }

  get onuserchanged(): UserChangedListener {
    return this._userEvent || (() => {})
  }

  set onuserchanged(fn: UserChangedListener) {
    this._userEvent = fn
  }

  get ontimechanged(): TimeChangedListener {
    return this._timeEvent || (() => {})
  }

  set ontimechanged(fn: TimeChangedListener) {
    this._timeEvent = fn
  }

  get onerror(): ErrorListener {
    return this._errorEvent || (() => {})
  }

  set onerror(fn: ErrorListener) {
    this._errorEvent = fn
  }

  private onMessage(msg: ArrayBuffer) {
    const arr = new Uint8Array(msg)
    const tokens = decode(arr)
    tokens.forEach(token => {
      if (typeof token === 'string') {
        this._textEvent?.({ text: token })
      } else if (token.type === 'image') {
        this._imageEvent?.({ imageID: token.id })
      } else if (token.type === 'audio') {
        this._audioEvent?.({ audioID: token.id })
      } else if (token.type === 'video') {
        this._videoEvent?.({ videoID: token.id })
      } else if (token.type === 'uid') {
        this._userEvent?.({ userID: token.id })
      } else if (token.type === 'timestamp') {
        this._timeEvent?.({
          lastTimestamp: this._lastUpdatedTimestamp,
          timestamp: token.timestamp
        })
        this._lastUpdatedTimestamp = token.timestamp
      }
    })
  }

  private onError(err: OnErrorParam) {
    this._errorEvent?.(err)
  }
}
