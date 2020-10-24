import { WebSocketDriver } from './driver'
import { Room } from './room'

export async function joinRoom(roomID: number, token: string): Promise<Room> {
  const proto = window.location.protocol === 'https' ? 'wss' : 'ws'
  const host = window.location.host

  const driver = await WebSocketDriver.connect(
    `${proto}://${host}/api/connect_room?room_id=${roomID}`,
    token
  )
  return new Room(driver)
}
