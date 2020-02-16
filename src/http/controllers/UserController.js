const { Router: ClientRouter } = require("../../");
const { Router } = require("express");
const jwt = require("jsonwebtoken");

const EndPoints = require("../../utils/EndPoints.js");
const authMiddleware = require("../middlewares/needAuthorization.js");

module.exports = class CommandController extends ClientRouter {
  constructor(client) {
    super("users", client);
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
        } = await EndPoints.getToken(code);

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

    router.use(authMiddleware);

    router.get("/@me", async (req, res) => {
      try {
        const { accessToken } = req.userParameters;
        const user = await EndPoints.getUser(accessToken);
        return res.json({ user });
      } catch (e) {
        return res.status(400).json({ error: "Bad request!" });
      }
    });

    router.get("/@me/guilds", async (req, res) => {
      try {
        const { accessToken } = req.userParameters;
        const guilds = await EndPoints.getGuilds(accessToken);
        return res.json({ guilds });
      } catch (e) {
        return res.status(400).json({ error: "Bad request!" });
      }
    });

    return app.use(this.path, router);
  }
};
