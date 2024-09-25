require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  instagramAppId: process.env.INSTAGRAM_APP_ID,
  instagramAppSecret: process.env.INSTAGRAM_APP_SECRET,
  instagramRedirectUri: process.env.INSTAGRAM_REDIRECT_URI,
};
