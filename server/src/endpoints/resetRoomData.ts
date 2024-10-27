import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { resetRoom, resetAllRooms } from '../rooms'
import roomData from '../rooms/data/roomData.json'
import { User } from '../user'

const resetRoomData: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  if (inputs.roomId) {
    const { roomId } = inputs // TODO typeof ?== 'string'
    await resetRoom(roomId)
    return {
      httpResponse: {
        status: 200,
        body: {
          roomData: roomData[roomId]
        }
      }
    }
  } else {
    await resetAllRooms()
    return {
      httpResponse: {
        status: 200,
        body: { roomData }
      }
    }
  }
}

export default resetRoomData
