const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Step 1: Redirect user to GitHub login
router.get("/github", (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=read:user user:email&redirect_uri=${process.env.OAUTH_REDIRECT_URI}`;
  res.redirect(url);
});

// Step 2: GitHub callback → exchange code → create and sign new JWT

router.get("/github/callback", async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange code for GitHub access token
    const tokenResp = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.OAUTH_REDIRECT_URI,
        }),
      }
    );
    const tokenData = await tokenResp.json();
    const ghAccessToken = tokenData.access_token;

    // Fetch GitHub user profile
    const userResp = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${ghAccessToken}` },
    });
    const userData = await userResp.json();

    // Create and sign new JWT with user info
    const payload = {
      userId: userData.id,
      login: userData.login,
      role: "editor", // assign dynamically if needed
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token, user: payload });
  } catch (err) {
    res.status(400).json({ error: "OAuth failed", details: err.message });
  }
});

module.exports = router;
