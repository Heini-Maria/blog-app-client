const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models");
const { validateToken } = require("../middleware/authMiddleware");
const { check, validationResult } = require('express-validator');

router.get("/", validateToken, async (res) => {
  const listOfPosts = await Posts.findAll({
    include: [Likes, Comments],
    order: [["updatedAt", "DESC"]],
  });
  
  return res.json({ listOfPosts: listOfPosts });
});
router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id, { include: [Likes] });
  return res.json(post);
});

router.post(
  "/",
  validateToken,
  [
    check("title").isLength({ min: 3, max: 60 }).escape(),
    check("post").isLength({ min: 10, max: 300 }).escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const post = req.body;
      post.username = req.user.username;
      await Posts.create(post);
      return res.json(post);
    }
    console.log(res.status(400).json({ errors: errors.array() }));
  }
);
router.put(
  "/:postId",
  validateToken,
  [
    check("title").isLength({ min: 3, max: 60 }).escape(),
    check("post").isLength({ min: 10, max: 300 }).escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const postId = req.params.postId;
      const finalpost = req.body;
      finalpost.username = req.user.username;
      await Posts.update(finalpost, { where: { id: postId } });
      return res.json(finalpost);
    }
    console.log(res.status(400).json({ errors: errors.array() }));
  }
);

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;

  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  return res.json("Deleted Successfully");
});

module.exports = router;
