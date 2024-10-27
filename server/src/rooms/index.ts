import json from './data/roomData.json'
import DB from '../redis'

export const staticRoomData: {[name: string]: Room} = json

export interface Room {
  // e.g. "kitchen"
  id: string

  // e.g. "GitHub HQ: Kitchen"
  displayName: string

  // e.g. "the kitchen"
  shortName: string

  description: string

  // If true, webRTC audio/video chat is enabled
  mediaChat?: boolean

  // Indicates whether the room should let users place post-it notes
  // As we add more pieces of one-off functionality,
  // having a bunch of ad-hoc flags like this will probably get frustrating quickly.
  // We may want to eventually refactor to something resembling an ECS.
  hasNoteWall?: boolean
  noteWallData?: NoteWallData

  // If true, don't show the room in the side list
  hidden?: boolean

  // TODO: Put this in JSON schema
  specialFeatures?: string[]
  // 'RAINBOW_DOOR'|'DULL_DOOR'|'FULL_ROOM_INDEX'|'VENDING_MACHINE'

  // The GUID for a corresponding ACS videochat room
  // This should hopefully eventually be auto-generated and mandatory
  // but hand-coding for testing purposes now
  chatGuid?: string

  riddles?: string[]

  // Array of users currently in this room
  users?: string[]

  // text for a modal accessed by clicking a special link in the room description
  specialFeatureText?: string
}

export interface NoteWallData {
  roomWallDescription: string
  noteWallButton: string
  addNoteLinkText: string
  addNotePrompt: string
  noteWallDescription: string
}

export interface MinimalRoom {
  id: string;
  displayName: string;
  shortName: string;
  hidden: boolean;
}

function minimizeRoom (room: Room): MinimalRoom {
  const {
    id,
    displayName,
    shortName,
    hidden = false
  } = room
  return { id, displayName, shortName, hidden }
}

export async function minimalRoomData (): Promise<{[roomId: string]: MinimalRoom}> {
  const roomIds = await DB.getRoomIds()
  const roomData = {};
  (await Promise.all(roomIds.map(DB.getRoomData)))
    .map(minimizeRoom)
    .forEach((r) => {
      roomData[r.id] = r
    })

  return roomData
}

export async function resetAllRooms(
  log: (mess: string, ...extra: any[]) => void = null
) {
  if (log) {
    // when given a log function, the user cares to watch progress, so we do it in serial
    for (const roomId of await DB.getRoomIds()) {
      await DB.deleteRoomData(roomId)
      log(`deleted room #${roomId}`)
    }
    for (const room of Object.values(staticRoomData)) {
      await DB.setRoomData(room)
      const { id, ...info } = minimizeRoom(room)
      log(`loaded room #${id}`, info)
    }
  } else {
    // when going blind, we go with max concurrency
    const roomIds = await DB.getRoomIds()
    await Promise.all(
      roomIds.map(DB.deleteRoomData))
    await Promise.all(
      Object.values(staticRoomData)
        .map(room => DB.setRoomData(room)))
  }
}

export async function resetRoom(
  roomId: string,
  log: (mess: string, ...extra: any[]) => void = null
) {
  const room = staticRoomData[roomId]
  await DB.deleteRoomData(roomId)
  if (log) log(`deleted room #${roomId}`)
  if (room !== undefined) {
    await DB.setRoomData(room)
    if (log) {
      const { id, ...info } = minimizeRoom(room)
      log(`loaded room #${id}`, info)
    }
  }
}
