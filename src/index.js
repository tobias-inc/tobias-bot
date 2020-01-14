const commandStructures = require("./structures/command");

module.exports = {
  // Command Structures

  Command: commandStructures.Command,
  CommandError: commandStructures.CommandError,
  CommandContext: commandStructures.CommandContext,

  // Structures

  Controller: require("./structures/Controller.js"),
  Loader: require("./structures/Loader.js"),
  Module: require("./structures/Module.js"),
  Listener: require("./structures/Listener.js"),
  ClientEmbed: require("./structures/ClientEmbed.js"),

  // Utils 

  Utils: require("./utils"),
  Queue: require("./utils/Queue.js"),
  Constants: require("./utils/Constants.js"),
  FileUtils: require("./utils/FileUtils.js"),
  Prototype: require("./utils/Prototype.js"),

  // Canvas

  CanvasUtils: require("./utils/canvas/CanvasUtils.js"),
  CanvasTemplates: require("./utils/canvas/CanvasTemplates.js")
}