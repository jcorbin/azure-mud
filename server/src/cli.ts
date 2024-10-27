import DB from './redis'
import { resetAllRooms } from './rooms'

// TODO some sorta Yet Another Arg Parsing deal might be useful eventually

const commands = {

  async resetRooms() {
    await resetAllRooms(console.log)
  },

}

async function run(args: string[]) {
  if (!args.length) {
    console.error('possible commands:', Object.keys(commands).sort())
    return
  }

  const [arg, ...rest] = args
  const cmd = commands[arg]
  if (typeof cmd != 'function') {
    console.error(`invalid command ${arg}`)
    console.log('possible commands:', Object.keys(commands).sort())
    return
  }

  await cmd(...rest)
}

async function main(args = process.argv.slice(2)) {
  try {
    await run(args)
  } finally {
    DB.close()
  }
}

main()
