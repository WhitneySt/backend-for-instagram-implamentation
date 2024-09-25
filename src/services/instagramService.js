const axios = require("axios");
const config = require("../config");

class InstagramService {
  async exchangeCodeForToken(code) {
    const formData = new URLSearchParams();
    formData.append("client_id", config.instagramAppId);
    formData.append("client_secret", config.instagramAppSecret);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", config.instagramRedirectUri);
    formData.append("code", code);

    try {
      const response = await axios.post(
        "https://api.instagram.com/oauth/access_token",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Obtén el token de larga duración
      const longLivedToken = await this.getLongLivedToken(
        response.data.access_token
      );
      return longLivedToken;
    } catch (error) {
      console.error(
        "Error in exchangeCodeForToken:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to exchange code for token");
    }
  }

  async getLongLivedToken(shortLivedToken) {
    try {
      const response = await axios.get(
        "https://graph.instagram.com/access_token",
        {
          params: {
            grant_type: "ig_exchange_token",
            client_secret: config.instagramAppSecret,
            access_token: shortLivedToken,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error in getLongLivedToken:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to get long-lived token");
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await axios.get("https://graph.instagram.com/me", {
        params: {
          fields: "id,username,account_type,media_count",
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in getUserInfo:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to get user info");
    }
  }

  async getUserMedia(accessToken) {
    try {
      const response = await axios.get("https://graph.instagram.com/me/media", {
        params: {
          fields:
            "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
          access_token: accessToken,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "Error in getUserMedia:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to get user media");
    }
  }

  async getPublicAccountInfo(accessToken, username) {
    try {
      console.log("accessToken", accessToken);
      // Primero, buscamos la página de Facebook asociada con el nombre de usuario de Instagram
      const searchResponse = await axios.get(
        "https://graph.facebook.com/v20.0/pages/search",
        {
          params: {
            q: username,
            fields: "name,id,instagram_business_account",
            access_token: accessToken,
          },
        }
      );

      const page = searchResponse.data.data.find(
        (p) => p.instagram_business_account
      );

      if (!page) {
        throw new Error(
          "No se encontró una cuenta de Instagram Business para este usuario"
        );
      }

      // Ahora obtenemos la información de la cuenta de Instagram
      const instagramAccountId = page.instagram_business_account.id;
      const accountResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${instagramAccountId}`,
        {
          params: {
            fields:
              "id,username,profile_picture_url,name,biography,follows_count,followers_count,media_count",
            access_token: accessToken,
          },
        }
      );

      return accountResponse.data;
    } catch (error) {
      console.error(
        "Error in getPublicAccountInfo:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to get public account info");
    }
  }

  async getPublicAccountMedia(accessToken, instagramAccountId) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v20.0/${instagramAccountId}/media`,
        {
          params: {
            fields:
              "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
            access_token: accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "Error in getPublicAccountMedia:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to get public account media");
    }
  }
}

module.exports = new InstagramService();
