const FileUtils = require('../src/utils/FileUtils.js')
const MiscUtils = require('../src/utils/MiscUtils.js')

const commands = []

FileUtils.requireDirectory(
  'src/commands',
  ({ required: NewCommand }) => {
    const { parentCommand } = new NewCommand()
    if (typeof parentCommand !== 'string' && !Array.isArray(parentCommand)) { commands.push(NewCommand) }
  },
  console.error
).catch(console.error)

describe('Commands', () => {
  it('should have no duplicate names or aliases', done => {
    const aliases = commands.reduce((arr, NewCommand) => {
      const { name, aliases } = new NewCommand()
      return [...arr, name, ...(aliases || [])]
    }, [])
    const dupes = MiscUtils.findArrayDuplicates(aliases)
    if (dupes.length) {
      done(
        new Error(
          `The following names or aliases were found more than once: ${dupes.join(
            ', '
          )}`
        )
      )
    } else {
      done()
    }
  })

  it('Should have no duplicate class names', done => {
    const classNames = commands.map(c => c.name)
    const dupes = MiscUtils.findArrayDuplicates(classNames)
    if (dupes.length) {
      done(
        new Error(
          `The following class names were found more than once: ${dupes.join(
            ', '
          )}`
        )
      )
    } else {
      done()
    }
  })
})
