const fetch = require("node-fetch");

const API_URL = "https://discordapp.com/api";

module.exports = class EndPoints {
  static getUser(accessToken) {
    return this.request("/users/@me", accessToken);
  }

  static getGuilds(client, accessToken) {
    return this.request("/users/@me/guilds", accessToken).then(gs =>
      gs.map(g => {
        g.common = client.guilds.has(g.id);
        return g;
      })
    );
  }

  static getToken(code, scope = "identify guilds") {
    const config = {
      grant_type: "authorization_code",
      client_id: process.env.DISCORD_ID,
      client_secret: process.env.DISCORD_SECRET,
      redirect_uri: process.env.DISCORD_REDIRECT,
      scope,
      code
    };

    return fetch(`${API_URL}/oauth2/token`, {
      method: "POST",
      body: new URLSearchParams(config)
    }).then(res => (res.ok ? res.json() : Promise.reject(res)));
  }

  static request(endpoint, token) {
    return fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => (res.ok ? res.json() : Promise.reject(res)));
  }
};
