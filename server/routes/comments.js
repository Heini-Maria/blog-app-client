const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator/check");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  return res.json(comments);
});

router.post(
  "/",
  validateToken,
  [check("comment").isLength({ min: 3, max: 45 }).escape()],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const comment = req.body;
      const username = req.user.username;
      comment.username = username;
      await Comments.create(comment);
      return res.json(comment);
    }
    console.log(res.status(400).json({ errors: errors.array() }));
  }
);

module.exports = router;
