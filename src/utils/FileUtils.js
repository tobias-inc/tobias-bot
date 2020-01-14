const { promisify } = require("util");
const path = require("path");
const fs = require("fs");

module.exports = class FileUtils {
  static async requireDirectory(dirPath, call, error, recursive = true) {
    const files = await FileUtils.readdir(dirPath);
    const filesObject = {}

    return Promise.all(files.map(async file => {
      const fullPath = path.resolve(dirPath, file)

      if (file.match(/\.(js|json)$/)) {
        try {
          const required = require(fullPath);
          filesObject[file] = required;

          if (call) call({
            file: file.replace(/\.(js|json)$/, ''),
            required,
            fullPath
          });
          return required
        } catch (e) {
          error && error(e, file.replace(/\.(js|json)$/, ''))
        }
      } else if (recursive) {
        const isDirectory = await FileUtils.stat(fullPath).then(f => f.isDirectory())
        if (isDirectory) {
          return FileUtils.requireDirectory(fullPath, call, error)
        }
      }
    })).then(() => filesObject).catch(console.error)
  }
}

module.exports.readdir = promisify(fs.readdir);
module.exports.readFile = promisify(fs.readFile);
module.exports.stat = promisify(fs.stat);