export type OnErrorParam = Pick<
  CloseEvent,
  'code' | 'reason'
>

export type OnMessageCallback = (msg: ArrayBuffer) => any
export type OnErrorCallback = (err: OnErrorParam) => any
export type OnCloseCallback = (e: CloseEvent) => any

export interface Driver {
  onmessage: OnMessageCallback
  onerror: OnErrorCallback
  onclose: OnCloseCallback
  send(buf: ArrayBuffer): void
  close(code?: number, reason?: string): void
}

export class WebSocketDriver implements Driver {
  private _sock: WebSocket
  private _callback?: OnMessageCallback
  private _errCallback?: OnErrorCallback
  private _closeCallback?: OnCloseCallback

  public get connection(): WebSocket {
    return this._sock
  }

  public get onmessage(): OnMessageCallback {
    return this._callback || (() => {})
  }

  public set onmessage(v: OnMessageCallback) {
    this._callback = v
  }

  public get onerror(): OnErrorCallback {
    return this._errCallback || (() => {})
  }

  public set onerror(v: OnErrorCallback) {
    this._errCallback = v
  }

  public get onclose(): OnCloseCallback {
    return this._closeCallback || (() => {})
  }

  public set onclose(v: OnCloseCallback) {
    this._closeCallback = v
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
          reject(
            new Error(
              'connection to the server was unexpectedly lost'
            )
          )
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

  public constructor(
    sock: WebSocket,
    cb?: OnMessageCallback
  ) {
    if (sock.readyState !== WebSocket.OPEN) {
      throw new Error('room connection must be open')
    }

    this._sock = sock
    this._callback = cb

    this._sock.onmessage = this._onSocketMessage.bind(this)
    this._sock.onclose = this._onSocketError.bind(this)
  }

  public send(buf: ArrayBuffer) {
    this._sock.send(buf)
  }

  public close(code?: number, reason?: string) {
    this._sock.close(code, reason)
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
    this.onmessage(data)
  }

  private _onSocketError(ev: CloseEvent) {
    this.onclose(ev)
    if (ev.wasClean) {
      return
    }
    this.onerror({
      code: ev.code,
      reason: ev.reason
    })
  }
}
