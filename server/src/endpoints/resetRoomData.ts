import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { restAllRooms } from '../rooms'
import roomData from '../rooms/data/roomData.json'
import { User } from '../user'

const resetRoomData: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  // TODO: Allow this to just wipe a specific room
  await resetAllRooms()
  return {
    httpResponse: {
      status: 200,
      body: { roomData }
    }
  }
}

export default resetRoomData
