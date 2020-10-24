export type OnErrorParam = Pick<CloseEvent, 'code' | 'reason'>

export type OnMessageCallback = (msg: ArrayBuffer) => any
export type OnErrorCallback = (err: OnErrorParam) => any

export interface Driver {
  onmessage: OnMessageCallback
  onerror: OnErrorCallback
  send(buf: ArrayBuffer): void
  close(): void
}

export class WebSocketDriver implements Driver {
  private _sock: WebSocket
  private _callback?: OnMessageCallback
  private _errCallback?: OnErrorCallback

  public get connection(): WebSocket {
    return this._sock
  }

  public get onmessage(): OnMessageCallback {
    return this._emit
  }

  public set onmessage(v: OnMessageCallback) {
    this._callback = v
  }

  public get onerror(): OnErrorCallback {
    return this._emitError
  }

  public set onerror(v: OnErrorCallback) {
    this._errCallback = v
  }

  public static async connect(
    url: string,
    token: string,
    cb?: OnMessageCallback
  ): Promise<WebSocketDriver> {
    return new Promise<WebSocket>((resolve, reject) => {
      const sock = new WebSocket(url)
      sock.onopen = () => {
        resolve(sock)
      }
      sock.onclose = e => {
        if (e.wasClean) {
          reject(new Error('connection to the server was unexpectedly lost'))
        } else {
          reject(new Error(`${e.code} ${e.reason}`))
        }
      }
    })
      .then(sock => {
        sock.send(token)
        return sock
      })
      .then(sock => {
        // clear events
        sock.onopen = null
        sock.onclose = null

        return new WebSocketDriver(sock, cb)
      })
  }

  public constructor(sock: WebSocket, cb?: OnMessageCallback) {
    if (sock.readyState !== WebSocket.OPEN) {
      throw new Error('room connection must be open')
    }

    this._sock = sock
    this._callback = cb

    this._sock.onmessage = this._onSocketMessage.bind(this)
    this._sock.onclose = this._onSocketError.bind(this)

    this._emit = this._emit.bind(this)
  }

  public send(buf: ArrayBuffer) {
    this._sock.send(buf)
  }

  public close() {
    this._sock.close()
  }

  private _emit(msg: ArrayBuffer) {
    if (this._callback == null) {
      return
    }
    this._callback(msg)
  }

  private _emitError(e: OnErrorParam) {
    if (this._errCallback == null) {
      return
    }
    this._errCallback(e)
  }

  private async _onSocketMessage(e: MessageEvent) {
    let data: ArrayBuffer
    if (e.data instanceof ArrayBuffer) {
      data = e.data
    } else if (e.data instanceof Blob) {
      data = await e.data.arrayBuffer()
    } else if (typeof e.data === 'string') {
      data = new TextEncoder().encode(e.data).buffer
    } else {
      throw new Error('unsupported type')
    }
    this._emit(data)
  }

  private _onSocketError(ev: CloseEvent) {
    if (ev.wasClean) {
      return
    }
    this._emitError({
      code: ev.code,
      reason: ev.reason
    })
  }
}
