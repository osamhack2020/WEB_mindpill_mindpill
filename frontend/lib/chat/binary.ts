export interface ByteOrder {
  uint16(arr: Uint8Array): number
  putUint16(arr: Uint8Array, n: number): void
  uint32(arr: Uint8Array): number
  putUint32(arr: Uint8Array, n: number): void
}

export function i64(high: number, low: number) {
  return high * 0x1_0000_0000 + low
}

export function highlow(n: number): { high: number; low: number } {
  const high = Math.floor(n / 0x1_0000_0000)
  const low = n
  return { high, low }
}

const BigEndian: ByteOrder = {
  uint16(arr: Uint8Array): number {
    return arr[1] | (arr[0] << 8)
  },
  putUint16(arr: Uint8Array, n: number) {
    arr[0] = (n >> 8) & 0xff
    arr[1] = n & 0xff
  },
  uint32(arr: Uint8Array): number {
    return arr[3] | (arr[2] << 8) | (arr[1] << 16) | (arr[0] << 24)
  },
  putUint32(arr: Uint8Array, n: number) {
    arr[0] = (n >> 24) & 0xff
    arr[1] = (n >> 16) & 0xff
    arr[2] = (n >> 8) & 0xff
    arr[3] = n & 0xff
  }
}

const LittleEndian: ByteOrder = {
  uint16(arr: Uint8Array): number {
    return arr[0] | (arr[1] << 8)
  },
  putUint16(arr: Uint8Array, n: number) {
    arr[1] = (n >> 8) & 0xff
    arr[0] = n & 0xff
  },
  uint32(arr: Uint8Array): number {
    return arr[0] | (arr[1] << 8) | (arr[2] << 16) | (arr[3] << 24)
  },
  putUint32(arr: Uint8Array, n: number) {
    arr[3] = (n >> 24) & 0xff
    arr[2] = (n >> 16) & 0xff
    arr[1] = (n >> 8) & 0xff
    arr[0] = n & 0xff
  }
}

export { BigEndian, LittleEndian }
