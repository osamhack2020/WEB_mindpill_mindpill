import { WebSocketDriver } from './driver'
import { Room } from './room'

export async function joinRoom(roomID: number, token: string): Promise<Room> {
  const driver = await WebSocketDriver.connect(`/api/connect_room?room_id=${roomID}`, token)
  return new Room(driver)
}
