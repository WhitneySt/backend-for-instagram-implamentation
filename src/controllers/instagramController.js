const instagramService = require("../services/instagramService");

class InstagramController {
  async exchangeCodeForToken(req, res) {
    try {
      const { code } = req.body;
      const tokenData = await instagramService.exchangeCodeForToken(code);
      res.json({ access_token: tokenData });
    } catch (error) {
      console.error("Controller error:", error);
      res.status(500).json({ error: "Error al obtener el token de acceso" });
    }
  }

  async getUserInfo(req, res) {
    try {
      const { accessToken } = req.body;
      const userInfo = await instagramService.getUserInfo(accessToken);
      res.json(userInfo);
    } catch (error) {
      console.error("Controller error:", error);
      res
        .status(500)
        .json({ error: "Error al obtener la información del usuario" });
    }
  }

  async getUserMedia(req, res) {
    try {
      const { accessToken } = req.body;
      const userMedia = await instagramService.getUserMedia(accessToken);
      res.json(userMedia);
    } catch (error) {
      console.error("Controller error:", error);
      res
        .status(500)
        .json({ error: "Error al obtener los medios del usuario" });
    }
  }

  async getPublicAccountInfo(req, res) {
    try {
      const { accessToken, username } = req.body;
      const accountInfo = await instagramService.getPublicAccountInfo(
        accessToken,
        username
      );
      res.json(accountInfo);
    } catch (error) {
      console.error("Controller error:", error);
      res
        .status(500)
        .json({
          error: "Error al obtener la información de la cuenta pública",
        });
    }
  }

  async getPublicAccountMedia(req, res) {
    try {
      const { accessToken, instagramAccountId } = req.body;
      const accountMedia = await instagramService.getPublicAccountMedia(
        accessToken,
        instagramAccountId
      );
      res.json(accountMedia);
    } catch (error) {
      console.error("Controller error:", error);
      res
        .status(500)
        .json({ error: "Error al obtener los medios de la cuenta pública" });
    }
  }
}

module.exports = new InstagramController();
