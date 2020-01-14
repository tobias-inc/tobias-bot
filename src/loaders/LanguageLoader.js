const { Loader } = require("../");
const { readdirSync } = require("fs");

const i18next = require("i18next");
const translationBackend = require("i18next-node-fs-backend");

module.exports = class ClientLanguage extends Loader {
  constructor(client) {
    super('LanguageLoader', client)
    this.critical = true

    this.language = { i18next, rootDir: 'pt-BR', langs: [], files: [] }

    Object.defineProperty(this.language, 'lang', {
      value: (l = 'pt-BR') => i18next.getFixedT(l)
    })

    Object.defineProperty(this.language, 'reset', {
      value: async (dir) => this.client.language = await this.loadLanguage(dir)
    })
  }

  async start() {
    this.client.language = await this.loadLanguage();
    return true
  }

  async loadLanguage(dirPath = 'src/locales') {
    this.language.files.push(...readdirSync(`${dirPath}/${this.language.rootDir}`));
    return i18next
      .use(translationBackend)
      .init({
        ns: ['commands', 'errors', 'permissions', 'commons', 'categories', 'regions'],
        preload: await readdirSync(dirPath),
        fallbackLng: this.language.rootDir,
        backend: {
          loadPath: `${dirPath}/{{lng}}/{{ns}}.json`
        },
        interpolation: {
          escapeValue: false
        },
        returnEmptyString: false
      })
      .then(() => this.setLangCodes(Object.keys(i18next.store.data)));
  }

  setLangCodes(langs, dirPath = 'src/locales/') {
    const push = (name) => {
      let aliases = [name.toLowerCase().trim()];
      if (name.includes('-')) aliases.push(name.replace(/-/g, '').toLowerCase().trim());

      return this.language.langs.push({
        name: (t) => typeof t === 'function' ? t(`regions:replaces.${name}`) : name,
        type: name.toLowerCase().trim(),
        aliases
      })
    }

    langs.forEach(async (lang) => {
      const requireFiles = this.language.files;
      const path = await readdirSync(dirPath + lang);

      let trueFiles = 0;
      if (path.length === requireFiles.length) {
        for (let i = 0; i < path.length; i++) if (path[i] === requireFiles[i])++trueFiles;
        if (trueFiles === requireFiles.length) push(lang);
      }
    })

    return this.language
  }
}