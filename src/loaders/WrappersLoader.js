const { FileUtils, Wrapper, Loader } = require("../");

module.exports = class WrappersLoader extends Loader {
  constructor(client) {
    super('WrappersLoader', client)
    this.apis = {}
  }

  async start() {
    this.client.apis = await this.loadApis()
    return true
  }

  loadApis() {
    return FileUtils.requireDirectory(
      'src/apis',
      this.validateApi.bind(this),
      (e, file) => this.client.console(true, (e.stack || e), this.name, file)
    ).then(() => this.apis)
  }

  validateApi({ file, required }) {
    if (required.prototype instanceof Wrapper) {
      const api = new required();

      if (!api.envVars.every(variable => {
        if (!process.env[variable]) this.client.console(
          true, `failed to load - Required environment variable "${variable}" is not set.`,
          this.name, api.name
        )
        return !!process.env[variable]
      })) return false

      this.apis[api.name] = api
      this.client.console(false, 'Wrapper was successfully loaded!', this.name, api.name);
    } else {
      this.client.console(true, 'Not Wrapper!', this.name, file);
    }
  }
}