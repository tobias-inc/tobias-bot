const { Router: ClientRouter } = require("../../");
const { Router } = require("express");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const API_URL = "https://discordapp.com/api";

module.exports = class CommandController extends ClientRouter {
  constructor(client) {
    super("user", client);
  }

  register(app) {
    const router = Router();

    router.get("/auth", async (req, res) => {
      const { code } = req.query;
      if (!code) return res.status(400).json({ error: "No code provided!" });

      try {
        const {
          access_token: accessToken,
          expires_in: expiresIn,
          refresh_token: refreshToken,
          token_type: tokenType
        } = await this.getToken(code);

        return res.json({
          token: jwt.sign(
            {
              accessToken,
              refreshToken,
              expiresIn,
              tokenType
            },
            process.env.JWT_SECRET
          )
        });
      } catch (e) {
        return res.status(400).json({ error: "Invalid code!" });
      }
    });

    return app.use(this.path, router);
  }

  getToken(code, scope = "identify guilds") {
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
};
