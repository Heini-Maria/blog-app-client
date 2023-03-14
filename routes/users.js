const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/authMiddleware");
const { check, validationResult } = require('express-validator');

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await Users.findOne({ where: { username: username } });
  if(!user) {
    await bcrypt.hash(password, 10).then((hash) => {
       Users.create({
        username: username,
        password: hash,
      });
      return res.json("success");
    });
  }
  return alert("username already exists")
  });

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({ error: "user doesn't exist" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match)
      return res.json({ error: "wrong username and password combination" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.json({ token: accessToken, username: username, id: user.id });
  });
});
router.get("/auth", validateToken, (req, res) => {
 return res.json(req.user);
});
module.exports = router;
